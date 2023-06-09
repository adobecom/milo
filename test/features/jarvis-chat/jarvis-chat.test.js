/* eslint-disable no-underscore-dangle */
import sinon from 'sinon';
import { expect } from '@esm-bundle/chai';
import { readFile } from '@web/test-runner-commands';
import { initJarvisChat, openChat } from '../../../libs/features/jarvis-chat.js';
import { setConfig, getConfig } from '../../../libs/utils/utils.js';

const defaultConfig = {
  jarvis: {
    id: 'milo',
    version: '1.0',
  },
};

describe('Jarvis Chat', () => {
  let initializeSpy;
  let openMessagingWindowSpy;
  let isAdobeMessagingClientInitializedStub;
  let getMessagingExperienceStateStub;
  beforeEach(() => {
    window.AdobeMessagingExperienceClient = window.AdobeMessagingExperienceClient
      || {
        initialize: () => {},
        openMessagingWindow: () => {},
        isAdobeMessagingClientInitialized: () => {},
        getMessagingExperienceState: () => {},
      };
    initializeSpy = sinon.spy(window.AdobeMessagingExperienceClient, 'initialize');
    openMessagingWindowSpy = sinon.spy(window.AdobeMessagingExperienceClient, 'openMessagingWindow');
    isAdobeMessagingClientInitializedStub = sinon.stub(window.AdobeMessagingExperienceClient, 'isAdobeMessagingClientInitialized').returns(true);
    getMessagingExperienceStateStub = sinon.stub(window.AdobeMessagingExperienceClient, 'getMessagingExperienceState').returns({ windowState: 'hidden' });
  });

  afterEach(() => {
    initializeSpy.restore();
    openMessagingWindowSpy.restore();
    isAdobeMessagingClientInitializedStub.restore();
    getMessagingExperienceStateStub.restore();
  });

  it('should not initialize when configuration is not available', async () => {
    setConfig({});
    const config = getConfig();
    await initJarvisChat(config, sinon.stub(), sinon.stub());
    expect(initializeSpy.called).to.be.false;
  });

  it('should initialize when configuration is available', async () => {
    setConfig(defaultConfig);
    const config = getConfig();
    await initJarvisChat(config, sinon.stub(), sinon.stub());
    expect(initializeSpy.called).to.be.true;
  });

  it('should receive the correct configuration', async () => {
    setConfig(defaultConfig);
    const config = Object.assign(getConfig(), {
      locale: {
        ietf: 'en',
        prefix: '/africa',
      },
    });
    await initJarvisChat(config, sinon.stub(), sinon.stub());
    const args = initializeSpy.getCall(0).args[0];
    expect(args.appid).to.equal(config.jarvis.id);
    expect(args.appver).to.equal(config.jarvis.version);
    expect(args.env).to.equal(config.env.name === 'prod' ? 'prod' : 'stage');
    expect(args.accessToken).to.be.undefined;
    expect(args.language).to.equal('en');
    expect(args.region).to.equal('africa');
  });

  it('should open a chat session upon click', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/jarvis-chat.html' });
    setConfig(defaultConfig);
    const config = getConfig();
    await initJarvisChat(config, sinon.stub(), sinon.stub());
    const args = initializeSpy.getCall(0).args[0];
    args.callbacks.initCallback({ releaseControl: { showAdobeMessaging: true } });
    openMessagingWindowSpy.resetHistory();
    document.body.querySelector('a').click();
    expect(openMessagingWindowSpy.called).to.be.true;
    openMessagingWindowSpy.resetHistory();
    openChat();
    expect(openMessagingWindowSpy.called).to.be.true;
    document.body.innerHTML = '';
  });

  it('should synchronize analytics', async () => {
    setConfig(defaultConfig);
    const config = getConfig();
    await initJarvisChat(config, sinon.stub(), sinon.stub());
    const args = initializeSpy.getCall(0).args[0];

    const iconRender = await readFile({ path: './mocks/sendChatIconRenderEvent.json' });
    window.digitalData = window.digitalData || {};
    window.alloy_all = window.digitalData || {};
    window._satellite = window._satellite || { track: sinon.spy() };
    window._satellite.track.resetHistory();
    args.callbacks.analyticsCallback(JSON.parse(iconRender));
    expect(window.digitalData.primaryEvent.eventInfo.eventName).to.equal('chat:init:launch:event.subtype:icon:render');
    expect(window.digitalData.chat.chatInfo.chatType).to.equal('render');
    expect(window._satellite.track.called).to.be.true;

    const iconClick = await readFile({ path: './mocks/sendChatIconClickEvent.json' });
    window._satellite.track.resetHistory();
    args.callbacks.analyticsCallback(JSON.parse(iconClick));
    expect(window.digitalData.primaryEvent.eventInfo.eventName).to.equal('chat:init:launch:event.subtype:icon:click');
    expect(window.digitalData.chat.chatInfo.chatType).to.equal('click');
    expect(window._satellite.track.called).to.be.true;

    const product = await readFile({ path: './mocks/sendProductEvent.json' });
    window._satellite.track.resetHistory();
    args.callbacks.analyticsCallback(JSON.parse(product));
    expect(window.digitalData.primaryEvent.eventInfo.eventName).to.equal('chat:product:auth-subproduct:sub:type');
    expect(window.digitalData.chat.chatInfo.primaryProduct.productName).to.equal('sub');
    expect(window._satellite.track.called).to.be.true;

    window.digitalData = { sophiaResponse: { fromPage: 'test2' } };
    const survey = await readFile({ path: './mocks/sendSurveyFeedbackEvent.json' });
    window._satellite.track.resetHistory();
    args.callbacks.analyticsCallback(JSON.parse(survey));
    expect(window.digitalData.primaryEvent.eventInfo.eventName).to.equal('chat:survey:5-star-survey:test:type:id');
    expect(window._satellite.track.called).to.be.true;

    const error = await readFile({ path: './mocks/sendChatErrorEvent.json' });
    window._satellite.track.resetHistory();
    args.callbacks.analyticsCallback(JSON.parse(error));
    expect(window.digitalData.chat.chatInfo.chatErrorCode).to.equal('x');
    expect(window.digitalData.chat.chatInfo.chatErrorType).to.equal('init');
    expect(window._satellite.track.called).to.be.true;

    window.digitalData = { sophiaResponse: { fromPage: [{ variationId: '2', campaignId: '3' }] } };
    const def = await readFile({ path: './mocks/sendPrimaryEvent.json' });
    window._satellite.track.resetHistory();
    args.callbacks.analyticsCallback(JSON.parse(def));
    expect(window.digitalData.chat.chatInfo.chatType).to.equal('default');
    expect(window.digitalData.sophiaResponse.fromPage.length).to.equal(2);
    expect(window._satellite.track.called).to.be.true;

    window.digitalData = {};
    window.alloy_all = {};
  });

  it('should initialize on demand when configured', async () => {
    setConfig(defaultConfig);
    const config = getConfig();
    await initJarvisChat(config, sinon.stub(), sinon.stub());
    const args = initializeSpy.getCall(0).args[0];
    // Set uninitialized state
    args.callbacks.initCallback({ releaseControl: { showAdobeMessaging: false } });
    initializeSpy.resetHistory();

    config.jarvis.onDemand = true;
    document.body.innerHTML = await readFile({ path: './mocks/jarvis-chat.html' });
    await initJarvisChat(config, sinon.stub(), sinon.stub());
    expect(initializeSpy.called).to.be.false;
    document.querySelector('a').click();
    await new Promise((resolve) => {
      setTimeout(resolve, 1);
    });
    expect(initializeSpy.called).to.be.true;
    const params = initializeSpy.getCall(0).args[0];
    params.callbacks.initCallback({ releaseControl: { showAdobeMessaging: true } });
    params.callbacks.onReadyCallback();
    expect(openMessagingWindowSpy.called).to.be.true;
  });
});
