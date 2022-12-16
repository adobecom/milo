import { readFile, sendKeys } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { delay, waitForElement, waitForRemoval } from '../../helpers/waitfor.js';

const { default: init, getModal } = await import('../../../libs/blocks/modal/modal.js');
document.body.innerHTML = await readFile({ path: './mocks/body.html' });

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
    const close = document.querySelector('.dialog-modal button');
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
    meta.content = 'https://milo.adobe.com/test/blocks/modals/mocks/otis';
    document.head.append(meta);
    window.location.hash = '#otis';
    await waitForElement('#otis');
    expect(document.getElementById('otis')).to.exist;
    window.location.hash = '';
    await waitForRemoval('#otis');
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
  });

  it('Gets the modal when explicitly init-ed', async () => {
    window.location.hash = '#milo';
    await waitForElement('#milo');
    init(document.getElementById('milo-modal-link'));
    expect(document.getElementById('milo')).to.exist;
    window.location.hash = '';
    await waitForRemoval('#milo');
  });
});
