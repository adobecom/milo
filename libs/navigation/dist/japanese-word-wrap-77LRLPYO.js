import {
  getMetadata
} from "./chunk-G4SXHKM5.js";
import "./chunk-NE6SFPCS.js";

// ../features/japanese-word-wrap.js
var hasTextNode = (element) => [...element.childNodes].some(({ nodeType, textContent }) => nodeType === Node.TEXT_NODE && textContent.trim() !== "");
function findTextElements(element = document.body) {
  const tagName = element.tagName.toLowerCase();
  if (tagName === "header" || tagName === "footer" || element.classList.contains("jpwordwrap-disabled")) {
    return [];
  }
  return Array.from(element.children).reduce((result, child) => hasTextNode(child) ? [...result, child] : [...result, ...findTextElements(child)], []);
}
function updateParserModel(parser, pattern, score, markerSymbol = "#") {
  const markerPos = pattern.indexOf(markerSymbol);
  if (markerPos === -1) {
    console.warn("No marker symbol found in the line break pattern string");
    return;
  }
  if (markerPos !== pattern.lastIndexOf("#")) {
    console.warn("Two or more marker symbols cannot be specified. Only the first marker is applied");
  }
  const former = pattern.slice(Math.max(markerPos - 3, 0), markerPos);
  const latter = pattern.slice(markerPos + 1, Math.min(markerPos + 4, pattern.length));
  if (former.length < 2 || latter.length < 2) {
    console.warn("At least two characters must be specified before and after the marker symbol");
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
function hasFlexOrGrid(element) {
  const elStyles = getComputedStyle(element);
  return elStyles.display === "flex" || elStyles.display === "grid";
}
function isFirefox() {
  return navigator.userAgent.includes("Firefox");
}
function isWordWrapApplied(element) {
  return !!element.querySelector("wbr");
}
function isBalancedWordWrapApplied(element) {
  return !!element.querySelector("wbr[class^=jpn-balanced-wbr]");
}
async function applyJapaneseLineBreaks(config, options = {}) {
  const { miloLibs, codeRoot } = config;
  const {
    scopeArea = document,
    budouxThres = 2e3,
    bwEnabled = false,
    budouxExcludeSelector = null,
    bwExcludeSelector = "p",
    lineBreakOkPatterns = [],
    lineBreakNgPatterns = []
  } = options;
  const base = miloLibs || codeRoot;
  const { loadDefaultJapaneseParser } = await import(`${base}/deps/budoux-index-ja.min.js`);
  const parser = loadDefaultJapaneseParser();
  const textElements = findTextElements(
    scopeArea instanceof Document ? scopeArea.body : scopeArea
  );
  const budouxExcludeElements = /* @__PURE__ */ new Set();
  const bwExcludeElements = /* @__PURE__ */ new Set();
  if (budouxExcludeSelector) {
    scopeArea.querySelectorAll(budouxExcludeSelector).forEach((el) => {
      budouxExcludeElements.add(el);
    });
  }
  if (bwEnabled && bwExcludeSelector) {
    scopeArea.querySelectorAll(bwExcludeSelector).forEach((el) => {
      bwExcludeElements.add(el);
    });
  }
  const SCORE = Number.MAX_VALUE;
  lineBreakOkPatterns.forEach((p) => {
    updateParserModel(parser, p, SCORE);
  });
  lineBreakNgPatterns.forEach((p) => {
    updateParserModel(parser, p, -SCORE);
  });
  textElements.forEach((el) => {
    if (budouxExcludeElements.has(el) || isWordWrapApplied(el) || isFirefox() && hasFlexOrGrid(el)) return;
    parser.applyElement(el, { threshold: budouxThres });
  });
  if (bwEnabled) {
    const BalancedWordWrapper = (await import(`${base}/deps/bw2.min.js`)).default;
    const bw2 = new BalancedWordWrapper();
    textElements.forEach((el) => {
      if (bwExcludeElements.has(el) || isBalancedWordWrapApplied(el) || isFirefox() && hasFlexOrGrid(el)) return;
      bw2.applyElement(el);
    });
  }
}
async function controlJapaneseLineBreaks(config, scopeArea = document) {
  const disabled = getMetadata("jpwordwrap:disabled") === "true" || false;
  const budouxThres = Number(getMetadata("jpwordwrap:budoux-thres")) || 2e3;
  const budouxExcludeSelector = getMetadata("jpwordwrap:budoux-exclude-selector");
  const bwEnabled = getMetadata("jpwordwrap:bw-enabled") === "true" || false;
  const bwExcludeSelector = getMetadata("jpwordwrap:bw-exclude-selector") || "p";
  const lineBreakOkPatterns = (getMetadata("jpwordwrap:line-break-ok") || "").split(",");
  const lineBreakNgPatterns = (getMetadata("jpwordwrap:line-break-ng") || "").split(",");
  if (disabled) return;
  await applyJapaneseLineBreaks(config, {
    scopeArea,
    budouxThres,
    budouxExcludeSelector,
    bwEnabled,
    bwExcludeSelector,
    lineBreakOkPatterns,
    lineBreakNgPatterns
  });
}
export {
  applyJapaneseLineBreaks,
  controlJapaneseLineBreaks as default,
  isBalancedWordWrapApplied,
  isWordWrapApplied
};
//# sourceMappingURL=japanese-word-wrap-77LRLPYO.js.map
