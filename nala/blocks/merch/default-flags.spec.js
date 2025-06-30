module.exports = {
  name: 'Merch Default Flags',
  features: [
    {
      name: '@DefaultFlags',
      path: '/drafts/nala/blocks/merch/default-flags',
      browserParams: '?georouting=off&martech=off',
      tags: '@default-flags @smoke @regression @milo',
    },
    {
      name: '@DefaultFlagsFR',
      path: '/fr/drafts/nala/blocks/merch/default-flags',
      browserParams: '?georouting=off&martech=off',
      tags: '@default-flags @smoke @regression @milo',
    },
    {
      name: '@DefaultFlagsNG',
      path: '/ng/drafts/nala/blocks/merch/default-flags',
      browserParams: '?georouting=off&martech=off',
      tags: '@default-flags @smoke @regression @milo',
    },
  ],
};
