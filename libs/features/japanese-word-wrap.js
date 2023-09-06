/**
 * Searches for Japanese text in headings and applies a smart word-breaking algorithm by inserting
 *  <wbr> between semantic blocks. This allows browsers to break japanese sentences correctly.
 * @param {*} config The config.
 * @param {*} [area=document] The HTML element or Document.
 * @param {string} [selector='h1, h2, h3, h4, h5, h6'] The target selector you want to apply Japanese word wrap.
 */
export async function controlLineBreaksJapanese(config, area = document, selector = 'h1, h2, h3, h4, h5, h6') {
  const { miloLibs, codeRoot } = config;
  const base = miloLibs || codeRoot;

  // The thresould value to control word break granularity for long semantic blocks.
  const WORD_SEG_THRES = 8;
  const { loadDefaultJapaneseParser } = await import(`${base}/deps/budoux-index-ja.min.js`);
  const parser = loadDefaultJapaneseParser();
  area.querySelectorAll(selector).forEach((el) => {
    // apply budoux to headings
    parser.applyElement(el, { wordSegThres: WORD_SEG_THRES });
  });

  const BalancedWordWrapper = (await import(`${base}/deps/bw2.min.js`)).default;
  const bw2 = new BalancedWordWrapper();
  area.querySelectorAll(selector).forEach((el) => {
    // apply balanced word wrap to headings
    bw2.applyElement(el);
  });
}
