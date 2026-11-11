// Conformance: run each fixture through the live manager and assert the emitted
// @graph has zero error-severity violations per validate.js (severity sourced
// from rules.yaml). This is the rules-file-driven test — where the golden cases
// pin the exact output, this asserts *why* the output is valid by rule, and the
// same validate() is what the offline crawler will run over rendered pages.
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import yaml from 'js-yaml';

import { validate } from './validate.js';
import {
  setupSuite,
  loadFixtureIntoHead,
  trackedManager,
  getManagedGraph,
} from './helpers.js';

const RULES_PATH = '../../../libs/features/jsonld-graph-manager/rules.yaml';
const FIXTURES = ['editorial', 'product', 'multi-producer', 'merch-card'];

let rules;

before(async () => {
  rules = yaml.load(await readFile({ path: RULES_PATH }));
});

describe('graph conformance', () => {
  setupSuite();

  FIXTURES.forEach((name) => {
    it(`${name}: live managed graph has no error-severity violations`, async () => {
      await loadFixtureIntoHead(name);
      const manager = trackedManager();
      manager.init();

      const errors = validate(getManagedGraph(), rules).filter((v) => v.severity === 'error');
      expect(errors, `unexpected violations:\n${JSON.stringify(errors, null, 2)}`).to.have.length(0);
    });
  });
});

// A validator that never fails is worthless — prove it catches the classes of
// bug the rules exist to prevent (including the dangling-ref regression the
// Product->SoftwareApplication transform fix addressed).
describe('validate.js self-check', () => {
  it('rejects application child references and ID-bearing nested entities', () => {
    const violations = validate([
      {
        '@type': 'SoftwareApplication',
        '@id': 'https://x.test/p#softwareapplication',
        offers: [{ '@id': 'https://x.test/p#offer' }],
        aggregateRating: {
          '@type': 'AggregateRating',
          '@id': 'https://x.test/p#rating',
          ratingValue: '4.5',
          ratingCount: '200',
        },
      },
      { '@type': 'Offer', '@id': 'https://x.test/p#offer', price: '0' },
    ], rules).filter((v) => v.rule === 'softwareapplication-nested-entities');
    expect(violations).to.have.length(2);
  });

  it('checks quality thresholds on nested application ratings', () => {
    const flagged = new Set(validate([{
      '@type': 'WebApplication',
      '@id': 'https://x.test/p#softwareapplication',
      aggregateRating: { '@type': 'AggregateRating', ratingValue: '3.9', ratingCount: '99' },
    }], rules).map((v) => v.rule));
    expect(flagged.has('aggregaterating-min-rating-value')).to.be.true;
    expect(flagged.has('aggregaterating-min-rating-count')).to.be.true;
  });

  it('reports dangling refs, duplicate ids, missing baseline, and missing isPartOf', () => {
    const broken = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          '@id': 'https://x.test/p#webpage',
          publisher: { '@id': 'https://x.test/#organization' },
          mainEntity: { '@id': 'https://x.test/p#article' },
        },
        {
          '@type': 'Article',
          '@id': 'https://x.test/p#article',
          isPartOf: { '@id': 'https://x.test/p#webpage' },
          about: { '@id': 'https://x.test/p#ghost' },
        },
        { '@type': 'Article', '@id': 'https://x.test/p#article' },
      ],
    };

    const flagged = new Set(validate(broken, rules).map((v) => v.rule));
    expect(flagged.has('nodes-referenced-by-id'), 'dangling #ghost / #organization').to.be.true;
    expect(flagged.has('unique-node-ids'), 'duplicate #article').to.be.true;
    expect(flagged.has('manager-baseline-graph'), 'no Organization node').to.be.true;
    expect(flagged.has('primary-type-ispartof'), 'second Article lacks isPartOf').to.be.true;
  });
});
