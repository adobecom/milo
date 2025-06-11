/* eslint-disable max-len */

module.exports = {
  FeatureName: 'Merch Acom Cards Feature',
  features: [
    // PLANS CARDS
    {
      tcid: '0',
      name: '@MAS-Plans',
      path: '/drafts/nala/features/commerce/plans',
      data: {
        id: '5c781778-24bd-4d3e-b0eb-810525ea3442',
        categories: ['All', 'Photo', 'Graphic Design', 'Video', 'Illustration', 'Acrobat and PDF', '3D and AR', 'Social Media'],
        cards: [
          { id: '7819acb2-fb23-46c5-ab7f-f59b2e29ee1e',
            title: 'Photography',
            categories: ['Photo'],
            description: 'Lightroom, Lightroom Classic, Photoshop on desktop, web, iPhone, and iPad, and 1TB of cloud storage.',
            price: 'US$19.99/mo',
            cta: 'Select',
            iconUrl: 'https://www.adobe.com/content/dam/shared/images/product-icons/svg/lightroom.svg',
            seeAllPlansText: 'See all plans & pricing details',
            stockCheckboxLabel: 'Add a 30-day free trial of Adobe Stock.*'
          },
          { id:'442a9094-e812-4f5c-a837-e3c315b0306e',
            title: 'Photoshop',
            categories: ['Photo', 'Graphic Design', 'Illustration'],
            description: 'Create beautiful graphics, photos, and art on desktop, web, iPhone, and iPad. Comes with Adobe Fresco for drawing and painting.',
            price: 'US$22.99/mo',
            cta: 'Free Trial',
          },
          { id: 'abbd6ebc-b80e-4d29-b24f-54aaf02541d0',
            categories: ['Photo', 'Social Media'],
            title: 'Lightroom',
            description: 'Edit, organize, store, and share photos from anywhere.',
            cta: 'Free Trial',
          }
        ],
        title: 'Creative Cloud All Apps',
        description: 'Get 20+ Creative Cloud apps including Photoshop, Illustrator, Adobe Express, Premiere Pro, and Acrobat Pro. (Substance 3D apps are not included.)',
        price: 'US$59.99/mo',
        cta: 'Select',
        ctaOsi: 'r_JXAnlFI7xD6FxWKl2ODvZriLYBoSL701Kd1hRyhe8',
        iconUrl: 'https://www.adobe.com/content/dam/shared/images/product-icons/svg/creative-cloud.svg',
        seeAllPlansText: 'See all plans & pricing details',
        stockCheckboxLabel: 'Add a 30-day free trial of Adobe Stock.*',
      },
      browserParams: '',
      tags: '@mas-acom @mas-plans-card @commerce @smoke @regression @milo @mas-plans-page',
    },
  ],
};
