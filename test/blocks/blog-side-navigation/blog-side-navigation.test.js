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
    mediaStub = stub(window, 'matchMedia').callsFake((mediaQuery) => (
      mediaQuery === '(min-width: 600px)' ? query : { matches: false }
    ));
    return query;
  }

  beforeEach(() => {
    scrollStub = stub(window, 'scrollTo');
  });

  afterEach(async () => {
    scrollStub.restore();
    mediaStub?.restore();
    mediaStub = undefined;
    window.history.replaceState(null, '', originalUrl);
    document.querySelector('main')?.remove();
    await new Promise(requestAnimationFrame);
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

  it('limits long jump labels to two lines except in collapsed mobile navigation', async () => {
    const originalViewport = { width: window.innerWidth, height: window.innerHeight };
    const style = document.createElement('style');
    style.textContent = await readFile({ path: '../../../libs/blocks/blog-side-navigation/blog-side-navigation.css' });
    document.head.append(style);
    const longTitle = 'A long section title that must remain fully accessible. '.repeat(12).trim();
    try {
      for (const width of [390, 768, 1440]) {
        await setViewport({ width, height: 1000 });
        for (const direction of ['ltr', 'rtl']) {
          const { main, block } = buildArticle(
            `<h2>${longTitle}</h2><h2>${longTitle}</h2><h2>Short</h2><h2>Last</h2>`,
          );
          main.dir = direction;
          await init(block);
          const button = block.querySelector('button');
          const links = [...block.querySelectorAll('nav > ul > li > a')];
          for (const expanded of [true, false]) {
            if (button.getAttribute('aria-expanded') !== String(expanded)) button.click();
            if (expanded && width < 600) {
              const current = block.querySelector('.blog-side-navigation-current > span');
              expect(current.getBoundingClientRect().height)
                .to.be.closeTo(parseFloat(getComputedStyle(current).lineHeight), 1);
            }
            for (const link of links.filter((item) => !item.parentElement.hidden)) {
              const text = link.querySelector('.blog-side-navigation-label');
              const textStyle = getComputedStyle(text);
              const lineHeight = parseFloat(textStyle.lineHeight);
              const lines = !expanded && width < 600 ? 1 : 2;
              expect(textStyle.webkitLineClamp).to.equal(String(lines));
              expect(textStyle.overflow).to.equal('hidden');
              if (text.textContent === longTitle) {
                expect(text.getBoundingClientRect().height).to.be.closeTo(lineHeight * lines, 1);
                expect(text.scrollHeight).to.be.greaterThan(text.clientHeight);
              } else {
                expect(text.getBoundingClientRect().height).to.be.closeTo(lineHeight, 1);
              }
            }
            expect(links[0].textContent).to.equal(longTitle);
            expect(links[1].textContent).to.equal(longTitle);
            expect(links[0].getAttribute('href')).to.equal('#section-1');
          }
          main.remove();
        }
      }
    } finally {
      style.remove();
      await setViewport(originalViewport);
    }
  });

  it('uses plus and minus controls with an outer border and no link dividers at every viewport', async () => {
    const originalViewport = { width: window.innerWidth, height: window.innerHeight };
    const style = document.createElement('style');
    style.textContent = await readFile({ path: '../../../libs/blocks/blog-side-navigation/blog-side-navigation.css' });
    document.head.append(style);
    try {
      for (const width of [390, 599, 600, 768, 1199, 1200, 1440]) {
        await setViewport({ width, height: 1000 });
        const { main, block } = buildArticle('<h2>First</h2><h2>Second</h2><h2>Third</h2><h2>Fourth</h2>');
        await init(block);
        const button = block.querySelector('button');
        const icon = button.querySelector('span');
        const list = block.querySelector('ul');
        const mobile = width < 600;
        if (button.getAttribute('aria-expanded') !== 'false') button.click();
        expect(getComputedStyle(button).marginInlineEnd).to.equal('8px');
        expect(getComputedStyle(list.querySelector('[aria-current="location"]')).fontWeight)
          .to.equal(mobile ? '700' : '400');
        expect(list.querySelector('[aria-current="location"]').getBoundingClientRect().height)
          .to.equal(mobile ? 48 : 78);
        expect(getComputedStyle(list.querySelector('[aria-current="location"]').parentElement)
          .backgroundColor).to.equal('rgba(0, 0, 0, 0)');
        if (mobile) {
          expect(getComputedStyle(block.querySelector(':scope > p')).fontSize).to.equal('16px');
          expect(getComputedStyle(block.querySelector(':scope > p > strong')).fontWeight).to.equal('400');
          expect(getComputedStyle(list).borderRadius).to.equal('0px');
          expect(getComputedStyle(list).boxShadow).to.equal('none');
          expect(getComputedStyle(button).borderWidth).to.equal('1px');
          expect(getComputedStyle(button).borderRadius).to.equal('6px');
          expect(getComputedStyle(button).backgroundColor).to.equal('rgb(248, 248, 248)');
          expect(getComputedStyle(button.parentElement).backgroundColor).to.equal('rgba(0, 0, 0, 0)');
          expect(getComputedStyle(button.parentElement.querySelector('a')).fontWeight).to.equal('700');
        }
        expect(getComputedStyle(icon, '::before').width).to.equal('12px');
        expect(getComputedStyle(icon, '::before').height).to.equal('2px');
        expect(getComputedStyle(icon, '::after').width).to.equal('2px');
        expect(getComputedStyle(icon, '::after').height).to.equal('12px');
        expect(getComputedStyle(icon, '::after').display).not.to.equal('none');
        expect(getComputedStyle(list).borderTopWidth).to.equal(width < 600 ? '0px' : '1px');
        expect(getComputedStyle(list).borderBottom).to.equal('1px solid rgb(221, 221, 221)');
        button.click();
        expect(getComputedStyle(button).marginInlineEnd).to.equal('8px');
        if (mobile) {
          expect(getComputedStyle(button).borderWidth).to.equal('1px');
          expect(getComputedStyle(button).borderRadius).to.equal('6px');
        }
        expect(getComputedStyle(button).backgroundColor).to.equal('rgb(0, 0, 0)');
        expect(getComputedStyle(button).color).to.equal('rgb(255, 255, 255)');
        expect(getComputedStyle(button).borderColor).to.equal('rgb(68, 68, 68)');
        expect(getComputedStyle(icon, '::before').width).to.equal('6px');
        expect(getComputedStyle(icon, '::before').height).to.equal('1.5px');
        expect(getComputedStyle(icon, '::after').display).to.equal('none');
        expect(getComputedStyle(icon).borderStyle).to.equal('solid');
        expect(getComputedStyle(icon).borderColor).to.equal('rgb(255, 255, 255)');
        expect(getComputedStyle(icon).borderRadius).to.equal('50%');
        expect(getComputedStyle(list).borderTopWidth).to.equal(width < 600 ? '0px' : '1px');
        expect(getComputedStyle(list).borderBottom).to.equal('1px solid rgb(221, 221, 221)');
        const expandedWeight = width >= 1200 ? '700' : '600';
        expect(getComputedStyle(list.querySelector('[aria-current="location"]')).fontWeight)
          .to.equal(mobile ? '700' : expandedWeight);
        if (!mobile) {
          expect(getComputedStyle(list.querySelector('[aria-current="location"]').parentElement)
            .backgroundColor).to.equal('rgba(0, 0, 0, 0)');
        }
        for (const item of list.children) {
          expect(item.hidden).to.equal(false);
          expect(getComputedStyle(item).borderWidth).to.equal('0px');
          expect(getComputedStyle(item.querySelector('a')).paddingInlineStart).to.equal('8px');
          expect(getComputedStyle(item.querySelector('a')).paddingInlineEnd).to.equal('8px');
          expect(item.querySelector('a').getBoundingClientRect().height).to.equal(mobile ? 48 : 78);
          if (width < 600) {
            expect(item.getBoundingClientRect().width).to.be.closeTo(list.clientWidth, 1);
          }
        }
        main.remove();
      }
    } finally {
      style.remove();
      await setViewport(originalViewport);
    }
  });

  it('shows the current section above all mobile options only when the dropdown is open', async () => {
    const originalViewport = { width: window.innerWidth, height: window.innerHeight };
    const style = document.createElement('style');
    style.textContent = await readFile({ path: '../../../libs/blocks/blog-side-navigation/blog-side-navigation.css' });
    document.head.append(style);
    try {
      for (const width of [390, 599]) {
        await setViewport({ width, height: 1000 });
        for (const count of [3, 4]) {
          const titles = ['First', 'Second', 'Third', 'Fourth'].slice(0, count);
          const { main, block } = buildArticle(titles.map((title) => `<h2>${title}</h2>`).join(''));
          await init(block);
          const button = block.querySelector('button');
          const current = block.querySelector('.blog-side-navigation-current');
          const list = block.querySelector('ul');
          const links = [...list.querySelectorAll('a')];
          expect(current.hidden).to.equal(true);
          if (count > 3) {
            button.focus();
            button.click();
            expect(current.hidden).to.equal(false);
            expect(current.nextElementSibling).to.equal(list);
            expect(current.querySelector('.blog-side-navigation-label').textContent).to.equal('First');
            expect(current.contains(button)).to.equal(true);
            expect(getComputedStyle(current).fontWeight).to.equal('700');
            expect(getComputedStyle(current).borderBottomWidth).to.equal('1px');
            expect(getComputedStyle(current.querySelector('.blog-side-navigation-label'))
              .webkitLineClamp).to.equal('1');
            expect(links.map((link) => link.textContent)).to.deep.equal(titles);
            expect(links.every((link) => !link.parentElement.hidden)).to.equal(true);
            expect(getComputedStyle(links[0]).fontWeight).to.equal('700');
            expect(getComputedStyle(links[0].parentElement).backgroundColor)
              .to.equal('rgb(242, 242, 242)');
            expect(getComputedStyle(links[1]).fontWeight).to.equal('400');
            expect(document.activeElement).to.equal(button);
            await setViewport({ width: 768, height: 1000 });
            await new Promise(requestAnimationFrame);
            expect(current.hidden).to.equal(true);
            expect(button.parentElement).to.equal(links[0].parentElement);
            await setViewport({ width, height: 1000 });
            await new Promise(requestAnimationFrame);
            expect(current.hidden).to.equal(false);
            expect(current.contains(button)).to.equal(true);
            button.click();
            expect(current.hidden).to.equal(true);
            expect(button.parentElement).to.equal(links[0].parentElement);
          }
          main.remove();
        }
      }
    } finally {
      style.remove();
      await setViewport(originalViewport);
    }
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

  it('includes authored recommendations without moving the footer promo into the rail layout', async () => {
    const { main, block } = buildArticle('<h2>Article section</h2><p>Final paragraph.</p>');
    const section = main.querySelector('.content').parentElement;
    section.id = 'article-body';
    section.insertAdjacentHTML('beforebegin', '<div class="section"><div class="content">'
      + '<p>Introduction.</p></div></div><div class="section"><div class="table">Table</div></div>');
    section.insertAdjacentHTML('beforeend', '<div class="text"><h2>Recommended for you</h2></div>'
      + '<div class="card-metadata"></div>');
    main.insertAdjacentHTML('beforeend', '<div class="section" data-footer-promo><div class="fragment">Footer</div></div>');
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
    expect(recommended.parentElement).to.equal(section);
    expect(main.lastElementChild).to.equal(footer);
    expect(main.querySelectorAll('#article-body').length).to.equal(1);
  });

  it('includes block-only sections after the last copy and skips metadata-only and hidden sections', async () => {
    const { main, block } = buildArticle('<h2>Article section</h2><p>Final copy.</p>');
    main.insertAdjacentHTML('beforeend', '<div class="section"><div class="card-metadata"></div></div>'
      + '<div class="section"><div class="tag-cta">Explore related resources</div></div>'
      + '<div class="section"><div class="related-content-card">Related article</div></div>'
      + '<div class="section"><div class="blog-author">Author biography</div>'
      + '<div class="section-metadata"></div></div>'
      + '<div class="section"><div class="metadata"></div><div class="section-metadata"></div></div>'
      + '<div class="section" hidden><div class="content"><h2>Hidden section</h2></div></div>'
      + '<div class="section" data-footer-promo><div class="content">Footer promo</div></div>');
    const metadata = main.querySelector('.card-metadata').parentElement;
    const pageMetadata = main.querySelector('.metadata').parentElement;
    const hiddenSection = main.querySelector('.section[hidden]');
    const footerPromo = main.lastElementChild;
    await init(block);
    const article = main.querySelector('.blog-article-content');
    expect([...article.children].map((section) => section.firstElementChild.className))
      .to.deep.equal(['content', 'tag-cta', 'related-content-card', 'blog-author']);
    expect(article.querySelector('.blog-author + .section-metadata')).to.exist;
    expect(metadata.parentElement).to.equal(main);
    expect(pageMetadata.parentElement).to.equal(main);
    expect(hiddenSection.parentElement).to.equal(main);
    expect(footerPromo.parentElement).to.equal(main);
    expect(block.querySelectorAll('nav a').length).to.equal(1);
  });

  it('discovers related content hidden while waiting to move into the sidenav', async () => {
    const { main, block } = buildArticle('<h2>Article section</h2><p>Article copy.</p>');
    main.querySelector('.content').parentElement.insertAdjacentHTML(
      'beforebegin',
      '<div class="section"><div class="blog-related-content" hidden '
      + 'data-related-content-initialized="true">Related articles</div></div>',
    );
    const related = main.querySelector('.blog-related-content');
    await init(block);
    expect(related.parentElement).to.equal(block);
    await init(block);
    expect(related.parentElement).to.equal(block);
    expect(main.querySelectorAll('.blog-article-layout').length).to.equal(1);
    expect(block.querySelectorAll('nav a').length).to.equal(1);
  });

  [
    '<div class="section blog-layout-end"><div class="section-metadata"></div></div>',
    '<div class="section"><div class="section-metadata"><div><div>Style</div>'
      + '<div>blog-layout-end</div></div></div></div>',
  ].forEach((boundary, index) => {
    it(`stops layout and jump links at the boundary from ${index ? 'authored metadata' : 'a decorated class'}`, async () => {
      const { main, block } = buildArticle('<h2>Article section</h2><p>Final copy.</p>');
      main.insertAdjacentHTML('beforeend', `${boundary}<div class="section">`
        + '<div class="content"><h2>Outside the blog layout</h2></div>'
        + '<div class="blog-related-content">Outside related content</div></div>');
      const outside = main.lastElementChild;
      await init(block);
      expect(main.querySelector('.blog-article-content').children.length).to.equal(1);
      expect(outside.parentElement).to.equal(main);
      expect(outside.querySelector('.blog-related-content')).to.exist;
      expect(block.querySelector('.blog-related-content')).not.to.exist;
      expect([...block.querySelectorAll('nav a')].map((link) => link.textContent))
        .to.deep.equal(['Article section']);
    });
  });

  it('stops at the site footer even when it is placed inside main', async () => {
    const { main, block } = buildArticle('<h2>Article section</h2>');
    main.insertAdjacentHTML('beforeend', '<footer><div class="content"><h2>Footer heading</h2></div></footer>');
    const footer = main.lastElementChild;
    await init(block);
    expect(footer.parentElement).to.equal(main);
    expect(main.querySelector('.blog-article-content').contains(footer)).to.equal(false);
    expect(block.querySelectorAll('nav a').length).to.equal(1);
  });

  it('contains the final paragraph margin so the layout reaches the footer at every size', async () => {
    const originalViewport = { width: window.innerWidth, height: window.innerHeight };
    const style = document.createElement('style');
    const footer = document.createElement('footer');
    style.textContent = `${await readFile({ path: '../../../libs/blocks/blog-side-navigation/blog-side-navigation.css' })}
      body { margin: 0; } .content p { margin: 0 0 18px; }`;
    document.head.append(style);
    const { main, block } = buildArticle('<h2>Article section</h2><p>Final paragraph.</p>');
    main.style.setProperty('--grid-container-width', '80%');
    footer.style.height = '20px';
    main.after(footer);
    try {
      await init(block);
      const layout = main.querySelector('.blog-article-layout');
      for (const width of [375, 768, 1440]) {
        await setViewport({ width, height: 900 });
        expect(layout.getBoundingClientRect().bottom)
          .to.be.closeTo(footer.getBoundingClientRect().top, 0.01);
      }
    } finally {
      footer.remove();
      style.remove();
      await setViewport(originalViewport);
    }
  });

  it('uses a compact sticky rail on tablet, a wider desktop layout, and full-width jump links only on mobile', async () => {
    const originalViewport = { width: window.innerWidth, height: window.innerHeight };
    const style = document.createElement('style');
    const css = await readFile({ path: '../../../libs/blocks/blog-side-navigation/blog-side-navigation.css' });
    style.textContent = `:root { --grid-container-width: 83.4%; }
      @media (min-width: 1440px) { :root { --grid-container-width: 1200px; } }
      body { margin: 0; }
      .blog-header { min-height: 200px; width: var(--grid-container-width); margin-inline: auto; }
      ${css}`;
    document.head.append(style);
    try {
      await setViewport({ width: 1440, height: 1000 });
      const { main, block } = buildArticle(
        '<h2>Article section</h2><p>Article content.</p><h2>Second</h2><h2>Third</h2><h2>Fourth</h2>',
      );
      await init(block);
      const layout = main.querySelector('.blog-article-layout');
      const article = main.querySelector('.blog-article-content');
      const listStyle = getComputedStyle(block.querySelector('nav > ul'));
      expect(listStyle.borderRadius).to.equal('4px');
      expect(listStyle.border).to.equal('1px solid rgb(221, 221, 221)');
      expect(listStyle.backgroundColor).to.equal('rgb(255, 255, 255)');
      expect(listStyle.boxShadow).to.equal('rgba(0, 0, 0, 0.08) 1px 1px 4px 0px');
      expect(getComputedStyle(layout).columnGap).to.equal('56px');
      expect(getComputedStyle(layout).marginBottom).to.equal('0px');
      expect(getComputedStyle(block).position).to.equal('sticky');
      expect(getComputedStyle(block).top).to.equal('88px');
      expect(getComputedStyle(block).overflowY).to.equal('auto');
      expect(getComputedStyle(block.querySelector('[aria-current="location"]'))
        .borderInlineStartWidth).to.equal('0px');
      expect(getComputedStyle(block.querySelector('[aria-current="location"]').parentElement)
        .backgroundColor).to.equal('rgba(0, 0, 0, 0)');
      expect(block.getBoundingClientRect().width).to.be.at.most(280);
      expect(article.getBoundingClientRect().left)
        .to.be.greaterThan(block.getBoundingClientRect().right);
      expect(article.getBoundingClientRect().top).to.equal(block.getBoundingClientRect().top);
      expect(block.getBoundingClientRect().top)
        .to.be.at.least(main.querySelector('.blog-header').getBoundingClientRect().bottom);
      expect(main.querySelector('.content').getBoundingClientRect().width)
        .to.equal(article.getBoundingClientRect().width);
      for (const width of [1440, 1600, 2000]) {
        await setViewport({ width, height: 1000 });
        expect(layout.getBoundingClientRect().width).to.equal(1200);
        expect(layout.getBoundingClientRect().left)
          .to.equal(main.querySelector('.blog-header').getBoundingClientRect().left);
        expect(article.getBoundingClientRect().left)
          .to.be.closeTo(block.getBoundingClientRect().right + 56, 1);
        expect(article.getBoundingClientRect().right)
          .to.be.closeTo(layout.getBoundingClientRect().right, 1);
      }
      block.insertAdjacentHTML('beforeend', '<div class="blog-related-content" style="height: 80px"></div>');
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
      for (const width of [1199, 1024, 768, 600, 599, 390, 458, 1440, 390]) {
        await setViewport({ width, height: 1000 });
        const nav = block.querySelector('nav');
        if (width < 600) {
          expect(getComputedStyle(block).display).to.equal('contents');
          expect(getComputedStyle(nav).position).to.equal('sticky');
          expect(article.getBoundingClientRect().top)
            .to.be.greaterThan(nav.getBoundingClientRect().bottom);
          expect(nav.getBoundingClientRect().width).to.be.closeTo(width, 1);
          expect(nav.getBoundingClientRect().left).to.be.closeTo(0, 1);
          expect(nav.getBoundingClientRect().right).to.be.closeTo(width, 1);
          expect(nav.querySelector('ul').getBoundingClientRect().width).to.be.closeTo(width, 1);
          expect(article.getBoundingClientRect().width)
            .to.be.lessThan(nav.getBoundingClientRect().width);
          const button = block.querySelector('button');
          for (const expanded of [false, true]) {
            if (button.getAttribute('aria-expanded') !== String(expanded)) button.click();
            expect(button.hidden).to.equal(false);
            expect(button.getBoundingClientRect().width).to.equal(32);
            expect(button.getBoundingClientRect().left).to.be.at.least(0);
            expect(button.getBoundingClientRect().right).to.be.at.most(width);
            const link = button.parentElement.querySelector('a')
              || button.parentElement.querySelector('.blog-side-navigation-label');
            const text = link.querySelector('span') || link;
            const textLeft = link.getBoundingClientRect().left
              + parseFloat(getComputedStyle(link).paddingInlineStart);
            expect(textLeft).to.be.closeTo(block.querySelector(':scope > p')
              .getBoundingClientRect().left, 1);
            expect(text.getBoundingClientRect().right)
              .to.be.at.most(button.getBoundingClientRect().left);
          }
        } else {
          expect(getComputedStyle(layout).display).to.equal('grid');
          const gap = width < 1200 ? 32 : 56;
          expect(getComputedStyle(layout).columnGap).to.equal(`${gap}px`);
          expect(getComputedStyle(block).position).to.equal('sticky');
          expect(getComputedStyle(nav).position).to.equal('relative');
          expect(article.getBoundingClientRect().left)
            .to.be.closeTo(block.getBoundingClientRect().right + gap, 1);
          expect(article.getBoundingClientRect().top).to.equal(block.getBoundingClientRect().top);
          expect(block.getBoundingClientRect().width).to.be.at.most(280);
          const related = block.querySelector('.blog-related-content');
          expect(related.getBoundingClientRect().left).to.equal(block.getBoundingClientRect().left);
          expect(related.getBoundingClientRect().width)
            .to.equal(block.getBoundingClientRect().width);
          window.scrollTo({ top: 400, behavior: 'instant' });
          await new Promise(requestAnimationFrame);
          expect(block.getBoundingClientRect().top).to.be.closeTo(88, 1);
          window.scrollTo({ top: 0, behavior: 'instant' });
          await new Promise(requestAnimationFrame);
        }
        expect(document.documentElement.scrollWidth).to.be.at.most(width);
      }
    } finally {
      style.remove();
      await setViewport(originalViewport);
    }
  });

  it('hides internal scrollbars without clipping long navigation or keyboard focus', async () => {
    const originalViewport = { width: window.innerWidth, height: window.innerHeight };
    const style = document.createElement('style');
    style.textContent = await readFile({ path: '../../../libs/blocks/blog-side-navigation/blog-side-navigation.css' });
    document.head.append(style);
    try {
      for (const width of [390, 768, 1440]) {
        await setViewport({ width, height: 400 });
        const content = Array.from({ length: 12 }, (_, index) => `<h2>Section ${index}</h2>`)
          .join('');
        const { main, block } = buildArticle(content);
        await init(block);
        main.querySelector('.blog-article-content').style.minHeight = '2000px';
        const button = block.querySelector('button');
        if (button.getAttribute('aria-expanded') === 'false') button.click();
        const scroller = width < 600 ? block.querySelector('nav') : block;
        expect(getComputedStyle(scroller).overflowY).to.equal('auto');
        expect(getComputedStyle(scroller).scrollbarWidth).to.equal('none');
        expect(getComputedStyle(scroller, '::-webkit-scrollbar').display).to.equal('none');
        expect(scroller.scrollHeight).to.be.greaterThan(scroller.clientHeight);
        expect(scroller.offsetWidth).to.equal(scroller.clientWidth);
        scroller.scrollTop = 40;
        expect(scroller.scrollTop).to.equal(40);
        const lastLink = block.querySelector('nav > ul > li:last-child > a');
        lastLink.focus();
        expect(document.activeElement).to.equal(lastLink);
        expect(lastLink.getBoundingClientRect().top)
          .to.be.at.least(scroller.getBoundingClientRect().top);
        expect(lastLink.getBoundingClientRect().bottom)
          .to.be.at.most(scroller.getBoundingClientRect().bottom + 1);
        main.remove();
      }
    } finally {
      style.remove();
      await setViewport(originalViewport);
    }
  });

  it('keeps article and related-card layers beneath sticky navigation and the global header', async () => {
    const originalViewport = { width: window.innerWidth, height: window.innerHeight };
    const style = document.createElement('style');
    style.textContent = `:root { --grid-container-width: calc(100% - 48px); }
      .blog-header { min-height: 200px; }
      .overlapping-content { position: fixed; inset: 0; z-index: 2147483647; background: red; }
      ${await readFile({ path: '../../../libs/blocks/blog-side-navigation/blog-side-navigation.css' })}`;
    document.head.append(style);
    scrollStub.callThrough();
    try {
      for (const width of [390, 768, 1440]) {
        await setViewport({ width, height: 800 });
        window.scrollTo({ top: 0, behavior: 'instant' });
        const { main, block } = buildArticle('<h2>First</h2><h2>Second</h2><h2>Third</h2><h2>Fourth</h2>');
        main.insertAdjacentHTML('afterbegin', '<div class="global-navigation" style="position: fixed; inset: 0 0 auto; height: 64px; z-index: 10; background: white"></div>');
        await init(block);
        const article = main.querySelector('.blog-article-content');
        article.style.minHeight = '2400px';
        article.insertAdjacentHTML('beforeend', '<div class="overlapping-content"></div>');
        block.insertAdjacentHTML('beforeend', '<div class="blog-related-content"><div class="overlapping-content"></div></div>');
        window.scrollTo({ top: 400, behavior: 'instant' });
        await new Promise(requestAnimationFrame);
        const nav = block.querySelector('nav');
        const bounds = nav.getBoundingClientRect();
        const x = bounds.left + bounds.width / 2;
        const y = bounds.top + 20;
        const topElement = document.elementFromPoint(x, y);
        expect(topElement.closest('nav') === nav, JSON.stringify({
          width,
          x,
          y,
          actual: topElement.className,
          articleIsolation: getComputedStyle(article).isolation,
          relatedIsolation: getComputedStyle(block.querySelector('.blog-related-content')).isolation,
          navZIndex: getComputedStyle(nav).zIndex,
        })).to.equal(true);
        expect(document.elementFromPoint(width / 2, 32).closest('.global-navigation')
          === main.querySelector('.global-navigation')).to.equal(true);
        main.insertAdjacentHTML('beforeend', '<div class="page-dialog" style="position: fixed; inset: 0; z-index: 100; background: white"></div>');
        expect(document.elementFromPoint(x, y)
          === main.querySelector('.page-dialog')).to.equal(true);
        main.remove();
      }
    } finally {
      window.scrollTo({ top: 0, behavior: 'instant' });
      style.remove();
      await setViewport(originalViewport);
    }
  });

  it('pins only jump links below the global header on mobile and clears section targets', async () => {
    const originalViewport = { width: window.innerWidth, height: window.innerHeight };
    const style = document.createElement('style');
    const css = await readFile({ path: '../../../libs/blocks/blog-side-navigation/blog-side-navigation.css' });
    style.textContent = `:root { --grid-container-width: calc(100% - 48px); --global-height-nav: 64px; }
      .blog-header { min-height: 200px; }${css}`;
    document.head.append(style);
    scrollStub.callThrough();
    try {
      for (const width of [390, 599]) {
        await setViewport({ width, height: 800 });
        window.scrollTo({ top: 0, behavior: 'instant' });
        const { main, block } = buildArticle('<h2>First</h2><h2>Second</h2><h2>Third</h2><h2>Fourth</h2>');
        main.insertAdjacentHTML('afterbegin', '<div class="global-navigation" style="position: fixed; top: 0; height: 64px"></div>');
        await init(block);
        const nav = block.querySelector('nav');
        const related = document.createElement('div');
        related.className = 'blog-related-content';
        related.style.height = '240px';
        related.style.marginBlockStart = '40px';
        block.append(related);
        const article = main.querySelector('.blog-article-content');
        article.style.minHeight = '2400px';
        main.insertAdjacentHTML('beforeend', '<div style="height: 1000px"></div>');
        await new Promise(requestAnimationFrame);
        const relatedTop = related.getBoundingClientRect().top;
        const title = block.querySelector(':scope > p');
        const titleTop = title.getBoundingClientRect().top;
        expect(title.textContent).to.equal('JUMP TO SECTION');
        expect(nav.getBoundingClientRect().top).to.be.greaterThan(64);
        for (const top of [600, 900]) {
          window.scrollTo({ top, behavior: 'instant' });
          await new Promise(requestAnimationFrame);
          expect(nav.getBoundingClientRect().top).to.be.closeTo(64, 1);
          expect(nav.querySelector('ul').getBoundingClientRect().top).to.be.closeTo(64, 1);
          expect(title.getBoundingClientRect().top).to.be.closeTo(titleTop - top, 1);
          expect(title.getBoundingClientRect().bottom).to.be.at.most(64);
          expect(related.getBoundingClientRect().top).to.be.closeTo(relatedTop - top, 1);
          expect(getComputedStyle(related).position).to.equal('static');
          expect(nav.getBoundingClientRect().height).to.be.at.most(736);
          expect(document.documentElement.scrollWidth).to.be.at.most(width);
        }
        const button = block.querySelector('button');
        if (button.getAttribute('aria-expanded') === 'false') button.click();
        await new Promise(requestAnimationFrame);
        await new Promise(requestAnimationFrame);
        const heading = main.querySelectorAll('h2')[1];
        const margin = parseFloat(getComputedStyle(heading).scrollMarginTop);
        expect(margin).to.be.closeTo(64 + nav.getBoundingClientRect().height + 24, 1);
        scrollStub.resetHistory();
        scrollStub.callsFake(() => {});
        block.querySelector('a[href="#section-2"]').click();
        await Promise.resolve();
        await new Promise(requestAnimationFrame);
        await new Promise(requestAnimationFrame);
        const collapsedMargin = parseFloat(getComputedStyle(heading).scrollMarginTop);
        const expectedTop = heading.getBoundingClientRect().top + window.scrollY - collapsedMargin;
        expect(button.getAttribute('aria-expanded')).to.equal('false');
        expect(scrollStub.firstCall.args[0].top).to.be.closeTo(expectedTop, 1);
        expect(document.activeElement === heading).to.equal(true);
        scrollStub.resetBehavior();
        scrollStub.callThrough();
        main.remove();
      }
    } finally {
      scrollStub.resetBehavior();
      scrollStub.callThrough();
      window.scrollTo({ top: 0, behavior: 'instant' });
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
    mockTablet(false);
    const { block } = buildArticle('<h2>First</h2><h2>Second</h2><h2>Third</h2><h2>Fourth</h2>');
    await init(block);
    const button = block.querySelector('button');
    button.click();
    const link = block.querySelectorAll('a')[1];
    link.addEventListener('click', (event) => event.preventDefault());
    link.dispatchEvent(new MouseEvent('click', { ctrlKey: true, cancelable: true }));
    expect(scrollStub.called).to.equal(false);
    expect(window.location.href).to.equal(originalUrl);
    expect(button.getAttribute('aria-expanded')).to.equal('true');
    expect(block.querySelectorAll('li[hidden]').length).to.equal(0);
  });

  it('closes only mobile dropdowns on selection and preserves open tablet and desktop rails', async () => {
    const originalViewport = { width: window.innerWidth, height: window.innerHeight };
    const style = document.createElement('style');
    style.textContent = `:root { --grid-container-width: calc(100% - 48px); }
      ${await readFile({ path: '../../../libs/blocks/blog-side-navigation/blog-side-navigation.css' })}`;
    document.head.append(style);
    try {
      for (const width of [390, 768, 1199, 1200, 1440]) {
        await setViewport({ width, height: 1000 });
        const longTitle = 'A selected section title that wraps onto more than one line. '.repeat(8);
        const { main, block } = buildArticle(
          `<h2>First</h2><h2>Second</h2><h2>Third</h2><h2>${longTitle}</h2>`,
        );
        main.insertAdjacentHTML('afterbegin', '<div class="global-navigation" style="height: 64px"></div>');
        await init(block);
        const button = block.querySelector('button');
        if (button.getAttribute('aria-expanded') === 'false') button.click();
        const links = [...block.querySelectorAll('nav > ul > li > a')];
        const heading = main.querySelectorAll('h2')[3];
        links[3].focus({ preventScroll: true });
        scrollStub.resetHistory();
        links[3].click();
        await Promise.resolve();
        const desktop = width >= 600;
        expect(button.getAttribute('aria-expanded')).to.equal(String(desktop));
        expect(block.querySelectorAll('li[hidden]').length).to.equal(desktop ? 0 : 3);
        expect(document.activeElement === heading).to.equal(true);
        expect(window.location.hash).to.equal('#section-4');
        if (!desktop) {
          expect(links[3].parentElement.hidden).to.equal(false);
          expect(button.parentElement === links[3].parentElement).to.equal(true);
          expect(links[3].getAttribute('aria-current')).to.equal('location');
        }
        const nav = block.querySelector('nav');
        const extra = desktop ? 0 : nav.getBoundingClientRect().height + 24;
        const expectedTop = heading.getBoundingClientRect().top + window.scrollY - 64 - extra;
        expect(scrollStub.firstCall.args[0].top).to.be.closeTo(expectedTop, 1);
        button.click();
        expect(button.getAttribute('aria-expanded')).to.equal(String(!desktop));
        main.remove();
        window.history.replaceState(null, '', originalUrl);
      }
    } finally {
      style.remove();
      await setViewport(originalViewport);
    }
  });

  it('starts expanded and only offers collapse for more than three links on tablet', async () => {
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

  it('defaults desktop and tablet navigation open while keeping collapsible mobile lists closed', async () => {
    const originalViewport = { width: window.innerWidth, height: window.innerHeight };
    try {
      for (const width of [390, 599, 600, 1199, 1200, 1440]) {
        await setViewport({ width, height: 1000 });
        for (const count of [3, 4]) {
          const content = Array.from({ length: count }, (_, index) => `<h2>Section ${index}</h2>`)
            .join('');
          const { main, block } = buildArticle(content);
          await init(block);
          const button = block.querySelector('button');
          const items = [...block.querySelectorAll('li')];
          const open = count <= 3 || width >= 600;
          expect(button.hidden).to.equal(count <= 3);
          expect(button.getAttribute('aria-expanded')).to.equal(String(open));
          expect(items.filter((item) => !item.hidden).length).to.equal(open ? count : 1);
          if (count > 3) {
            button.click();
            expect(button.getAttribute('aria-expanded')).to.equal(String(!open));
            expect(items.filter((item) => !item.hidden).length).to.equal(open ? 1 : count);
            button.click();
            expect(button.getAttribute('aria-expanded')).to.equal(String(open));
          }
          main.remove();
        }
      }
    } finally {
      await setViewport(originalViewport);
    }
  });

  it('keeps short mobile lists open and only collapses lists with four or more links', async () => {
    mockTablet(false);
    for (const count of [1, 2, 3, 4, 5]) {
      const content = Array.from({ length: count }, (_, index) => `<h2>Section ${index}</h2>`)
        .join('');
      const { main, block } = buildArticle(content);
      await init(block);
      const button = block.querySelector('button');
      const items = [...block.querySelectorAll('li')];
      if (count === 1) {
        expect(button).not.to.exist;
        expect(items[0].hidden).to.equal(false);
      } else if (count <= 3) {
        expect(button.hidden).to.equal(true);
        expect(button.getAttribute('aria-expanded')).to.equal('true');
        expect(items.every((item) => !item.hidden)).to.equal(true);
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
    const originalViewport = { width: window.innerWidth, height: window.innerHeight };
    await setViewport({ width: 1440, height: 1000 });
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
          const iconStyle = getComputedStyle(icon);
          expect(bounds.width).to.equal(32);
          expect(bounds.height).to.equal(32);
          const vertical = getComputedStyle(icon, '::after');
          expect(vertical.display === 'none').to.equal(expanded);
          const strokes = expanded
            ? [['::before', 6, 1.5]]
            : [['::before', 12, 2], ['::after', 2, 12]];
          for (const [pseudo, expectedWidth, expectedHeight] of strokes) {
            const stroke = getComputedStyle(icon, pseudo);
            const width = parseFloat(stroke.width);
            const height = parseFloat(stroke.height);
            expect(width).to.equal(expectedWidth);
            expect(height).to.equal(expectedHeight);
            const centerX = iconBounds.left + parseFloat(stroke.left)
              + parseFloat(iconStyle.borderLeftWidth) + parseFloat(stroke.marginLeft) + width / 2;
            const centerY = iconBounds.top + parseFloat(stroke.top)
              + parseFloat(iconStyle.borderTopWidth) + parseFloat(stroke.marginTop) + height / 2;
            expect(centerX).to.be.closeTo(bounds.left + bounds.width / 2, 0.1);
            expect(centerY).to.be.closeTo(bounds.top + bounds.height / 2, 0.1);
          }
        }
      }
    } finally {
      style.remove();
      await setViewport(originalViewport);
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

  it('keeps short lists open and preserves link focus across mobile and tablet breakpoints', async () => {
    const media = mockTablet();
    for (const count of [2, 3]) {
      const { main, block } = buildArticle(
        Array.from({ length: count }, (_, index) => `<h2>Section ${index}</h2>`).join(''),
      );
      await init(block);
      const button = block.querySelector('button');
      const links = [...block.querySelectorAll('a')];
      links[1].focus({ preventScroll: true });
      for (const matches of [false, true, false]) {
        media.matches = matches;
        media.dispatchEvent(new Event('change'));
        expect(button.hidden).to.equal(true);
        expect(button.getAttribute('aria-expanded')).to.equal('true');
        expect(block.querySelectorAll('li[hidden]').length).to.equal(0);
        expect(document.activeElement).to.equal(links[1]);
      }
      links[1].click();
      await Promise.resolve();
      expect(button.hidden).to.equal(true);
      expect(button.getAttribute('aria-expanded')).to.equal('true');
      expect(block.querySelectorAll('li[hidden]').length).to.equal(0);
      expect(document.activeElement).to.equal(main.querySelectorAll('h2')[1]);
      main.remove();
    }
  });

  it('tracks sections in both scroll directions without moving focus, scrolling, or changing the URL', async () => {
    const originalViewport = { width: window.innerWidth, height: window.innerHeight };
    await setViewport({ width: 1440, height: 1000 });
    const style = document.createElement('style');
    style.textContent = await readFile({ path: '../../../libs/blocks/blog-side-navigation/blog-side-navigation.css' });
    document.head.append(style);
    const { main, block } = buildArticle('<h2>First</h2><h2>Second</h2><h2>Third</h2>');
    let positions = [20, 1000, 2000];
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
        [1020, 1],
        [2020, 2],
        [0, 0],
      ]) {
        scrollTop = position;
        window.dispatchEvent(new Event('scroll'));
        await new Promise(requestAnimationFrame);
        expect(current()).to.deep.equal([links[activeIndex]]);
        links.forEach((link, index) => {
          expect(getComputedStyle(link.parentElement).backgroundColor)
            .to.equal('rgba(0, 0, 0, 0)');
          expect(getComputedStyle(link).borderInlineStartWidth).to.equal('0px');
          expect(getComputedStyle(link).paddingInlineStart).to.equal('8px');
          expect(getComputedStyle(link).fontWeight).to.equal(index === activeIndex ? '700' : '400');
        });
        expect(document.activeElement).to.equal(links[0]);
        expect(window.location.href).to.equal(url);
        expect(scrollStub.called).to.equal(false);
      }
      positions = [20, 500, 2000];
      scrollTop = 750;
      window.dispatchEvent(new Event('resize'));
      await new Promise(requestAnimationFrame);
      expect(current()).to.deep.equal([links[1]]);
    } finally {
      style.remove();
      rectangles.forEach((rectangle) => rectangle.restore());
      scrollPosition.restore();
      await setViewport(originalViewport);
    }
  });

  [[true, 4], [false, 4]].forEach(([tablet, count]) => {
    it(`shows the active section while collapsed with ${count} links on ${tablet ? 'desktop' : 'mobile'}`, async () => {
      const originalViewport = { width: window.innerWidth, height: window.innerHeight };
      await setViewport({ width: tablet ? 1440 : 390, height: 1000 });
      mockTablet(tablet);
      const titles = ['First', 'Second', 'Third', 'Fourth'].slice(0, count);
      const { main, block } = buildArticle(titles.map((title) => `<h2>${title}</h2>`).join(''));
      const positions = titles.map((_, index) => 20 + index * 1000);
      let scrollTop = 0;
      const scrollPosition = stub(window, 'scrollY').get(() => scrollTop);
      const rectangles = [...main.querySelectorAll('h2')].map((heading, index) => (
        stub(heading, 'getBoundingClientRect').callsFake(() => ({ top: positions[index] - scrollTop }))
      ));
      const style = document.createElement('style');
      style.textContent = await readFile({ path: '../../../libs/blocks/blog-side-navigation/blog-side-navigation.css' });
      document.head.append(style);
      try {
        await init(block);
        const button = block.querySelector('button');
        const items = [...block.querySelectorAll('nav > ul > li')];
        const links = items.map((item) => item.querySelector('a'));
        if (tablet) button.click();
        button.focus({ preventScroll: true });
        const url = window.location.href;
        for (const activeIndex of [count - 1, 0, 1]) {
          scrollTop = activeIndex ? positions[activeIndex] + 10 : 0;
          window.dispatchEvent(new Event('scroll'));
          await new Promise(requestAnimationFrame);
          const visible = items.filter((item) => !item.hidden);
          expect(visible.length).to.equal(1);
          expect(visible[0] === items[activeIndex]).to.equal(true);
          expect(visible[0].querySelector('a').textContent).to.equal(titles[activeIndex]);
          expect(visible[0].querySelector('a').getAttribute('href')).to.equal(`#section-${activeIndex + 1}`);
          expect(links[activeIndex].getAttribute('aria-current')).to.equal('location');
          expect(getComputedStyle(links[activeIndex]).fontWeight).to.equal(tablet ? '400' : '700');
          expect(button.parentElement === visible[0]).to.equal(true);
          expect(button.getAttribute('aria-expanded')).to.equal('false');
          expect(getComputedStyle(visible[0]).display).to.equal('flex');
          expect(getComputedStyle(visible[0]).borderTopWidth).to.equal('0px');
          expect(getComputedStyle(visible[0]).backgroundColor)
            .to.equal('rgba(0, 0, 0, 0)');
          expect(items.filter((item) => getComputedStyle(item).display !== 'none').length).to.equal(1);
          expect(document.activeElement === button).to.equal(true);
          expect(window.location.href).to.equal(url);
          expect(scrollStub.called).to.equal(false);
        }
        button.click();
        expect(items.every((item) => !item.hidden)).to.equal(true);
        expect(links.map((link) => link.textContent)).to.deep.equal(titles);
        const expandedControl = tablet ? items[0] : block.querySelector('.blog-side-navigation-current');
        expect(button.parentElement === expandedControl).to.equal(true);
        expect(document.activeElement === button).to.equal(true);
        if (!tablet) {
          expect(expandedControl.querySelector('.blog-side-navigation-label').textContent)
            .to.equal(titles[1]);
          scrollTop = positions[2] + 10;
          window.dispatchEvent(new Event('scroll'));
          await new Promise(requestAnimationFrame);
          expect(expandedControl.querySelector('.blog-side-navigation-label').textContent)
            .to.equal(titles[2]);
          expect(getComputedStyle(links[2]).fontWeight).to.equal('700');
          expect(getComputedStyle(links[1]).fontWeight).to.equal('400');
          scrollTop = positions[1] + 10;
          window.dispatchEvent(new Event('scroll'));
          await new Promise(requestAnimationFrame);
        }
        links[0].focus({ preventScroll: true });
        button.click();
        expect(items[1].hidden).to.equal(false);
        expect(items[0].hidden).to.equal(true);
        expect(document.activeElement === button).to.equal(true);
      } finally {
        style.remove();
        rectangles.forEach((rectangle) => rectangle.restore());
        scrollPosition.restore();
        await setViewport(originalViewport);
      }
    });
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
