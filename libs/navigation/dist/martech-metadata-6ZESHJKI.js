import {
  processTrackingLabels
} from "./chunk-JW7KOVAP.js";
import {
  getConfig
} from "./chunk-G4SXHKM5.js";
import "./chunk-NE6SFPCS.js";

// ../blocks/martech-metadata/martech-metadata.js
var getMetadata = (el, config) => [...el.childNodes].reduce((rdx, row) => {
  if (row.children?.length > 1) {
    const key = processTrackingLabels(row.children[0].textContent, config);
    const value = processTrackingLabels(row.children[1].textContent, config);
    if (key && value) rdx[key] = value;
  }
  return rdx;
}, {});
function init(el) {
  const config = getConfig();
  const { locale, ietf = locale?.ietf, analyticLocalization } = config;
  if (ietf !== "en-US") {
    config.analyticLocalization = {
      ...analyticLocalization,
      ...getMetadata(el, config)
    };
  }
  el.remove();
  return config;
}
export {
  init as default,
  getMetadata
};
//# sourceMappingURL=martech-metadata-6ZESHJKI.js.map
