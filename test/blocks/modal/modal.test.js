/* eslint-disable no-underscore-dangle */
import { readFile, setViewport } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { waitForRemoval } from '../../helpers/waitfor.js';
import { setConfig, createTag } from '../../../libs/utils/utils.js';

setConfig({ codeRoot: '/libs' });
document.body.innerHTML = await readFile({ path: './mocks/body.html' });

const {
  default: init,
  getModal,
  findDetails,
  getHashParams,
  delayedModal,
} = await import('../../../libs/c2/blocks/modal/modal.js');

const cleanup = () => {
  document.querySelectorAll('.dialog-modal, .modal-curtain').forEach((n) => n.remove());
  document.documentElement.classList.remove('disable-scroll');
  window.location.hash = '';
};

describe('Modal (c2)', () => {
  afterEach(() => {
    sinon.restore();
    cleanup();
  });

  describe('getHashParams', () => {
    it('returns an empty object for empty input', () => {
      expect(getHashParams()).to.deep.equal({});
    });

    it('parses the hash and delay (seconds to ms)', () => {
      expect(getHashParams('#delayed-modal:delay=2')).to.deep.equal({
        hash: '#delayed-modal',
        delay: 2000,
      });
    });
  });

  describe('findDetails', () => {
    it('derives id, path and title from a passed anchor', async () => {
      const anchor = document.getElementById('c2-modal-link');
      const details = await findDetails('#foo', anchor);
      expect(details.id).to.equal('foo');
      expect(details.path).to.equal('/path/foo');
      expect(details.title).to.equal('Modal: Foo label');
      expect(details.isHash).to.equal(window.location.hash === '#foo');
    });

    it('looks the anchor up from the DOM when none is passed', async () => {
      const details = await findDetails('#foo', null);
      expect(details.path).to.equal('/path/foo');
      expect(details.title).to.equal('Modal: Foo label');
    });
  });

  describe('delayedModal', () => {
    afterEach(async () => {
      await setViewport({ width: 1024, height: 768 });
    });

    it('returns true on desktop and rewrites the anchor to the plain hash', async () => {
      await setViewport({ width: 1500, height: 900 });
      window.sessionStorage.setItem('shown:#delayed', window.location.pathname);
      const anchor = createTag('a', { 'data-modal-hash': '#delayed:delay=1' });

      expect(delayedModal(anchor)).to.be.true;
      expect(anchor.dataset.modalHash).to.equal('#delayed');
      expect(anchor.getAttribute('href')).to.equal('#delayed');

      window.sessionStorage.removeItem('shown:#delayed');
    });

    it('returns false below the desktop breakpoint', async () => {
      await setViewport({ width: 800, height: 700 });
      const anchor = createTag('a', { 'data-modal-hash': '#delayed:delay=1' });
      expect(delayedModal(anchor)).to.be.false;
    });
  });

  describe('getModal (custom content)', () => {
    it('builds a dialog with close button, curtain and aria-label, disabling scroll', async () => {
      const content = createTag('div', {}, 'Custom modal content');
      const modal = await getModal(null, { id: 'c2-custom', content, title: 'Modal: Hello', class: 'my-modal' });

      expect(modal).to.exist;
      expect(modal.id).to.equal('c2-custom');
      expect(modal.getAttribute('role')).to.equal('dialog');
      expect(modal.getAttribute('aria-modal')).to.equal('true');
      expect(modal.getAttribute('aria-label')).to.equal('Modal: Hello');
      expect(modal.classList.contains('my-modal')).to.be.true;
      expect(modal.textContent).to.contain('Custom modal content');

      const close = modal.querySelector('button.dialog-close');
      expect(close).to.exist;
      expect(close.getAttribute('daa-ll')).to.contain('modalClose:buttonClose');

      expect(document.querySelector('.modal-curtain')).to.exist;
      expect(document.documentElement.classList.contains('disable-scroll')).to.be.true;
    });

    it('runs the closeCallback and tears the dialog down on close', async () => {
      const closeCallback = sinon.spy();
      const content = createTag('div', {}, 'Body');
      const modal = await getModal(null, { id: 'c2-close', content, title: 'Modal: Close', closeCallback });

      modal.querySelector('button.dialog-close').click();
      await waitForRemoval('#c2-close');

      expect(closeCallback.calledOnce).to.be.true;
      expect(document.getElementById('c2-close')).to.be.null;
      expect(document.querySelector('.modal-curtain')).to.be.null;
      expect(document.documentElement.classList.contains('disable-scroll')).to.be.false;
    });
  });

  describe('init', () => {
    it('returns null when the page hash does not match the modal hash', async () => {
      const anchor = createTag('a', { 'data-modal-hash': '#not-open', 'data-modal-path': '/path/x' });
      const result = await init(anchor);
      expect(result).to.be.null;
    });
  });
});
