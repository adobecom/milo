import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

import init from '../../../libs/c2/blocks/social-proof/social-proof.js';

describe('Social Proof', () => {
  it('decorates the standard variant: foreground, heading level 3 and content wrapper', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const block = document.querySelector('.social-proof');
    init(block);

    const foreground = block.querySelector('.foreground');
    expect(foreground).to.exist;

    const heading = foreground.querySelector('h3');
    expect(heading.classList.contains('heading-3')).to.be.true;

    // non-heading children are wrapped in a .content div; the heading stays outside it
    const content = foreground.querySelector(':scope > .content');
    expect(content).to.exist;
    expect(content.querySelectorAll('p').length).to.equal(2);
    expect(content.querySelector('h3')).to.be.null;
  });

  it('hangs the opening quote of the heading into its own span', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const block = document.querySelector('.social-proof');
    init(block);

    const quote = block.querySelector('.foreground h3 .hang-opening-quote');
    expect(quote).to.exist;
    expect(quote.textContent).to.equal('“');
  });

  it('applies the background color from the second cell and removes that cell', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const block = document.querySelector('.social-proof');
    init(block);

    const firstRow = block.children[0];
    expect(firstRow.style.backgroundColor).to.equal('rgb(245, 245, 245)');
    // the color cell is consumed, not left in the DOM
    expect([...firstRow.children].some((c) => c.textContent.trim() === '#f5f5f5')).to.be.false;
  });

  it('moves the media cell into the first row and removes the media row', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const block = document.querySelector('.social-proof');
    init(block);

    const media = block.querySelector('.media');
    expect(media).to.exist;
    expect(media.querySelector('picture')).to.exist;
    expect(media.parentElement).to.equal(block.children[0]);
    // media row consumed → only the first row remains
    expect(block.children.length).to.equal(1);
  });

  it('decorates a blockquote into a figure with heading and figcaption', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/quote.html' });
    const block = document.querySelector('.social-proof');
    init(block);

    const figure = block.querySelector('.foreground figure');
    expect(figure).to.exist;

    const blockquote = figure.querySelector('blockquote');
    expect(blockquote).to.exist;
    const quote = blockquote.querySelector('p');
    expect(quote.classList.contains('heading-3')).to.be.true;
    expect(quote.querySelector('.hang-opening-quote')).to.exist;

    const caption = figure.querySelector('figcaption.body-lg');
    expect(caption).to.exist;
    const spans = caption.querySelectorAll('span');
    expect(spans.length).to.equal(2);
    expect(spans[0].textContent).to.equal('Jane Doe');
    expect(spans[1].textContent).to.equal('CEO, Acme');

    // caption paragraphs are moved out of the blockquote
    expect(blockquote.querySelectorAll('p').length).to.equal(1);
  });

  it('does nothing when the block has no rows', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/empty.html' });
    const block = document.querySelector('.social-proof');
    init(block);

    expect(block.querySelector('.foreground')).to.be.null;
    expect(block.querySelector('.media')).to.be.null;
  });
});
