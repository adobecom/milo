/* eslint-disable max-len */

module.exports = {
  FeatureName: 'Merch Plans Cards Feature',
  features: [
    // PLANS CARDS
    {
      tcid: '0',
      name: '@MAS-Plans-Category',
      path: '/drafts/nala/features/commerce/plans',
      data: {
        categories: {
          all: {
            products: [
              'Creative Cloud All Apps',
              'Photography',
              'Acrobat Pro',
              'Photoshop',
              'Adobe Premiere Pro',
              'Illustrator',
              'After Effects',
              'Adobe Express',
              'InDesign',
              'Lightroom',
              'AI Assistant for Acrobat',
              'Audition',
              'Adobe Substance 3D Collection',
            ],
            count: 13,
          },
          photo: {
            products: [
              'Creative Cloud All Apps',
              'Photography',
              'Photoshop',
              'Lightroom',
            ],
            count: 4,
            browserFilter: '#filter=photo',
          },
          'graphic-design': {
            products: [
              'Creative Cloud All Apps',
              'Photoshop',
              'Illustrator',
              'Adobe Express',
              'InDesign',
              'Acrobat Pro',
            ],
            count: 6,
            browserFilter: '#filter=graphic+design',
          },
          video: {
            products: [
              'Creative Cloud All Apps',
              'Adobe Premiere Pro',
              'After Effects',
              'Adobe Express',
              'Audition',
            ],
            count: 5,
            browserFilter: '#filter=video',
          },
          illustration: {
            products: [
              'Creative Cloud All Apps',
              'Photoshop',
              'Illustrator',
            ],
            count: 3,
            browserFilter: '#filter=illustration',
          },
          'acrobat-pdf': {
            products: [
              'Creative Cloud All Apps',
              'Acrobat Pro',
              'AI Assistant for Acrobat',
            ],
            count: 3,
            browserFilter: '#filter=acrobat+and+pdf',
          },
          '3d-ar': {
            products: [
              'Adobe Substance 3D Collection',
            ],
            count: 1,
            browserFilter: '#filter=3d+and+ar',
          },
          'social-media': {
            products: [
              'Adobe Express',
              'Adobe Premiere Pro',
              'Lightroom',
            ],
            count: 3,
            browserFilter: '#filter=social+media',
          },
        },
        cards: [
          {
            id: '5c781778-24bd-4d3e-b0eb-810525ea3442',
            title: 'Creative Cloud All Apps',
            description: 'Get 20+ Creative Cloud apps including Photoshop, Illustrator, Adobe Express, Premiere Pro, and Acrobat Pro. (Substance 3D apps are not included.)',
            price: 'US$69.99/mo',
            abmLabel: 'Annual, paid monthly.',
            cta: 'Select',
            osi: 'r_JXAnlFI7xD6FxWKl2ODvZriLYBoSL701Kd1hRyhe8',
            linkText: 'See all plans & pricing details',
            linkUrl: 'https://www.adobe.com/plans-fragments/modals/individual/modals-content-rich/all-apps/master.html',
            iconUrl: 'https://www.adobe.com/content/dam/shared/images/product-icons/svg/creative-cloud.svg',
            ctaAnalyticsId: 'select',
            ctaDaaLL: 'Select-2--Creative Cloud All A',
          },
          {
            id: '7819acb2-fb23-46c5-ab7f-f59b2e29ee1e',
            title: 'Photography',
            description: 'Lightroom, Lightroom Classic, Photoshop on desktop, web, iPhone, and iPad, and 1TB of cloud storage.',
            price: 'US$19.99/mo',
            abmLabel: 'Annual, paid monthly.',
            cta: 'Select',
            osi: 'MzCpF9nUi8rEzyW-9slEUwtRenS69PRW5fp84a93uK4',
            linkText: 'See all plans & pricing details',
            linkUrl1: 'https://www.adobe.com/creativecloud/photography/compare-plans.html',
            linkUrl2: 'https://www.adobe.com/plans-fragments/modals/individual/modals-content-rich/photography1tb/master.html',
            iconUrl1: 'https://www.adobe.com/content/dam/shared/images/product-icons/svg/lightroom.svg',
            iconUrl2: 'https://www.adobe.com/cc-shared/assets/img/product-icons/svg/photoshop.svg',
            ctaAnalyticsId: 'select',
            ctaDaaLL: 'Select-2--Creative Cloud All A',
          },
        ],
      },

      tags: '@mas-acom @mas-plans-card @commerce @smoke @regression @milo @plans-category-switching',
    },
    {
      tcid: '1',
      name: '@MAS-Plans-Tabs-Deeplink',
      path: '/drafts/nala/features/commerce/plans',
      browserParams: '?plans=edu',
      tags: '@mas-acom @mas-plans-card @commerce @smoke @regression @milo @plans-tabs-deeplink',
    },
  ],
};
