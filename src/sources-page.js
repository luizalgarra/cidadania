import { COMMITMENTS, SOURCE_CONTEXT, THEMES, publicSourcesFor } from './commitments.js';
import {
  SOROCABA,
  SOROCABA_ELDERLY_AUTONOMY_PROFILE,
  SOROCABA_ELDERLY_PROFILE,
  elderlyAutonomyFor,
  elderlyPopulationFor,
  indicatorsForCommitment
} from './sorocaba-data.js';
import { autonomyChartRows, formatAutonomyMetric } from './elderly-autonomy.js';
import { elderlyChartRows, formatElderlyMetric } from './elderly-explorer.js';
import { buildSorocabaElderlyQuery } from './sorocaba-query.js';
import { renderSourcesCatalogue } from './view-helpers.js';

const catalogue = document.querySelector('#sources-catalogue');
const searchInput = document.querySelector('#sources-search');
const themeFilter = document.querySelector('#sources-theme-filter');
const localDataSelect = document.querySelector('#sorocaba-commitment-select');
const resultCount = document.querySelector('#sources-result-count');
const emptyState = document.querySelector('#sources-empty');
const elderlyAgeFilter = document.querySelector('#elderly-age-filter');
const elderlySexFilter = document.querySelector('#elderly-sex-filter');
const elderlyResultContext = document.querySelector('#elderly-result-context');
const elderlyResultValue = document.querySelector('#elderly-result-value');
const elderlyResultShare = document.querySelector('#elderly-result-share');
const elderlyAgeChart = document.querySelector('#elderly-age-chart');
const elderlyBigQueryCode = document.querySelector('#elderly-bigquery-code');
const autonomyAgeFilter = document.querySelector('#autonomy-age-filter');
const autonomySexFilter = document.querySelector('#autonomy-sex-filter');
const autonomyResultContext = document.querySelector('#autonomy-result-context');
const autonomyMedianValue = document.querySelector('#autonomy-median-value');
const autonomyMeanValue = document.querySelector('#autonomy-mean-value');
const autonomyPeopleValue = document.querySelector('#autonomy-people-value');
const autonomyAgeChart = document.querySelector('#autonomy-age-chart');

if (elderlyBigQueryCode) {
  elderlyBigQueryCode.textContent = buildSorocabaElderlyQuery();
}

catalogue.innerHTML = renderSourcesCatalogue({
  commitments: COMMITMENTS,
  themes: THEMES,
  publicSourcesFor,
  territory: SOROCABA,
  indicatorsForCommitment
});

for (const theme of THEMES) {
  const option = document.createElement('option');
  option.value = theme.id;
  option.textContent = theme.title;
  themeFilter.append(option);
}

function normalizeSearch(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
    .trim();
}

function updateCatalogue() {
  const query = normalizeSearch(searchInput.value);
  const selectedTheme = themeFilter.value;
  const selectedLocalCommitment = localDataSelect?.value ?? '';
  let visibleCount = 0;

  for (const section of catalogue.querySelectorAll('[data-theme-section]')) {
    const inSelectedTheme = selectedTheme === 'all' || section.dataset.themeSection === selectedTheme;
    let visibleInSection = 0;

    for (const card of section.querySelectorAll('[data-commitment-id]')) {
      const matchesQuery = normalizeSearch(card.dataset.searchText).includes(query);
      const matchesLocalSelection = !selectedLocalCommitment
        || selectedLocalCommitment === 'all'
        || card.dataset.commitmentId === selectedLocalCommitment;
      const visible = inSelectedTheme && matchesQuery && matchesLocalSelection;
      card.hidden = !visible;
      if (visible) {
        visibleCount += 1;
        visibleInSection += 1;
      }
    }

    section.hidden = visibleInSection === 0;
  }

  resultCount.textContent = `${visibleCount} ${visibleCount === 1 ? 'compromisso encontrado' : 'compromissos encontrados'}`;
  emptyState.hidden = visibleCount !== 0;
}

function clearLocalSelection() {
  if (localDataSelect) localDataSelect.value = '';
}

function renderElderlyChart() {
  if (!elderlyAgeChart || !elderlySexFilter || !elderlyAgeFilter) return;
  const rows = elderlyChartRows({
    profile: SOROCABA_ELDERLY_PROFILE,
    sex: elderlySexFilter.value,
    activeAgeBand: elderlyAgeFilter.value
  });

  const elements = rows.map((row) => {
    const item = document.createElement('li');
    item.className = 'elderly-ruler__row';
    item.dataset.ageBand = row.id;

    const button = document.createElement('button');
    button.type = 'button';
    button.ariaLabel = `Mostrar ${row.label} anos`;
    button.setAttribute('aria-pressed', String(row.active));

    const label = document.createElement('span');
    label.textContent = row.label;
    const track = document.createElement('i');
    const bar = document.createElement('b');
    bar.style.width = `${row.widthPercent}%`;
    track.append(bar);
    const value = document.createElement('strong');
    value.textContent = row.formattedValue;

    button.append(label, track, value);
    button.addEventListener('click', () => {
      elderlyAgeFilter.value = row.id;
      updateElderlyExplorer();
    });
    item.append(button);
    return item;
  });

  elderlyAgeChart.replaceChildren(...elements);
}

function updateElderlyExplorer() {
  if (!elderlyAgeFilter || !elderlySexFilter) return;
  const metric = elderlyPopulationFor({
    ageBand: elderlyAgeFilter.value,
    sex: elderlySexFilter.value
  });
  const formatted = formatElderlyMetric(metric);

  elderlyResultContext.textContent = formatted.context;
  elderlyResultValue.textContent = formatted.value;
  elderlyResultShare.textContent = formatted.share;
  renderElderlyChart();
}

function renderAutonomyChart() {
  if (!autonomyAgeChart || !autonomySexFilter || !autonomyAgeFilter) return;
  const rows = autonomyChartRows({
    profile: SOROCABA_ELDERLY_AUTONOMY_PROFILE,
    sex: autonomySexFilter.value,
    activeAgeBand: autonomyAgeFilter.value
  });

  const elements = rows.map((row) => {
    const item = document.createElement('li');
    item.className = 'autonomy-ledger__row';
    item.dataset.ageBand = row.id;

    const button = document.createElement('button');
    button.type = 'button';
    button.ariaLabel = `Mostrar renda mediana de ${row.label} anos`;
    button.setAttribute('aria-pressed', String(row.active));

    const label = document.createElement('span');
    label.textContent = row.label;
    const track = document.createElement('i');
    const bar = document.createElement('b');
    bar.style.width = `${row.widthPercent}%`;
    track.append(bar);
    const value = document.createElement('strong');
    value.textContent = row.formattedValue;

    button.append(label, track, value);
    button.addEventListener('click', () => {
      autonomyAgeFilter.value = row.id;
      updateAutonomyExplorer();
    });
    item.append(button);
    return item;
  });

  autonomyAgeChart.replaceChildren(...elements);
}

function updateAutonomyExplorer() {
  if (!autonomyAgeFilter || !autonomySexFilter) return;
  const metric = elderlyAutonomyFor({
    ageBand: autonomyAgeFilter.value,
    sex: autonomySexFilter.value
  });
  const formatted = formatAutonomyMetric(metric);

  autonomyResultContext.textContent = formatted.context;
  autonomyMedianValue.textContent = formatted.median;
  autonomyMeanValue.textContent = formatted.mean;
  autonomyPeopleValue.textContent = formatted.people;
  renderAutonomyChart();
}

searchInput.addEventListener('input', () => {
  clearLocalSelection();
  updateCatalogue();
});
themeFilter.addEventListener('change', () => {
  clearLocalSelection();
  updateCatalogue();
});
localDataSelect?.addEventListener('change', () => {
  searchInput.value = '';
  themeFilter.value = 'all';
  updateCatalogue();

  if (localDataSelect.value === 'all') {
    catalogue.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  const selectedCard = catalogue.querySelector(`[data-commitment-id="${localDataSelect.value}"]`);
  if (!selectedCard) return;
  const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
  selectedCard.scrollIntoView({ behavior, block: 'start' });
  selectedCard.focus({ preventScroll: true });
});

elderlyAgeFilter?.addEventListener('change', updateElderlyExplorer);
elderlySexFilter?.addEventListener('change', updateElderlyExplorer);
autonomyAgeFilter?.addEventListener('change', updateAutonomyExplorer);
autonomySexFilter?.addEventListener('change', updateAutonomyExplorer);
updateElderlyExplorer();
updateAutonomyExplorer();

document.querySelector('.sources-hero__lede').setAttribute(
  'data-source-context',
  SOURCE_CONTEXT.context
);
