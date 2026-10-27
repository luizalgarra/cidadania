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
