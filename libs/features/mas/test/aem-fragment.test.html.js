import { runTests } from '@web/test-runner-mocha';
import chaiAsPromised from '@esm-bundle/chai-as-promised';
import chai, { expect } from '@esm-bundle/chai';

import { mockFetch } from './mocks/fetch.js';
import { withWcs } from './mocks/wcs.js';
import { withAem } from './mocks/aem.js';
import { delay, getTemplateContent } from './utils.js';
import mas from './mas.js';
import '../src/merch-card.js';
import '../src/aem-fragment.js';
import { EVENT_MAS_ERROR } from '../src/constants.js';
import { getFragmentById } from '../src/aem-fragment.js';
import { MasError } from '../src/mas-error.js';

chai.use(chaiAsPromised);

/**
 * Queries either the light DOM or shadow DOM for a `[slot="..."]` attribute.
 * @param {HTMLElement} root The root element (e.g., a merch card)
 * @param {string} slotName The name of the slot to query for
 * @returns {HTMLElement|null}
 */
function getSlotElement(root, slotName) {
    // Check shadowRoot first, if it exists
    const fromShadow = root.shadowRoot?.querySelector(`[slot="${slotName}"]`);
    if (fromShadow) return fromShadow;
    // Otherwise, check light DOM
    return root.querySelector(`[slot="${slotName}"]`);
}

/**
 * Queries either the light DOM or shadow DOM for a CSS selector.
 * @param {HTMLElement} root The root element
 * @param {string} selector A valid CSS selector string
 * @returns {HTMLElement|null}
 */
function getSelectorElement(root, selector) {
    const fromShadow = root.shadowRoot?.querySelector(selector);
    if (fromShadow) return fromShadow;
    return root.querySelector(selector);
}

runTests(async () => {
    await mas();
    const [cc, photoshop] = await Promise.all([
        fetch('mocks/sites/fragments/fragment-cc-all-apps.json').then(
            (res) => res.json(),
        ),
        fetch('mocks/sites/fragments/fragment-photoshop.json').then((res) =>
            res.json(),
        ),
    ]);

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
            cache.add('id123', { id: 'id123', test: 1 });
            expect(cache.has('id123')).to.true;
            cache.clear();
            expect(cache.has('id123')).to.false;
        });

        it('caches localized fragment by requested(en_US) id', async () => {
          expect(cache).to.exist;
          expect(cache.has('id123en_US')).to.false;
          cache.addByRequestedId('id123en_US', { id: 'id567', test: 1 });
          expect(cache.has('id123en_US')).to.true;
          cache.clear();
          expect(cache.has('id123en_US')).to.false;
        });

        it('renders a merch card from cache', async () => {
            cache.add(cc);
            expect(aemMock.count).to.equal(0);

            const [ccCard] = getTemplateContent('cards');
            spTheme.append(ccCard);

            const ccdDataSource = ccCard.querySelector('aem-fragment');
            await ccdDataSource.updateComplete;
            await delay(100);

            // Check that the aem-fragment has no error class
            expect(ccdDataSource.classList.contains('error')).to.be.false;

            await ccCard.updateComplete;
            const slotElements = [
                ...ccCard.querySelectorAll('[slot]'),
                ...(ccCard.shadowRoot
                    ? ccCard.shadowRoot.querySelectorAll('[slot]')
                    : []),
            ];

            expect(slotElements).to.have.length(4);
        });

        it('re-renders a card after clearing the cache', async () => {
            const [, , ccCard] = getTemplateContent('cards');
            spTheme.append(ccCard);
            const aemFragment = ccCard.querySelector('aem-fragment');

            await aemFragment.updateComplete;
            await ccCard.updateComplete;

            const before = ccCard.innerHTML;

            const footerSlot = getSlotElement(ccCard, 'footer');
            expect(footerSlot).to.exist;
            footerSlot.setAttribute('test', 'true');

            await aemFragment.refresh();
            const after = ccCard.innerHTML;

            expect(before).to.equal(after);
            expect(footerSlot.getAttribute('test')).to.equal('true');
            expect(aemMock.count).to.equal(2);
        });

        it('falls back to last good data when fetch fails with same fragment ID', async () => {
            // Set up the card and load initial data
            const [ccCard] = getTemplateContent('merch-card-refresh-error');
            spTheme.append(ccCard);
            const aemFragment = ccCard.querySelector('aem-fragment');

            await ccCard.checkReady();

            // Store the initial data for comparison
            const initialData = aemFragment.data;
            expect(initialData).to.exist;

            // Trigger a refresh which should now fail
            await aemFragment.refresh();
            await delay(100);
            await aemFragment.updateComplete;

            // Verify the component still has data (fallback mechanism worked)
            expect(aemFragment.data).to.exist;
            expect(aemFragment.data).to.deep.equal(initialData);

            // Verify the component didn't show an error state
            expect(aemFragment.classList.contains('error')).to.be.false;
        });

        it('ignores incomplete markup', async () => {
            const [, , , cardWithMissingPath] = getTemplateContent('cards');

            let masErrorTriggered = false;
            cardWithMissingPath.addEventListener('mas:error', (e) => {
              if (e.target.tagName === 'MERCH-CARD') {
                masErrorTriggered = true;
              }
            });

            const aemFragment =
                cardWithMissingPath.querySelector('aem-fragment');
            let aemErrorTriggered = false;
            aemFragment.addEventListener('aem:error', (e) => {
              if (e.target.tagName === 'AEM-FRAGMENT') {
                aemErrorTriggered = true;
              }
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
            cardWithWrongOsis.addEventListener(EVENT_MAS_ERROR, (e) => {
                masErrorTriggered = true;
            });

            spTheme.append(cardWithWrongOsis);
            const aemFragment = cardWithWrongOsis.querySelector('aem-fragment');
            await aemFragment.updateComplete;
            await cardWithWrongOsis.checkReady();
            expect(masErrorTriggered).to.true;
        });

        it('renders ccd slice card', async () => {
            const [, , , , , , sliceCard] = getTemplateContent('cards');
            spTheme.append(sliceCard);
            await delay(200);

            expect(getSelectorElement(sliceCard, 'merch-icon')).to.exist;

            expect(getSlotElement(sliceCard, 'image')).to.exist;

            expect(getSlotElement(sliceCard, 'body-s')).to.exist;

            const footerSlot = sliceCard.shadowRoot
                ? sliceCard.shadowRoot.querySelector('slot[name="footer"]')
                : sliceCard.querySelector('slot[name="footer"]');
            expect(footerSlot).to.exist;

            const badge = sliceCard.shadowRoot
                ? sliceCard.shadowRoot.querySelector('div#badge')
                : sliceCard.querySelector('div#badge');
            expect(badge).to.exist;
        });
    });

    describe('getFragmentById', async () => {
        const masCommerceService = {
          settings: {
            env: 'stage',
            locale: 'fr_FR',
            wcsApiKey: 'testApiKey',
          }
        }
        beforeEach(async () => {
            await mockFetch(withAem);
            cache.clear();
        });

        it('throws an error if response is not ok', async () => {
            const promise = getFragmentById('notfound');
            try {
                await promise;
                expect.fail('Promise should have been rejected');
            } catch (error) {
                expect(error).to.be.instanceOf(MasError);
                expect(error.context).to.have.property('duration');
                expect(error.context).to.have.property('startTime');
                expect(error.context).to.include({
                    status: 404,
                    url: 'http://localhost:2023/test/notfound',
                });
            }
        });

        it('fetches fragment from freyja on publish', async () => {
            const endpoint = 'https://www.stage.adobe.com/mas/io/fragment?id=fragment-cc-all-apps&api_key=testApiKey&locale=fr_FR'
            const promise = getFragmentById(endpoint);
            await promise;
            expect(fetch.lastCall.firstArg).to.equal(
                'https://www.stage.adobe.com/mas/io/fragment?id=fragment-cc-all-apps&api_key=testApiKey&locale=fr_FR',
            );
        });
    });
});
