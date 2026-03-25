import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { setConfig } from '../../../libs/utils/utils.js';

setConfig({ defined: [] });
document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const { default: init } = await import('../../../libs/blocks/sitemap-base/sitemap-base.js');

describe('Sitemap Base', () => {
  let block;

  before(async () => {
    block = document.querySelector('#sitemap-base');
    await init(block);
  });

  it('adds item classes to each top-level child', () => {
    const items = block.querySelectorAll(':scope > .sitemap-base-item');
    expect(items).to.have.length(3);
    expect(items[0].classList.contains('sitemap-base-item-1')).to.be.true;
    expect(items[1].classList.contains('sitemap-base-item-2')).to.be.true;
    expect(items[2].classList.contains('sitemap-base-item-3')).to.be.true;
  });

  it('preserves authored content structure inside each item', () => {
    const headings = [...block.querySelectorAll(':scope > .sitemap-base-item h3')].map((node) => node.textContent.trim());
    expect(headings).to.deep.equal(['AI & Agents', 'Content Workflow', 'Creative & Design']);
  });
});

describe('Sitemap Base align-headings', () => {
  let block;

  before(async () => {
    block = document.querySelector('#sitemap-base-align');
    await init(block);
  });

  it('inserts a spacer in items without a heading', () => {
    const items = block.querySelectorAll(':scope > .sitemap-base-item');
    const spacer = items[1].querySelector('.sitemap-base-spacer');
    expect(spacer).to.exist;
    expect(spacer.classList.contains('heading-m')).to.be.true;
    expect(spacer.getAttribute('aria-hidden')).to.equal('true');
  });

  it('does not insert a spacer in items that have a heading', () => {
    const items = block.querySelectorAll(':scope > .sitemap-base-item');
    const spacer = items[0].querySelector('.sitemap-base-spacer');
    expect(spacer).to.not.exist;
  });
});
