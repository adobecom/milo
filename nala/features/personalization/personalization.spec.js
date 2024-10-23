module.exports = {
  name: 'Personalization Feature',
  features: [
    {
      tcid: '0',
      name: '@Replace content',
      desc: 'Personalization with action=replaceContent',
      path: '/drafts/nala/features/personalization/pzn-replacecontent',
      data: {
        target: 'textpersonlization',
        pznExpName: 'param-target=textpersonlization',
        pznFileName: 'pzn1',
        h3Text: 'Text',
      },
      tags: '@pzn @smoke @regression @milo ',
    },
    {
      tcid: '1',
      name: '@Insert Content Before',
      desc: 'Personalization with action=insertContentBefore',
      path: '/drafts/nala/features/personalization/pzn-insertcontent-before',
      data: {
        target: 'textpersonlization',
        pznExpName: 'param-target=textpersonlization',
        pznFileName: 'insert-content-before',
        h3Text: 'Text',
      },
      tags: '@pzn @smoke @regression @milo ',
    },
    {
      tcid: '2',
      name: '@Insert Content After',
      desc: 'Personalization with action=insertContentAfter',
      path: '/drafts/nala/features/personalization/pzn-insertcontent-after',
      data: {
        target: 'textpersonlization',
        pznExpName: 'param-target=textpersonlization',
        pznFileName: 'insert-content-before',
        h3Text: 'Text',
      },
      tags: '@pzn @smoke @regression @milo ',
    },
  ],
};
