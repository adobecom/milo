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
