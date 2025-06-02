module.exports = {
  name: 'Merch Three In One',
  features: [
    {
      name: '@ThreeInOne',
      path: '/drafts/nala/blocks/merch/three-in-one',
      browserParams: '?georouting=off&martech=off',
      tags: '@three-in-one @smoke @regression @milo',
    },
    {
      name: '@ThreeInOneFallback',
      path: '/drafts/nala/blocks/merch/three-in-one-fallback',
      browserParams: '?georouting=off&martech=off',
      tags: '@three-in-one @smoke @regression @milo',
      useCases: [
        {
          sectionId: 'modal-twp-fallback-twp',
          attributes: {
            'data-modal': 'twp',
            href: 'https://commerce.adobe.com/store/segmentation?cli=adobe_com&ctx=fp&co=US&lang=en&ms=COM&ot=TRIAL&cs=INDIVIDUAL&pa=phsp_direct_individual',
            'aria-label': 'Free trial - Photoshop - Individuals',
          },
          iframeSrc: 'https://www.adobe.com/mini-plans/photoshop.html?mid=ft&web=1',
        },
        {
          sectionId: 'modal-crm-fallback-crm',
          attributes: {
            'data-modal': 'crm',
            href: 'https://commerce.adobe.com/store/segmentation?cli=adobe_com&ctx=fp&co=US&lang=en&ms=COM&ot=BASE&cs=INDIVIDUAL&pa=ccsn_direct_individual',
            'aria-label': 'Buy now - Creative Cloud All Apps - Individuals',
          },
          iframeSrc: 'https://www.adobe.com/plans-fragments/modals/individual/modals-content-rich/all-apps/master.modal.html',
        },
      ],
    },
  ],
};
