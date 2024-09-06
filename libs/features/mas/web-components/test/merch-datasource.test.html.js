import { runTests } from '@web/test-runner-mocha';
import chai from '@esm-bundle/chai';
import chaiAsPromised from '@esm-bundle/chai-as-promised';

import { mockFetch } from './mocks/fetch.js';
import { withWcs } from './mocks/wcs.js';
import { withAem } from './mocks/aem.js';
import mas from './mas.js';
import { getTemplateContent } from './utils.js';

chai.use(chaiAsPromised);
const expect = chai.expect;

runTests(async () => {
    const [cc, photoshop] = await fetch(
        'mocks/sites/cf/fragments/search/default.json',
    )
        .then((res) => res.json())
        .then(({ items }) => items);

    await mas();
    await customElements.whenDefined('merch-datasource');
    const { cache } = document.createElement('merch-datasource');

    describe('merch-datasource web component', () => {
        let aemMock;

        beforeEach(async () => {
            [, aemMock] = await mockFetch(withWcs, withAem);
            cache.clear();
        });

        it('has fragment cache', async () => {
            expect(cache).to.exist;
            expect(cache.has('/test')).to.false;
            cache.add({ path: '/test', test: 1 });
            expect(cache.has('/test')).to.true;
            cache.clear();
            expect(cache.has('/test')).to.false;
        });

        it('renders a merch card from cache', async () => {
            cache.add(cc, photoshop);
            const [ccCard, photoshopCard] = getTemplateContent('cards');
            document.querySelector('main').append(ccCard, photoshopCard);
            expect(aemMock.count).to.equal(0);
        });

        it('re-renders a card after clearing the cache', async () => {
            const [, , ccCard] = getTemplateContent('cards'); //special offers students-and-teachers.
            const dataSource = ccCard.querySelector('merch-datasource');

            document.querySelector('main').append(ccCard);
            await dataSource.updateComplete;
            const before = ccCard.innerHTML;
            ccCard.footerSlot.test = true;
            await dataSource.refresh(true);
            await dataSource.refresh(true); // for extra coverage
            await dataSource.updateComplete;
            const after = ccCard.innerHTML;
            expect(before).to.equal(after);
            expect(ccCard.footerSlot.test).to.undefined;
            expect(aemMock.count).to.equal(2);
        });

        it('ignores incomplete markup', async () => {
            const [, , , cardWithMissingPath] = getTemplateContent('cards');
            const dataSource =
                cardWithMissingPath.querySelector('merch-datasource');

            document.querySelector('main').append(cardWithMissingPath);
            await expect(dataSource.updateComplete).to.be.rejectedWith('datasource is not correctly configured',
            );
        });
    });
});
