import { readFile, sendKeys, setViewport } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { delay, waitForElement, waitForRemoval } from '../../helpers/waitfor.js';

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const { default: init, getModal, sendViewportDimensionsOnRequest } = await import('../../../libs/blocks/modal/modal.js');

describe('Modals', () => {
  it('Doesnt load modals on page load with no hash', async () => {
    window.location.hash = '';
    const modal = document.querySelector('.dialog-modal');
    expect(modal).to.be.null;
  });

  it('Loads a modal on load with hash and closes when removed from hash', async () => {
    window.location.hash = '#milo';
    await waitForElement('#milo');
    expect(document.getElementById('milo')).to.exist;
    window.location.hash = '';
    await waitForRemoval('#milo');
    expect(document.getElementById('milo')).to.be.null;
  });

  it('Closes a modal on button click', async () => {
    window.location.hash = '#milo';
    await waitForElement('#milo');
    const close = document.querySelector('.dialog-close');
    close.click();
    await waitForRemoval('#milo');
    expect(window.location.hash).to.be.empty;
    expect(document.getElementById('milo')).not.to.exist;
  });

  it('Closes a modal on click outside modal', async () => {
    window.location.hash = '#milo';
    await waitForElement('#milo');
    const close = document.querySelector('.modal-curtain');
    close.click();
    await waitForRemoval('#milo');
    expect(window.location.hash).to.be.empty;
    expect(document.getElementById('milo')).not.to.exist;
  });

  it('Closes a modal on pressing Esc', async () => {
    window.location.hash = '#milo';
    await waitForElement('#milo');
    await sendKeys({ press: 'Escape' });
    await waitForRemoval('#milo');
    expect(window.location.hash).to.be.empty;
    expect(document.getElementById('milo')).not.to.exist;
  });

  it('Opens an inherited modal', async () => {
    const meta = document.createElement('meta');
    meta.name = '-otis';
    meta.content = 'http://localhost:2000/test/blocks/modals/mocks/otis';
    document.head.append(meta);
    window.location.hash = '#otis';
    await waitForElement('#otis');
    expect(document.getElementById('otis')).to.exist;
    window.location.hash = '';
    await waitForRemoval('#otis');
    expect(document.getElementById('otis')).not.to.exist;
  });

  it('Doesnt open a modal', async () => {
    window.location.hash = '#notthere';
    await delay(50);
    expect(document.querySelector('.dialog-modal')).to.be.null;
    window.location.hash = '';
  });

  it('Keeps the same modal if already open', async () => {
    window.location.hash = '#milo';
    await waitForElement('#milo');
    getModal(document.getElementById('milo-modal-link'));
    expect(document.getElementById('milo')).to.exist;
    window.location.hash = '';
    await waitForRemoval('#milo');
    expect(document.getElementById('milo')).not.to.exist;
  });

  it('Gets the modal when explicitly init-ed', async () => {
    window.location.hash = '#milo';
    await waitForElement('#milo');
    init(document.getElementById('milo-modal-link'));
    expect(document.getElementById('milo')).to.exist;
    window.location.hash = '';
    await waitForRemoval('#milo');
    expect(document.getElementById('milo')).not.to.exist;
    await delay(5);
  });

  it('Locks focus when tabbing forward through tabbable elements', async () => {
    window.location.hash = '#milo';
    await waitForElement('#milo');
    expect(document.getElementById('milo')).to.exist;
    await delay(100);
    expect(document.activeElement.getAttribute('id')).to.equal('milo-button-1');
    await sendKeys({ press: 'Tab' });
    expect(document.activeElement.getAttribute('id')).to.equal('milo-button-2');
    await sendKeys({ press: 'Tab' });
    expect(document.activeElement.classList.contains('dialog-close')).to.be.true;
    await sendKeys({ press: 'Tab' });
    expect(document.activeElement.getAttribute('id')).to.equal('milo-button-1');
    window.location.hash = '';
    await waitForRemoval('#milo');
    expect(document.getElementById('milo')).not.to.exist;
    await delay(5);
  });

  it('Locks focus when tabbing backward through tabbable elements', async () => {
    window.location.hash = '#milo';
    await waitForElement('#milo');
    expect(document.getElementById('milo')).to.exist;
    expect(document.activeElement.getAttribute('id')).to.equal('milo-button-1');
    await sendKeys({ down: 'Shift' });
    await sendKeys({ press: 'Tab' });
    await sendKeys({ up: 'Shift' });
    await delay(100);
    expect(document.activeElement.classList.contains('dialog-close')).to.be.true;
    await sendKeys({ down: 'Shift' });
    await sendKeys({ press: 'Tab' });
    await sendKeys({ up: 'Shift' });
    expect(document.activeElement.getAttribute('id')).to.equal('milo-button-2');
    window.location.hash = '';
    await waitForRemoval('#milo');
    expect(document.getElementById('milo')).not.to.exist;
  });

  it('Focuses on close when there are no other focusables', async () => {
    const meta = document.createElement('meta');
    meta.name = '-paragraph';
    meta.content = 'http://localhost:2000/test/blocks/modals/mocks/paragraph';
    document.head.append(meta);
    window.location.hash = '#paragraph';
    await waitForElement('#paragraph');
    expect(document.getElementById('paragraph')).to.exist;
    expect(document.activeElement.classList.contains('dialog-close')).to.be.true;
    window.location.hash = '';
    await waitForRemoval('#paragraph');
  });

  it('Focuses on a header when there are no other focusables', async () => {
    const meta = document.createElement('meta');
    meta.name = '-title';
    meta.content = 'http://localhost:2000/test/blocks/modals/mocks/title';
    document.head.append(meta);
    window.location.hash = '#title';
    await waitForElement('#title');
    expect(document.getElementById('title')).to.exist;
    expect(document.activeElement.getAttribute('id')).to.equal('test-title');
    window.location.hash = '';
    await waitForRemoval('#title');
  });

  it('checks if dialog modal has the 100% screen width when screen with is less than 1200', async () => {
    await setViewport({ width: 600, height: 100 });
    window.location.hash = '#milo';
    await waitForElement('#milo');
    await getModal({ id: 'animate', path: '/cc-shared/fragments/trial-modals/animate', isHash: true });
    sendViewportDimensionsOnRequest({ data: 'viewportWidth', source: window });
    const dialogmodal = document.getElementsByClassName('dialog-modal')[0];
    dialogmodal.classList.add('commerce-frame');
    expect(window.innerWidth).to.equal(dialogmodal.offsetWidth);
  });

  it('checks if dialog modal is less than screen size if it does not have commerce frame class and screen size is less than 1200', async () => {
    const dialogmodal = document.getElementsByClassName('dialog-modal')[0];
    dialogmodal.classList.remove('commerce-frame');
    expect(window.innerWidth).not.equal(dialogmodal.offsetWidth);
  });

  it('does not error for a modal with a non-querySelector compliant hash', async () => {
    window.location.hash = '#milo=&';

    const hashChangeTriggered = new Promise((resolve) => {
      window.addEventListener('hashchange', function onHashChange() {
        window.removeEventListener('hashchange', onHashChange);
        resolve();
      });
    });

    window.location.hash = '';

    // Test passing, means there was no error thrown
    await hashChangeTriggered;
  });

  it('adjusts the modal height upon request', async () => {
    const contentHeightDesktop = 714;
    const contentHeightMobile = '100%';
    const content = new DocumentFragment();
    const miloIFrame = document.createElement('div');
    miloIFrame.classList.add('milo-iframe');
    miloIFrame.classList.add('modal');
    content.append(miloIFrame);
    getModal(null, { class: 'commerce-frame', id: 'modal-with-iframe', content, closeEvent: 'closeModal' });
    window.location.hash = '#modal-with-iframe';
    const modalWithIFrame = document.querySelector('#modal-with-iframe');
    modalWithIFrame.classList.add('height-fit-content');
    const miloIFrameModal = document.querySelector('.milo-iframe.modal');

    await setViewport({ width: 1200, height: 1000 });
    window.postMessage({ contentHeight: contentHeightDesktop }, '*');
    await delay(50);
    expect(modalWithIFrame.clientHeight).to.equal(contentHeightDesktop);
    expect(miloIFrameModal.clientHeight).to.equal(contentHeightDesktop);

    await setViewport({ width: 320, height: 600 });
    window.postMessage({ contentHeight: contentHeightMobile }, '*');
    await delay(50);
    expect(modalWithIFrame.style.height).to.equal(contentHeightMobile);
    expect(miloIFrameModal.style.height).to.equal(contentHeightMobile);
  });
});
