#!/usr/bin/env node
// Reference-integrity check for the .pinata/ tenant contract.
//
// Checks that the contract files parse with their required shapes, that
// gates.yaml does not weaken the vendored org floor (floor/gates.yaml), and that
// every mental-model id in manifest.yaml exists in the shared registry
// (Adobe-acom/pinata-tool-shelf). Contract-shape problems always fail. The
// registry check only warns when the registry cannot be cloned (e.g. no token in
// CI). Pass --skip-registry to skip the clone.
//
// Usage: node .pinata/scripts/check-contract.mjs [--skip-registry]
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const PINATA = join(dirname(fileURLToPath(import.meta.url)), '..');
const REGISTRY_URL = 'https://github.com/Adobe-acom/pinata-tool-shelf.git';
const AUTONOMOUS_ROUTES = ['repair_loop', 'regenerate'];

const isMapping = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
// An unset failure_route is the strictest, same as the harness default.
const route = (gate) => gate.failure_route || 'escalate_to_human';
const isAutonomous = (gate) => AUTONOMOUS_ROUTES.includes(route(gate));

// Returns { value, errors }. value is undefined when the policy is absent or invalid.
function regenerationMax(doc, label) {
  if (!doc || !('regeneration' in doc)) return { errors: [] };
  const policy = doc.regeneration;
  if (!isMapping(policy)) return { errors: [`${label}: regeneration must be a mapping`] };
  const unknown = Object.keys(policy).filter((k) => k !== 'max_candidates').sort();
  const errors = unknown.length ? [`${label}: regeneration has unknown fields ${JSON.stringify(unknown)}`] : [];
  const value = policy.max_candidates;
  if (!Number.isInteger(value) || value < 1) {
    return { errors: [...errors, `${label}: regeneration.max_candidates must be a positive integer`] };
  }
  return { value, errors };
}

function gateFloorErrors(name, fdef, tdef) {
  if (!isMapping(tdef)) return [`gates.yaml: gate '${name}' is required by the org floor but missing (INV-3)`];
  return [
    tdef.template !== fdef.template
      && `gates.yaml: gate '${name}' changes the org floor template '${fdef.template}' to '${tdef.template}' (INV-3)`,
    (fdef.blocking ?? true) && !(tdef.blocking ?? true)
      && `gates.yaml: gate '${name}' is blocking in the org floor but advisory here (INV-3)`,
    fdef.threshold != null && (tdef.threshold == null || tdef.threshold < fdef.threshold)
      && `gates.yaml: gate '${name}' drops or lowers the org floor threshold ${fdef.threshold} (INV-3)`,
    !isAutonomous(fdef) && isAutonomous(tdef)
      && `gates.yaml: gate '${name}' downgrades the org floor failure_route to autonomous ${route(tdef)} (INV-3)`,
    (fdef.require_human ?? true) && !(tdef.require_human ?? true)
      && `gates.yaml: gate '${name}' drops require_human, which the org floor mandates (INV-3)`,
  ].filter(Boolean);
}

// INV-3: tenant gates may only tighten the org floor, never weaken it.
function floorErrors(gates, floor) {
  const tenant = regenerationMax(gates, 'gates.yaml');
  const base = regenerationMax(floor, 'floor/gates.yaml');
  const ceiling = tenant.value > base.value
    ? [`gates.yaml: regeneration.max_candidates ${tenant.value} exceeds the org floor ceiling ${base.value} (INV-3)`]
    : [];
  const tenantGates = gates.gates || {};
  return [
    ...tenant.errors,
    ...base.errors,
    ...ceiling,
    ...Object.entries(floor.gates || {})
      .flatMap(([name, fdef]) => gateFloorErrors(name, fdef, tenantGates[name])),
  ];
}

// docs: parsed contract files keyed by name, undefined when absent.
export function lintDocs({ manifest = {}, gates, floor, preview, pr }) {
  return [
    ...['org', 'product', 'repo']
      .filter((field) => !manifest[field])
      .map((field) => `manifest.yaml: missing required field '${field}'`),
    ...Object.entries(gates?.gates || {})
      .filter(([, def]) => !isMapping(def) || !def.template)
      .map(([id]) => `gates.yaml: gate '${id}' needs a template`),
    ...(gates && floor ? floorErrors(gates, floor) : []),
    ...(preview && !preview.pin_pattern ? ['preview.yaml: missing pin_pattern'] : []),
    ...(pr && !pr.template ? ['pr.yaml: missing template'] : []),
  ];
}

const CONTRACT_FILES = {
  manifest: 'manifest.yaml',
  gates: 'gates.yaml',
  floor: 'floor/gates.yaml',
  preview: 'preview.yaml',
  pr: 'pr.yaml',
};

// Reads the contract files. Returns the parsed docs plus parse/shape errors.
export function readDocs(dir = PINATA) {
  const docs = {};
  const errors = [];
  Object.entries(CONTRACT_FILES).forEach(([key, name]) => {
    const path = join(dir, name);
    if (!existsSync(path)) {
      if (key === 'manifest') errors.push(`${name}: missing (required)`);
      return;
    }
    try {
      const data = yaml.load(readFileSync(path, 'utf8'));
      if (isMapping(data)) docs[key] = data;
      else errors.push(`${name}: must be a mapping`);
    } catch (e) {
      errors.push(`${name}: malformed YAML: ${e.message}`);
    }
  });
  return { docs, errors };
}

export const danglingIds = (ids, available) => ids
  .filter((i) => !available.includes(i))
  .map((i) => `manifest.yaml: mental_models.use id '${i}' not in the registry (available: ${available.join(', ')})`);

// Edge: clones the registry. Returns { available } or { warning }.
function fetchRegistryIds() {
  const tmp = mkdtempSync(join(tmpdir(), 'pinata-registry-'));
  try {
    execFileSync('git', ['clone', '--depth', '1', REGISTRY_URL, tmp], { stdio: 'pipe', timeout: 120000 });
    const available = readdirSync(join(tmp, 'mental-models'), { withFileTypes: true })
      .filter((d) => d.isDirectory()).map((d) => d.name).sort();
    return { available };
  } catch (e) {
    return { warning: `could not clone the mental-model registry, id check skipped:\n${String(e.stderr).slice(-300)}` };
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

function main() {
  const { docs, errors: readErrors } = readDocs();
  const ids = (docs.manifest?.mental_models?.use || []).map(String);
  const registry = ids.length && !process.argv.includes('--skip-registry') ? fetchRegistryIds() : {};
  const warnings = [
    !docs.floor && 'no .pinata/floor/gates.yaml snapshot, INV-3 strictness lint skipped',
    registry.warning,
  ].filter(Boolean);
  const errors = [
    ...readErrors,
    ...lintDocs(docs),
    ...(registry.available ? danglingIds(ids, registry.available) : []),
  ];
  warnings.forEach((w) => console.log(`WARN: ${w}`));
  if (errors.length) {
    console.log('pinata contract check FAILED:');
    errors.forEach((e) => console.log(`  - ${e}`));
    process.exit(1);
  }
  console.log('pinata contract check passed');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
