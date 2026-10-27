export const STEPS = Object.freeze([
  'welcome',
  'themes',
  'reactions',
  'ratings',
  'finalists',
  'reflection',
  'route',
  'plan',
  'complete'
]);

const RATING_DIMENSIONS = Object.freeze([
  'interest',
  'relevance',
  'efficacy',
  'willingness'
]);

const REACTIONS = new Set(['explore', 'maybe', 'not-now', 'unknown']);

const emptyReflections = () => ({
  affected: '',
  change: '',
  roles: '',
  caution: ''
});

const emptyPlanInput = () => ({
  startDate: '',
  territory: '',
  availableTime: '',
  result: '',
  firstAction: '',
  partner: '',
  indicator: '',
  targetDate: ''
});

export function createInitialState() {
  return {
    version: 1,
    step: 'welcome',
    selectedThemes: [],
    reactions: {},
    ratings: {},
    candidates: [],
    rankedCandidates: [],
    selectedCommitmentId: null,
    reflections: emptyReflections(),
    selectedRouteId: null,
    planInput: emptyPlanInput(),
    plan: null,
    reviewDone: false
  };
}

export function getNextStep(step) {
  const index = STEPS.indexOf(step);
  if (index < 0 || index === STEPS.length - 1) return index < 0 ? 'welcome' : step;
  return STEPS[index + 1];
}

export function getPreviousStep(step) {
  const index = STEPS.indexOf(step);
  if (index <= 0) return 'welcome';
  return STEPS[index - 1];
}

function hasText(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isAnsweredRating(value) {
  return value === null || (Number.isInteger(value) && value >= 1 && value <= 5);
}

function candidateIsRated(ratings, id) {
  const rating = ratings?.[id];
  return isRecord(rating)
    && RATING_DIMENSIONS.every((dimension) => (
      Object.hasOwn(rating, dimension) && isAnsweredRating(rating[dimension])
    ));
}

export function canContinue(state) {
  switch (state?.step) {
    case 'welcome':
      return true;
    case 'themes':
      return Array.isArray(state.selectedThemes)
        && state.selectedThemes.length >= 1
        && state.selectedThemes.length <= 3;
    case 'reactions':
      return Object.values(state.reactions ?? {}).some((value) => (
        value === 'explore' || value === 'maybe'
      ));
    case 'ratings':
      return Array.isArray(state.candidates)
        && state.candidates.length > 0
        && state.candidates.every((id) => candidateIsRated(state.ratings, id));
    case 'finalists':
      return hasText(state.selectedCommitmentId);
    case 'reflection':
      return hasText(state.reflections?.affected) && hasText(state.reflections?.change);
    case 'route':
      return hasText(state.selectedRouteId);
    case 'plan': {
      const plan = state.planInput ?? {};
      return ['startDate', 'territory', 'availableTime', 'result', 'firstAction', 'indicator', 'targetDate']
        .every((key) => hasText(plan[key]));
    }
    case 'complete':
      return true;
    default:
      return false;
  }
}

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function cleanStringRecord(value, allowedValues = null) {
  if (!isRecord(value)) return {};
  return Object.fromEntries(
    Object.entries(value).filter(([key, item]) => (
      typeof key === 'string'
      && typeof item === 'string'
      && (!allowedValues || allowedValues.has(item))
    ))
  );
}

function cleanRatings(value) {
  if (!isRecord(value)) return {};
  const ratings = {};
  for (const [id, rating] of Object.entries(value)) {
    if (!isRecord(rating)) continue;
    const cleaned = {};
    for (const dimension of RATING_DIMENSIONS) {
      if (Object.hasOwn(rating, dimension) && isAnsweredRating(rating[dimension])) {
        cleaned[dimension] = rating[dimension];
      }
    }
    ratings[id] = cleaned;
  }
  return ratings;
}

function cleanStringFields(value, defaults) {
  const source = isRecord(value) ? value : {};
  return Object.fromEntries(
    Object.keys(defaults).map((key) => [key, typeof source[key] === 'string' ? source[key] : ''])
  );
}

export function sanitizeRestoredState(value) {
  const defaults = createInitialState();
  if (!isRecord(value)) return defaults;

  const step = STEPS.includes(value.step) ? value.step : defaults.step;
  const selectedThemes = Array.isArray(value.selectedThemes)
    ? [...new Set(value.selectedThemes.filter((item) => typeof item === 'string'))].slice(0, 3)
    : [];
  const candidates = Array.isArray(value.candidates)
    ? [...new Set(value.candidates.filter((item) => typeof item === 'string'))].slice(0, 4)
    : [];
  const rankedCandidates = Array.isArray(value.rankedCandidates)
    ? value.rankedCandidates.filter((item) => isRecord(item) && typeof item.id === 'string').slice(0, 4)
    : [];

  return {
    ...defaults,
    step,
    selectedThemes,
    reactions: cleanStringRecord(value.reactions, REACTIONS),
    ratings: cleanRatings(value.ratings),
    candidates,
    rankedCandidates,
    selectedCommitmentId: typeof value.selectedCommitmentId === 'string'
      ? value.selectedCommitmentId
      : null,
    reflections: cleanStringFields(value.reflections, defaults.reflections),
    selectedRouteId: typeof value.selectedRouteId === 'string' ? value.selectedRouteId : null,
    planInput: cleanStringFields(value.planInput, defaults.planInput),
    plan: isRecord(value.plan) ? value.plan : null,
    reviewDone: value.reviewDone === true
  };
}
