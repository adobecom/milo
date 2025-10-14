import { runTests } from '@web/test-runner-mocha';
import { expect } from '@esm-bundle/chai';
import { mockFetch } from './mocks/fetch.js';
import { mockIms } from './mocks/ims.js';
import { withWcs } from './mocks/wcs.js';
import { withAem } from './mocks/aem.js';
import { getTemplateContent } from './utils.js';
import '../src/mas.js';
import { getPriceLiterals } from '../src/literals.js';
import Sinon from 'sinon';
import { Log } from '../src/log.js';

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
        .testCountry || 'US';
    options.country = testCountry;
    const testLanguage = element.closest('[data-test-language]')?.dataset
        .testLanguage || 'en';
    options.lang = testLanguage;
    options.language = testLanguage;
    options.locale = `${testLanguage}_${testCountry}`;
    options.literals = {
        ...getPriceLiterals({ language: options.language }),
        ...(testLanguage === 'fr' ? frLiterals : enLiterals),
    };
}

function compareGetters(card, expected) {
    const {
        title,
        regularPrice,
        promoPrice,
        promotionCode,
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

    expect(title, '').to.equal(expected.title);
    expect(regularPrice, '').to.equal(expected.regularPrice);
    expect(promoPrice, '').to.equal(expected.promoPrice);
    expect(promotionCode, '').to.equal(expected.promotionCode);
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
        before(() => {
            Log.use(Log.Plugins.consoleAppender);
        });

        after(() => {
            Log.reset();
        });
        const container = document.getElementById('us');
        describe('US', () => {
            it('should render US standard', async () => {
                const [card] = getTemplateContent('template-mini-photo');
                container.append(card);
                await card.checkReady();
                compareGetters(card, {
                    title: 'CCD Apps: Photography',
                    regularPrice: 'US$59.99/mo',
                    promoPrice: undefined,
                    annualPrice: undefined,
                    taxText: undefined,
                    seeTermsInfo: {
                        text: 'see terms',
                        analyticsId: 'see-terms',
                        href: 'https://www.stage.adobe.com/offers/promo-terms.html?locale=en_US&country=US&offer_id=DDDCDEBA96799A274FA982669CA74623',
                    },
                    renewalText: undefined,
                    promoDurationText: undefined,
                    ctas: 2,
                    planTypeText: 'Annual, paid monthly.',
                    recurrenceText: '/mo',
                    primaryCta: {
                        text: 'Buy now',
                        analyticsId: 'buy-now',
                        href: 'https://commerce-stg.adobe.com/store/segmentation?cli=adobe_com&ctx=fp&co=US&lang=en&ms=COM&ot=BASE&cs=INDIVIDUAL&pa=PA-130',
                    },
                    secondaryCta: {
                        text: 'Free trial',
                        analyticsId: 'free-trial',
                        href: 'https://commerce-stg.adobe.com/store/segmentation?cli=adobe_com&ctx=fp&co=US&lang=en&ms=COM&ot=BASE&cs=INDIVIDUAL&pa=PA-130',
                    },
                });
            });
            it('should render US promo', async () => {
                const [card] = getTemplateContent('template-mini-photo-promo');
                container.append(card);
                await card.checkReady();
                compareGetters(card, {
                    title: 'CCD Apps: Creative Cloud Pro - Individual Promo',
                    regularPrice: 'US$59.99/mo',
                    promoPrice: 'US$35.99/mo',
                    promotionCode: 'CCI2AAUSQ22440CD',
                    annualPrice: undefined,
                    taxText: undefined,
                    seeTermsInfo: {
                        text: 'see terms',
                        analyticsId: 'see-terms',
                        href: 'https://www.stage.adobe.com/offers/promo-terms.html?locale=en_US&country=US&offer_id=632B3ADD940A7FBB7864AA5AD19B8D28&promotion_code=CCI2AAUSQ22440CD',
                    },
                    renewalText:
                        'Renews automatically until cancelled. Renews at $54.99/mo after 12 months.',
                    promoDurationText: 'First year only, Ends Mar 3.',
                    ctas: 2,
                    planTypeText: 'Annual, paid monthly.',
                    recurrenceText: '/mo',
                    primaryCta: {
                        text: 'Buy now',
                        analyticsId: 'buy-now',
                        href: 'https://commerce-stg.adobe.com/store/segmentation?apc=CCI2AAUSQ22440CD&cli=adobe_com&ctx=fp&co=US&lang=en&ms=COM&ot=BASE&cs=INDIVIDUAL&pa=ccsn_direct_individual',
                    },
                    secondaryCta: {
                        text: 'Free trial',
                        analyticsId: 'free-trial',
                        href: 'https://commerce-stg.adobe.com/store/segmentation?apc=CCI2AAUSQ22440CD&cli=adobe_com&ctx=fp&co=US&lang=en&ms=COM&ot=BASE&cs=INDIVIDUAL&pa=ccsn_direct_individual',
                    },
                });
            });
            it('should render US standard with secondary cta as regular link', async () => {
                const [card] = getTemplateContent('template-mini-photo-link');
                container.append(card);
                await card.checkReady();
                compareGetters(card, {
                    title: 'CCD Apps: Photography',
                    regularPrice: 'US$59.99/mo',
                    promoPrice: undefined,
                    annualPrice: undefined,
                    taxText: undefined,
                    seeTermsInfo: {
                        text: 'see terms',
                        analyticsId: 'see-terms',
                        href: 'https://www.stage.adobe.com/offers/promo-terms.html?locale=en_US&country=US&offer_id=DDDCDEBA96799A274FA982669CA74623',
                    },
                    renewalText: undefined,
                    promoDurationText: undefined,
                    ctas: 2,
                    planTypeText: 'Annual, paid monthly.',
                    recurrenceText: '/mo',
                    primaryCta: {
                        text: 'Buy now',
                        analyticsId: 'buy-now',
                        href: 'https://commerce-stg.adobe.com/store/segmentation?cli=adobe_com&ctx=fp&co=US&lang=en&ms=COM&ot=BASE&cs=INDIVIDUAL&pa=PA-130',
                    },
                    secondaryCta: {
                        text: 'Free trial',
                        analyticsId: 'free-trial',
                        href: 'https://www.adobe.com/products/catalog.html',
                    },
                });
            });
            it('should log a warning if multiple promotion codes are found', async () => {
                const [card] = getTemplateContent(
                    'template-multiple-promo-codes',
                );
                const logSpy = Sinon.spy(console, 'warn');
                container.append(card);
                await card.checkReady();
                const promoCode = card.promotionCode;
                expect(promoCode).to.equal('PROMO_ABC');
                expect(logSpy.calledOnce).to.be.true;
                expect(logSpy.args[0][0]).to.include(
                    'Multiple different promotion codes found: PROMO_ABC, PROMO_XYZ',
                );
                logSpy.restore();
            });
            it('should render US standard with no CTA', async () => {
                const [card] = getTemplateContent('template-mini-photo-no-cta');
                container.append(card);
                await card.checkReady();
                compareGetters(card, {
                    title: 'CCD Apps: Photography no CTA',
                    regularPrice: 'US$59.99/mo',
                    promoPrice: undefined,
                    annualPrice: undefined,
                    taxText: undefined,
                    seeTermsInfo: undefined,
                    renewalText: undefined,
                    promoDurationText: undefined,
                    ctas: 0,
                    planTypeText: 'Annual, paid monthly.',
                    recurrenceText: '/mo',
                    primaryCta: undefined,
                    secondaryCta: undefined,
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
                    title: 'CCD Apps: Photography',
                    regularPrice: 'CAD $78.99/mo',
                    promoPrice: undefined,
                    annualPrice: undefined,
                    taxText: undefined,
                    seeTermsInfo: {
                        text: 'see terms',
                        analyticsId: 'see-terms',
                        href: 'https://www.stage.adobe.com/offers/promo-terms.html?locale=en_CA&country=CA&offer_id=DDDCDEBA96799A274FA982669CA74623',
                    },
                    renewalText: undefined,
                    promoDurationText: undefined,
                    ctas: 2,
                    planTypeText: 'Annual, paid monthly.',
                    recurrenceText: '/mo',
                    primaryCta: {
                        text: 'Buy now',
                        analyticsId: 'buy-now',
                        href: 'https://commerce-stg.adobe.com/store/segmentation?cli=adobe_com&ctx=fp&co=CA&lang=en&ms=COM&ot=BASE&cs=INDIVIDUAL&pa=PA-130',
                    },
                    secondaryCta: {
                        text: 'Free trial',
                        analyticsId: 'free-trial',
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
                    title: 'CCD Apps: Creative Cloud Pro - Individual Promo',
                    regularPrice: 'CAD $78.99/mo',
                    promoPrice: 'CAD $68.99/mo',
                    promotionCode: 'CCI2AACAQ22440CD',
                    annualPrice: undefined,
                    taxText: undefined,
                    seeTermsInfo: {
                        text: 'see terms',
                        analyticsId: 'see-terms',
                        href: 'https://www.stage.adobe.com/offers/promo-terms.html?locale=en_CA&country=CA&offer_id=632B3ADD940A7FBB7864AA5AD19B8D28&promotion_code=CCI2AACAQ22440CD',
                    },
                    renewalText:
                        'Renews automatically until cancelled. Renews at $54.99/mo after 12 months.',
                    promoDurationText: 'First year only, Ends Mar 3.',
                    ctas: 2,
                    planTypeText: 'Annual, paid monthly.',
                    recurrenceText: '/mo',
                    primaryCta: {
                        text: 'Buy now',
                        analyticsId: 'buy-now',
                          href: 'https://commerce-stg.adobe.com/store/segmentation?apc=CCI2AACAQ22440CD&cli=adobe_com&ctx=fp&co=CA&lang=en&ms=COM&ot=BASE&cs=INDIVIDUAL&pa=PA-130',
                    },
                    secondaryCta: {
                        text: 'Free trial',
                        analyticsId: 'free-trial',
                        href: 'https://commerce-stg.adobe.com/store/segmentation?apc=CCI2AACAQ22440CD&cli=adobe_com&ctx=fp&co=CA&lang=en&ms=COM&ot=BASE&cs=INDIVIDUAL&pa=PA-130',
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
                    title: 'CCD Apps: Photography',
                    regularPrice: 'A$95.99/mo',
                    promoPrice: undefined,
                    annualPrice: 'A$1,151.88/yr',
                    taxText: 'Inclusive of all taxes.',
                    seeTermsInfo: {
                        text: 'see terms',
                        analyticsId: 'see-terms',
                        href: 'https://www.stage.adobe.com/offers/promo-terms.html?locale=en_AU&country=AU&offer_id=DDDCDEBA96799A274FA982669CA74623',
                    },
                    renewalText: undefined,
                    promoDurationText: undefined,
                    ctas: 2,
                    planTypeText: 'Annual, paid monthly.',
                    recurrenceText: '/mo',
                    primaryCta: {
                        text: 'Buy now',
                        analyticsId: 'buy-now',
                        href: 'https://commerce-stg.adobe.com/store/segmentation?cli=adobe_com&ctx=fp&co=AU&lang=en&ms=COM&ot=BASE&cs=INDIVIDUAL&pa=PA-130',
                    },
                    secondaryCta: {
                        text: 'Free trial',
                        analyticsId: 'free-trial',
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
                    title: 'CCD Apps: Creative Cloud Pro - Individual Promo',
                    regularPrice: 'A$95.99/mo',
                    promoPrice: 'A$47.99/mo',
                    promotionCode: 'CCI2AAAUQ22440CD',
                    annualPrice: 'A$575.88/yr',
                    taxText: 'Inclusive of all taxes.',
                    seeTermsInfo: {
                        text: 'see terms',
                        analyticsId: 'see-terms',
                        href: 'https://www.stage.adobe.com/offers/promo-terms.html?locale=en_AU&country=AU&offer_id=632B3ADD940A7FBB7864AA5AD19B8D28&promotion_code=CCI2AAAUQ22440CD',
                    },
                    renewalText:
                        'Renews automatically until cancelled. Renews at $54.99/mo after 12 months.',
                    promoDurationText: 'First year only, Ends Mar 3.',
                    ctas: 2,
                    planTypeText: 'Annual, paid monthly.',
                    recurrenceText: '/mo',
                    primaryCta: {
                        text: 'Buy now',
                        analyticsId: 'buy-now',
                        href: 'https://commerce-stg.adobe.com/store/segmentation?apc=CCI2AAAUQ22440CD&cli=adobe_com&ctx=fp&co=AU&lang=en&ms=COM&ot=BASE&cs=INDIVIDUAL&pa=PA-130',
                    },
                    secondaryCta: {
                        text: 'Free trial',
                        analyticsId: 'free-trial',
                        href: 'https://commerce-stg.adobe.com/store/segmentation?apc=CCI2AAAUQ22440CD&cli=adobe_com&ctx=fp&co=AU&lang=en&ms=COM&ot=BASE&cs=INDIVIDUAL&pa=PA-130',
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
                    title: 'CCD Apps: Photography',
                    regularPrice: '71,99 €/mois',
                    promoPrice: undefined,
                    annualPrice: undefined,
                    taxText: 'Toutes taxes comprises.',
                    seeTermsInfo: {
                        text: 'voir les conditions',
                        analyticsId: 'see-terms',
                        href: 'https://www.stage.adobe.com/offers/promo-terms.html?locale=fr_FR&country=FR&offer_id=DDDCDEBA96799A274FA982669CA74623',
                    },
                    renewalText: undefined,
                    promoDurationText: undefined,
                    ctas: 2,
                    planTypeText: 'Annuel, facturé mensuellement.',
                    recurrenceText: '/mois',
                    primaryCta: {
                        text: 'Buy now',
                        analyticsId: 'buy-now',
                        href: 'https://commerce-stg.adobe.com/store/segmentation?cli=adobe_com&ctx=fp&co=FR&lang=fr&ms=COM&ot=BASE&cs=INDIVIDUAL&pa=PA-130',
                    },
                    secondaryCta: {
                        text: 'Free trial',
                        analyticsId: 'free-trial',
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
                    title: 'CCD Apps: Creative Cloud Pro - Individual Promo',
                    regularPrice: '71,99 €/mois',
                    promoPrice: '59,99 €/mois',
                    promotionCode: 'CCI2AAFRQ22440CD',
                    annualPrice: undefined,
                    taxText: 'Toutes taxes comprises.',
                    seeTermsInfo: {
                        text: 'voir les conditions',
                        analyticsId: 'see-terms',
                        href: 'https://www.stage.adobe.com/offers/promo-terms.html?locale=fr_FR&country=FR&offer_id=632B3ADD940A7FBB7864AA5AD19B8D28&promotion_code=CCI2AAFRQ22440CD',
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
                        analyticsId: 'buy-now',
                        href: 'https://commerce-stg.adobe.com/store/segmentation?apc=CCI2AAFRQ22440CD&cli=adobe_com&ctx=fp&co=FR&lang=fr&ms=COM&ot=BASE&cs=INDIVIDUAL&pa=ccsn_direct_individual',
                    },
                    secondaryCta: {
                        text: 'Free trial',
                        analyticsId: 'free-trial',
                        href: 'https://commerce-stg.adobe.com/store/segmentation?apc=CCI2AAFRQ22440CD&cli=adobe_com&ctx=fp&co=FR&lang=fr&ms=COM&ot=BASE&cs=INDIVIDUAL&pa=ccsn_direct_individual',
                    },
                });
            });
        });
    });
});
