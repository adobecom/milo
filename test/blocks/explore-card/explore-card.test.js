import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

import init from '../../../libs/c2/blocks/explore-card/explore-card.js';

describe('Explore Card', () => {
  it('adds container, content and background classes to the first row', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const block = document.querySelector('.explore-card');
    init(block);

    const container = block.querySelector('.explore-card-container');
    expect(container).to.exist;
    expect(container.querySelector('.explore-card-content')).to.exist;
    expect(container.querySelector('.explore-card-background')).to.exist;
  });

  it('rewrites a federated svg product icon source', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const block = document.querySelector('.explore-card');
    init(block);

    const icon = block.querySelector('.explore-card-content img');
    expect(icon.getAttribute('src')).to.equal('https://main--federal--adobecom.aem.page/federal/icons/prod.svg');
  });

  it('decorates the heading at level 5', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const block = document.querySelector('.explore-card');
    init(block);

    const heading = block.querySelector('.explore-card-content h3');
    expect(heading.classList.contains('heading-5')).to.be.true;
  });

  it('moves foreground-row content into the content div with a foreground class', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const block = document.querySelector('.explore-card');
    init(block);

    const content = block.querySelector('.explore-card-content');
    const foreground = content.querySelector('.explore-card-foreground');
    expect(foreground).to.exist;
    expect(foreground.textContent.trim()).to.equal('New');
    // the original foreground row is removed
    expect(block.querySelectorAll(':scope > div').length).to.equal(1);
  });

  it('wraps the content in a tracking link when a link is present', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const block = document.querySelector('.explore-card');
    init(block);

    const container = block.querySelector('.explore-card-container');
    const linkContainer = container.querySelector(':scope > a.explore-card-link-container');
    expect(linkContainer).to.exist;
    expect(linkContainer.getAttribute('href')).to.equal('https://www.adobe.com/explore');
    expect(linkContainer.getAttribute('data-tracking-label')).to.equal('Card heading');
    // the content div now lives inside the link container
    expect(linkContainer.querySelector(':scope > .explore-card-content')).to.exist;
    // the original inline link is removed
    expect(block.querySelector('.explore-card-content p a')).to.be.null;
  });

  it('does not create a link container when there is no link, and removes an empty foreground row', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/no-link.html' });
    const block = document.querySelector('.explore-card');
    init(block);

    expect(block.querySelector('.explore-card-link-container')).to.be.null;
    // content stays a direct child of the container
    const container = block.querySelector('.explore-card-container');
    expect(container.querySelector(':scope > .explore-card-content')).to.exist;
    // empty foreground row removed, no foreground content added
    expect(block.querySelectorAll(':scope > div').length).to.equal(1);
    expect(block.querySelector('.explore-card-foreground')).to.be.null;
  });

  it('does nothing when the block has no rows', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/empty.html' });
    const block = document.querySelector('.explore-card');
    init(block);

    expect(block.querySelector('.explore-card-container')).to.be.null;
  });
});
