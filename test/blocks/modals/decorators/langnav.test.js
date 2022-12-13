import { readFile, sendKeys } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { delay, waitForElement, waitForRemoval } from '../../helpers/waitfor.js';

const { default: init, getModal } = await import('../../../libs/blocks/modal/modal.js');
document.body.innerHTML = await readFile({ path: './mocks/body.html' });

describe('Langnav Modal', () => {
  it('Doesnt load modals on page load with no hash', async () => {
    window.location.hash = '#langnav';
    const modal = document.querySelector('.dialog-modal');
    expect(modal).to.be.null;
  });

  it('Loads a modal on load with hash and closes when removed from hash', async () => {
    window.location.hash = '#langnav';
    await waitForElement('#langnav');
    expect(document.getElementById('milo')).to.exist;
    window.location.hash = '';
    await waitForRemoval('#milo');
    expect(document.getElementById('milo')).to.be.null;
  });
});
