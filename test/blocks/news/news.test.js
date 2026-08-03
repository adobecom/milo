import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

import init from '../../../libs/c2/blocks/news/news.js';

describe('News', () => {
  it('does nothing when there is only a single row', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/single-row.html' });
    const block = document.querySelector('.news');
    await init(block);

    expect(block.querySelector('.news-headline')).to.be.null;
    expect(block.querySelector('.news-items')).to.be.null;
  });

  it('formats the first row into a headline with an eyebrow', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/header-icon.html' });
    const block = document.querySelector('.news');
    await init(block);

    const headlineRow = block.querySelector('.news-headline');
    expect(headlineRow).to.exist;

    const headlineText = headlineRow.querySelector('.headline .headline-text .eyebrow');
    expect(headlineText).to.exist;
    expect(headlineText.textContent.trim()).to.equal('Latest news');

    // the original authored cell is removed, leaving only the built headline
    expect(headlineRow.children.length).to.equal(1);
    expect(headlineRow.firstElementChild.classList.contains('headline')).to.be.true;
  });

  it('moves a header svg picture into the headline and rewrites its federated src', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/header-icon.html' });
    const block = document.querySelector('.news');
    await init(block);

    const headline = block.querySelector('.news-headline .headline');
    const picture = headline.querySelector('picture');
    expect(picture).to.exist;
    // picture is prepended before the headline text
    expect(headline.firstElementChild).to.equal(picture);

    const img = picture.querySelector('img');
    expect(img.classList.contains('icon')).to.be.true;
    expect(img.getAttribute('src')).to.equal('https://main--federal--adobecom.aem.page/federal/icons/news-icon.svg');
  });

  it('wraps items in a news-items container with the count-based up class', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const block = document.querySelector('.news');
    await init(block);

    const items = block.querySelector('.news-items');
    expect(items).to.exist;
    expect(items.classList.contains('parallax-stagger-ltr')).to.be.true;
    expect(items.classList.contains('three-up')).to.be.true;
    expect(items.querySelectorAll('.news-item').length).to.equal(3);
  });

  it('uses the two-up class when there are two items', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/header-icon.html' });
    const block = document.querySelector('.news');
    await init(block);

    const items = block.querySelector('.news-items');
    expect(items.classList.contains('two-up')).to.be.true;
    expect(items.querySelectorAll('.news-item').length).to.equal(2);
  });

  it('uses the four-up class when there are four items', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/four-up.html' });
    const block = document.querySelector('.news');
    await init(block);

    const items = block.querySelector('.news-items');
    expect(items.classList.contains('four-up')).to.be.true;
    expect(items.querySelectorAll('.news-item').length).to.equal(4);
  });

  it('uses the six-up class when there are six items', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/six-up.html' });
    const block = document.querySelector('.news');
    await init(block);

    const items = block.querySelector('.news-items');
    expect(items.classList.contains('six-up')).to.be.true;
    expect(items.querySelectorAll('.news-item').length).to.equal(6);
  });

  it('leaves a non-svg header icon src unrewritten', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/header-png-icon.html' });
    const block = document.querySelector('.news');
    await init(block);

    const img = block.querySelector('.news-headline .headline picture img');
    expect(img).to.exist;
    expect(img.classList.contains('icon')).to.be.true;
    // non-svg src is not passed through getFederatedUrl
    expect(img.getAttribute('src')).to.equal('/federal/icons/news-icon.png');
  });

  it('marks the item cell as foreground and classifies its contents', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const block = document.querySelector('.news');
    await init(block);

    const firstItem = block.querySelector('.news-item');
    expect(firstItem.querySelector(':scope > div.foreground')).to.exist;
    expect(firstItem.querySelector('.news-item-headline').textContent.trim()).to.equal('Item one headline');
    expect(firstItem.querySelector('.news-item-body').textContent.trim()).to.equal('Body copy for item one.');
  });

  it('marks a standalone link in a non-quiet block', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const block = document.querySelector('.news');
    await init(block);

    const link = block.querySelector('.news-item-link a');
    expect(link).to.exist;
    expect(link.classList.contains('standalone-link')).to.be.true;
    expect(link.classList.contains('label')).to.be.true;
    // no quiet class on a non-quiet block
    expect(link.classList.contains('quiet')).to.be.false;
  });

  it('adds the quiet class to standalone links in the quiet variant', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/quiet.html' });
    const block = document.querySelector('.news');
    await init(block);

    const link = block.querySelector('.news-item-link a');
    expect(link.classList.contains('standalone-link')).to.be.true;
    expect(link.classList.contains('label')).to.be.true;
    expect(link.classList.contains('quiet')).to.be.true;
  });
});
