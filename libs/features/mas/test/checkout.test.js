import { expect } from '@esm-bundle/chai';
import { Checkout } from '../src/checkout.js';
import { CheckoutWorkflowStep } from '../src/constants.js';

describe('Checkout', () => {
  let checkout;
  const mockSettings = {
    checkoutClientId: 'creative',
    checkoutWorkflowStep: CheckoutWorkflowStep.SEGMENTATION,
    country: 'US',
    language: 'en',
    promotionCode: 'TESTPROMO',
    quantity: 1,
    env: 'prod',
    landscape: 'published',
  };

  beforeEach(() => {
    checkout = Checkout({ settings: mockSettings });
  });

  describe('collectCheckoutOptions', () => {
    it('should collect options with default values', () => {
      const options = checkout.collectCheckoutOptions();
      expect(options).to.deep.include({
        checkoutClientId: 'creative',
        checkoutWorkflowStep: CheckoutWorkflowStep.SEGMENTATION,
        country: 'US',
        language: 'en',
        promotionCode: 'TESTPROMO',
        quantity: [1],
      });
    });

    it('should override defaults with provided options', () => {
      const overrides = {
        country: 'CA',
        language: 'fr',
        quantity: 2,
      };
      const options = checkout.collectCheckoutOptions(overrides);
      expect(options).to.deep.include({
        country: 'CA',
        language: 'fr',
        quantity: [2],
      });
    });

    it('should handle boolean conversions', () => {
      const overrides = {
        entitlement: 'true',
        upgrade: 'false',
        perpetual: 'true',
      };
      const options = checkout.collectCheckoutOptions(overrides);
      expect(options).to.deep.include({
        entitlement: true,
        upgrade: false,
        perpetual: true,
      });
    });

    it('should handle wcsOsi conversion', () => {
      const overrides = {
        wcsOsi: 'test-osi',
      };
      const options = checkout.collectCheckoutOptions(overrides);
      expect(options).to.deep.include({
        wcsOsi: ['test-osi'],
      });
    });
  });

  describe('buildCheckoutURL', () => {
    const mockOffers = [{
      offerId: 'test-offer',
      productArrangementCode: 'test-pac',
      marketSegments: ['COM'],
      customerSegment: 'INDIVIDUAL',
      offerType: 'BASE',
    }];

    it('should return empty string for invalid inputs', () => {
      expect(checkout.buildCheckoutURL([], {})).to.equal('');
      expect(checkout.buildCheckoutURL(null, {})).to.equal('');
      expect(checkout.buildCheckoutURL(mockOffers, null)).to.equal('');
    });

    it('should build URL with single offer for segmentation workflow', () => {
      const url = checkout.buildCheckoutURL(mockOffers, {});
      expect(url).to.equal('https://commerce-stg.adobe.com/store/segmentation?apc=TESTPROMO&cli=creative&ctx=fp&co=US&lang=en&ms=COM&ot=BASE&cs=INDIVIDUAL&pa=test-pac');
    });

    it('should build URL with single offer for other workflows', () => {
      const settings = { ...mockSettings, checkoutWorkflowStep: CheckoutWorkflowStep.COMMITMENT };
      const checkout = Checkout({ settings });
      const url = checkout.buildCheckoutURL(mockOffers, {});
      expect(url).to.equal('https://commerce-stg.adobe.com/store/commitment?items%5B0%5D%5Bid%5D=test-offer&apc=TESTPROMO&cli=creative&ctx=fp&co=US&lang=en');
    });

    it('should handle multiple offers', () => {
      const settings = { ...mockSettings, checkoutWorkflowStep: CheckoutWorkflowStep.EMAIL};
      const checkout = Checkout({ settings });
      const multipleOffers = [
        {
          offerId: 'test-offer',
          productArrangementCode: 'test-pac',
          marketSegments: ['COM'],
          customerSegment: 'INDIVIDUAL',
          offerType: 'BASE',
        },
        {
          offerId: 'test-offer-2',
          productArrangementCode: 'test-pac-2',
          marketSegments: ['EDU'],
          customerSegment: 'INDIVIDUAL',
          offerType: 'BASE',
        },
      ];
      const url = checkout.buildCheckoutURL(multipleOffers, {});
      expect(url).to.equal('https://commerce-stg.adobe.com/store/email?items%5B0%5D%5Bid%5D=test-offer&items%5B1%5D%5Bid%5D=test-offer-2&apc=TESTPROMO&cli=creative&ctx=fp&co=US&lang=en');
    });

    it('should handle preselectPlan for EDU', () => {
      const settings = { ...mockSettings, preselectPlan: 'edu' };
      const checkout = Checkout({ settings });
      const url = checkout.buildCheckoutURL(mockOffers, {});
      expect(url).to.equal('https://commerce-stg.adobe.com/store/segmentation?apc=TESTPROMO&cli=creative&ctx=fp&co=US&lang=en&ms=EDU&ot=BASE&cs=INDIVIDUAL&pa=test-pac');
    });

    it('should handle preselectPlan for TEAM', () => {
      const settings = { ...mockSettings, preselectPlan: 'team' };
      const checkout = Checkout({ settings });
      const url = checkout.buildCheckoutURL(mockOffers, {});
      expect(url).to.equal('https://commerce-stg.adobe.com/store/segmentation?apc=TESTPROMO&cli=creative&ctx=fp&co=US&lang=en&ms=COM&ot=BASE&cs=TEAM&pa=test-pac');
    });

    it('should handle quantity for single offer', () => {
      const url = checkout.buildCheckoutURL(mockOffers, { quantity: 2 });
      expect(url).to.include('q=2');
    });

    it('should handle 3-in-1 modal context', () => {
      const url = checkout.buildCheckoutURL(mockOffers, { modal: 'twp' });
      expect(url).to.include('ctx=if');
    });
  });

  describe('CheckoutLink', () => {
    it('should expose CheckoutLink', () => {
      expect(checkout.CheckoutLink).to.exist;
    });

    it('should expose createCheckoutLink', () => {
      expect(checkout.createCheckoutLink).to.be.a('function');
    });
  });
});
