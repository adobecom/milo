import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { setConfig } from '../../../libs/utils/utils.js';
import { delay } from '../../helpers/waitfor.js';

setConfig({ codeRoot: '/libs', brandConciergeAA: 'testAA' });

const { openSideModal, destroySideModal, sideOverlayTop, mountId } = await import('../../../libs/blocks/brand-concierge/bc-bootstrap.js');

describe('Brand Concierge persistent side modal', () => {
  let bootstrap;
  let resizeCallback;
  let resizeObserver;
  let openListener;
  let closeListener;

  beforeEach(() => {
    document.body.innerHTML = `
      <header class="global-navigation" style="height: 64px; display: flow-root">
        <nav style="margin-bottom: 12px"></nav>
        <div class="feds-localnav"></div>
      </header>
      <main></main><footer></footer>`;
    document.body.style.removeProperty('--bc-side-overlay-top');
    document.body.style.margin = '0';
    localStorage.removeItem('bc-side-overlay');
    bootstrap = sinon.spy();
    resizeObserver = { observe: sinon.spy(), disconnect: sinon.spy() };
    sinon.stub(window, 'ResizeObserver').callsFake((callback) => {
      resizeCallback = callback;
      return resizeObserver;
    });
    openListener = sinon.spy();
    closeListener = sinon.spy();
    window.addEventListener('bc:side-modal-open', openListener);
    window.addEventListener('bc:side-modal-close', closeListener);
  });

  afterEach(async () => {
    await destroySideModal();
    window.removeEventListener('bc:side-modal-open', openListener);
    window.removeEventListener('bc:side-modal-close', closeListener);
    document.querySelector('meta[name="gnav-foundation"]')?.remove();
    localStorage.removeItem('bc-side-overlay');
    document.body.style.removeProperty('--bc-side-overlay-top');
    document.body.style.removeProperty('margin');
    sinon.restore();
  });

  it('reopens the same mount without bootstrapping again', async () => {
    await openSideModal('Hello', bootstrap);
    const modal = document.getElementById('brand-concierge-side');
    const mount = document.getElementById(mountId);
    mount.textContent = 'Existing conversation';
    modal.querySelector('.dialog-close').click();
    await delay(550);

    expect(modal.classList.contains('bc-side-hidden')).to.be.true;
    expect(closeListener.calledOnce).to.be.true;
    expect(resizeObserver.disconnect.calledOnce).to.be.true;

    await openSideModal(null, bootstrap);
    expect(document.getElementById('brand-concierge-side')).to.equal(modal);
    expect(document.getElementById(mountId)).to.equal(mount);
    expect(mount.textContent).to.equal('Existing conversation');
    expect(modal.hasAttribute('aria-hidden')).to.be.false;
    expect(modal.classList.contains('bc-side-hidden')).to.be.false;
    expect(document.querySelectorAll(`#${mountId}`).length).to.equal(1);
    expect(bootstrap.calledOnceWithExactly('Hello', mountId)).to.be.true;
    expect(openListener.calledTwice).to.be.true;
    expect(localStorage.getItem('bc-side-overlay')).to.equal('open');
  });

  it('updates navigation positioning on resize and scroll', async () => {
    await openSideModal(null, bootstrap);
    const gnav = document.querySelector('header.global-navigation');
    expect(document.body.style.getPropertyValue('--bc-side-overlay-top')).to.equal('64px');
    expect(resizeObserver.observe.calledWith(document.body)).to.be.true;
    expect(resizeObserver.observe.calledWith(gnav)).to.be.true;

    gnav.style.height = '80px';
    resizeCallback();
    expect(document.body.style.getPropertyValue('--bc-side-overlay-top')).to.equal('80px');

    gnav.style.height = '96px';
    window.dispatchEvent(new Event('scroll'));
    await delay(50);
    expect(document.body.style.getPropertyValue('--bc-side-overlay-top')).to.equal('96px');
  });

  it('disconnects local navigation tracking while hidden and restarts it on reopen', async () => {
    await openSideModal(null, bootstrap);
    const gnav = document.querySelector('header.global-navigation');
    const localNav = gnav.querySelector('.feds-localnav');
    gnav.style.height = '80px';
    localNav.style.display = 'none';
    await delay(0);
    expect(document.body.style.getPropertyValue('--bc-side-overlay-top')).to.equal('80px');

    document.querySelector('#brand-concierge-side .dialog-close').click();
    await delay(550);
    gnav.style.height = '96px';
    localNav.style.display = 'block';
    window.dispatchEvent(new Event('scroll'));
    await delay(50);
    expect(document.body.style.getPropertyValue('--bc-side-overlay-top')).to.equal('80px');

    await openSideModal(null, bootstrap);
    expect(document.body.style.getPropertyValue('--bc-side-overlay-top')).to.equal('96px');
  });

  it('opens and resizes without global navigation', async () => {
    document.querySelector('header').remove();
    await openSideModal(null, bootstrap);
    expect(() => resizeCallback()).not.to.throw();
    expect(bootstrap.calledOnce).to.be.true;
  });

  it('sets an initial zero navigation offset', () => {
    document.querySelector('header').style.height = '0px';
    sideOverlayTop();
    expect(document.body.style.getPropertyValue('--bc-side-overlay-top')).to.equal('0px');
  });

  it('only subtracts navigation margin for C2 navigation', () => {
    sinon.stub(window, 'scrollY').value(30);
    sideOverlayTop();
    const standardTop = document.body.style.getPropertyValue('--bc-side-overlay-top');
    const metadata = document.createElement('meta');
    metadata.name = 'gnav-foundation';
    metadata.content = 'c2';
    document.head.append(metadata);
    sideOverlayTop();
    expect(parseFloat(document.body.style.getPropertyValue('--bc-side-overlay-top')))
      .to.equal(parseFloat(standardTop) - 12);
  });
});
