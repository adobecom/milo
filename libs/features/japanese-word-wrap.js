/**
 * Searches for Japanese text in headings and applies a smart word-breaking algorithm by inserting
 *  <wbr> between semantic blocks. This allows browsers to break japanese sentences correctly.
 * @param {*} config The config.
 * @param {*} [area=document] The HTML element or Document.
 * @param {string} [selector='h1, h2, h3, h4, h5, h6'] The target selector you want to apply Japanese word wrap.
 */
export async function controlLineBreaksJapanese(config, options, area = document) {
  const { miloLibs, codeRoot } = config;
  const {
    budouxSelector = 'h1, h2, h3, h4, h5, h6',
    budouxThres = 1000,
    bwSelector = 'h1, h2, h3, h4, h5, h6',
    lineBreakOkPatterns = [],
    lineBreakNgPatterns = []
  } = options
  const base = miloLibs || codeRoot;

  // The thresould value to control word break granularity for long semantic blocks.
  const { loadDefaultJapaneseParser } = await import(`${base}/deps/budoux-index-ja.min.js`);
  const parser = loadDefaultJapaneseParser();

  // Update model
  const SCORE = 5000
  lineBreakOkPatterns.forEach((p) => {
    updateModel(parser, p, SCORE)
  })
  lineBreakNgPatterns.forEach((p) => {
    updateModel(parser, p, -SCORE)
  })

  // apply budoux to target selector
  area.querySelectorAll(budouxSelector).forEach((el) => {
    parser.applyElement(el, {
      threshold: budouxThres
    });
  });

  const BalancedWordWrapper = (await import(`${base}/deps/bw2.min.js`)).default;
  const bw2 = new BalancedWordWrapper();
  // apply balanced word wrap to headings
  area.querySelectorAll(bwSelector).forEach((el) => {
    bw2.applyElement(el);
  });
}

/**
 * Update the model to prevent line breaks from occurring for the specified word.
 * @param {*} parser BudouX parser
 * @param {string} noBreakWord word-break prohibited word
 */
function updateModel(parser, pattern, score) {
  if (pattern.length <= 3) return

  const markerPos = pattern.indexOf('#')
  if (markerPos == -1) return

  const former = pattern.slice(Math.max(markerPos - 3, 0), markerPos)
  const latter = pattern.slice(markerPos + 1, Math.min(markerPos + 4, pattern.length))

  console.log(former, ",", latter, score)

  switch (former.length) {
    case 3:
      parser.model.set(`TW1:${former}`, score)
      break
    case 2:
      parser.model.set(`BW1:${former}`, score)
      break
  }

  switch (latter.length) {
    case 3:
      parser.model.set(`TW4:${latter}`, score)
      break
    case 2:
      parser.model.set(`BW3:${latter}`, score)
      break
  }
}
