/* eslint-disable max-len */

const { PRICE_PATTERN, DOCS_GALLERY_PATH } = require('../../../../libs/commerce.js');

module.exports = {
  FeatureName: 'Merch Acom Cards Feature',
  features: [
    // PLANS CARDS
    {
      tcid: '0',
      name: '@MAS-Plans',
      path: DOCS_GALLERY_PATH.PLANS,
      data: {
        id: '5a5ca143-a417-4087-b466-5b72ac68a830',
        title: 'Acrobat Pro',
        promoText: 'Save over 30% with an annual plan.',
        description: 'Create, edit, sign, and manage your PDFs — quickly, easily, anywhere.',
        price: PRICE_PATTERN.US.mo,
        cta: 'Buy now',
        ctaOsi: '6WK1gybjBe2EKcq0HI0WvbsoiKOri2yRAwS9t_kGHoE',
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
      path: DOCS_GALLERY_PATH.PLANS,
      data: { id: '8373b5c2-69e6-4e9c-befc-b424dd33469b' },
      browserParams: '?theme=darkest',
      tags: '@mas-acom @mas-plans-card @commerce @smoke @regression @milo',
    },
    {
      tcid: '2',
      name: '@MAS-Plans-Students-CSS',
      path: DOCS_GALLERY_PATH.PLANS,
      data: { id: 'dfc2eede-7e88-4ed3-b96c-f5214472dfcf' },
      browserParams: '?theme=darkest',
      tags: '@mas-acom @mas-plans-card @commerce @smoke @regression @milo',
    },
  ],
};
