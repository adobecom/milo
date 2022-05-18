import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

const defaultTestOptions = {
  clientId: 'testClientId',
  debug: false,
  endpoint: 'https://lana.adobeio.com/',
  errorType: 'e',
  sampleRate: 100,
  implicitSampleRate: 100,
};

it('lana should load existing window.lana.options', async () => {
  window.lana = {
    options: defaultTestOptions,
  };
  await import('../../../libs/utils/lana.js');
  expect(window.lana.options).to.be.eql(defaultTestOptions);
});
