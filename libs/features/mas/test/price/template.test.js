import { expect } from '../utilities.js';
import * as snapshots from './__snapshots__/template.snapshots.js';
import {
    createPriceTemplate,
    createPromoPriceTemplate,
    createPriceWithAnnualTemplate,
    createPromoPriceWithAnnualTemplate,
} from '../../src/price/template.js';

const context = {
    country: 'US',
    language: 'en',
};
const value = {
    formatString: '#0',
    price: 100,
};

const valueAbm = {
    formatString: '#0',
    price: 100,
    planType: 'ABM',
    commitment: 'YEAR',
    term: 'MONTHLY',
};

const valueDiscount = {
    formatString: '#0',
    price: 80,
    priceWithoutDiscount: 100,
};

const valueDiscountAbm = {
    formatString: '#0',
    price: 80,
    priceWithoutDiscount: 100,
    commitment: 'YEAR',
    term: 'MONTHLY',
    promotion: {
        start: '2024-11-15T04:02:37.000Z',
        end: '2030-03-01T07:59:00.000Z',
        displaySummary: {
          outcomeType: 'PERCENTAGE_DISCOUNT',
          duration: 'P12M',
          amount: 25,
          minProductQuantity: 1,
        },
    },
};

const valueNotApplicableDiscount = {
    formatString: '#0',
    price: 100,
    priceWithoutDiscount: 100,
};

const root = document.createElement('div');
document.body.append(root);

function renderAndComparePrice(id, html) {
    const el = document.createElement('p', { id });
    el.setAttribute('id', id);
    el.innerHTML = html;
    root.append(el);
    expect(el.innerHTML).to.be.html(snapshots[id]);
}

describe('function "createPriceTemplate"', () => {
    describe('argument "attributes"', () => {
        it('renders custom attributes having allowed types', function () {
            const template = createPriceTemplate();
            renderAndComparePrice(
                'createPriceTemplate1',
                template(context, value, {
                    string: 's',
                    json: '{ "foo" : "bar" }',
                    number: 1,
                    truthy: true,
                    falsy: false,
                    null: null,
                    undefined: undefined,
                    array: [1, 2, 3],
                    object: { foo: 'bar' },
                }),
            );
        });

        it('does not throw if attributes are missing', () => {
            const template = createPriceTemplate();
            expect(() => template(context, value)).to.not.throw();
        });
    });

    describe('displayPrice logic', () => {
        const promoValue = {
            formatString: '#0',
            price: 80,
            priceWithoutDiscount: 100,
            promotion: {
                start: '2024-11-15T04:02:37.000Z',
                end: '2030-03-01T07:59:00.000Z',
                displaySummary: {
                    outcomeType: 'PERCENTAGE_DISCOUNT',
                    duration: 'P12M',
                    amount: 25,
                    minProductQuantity: 1,
                },
            },
        };

        it('uses priceWithoutDiscount when promotion exists but not applied (not alternative)', function () {
            // isPromoApplied will be false when instant is before promotion start
            const template = createPriceTemplate();
            const promoContext = {
                ...context,
                isPromoApplied: false,
            };
            renderAndComparePrice(
                'createPriceTemplatePromoNotApplied',
                template(promoContext, promoValue, {}),
            );
        });

        it('uses price when promotion exists but not applied and isAlternativePrice is true', function () {
            const template = createPriceTemplate({ isAlternativePrice: true });
            const promoContext = {
                ...context,
                isPromoApplied: false,
            };
            renderAndComparePrice(
                'createPriceTemplatePromoNotAppliedAlternative',
                template(promoContext, promoValue, {}),
            );
        });

        it('uses priceWithoutDiscount when displayStrikethrough is true', function () {
            const template = createPriceTemplate({ displayStrikethrough: true });
            renderAndComparePrice(
                'createPriceTemplateStrikethrough',
                template(context, valueDiscount, {}),
            );
        });

        it('uses price in default case', function () {
            const template = createPriceTemplate();
            renderAndComparePrice(
                'createPriceTemplateDefault',
                template(context, value, {}),
            );
        });

        it('uses price when promotion is applied', function () {
            const template = createPriceTemplate();
            const promoContext = {
                ...context,
                isPromoApplied: true,
            };
            renderAndComparePrice(
                'createPriceTemplatePromoApplied',
                template(promoContext, promoValue, {}),
            );
        });
    });
});

describe('function "createPromoPriceTemplate"', () => {
    it('displays both new & old prices', function () {
        const template = createPromoPriceTemplate();
        renderAndComparePrice(
            'createPromoPriceTemplate1',
            template(context, valueDiscount, {
                string: 's',
                json: '{ "foo" : "bar" }',
                number: 1,
                truthy: true,
                falsy: false,
                null: null,
                undefined: undefined,
                array: [1, 2, 3],
                object: { foo: 'bar' },
            }),
        );
    });
    it('displays only new price in case old is the same than new', function () {
        const template = createPromoPriceTemplate();
        renderAndComparePrice(
            'createPromoPriceTemplate2',
            template(context, valueNotApplicableDiscount, {
                string: 's',
                json: '{ "foo" : "bar" }',
                number: 1,
                truthy: true,
                falsy: false,
                null: null,
                undefined: undefined,
                array: [1, 2, 3],
                object: { foo: 'bar' },
            }),
        );
    });
});

describe('function "createPriceWithAnnualTemplate"', function () {
    it('displays ABM with annual price', () => {
        const template = createPriceWithAnnualTemplate();
        renderAndComparePrice(
            'createPriceWithAnnualTemplate1',
            template(context, valueAbm, {}),
        );
    });
});

describe('function "createPromoPriceWithAnnualTemplate"', function () {
    it('displays ABM with annual price and old price', () => {
        const template = createPromoPriceWithAnnualTemplate();
        renderAndComparePrice(
            'createPromoPriceWithAnnualTemplate1',
            template({ ...context, quantity: 1 }, valueDiscountAbm, {}),
        );
    });
});

describe('Promotion price display with annual template', () => {
    const basePromoContext = {
        country: 'AU',
        language: 'en',
    };

    const promoValue = {
        formatString: "'A$'#,##0.00",
        price: 23.23,
        priceWithoutDiscount: 30.99,
        commitment: 'YEAR',
        term: 'MONTHLY',
        quantity: 1,
        promotion: {
            start: '2024-11-15T04:02:37.000Z',
            end: '2030-03-01T07:59:00.000Z',
            outcomeType: 'PERCENTAGE_DISCOUNT',
            duration: 'P6M',
            amount: 25,
            minProductQuantity: 1,
            displaySummary: {
              outcomeType: 'PERCENTAGE_DISCOUNT',
              duration: 'P6M',
              amount: 25,
              minProductQuantity: 1,
          },
        },
    };

    const template = createPromoPriceWithAnnualTemplate();

    it('displays annual price with promotion applied when promotion is active', () => {
        const promoContext = {
            ...basePromoContext,
            instant: '2024-12-01T00:00:00.000Z',
        };
        renderAndComparePrice(
            'annualTemplatePromo',
            template(promoContext, promoValue, {}),
        );
    });

    it('displays annual price with promotion applied when promotion is active #2', () => {
        const promoContext = {
            ...basePromoContext,
            instant: '2025-05-02T07:00:00.000Z',
        };
        renderAndComparePrice(
            'annualTemplatePromo2',
            template(
                promoContext,
                {
                    price: 48.49,
                    priceWithoutDiscount: 96.99,
                    priceWithoutTax: 44.08,
                    priceWithoutDiscountAndTax: 88.17,
                    usePrecision: true,
                    formatString: "'A$'#,##0.00",
                    taxDisplay: 'TAX_INCLUSIVE_DETAILS',
                    taxTerm: 'GST',
                    commitment: 'YEAR',
                    term: 'MONTHLY',
                    promotion: {
                        start: '2025-04-02T07:00:00.000Z',
                        end: '2025-05-31T06:59:00.000Z',
                        displaySummary: {
                            outcomeType: 'PERCENTAGE_DISCOUNT',
                            duration: 'P6M',
                            amount: 50.0,
                            minProductQuantity: 1,
                        },
                    },
                },
                {},
            ),
        );
    });

    it('displays annual price based on regular price when promotion has not started yet', () => {
        const promoContext = {
            ...basePromoContext,
            instant: '2024-11-15T03:02:37.000Z',
        };
        renderAndComparePrice(
            'annualTemplatePromoNotStarted',
            template(promoContext, promoValue, {}),
        );
    });

    it('displays annual price based on regular price when promotion has expired', () => {
        const promoContext = {
            ...basePromoContext,
            instant: '2030-03-01T08:59:00.000Z',
        };
        renderAndComparePrice(
            'annualTemplatePromoExpired',
            template(promoContext, promoValue, {}),
        );
    });
});
