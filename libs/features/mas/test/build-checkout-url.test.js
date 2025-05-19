import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { 
  mapParameterName, 
  addParameters, 
  getHostName, 
  setItemsParameter, 
  buildCheckoutUrl 
} from '../src/buildCheckoutUrl.js';
import { PROVIDER_ENVIRONMENT, CheckoutWorkflowStep } from '../src/constants.js';

describe('mapParameterName', () => {
  it('should return mapped name for known parameters', () => {
    expect(mapParameterName('country')).to.equal('co');
    expect(mapParameterName('language')).to.equal('lang');
  });

  it('should return same name for unknown parameters', () => {
    expect(mapParameterName('unknownParam')).to.equal('unknownParam');
  });
});

describe('addParameters', () => {
  it('should add allowed parameters with correct mapping', () => {
    const input = { country: 'US', language: 'en', unknown: 'value' };
    const result = new Map();
    const allowedKeys = new Set(['co', 'lang']);
    addParameters(input, result, allowedKeys);

    expect(result.get('co')).to.equal('US');
    expect(result.get('lang')).to.equal('en');
    expect(result.has('unknown')).to.be.false;
  });
});

describe('getHostName', () => {
  it('should return production URL for production environment', () => {
    expect(getHostName(PROVIDER_ENVIRONMENT.PRODUCTION)).to.equal('https://commerce.adobe.com');
  });

  it('should return staging URL for non-production environments', () => {
    expect(getHostName('staging')).to.equal('https://commerce-stg.adobe.com');
  });
});

describe('setItemsParameter', () => {
  it('should map and set item parameters correctly', () => {
    const items = [{ countrySpecific: 'yes', quantity: 2 }];
    const parameters = new Map();
    setItemsParameter(items, parameters);

    expect(parameters.get('items[0][cs]')).to.equal('yes');
    expect(parameters.get('items[0][q]')).to.equal(2);
  });
});

describe('buildCheckoutUrl', () => {
  
  it('should construct a valid checkout URL', () => {
    const validateStub = sinon.stub().returns(true);
    const checkoutData = {
      env: PROVIDER_ENVIRONMENT.PRODUCTION,
      workflowStep: CheckoutWorkflowStep.CHECKOUT,
      clientId: 'testClient',
      country: 'US',
      items: [{ quantity: 1, language: 'en' }],
    };
    const url = buildCheckoutUrl(checkoutData);
    expect(url).to.equal('https://commerce.adobe.com/store/checkout?items%5B0%5D%5Bq%5D=1&items%5B0%5D%5Blang%5D=en&cli=testClient&co=US');
    sinon.restore();
  });

  it('should throw an error if required fields are missing', () => {
    expect(() => buildCheckoutUrl({ workflowStep: CheckoutWorkflowStep.CHECKOUT })).to.throw();
  });

  it('should set correct parameters for CRM modal type', () => {
    const checkoutData = {
      env: PROVIDER_ENVIRONMENT.PRODUCTION,
      workflowStep: CheckoutWorkflowStep.SEGMENTATION,
      clientId: 'testClient',
      country: 'US',
      items: [{ quantity: 1 }],
      customerSegment: 'INDIVIDUAL',
      marketSegment: 'EDU',
      modal: 'crm',
    };
    const url = buildCheckoutUrl(checkoutData);
    const parsedUrl = new URL(url);
    expect(parsedUrl.searchParams.get('af')).to.equal('uc_new_user_iframe,uc_new_system_close');
    expect(parsedUrl.searchParams.get('cli')).to.equal('creative');
  });

  it('should set correct parameters for TWP modal type', () => {
    const checkoutData = {
      env: PROVIDER_ENVIRONMENT.PRODUCTION,
      workflowStep: CheckoutWorkflowStep.SEGMENTATION,
      clientId: 'testClient',
      country: 'US',
      items: [{ quantity: 1 }],
      customerSegment: 'INDIVIDUAL',
      marketSegment: 'EDU',
      modal: 'twp',
    };
    const url = buildCheckoutUrl(checkoutData);
    const parsedUrl = new URL(url);
    expect(parsedUrl.searchParams.get('af')).to.equal('uc_new_user_iframe,uc_new_system_close');
    expect(parsedUrl.searchParams.get('cli')).to.equal('mini_plans');
  });

  it('should set correct parameters for D2P modal type', () => {
    const checkoutData = {
      env: PROVIDER_ENVIRONMENT.PRODUCTION,
      workflowStep: CheckoutWorkflowStep.SEGMENTATION,
      clientId: 'testClient',
      country: 'US',
      items: [{ quantity: 1 }],
      customerSegment: 'INDIVIDUAL',
      marketSegment: 'EDU',
      modal: 'd2p',
    };
    const url = buildCheckoutUrl(checkoutData);
    const parsedUrl = new URL(url);
    expect(parsedUrl.searchParams.get('af')).to.equal('uc_new_user_iframe,uc_new_system_close');
    expect(parsedUrl.searchParams.get('cli')).to.equal('mini_plans');
  });

  it('should set market segment for EDU individual customer', () => {
    const checkoutData = {
      env: PROVIDER_ENVIRONMENT.PRODUCTION,
      workflowStep: CheckoutWorkflowStep.SEGMENTATION,
      clientId: 'testClient',
      country: 'US',
      items: [{ quantity: 1 }],
      customerSegment: 'INDIVIDUAL',
      marketSegment: 'EDU',
      modal: 'twp',
    };
    const url = buildCheckoutUrl(checkoutData);    
    const parsedUrl = new URL(url);
    expect(parsedUrl.searchParams.get('ms')).to.equal('e');
  });

  it('should set customer segment for COM team customer', () => {
    const checkoutData = {
      env: PROVIDER_ENVIRONMENT.PRODUCTION,
      workflowStep: CheckoutWorkflowStep.SEGMENTATION,
      clientId: 'testClient',
      country: 'US',
      items: [{ quantity: 1 }],
      customerSegment: 'TEAM',
      marketSegment: 'COM',
      modal: 'twp',
    };
    const url = buildCheckoutUrl(checkoutData);
    const parsedUrl = new URL(url);
    expect(parsedUrl.searchParams.get('cs')).to.equal('t');
  });

  it('should handle addon product arrangement code for 3-in-1 modal', () => {
    const checkoutData = {
      env: PROVIDER_ENVIRONMENT.PRODUCTION,
      workflowStep: CheckoutWorkflowStep.SEGMENTATION,
      clientId: 'testClient',
      country: 'US',
      items: [
        { quantity: 1 },
        { productArrangementCode: 'ADDON123' }
      ],
      modal: 'twp',
      customerSegment: 'INDIVIDUAL',
      marketSegment: 'EDU'
    };
    const url = buildCheckoutUrl(checkoutData);
    const parsedUrl = new URL(url);
    expect(parsedUrl.searchParams.get('ao')).to.equal('ADDON123');
  });
  
  it('should respect mas-ff-3in1 meta tag when off', () => {
    const meta = document.createElement('meta');
    meta.name = 'mas-ff-3in1';
    meta.content = 'off';
    document.head.appendChild(meta);

    const checkoutData = {
      env: PROVIDER_ENVIRONMENT.PRODUCTION,
      workflowStep: CheckoutWorkflowStep.SEGMENTATION,
      clientId: 'testClient',
      country: 'US',
      items: [{ quantity: 1 }],
      modal: 'twp',
      customerSegment: 'INDIVIDUAL',
      marketSegment: 'EDU'
    };
    const url = buildCheckoutUrl(checkoutData);
    const parsedUrl = new URL(url);
    
    expect(parsedUrl.searchParams.has('rtc')).to.be.false;
    expect(parsedUrl.searchParams.has('lo')).to.be.false;
    
    document.head.removeChild(meta);
  });

  it('should not modify clientId if doc_cloud for 3-in-1 modal', () => {
    const checkoutData = {
      env: PROVIDER_ENVIRONMENT.PRODUCTION,
      workflowStep: CheckoutWorkflowStep.SEGMENTATION,
      clientId: 'doc_cloud',
      country: 'US',
      items: [{ quantity: 1 }],
      modal: 'twp',
      customerSegment: 'INDIVIDUAL',
      marketSegment: 'EDU'
    };
    const url = buildCheckoutUrl(checkoutData);
    const parsedUrl = new URL(url);
    expect(parsedUrl.searchParams.get('cli')).to.equal('doc_cloud');
  });

  it('should not add 3-in-1 parameters for non-3-in-1 modal types', () => {
    const checkoutData = {
      env: PROVIDER_ENVIRONMENT.PRODUCTION,
      workflowStep: CheckoutWorkflowStep.SEGMENTATION,
      clientId: 'testClient',
      country: 'US',
      items: [{ quantity: 1 }],
      modal: 'other',
      customerSegment: 'INDIVIDUAL',
      marketSegment: 'EDU'
    };
    const url = buildCheckoutUrl(checkoutData);
    const parsedUrl = new URL(url);
    expect(parsedUrl.searchParams.has('rtc')).to.be.false;
    expect(parsedUrl.searchParams.has('lo')).to.be.false;
  });

  it('should handle segmentation workflow step without items', () => {
    const checkoutData = {
      env: PROVIDER_ENVIRONMENT.PRODUCTION,
      workflowStep: CheckoutWorkflowStep.SEGMENTATION,
      clientId: 'testClient',
      country: 'US',
      marketSegment: 'EDU',
      offerType: 'SUBSCRIPTION',
      productArrangementCode: 'PAC123'
    };
    expect(() => buildCheckoutUrl(checkoutData)).to.not.throw();
    const url = buildCheckoutUrl(checkoutData);
    const parsedUrl = new URL(url);
    expect(parsedUrl.pathname).to.include('/store/segmentation');
    expect(parsedUrl.searchParams.get('ms')).to.equal('EDU');
    expect(parsedUrl.searchParams.get('ot')).to.equal('SUBSCRIPTION');
    expect(parsedUrl.searchParams.get('pa')).to.equal('PAC123');
  });

  it('should handle quantity parameter for 3-in-1 modal when quantity > 1', () => {
    const checkoutData = {
      env: PROVIDER_ENVIRONMENT.PRODUCTION,
      workflowStep: CheckoutWorkflowStep.SEGMENTATION,
      clientId: 'testClient',
      country: 'US',
      items: [{ quantity: 2 }],
      modal: 'twp',
      customerSegment: 'INDIVIDUAL',
      marketSegment: 'EDU'
    };
    const url = buildCheckoutUrl(checkoutData);
    const parsedUrl = new URL(url);
    expect(parsedUrl.searchParams.get('q')).to.equal('2');
  });

  it('should not set quantity parameter when quantity is 1', () => {
    const checkoutData = {
      env: PROVIDER_ENVIRONMENT.PRODUCTION,
      workflowStep: CheckoutWorkflowStep.SEGMENTATION,
      clientId: 'testClient',
      country: 'US',
      items: [{ quantity: 1 }],
      modal: 'twp',
      customerSegment: 'INDIVIDUAL',
      marketSegment: 'EDU'
    };
    const url = buildCheckoutUrl(checkoutData);
    const parsedUrl = new URL(url);
    expect(parsedUrl.searchParams.has('q')).to.be.false;
  });

  it('should handle addon product arrangement code when root pa is provided', () => {
    const checkoutData = {
      env: PROVIDER_ENVIRONMENT.PRODUCTION,
      workflowStep: CheckoutWorkflowStep.SEGMENTATION,
      clientId: 'testClient',
      country: 'US',
      productArrangementCode: 'MAIN123',
      items: [
        { productArrangementCode: 'MAIN123' },
        { productArrangementCode: 'ADDON123' }
      ],
      modal: 'twp',
      customerSegment: 'INDIVIDUAL',
      marketSegment: 'EDU'
    };
    const url = buildCheckoutUrl(checkoutData);
    const parsedUrl = new URL(url);
    expect(parsedUrl.searchParams.get('pa')).to.equal('MAIN123');
    expect(parsedUrl.searchParams.get('ao')).to.equal('ADDON123');
  });

  it('should prioritize manually set cs and ms over marketSegment and customerSegment', () => {
    const checkoutData = {
      env: PROVIDER_ENVIRONMENT.PRODUCTION,
      workflowStep: CheckoutWorkflowStep.SEGMENTATION,
      clientId: 'testClient',
      country: 'US',
      items: [{ quantity: 1 }],
      modal: 'twp',
      customerSegment: 'INDIVIDUAL',
      marketSegment: 'EDU',
      cs: 'custom_cs',
      ms: 'custom_ms'
    };
    const url = buildCheckoutUrl(checkoutData);
    const parsedUrl = new URL(url);
    expect(parsedUrl.searchParams.get('cs')).to.equal('custom_cs');
    expect(parsedUrl.searchParams.get('ms')).to.equal('custom_ms');
  });

  it('should remove the ot parameter when it is PROMOTION', () => {
    const checkoutData = {
      env: PROVIDER_ENVIRONMENT.PRODUCTION,
      workflowStep: CheckoutWorkflowStep.SEGMENTATION,
      clientId: 'testClient',
      country: 'US',
      items: [{ quantity: 1 }],
      modal: 'twp',
      customerSegment: 'INDIVIDUAL',
      marketSegment: 'EDU',
      ot: 'PROMOTION'
    };
    const url = buildCheckoutUrl(checkoutData);
    const parsedUrl = new URL(url);
    expect(parsedUrl.searchParams.has('ot')).to.be.false;
  });
});
