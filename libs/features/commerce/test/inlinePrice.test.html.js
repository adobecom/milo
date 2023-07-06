import { expect, use } from '@esm-bundle/chai';
import chaiAsPromised from '@esm-bundle/chai-as-promised';

use(chaiAsPromised);

import Log from '../log.js';
import { setConfig } from '../../../utils/utils.js';
import snapshots from './mocks/snapshots.js';
import { mockWcs, unmockWcs } from './mocks/wcs.js';

function addInlinePrice(osi, dataset = {}) {
  const span = document.createElement('span', {
    is: 'inline-price',
  });
  Object.assign(span.dataset, { wcsOsi: osi, ...dataset });
  document.body.append(span, document.createElement('br'));
  return span;
}

function html(str) {
  return str.trim()
    .replace(/>\s*</g, '><')
    .replace(/>\s*/g, '>')
    .replace(/\s*</g, '<')
    .replace(/"\s*>/g, '">')
    .replace(/"\s*\/>/g, '/>')
    .replace(/\s+/g, ' ');
}

describe('HTMLInlinePriceElement', () => {
  let HTMLInlinePriceElement;
  let Placeholder;
  let commerce;

  after(() => {
    unmockWcs();
  });

  before(async () => {
    Log.use(Log.quietFilter);
    await mockWcs();
    const { init } = (await import('../service.js')).default;
    commerce = await init(() => setConfig({ env: { name: 'local' } }));
    ({ HTMLInlinePriceElement } = await import('../inlinePrice.js'));
    Placeholder = (await import('../placeholder.js')).default;
  });

  beforeEach(async () => {
    // document.body.innerHTML = '';
  });

  it('renders inline price', async () => {
    const inlinePrice = addInlinePrice('puf-mult');
    await inlinePrice.onceResolved();
    expect(html(inlinePrice.innerHTML)).to.equal(html(snapshots.price));
  });

  it('renders strikethrough inline price', async () => {
    const inlinePrice = addInlinePrice('puf-mult');
    Object.assign(inlinePrice.dataset, { template: 'strikethrough' });
    await inlinePrice.onceResolved();
    expect(html(inlinePrice.innerHTML)).to.equal(html(snapshots.strikethrough));
  });

  it('renders optical inline price', async () => {
    const inlinePrice = addInlinePrice('puf-mult');
    Object.assign(inlinePrice.dataset, {
      template: 'optical',
      displayPerUnit: true,
      displayTax: true,
    });
    await inlinePrice.onceResolved();
    expect(html(inlinePrice.innerHTML)).to.equal(html(snapshots.optical));
  });

  it('render inline price with promo with strikethrough', async () => {
    const inlinePrice = addInlinePrice('abm-promo-mult');
    inlinePrice.dataset.promotionCode = 'nicopromo';
    await inlinePrice.onceResolved();
    expect(html(inlinePrice.innerHTML)).to.equal(html(snapshots.promoStikethrough));
  });

  it('render inline price with promo', async () => {
    const inlinePrice = addInlinePrice('abm-promo-mult');
    inlinePrice.dataset.promotionCode = 'nicopromo';
    inlinePrice.dataset.displayOldPrice = false;
    await inlinePrice.onceResolved();
    expect(html(inlinePrice.innerHTML)).to.equal(html(snapshots.promo));
  });

  it('render price with with offer data', async () => {
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
    Placeholder('span', 'inline-offer', HTMLInlineOfferElement);
    const inlineOffer = document.createElement('span', {
      is: 'inline-offer',
    });
    Object.assign(inlineOffer.dataset, { wcsOsi: 'abm-mult' });
    document.body.appendChild(inlineOffer);
    await inlineOffer.onceResolved();
    expect(inlineOffer.textContent).equal(
      'US$54.99/mo - ccsn_direct_individual - YEAR - MONTHLY - INDIVIDUAL - BASE - REGULAR'
    );
  });

  it('override price literals', async () => {
    const disposer = commerce.providers.price(
      (element, options) => {
        options.literals.recurrenceLabel = 'every month';
      }
    );
    const inlinePrice = addInlinePrice('abm-mult');
    await inlinePrice.onceResolved();
    expect(html(inlinePrice.innerHTML)).to.equal(html(snapshots.customLiterals));
    disposer();
    inlinePrice.dataset.wcsOsi = 'puf-mult'; // to force a re-render
    await inlinePrice.onceResolved();
    expect(html(inlinePrice.innerHTML)).to.equal(html(snapshots.price));
  });

  it('failure to render inline price', async () => {
    const inlinePrice = addInlinePrice('xyz');
    inlinePrice.innerHTML = 'test';
    await expect(inlinePrice.onceResolved()).to.eventually.be.rejectedWith(
      'Bad WCS request'
    );
    expect(inlinePrice.innerHTML).to.be.empty;
  });

  it('no offer to render', async () => {
    const inlinePrice = addInlinePrice('no-offer-mult');
    await expect(inlinePrice.onceResolved()).to.eventually.be.rejectedWith(
      'Offer not found'
    );
    expect(inlinePrice.innerHTML).to.equal('');
  });

  it('perpetual offers', async () => {
    const inlinePrice = addInlinePrice('perpetual-en', {
      perpetual: true,
    });
    await inlinePrice.onceResolved();
    // expect(inlinePrice.innerHTML).to.be.empty;
    expect(window.fetch.lastCall.args[0]).to.contain('language=EN');
    // no more perpetual offer
    inlinePrice.dataset.perpetual = 'false';
    await inlinePrice.onceResolved();
    expect(window.fetch.lastCall.args[0]).to.contain('language=MULT');
  });

  it('offer tax exclusive prices', async () => {
    commerce.settings.wcsForceTaxExclusive = true;
    const inlinePrice = addInlinePrice('tax-exclusive-mult');
    inlinePrice.dataset.promotionCode = 'nicopromo';
    await inlinePrice.onceResolved();
    commerce.settings.wcsForceTaxExclusive = false;
    expect(html(inlinePrice.innerHTML)).to.equal(html(snapshots.taxExclusive));
  });
});
