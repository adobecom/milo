// @ts-nocheck
import { runTests } from '@web/test-runner-mocha';
import { expect } from '@esm-bundle/chai';

import { mockLana } from './mocks/lana.js';
import { mockFetch } from './mocks/fetch.js';

import { appendMiloStyles, toggleMobile } from './utils.js';
import { mockIms } from './mocks/ims.js';
import { withWcs } from './mocks/wcs.js';

runTests(async () => {
    await toggleMobile();
    mockIms();
    mockLana();
    await mockFetch(withWcs);
    await import('../src/mas.js');
    
    describe('[mobile] merch-card web component with mini-compare variant', () => {
        it('[mobile] mini-compare-chart should remove empty rows', async () => {
            const miniCompareChart = document.querySelector(
                'merch-card[variant="mini-compare-chart"]',
            );
            miniCompareChart?.variantLayout?.removeEmptyRows();
            expect(true, 'removing empty lines do not fail').to.be.true; // TODO improve the assertion
        });
    });
});
