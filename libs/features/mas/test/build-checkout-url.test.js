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
      workflowStep: CheckoutWorkflowStep.CHECKOUT,
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
      workflowStep: CheckoutWorkflowStep.CHECKOUT,
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
      workflowStep: CheckoutWorkflowStep.CHECKOUT,
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
      workflowStep: CheckoutWorkflowStep.CHECKOUT,
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
      workflowStep: CheckoutWorkflowStep.CHECKOUT,
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
});
