/* eslint-disable import/no-relative-packages */
import '../../deps/merch-card.js';
import { loadStyle, setConfig } from '../../utils/utils.js';

if (!customElements.get('sp-button')) {
  await Promise.all([
    import('../spectrum-web-components/dist/theme.js'),
    import('../spectrum-web-components/dist/button.js'),
  ]);
}
const [localeElement] = document.getElementsByName('wcs-locale');
const locale = localeElement ? localeElement.getAttribute('content') : '/';

window.lana = { log: () => {} };
if (!window.adobeIMS) {
  window.adobeIMS = {
    initialized: true,
    isSignedInUser: () => false,
  };
}
const config = setConfig({ codeRoot: '/libs' });
config.locale.prefix = locale;

const { hostname } = new URL(import.meta.url);

loadStyle(`//${hostname}/libs/blocks/merch/merch.css`);

await import('./merch-datasource.js');
