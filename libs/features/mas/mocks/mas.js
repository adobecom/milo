import { init } from '@adobe/mas-commerce';
import '../../../web-components/src/merch-card.js';
import '../../../web-components/src/merch-icon.js';
import '../../../web-components/src/merch-datasource.js';

const locale =
    document
        .querySelector('meta[name="mas-locale"]')
        ?.getAttribute('content') ?? 'US_en';

const config = () => ({
    env: { name: 'prod' },
    commerce: { 'commerce.env': 'PROD' },
    locale: { prefix: locale },
});

/** in tests, eagerly initialisation breaks mocks */
export default async () => {
    await init(config);
};
