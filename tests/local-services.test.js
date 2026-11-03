import test from 'node:test';
import assert from 'node:assert/strict';
import { findServices, LOCAL_SERVICES } from '../src/local-services.js';
test('finds units despite accents and filters the requested service', () => {
  assert.equal(findServices('  eDeN ', 'UBS')[0].name, 'Éden');
  assert.equal(findServices('sao bento').length, 2);
  assert.equal(findServices('wanel', 'CRAS')[0].name, 'Ipiranga');
  assert.equal(findServices('bairro inexistente').length, 0);
});
test('every published unit has usable telephone digits and provenance date', () => {
  assert.equal(LOCAL_SERVICES.length, 45);
  for (const unit of LOCAL_SERVICES) {
    assert.ok(unit.address);
    assert.equal(unit.verifiedAt, '2026-11-03');
    for (const phone of unit.phones) assert.match(phone.replace(/\D/g, ''), /^\d{8,9}$/);
  }
});
