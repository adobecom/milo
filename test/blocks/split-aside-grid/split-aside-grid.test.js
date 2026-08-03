import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

import init from '../../../libs/c2/blocks/split-aside-grid/split-aside-grid.js';

describe('Split Aside Grid', () => {
  it('builds the items wrapper, controls, media stack and aria-live region', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const el = document.querySelector('.split-aside-grid');
    init(el);

    expect(el.querySelector('.split-aside-grid-items')).to.exist;
    expect(el.querySelector('.split-aside-grid-controls')).to.exist;
    expect(el.querySelector('.split-aside-grid-stack')).to.exist;
    expect(el.querySelector('.aria-live-container[aria-live="polite"]')).to.exist;
    expect(el.querySelector('.split-aside-grid-controls button.prev')).to.exist;
    expect(el.querySelector('.split-aside-grid-controls button.next')).to.exist;
  });

  it('decorates each slide with an index, toggle button, foreground and media', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const el = document.querySelector('.split-aside-grid');
    init(el);

    const items = el.querySelectorAll('.split-aside-grid-item');
    expect(items.length).to.equal(3);
    items.forEach((item, i) => {
      expect(item.dataset.slideIndex).to.equal(String(i));
      expect(item.querySelector(':scope > .split-aside-grid-toggle[aria-expanded]')).to.exist;
      expect(item.querySelector('.foreground')).to.exist;
    });

    const firstToggleText = items[0].querySelector('.grid-item-toggle-text');
    expect(firstToggleText.textContent.trim()).to.equal('First slide');
  });

  it('decorates the foreground content (heading, content-container, standalone link)', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const el = document.querySelector('.split-aside-grid');
    init(el);

    const content = el.querySelector('.split-aside-grid-item .foreground');
    expect(content.querySelector('h3.heading-5')).to.exist;
    expect(content.querySelector('.content-container')).to.exist;

    const link = content.querySelector('a.standalone-link.label');
    expect(link).to.exist;
    expect(link.textContent.trim()).to.equal('Learn more');

    // an inline link (text differs from its paragraph) is not marked standalone
    const inline = [...content.querySelectorAll('a')].find((a) => a.textContent.trim() === 'inline link');
    expect(inline).to.exist;
    expect(inline.classList.contains('standalone-link')).to.be.false;
  });

  it('falls back to "Slide N" toggle text when a slide has no heading', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/no-heading.html' });
    const el = document.querySelector('.split-aside-grid');
    init(el);

    const toggles = el.querySelectorAll('.split-aside-grid-toggle .grid-item-toggle-text');
    expect(toggles[0].textContent.trim()).to.equal('Slide 1');
    expect(toggles[1].textContent.trim()).to.equal('Slide 2');
  });

  it('moves every media into the stack', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const el = document.querySelector('.split-aside-grid');
    init(el);

    const stackMedia = el.querySelectorAll('.split-aside-grid-stack .media');
    expect(stackMedia.length).to.equal(3);
    stackMedia.forEach((m) => expect(m.querySelector('picture')).to.exist);
  });

  it('builds one dot per slide in a tablist, with the first marked current', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const el = document.querySelector('.split-aside-grid');
    init(el);

    const dotList = el.querySelector('.split-aside-grid-dots');
    expect(dotList.getAttribute('role')).to.equal('tablist');
    const dots = dotList.querySelectorAll('.split-aside-grid-dot');
    expect(dots.length).to.equal(3);
    expect(dots[0].getAttribute('aria-current')).to.equal('location');
    expect(dots[0].classList.contains('is-active')).to.be.true;
    expect(dots[1].getAttribute('aria-current')).to.be.null;
  });

  it('activates the first slide on load', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const el = document.querySelector('.split-aside-grid');
    init(el);

    const items = el.querySelectorAll('.split-aside-grid-item');
    expect(items[0].classList.contains('split-aside-grid-active')).to.be.true;
    expect(items[0].querySelector('.split-aside-grid-toggle').getAttribute('aria-expanded')).to.equal('true');

    const medias = el.querySelectorAll('.split-aside-grid-stack .media');
    expect(medias[0].getAttribute('data-slot')).to.equal('0');
    expect(medias[0].getAttribute('aria-hidden')).to.equal('false');
    expect(medias[1].getAttribute('aria-hidden')).to.equal('true');
  });
});
