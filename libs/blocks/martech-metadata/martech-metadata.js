import { getConfig } from '../../utils/utils.js';
import { processTrackingLabels } from '../../martech/attributes.js';

export const getMetadata = (el, config) => [...el.childNodes].reduce((rdx, row) => {
  if (row.children?.length > 1) {
    const key = processTrackingLabels(row.children[0].textContent, config);
    const value = processTrackingLabels(row.children[1].textContent, config);
    if (key && value) rdx[key] = value;
  }
  return rdx;
}, {});

export default function init(el) {
  const config = getConfig();
  if (config.locale?.ietf !== 'en-US') {
    const analyticLocalization = getMetadata(el, config);
    config.analyticLocalization = {
      ...config.analyticLocalization,
      ...analyticLocalization,
    };
  }
  el.remove();
  return config;
}
