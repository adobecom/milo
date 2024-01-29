import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { waitForElement } from '../helpers/waitfor.js';

document.head.innerHTML = await readFile({ path: './mocks/head.html' });
document.body.innerHTML = await readFile({ path: './mocks/body.html' });

describe('Decorating', async () => {
  before(async () => {
    await import('../../libs/scripts/scripts.js');
  });

  it('Decorates adobetv autoblock', async () => {
    const autoBlock = await waitForElement(
      'iframe[class="adobetv"]',
      { rootEl: document.body },
    );
    expect(autoBlock.className).to.equal('adobetv');
  });

  it('Decorates modal link', async () => {
    const modalLink = await waitForElement(
      'a[data-modal-path]',
      { rootEl: document.body },
    );
    expect(modalLink.dataset.modalPath).to.equal('/fragments/mock');
  });

  it('martech test', async () => {
    const el = await waitForElement(
      'script[src$="/libs/deps/martech.main.standard.qa.min.js"]',
      { rootEl: document.head },
    );
    expect(el).to.exist;
    expect(window.alloy_all).to.exist;
  });
});
