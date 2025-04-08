/* eslint-disable max-len */

module.exports = {
  FeatureName: 'Merch Acom Cards Feature',
  features: [
    // PLANS CARDS
    {
      tcid: '0',
      name: '@MAS-Plans',
      path: '/libs/features/mas/docs/plans.html',
      data: {
        id: 'a15b77f7-fb32-4608-8b5c-a1b98675ad85',
        title: 'Acrobat Pro',
        promoText: 'Save over 30% with an annual plan.',
        description: 'Create, edit, sign, and manage your PDFs — quickly, easily, anywhere.',
        price: 'US$19.99/mo',
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
      path: '/libs/features/mas/docs/plans.html',
      data: { id: '8373b5c2-69e6-4e9c-befc-b424dd33469b' },
      browserParams: '?theme=darkest',
      tags: '@mas-acom @mas-plans-card @commerce @smoke @regression @milo',
    },
  ],
};
