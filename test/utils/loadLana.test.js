import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { loadLana } from '../../libs/utils/utils.js';

describe('Utils loadLana', () => {
  let originalLocation;

  beforeEach(() => {
    originalLocation = window.location.href;
    // Make sure console.log isn't already wrapped
    if (console.log.restore && typeof console.log.restore === 'function') {
      console.log.restore();
    }
  });

  afterEach(() => {
    // Reset URL if it was changed
    if (window.location.href !== originalLocation) {
      window.history.pushState({}, '', originalLocation);
    }

    // Always restore console.log if it was spied on
    if (console.log.restore && typeof console.log.restore === 'function') {
      console.log.restore();
    }

    // Reset lana for the next test
    delete window.lana;
  });

  it('Loads lana.js upon calling lana.log the first time', async () => {
    expect(window.lana?.log).not.to.exist;
    loadLana();
    expect(window.lana.log).to.exist;

    // Store the initial placeholder log function
    const initialLana = window.lana.log;

    // Spy on console.log before making the first call
    sinon.spy(console, 'log');

    // Call lana.log which should trigger dynamic import
    // This returns a Promise that resolves after the real lana.js is loaded
    await window.lana.log('test', { clientId: 'myclient', sampleRate: 0 });

    // After the import, window.lana.log should be replaced with the real implementation
    expect(window.lana.log).not.to.equal(initialLana);
    expect(window.lana.options).to.exist;
    expect(console.log.called).to.be.true;

    // Check the logging arguments
    const firstCallArgs = console.log.getCall(0).args;
    expect(firstCallArgs[0]).to.equal('LANA Msg: ');
    expect(firstCallArgs[1]).to.equal('test');
  });
});
