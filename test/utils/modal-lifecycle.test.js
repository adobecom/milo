import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { lockModalScroll, unlockModalScroll } from '../../libs/utils/modal-lifecycle.js';

describe('Modal scroll lifecycle', () => {
  let modals;
  let previousLenis;
  let htmlLocked;
  let bodyLocked;

  const createModal = (native = false) => {
    const modal = document.createElement(native ? 'dialog' : 'div');
    modal.classList.add('dialog-modal');
    document.body.append(modal);
    if (native) modal.showModal();
    modals.push(modal);
    return modal;
  };

  beforeEach(() => {
    modals = [];
    previousLenis = window.lenis;
    htmlLocked = document.documentElement.classList.contains('disable-scroll');
    bodyLocked = document.body.classList.contains('disable-scroll');
    window.lenis = { stop: sinon.spy(), start: sinon.spy(), isStopped: false };
  });

  afterEach(async () => {
    modals.forEach((modal) => {
      modal.remove();
      unlockModalScroll(modal);
    });
    await Promise.resolve();
    window.lenis = previousLenis;
    document.documentElement.classList.toggle('disable-scroll', htmlLocked);
    document.body.classList.toggle('disable-scroll', bodyLocked);
  });

  it('shares a root lock until both modal owners release it', () => {
    const region = createModal();
    const native = createModal(true);
    lockModalScroll(region);
    lockModalScroll(native);

    native.close();
    native.remove();
    unlockModalScroll(native);
    expect(document.documentElement.classList.contains('disable-scroll')).to.be.true;
    expect(window.lenis.start.called).to.be.false;

    region.remove();
    unlockModalScroll(region);
    expect(document.documentElement.classList.contains('disable-scroll')).to.be.false;
    expect(window.lenis.stop.calledOnce).to.be.true;
    expect(window.lenis.start.calledOnce).to.be.true;
  });

  it('independently restores C1 body and native/C2 root locks', () => {
    const region = createModal();
    const native = createModal(true);
    lockModalScroll(region, document.body);
    lockModalScroll(native);

    region.remove();
    unlockModalScroll(region);
    expect(document.body.classList.contains('disable-scroll')).to.be.false;
    expect(document.documentElement.classList.contains('disable-scroll')).to.be.true;
    expect(window.lenis.start.called).to.be.false;

    native.close();
    native.remove();
    unlockModalScroll(native);
    expect(document.documentElement.classList.contains('disable-scroll')).to.be.false;
    expect(window.lenis.start.calledOnce).to.be.true;
  });

  it('preserves a scroll lock and paused Lenis owned before the modal', () => {
    document.documentElement.classList.add('disable-scroll');
    window.lenis.isStopped = true;
    const modal = createModal();
    lockModalScroll(modal);

    modal.remove();
    unlockModalScroll(modal);

    expect(document.documentElement.classList.contains('disable-scroll')).to.be.true;
    expect(window.lenis.stop.called).to.be.false;
    expect(window.lenis.start.called).to.be.false;
  });

  it('is idempotent for repeated acquire and release calls', () => {
    const modal = createModal();
    lockModalScroll(modal);
    lockModalScroll(modal);
    modal.remove();
    unlockModalScroll(modal);
    unlockModalScroll(modal);

    expect(document.documentElement.classList.contains('disable-scroll')).to.be.false;
    expect(window.lenis.stop.calledOnce).to.be.true;
    expect(window.lenis.start.calledOnce).to.be.true;
  });

  it('releases locks after a shared close event removes the modal', async () => {
    const modal = createModal();
    lockModalScroll(modal);

    window.dispatchEvent(new Event('milo:modal:closed'));
    modal.remove();
    await Promise.resolve();

    expect(document.documentElement.classList.contains('disable-scroll')).to.be.false;
    expect(window.lenis.start.calledOnce).to.be.true;
  });

  it('cleans disconnected modal ownership before acquiring the next lock', () => {
    const first = createModal();
    lockModalScroll(first);
    first.remove();
    const second = createModal();
    lockModalScroll(second);

    expect(document.documentElement.classList.contains('disable-scroll')).to.be.true;
    expect(window.lenis.stop.calledTwice).to.be.true;
    second.remove();
    unlockModalScroll(second);
    expect(document.documentElement.classList.contains('disable-scroll')).to.be.false;
    expect(window.lenis.start.calledTwice).to.be.true;
  });

  it('does not resume Lenis while a modal curtain outside the shared owner registry remains', async () => {
    const curtain = document.createElement('div');
    curtain.className = 'modal-curtain';
    document.body.append(curtain);
    const modal = createModal();
    lockModalScroll(modal);
    modal.remove();
    unlockModalScroll(modal);
    expect(window.lenis.start.called).to.be.false;

    curtain.remove();
    window.dispatchEvent(new Event('milo:modal:closed'));
    await Promise.resolve();
    expect(window.lenis.start.calledOnce).to.be.true;
  });

  it('works when no Lenis instance is configured', () => {
    window.lenis = undefined;
    const modal = createModal();
    lockModalScroll(modal);
    modal.remove();
    expect(() => unlockModalScroll(modal)).not.to.throw();
    expect(document.documentElement.classList.contains('disable-scroll')).to.be.false;
  });
});
