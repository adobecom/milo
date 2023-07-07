import { MiloEnv } from '../deps.js';
import Log from '../log.js';
import { mockFetch, unmockFetch } from './mocks/fetch.js';
import snapshots from './mocks/snapshots.js';
import { expect } from './utils.js';
import { setConfig } from '../../../utils/utils.js';

/**
 * @param {string} wcsOsi 
 * @param {Record<string, any>} dataset
 * @returns {Commerce.HTMLInlinePriceElement}
 */
function appendInlinePrice(wcsOsi, dataset = {}) {
  const span = document.createElement('span', {
    is: 'inline-price',
  });
  Object.assign(span.dataset, { wcsOsi, ...dataset });
  document.body.append(span, document.createElement('br'));
  // @ts-ignore
  return span;
}

describe('HTMLInlinePriceElement', () => {
  /** @type {Commerce.Instance} */
  let commerce;
  /** @type {import('sinon').SinonStub} */
  let fetch;

  after(() => {
    unmockFetch();
  });

  before(async () => {
    Log.use(Log.quietFilter);
    fetch = await mockFetch();
    const { init } = await import('../service.js');
    commerce = await init(() => setConfig({ env: { name: MiloEnv.PROD } }));
    await import('../inlinePrice.js');
  });

  beforeEach(async () => {
    // document.body.innerHTML = '';
  });

  it('renders price', async () => {
    const inlinePrice = appendInlinePrice('puf');
    await inlinePrice.onceResolved();
    expect(inlinePrice.innerHTML).to.be.html(snapshots.price);
  });

  it('renders strikethrough price', async () => {
    const inlinePrice = appendInlinePrice('puf');
    Object.assign(inlinePrice.dataset, { template: 'strikethrough' });
    await inlinePrice.onceResolved();
    expect(inlinePrice.innerHTML).to.be.html(snapshots.strikethrough);
  });

  it('renders optical price', async () => {
    const inlinePrice = appendInlinePrice('puf');
    Object.assign(inlinePrice.dataset, {
      template: 'optical',
      displayPerUnit: true,
      displayTax: true,
    });
    await inlinePrice.onceResolved();
    expect(inlinePrice.innerHTML).to.be.html(snapshots.optical);
  });

  it('renders price with promo with strikethrough', async () => {
    const inlinePrice = appendInlinePrice('abm-promo');
    inlinePrice.dataset.promotionCode = 'nicopromo';
    await inlinePrice.onceResolved();
    expect(inlinePrice.innerHTML).to.be.html(snapshots.promoStikethrough);
  });

  it('renders price with promo', async () => {
    const inlinePrice = appendInlinePrice('abm-promo');
    inlinePrice.dataset.promotionCode = 'nicopromo';
    inlinePrice.dataset.displayOldPrice = 'false';
    await inlinePrice.onceResolved();
    expect(inlinePrice.innerHTML).to.be.html(snapshots.promo);
  });

  it('renders with with offer data', async () => {
    const HTMLInlinePriceElement = (await import('../inlinePrice.js')).default;
    const HTMLPlaceholderMixin = (await import('../placeholder.js')).default;
    class HTMLInlineOfferElement extends HTMLInlinePriceElement {
      renderOffer(offer, options) {
        super.renderOffer(offer, {
          ...options,
          displayFormatted: false,
        });
        const {
          productArrangementCode,
          commitment,
          term,
          customerSegment,
          offerType,
          pricePoint,
        } = offer;
        const props = [
          productArrangementCode,
          commitment,
          term,
          customerSegment,
          offerType,
          pricePoint,
        ].join(' - ');
        this.textContent = `${this.textContent} - ${props}`;
      }
    }
    HTMLPlaceholderMixin('span', 'inline-offer', HTMLInlineOfferElement);
    /** @type {Commerce.HTMLInlinePriceElement} */
    // @ts-ignore
    const inlineOffer = document.createElement('span', {
      is: 'inline-offer',
    });
    Object.assign(inlineOffer.dataset, { wcsOsi: 'abm' });
    document.body.appendChild(inlineOffer);
    await inlineOffer.onceResolved();
    expect(inlineOffer.textContent).equal(
      'US$54.99/mo - ccsn_direct_individual - YEAR - MONTHLY - INDIVIDUAL - BASE - REGULAR'
    );
  });

  it('overrides price literals', async () => {
    const disposer = commerce.providers.price(
      (element, options) => {
        options.literals.recurrenceLabel = 'every month';
      }
    );
    const inlinePrice = appendInlinePrice('abm');
    await inlinePrice.onceResolved();
    expect(inlinePrice.innerHTML).to.be.html(snapshots.customLiterals);
    disposer();
    inlinePrice.dataset.wcsOsi = 'puf'; // to force a re-render
    await inlinePrice.onceResolved();
    expect(inlinePrice.innerHTML).to.be.html(snapshots.price);
  });

  it('does not render failed price', async () => {
    const inlinePrice = appendInlinePrice('xyz');
    inlinePrice.innerHTML = 'test';
    await expect(inlinePrice.onceResolved()).to.be.eventually.rejectedWith(
      'Bad WCS request'
    );
    expect(inlinePrice.innerHTML).to.be.empty;
  });

  it('does not render missing offer', async () => {
    const inlinePrice = appendInlinePrice('no-offer');
    await expect(inlinePrice.onceResolved()).to.be.eventually.rejectedWith(
      'Offer not found'
    );
    expect(inlinePrice.innerHTML).to.equal('');
  });

  it.only('renders perpetual offer', async () => {
    const inlinePrice = appendInlinePrice('perpetual', {
      perpetual: true,
    });
    await inlinePrice.onceResolved();
    // expect(inlinePrice.innerHTML).to.be.empty;
    expect(fetch.lastCall.args[0]).to.contain('language=EN');
    // no more perpetual offer
    inlinePrice.dataset.perpetual = 'false';
    await expect(inlinePrice.onceResolved()).to.be.eventually.rejectedWith(
      'Offer not found'
    );
    expect(fetch.lastCall.args[0]).to.contain('language=MULT');
  });

  it('renders tax exclusive price', async () => {
    commerce.settings.wcsForceTaxExclusive = true;
    const inlinePrice = appendInlinePrice('tax-exclusive');
    inlinePrice.dataset.promotionCode = 'nicopromo';
    await inlinePrice.onceResolved();
    commerce.settings.wcsForceTaxExclusive = false;
    expect(inlinePrice.innerHTML).to.be.html(snapshots.taxExclusive);
    expect('').to.match
  });
});
