/**
 * Checks if an element contains a non-empty text node.
 *
 * @param {HTMLElement} element - The HTMLElement to check.
 * @returns true if the element contains a non-empty text node, false otherwise.
 */
function hasTextNode(element) {
  for (let i = 0; i < element.childNodes.length; i += 1) {
    const child = element.childNodes[i];
    if (child.nodeType === Node.TEXT_NODE && child.textContent.trim() !== '') {
      return true;
    }
  }

  return false;
}

/**
 * Recursively finds all elements that contain non-empty text nodes.
 * The search stops when an element with the 'jpwordwrap-disable' class is encountered.
 *
 * @param {HTMLElement} [element=document.body] - The root HTMLElement to start the search from.
 * @returns An array of DHTMLElements that contain non-empty text nodes.
 */
function findTextElements(element = document.body) {
  let result = [];

  if (
    element.classList.contains('jpwordwrap-disabled')
    || element.tagName.toLowerCase() === 'header'
    || element.tagName.toLowerCase() === 'footer'
  ) {
    return [];
  }

  for (let i = 0; i < element.children.length; i += 1) {
    const child = element.children[i];
    if (hasTextNode(child)) {
      result.push(child);
    } else {
      result = result.concat(findTextElements(child));
    }
  }

  return result;
}

/**
 * Update the model to control line breaks occurring for the specified word.
 * @param {*} parser The BudouX parser to update.
 * @param {string} pattern The pattern that should be updated in the model.
 * @param {number} score The score that should be added from the pattern in the model.
 * @param {string} [markerSymbol='#'] The marker symbol to look for in the pattern string.
 * Defaults to '#'.
 */
function updateParserModel(parser, pattern, score, markerSymbol = '#') {
  const markerPos = pattern.indexOf(markerSymbol);
  if (markerPos === -1) {
    console.warn('No marker symbol found in the line break pattern string');
    return;
  }

  if (markerPos !== pattern.lastIndexOf('#')) {
    console.warn('Two or more marker symbols cannot be specified. Only the first marker is applied');
  }

  const former = pattern.slice(Math.max(markerPos - 3, 0), markerPos);
  const latter = pattern.slice(markerPos + 1, Math.min(markerPos + 4, pattern.length));

  if (former.length < 2 || latter.length < 2) {
    console.warn('At least two characters must be specified before and after the marker symbol');
    return;
  }

  if (former.length === 3) {
    parser.model.set(`TW1:${former}`, score);
  } else if (former.length === 2) {
    parser.model.set(`BW1:${former}`, score);
  }

  if (latter.length === 3) {
    parser.model.set(`TW4:${latter}`, score);
  } else if (latter.length === 2) {
    parser.model.set(`BW3:${latter}`, score);
  }
}

/**
 * Get metadata
 * @param {*} name The name of metadata.
 * @returns metadata content
 */
function getMetadata(name) {
  const attr = name && name.includes(':') ? 'property' : 'name';
  const meta = document.head.querySelector(`meta[${attr}="${name}"]`);
  return meta?.content;
}

/**
 * Check if a word wrap has been applied to an element.
 *
 * @param {HTMLElement} element - The HTML element to be checked.
 * @returns true if a word wrap has been applied, otherwise false.
 */
export function isWordWrapApplied(element) {
  return !!element.querySelector('wbr');
}

/**
 * Check if a balanced word wrap has been applied to an element.
 *
 * @param {HTMLElement} element - The HTML element to be checked.
 * @returns true if a balanced word wrap has been applied, otherwise false.
 */
export function isBalancedWordWrapApplied(element) {
  return !!element.querySelector('wbr[class^=jpn-balanced-wbr]');
}

/**
 * Apply smart line-breaking algorithm depending on the given options.
 * @param {*} config The milo config.
 * @param {*} options The options to control line breaks.
 */
export async function applyJapaneseLineBreaks(config, options = {}) {
  const { miloLibs, codeRoot } = config;
  const {
    scopeArea = document,
    budouxThres = 2000,
    bwEnabled = false,
    budouxExcludeSelector = null,
    bwExcludeSelector = 'p',
    lineBreakOkPatterns = [],
    lineBreakNgPatterns = [],
  } = options;
  const base = miloLibs || codeRoot;

  // The thresould value to control word break granularity for long semantic blocks.
  const { loadDefaultJapaneseParser } = await import(`${base}/deps/budoux-index-ja.min.js`);
  const parser = loadDefaultJapaneseParser();

  // Find elements that contains a text node directly under its child node.
  const textElements = findTextElements(
    scopeArea instanceof Document ? scopeArea.body : scopeArea,
  );
  const budouxExcludeElements = new Set();
  const bwExcludeElements = new Set();

  // Find BudouX disabled elements
  if (budouxExcludeSelector) {
    scopeArea.querySelectorAll(budouxExcludeSelector).forEach((el) => {
      budouxExcludeElements.add(el);
    });
  }

  // Find Blanced Word Wrap disabled elements
  if (bwEnabled && bwExcludeSelector) {
    scopeArea.querySelectorAll(bwExcludeSelector).forEach((el) => {
      bwExcludeElements.add(el);
    });
  }

  // Update model based on given patterns
  const SCORE = Number.MAX_VALUE;
  lineBreakOkPatterns.forEach((p) => {
    updateParserModel(parser, p, SCORE);
  });
  lineBreakNgPatterns.forEach((p) => {
    updateParserModel(parser, p, -SCORE);
  });

  // Apply budoux to target selector
  textElements.forEach((el) => {
    if (budouxExcludeElements.has(el) || isWordWrapApplied(el)) return;
    parser.applyElement(el, { threshold: budouxThres });
  });

  if (bwEnabled) {
    const BalancedWordWrapper = (await import(`${base}/deps/bw2.min.js`)).default;
    const bw2 = new BalancedWordWrapper();
    // Apply balanced word wrap to target selector
    textElements.forEach((el) => {
      if (bwExcludeElements.has(el) || isBalancedWordWrapApplied(el)) return;
      bw2.applyElement(el);
    });
  }
}

/**
 * Apply smart line-breaking algorithm by inserting <wbr> between semantic blocks.
 * This allows browsers to break japanese sentences correctly.
 * @param {*} config The milo config.
 * @param {*} doc The Document or HTMLElement to which you want you apply word wrap.
 */
export default async function controlJapaneseLineBreaks(config, scopeArea = document) {
  const disabled = getMetadata('jpwordwrap:disabled') === 'true' || false;
  const budouxThres = Number(getMetadata('jpwordwrap:budoux-thres')) || 2000;
  const budouxExcludeSelector = getMetadata('jpwordwrap:budoux-exclude-selector');
  const bwEnabled = getMetadata('jpwordwrap:bw-enabled') === 'true' || false;
  const bwExcludeSelector = getMetadata('jpwordwrap:bw-exclude-selector') || 'p';
  const lineBreakOkPatterns = (getMetadata('jpwordwrap:line-break-ok') || '').split(',');
  const lineBreakNgPatterns = (getMetadata('jpwordwrap:line-break-ng') || '').split(',');

  if (disabled) return;

  await applyJapaneseLineBreaks(config, {
    scopeArea,
    budouxThres,
    budouxExcludeSelector,
    bwEnabled,
    bwExcludeSelector,
    lineBreakOkPatterns,
    lineBreakNgPatterns,
  });
}
