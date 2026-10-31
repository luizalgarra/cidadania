import { COMMITMENTS, SOURCE_CONTEXT, THEMES, publicSourcesFor } from './commitments.js';
import { renderSourcesCatalogue } from './view-helpers.js';

const catalogue = document.querySelector('#sources-catalogue');
const searchInput = document.querySelector('#sources-search');
const themeFilter = document.querySelector('#sources-theme-filter');
const resultCount = document.querySelector('#sources-result-count');
const emptyState = document.querySelector('#sources-empty');

catalogue.innerHTML = renderSourcesCatalogue({
  commitments: COMMITMENTS,
  themes: THEMES,
  publicSourcesFor
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
  let visibleCount = 0;

  for (const section of catalogue.querySelectorAll('[data-theme-section]')) {
    const inSelectedTheme = selectedTheme === 'all' || section.dataset.themeSection === selectedTheme;
    let visibleInSection = 0;

    for (const card of section.querySelectorAll('[data-commitment-id]')) {
      const matchesQuery = normalizeSearch(card.dataset.searchText).includes(query);
      const visible = inSelectedTheme && matchesQuery;
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

searchInput.addEventListener('input', updateCatalogue);
themeFilter.addEventListener('change', updateCatalogue);

document.querySelector('.sources-hero__lede').setAttribute(
  'data-source-context',
  SOURCE_CONTEXT.context
);
