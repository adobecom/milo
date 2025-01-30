import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { 
  mapParameterName, 
  addParameters, 
  getHostName, 
  setItemsParameter, 
  buildCheckoutUrl 
} from '../src/buildCheckoutUrl.js';
import { PROVIDER_ENVIRONMENT, WORKFLOW_STEP } from '../src/constants.js';

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
      workflowStep: WORKFLOW_STEP.CHECKOUT,
      clientId: 'testClient',
      country: 'US',
      items: [{ quantity: 1, language: 'en' }],
    };
    const url = buildCheckoutUrl(checkoutData);
    expect(url).to.equal('https://commerce.adobe.com/store/checkout?items%5B0%5D%5Bq%5D=1&items%5B0%5D%5Blang%5D=en&cli=testClient&co=US');
    sinon.restore();
  });

  it('should throw an error if required fields are missing', () => {
    expect(() => buildCheckoutUrl({ workflowStep: WORKFLOW_STEP.CHECKOUT })).to.throw();
  });
});
