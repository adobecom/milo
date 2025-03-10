import {
    createPriceTemplate,
    createPromoPriceTemplate,
    createPriceWithAnnualTemplate,
    createPromoPriceWithAnnualTemplate,
} from './template.js';

import { isPromotionActive } from './utilities.js';

const price = createPriceTemplate();
const pricePromo = createPromoPriceTemplate();
const priceOptical = createPriceTemplate({
    displayOptical: true,
});
const priceStrikethrough = createPriceTemplate({
    displayStrikethrough: true,
});
const priceAlternative = createPriceTemplate({
    displayStrikethroughNext: true,
});
const priceAnnual = createPriceTemplate({
    displayAnnual: true,
});
const priceWithAnnual = createPriceWithAnnualTemplate();
const pricePromoWithAnnual = createPromoPriceWithAnnualTemplate();

export {
    price,
    pricePromo,
    priceOptical,
    priceStrikethrough,
    priceAlternative,
    priceAnnual,
    priceWithAnnual,
    pricePromoWithAnnual,
    isPromotionActive,
};
