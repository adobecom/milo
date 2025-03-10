import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import '../../libs/utils/lana.js';

const defaultTestOptions = {
  clientId: 'testClientId',
  endpoint: 'https://lana.adobeio.com/',
  errorType: 'e',
  severity: 'i',
  sampleRate: 100,
  implicitSampleRate: 100,
};

let xhr;
let xhrRequests;

it('verify default options', () => {
  expect(window.lana.options).to.be.eql({
    clientId: '',
    endpoint: 'https://www.adobe.com/lana/ll',
    endpointStage: 'https://www.stage.adobe.com/lana/ll',
    errorType: 'e',
    severity: 'i',
    sampleRate: 1,
    tags: '',
    implicitSampleRate: 1,
    isProdDomain: false,
    useProd: true,
  });
});

describe('LANA', () => {
  beforeEach(() => {
    xhr = sinon.useFakeXMLHttpRequest();
    xhrRequests = [];
    xhr.onCreate = function oncreate(req) {
      xhrRequests.push(req);
    };

    window.lana.options = { ...defaultTestOptions };
    window.lana.debug = false;
    window.lana.localhost = false;
    sinon.spy(console, 'log');
    sinon.spy(console, 'warn');
  });

  afterEach(() => {
    console.log.restore();
    console.warn.restore();
    xhr.restore();
  });

  it('Exists on the window object', () => {
    expect(window.lana).to.exist;
  });

  it('Catches unhandled error', (done) => {
    const testCallback = () => {
      window.removeEventListener('unhandledrejection', testCallback);
      expect(xhrRequests.length).to.equal(1);
      expect(xhrRequests[0].method).to.equal('GET');
      expect(xhrRequests[0].url).to.equal(
        'https://www.stage.adobe.com/lana/ll?m=Promise%20Rejection&c=testClientId&s=100&t=i&r=e',
      );
      done();
    };
    window.addEventListener('unhandledrejection', testCallback);
    /* eslint-disable-next-line prefer-promise-reject-errors */
    Promise.reject('Promise Rejection');
  });

  it('Catches errors without a message', (done) => {
    const testCallback = () => {
      window.removeEventListener('unhandledrejection', testCallback);
      expect(xhrRequests.length).to.equal(1);
      expect(xhrRequests[0].method).to.equal('GET');
      expect(xhrRequests[0].url).to.equal(
        'https://www.stage.adobe.com/lana/ll?m=&c=testClientId&s=100&t=i&r=e',
      );
      done();
    };
    window.addEventListener('unhandledrejection', testCallback);
    /* eslint-disable-next-line prefer-promise-reject-errors */
    Promise.reject();
  });

  it('Will truncate the message', () => {
    const longMsg = 'm'.repeat(2100);
    const expectedMsg = `${'m'.repeat(2000)}%3Ctrunc%3E`;
    window.lana.log(longMsg);
    expect(xhrRequests.length).to.equal(1);
    expect(xhrRequests[0].method).to.equal('GET');
    expect(xhrRequests[0].url).to.equal(
      `https://www.stage.adobe.com/lana/ll?m=${expectedMsg}&c=testClientId&s=100&t=e&r=i`,
    );
  });

  it('Consoles data when debug mode is enabled', (done) => {
    window.lana.debug = true;
    window.lana.log('Test debug log message', { clientId: 'debugClientId' });
    const serverResponse = 'client=debugClientId,type=e,sample=1,user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.54 Safari/537.36,referer=undefined,ip=23.56.175.228,message=Test debug log message';
    
    // Check the URL to make sure it includes r=d and the debug flag
    expect(xhrRequests[0].url).to.contain('r=d');
    expect(xhrRequests[0].url).to.contain('&d');
    
    xhrRequests[0].respond(200, { 'Content-Type': 'text/html' }, serverResponse);

    setTimeout(() => {
      expect(console.log.args[0]).to.eql([
        'LANA Msg: ',
        'Test debug log message',
        '\nOpts:',
        {
          clientId: 'debugClientId',
          endpoint: 'https://lana.adobeio.com/',
          endpointStage: 'https://www.stage.adobe.com/lana/ll',
          errorType: 'e',
          severity: 'd', // debug mode enabled, default severity is 'd'
          implicitSampleRate: 100,
          isProdDomain: false,
          sampleRate: 100,
          tags: '',
          useProd: true,
        },
      ]);
      expect(console.log.args[1]).to.eql(['LANA response:', serverResponse]);
      done();
    }, 50);
  });

  it('Consoles data when localhost mode is enabled', () => {
    window.lana.localhost = true;
    window.lana.log('Test localhost log message');
    expect(console.log.args[0]).to.eql([
      'LANA Msg: ',
      'Test localhost log message',
      '\nOpts:',
      {
        clientId: 'testClientId',
        endpoint: 'https://lana.adobeio.com/',
        endpointStage: 'https://www.stage.adobe.com/lana/ll',
        errorType: 'e',
        severity: 'i',
        implicitSampleRate: 100,
        isProdDomain: false,
        sampleRate: 100,
        tags: '',
        useProd: true,
      },
    ]);

    // when in localhost mode, nothing is sent to the server
    expect(xhrRequests.length).to.equal(0);
  });

  it('warns that clientId is not set', () => {
    window.lana.options.clientId = '';
    window.lana.log('Test log message');
    expect(console.warn.args[0][0]).to.eql('LANA ClientID is not set in options.');
  });

  it('sets tags if defined in options', () => {
    window.lana.log('I set the client id', { tags: 'commerce,pricestore' });
    expect(xhrRequests.length).to.equal(1);
    expect(xhrRequests[0].method).to.equal('GET');
    expect(xhrRequests[0].url).to.equal(
      'https://www.stage.adobe.com/lana/ll?m=I%20set%20the%20client%20id&c=testClientId&s=100&t=e&r=i&tags=commerce,pricestore',
    );
  });

  it('uses default option values if not set in options object', () => {
    window.lana.options = {
      clientId: 'blah',
      sampleRate: 100,
      implicitSampleRate: 100,
    };
    window.lana.log('only the clientId set in window.lana.options');
    expect(xhrRequests.length).to.equal(1);
    expect(xhrRequests[0].method).to.equal('GET');
    expect(xhrRequests[0].url).to.equal(
      'https://www.stage.adobe.com/lana/ll?m=only%20the%20clientId%20set%20in%20window.lana.options&c=blah&s=100&t=e&r=i',
    );
  });

  it('The lana-sample query param overrides existing sampleRate', () => {
    window.lana.options = {
      clientId: 'blah',
      sampleRate: 0,
      implicitSampleRate: 0,
    };
    const originalUrl = window.location.href;

    window.lana.log('Sample rate is zero so should not be logged');
    expect(xhrRequests.length).to.equal(0);

    // create a new url based on the current url that adds a query param for lana-sample
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('lana-sample', '100');

    window.history.pushState({ path: newUrl.toString() }, '', newUrl.toString());

    window.lana.log('lana-sample query param');
    expect(xhrRequests.length).to.equal(1);
    expect(xhrRequests[0].method).to.equal('GET');
    expect(xhrRequests[0].url).to.equal(
      'https://www.stage.adobe.com/lana/ll?m=lana-sample%20query%20param&c=blah&s=100&t=e&r=i',
    );

    window.history.pushState({ path: originalUrl }, '', originalUrl);
  });

  it('Invalid lana-sample query params are ignored', () => {
    window.lana.options = {
      clientId: 'blah',
      sampleRate: 100,
      implicitSampleRate: 100,
    };
    const originalUrl = window.location.href;

    // create a new url based on the current url that adds a query param for lana-sample
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('lana-sample', 'notvalid');

    window.history.pushState({ path: newUrl.toString() }, '', newUrl.toString());

    window.lana.log('lana-sample query param');
    expect(xhrRequests.length).to.equal(1);
    expect(xhrRequests[0].method).to.equal('GET');
    expect(xhrRequests[0].url).to.equal(
      'https://www.stage.adobe.com/lana/ll?m=lana-sample%20query%20param&c=blah&s=100&t=e&r=i',
    );

    window.history.pushState({ path: originalUrl }, '', originalUrl);
  });

  it('uses severity if defined in options', () => {
    window.lana.log('Testing severity', { severity: 'w' });
    expect(xhrRequests.length).to.equal(1);
    expect(xhrRequests[0].method).to.equal('GET');
    expect(xhrRequests[0].url).to.equal(
      'https://www.stage.adobe.com/lana/ll?m=Testing%20severity&c=testClientId&s=100&t=e&r=w',
    );
  });

  it('uses debug severity when in debug mode', () => {
    window.lana.debug = true;
    window.lana.log('Debug mode test');
    expect(xhrRequests.length).to.equal(1);
    expect(xhrRequests[0].method).to.equal('GET');
    expect(xhrRequests[0].url).to.equal(
      'https://www.stage.adobe.com/lana/ll?m=Debug%20mode%20test&c=testClientId&s=100&t=e&r=d&d',
    );
  });

  it('explicit severity takes precedence over debug mode default', () => {
    window.lana.debug = true;
    window.lana.log('Explicit severity test', { severity: 'w' });
    expect(xhrRequests.length).to.equal(1);
    expect(xhrRequests[0].method).to.equal('GET');
    expect(xhrRequests[0].url).to.equal(
      'https://www.stage.adobe.com/lana/ll?m=Explicit%20severity%20test&c=testClientId&s=100&t=e&r=w&d',
    );
    
    // Also test with invalid severity to verify debug mode is used for fallback
    window.lana.log('Invalid severity test', { severity: 'invalid' });
    expect(xhrRequests.length).to.equal(2);
    expect(xhrRequests[1].method).to.equal('GET');
    expect(xhrRequests[1].url).to.equal(
      'https://www.stage.adobe.com/lana/ll?m=Invalid%20severity%20test&c=testClientId&s=100&t=e&r=d&d',
    );
    expect(console.warn.called).to.be.true;
    expect(console.warn.args[0][0]).to.include('Invalid severity');
    expect(console.warn.args[0][0]).to.include('Defaulting to \'d\'');
  });
  
  it('prevents XSS by properly encoding message content', () => {
    // Test with a string containing characters that could be used for XSS
    const maliciousString = '<script>alert("XSS")</script><img src="x" onerror="alert(\'XSS\')">';
    
    window.lana.log(maliciousString);
    expect(xhrRequests.length).to.equal(1);
    
    // Verify the URL contains properly encoded values
    const url = xhrRequests[0].url;
    
    // The URL should not contain any unencoded < or > characters
    expect(url).not.to.include('<');
    expect(url).not.to.include('>');
    
    // The URL should contain encoded versions of these characters
    expect(url).to.include('%3C');  // < encoded
    expect(url).to.include('%3E');  // > encoded
    
    // Verify the message param is properly encoded
    const msgParam = url.match(/m=([^&]*)/)[1];
    
    // Double-check decoding works correctly
    const decodedMsg = decodeURIComponent(msgParam);
    expect(decodedMsg).to.equal(maliciousString);
    
    // Verify that quotes and parentheses are also encoded
    expect(url).to.include('%22');  // " encoded
    expect(url).to.include('%27');  // ' encoded
    expect(url).to.include('%28');  // ( encoded
    expect(url).to.include('%29');  // ) encoded
  });
});
