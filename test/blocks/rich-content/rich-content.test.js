import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

import init from '../../../libs/c2/blocks/rich-content/rich-content.js';

describe('Rich Content', () => {
  it('adds foreground and content classes to the first row and cell', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const block = document.querySelector('.rich-content');
    init(block);

    const foreground = block.children[0];
    expect(foreground.classList.contains('foreground')).to.be.true;
    expect(foreground.children[0].classList.contains('content')).to.be.true;
  });

  it('hangs an opening quote into its own span', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const block = document.querySelector('.rich-content');
    init(block);

    const heading = block.querySelector('.content h2');
    const quote = heading.querySelector('.opening-quote');
    expect(quote).to.exist;
    expect(quote.textContent).to.equal('“');
    // the quote character is removed from the heading text itself
    expect(heading.textContent).to.equal('“Great things ahead');
    expect(heading.firstElementChild).to.equal(quote);
  });

  it('does not add an opening-quote span when the heading has no opening quote', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/no-quote.html' });
    const block = document.querySelector('.rich-content');
    init(block);

    expect(block.querySelector('.opening-quote')).to.be.null;
  });

  it('marks a text-only second cell as the hero overlay source and sets the section variable', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const block = document.querySelector('.rich-content');
    init(block);

    const bgCell = block.children[0].children[1];
    expect(bgCell.classList.contains('hero-overlay-source')).to.be.true;

    const section = block.closest('.section');
    expect(section.style.getPropertyValue('--rc-hero-overlay').trim()).to.equal('rgba(0, 0, 0, 0.5)');
  });

  it('does not treat a second cell containing an image as an overlay source', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/bg-image.html' });
    const block = document.querySelector('.rich-content');
    init(block);

    const bgCell = block.children[0].children[1];
    expect(bgCell.classList.contains('hero-overlay-source')).to.be.false;

    const section = block.closest('.section');
    expect(section.style.getPropertyValue('--rc-hero-overlay')).to.equal('');
  });

  it('promotes the first paragraph to a heading when the content has no heading', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/promote-heading.html' });
    const block = document.querySelector('.rich-content');
    init(block);

    const paragraphs = block.querySelectorAll('.content p');
    expect([...paragraphs[0].classList].some((c) => c.startsWith('heading-'))).to.be.true;
    expect([...paragraphs[0].classList].some((c) => c.startsWith('body-'))).to.be.false;
    // subsequent paragraphs stay body copy
    expect([...paragraphs[1].classList].some((c) => c.startsWith('body-'))).to.be.true;
  });

  it('leaves paragraphs alone when the content already has a heading', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/no-quote.html' });
    const block = document.querySelector('.rich-content');
    init(block);

    const paragraph = block.querySelector('.content p');
    expect([...paragraph.classList].some((c) => c.startsWith('heading-'))).to.be.false;
  });
});
