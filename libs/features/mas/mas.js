/* eslint-disable import/no-relative-packages */
import '../../deps/merch-card.js';
import { loadStyle, setConfig } from '../../utils/utils.js';

if (!customElements.get('sp-theme')) {
  await import('../spectrum-web-components/dist/theme.js');
}

if (!customElements.get('sp-button')) {
  await import('../spectrum-web-components/dist/button.js');
}

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

loadStyle(`https://${hostname}/libs/blocks/merch/merch.css`);

await import('./merch-datasource.js');
