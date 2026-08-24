import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

import init from '../../../libs/c2/blocks/floating-cta/floating-cta.js';

describe('Floating CTA', () => {
  it('builds a promo-cta anchor from the image and link, replacing the block content', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const block = document.querySelector('.floating-cta');
    await init(block);

    expect(block.children.length).to.equal(1);
    const cta = block.querySelector(':scope > a.promo-cta');
    expect(cta).to.exist;
    expect(cta.getAttribute('href')).to.equal('https://www.adobe.com/buy');
    expect(cta.getAttribute('tabindex')).to.equal('-1');
    expect(cta.querySelector('img')).to.exist;
    expect(cta.querySelector('span.icon-button[aria-hidden="true"]')).to.exist;
    expect(cta.textContent).to.contain('Buy now');
  });

  it('splits the label on "|" into cta text and aria-label', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const block = document.querySelector('.floating-cta');
    await init(block);

    const cta = block.querySelector('a.promo-cta');
    expect(cta.getAttribute('aria-label')).to.equal('Purchase Photoshop');
    expect(cta.textContent).to.contain('Buy now');
    expect(cta.textContent).to.not.contain('Purchase Photoshop');
  });

  it('uses the cta text as the aria-label when there is no "|"', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/no-pipe.html' });
    const block = document.querySelector('.floating-cta');
    await init(block);

    const cta = block.querySelector('a.promo-cta');
    expect(cta.getAttribute('aria-label')).to.equal('Learn more');
    expect(cta.getAttribute('href')).to.equal('https://www.adobe.com/learn');
  });

  it('rewrites a federated svg image source', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const block = document.querySelector('.floating-cta');
    await init(block);

    const img = block.querySelector('a.promo-cta img');
    expect(img.getAttribute('src')).to.equal('https://main--federal--adobecom.aem.page/federal/icons/cta.svg');
  });

  it('falls back to text content and "#" href when there is no anchor', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/text-only.html' });
    const block = document.querySelector('.floating-cta');
    await init(block);

    const cta = block.querySelector('a.promo-cta');
    expect(cta).to.exist;
    expect(cta.getAttribute('href')).to.equal('#');
    expect(cta.getAttribute('aria-label')).to.equal('Text aria label');
    expect(cta.textContent).to.contain('Just text');
  });

  it('does nothing when the link paragraph is missing', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/invalid.html' });
    const block = document.querySelector('.floating-cta');
    await init(block);

    expect(block.querySelector('a.promo-cta')).to.be.null;
    // original content is left untouched
    expect(block.querySelector('div > div > p img')).to.exist;
  });
});
