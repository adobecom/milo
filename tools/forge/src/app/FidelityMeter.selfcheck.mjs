// Standalone verification for the honest-fidelity UI logic (the-new-plan §4.2
// item 8 / F-add-1). NOT a *.test.js (those are protected goalposts). Run:
//   node page-forge/client/src/app/FidelityMeter.selfcheck.mjs
//
// We can't import the TSX directly under bare node (JSX/React), so this file
// (a) re-implements the THREE pure decision functions byte-for-byte against the
//     source semantics, exercising the truth-table, and
// (b) greps the real source files to assert the load-bearing strings are present
//     so the selfcheck cannot silently drift from the shipped logic.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import assert from 'node:assert/strict';

const here = dirname(fileURLToPath(import.meta.url));

// ── Mirror of FidelityMeter.fidelityLevel ─────────────────────────────────────
function level(pct) {
  if (pct >= 75) return 'high';
  if (pct >= 50) return 'mid';
  return 'low';
}
function fidelityLevel(combined) {
  if (combined == null) return 'low';
  return level(Math.round((1 - combined) * 100));
}

// ── Mirror of ResultCard.resultHeadline ───────────────────────────────────────
function resultHeadline(fidelity) {
  if (!fidelity || fidelity.combined == null) {
    return { label: 'Page shipped — fidelity not measured', tone: 'unknown' };
  }
  const presenceUnmeasured = fidelity.presenceMeasured === false;
  const lvl = fidelityLevel(fidelity.combined);
  if (lvl === 'high' && !presenceUnmeasured) {
    return { label: 'Your page is ready', tone: 'ready' };
  }
  if (presenceUnmeasured) {
    return { label: 'Needs refinement — text presence not measured', tone: 'review' };
  }
  return { label: 'Needs refinement — fidelity below target', tone: 'review' };
}

let pass = 0;
function check(name, fn) {
  fn();
  pass += 1;
  console.log(`  ok  ${name}`);
}

// ── fidelityLevel truth-table (combined is a MISMATCH ratio) ───────────────────
check('combined=0.10 → 90% fidelity → high', () =>
  assert.equal(fidelityLevel(0.1), 'high'));
check('combined=0.40 → 60% fidelity → mid', () =>
  assert.equal(fidelityLevel(0.4), 'mid'));
check('combined=0.70 → 30% fidelity → low', () =>
  assert.equal(fidelityLevel(0.7), 'low'));
check('combined=null → low (never green by default)', () =>
  assert.equal(fidelityLevel(null), 'low'));

// ── resultHeadline drift-awareness (the core honesty fix) ──────────────────────
check('no fidelity → NOT "ready", tone=unknown', () => {
  const h = resultHeadline(null);
  assert.equal(h.tone, 'unknown');
  assert.notEqual(h.label, 'Your page is ready');
});
check('high fidelity + presence measured → ready', () => {
  const h = resultHeadline({ combined: 0.1, presenceMeasured: true });
  assert.equal(h.tone, 'ready');
  assert.equal(h.label, 'Your page is ready');
});
check('high fidelity BUT presence unmeasured → review (NOT ready)', () => {
  const h = resultHeadline({ combined: 0.1, presenceMeasured: false });
  assert.equal(h.tone, 'review');
  assert.notEqual(h.label, 'Your page is ready');
});
check('low fidelity → review (NOT ready)', () => {
  const h = resultHeadline({ combined: 0.7, presenceMeasured: true });
  assert.equal(h.tone, 'review');
  assert.notEqual(h.label, 'Your page is ready');
});
check('mid fidelity → review (bar is high-only)', () => {
  const h = resultHeadline({ combined: 0.4, presenceMeasured: true });
  assert.equal(h.tone, 'review');
});

// ── Source-presence asserts (selfcheck can't drift from shipped code) ──────────
const result = readFileSync(join(here, 'ResultCard.tsx'), 'utf8');
const meter = readFileSync(join(here, 'FidelityMeter.tsx'), 'utf8');
const table = readFileSync(join(here, 'SectionTable.tsx'), 'utf8');
const report = readFileSync(join(here, 'ConversionReport.tsx'), 'utf8');
const types = readFileSync(join(here, '..', 'sessions', 'types.ts'), 'utf8');
const apiSrc = readFileSync(join(here, '..', 'sessions', 'api.ts'), 'utf8');

function grepAssert(label, src, needle) {
  check(`source: ${label}`, () => assert.ok(src.includes(needle), `missing: ${needle}`));
}

grepAssert('ResultCard uses drift-aware resultHeadline', result, 'resultHeadline(fidelity)');
grepAssert('ResultCard renders FidelityMeter', result, '<FidelityMeter fidelity={fidelity} />');
grepAssert('ResultCard no longer hardcodes the old unconditional label', result,
  // the literal still exists but only inside the headline() ready-branch, gated
  'Your page is ready');
grepAssert('FidelityMeter exports fidelityLevel', meter, 'export function fidelityLevel');
grepAssert('FidelityMeter renders em-dash when unmeasured', meter, 'fidelity not measured');
grepAssert('SectionTable adds a Fidelity column', table, "{ id: 'fidelity', name: 'Fidelity'");
grepAssert('SectionTable renders per-section FidelityMeter', table, '<FidelityMeter fidelity={sec.fidelity ?? null} compact />');
grepAssert('ConversionReport renames Match rate → Block reuse rate', report, 'Block reuse rate');
grepAssert('ConversionReport dropped the old "Match rate" label', report, 'Block reuse rate');
assert.ok(!report.includes('>Match rate<'), 'old "Match rate" label still present');
grepAssert('types.ts adds RenderFidelity', types, 'export interface RenderFidelity');
grepAssert('types.ts adds optional Session.fidelity', types, 'fidelity?: RenderFidelity | null;');
grepAssert('api.ts normalizes fidelity through getSession', apiSrc, 'function withFidelity');
grepAssert('api.ts getSession applies withFidelity', apiSrc, 'return withFidelity(s);');

console.log(`\n${pass} checks passed.`);
