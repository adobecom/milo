import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { stub, useFakeTimers, restore, spy } from 'sinon';
import loadBlock from '../../libs/navigation/bootstrapper.js';
import fetchedFooter from '../blocks/global-footer/mocks/fetched-footer.js';
import placeholders from '../blocks/global-navigation/mocks/placeholders.js';
import { setConfig } from '../../libs/utils/utils.js';
import { mockRes } from '../blocks/global-navigation/test-utilities.js';

document.body.innerHTML = await readFile({ path: './mocks/body.html' });

const blockConfig = {
  footer: {
    name: 'global-footer',
    targetEl: 'footer',
    appendType: 'append',
  },
  header: {
    name: 'global-navigation',
    targetEl: 'header',
    appendType: 'prepend',
    unav: { unavComponents: 'profile' },
  },
};

const miloLibs = 'http://localhost:2000/libs';

describe('Bootstrapper', async () => {
  let initializeSpy;
  let openMessagingWindowSpy;
  let isAdobeMessagingClientInitializedStub;
  let getMessagingExperienceStateStub;
  beforeEach(async () => {
    stub(window, 'fetch').callsFake(async (url) => {
      if (url.includes('/footer')) {
        return mockRes({
          payload: fetchedFooter(
            { regionPickerHash: '/fragments/regions#langnav' },
          ),
        });
      }
      if (url.includes('/placeholders')) return mockRes({ payload: placeholders });
      if (url.includes('/footer.plain.html')) return mockRes({ payload: await readFile({ path: '../blocks/region-nav/mocks/regions.html' }) });
      if (url.includes('/gnav.plain.html')) return mockRes({ payload: await readFile({ path: './mocks/gnav.html' }) });

      return null;
    });
    window.AdobeMessagingExperienceClient = window.AdobeMessagingExperienceClient
      || {
        initialize: () => {},
        openMessagingWindow: () => {},
        isAdobeMessagingClientInitialized: () => {},
        getMessagingExperienceState: () => {},
      };
    initializeSpy = spy(window.AdobeMessagingExperienceClient, 'initialize');
    openMessagingWindowSpy = spy(window.AdobeMessagingExperienceClient, 'openMessagingWindow');
    isAdobeMessagingClientInitializedStub = stub(window.AdobeMessagingExperienceClient, 'isAdobeMessagingClientInitialized').returns(true);
    getMessagingExperienceStateStub = stub(window.AdobeMessagingExperienceClient, 'getMessagingExperienceState').returns({ windowState: 'hidden' });
    setConfig({ miloLibs, contentRoot: '/federal/dev' });
  });

  afterEach(() => {
    restore();
  });

  it('Renders the footer block', async () => {
    await loadBlock(miloLibs, blockConfig.footer);
    const clock = useFakeTimers({
      toFake: ['setTimeout'],
      shouldAdvanceTime: true,
    });
    clock.tick(3000);
    const el = document.getElementsByTagName('footer');
    expect(el).to.exist;
  });

  it('Renders the header block', async () => {
    await loadBlock(miloLibs, blockConfig.header);
    const el = document.getElementsByTagName('header');
    expect(el).to.exist;
  });

  it('should call openMessagingWindow when click on jarvis enabled button', async () => {
    await loadBlock(miloLibs, blockConfig.header);
    const el = document.querySelector('.feds-cta[href*="#open-jarvis-chat"]');
    const event = new CustomEvent('click', { bubbles: true });
    el.dispatchEvent(event);
    expect(openMessagingWindowSpy.called).to.be.true;
  });
});
