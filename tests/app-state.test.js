import test from 'node:test';
import assert from 'node:assert/strict';

import {
  createInitialState,
  getNextStep,
  getPreviousStep,
  canContinue,
  sanitizeRestoredState
} from '../src/app-state.js';

test('creates independent state objects so one session cannot mutate another', () => {
  const first = createInitialState();
  const second = createInitialState();

  first.selectedThemes.push('saude');
  first.reflections.affected = 'pessoas do bairro';

  assert.deepEqual(second.selectedThemes, []);
  assert.equal(second.reflections.affected, '');
});

test('requires between one and three themes before continuing', () => {
  const state = { ...createInitialState(), step: 'themes' };

  assert.equal(canContinue(state), false);
  assert.equal(canContinue({ ...state, selectedThemes: ['saude'] }), true);
  assert.equal(canContinue({ ...state, selectedThemes: ['a', 'b', 'c', 'd'] }), false);
});

test('accepts Não sei as an answered Likert option but rejects missing dimensions', () => {
  const state = {
    ...createInitialState(),
    step: 'ratings',
    candidates: ['saude'],
    ratings: {
      saude: { interest: 5, relevance: 4, efficacy: null, willingness: 3 }
    }
  };

  assert.equal(canContinue(state), true);
  assert.equal(canContinue({
    ...state,
    ratings: { saude: { interest: 5, relevance: 4, efficacy: null } }
  }), false);
});

test('requires an explicit human choice before leaving the finalists', () => {
  const state = { ...createInitialState(), step: 'finalists' };

  assert.equal(canContinue(state), false);
  assert.equal(canContinue({ ...state, selectedCommitmentId: 'fortalecimento-sus' }), true);
});

test('requires the core plan fields before generating a plan', () => {
  const state = { ...createInitialState(), step: 'plan' };
  const complete = {
    ...state,
    planInput: {
      startDate: '2026-10-27',
      territory: 'meu bairro',
      availableTime: '2 horas por mês',
      result: 'mapear a fila percebida',
      firstAction: 'conversar com o conselho local',
      partner: '',
      indicator: 'uma demanda protocolada',
      targetDate: '2026-11-26'
    }
  };

  assert.equal(canContinue(state), false);
  assert.equal(canContinue(complete), true);
  assert.equal(canContinue({
    ...complete,
    planInput: { ...complete.planInput, indicator: '   ' }
  }), false);
  assert.equal(canContinue({
    ...complete,
    planInput: { ...complete.planInput, startDate: '' }
  }), false);
});

test('moves through the declared journey in both directions', () => {
  assert.equal(getNextStep('welcome'), 'themes');
  assert.equal(getNextStep('reflection'), 'route');
  assert.equal(getNextStep('complete'), 'complete');
  assert.equal(getPreviousStep('themes'), 'welcome');
  assert.equal(getPreviousStep('welcome'), 'welcome');
});

test('sanitizes malformed restored state without accepting unknown steps', () => {
  const restored = sanitizeRestoredState({
    step: 'admin-panel',
    selectedThemes: ['saude', 42, null],
    selectedCommitmentId: 99,
    reviewDone: 'yes',
    reflections: { affected: 'idosos', change: 12 },
    planInput: null
  });

  assert.equal(restored.step, 'welcome');
  assert.deepEqual(restored.selectedThemes, ['saude']);
  assert.equal(restored.selectedCommitmentId, null);
  assert.equal(restored.reviewDone, false);
  assert.deepEqual(restored.reflections, {
    affected: 'idosos',
    change: '',
    roles: '',
    caution: ''
  });
  assert.deepEqual(restored.planInput, createInitialState().planInput);
});

test('preserves all four explicitly chosen candidates when restoring ranked results', () => {
  const rankedCandidates = ['a', 'b', 'c', 'd'].map((id) => ({ id, score: 4 }));
  const restored = sanitizeRestoredState({ rankedCandidates });

  assert.deepEqual(restored.rankedCandidates, rankedCandidates);
});
