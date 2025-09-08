import { runTests } from '@web/test-runner-mocha';
import chaiAsPromised from '@esm-bundle/chai-as-promised';
import chai, { expect } from '@esm-bundle/chai';

import { mockFetch } from './mocks/fetch.js';
import { withWcs } from './mocks/wcs.js';
import { withAem } from './mocks/aem.js';
import { delay, getTemplateContent, oneEvent } from './utils.js';
import '../src/mas.js';
import {
    EVENT_MAS_ERROR,
    EVENT_MAS_READY,
    EVENT_TYPE_FAILED,
} from '../src/constants.js';

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

function addFragment(fragment, loading) {
    const aemFragment = document.createElement('aem-fragment');
    aemFragment.setAttribute('fragment', fragment);
    if (loading) {
        aemFragment.setAttribute('loading', loading);
    }
    document.body.appendChild(aemFragment);
    return aemFragment;
}

function compareSettings(fragment, settings) {
    expect(fragment.settings).include(settings);
}

function comparePlaceholders(fragment, placeholders) {
    expect(fragment.placeholders).include(placeholders);
}

function compareDictionary(fragment, dictionary) {
    expect(fragment.dictionary).include(dictionary);
}

function comparePriceLiterals(fragment, priceLiterals) {
    expect(fragment.priceLiterals).include(priceLiterals);
}

runTests(async () => {
    const [cc] = await Promise.all([
        fetch('mocks/sites/fragments/fragment-cc-all-apps.json').then((res) =>
            res.json(),
        ),
    ]);

    const { cache } = customElements.get('aem-fragment');

    describe('aem-fragment', () => {
        let aemMock;
        let spTheme = document.querySelector('sp-theme');
        beforeEach(async () => {
            [, aemMock] = await mockFetch(withWcs, withAem);
            cache.clear();
        });

        describe('aem-fragment core functionality', () => {
            it('has fragment cache', async () => {
                expect(cache).to.exist;
                expect(cache.has('id123')).to.false;
                cache.add({ id: 'id123', test: 1 });
                expect(cache.has('id123')).to.true;
                cache.clear();
                expect(cache.has('id123')).to.false;
            });

            it('caches localized fragment by requested(en_US) id', async () => {
                expect(cache).to.exist;
                expect(cache.has('id123en_US')).to.false;
                cache.add({ id: 'id567', fields: { originalId: 'id123en_US' }, test: 1 });
                expect(cache.has('id123en_US')).to.true;
                cache.clear();
                expect(cache.has('id123en_US')).to.false;
            });

            it('ignores references if not an object', async () => {
              cache.clear();
              expect(cache).to.exist;
              cache.add({ id: 'id123', test: 1, references: [{type: 'content-fragment', value: {id: 'ref123'}}] });
              expect(cache.has('id123')).to.true;
              expect(cache.has('ref123')).to.false;
              cache.clear();
            });

            it('ignores references if asked explicitly', async () => {
              cache.clear();
              expect(cache).to.exist;
              cache.add({ id: 'id123', test: 1, references: { 'ref123': {type: 'content-fragment', value: {id: 'ref123'}} } });
              expect(cache.has('ref123')).to.true;
              cache.add({ id: 'id456', test: 1, references: { 'ref456': {type: 'content-fragment', value: {id: 'ref456'}} } }, false);
              expect(cache.has('ref456')).to.false;
              cache.clear();
            });
        });

        describe('aem-fragment with merch-card', () => {
            it('renders a merch card from cache', async () => {
                cache.add(cc);
                expect(aemMock.count).to.equal(0);

                const [ccCard] = getTemplateContent('cards');
                spTheme.append(ccCard);

                const ccAemFragment = ccCard.querySelector('aem-fragment');
                await ccAemFragment.updateComplete;

                // Check that the aem-fragment has no error class
                expect(ccAemFragment.classList.contains('error')).to.be.false;

                await ccCard.updateComplete;
                const slotElements = ccCard.querySelectorAll('[slot]');

                expect(slotElements).to.have.length(4);
            });

            it('re-renders a card after clearing the cache', async () => {
                const [, , ccCard] = getTemplateContent('cards');
                spTheme.append(ccCard);
                const aemFragment = ccCard.querySelector('aem-fragment');

                await aemFragment.updateComplete;
                await ccCard.checkReady();

                const before = ccCard.innerHTML;

                let footerSlot = getSlotElement(ccCard, 'footer');
                expect(footerSlot).to.exist;
                footerSlot.setAttribute('test', 'true');

                await aemFragment.refresh();
                await ccCard.checkReady();
                footerSlot = getSlotElement(ccCard, 'footer');
                const after = ccCard.innerHTML;
                expect(before).to.equal(after);
                expect(footerSlot.getAttribute('test')).to.be.null;
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
                const [, , , cardWithMissingFragmentId] =
                    getTemplateContent('cards');

                let masErrorTriggered = false;
                cardWithMissingFragmentId.addEventListener('mas:error', (e) => {
                    if (e.target.tagName === 'MERCH-CARD') {
                        masErrorTriggered = true;
                    }
                });

                const aemFragment =
                    cardWithMissingFragmentId.querySelector('aem-fragment');
                let aemErrorTriggered = false;
                aemFragment.addEventListener('aem:error', (e) => {
                    if (e.target.tagName === 'AEM-FRAGMENT') {
                        aemErrorTriggered = true;
                    }
                });

                spTheme.append(cardWithMissingFragmentId);

                await expect(aemFragment.updateComplete).to.be.rejectedWith(
                    'AEM fragment cannot be loaded',
                );
                expect(masErrorTriggered).to.true;
                expect(aemErrorTriggered).to.true;
            });

            it('merch-card fails when aem-fragment contains incorrect merch data', async () => {
                const [, , , , , cardWithWrongOsis] =
                    getTemplateContent('cards');
                let masErrorTriggered = oneEvent(
                    cardWithWrongOsis,
                    EVENT_MAS_ERROR,
                ).then(() => true);
                spTheme.append(cardWithWrongOsis);
                const aemFragment =
                    cardWithWrongOsis.querySelector('aem-fragment');
                await aemFragment.updateComplete;
                await cardWithWrongOsis.checkReady();
                expect(await masErrorTriggered).to.true;
            });

            it('renders ccd slice card', async () => {
                const [, , , , , , sliceCard] = getTemplateContent('cards');
                spTheme.append(sliceCard);
                const masReady = oneEvent(sliceCard, EVENT_MAS_READY);
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
                const { detail } = await masReady;
                expect(detail).to.have.property('measure');
            });

            it('merch-card dispatches mas:ready after refresh', async () => {
                const [, , , , , , sliceCard] = getTemplateContent('cards');
                spTheme.append(sliceCard);
                let masReady = await oneEvent(sliceCard, EVENT_MAS_READY);
                expect(masReady).to.exist;
                masReady = null;
                const aemFragment = sliceCard.querySelector('aem-fragment');
                await aemFragment.refresh();
                masReady = await oneEvent(sliceCard, EVENT_MAS_READY);
                expect(masReady).to.exist;
            });

            it('merch-card does not dispatch mas:ready after being reconnected to DOM', async () => {
                const [div] = getTemplateContent('merch-card-reconnect');
                const card = div.querySelector('merch-card');
                spTheme.append(div);
                let masReadyEvent = await oneEvent(card, EVENT_MAS_READY);
                expect(masReadyEvent).to.exist;
                card.remove();
                await delay(1);
                masReadyEvent = undefined;
                div.append(card);
                try {
                    masReadyEvent = await oneEvent(card, EVENT_MAS_READY, 100);
                } catch {
                    // expected
                } finally {
                    expect(masReadyEvent).to.be.undefined;
                }
            });

            it('merch-card fails with mas:fail & mas:error if wcs fails', async () => {
                const [card] = getTemplateContent('merch-wcs-fail');
                spTheme.append(card);
                let masFailEvent;
                let masErrorEvent;
                try {
                    masFailEvent = await oneEvent(card, EVENT_TYPE_FAILED);
                    masErrorEvent = await oneEvent(card, EVENT_MAS_ERROR);
                } catch (e) {
                    // expected
                } finally {
                    expect(masFailEvent).to.exist;
                    expect(masErrorEvent).to.exist;
                }
            });

            it('fechInfo is avaiable for a new aem-fragment that is hydrated from cache', async () => {
                const cache = document.createElement('aem-fragment').cache;
                cache.clear();
                const count = aemMock.count;
                let fragment = addFragment('fragment-cc-all-apps');
                await fragment.updateComplete;
                expect(aemMock.count).to.equal(count + 1);
                expect(fragment.fetchInfo['aem-fragment:measure']).to.exist;
                fragment.remove();
                fragment = addFragment('fragment-cc-all-apps');
                await fragment.updateComplete;
                expect(aemMock.count).to.equal(count + 1);
                expect(fragment.fetchInfo['aem-fragment:measure']).to.exist;
            });

            it('populates the fragment cache from references', async () => {
                const topCollection = addFragment('collection');
                await oneEvent(topCollection, 'aem:load');
                const topCollectionData = cache.get('collection');
                const settingsBase = {
                    displayPlanType: true,
                };
                const placeholdersBase = {};
                const dictionaryBase = {};
                const priceLiteralsBase = {
                    planTypeLabel:
                        '{planType, select, ABM {Annual, paid monthly.} other {}}',
                };

                const childCollection1 = cache.get(
                    'enUS82d1-0acb-4a6d-8155-e5b002acffdf',
                );
                const childCollection2 = cache.get(
                    'enUSb2de-4963-42f2-a0d0-d158bd78e404',
                );
                [topCollectionData, childCollection1, childCollection2].forEach(
                    (collection) => {
                        compareSettings(collection, settingsBase);
                        comparePlaceholders(collection, placeholdersBase);
                        compareDictionary(collection, dictionaryBase);
                        comparePriceLiterals(collection, priceLiteralsBase);
                    },
                );

                const childCollection3 = cache.get(
                    'enUSc155-8081-4d9b-8215-a4fb0b8418dd',
                );
                compareSettings(childCollection3, {
                    ...settingsBase,
                    displayPlanType: false,
                });
                comparePlaceholders(childCollection3, placeholdersBase);
                compareDictionary(childCollection3, dictionaryBase);
                comparePriceLiterals(childCollection3, priceLiteralsBase);

                const card1 = cache.get('enUS5d11-fe6b-40f8-96d1-50ac800c9f70');
                const card2 = cache.get('enUS8fc3-578e-44be-be4f-d8be1c45c75b');
                const card3 = cache.get('enUS1223-be01-4c0e-9a97-f63e8d0458e9');
                const card4 = cache.get('enUS265d-2542-4533-8089-b75fb19d28d8');
                const card6 = cache.get('enUS3a5c-b4a4-4305-bda5-92be2662fbab');
                const card7 = cache.get('enUS0932-c802-49e4-8589-f8bcf6bfe98c');
                const card8 = cache.get('enUS3a5c-b4a4-4305-bda5-92be2662fbab');

                [card1, card2, card3, card4, card6, card7, card8].forEach(
                    (card) => {
                        compareSettings(card, settingsBase);
                        comparePlaceholders(card, placeholdersBase);
                        compareDictionary(card, dictionaryBase);
                        comparePriceLiterals(card, priceLiteralsBase);
                    },
                );

                const card5 = cache.get('enUS0b82-24e6-4ca7-a08d-577a3ad6ebda');
                compareSettings(card5, {
                    ...settingsBase,
                    displayPlanType: false,
                });
            });

            it('supports hydrating from a collection fragment', async () => {
                const topCollection = addFragment('collection');
                const card = addFragment(
                    'ca835d11-fe6b-40f8-96d1-50ac800c9f70',
                    'cache',
                );
                await oneEvent(card, 'aem:load');
                expect(aemMock.count).to.equal(1);
            });
        });

        describe('getFragmentById', async () => {
            it('throws an error if response is not ok', async () => {
                const aemFragment = addFragment('notfound');
                const event = oneEvent(aemFragment, 'aem:error');
                const { detail } = await event;
                expect(detail.message).to.equal(
                    'Failed to fetch fragment: Unexpected fragment response',
                );
                expect(aemFragment.fetchInfo).to.include({
                    'aem-fragment:status': 404,
                    'aem-fragment:url':
                        'http://localhost:2023/mas/io/fragment?id=notfound&api_key=wcms-commerce-ims-ro-user-milo&locale=en_US',
                    'aem-fragment:serverTiming':
                        'cdn-cache|desc=HIT|edge|dur=1|sis|desc=0|ak_p|desc="1748272422155_390603879_647296830_1088_9412_44_0_219"|dur=1',
                });
            });

            it('fetches fragment from freyja on publish', async () => {
                const aemFragment = addFragment('fragment-cc-all-apps');
                await aemFragment.updateComplete;

                cache.clear();
                document.querySelector('meta[name="mas-io-url"]').remove();
                const masCommerceService = document.querySelector(
                    'mas-commerce-service',
                );
                masCommerceService.activate();
                addFragment('fragment-cc-all-apps');
                await aemFragment.updateComplete;
                expect(fetch.lastCall.firstArg).to.equal(
                    'https://www.stage.adobe.com/mas/io/fragment?id=fragment-cc-all-apps&api_key=wcms-commerce-ims-ro-user-milo&locale=en_US',
                );
            });
            it('fetches fragment from freyja on publish with overriden country', async () => {
                cache.clear();
                const masCommerceService = document.querySelector(
                    'mas-commerce-service',
                );
                masCommerceService.setAttribute('country', 'CA');
                masCommerceService.setAttribute('locale', 'en_US');
                masCommerceService.activate();
                const aemFragment = addFragment('fragment-cc-all-apps');
                await aemFragment.updateComplete;
                expect(fetch.lastCall.firstArg).to.equal(
                    'https://www.stage.adobe.com/mas/io/fragment?id=fragment-cc-all-apps&api_key=wcms-commerce-ims-ro-user-milo&locale=en_US&country=CA',
                );
            });
        });
    });
});
