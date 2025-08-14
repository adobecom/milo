/* eslint-disable max-len */

module.exports = {
  FeatureName: 'MAS Express Cards',
  features: [
    {
      tcid: '0',
      name: '@MAS-Express-Card-Free',
      path: '/libs/features/mas/docs/express.html',
      data: {
        id: '67c78f03-7d88-44c9-9a06-05443ec9265d',
        title: 'Free',
        badge: '', // No badge for free card
        description: 'Basic content creation tools, limited generative AI credits and assets.',
        price: 'US$0.00',
        priceNote: 'Free to use. No credit card required.',
        cta: 'Get Adobe Express Free',
        variant: 'simplified-pricing-express',
      },
      tags: '@express @express-card @free @smoke @regression',
    },
    {
      tcid: '1',
      name: '@MAS-Express-Card-Premium',
      path: '/libs/features/mas/docs/express.html',
      data: {
        id: 'b28957b9-2341-40f9-9004-24446f68e5e5',
        title: 'Premium',
        badge: '', // No badge for premium card
        description: 'Access millions of assets, more AI credits, and premium tools.',
        price: 'US$9.99',
        priceNote: 'No annual commitment, billed monthly.',
        cta: 'Start 30-day free trial',
        variant: 'simplified-pricing-express',
        gradientBorder: false,
      },
      tags: '@express @express-card @premium @smoke @regression',
    },
    {
      tcid: '2',
      name: '@MAS-Express-Card-Firefly-Pro',
      path: '/libs/features/mas/docs/express.html',
      data: {
        id: 'aaa728dc-2b44-495c-b9f0-bb82044db18a',
        title: 'Firefly Pro',
        badge: 'Best value', // Updated based on actual content
        description: 'Get Adobe Express Premium plus 4,000 credits for creative AI and Adobe Photoshop on web and mobile for advanced image editing.',
        price: 'US$9.99/mo',
        priceNote: 'No annual commitment, billed monthly.',
        priceAdditionalNote: '',
        cta: 'Start 14-day free trial',
        variant: 'simplified-pricing-express',
        gradientBorder: true,
      },
      tags: '@express @express-card @firefly-pro @regression',
    },
  ],
};
