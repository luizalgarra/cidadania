import test from 'node:test';
import assert from 'node:assert/strict';

import { COMMITMENTS, ROUTES, SOURCE_CONTEXT, THEMES } from '../src/commitments.js';

const idsAreUnique = (items) => new Set(items.map((item) => item.id)).size === items.length;
const hasText = (value) => typeof value === 'string' && value.trim().length > 0;

const EXPECTED_COMMITMENT_IDS = [
  'participacao-decisoes',
  'comunicacao-publica-direta',
  'governo-constitucional-plural',
  'regulacao-plataformas',
  'crimes-digitais',
  'tributacao-digital',
  'cuidado-pessoa-idosa',
  'mulheres-politicas-publicas',
  'liberdade-religiosa',
  'educacao-tempo-integral',
  'pe-de-meia-ensino-medio',
  'pe-de-meia-universitario',
  'matematica-engenharia',
  'ia-brasileira',
  'data-centers-brasil',
  'reserva-protecao-dados',
  'economias-do-futuro',
  'lideranca-climatica',
  'cooperacao-internacional',
  'fortalecimento-sus',
  'cuidado-oncologico',
  'saude-inteligente',
  'coordenacao-federal-seguranca'
];

test('catalogue collections use unique stable identifiers', () => {
  assert.equal(idsAreUnique(THEMES), true);
  assert.equal(idsAreUnique(COMMITMENTS), true);
  assert.equal(idsAreUnique(ROUTES), true);
});

test('source context names the attributed speaker without overstating verification', () => {
  assert.equal(SOURCE_CONTEXT.speaker, 'Luiz Inácio Lula da Silva');
  assert.match(SOURCE_CONTEXT.context, /segundo turno/i);
  assert.match(SOURCE_CONTEXT.context, /discurso de vitória/i);
  assert.equal(SOURCE_CONTEXT.dateLabel, 'outubro de 2026');
  assert.equal(SOURCE_CONTEXT.externallyVerified, false);
  assert.match(SOURCE_CONTEXT.provenance, /fornecida pelo usuário/i);
  assert.match(SOURCE_CONTEXT.provenance, /não (?:foi|foram) verificad/i);
});

test('catalogue explicitly covers each distinct future commitment', () => {
  assert.deepEqual(
    COMMITMENTS.map((commitment) => commitment.id).sort(),
    [...EXPECTED_COMMITMENT_IDS].sort()
  );
});

test('every theme has descriptive copy and at least one commitment', () => {
  for (const theme of THEMES) {
    assert.equal(hasText(theme.title), true, `${theme.id} needs a title`);
    assert.equal(hasText(theme.description), true, `${theme.id} needs a description`);
    assert.equal(
      COMMITMENTS.some((commitment) => commitment.themeId === theme.id),
      true,
      `${theme.id} needs a commitment`
    );
  }
});

test('every commitment belongs to a valid theme and carries neutral source context', () => {
  const themeIds = new Set(THEMES.map((theme) => theme.id));
  const kinds = new Set(['operational', 'programmatic', 'aspirational']);

  for (const commitment of COMMITMENTS) {
    assert.equal(themeIds.has(commitment.themeId), true, `${commitment.id} has an invalid theme`);
    assert.equal(hasText(commitment.title), true, `${commitment.id} needs a title`);
    assert.equal(hasText(commitment.summary), true, `${commitment.id} needs a summary`);
    assert.equal(hasText(commitment.excerpt), true, `${commitment.id} needs a source excerpt`);
    assert.equal(kinds.has(commitment.kind), true, `${commitment.id} needs a valid kind`);
  }
});

test('education integral summary does not add an unstated progressive qualifier', () => {
  const commitment = COMMITMENTS.find((item) => item.id === 'educacao-tempo-integral');

  assert.doesNotMatch(commitment.summary, /progressivamente/i);
});

test('catalogue exposes exactly the four citizen routes used by the journey', () => {
  assert.deepEqual(
    ROUTES.map((route) => route.id),
    ['conhecer-mapear', 'ajudar-diretamente', 'mobilizar-pessoas', 'acompanhar-cobrar']
  );
  assert.ok(ROUTES.every((route) => hasText(route.title) && hasText(route.description)));
});

test('every commitment distinguishes citizen scope from state responsibility', () => {
  const routeIds = new Set(ROUTES.map((route) => route.id));

  for (const commitment of COMMITMENTS) {
    assert.equal(
      hasText(commitment.responsibility?.citizen),
      true,
      `${commitment.id} needs a citizen boundary`
    );
    assert.equal(
      hasText(commitment.responsibility?.state),
      true,
      `${commitment.id} needs a state responsibility`
    );
    assert.equal(
      Array.isArray(commitment.responsibility?.levels)
        && commitment.responsibility.levels.length > 0
        && commitment.responsibility.levels.every(hasText),
      true,
      `${commitment.id} needs responsible government levels`
    );
    assert.equal(
      routeIds.has(commitment.suggestedRouteId),
      true,
      `${commitment.id} needs a valid suggested route`
    );
  }
});
