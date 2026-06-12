// Auto-scaffolded smoke fixture for the authored Milo block forge-jump.
import test from 'node:test';
import assert from 'node:assert/strict';
import init from './forge-jump.js';

test('forge-jump: exports a callable init(el)', () => {
  assert.equal(typeof init, 'function');
});
