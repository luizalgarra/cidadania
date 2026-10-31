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
