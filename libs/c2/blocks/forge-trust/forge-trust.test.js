// Auto-scaffolded smoke fixture for the authored Milo block forge-trust.
import test from 'node:test';
import assert from 'node:assert/strict';
import init from './forge-trust.js';

test('forge-trust: exports a callable init(el)', () => {
  assert.equal(typeof init, 'function');
});
