import sinon from 'sinon';
import { expect } from '@esm-bundle/chai';

import init, {
  buildClearButton,
  decorateOfferDetails,
  decorateSearch,
  filterOfferDetails,
  handleOfferSearch,
} from '../../../libs/blocks/commerce/commerce.js';

import { mockFetch, unmockFetch } from '../merch/mocks/fetch.js';

const offer = {
  offerType: 'BASE',
  offerId: '01A09572A72A7D7F848721DE4D3C73FA',
  productArrangementCode: 'creative_cloud_all_apps_with_2tb_cloud_services_individual',
  pricePoint: 'INDIV_CCES_COM_2TB',
  customerSegment: 'INDIVIDUAL',
  commitment: 'YEAR',
  term: 'MONTHLY',
  offerSelectorIds: 'Mutn1LYoGojkrcMdCLO7LQlx1FyTHw27ETsfLv0h8DQ',
  priceDetails: {
    price: 10,
    formatString: "'$'0.00",
  },
};

describe('Merch Block', () => {
  after(() => {
    unmockFetch();
  });

  before(async () => {
    await mockFetch();
  });

  describe('filterOfferDetails', () => {
    it('formats offer details correctly', () => {
      const formattedOffer = filterOfferDetails(offer);
      expect(formattedOffer.offerType).to.equal('BASE');
      expect(formattedOffer.offerId).to.equal('01A09572A72A7D7F848721DE4D3C73FA');
      expect(formattedOffer.productArrangementCode).to.equal('creative_cloud_all_apps_with_2tb_cloud_services_individual');
      expect(formattedOffer.pricePoint).to.equal('INDIV_CCES_COM_2TB');
      expect(formattedOffer.customerSegment).to.equal('INDIVIDUAL');
      expect(formattedOffer.commitment).to.equal('YEAR');
      expect(formattedOffer.term).to.equal('MONTHLY');
      expect(formattedOffer.offerSelectorIds).to.equal('Mutn1LYoGojkrcMdCLO7LQlx1FyTHw27ETsfLv0h8DQ');
      expect(formattedOffer.price).to.equal('$10');
    });
  });

  describe('decorateOfferDetails', () => {
    it('decorates offer details correctly', async () => {
      const el = document.createElement('div');
      decorateSearch(el);
      document.body.append(el);
      const searchParams = new URLSearchParams('osi=01A09572A72A7D7F848721DE4D3C73FA&perp=false&type=checkoutUrl&text=buy-now&promo=1234');
      await decorateOfferDetails(el, offer, searchParams);
      const offerDetailsList = el.querySelector('.offer-details');
      expect(offerDetailsList).to.exist;
      expect(offerDetailsList.children[0].textContent).to.equal('OFFER TYPE: BASE');
      expect(offerDetailsList.children[1].textContent).to.equal('OFFER ID: 01A09572A72A7D7F848721DE4D3C73FA');
      expect(offerDetailsList.children[2].textContent).to.equal('PRODUCT ARRANGEMENT CODE: creative_cloud_all_apps_with_2tb_cloud_services_individual');
      expect(offerDetailsList.children[3].textContent).to.equal('PRICE POINT: INDIV_CCES_COM_2TB');
      expect(offerDetailsList.children[4].textContent).to.equal('CUSTOMER SEGMENT: INDIVIDUAL');
      expect(offerDetailsList.children[5].textContent).to.equal('COMMITMENT: YEAR');
      expect(offerDetailsList.children[6].textContent).to.equal('TERM: MONTHLY');
      expect(offerDetailsList.children[7].textContent).to.equal('OSI: Mutn1LYoGojkrcMdCLO7LQlx1FyTHw27ETsfLv0h8DQ');
      expect(offerDetailsList.children[8].textContent).to.equal('PRICE: $10');
      expect(offerDetailsList.children[9].textContent).to.equal('TYPE: checkoutUrl');
      expect(offerDetailsList.children[10].textContent).to.equal('CTA: buy-now');
      expect(offerDetailsList.children[11].textContent).to.equal('PROMO: 1234');
      expect(offerDetailsList.children[12].textContent).to.equal('Clear');
      expect(offerDetailsList.children[13].textContent).to.equal('Checkout link');
    });
  });

  describe('decorateSearch', () => {
    it('decorates search input correctly', () => {
      const el = document.createElement('div');
      decorateSearch(el);
      const searchWrapper = el.querySelector('.offer-search-wrapper');
      const offerDetailsWrapper = el.querySelector('.offer-details-wrapper');
      expect(searchWrapper).to.exist;
      expect(offerDetailsWrapper).to.exist;
      const input = searchWrapper.querySelector('.offer-search');
      expect(input).to.exist;
      expect(input.getAttribute('placeholder')).to.equal('Enter offer URL to preview');
    });

    it('performs search on keyup, shows "not valid link" message', async () => {
      const clock = sinon.useFakeTimers({
        toFake: ['setTimeout'],
        shouldAdvanceTime: true,
      });
      const el = document.createElement('div');
      await init(el);
      const searchWrapper = el.querySelector('.offer-search-wrapper');
      const input = searchWrapper.querySelector('.offer-search');
      const e = new KeyboardEvent('keyup', { bubbles: false, cancelable: true, key: ':', shiftKey: false });
      Object.defineProperty(e, 'target', { value: { value: ':' } });
      input.dispatchEvent(e);
      let h4 = el.querySelector('h4');
      expect(h4).to.equal(null);
      clock.tick(500);
      h4 = el.querySelector('h4');
      expect(h4).to.not.equal(null);
      expect(h4.classList.contains('not-valid-url')).to.be.true;
      clock.restore();
    });
  });

  describe('handleSearch', () => {
    it('resolves searched offer and render its info', async () => {
      const el = document.createElement('div');
      const ev = { target: { value: '/tools/ost?osi=0' } };
      document.body.append(el);
      await handleOfferSearch(ev, el);
      expect(el.querySelector('.offer-detail')).to.be.not.null;
    });
  });

  describe('clearButton', () => {
    it('should create a button with correct attributes and textContent', () => {
      const button = buildClearButton();
      expect(button.type).to.equal('button');
      expect(button.className).to.equal('con-button');
      expect(button.textContent).to.equal('Clear');
    });

    it('should clear offer details when press clear button', async () => {
      const el = document.createElement('div');
      const searchParams = new URLSearchParams('osi=01A09572A72A7D7F848721DE4D3C73FA&perp=false&type=checkoutUrl&text=buy-now&promo=1234');
      await decorateOfferDetails(el, offer, searchParams);
      const offerDetailsList = el.querySelector('.offer-details');
      expect(offerDetailsList).to.exist;

      const clickEvent = new MouseEvent('click');
      const buttons = Array.from(el.querySelectorAll('.con-button'));
      const clearButton = buttons.find((button) => button.textContent.trim() === 'Clear');

      clearButton.dispatchEvent(clickEvent);

      expect(offerDetailsList.textContent).to.equal('');
    });
  });
});
