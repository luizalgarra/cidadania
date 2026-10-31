const MONTHS_PT_BR = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
];

const COMMITMENT_KIND_LABELS = {
  operational: 'Medida descrita de forma concreta no discurso.',
  programmatic: 'Direção de governo sem execução completa definida no discurso.',
  aspirational: 'Aspiração ampla sem indicador completo definido no discurso.'
};

export function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export function formatDatePtBr(isoDate) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(isoDate));
  if (!match) return String(isoDate ?? '');
  const [, year, month, day] = match;
  const monthName = MONTHS_PT_BR[Number(month) - 1];
  if (!monthName) return String(isoDate);
  return `${Number(day)} de ${monthName} de ${year}`;
}

export function commitmentKindLabel(kind) {
  return COMMITMENT_KIND_LABELS[kind] ?? 'Classificação editorial não informada.';
}

export function sourceAttributionLabel(sourceContext, { fullName = false } = {}) {
  const speaker = fullName
    ? sourceContext?.speaker
    : (sourceContext?.shortName || sourceContext?.speaker);
  const event = sourceContext?.event;
  const dateLabel = sourceContext?.dateLabel;
  if (!speaker || !event || !dateLabel) return '';
  return `Compromissos apresentados por ${speaker} em seu ${event}, em ${dateLabel}.`;
}

export function renderLocalSnapshot({ territory, indicators = [] } = {}) {
  if (!territory?.name || indicators.length === 0) return '';

  const cards = indicators.map((indicator) => {
    const source = indicator.source ?? {};
    const illustration = indicator.illustration?.src && indicator.illustration?.alt
      ? `
        <figure class="local-indicator-card__illustration">
          <img src="${escapeHtml(indicator.illustration.src)}" alt="${escapeHtml(indicator.illustration.alt)}" width="1200" height="800" loading="lazy" decoding="async">
        </figure>
      `
      : '';
    const originalLink = source.originalUrl
      ? `<a href="${escapeHtml(source.originalUrl)}" target="_blank" rel="noopener noreferrer">Fonte original: ${escapeHtml(source.originalOrganization)} ↗</a>`
      : `<span>Fonte original: ${escapeHtml(source.originalOrganization)}</span>`;
    const treatmentLink = source.datasetUrl
      ? `<a href="${escapeHtml(source.datasetUrl)}" target="_blank" rel="noopener noreferrer">Tratamento: ${escapeHtml(source.treatmentOrganization)} ↗</a>`
      : `<span>Tratamento: ${escapeHtml(source.treatmentOrganization)}</span>`;

    return `
      <article class="local-indicator-card">
        ${illustration}
        <div class="local-indicator-card__heading">
          <span>${escapeHtml(indicator.relationLabel)}</span>
          <h4>${escapeHtml(indicator.title)}</h4>
        </div>
        <p class="local-indicator-card__value">${escapeHtml(indicator.displayValue)}</p>
        ${indicator.supportingValue ? `<p class="local-indicator-card__supporting">${escapeHtml(indicator.supportingValue)}</p>` : ''}
        <dl class="local-indicator-card__metadata">
          <div aria-label="Período: ${escapeHtml(indicator.referencePeriod)}"><dt>Período</dt><dd>${escapeHtml(indicator.referencePeriod)}</dd></div>
          <div><dt>Território</dt><dd>${escapeHtml(territory.name)} · código IBGE ${escapeHtml(territory.ibgeCode)}</dd></div>
        </dl>
        <details>
          <summary>Como ler este dado</summary>
          <p><strong>Método:</strong> ${escapeHtml(indicator.methodology)}</p>
          <p><strong>Limite:</strong> ${escapeHtml(indicator.caveat)}</p>
        </details>
        <p class="local-indicator-card__sources">${originalLink}${treatmentLink}</p>
      </article>
    `;
  }).join('');

  return `
    <aside class="local-snapshot" aria-label="Retrato de ${escapeHtml(territory.name)}">
      <p class="source-label">Dados do território</p>
      <h3>Retrato de ${escapeHtml(territory.name)}</h3>
      <p>Estes dados ajudam a compreender o ponto de partida local. Um indicador municipal não prova, isoladamente, o cumprimento do compromisso nacional nem permite atribuir mudanças a um governo.</p>
      <div class="local-snapshot__grid">${cards}</div>
    </aside>
  `;
}

export function renderCommitmentLocalSnapshot({
  commitmentId,
  territory,
  indicatorsForCommitment = () => []
} = {}) {
  if (!commitmentId) return '';
  return renderLocalSnapshot({
    territory,
    indicators: indicatorsForCommitment(commitmentId)
  });
}

export function renderSourcesCatalogue({
  commitments,
  themes,
  publicSourcesFor,
  territory,
  indicatorsForCommitment = () => []
}) {
  return themes.map((theme) => {
    const themeCommitments = commitments.filter((commitment) => commitment.themeId === theme.id);
    const cards = themeCommitments.map((commitment) => {
      const sources = publicSourcesFor(commitment.id);
      const indicators = indicatorsForCommitment(commitment.id);
      const searchText = [
        commitment.title,
        commitment.summary,
        theme.title,
        ...(indicators.length > 0 ? [territory?.name] : []),
        ...indicators.flatMap((indicator) => [
          indicator.title,
          indicator.displayValue,
          indicator.supportingValue,
          indicator.relationLabel
        ]),
        ...sources.flatMap((source) => [source.title, source.description])
      ].join(' ').toLocaleLowerCase('pt-BR');
      const sourceItems = sources.map((source) => `
        <li>
          <a class="catalogue-source-link" href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer">
            <span>${escapeHtml(source.title)}</span><span aria-hidden="true">↗</span>
          </a>
          <p>${escapeHtml(source.description)}</p>
        </li>
      `).join('');

      return `
        <article id="compromisso-${escapeHtml(commitment.id)}" class="source-catalogue-card" data-commitment-id="${escapeHtml(commitment.id)}" data-search-text="${escapeHtml(searchText)}" tabindex="-1">
          <div class="source-catalogue-card__heading">
            <h3>${escapeHtml(commitment.title)}</h3>
            <span>${sources.length} fontes</span>
          </div>
          <p class="source-catalogue-card__summary">${escapeHtml(commitment.summary)}</p>
          <blockquote>${escapeHtml(commitment.excerpt)}</blockquote>
          ${renderLocalSnapshot({ territory, indicators })}
          <div class="source-catalogue-card__sources">
            <h4>Fontes públicas para acompanhar</h4>
            <ul>${sourceItems}</ul>
          </div>
        </article>
      `;
    }).join('');

    return `
      <section class="source-theme-section" data-theme-section="${escapeHtml(theme.id)}" aria-labelledby="theme-${escapeHtml(theme.id)}">
        <header class="source-theme-section__header">
          <p>${themeCommitments.length} ${themeCommitments.length === 1 ? 'compromisso' : 'compromissos'}</p>
          <h2 id="theme-${escapeHtml(theme.id)}">${escapeHtml(theme.title)}</h2>
          <span>${escapeHtml(theme.description)}</span>
        </header>
        <div class="source-catalogue-grid">${cards}</div>
      </section>
    `;
  }).join('');
}

export function formatPlanAsText({
  plan,
  commitment,
  sourceContext,
  publicSources = [],
  localTerritory,
  localIndicators = []
}) {
  if (!plan || !commitment) return '';
  const origin = sourceContext?.speaker && sourceContext?.event && sourceContext?.dateLabel
    ? `compromisso apresentado por ${sourceContext.speaker} em seu ${sourceContext.event}, em ${sourceContext.dateLabel}.`
    : sourceAttributionLabel(sourceContext, { fullName: true });
  const sourceLines = publicSources.flatMap((source) => [
    `${source.title} — ${source.description}`,
    source.url
  ]);
  const localLines = localIndicators.flatMap((indicator) => [
    `${indicator.title}: ${indicator.displayValue}${indicator.supportingValue ? ` · ${indicator.supportingValue}` : ''}`,
    `Relação com o compromisso: ${indicator.relationLabel}`,
    `Período: ${indicator.referencePeriod}`,
    `Como ler: ${indicator.caveat}`,
    indicator.source?.originalUrl ? `Fonte original: ${indicator.source.originalUrl}` : '',
    indicator.source?.datasetUrl ? `Base dos Dados: ${indicator.source.datasetUrl}` : ''
  ].filter(Boolean));
  return [
    'COMPROMISSO EM AÇÃO',
    '',
    `Origem deste plano: ${origin}`,
    `Compromisso: ${commitment.title}`,
    `Trecho do discurso: ${commitment.excerpt}`,
    'As ações concretas deste plano foram definidas por você; não são citações nem instruções diretas de Lula.',
    sourceContext?.sourceUrl ? `Fonte pública: ${sourceContext.sourceUrl}` : '',
    sourceContext?.provenance ?? '',
    '',
    `Rota: ${plan.routeTitle}`,
    `Prazo: ${formatDatePtBr(plan.targetDate)}`,
    `Território: ${plan.territory}`,
    `Tempo disponível: ${plan.availableTime}`,
    '',
    `Resultado buscado: ${plan.desiredResult}`,
    `Primeiro passo: ${plan.firstAction}`,
    plan.partner ? `Parceria possível: ${plan.partner}` : '',
    `Indicador: ${plan.indicator}`,
    plan.caution ? `Cuidado: ${plan.caution}` : '',
    '',
    `Ação cidadã: ${plan.citizenBoundary}`,
    `Responsabilidade pública: ${plan.publicResponsibility}`,
    '',
    ...(localLines.length > 0 ? [
      `RETRATO DE ${String(localTerritory?.name ?? 'SOROCABA').toLocaleUpperCase('pt-BR')}`,
      ...localLines,
      'Este dado descreve uma dimensão da realidade local. Ele não prova, isoladamente, o cumprimento do compromisso nacional nem permite atribuir mudanças a um governo.',
      ''
    ] : []),
    ...(sourceLines.length > 0 ? ['ONDE SE INFORMAR E ACOMPANHAR', ...sourceLines, ''] : []),
    'Revisão: daqui a 7 dias.'
  ].filter((line, index, lines) => line !== '' || lines[index - 1] !== '').join('\n');
}

export function deriveStartDateFromTarget(targetDate, days = 30) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(targetDate));
  if (!match || !Number.isInteger(days) || days < 0) return '';
  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const target = new Date(Date.UTC(year, month - 1, day));
  if (
    target.getUTCFullYear() !== year
    || target.getUTCMonth() !== month - 1
    || target.getUTCDate() !== day
  ) return '';
  target.setUTCDate(target.getUTCDate() - days);
  return target.toISOString().slice(0, 10);
}

function addDaysAsIso(now, days) {
  const target = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + days
  );
  const year = target.getFullYear();
  const month = String(target.getMonth() + 1).padStart(2, '0');
  const day = String(target.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function localDateAsIso(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function subject(commitment) {
  const title = typeof commitment?.title === 'string' ? commitment.title.trim() : '';
  return title ? title.charAt(0).toLocaleLowerCase('pt-BR') + title.slice(1) : 'este compromisso';
}

const ROUTE_DEFAULTS = {
  'conhecer-mapear': (topic) => ({
    result: `compreender uma necessidade concreta ligada a ${topic}`,
    firstAction: `ouvir uma pessoa afetada e localizar uma fonte confiável sobre ${topic}`,
    indicator: 'uma necessidade descrita com evidências e sem expor dados pessoais'
  }),
  'ajudar-diretamente': (topic) => ({
    result: `apoiar uma iniciativa confiável ligada a ${topic}`,
    firstAction: `localizar uma organização ou serviço que já atue com ${topic}`,
    indicator: 'um contato realizado e uma forma segura de apoio definida'
  }),
  'mobilizar-pessoas': (topic) => ({
    result: `reunir pessoas interessadas em ${topic}`,
    firstAction: `convidar duas pessoas para uma conversa objetiva sobre ${topic}`,
    indicator: 'uma conversa realizada e um próximo passo coletivo registrado'
  }),
  'acompanhar-cobrar': (topic) => ({
    result: `acompanhar uma entrega concreta ligada a ${topic}`,
    firstAction: `identificar o órgão responsável e formular uma pergunta objetiva sobre ${topic}`,
    indicator: 'uma resposta oficial ou atualização verificável registrada'
  })
};

export function createPlanDefaults(commitment, routeId, now = new Date()) {
  const topic = subject(commitment);
  const routeDefaults = (ROUTE_DEFAULTS[routeId] ?? ROUTE_DEFAULTS['conhecer-mapear'])(topic);
  return {
    startDate: localDateAsIso(now),
    territory: 'meu bairro ou comunidade',
    availableTime: '2 horas por mês',
    ...routeDefaults,
    partner: '',
    targetDate: addDaysAsIso(now, 30)
  };
}
