/* eslint-disable import/no-relative-packages */
import '../../deps/merch-card.js';
import '../../blocks/merch-card/merch-datasource.js';
import { init } from '../../deps/commerce.js';

if (!customElements.get('sp-button')) {
  await Promise.all([
    import('../spectrum-web-components/dist/theme.js'),
    import('../spectrum-web-components/dist/button.js'),
  ]);
}
const [localeElement] = document.getElementsByName('wcs-locale');
const locale = localeElement ? localeElement.content : 'en_US';

// TODO handle

await init(() => ({
  env: 'PRODUCTION',
  locale,
}));
