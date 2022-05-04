/* global describe beforeEach afterEach it window.lana */

import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import '../../../libs/utils/lana.js';

const defaultTestOptions = {
  clientId: '',
  debug: false,
  endpoint: 'https://lana.adobeio.com/',
  errorType: 'e',
  sampleRate: 100,
};

let xhr;
let xhrRequests;

describe('LANA', () => {
  beforeEach(() => {
    xhr = sinon.useFakeXMLHttpRequest();
    xhrRequests = [];
    xhr.onCreate = function (req) {
      xhrRequests.push(req);
    };

    window.lana.setDefaultOptions(defaultTestOptions);
    sinon.spy(console, 'warn');
  });

  afterEach(() => {
    console.warn.restore();
    xhr.restore();
  });

  it('Exists on the window object', () => {
    expect(window.lana).to.exist;
  });

  it('Set the default clientId', () => {
    window.lana.setClientdId('myClientId');
    window.lana.log('I set the client id');
    expect(xhrRequests.length).to.equal(1);
    expect(xhrRequests[0].method).to.equal('GET');
    expect(xhrRequests[0].url).to.equal(
      'https://lana.adobeio.com/?m=I%20set%20the%20client%20id&c=myClientId&s=100&t=e'
    );
  });

  it('Logs a message to console when debug is true', () => {
    window.lana.log('Test log message', { debug: true, sampleRate: 100 });
    expect(console.warn.args[0][0]).to.equal('LANA:');
    expect(console.warn.args[0][1]).to.equal('Test log message');
  });

  it('Catches unhandled error', (done) => {
    const testCallback = () => {
      window.removeEventListener('unhandledrejection', testCallback);
      expect(xhrRequests.length).to.equal(1);
      expect(xhrRequests[0].method).to.equal('GET');
      expect(xhrRequests[0].url).to.equal(
        'https://lana.adobeio.com/?m=Promise%20Rejection&c=myClientId&s=100&t=i'
      );
      done();
    };
    window.addEventListener('unhandledrejection', testCallback);
    Promise.reject('Promise Rejection');
  });
});
