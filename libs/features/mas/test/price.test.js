import { ERROR_MESSAGE_OFFER_NOT_FOUND, STATE_FAILED, STATE_RESOLVED } from '../src/constants.js';
import { InlinePrice } from '../src/inline-price.js';
import { Price } from '../src/price.js';
import { getSettings } from '../src/settings.js';
import priceLiteralsJson from '../price-literals.json' with { type: 'json' };
import { equalsCaseInsensitive } from '@dexter/tacocat-core';
import { FF_DEFAULTS } from '../src/constants.js';
import { mockFetch } from './mocks/fetch.js';
import { mockLana, unmockLana } from './mocks/lana.js';
import * as snapshots from './price/__snapshots__/price.snapshots.js';
import { withWcs } from './mocks/wcs.js';
import {
    initMasCommerceService,
    expect,
    removeMasCommerceService,
} from './utilities.js';
import { MasError } from '../src/mas-error.js';
import '../src/mas.js';
import { Defaults } from '../src/defaults.js';

/**
 * @param {string} wcsOsi
 * @param {Commerce.Price.AnyOptions} options
 * @returns {Commerce.Price.Placeholder}
 */
function mockInlinePrice(id, wcsOsi = '', options = {}) {
    const element = InlinePrice.createInlinePrice({ ...options, wcsOsi });
    const p = document.createElement('p');
    p.id = id;
    p.append(element);
    document.body.append(p);
    return element;
}

before(() => {
    const metaDefaultFlag = document.createElement('meta');
    metaDefaultFlag.name = FF_DEFAULTS
    metaDefaultFlag.content = 'on';
    document.head.appendChild(metaDefaultFlag);
});

afterEach(() => {
    removeMasCommerceService();
    unmockLana();
});

beforeEach(async () => {
    await mockFetch(withWcs);
    mockLana();
});

describe('class "InlinePrice"', () => {
    it('renders price', async () => {
        await initMasCommerceService();
        const inlinePrice = mockInlinePrice('price', 'puf');
        await inlinePrice.onceSettled();
        expect(inlinePrice.outerHTML).to.be.html(snapshots.price);
        expect(inlinePrice.value).to.be.not.empty;
        expect(inlinePrice.options).to.be.not.empty;
    });

    it('re-dispatches click event', async () => {
        await initMasCommerceService();
        const inlinePrice = mockInlinePrice('puf2', 'puf');
        let targetIsInlinePrice = false;
        inlinePrice.addEventListener(
            'click',
            (event) => {
                targetIsInlinePrice = event.target === inlinePrice;
            },
            { once: true },
        );
        await inlinePrice.onceSettled();
        inlinePrice.firstElementChild.dispatchEvent(
            new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window,
            }),
        );
        expect(targetIsInlinePrice).to.be.true;
    });

    it('re-dispatches click event', async () => {
        await initMasCommerceService();
        const inlinePrice = mockInlinePrice('puf3', 'puf');
        let targetIsInlinePrice = false;
        inlinePrice.addEventListener(
            'click',
            (event) => {
                targetIsInlinePrice = event.target === inlinePrice;
            },
            { once: true },
        );
        await inlinePrice.onceSettled();
        inlinePrice.firstElementChild.dispatchEvent(
            new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window,
            }),
        );
        expect(targetIsInlinePrice).to.be.true;
    });

    it('renders strikethrough price', async () => {
        await initMasCommerceService();
        const inlinePrice = mockInlinePrice('strikethrough', 'puf');
        Object.assign(inlinePrice.dataset, { template: 'strikethrough' });
        await inlinePrice.onceSettled();
        expect(inlinePrice.outerHTML).to.be.html(snapshots.strikethrough);
    });

    it('renders optical price', async () => {
        await initMasCommerceService();
        const inlinePrice = mockInlinePrice('optical', 'puf');
        Object.assign(inlinePrice.dataset, {
            template: 'optical',
            displayPerUnit: true,
            displayTax: true,
        });
        await inlinePrice.onceSettled();
        expect(inlinePrice.outerHTML).to.be.html(snapshots.optical);
    });

    it('renders annual price', async () => {
        await initMasCommerceService();
        const inlinePrice = mockInlinePrice('annual', 'puf');
        Object.assign(inlinePrice.dataset, { template: 'annual' });
        await inlinePrice.onceSettled();
        expect(inlinePrice.outerHTML).to.be.html(snapshots.annual);
    });

    it('renders promo price', async () => {
        await initMasCommerceService();
        const inlinePrice = mockInlinePrice('promoStikethrough', 'abm-promo');
        inlinePrice.dataset.promotionCode = 'nicopromo';
        inlinePrice.dataset.displayOldPrice = 'true';
        await inlinePrice.onceSettled();
        expect(inlinePrice.outerHTML).to.be.html(snapshots.promoStikethrough);
    });

    it('renders price with promo', async () => {
        await initMasCommerceService();
        const inlinePrice = mockInlinePrice('promo','abm-promo');
        inlinePrice.dataset.promotionCode = 'nicopromo';
        await inlinePrice.onceSettled();
        expect(inlinePrice.outerHTML).to.be.html(snapshots.promo);
    });

    it('overrides price literals', async () => {
        const commerce = initMasCommerceService();
        const disposer = commerce.providers.price((element, options) => {
            options.literals = {
                recurrenceLabel: 'every month',
            };
        });
        const inlinePrice = mockInlinePrice('customLiterals', 'abm');
        await inlinePrice.onceSettled();
        expect(inlinePrice.outerHTML).to.be.html(snapshots.customLiterals);
        disposer();
        inlinePrice.dataset.wcsOsi = 'puf'; // to force a re-render
        await inlinePrice.onceSettled();
        expect(inlinePrice.outerHTML).to.be.html(snapshots.price);
    });

    it('does not render failed price', async () => {
        await initMasCommerceService();
        const inlinePrice = mockInlinePrice('xyz', 'xyz');
        inlinePrice.innerHTML = 'test';
        try {
            await inlinePrice.onceSettled();
            // Should not reach here
            expect.fail('Promise should have been rejected');
        } catch (error) {
            // Verify it's a MasError instance
            expect(error).to.be.instanceOf(MasError);
            expect(error.context).to.have.property('measure');
            expect(error.context).to.include({
                status: 404,
                url: 'https://www.adobe.com//web_commerce_artifact?offer_selector_ids=xyz&country=US&locale=en_US&landscape=PUBLISHED&api_key=wcms-commerce-ims-ro-user-milo&language=MULT',
            });
        }
        expect(inlinePrice.querySelector('span.price')).to.be.null;
    });

    it('does not render missing offer', async () => {
        await initMasCommerceService();
        const inlinePrice = mockInlinePrice('noOffer', 'no-offer');
        await expect(inlinePrice.onceSettled()).to.be.eventually.rejectedWith(
            ERROR_MESSAGE_OFFER_NOT_FOUND,
        );
        expect(inlinePrice.innerHTML).to.equal('');
    });

    it('does not override missing offer with strikethrough', async () => {
        initMasCommerceService();
        const failedPrice = mockInlinePrice('noOffer', 'no-offer');
        Object.assign(failedPrice.dataset, { template: 'price' });
        const strikethroughPrice = InlinePrice.createInlinePrice({ wcsOsi: 'puf' });
        Object.assign(strikethroughPrice.dataset, { template: 'strikethrough' });
        failedPrice.parentElement.append(strikethroughPrice);
        await strikethroughPrice.onceSettled();
        await expect(failedPrice.onceSettled()).to.be.eventually.rejectedWith(
            ERROR_MESSAGE_OFFER_NOT_FOUND,
        );
        expect(failedPrice.innerHTML).to.equal('');
    });

    it('renders perpetual offer', async () => {
        initMasCommerceService();
        const inlinePrice = mockInlinePrice('perpetual', 'perpetual', { perpetual: true });
        await inlinePrice.onceSettled();
        // expect(inlinePrice.outerHTML).to.be.empty;
        expect(fetch.lastCall.args[0]).to.not.contain('language=');
        // no more perpetual offer
        inlinePrice.dataset.perpetual = 'false';
        await expect(inlinePrice.onceSettled()).to.be.eventually.rejectedWith(
            ERROR_MESSAGE_OFFER_NOT_FOUND,
        );
        expect(fetch.lastCall.args[0]).to.contain('language=MULT');
    });

    it('renders tax exclusive price', async () => {
        await initMasCommerceService({ country: 'CA' , language: 'en'});
        const inlinePrice = mockInlinePrice('taxExclusive');
        inlinePrice.dataset.wcsOsi = 'abm-promo';
        inlinePrice.dataset.displayTax = 'true';
        inlinePrice.dataset.forceTaxExclusive = 'true';
        inlinePrice.dataset.promotionCode = 'nicopromo';
        await inlinePrice.onceSettled();
        expect(inlinePrice.outerHTML).to.be.html(snapshots.taxExclusive);
    });

    it('renders discount percentage', async () => {
        await initMasCommerceService();
        const inlinePrice = mockInlinePrice('discount', 'abm-promo');
        inlinePrice.dataset.template = 'discount';
        await inlinePrice.onceSettled();
        expect(inlinePrice.outerHTML).to.be.html(snapshots.discount);
    });

    it('renders no discount markup', async () => {
        await initMasCommerceService();
        const inlinePrice = mockInlinePrice('noDiscount', 'abm');
        inlinePrice.dataset.template = 'discount';
        await inlinePrice.onceSettled();
        expect(inlinePrice.outerHTML).to.be.html(snapshots.noDiscount);
    });

    it('it recovers after first request fails', async () => {
        const commerce = await initMasCommerceService();
        const inlinePrice = mockInlinePrice('successAfterFail', 'success-after-fail');
        try {
            await inlinePrice.onceSettled();
            expect.fail('Promise should have been rejected');
        } catch (error) {
            // expected
        }
        expect(inlinePrice.masElement.state).to.equal(STATE_FAILED);
        commerce.refreshOffers();
        await inlinePrice.onceSettled();
        expect(inlinePrice.masElement.state).to.equal(STATE_RESOLVED);
    });

    describe('property "isInlinePrice"', () => {
        it('returns true', async () => {
            await initMasCommerceService();
            const inlinePrice = mockInlinePrice('abm1','abm');
            expect(inlinePrice.isInlinePrice).to.be.true;
        });
    });

    describe('method "renderOffers"', () => {
        it('fails placeholder if "orders" array is empty', async () => {
            await initMasCommerceService();
            const inlinePrice = mockInlinePrice('abm2','abm');
            inlinePrice.renderOffers([]);
            expect(inlinePrice.state).to.equal(InlinePrice.STATE_FAILED);
        });

        it('alternativePrice option test for aria label: both price should have sr-only.', async () => {
            await initMasCommerceService();
            const p = document.createElement('p');
            p.id = 'alternativePrice';
            document.body.append(p);
            const inlinePrice = mockInlinePrice('abm3', 'abm-promo');
            Object.assign(inlinePrice.dataset, { template: 'strikethrough' });
            const inlinePrice2 = mockInlinePrice('abm4','abm-promo');
            p.append(inlinePrice, inlinePrice2);
            await inlinePrice.onceSettled();
            await inlinePrice2.onceSettled();
            const srOnlyLabels = p.querySelectorAll('sr-only');
            expect(srOnlyLabels.length).to.equal(2);
        });
    });

    describe('method "requestUpdate"', () => {
        it('has requestUpdate method', async () => {
            await initMasCommerceService();
            const inlinePrice = mockInlinePrice('abm5','abm');
            inlinePrice.requestUpdate();
        });
    });

    describe('default display tax', () => {
        const getPriceLiterals = (settings, priceLiterals) => {
          //we are expecting an array of objects with lang and literals
          if (Array.isArray(priceLiterals)) {
            const find = (language) =>
              priceLiterals.find((candidate) =>
                equalsCaseInsensitive(candidate.lang, language),
              );
            const literals = find(settings.language) ?? find(Defaults.language);
            if (literals) return Object.freeze(literals);
          }
          return {};
        }

        const TESTS = [
          {
            locale: 'AE_ar',
            expected: [[false, false], [false, false], [false, false], [false, false]]
          },
          {
            locale: 'AE_en',
            expected: [[false, false], [false, false], [false, false], [false, false]]
          },
          {
            locale: 'AT_de',
            expected: [[true, false], [true, false], [true, false], [true, true]]
          },
          {
            locale: 'BE_en',
            expected: [[true, false], [true, true], [true, false], [true, true]]
          },
          {
            locale: 'BE_fr',
            expected: [[true, false], [true, true], [true, false], [true, true]]
          },
          {
            locale: 'BE_nl',
            expected: [[true, false], [true, true], [true, false], [true, true]]
          },
          {
            locale: 'BG_bg',
            expected: [[true, false], [true, true], [true, false], [true, true]]
          },
          {
            locale: 'CH_de',
            expected: [[true, false], [true, true], [true, false], [true, true]]
          },
          {
            locale: 'CH_fr',
            expected: [[true, false], [true, true], [true, false], [true, true]]
          },
          {
            locale: 'CH_it',
            expected: [[true, false], [true, true], [true, false], [true, true]]
          },
          {
            locale: 'AZ_en',
            expected: [[false, false], [false, false], [false, false], [false, false]]
          },
          {
            locale: 'AZ_ru',
            expected: [[false, false], [false, false], [false, false], [false, false]]
          },
          {
            locale: 'CZ_cs',
            expected: [[true, false], [true, true], [true, false], [true, true]]
          },
          {
            locale: 'DE_de',
            expected: [[true, false], [true, true], [true, false], [true, true]]
          },
          {
            locale: 'DK_da',
            expected: [[true, false], [true, true], [true, false], [true, true]]
          },
          {
            locale: 'EE_et',
            expected: [[true, false], [true, true], [true, false], [true, true]]
          },
          {
            locale: 'EG_ar',
            expected: [[true, false], [true, true], [true, false], [true, true]]
          },
          {
            locale: 'EG_en',
            expected: [[true, false], [true, true], [true, false], [true, true]]
          },
          {
            locale: 'ES_es',
            expected: [[true, false], [true, true], [true, false], [true, true]]
          },
          {
            locale: 'FI_fi',
            expected: [[true, false], [true, true], [true, false], [true, true]]
          },
          {
            locale: 'FR_fr',
            expected: [[true, false], [true, true], [true, false], [true, true]]
          },
          {
            locale: 'GR_el',
            expected: [[true, false], [true, true], [true, false], [true, true]]
          },
          {
            locale: 'GR_en',
            expected: [[true, false], [true, true], [true, false], [true, true]]
          },
          {
            locale: 'HU_hu',
            expected: [[true, false], [true, true], [true, false], [true, true]]
          },
          {
            locale: 'IE_en',
            expected: [[true, false], [true, true], [true, false], [true, true]]
          },
          {
            locale: 'IL_en',
            expected: [[false, false], [false, false], [false, false], [false, false]]
          },
          {
            locale: 'IL_iw',
            expected: [[false, false], [false, false], [false, false], [false, false]]
          },
          {
            locale: 'IT_it',
            expected: [[true, false], [true, true], [true, false], [true, true]]
          },
          {
            locale: 'KW_ar',
            expected: [[false, false], [false, false], [false, false], [false, false]]
          },
          {
            locale: 'KW_en',
            expected: [[false, false], [false, false], [false, false], [false, false]]
          },
          {
            locale: 'LT_lt',
            expected: [[true, false], [true, true], [true, false], [false, false]]
          },
          {
            locale: 'LU_de',
            expected: [[true, false], [true, true], [true, false], [true, true]]
          },
          {
            locale: 'LU_en',
            expected: [[true, false], [true, true], [true, false], [true, true]]
          },
          {
            locale: 'LU_fr',
            expected: [[true, false], [true, true], [true, false], [true, true]]
          },
          {
            locale: 'LV_lv',
            expected: [[true, false], [true, true], [true, false], [false, false]]
          },
          {
            locale: 'DZ_ar',
            expected: [[false, false], [false, false], [false, false], [false, false]]
          },
          {
            locale: 'DZ_en',
            expected: [[false, false], [false, false], [false, false], [false, false]]
          },
          {
            locale: 'NG_en',
            expected: [[true, false], [true, false], [false, false], [false, false]]
          },
          {
            locale: 'NL_nl',
            expected: [[true, false], [true, true], [true, false], [true, true]]
          },
          {
            locale: 'NO_nb',
            expected: [[true, false], [true, true], [true, false], [true, true]]
          },
          {
            locale: 'PL_pl',
            expected: [[true, false], [true, true], [true, false], [true, true]]
          },
          {
            locale: 'PT_pt',
            expected: [[true, false], [true, true], [true, false], [true, true]]
          },
          {
            locale: 'QA_ar',
            expected: [[false, false], [false, false], [false, false], [false, false]]
          },
          {
            locale: 'QA_en',
            expected: [[false, false], [false, false], [false, false], [false, false]]
          },
          {
            locale: 'RO_ro',
            expected: [[true, false], [true, true], [true, false], [true, true]]
          },
          {
            locale: 'RU_ru',
            expected: [[false, false], [false, false], [false, false], [false, false]]
          },
          {
            locale: 'SA_ar',
            expected: [[true, false], [false, false], [false, false], [false, false]]
          },
          {
            locale: 'SA_en',
            expected: [[true, false], [false, false], [true, false], [false, false]]
          },
          {
            locale: 'SE_sv',
            expected: [[true, false], [true, true], [true, false], [true, true]]
          },
          {
            locale: 'SI_sl',
            expected: [[true, false], [true, true], [true, false], [true, true]]
          },
          {
            locale: 'SK_sk',
            expected: [[true, false], [true, true], [true, false], [true, true]]
          },
          {
            locale: 'TR_tr',
            expected: [[true, false], [true, true], [true, false], [true, true]]
          },
          {
            locale: 'UA_uk',
            expected: [[true, false], [true, true], [true, false], [true, true]]
          },
          {
            locale: 'MU_en',
            expected: [[true, false], [true, false], [false, false], [false, false]]
          },
          {
            locale: 'AU_en',
            expected: [[true, false], [true, false], [true, false], [true, false]]
          },
          {
            locale: 'HK_en',
            expected: [[false, false], [false, false], [false, false], [false, false]]
          },
          {
            locale: 'ID_en',
            expected: [[true, false], [true, true], [true, false], [true, true]]
          },
          {
            locale: 'ID_in',
            expected: [[true, false], [true, true], [true, false], [true, true]]
          },
          {
            locale: 'IN_en',
            expected: [[true, false], [true, true], [true, false], [true, true]]
          },
          {
            locale: 'IN_hi',
            expected: [[true, false], [true, true], [true, false], [true, true]]
          },
          {
            locale: 'JP_ja',
            expected: [[true, false], [true, false], [true, false], [true, false]]
          },
          {
            locale: 'KR_ko',
            expected: [[true, false], [true, true], [false, false], [true, true]]
          },
          {
            locale: 'MY_en',
            expected: [[true, false], [true, true], [true, false], [true, true]]
          },
          {
            locale: 'MY_ms',
            expected: [[true, false], [true, true], [true, false], [true, true]]
          },
          {
            locale: 'NZ_en',
            expected: [[true, false], [true, false], [true, false], [true, false]]
          },
          {
            locale: 'PH_en',
            expected: [[false, false], [false, false], [false, false], [false, false]]
          },
          {
            locale: 'PH_fil',
            expected: [[false, false], [false, false], [false, false], [false, false]]
          },
          {
            locale: 'SG_en',
            expected: [[true, false], [false, false], [true, false], [true, true]]
          },
          {
            locale: 'TH_en',
            expected: [[true, false], [true, false], [true, false], [true, false]]
          },
          {
            locale: 'TH_th',
            expected: [[true, false], [true, false], [true, false], [true, false]]
          },
          {
            locale: 'VN_en',
            expected: [[false, false], [false, false], [false, false], [false, false]]
          },
          {
            locale: 'VN_vi',
            expected: [[false, false], [false, false], [false, false], [false, false]]
          },
          {
            locale: 'AR_es',
            expected: [[false, false], [false, false], [false, false], [false, false]]
          },
          {
            locale: 'BR_pt',
            expected: [[false, false], [false, false], [false, false], [false, false]]
          },
          {
            locale: 'CA_en',
            expected: [[false, false], [false, false], [false, false], [false, false]]
          },
          {
            locale: 'CA_fr',
            expected: [[false, false], [false, false], [false, false], [false, false]]
          },
          {
            locale: 'CL_es',
            expected: [[false, false], [false, false], [false, false], [false, false]]
          },
          {
            locale: 'CO_es',
            expected: [[false, false], [true, true], [false, false], [false, false]]
          },
          {
            locale: 'CR_es',
            expected: [[false, false], [false, false], [false, false], [false, false]]
          },
          {
            locale: 'EC_es',
            expected: [[false, false], [false, false], [false, false], [false, false]]
          },
          {
            locale: 'GT_es',
            expected: [[false, false], [false, false], [false, false], [false, false]]
          },
          {
            locale: 'LA_es',
            expected: [[false, false], [false, false], [false, false], [false, false]]
          },
          {
            locale: 'MX_es',
            expected: [[false, false], [false, false], [false, false], [false, false]]
          },
          {
            locale: 'PE_es',
            expected: [[false, false], [false, false], [false, false], [false, false]]
          },
          {
            locale: 'PR_es',
            expected: [[false, false], [false, false], [false, false], [false, false]]
          },
          {
            locale: 'US_en',
            expected: [[false, false], [false, false], [false, false], [false, false]]
          },
        ]
        //.filter((test) => test.locale === 'BE_en');  uncomment to run only one test

        const SEGMENTS = ['individual', 'business', 'student', 'university']

        TESTS.forEach((test) => {
            SEGMENTS.forEach((segment, index) => {
                it(`renders price with tax info for "${test.locale}" and "${segment}"`, async () => {
                    const localeArray = test.locale.split('_');
                    const country = localeArray[0];
                    const language = localeArray[1];
                    await initMasCommerceService({ country, language });
                    const literals = await getPriceLiterals({
                      language,
                    }, priceLiteralsJson.data);

                    const inlinePrice = mockInlinePrice(segment, segment);
                    inlinePrice.removeAttribute('data-display-tax');
                    inlinePrice.removeAttribute('data-force-tax-exclusive');
                    await inlinePrice.onceSettled();
                    const priceTaxElement = inlinePrice.querySelector(
                        '.price-tax-inclusivity',
                    );
                    if (test.expected[index][0]) {
                        expect(priceTaxElement.classList.contains('disabled')).to.be.false;
                        let taxInclExclLabel
                        if (test.expected[index][1]) { // forceTaxExclusive: true
                            taxInclExclLabel = literals.taxExclusiveLabel;
                        } else {
                            taxInclExclLabel = literals.taxInclusiveLabel;
                        }
                        const taxLabel = taxInclExclLabel.match(/TAX \{(.*?)\}/)[1]
                        expect(priceTaxElement.textContent).to.equal(taxLabel);
                    } else {
                        expect(priceTaxElement.classList.contains('disabled')).to.be.true;
                    }
                });
            });
        });
    });
});

describe('commerce service', () => {
    const offers = [
        {
            priceDetails: {
                price: 32.98,
                priceWithoutTax: 29.99,
                usePrecision: true,
                formatString: "'A$'#,##0.00",
                taxDisplay: 'TAX_INCLUSIVE_DETAILS',
                taxTerm: 'GST',
            },
            planType: 'ABM',
        },
    ];
    describe('function "buildPriceHTML"', () => {
        it('returns empty string if no offers provided', async () => {
            const { buildPriceHTML } = initMasCommerceService();
            expect(buildPriceHTML([])).to.be.empty;
        });
    });

    describe('function "direct price calls"', () => {
        it('works as expected', async () => {
            const service = await initMasCommerceService();
            const { collectPriceOptions, buildPriceHTML } = new Price({
                literals: { price: {} },
                settings: getSettings(service.config, service),
            });
            const inlinePrice1 = mockInlinePrice('abm');
            const options = collectPriceOptions({}, inlinePrice1);
            expect(options).not.to.be.empty;
            buildPriceHTML(
                { priceDetails: {} },
                { template: 'discount', ...options },
            );
            buildPriceHTML(
                { priceDetails: {} },
                { template: 'strikethrough', ...options },
            );
            buildPriceHTML(
                { priceDetails: {} },
                { template: 'optical', ...options },
            );
            buildPriceHTML(
                { priceDetails: {} },
                { template: 'annual', ...options },
            );
            buildPriceHTML(offers, { country: 'US' });
            buildPriceHTML(offers, { country: 'US', promotionCode: 'promo' });
            buildPriceHTML(offers, { country: 'AU' });
            buildPriceHTML(offers, { country: 'AU', promotionCode: 'promo' });
        });
    });
});
