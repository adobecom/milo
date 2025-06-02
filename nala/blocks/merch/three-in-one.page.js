/* eslint-disable import/no-import-module-exports */

export default class ThreeInOne {
  constructor(page) {
    this.page = page;
    this.ctas = {
      illustratorAndAcrobatProTwpSegmentation: {
        el: page.locator('[data-wcs-osi="ByqyQ6QmyXhzAOnjIcfHcoF1l6nfkeLgbzWz-aeM8GQ"][data-checkout-workflow-step="segmentation"]'),
        href: 'https://commerce.adobe.com/store/segmentation?cli=mini_plans&ctx=if&co=US&lang=en&ms=COM&ot=TRIAL&cs=INDIVIDUAL&pa=ilst_direct_individual&rtc=t&lo=sl&af=uc_new_user_iframe%2Cuc_new_system_close',
      },
      acrobatProD2PSegmentation: {
        el: page.locator('[data-wcs-osi="6l76ZcyviuBsHriZ23_pqwOVCscO5QfhZUuW7g18FgY"][data-checkout-workflow-step="segmentation"]'),
        href: 'https://commerce.adobe.com/store/segmentation?cli=mini_plans&ctx=if&co=US&lang=en&ms=COM&ot=BASE&cs=INDIVIDUAL&pa=PA-1386&rtc=t&lo=sl&af=uc_new_user_iframe%2Cuc_new_system_close',
      },
      allAppsCrmSegmentation: {
        el: page.locator('[data-wcs-osi="r_JXAnlFI7xD6FxWKl2ODvZriLYBoSL701Kd1hRyhe8"][data-checkout-workflow-step="segmentation"]'),
        href: 'https://commerce.adobe.com/store/segmentation?cli=creative&ctx=if&co=US&lang=en&ms=COM&ot=BASE&cs=INDIVIDUAL&pa=ccsn_direct_individual&rtc=t&lo=sl&af=uc_new_user_iframe%2Cuc_new_system_close',
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
        href: 'https://commerce.adobe.com/store/segmentation?cli=mini_plans&ctx=if&co=US&lang=en&ms=COM&ot=BASE&cs=TEAM&pa=phsp_direct_indirect_team&rtc=t&lo=sl&af=uc_new_user_iframe%2Cuc_new_system_close',
      },
      msParam: {
        el: page.locator('[data-wcs-osi="MOTPxRjjKKie1Rn-Shd7Y5_UYWZYaN6UCfjf29oNn7w"][data-modal="d2p"]'),
        href: 'https://commerce.adobe.com/store/segmentation?cli=mini_plans&ctx=if&co=US&lang=en&ms=EDU&ot=BASE&cs=INDIVIDUAL&pa=PA-1176&rtc=t&lo=sl&af=uc_new_user_iframe%2Cuc_new_system_close',
      },
      csParamOverride: {
        el: page.locator('[data-wcs-osi="uNuSxc0Vg8l3Gm0W21Ge_TKAKfXKI_fnRHdwJu74l_I"]'),
        href: 'https://commerce.adobe.com/store/segmentation?cli=creative&ctx=if&co=US&lang=en&ms=COM&ot=BASE&cs=myoverride&pa=acrobat_pro_dc_plus_sign_funnel_individual&rtc=t&lo=sl&af=uc_new_user_iframe%2Cuc_new_system_close',
      },
      msParamOverride: {
        el: page.locator('[data-wcs-osi="1ZyMOJpSngx9IU5AjEDyp7oRBz843zNlbbtPKbIb1gM"]'),
        href: 'https://commerce.adobe.com/store/segmentation?cli=creative&ctx=if&co=US&lang=en&ms=myoverride&ot=BASE&cs=INDIVIDUAL&pa=creative_cloud_all_apps_with_2tb_cloud_services_individual&rtc=t&lo=sl&af=uc_new_user_iframe%2Cuc_new_system_close',
      },
    };
    this.props = {};
    this.getFallbackCta = (sectionId) => this.page.locator(`#${sectionId} [is="checkout-link"]`);
    this.getModal = () => this.page.locator('.dialog-modal');
    this.closeModal = async () => {
      const modal = this.getModal();
      modal.dispatchEvent('closeModal');
      await this.page.waitForTimeout(500);
    };
  }
}
