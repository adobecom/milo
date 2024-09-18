module.exports = {
  FeatureName: 'Review',
  features: [
    {
      tcid: '0',
      name: '@Review low  ',
      path: '/drafts/nala/blocks/review/review',
      data: {
        reviewTitle: 'Rate your Experience',
        reviewFields: 5,
        rating: 4,
        reviewComment: 'This is great',

      },
      tags: '@Review @smoke @regression @milo',
    },
    {
      tcid: '1',
      name: '@Review low',
      path: '/drafts/nala/blocks/review/review',
      data: {
        reviewTitle: 'Rate your Experience',
        reviewFields: 5,
        rating: 2,
        reviewComment: 'This is great',

      },
      tags: '@Review @smoke @regression @milo',
    },
  ],
};
