module.exports = {
  FeatureName: 'mep actions',
  features: [

    {
      tcid: '0',
      name: 'confirm the default experience',
      path: '/drafts/nala/features/personalization/mep-actions/pzn-actions?mep=%2Fdrafts%2Fnala%2Ffeatures%2Fpersonalization%2Fmep-actions%2Fpzn-actions.json--default',
      data: {},
      tags: '@mepact0 @mep @smoke @regression @milo',
    },

    {
      tcid: '1',
      name: 'confirm various page actions using mep',
      path: '/drafts/nala/features/personalization/mep-actions/pzn-actions',
      data: {},
      tags: '@mepact1 @mep @smoke @regression @milo',
    },
    {
      tcid: '2',
      name: 'confirm insertScript',
      path: '/drafts/nala/features/personalization/mep-actions/insert-script',
      data: {},
      tags: '@mepact2 @mep @smoke @regression @milo',
    },
    {
      tcid: '3',
      name: 'confirm updateMetadata',
      path: '/drafts/nala/features/personalization/mep-actions/update-metadata',
      data: {},
      tags: '@mepact3 @mep @smoke @regression @milo',
    },
    {
      tcid: '4',
      name: 'confirm useBlockCode',
      path: '/drafts/nala/features/personalization/mep-actions/use-block-code',
      data: { defaultURL: '/drafts/nala/features/personalization/mep-actions/use-block-code?mep=%2Fdrafts%2Fnala%2Ffeatures%2Fpersonalization%2Fmep-actions%2Fuse-block-code.json--default' },
      tags: '@mepact4 @mep @smoke @regression @milo',
    },
  ],
};
