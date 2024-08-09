import '../../../../../../deps/mas/commerce.js';
import '../../../../../../deps/mas/merch-card-all.js';
import '../../../../../../deps/mas/merch-offer-select.js';
import '../../../../../../deps/mas/merch-quantity-select.js';

const locale =
    document
        .querySelector('meta[name="mas-locale"]')
        ?.getAttribute('content') ?? 'US_en';

const config = () => ({
    env: { name: 'prod' },
    commerce: { 'commerce.env': 'PROD' },
    locale: { prefix: locale },
});
