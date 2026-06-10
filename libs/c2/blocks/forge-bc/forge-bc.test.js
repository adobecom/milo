// Auto-scaffolded smoke fixture for the snowflake host block forge-bc.
import test from 'node:test';
import assert from 'node:assert/strict';
import init from './forge-bc.js';

test('forge-bc: exports a callable init(el)', () => {
  assert.equal(typeof init, 'function');
});
