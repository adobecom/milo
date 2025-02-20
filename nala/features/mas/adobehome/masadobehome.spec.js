/* eslint-disable max-len */

module.exports = {
  FeatureName: 'Mas Adobe Home Try Buy Widget',
  features: [
    {
      tcid: '0',
      name: '@MAS-AH-Try-Buy-Widget-basic',
      path: '/libs/features/adobehome/docs/adobe-home.html',
      data: {
        id: 'ahw-001',
        title: 'Photoshop Starter Plan',
        description: 'Begin your creative journey with basic Photoshop features',
        price: 'US$9.99/mo',
        cta: 'Try now',
        background: 'photoshop-basic-bg.jpg',
      },
      browserParams: '?theme=dark',
      tags: '@adobehome @ah-try-buy-widget @smoke @regression',
    },
    {
      tcid: '1',
      name: '@MAS-AH-Try-Buy-Widget-badge',
      path: '/libs/features/adobehome/docs/adobe-home.html',
      data: {
        id: 'ahw-002',
        badge: 'New',
        title: 'Photoshop Pro Plan',
        description: 'Professional tools for advanced users',
        price: 'US$29.99/mo',
        cta: 'Upgrade',
        background: 'photoshop-pro-bg.png',
      },
      browserParams: '?theme=dark',
      tags: '@adobehome @ah-try-buy-widget @badge @regression',
    },
    {
      tcid: '2',
      name: '@MAS-AH-Try-Buy-Widget-custom-colors',
      path: '/libs/features/adobehome/docs/adobe-home.html',
      data: {
        id: 'ahw-003',
        title: 'Custom Color Widget',
        description: 'Testing custom color configurations',
        price: 'US$19.99/mo',
        cta: 'Try',
        background: 'custom-bg.jpg',
        expectedBgColor: 'rgb(255, 245, 230)',
        expectedBorderColor: 'rgb(255, 200, 150)',
      },
      browserParams: '?theme=lightest',
      tags: '@adobehome @ah-try-buy-widget @custom-colors @regression',
    }
  ]
}; 
