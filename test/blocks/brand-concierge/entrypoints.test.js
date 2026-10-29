import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { setConfig } from '../../../libs/utils/utils.js';
import { waitFor, waitForElement, delay } from '../../helpers/waitfor.js';
import initPanel, { openChatPanel, closeChatPanel } from '../../../libs/features/chat-panel/chat-panel.js';
import initMilo from '../../../libs/blocks/brand-concierge/brand-concierge.js';
import initC2 from '../../../libs/c2/blocks/brand-concierge/brand-concierge.js';
import initMiloGlobal from '../../../libs/blocks/brand-concierge-global/brand-concierge-global.js';
import initC2Global from '../../../libs/c2/blocks/brand-concierge-global/brand-concierge-global.js';

describe('acom-assistant-panel persistent chat panel', () => {
  let client;
  let options;
  let originalUrl;
  let panelMeta;

  beforeEach(() => {
    options = undefined;
    originalUrl = window.location.href;
    document.body.innerHTML = '';
    document.body.classList.remove('chat-panel-open');
    localStorage.removeItem('bc-side-overlay');
    panelMeta = document.createElement('meta');
    panelMeta.name = 'acom-assistant-panel';
    panelMeta.content = 'on';
    document.head.append(panelMeta);
    setConfig({ codeRoot: '/libs', brandConciergeAA: 'testAA', jarvis: { id: 'bc-test', version: '1.0' } });
    client = {
      supportsEmbeddedPanel: true,
      initialize: sinon.stub().callsFake((config) => {
        options = config;
        queueMicrotask(() => {
          config.callbacks.initCallback({ releaseControl: { showAdobeMessaging: true } });
          config.callbacks.onReadyCallback();
        });
        return { status: 'success', type: 'init_started' };
      }),
      getMessagingExperienceState: sinon.stub().returns({ embedded: true }),
      openMessagingWindow: sinon.spy(),
      closeMessageWindow: sinon.spy(),
      sendUserMessage: sinon.stub().returns(true),
      handleSignOut: sinon.spy(),
      updateAccessToken: sinon.spy(),
    };
    const append = document.head.append.bind(document.head);
    sinon.stub(document.head, 'append').callsFake((...elements) => {
      elements.forEach((element) => {
        if (element.tagName === 'SCRIPT' && element.src.startsWith('https://')) {
          window.AdobeMessagingExperienceClient = client;
          setTimeout(() => element.dispatchEvent(new Event('load')), 0);
        } else {
          append(element);
        }
      });
    });
    const appendChild = document.head.appendChild.bind(document.head);
    sinon.stub(document.head, 'appendChild').callsFake((element) => {
      if (element.tagName === 'LINK' && element.href.startsWith('https://')) {
        queueMicrotask(() => element.dispatchEvent(new Event('load')));
        return element;
      }
      return appendChild(element);
    });
  });

  afterEach(() => {
    closeChatPanel();
    window.history.replaceState({}, '', originalUrl);
    panelMeta.remove();
    document.body.innerHTML = '';
    localStorage.removeItem('bc-side-overlay');
    delete window.AdobeMessagingExperienceClient;
    delete window.milo;
    document.querySelectorAll('script[src*="client.messaging.adobe.com"]').forEach((el) => el.remove());
    sinon.restore();
  });

  async function expectOpen(message) {
    await waitFor(() => document.body.classList.contains('chat-panel-open') && client.initialize.called);
    const panel = document.getElementById('chat-panel');
    expect(document.querySelectorAll('#chat-panel').length).to.equal(1);
    expect(document.querySelectorAll('#brand-concierge-mount').length).to.equal(1);
    expect(document.querySelector('.dialog-modal')).to.be.null;
    expect(options.mountSelector).to.equal('#brand-concierge-mount');
    if (message) {
      await waitFor(() => client.sendUserMessage.calledWith({ label: message }));
    } else {
      await waitFor(() => client.openMessagingWindow.called);
    }
    return panel;
  }

  [
    { name: 'Milo', init: initMilo, initGlobal: initMiloGlobal },
    { name: 'C2', init: initC2, initGlobal: initC2Global },
  ].forEach((foundation) => {
    describe(foundation.name, () => {
      ['inline', 'hero', 'marquee', 'floating-input-only'].forEach((variant) => {
        ['send button', 'Enter', 'prompt card'].forEach((entrypoint) => {
          it(`opens the panel from the ${variant} ${entrypoint}`, async () => {
            document.body.innerHTML = await readFile({ path: variant === 'marquee' ? './mocks/marquee.html' : './mocks/default.html' });
            const block = document.querySelector('.brand-concierge');
            block.className = `brand-concierge ${variant}`;
            await foundation.init(block);

            let message;
            if (entrypoint === 'prompt card') {
              const card = block.querySelector('.prompt-card-button');
              message = card.textContent.trim();
              card.click();
            } else {
              message = `${variant} ${entrypoint}`;
              const input = block.querySelector('textarea');
              input.value = message;
              input.dispatchEvent(new Event('input'));
              if (entrypoint === 'Enter') {
                input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
              } else {
                block.querySelector('.input-field-button').click();
              }
            }
            await expectOpen(message);
          });
        });
      });

      it('opens from a floating button and preserves the conversation on reopen', async () => {
        document.body.innerHTML = await readFile({ path: './mocks/floating-button.html' });
        const block = document.querySelector('.brand-concierge');
        await foundation.init(block);
        block.querySelector('.bc-floating-button-container').click();
        const panel = await expectOpen();
        const mount = panel.querySelector('#brand-concierge-mount');
        mount.textContent = 'Existing conversation';

        panel.querySelector('.chat-panel-close').click();
        expect(document.body.classList.contains('chat-panel-open')).to.be.false;
        expect(client.closeMessageWindow.calledOnce).to.be.true;
        block.querySelector('.bc-floating-button-container').click();
        await expectOpen();
        expect(document.getElementById('chat-panel')).to.equal(panel);
        expect(mount.textContent).to.equal('Existing conversation');
        expect(client.initialize.calledOnce).to.be.true;
      });

      it('uses the navigation panel for inline prompts on the same page', async () => {
        document.body.innerHTML = await readFile({ path: '../brand-concierge-global/mocks/default.html' });
        await foundation.initGlobal(document.querySelector('.brand-concierge-global'));
        const gnav = await waitForElement('.bc-gnav');
        gnav.querySelector('.gnav-button').click();
        const panel = await expectOpen();
        const mount = panel.querySelector('#brand-concierge-mount');
        mount.textContent = 'Existing conversation';

        const content = document.createElement('div');
        content.innerHTML = await readFile({ path: './mocks/default.html' });
        const block = content.querySelector('.brand-concierge');
        document.body.append(block);
        await foundation.init(block);
        block.querySelector('.prompt-card-button').click();
        await expectOpen('Prompt one');
        expect(document.getElementById('chat-panel')).to.equal(panel);
        expect(mount.textContent).to.equal('Existing conversation');
        expect(client.initialize.calledOnce).to.be.true;
      });

      ['navigation button', 'send button', 'Enter', 'prompt card'].forEach((entrypoint) => {
        it(`opens from the global ${entrypoint}`, async () => {
          document.body.innerHTML = await readFile({ path: '../brand-concierge-global/mocks/default.html' });
          await foundation.initGlobal(document.querySelector('.brand-concierge-global'));
          const gnav = await waitForElement('.bc-gnav');
          let message;
          if (entrypoint === 'navigation button') {
            gnav.querySelector('.gnav-button').click();
          } else if (entrypoint === 'prompt card') {
            const card = gnav.querySelector('.prompt-card-button');
            message = card.textContent.trim();
            card.click();
          } else {
            message = `Global ${entrypoint}`;
            const input = gnav.querySelector('textarea');
            input.value = message;
            input.dispatchEvent(new Event('input'));
            if (entrypoint === 'Enter') {
              input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
            } else {
              gnav.querySelector('.input-field-button').click();
            }
          }
          const panel = await expectOpen(message);
          expect(gnav.classList.contains('has-chat-history')).to.be.true;
          gnav.querySelector('.gnav-button').click();
          await delay(0);
          expect(document.getElementById('chat-panel')).to.equal(panel);
          expect(document.body.classList.contains('chat-panel-open')).to.be.true;
          expect(client.initialize.calledOnce).to.be.true;
        });
      });
    });
  });

  it('waits for initialization and coalesces simultaneous first opens', async () => {
    document.querySelector('link[href="/libs/features/chat-panel/chat-panel.css"]')?.remove();
    document.head.appendChild.restore();
    const appendChild = document.head.appendChild.bind(document.head);
    sinon.stub(document.head, 'appendChild').callsFake((element) => {
      if (element.tagName === 'LINK' && element.href.endsWith('/chat-panel.css')) {
        setTimeout(() => element.dispatchEvent(new Event('load')), 50);
        return element;
      }
      if (element.tagName === 'LINK' && element.href.startsWith('https://')) {
        queueMicrotask(() => element.dispatchEvent(new Event('load')));
        return element;
      }
      return appendChild(element);
    });
    await Promise.all([initPanel(), openChatPanel(), openChatPanel()]);
    await expectOpen();
    expect(client.initialize.calledOnce).to.be.true;
  });

  it('renders a floating Ask button with the shared BC logo', async () => {
    await initPanel();
    const toggle = document.getElementById('chat-panel-toggle');
    expect(toggle.textContent.trim()).to.equal('Ask');
    expect(toggle.type).to.equal('button');
    expect(toggle.getAttribute('aria-label')).to.equal('Ask Adobe');
    expect(toggle.getAttribute('aria-controls')).to.equal('chat-panel');
    expect(toggle.getAttribute('daa-ll')).to.equal('Filters|testAA|bc#floating-bc');
    expect(toggle.querySelector('.chat-panel-toggle-icon').getAttribute('aria-hidden'))
      .to.equal('true');
    const icon = toggle.querySelector('svg');
    expect(icon.getAttribute('width')).to.equal('20');
    expect(icon.getAttribute('height')).to.equal('20');
    expect(icon.querySelector('radialGradient').id).to.equal('chat-panel-toggle-ai');
    expect(icon.querySelector('path[fill="url(#chat-panel-toggle-ai)"]')).to.exist;
    expect(getComputedStyle(toggle).position).to.equal('fixed');
    expect(getComputedStyle(toggle).minHeight).to.equal('48px');
  });

  it('opens from the floating Ask button and closes on Escape without destroying the mount', async () => {
    await initPanel();
    const toggle = document.getElementById('chat-panel-toggle');
    toggle.click();
    const panel = await expectOpen();
    expect(toggle.getAttribute('aria-expanded')).to.equal('true');
    expect(getComputedStyle(toggle).visibility).to.equal('hidden');
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(document.body.classList.contains('chat-panel-open')).to.be.false;
    expect(localStorage.getItem('bc-side-overlay')).to.equal('closed');
    expect(toggle.getAttribute('aria-expanded')).to.equal('false');
    expect(getComputedStyle(toggle).visibility).to.equal('visible');
    toggle.click();
    await expectOpen();
    expect(document.getElementById('chat-panel')).to.equal(panel);
    expect(client.initialize.calledOnce).to.be.true;
  });

  it('submits a new prompt into the same panel while already open', async () => {
    await openChatPanel('First prompt');
    const panel = await expectOpen('First prompt');
    await openChatPanel('Second prompt');
    await expectOpen('Second prompt');
    expect(document.getElementById('chat-panel')).to.equal(panel);
    expect(client.initialize.calledOnce).to.be.true;
    expect(client.sendUserMessage.secondCall.args[0]).to.deep.equal({ label: 'Second prompt' });
  });

  it('uses integration services with local frontend assets instead of a local backend', async () => {
    window.history.replaceState({}, '', '?acom-assistant-panel=local');
    await openChatPanel();
    expect(options.env).to.equal('integration');
    expect(new URL(options.initConfigUrl).hostname).to.equal('integration-client.messaging.adobe.com');
    expect(new URL(options.assistantUiURL).port).to.equal('3443');
    expect(options.mountSelector).to.equal('#brand-concierge-mount');
  });

  it('routes Jarvis chat links into the host panel before native window handlers', async () => {
    await initPanel();
    const link = document.createElement('a');
    link.href = '#open-jarvis-chat';
    document.body.append(link);
    const nativeHandler = sinon.spy();
    document.addEventListener('click', nativeHandler);
    try {
      link.click();
      await waitFor(() => client.openMessagingWindow.called);
      expect(document.body.classList.contains('chat-panel-open')).to.be.true;
      expect(nativeHandler.called).to.be.false;
    } finally {
      document.removeEventListener('click', nativeHandler);
    }
  });

  it('synchronizes Jarvis close notifications with the host panel', async () => {
    await openChatPanel();
    options.callbacks.windowStateCallback({ state: 'hidden' });
    expect(document.body.classList.contains('chat-panel-open')).to.be.false;
    expect(localStorage.getItem('bc-side-overlay')).to.equal('closed');
  });

  it('uses Jarvis sign-out handling without loading the web client', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    await initMilo(document.querySelector('.brand-concierge'));
    await openChatPanel();
    window.dispatchEvent(new Event('feds:signOut'));
    expect(client.handleSignOut.calledOnce).to.be.true;
    expect(document.body.classList.contains('chat-panel-open')).to.be.false;
    const scripts = document.head.append.getCalls().flatMap(({ args }) => args);
    expect(scripts.some((el) => el.src?.includes('brand-concierge-web-agent'))).to.be.false;
  });

  it('does not open a native window if the bundle lacks embedded support', async () => {
    client.supportsEmbeddedPanel = false;
    let failure;
    try {
      await openChatPanel('Do not send');
    } catch (error) {
      failure = error;
    }
    expect(failure.message).to.include('does not support embedded panels');
    expect(document.querySelector('#chat-panel [role="alert"]')).to.exist;
    expect(client.openMessagingWindow.called).to.be.false;
    expect(client.initialize.called).to.be.false;
    expect(client.sendUserMessage.called).to.be.false;
  });

  it('does not open Jarvis after the panel is closed during initialization', async () => {
    client.initialize.callsFake((config) => {
      options = config;
      return { status: 'success', type: 'init_started' };
    });
    const opening = openChatPanel('Pending prompt');
    await waitFor(() => !!options);
    closeChatPanel();
    options.callbacks.onReadyCallback();
    await opening;
    expect(client.openMessagingWindow.called).to.be.false;
    expect(client.sendUserMessage.called).to.be.false;
  });
});
