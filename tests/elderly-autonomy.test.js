import test from 'node:test';
import assert from 'node:assert/strict';

import * as sorocabaData from '../src/sorocaba-data.js';

async function loadSubject() {
  try {
    return await import('../src/elderly-autonomy.js');
  } catch {
    return null;
  }
}

test('formats the typical individual income separately from the mean and sample estimate', async () => {
  const subject = await loadSubject();
  assert.ok(subject, 'the elderly autonomy module must exist');
  if (!subject) return;

  assert.deepEqual(subject.formatAutonomyMetric({
    ageLabel: '80 anos ou mais',
    sexLabel: 'Mulheres',
    peopleEstimate: 10712,
    meanMonthlyIncome: 2019.83,
    medianMonthlyIncome: 1212
  }), {
    context: 'Mulheres · 80 anos ou mais',
    median: 'R$ 1.212,00',
    mean: 'R$ 2.019,83',
    people: '10.712 pessoas consideradas na estimativa'
  });
});

test('builds an age comparison from medians for the selected sex', async () => {
  const subject = await loadSubject();
  assert.ok(subject, 'the elderly autonomy module must exist');
  if (!subject) return;
  assert.ok(
    sorocabaData.SOROCABA_ELDERLY_AUTONOMY_PROFILE,
    'the elderly autonomy profile must exist'
  );

  const rows = subject.autonomyChartRows({
    profile: sorocabaData.SOROCABA_ELDERLY_AUTONOMY_PROFILE,
    sex: 'men',
    activeAgeBand: '80-plus'
  });

  assert.equal(rows.length, 5);
  assert.deepEqual(rows[0], {
    id: '60-64',
    label: '60 a 64',
    value: 2400,
    formattedValue: 'R$ 2.400',
    widthPercent: 96,
    active: false
  });
  assert.deepEqual(rows[4], {
    id: '80-plus',
    label: '80 ou mais',
    value: 1950,
    formattedValue: 'R$ 1.950',
    widthPercent: 78,
    active: true
  });
});
