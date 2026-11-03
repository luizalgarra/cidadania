import test from 'node:test';
import assert from 'node:assert/strict';
import { buildSupportPlan } from '../src/elderly-support-plan.js';
const base = { age: '60-64', income: 'hard', benefit: 'none', cad: 'no', disability: 'no', care: 'no', mobility: 'easy', support: 'enough' };
test('BPC guidance respects age, disability and existing benefits', () => {
  const hasBpc = a => buildSupportPlan(a).some(x => x.id === 'bpc');
  assert.equal(hasBpc(base), false);
  assert.equal(hasBpc({...base, age:'65+'}), true);
  assert.equal(hasBpc({...base, disability:'yes'}), true);
  assert.equal(hasBpc({...base, age:'65+', benefit:'pension'}), false);
  assert.equal(hasBpc({...base, age:'65+', benefit:'bpc'}), false);
  assert.equal(hasBpc({...base, age:'unknown'}), false);
});
test('unknown answers do not create needs and mobility triggers evaluation rather than a promise', () => {
  assert.deepEqual(buildSupportPlan(Object.fromEntries(Object.keys(base).map(k => [k,'unknown']))).map(x => x.id), ['review']);
  const steps = buildSupportPlan({...base, care:'yes', mobility:'hard'});
  assert.equal(steps[0].id,'home');
  assert.equal(steps.filter(x => ['home','health'].includes(x.id)).length,1);
  assert.match(steps[0].action,/avalia/);
});
