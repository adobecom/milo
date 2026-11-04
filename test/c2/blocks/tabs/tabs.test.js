import nestedTabsSuite from '../../../blocks/tabs/mocks/nested-tabs.suite.js';

nestedTabsSuite(async () => (await import('../../../../libs/c2/blocks/tabs/tabs.js')).default);
