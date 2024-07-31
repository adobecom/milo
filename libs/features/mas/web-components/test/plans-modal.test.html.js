import { runTests } from '@web/test-runner-mocha';
import { expect } from '@esm-bundle/chai';

import { mockLana } from './mocks/lana.js';
import { mockFetch } from './mocks/fetch.js';
import { mockConfig } from './mocks/config.js';

import './utils.js';
import { withWcs } from './mocks/wcs.js';
import { withLiterals } from './mocks/literals.js';
import mas from './mocks/mas.js';

const shouldSkipTests = sessionStorage.getItem('skipTests') ?? false;

runTests(async () => {
    mockLana();
    await mockFetch(withWcs, withLiterals);
    await mas();
    if (shouldSkipTests !== 'true') {
        describe('plans-modal web component', () => {
            it('should fail', async () => {
                expect(true).to.equal(true);
            });
        });
    }
});
