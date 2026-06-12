// Auto-scaffolded smoke fixture for the authored Milo block forge-concierge.
import test from 'node:test';
import assert from 'node:assert/strict';
import init from './forge-concierge.js';

test('forge-concierge: exports a callable init(el)', () => {
  assert.equal(typeof init, 'function');
});
