module.exports = {
  name: 'Reading-time Block',
  features: [
    {
      tcid: '0',
      name: 'Reading-time block',
      path: '/drafts/nala/blocks/reading-time/reading-time-block',
      data: { timeText: '0 min read' },
      tags: 'reading-time @smoke @regression @milo',
    },
    {
      tcid: '1',
      name: 'Reading-time without text',
      path: '/drafts/nala/blocks/reading-time/reading-time-withouttext',
      tags: 'reading-time @smoke @regression @milo',
    },
    {
      tcid: '2',
      name: 'Reading-time with text',
      path: '/drafts/nala/blocks/reading-time/reading-time-text',
      data: {
        detailText: 'Detail',
        h2Text: 'Heading XL Marquee standard small light',
        h3Text: 'Text (inset, large, m spacing)',
        bodyText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.',
        bodyTextL: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis ut nisl vitae urna volutpat tincidunt ac in mauris. In hac habitasse platea dictumst. Integer vel tempus nisi.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation. ',
        listItemsText: 'Lorem ipsum dolor sit amet.',
        outlineButtonText: 'Lorem ipsum',
        blueButtonText: 'Call to action',
      },
      tags: 'reading-time @smoke @regression @milo',
    },
  ],
};
