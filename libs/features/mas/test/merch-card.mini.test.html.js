import { runTests } from '@web/test-runner-mocha';
import { expect } from '@esm-bundle/chai';
import { mockFetch } from './mocks/fetch.js';
import { mockIms } from './mocks/ims.js';
import { withWcs } from './mocks/wcs.js';
import { withAem } from './mocks/aem.js';
import { getTemplateContent, oneEvent } from './utils.js';
import '../src/mas.js';
import { getPriceLiterals } from '../src/literals.js';

const enLiterals = {
    taxInclusiveLabel: 'Inclusive of all taxes',
    planTypeLabel: 'Annual, paid monthly.',
};

const frLiterals = {
    taxInclusiveLabel: 'Toutes taxes comprises',
    planTypeLabel: 'Annuel, facturé mensuellement.',
};

function localeProvider(element, options) {
    const testCountry = element.closest('[data-test-country]')?.dataset
        .testCountry;
    if (testCountry) options.country = testCountry;
    const testLanguage = element.closest('[data-test-language]')?.dataset
        .testLanguage;
    if (testLanguage) {
        options.lang = testLanguage;
        options.language = testLanguage;
    }
    options.locale = `${testLanguage}_${testCountry}`;
    options.literals = {
        ...getPriceLiterals({ language: options.language }),
        ...(testLanguage === 'fr' ? frLiterals : enLiterals),
    };
}

function compareGetters(card, expected) {
    const {
        regularPrice,
        promoPrice,
        annualPrice,
        taxText,
        seeTermsInfo,
        renewalText,
        recurrenceText,
        planTypeText,
        promoDurationText,
        ctas,
        primaryCta,
        secondaryCta,
    } = card;

    expect(regularPrice, 'regularPrice: ✅').to.equal(expected.regularPrice);
    expect(promoPrice, '').to.equal(expected.promoPrice);
    expect(annualPrice, '').to.equal(expected.annualPrice);
    expect(taxText, '').to.equal(expected.taxText);
    expect(recurrenceText, '').to.equal(expected.recurrenceText);
    expect(planTypeText, '').to.equal(expected.planTypeText);
    expect(seeTermsInfo, '').to.deep.equal(expected.seeTermsInfo);
    expect(renewalText, '').to.equal(expected.renewalText);
    expect(promoDurationText, '').to.equal(expected.promoDurationText);
    expect(ctas.length).to.equal(expected.ctas);
    expect(primaryCta, '').to.deep.equal(expected.primaryCta);
    expect(secondaryCta, '').to.deep.equal(expected.secondaryCta);
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
                await card.checkReady();
                compareGetters(card, {
                    regularPrice: 'US$59.99/mo',
                    promoPrice: undefined,
                    annualPrice: undefined,
                    taxText: undefined,
                    seeTermsInfo: {
                        text: 'see terms',
                        href: 'https://www.stage.adobe.com/offers/promo-terms.html?locale=en_US&country=US&offer_id=DDDCDEBA96799A274FA982669CA74623',
                    },
                    renewalText: undefined,
                    promoDurationText: undefined,
                    ctas: 2,
                    planTypeText: 'Annual, paid monthly.',
                    recurrenceText: '/mo',
                    primaryCta: {
                        text: 'Buy now',
                        href: 'https://commerce-stg.adobe.com/store/segmentation?cli=adobe_com&ctx=fp&co=US&lang=en&ms=COM&ot=BASE&cs=INDIVIDUAL&pa=PA-130',
                    },
                    secondaryCta: {
                        text: 'Free trial',
                        href: 'https://commerce-stg.adobe.com/store/segmentation?cli=adobe_com&ctx=fp&co=US&lang=en&ms=COM&ot=BASE&cs=INDIVIDUAL&pa=PA-130',
                    },
                });
            });
            it('should render US promo', async () => {
                const [card] = getTemplateContent('template-mini-photo-promo');
                container.append(card);
                await card.checkReady();
                compareGetters(card, {
                    regularPrice: 'US$59.99/mo',
                    promoPrice: 'US$49.99/mo',
                    annualPrice: undefined,
                    taxText: undefined,
                    seeTermsInfo: {
                        text: 'see terms',
                        href: 'https://www.stage.adobe.com/offers/promo-terms.html?locale=en_US&country=US&offer_id=DDDCDEBA96799A274FA982669CA74623&promotion_code=L_PROMO_10F',
                    },
                    renewalText:
                        'Renews automatically until canclled. Renews at $54.99/mo after 12 months.',
                    promoDurationText: 'First year only, Ends Mar 3.',
                    ctas: 2,
                    planTypeText: 'Annual, paid monthly.',
                    recurrenceText: '/mo',
                    primaryCta: {
                        text: 'Buy now',
                        href: 'https://commerce-stg.adobe.com/store/segmentation?apc=L_PROMO_10F&cli=adobe_com&ctx=fp&co=US&lang=en&ms=COM&ot=BASE&cs=INDIVIDUAL&pa=PA-130',
                    },
                    secondaryCta: {
                        text: 'Free trial',
                        href: 'https://commerce-stg.adobe.com/store/segmentation?apc=L_PROMO_10F&cli=adobe_com&ctx=fp&co=US&lang=en&ms=COM&ot=BASE&cs=INDIVIDUAL&pa=PA-130',
                    },
                });
            });
            it('should render US standard with secondary cta as regular link', async () => {
                const [card] = getTemplateContent('template-mini-photo-link');
                container.append(card);
                await card.checkReady();
                compareGetters(card, {
                    regularPrice: 'US$59.99/mo',
                    promoPrice: undefined,
                    annualPrice: undefined,
                    taxText: undefined,
                    seeTermsInfo: {
                        text: 'see terms',
                        href: 'https://www.stage.adobe.com/offers/promo-terms.html?locale=en_US&country=US&offer_id=DDDCDEBA96799A274FA982669CA74623',
                    },
                    renewalText: undefined,
                    promoDurationText: undefined,
                    ctas: 2,
                    planTypeText: 'Annual, paid monthly.',
                    recurrenceText: '/mo',
                    primaryCta: {
                        text: 'Buy now',
                        href: 'https://commerce-stg.adobe.com/store/segmentation?cli=adobe_com&ctx=fp&co=US&lang=en&ms=COM&ot=BASE&cs=INDIVIDUAL&pa=PA-130',
                    },
                    secondaryCta: {
                        text: 'Free trial',
                        href: 'https://www.adobe.com/products/catalog.html',
                    },
                });
            });
        });

        describe('CA', () => {
            const container = document.getElementById('ca');
            it('should render CA standard', async () => {
                const [card] = getTemplateContent('template-mini-photo-ca');
                container.append(card);
                await card.checkReady();
                compareGetters(card, {
                    regularPrice: 'CAD $78.99/mo',
                    promoPrice: undefined,
                    annualPrice: undefined,
                    taxText: undefined,
                    seeTermsInfo: {
                        text: 'see terms',
                        href: 'https://www.stage.adobe.com/offers/promo-terms.html?locale=en_CA&country=CA&offer_id=DDDCDEBA96799A274FA982669CA74623',
                    },
                    renewalText: undefined,
                    promoDurationText: undefined,
                    ctas: 2,
                    planTypeText: 'Annual, paid monthly.',
                    recurrenceText: '/mo',
                    primaryCta: {
                        text: 'Buy now',
                        href: 'https://commerce-stg.adobe.com/store/segmentation?cli=adobe_com&ctx=fp&co=CA&lang=en&ms=COM&ot=BASE&cs=INDIVIDUAL&pa=PA-130',
                    },
                    secondaryCta: {
                        text: 'Free trial',
                        href: 'https://commerce-stg.adobe.com/store/segmentation?cli=adobe_com&ctx=fp&co=CA&lang=en&ms=COM&ot=BASE&cs=INDIVIDUAL&pa=PA-130',
                    },
                });
            });
            it('should render CA promo', async () => {
                const [card] = getTemplateContent(
                    'template-mini-photo-promo-ca',
                );
                container.append(card);
                await card.checkReady();
                compareGetters(card, {
                    regularPrice: 'CAD $78.99/mo',
                    promoPrice: 'CAD $68.99/mo',
                    annualPrice: undefined,
                    taxText: undefined,
                    seeTermsInfo: {
                        text: 'see terms',
                        href: 'https://www.stage.adobe.com/offers/promo-terms.html?locale=en_CA&country=CA&offer_id=DDDCDEBA96799A274FA982669CA74623&promotion_code=L_PROMO_10F',
                    },
                    renewalText:
                        'Renews automatically until canclled. Renews at $54.99/mo after 12 months.',
                    promoDurationText: 'First year only, Ends Mar 3.',
                    ctas: 2,
                    planTypeText: 'Annual, paid monthly.',
                    recurrenceText: '/mo',
                    primaryCta: {
                        text: 'Buy now',
                        href: 'https://commerce-stg.adobe.com/store/segmentation?apc=L_PROMO_10F&cli=adobe_com&ctx=fp&co=CA&lang=en&ms=COM&ot=BASE&cs=INDIVIDUAL&pa=PA-130',
                    },
                    secondaryCta: {
                        text: 'Free trial',
                        href: 'https://commerce-stg.adobe.com/store/segmentation?apc=L_PROMO_10F&cli=adobe_com&ctx=fp&co=CA&lang=en&ms=COM&ot=BASE&cs=INDIVIDUAL&pa=PA-130',
                    },
                });
            });
        });

        describe('AU', () => {
            const container = document.getElementById('au');
            it('should render AU standard', async () => {
                const [card] = getTemplateContent('template-mini-photo-au');
                container.append(card);
                await card.checkReady();
                compareGetters(card, {
                    regularPrice: 'A$95.99/mo',
                    promoPrice: undefined,
                    annualPrice: 'A$1,151.88/yr',
                    taxText: 'Inclusive of all taxes.',
                    seeTermsInfo: {
                        text: 'see terms',
                        href: 'https://www.stage.adobe.com/offers/promo-terms.html?locale=en_AU&country=AU&offer_id=DDDCDEBA96799A274FA982669CA74623',
                    },
                    renewalText: undefined,
                    promoDurationText: undefined,
                    ctas: 2,
                    planTypeText: 'Annual, paid monthly.',
                    recurrenceText: '/mo',
                    primaryCta: {
                        text: 'Buy now',
                        href: 'https://commerce-stg.adobe.com/store/segmentation?cli=adobe_com&ctx=fp&co=AU&lang=en&ms=COM&ot=BASE&cs=INDIVIDUAL&pa=PA-130',
                    },
                    secondaryCta: {
                        text: 'Free trial',
                        href: 'https://commerce-stg.adobe.com/store/segmentation?cli=adobe_com&ctx=fp&co=AU&lang=en&ms=COM&ot=BASE&cs=INDIVIDUAL&pa=PA-130',
                    },
                });
            });
            it('should render AU promo', async () => {
                const [card] = getTemplateContent(
                    'template-mini-photo-promo-au',
                );
                container.append(card);
                await card.checkReady();
                compareGetters(card, {
                    regularPrice: 'A$95.99/mo',
                    promoPrice: 'A$47.99/mo',
                    annualPrice: 'A$1,007.88/yr',
                    taxText: 'Inclusive of all taxes.',
                    seeTermsInfo: {
                        text: 'see terms',
                        href: 'https://www.stage.adobe.com/offers/promo-terms.html?locale=en_AU&country=AU&offer_id=DDDCDEBA96799A274FA982669CA74623&promotion_code=L_PROMO_10F',
                    },
                    renewalText:
                        'Renews automatically until canclled. Renews at $54.99/mo after 12 months.',
                    promoDurationText: 'First year only, Ends Mar 3.',
                    ctas: 2,
                    planTypeText: 'Annual, paid monthly.',
                    recurrenceText: '/mo',
                    primaryCta: {
                        text: 'Buy now',
                        href: 'https://commerce-stg.adobe.com/store/segmentation?apc=L_PROMO_10F&cli=adobe_com&ctx=fp&co=AU&lang=en&ms=COM&ot=BASE&cs=INDIVIDUAL&pa=PA-130',
                    },
                    secondaryCta: {
                        text: 'Free trial',
                        href: 'https://commerce-stg.adobe.com/store/segmentation?apc=L_PROMO_10F&cli=adobe_com&ctx=fp&co=AU&lang=en&ms=COM&ot=BASE&cs=INDIVIDUAL&pa=PA-130',
                    },
                });
            });
        });

        describe('FR', () => {
            const container = document.getElementById('fr');
            it('should render FR standard', async () => {
                const [card] = getTemplateContent('template-mini-photo-fr');
                container.append(card);
                await card.checkReady();
                compareGetters(card, {
                    regularPrice: '71,99\u00a0€/mois',
                    promoPrice: undefined,
                    annualPrice: undefined,
                    taxText: 'Toutes taxes comprises.',
                    seeTermsInfo: {
                        text: 'voir les conditions',
                        href: 'https://www.stage.adobe.com/offers/promo-terms.html?locale=fr_FR&country=FR&offer_id=DDDCDEBA96799A274FA982669CA74623',
                    },
                    renewalText: undefined,
                    promoDurationText: undefined,
                    ctas: 2,
                    planTypeText: 'Annuel, facturé mensuellement.',
                    recurrenceText: '/mois',
                    primaryCta: {
                        text: 'Buy now',
                        href: 'https://commerce-stg.adobe.com/store/segmentation?cli=adobe_com&ctx=fp&co=FR&lang=fr&ms=COM&ot=BASE&cs=INDIVIDUAL&pa=PA-130',
                    },
                    secondaryCta: {
                        text: 'Free trial',
                        href: 'https://commerce-stg.adobe.com/store/segmentation?cli=adobe_com&ctx=fp&co=FR&lang=fr&ms=COM&ot=BASE&cs=INDIVIDUAL&pa=PA-130',
                    },
                });
            });
            it('should render FR promo', async () => {
                const [card] = getTemplateContent(
                    'template-mini-photo-promo-fr',
                );
                container.append(card);
                await card.checkReady();
                compareGetters(card, {
                    regularPrice: '71,99\u00a0€/mois',
                    promoPrice: '59,99\u00a0€/mois',
                    annualPrice: undefined,
                    taxText: 'Toutes taxes comprises.',
                    seeTermsInfo: {
                        text: 'voir les conditions',
                        href: 'https://www.stage.adobe.com/offers/promo-terms.html?locale=fr_FR&country=FR&offer_id=DDDCDEBA96799A274FA982669CA74623&promotion_code=L_PROMO_10F',
                    },
                    renewalText:
                        "Renouvellement automatique jusqu'à annulation. Renouvellement à 54,99 $/mois après 12 mois.",
                    promoDurationText:
                        'Première année seulement, Se termine le 3 mars.',
                    ctas: 2,
                    planTypeText: 'Annuel, facturé mensuellement.',
                    recurrenceText: '/mois',
                    primaryCta: {
                        text: 'Buy now',
                        href: 'https://commerce-stg.adobe.com/store/segmentation?apc=L_PROMO_10F&cli=adobe_com&ctx=fp&co=FR&lang=fr&ms=COM&ot=BASE&cs=INDIVIDUAL&pa=PA-130',
                    },
                    secondaryCta: {
                        text: 'Free trial',
                        href: 'https://commerce-stg.adobe.com/store/segmentation?apc=L_PROMO_10F&cli=adobe_com&ctx=fp&co=FR&lang=fr&ms=COM&ot=BASE&cs=INDIVIDUAL&pa=PA-130',
                    },
                });
            });
        });
    });
});
