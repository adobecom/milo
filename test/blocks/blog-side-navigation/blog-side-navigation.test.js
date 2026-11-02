import { readFile, setViewport } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { stub } from 'sinon';
import { setConfig } from '../../../libs/utils/utils.js';
import init from '../../../libs/blocks/blog-side-navigation/blog-side-navigation.js';

setConfig({
  locales: { '': { ietf: 'en-US', tk: 'hah7vzn.css' } },
  miloLibs: '/libs',
  codeRoot: '/libs',
  placeholders: { 'jump-to-section': 'JUMP TO SECTION' },
});

function buildArticle(content, header = true) {
  const main = document.createElement('main');
  main.innerHTML = '<div class="section">'
    + `${header ? '<div class="blog-header"><h1>Article title</h1></div>' : ''}`
    + '<div class="blog-side-navigation"></div></div>'
    + `<div class="section"><div class="content">${content}</div></div>`;
  document.body.append(main);
  return { main, block: main.querySelector('.blog-side-navigation') };
}

describe('blog-side-navigation section list', () => {
  const originalUrl = window.location.href;
  let scrollStub;
  let mediaStub;

  function mockTablet(matches = true) {
    const query = new EventTarget();
    query.matches = matches;
    mediaStub = stub(window, 'matchMedia').returns(query);
    return query;
  }

  beforeEach(() => {
    scrollStub = stub(window, 'scrollTo');
  });

  afterEach(() => {
    scrollStub.restore();
    mediaStub?.restore();
    mediaStub = undefined;
    window.history.replaceState(null, '', originalUrl);
    document.querySelector('main')?.remove();
  });

  it('uses H2 labels and numbered targets without replacing inline content', async () => {
    const { main, block } = buildArticle(
      '<h2 id="original">Key <em>takeaways</em></h2><p>Article</p><h2>Next section</h2>',
    );
    await init(block);
    expect(block.querySelector('nav').getAttribute('aria-label')).to.equal('JUMP TO SECTION');
    const links = [...block.querySelectorAll('a')];
    expect(links.map((link) => link.textContent)).to.deep.equal(['Key takeaways', 'Next section']);
    expect(links.map((link) => link.getAttribute('href'))).to.deep.equal(['#section-1', '#section-2']);
    expect([...main.querySelectorAll('h2')].map((heading) => heading.id))
      .to.deep.equal(['section-1', 'section-2']);
    expect(main.querySelector('h2 em')).to.exist;
  });

  it('uses language-independent targets for translated and repeated headings', async () => {
    const { block } = buildArticle('<h2>はじめに</h2><h2>はじめに</h2>');
    await init(block);
    expect([...block.querySelectorAll('a')].map((link) => link.getAttribute('href')))
      .to.deep.equal(['#section-1', '#section-2']);
    expect([...block.querySelectorAll('a')].map((link) => link.textContent))
      .to.deep.equal(['はじめに', 'はじめに']);
  });

  it('ignores header, recommendation, footer, hidden and non-H2 headings', async () => {
    const { main, block } = buildArticle(
      '<h3>Subheading</h3><h2 hidden>Hidden heading</h2><h2> </h2><h2>Article section</h2>',
    );
    main.querySelector('.blog-header').insertAdjacentHTML('beforeend', '<h2>Header heading</h2>');
    main.insertAdjacentHTML('beforeend', '<div class="section"><div class="text">'
      + '<h2>Recommended for you</h2></div><div class="fragment"><div class="section">'
      + '<div class="content"><h2>Footer promotion</h2></div></div></div></div>');
    await init(block);
    expect([...block.querySelectorAll('a')].map((link) => link.textContent))
      .to.deep.equal(['Article section']);
  });

  it('hides the block when there are no article H2s', async () => {
    const { block } = buildArticle('<p>A short article.</p>');
    await init(block);
    expect(block.hidden).to.equal(true);
    expect(block.querySelector('nav')).not.to.exist;
    expect(document.querySelector('.blog-article-layout')).not.to.exist;
  });

  it('groups article sections without moving recommendations or footer content into the rail layout', async () => {
    const { main, block } = buildArticle('<h2>Article section</h2><p>Final paragraph.</p>');
    const section = main.querySelector('.content').parentElement;
    section.id = 'article-body';
    section.insertAdjacentHTML('beforebegin', '<div class="section"><div class="content">'
      + '<p>Introduction.</p></div></div><div class="section"><div class="table">Table</div></div>');
    section.insertAdjacentHTML('beforeend', '<div class="text"><h2>Recommended for you</h2></div>'
      + '<div class="card-metadata"></div>');
    main.insertAdjacentHTML('beforeend', '<div class="section"><div class="fragment">Footer</div></div>');
    const recommended = main.querySelector('.text');
    const footer = main.lastElementChild;
    await init(block);
    const layout = main.querySelector('.blog-article-layout');
    const article = layout.querySelector('.blog-article-content');
    expect(layout.previousElementSibling.querySelector('.blog-header')).to.exist;
    expect(layout.firstElementChild).to.equal(block);
    expect(article.children.length).to.equal(3);
    expect(article.lastElementChild).to.equal(section);
    expect(section.id).to.equal('article-body');
    expect(recommended.parentElement.parentElement).to.equal(main);
    expect(recommended.parentElement.id).to.equal('');
    expect(main.lastElementChild).to.equal(footer);
    expect(main.querySelectorAll('#article-body').length).to.equal(1);
  });

  it('bounds the desktop sticky rail to the article and stacks navigation on smaller screens', async () => {
    const originalViewport = { width: window.innerWidth, height: window.innerHeight };
    const style = document.createElement('style');
    const css = await readFile({ path: '../../../libs/blocks/blog-side-navigation/blog-side-navigation.css' });
    style.textContent = `:root { --grid-container-width: calc(100% - 112px); }
      .blog-header { min-height: 200px; }${css}`;
    document.head.append(style);
    try {
      await setViewport({ width: 1440, height: 1000 });
      const { main, block } = buildArticle('<h2>Article section</h2><p>Article content.</p>');
      await init(block);
      const layout = main.querySelector('.blog-article-layout');
      const article = main.querySelector('.blog-article-content');
      expect(getComputedStyle(layout).columnGap).to.equal('56px');
      expect(getComputedStyle(block).position).to.equal('sticky');
      expect(getComputedStyle(block).top).to.equal('88px');
      expect(getComputedStyle(block).overflowY).to.equal('auto');
      expect(getComputedStyle(block.querySelector('[aria-current="location"]'))
        .borderInlineStartWidth).to.equal('3px');
      expect(block.getBoundingClientRect().width).to.be.at.most(280);
      expect(article.getBoundingClientRect().left)
        .to.be.greaterThan(block.getBoundingClientRect().right);
      expect(article.getBoundingClientRect().top).to.equal(block.getBoundingClientRect().top);
      expect(block.getBoundingClientRect().top)
        .to.be.at.least(main.querySelector('.blog-header').getBoundingClientRect().bottom);
      expect(main.querySelector('.content').getBoundingClientRect().width)
        .to.equal(article.getBoundingClientRect().width);
      article.style.minHeight = '1800px';
      main.insertAdjacentHTML('beforeend', '<div style="height: 1000px"></div>');
      scrollStub.callThrough();
      window.scrollTo({ top: 400, behavior: 'instant' });
      await new Promise(requestAnimationFrame);
      expect(block.getBoundingClientRect().top).to.be.closeTo(88, 1);
      const articleEnd = layout.getBoundingClientRect().bottom + window.scrollY;
      window.scrollTo({ top: articleEnd - 60, behavior: 'instant' });
      await new Promise(requestAnimationFrame);
      expect(block.getBoundingClientRect().bottom)
        .to.be.closeTo(layout.getBoundingClientRect().bottom, 1);
      window.scrollTo({ top: 0, behavior: 'instant' });
      await new Promise(requestAnimationFrame);
      for (const width of [768, 390]) {
        await setViewport({ width, height: 1000 });
        expect(getComputedStyle(block).position).to.equal('static');
        expect(article.getBoundingClientRect().top)
          .to.be.greaterThan(block.getBoundingClientRect().bottom);
        expect(article.getBoundingClientRect().width).to.equal(block.getBoundingClientRect().width);
        expect(document.documentElement.scrollWidth).to.be.at.most(width);
      }
    } finally {
      style.remove();
      await setViewport(originalViewport);
    }
  });

  it('smoothly scrolls on every click, including repeated clicks on the same fragment', async () => {
    mediaStub = stub(window, 'matchMedia').returns({ matches: false });
    const { main, block } = buildArticle('<h2>Section</h2>');
    main.insertAdjacentHTML('afterbegin', '<div class="global-navigation" style="height: 64px"></div>');
    await init(block);
    const link = block.querySelector('a');
    const heading = main.querySelector('h2');
    const expectedTop = heading.getBoundingClientRect().top + window.scrollY - 64;
    link.click();
    await Promise.resolve();
    expect(scrollStub.calledOnce).to.equal(true);
    expect(scrollStub.firstCall.args[0].behavior).to.equal('smooth');
    expect(scrollStub.firstCall.args[0].top).to.equal(expectedTop);
    expect(window.location.hash).to.equal('#section-1');
    expect(heading.getAttribute('tabindex')).to.equal('-1');
    expect(document.activeElement).to.equal(heading);
    link.click();
    await Promise.resolve();
    expect(scrollStub.callCount).to.equal(2);
  });

  it('respects reduced motion and preference changes while preserving heading focus', async () => {
    const preference = { matches: true };
    mediaStub = stub(window, 'matchMedia').returns(preference);
    const { main, block } = buildArticle('<h2>Section</h2>');
    main.insertAdjacentHTML('afterbegin', '<div class="global-navigation" style="height: 64px"></div>');
    await init(block);
    const heading = main.querySelector('h2');
    const expectedTop = heading.getBoundingClientRect().top + window.scrollY - 64;
    block.querySelector('a').click();
    await Promise.resolve();
    expect(mediaStub.firstCall.args[0]).to.equal('(prefers-reduced-motion: reduce)');
    expect(scrollStub.firstCall.args[0]).to.deep.equal({ top: expectedTop, behavior: 'instant' });
    expect(window.location.hash).to.equal('#section-1');
    expect(document.activeElement).to.equal(heading);
    preference.matches = false;
    block.querySelector('a').click();
    expect(scrollStub.secondCall.args[0].behavior).to.equal('smooth');
  });

  it('scrolls immediately when loading an existing section fragment with reduced motion', async () => {
    mediaStub = stub(window, 'matchMedia').returns({ matches: true });
    window.history.replaceState(null, '', '#section-1');
    const { block } = buildArticle('<h2>Section</h2>');
    await init(block);
    expect(scrollStub.calledOnce).to.equal(true);
    expect(scrollStub.firstCall.args[0].behavior).to.equal('instant');
  });

  it('scrolls smoothly when loading an existing section fragment without reduced motion', async () => {
    mediaStub = stub(window, 'matchMedia').returns({ matches: false });
    window.history.replaceState(null, '', '#section-1');
    const { block } = buildArticle('<h2>Section</h2>');
    await init(block);
    expect(scrollStub.calledOnce).to.equal(true);
    expect(scrollStub.firstCall.args[0].behavior).to.equal('smooth');
  });

  it('preserves native behavior for modified clicks', async () => {
    const { block } = buildArticle('<h2>Section</h2>');
    await init(block);
    const link = block.querySelector('a');
    link.addEventListener('click', (event) => event.preventDefault());
    link.dispatchEvent(new MouseEvent('click', { ctrlKey: true, cancelable: true }));
    expect(scrollStub.called).to.equal(false);
    expect(window.location.href).to.equal(originalUrl);
  });

  it('starts expanded and only offers collapse for more than three links on tablet and desktop', async () => {
    const media = mockTablet();
    for (const count of [1, 2, 3, 4]) {
      const content = Array.from({ length: count }, (_, index) => `<h2>Section ${index}</h2>`)
        .join('');
      const { main, block } = buildArticle(content);
      await init(block);
      const button = block.querySelector('button');
      const items = [...block.querySelectorAll('li')];
      if (count === 1) {
        expect(button).not.to.exist;
        expect(items.every((item) => !item.hidden)).to.equal(true);
      } else if (count <= 3) {
        expect(button.hidden).to.equal(true);
        expect(items.every((item) => !item.hidden)).to.equal(true);
      } else {
        expect(mediaStub.firstCall.args[0]).to.equal('(min-width: 600px)');
        expect(button.hidden).to.equal(false);
        expect(button.getAttribute('aria-expanded')).to.equal('true');
        expect(button.querySelector('.blog-side-navigation-toggle-icon')
          .getAttribute('aria-hidden')).to.equal('true');
        expect(items.every((item) => !item.hidden)).to.equal(true);
        expect(document.getElementById(button.getAttribute('aria-controls')))
          .to.equal(block.querySelector('ul'));
        expect(button.getAttribute('aria-label')).to.equal('JUMP TO SECTION');
        media.matches = false;
        media.dispatchEvent(new Event('change'));
        expect(button.hidden).to.equal(false);
        expect(button.getAttribute('aria-expanded')).to.equal('false');
        expect(items.filter((item) => !item.hidden).length).to.equal(1);
      }
      main.remove();
    }
  });

  it('starts mobile lists with two or more links collapsed and supports expanding and collapsing', async () => {
    mockTablet(false);
    for (const count of [1, 2, 3, 4]) {
      const content = Array.from({ length: count }, (_, index) => `<h2>Section ${index}</h2>`)
        .join('');
      const { main, block } = buildArticle(content);
      await init(block);
      const button = block.querySelector('button');
      const items = [...block.querySelectorAll('li')];
      if (count === 1) {
        expect(button).not.to.exist;
        expect(items[0].hidden).to.equal(false);
      } else {
        expect(button.hidden).to.equal(false);
        expect(button.getAttribute('aria-expanded')).to.equal('false');
        expect(items.filter((item) => !item.hidden).length).to.equal(1);
        button.click();
        expect(button.getAttribute('aria-expanded')).to.equal('true');
        expect(items.every((item) => !item.hidden)).to.equal(true);
        items[1].querySelector('a').focus({ preventScroll: true });
        button.click();
        expect(button.getAttribute('aria-expanded')).to.equal('false');
        expect(items.filter((item) => !item.hidden).length).to.equal(1);
        expect(document.activeElement).to.equal(button);
      }
      main.remove();
    }
    expect(window.location.href).to.equal(originalUrl);
    expect(scrollStub.called).to.equal(false);
  });

  it('toggles the full list without navigating and preserves valid keyboard focus on collapse', async () => {
    mockTablet();
    const { block } = buildArticle('<h2>First</h2><h2>Second</h2><h2>Third</h2><h2>Fourth</h2>');
    await init(block);
    const button = block.querySelector('button');
    const links = [...block.querySelectorAll('a')];
    const url = window.location.href;
    expect(button.getAttribute('aria-expanded')).to.equal('true');
    expect([...block.querySelectorAll('li')].every((item) => !item.hidden)).to.equal(true);
    links[1].focus({ preventScroll: true });
    button.click();
    expect(button.getAttribute('aria-expanded')).to.equal('false');
    expect(block.querySelectorAll('li[hidden]').length).to.equal(3);
    expect(document.activeElement).to.equal(button);
    button.click();
    expect(button.getAttribute('aria-expanded')).to.equal('true');
    expect([...block.querySelectorAll('li')].every((item) => !item.hidden)).to.equal(true);
    expect(document.activeElement).to.equal(button);
    expect(window.location.href).to.equal(url);
    expect(scrollStub.called).to.equal(false);
  });

  it('centers the plus and minus strokes inside the toggle independently of the font', async () => {
    mockTablet();
    const style = document.createElement('style');
    style.textContent = await readFile({ path: '../../../libs/blocks/blog-side-navigation/blog-side-navigation.css' });
    document.head.append(style);
    try {
      const { block } = buildArticle('<h2>First</h2><h2>Second</h2><h2>Third</h2><h2>Fourth</h2>');
      await init(block);
      const button = block.querySelector('button');
      const icon = button.querySelector('.blog-side-navigation-toggle-icon');
      for (const font of ['Arial', 'serif']) {
        button.style.fontFamily = font;
        for (const expanded of [true, false]) {
          if (button.getAttribute('aria-expanded') !== String(expanded)) button.click();
          const bounds = button.getBoundingClientRect();
          const iconBounds = icon.getBoundingClientRect();
          expect(bounds.width).to.equal(32);
          expect(bounds.height).to.equal(32);
          const vertical = getComputedStyle(icon, '::after');
          expect(vertical.display === 'none').to.equal(expanded);
          for (const pseudo of expanded ? ['::before'] : ['::before', '::after']) {
            const stroke = getComputedStyle(icon, pseudo);
            const width = parseFloat(stroke.width);
            const height = parseFloat(stroke.height);
            expect(width).to.equal(pseudo === '::before' ? 12 : 2);
            expect(height).to.equal(pseudo === '::before' ? 2 : 12);
            const centerX = iconBounds.left + parseFloat(stroke.left)
              + parseFloat(stroke.marginLeft) + width / 2;
            const centerY = iconBounds.top + parseFloat(stroke.top)
              + parseFloat(stroke.marginTop) + height / 2;
            expect(centerX).to.be.closeTo(bounds.left + bounds.width / 2, 0.1);
            expect(centerY).to.be.closeTo(bounds.top + bounds.height / 2, 0.1);
          }
        }
      }
    } finally {
      style.remove();
    }
  });

  it('preserves separate mobile and desktop expansion states and moves focus before hiding links', async () => {
    const media = mockTablet();
    const { block } = buildArticle('<h2>First</h2><h2>Second</h2><h2>Third</h2><h2>Fourth</h2>');
    await init(block);
    const button = block.querySelector('button');
    const links = [...block.querySelectorAll('a')];
    links[1].focus({ preventScroll: true });
    media.matches = false;
    media.dispatchEvent(new Event('change'));
    expect(button.hidden).to.equal(false);
    expect(button.getAttribute('aria-expanded')).to.equal('false');
    expect(block.querySelectorAll('li[hidden]').length).to.equal(3);
    expect(document.activeElement).to.equal(button);
    button.click();
    links[1].focus({ preventScroll: true });
    media.matches = true;
    media.dispatchEvent(new Event('change'));
    expect(button.hidden).to.equal(false);
    expect(button.getAttribute('aria-expanded')).to.equal('true');
    expect(block.querySelectorAll('li[hidden]').length).to.equal(0);
    expect(document.activeElement).to.equal(links[1]);
    button.click();
    expect(block.querySelectorAll('li[hidden]').length).to.equal(3);
    expect(document.activeElement).to.equal(button);
    media.matches = false;
    media.dispatchEvent(new Event('change'));
    expect(button.getAttribute('aria-expanded')).to.equal('true');
    expect(block.querySelectorAll('li[hidden]').length).to.equal(0);
    media.matches = true;
    media.dispatchEvent(new Event('change'));
    expect(button.getAttribute('aria-expanded')).to.equal('false');
    expect(block.querySelectorAll('li[hidden]').length).to.equal(3);
  });

  it('keeps keyboard focus visible when short lists gain or lose the mobile-only toggle', async () => {
    const media = mockTablet();
    const { block } = buildArticle('<h2>First</h2><h2>Second</h2>');
    await init(block);
    const button = block.querySelector('button');
    const links = [...block.querySelectorAll('a')];
    expect(button.hidden).to.equal(true);
    links[1].focus({ preventScroll: true });
    media.matches = false;
    media.dispatchEvent(new Event('change'));
    expect(button.hidden).to.equal(false);
    expect(block.querySelectorAll('li[hidden]').length).to.equal(1);
    expect(document.activeElement).to.equal(button);
    media.matches = true;
    media.dispatchEvent(new Event('change'));
    expect(button.hidden).to.equal(true);
    expect(block.querySelectorAll('li[hidden]').length).to.equal(0);
    expect(document.activeElement).to.equal(links[0]);
  });

  it('tracks sections in both scroll directions without moving focus, scrolling, or changing the URL', async () => {
    const { main, block } = buildArticle('<h2>First</h2><h2>Second</h2><h2>Third</h2>');
    let positions = [20, 200, 400];
    let scrollTop = 0;
    const scrollPosition = stub(window, 'scrollY').get(() => scrollTop);
    const rectangles = [...main.querySelectorAll('h2')].map((heading, index) => (
      stub(heading, 'getBoundingClientRect').callsFake(() => ({ top: positions[index] - scrollTop }))
    ));
    try {
      await init(block);
      const links = [...block.querySelectorAll('a')];
      const current = () => [...block.querySelectorAll('[aria-current="location"]')];
      expect(current()).to.deep.equal([links[0]]);
      links[0].focus({ preventScroll: true });
      const url = window.location.href;
      for (const [position, activeIndex] of [
        [220, 1],
        [420, 2],
        [0, 0],
      ]) {
        scrollTop = position;
        window.dispatchEvent(new Event('scroll'));
        await new Promise(requestAnimationFrame);
        expect(current()).to.deep.equal([links[activeIndex]]);
        expect(document.activeElement).to.equal(links[0]);
        expect(window.location.href).to.equal(url);
        expect(scrollStub.called).to.equal(false);
      }
      positions = [20, 100, 400];
      scrollTop = 150;
      window.dispatchEvent(new Event('resize'));
      await new Promise(requestAnimationFrame);
      expect(current()).to.deep.equal([links[1]]);
    } finally {
      rectangles.forEach((rectangle) => rectangle.restore());
      scrollPosition.restore();
    }
  });

  it('caches heading geometry during scrolling and refreshes it after layout changes', async () => {
    const { main, block } = buildArticle(
      Array.from({ length: 100 }, (_, index) => `<h2>Section ${index}</h2>`).join(''),
    );
    const navigation = document.createElement('div');
    navigation.className = 'global-navigation';
    main.prepend(navigation);
    let navigationBottom = 64;
    let scrollTop = 0;
    let onResize;
    const positions = Array.from({ length: 100 }, (_, index) => (index + 1) * 100);
    const headings = [...main.querySelectorAll('h2')];
    const rectangles = headings.map((heading, index) => (
      stub(heading, 'getBoundingClientRect').callsFake(() => ({ top: positions[index] - scrollTop }))
    ));
    const scrollPosition = stub(window, 'scrollY').get(() => scrollTop);
    const navigationRectangle = stub(navigation, 'getBoundingClientRect')
      .callsFake(() => ({ bottom: navigationBottom }));
    const computedStyle = stub(window, 'getComputedStyle').callThrough();
    const observer = { observe: stub(), disconnect: stub() };
    const resizeObserver = stub(window, 'ResizeObserver').callsFake((callback) => {
      onResize = callback;
      return observer;
    });
    try {
      await init(block);
      const links = [...block.querySelectorAll('a')];
      for (const [position, activeIndex] of [[180, 1], [9800, 97], [0, 0]]) {
        scrollTop = position;
        window.dispatchEvent(new Event('scroll'));
        await new Promise(requestAnimationFrame);
        expect(links[activeIndex].getAttribute('aria-current')).to.equal('location');
      }
      scrollTop = 110;
      for (const [bottom, activeIndex] of [[100, 1], [0, 0]]) {
        navigationBottom = bottom;
        window.dispatchEvent(new Event('scroll'));
        await new Promise(requestAnimationFrame);
        expect(links[activeIndex].getAttribute('aria-current')).to.equal('location');
      }
      expect(rectangles.every((rectangle) => rectangle.calledOnce)).to.equal(true);
      expect(computedStyle.withArgs(headings[0]).calledOnce).to.equal(true);
      positions[1] = 150;
      headings[0].style.scrollMarginTop = '100px';
      onResize();
      await new Promise(requestAnimationFrame);
      expect(links[1].getAttribute('aria-current')).to.equal('location');
      expect(rectangles.every((rectangle) => rectangle.calledTwice)).to.equal(true);
      expect(computedStyle.withArgs(headings[0]).calledTwice).to.equal(true);
      expect(observer.observe.calledWith(main)).to.equal(true);
      block.remove();
      window.dispatchEvent(new Event('scroll'));
      await new Promise(requestAnimationFrame);
      expect(observer.disconnect.calledOnce).to.equal(true);
    } finally {
      rectangles.forEach((rectangle) => rectangle.restore());
      scrollPosition.restore();
      navigationRectangle.restore();
      computedStyle.restore();
      resizeObserver.restore();
    }
  });

  it('replaces section tracking when the navigation is reinitialized', async () => {
    const { main, block } = buildArticle('<h2>First</h2><h2>Second</h2>');
    let scrollTop = 0;
    const scrollPosition = stub(window, 'scrollY').get(() => scrollTop);
    const positions = [20, 200];
    const rectangles = [...main.querySelectorAll('h2')].map((heading, index) => (
      stub(heading, 'getBoundingClientRect').callsFake(() => ({ top: positions[index] - scrollTop }))
    ));
    try {
      await init(block);
      const oldLinks = [...block.querySelectorAll('a')];
      await init(block);
      const links = [...block.querySelectorAll('a')];
      scrollTop = 220;
      window.dispatchEvent(new Event('scroll'));
      await new Promise(requestAnimationFrame);
      expect(links[1].getAttribute('aria-current')).to.equal('location');
      expect(links[0].hasAttribute('aria-current')).to.equal(false);
      expect(oldLinks[1].hasAttribute('aria-current')).to.equal(false);
    } finally {
      rectangles.forEach((rectangle) => rectangle.restore());
      scrollPosition.restore();
    }
  });

  it('avoids duplicate IDs and does not duplicate the list on reinitialization', async () => {
    const { main, block } = buildArticle('<h2>Section</h2>');
    main.insertAdjacentHTML('beforeend', '<div id="section-1"></div>');
    await init(block);
    expect(block.querySelector('a').getAttribute('href')).to.equal('#section-1-1');
    await init(block);
    expect(block.querySelectorAll('nav').length).to.equal(1);
    expect(block.querySelectorAll('a').length).to.equal(1);
    expect(main.querySelectorAll('.blog-article-layout').length).to.equal(1);
  });

  it('requires the new blog header and reports an invalid standalone placement', async () => {
    const previousLana = window.lana;
    const log = stub();
    window.lana = { log };
    try {
      const { block } = buildArticle('<h2>Section</h2>', false);
      await init(block);
      expect(block.hidden).to.equal(true);
      expect(log.calledOnce).to.equal(true);
    } finally {
      window.lana = previousLana;
    }
  });
});
