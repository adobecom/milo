module.exports = {
  name: 'check for Target enablement via page metadata and via URL parameter',
  features: [
    {
      tcid: '0',
      name: '@check for running Target tests',
      desc: 'there should be 2 running Target tests, one enabled by a URL parameter and one enabled by page metadata',
      path: '/drafts/nala/features/personalization/target-on/target-on2?target=on&mep=%2Fdrafts%2Fnala%2Ffeatures%2Fpersonalization%2Ftarget-on%2Fmanifest.json--default',
      data: {},
      tags: '@targeton0 @smoke @regression @milo ',
    },
    {
      tcid: '1',
      name: '@check for running Target tests',
      desc: 'there should be 2 running Target tests, one enabled by a URL parameter and one enabled by page metadata',
      path: '/drafts/nala/features/personalization/target-on/target-on',
      data: {},
      tags: '@targeton1 @smoke @regression @milo ',
    },
    {
      tcid: '2',
      name: '@check for running Target tests',
      desc: 'there should be 2 running Target tests, one enabled by a URL parameter and one enabled by page metadata',
      path: '/drafts/nala/features/personalization/target-on/target-on2?target=on',
      data: {},
      tags: '@targeton2 @smoke @regression @milo ',
    },
  ],
};
