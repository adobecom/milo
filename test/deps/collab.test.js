import { expect } from '@esm-bundle/chai';
import { sendMouse } from '@web/test-runner-commands';

describe('collaboration preview image source', () => {
  let frame;
  const replacement = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a7V8AAAAASUVORK5CYII=';

  function receive(type) {
    return new Promise((resolve) => {
      const listener = (event) => {
        if (event.source !== frame.contentWindow || event.data?.type !== type) return;
        window.removeEventListener('message', listener);
        resolve(event.data);
      };
      window.addEventListener('message', listener);
    });
  }

  function send(data, overrides = {}) {
    frame.contentWindow.dispatchEvent(new frame.contentWindow.MessageEvent('message', {
      data,
      source: window,
      origin: window.location.origin,
      ...overrides,
    }));
  }

  async function imageRequest(moveToWand = false) {
    const result = receive('collab:ai-image-request');
    const img = frame.contentDocument.querySelector('img#preview-image');
    img.dispatchEvent(new frame.contentWindow.MouseEvent('mousemove', { bubbles: true }));
    const wand = frame.contentDocument.querySelector('.collab-image-wand-btn');
    if (moveToWand) {
      wand.querySelector('svg').dispatchEvent(new frame.contentWindow.MouseEvent('mousemove', { bubbles: true }));
    }
    wand.click();
    return result;
  }

  async function loadFrame(withUser = true) {
    frame = document.createElement('iframe');
    frame.src = '/test/deps/mocks/collab.html?peregrine-collab-id=test&peregrine-service-ep=/api';
    const ready = receive('collab:ready-for-edits');
    const loaded = new Promise((resolve) => {
      frame.addEventListener('load', resolve, { once: true });
    });
    document.body.append(frame);
    await Promise.all([ready, loaded]);
    if (withUser) send({ type: 'collab:set-user', email: 'test@adobe.com' });
    send({ type: 'collab:set-annotation-mode', mode: 'assets' });
  }

  async function uploadRequest() {
    const result = receive('collab:image-upload-request');
    const frameRect = frame.getBoundingClientRect();
    const imgRect = frame.contentDocument.querySelector('#preview-image').getBoundingClientRect();
    await sendMouse({
      type: 'click',
      position: [
        Math.round(frameRect.left + frame.clientLeft + imgRect.left + imgRect.width / 2),
        Math.round(frameRect.top + frame.clientTop + imgRect.top + imgRect.height / 2),
      ],
    });
    return result;
  }

  beforeEach(() => loadFrame());

  afterEach(() => frame.remove());

  it('requests image upload and AI dialogs before the user profile arrives', async () => {
    frame.remove();
    await loadFrame(false);
    const original = new URL('/libs/img/favicons/favicon.ico', window.location.href).href;
    expect((await uploadRequest()).currentSrc).to.equal(original);
    expect((await imageRequest()).currentSrc).to.equal(original);
  });

  it('keeps the image target when the pointer moves onto the AI icon', async () => {
    expect((await imageRequest(true)).elementPath).to.equal(JSON.stringify({ selector: 'img#preview-image' }));
    expect(frame.contentDocument.querySelector('#collab-image-wand').classList.contains('open')).to.be.true;
  });

  it('pins the parent origin before the user profile arrives', async () => {
    frame.remove();
    await loadFrame(false);
    const data = { type: 'collab:image-upload', elementPath: '#preview-image', src: replacement };
    send({ type: 'collab:set-user' }, { origin: 'https://example.com' });
    send(data, { origin: 'https://example.com' });
    send(data, { source: frame.contentWindow });
    expect(frame.contentDocument.querySelector('#preview-image').src).not.to.equal(replacement);
    send(data);
    expect(frame.contentDocument.querySelector('#preview-image').src).to.equal(replacement);
  });

  it('keeps the preview URL after repeated unsaved replacements', async () => {
    const original = (await imageRequest()).currentSrc;
    expect(original).to.equal(new URL('/libs/img/favicons/favicon.ico', window.location.href).href);
    send({ type: 'collab:image-upload', elementPath: '#preview-image', src: replacement });
    send({ type: 'collab:image-upload', elementPath: '#preview-image', src: replacement });
    expect(frame.contentDocument.querySelector('#preview-image').src).to.equal(replacement);
    expect((await imageRequest()).currentSrc).to.equal(original);
  });

  it('captures the preview URL before re-applying saved edits', async () => {
    send({
      type: 'collab:apply-edits',
      editRecord: [{ editType: 'image', elementPath: '#preview-image', from: '', to: replacement }],
    });
    expect(frame.contentDocument.querySelector('#preview-image').src).to.equal(replacement);
    expect((await imageRequest()).currentSrc).to.equal(new URL('/libs/img/favicons/favicon.ico', window.location.href).href);
  });

  it('includes the original preview URL in upload requests after replacement', async () => {
    send({ type: 'collab:image-upload', elementPath: '#preview-image', src: replacement });
    expect((await uploadRequest()).currentSrc).to.equal(new URL('/libs/img/favicons/favicon.ico', window.location.href).href);
  });

  it('rejects image replacements from an unverified origin or source', () => {
    const data = { type: 'collab:image-upload', elementPath: '#preview-image', src: replacement };
    send(data, { origin: 'https://example.com' });
    send(data, { source: frame.contentWindow });
    expect(frame.contentDocument.querySelector('#preview-image').src).not.to.equal(replacement);
  });

  it('rejects executable image sources', () => {
    const original = frame.contentDocument.querySelector('#preview-image').src;
    // eslint-disable-next-line no-script-url
    send({ type: 'collab:image-upload', elementPath: '#preview-image', src: 'javascript:alert(1)' });
    expect(frame.contentDocument.querySelector('#preview-image').src).to.equal(original);
  });
});
