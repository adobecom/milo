import { CheckoutWorkflowStep } from '../src/deps.js';
import Log from '../src/log.js';
import { WcsErrorMessage } from '../src/wcs.js';

import { mockFetch, unmockFetch } from './mocks/fetch.js';
import { mockLana, unmockLana } from './mocks/lana.js';
import { delay, expect } from './utils.js';

/**
 * @param {string} wcsOsi
 * @param {Record<string, any>} dataset
 * @returns {Commerce.HTMLCheckoutLinkElement}
 */
const appendCheckoutLink = (wcsOsi, dataset = {}) => {
  const checkoutLink = document.createElement('a', { is: 'checkout-link' });
  Object.assign(checkoutLink.dataset, { wcsOsi, ...dataset });
  document.body.appendChild(checkoutLink);
  // @ts-ignore
  return checkoutLink;
};

describe('HTMLCheckoutLinkElement', () => {
  /** @type {Commerce.Instance} */
  let commerce;
  /** @type {import('sinon').SinonStub} */
  let fetch;

  after(() => {
    unmockFetch();
    unmockLana();
  });

  before(async () => {
    mockLana();
    fetch = await mockFetch();
    const { init } = await import('../src/service.js');
    commerce = await init();
    Log.reset();
    // replace `quietFilter` with `consoleAppender` to enable logs in tests
    // to see debug logs in chrome devtools console, set verbose level
    // eslint-disable-next-line import/no-named-as-default-member
    Log.use(Log.quietFilter);
    await import('../src/checkoutLink.js');
  });

  it('renders link', async () => {
    const checkoutLink = appendCheckoutLink('abm');
    await checkoutLink.onceSettled();
    expect(checkoutLink.href).to.equal(
      'https://commerce.adobe.com/store/email?items%5B0%5D%5Bid%5D=632B3ADD940A7FBB7864AA5AD19B8D28&cli=adobe_com&ctx=fp&co=US&lang=en',
    );
  });

  it('renders link with workflow step from settings', async () => {
    commerce.settings.checkoutWorkflowStep = CheckoutWorkflowStep.SEGMENTATION;
    const checkoutLink = appendCheckoutLink('abm');
    await checkoutLink.onceSettled();
    expect(checkoutLink.href).to.equal(
      'https://commerce.adobe.com/store/segmentation?ms=COM&ot=BASE&pa=ccsn_direct_individual&cli=adobe_com&ctx=fp&co=US&lang=en',
    );
    commerce.settings.checkoutWorkflowStep = commerce.defaults.checkoutWorkflowStep;
  });

  it('renders link with workflow step from dataset', async () => {
    const checkoutLink = appendCheckoutLink('abm', { checkoutWorkflowStep: CheckoutWorkflowStep.SEGMENTATION });
    await checkoutLink.onceSettled();
    expect(checkoutLink.href).to.equal(
      'https://commerce.adobe.com/store/segmentation?ms=COM&ot=BASE&pa=ccsn_direct_individual&cli=adobe_com&ctx=fp&co=US&lang=en',
    );
  });

  it('renders link with ims country from dataset', async () => {
    const checkoutLink = appendCheckoutLink('abm', { imsCountry: 'CH' });
    await checkoutLink.onceSettled();
    expect(checkoutLink.href).to.equal(
      'https://commerce.adobe.com/store/email?items%5B0%5D%5Bid%5D=632B3ADD940A7FBB7864AA5AD19B8D28&cli=adobe_com&ctx=fp&co=CH&lang=en',
    );
  });

  it('renders link with promo from dataset', async () => {
    const checkoutLink = appendCheckoutLink('abm-promo', { promotionCode: 'nicopromo' });
    await checkoutLink.onceSettled();
    expect(checkoutLink.href).to.equal(
      'https://commerce.adobe.com/store/email?items%5B0%5D%5Bid%5D=632B3ADD940A7FBB7864AA5AD19B8D28&cli=adobe_com&ctx=fp&co=US&lang=en&apc=nicopromo',
    );
    checkoutLink.dataset.promotionCode = 'testpromo';
    await checkoutLink.onceSettled();
    expect(checkoutLink.href).to.equal(
      'https://commerce.adobe.com/store/email?items%5B0%5D%5Bid%5D=632B3ADD940A7FBB7864AA5AD19B8D28&cli=adobe_com&ctx=fp&co=US&lang=en&apc=testpromo',
    );
  });

  it('renders multiple checkout links', async () => {
    const abm = appendCheckoutLink('abm');
    const puf = appendCheckoutLink('puf');
    const m2m = appendCheckoutLink('m2m');
    await Promise.all([
      abm.onceSettled(),
      puf.onceSettled(),
      m2m.onceSettled(),
    ]);
    expect([abm.href, puf.href, m2m.href]).to.deep.equal([
      'https://commerce.adobe.com/store/email?items%5B0%5D%5Bid%5D=632B3ADD940A7FBB7864AA5AD19B8D28&cli=adobe_com&ctx=fp&co=US&lang=en',
      'https://commerce.adobe.com/store/email?items%5B0%5D%5Bid%5D=9E618D5A589EF8D6364DFBE02FC2C264&cli=adobe_com&ctx=fp&co=US&lang=en',
      'https://commerce.adobe.com/store/email?items%5B0%5D%5Bid%5D=257E1D82082387D152029F93C1030624&cli=adobe_com&ctx=fp&co=US&lang=en',
    ]);
  });

  it('render link with multiple OSIs', async () => {
    const checkoutLink = appendCheckoutLink('abm,stock-abm', { quantity: '2,2' });
    await checkoutLink.onceSettled();
    expect(checkoutLink.href).to.equal(
      'https://commerce.adobe.com/store/email?items%5B0%5D%5Bid%5D=632B3ADD940A7FBB7864AA5AD19B8D28&items%5B0%5D%5Bq%5D=2&items%5B1%5D%5Bid%5D=7164A328080BC96CC60FEBF33F64342D&items%5B1%5D%5Bq%5D=2&cli=adobe_com&ctx=fp&co=US&lang=en',
    );
  });

  it('fails with missing offer', async () => {
    const checkoutLink = appendCheckoutLink('no-offer');
    await expect(checkoutLink.onceSettled()).eventually.be.rejectedWith(WcsErrorMessage.notFound);
  });

  it('fails with bad request', async () => {
    const checkoutLink = appendCheckoutLink('xyz');
    await expect(checkoutLink.onceSettled()).eventually.be.rejectedWith(WcsErrorMessage.badRequest);
  });

  it('renders link for perpetual offers', async () => {
    const checkoutLink = appendCheckoutLink('perpetual', { perpetual: 'true' });
    await checkoutLink.onceSettled();
    expect(checkoutLink.href).to.equal(
      'https://commerce.adobe.com/store/email?items%5B0%5D%5Bid%5D=C5AC20C8AAF4892B67DE2E89B26D8ACA&cli=adobe_com&ctx=fp&co=US&lang=en',
    );
    expect(fetch.lastCall.args[0]).to.contain('language=EN');

    // no more perpetual offer
    checkoutLink.dataset.perpetual = 'false';
    await delay();
    const promise = checkoutLink.onceSettled();
    await expect(promise).eventually.be.rejectedWith(WcsErrorMessage.notFound);
    expect(fetch.lastCall.args[0]).to.contain('language=MULT');
  });
});
