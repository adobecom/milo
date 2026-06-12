// Auto-scaffolded smoke fixture for the authored Milo block forge-merch.
import test from 'node:test';
import assert from 'node:assert/strict';
import init from './forge-merch.js';

test('forge-merch: exports a callable init(el)', () => {
  assert.equal(typeof init, 'function');
});
