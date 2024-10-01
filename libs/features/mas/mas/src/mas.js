import { init } from '../../commerce/src/index.js';
import '../../web-components/src/merch-card.js';
import '../../web-components/src/merch-icon.js';
import '../../web-components/src/aem-fragment.js';

const { searchParams } = new URL(import.meta.url);
const locale = searchParams.get('locale') ?? 'US_en';
const isStage = searchParams.get('env') === 'stage';

const envName = isStage ? 'stage' : 'prod';
const commerceEnv = isStage ? 'STAGE' : 'PROD';

const config = () => ({
    env: { name: envName },
    commerce: { 'commerce.env': commerceEnv },
    locale: { prefix: locale },
});

const promise = init(config);

export default promise;
