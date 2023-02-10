import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { setConfig } from '../../../libs/utils/utils.js';

document.head.innerHTML = await readFile({ path: './mocks/head.html' });
document.body.innerHTML = await readFile({ path: './mocks/body.html' });

const EXTERNAL_SCRIPTS = ['/libs/deps/tacocat.js'];

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

const config = { codeRoot: '/libs' };
setConfig(config);

let merch;

describe('Decorating', () => {
  before(async () => {
    const mod = await import('../../../libs/blocks/merch/merch.js');
    merch = mod.default;
  });

  it('Doesnt decorate merch with bad content', async () => {
    const el = document.querySelector('.merch.no-osi');
    const undef = await merch(el);
    expect(undef).to.be.undefined;
  });

  it('Decorates merch with button and price', async () => {
    const el = document.querySelector('.merch.price');
    await merch(el);
    const { dataset } = el.querySelector('a');
    expect(dataset.checkoutWorkflowStep).to.equal('email');
  });

  it('Decorates merch with button and price', async () => {
    const el = document.querySelector('.merch.optical');
    await merch(el);
    const { dataset } = el.querySelector('span');
    expect(dataset.template).to.equal('priceOptical');
  });

  it('Decorates merch with button and price', async () => {
    const el = document.querySelector('.merch.strikethrough');
    await merch(el);
    const { dataset } = el.querySelector('span');
    expect(dataset.template).to.equal('priceStrikethrough');
  });

  it('Decorates merch with button and price', async () => {
    const el = document.querySelector('.merch.with-tax');
    await merch(el);
    const { dataset } = el.querySelector('span');
    expect(dataset.template).to.equal('priceWithTax');
  });

  it('Decorates merch with button and price', async () => {
    const el = document.querySelector('.merch.with-strikethrough-tax');
    await merch(el);
    const { dataset } = el.querySelector('span');
    expect(dataset.template).to.equal('priceWithTaxStrikethrough');
  });

  it('Decorates merch by falling back to only OSI supplied', async () => {
    const el = document.querySelector('.merch.no-button');
    await merch(el);
    const button = el.querySelector('a');
    const span = el.querySelector('span');
    expect(button).to.not.exist;
    expect(span).to.exist;
  });
});
