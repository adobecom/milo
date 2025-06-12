// @ts-nocheck
import { runTests } from '@web/test-runner-mocha';

import { mockLana } from './mocks/lana.js';
import { mockFetch } from './mocks/fetch.js';

import { appendMiloStyles } from './utils.js';
import { mockIms } from './mocks/ims.js';
import { withWcs } from './mocks/wcs.js';

const skipTests = sessionStorage.getItem('skipTests');

runTests(async () => {
    mockIms();
    mockLana();
    await mockFetch(withWcs);
    await import('../src/mas.js');
    if (skipTests !== null) {
        appendMiloStyles();
        return;
    }
    describe('merch-card web component with inline-heading(BACOM) variant', () => {});
});
