// Auto-scaffolded smoke fixture for the snowflake host block forge-hero.
import test from 'node:test';
import assert from 'node:assert/strict';
import init from './forge-hero.js';

test('forge-hero: exports a callable init(el)', () => {
  assert.equal(typeof init, 'function');
});
