import { updateConfig, getConfig } from '../../utils/utils.js';
import { processTrackingLabels } from '../../martech/attributes.js';

export const getMetadata = (el, config) => [...el.childNodes].reduce((rdx, row) => {
  if (row.children) {
    const key = processTrackingLabels(row.children[0].textContent, config, 20, true);
    const content = row.children[1];
    const text = processTrackingLabels(content.textContent, config, 20, true);
    if (key && text) rdx[key] = text;
  }
  return rdx;
}, {});

export default async function init(el) {
  let config = getConfig();
  if (config.locale.ietf !== 'en-US') {
    const analyticLocalization = getMetadata(el, config);
    config = {
      ...config,
      analyticLocalization: {
        ...config.analyticLocalization,
        ...analyticLocalization,
      },
    };
    updateConfig(config);
  }
  el.remove();
  return config;
}
