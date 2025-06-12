module.exports = {
  name: 'check order of MEP executions',
  features: [
    {
      tcid: '0',
      name: '@check order of pzn vs promo vs test',
      desc: 'pzn should be first, promo should be second, test should be last',
      path: '/drafts/nala/features/personalization/mep-order/pzn-vs-promo-vs-test',
      data: {},
      tags: '@meporder0 @mep @smoke @regression @milo',
    },
    {
      tcid: '1',
      name: '@check order of first vs normal vs last',
      desc: 'order should be first, normal, last',
      path: '/drafts/nala/features/personalization/mep-order/first-vs-normal-vs-last',
      data: {},
      tags: '@meporder1 @mep @smoke @regression @milo',
    },
  ],
};
