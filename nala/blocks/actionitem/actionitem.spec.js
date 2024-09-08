module.exports = {
  FeatureName: 'Action Item Block',
  features: [
    {
      tcid: '0',
      name: '@Action-item (small)',
      path: '/drafts/nala/blocks/action-item/action-item-small',
      data: {
        bodyText: 'Body XS Regular - Image min-height 56px',
        imgMinHeight: '56px',
      },
      tags: '@action-item @smoke @regression @milo',
    },
    {
      tcid: '1',
      name: '@Action-item (medium)',
      path: '/drafts/nala/blocks/action-item/action-item-medium',
      data: {
        bodyText: 'Body S Regular - Image min-height 80px',
        imgMinHeight: '80px',
      },
      tags: '@action-item @smoke @regression @milo',
    },
    {
      tcid: '2',
      name: '@Action-item (large)',
      path: '/drafts/nala/blocks/action-item/action-item-large',
      data: {
        bodyText: 'Body M Regular - Image min-height 104px',
        imgMinHeight: '104px',
      },
      tags: '@action-item @smoke @regression @milo',
    },
    {
      tcid: '3',
      name: '@Action-item (center)',
      path: '/drafts/nala/blocks/action-item/action-item-center',
      data: {
        bodyText: 'Center content',
        margin: '0 auto',
      },
      tags: '@action-item @smoke @regression @milo',
    },
    {
      tcid: '4',
      name: '@Action-item (rounded)',
      path: '/drafts/nala/blocks/action-item/action-item-rounded',
      data: {
        bodyText: 'Border radius 4px',
        borderRadius: '4px',
      },
      tags: '@action-item @smoke @regression @milo',
    },
    {
      tcid: '5',
      name: '@Action-item (float-button)',
      path: '/drafts/nala/blocks/action-item/action-item-float-button',
      data: {
        bodyText: 'Float button',
        floatButtonText: 'Edit',
      },
      tags: '@action-item @smoke @regression @milo',
    },
    {
      tcid: '6',
      name: '@Action-item (scroller)',
      path: '/drafts/nala/blocks/action-item/action-scroller',
      data: {
        bodyText: 'content',
        floatButtonText: 'Edit',
        actionItemsCount: 6,
      },
      tags: '@action-item @smoke @regression @milo',
    },
    {
      tcid: '7',
      name: '@Action-item (scroller with navigation)',
      path: '/drafts/nala/blocks/action-item/action-scroller-navigation',
      data: {
        bodyText: 'content',
        floatButtonText: 'Edit',
        actionItemsCount: 8,
      },
      tags: '@action-item @smoke @regression @milo',
    },
  ],
};
