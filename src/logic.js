import { COMMITMENTS } from './commitments.js';

const RATING_FIELDS = ['interest', 'relevance', 'efficacy', 'willingness'];

function knownLikert(value) {
  return Number.isInteger(value) && value >= 1 && value <= 5 ? value : null;
}

function average(values) {
  const known = values.map(knownLikert).filter((value) => value !== null);
  if (known.length === 0) return null;
  return known.reduce((sum, value) => sum + value, 0) / known.length;
}

function scoresFor(rating = {}) {
  const meaningScore = average([rating.interest, rating.relevance]);
  const readinessScore = average([rating.efficacy, rating.willingness]);
  const knownCount = RATING_FIELDS
    .map((field) => knownLikert(rating[field]))
    .filter((value) => value !== null)
    .length;
  const informationComplete = knownCount === RATING_FIELDS.length;
  const score = meaningScore !== null && readinessScore !== null
    ? (meaningScore + readinessScore) / 2
    : null;

  return { meaningScore, readinessScore, score, knownCount, informationComplete };
}

export function getThemeCommitments(themeIds) {
  if (!Array.isArray(themeIds) || themeIds.length === 0) return [];
  if (themeIds.includes('all')) return [...COMMITMENTS];

  const selected = new Set(themeIds);
  return COMMITMENTS.filter((commitment) => selected.has(commitment.themeId));
}

export function selectCandidates(reactions = {}, commitments = [], limit = 4) {
  const maximum = Number.isFinite(limit) ? Math.max(0, Math.floor(limit)) : 4;
  const selected = [];
  const seen = new Set();

  for (const reaction of ['explore', 'maybe']) {
    for (const commitment of commitments) {
      if (
        seen.has(commitment.id)
        || reactions[commitment.id] !== reaction
      ) continue;

      selected.push(commitment);
      seen.add(commitment.id);
    }
  }

  if (selected.length > maximum) {
    throw new RangeError(
      `Positive reactions exceed the limit of ${maximum}; the UI must request an explicit tiebreak.`
    );
  }

  return selected;
}

export function rankCommitments(ratings = {}, commitments = []) {
  return commitments
    .map((commitment, editorialIndex) => {
      const rating = ratings[commitment.id] ?? {};
      return {
        ...commitment,
        rating: Object.fromEntries(
          RATING_FIELDS.map((field) => [field, rating[field] ?? null])
        ),
        ...scoresFor(rating),
        editorialIndex
      };
    })
    .sort((a, b) => {
      if (a.informationComplete !== b.informationComplete) {
        return a.informationComplete ? -1 : 1;
      }
      if (!a.informationComplete) {
        return (
          b.knownCount - a.knownCount
          || (b.score ?? -Infinity) - (a.score ?? -Infinity)
          || (b.meaningScore ?? -Infinity) - (a.meaningScore ?? -Infinity)
          || (b.readinessScore ?? -Infinity) - (a.readinessScore ?? -Infinity)
          || a.editorialIndex - b.editorialIndex
        );
      }
      return (
        b.score - a.score
        || b.meaningScore - a.meaningScore
        || b.readinessScore - a.readinessScore
        || a.editorialIndex - b.editorialIndex
      );
    })
    .map(({ editorialIndex, ...commitment }) => commitment);
}

export function explainRanking(rating = {}) {
  const { meaningScore, readinessScore, informationComplete } = scoresFor(rating);

  if (meaningScore === null && readinessScore === null) {
    return 'Você ainda tem dúvidas sobre este compromisso; compare-o com os demais antes de escolher.';
  }
  if (meaningScore === null) {
    return 'Você indicou possibilidade de agir, mas ainda não informou quanto este compromisso importa.';
  }
  if (readinessScore === null) {
    return 'Você indicou a importância deste compromisso, mas ainda não informou sua possibilidade de agir.';
  }
  if (!informationComplete) {
    return 'Há informação insuficiente em uma ou mais respostas; compare este caminho com cautela antes de escolher.';
  }
  if (meaningScore >= 4 && readinessScore >= 4) {
    return 'Você indicou alta importância e alta possibilidade de agir nos próximos 30 dias.';
  }
  if (meaningScore >= 4 && readinessScore < 3) {
    return 'Você indicou alta importância, mas pode precisar de apoio para começar.';
  }
  if (meaningScore < 3 && readinessScore >= 4) {
    return 'Você vê um caminho possível para agir, embora o tema não esteja entre suas maiores prioridades.';
  }
  return 'Suas respostas colocam este compromisso entre os caminhos que vale comparar.';
}

function requiredText(value, field) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new TypeError(`${field} must be a non-empty string`);
  }
  return value.trim();
}

function optionalText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;

function isoDate(value, field) {
  const text = requiredText(value, field);
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text);
  if (!match) {
    throw new RangeError(`${field} must be a real ISO date in YYYY-MM-DD format`);
  }

  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const date = new Date(0);
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCFullYear(year, month - 1, day);

  if (
    date.getUTCFullYear() !== year
    || date.getUTCMonth() !== month - 1
    || date.getUTCDate() !== day
  ) {
    throw new RangeError(`${field} must be a real ISO date in YYYY-MM-DD format`);
  }

  return { text, milliseconds: date.getTime() };
}

export function buildPlan(input, commitment, route) {
  const commitmentId = requiredText(commitment?.id, 'commitment.id');
  const commitmentTitle = requiredText(commitment?.title, 'commitment.title');
  const routeId = requiredText(route?.id, 'route.id');
  const routeTitle = requiredText(route?.title, 'route.title');
  const target = isoDate(input?.targetDate, 'targetDate');
  const rawStartDate = optionalText(input?.startDate);
  const start = rawStartDate ? isoDate(rawStartDate, 'startDate') : null;
  const horizonDays = start
    ? (target.milliseconds - start.milliseconds) / DAY_IN_MILLISECONDS
    : 30;
  if (start && horizonDays !== 30) {
    throw new RangeError('targetDate must be exactly 30 days after startDate');
  }
  const targetDate = target.text;
  const territory = requiredText(input?.territory, 'territory');
  const availableTime = requiredText(input?.availableTime, 'availableTime');
  const desiredResult = requiredText(input?.result, 'result');
  const firstAction = requiredText(input?.firstAction, 'firstAction');
  const indicator = requiredText(input?.indicator, 'indicator');
  const citizenBoundary = requiredText(
    commitment?.responsibility?.citizen,
    'commitment.responsibility.citizen'
  );
  const publicResponsibility = requiredText(
    commitment?.responsibility?.state,
    'commitment.responsibility.state'
  );
  const partner = optionalText(input?.partner);
  const caution = optionalText(input?.caution);

  return {
    commitmentId,
    commitmentTitle,
    routeId,
    routeTitle,
    horizonDays,
    ...(start ? { startDate: start.text } : {}),
    targetDate,
    territory,
    availableTime,
    desiredResult,
    firstAction,
    partner,
    indicator,
    caution,
    citizenBoundary,
    publicResponsibility,
    statement: `Até ${targetDate}, vou ${firstAction} em ${territory}. Saberei que avancei quando ${indicator}.`,
    reviewAfterDays: 7
  };
}
