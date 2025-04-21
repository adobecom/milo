module.exports = {
  name: 'updateAttribute, prepend, append (to a non-section element)',
  features: [
    {
      tcid: '0',
      name: '@check updateAttribute functionality',
      desc: 'check 3 attributes of the hollow button to be updated',
      path: '/drafts/nala/features/personalization/update-attribute/update-attribute',
      data: {},
      tags: '@updateattr0 @mep @smoke @regression @milo',
    },
    {
      tcid: '1',
      name: '@check prepend and append using a non-section element',
      desc: 'check the marquee heading for both prepended and appended text',
      path: '/drafts/nala/features/personalization/update-attribute/update-attribute',
      data: {},
      tags: '@updateattr1 @mep @smoke @regression @milo',
    },
    {
      tcid: '2',
      name: '@Verify the control',
      desc: 'The control should not have any of the aobve changes',
      path: '/drafts/nala/features/personalization/update-attribute/update-attribute?mep=%2Fdrafts%2Fnala%2Ffeatures%2Fpersonalization%2Fupdate-attribute%2Fupdate-attribute.json--default',
      data: {},
      tags: '@updateattr2 @mep @smoke @regression @milo',
    },
  ],
};
