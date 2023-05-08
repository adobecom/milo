import sinon from 'sinon';
import { expect } from '@esm-bundle/chai';
import initJarvisChat from '../../../libs/features/jarvis-chat.js';
import { setConfig, getConfig, loadStyle, loadScript } from '../../../libs/utils/utils.js';

const defaultConfig = {
  jarvis: {
    id: 'milo',
    version: '1.0',
  },
};

describe('Jarvis Chat', () => {
  // it('should not initialize when configuration is not available', () => {
  //   setConfig({});
  //   const config = getConfig();
  //   initJarvisChat(config, loadScript, loadStyle);
  //   expect(window.AdobeMessagingExperienceClient.initialize.called).to.be.false;
  // });

  it('should initialize when configuration is available', () => {
    setConfig(defaultConfig);
    const config = getConfig();
    window.AdobeMessagingExperienceClient = { initialize: sinon.stub() };
    initJarvisChat(config, loadScript, loadStyle);
    expect(window.AdobeMessagingExperienceClient.initialize.called).to.be.true;
  });
});
