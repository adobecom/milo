import { readFile, sendKeys } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { delay, waitForElement, waitForRemoval } from '../../helpers/waitfor.js';

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const { default: init, getModal } = await import('../../../libs/blocks/modal/modal.js');

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

  it('Opens a model from event', async () => {
    const event = new CustomEvent('modal:open', { detail: { hash: '#milo' } });
    window.dispatchEvent(event);
    await waitForElement('#milo');
    expect(document.getElementById('milo')).to.exist;
    document.querySelectorAll('.dialog-modal').forEach((m) => { m.remove(); });
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
    await sendKeys({ press: 'Tab' });
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
});
