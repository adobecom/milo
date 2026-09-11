// Registry-sanity for rules.yaml: this is the only test that consumes the rule
// file directly. It does NOT validate page output (the golden cases do that and
// runtime/crawler validation lives elsewhere) — it guards rules.yaml against
// drift, so the single source of truth stays internally consistent and stays
// in sync with the implementation symbols it claims to be implemented by.
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import yaml from 'js-yaml';

import { CHECKABLE_RULES } from './validate.js';

const RULES_PATH = '../../../libs/features/jsonld-graph-manager/rules.yaml';
const SRC_PATH = '../../../libs/features/jsonld-graph-manager/jsonld-graph-manager.js';

const SEVERITIES = new Set(['error', 'warn', 'info']);
const STATUSES = new Set(['active', 'partial', 'unimplemented', 'proposed', 'retired']);
const ARRAY_FIELDS = ['applies_to', 'implements', 'tested_by', 'interacts_with'];
const REQUIRED_FIELDS = [
  'name', 'section', 'severity', 'requirement',
  ...ARRAY_FIELDS, 'status', 'last_updated',
];

// Leading identifier of an `implements` entry: strip dotted member access,
// trailing parenthetical descriptions, and inline prose. e.g.
//   "JsonLdGraphManager.rebuild (sources Map)" -> "JsonLdGraphManager"
//   "RULES.SoftwareApplication.linksBack"       -> "RULES"
const leadingSymbol = (entry) => String(entry).trim().split(/[ .(]/)[0];

let rules;
let declared;

before(async () => {
  rules = yaml.load(await readFile({ path: RULES_PATH }));
  // Top-level declarations (exported or internal) in the implementation, so an
  // `implements` reference to an internal const like RULES still resolves.
  const src = await readFile({ path: SRC_PATH });
  declared = new Set();
  const decl = /(?:export\s+)?(?:async\s+)?(?:function|const|let|class)\s+([A-Za-z_$][\w$]*)/g;
  for (const m of src.matchAll(decl)) declared.add(m[1]);
});

describe('rules.yaml registry', () => {
  it('parses to a non-empty array', () => {
    expect(rules).to.be.an('array').with.length.greaterThan(0);
  });

  it('every rule has the required fields with valid values', () => {
    rules.forEach((rule) => {
      REQUIRED_FIELDS.forEach((field) => {
        expect(rule, `${rule?.name}: missing "${field}"`).to.have.property(field);
      });
      expect(rule.name, 'name').to.be.a('string').and.not.be.empty;
      expect(rule.section, `${rule.name}: section`).to.be.a('string').and.not.be.empty;
      expect(SEVERITIES.has(rule.severity), `${rule.name}: bad severity "${rule.severity}"`).to.be.true;
      expect(String(rule.requirement).trim(), `${rule.name}: empty requirement`).to.not.equal('');
      ARRAY_FIELDS.forEach((field) => {
        expect(rule[field], `${rule.name}: "${field}" must be an array`).to.be.an('array');
      });
      expect(rule.applies_to.length, `${rule.name}: applies_to is empty`).to.be.greaterThan(0);
      expect(STATUSES.has(rule.status), `${rule.name}: bad status "${rule.status}"`).to.be.true;
      expect(rule.last_updated, `${rule.name}: last_updated must be quoted YYYY-MM-DD`).to.match(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  it('rule names are unique', () => {
    const names = rules.map((rule) => rule.name);
    const dupes = names.filter((n, i) => names.indexOf(n) !== i);
    expect(dupes, `duplicate rule names: ${dupes.join(', ')}`).to.have.length(0);
  });

  it('every interacts_with entry references an existing rule', () => {
    const names = new Set(rules.map((rule) => rule.name));
    rules.forEach((rule) => {
      rule.interacts_with.forEach((ref) => {
        expect(names.has(ref), `${rule.name}: interacts_with unknown rule "${ref}"`).to.be.true;
      });
    });
  });

  it('every implements symbol resolves to a declaration in jsonld-graph-manager.js', () => {
    rules.forEach((rule) => {
      rule.implements.forEach((entry) => {
        const symbol = leadingSymbol(entry);
        expect(
          declared.has(symbol),
          `${rule.name}: implements "${entry}" -> no "${symbol}" declared in jsonld-graph-manager.js`,
        ).to.be.true;
      });
    });
  });

  it('every validate.js predicate maps to an existing rule name', () => {
    const names = new Set(rules.map((rule) => rule.name));
    CHECKABLE_RULES.forEach((name) => {
      expect(names.has(name), `validate.js checks unknown rule "${name}"`).to.be.true;
    });
  });

  it('every rule checked by validate.js records it in tested_by', () => {
    const checkable = new Set(CHECKABLE_RULES);
    rules
      .filter((rule) => checkable.has(rule.name))
      .forEach((rule) => {
        expect(
          rule.tested_by.includes('conformance.test.js'),
          `${rule.name}: validate.js checks it but tested_by omits "conformance.test.js"`,
        ).to.be.true;
      });
  });
});
