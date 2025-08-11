/* eslint-disable max-len */

const { PRICE_PATTERN, DOCS_BASE_PATH } = require('../../../../libs/commerce.js');

module.exports = {
  FeatureName: 'Merch Acom Cards Feature',
  features: [
    // PLANS CARDS
    {
      tcid: '0',
      name: '@MAS-Plans',
      path: DOCS_BASE_PATH.plans,
      data: {
        id: 'a15b77f7-fb32-4608-8b5c-a1b98675ad85',
        title: 'Acrobat Pro',
        promoText: 'Save over 30% with an annual plan.',
        description: 'Create, edit, sign, and manage your PDFs — quickly, easily, anywhere.',
        price: PRICE_PATTERN.US_mo,
        cta: 'Buy now',
        ctaOsi: 'MzCpF9nUi8rEzyW-9slEUwtRenS69PRW5fp84a93uK4',
        iconUrl: '',
        seeAllPlansText: 'See all plans & pricing details',
        stockCheckboxLabel: 'Add a 30-day free trial of Adobe Stock.*',
      },
      browserParams: '?theme=darkest',
      tags: '@mas-acom @mas-plans-card @commerce @smoke @regression @milo',
    },
    {
      tcid: '1',
      name: '@MAS-Plans-CSS',
      path: DOCS_BASE_PATH.plans,
      data: { id: '8373b5c2-69e6-4e9c-befc-b424dd33469b' },
      browserParams: '?theme=darkest',
      tags: '@mas-acom @mas-plans-card @commerce @smoke @regression @milo',
    },
    {
      tcid: '2',
      name: '@MAS-Plans-Students-CSS',
      path: DOCS_BASE_PATH.plans,
      data: { id: 'dfc2eede-7e88-4ed3-b96c-f5214472dfcf' },
      browserParams: '?theme=darkest',
      tags: '@mas-acom @mas-plans-card @commerce @smoke @regression @milo',
    },
  ],
};
