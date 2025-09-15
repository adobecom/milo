/* eslint-disable max-len */

const { DOCS_BASE_PATH } = require('../../../libs/commerce.js');

module.exports = {
  FeatureName: 'Merch CCD Card Feature',
  features: [
    // Checkout Link Page
    {
      tcid: '0',
      name: '@MAS-DOCS-checkout-link',
      path: DOCS_BASE_PATH.checkout_link,
      browserParams: '?theme=dark',
      tags: '@mas-docs @checkout-link @commerce @smoke @regression @milo',
    },
    // Merch Card Page
    {
      tcid: '0',
      name: '@MAS-DOCS-merch-card',
      path: DOCS_BASE_PATH.merch_card,
      tags: '@mas-docs @merch-card @commerce @smoke @regression @milo',
    },
  ],
};
