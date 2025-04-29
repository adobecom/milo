import { toBoolean } from '@dexter/tacocat-core';

import {
    cssClassNames as templateCssClassNames,
    defaultLiterals,
    formatLiteral,
    WCS_TAX_DISPLAY_EXCLUSIVE,
    literalKeys as templateLiteralKeys,
    renderSpan,
} from './template.js';

const cssClassNames = {
    ...templateCssClassNames,
    containerLegal: 'price-legal',
    planType: 'price-plan-type',
};

const literalKeys = {
    ...templateLiteralKeys,
    planTypeLabel: 'planTypeLabel',
};

function renderContainer(
    cssClass,
    { perUnitLabel, taxInclusivityLabel, planTypeLabel },
    attributes = {},
) {
    let markup = '';
    markup += renderSpan(cssClassNames.unitType, perUnitLabel, null, true);

    if (perUnitLabel && (taxInclusivityLabel || planTypeLabel)) {
        markup += ' (';
    }

    if (taxInclusivityLabel && planTypeLabel) {
        taxInclusivityLabel += '. ';
    }
    markup += renderSpan(
        cssClassNames.taxInclusivity,
        taxInclusivityLabel,
        true,
    );
    markup += renderSpan(cssClassNames.planType, planTypeLabel, null);

    if (perUnitLabel && (taxInclusivityLabel || planTypeLabel)) {
        markup += ')';
    }

    return renderSpan(cssClass, markup, {
        ...attributes,
    });
}

const legalTemplate = (
    {
        country,
        displayPerUnit = false,
        displayTax = false,
        displayPlanType = false,
        language,
        literals: priceLiterals = {},
    } = {},
    { taxDisplay, taxTerm, planType } = {},
    attributes = {},
) => {
    const literals = {
        ...defaultLiterals,
        ...priceLiterals,
    };

    const locale = `${language.toLowerCase()}-${country.toUpperCase()}`;

    let perUnitLabel = '';
    if (toBoolean(displayPerUnit)) {
        perUnitLabel = formatLiteral(
            literals,
            locale,
            literalKeys.perUnitLabel,
            {
                perUnit: 'LICENSE',
            },
        );
    }

    let taxInclusivityLabel = '';
    if (country === 'US' && language === 'en') {
        displayTax = false;
    }
    if (toBoolean(displayTax) && taxTerm) {
        taxInclusivityLabel = formatLiteral(
            literals,
            locale,
            taxDisplay === WCS_TAX_DISPLAY_EXCLUSIVE
                ? literalKeys.taxExclusiveLabel
                : literalKeys.taxInclusiveLabel,
            { taxTerm },
        );
    }

    let planTypeLabel = '';
    if (toBoolean(displayPlanType) && planType) {
        planTypeLabel = formatLiteral(
            literals,
            locale,
            literalKeys.planTypeLabel,
            {
                planType,
            },
        );
    }

    let cssClass = cssClassNames.container;
    cssClass += ' ' + cssClassNames.containerLegal;

    return renderContainer(
        cssClass,
        {
            perUnitLabel,
            taxInclusivityLabel,
            planTypeLabel,
        },
        attributes,
    );
};

export { legalTemplate };
