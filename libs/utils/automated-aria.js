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

// Identifies container divs within a block that share a common class pattern
// and appear multiple times at the same DOM level.
// Containers must be siblings with a shared prefix (e.g., 'card-')
// or suffix (e.g., '-item') and occur more than once.
export const findBlockContainers = (container) => {
  // Get all direct child divs of the container
  const directDivs = Array.from(container.children).filter((el) => el.tagName === 'DIV');
  if (!directDivs.length) return [container];

  // Helper to determine if divs share a common class pattern (prefix or suffix)
  const hasCommonPattern = (divs, checkFn) => {
    const classNames = divs.flatMap((div) => Array.from(div.classList));
    // Extract unique patterns (e.g., prefixes or suffixes) from hyphenated class names
    const patterns = new Set(classNames.map((cn) => cn.split('-')).filter((parts) => parts.length > 1).map(checkFn));
    // Check if at least two divs share a pattern among their classes
    return patterns.size > 0 && divs.some((div1) => divs.some((div2) => div1 !== div2
        && Array.from(div1.classList).some((cn1) => Array.from(div2.classList).some((cn2) => cn1.split('-').length > 1 && cn2.split('-').length > 1
            && checkFn(cn1.split('-')) === checkFn(cn2.split('-'))))));
  };

  const hasCommonPrefix = hasCommonPattern(directDivs, (parts) => parts[0]);
  const hasCommonSuffix = hasCommonPattern(directDivs, (parts) => parts[parts.length - 1]);

  // If a common pattern exists among siblings, filter to those matching the pattern
  if (hasCommonPrefix || hasCommonSuffix) {
    const patternDivs = directDivs.filter((div) => {
      const divClasses = Array.from(div.classList);
      // A div matches if it shares a pattern with at least one other sibling
      return directDivs.some((otherDiv) => otherDiv !== div
        && Array.from(otherDiv.classList).some((cn2) => divClasses.some((cn1) => cn1.split('-').length > 1 && cn2.split('-').length > 1
            && ((hasCommonPrefix && cn1.split('-')[0] === cn2.split('-')[0])
             || (hasCommonSuffix && cn1.split('-').slice(-1)[0] === cn2.split('-').slice(-1)[0])))));
    });

    // Require at least two matching siblings to qualify as containers
    if (patternDivs.length > 1) {
      const deepestContainers = [];
      patternDivs.forEach((div) => {
        // Recurse to find deeper containers (e.g., nested 'card-*' patterns)
        const nestedContainers = findBlockContainers(div);
        // If no deeper containers, this div is a leaf node; add it
        if (nestedContainers.length === 1 && nestedContainers[0] === div) {
          deepestContainers.push(div);
        } else if (nestedContainers.length > 1) { // If deeper repeating containers, include them
          deepestContainers.push(...nestedContainers);
        }
      });
      // Return containers only if multiple found, otherwise fallback to [container]
      return deepestContainers.length > 1 ? deepestContainers : [container];
    }
  }

  // Recurse into child divs, but only keep results with multiple containers
  const nestedResults = directDivs
    .map((div) => findBlockContainers(div))
    .filter((results) => results.length > 1);
  // If exactly one valid set of repeating containers is found, use it;
  // otherwise, return [container]
  return nestedResults.length === 1 && nestedResults[0].length > 1 ? nestedResults[0] : [container];
};

// Retrieves all headers (h1-h6) within identified containers.
export const getHeaders = (container) => findBlockContainers(container)
  .flatMap((component) => [1, 2, 3, 4, 5, 6]
    .map((level) => Array.from(component.querySelectorAll(`h${level}`)))
    .filter(([header]) => header)
    .map(([header]) => header));

// Adds an ARIA label to a CTA element based on context (product names or headers).
export const addAriaLabelToCTA = (cta, productNames, textsToAddProductNames, textsToAddHeaders) => {
  const block = cta.closest('.section > div');
  if (!block) return;

  const containers = findBlockContainers(block);
  const ctaContainer = containers.find((container) => container.contains(cta)) || block;
  const isInContainer = ctaContainer !== block;

  const tryAssignAriaLabel = (scope, headersToUse, strictHeaders = true) => {
    const headers = headersToUse || getHeaders(scope);
    const buttonText = cta.textContent.trim().toLowerCase();
    const productInCTA = cta.classList.contains('modal') ? '' : getProduct(cta.href.replace('-', ' '), productNames);

    // Skip if multiple headers at the same level and strict mode is enabled
    const hasMultipleSameLevelHeaders = headers.length > 1
      && new Set(headers.map((h) => h.tagName.toLowerCase())).size < headers.length;
    if (strictHeaders && hasMultipleSameLevelHeaders) return false;

    const allContent = [...headers, getTextBeforeHeader(scope)].filter(Boolean);

    if (textsToAddProductNames.includes(buttonText)) {
      const productHeader = allContent.find((header) => {
        const text = typeof header === 'string' ? header : header.textContent.trim();
        const product = getProduct(text, productNames);
        return product
          && (product.includes(productInCTA) || productInCTA.includes(product) || !productInCTA);
      });
      if (productHeader) {
        cta.setAttribute('aria-label', `${cta.textContent} ${getProduct(productHeader.textContent?.trim() || productHeader, productNames)}`);
        return true;
      }
    }

    if (textsToAddHeaders.includes(buttonText) && allContent.length) {
      cta.setAttribute('aria-label', `${cta.textContent} ${allContent[0].textContent?.trim() || allContent[0]}`);
      return true;
    }

    return false;
  };

  if (isInContainer) {
    tryAssignAriaLabel(ctaContainer, null, true);
  } else {
    const allHeaders = Array.from(block.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    const containedHeaders = containers.flatMap((c) => Array.from(c.querySelectorAll('h1, h2, h3, h4, h5, h6')));
    const uncontainedHeaders = allHeaders.filter((h) => !containedHeaders.includes(h));

    if (uncontainedHeaders.length && tryAssignAriaLabel(block, uncontainedHeaders, true)) return;
    tryAssignAriaLabel(block, null, true);
  }
};

/**
 * Asynchronously adds ARIA labels to all eligible CTAs on the page.
 * Fetches configuration and product names, then applies labels based on locale.
 */
export default async function addAriaLabels() {
  const logError = (msg, error) => window.lana.log(`${msg}: ${error}`, { tags: 'aria' });

  const [configResponse, namesResponse] = await Promise.all([
    fetch(`${getConfig().contentRoot}/cta-aria-label-config.json`).catch((e) => logError('Could not fetch cta-aria-label-config.json', e)),
    fetch(`${getFederatedContentRoot()}/federal/assets/data/product-names.json`).catch((e) => logError('Could not fetch product-names.json', e)),
  ]);

  if (!configResponse || !namesResponse) return;

  const ctaAriaLabelConfig = await configResponse.json().catch((e) => logError('Could not parse cta-aria-label-config.json', e));
  const productNames = await namesResponse.json().catch((e) => logError('Could not parse product-names.json', e));

  if (!ctaAriaLabelConfig || !productNames) return;

  const { prefix } = getConfig().locale;
  const localePrefix = prefix || 'us';

  if (!ctaAriaLabelConfig.data?.length || !productNames.data?.length) {
    window.lana.log(`No cta aria label config or product names found for locale ${localePrefix}`, { tags: 'aria' });
    return;
  }

  const configForLocale = ctaAriaLabelConfig.data.find((item) => item.prefixes.split(',').map((p) => p.trim()).includes(localePrefix));
  if (!configForLocale) return;

  const textsToAddProductNames = configForLocale.addProductName
    .split(/[\n,]+/)
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);
  const textsToAddHeaders = configForLocale.addHeader
    .split(/[\n,]+/)
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);

  const selector = getConfig().ariaLabelCTASelector || '.con-button:not([aria-label])';
  const modifiedCTAs = [];
  document.body.querySelectorAll(selector).forEach((cta) => {
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
