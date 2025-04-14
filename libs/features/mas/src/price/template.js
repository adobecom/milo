import {
    escapeHtml,
    isObject,
    isNumber,
    isString,
    toBoolean,
    createLog,
} from '@dexter/tacocat-core';
import IntlMessageFormat from 'intl-messageformat';
import {
    formatOpticalPrice,
    formatRegularPrice,
    formatAnnualPrice,
    makeSpacesAroundNonBreaking,
} from './utilities.js';

// JSON imports require new syntax to run in Milo/wtr tests,
// but the new syntax is not yet supported by ESLint:
// import defaultLiterals from '../literals.json' assert {type: 'json'};
// @see https://github.com/eslint/eslint/discussions/15305
// the easiest solution for now is to inline the literals
export const defaultLiterals = {
    recurrenceLabel:
        '{recurrenceTerm, select, MONTH {/mo} YEAR {/yr} other {}}',
    recurrenceAriaLabel:
        '{recurrenceTerm, select, MONTH {per month} YEAR {per year} other {}}',
    perUnitLabel: '{perUnit, select, LICENSE {per license} other {}}',
    perUnitAriaLabel: '{perUnit, select, LICENSE {per license} other {}}',
    freeLabel: 'Free',
    freeAriaLabel: 'Free',
    taxExclusiveLabel:
        '{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}',
    taxInclusiveLabel:
        '{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}',
    alternativePriceAriaLabel: 'Alternatively at',
    strikethroughAriaLabel: 'Regularly at',
    planTypeLabel: '{planType, select, ABM {Annual, paid monthly.} other {}}',
};

const log = createLog('ConsonantTemplates/price');

const htmlPattern = /<\/?[^>]+(>|$)/g;

const cssClassNames = {
    container: 'price',
    containerOptical: 'price-optical',
    containerStrikethrough: 'price-strikethrough',
    containerAlternative: 'price-alternative',
    containerAnnual: 'price-annual',
    containerAnnualPrefix: 'price-annual-prefix',
    containerAnnualSuffix: 'price-annual-suffix',
    disabled: 'disabled',
    currencySpace: 'price-currency-space',
    currencySymbol: 'price-currency-symbol',
    decimals: 'price-decimals',
    decimalsDelimiter: 'price-decimals-delimiter',
    integer: 'price-integer',
    recurrence: 'price-recurrence',
    taxInclusivity: 'price-tax-inclusivity',
    unitType: 'price-unit-type',
    planType: 'price-plan-type',
};
const literalKeys = {
    perUnitLabel: 'perUnitLabel',
    perUnitAriaLabel: 'perUnitAriaLabel',
    recurrenceLabel: 'recurrenceLabel',
    recurrenceAriaLabel: 'recurrenceAriaLabel',
    taxExclusiveLabel: 'taxExclusiveLabel',
    taxInclusiveLabel: 'taxInclusiveLabel',
    strikethroughAriaLabel: 'strikethroughAriaLabel',
    alternativePriceAriaLabel: 'alternativePriceAriaLabel',
    planTypeLabel: 'planTypeLabel',
};
const WCS_TAX_DISPLAY_EXCLUSIVE = 'TAX_EXCLUSIVE';

const renderAttributes = (attributes) =>
    isObject(attributes)
        ? Object.entries(attributes)
              .filter(
                  ([, value]) =>
                      isString(value) || isNumber(value) || value === true,
              )
              .reduce(
                  (html, [key, value]) =>
                      html +
                      ` ${key}${
                          value === true ? '' : '="' + escapeHtml(value) + '"'
                      }`,
                  '',
              )
        : '';

const renderSpan = (cssClass, content, attributes, convertSpaces = false) => {
    return (
        `<span class="${cssClass}${
            content ? '' : ' ' + cssClassNames.disabled
        }"${renderAttributes(attributes)}>` +
        `${
            convertSpaces
                ? makeSpacesAroundNonBreaking(content)
                : (content ?? '')
        }</span>`
    );
};

function renderContainer(
    cssClass,
    {
        accessibleLabel,
        altAccessibleLabel,
        currencySymbol,
        decimals,
        decimalsDelimiter,
        hasCurrencySpace,
        integer,
        isCurrencyFirst,
        recurrenceLabel,
        perUnitLabel,
        taxInclusivityLabel,
        planTypeLabel,
    },
    attributes = {},
) {
    const currencyMarkup = renderSpan(
        cssClassNames.currencySymbol,
        currencySymbol,
    );
    const currencySpaceMarkup = renderSpan(
        cssClassNames.currencySpace,
        hasCurrencySpace ? '&nbsp;' : '',
    );

    let markup = '';
    if (accessibleLabel)
        markup = `<sr-only class="strikethrough-aria-label">${accessibleLabel}</sr-only>`;
    else if (altAccessibleLabel)
        markup = `<sr-only class="alt-aria-label">${altAccessibleLabel}</sr-only>`;
    if (isCurrencyFirst) markup += currencyMarkup + currencySpaceMarkup;
    markup += renderSpan(cssClassNames.integer, integer);
    markup += renderSpan(cssClassNames.decimalsDelimiter, decimalsDelimiter);
    markup += renderSpan(cssClassNames.decimals, decimals);
    if (!isCurrencyFirst) markup += currencySpaceMarkup + currencyMarkup;
    markup += renderSpan(cssClassNames.recurrence, recurrenceLabel, null, true);
    markup += renderSpan(cssClassNames.unitType, perUnitLabel, null, true);
    markup += renderSpan(
        cssClassNames.taxInclusivity,
        taxInclusivityLabel,
        true,
    );
    if (planTypeLabel) {
        markup += renderSpan(cssClassNames.planType, planTypeLabel, null, true);
    }

    return renderSpan(cssClass, markup, {
        ...attributes,
    });
}

/**
 * @type { import('./types').createPriceTemplate }
 * Returns a function formatting product prices using provided options.
 */
// TODO: check WCS data elements to include: analytics, endDate, language, merchant, offerType, pricePoint, startDate
const createPriceTemplate =
    ({
        isAlternativePrice = false,
        displayOptical = false,
        displayStrikethrough = false,
        displayAnnual = false,
        instant = undefined,
    } = {}) =>
    (
        {
            country,
            displayFormatted = true,
            displayRecurrence = true,
            displayPerUnit = false,
            displayTax = false,
            displayPlanType = false,
            language,
            literals: priceLiterals = {},
            quantity = 1,
        } = {},
        {
            commitment,
            offerSelectorIds,
            formatString,
            price,
            priceWithoutDiscount,
            taxDisplay,
            taxTerm,
            planType,
            term,
            usePrecision,
            promotion,
        } = {},
        attributes = {},
    ) => {
        Object.entries({
            country,
            formatString,
            language,
            price,
        }).forEach(([key, value]) => {
            if (value == null) {
                /* c8 ignore next 2 */
                throw new Error(
                    `Argument "${key}" is missing for osi ${offerSelectorIds?.toString()}, country ${country}, language ${language}`,
                );
            }
        });

        const literals = {
            ...defaultLiterals,
            ...priceLiterals,
        };

        const locale = `${language.toLowerCase()}-${country.toUpperCase()}`;

        function formatLiteral(key, parameters) {
            const literal = literals[key];
            if (literal == undefined) {
                /* c8 ignore next 2 */
                return '';
            }
            try {
                return new IntlMessageFormat(
                    literal.replace(htmlPattern, ''),
                    locale,
                ).format(parameters);
            } catch {
                /* c8 ignore next 2 */
                log.error('Failed to format literal:', literal);
                return '';
            }
        }

        const displayPrice =
            displayStrikethrough && priceWithoutDiscount
                ? priceWithoutDiscount
                : price;

        let method = displayOptical ? formatOpticalPrice : formatRegularPrice;
        if (displayAnnual) {
            method = formatAnnualPrice;
        }
        const { accessiblePrice, recurrenceTerm, ...formattedPrice } = method({
            commitment,
            formatString,
            instant,
            isIndianPrice: country === 'IN',
            originalPrice: price,
            priceWithoutDiscount,
            price: displayOptical ? price : displayPrice,
            promotion,
            quantity,
            term,
            usePrecision,
        });

        let accessibleLabel = '';
        let altAccessibleLabel = '';

        let recurrenceLabel = '';
        if (toBoolean(displayRecurrence) && recurrenceTerm) {
            recurrenceLabel = formatLiteral(literalKeys.recurrenceLabel, {
                recurrenceTerm,
            });
        }

        let perUnitLabel = '';
        if (toBoolean(displayPerUnit)) {
            perUnitLabel = formatLiteral(literalKeys.perUnitLabel, {
                perUnit: 'LICENSE',
            });
        }

        let taxInclusivityLabel = '';
        if (country === 'US' && language === 'en') {
            displayTax = false;
        }
        if (toBoolean(displayTax) && taxTerm) {
            taxInclusivityLabel = formatLiteral(
                taxDisplay === WCS_TAX_DISPLAY_EXCLUSIVE
                    ? literalKeys.taxExclusiveLabel
                    : literalKeys.taxInclusiveLabel,
                { taxTerm },
            );
        }

        let planTypeLabel = '';
        if (toBoolean(displayPlanType) && planType) {
            planTypeLabel = formatLiteral(literalKeys.planTypeLabel, {
                planType,
            });
        }

        if (displayStrikethrough) {
            accessibleLabel = formatLiteral(
                literalKeys.strikethroughAriaLabel,
                {
                    strikethroughPrice: accessibleLabel,
                },
            );
        }

        if (isAlternativePrice) {
            altAccessibleLabel = formatLiteral(
                literalKeys.alternativePriceAriaLabel,
                {
                    alternativePrice: altAccessibleLabel,
                },
            );
        }

        let cssClass = cssClassNames.container;
        if (displayOptical) {
            cssClass += ' ' + cssClassNames.containerOptical;
        }
        if (displayStrikethrough) {
            cssClass += ' ' + cssClassNames.containerStrikethrough;
        }
        if (isAlternativePrice) {
            cssClass += ' ' + cssClassNames.containerAlternative;
        }
        if (displayAnnual) {
            cssClass += ' ' + cssClassNames.containerAnnual;
        }

        if (toBoolean(displayFormatted)) {
            return renderContainer(
                cssClass,
                {
                    ...formattedPrice,
                    accessibleLabel,
                    altAccessibleLabel,
                    recurrenceLabel,
                    perUnitLabel,
                    taxInclusivityLabel,
                    planTypeLabel,
                },
                attributes,
            );
        }
        /* c8 ignore next 26 */
        const {
            currencySymbol,
            decimals,
            decimalsDelimiter,
            hasCurrencySpace,
            integer,
            isCurrencyFirst,
        } = formattedPrice;

        const unformattedPrice = [integer, decimalsDelimiter, decimals];
        if (isCurrencyFirst) {
            // the following is a non-breaking space, don't change.
            unformattedPrice.unshift(hasCurrencySpace ? ' ' : '');
            unformattedPrice.unshift(currencySymbol);
        } else {
            // the following is a non-breaking space, don't change.
            unformattedPrice.push(hasCurrencySpace ? ' ' : '');
            unformattedPrice.push(currencySymbol);
        }
        unformattedPrice.push(
            recurrenceLabel,
            perUnitLabel,
            taxInclusivityLabel,
            planTypeLabel,
        );
        const content = unformattedPrice.join('');
        return renderSpan(cssClass, content, attributes);
    };

/**
 * @type { import('./types').createPromoPriceTemplate }
 * Returns a function formatting product promo prices using provided options.
 * promo price can either be regular price if discounted price and regular price are the same (not applicable
 * or outdated promotion), or concatenation of new & old prices, old being stroke through.
 */
const createPromoPriceTemplate = () => (context, value, attributes) => {
    const displayOldPrice =
        context.displayOldPrice === undefined ||
        toBoolean(context.displayOldPrice);
    const shouldDisplayOldPrice =
        displayOldPrice &&
        value.priceWithoutDiscount &&
        value.priceWithoutDiscount != value.price;
    return `${createPriceTemplate({ isAlternativePrice: shouldDisplayOldPrice })(context, value, attributes)}${
        shouldDisplayOldPrice
            ? '&nbsp;' +
              createPriceTemplate({
                  displayStrikethrough: true,
              })(context, value, attributes)
            : ''
    }`;
};

const createPromoPriceWithAnnualTemplate =
    () => (context, value, attributes) => {
        let { instant } = context;
        try {
            if (!instant) {
                instant = new URLSearchParams(document.location.search).get(
                    'instant',
                );
            }
            if (instant) {
                instant = new Date(instant);
            }
        } catch (e) {
            instant = undefined;
            /* ignore the error */
        }
        const ctxStAnnual = {
            ...context,
            displayTax: false,
            displayPlanType: false,
            displayPerUnit: false,
        };
        const displayOldPrice =
            context.displayOldPrice === undefined ||
            toBoolean(context.displayOldPrice);
        const shouldDisplayOldPrice =
            displayOldPrice &&
            value.priceWithoutDiscount &&
            value.priceWithoutDiscount != value.price;
        return `${
            shouldDisplayOldPrice
                ? createPriceTemplate({
                      displayStrikethrough: true,
                  })(ctxStAnnual, value, attributes) + '&nbsp;'
                : ''
        }${createPriceTemplate({ isAlternativePrice: shouldDisplayOldPrice })(context, value, attributes)}${renderSpan(cssClassNames.containerAnnualPrefix, '&nbsp;(')}${createPriceTemplate(
            {
                displayAnnual: true,
                instant,
            },
        )(
            ctxStAnnual,
            value,
            attributes,
        )}${renderSpan(cssClassNames.containerAnnualSuffix, ')')}`;
    };

const createPriceWithAnnualTemplate = () => (context, value, attributes) => {
    const ctxAnnual = {
        ...context,
        displayTax: false,
        displayPlanType: false,
        displayPerUnit: false,
    };
    return `${createPriceTemplate({ isAlternativePrice: context.displayOldPrice })(context, value, attributes)}${renderSpan(cssClassNames.containerAnnualPrefix, '&nbsp;(')}${createPriceTemplate(
        {
            displayAnnual: true,
        },
    )(
        ctxAnnual,
        value,
        attributes,
    )}${renderSpan(cssClassNames.containerAnnualSuffix, ')')}`;
};

export {
    createPriceTemplate,
    createPromoPriceTemplate,
    createPriceWithAnnualTemplate,
    createPromoPriceWithAnnualTemplate,
};
