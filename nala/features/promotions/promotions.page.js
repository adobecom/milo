export default class CommercePage {
  constructor(page) {
    this.page = page;

    this.marqueeDefault = page.locator('.marquee #promo-test-page');
    this.marqueeReplace = page.locator('.marquee #marquee-promo-replace');
    this.marqueeFragment = page.locator('.marquee #fragment-marquee');
    this.textBlock = page.locator('.text-block');
    this.textDefault = page.locator('.text #default-text');
    this.textReplace = page.locator('.text #promo-text-replace');
    this.textInsertAfterMarquee = page.locator('.text #marquee-promo-text-insert');
    this.textInsertBeforeText = page.locator('.text #text-promo-text-insert');
    this.textInsertFuture = page.locator('.text #future-promo-text-insert');
    this.textInsertBeforeCommon = page.locator('.text #common-promo');
    this.textInsertBeforeCommonDE = page.locator('.text #german-promo');
    this.textInsertBeforeCommonFR = page.locator('.text #french-promo');
    this.mepMenuOpen = page.locator('.mep-open');
    this.mepPreviewButton = page.locator('//a[contains(text(),"Preview")]');
    this.mepManifestList = page.locator('.mep-manifest-list');
    this.mepSelectInsert = page.locator('select').nth(0);
    this.mepSelectReplace = page.locator('select').nth(1);
  }
}
