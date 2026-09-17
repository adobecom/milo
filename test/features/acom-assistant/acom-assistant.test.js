import sinon from 'sinon';
import { expect } from '@esm-bundle/chai';
import { setConfig } from '../../../libs/utils/utils.js';
import {
  loadAcomAssistant,
  sendAcomAssistantUserMessage,
  getAcomAssistantPrompts,
  openAcomAssistantChat,
  getAcomAssistantClient,
} from '../../../libs/features/acom-assistant.js';

describe('AcomAssistant shared client', () => {
  let loadScript;
  let loadStyle;
  let onReadyCallback;

  before(() => {
    setConfig({ env: { name: 'stage' }, locale: { ietf: 'en-US' } });
    window.AdobeMessagingExperienceClient = {
      initialize: sinon.spy((cfg) => { onReadyCallback = cfg.callbacks.onReadyCallback; }),
      reinitialize: sinon.spy(),
      sendUserMessage: sinon.spy(),
      getPrompts: sinon.stub().returns({ prompts: [] }),
      openMessagingWindow: sinon.spy(),
    };
    loadScript = sinon.stub().resolves();
    loadStyle = sinon.stub();
  });

  it('loads the script/CSS and calls initialize() exactly once across multiple callers', async () => {
    const first = loadAcomAssistant({ appid: 'surface-one' }, { loadScript, loadStyle });
    const second = loadAcomAssistant({ appid: 'surface-two' }, { loadScript, loadStyle });

    await Promise.all([first, second]);

    expect(loadScript.calledOnce).to.be.true;
    expect(window.AdobeMessagingExperienceClient.initialize.calledOnce).to.be.true;
    // second caller folds its config in via reinitialize() instead of a second initialize()
    expect(window.AdobeMessagingExperienceClient.reinitialize.calledOnce).to.be.true;
  });

  it('returns the resolved client synchronously via getAcomAssistantClient once loaded', () => {
    expect(getAcomAssistantClient()).to.equal(window.AdobeMessagingExperienceClient);
  });

  it('queues sendAcomAssistantUserMessage calls until onReadyCallback fires, then flushes in order', async () => {
    await sendAcomAssistantUserMessage({ label: 'queued while not ready' });
    expect(window.AdobeMessagingExperienceClient.sendUserMessage.called).to.be.false;

    onReadyCallback();

    expect(window.AdobeMessagingExperienceClient.sendUserMessage.calledOnceWith(
      { label: 'queued while not ready' },
    )).to.be.true;
  });

  it('sends immediately once ready', async () => {
    await sendAcomAssistantUserMessage({ label: 'sent live' });
    expect(window.AdobeMessagingExperienceClient.sendUserMessage.calledWith({ label: 'sent live' })).to.be.true;
  });

  it('is a no-op for an empty/missing label', async () => {
    const callsBefore = window.AdobeMessagingExperienceClient.sendUserMessage.callCount;
    await sendAcomAssistantUserMessage({});
    await sendAcomAssistantUserMessage();
    expect(window.AdobeMessagingExperienceClient.sendUserMessage.callCount).to.equal(callsBefore);
  });

  it('delegates getAcomAssistantPrompts/openAcomAssistantChat to the client', async () => {
    const prompts = await getAcomAssistantPrompts();
    expect(prompts).to.deep.equal({ prompts: [] });

    await openAcomAssistantChat({ sourceType: 'button' });
    expect(window.AdobeMessagingExperienceClient.openMessagingWindow.calledWith({ sourceType: 'button' })).to.be.true;
  });
});
