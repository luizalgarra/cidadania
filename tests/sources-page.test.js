import test from 'node:test';
import assert from 'node:assert/strict';

import { COMMITMENTS, THEMES, publicSourcesFor } from '../src/commitments.js';
import { SOROCABA, indicatorsForCommitment } from '../src/sorocaba-data.js';
import * as viewHelpers from '../src/view-helpers.js';

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
