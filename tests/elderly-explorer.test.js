import test from 'node:test';
import assert from 'node:assert/strict';

import { SOROCABA_ELDERLY_PROFILE } from '../src/sorocaba-data.js';

async function loadSubject() {
  try {
    return await import('../src/elderly-explorer.js');
  } catch {
    return null;
  }
}

test('formats a selected population group in plain Brazilian Portuguese', async () => {
  const subject = await loadSubject();
  assert.ok(subject, 'the elderly explorer module must exist');

  assert.deepEqual(subject.formatElderlyMetric({
    value: 5074,
    ageLabel: '80 a 84 anos',
    sexLabel: 'Mulheres',
    shareOfElderly: 4.4,
    shareOfSorocaba: 0.7
  }), {
    context: 'Mulheres · 80 a 84 anos',
    value: '5.074',
    share: '0,7% da população de Sorocaba · 4,4% das pessoas com 60 anos ou mais'
  });
});

test('does not describe a small non-zero group as zero percent', async () => {
  const subject = await loadSubject();
  assert.ok(subject, 'the elderly explorer module must exist');

  assert.deepEqual(subject.formatElderlyMetric({
    value: 45,
    ageLabel: '100 anos ou mais',
    sexLabel: 'Mulheres',
    shareOfElderly: 0,
    shareOfSorocaba: 0
  }), {
    context: 'Mulheres · 100 anos ou mais',
    value: '45',
    share: 'menos de 0,1% da população de Sorocaba · menos de 0,1% das pessoas com 60 anos ou mais'
  });
});

test('builds a comparable generation ruler for the selected sex', async () => {
  const subject = await loadSubject();
  assert.ok(subject, 'the elderly explorer module must exist');

  const rows = subject.elderlyChartRows({
    profile: SOROCABA_ELDERLY_PROFILE,
    sex: 'women',
    activeAgeBand: '80-84'
  });

  assert.equal(rows.length, 9);
  assert.deepEqual(rows[0], {
    id: '60-64',
    label: '60 a 64',
    value: 20346,
    formattedValue: '20.346',
    widthPercent: 100,
    active: false
  });
  assert.deepEqual(rows[4], {
    id: '80-84',
    label: '80 a 84',
    value: 5074,
    formattedValue: '5.074',
    widthPercent: 24.9,
    active: true
  });
});
