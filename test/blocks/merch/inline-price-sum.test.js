import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { computeSummedOffer, createInlinePriceSum } from '../../../libs/blocks/merch/inline-price-sum.js';

describe('Inline Price Sum', () => {
  describe('computeSummedOffer', () => {
    it('throws error if no offers are provided', () => {
      expect(() => computeSummedOffer([])).to.throw('No offers to sum');
    });

    it('returns the single offer if only one is provided', () => {
      const offer = {
        price: 100,
        originalPrice: 150,
        priceWithoutDiscount: 150,
        priceWithoutTax: 90,
        priceDetails: {
          price: 100,
          originalPrice: 150,
          priceWithoutDiscount: 150,
          priceWithoutTax: 90,
        },
      };
      const result = computeSummedOffer([offer]);
      expect(result).to.deep.equal(offer);
    });

    it('sums prices from multiple offers', () => {
      const offers = [
        {
          price: 100,
          originalPrice: 150,
          priceWithoutDiscount: 150,
          priceWithoutTax: 90,
          priceDetails: {
            price: 100,
            originalPrice: 150,
            priceWithoutDiscount: 150,
            priceWithoutTax: 90,
          },
          term: 'ANNUAL',
          commitment: 'YEAR',
        },
        {
          price: 50,
          originalPrice: 75,
          priceWithoutDiscount: 75,
          priceWithoutTax: 45,
          priceDetails: {
            price: 50,
            originalPrice: 75,
            priceWithoutDiscount: 75,
            priceWithoutTax: 45,
          },
        },
      ];

      const result = computeSummedOffer(offers);
      expect(result.price).to.equal(150);
      expect(result.originalPrice).to.equal(225);
      expect(result.priceWithoutDiscount).to.equal(225);
      expect(result.priceWithoutTax).to.equal(135);
      expect(result.priceDetails.price).to.equal(150);
      expect(result.priceDetails.originalPrice).to.equal(225);
      expect(result.priceDetails.priceWithoutDiscount).to.equal(225);
      expect(result.priceDetails.priceWithoutTax).to.equal(135);
      expect(result.term).to.equal('ANNUAL');
      expect(result.commitment).to.equal('YEAR');
    });

    it('handles offers with missing priceDetails', () => {
      const offers = [
        {
          price: 100,
          originalPrice: 150,
          priceWithoutDiscount: 150,
          priceWithoutTax: 90,
        },
        {
          price: 50,
          originalPrice: 75,
          priceWithoutDiscount: 75,
          priceWithoutTax: 45,
        },
      ];

      const result = computeSummedOffer(offers);
      expect(result.price).to.equal(150);
      expect(result.originalPrice).to.equal(225);
      expect(result.priceWithoutDiscount).to.equal(225);
      expect(result.priceWithoutTax).to.equal(135);
    });

    it('handles offers with missing price properties', () => {
      const offers = [
        {
          priceDetails: {
            price: 100,
          },
        },
        {
          priceDetails: {
            price: 50,
          },
        },
      ];

      const result = computeSummedOffer(offers);
      expect(result.price).to.equal(150);
      expect(result.originalPrice).to.equal(0);
      expect(result.priceWithoutDiscount).to.equal(0);
      expect(result.priceWithoutTax).to.equal(0);
    });

    it('handles string prices and converts to numbers', () => {
      const offers = [
        {
          priceDetails: {
            price: '100.50',
            originalPrice: '150.75',
          },
        },
        {
          priceDetails: {
            price: '50.25',
            originalPrice: '75.50',
          },
        },
      ];

      const result = computeSummedOffer(offers);
      expect(result.price).to.equal(150.75);
      expect(result.originalPrice).to.equal(226.25);
    });

    it('preserves properties from the first offer', () => {
      const offers = [
        {
          price: 100,
          currency: 'USD',
          locale: 'en-US',
          customProperty: 'value1',
          priceDetails: {
            price: 100,
            currency: 'USD',
          },
        },
        {
          price: 50,
          currency: 'EUR',
          locale: 'de-DE',
          customProperty: 'value2',
          priceDetails: {
            price: 50,
          },
        },
      ];

      const result = computeSummedOffer(offers);
      expect(result.currency).to.equal('USD');
      expect(result.locale).to.equal('en-US');
      expect(result.customProperty).to.equal('value1');
    });
  });

  describe('createInlinePriceSum', () => {
    let mockService;
    let mockPriceElement;
    let clock;

    beforeEach(() => {
      // Create a clock for controlling time
      clock = sinon.useFakeTimers();

      // Create mock price element
      mockPriceElement = document.createElement('span');
      mockPriceElement.classList.add('price');
      mockPriceElement.isFailed = false;
      mockPriceElement.value = [{
        price: 100,
        originalPrice: 150,
        priceWithoutDiscount: 150,
        priceWithoutTax: 90,
        priceDetails: {
          price: 100,
          originalPrice: 150,
          priceWithoutDiscount: 150,
          priceWithoutTax: 90,
        },
        term: 'ANNUAL',
        commitment: 'YEAR',
      }];

      // Add mock spans
      const recurrenceSpan = document.createElement('span');
      recurrenceSpan.classList.add('price-recurrence');
      recurrenceSpan.textContent = '/mo';
      mockPriceElement.appendChild(recurrenceSpan);

      const unitTypeSpan = document.createElement('span');
      unitTypeSpan.classList.add('price-unit-type');
      unitTypeSpan.textContent = 'per license';
      mockPriceElement.appendChild(unitTypeSpan);

      const taxInclusivitySpan = document.createElement('span');
      taxInclusivitySpan.classList.add('price-tax-inclusivity');
      taxInclusivitySpan.textContent = 'excl. VAT';
      mockPriceElement.appendChild(taxInclusivitySpan);

      mockPriceElement.onceSettled = sinon.stub().resolves(mockPriceElement);

      // Create mock service
      mockService = {
        createInlinePrice: sinon.stub().returns(mockPriceElement),
        buildPriceHTML: sinon.stub().returns('<span class="price-amount">$100</span>'),
      };
    });

    afterEach(() => {
      clock.restore();
      sinon.restore();
    });

    it('returns null if wcsOsi is empty or has no valid OSIs', async () => {
      const context = { wcsOsi: '' };
      const result = await createInlinePriceSum(mockService, context);
      expect(result).to.be.null;
    });

    it('returns null if wcsOsi only contains whitespace', async () => {
      const context = { wcsOsi: '  ,  ,  ' };
      const result = await createInlinePriceSum(mockService, context);
      expect(result).to.be.null;
    });

    it('creates inline price for single OSI in comma-separated list', async () => {
      const context = {
        wcsOsi: 'osi1',
        promotionCode: 'promo123',
      };

      const resultPromise = createInlinePriceSum(mockService, context);
      await clock.tickAsync(100);
      const result = await resultPromise;

      expect(result).to.exist;
      expect(result.tagName).to.equal('SPAN');
      expect(result.classList.contains('price-summed')).to.be.true;
      expect(result.getAttribute('is')).to.equal('inline-price');
      expect(mockService.createInlinePrice.calledOnce).to.be.true;
      expect(mockService.createInlinePrice.firstCall.args[0]).to.deep.include({
        wcsOsi: 'osi1',
        promotionCode: 'promo123',
      });
    });

    it('creates summed price for multiple OSIs', async () => {
      const mockPriceElement2 = document.createElement('span');
      mockPriceElement2.classList.add('price');
      mockPriceElement2.isFailed = false;
      mockPriceElement2.value = [{
        price: 50,
        originalPrice: 75,
        priceWithoutDiscount: 75,
        priceWithoutTax: 45,
        priceDetails: {
          price: 50,
          originalPrice: 75,
          priceWithoutDiscount: 75,
          priceWithoutTax: 45,
        },
      }];

      const recurrenceSpan = document.createElement('span');
      recurrenceSpan.classList.add('price-recurrence');
      recurrenceSpan.textContent = '/mo';
      mockPriceElement2.appendChild(recurrenceSpan);

      mockPriceElement2.onceSettled = sinon.stub().resolves(mockPriceElement2);

      mockService.createInlinePrice
        .onFirstCall().returns(mockPriceElement)
        .onSecondCall().returns(mockPriceElement2);

      const context = { wcsOsi: 'osi1, osi2' };
      const resultPromise = createInlinePriceSum(mockService, context);
      await clock.tickAsync(100);
      const result = await resultPromise;

      expect(result).to.exist;
      expect(mockService.createInlinePrice.calledTwice).to.be.true;
      expect(mockService.buildPriceHTML.calledOnce).to.be.true;

      const buildPriceArgs = mockService.buildPriceHTML.firstCall.args;
      const summedOffer = buildPriceArgs[0][0];
      expect(summedOffer.price).to.equal(150);
      expect(summedOffer.originalPrice).to.equal(225);
    });

    it('skips failed price elements', async () => {
      const failedElement = document.createElement('span');
      failedElement.classList.add('price');
      failedElement.isFailed = true;
      failedElement.onceSettled = sinon.stub().resolves(failedElement);

      mockService.createInlinePrice
        .onFirstCall().returns(failedElement)
        .onSecondCall().returns(mockPriceElement);

      const context = { wcsOsi: 'osi1, osi2' };
      const resultPromise = createInlinePriceSum(mockService, context);
      await clock.tickAsync(100);
      const result = await resultPromise;

      expect(result).to.exist;
      expect(mockService.buildPriceHTML.calledOnce).to.be.true;
      const summedOffer = mockService.buildPriceHTML.firstCall.args[0][0];
      expect(summedOffer.price).to.equal(100); // Only from mockPriceElement
    });

    it('skips null price elements', async () => {
      mockService.createInlinePrice
        .onFirstCall().returns(null)
        .onSecondCall().returns(mockPriceElement);

      const context = { wcsOsi: 'osi1, osi2' };
      const resultPromise = createInlinePriceSum(mockService, context);
      await clock.tickAsync(100);
      const result = await resultPromise;

      expect(result).to.exist;
      expect(mockService.buildPriceHTML.calledOnce).to.be.true;
    });

    it('returns null if all OSIs fail', async () => {
      const failedElement = document.createElement('span');
      failedElement.classList.add('price');
      failedElement.isFailed = true;
      failedElement.onceSettled = sinon.stub().resolves(failedElement);

      mockService.createInlinePrice.returns(failedElement);

      const context = { wcsOsi: 'osi1, osi2' };
      const resultPromise = createInlinePriceSum(mockService, context);
      await clock.tickAsync(100);
      const result = await resultPromise;

      expect(result).to.be.null;
    });

    it('handles timeout for price element settlement', async () => {
      const slowElement = document.createElement('span');
      slowElement.classList.add('price');
      slowElement.onceSettled = sinon.stub().returns(new Promise((resolve) => {
        setTimeout(() => resolve(slowElement), 15000);
      }));

      mockService.createInlinePrice.returns(slowElement);

      const context = { wcsOsi: 'osi1' };
      const resultPromise = createInlinePriceSum(mockService, context);
      await clock.tickAsync(10001);
      const result = await resultPromise;

      expect(result).to.be.null;
    });

    it('trims OSI values', async () => {
      const context = { wcsOsi: '  osi1  ,  osi2  ' };
      const resultPromise = createInlinePriceSum(mockService, context);
      await clock.tickAsync(100);
      await resultPromise;

      expect(mockService.createInlinePrice.firstCall.args[0].wcsOsi).to.equal('osi1');
      expect(mockService.createInlinePrice.secondCall.args[0].wcsOsi).to.equal('osi2');
    });

    it('disables recurrence display if any price element lacks it', async () => {
      const elementWithoutRecurrence = document.createElement('span');
      elementWithoutRecurrence.classList.add('price');
      elementWithoutRecurrence.isFailed = false;
      elementWithoutRecurrence.value = [{ price: 50, priceDetails: { price: 50 } }];
      elementWithoutRecurrence.onceSettled = sinon.stub().resolves(elementWithoutRecurrence);

      mockService.createInlinePrice
        .onFirstCall().returns(mockPriceElement)
        .onSecondCall().returns(elementWithoutRecurrence);

      const context = { wcsOsi: 'osi1, osi2' };
      const resultPromise = createInlinePriceSum(mockService, context);
      await clock.tickAsync(100);
      const result = await resultPromise;

      const enhancedContext = mockService.buildPriceHTML.firstCall.args[1];
      expect(enhancedContext.displayRecurrence).to.be.false;
      expect(result.getAttribute('data-display-recurrence')).to.equal('false');
    });

    it('disables unit type display if any price element has disabled class', async () => {
      const elementWithDisabledUnit = document.createElement('span');
      elementWithDisabledUnit.classList.add('price');
      elementWithDisabledUnit.isFailed = false;
      elementWithDisabledUnit.value = [{ price: 50, priceDetails: { price: 50 } }];

      const disabledUnitSpan = document.createElement('span');
      disabledUnitSpan.classList.add('price-unit-type', 'disabled');
      elementWithDisabledUnit.appendChild(disabledUnitSpan);

      elementWithDisabledUnit.onceSettled = sinon.stub().resolves(elementWithDisabledUnit);

      mockService.createInlinePrice
        .onFirstCall().returns(mockPriceElement)
        .onSecondCall().returns(elementWithDisabledUnit);

      const context = { wcsOsi: 'osi1, osi2' };
      const resultPromise = createInlinePriceSum(mockService, context);
      await clock.tickAsync(100);
      const result = await resultPromise;

      const enhancedContext = mockService.buildPriceHTML.firstCall.args[1];
      expect(enhancedContext.displayPerUnit).to.be.false;
      expect(result.getAttribute('data-display-per-unit')).to.equal('false');
    });

    it('sets data attributes for term and commitment', async () => {
      const context = { wcsOsi: 'osi1' };
      const resultPromise = createInlinePriceSum(mockService, context);
      await clock.tickAsync(100);
      const result = await resultPromise;

      expect(result.getAttribute('data-term')).to.equal('ANNUAL');
      expect(result.getAttribute('data-commitment')).to.equal('YEAR');
    });

    it('sets data attribute for forceTaxExclusive', async () => {
      const context = { wcsOsi: 'osi1', forceTaxExclusive: 'true' };
      const resultPromise = createInlinePriceSum(mockService, context);
      await clock.tickAsync(100);
      const result = await resultPromise;

      expect(result.getAttribute('data-force-tax-exclusive')).to.equal('true');
    });

    it('uses first recurrence text for summed price', async () => {
      const mockPriceElement2 = document.createElement('span');
      mockPriceElement2.classList.add('price');
      mockPriceElement2.isFailed = false;
      mockPriceElement2.value = [{ price: 50, priceDetails: { price: 50 } }];

      const recurrenceSpan = document.createElement('span');
      recurrenceSpan.classList.add('price-recurrence');
      recurrenceSpan.textContent = '/yr';
      mockPriceElement2.appendChild(recurrenceSpan);

      mockPriceElement2.onceSettled = sinon.stub().resolves(mockPriceElement2);

      mockService.createInlinePrice
        .onFirstCall().returns(mockPriceElement)
        .onSecondCall().returns(mockPriceElement2);

      mockService.buildPriceHTML.returns(`
        <span class="price-amount">$150</span>
        <span class="price-recurrence">placeholder</span>
      `);

      const context = { wcsOsi: 'osi1, osi2' };
      const resultPromise = createInlinePriceSum(mockService, context);
      await clock.tickAsync(100);
      const result = await resultPromise;

      const recurrence = result.querySelector('.price-recurrence');
      expect(recurrence.textContent).to.equal('/mo');
    });

    it('handles errors gracefully when creating price elements', async () => {
      mockService.createInlinePrice.throws(new Error('Failed to create price'));

      const context = { wcsOsi: 'osi1, osi2' };
      const resultPromise = createInlinePriceSum(mockService, context);
      await clock.tickAsync(100);
      const result = await resultPromise;

      expect(result).to.be.null;
    });

    it('cleans up temporary container after processing', async () => {
      const initialBodyChildCount = document.body.children.length;

      const context = { wcsOsi: 'osi1' };
      const resultPromise = createInlinePriceSum(mockService, context);
      await clock.tickAsync(100);
      await resultPromise;

      const finalBodyChildCount = document.body.children.length;
      expect(finalBodyChildCount).to.equal(initialBodyChildCount);
    });

    it('preserves all context properties when creating individual prices', async () => {
      const context = {
        wcsOsi: 'osi1, osi2',
        promotionCode: 'promo123',
        displayRecurrence: true,
        displayPerUnit: true,
        displayTax: true,
        customProperty: 'customValue',
      };

      const resultPromise = createInlinePriceSum(mockService, context);
      await clock.tickAsync(100);
      await resultPromise;

      const firstCallContext = mockService.createInlinePrice.firstCall.args[0];
      expect(firstCallContext).to.deep.include({
        wcsOsi: 'osi1',
        promotionCode: 'promo123',
        displayRecurrence: true,
        displayPerUnit: true,
        displayTax: true,
        customProperty: 'customValue',
      });

      const secondCallContext = mockService.createInlinePrice.secondCall.args[0];
      expect(secondCallContext.wcsOsi).to.equal('osi2');
    });
  });
});
