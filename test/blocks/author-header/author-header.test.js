import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const { default: init } = await import('../../../libs/blocks/author-header/author-header.js');

describe('renders author header block', () => {
  const block = document.querySelector('.author-header');
  init(block);

  it('has author header classes added', () => {
    const title = block.querySelector('div:nth-child(1)');
    const img = block.querySelector('div:nth-child(2)');
    const bio = block.querySelector('div:nth-child(3)');
    const social = block.querySelector('div:nth-child(4)');
    if (title) expect(document.querySelector('.author-header-title')).to.exist;
    if (img) expect(document.querySelector('.author-header-img')).to.exist;
    if (bio) expect(document.querySelector('.author-header-bio')).to.exist;
    if (social) expect(document.querySelector('.author-header-socials')).to.exist;
  });
});
