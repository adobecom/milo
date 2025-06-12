import { expect } from '@esm-bundle/chai';
// import { getConfig } from '../../../libs/utils/utils.js';
import { checkForPreviousPageMatch } from '../../../libs/features/personalization/personalization.js';

describe('checkForPreviousPageMatch function', () => {
  const refUrls = {
    productPagePhotoshop: 'https://www.adobe.com/products/photoshop.html',
    productPageWithParam: 'https://www.adobe.com/products/photoshop.html?test=123',
    productInPath: 'https://www.adobe.com/products/photoshop/features.html',
    productPageAcrobat: 'https://www.adobe.com/acrobat.html',
    aemPage: 'https://main--bacom--adobecom.aem.page/products/acrobat-ai-assistant',
    domainOnly: 'https://www.adobe.com/',
    blankReferrer: '',
  };
  it('previousPage- is direct match', async () => {
    const globMatchCheck = checkForPreviousPageMatch('previousPage-/products/photoshop', refUrls.productPagePhotoshop);
    expect(globMatchCheck).to.be.true;
  });
  it('previousPage- is homepage path "/"', async () => {
    const globMatchCheck = checkForPreviousPageMatch('previousPage-/', refUrls.domainOnly);
    expect(globMatchCheck).to.be.true;
  });
  it('previousPage- starts with glob', async () => {
    const globMatchCheck = checkForPreviousPageMatch('previousPage-**/photoshop', refUrls.productPagePhotoshop);
    expect(globMatchCheck).to.be.true;
  });
  it('previousPage- ends with glob', async () => {
    const globMatchCheck = checkForPreviousPageMatch('previousPage-/products/photoshop**', refUrls.productInPath);
    expect(globMatchCheck).to.be.true;
  });
  it('previousPage- any referrer with /photoshop - including folder', async () => {
    const globMatchCheck = checkForPreviousPageMatch('previousPage-**/photoshop**', refUrls.productInPath);
    expect(globMatchCheck).to.be.true;
  });
  // preview vs prod extension
  it('previousPage- path has .html extension', async () => {
    const globMatchCheck = checkForPreviousPageMatch('previousPage-/products/photoshop.html', refUrls.productPagePhotoshop);
    expect(globMatchCheck).to.be.true;
  });
  it('previousPage- path does not have extension extension', async () => {
    const globMatchCheck = checkForPreviousPageMatch('previousPage-/products/acrobat-ai-assistant', refUrls.aemPage);
    expect(globMatchCheck).to.be.true;
  });
  // expected false cases
  it('referrer is domain only and previousPage- is not /', async () => {
    const globMatchCheck = checkForPreviousPageMatch('previousPage-/products/photoshop', refUrls.domainOnly);
    expect(globMatchCheck).to.be.false;
  });
  it('no referrer available', async () => {
    const globMatchCheck = checkForPreviousPageMatch('previousPage-/products/photoshop', refUrls.blankReferrer);
    expect(globMatchCheck).to.be.false;
  });
});
