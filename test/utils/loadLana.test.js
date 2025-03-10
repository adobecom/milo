import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { waitFor } from '../helpers/waitfor.js';
import { loadLana } from '../../libs/utils/utils.js';

describe('Utils loadLana', () => {
  let originalLocation;
  
  beforeEach(() => {
    originalLocation = window.location.href;
  });
  
  afterEach(() => {
    // Reset URL if it was changed
    if (window.location.href !== originalLocation) {
      window.history.pushState({}, '', originalLocation);
    }
  });
  
  it('Loads lana.js upon calling lana.log the first time', async () => {
    expect(window.lana?.log).not.to.exist;
    loadLana();
    expect(window.lana.log).to.exist;

    const initialLana = window.lana.log;
    sinon.spy(console, 'log');
    await window.lana.log('test', { clientId: 'myclient', sampleRate: 0, severity: 'i' });
    await waitFor(() => initialLana !== window.lana.log);

    expect(window.lana.options).to.exist;
    expect(console.log.args[0][0]).to.equal('LANA Msg: ');
    expect(console.log.args[0][1]).to.equal('test');
    console.log.restore();

    sinon.spy(console, 'log');
    await window.lana.log('test2', { clientId: 'myclient', sampleRate: 0, severity: 'i' });
    expect(console.log.args[0][0]).to.equal('LANA Msg: ');
    expect(console.log.args[0][1]).to.equal('test2');
    console.log.restore();
  });
  
  it('Uses debug severity when lanadebug URL parameter is present', async () => {
    // Set up URL with lanadebug parameter
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('lanadebug', 'true');
    window.history.pushState({}, '', newUrl.toString());
    
    // Reset lana
    delete window.lana;
    
    // Re-initialize
    loadLana();
    expect(window.lana).to.exist;
    
    const initialLana = window.lana.log;
    sinon.spy(console, 'log');
    
    // Call without specifying severity
    await window.lana.log('debug test', { clientId: 'myclient', sampleRate: 100 });
    await waitFor(() => initialLana !== window.lana.log);
    
    // Based on the format of console output in the other tests
    expect(console.log.args[0][0]).to.equal('LANA Msg: ');
    expect(console.log.args[0][1]).to.equal('debug test');
    
    // The third argument is the '\nOpts:' string
    expect(console.log.args[0][2]).to.equal('\nOpts:');
    
    // The fourth argument is the options object
    const options = console.log.args[0][3];
    expect(options).to.have.property('severity', 'd');
    
    console.log.restore();
  });
  
  it('Explicit severity overrides debug mode default in lazy-loaded Lana', async () => {
    // Set up URL with lanadebug parameter
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('lanadebug', 'true');
    window.history.pushState({}, '', newUrl.toString());
    
    // Reset lana
    delete window.lana;
    
    // Re-initialize
    loadLana();
    expect(window.lana).to.exist;
    
    const initialLana = window.lana.log;
    sinon.spy(console, 'log');
    
    // Call with explicitly specified severity
    await window.lana.log('explicit severity test', { 
      clientId: 'myclient', 
      sampleRate: 100,
      severity: 'w'  // Explicitly set to warning
    });
    await waitFor(() => initialLana !== window.lana.log);
    
    // Verify the options contain the explicit severity, not debug severity
    const options = console.log.args[0][3];
    expect(options).to.have.property('severity', 'w');
    
    console.log.restore();
  });
});
