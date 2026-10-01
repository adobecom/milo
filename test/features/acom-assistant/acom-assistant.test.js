import sinon from 'sinon';
import { expect } from '@esm-bundle/chai';
import { setConfig } from '../../../libs/utils/utils.js';

describe('AcomAssistant shared client lifecycle', () => {
  let assistant;
  let client;
  let callbacks;
  let deps;
  let clock;
  let originalClient;
  let originalLana;

  beforeEach(async () => {
    assistant = await import(`../../../libs/features/acom-assistant.js?test=${crypto.randomUUID()}`);
    clock = sinon.useFakeTimers();
    setConfig({ env: { name: 'stage' }, locale: { ietf: 'en-US' } });
    originalClient = window.AdobeMessagingExperienceClient;
    originalLana = window.lana;
    window.lana = { log: sinon.spy() };
    client = {
      initialize: sinon.spy((config) => { callbacks = config.callbacks; }),
      reinitialize: sinon.stub().callsFake(() => {
        callbacks.initCallback({ releaseControl: { showAdobeMessaging: true } });
        callbacks.onReadyCallback();
        return { status: 'success', type: 'init_started' };
      }),
      sendUserMessage: sinon.spy(),
      openMessagingWindow: sinon.spy(),
      getPrompts: sinon.stub().returns({ prompts: [] }),
    };
    window.AdobeMessagingExperienceClient = client;
    deps = { loadScript: sinon.stub().resolves(), loadStyle: sinon.stub() };
  });

  afterEach(() => {
    clock.restore();
    window.AdobeMessagingExperienceClient = originalClient;
    window.lana = originalLana;
    sinon.restore();
  });

  async function start() {
    await assistant.loadAcomAssistant({ appid: 'surface-one' }, deps);
  }

  function ready() {
    callbacks.initCallback({ releaseControl: { showAdobeMessaging: true } });
    callbacks.onReadyCallback();
  }

  async function expectError(promise, message) {
    let error;
    try {
      await promise;
    } catch (caught) {
      error = caught;
    }
    expect(error).to.be.instanceOf(Error);
    expect(error.message).to.include(message);
  }

  it('initializes once and coalesces concurrent configuration updates', async () => {
    const first = assistant.loadAcomAssistant({ appid: 'surface-one' }, deps);
    const second = assistant.loadAcomAssistant({ appid: 'surface-two' }, deps);
    const third = assistant.loadAcomAssistant({
      appid: 'surface-three',
      context: { userData: { source: 'footer' } },
    }, deps);
    await first;
    expect(client.initialize.calledOnce).to.be.true;
    expect(client.reinitialize.called).to.be.false;

    ready();
    await Promise.all([second, third]);

    expect(deps.loadScript.calledOnce).to.be.true;
    expect(client.reinitialize.calledOnce).to.be.true;
    expect(client.reinitialize.firstCall.args[0].appid).to.equal('surface-three');
    expect(client.reinitialize.firstCall.args[0].context.userData.source).to.equal('footer');
    expect(assistant.getAcomAssistantClient()).to.equal(client);
  });

  it('queues messages until the real readiness callback and flushes in order', async () => {
    await start();
    await assistant.sendAcomAssistantUserMessage({ label: 'first' });
    await assistant.sendAcomAssistantUserMessage({ label: 'second' });
    expect(client.sendUserMessage.called).to.be.false;

    ready();
    expect(client.sendUserMessage.args).to.deep.equal([[{ label: 'first' }], [{ label: 'second' }]]);
    await assistant.sendAcomAssistantUserMessage({ label: 'live' });
    expect(client.sendUserMessage.lastCall.args[0]).to.deep.equal({ label: 'live' });
  });

  it('does not send empty messages', async () => {
    await start();
    ready();
    await assistant.sendAcomAssistantUserMessage({});
    await assistant.sendAcomAssistantUserMessage();
    expect(client.sendUserMessage.called).to.be.false;
  });

  it('opens only after the real readiness callback', async () => {
    await start();
    const opening = assistant.openAcomAssistantChat({ sourceType: 'button' });
    await clock.tickAsync(29999);
    expect(client.openMessagingWindow.called).to.be.false;

    ready();
    await opening;
    expect(client.openMessagingWindow.calledOnceWith({ sourceType: 'button' })).to.be.true;
    expect(await assistant.getAcomAssistantPrompts()).to.deep.equal({ prompts: [] });
    expect(clock.countTimers()).to.equal(0);
  });

  it('rejects readiness timeout instead of opening an unready iframe', async () => {
    await start();
    callbacks.initCallback({});
    const failure = expectError(assistant.openAcomAssistantChat({}), 'readiness timed out');
    await clock.tickAsync(30000);
    await failure;
    expect(client.openMessagingWindow.called).to.be.false;
    expect(window.lana.log.called).to.be.true;

    callbacks.onReadyCallback();
    await expectError(assistant.openAcomAssistantChat({}), 'readiness timed out');
    expect(client.openMessagingWindow.called).to.be.false;
  });

  it('never reinitializes after an initialization timeout', async () => {
    await start();
    const failure = expectError(
      assistant.loadAcomAssistant({ appid: 'surface-two' }, deps),
      'readiness timed out',
    );
    await clock.tickAsync(30000);
    await failure;
    expect(client.reinitialize.called).to.be.false;
    expect(client.initialize.calledOnce).to.be.true;
  });

  it('rejects initialization errors and discards queued messages', async () => {
    await start();
    await assistant.sendAcomAssistantUserMessage({ label: 'queued' });
    const failure = expectError(assistant.openAcomAssistantChat({}), 'init failed');
    callbacks.initErrorCallback('invalid_appid');
    await failure;
    callbacks.onReadyCallback();
    expect(client.sendUserMessage.called).to.be.false;
    expect(client.openMessagingWindow.called).to.be.false;
    expect(window.lana.log.called).to.be.true;
  });

  it('handles a rejected SDK initialize promise without false readiness', async () => {
    client.initialize = sinon.stub().rejects(new Error('SDK initialization failed'));
    await start();
    await expectError(assistant.openAcomAssistantChat({}), 'SDK initialization failed');
    expect(client.openMessagingWindow.called).to.be.false;
  });

  it('logs synchronous SDK initialization failures', async () => {
    client.initialize = sinon.stub().throws(new Error('invalid configuration'));
    await expectError(assistant.loadAcomAssistant({ appid: 'surface-one' }, deps), 'invalid configuration');
    expect(window.lana.log.called).to.be.true;
    expect(client.openMessagingWindow.called).to.be.false;
    await clock.tickAsync(0);
    expect(clock.countTimers()).to.equal(0);
  });

  it('rejects blocked SDK initialization results', async () => {
    client.initialize = sinon.stub().returns({ status: 'blocked', type: 'init_in_progress' });
    await start();
    await expectError(assistant.openAcomAssistantChat({}), 'init_in_progress');
    expect(client.openMessagingWindow.called).to.be.false;
  });

  it('logs script-load errors and permits a subsequent load retry', async () => {
    deps.loadScript.rejects(new Error('script failed'));
    await expectError(assistant.loadAcomAssistant({ appid: 'surface-one' }, deps), 'script failed');
    expect(window.lana.log.called).to.be.true;
    expect(client.initialize.called).to.be.false;

    deps.loadScript.resolves();
    await start();
    expect(client.initialize.calledOnce).to.be.true;
  });

  it('times out a hanging script load without initializing the client', async () => {
    deps.loadScript.returns(new Promise(() => {}));
    const failure = expectError(
      assistant.loadAcomAssistant({ appid: 'surface-one' }, deps),
      'script load timed out',
    );
    await clock.tickAsync(5000);
    await failure;
    expect(client.initialize.called).to.be.false;
  });

  it('rejects a loaded script with a missing client global and permits retry', async () => {
    delete window.AdobeMessagingExperienceClient;
    const failure = expectError(
      assistant.loadAcomAssistant({ appid: 'surface-one' }, deps),
      'did not expose',
    );
    await clock.tickAsync(5000);
    await failure;
    window.AdobeMessagingExperienceClient = client;
    await start();
    expect(client.initialize.calledOnce).to.be.true;
  });

  it('waits for pending reinitialization before opening or sending', async () => {
    await start();
    ready();
    let finish;
    client.reinitialize.returns(new Promise((resolve) => {
      finish = () => { ready(); resolve(); };
    }));
    const updating = assistant.loadAcomAssistant({ appid: 'surface-two' }, deps);
    await clock.tickAsync(0);
    const opening = assistant.openAcomAssistantChat({});
    const sending = assistant.sendAcomAssistantUserMessage({ label: 'after update' });
    await clock.tickAsync(0);
    expect(client.openMessagingWindow.called).to.be.false;
    expect(client.sendUserMessage.called).to.be.false;

    finish();
    await Promise.all([updating, opening, sending]);
    expect(client.openMessagingWindow.calledOnce).to.be.true;
    expect(client.sendUserMessage.calledOnce).to.be.true;
  });

  it('serializes updates arriving while reinitialization is in progress', async () => {
    await start();
    ready();
    let finish;
    client.reinitialize.onFirstCall().returns(new Promise((resolve) => {
      finish = () => { ready(); resolve(); };
    }));
    const first = assistant.loadAcomAssistant({ appid: 'surface-two' }, deps);
    await clock.tickAsync(0);
    const second = assistant.loadAcomAssistant({ appid: 'surface-three' }, deps);
    await clock.tickAsync(0);
    expect(client.reinitialize.calledOnce).to.be.true;
    finish();
    await Promise.all([first, second]);
    expect(client.reinitialize.calledTwice).to.be.true;
    expect(client.reinitialize.secondCall.args[0].appid).to.equal('surface-three');
  });

  it('blocks opening after a rejected configuration update', async () => {
    await start();
    ready();
    client.reinitialize.resolves({ status: 'blocked', type: 'init_in_progress' });
    await expectError(
      assistant.loadAcomAssistant({ appid: 'surface-two' }, deps),
      'init_in_progress',
    );
    await expectError(assistant.openAcomAssistantChat({}), 'init_in_progress');
    expect(client.openMessagingWindow.called).to.be.false;
  });

  it('blocks opening when the SDK configuration update rejects', async () => {
    await start();
    ready();
    client.reinitialize.rejects(new Error('update failed'));
    await expectError(assistant.loadAcomAssistant({ appid: 'surface-two' }, deps), 'update failed');
    await expectError(assistant.openAcomAssistantChat({}), 'update failed');
    expect(client.openMessagingWindow.called).to.be.false;
    expect(window.lana.log.called).to.be.true;
  });

  it('times out a hanging configuration update', async () => {
    await start();
    ready();
    client.reinitialize.returns(new Promise(() => {}));
    const failure = expectError(
      assistant.loadAcomAssistant({ appid: 'surface-two' }, deps),
      'reinitialization timed out',
    );
    await clock.tickAsync(30000);
    await failure;
    await expectError(assistant.openAcomAssistantChat({}), 'timed out');
    expect(client.openMessagingWindow.called).to.be.false;
  });

  it('preserves the existing per-click identity contract', async () => {
    await start();
    expect(callbacks.getContextCallback().appid).to.equal('surface-one');
    assistant.setAcomAssistantIdentity({ appid: 'jarvis-x', appver: '9.9' });
    expect(callbacks.getContextCallback()).to.deep.equal({ appid: 'jarvis-x', appver: '9.9' });
    assistant.setAcomAssistantIdentity({ appid: 'bc-adobedotcom2', appver: '1.0' });
    expect(callbacks.getContextCallback()).to.deep.equal({ appid: 'bc-adobedotcom2', appver: '1.0' });
  });

  it('waits for callbacks after a synchronous reinitialize acknowledgement', async () => {
    await start();
    ready();
    client.reinitialize.returns({ status: 'success', type: 'init_started' });
    const updating = assistant.loadAcomAssistant({ appid: 'surface-two' }, deps);
    await clock.tickAsync(0);
    const opening = assistant.openAcomAssistantChat({});
    await clock.tickAsync(0);
    expect(client.openMessagingWindow.called).to.be.false;

    callbacks.initCallback({});
    await clock.tickAsync(0);
    expect(client.openMessagingWindow.called).to.be.false;

    callbacks.onReadyCallback();
    await Promise.all([updating, opening]);
    expect(client.openMessagingWindow.calledOnce).to.be.true;
  });
});
