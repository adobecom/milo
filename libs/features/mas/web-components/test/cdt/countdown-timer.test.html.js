// @ts-nocheck
import { runTests } from '@web/test-runner-mocha';
import { expect } from '@esm-bundle/chai';

import { mockLana } from '/test/mocks/lana.js';
import { mockFetch } from '/test/mocks/fetch.js';
import { mockConfig } from '/test/mocks/config.js';
import mas from './mocks/mas.js';

import '../src/cdt/countdown-timer.js';

import { appendMiloStyles } from './utils.js';
import { mockIms } from './mocks/ims.js';

const skipTests = sessionStorage.getItem('skipTests');

runTests(async () => {
    mockIms();
    mockLana();
    await mockFetch();
    await mas();
    if (skipTests !== null) {
        appendMiloStyles();
        return;
    }
    describe('countdown timer web component', () => {
        it('should display merch mnemonic list', async () => {
            expect(document.querySelector('countdown-timer')).to.exist;
        });
    });
});
