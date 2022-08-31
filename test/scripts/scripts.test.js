/* eslint-disable no-unused-expressions */
/* global describe before it */

import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { waitForElement } from '../helpers/selectors.js';

document.head.innerHTML = await readFile({ path: './mocks/head.html' });
document.body.innerHTML = await readFile({ path: './mocks/body.html' });

const EXTERNAL_SCRIPTS = [
  'https://www.adobe.com/marketingtech/main.standard.min.js',
];

const observer = new MutationObserver((mutations) => {
  mutations.forEach(({ addedNodes }) => {
    addedNodes.forEach((node) => {
      if (node.nodeType === 1 && node.tagName === 'SCRIPT') {
        if (EXTERNAL_SCRIPTS.includes(node.src)) {
          node.setAttribute('type', 'javascript/blocked');
        }
      }
    });
  });
});

// Starts the monitoring
observer.observe(document.head, {
  childList: true,
  subtree: true,
});

describe('Decorating', () => {
  before(async () => {
    await import('../../libs/scripts/scripts.js');
  });

  it('Decorates auto blocks', async () => {
    const autoBlock = document.querySelector('a[class]');
    expect(autoBlock.className).to.equal('adobetv link-block');
  });

  it('Decorates modal link', async () => {
    const modalLink = document.querySelector('a[data-modal-path]');
    expect(modalLink.dataset.modalPath).to.equal('/fragments/mock');
  });

  it('modal test', async () => {
    window.location.hash = '#play-video';
    await waitForElement('dialog');
    const modal = document.querySelector('dialog');
    expect(modal).to.exist;
  });

  it('martech test', async () => {
    const el = await waitForElement('script[src="https://www.adobe.com/marketingtech/main.standard.min.js"]');
    expect(el).to.exist;
    expect(window.alloy_load).to.exist;
  });
});
