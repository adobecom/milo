module.exports = {
  name: 'Editorial Card Block',
  features: [
    {
      tcid: '0',
      name: '@Editorial-Card-Media-Tall',
      path: '/drafts/nala/blocks/editorial-card/media-tall',
      browserParams: '?georouting=off',
      tags: '@editorial-card @media-tall @smoke @regression @milo',
      data: {
        lockupLabelText: ' Adobe',
        detailText: 'Static links, l-rounded-corners, hover-scale, click',
        h3Text: 'Editorial Card',
        bodyText:
          'Body Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna. ',
        linkText: 'This is a link',
        blueButtonText: 'Learn More',
      },
    },
    {
      tcid: '1',
      name: '@Editorial-Card-Open',
      path: '/drafts/nala/blocks/editorial-card/open',
      browserParams: '?georouting=off',
      tags: '@editorial-card @open @smoke @regression @milo',
      data: {
        detailText: 'Detail optional',
        h3Text: 'Editorial-card',
        bodyText:
          'Body Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna. ',
        linkText: 'This is a link',
        blueButtonText: 'Learn more',
        linkBtnText: 'Learn more',
      },
    },
    {
      tcid: '2',
      name: '@Editorial-Card-S-Lockup',
      path: '/drafts/nala/blocks/editorial-card/s-lockup',
      browserParams: '?georouting=off',
      tags: '@editorial-card @s-lockup @smoke @regression @milo',
      data: {
        lockupLabelText: ' Adobe',
        lockupDeviceText: 'Desktop + tablet',
        detailText: 'Detail',
        h3Text: 'Editorial-card',
        bodyText:
          'Body Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna. ',
        linkText: 'This is a link',
        blueButtonText: 'Learn more',
        linkBtnText: 'Learn more',
      },
    },
  ],
};
