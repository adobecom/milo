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
    console.warn('No marker symbol found in line break pattern string');
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
 * Apply smart line-breaking algorithm by inserting <wbr> between semantic blocks.
 * This allows browsers to break japanese sentences correctly.
 * @param {*} config The milo config.
 * @param {*} options The options to control line breaks.
 */
export default async function controlLineBreaksJapanese(config, options = {}) {
  const { miloLibs, codeRoot } = config;
  const {
    scopeArea = document,
    budouxSelector = 'h1, h2, h3, h4, h5, h6',
    budouxThres = 2000,
    bwSelector = null,
    lineBreakOkPatterns = [],
    lineBreakNgPatterns = [],
  } = options;
  const base = miloLibs || codeRoot;

  // The thresould value to control word break granularity for long semantic blocks.
  const { loadDefaultJapaneseParser } = await import(`${base}/deps/budoux-index-ja.min.js`);
  const parser = loadDefaultJapaneseParser();

  // Update model based on given patterns
  const SCORE = Number.MAX_VALUE;
  lineBreakOkPatterns.forEach((p) => {
    updateParserModel(parser, p, SCORE);
  });
  lineBreakNgPatterns.forEach((p) => {
    updateParserModel(parser, p, -SCORE);
  });

  // Apply budoux to target selector
  scopeArea.querySelectorAll(budouxSelector).forEach((el) => {
    parser.applyElement(el, { threshold: budouxThres });
  });

  if (bwSelector) {
    const BalancedWordWrapper = (await import(`${base}/deps/bw2.min.js`)).default;
    const bw2 = new BalancedWordWrapper();
    // Apply balanced word wrap to target selector
    scopeArea.querySelectorAll(bwSelector).forEach((el) => {
      bw2.applyElement(el);
    });
  }
}
