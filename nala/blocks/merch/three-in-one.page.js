/* eslint-disable import/no-import-module-exports */

export default class ThreeInOne {
  constructor(page) {
    this.page = page;
    this.ctas = {
      illustratorAndAcrobatProTwpSegmentation: {
        el: page.locator('[data-wcs-osi="ByqyQ6QmyXhzAOnjIcfHcoF1l6nfkeLgbzWz-aeM8GQ"][data-checkout-workflow-step="segmentation"]'),
        href: 'https://commerce.adobe.com/store/segmentation?ms=COM&ot=TRIAL&pa=ilst_direct_individual&cli=mini_plans&ctx=if&co=US&lang=en&rtc=t&lo=sl&af=uc_new_user_iframe%2Cuc_new_system_close',
      },
      acrobatProD2PSegmentation: {
        el: page.locator('[data-wcs-osi="6l76ZcyviuBsHriZ23_pqwOVCscO5QfhZUuW7g18FgY"][data-checkout-workflow-step="segmentation"]'),
        href: 'https://commerce.adobe.com/store/segmentation?ms=COM&ot=BASE&pa=PA-1386&cli=mini_plans&ctx=if&co=US&lang=en&rtc=t&lo=sl&af=uc_new_user_iframe%2Cuc_new_system_close',
      },
      allAppsCrmSegmentation: {
        el: page.locator('[data-wcs-osi="r_JXAnlFI7xD6FxWKl2ODvZriLYBoSL701Kd1hRyhe8"][data-checkout-workflow-step="segmentation"]'),
        href: 'https://commerce.adobe.com/store/segmentation?ms=COM&ot=BASE&pa=ccsn_direct_individual&cli=creative&ctx=if&co=US&lang=en&rtc=t&lo=sl&af=uc_segmentation_hide_tabs%2Cuc_new_user_iframe%2Cuc_new_system_close',
      },
      illustratorAndAcrobatProTwpCommitment: {
        el: page.locator('[data-wcs-osi="ByqyQ6QmyXhzAOnjIcfHcoF1l6nfkeLgbzWz-aeM8GQ"][data-checkout-workflow-step="commitment"]'),
        href: 'https://commerce.adobe.com/store/commitment?items%5B0%5D%5Bid%5D=C1C12BA6D34A45AB9C1F7836C88DD4F8&cli=mini_plans&ctx=if&co=US&lang=en&rtc=t&lo=sl&af=uc_new_user_iframe%2Cuc_new_system_close',
      },
      acrobatProD2PCommitment: {
        el: page.locator('[data-wcs-osi="6l76ZcyviuBsHriZ23_pqwOVCscO5QfhZUuW7g18FgY"][data-checkout-workflow-step="commitment"]'),
        href: 'https://commerce.adobe.com/store/commitment?items%5B0%5D%5Bid%5D=32739AC8EF050719A8D3C6779F14FE61&cli=mini_plans&ctx=if&co=US&lang=en&rtc=t&lo=sl&af=uc_new_user_iframe%2Cuc_new_system_close',
      },
      allAppsCrmCommitment: {
        el: page.locator('[data-wcs-osi="r_JXAnlFI7xD6FxWKl2ODvZriLYBoSL701Kd1hRyhe8"][data-checkout-workflow-step="commitment"]'),
        href: 'https://commerce.adobe.com/store/commitment?items%5B0%5D%5Bid%5D=632B3ADD940A7FBB7864AA5AD19B8D28&cli=creative&ctx=if&co=US&lang=en&rtc=t&lo=sl&af=uc_segmentation_hide_tabs%2Cuc_new_user_iframe%2Cuc_new_system_close',
      },
      allAppsTrue: {
        el: page.locator('[data-wcs-osi="Mutn1LYoGojkrcMdCLO7LQlx1FyTHw27ETsfLv0h8DQ"][is="checkout-link"]'),
        href: '#',
      },
      dreamweaverTrue: {
        el: page.locator('[data-wcs-osi="mbCsypkeiY9Pwh50MWnbF7Uh8VTiUN9UI-YHQHxBDaE"][is="checkout-link"]'),
        href: '#',
      },
      upgradeTrue: {
        el: page.locator('[data-wcs-osi="PpnQ-UmW9NBwZwXlFw79zw2JybhvwIUwMTDYiIlu5qI"][is="checkout-link"]'),
        href: 'https://commerce.adobe.com/store/email?items%5B0%5D%5Bid%5D=257E1D82082387D152029F93C1030624&cli=adobe_com&ctx=fp&co=US&lang=en',
      },
      csParam: {
        el: page.locator('[data-wcs-osi="yHKQJK2VOMSY5bINgg7oa2ov9RnmnU1oJe4NOg4QTYI"][data-modal="d2p"]'),
        href: 'https://commerce.adobe.com/store/segmentation?ms=COM&ot=BASE&pa=phsp_direct_indirect_team&cli=mini_plans&ctx=if&co=US&lang=en&rtc=t&lo=sl&af=uc_new_user_iframe%2Cuc_new_system_close&cs=t',
      },
      msParam: {
        el: page.locator('[data-wcs-osi="MOTPxRjjKKie1Rn-Shd7Y5_UYWZYaN6UCfjf29oNn7w"][data-modal="d2p"]'),
        href: 'https://commerce.adobe.com/store/segmentation?ms=e&ot=BASE&pa=PA-1176&cli=mini_plans&ctx=if&co=US&lang=en&rtc=t&lo=sl&af=uc_new_user_iframe%2Cuc_new_system_close',
      },
    };
    this.props = {};
  }
}
