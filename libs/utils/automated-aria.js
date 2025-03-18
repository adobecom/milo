import { getConfig, getFederatedContentRoot } from './utils.js';

function normalize(str) {
  return str.toLowerCase().replace(/-/g, '');
}

function getTextBeforeHeader(block) {
  if (!block) return '';

  let foundHeader = false;
  let textBeforeHeader = '';

  function traverse(node) {
    // If we've already encountered a header, stop gathering text
    if (foundHeader) return;

    // If this node is an element
    if (node.nodeType === Node.ELEMENT_NODE) {
      // Check if it's an H1 or H2
      if (/^(H1|H2)$/i.test(node.tagName)) {
        foundHeader = true; // found the first header
        return;
      }
      // Otherwise, recursively traverse child nodes
      for (const child of node.childNodes) {
        traverse(child);
        if (foundHeader) break;
      }
    }

    // If this node is a text node
    else if (node.nodeType === Node.TEXT_NODE) {
      textBeforeHeader += node.nodeValue;
    }
  }

  traverse(block);

  if (!foundHeader) {
    return '';
  }

  // Otherwise, return all text collected before the first header
  return textBeforeHeader.trim();
}

// 1) Find FIRST product in a string (ignoring dashes/case). Return "" if none found.
function getProduct(txt, productNames) {
  if (!txt) return '';
  const check = normalize(txt);
  for (let i = 0; i < productNames.length; i++) {
    const { us } = productNames[i];
    if (check.includes(normalize(us))) {
      return us; // Return the FIRST matching product
    }
  }
  return '';
}

function getVisibleHeaders(container, headingLevel = null) {
  const selector = headingLevel ? `h${headingLevel}` : 'h1, h2, h3, h4, h5, h6';
  const headers = container.querySelectorAll(selector);

  return Array.from(headers).filter((header) => {
    const style = window.getComputedStyle(header);
    return style.display !== 'none'
           && style.visibility !== 'hidden'
           && style.opacity !== '0';
  });
}

function getHeaders(container) {
  const headers = [];

  // Check each heading level in order (h1 to h6)
  for (let level = 1; level <= 6; level += 1) {
    const levelHeaders = getVisibleHeaders(container, level);

    // Only add headers if there's exactly one at this level
    if (levelHeaders.length === 1) {
      headers.push(levelHeaders[0]);
    }
  }

  return headers;
}

function addAriaLabelToCTA(cta, productNames, textsToAddProductNames, textsToAddHeaders) {
  const block = cta.closest('.section > div');
  if (!block) return;
  const headers = getHeaders(block);
  const textBeforeHeader = getTextBeforeHeader(block);
  headers.push(textBeforeHeader);
  const buttonText = cta.textContent.trim().toLowerCase();
  const productInCTA = cta.classList.contains('modal') ? '' : getProduct(cta.href.replace('-', ' '), productNames);

  // Check if button text matches any text in textsToAddProductNames
  if (textsToAddProductNames.includes(buttonText)) {
    // Search through headers for a product name match
    for (const header of headers) {
      const headerText = header.textContent ? header.textContent.trim() : header.trim();
      const product = getProduct(headerText, productNames);
      if (product && (product === productInCTA || productInCTA === '')) {
        cta.setAttribute('aria-label', `${cta.textContent} ${product}`);
        return;
      }
    }
  }

  // Check if button text matches any text in textsToAddHeaders
  if (textsToAddHeaders.includes(buttonText) && headers.length > 0) {
    const firstHeader = headers[0].textContent.trim();
    cta.setAttribute('aria-label', `${cta.textContent} ${firstHeader}`);
  }
}

export default async function addAriaLabels() {
  const [configResponse, namesResponse] = await Promise.all([
    fetch(`${getConfig().contentRoot}/cta-aria-label-config.json`)
      .catch((e) => window.lana.log('Could not fetch cta-aria-label-config.json', e)),
    fetch(`${getFederatedContentRoot()}/federal/assets/data/product-names.json`)
      .catch((e) => window.lana.log('Could not fetch product-names.json', e)),
  ]);

  const ctaAriaLabelConfig = await configResponse.json().catch((e) => window.lana.log('Could not parse cta-aria-label-config.json', e));
  const productNames = await namesResponse.json().catch((e) => window.lana.log('Could not parse product-names.json', e));

  const { prefix } = getConfig().locale;
  const prefixWithUS = prefix === '' ? 'us' : prefix;
  if (ctaAriaLabelConfig.data.length === 0 || productNames.data.length === 0) {
    window.lana.log('No cta aria label config or product names found for locale', prefixWithUS);
    return;
  }
  const textsToAddProductNames = ctaAriaLabelConfig.data
    .find((item) => item.prefixes.split(',').map((p) => p.trim()).filter((p) => p === prefixWithUS).length > 0)
    ?.addProductName.replace('\n', '').split(',').map((p) => p.trim().toLowerCase())
    .filter(Boolean);

  const textsToAddHeaders = ctaAriaLabelConfig.data
    .find((item) => item.prefixes.split(',').map((p) => p.trim()).filter((p) => p === prefixWithUS).length > 0)
    ?.addHeader.replace('\n', '').split(',').map((p) => p.trim().toLowerCase())
    .filter(Boolean);

  const selector = getConfig().ariaLabelCTASelector || '.con-button:not([aria-label])';
  const buttons = document.body.querySelectorAll(selector);
  buttons.forEach(
    (cta) => addAriaLabelToCTA(cta, productNames.data, textsToAddProductNames, textsToAddHeaders),
  );
}
