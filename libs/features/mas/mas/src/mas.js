import { init } from '@adobe/mas-commerce';
import '@adobe/mas-web-components/src/merch-card.js';
import '@adobe/mas-web-components/src/merch-icon.js';
import '@adobe/mas-web-components/src/merch-datasource.js';

const { searchParams } = new URL(import.meta.url);
const locale = searchParams.get('locale') ?? 'US_en';
const isStage = searchParams.get('env') === 'stage';

const envName = isStage ? 'stage' : 'prod';
const commerceEnv = isStage ? 'STAGE' : 'PROD';

const priceLiteralsPromise = fetch(
    'https://www.adobe.com/federal/commerce/price-literals.json',
).then((response) => response.json().then(({ data }) => data));

const config = () => ({
    env: { name: envName },
    commerce: { 'commerce.env': commerceEnv, priceLiteralsPromise },
    locale: { prefix: locale },
});

const promise = init(config);

export default promise;
