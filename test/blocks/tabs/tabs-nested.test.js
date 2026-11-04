import nestedTabsSuite from './mocks/nested-tabs.suite.js';

nestedTabsSuite(async () => (await import('../../../libs/blocks/tabs/tabs.js')).default);
