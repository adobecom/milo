import { getConfig, getFederatedContentRoot } from './utils.js';

const h1h2Regex = /^h[1-2]$/i;
const traverseForTextBeforeHeader = (node, regex) => {
  if (regex.test(node.tagName)) return { text: '', foundHeader: true };
  if (node.nodeType === Node.TEXT_NODE) return { text: node.nodeValue, foundHeader: false };
  let text = '';
  let foundHeader = false;
  for (const child of node.childNodes) {
    const result = traverseForTextBeforeHeader(child, regex);
    text += result.text;
    if (result.foundHeader) {
      foundHeader = true;
      break;
    }
  }
  return { text, foundHeader };
};

export const getTextBeforeHeader = (block) => {
  if (!block) return '';
  const { text, foundHeader } = traverseForTextBeforeHeader(block, h1h2Regex);
  return foundHeader ? text.trim() : '';
};

export const getProduct = (text, productNames) => {
  if (!text) return '';
  return productNames.find(({ us }) => text.toLowerCase().includes(us.toLowerCase()))?.us || '';
};

function addClassPartToSet(className, parts, extractPrefix) {
  const segments = className.split('-');
  if (segments.length > 1) {
    const partIndex = extractPrefix ? 0 : segments.length - 1;
    parts.add(segments[partIndex]);
  }
}

// Extracts either prefixes or suffixes from a div's class names into a Set
const extractClassParts = (div, extractPrefix) => {
  const classNames = Array.from(div.classList);
  const parts = new Set();
  for (const className of classNames) {
    addClassPartToSet(className, parts, extractPrefix);
  }
  return parts;
};

function mapPartToIndices(parts, partToDivIndices, index) {
  parts.forEach((part) => {
    if (!partToDivIndices.has(part)) {
      partToDivIndices.set(part, new Set());
    }
    partToDivIndices.get(part).add(index);
  });
}

// Helper function to map class parts to the divs that have them
const mapPartsToDivIndices = (divs, extractPrefix) => {
  const partToDivIndices = new Map();
  divs.forEach((div, index) => {
    const parts = extractClassParts(div, extractPrefix);
    mapPartToIndices(parts, partToDivIndices, index);
  });
  return partToDivIndices;
};

// Main function to check for shared class patterns
const hasSharedClassPattern = (divs, { extractPrefix = false } = {}) => {
  if (divs.length < 2) return false; // Need at least 2 divs to share anything
  const partToDivIndices = mapPartsToDivIndices(divs, extractPrefix);
  return Array.from(partToDivIndices.values()).some((divIndices) => divIndices.size > 1);
};

function addDeepestContainers(div, findRepeatingContainers, deepestContainers) {
  const nestedContainers = findRepeatingContainers(div);
  if (!nestedContainers.length) return;

  let toPush = [];
  if (nestedContainers.length > 1) {
    toPush = [...nestedContainers, div];
  } else if (nestedContainers.length === 1 && nestedContainers[0] === div) {
    toPush = [div];
  }
  deepestContainers.push(...toPush);
}

// Processes nested divs to find the deepest repeating containers
const findDeepestRepeatingContainers = (repeatingDivs, findRepeatingContainers) => {
  const deepestContainers = [];
  for (const div of repeatingDivs) {
    addDeepestContainers(div, findRepeatingContainers, deepestContainers);
  }
  return deepestContainers;
};

const findRepeatingSiblings = (divs) => divs.filter(
  (div) => divs.some((otherDiv) => div !== otherDiv && (
    hasSharedClassPattern([div, otherDiv], { extractPrefix: true })
      || hasSharedClassPattern([div, otherDiv], { extractPrefix: false })
  )),
);

// Finds divs that repeat with a shared class pattern at the same DOM level
// Containers must be siblings with a shared prefix (e.g., 'card-')
// or suffix (e.g., '-item') and occur more than once.
export const findBlockContainers = (parentContainer) => {
  const childDivs = Array.from(parentContainer.children).filter((element) => element.tagName === 'DIV');
  if (!childDivs.length) return [parentContainer];

  const repeatingSiblingDivs = findRepeatingSiblings(childDivs);

  if (repeatingSiblingDivs.length > 1) {
    const deepestContainers = findDeepestRepeatingContainers(
      repeatingSiblingDivs,
      findBlockContainers,
    );
    return deepestContainers.length > 1 ? deepestContainers : [parentContainer];
  }

  const nestedRepeatingContainers = childDivs
    .map((div) => findBlockContainers(div))
    .filter((containers) => containers.length > 1);

  return nestedRepeatingContainers.length === 1 && nestedRepeatingContainers[0].length > 1
    ? nestedRepeatingContainers[0]
    : [parentContainer];
};

// Retrieves all h1-h6 headers within container.
export const getHeaders = (container) => Array.from(container.querySelectorAll('h1, h2, h3, h4, h5, h6'));

// Helper to get headers outside containers
const getHeadersOutsideContainers = (block, containers) => {
  const allHeaders = getHeaders(block);
  const containedHeaders = containers.flatMap((c) => getHeaders(c));
  return allHeaders.filter((h) => !containedHeaders.includes(h));
};

// Helper to assign ARIA label based on product or header
const tryAssignAriaLabel = (
  cta,
  headers,
  productNames,
  textsToAddProductNames,
  textsToAddHeaders,
  textBeforeHeader,
) => {
  // Filter out all headers of a level if there are multiple of that level
  const singleOccurrenceHeaders = headers.filter((header) => {
    const level = header.tagName.toLowerCase();
    return headers.filter((h) => h.tagName.toLowerCase() === level).length === 1;
  });

  const buttonText = cta.textContent.trim().toLowerCase();
  const productInCTA = (!cta.classList.contains('modal') && getProduct(cta.href?.replace('-', ' '), productNames)) || '';
  const allContent = [...singleOccurrenceHeaders, textBeforeHeader].filter(Boolean);

  if (textsToAddProductNames.includes(buttonText)) {
    const productHeader = allContent.find((header) => {
      const text = typeof header === 'string' ? header : header.textContent.trim();
      const product = getProduct(text, productNames);
      return product && (product.includes(productInCTA)
        || productInCTA.includes(product) || !productInCTA);
    });
    if (productHeader) {
      const productName = getProduct(productHeader.textContent?.trim()
        || productHeader, productNames);
      cta.setAttribute('aria-label', `${cta.textContent} ${productName}`);
      return true;
    }
  }

  if (textsToAddHeaders.includes(buttonText) && allContent.length) {
    const headerText = allContent[0].textContent?.trim() || allContent[0];
    cta.setAttribute('aria-label', `${cta.textContent} - ${headerText}`);
    return true;
  }

  return false;
};

// Adds an ARIA label to a CTA element based on context (product names or headers).
export const addAriaLabelToCTA = (cta, productNames, textsToAddProductNames, textsToAddHeaders) => {
  const block = cta.closest('.section > div');
  if (!block) return;

  const containers = findBlockContainers(block);
  const ctaContainers = containers.filter((container) => container.contains(cta)) || [block];
  const isInContainer = ctaContainers[0] !== block;

  // Try to assign label from containers first
  for (const container of ctaContainers) {
    if (isInContainer && tryAssignAriaLabel(
      cta,
      getHeaders(container),
      productNames,
      textsToAddProductNames,
      textsToAddHeaders,
      getTextBeforeHeader(container),
    )) return;
  }

  const uncontainedHeaders = getHeadersOutsideContainers(block, containers);
  if (uncontainedHeaders.length && tryAssignAriaLabel(
    cta,
    uncontainedHeaders,
    productNames,
    textsToAddProductNames,
    textsToAddHeaders,
  )) {
    return;
  }
  const textBeforeHeader = getTextBeforeHeader(block);
  tryAssignAriaLabel(
    cta,
    getHeaders(block),
    productNames,
    textsToAddProductNames,
    textsToAddHeaders,
    textBeforeHeader,
  );
};

/**
 * Asynchronously adds ARIA labels to all eligible CTAs on the page.
 * Fetches configuration and product names, then applies labels based on locale.
 */
export default async function addAriaLabels() {
  const selector = getConfig().ariaLabelCTASelector || '.con-button:not([aria-label])';
  const ctas = [...document.body.querySelectorAll(selector)].filter((button) => {
    const ariaLabel = button.getAttribute('aria-label');
    return ariaLabel !== '';
  });
  if (!ctas.length) return;

  const logError = (msg, error) => window.lana.log(`${msg}: ${error}`, { tags: 'aria' });

  const [configResponse, namesResponse] = await Promise.all([
    fetch(`${getFederatedContentRoot()}/federal/assets/data/cta-aria-label-config.json`)
      .catch((e) => logError('Could not fetch cta-aria-label-config.json', e)),
    fetch(`${getFederatedContentRoot()}/federal/assets/data/product-names.json`)
      .catch((e) => logError('Could not fetch product-names.json', e)),
  ]);

  if (!configResponse || !namesResponse) return;

  const ctaAriaLabelConfig = await configResponse.json()
    .catch((e) => logError('Could not parse cta-aria-label-config.json', e));
  const productNames = await namesResponse.json()
    .catch((e) => logError('Could not parse product-names.json', e));

  if (!ctaAriaLabelConfig || !productNames) return;

  const { prefix } = getConfig().locale;
  const localePrefix = prefix?.replace('/', '') || 'us';

  if (!ctaAriaLabelConfig.data?.length || !productNames.data?.length) {
    window.lana.log(
      `No cta aria label config or product names found for locale ${localePrefix}`,
      { tags: 'aria' },
    );
    return;
  }

  const configForLocale = ctaAriaLabelConfig.data.find((item) => item.prefixes.split(',')
    .map((p) => p.trim())
    .includes(localePrefix));
  if (!configForLocale) return;

  const textsToAddProductNames = configForLocale.addProductName
    .split(/[\n,]+/)
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);
  const textsToAddHeaders = configForLocale.addHeader
    .split(/[\n,]+/)
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);

  const modifiedCTAs = [];
  ctas.forEach((cta) => {
    addAriaLabelToCTA(cta, productNames.data, textsToAddProductNames, textsToAddHeaders);
    if (cta.hasAttribute('aria-label')) modifiedCTAs.push(cta);
  });
}
