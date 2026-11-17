// Run: node --test .pinata/scripts/check-contract.test.mjs
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { danglingIds, lintDocs, readDocs } from './check-contract.mjs';

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const { docs, errors: readErrors } = readDocs();

const floor = {
  regeneration: { max_candidates: 5 },
  gates: { adversary: { template: 'adversary', blocking: true, failure_route: 'regenerate' } },
};
const manifest = { org: 'acom', product: 'milo', repo: 'adobecom/milo' };
const lint = (gates) => lintDocs({ manifest, gates, floor });
const adversary = (over) => ({ gates: { adversary: { ...floor.gates.adversary, ...over } } });

test('the real contract reads and lints clean', () => {
  assert.deepEqual(readErrors, []);
  assert.deepEqual(lintDocs(docs), []);
});

test('gates may tighten the floor', () => {
  assert.deepEqual(lint({ regeneration: { max_candidates: 2 }, ...adversary({ failure_route: 'escalate_to_human' }) }), []);
});

test('weakening the floor fails', () => {
  assert.match(lint({ regeneration: { max_candidates: 6 }, ...adversary({}) })[0], /exceeds the org floor ceiling/);
  assert.match(lint({ gates: {} })[0], /required by the org floor but missing/);
  assert.match(lint(adversary({ blocking: false }))[0], /advisory here/);
  assert.match(lint(adversary({ template: 'command' }))[0], /changes the org floor template/);
});

test('a gate without a template fails', () => {
  assert.match(lint({ gates: { lint: {} } })[0], /needs a template/);
});

test('the owners file exists', () => {
  assert.ok(existsSync(join(REPO_ROOT, docs.manifest.owners_from)));
});

test('preview patterns use the manifest repo', () => {
  const [owner, name] = docs.manifest.repo.split('/');
  assert.ok(docs.preview.pin_pattern.includes(`--${name}--${owner}.`));
  assert.ok(docs.preview.overlay_pattern.includes(`={branch}--${name}--${owner}&`));
});

test('ids missing from the registry are reported', () => {
  assert.deepEqual(danglingIds(['a'], ['a', 'b']), []);
  assert.match(danglingIds(['c'], ['a', 'b'])[0], /id 'c' not in the registry \(available: a, b\)/);
});
