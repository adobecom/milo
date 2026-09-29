import sinon from 'sinon';
import { expect } from '@esm-bundle/chai';
import { initAcomAssistantGnavLink } from '../../../libs/features/acom-assistant-gnav-link.js';

describe('AcomAssistant GNav link identity', () => {
  it('reports the Jarvis link\'s own identity via getContextCallback when clicked, without owning the base initialize() config', async () => {
    let capturedInitConfig;
    window.AdobeMessagingExperienceClient = {
      initialize: sinon.spy((cfg) => {
        capturedInitConfig = cfg;
        cfg.callbacks?.initCallback?.({ releaseControl: { showAdobeMessaging: true } });
      }),
    };

    document.body.innerHTML = `<div class="global-footer">
      <a href="#open-jarvis-chat" data-jarvis-config='{"jarvis-surface-id":"footer-jarvis","jarvis-surface-version":"2.0"}'>Contact us</a>
    </div>`;

    const config = { jarvis: { id: 'default-jarvis', version: '1.0', onDemand: true } };
    const loadScript = sinon.stub().resolves();
    const loadStyle = sinon.stub();
    const getMetadata = sinon.stub().returns(undefined);

    await initAcomAssistantGnavLink(config, loadScript, loadStyle, getMetadata);

    document.querySelector('a[href*="#open-jarvis-chat"]').click();
    await new Promise((resolve) => { setTimeout(resolve, 0); });

    expect(window.AdobeMessagingExperienceClient.initialize.calledOnce).to.be.true;

    const context = capturedInitConfig.callbacks.getContextCallback();
    expect(context.appid === 'footer-jarvis' && context.appver === '2.0').to.be.true;
  });
});
