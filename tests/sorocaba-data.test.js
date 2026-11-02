import test from 'node:test';
import assert from 'node:assert/strict';

async function loadSubject() {
  try {
    return await import('../src/sorocaba-data.js');
  } catch {
    return null;
  }
}

test('publishes only verified municipal indicators for Sorocaba', async () => {
  const subject = await loadSubject();
  assert.ok(subject, 'the Sorocaba data module must exist');

  assert.deepEqual(subject.SOROCABA, {
    name: 'Sorocaba',
    ibgeCode: '3552205',
    state: 'SP'
  });
  assert.equal(subject.SOROCABA_INDICATORS.length, 2);

  for (const indicator of subject.SOROCABA_INDICATORS) {
    assert.equal(indicator.status, 'verified');
    assert.ok(indicator.commitmentIds.length > 0);
    assert.match(indicator.referencePeriod, /^\d{4}$/);
    assert.match(indicator.retrievedAt, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(indicator.methodology.length > 0);
    assert.ok(indicator.caveat.length > 0);
    assert.match(indicator.source.datasetUrl, /^https:\/\/basedosdados\.org\//);
    assert.match(indicator.source.originalUrl, /^https:\/\//);
    assert.match(indicator.illustration.src, /^\.\/assets\/sorocaba-.+\.jpg$/);
    assert.ok(indicator.illustration.alt.length >= 40);
  }
});

test('associates the verified snapshots only with the relevant commitments', async () => {
  const subject = await loadSubject();
  assert.ok(subject, 'the Sorocaba data module must exist');

  const elderly = subject.indicatorsForCommitment('cuidado-pessoa-idosa');
  const education = subject.indicatorsForCommitment('educacao-tempo-integral');

  assert.equal(elderly.length, 1);
  assert.equal(elderly[0].displayValue, '114.769 pessoas');
  assert.equal(elderly[0].supportingValue, '15,9% da população');
  assert.match(elderly[0].illustration.alt, /moradores idosos.*banco.*bairro.*cadeira de rodas/i);
  assert.equal(education.length, 1);
  assert.equal(education[0].displayValue, '19.784 matrículas');
  assert.equal(education[0].supportingValue, '52,3% das matrículas dos anos finais');
  assert.deepEqual(subject.indicatorsForCommitment('regulacao-plataformas'), []);
});

test('publishes the complete 60+ age profile without double-counting grouped ages', async () => {
  const subject = await loadSubject();
  assert.ok(subject, 'the Sorocaba data module must exist');

  const profile = subject.SOROCABA_ELDERLY_PROFILE;
  assert.ok(profile, 'the elderly profile must exist');
  assert.equal(profile.totalPopulation, 723682);
  assert.equal(profile.elderlyPopulation, 114769);
  assert.equal(profile.ageBands.length, 9);
  assert.equal(
    profile.ageBands.reduce((sum, band) => sum + band.total, 0),
    114769
  );
  assert.equal(
    profile.ageBands.reduce((sum, band) => sum + band.women, 0),
    65557
  );
  assert.equal(
    profile.ageBands.reduce((sum, band) => sum + band.men, 0),
    49212
  );
});

test('answers a simple elderly-population search by age band and sex', async () => {
  const subject = await loadSubject();
  assert.ok(subject, 'the Sorocaba data module must exist');

  assert.deepEqual(subject.elderlyPopulationFor(), {
    value: 114769,
    ageLabel: '60 anos ou mais',
    sexLabel: 'Todas as pessoas',
    shareOfElderly: 100,
    shareOfSorocaba: 15.9
  });
  assert.deepEqual(subject.elderlyPopulationFor({ ageBand: '80-84', sex: 'women' }), {
    value: 5074,
    ageLabel: '80 a 84 anos',
    sexLabel: 'Mulheres',
    shareOfElderly: 4.4,
    shareOfSorocaba: 0.7
  });
  assert.deepEqual(subject.elderlyPopulationFor({ ageBand: '100-plus', sex: 'men' }), {
    value: 17,
    ageLabel: '100 anos ou mais',
    sexLabel: 'Homens',
    shareOfElderly: 0,
    shareOfSorocaba: 0
  });
  assert.throws(
    () => subject.elderlyPopulationFor({ ageBand: 'faixa-inexistente' }),
    /faixa etária/i
  );
});

test('derives plain-language highlights from the verified elderly profile', async () => {
  const subject = await loadSubject();
  assert.ok(subject, 'the Sorocaba data module must exist');

  assert.deepEqual(subject.SOROCABA_ELDERLY_PROFILE.highlights, {
    elderlyShareOfPopulation: 15.9,
    womenShareOfElderly: 57.1,
    population80Plus: 15130,
    population80PlusShareOfElderly: 13.2,
    population90Plus: 2456
  });
});

test('answers an elderly autonomy search without merging sample estimates into the population universe', async () => {
  const subject = await loadSubject();
  assert.ok(subject, 'the Sorocaba data module must exist');

  assert.deepEqual(subject.elderlyAutonomyFor(), {
    ageLabel: '60 a 64 anos',
    sexLabel: 'Todas as pessoas',
    peopleEstimate: 37819,
    meanMonthlyIncome: 2841.78,
    medianMonthlyIncome: 1500
  });
  assert.deepEqual(subject.elderlyAutonomyFor({ ageBand: '80-plus', sex: 'women' }), {
    ageLabel: '80 anos ou mais',
    sexLabel: 'Mulheres',
    peopleEstimate: 10712,
    meanMonthlyIncome: 2019.83,
    medianMonthlyIncome: 1212
  });
  assert.equal(subject.SOROCABA_ELDERLY_AUTONOMY_PROFILE.ageBands.length, 5);
  assert.equal(subject.SOROCABA_ELDERLY_AUTONOMY_PROFILE.source.sidraTable, '10299');
  assert.throws(
    () => subject.elderlyAutonomyFor({ sex: 'categoria-inexistente' }),
    /sexo/i
  );
});

test('compares urban accessibility conditions for elderly residents in the same IBGE table', async () => {
  const subject = await loadSubject();
  assert.ok(subject, 'the Sorocaba data module must exist');

  assert.equal(subject.SOROCABA_ELDERLY_ACCESSIBILITY_PROFILE.source.sidraTable, '6591');
  assert.equal(subject.SOROCABA_ELDERLY_ACCESSIBILITY_PROFILE.ageBands.length, 2);
  assert.deepEqual(subject.elderlyAccessibilityFor(), {
    ageLabel: '60 a 69 anos',
    metricLabel: 'Calçada / passeio',
    conditionLabel: 'moram em via com calçada / passeio',
    observed: 61206,
    universe: 63566,
    percentage: 96.3,
    favorable: true
  });
  assert.deepEqual(subject.elderlyAccessibilityFor({ ageBand: '70-plus', metric: 'obstacle' }), {
    ageLabel: '70 anos ou mais',
    metricLabel: 'Obstáculo na calçada',
    conditionLabel: 'moram em via com obstáculo na calçada',
    observed: 30851,
    universe: 47016,
    percentage: 65.6,
    favorable: false
  });
  assert.throws(
    () => subject.elderlyAccessibilityFor({ metric: 'categoria-inexistente' }),
    /condição do entorno/i
  );
});

test('keeps health and social-protection indicators in their own declared universes', async () => {
  const subject = await loadSubject();
  assert.ok(subject, 'the Sorocaba data module must exist');

  assert.deepEqual(subject.SOROCABA_ELDERLY_HEALTH_PROFILE.indicator, {
    label: 'Internações por fratura de fêmur em pessoas com 60+',
    value: 21.89,
    unit: 'por 10 mil habitantes',
    referencePeriod: '2024',
    target2029: 20
  });
  assert.equal(subject.SOROCABA_ELDERLY_PROTECTION_PROFILE.bpcElderly.value, 3890);
  assert.equal(subject.SOROCABA_ELDERLY_PROTECTION_PROFILE.bpcElderly.referencePeriod, 'junho de 2022');
  assert.match(subject.SOROCABA_ELDERLY_PROTECTION_PROFILE.caveat, /não representa toda a população idosa/i);
});
