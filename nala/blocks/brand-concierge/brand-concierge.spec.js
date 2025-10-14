module.exports = {
  FeatureName: 'Brand Concierge block',
  features: [
    {
      tcid: '0',
      name: '@brand-concierge default',
      path: '/drafts/nala/blocks/brand-concierge/brand-concierge',
      tags: '@brand-concierge @smoke @regression @milo',
      data: {
        h2Text: 'Explore what you can do with Adobe apps.',
        bodyText: 'Choose an option or tell us what interests you',
        inputPlaceholder: 'Tell us about a project or idea that interests you',
        disclaimerText: 'By using this AI-powered automated chatbot',
      },
    },
    {
      tcid: '1',
      name: '@brand-concierge sticky',
      path: '/drafts/nala/blocks/brand-concierge/brand-concierge-sticky',
      tags: '@brand-concierge @brand-concierge-sticky @smoke @regression @milo',
      data: {
        h2Text: 'Heading XL Marquee standard medium left',
        bodyText: 'Body M Lorem ipsum dolor sit amet',
        inputPlaceholder: 'Tell us what you\'d like to do or create',
        aiAssistantText: 'AI Assistant',
        disclaimerText: 'Your use of this automated chatbot constitutes consent',
      },
    },
    {
      tcid: '2',
      name: '@brand-concierge hero',
      path: '/drafts/nala/blocks/brand-concierge/brand-concierge-hero',
      tags: '@brand-concierge @brand-concierge-hero @smoke @regression @milo',
      data: {
        h2Text: 'Ask Adobe anything',
        inputPlaceholder: 'Ask anything',
        disclaimerText: 'By using this AI chatbot (beta), you agree Adobe may use your info',
      },
    },
    {
      tcid: '3',
      name: '@brand-concierge 404',
      path: '/drafts/nala/blocks/brand-concierge/brand-concierge-404',
      tags: '@brand-concierge @brand-concierge-404 @smoke @regression @milo',
      data: {
        h2Text: 'Sorry, we couldn\'t find that page.',
        inputPlaceholder: 'Tell us what you\'d like to create',
        disclaimerText: 'Use of this beta AI chatbot is subject to Adobe\'s Privacy Policy',
      },
    },
  ],
};
