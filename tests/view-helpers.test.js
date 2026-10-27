import test from 'node:test';
import assert from 'node:assert/strict';

import {
  escapeHtml,
  formatDatePtBr,
  createPlanDefaults,
  commitmentKindLabel,
  deriveStartDateFromTarget
} from '../src/view-helpers.js';

test('escapes user text before it is inserted into an HTML template', () => {
  assert.equal(
    escapeHtml('<img src=x onerror="alert(1)"> & ação'),
    '&lt;img src=x onerror=&quot;alert(1)&quot;&gt; &amp; ação'
  );
});

test('formats an ISO date in Portuguese without shifting the calendar day', () => {
  assert.equal(formatDatePtBr('2026-11-26'), '26 de novembro de 2026');
});

test('creates a 30-day monitoring plan without preselecting a partner', () => {
  const defaults = createPlanDefaults(
    { title: 'Fortalecimento do SUS' },
    'acompanhar-cobrar',
    new Date('2026-10-27T12:00:00Z')
  );

  assert.deepEqual(defaults, {
    startDate: '2026-10-27',
    territory: 'meu bairro ou comunidade',
    availableTime: '2 horas por mês',
    result: 'acompanhar uma entrega concreta ligada a fortalecimento do SUS',
    firstAction: 'identificar o órgão responsável e formular uma pergunta objetiva sobre fortalecimento do SUS',
    partner: '',
    indicator: 'uma resposta oficial ou atualização verificável registrada',
    targetDate: '2026-11-26'
  });
});

test('keeps the 30-day target anchored to the user local calendar near midnight', () => {
  const nearMidnightInBrasilia = new Date('2026-10-27T23:30:00-03:00');
  const defaults = createPlanDefaults(
    { title: 'Fortalecer a atenção básica' },
    'acompanhar-cobrar',
    nearMidnightInBrasilia
  );

  assert.equal(defaults.targetDate, '2026-11-26');
});

test('recovers the original cycle start for an older saved 30-day target', () => {
  assert.equal(deriveStartDateFromTarget('2026-11-26'), '2026-10-27');
  assert.equal(deriveStartDateFromTarget('data-inválida'), '');
});

test('explains the editorial specificity assigned to a commitment', () => {
  assert.equal(
    commitmentKindLabel('operational'),
    'Medida descrita de forma concreta no discurso.'
  );
  assert.equal(
    commitmentKindLabel('programmatic'),
    'Direção de governo sem execução completa definida no discurso.'
  );
  assert.equal(
    commitmentKindLabel('aspirational'),
    'Aspiração ampla sem indicador completo definido no discurso.'
  );
  assert.equal(
    commitmentKindLabel('unknown'),
    'Classificação editorial não informada.'
  );
});
