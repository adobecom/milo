import "./chunk-NE6SFPCS.js";

// ../blocks/fallback/fallback.js
var SYNTHETIC_BLOCKS = [
  "adobe-logo",
  "breadcrumbs",
  "column-break",
  "cross-cloud-menu",
  "gnav-brand",
  "gnav-promo",
  "large-menu",
  "library-metadata",
  "link-group",
  "profile",
  "region-selector",
  "search",
  "social"
];
function showError(block, name) {
  const isSynth = [...block.classList].some((className) => SYNTHETIC_BLOCKS.includes(className));
  if (isSynth) return;
  block.dataset.failed = "true";
  block.dataset.reason = `Failed loading ${name || ""} block.`;
}
export {
  showError
};
//# sourceMappingURL=fallback-R22QXWJ5.js.map
