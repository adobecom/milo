import { runTests } from '@web/test-runner-mocha';
import { expect } from '@esm-bundle/chai';

import { mockFetch } from './mocks/fetch.js';
import { withWcs } from './mocks/wcs.js';
import mas from './mocks/mas.js';
import { getTemplateContent } from './utils.js';

runTests(async () => {
    await mockFetch(withWcs);
    await mas();
    await customElements.whenDefined('merch-datasource');
    const { cache } = document.createElement('merch-datasource');

    describe('merch-datasource web component', () => {
        it('has fragment cache', async () => {
            expect(cache).to.exist;
            expect(cache.has('/test')).to.false;
            cache.add({ path: '/test', test: 1 });
            expect(cache.has('/test')).to.true;
            cache.clear();
            expect(cache.has('/test')).to.false;
        });

        it('renders a merch card from cache', async () => {
            cache.clear();

            const searchResult = await fetch(
                '/test/mocks/sites/cf/fragments/search/default.json',
            ).then((res) => res.json());
            cache.add(...searchResult.items);

            const cards = getTemplateContent('cards');
            document.querySelector('main').append(...cards);
        });
    });
});
