import sinon from 'sinon';
import { expect } from '@esm-bundle/chai';
import loadDelayed, { loadPrivacy, loadJarvisChat } from '../../libs/scripts/delayed.js';
import { setConfig } from '../../libs/utils/utils.js';

describe('Delayed', () => {
  it('should load privacy feature', async () => {
    expect(loadPrivacy).to.exist;
    setConfig({ privacyId: '7a5eb705-95ed-4cc4-a11d-0cc5760e93db' });
    document.body.innerHTML = '<footer><a href="https://www.adobe.com/#openPrivacy" id="privacy-link">Cookie preferences</a></footer>';
    await loadPrivacy();
    window.adobePrivacy = { showPreferenceCenter: sinon.stub() };
    document.getElementById('privacy-link')?.click();
    expect(window.adobePrivacy.showPreferenceCenter.called).to.be.true;
  });

  it('should load jarvis feature', async () => {
    expect(loadJarvisChat).to.exist;
    loadJarvisChat();
  });

  it('should load interlinks logic', async () => {
    const clock = sinon.useFakeTimers({ toFake: ['setTimeout'] });
    document.querySelector('head')?.insertAdjacentHTML('beforeend', '<meta name="interlinks" content="on">');
    loadDelayed().then((module) => {
      expect(module).to.exist;
      expect(typeof module === 'object').to.equal(true);
    });
    await clock.runAllAsync();
    clock.restore();
  });

  it('should skip load interlinks logic when metadata is off', async () => {
    const clock = sinon.useFakeTimers({ toFake: ['setTimeout'] });
    document.head.querySelector('meta[name="interlinks"]')?.remove();
    loadDelayed().then((module) => {
      expect(module == null).to.equal(true);
    });
    await clock.runAllAsync();
    clock.restore();
  });
});
