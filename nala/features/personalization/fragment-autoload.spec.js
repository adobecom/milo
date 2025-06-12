module.exports = {
  FeatureName: 'test for automatic geo-specific fragment loading',
  features: [

    {
      tcid: '0',
      name: 'confirm the US personalized experience',
      path: '/drafts/nala/features/personalization/fragment-autoload/autofragbasepage',
      tags: '@fragload0 @mep @smoke @regression @milo',
    },

    {
      tcid: '1',
      name: 'confirm the FR personalized experience',
      path: '/fr/drafts/nala/features/personalization/fragment-autoload/autofragbasepage',
      data: {},
      tags: '@fragload1 @mep @smoke @regression @milo',
    },
  ],
};
