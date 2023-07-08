import { CheckoutWorkflowStep, MiloEnv } from '../deps.js';
import Log from '../log.js';
import { mockFetch, unmockFetch } from './mocks/fetch.js';
import { mockLana, unmockLana } from './mocks/lana.js';
import { delay, expect } from './utils.js';
// @ts-ignore
import { setConfig } from '../../../utils/utils.js';
import { WcsErrorMessage } from '../wcs.js';

/**
 * @param {string} wcsOsi 
 * @param {Record<string, any>} dataset
 * @returns {Commerce.HTMLCheckoutLinkElement}
 */
const appendCheckoutLink = (wcsOsi, dataset = {}) => {
  const checkoutLink = document.createElement('a', {
    is: 'checkout-link',
  });
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
    const { init } = await import('../service.js');
    commerce = await init(() => setConfig({ env: { name: MiloEnv.PROD } }));
    Log.reset();
    Log.use(Log.quietFilter);
    await import('../checkoutLink.js');
  });

  it('renders link', async () => {
    const checkoutLink = appendCheckoutLink('abm');
    await checkoutLink.onceResolved();
    expect(checkoutLink.href).to.equal(
      'https://commerce.adobe.com/store/email?items%5B0%5D%5Bid%5D=632B3ADD940A7FBB7864AA5AD19B8D28&cli=adobe_com&ctx=fp&co=US&lang=en'
    );
  });

  it('renders link with workflow step from settings', async () => {
    commerce.settings.checkoutWorkflowStep = CheckoutWorkflowStep.SEGMENTATION;
    const checkoutLink = appendCheckoutLink('abm');
    await checkoutLink.onceResolved();
    expect(checkoutLink.href).to.equal(
      'https://commerce.adobe.com/store/segmentation?ms=COM&ot=BASE&pa=ccsn_direct_individual&cli=adobe_com&ctx=fp&co=US&lang=en'
    );
    commerce.settings.checkoutWorkflowStep = commerce.defaults.checkoutWorkflowStep;
  });

  it('renders link with workflow step from dataset', async () => {
    const checkoutLink = appendCheckoutLink('abm', {
      checkoutWorkflowStep: CheckoutWorkflowStep.SEGMENTATION
    });
    await checkoutLink.onceResolved();
    expect(checkoutLink.href).to.equal(
      'https://commerce.adobe.com/store/segmentation?ms=COM&ot=BASE&pa=ccsn_direct_individual&cli=adobe_com&ctx=fp&co=US&lang=en'
    );
  });

  it('renders link with ims country from dataset', async () => {
    const checkoutLink = appendCheckoutLink('abm', {
      imsCountry: 'CH'
    });
    await checkoutLink.onceResolved();
    expect(checkoutLink.href).to.equal(
      'https://commerce.adobe.com/store/email?items%5B0%5D%5Bid%5D=632B3ADD940A7FBB7864AA5AD19B8D28&cli=adobe_com&ctx=fp&co=CH&lang=en'
    );
  });

  it('renders link with promo from dataset', async () => {
    const checkoutLink = appendCheckoutLink('abm-promo', {
      promotionCode: 'nicopromo',
    });
    await checkoutLink.onceResolved();
    expect(checkoutLink.href).to.equal(
      'https://commerce.adobe.com/store/email?items%5B0%5D%5Bid%5D=632B3ADD940A7FBB7864AA5AD19B8D28&cli=adobe_com&ctx=fp&co=US&lang=en&apc=nicopromo'
    );
    checkoutLink.dataset.promotionCode = 'testpromo';
    await checkoutLink.onceResolved();
    expect(checkoutLink.href).to.equal(
      'https://commerce.adobe.com/store/email?items%5B0%5D%5Bid%5D=632B3ADD940A7FBB7864AA5AD19B8D28&cli=adobe_com&ctx=fp&co=US&lang=en&apc=testpromo'
    );
  });

  it('renders multiple checkout links', async () => {
    const abm = appendCheckoutLink('abm');
    const puf = appendCheckoutLink('puf');
    const m2m = appendCheckoutLink('m2m');
    await Promise.all([
      abm.onceResolved(),
      puf.onceResolved(),
      m2m.onceResolved(),
    ]);
    expect([abm.href, puf.href, m2m.href]).to.deep.equal([
      'https://commerce.adobe.com/store/email?items%5B0%5D%5Bid%5D=632B3ADD940A7FBB7864AA5AD19B8D28&cli=adobe_com&ctx=fp&co=US&lang=en',
      'https://commerce.adobe.com/store/email?items%5B0%5D%5Bid%5D=9E618D5A589EF8D6364DFBE02FC2C264&cli=adobe_com&ctx=fp&co=US&lang=en',
      'https://commerce.adobe.com/store/email?items%5B0%5D%5Bid%5D=257E1D82082387D152029F93C1030624&cli=adobe_com&ctx=fp&co=US&lang=en',
    ]);
  });

  it('render link with multiple OSIs', async () => {
    const checkoutLink = appendCheckoutLink('abm,stock-abm', {
      quantity: '2,2'
    });
    await checkoutLink.onceResolved();
    expect(checkoutLink.href).to.equal(
      'https://commerce.adobe.com/store/email?items%5B0%5D%5Bid%5D=632B3ADD940A7FBB7864AA5AD19B8D28&items%5B0%5D%5Bq%5D=2&items%5B1%5D%5Bid%5D=7164A328080BC96CC60FEBF33F64342D&items%5B1%5D%5Bq%5D=2&cli=adobe_com&ctx=fp&co=US&lang=en'
    );
  });

  it('fails with missing offer', async () => {
    const checkoutLink = appendCheckoutLink('no-offer');
    await expect(checkoutLink.onceResolved()).eventually.be.rejectedWith(
      'Offer not found'
    );
  });

  it('fails with bad request', async () => {
    const checkoutLink = appendCheckoutLink('xyz');
    await expect(checkoutLink.onceResolved()).eventually.be.rejectedWith(WcsErrorMessage.badRequest);
  });

  it('renders link for perpetual offers', async () => {
    const checkoutLink = appendCheckoutLink('perpetual', {
      perpetual: 'true',
    });
    await checkoutLink.onceResolved();
    expect(checkoutLink.href).to.equal(
      'https://commerce.adobe.com/store/email?items%5B0%5D%5Bid%5D=C5AC20C8AAF4892B67DE2E89B26D8ACA&cli=adobe_com&ctx=fp&co=US&lang=en'
    );
    expect(fetch.lastCall.args[0]).to.contain('language=EN');

    // no more perpetual offer
    checkoutLink.dataset.perpetual = 'false';
    await delay();
    const promise = checkoutLink.onceResolved();
    await expect(promise).eventually.be.rejectedWith(WcsErrorMessage.notFound);
    expect(fetch.lastCall.args[0]).to.contain('language=MULT');
  });
});
