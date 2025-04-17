/* eslint-disable max-len */

module.exports = {
  FeatureName: 'Merch CCD Card Feature',
  features: [
    // Checkout Link Page
    {
      tcid: '0',
      name: '@MAS-DOCS-checkout-link',
      path: '/libs/features/mas/docs/checkout-link.html',
      browserParams: '?theme=dark',
      tags: '@mas-docs @checkout-link @commerce @smoke @regression @milo',
    },
    // Merch Card Page
    {
      tcid: '0',
      name: '@MAS-DOCS-merch-card',
      path: '/libs/features/mas/docs/merch-card.html',
      tags: '@mas-docs @merch-card @commerce @smoke @regression @milo',
    },
  ],
};
