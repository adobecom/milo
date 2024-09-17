module.exports = {
  name: 'Marketo Forms block',
  features: [
    {
      tcid: '0',
      name: '@marketo full template',
      path: [
        '/drafts/nala/blocks/marketo/full',
      ],
      tags: '@marketo @marketoFullRedirect @marketoRedirect @milo @smoke @regression',
    },
    {
      tcid: '1',
      name: '@marketo full template with company type',
      path: [
        '/drafts/nala/blocks/marketo/full-with-company-type',
      ],
      tags: '@marketo @marketoFullRedirect @marketoRedirect @milo @smoke @regression',
    },
    {
      tcid: '2',
      name: '@marketo expanded template',
      path: [
        '/drafts/nala/blocks/marketo/expanded',
        '/drafts/nala/blocks/marketo/expanded-with-company-type',
      ],
      tags: '@marketo @marketoExpandedRedirect @marketoRedirect @milo @smoke @regression',
    },
    {
      tcid: '3',
      name: '@marketo essential template',
      path: [
        '/drafts/nala/blocks/marketo/essential',
        '/drafts/nala/blocks/marketo/essential-with-company-type',
      ],
      tags: '@marketo @marketoEssentialRedirect @marketoRedirect @milo @smoke @regression',
    },
    {
      tcid: '4',
      name: '@marketo full template message',
      path: [
        '/drafts/nala/blocks/marketo/full-message',
      ],
      tags: '@marketo @marketoFullMessage @marketoMessage @milo @smoke @regression',
    },
    {
      tcid: '5',
      name: '@marketo full template with company type',
      path: [
        '/drafts/nala/blocks/marketo/full-message-with-company-type',
      ],
      tags: '@marketo @marketoFullMessage @marketoMessage @milo @smoke @regression',
    },
    {
      tcid: '6',
      name: '@marketo expanded template',
      path: [
        '/drafts/nala/blocks/marketo/expanded-message',
        '/drafts/nala/blocks/marketo/expanded-message-with-company-type',
      ],
      tags: '@marketo @marketoExpandedMessage @marketoMessage @milo @smoke @regression',
    },
    {
      tcid: '7',
      name: '@marketo essential template',
      path: [
        '/drafts/nala/blocks/marketo/essential-message',
        '/drafts/nala/blocks/marketo/essential-message-with-company-type',
      ],
      tags: '@marketo @marketoEssentialMessage @marketoMessage @milo @smoke @regression',
    },
  ],
};
