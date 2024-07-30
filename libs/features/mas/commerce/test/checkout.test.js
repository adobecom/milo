import {
    CheckoutLink,
    CLASS_NAME_DOWNLOAD,
    CLASS_NAME_UPGRADE,
} from '../src/checkout-link.js';
import {
    CLASS_NAME_FAILED,
    ERROR_MESSAGE_BAD_REQUEST,
    ERROR_MESSAGE_OFFER_NOT_FOUND,
} from '../src/constants.js';
import {
    CheckoutWorkflow,
    CheckoutWorkflowStep,
    delay,
} from '../src/external.js';
import { initService, resetService } from '../src/service.js';

import { mockConfig } from './mocks/config.js';
import { mockFetch } from './mocks/fetch.js';
import { mockIms, unmockIms } from './mocks/ims.js';
import { mockLana, unmockLana } from './mocks/lana.js';
import { withLiterals } from './mocks/literals.js';
import { mockProviders } from './mocks/providers.js';
import { withWcs } from './mocks/wcs.js';
import { expect, sinon } from './utilities.js';

const HREF = 'https://test.org/';

/**
 * @param {string} wcsOsi
 * @param {Record<string, any>} options
 * @returns {Commerce.Checkout.Placeholder}
 */
function mockCheckoutLink(wcsOsi, options = {}, append = true) {
    const element = CheckoutLink.createCheckoutLink(
        { wcsOsi, ...options },
        `Buy now: ${wcsOsi}`,
    );
    if (append) document.body.append(element, document.createElement('br'));
    return element;
}

/** @type {import('sinon').SinonStub} */
let fetch;

afterEach(() => {
    document.body.innerHTML = '';
    resetService();
    unmockIms();
    unmockLana();
});

beforeEach(async () => {
    fetch = await mockFetch(withWcs, withLiterals);
    mockLana();
});

describe('class "CheckoutLink"', () => {
    it('renders link', async () => {
        await initService(mockConfig(), mockProviders());
        const checkoutLink = mockCheckoutLink('abm');
        await checkoutLink.onceSettled();
        expect(checkoutLink.href).to.equal(
            'https://commerce.adobe.com/store/email?items%5B0%5D%5Bid%5D=632B3ADD940A7FBB7864AA5AD19B8D28&cli=adobe_com&ctx=fp&co=US&lang=en',
        );
    });

    it('renders link with workflow step from settings', async () => {
        await initService(
            mockConfig({
                checkoutWorkflowStep: CheckoutWorkflowStep.SEGMENTATION,
            }),
            mockProviders(),
        );
        const checkoutLink = mockCheckoutLink('abm');
        await checkoutLink.onceSettled();
        expect(checkoutLink.href).to.equal(
            'https://commerce.adobe.com/store/segmentation?ms=COM&ot=BASE&pa=ccsn_direct_individual&cli=adobe_com&ctx=fp&co=US&lang=en',
        );
    });

    it('renders link with workflow step from dataset', async () => {
        await initService(mockConfig(), mockProviders());
        const checkoutLink = mockCheckoutLink('abm', {
            checkoutWorkflowStep: CheckoutWorkflowStep.SEGMENTATION,
        });
        await checkoutLink.onceSettled();
        expect(checkoutLink.href).to.equal(
            'https://commerce.adobe.com/store/segmentation?ms=COM&ot=BASE&pa=ccsn_direct_individual&cli=adobe_com&ctx=fp&co=US&lang=en',
        );
    });

    it('renders link with ims country', async () => {
        mockIms('CH');
        const service = await initService(mockConfig(), mockProviders());
        const checkoutLink = mockCheckoutLink('abm');
        await service.imsCountryPromise;
        await delay(1);
        await checkoutLink.onceSettled();
        expect(checkoutLink.href).to.equal(
            'https://commerce.adobe.com/store/email?items%5B0%5D%5Bid%5D=632B3ADD940A7FBB7864AA5AD19B8D28&cli=adobe_com&ctx=fp&co=CH&lang=en',
        );
    });

    it('renders link with promo from dataset', async () => {
        await initService(mockConfig(), mockProviders());
        const checkoutLink = mockCheckoutLink('abm-promo', {
            promotionCode: 'nicopromo',
        });
        await checkoutLink.onceSettled();
        expect(checkoutLink.href).to.equal(
            'https://commerce.adobe.com/store/email?items%5B0%5D%5Bid%5D=632B3ADD940A7FBB7864AA5AD19B8D28&apc=nicopromo&cli=adobe_com&ctx=fp&co=US&lang=en',
        );
        checkoutLink.dataset.promotionCode = 'testpromo';
        await checkoutLink.onceSettled();
        expect(checkoutLink.href).to.equal(
            'https://commerce.adobe.com/store/email?items%5B0%5D%5Bid%5D=632B3ADD940A7FBB7864AA5AD19B8D28&apc=testpromo&cli=adobe_com&ctx=fp&co=US&lang=en',
        );
    });

    it('renders multiple checkout links', async () => {
        await initService(mockConfig(), mockProviders());
        const abm = mockCheckoutLink('abm');
        const puf = mockCheckoutLink('puf');
        const m2m = mockCheckoutLink('m2m');
        await Promise.all([
            abm.onceSettled(),
            puf.onceSettled(),
            m2m.onceSettled(),
        ]);
        expect([abm.href, puf.href, m2m.href]).to.deep.equal([
            'https://commerce.adobe.com/store/email?items%5B0%5D%5Bid%5D=632B3ADD940A7FBB7864AA5AD19B8D28&cli=adobe_com&ctx=fp&co=US&lang=en',
            'https://commerce.adobe.com/store/email?items%5B0%5D%5Bid%5D=9E618D5A589EF8D6364DFBE02FC2C264&cli=adobe_com&ctx=fp&co=US&lang=en',
            'https://commerce.adobe.com/store/email?items%5B0%5D%5Bid%5D=257E1D82082387D152029F93C1030624&cli=adobe_com&ctx=fp&co=US&lang=en',
        ]);
    });

    it('render link with multiple OSIs', async () => {
        await initService(mockConfig(), mockProviders());
        const checkoutLink = mockCheckoutLink('abm,stock-abm', {
            quantity: '2,2',
        });
        await checkoutLink.onceSettled();
        expect(checkoutLink.href).to.equal(
            'https://commerce.adobe.com/store/email?items%5B0%5D%5Bid%5D=632B3ADD940A7FBB7864AA5AD19B8D28&items%5B0%5D%5Bq%5D=2&items%5B1%5D%5Bid%5D=7164A328080BC96CC60FEBF33F64342D&items%5B1%5D%5Bq%5D=2&cli=adobe_com&ctx=fp&co=US&lang=en',
        );
    });

    it('fails with missing offer', async () => {
        await initService(mockConfig(), mockProviders());
        const checkoutLink = mockCheckoutLink('no-offer');
        await expect(checkoutLink.onceSettled()).eventually.be.rejectedWith(
            ERROR_MESSAGE_OFFER_NOT_FOUND,
        );
    });

    it('fails with bad request', async () => {
        await initService(mockConfig(), mockProviders());
        const checkoutLink = mockCheckoutLink('xyz');
        await expect(checkoutLink.onceSettled()).eventually.be.rejectedWith(
            ERROR_MESSAGE_BAD_REQUEST,
        );
    });

    it('renders link for perpetual offers', async () => {
        await initService(mockConfig(), mockProviders());
        const checkoutLink = mockCheckoutLink('perpetual', {
            perpetual: 'true',
        });
        await checkoutLink.onceSettled();
        expect(checkoutLink.href).to.equal(
            'https://commerce.adobe.com/store/email?items%5B0%5D%5Bid%5D=C5AC20C8AAF4892B67DE2E89B26D8ACA&cli=adobe_com&ctx=fp&co=US&lang=en',
        );
        expect(fetch.lastCall.args[0]).to.contain('language=EN');

        // no more perpetual offer
        checkoutLink.dataset.perpetual = 'false';
        const promise = checkoutLink.onceSettled();
        await expect(promise).eventually.be.rejectedWith(
            ERROR_MESSAGE_OFFER_NOT_FOUND,
        );
        expect(fetch.lastCall.args[0]).to.contain('language=MULT');
    });

    it('renders link with extra options and cleans up once unset', async () => {
        await initService(mockConfig(), mockProviders());
        const checkoutLink = mockCheckoutLink('abm', {
            extraOptions: '{"mv":1, "mv2":2, "promoid": "abc"}',
        });
        await checkoutLink.onceSettled();
        expect(checkoutLink.href).to.equal(
            'https://commerce.adobe.com/store/email?items%5B0%5D%5Bid%5D=632B3ADD940A7FBB7864AA5AD19B8D28&cli=adobe_com&ctx=fp&co=US&mv=1&mv2=2&promoid=abc&lang=en',
        );
        delete checkoutLink.dataset.extraOptions;
        await checkoutLink.onceSettled();
        expect(checkoutLink.href).to.equal(
            'https://commerce.adobe.com/store/email?items%5B0%5D%5Bid%5D=632B3ADD940A7FBB7864AA5AD19B8D28&cli=adobe_com&ctx=fp&co=US&lang=en',
        );
    });

    describe('property "isCheckoutLink"', () => {
        it('returns true', async () => {
            await initService(mockConfig(), mockProviders());
            const checkoutLink = mockCheckoutLink('abm');
            expect(checkoutLink.isCheckoutLink).to.be.true;
        });
    });

    describe('method "render"', () => {
        it('returns false if element is not connected to DOM', async () => {
            await initService(mockConfig(), mockProviders());
            const checkoutLink = mockCheckoutLink('no-offer', {}, false);
            expect(await checkoutLink.render()).to.be.false;
        });
    });

    describe('method "renderOffers"', () => {
        it('returns false and does not render href if element is not connected to DOM', async () => {
            await initService(mockConfig(), mockProviders());
            const checkoutLink = mockCheckoutLink('no-offer', {}, false);
            checkoutLink.href = HREF;
            expect(await checkoutLink.renderOffers([])).to.be.false;
            expect(checkoutLink.href).to.be.equal(HREF);
        });

        it('returns false and renders failed placeholder if offers array is empty', async () => {
            await initService(mockConfig(), mockProviders());
            const checkoutLink = mockCheckoutLink('no-offer', {});
            checkoutLink.href = HREF;
            expect(await checkoutLink.renderOffers([])).to.be.true;
            expect(checkoutLink.classList.contains(CLASS_NAME_FAILED)).to.be
                .true;
            expect(checkoutLink.getAttribute('href')).to.equal('#');
        });

        it('skips rendering if version has changed', async () => {
            await initService(mockConfig(), mockProviders());
            const checkoutLink = mockCheckoutLink('no-offer', {}, false);
            checkoutLink.href = HREF;
            const version = checkoutLink.togglePending();
            checkoutLink.togglePending();
            expect(await checkoutLink.renderOffers([], {}, version)).to.be
                .false;
            expect(checkoutLink.href).to.equal(HREF);
        });
    });

    describe('method "updateOptions"', () => {
        it('updates element data attributes', async () => {
            await initService(mockConfig(), mockProviders());
            const link = CheckoutLink.createCheckoutLink({
                quantity: ['1'],
                wcsOsi: 'abm',
                upgrade: 'true',
            });
            expect(link.dataset.upgrade).to.be.equal('true');
            const options = {
                checkoutMarketSegment: 'test',
                checkoutWorkflow: CheckoutWorkflow.V3,
                checkoutWorkflowStep: CheckoutWorkflowStep.EMAIL,
                perpetual: true,
                promotionCode: 'promo',
                quantity: ['1', '2'],
                wcsOsi: ['m2m', 'puf'],
                upgrade: 'false',
            };
            link.updateOptions(options);
            const { dataset } = link;
            expect(dataset.checkoutMarketSegment).to.equal(
                options.checkoutMarketSegment,
            );
            expect(dataset.checkoutWorkflow).to.equal(options.checkoutWorkflow);
            expect(dataset.checkoutWorkflowStep).to.equal(
                options.checkoutWorkflowStep,
            );
            expect(dataset.perpetual).to.equal(String(options.perpetual));
            expect(dataset.promotionCode).to.equal(
                String(options.promotionCode),
            );
            expect(dataset.quantity).to.equal(String(options.quantity));
            expect(dataset.wcsOsi).to.equal(String(options.wcsOsi));
            expect(dataset.upgrade).to.be.equal('false');
        });
    });

    describe('static method "selectCheckoutLinks"', () => {
        it('returns list of found links', async () => {
            await initService(mockConfig(), mockProviders());
            const checkoutLink1 = mockCheckoutLink('abm');
            const checkoutLink2 = mockCheckoutLink('m2m');
            expect(CheckoutLink.getCheckoutLinks()).to.deep.equal([
                checkoutLink1,
                checkoutLink2,
            ]);
        });
    });

    describe('logged-in features', () => {
        it('renders download link', async () => {
            mockIms('US');
            await initService(
                mockConfig(),
                mockProviders({
                    checkoutAction: {
                        text: 'Download',
                        className: CLASS_NAME_DOWNLOAD,
                        url: 'https://helpx.adobe.com/download-install.html',
                    },
                }),
            );
            const checkoutLink = mockCheckoutLink('abm');
            await checkoutLink.onceSettled();
            expect(checkoutLink.textContent.trim()).to.equal('Download');
            expect(checkoutLink.classList.contains('download')).to.be.true;
            expect(checkoutLink.getAttribute('href')).to.equal(
                'https://helpx.adobe.com/download-install.html',
            );
        });

        it('renders upgrade button', async () => {
            mockIms('US');
            const handler = sinon.stub();
            await initService(
                mockConfig(),
                mockProviders({
                    checkoutAction: {
                        text: 'Upgrade',
                        className: CLASS_NAME_UPGRADE,
                        handler,
                    },
                }),
            );
            const checkoutLink = mockCheckoutLink('abm');
            await checkoutLink.onceSettled();
            expect(checkoutLink.classList.contains('upgrade')).to.be.true;
            checkoutLink.click();
            expect(checkoutLink.textContent.trim()).to.equal('Upgrade');
            sinon.assert.calledOnce(handler);
            expect(checkoutLink.getAttribute('href')).to.equal('#');
        });

        it('skips entitlements check', async () => {
            await initService(mockConfig(), mockProviders());
            const checkoutLink = mockCheckoutLink('abm');
            checkoutLink.dataset.entitlement = 'false';
            await checkoutLink.onceSettled();
            expect(checkoutLink.textContent.trim()).to.equal('Buy now: abm');
            expect(checkoutLink.getAttribute('href')).to.equal(
                'https://commerce.adobe.com/store/email?items%5B0%5D%5Bid%5D=632B3ADD940A7FBB7864AA5AD19B8D28&cli=adobe_com&ctx=fp&co=US&lang=en',
            );
        });
    });
});

describe('commerce service', () => {
    describe('function "buildCheckoutURL"', () => {
        it('returns empty string if no offers provided', async () => {
            const { buildCheckoutURL } = await initService(
                mockConfig(),
                mockProviders(),
            );
            expect(buildCheckoutURL([])).to.be.empty;
        });
    });
});
