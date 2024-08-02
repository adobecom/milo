import { init } from '@adobe/mas-commerce';

const { origin, searchParams } = new URL(import.meta.url);

const locale = searchParams.get('locale') ?? 'US_en';
const lang = searchParams.get('lang') ?? 'en';
const isStage = searchParams.get('env') === 'stage';
const features = searchParams.get('features');

const envName = isStage ? 'stage' : 'prod';
const commerceEnv = isStage ? 'STAGE' : 'PROD';

const config = () => ({
    env: { name: envName },
    commerce: { 'commerce.env': commerceEnv },
    locale: { prefix: locale },
});

init(config);

if (features.includes('merch-card')) {
    import(`${origin}/libs/deps/merch-card-all.js`);
}
