import test from 'node:test';
import assert from 'node:assert/strict';

import { SOROCABA_ELDERLY_ACCESSIBILITY_PROFILE } from '../src/sorocaba-data.js';

async function loadSubject() {
  try {
    return await import('../src/elderly-accessibility.js');
  } catch {
    return null;
  }
}

test('formats an accessibility result as a plain-language municipal estimate', async () => {
  const subject = await loadSubject();
  assert.ok(subject, 'the elderly accessibility module must exist');

  assert.deepEqual(subject.formatAccessibilityMetric({
    ageLabel: '60 a 69 anos',
    metricLabel: 'Calçada / passeio',
    conditionLabel: 'moram em via com calçada / passeio',
    observed: 61206,
    universe: 63566,
    percentage: 96.3,
    favorable: true
  }), {
    context: '60 a 69 anos · Calçada / passeio',
    value: '96,3%',
    count: '61.206 de 63.566 pessoas moram em via com calçada / passeio',
    tone: 'favorable'
  });
});

test('builds one comparable row per street condition for the selected age group', async () => {
  const subject = await loadSubject();
  assert.ok(subject, 'the elderly accessibility module must exist');

  const rows = subject.accessibilityChartRows({
    profile: SOROCABA_ELDERLY_ACCESSIBILITY_PROFILE,
    ageBand: '70-plus',
    activeMetric: 'ramp'
  });

  assert.equal(rows.length, 5);
  assert.deepEqual(rows.find((row) => row.id === 'ramp'), {
    id: 'ramp',
    label: 'Rampa para cadeirante',
    value: 11,
    formattedValue: '11,0%',
    favorable: true,
    active: true
  });
  assert.equal(rows.find((row) => row.id === 'obstacle').favorable, false);
});
