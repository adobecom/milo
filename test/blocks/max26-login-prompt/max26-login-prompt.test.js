import { readFile, setViewport, sendKeys, sendMouse } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { createTag, loadBlock, loadStyle, setConfig } from '../../../libs/utils/utils.js';

document.head.append(createTag('meta', { name: 'foundation', content: 'c2' }));
setConfig({
  codeRoot: '/libs',
  mep: { blocks: { 'max26-login-prompt': '/libs/mep/evnt027/max26-login-prompt' } },
});
const { default: init } = await import('../../../libs/mep/evnt027/max26-login-prompt/max26-login-prompt.js');
const { getModal, closeModal } = await import('../../../libs/c2/blocks/modal/modal.js');

async function fixture(variant = 'default') {
  document.body.innerHTML = await readFile({ path: `./mocks/${variant}.html` });
  return document.querySelector('.max26-login-prompt');
}

async function openModal(variant = 'default') {
  const block = await fixture(variant);
  const fragment = createTag('div', { class: 'fragment' }, block);
  const dialog = await getModal(null, {
    id: 'max26-test',
    title: 'MAX login prompt',
    content: fragment,
  });
  init(block);
  return { block, dialog };
}

describe('MAX 2026 login prompt', () => {
  before(async () => {
    await Promise.all([
      '/libs/c2/styles/styles.css',
      '/libs/c2/blocks/modal/modal.css',
      '/libs/mep/evnt027/max26-login-prompt/max26-login-prompt.css',
    ].map((path) => new Promise((resolve) => { loadStyle(path, resolve); })));
  });

  afterEach(async () => {
    sinon.restore();
    await Promise.all([...document.querySelectorAll('.dialog-modal')].map((dialog) => closeModal(dialog)));
    document.body.replaceChildren();
    document.documentElement.classList.remove('disable-scroll');
    await setViewport({ width: 1024, height: 768 });
  });

  it('loads through the experiment mapping on a C2 page', async () => {
    const block = await fixture();
    await loadBlock(block);
    expect(block.dataset.blockStatus).to.equal('loaded');
    expect(block.querySelector('.max26-login-prompt-foreground')).to.exist;
  });

  it('consumes the authored artwork, logo, heading, copy, and CTAs without Tour markup', async () => {
    const block = await fixture();
    const pictures = [...block.querySelectorAll('picture')];
    const source = pictures[0].querySelector('source');
    init(block);

    expect([...block.children].map((child) => child.className)).to.eql([
      'max26-login-prompt-background',
      'max26-login-prompt-foreground',
    ]);
    expect(block.querySelectorAll('picture').length).to.equal(3);
    pictures.forEach((picture) => expect(block.contains(picture)).to.be.true);
    expect(block.querySelector('#desktop-artwork source')).to.equal(source);
    expect(block.querySelector('.max26-login-prompt-logo #max-logo')).to.exist;
    expect(block.querySelector('.max26-login-prompt-copy h2.heading-2').textContent)
      .to.equal('Personalize your MAX experience.');
    expect(block.querySelectorAll('.max26-login-prompt-copy p.body-lg').length).to.equal(2);
    expect(block.querySelector('[class*="tour"]')).to.not.exist;
  });

  it('keeps authored navigation and tracking on sign-in and makes guest a non-navigating button', async () => {
    const block = await fixture();
    init(block);
    const signIn = block.querySelector('.max26-login-prompt-sign-in');
    const guest = block.querySelector('.max26-login-prompt-guest');
    expect(signIn.getAttribute('href')).to.equal('https://www.adobe.com/max.html');
    expect(signIn.getAttribute('daa-ll')).to.equal('register');
    expect(signIn.matches('.con-button.fill.button-md')).to.be.true;
    expect(signIn.classList.contains('blue')).to.be.false;
    expect(guest.tagName).to.equal('BUTTON');
    expect(guest.type).to.equal('button');
    expect(guest.hasAttribute('href')).to.be.false;
    expect(guest.getAttribute('aria-label')).to.equal('Continue as guest');
    expect(guest.getAttribute('daa-ll')).to.equal('guest');
    expect(guest.textContent).to.equal('Continue as guest');
  });

  it('marks the background as decorative without changing the logo alternative text', async () => {
    const block = await fixture();
    init(block);
    const background = block.querySelector('.max26-login-prompt-background');
    expect(background.getAttribute('aria-hidden')).to.equal('true');
    background.querySelectorAll('img').forEach((img) => expect(img.alt).to.equal(''));
    expect(block.querySelector('#max-logo img').alt).to.equal('Adobe MAX');
  });

  it('keeps the primary CTA black on the white panel despite dark-theme styles and stylesheet order', async () => {
    const block = await fixture();
    const sharedStyles = document.querySelector('link[href="/libs/c2/styles/styles.css"]');
    const { nextSibling } = sharedStyles;
    document.head.append(sharedStyles);
    try {
      init(block);
      const signIn = block.querySelector('.max26-login-prompt-sign-in');
      expect(getComputedStyle(signIn).backgroundColor).to.equal('rgb(0, 0, 0)');
      expect(getComputedStyle(signIn).borderTopColor).to.equal('rgb(0, 0, 0)');
      expect(getComputedStyle(signIn).color).to.equal('rgb(255, 255, 255)');
      signIn.focus();
      expect(getComputedStyle(signIn).backgroundColor).to.equal('rgb(0, 0, 0)');
      expect(getComputedStyle(signIn).color).to.equal('rgb(255, 255, 255)');
      expect(getComputedStyle(signIn).outlineStyle).to.equal('solid');
      const unrelated = createTag('a', { class: 'con-button fill' }, 'Unrelated CTA');
      document.body.append(createTag('div', { class: 'dark' }, unrelated));
      expect(getComputedStyle(unrelated).backgroundColor).to.equal('rgb(255, 255, 255)');
      expect(getComputedStyle(unrelated).color).to.equal('rgb(0, 0, 0)');
    } finally {
      document.head.insertBefore(sharedStyles, nextSibling);
    }
  });

  it('preserves white CTA text on a dark hover background', async () => {
    const block = await fixture();
    init(block);
    const signIn = block.querySelector('.max26-login-prompt-sign-in');
    signIn.style.transition = 'none';
    const { x, y, width, height } = signIn.getBoundingClientRect();
    await sendMouse({ type: 'move', position: [Math.round(x + width / 2), Math.round(y + height / 2)] });
    expect(signIn.matches(':hover')).to.be.true;
    expect(getComputedStyle(signIn).backgroundColor).to.equal('rgb(41, 41, 41)');
    expect(getComputedStyle(signIn).color).to.equal('rgb(255, 255, 255)');
    await sendMouse({ type: 'move', position: [0, 0] });
  });

  it('preserves authored typography overrides', async () => {
    const block = await fixture();
    block.classList.add('heading-3', 'body-sm');
    init(block);
    expect(block.querySelector('h2.heading-3')).to.exist;
    expect(block.querySelector('.max26-login-prompt-copy p.body-sm')).to.exist;
  });

  it('does not implement the superseded three-second trigger', async () => {
    const block = await fixture();
    const clock = sinon.useFakeTimers();
    const { hash } = window.location;
    init(block);
    clock.tick(5000);
    expect(document.querySelector('.dialog-modal')).to.not.exist;
    expect(window.location.hash).to.equal(hash);
  });

  it('reports missing authored content instead of silently decorating a broken block', async () => {
    const block = await fixture();
    block.lastElementChild.remove();
    expect(() => init(block)).to.throw('max26-login-prompt requires');
  });

  it('labels the shared dialog from its authored heading', async () => {
    const { block, dialog } = await openModal();
    const heading = block.querySelector('h2');
    expect(dialog.getAttribute('aria-labelledby')).to.equal(heading.id);
    expect(document.getElementById(heading.id)).to.equal(heading);
  });

  it('closes the dialog on Continue as guest without navigating or invoking sign-in', async () => {
    const { block, dialog } = await openModal();
    const closed = sinon.spy();
    window.addEventListener('milo:modal:closed', closed, { once: true });
    block.querySelector('.max26-login-prompt-guest').click();
    expect(dialog.isConnected).to.be.false;
    expect(document.querySelector('.modal-curtain')).to.not.exist;
    expect(document.documentElement.classList.contains('disable-scroll')).to.be.false;
    expect(closed.calledOnce).to.be.true;
    expect(closed.firstCall.args[0].detail.id).to.equal('max26-test');
  });

  it('supports keyboard activation of Continue as guest', async () => {
    const { block, dialog } = await openModal();
    block.querySelector('.max26-login-prompt-guest').focus();
    await sendKeys({ press: 'Space' });
    expect(dialog.isConnected).to.be.false;
  });

  ['close button', 'backdrop', 'Escape'].forEach((action) => {
    it(`preserves shared-modal dismissal by ${action}`, async () => {
      const { dialog } = await openModal();
      if (action === 'close button') dialog.querySelector('.dialog-close').click();
      if (action === 'backdrop') document.querySelector('.modal-curtain').click();
      if (action === 'Escape') dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      expect(dialog.isConnected).to.be.false;
      expect(document.querySelector('.modal-curtain')).to.not.exist;
    });
  });

  [
    { width: 375, height: 812, artwork: 'mobile', shell: 327, inset: 24 },
    { width: 1024, height: 900, artwork: 'desktop', shell: 807, inset: 48 },
    { width: 1440, height: 900, artwork: 'desktop', shell: 807, inset: 48 },
    { width: 1920, height: 1080, artwork: 'desktop', shell: 807, inset: 48 },
  ].forEach(({ width, height, artwork, shell, inset }) => {
    it(`renders the correct artwork and shell at ${width}px`, async () => {
      await setViewport({ width, height });
      const { block, dialog } = await openModal();
      const visible = block.querySelector(`#${artwork}-artwork`).parentElement;
      const hidden = block.querySelector(`#${artwork === 'desktop' ? 'mobile' : 'desktop'}-artwork`).parentElement;
      expect(getComputedStyle(visible).display).to.equal('block');
      expect(getComputedStyle(hidden).display).to.equal('none');
      expect(block.getBoundingClientRect().width).to.be.closeTo(shell, 1);
      expect(parseFloat(getComputedStyle(block).paddingInlineStart)).to.equal(inset);
      expect(block.querySelector('.max26-login-prompt-sign-in').getBoundingClientRect().width).to.equal(170);
      expect(getComputedStyle(block.querySelector('.max26-login-prompt-sign-in')).backgroundColor)
        .to.equal('rgb(0, 0, 0)');
      expect(getComputedStyle(block.querySelector('.max26-login-prompt-sign-in')).color)
        .to.equal('rgb(255, 255, 255)');
      expect(getComputedStyle(block.querySelector('.max26-login-prompt-foreground')).backgroundColor)
        .to.equal('rgb(255, 255, 255)');
      expect(getComputedStyle(block.querySelector('.max26-login-prompt-logo img')).display).to.equal('block');
      expect(dialog.getBoundingClientRect().width).to.be.closeTo(shell, 1);
      const guestButton = block.querySelector('.max26-login-prompt-guest');
      expect(guestButton.parentElement.getBoundingClientRect().height)
        .to.equal(guestButton.getBoundingClientRect().height);
      const close = dialog.querySelector('button.dialog-close');
      expect(close.getAttribute('aria-label')).to.equal('Close');
      expect(close.getBoundingClientRect().width).to.equal(40);
      expect(close.getBoundingClientRect().height).to.equal(40);
      expect(getComputedStyle(close).backgroundColor).to.equal('rgb(225, 225, 225)');
      expect(getComputedStyle(close.querySelector('svg')).display).to.equal('block');
      expect(close.querySelector('svg').getBoundingClientRect().width).to.equal(32);
      expect(getComputedStyle(close.querySelector('line')).stroke).to.equal('rgb(0, 0, 0)');
      const closeBounds = close.getBoundingClientRect();
      const dialogBounds = dialog.getBoundingClientRect();
      expect(closeBounds.top - dialogBounds.top).to.be.closeTo(12, 1);
      expect(dialogBounds.right - closeBounds.right).to.be.closeTo(12, 1);
    });
  });

  it('keeps controls reachable on a narrow, short viewport and in RTL', async () => {
    await setViewport({ width: 320, height: 400 });
    const { block, dialog } = await openModal();
    dialog.dir = 'rtl';
    const fragment = dialog.querySelector('.fragment');
    expect(fragment.scrollHeight).to.be.greaterThan(fragment.clientHeight);
    fragment.scrollTop = fragment.scrollHeight;
    const guest = block.querySelector('.max26-login-prompt-guest').getBoundingClientRect();
    const bounds = dialog.getBoundingClientRect();
    expect(guest.bottom).to.be.at.most(bounds.bottom + 1);
    const close = dialog.querySelector('.dialog-close').getBoundingClientRect();
    expect(close.left - bounds.left).to.be.closeTo(12, 1);
    expect(close.top).to.be.at.least(0);
    expect(block.scrollWidth).to.be.at.most(Math.ceil(block.getBoundingClientRect().width));
  });

  describe('post-event variant', () => {
    it('loads through the same experiment mapping without requiring a guest link', async () => {
      const block = await fixture('post');
      await loadBlock(block);
      expect(block.dataset.blockStatus).to.equal('loaded');
      expect(block.querySelector('.max26-login-prompt-foreground')).to.exist;
    });

    it('preserves post-event copy, artwork, and the single authored CTA', async () => {
      const block = await fixture('post');
      init(block);
      expect(block.querySelectorAll('picture').length).to.equal(3);
      expect(block.querySelector('.max26-login-prompt-logo img').alt).to.equal('Adobe MAX');
      expect(block.querySelector('.max26-login-prompt-copy h2.heading-2').textContent)
        .to.equal('Relive the best moments of MAX.');
      const paragraphs = block.querySelectorAll('.max26-login-prompt-copy p.body-lg');
      expect(paragraphs.length).to.equal(1);
      expect(paragraphs[0].textContent)
        .to.equal('Watch sessions, keynotes, MAX Sneaks, and more — all on demand. Sign up to stay up to date with the latest from MAX.');
      expect(block.querySelectorAll('.max26-login-prompt-actions > p').length).to.equal(1);
      expect(block.querySelector('.max26-login-prompt-guest')).to.not.exist;
      const signIn = block.querySelector('.max26-login-prompt-sign-in');
      expect(signIn.textContent).to.equal('Sign up');
      expect(signIn.getAttribute('href')).to.equal('https://example.com/max-post-sign-in');
      expect(signIn.getAttribute('aria-label')).to.equal('Sign up for Adobe MAX');
      expect(signIn.getAttribute('daa-ll')).to.equal('post-sign-up');
      expect(signIn.matches('.con-button.fill.button-md')).to.be.true;
    });

    it('preserves authored typography overrides', async () => {
      const block = await fixture('post');
      block.classList.add('heading-3', 'body-sm');
      init(block);
      expect(block.querySelector('h2.heading-3')).to.exist;
      expect(block.querySelector('.max26-login-prompt-copy p.body-sm')).to.exist;
    });

    it('reports a missing primary CTA instead of treating body copy as an action', async () => {
      const block = await fixture('post');
      block.lastElementChild.firstElementChild.lastElementChild.remove();
      expect(() => init(block)).to.throw('max26-login-prompt requires');
    });

    it('continues to require the guest action in the live variant', async () => {
      const block = await fixture();
      block.lastElementChild.firstElementChild.lastElementChild.remove();
      expect(() => init(block)).to.throw('max26-login-prompt requires');
    });

    ['close button', 'backdrop', 'Escape'].forEach((action) => {
      it(`preserves shared-modal dismissal by ${action}`, async () => {
        const { block, dialog } = await openModal('post');
        expect(dialog.getAttribute('aria-labelledby')).to.equal(block.querySelector('h2').id);
        if (action === 'close button') dialog.querySelector('.dialog-close').click();
        if (action === 'backdrop') document.querySelector('.modal-curtain').click();
        if (action === 'Escape') dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        expect(dialog.isConnected).to.be.false;
        expect(document.querySelector('.modal-curtain')).to.not.exist;
      });
    });

    [375, 1024, 1440, 1920].forEach((width) => {
      it(`matches post-event spacing and keeps the CTA and X visible at ${width}px`, async () => {
        await setViewport({ width, height: 1080 });
        const { block, dialog } = await openModal('post');
        const mobile = width < 768;
        expect(block.getBoundingClientRect().width).to.equal(mobile ? 327 : 807);
        expect(getComputedStyle(block.querySelector('.max26-login-prompt-body')).rowGap)
          .to.equal(mobile ? '24px' : '52px');
        expect(getComputedStyle(block.querySelector('.max26-login-prompt-copy')).rowGap).to.equal('22px');
        expect(getComputedStyle(block.querySelector('.max26-login-prompt-copy p')).maxWidth)
          .to.equal(mobile ? '214px' : 'none');
        const signIn = block.querySelector('.max26-login-prompt-sign-in');
        expect(signIn.getBoundingClientRect().width).to.equal(170);
        expect(getComputedStyle(signIn).backgroundColor).to.equal('rgb(0, 0, 0)');
        expect(getComputedStyle(signIn).color).to.equal('rgb(255, 255, 255)');
        const close = dialog.querySelector('.dialog-close');
        expect(close.getBoundingClientRect().width).to.equal(40);
        expect(close.getBoundingClientRect().height).to.equal(40);
        const bounds = dialog.getBoundingClientRect();
        expect(close.getBoundingClientRect().top - bounds.top).to.be.closeTo(12, 1);
        expect(bounds.right - close.getBoundingClientRect().right).to.be.closeTo(12, 1);
      });
    });

    it('keeps the primary action reachable on a short RTL viewport', async () => {
      await setViewport({ width: 320, height: 400 });
      const { block, dialog } = await openModal('post');
      dialog.dir = 'rtl';
      const fragment = dialog.querySelector('.fragment');
      fragment.scrollTop = fragment.scrollHeight;
      const bounds = dialog.getBoundingClientRect();
      expect(block.querySelector('.max26-login-prompt-sign-in').getBoundingClientRect().bottom)
        .to.be.at.most(bounds.bottom + 1);
      expect(dialog.querySelector('.dialog-close').getBoundingClientRect().left - bounds.left)
        .to.be.closeTo(12, 1);
      expect(block.scrollWidth).to.be.at.most(Math.ceil(block.getBoundingClientRect().width));
    });
  });
});
