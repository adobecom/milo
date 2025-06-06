import { runTests } from '@web/test-runner-mocha';
import { expect } from '@esm-bundle/chai';
import { mockFetch } from './mocks/fetch.js';
import { mockIms } from './mocks/ims.js';
import { withWcs } from './mocks/wcs.js';
import { withAem } from './mocks/aem.js';
import { getTemplateContent } from './utils.js';
import '../src/mas.js';

function updateOsi(element) {
    const country = element.closest('[data-test-country]')?.dataset.testCountry;
    [...element.querySelectorAll('[data-wcs-osi]')].forEach((el) => {
        el.dataset.wcsOsi =
            `${el.dataset.wcsOsi}-${country}`.toLocaleLowerCase();
    });
}

function localeProvider(element, options) {
    const testCountry = element.closest('[data-test-country]')?.dataset
        .testCountry;
    if (testCountry) options.country = testCountry;
    const testLanguage = element.closest('[data-test-language]')?.dataset
        .testLanguage;
    if (testLanguage) options.language = testLanguage;
}

function compareGetters(card, expected) {
    const {
        regularPrice,
        promoPrice,
        annualPrice,
        taxText,
        billingFrequencyText,
        seeTermsInfo,
        autoRenewalText,
        promoDurationText,
        ctas,
        buyCta,
        trialCta,
    } = card;

    expect(regularPrice).to.equal(expected.regularPrice);
    expect(promoPrice).to.equal(expected.promoPrice);
    expect(annualPrice).to.equal(expected.annualPrice);
    expect(taxText).to.equal(expected.taxText);
    expect(billingFrequencyText).to.equal(expected.billingFrequencyText);
    expect(seeTermsInfo).to.equal(expected.seeTermsInfo);
    expect(autoRenewalText).to.equal(expected.autoRenewalText);
    expect(promoDurationText).to.equal(expected.promoDurationText);
    expect(ctas).to.equal(expected.ctas);
    expect(buyCta).to.equal(expected.buyCta);
    expect(trialCta).to.equal(expected.trialCta);
}

runTests(async () => {
    mockIms();
    const masCommerceService = document.querySelector('mas-commerce-service');
    masCommerceService.providers.price(localeProvider);
    masCommerceService.providers.checkout(localeProvider);
    await mockFetch(withWcs, withAem);

    describe('merch-card web component with mini variant', () => {
        const container = document.getElementById('us');
        describe('US', () => {
            it('should render US standard', async () => {
                const [card] = getTemplateContent('template-mini-photo');
                container.append(card);
                compareGetters(card, {
                  regularPrice: '',
                  promoPrice: undefined,
                  annualPrice: undefined,
                  taxText: undefined,
                  billingFrequencyText: 'Billing Frequency',
                  seeTermsInfo: 'See Terms',
                  autoRenewalText: 'Auto Renewal',
                  promoDurationText: 'Promo Duration',
                  ctas: 'CTAs',
                  buyCta: 'Buy',
                  trialCta: 'Trial',
                });
            });
            it('should render US promo', () => {
                const [card] = getTemplateContent('template-mini-photo-promo');
                container.append(card);
            });
        });

        describe('CA', () => {
            const container = document.getElementById('ca');
            it('should render CA standard', async () => {
                const [card] = getTemplateContent('template-mini-photo');
                card.dataset.testCountry = 'CA';
                container.append(card);
                await card.checkReady();
                updateOsi(card);
            });
            it('should render CA promo', async () => {
                const [card] = getTemplateContent('template-mini-photo-promo');
                card.dataset.testCountry = 'CA';
                container.append(card);
                await card.checkReady();
                updateOsi(card);
            });
        });

        describe('FR', () => {
            const container = document.getElementById('fr');
            it('should render FR standard', async () => {
                const [card] = getTemplateContent('template-mini-photo-fr');
                card.dataset.testCountry = 'FR';
                card.dataset.testLanguage = 'fr';
                container.append(card);
                await card.checkReady();
                updateOsi(card);
            });
            it('should render FR promo', async () => {
                const [card] = getTemplateContent(
                    'template-mini-photo-promo-fr',
                );
                card.dataset.testCountry = 'FR';
                card.dataset.testLanguage = 'fr';
                container.append(card);
                await card.checkReady();
                updateOsi(card);
            });
        });
    });
});
