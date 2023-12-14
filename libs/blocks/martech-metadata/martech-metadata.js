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
  const { locale, ietf = locale?.ietf, analyticLocalization } = config;
  if (ietf !== 'en-US') {
    config.analyticLocalization = {
      ...analyticLocalization,
      ...getMetadata(el, config),
    };
  }
  el.remove();
  return config;
}
