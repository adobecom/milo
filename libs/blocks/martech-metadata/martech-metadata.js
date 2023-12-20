import { getConfig } from '../../utils/utils.js';

export const getMetadata = (el) => [...el.childNodes].reduce((rdx, row) => {
  if (row.children?.length > 1) {
    const key = row.children[0].textContent.trim();
    const value = row.children[1].textContent.trim();
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
      ...getMetadata(el),
    };
  }
  el.remove();
  return config;
}
