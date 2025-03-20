import { getConfig, getFederatedContentRoot } from './utils.js';

export const getTextBeforeHeader = (block) => {
  if (!block) return '';

  let text = '';
  let foundHeader = false;

  const traverse = (node) => {
    if (foundHeader) return;

    if (node.nodeType === Node.ELEMENT_NODE) {
      if (/^h[1-2]$/i.test(node.tagName)) {
        foundHeader = true;
        return;
      }
      node.childNodes.forEach(traverse);
    } else if (node.nodeType === Node.TEXT_NODE) {
      text += node.nodeValue;
    }
  };

  traverse(block);
  return foundHeader ? text.trim() : '';
};

export const getProduct = (text, productNames) => {
  if (!text) return '';
  const normalizedText = text.toLowerCase();
  return productNames.find(({ us }) => normalizedText.includes(us.toLowerCase()))?.us || '';
};

// Helper to extract prefix or suffix from class name parts
const getPatternPart = (parts, usePrefix) => (usePrefix ? parts[0] : parts[parts.length - 1]);

// Helper to check if two divs share a common class pattern
const divsSharePattern = (div1, div2, hasCommonPrefix, hasCommonSuffix) => {
  const div1Classes = Array.from(div1.classList);
  const div2Classes = Array.from(div2.classList);
  return div1Classes.some((cn1) => div2Classes.some((cn2) => {
    const parts1 = cn1.split('-');
    const parts2 = cn2.split('-');
    const hasPrefixMatch = hasCommonPrefix && parts1[0] === parts2[0];
    // eslint-disable-next-line max-len
    const hasSuffixMatch = hasCommonSuffix && parts1[parts1.length - 1] === parts2[parts2.length - 1];
    return parts1.length > 1 && parts2.length > 1 && (hasPrefixMatch || hasSuffixMatch);
  }));
};

// Helper to check if divs have a common pattern (prefix or suffix)
const hasCommonPattern = (divs, usePrefix) => {
  const checkFn = (parts) => getPatternPart(parts, usePrefix);
  const classNames = divs.flatMap((div) => Array.from(div.classList));
  const patterns = new Set(classNames
    .map((cn) => cn.split('-'))
    .filter((parts) => parts.length > 1)
    .map(checkFn));
  return patterns.size > 0 && divs.some((div1) => divs
    .some((div2) => div1 !== div2 && divsSharePattern(div1, div2, usePrefix, !usePrefix)));
};

// Helper to process nested containers recursively
const processNestedContainers = (patternDivs, findBlockContainersFn) => {
  const deepestContainers = [];
  patternDivs.forEach((div) => {
    const nested = findBlockContainersFn(div);
    if (nested.length === 1 && nested[0] === div) {
      deepestContainers.push(div);
    } else if (nested.length > 1) {
      deepestContainers.push(...nested);
    }
  });
  return deepestContainers;
};

// Identifies container divs within a block that share a common class pattern
// and appear multiple times at the same DOM level.
// Containers must be siblings with a shared prefix (e.g., 'card-')
// or suffix (e.g., '-item') and occur more than once.
export const findBlockContainers = (container) => {
  // Get all direct child divs of the container
  const directDivs = Array.from(container.children).filter((el) => el.tagName === 'DIV');
  if (!directDivs.length) return [container];

  // Filter divs that share a common pattern (prefix or suffix)
  const patternDivs = directDivs.filter((div) => directDivs.some((otherDiv) => div !== otherDiv && (
    hasCommonPattern([div, otherDiv], true) // has common prefix
        || hasCommonPattern([div, otherDiv], false) // has common suffix
  )));

  // Require at least two matching siblings to qualify as containers
  if (patternDivs.length > 1) {
    const deepestContainers = processNestedContainers(patternDivs, findBlockContainers);
    // Return containers only if multiple found, otherwise fallback to [container]
    return deepestContainers.length > 1 ? deepestContainers : [container];
  }

  // Recurse into child divs, but only keep results with multiple containers
  const nestedResults = directDivs
    .map((div) => findBlockContainers(div))
    .filter((results) => results.length > 1);
  // If exactly one valid set of repeating containers is found, use it;
  // otherwise, return [container]
  return nestedResults.length === 1 && nestedResults[0].length > 1 ? nestedResults[0] : [container];
};

// Retrieves all h1-h6 headers within container.
export const getHeaders = (container) => findBlockContainers(container)
  .flatMap((component) => Array.from(component.querySelectorAll('h1, h2, h3, h4, h5, h6')));

// Helper to get headers outside containers
const getHeadersOutsideContainers = (block, containers) => {
  const allHeaders = Array.from(block.querySelectorAll('h1, h2, h3, h4, h5, h6'));
  const containedHeaders = containers.flatMap((c) => Array.from(c.querySelectorAll('h1, h2, h3, h4, h5, h6')));
  return allHeaders.filter((h) => !containedHeaders.includes(h));
};

// Helper to check if headers are valid (having multiple headers of the same level)
const areHeadersValid = (headers) => {
  const hasMultipleSameLevel = headers.length > 1
    && new Set(headers.map((h) => h.tagName.toLowerCase())).size < headers.length;
  return !hasMultipleSameLevel;
};

// Helper to assign ARIA label based on product or header
const assignAriaLabel = (
  cta,
  scope,
  headers,
  productNames,
  textsToAddProductNames,
  textsToAddHeaders,
  textBeforeHeader,
) => {
  if (!areHeadersValid(headers)) return false;

  const buttonText = cta.textContent.trim().toLowerCase();
  const productInCTA = cta.classList.contains('modal') ? ''
    : getProduct(cta.href.replace('-', ' '), productNames);
  const allContent = [...headers, textBeforeHeader].filter(Boolean);

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
      cta.setAttribute('aria-label', `${cta.textContent} - ${productName}`);
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
  const ctaContainer = containers.find((container) => container.contains(cta)) || block;
  const isInContainer = ctaContainer !== block;

  if (isInContainer) {
    assignAriaLabel(
      cta,
      ctaContainer,
      getHeaders(ctaContainer),
      productNames,
      textsToAddProductNames,
      textsToAddHeaders,
    );
    return;
  }

  const uncontainedHeaders = getHeadersOutsideContainers(block, containers);
  if (uncontainedHeaders.length && assignAriaLabel(
    cta,
    block,
    uncontainedHeaders,
    productNames,
    textsToAddProductNames,
    textsToAddHeaders,
  )) {
    return;
  }
  const textBeforeHeader = getTextBeforeHeader(block);
  assignAriaLabel(
    cta,
    block,
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
  const ctas = document.body.querySelectorAll(selector);
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
  const localePrefix = prefix || 'us';

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
    if (cta.hasAttribute('aria-label')) {
      modifiedCTAs.push(cta);
    }
  });

  // Check for aria-label consistency only for CTAs we just modified
  const allLinks = Array.from(document.querySelectorAll('a[href]'));
  modifiedCTAs.forEach((cta) => {
    const href = cta.getAttribute('href');
    const ariaLabel = cta.getAttribute('aria-label');
    if (!href || !ariaLabel) return;

    const sameHrefLinks = allLinks.filter((link) => link.getAttribute('href') === href);
    const hasInconsistentLabel = sameHrefLinks.some((link) => {
      const linkLabel = link.getAttribute('aria-label');
      return linkLabel && linkLabel.toLowerCase() !== ariaLabel.toLowerCase();
    });

    if (hasInconsistentLabel) {
      cta.removeAttribute('aria-label');
    }
  });
}
