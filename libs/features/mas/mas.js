/* eslint-disable import/no-relative-packages */
import '../../deps/merch-card.js';
import { loadStyle, setConfig } from '../../utils/utils.js';

const [localeElement] = document.getElementsByName('wcs-locale');
const locale = localeElement ? localeElement.getAttribute('content') : '';

window.lana = { log: () => {} };
window.adobeIMS = {
  initialized: true,
  isSignedInUser: () => false,
};
const config = setConfig({ codeRoot: '/libs' });
config.locale.prefix = locale;

const { hostname } = new URL(import.meta.url);

loadStyle(`//${hostname}/libs/blocks/merch/merch.css`);

await import('./merch-datasource.js');
