import { Catalog, CATALOG_AEM_FRAGMENT_MAPPING } from './catalog.js';
import { Image } from './image.js';
import { InlineHeading } from './inline-heading.js';
import { MiniCompareChart } from './mini-compare-chart.js';
import { Plans, PLANS_AEM_FRAGMENT_MAPPING } from './plans.js';
import { Product } from './product.js';
import { Segment } from './segment.js';
import {
    SPECIAL_OFFERS_AEM_FRAGMENT_MAPPING,
    SpecialOffer,
} from './special-offer.js';

// Registry for dynamic variants
const variantRegistry = new Map();
const variantStylesRegistry = new Map();
const variantFragmentMappingsRegistry = new Map();

// Function to register a new variant
export const registerVariant = (
    name,
    variantClass,
    fragmentMapping = null,
    style = null,
) => {
    variantRegistry.set(name, variantClass);
    variantFragmentMappingsRegistry.set(name, fragmentMapping);
    if (style) {
        variantStylesRegistry.set(name, style);
    }
};

// Add core variants to registry
registerVariant(
    'catalog',
    Catalog,
    CATALOG_AEM_FRAGMENT_MAPPING,
    Catalog.variantStyle,
);
registerVariant('image', Image);
registerVariant('inline-heading', InlineHeading);
registerVariant(
    'mini-compare-chart',
    MiniCompareChart,
    null,
    MiniCompareChart.variantStyle,
);
registerVariant('plans', Plans, PLANS_AEM_FRAGMENT_MAPPING, Plans.variantStyle);
registerVariant('product', Product, null, Product.variantStyle);
registerVariant('segment', Segment, null, Segment.variantStyle);
registerVariant(
    'special-offers',
    SpecialOffer,
    SPECIAL_OFFERS_AEM_FRAGMENT_MAPPING,
    SpecialOffer.variantStyle,
);

const getVariantLayout = (card, mustMatch = false) => {
    const VariantClass = variantRegistry.get(card.variant);
    if (!VariantClass) {
        return mustMatch ? undefined : new Product(card);
    }
    const style = variantStylesRegistry.get(card.variant);
    if (style) {
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(style.cssText);
        card.shadowRoot.adoptedStyleSheets.push(sheet);
    }
    return new VariantClass(card);
};

export const variantFragmentMappings = Object.fromEntries(
    variantFragmentMappingsRegistry,
);

export { getVariantLayout };
