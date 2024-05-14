export default {
  inBlock: {
    'global-navigation': {
      commands: [
        {
          action: 'replace',
          target: '/test/blocks/global-navigation/mocks/mep-large-menu-table',
          manifestId: 'manifest.json',
          selector: '.large-menu',
        },
      ],
      fragments: {
        '/old/navigation': {
          action: 'replace',
          target: '/test/blocks/global-navigation/mocks/mep-global-navigation',
          manifestId: 'manifest.json',
        },
      },
    },
  },
};
