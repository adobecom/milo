import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

import init from '../../../libs/c2/blocks/hover-list/hover-list.js';

describe('Hover List', () => {
  it('marks the block as a container and builds headline + list columns', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const block = document.querySelector('.hover-list');
    init(block);

    expect(block.classList.contains('container')).to.be.true;

    const children = [...block.children];
    expect(children[0].classList.contains('hover-list-headline-wrapper')).to.be.true;
    expect(children[1].classList.contains('hover-list-col')).to.be.true;
    expect(block.querySelector('.hover-list-col > ol.hover-list-items')).to.exist;
  });

  it('decorates the headline from the first row', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const block = document.querySelector('.hover-list');
    init(block);

    const heading = block.querySelector('.hover-list-headline-wrapper .hover-list-headline h2');
    expect(heading).to.exist;
    expect(heading.classList.contains('heading-2')).to.be.true;
    expect(heading.textContent.trim()).to.equal('Explore features');
  });

  it('builds one list item per content row with a number and text', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const block = document.querySelector('.hover-list');
    init(block);

    const items = block.querySelectorAll('.hover-list-items > li.hover-list-item');
    expect(items.length).to.equal(3);

    const firstCopy = items[0].querySelector(':scope > .hover-list-copy');
    expect(firstCopy).to.exist;
    const number = firstCopy.querySelector('.hover-list-number.eyebrow');
    expect(number.textContent.trim()).to.equal('1.');
    const text = firstCopy.querySelector('.hover-list-text.heading-5');
    expect(text.textContent.trim()).to.equal('Design');

    const numbers = [...block.querySelectorAll('.hover-list-number')].map((n) => n.textContent.trim());
    expect(numbers).to.eql(['1.', '2.', '3.']);
  });

  it('wraps a row\'s pictures in a manual popover media element', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const block = document.querySelector('.hover-list');
    init(block);

    const items = block.querySelectorAll('.hover-list-item');
    const media = items[0].querySelector('.hover-list-media');
    expect(media).to.exist;
    expect(media.getAttribute('popover')).to.equal('manual');
    expect(media.querySelectorAll('picture').length).to.equal(2);

    // second item has a single picture
    expect(items[1].querySelectorAll('.hover-list-media picture').length).to.equal(1);
  });

  it('omits the media element for a row without pictures', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const block = document.querySelector('.hover-list');
    init(block);

    const items = block.querySelectorAll('.hover-list-item');
    expect(items[2].querySelector('.hover-list-media')).to.be.null;
  });

  it('does nothing when the block has no rows', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/empty.html' });
    const block = document.querySelector('.hover-list');
    init(block);

    expect(block.querySelector('.hover-list-items')).to.be.null;
    expect(block.querySelector('.hover-list-headline-wrapper')).to.be.null;
  });
});
