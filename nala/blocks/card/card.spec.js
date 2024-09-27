/* eslint-disable max-len */

module.exports = {
  FeatureName: 'Consonant Card Block',
  features: [
    {
      tcid: '0',
      name: '@Card',
      path: '/drafts/nala/blocks/card/card',
      data: {
        titleH3: 'Lorem ipsum dolor sit amet',
        text: 'Maecenas porttitor congue massa. Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis',
        footerOutlineButtonText: 'Sign up',
        footerBlueButtonText: 'Learn more',
      },
      tags: '@card @smoke @regression @milo',
    },
    {
      tcid: '1',
      name: '@Card (half-card, border)',
      path: '/drafts/nala/blocks/card/half-card-border',
      data: {
        titleH3: 'Lorem ipsum dolor sit amet',
        text: 'Maecenas porttitor congue massa. Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis',
        footerOutlineButtonText: 'Sign up',
        footerBlueButtonText: 'Learn more',
      },
      tags: '@card @smoke @regression @milo',
    },
    {
      tcid: '2',
      name: '@Card (double-width-card, border)',
      path: '/drafts/nala/blocks/card/double-width-card-border',
      data: {
        titleH3: 'Lorem ipsum dolor sit amet',
        text: 'Maecenas porttitor congue massa. Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis',
      },
      tags: '@card @smoke @regression @milo',
    },
    {
      tcid: '3',
      name: '@Card (product-card, border) ',
      path: '/drafts/nala/blocks/card/product-card-border',
      data: {
        titleH3: 'Lorem ipsum dolor sit amet',
        text: 'Maecenas porttitor congue massa. Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis',
        footerOutlineButtonText: 'Learn more',
        footerBlueButtonText: 'Sign up',
      },
      tags: '@card @smoke @regression @milo',
    },
    {
      tcid: '4',
      name: '@Card (half-height-card, border)',
      path: '/drafts/nala/blocks/card/half-height-card-border',
      data: { titleH3: 'Lorem ipsum dolor sit amet' },
      tags: '@card @smoke @regression @milo',
    },
    {
      tcid: '5',
      name: '@Card-horizontal',
      path: '/drafts/nala/blocks/card/card-horizontal',
      data: {
        bodyXS: 'Body XS Regular',
        headingXS: 'Heading XS Bold Lorem ipsum dolo sit amet, consectetur adipis cing elit.',
        imgWidth: '180',
        imgHeight: '132',
      },
      tags: '@card @smoke @regression @milo',
    },
    {
      tcid: '6',
      name: '@Card-horizontal (tile)',
      path: '/drafts/nala/blocks/card/card-horizontal-tile',
      data: {
        bodyXS: 'Body XS Regular',
        headingXS: 'Heading XS Bold Lorem ipsum dolo sit amet, consectetur adipis cing elit.',
        imgWidth: '80',
        imgHeight: '78',
      },
      tags: '@card @smoke @regression @milo',
    },
  ],
};
