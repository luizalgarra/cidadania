import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { COMMITMENTS, THEMES, publicSourcesFor } from '../src/commitments.js';
import { SOROCABA, indicatorsForCommitment } from '../src/sorocaba-data.js';
import * as viewHelpers from '../src/view-helpers.js';

const sourcesPageHtml = readFileSync(new URL('../src/fontes.html', import.meta.url), 'utf8');

test('emits a BigQuery query that sums both age-declaration forms available for Sorocaba', async () => {
  const queryModule = await import('../src/sorocaba-query.js').catch(() => ({}));

  assert.equal(typeof queryModule.buildSorocabaElderlyQuery, 'function');
  if (typeof queryModule.buildSorocabaElderlyQuery !== 'function') return;

  const query = queryModule.buildSorocabaElderlyQuery();
  assert.match(query, /id_municipio\s*=\s*'3552205'/);
  assert.match(query, /idade_anos\s*>=\s*60/);
  assert.match(query, /SUM\(populacao\)/);
  assert.doesNotMatch(query, /forma_declaracao_idade\s*=\s*'Total'/);
  assert.doesNotMatch(query, /sexo\s*=\s*'Total'/);
});

test('offers a direct selector for the two commitments with Sorocaba data', () => {
  assert.match(sourcesPageHtml, /id="sorocaba-commitment-select"/);
  assert.match(sourcesPageHtml, /value="cuidado-pessoa-idosa">Cuidado com pessoas idosas<\/option>/);
  assert.match(sourcesPageHtml, /value="educacao-tempo-integral">Educação em tempo integral<\/option>/);
  assert.match(sourcesPageHtml, /value="all">Ver todos os compromissos<\/option>/);
});

test('offers a simple elderly-data search with reproducible BigQuery access', () => {
  assert.match(sourcesPageHtml, /id="elderly-explorer"/);
  assert.match(sourcesPageHtml, /id="elderly-age-filter"/);
  assert.match(sourcesPageHtml, /id="elderly-sex-filter"/);
  assert.match(sourcesPageHtml, /id="elderly-result-value"/);
  assert.match(
    sourcesPageHtml,
    /basedosdados\.br_ibge_censo_2022\.populacao_idade_sexo/
  );
  assert.match(sourcesPageHtml, /Consultar com Python/);
  assert.match(sourcesPageHtml, /Consultar com R/);
});

test('adds separate, sourced views for urban accessibility, health and social protection', () => {
  assert.match(sourcesPageHtml, /id="elderly-accessibility"/);
  assert.match(sourcesPageHtml, /id="accessibility-age-filter"/);
  assert.match(sourcesPageHtml, /id="accessibility-result-value"/);
  assert.match(sourcesPageHtml, /SIDRA 6591/);
  assert.match(sourcesPageHtml, /id="elderly-health"/);
  assert.match(sourcesPageHtml, /21,89/);
  assert.match(sourcesPageHtml, /id="elderly-protection"/);
  assert.match(sourcesPageHtml, /3\.890/);
  assert.match(sourcesPageHtml, /universos diferentes/i);
});

test('renders the complete public-source catalogue grouped by theme', () => {
  assert.equal(typeof viewHelpers.renderSourcesCatalogue, 'function');
  if (typeof viewHelpers.renderSourcesCatalogue !== 'function') return;

  const html = viewHelpers.renderSourcesCatalogue({
    commitments: COMMITMENTS,
    themes: THEMES,
    publicSourcesFor
  });

  assert.equal((html.match(/data-theme-section=/g) ?? []).length, 9);
  assert.equal((html.match(/data-commitment-id=/g) ?? []).length, 23);
  assert.equal((html.match(/class="catalogue-source-link"/g) ?? []).length, 71);
  assert.match(html, /data-commitment-id="participacao-decisoes"/);
  assert.match(html, /data-commitment-id="coordenacao-federal-seguranca"/);
  assert.match(html, /id="compromisso-cuidado-pessoa-idosa"/);
  assert.match(html, /id="compromisso-educacao-tempo-integral"/);
  assert.match(html, /https:\/\/brasilparticipativo\.presidencia\.gov\.br\//);
  assert.match(html, /https:\/\/dados\.mj\.gov\.br\/dataset\/sistema-nacional-de-estatisticas-de-seguranca-publica/);
  assert.match(html, /data-search-text="[^"]*brasil participativo/);
});

test('adds verified Sorocaba snapshots only to commitments with local data', () => {
  const html = viewHelpers.renderSourcesCatalogue({
    commitments: COMMITMENTS,
    themes: THEMES,
    publicSourcesFor,
    territory: SOROCABA,
    indicatorsForCommitment
  });

  assert.equal((html.match(/class="local-snapshot"/g) ?? []).length, 2);
  assert.match(html, /114\.769 pessoas/);
  assert.match(html, /19\.784 matrículas/);
  assert.doesNotMatch(
    html.match(/data-commitment-id="regulacao-plataformas"[\s\S]*?<\/article>/)?.[0] ?? '',
    /local-snapshot/
  );
  assert.match(html, /data-search-text="[^"]*sorocaba/);
});
