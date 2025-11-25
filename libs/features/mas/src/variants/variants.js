import { Catalog, CATALOG_AEM_FRAGMENT_MAPPING } from './catalog.js';
import { Image } from './image.js';
import { InlineHeading } from './inline-heading.js';
import { MiniCompareChart } from './mini-compare-chart.js';
import {
  Plans,
  PLANS_AEM_FRAGMENT_MAPPING,
  PLANS_EDUCATION_AEM_FRAGMENT_MAPPING,
  PLANS_STUDENTS_AEM_FRAGMENT_MAPPING,
} from './plans.js';
import {
  PlansV2,
  PLANS_V2_AEM_FRAGMENT_MAPPING,
} from './plans-v2.js';
import { Product } from './product.js';
import { Segment } from './segment.js';
import {
  SPECIAL_OFFERS_AEM_FRAGMENT_MAPPING,
  SpecialOffer,
} from './special-offer.js';
import { SimplifiedPricingExpress, SIMPLIFIED_PRICING_EXPRESS_AEM_FRAGMENT_MAPPING } from './simplified-pricing-express.js';
import { FullPricingExpress, FULL_PRICING_EXPRESS_AEM_FRAGMENT_MAPPING } from './full-pricing-express.js';
import { Mini, MINI_AEM_FRAGMENT_MAPPING } from './mini.js';

// Registry for dynamic variants
const variantRegistry = new Map();

const variantState = new WeakMap();

// Cache for variant stylesheets to avoid duplicates
const variantStyleSheets = new Map();

// Function to register a new variant
export const registerVariant = (
  name,
  variantClass,
  fragmentMapping = null,
  style = null,
  collectionOptions,
) => {
  variantRegistry.set(name, {
    class: variantClass,
    fragmentMapping,
    style,
    collectionOptions,
  });
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
registerVariant('plans', Plans, PLANS_AEM_FRAGMENT_MAPPING, Plans.variantStyle, Plans.collectionOptions);
registerVariant('plans-students', Plans, PLANS_STUDENTS_AEM_FRAGMENT_MAPPING, Plans.variantStyle, Plans.collectionOptions);
registerVariant('plans-education', Plans, PLANS_EDUCATION_AEM_FRAGMENT_MAPPING, Plans.variantStyle, Plans.collectionOptions);
registerVariant('plans-v2', PlansV2, PLANS_V2_AEM_FRAGMENT_MAPPING, PlansV2.variantStyle, PlansV2.collectionOptions);
registerVariant('product', Product, null, Product.variantStyle);
registerVariant('segment', Segment, null, Segment.variantStyle);
registerVariant(
  'special-offers',
  SpecialOffer,
  SPECIAL_OFFERS_AEM_FRAGMENT_MAPPING,
  SpecialOffer.variantStyle,
);
registerVariant(
  'simplified-pricing-express',
  SimplifiedPricingExpress,
  SIMPLIFIED_PRICING_EXPRESS_AEM_FRAGMENT_MAPPING,
  SimplifiedPricingExpress.variantStyle,
);
registerVariant(
    'full-pricing-express',
    FullPricingExpress,
    FULL_PRICING_EXPRESS_AEM_FRAGMENT_MAPPING,
    FullPricingExpress.variantStyle,
);
registerVariant(
  'mini',
  Mini,
  MINI_AEM_FRAGMENT_MAPPING,
  Mini.variantStyle,
);

const applyStyleSheet = (card, style, state) => {
  try {
    let sheet = variantStyleSheets.get(card.variant);
    if (!sheet) {
      sheet = new CSSStyleSheet();
      sheet.replaceSync(style.cssText);
      variantStyleSheets.set(card.variant, sheet);
    }

    // Remove old sheet if exists and it's different
    if (state?.styleSheet && state.styleSheet !== sheet) {
      const index = card.shadowRoot.adoptedStyleSheets.indexOf(state.styleSheet);
      if (index !== -1) {
        card.shadowRoot.adoptedStyleSheets.splice(index, 1);
      }
    }

    if (!card.shadowRoot.adoptedStyleSheets.includes(sheet)) {
      card.shadowRoot.adoptedStyleSheets.push(sheet);
    }

    return { styleSheet: sheet };
  } catch (e) {
    // Fallback for browsers without CSSStyleSheet constructor
    const styleElement = document.createElement('style');
    styleElement.textContent = style.cssText;
    styleElement.setAttribute('data-variant-style', card.variant);

    // Remove old style element
    const oldElement = state?.styleElement
                          || card.shadowRoot.querySelector('[data-variant-style]');
    if (oldElement) oldElement.remove();

    card.shadowRoot.appendChild(styleElement);
    return { styleElement };
  }
};

const getVariantLayout = (card) => {
  const variantInfo = variantRegistry.get(card.variant);
  if (!variantInfo) return undefined;

  const { class: VariantClass, style } = variantInfo;
  const state = variantState.get(card);

  if (state?.appliedVariant === card.variant) {
    return new VariantClass(card);
  }

  const styleState = style ? applyStyleSheet(card, style, state) : {};
  variantState.set(card, {
    appliedVariant: card.variant,
    ...styleState,
  });

  return new VariantClass(card);
};

export function getFragmentMapping(variant) {
  return variantRegistry.get(variant)?.fragmentMapping;
}

export function getCollectionOptions(variant) {
  return variantRegistry.get(variant)?.collectionOptions;
}

export { getVariantLayout };
