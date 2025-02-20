module.exports = {
  name: 'test the mep-button functionality',
  features: [
    {
      tcid: '0',
      name: '@0 - the pencil icon of the MEP Button',
      desc: 'the pencil icon of the MEP Button should end in .json (it should point to the MEP manifest)',
      path: '/drafts/nala/features/personalization/mep-button/mep-button',
      tags: '@mep @mepbutton0 @smoke @regression @milo',
    },
    {
      tcid: '1',
      name: '@1 - the mep button should show with the mep parameter',
      desc: 'the mep button should show with the mep URL parameter present',
      path: 'https://milo.adobe.com/',
      tags: '@mep @mepbutton1 @smoke @regression @milo',
    },
    {
      tcid: '2',
      name: '@2 - the highlight function should work',
      desc: 'the hightlight option should work, including on merch cards',
      path: '/drafts/nala/features/personalization/mep-button/mep-button',
      tags: '@mep @mepbutton2 @smoke @regression @milo',
    },
    {
      tcid: '3',
      name: '@3 - test ability to count multiple manifests',
      desc: 'There should be 3 manifests on this page',
      path: '/drafts/nala/features/personalization/mep-button/number-of-manifests',
      tags: '@mep @mepbutton3 @smoke @regression @milo',
    },
    {
      tcid: '4',
      name: '@4 - promos should appear properly on button',
      desc: 'Promos should have a start and end date and should be labeled appropriately',
      path: '/drafts/nala/features/promotions/promo-future',
      tags: '@mep @mepbutton4 @smoke @regression @milo',
    },
    {
      tcid: '6',
      name: '@6 - test the order of experiences',
      desc: 'test the order of promos vs regular experiences',
      path: '/drafts/nala/features/promotions/promo-insert?mep=%2Fdrafts%2Fnala%2Ffeatures%2Fpromotions%2Fmanifests%2Fpromo-insert.json--default---%2Fdrafts%2Fnala%2Ffeatures%2Fpersonalization%2Fmep-button%2Fexecution-order1.json',
      data: { pathToManifest: '' },
      tags: '@mep @mepbutton6 @smoke @regression @milo',
    },
  ],
};
