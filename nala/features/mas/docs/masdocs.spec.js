/* eslint-disable max-len */

const { DOCS_GALLERY_PATH } = require('../../../libs/commerce.js');

module.exports = {
  FeatureName: 'Merch CCD Card Feature',
  features: [
    // Checkout Link Page
    {
      tcid: '0',
      name: '@MAS-DOCS-checkout-link',
      path: DOCS_GALLERY_PATH.CHECKOUT_LINK,
      browserParams: '?theme=dark',
      tags: '@mas-docs @checkout-link @commerce @smoke @regression @milo',
    },
    // Merch Card Page
    {
      tcid: '0',
      name: '@MAS-DOCS-merch-card',
      path: DOCS_GALLERY_PATH.MERCH_CARD,
      tags: '@mas-docs @merch-card @commerce @smoke @regression @milo',
    },
  ],
};
