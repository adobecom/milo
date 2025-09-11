module.exports = {
  name: 'Merch Three In One',
  features: [
    {
      name: '@ThreeInOne',
      path: '/drafts/nala/blocks/merch/three-in-one',
      browserParams: '?georouting=off&martech=off',
      tags: '@three-in-one @commerce @smoke @regression @milo',
    },
    {
      name: '@ThreeInOneFallback',
      path: '/drafts/nala/blocks/merch/three-in-one-fallback',
      browserParams: '?georouting=off&martech=off',
      tags: '@three-in-one @commerce @smoke @regression @milo',
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
        {
          sectionId: 'deeplink-students',
          attributes: {
            'data-modal': 'twp',
            href: 'https://commerce.adobe.com/store/segmentation?cli=adobe_com&ctx=fp&co=US&lang=en&ms=EDU&ot=TRIAL&cs=INDIVIDUAL&pa=ccsn_direct_individual',
            'aria-label': 'Free trial - Creative Cloud All Apps - Students and teachers',
          },
          iframeSrc: 'https://www.adobe.com/mini-plans/creativecloud.html?mid=ft&web=1&plan=edu',
        },
        {
          sectionId: 'deeplink-business',
          attributes: {
            'data-modal': 'twp',
            href: 'https://commerce.adobe.com/store/segmentation?cli=adobe_com&ctx=fp&co=US&lang=en&ms=COM&ot=TRIAL&cs=TEAM&pa=phsp_direct_indirect_team',
            'aria-label': 'Free trial - Photoshop - Business',
          },
          iframeSrc: 'https://www.adobe.com/mini-plans/photoshop.html?mid=ft&web=1&plan=team',
        },
        {
          sectionId: 'deeplink-students-override',
          attributes: {
            'data-modal': 'crm',
            href: 'https://commerce.adobe.com/store/segmentation?cli=adobe_com&ctx=fp&co=US&lang=en&ms=e&ot=BASE&cs=INDIVIDUAL&pa=phsp_direct_individual',
            'aria-label': 'Buy now - Photoshop - Students and teachers',
            'data-extra-options': '{"ms":"e"}',
          },
          iframeSrc: 'https://www.adobe.com/mini-plans/buy/photoshop.html?web=1&plan=edu',
        },
        {
          sectionId: 'deeplink-business-override',
          attributes: {
            'data-modal': 'crm',
            href: 'https://commerce.adobe.com/store/segmentation?cli=adobe_com&ctx=fp&co=US&lang=en&ms=COM&ot=BASE&cs=t&pa=phsp_direct_individual',
            'aria-label': 'Buy now - Photoshop - Business',
            'data-extra-options': '{"cs":"t"}',
          },
          iframeSrc: 'https://www.adobe.com/mini-plans/buy/photoshop.html?web=1&plan=team',
        },
        {
          sectionId: 'deeplink-promoid',
          attributes: {
            'data-modal': 'crm',
            href: 'https://commerce.adobe.com/store/segmentation?cli=adobe_com&ctx=fp&co=US&promoid=K42KVSWP&mv=other&lang=en&ms=COM&ot=BASE&cs=INDIVIDUAL&pa=phsp_direct_individual',
            'aria-label': 'Buy now - Photoshop - Individuals',
            'data-extra-options': '{"promoid":"K42KVSWP","mv":"other"}',
          },
          iframeSrc: 'https://www.adobe.com/mini-plans/buy/photoshop.html?web=1&promoid=K42KVSWP&mv=other',
        },
      ],
    },
    {
      name: '@ThreeInOneCatalog',
      path: '/drafts/nala/blocks/merch/3in1-catalog-edu',
      sectionId: 'modal-catalog-edu',
      iframeSrc: 'https://commerce.adobe.com/store/segmentation?cli=mini_plans&ctx=if&co=US&lang=en&ms=EDU&ot=TRIAL&cs=INDIVIDUAL&pa=phsp_direct_individual&rtc=t&lo=sl&af=uc_new_user_iframe%2Cuc_new_system_close',
      attributes: { 'aria-label': 'Free trial - Photoshop - Individuals' },
      browserParams: '?georouting=off&martech=off',
      tags: '@three-in-one @commerce @smoke @regression @milo',
    },
    {
      name: '@ThreeInOneCatalogFallback',
      path: '/drafts/nala/blocks/merch/3in1-fallback-catalog-edu',
      sectionId: 'modal-fallback-catalog-edu',
      iframeSrc: 'https://www.adobe.com/mini-plans/photoshop.html?mid=ft&web=1&plan=edu',
      attributes: { 'aria-label': 'Free trial - Photoshop - Individuals' },
      browserParams: '?georouting=off&martech=off',
      tags: '@three-in-one @commerce @smoke @regression @milo',
    },
    {
      name: '@ThreeInOneDCAddon',
      path: '/drafts/nala/blocks/merch/3in1-acrobat-addon',
      iframeSrcNoAddOn: 'https://commerce.adobe.com/store/segmentation?cli=creative&ctx=if&co=US&lang=en&ms=COM&ot=TRIAL&cs=INDIVIDUAL&pa=apcc_direct_individual&rtc=t&lo=sl&af=uc_new_user_iframe%2Cuc_new_system_close',
      iframeSrcWithAddOn: 'https://commerce.adobe.com/store/segmentation?cli=creative&ctx=if&co=US&lang=en&ms=COM&ot=TRIAL&cs=INDIVIDUAL&pa=apcc_direct_individual&ao=PA-1042&rtc=t&lo=sl&af=uc_new_user_iframe%2Cuc_new_system_close',
      attributes: { 'aria-label': 'Free trial Acrobat Pro' },
      browserParams: '?georouting=off&martech=off',
      tags: '@three-in-one @commerce @smoke @regression @milo',
    },
    {
      name: '@ThreeInOneFallbackStep',
      path: '/drafts/nala/blocks/merch/three-in-one-fallback',
      sectionId: 'fallback-step',
      attributes: {
        href: 'https://commerce.adobe.com/store/commitment?items%5B0%5D%5Bid%5D=7C30A05FE0EC0BA92566737E720C4692&cli=adobe_com&ctx=fp&co=US&lang=en',
        'aria-label': 'Buy now - Acrobat Pro - Individuals',
        'data-checkout-workflow-step': 'commitment',
      },
      browserParams: '?georouting=off&martech=off',
      tags: '@three-in-one @commerce @smoke @regression @milo',
    },
  ],
};
