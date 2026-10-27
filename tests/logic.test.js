import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildPlan,
  explainRanking,
  getThemeCommitments,
  rankCommitments,
  selectCandidates
} from '../src/logic.js';

test('ranks high meaning and readiness ahead of partial interest', () => {
  const ratings = {
    a: { interest: 5, relevance: 5, efficacy: 5, willingness: 5 },
    b: { interest: 5, relevance: 5, efficacy: 1, willingness: 1 }
  };

  assert.deepEqual(
    rankCommitments(ratings, [{ id: 'a' }, { id: 'b' }]).map((item) => item.id),
    ['a', 'b']
  );
});

test('keeps an editorially stable order when scores tie', () => {
  const ratings = {
    first: { interest: 4, relevance: 4, efficacy: 4, willingness: 4 },
    second: { interest: 4, relevance: 4, efficacy: 4, willingness: 4 }
  };

  assert.deepEqual(
    rankCommitments(ratings, [{ id: 'first' }, { id: 'second' }]).map((item) => item.id),
    ['first', 'second']
  );
});

test('treats Não sei as missing information instead of a low Likert score', () => {
  const [ranked] = rankCommitments({
    a: { interest: 5, relevance: null, efficacy: 4, willingness: null }
  }, [{ id: 'a', title: 'A' }]);

  assert.equal(ranked.meaningScore, 5);
  assert.equal(ranked.readinessScore, 4);
  assert.equal(ranked.score, 4.5);
});

test('keeps half-point dimension averages when composing the final score', () => {
  const [ranked] = rankCommitments({
    a: { interest: 5, relevance: 4, efficacy: 4, willingness: 3 }
  }, [{ id: 'a' }]);

  assert.equal(ranked.meaningScore, 4.5);
  assert.equal(ranked.readinessScore, 3.5);
  assert.equal(ranked.score, 4);
});

test('does not let one entirely unknown dimension outrank a complete rating', () => {
  const ratings = {
    unknownMeaning: { interest: null, relevance: null, efficacy: 5, willingness: 5 },
    complete: { interest: 4, relevance: 4, efficacy: 4, willingness: 4 }
  };

  const ranked = rankCommitments(ratings, [
    { id: 'unknownMeaning' },
    { id: 'complete' }
  ]);

  assert.deepEqual(ranked.map((item) => item.id), ['complete', 'unknownMeaning']);
  assert.equal(ranked[1].meaningScore, null);
  assert.equal(ranked[1].readinessScore, 5);
  assert.equal(ranked[1].score, null);
});

test('does not let a partially answered perfect score outrank a complete rating', () => {
  const ratings = {
    partial: { interest: 5, relevance: null, efficacy: 5, willingness: null },
    complete: { interest: 4, relevance: 4, efficacy: 4, willingness: 4 }
  };

  const ranked = rankCommitments(ratings, [{ id: 'partial' }, { id: 'complete' }]);

  assert.deepEqual(ranked.map((item) => item.id), ['complete', 'partial']);
  assert.equal(ranked[1].informationComplete, false);
  assert.equal(ranked[1].knownCount, 2);
  assert.match(explainRanking(ratings.partial), /informação insuficiente/i);
});

test('selects Quero explorar before Talvez and excludes negative or unknown reactions', () => {
  const commitments = [
    { id: 'a' },
    { id: 'b' },
    { id: 'c' },
    { id: 'd' },
    { id: 'e' }
  ];
  const reactions = {
    a: 'maybe',
    b: 'not-now',
    c: 'explore',
    d: 'unknown',
    e: 'explore'
  };

  assert.deepEqual(
    selectCandidates(reactions, commitments, 3).map((item) => item.id),
    ['c', 'e', 'a']
  );
});

test('requires an explicit UI tiebreak when positive reactions exceed the limit', () => {
  const commitments = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
  const reactions = { a: 'explore', b: 'explore', c: 'maybe' };

  assert.throws(
    () => selectCandidates(reactions, commitments, 2),
    (error) => error instanceof RangeError && /explicit tiebreak/i.test(error.message)
  );
});

test('filters the catalogue by theme without duplicating commitments', () => {
  const selected = getThemeCommitments(['saude-sus', 'saude-sus']);

  assert.ok(selected.length > 0);
  assert.ok(selected.every((commitment) => commitment.themeId === 'saude-sus'));
  assert.equal(new Set(selected.map((commitment) => commitment.id)).size, selected.length);
});

test('explains both an immediately actionable priority and one needing support', () => {
  assert.equal(
    explainRanking({ interest: 5, relevance: 4, efficacy: 5, willingness: 4 }),
    'Você indicou alta importância e alta possibilidade de agir nos próximos 30 dias.'
  );
  assert.equal(
    explainRanking({ interest: 5, relevance: 5, efficacy: 2, willingness: 1 }),
    'Você indicou alta importância, mas pode precisar de apoio para começar.'
  );
});

test('explains an unknown dimension as missing information rather than a low score', () => {
  assert.equal(
    explainRanking({ interest: null, relevance: null, efficacy: 5, willingness: 5 }),
    'Você indicou possibilidade de agir, mas ainda não informou quanto este compromisso importa.'
  );
  assert.equal(
    explainRanking({ interest: 5, relevance: 5, efficacy: null, willingness: null }),
    'Você indicou a importância deste compromisso, mas ainda não informou sua possibilidade de agir.'
  );
});

test('builds a 30-day plan that keeps citizen action and public responsibility distinct', () => {
  const plan = buildPlan({
    territory: 'meu bairro',
    availableTime: '2 horas por mês',
    result: 'entender as barreiras de acesso',
    firstAction: 'conversar com o conselho local',
    partner: 'duas pessoas vizinhas',
    indicator: 'uma demanda protocolada',
    targetDate: '2026-11-26',
    caution: 'não registrar dados pessoais'
  }, {
    id: 'fortalecimento-sus',
    title: 'Fortalecimento do SUS',
    responsibility: {
      citizen: 'Acompanhar serviços e participar dos espaços de controle social.',
      state: 'Financiar, gerir e prestar os serviços públicos de saúde.'
    }
  }, {
    id: 'acompanhar-cobrar',
    title: 'Acompanhar e cobrar'
  });

  assert.deepEqual(plan, {
    commitmentId: 'fortalecimento-sus',
    commitmentTitle: 'Fortalecimento do SUS',
    routeId: 'acompanhar-cobrar',
    routeTitle: 'Acompanhar e cobrar',
    horizonDays: 30,
    targetDate: '2026-11-26',
    territory: 'meu bairro',
    availableTime: '2 horas por mês',
    desiredResult: 'entender as barreiras de acesso',
    firstAction: 'conversar com o conselho local',
    partner: 'duas pessoas vizinhas',
    indicator: 'uma demanda protocolada',
    caution: 'não registrar dados pessoais',
    citizenBoundary: 'Acompanhar serviços e participar dos espaços de controle social.',
    publicResponsibility: 'Financiar, gerir e prestar os serviços públicos de saúde.',
    statement: 'Até 2026-11-26, vou conversar com o conselho local em meu bairro. Saberei que avancei quando uma demanda protocolada.',
    reviewAfterDays: 7
  });
});

test('refuses to build a plan without an observable indicator', () => {
  assert.throws(() => buildPlan({
    territory: 'meu bairro',
    availableTime: 'uma hora',
    result: 'compreender o tema',
    firstAction: 'ler os dados públicos',
    targetDate: '2026-11-26',
    indicator: '   '
  }, {
    id: 'lideranca-climatica',
    title: 'Liderança climática',
    responsibility: { citizen: 'Acompanhar.', state: 'Executar a política.' }
  }, {
    id: 'conhecer-mapear',
    title: 'Conhecer e mapear'
  }), /indicator/);
});

const dateTestCommitment = {
  id: 'lideranca-climatica',
  title: 'Liderança climática',
  responsibility: { citizen: 'Acompanhar.', state: 'Executar a política.' }
};

const dateTestRoute = {
  id: 'conhecer-mapear',
  title: 'Conhecer e mapear'
};

const dateTestInput = {
  territory: 'meu bairro',
  availableTime: 'uma hora',
  result: 'compreender o tema',
  firstAction: 'ler os dados públicos',
  indicator: 'um resumo produzido',
  targetDate: '2026-11-26'
};

test('rejects a target date that is not a real ISO calendar date', () => {
  for (const targetDate of ['26/11/2026', '2026-2-03', '2026-02-29']) {
    assert.throws(
      () => buildPlan(
        { ...dateTestInput, targetDate },
        dateTestCommitment,
        dateTestRoute
      ),
      /targetDate.*ISO/i
    );
  }
});

test('derives a 30-day horizon from a valid start date', () => {
  const plan = buildPlan({
    ...dateTestInput,
    startDate: '2026-10-27'
  }, dateTestCommitment, dateTestRoute);

  assert.equal(plan.startDate, '2026-10-27');
  assert.equal(plan.targetDate, '2026-11-26');
  assert.equal(plan.horizonDays, 30);
});

test('rejects an invalid start date and a target outside the 30-day horizon', () => {
  assert.throws(() => buildPlan({
    ...dateTestInput,
    startDate: '2026-10-32'
  }, dateTestCommitment, dateTestRoute), /startDate.*ISO/i);

  assert.throws(() => buildPlan({
    ...dateTestInput,
    startDate: '2026-10-27',
    targetDate: '2026-11-25'
  }, dateTestCommitment, dateTestRoute), /exactly 30 days/i);
});
