import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import {
  isMasUrl,
  getFragmentIdFromMasElement,
  formatDate,
  selectOffers,
  isPromotionActive,
  checkUrl,
  checkMasFieldsMultipleFragments,
} from '../../../../libs/blocks/preflight/panels/merch.js';

describe('preflight panels merch', () => {
  describe('isMasUrl', () => {
    it('recognizes mas.adobe.com URLs', () => {
      expect(isMasUrl('https://mas.adobe.com/studio.html')).to.be.true;
    });
    it('rejects other hosts and invalid input', () => {
      expect(isMasUrl('https://example.com')).to.be.false;
      expect(isMasUrl('')).to.be.false;
      expect(isMasUrl('not a url')).to.be.false;
    });
  });

  describe('getFragmentIdFromMasElement', () => {
    it('reads the fragment attribute from a mas-field', () => {
      const field = document.createElement('mas-field');
      field.innerHTML = '<aem-fragment fragment="frag-123"></aem-fragment>';
      expect(getFragmentIdFromMasElement(field)).to.equal('frag-123');
    });
    it('returns null for a mas-field without an aem-fragment', () => {
      expect(getFragmentIdFromMasElement(document.createElement('mas-field'))).to.be.null;
    });
    it('reads query/fragment params from a mas anchor hash', () => {
      const a = document.createElement('a');
      a.href = 'https://mas.adobe.com/studio.html#query=abc';
      expect(getFragmentIdFromMasElement(a)).to.equal('abc');
      a.href = 'https://mas.adobe.com/studio.html#fragment=def';
      expect(getFragmentIdFromMasElement(a)).to.equal('def');
    });
    it('returns null for non-mas anchors and other elements', () => {
      const a = document.createElement('a');
      a.href = 'https://example.com/#query=abc';
      expect(getFragmentIdFromMasElement(a)).to.be.null;
      expect(getFragmentIdFromMasElement(document.createElement('div'))).to.be.null;
    });
  });

  describe('formatDate', () => {
    it('returns an empty string for falsy input', () => {
      expect(formatDate('')).to.equal('');
    });
    it('formats an ISO date into a localized string', () => {
      expect(formatDate('2024-01-15T10:00:00Z')).to.contain('2024');
    });
  });

  describe('selectOffers', () => {
    it('returns the offers as-is when there are fewer than two', () => {
      const offers = [{ id: 'only' }];
      expect(selectOffers(offers, { country: 'US' })).to.deep.equal([{ id: 'only' }]);
    });
    it('prefers the MULT language, term-less offer outside GB', () => {
      const offers = [{ id: 'a', language: 'EN', term: 'ABM' }, { id: 'b', language: 'MULT' }];
      const [selected] = selectOffers(offers, { country: 'US' });
      expect(selected.id).to.equal('b');
    });
    it('prefers the EN offer in GB', () => {
      const offers = [{ id: 'a', language: 'MULT', term: 'ABM' }, { id: 'b', language: 'EN' }];
      const [selected] = selectOffers(offers, { country: 'GB' });
      expect(selected.id).to.equal('b');
    });
  });

  describe('isPromotionActive', () => {
    const promo = {
      start: '2020-01-01',
      end: '2020-12-31',
      displaySummary: { amount: 10, duration: 12, outcomeType: 'PERCENT_OFF', minProductQuantity: 1 },
    };
    it('is false without a promotion', () => {
      expect(isPromotionActive(null)).to.be.false;
    });
    it('is false when the display summary is incomplete', () => {
      const incomplete = { start: '2020-01-01', end: '2020-12-31', displaySummary: { amount: 5 } };
      expect(isPromotionActive(incomplete)).to.be.false;
    });
    it('is false when start or end are missing', () => {
      const noDates = { displaySummary: { amount: 10, duration: 12, outcomeType: 'PERCENT_OFF' } };
      expect(isPromotionActive(noDates, '2020-06-01')).to.be.false;
    });
    it('is false below the minimum product quantity', () => {
      const ds = { ...promo.displaySummary, minProductQuantity: 5 };
      const gated = { ...promo, displaySummary: ds };
      expect(isPromotionActive(gated, '2020-06-01', 1)).to.be.false;
    });
    it('is true within the active window', () => {
      expect(isPromotionActive(promo, '2020-06-01')).to.be.true;
    });
    it('is false once expired', () => {
      expect(isPromotionActive(promo, '2021-06-01')).to.be.false;
    });
  });

  describe('checkUrl', () => {
    afterEach(() => sinon.restore());

    it('returns success for a clean redirect', async () => {
      sinon.stub(window, 'fetch').resolves({ url: 'https://commerce.adobe.com/checkout?items[0][id]=A' });
      const res = await checkUrl('https://commerce.adobe.com/checkout?items[0][id]=A');
      expect(res.status).to.equal('success');
      expect(res.idMismatch).to.be.false;
    });
    it('flags an error when the final URL contains "error"', async () => {
      sinon.stub(window, 'fetch').resolves({ url: 'https://commerce.adobe.com/error' });
      expect((await checkUrl('https://commerce.adobe.com/checkout')).status).to.equal('error');
    });
    it('flags an offer id mismatch as an error', async () => {
      sinon.stub(window, 'fetch').resolves({ url: 'https://commerce.adobe.com/checkout?items[0][id]=B' });
      const res = await checkUrl('https://commerce.adobe.com/checkout?items[0][id]=A');
      expect(res.status).to.equal('error');
      expect(res.idMismatch).to.be.true;
    });
    it('treats a failed fetch as success (CORS opaque)', async () => {
      sinon.stub(window, 'fetch').rejects(new Error('Failed to fetch'));
      expect((await checkUrl('https://commerce.adobe.com/checkout')).status).to.equal('success');
    });
    it('returns undetermined for other errors', async () => {
      sinon.stub(window, 'fetch').rejects(new Error('boom'));
      const res = await checkUrl('https://commerce.adobe.com/checkout');
      expect(res.status).to.equal('undetermined');
      expect(res.errorMessage).to.equal('boom');
    });
  });

  describe('checkMasFieldsMultipleFragments', () => {
    let main;
    afterEach(() => main?.remove());

    it('highlights a block that references multiple fragments in one section', () => {
      main = document.createElement('main');
      main.innerHTML = `
        <div class="section">
          <div class="con-block">
            <mas-field><aem-fragment fragment="id-1"></aem-fragment></mas-field>
            <mas-field><aem-fragment fragment="id-2"></aem-fragment></mas-field>
          </div>
        </div>`;
      document.body.append(main);
      checkMasFieldsMultipleFragments();
      expect(main.querySelector('.con-block').classList.contains('preflight-mas-multiple-fragments')).to.be.true;
    });

    it('does not highlight a section with a single fragment', () => {
      main = document.createElement('main');
      main.innerHTML = `
        <div class="section">
          <div class="con-block">
            <mas-field><aem-fragment fragment="id-1"></aem-fragment></mas-field>
          </div>
        </div>`;
      document.body.append(main);
      checkMasFieldsMultipleFragments();
      expect(main.querySelector('.preflight-mas-multiple-fragments')).to.be.null;
    });
  });
});
