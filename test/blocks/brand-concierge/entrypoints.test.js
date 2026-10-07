import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { setConfig } from '../../../libs/utils/utils.js';
import { waitFor, waitForElement, delay } from '../../helpers/waitfor.js';
import mockExternalScripts from '../../helpers/mock-script-loading.js';
import initPanel, { openChatPanel, closeChatPanel } from '../../../libs/features/chat-panel/chat-panel.js';
import initMilo from '../../../libs/blocks/brand-concierge/brand-concierge.js';
import initC2 from '../../../libs/c2/blocks/brand-concierge/brand-concierge.js';
import initMiloGlobal from '../../../libs/blocks/brand-concierge-global/brand-concierge-global.js';
import initC2Global from '../../../libs/c2/blocks/brand-concierge-global/brand-concierge-global.js';

setConfig({ codeRoot: '/libs', brandConciergeAA: 'testAA' });

describe('BC entrypoints share a persistent chat panel', () => {
  let bootstrap;

  beforeEach(() => {
    document.body.innerHTML = '';
    document.body.classList.remove('chat-panel-open');
    localStorage.removeItem('bc-side-overlay');
    bootstrap = sinon.spy();
    window.adobe = { concierge: { bootstrap } };
    mockExternalScripts();
  });

  afterEach(() => {
    closeChatPanel();
    document.body.innerHTML = '';
    localStorage.removeItem('bc-side-overlay');
    delete window.adobe;
    delete window.milo;
    sinon.restore();
  });

  async function expectOpen(message) {
    await waitFor(() => document.body.classList.contains('chat-panel-open') && bootstrap.called);
    const panel = document.getElementById('chat-panel');
    expect(document.querySelectorAll('#chat-panel').length).to.equal(1);
    expect(document.querySelectorAll('#brand-concierge-mount').length).to.equal(1);
    expect(document.querySelector('.dialog-modal')).to.be.null;
    if (message) {
      await waitFor(() => panel.querySelector('#brand-concierge-mount').dataset.initialMessage
        === message);
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
          it(`opens BC from the ${variant} ${entrypoint}`, async () => {
            document.body.innerHTML = await readFile({ path: variant === 'marquee' ? './mocks/marquee.html' : './mocks/default.html' });
            const block = document.querySelector('.brand-concierge');
            block.className = `brand-concierge ${variant}`;
            const heading = block.querySelector('h1, h2, h3, h4, h5, h6').textContent.trim();
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
            expect(bootstrap.firstCall.args[0].stylingConfigurations.text['welcome.heading'])
              .to.equal(heading);
          });
        });
      });

      it('opens BC from a floating button and preserves the conversation on reopen', async () => {
        document.body.innerHTML = await readFile({ path: './mocks/floating-button.html' });
        const block = document.querySelector('.brand-concierge');
        await foundation.init(block);
        block.querySelector('.bc-floating-button-container').click();
        const panel = await expectOpen();
        const mount = panel.querySelector('#brand-concierge-mount');
        mount.textContent = 'Existing conversation';

        panel.querySelector('.chat-panel-close').click();
        expect(document.body.classList.contains('chat-panel-open')).to.be.false;
        block.querySelector('.bc-floating-button-container').click();
        await expectOpen();
        expect(document.getElementById('chat-panel')).to.equal(panel);
        expect(mount.textContent).to.equal('Existing conversation');
        expect(bootstrap.calledOnce).to.be.true;
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
        expect(bootstrap.calledTwice).to.be.true;
      });

      ['navigation button', 'send button', 'Enter', 'prompt card'].forEach((entrypoint) => {
        it(`opens BC from the global ${entrypoint}`, async () => {
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
          expect(bootstrap.calledOnce).to.be.true;
        });
      });
    });
  });

  it('waits for initialization and coalesces simultaneous first opens', async () => {
    document.querySelector('link[href="/libs/features/chat-panel/chat-panel.css"]')?.remove();
    const appendChild = document.head.appendChild.bind(document.head);
    sinon.stub(document.head, 'appendChild').callsFake((element) => {
      if (element.tagName === 'LINK' && element.href.endsWith('/chat-panel.css')) {
        setTimeout(() => element.dispatchEvent(new Event('load')), 50);
        return element;
      }
      return appendChild(element);
    });
    await Promise.all([initPanel(), openChatPanel(), openChatPanel()]);
    await expectOpen();
    expect(bootstrap.calledOnce).to.be.true;
  });

  it('opens from the panel toggle and closes on Escape without destroying the mount', async () => {
    await initPanel();
    document.getElementById('chat-panel-toggle').click();
    const panel = await expectOpen();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(document.body.classList.contains('chat-panel-open')).to.be.false;
    expect(localStorage.getItem('bc-side-overlay')).to.equal('closed');
    document.getElementById('chat-panel-toggle').click();
    await expectOpen();
    expect(document.getElementById('chat-panel')).to.equal(panel);
    expect(bootstrap.calledOnce).to.be.true;
  });

  it('submits a new prompt into the same panel while already open', async () => {
    await openChatPanel('First prompt');
    const panel = await expectOpen('First prompt');
    await openChatPanel('Second prompt');
    await expectOpen('Second prompt');
    expect(document.getElementById('chat-panel')).to.equal(panel);
    expect(bootstrap.calledTwice).to.be.true;
  });

  it('does not duplicate sign-in handlers when a new prompt is submitted', async () => {
    await openChatPanel('First prompt');
    await openChatPanel('Second prompt');
    const mount = document.getElementById('brand-concierge-mount');
    mount.dispatchEvent(new CustomEvent('bc:cta-action', { detail: { action: 'sign-in' } }));
    await delay(50);
    const scripts = document.head.append.getCalls()
      .filter(({ args }) => args[0].src?.endsWith('/sentry/wrapper.js'));
    expect(scripts.length).to.equal(1);
  });
});
