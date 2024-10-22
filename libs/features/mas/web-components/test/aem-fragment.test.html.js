import { runTests } from '@web/test-runner-mocha';
import chai from '@esm-bundle/chai';
import chaiAsPromised from '@esm-bundle/chai-as-promised';
import sinon from 'sinon';

import { mockFetch } from './mocks/fetch.js';
import { withWcs } from './mocks/wcs.js';
import { withAem } from './mocks/aem.js';
import { delay, getTemplateContent } from './utils.js';
import mas from './mas.js';
import '../src/merch-card.js';
import '../src/aem-fragment.js';


chai.use(chaiAsPromised);
const expect = chai.expect;

runTests(async () => {
    await mas();
    const [cc, photoshop] = await fetch(
        'mocks/sites/cf/fragments/search/authorPayload.json',
    )
        .then((res) => res.json())
        .then(({ items }) => items);

    await customElements.whenDefined('aem-fragment');
    const { cache } = document.createElement('aem-fragment');

    describe('aem-fragment web component', () => {
        let aemMock;
        let spTheme = document.querySelector('sp-theme');

        beforeEach(async () => {
            [, aemMock] = await mockFetch(withWcs, withAem);
            cache.clear();
        });

        it('has fragment cache', async () => {
            expect(cache).to.exist;
            expect(cache.has('id123')).to.false;
            cache.add({ id: 'id123', test: 1 });
            expect(cache.has('id123')).to.true;
            cache.clear();
            expect(cache.has('id123')).to.false;
        });

        it('renders a merch card from cache', async () => {
            cache.add(cc, photoshop);
            expect(aemMock.count).to.equal(0);
            const [ccCard, photoshopCard] = getTemplateContent('cards');
            spTheme.append(ccCard, photoshopCard);
            const ccdDataSource = ccCard.querySelector('aem-fragment');
            await ccdDataSource.updateComplete;
            await ccCard.updateComplete;
            expect(ccCard.querySelectorAll('[slot]')).to.have.length(5);
        });

        it('re-renders a card after clearing the cache', async () => {
            const [, , ccCard] = getTemplateContent('cards'); //special offers students-and-teachers.
            const aemFragment = ccCard.querySelector('aem-fragment');

            spTheme.append(ccCard);
            await aemFragment.updateComplete;
            await ccCard.updateComplete;
            const before = ccCard.innerHTML;
            ccCard.footerSlot.test = true;
            await aemFragment.refresh(true);
            await aemFragment.updateComplete;
            const after = ccCard.innerHTML;
            expect(before).to.equal(after);
            expect(ccCard.footerSlot.test).to.undefined;
            expect(aemMock.count).to.equal(2);
        });

        it('ignores incomplete markup', async () => {
            const [, , , cardWithMissingPath] = getTemplateContent('cards');

            let masErrorTriggered = false;
            cardWithMissingPath.addEventListener('mas:error', () => {
                masErrorTriggered = true;
            });
            const aemFragment =
                cardWithMissingPath.querySelector('aem-fragment');
            let aemErrorTriggered = false;
            aemFragment.addEventListener('aem:error', () => {
                aemErrorTriggered = true;
            });

            spTheme.append(cardWithMissingPath);
            await expect(aemFragment.updateComplete).to.be.rejectedWith(
                'AEM fragment cannot be loaded',
            );
            expect(masErrorTriggered).to.true;
            expect(aemErrorTriggered).to.true;
        });

        it('merch-card fails when aem-fragment contains incorrect merch data', async () => {
            const [, , , , , cardWithWrongOsis] = getTemplateContent('cards');

            let masErrorTriggered = false;
            cardWithWrongOsis.addEventListener('mas:error', () => {
                masErrorTriggered = true;
            });
            spTheme.append(cardWithWrongOsis);
            await expect(
              cardWithWrongOsis.querySelector('aem-fragment').updateComplete
            );
            await delay(100);          
            expect(masErrorTriggered).to.true;
        });

        it('uses ims token to retrieve a fragment', async () => {
            const [, , , , cardWithIms] = getTemplateContent('cards');
            const aemFragment = cardWithIms.querySelector('aem-fragment');
            window.adobeid = { authorize: sinon.stub() };
            spTheme.append(cardWithIms);
            expect(aemFragment.updateComplete);
            sinon.assert.calledOnce(window.adobeid.authorize);
        });
    });
});
