// Auto-scaffolded smoke fixture for the authored Milo block forge-usecase.
import test from 'node:test';
import assert from 'node:assert/strict';
import init from './forge-usecase.js';

test('forge-usecase: exports a callable init(el)', () => {
  assert.equal(typeof init, 'function');
});
