import { getConfig, getFederatedContentRoot } from './utils.js';

export const getTextBeforeHeader = (block) => {
  if (!block) return '';

  let text = '';
  let foundHeader = false;

  const traverse = (node) => {
    if (foundHeader) return;

    if (node.nodeType === Node.ELEMENT_NODE) {
      if (/^H[1-2]$/i.test(node.tagName)) {
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

export const getVisibleHeaders = (container, level) => Array.from(container.querySelectorAll(`h${level}`)).filter((header) => {
  const { display, visibility, opacity } = getComputedStyle(header);
  return display !== 'none' && visibility !== 'hidden' && opacity !== '0';
});

export const findBlockContainers = (container) => {
  const directDivs = Array.from(container.children).filter((el) => el.tagName === 'DIV');
  if (!directDivs.length) return [container];

  const hasCommonPattern = (divs, checkFn) => {
    const classNames = divs.flatMap((div) => Array.from(div.classList));
    const patterns = new Set(classNames.map((cn) => cn.split('-')).filter((parts) => parts.length > 1).map(checkFn));
    return patterns.size > 0 && divs.every((div) => Array.from(div.classList).some((cn) => patterns.has(checkFn(cn.split('-')))));
  };

  const hasCommonPrefix = hasCommonPattern(directDivs, (parts) => parts[0]);
  const hasCommonSuffix = hasCommonPattern(directDivs, (parts) => parts[parts.length - 1]);

  return hasCommonPrefix || hasCommonSuffix ? directDivs : directDivs.flatMap(findBlockContainers);
};

export const getHeaders = (container) => findBlockContainers(container)
  .flatMap((component) => [1, 2, 3, 4, 5, 6] // header levels
    .map((level) => getVisibleHeaders(component, level))
    .filter(([header]) => header)
    .map(([header]) => header));

export const addAriaLabelToCTA = (cta, productNames, textsToAddProductNames, textsToAddHeaders) => {
  const block = cta.closest('.section > div');
  if (!block) return;

  const headers = [...getHeaders(block), getTextBeforeHeader(block)].filter(Boolean);
  const buttonText = cta.textContent.trim().toLowerCase();
  const productInCTA = cta.classList.contains('modal') ? '' : getProduct(cta.href.replace('-', ' '), productNames);

  if (textsToAddProductNames.includes(buttonText)) {
    const productHeader = headers.find((header) => {
      const text = typeof header === 'string' ? header : header.textContent.trim();
      const product = getProduct(text, productNames);
      return product && (product === productInCTA || !productInCTA);
    });
    if (productHeader) {
      cta.setAttribute('aria-label', `${cta.textContent} ${getProduct(productHeader.textContent?.trim() || productHeader, productNames)}`);
      return;
    }
  }

  if (textsToAddHeaders.includes(buttonText) && headers.length) {
    cta.setAttribute('aria-label', `${cta.textContent} ${headers[0].textContent?.trim() || headers[0]}`);
  }
};

export default async function addAriaLabels() {
  const logError = (msg, error) => window.lana.log(`${msg}: ${error}`, { tags: 'aria' });

  const [configResponse, namesResponse] = await Promise.all([
    fetch(`${getConfig().contentRoot}/cta-aria-label-config.json`).catch((e) => logError('Could not fetch cta-aria-label-config.json', e)),
    fetch(`${getFederatedContentRoot()}/federal/assets/data/product-names.json`).catch((e) => logError('Could not fetch product-names.json', e)),
  ]);

  const ctaAriaLabelConfig = await configResponse?.json().catch((e) => logError('Could not parse cta-aria-label-config.json', e));
  const productNames = await namesResponse?.json().catch((e) => logError('Could not parse product-names.json', e));

  const { prefix } = getConfig().locale;
  const localePrefix = prefix || 'us';
  if (!ctaAriaLabelConfig?.data.length || !productNames?.data.length) {
    window.lana.log(`No cta aria label config or product names found for locale ${localePrefix}`, { tags: 'aria' });
    return;
  }

  const configForLocale = ctaAriaLabelConfig.data.find((item) => item.prefixes.split(',').map((p) => p.trim()).includes(localePrefix));
  if (!configForLocale) return;

  const textsToAddProductNames = configForLocale.addProductName.split(/[\n,]+/).map((t) => t.trim().toLowerCase()).filter(Boolean);
  const textsToAddHeaders = configForLocale.addHeader.split(/[\n,]+/).map((t) => t.trim().toLowerCase()).filter(Boolean);

  const selector = getConfig().ariaLabelCTASelector || '.con-button:not([aria-label])';
  document.body.querySelectorAll(selector)
    .forEach((cta) => {
      addAriaLabelToCTA(cta, productNames.data, textsToAddProductNames, textsToAddHeaders);
    });
}
