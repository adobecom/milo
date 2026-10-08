import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { setConfig, getConfig } from '../../../libs/utils/utils.js';

const locales = { '': { ietf: 'en-US', tk: 'hah7vzn.css' } };
setConfig({ locales });
const config = getConfig();
// Resolve reading-time placeholders locally so tests never hit the network.
config.placeholders = { '1-min-read': '1 min read', '5-min-read': '5 min read' };

const { default: init } = await import('../../../libs/blocks/related-content-card/related-content-card.js');

const WORD = 'lorem';

function words(count) {
  return new Array(count).fill(WORD).join(' ');
}

// Builds a minimal fetched-article document for the fetch stub.
function buildArticle({
  title = 'Card Metadata Title.',
  ogTitle = 'OG Title | Adobe Blog',
  cardDate = '2026-04-20',
  pubDate = '2026-04-20',
  tags = 'caas:content-type/blog, caas:topic/news, caas:topic/summit',
  bodyWords = 400,
  cardImage = true,
  cardImageSrc = './media_abc.png?width=750&format=png',
  ogImage = '/mock/og-image.png',
} = {}) {
  const cardImageRow = cardImage ? `
    <div><div>cardImage</div><div>
      <picture>
        <source type="image/webp" srcset="./media_abc.png?width=2000&format=webply" media="(min-width: 600px)">
        <img loading="lazy" alt="" src="${cardImageSrc}" width="1512" height="852">
      </picture>
    </div></div>` : '';
  const cardDateRow = cardDate ? `<div><div>cardDate</div><div>${cardDate}</div></div>` : '';
  const tagsRow = tags ? `<div><div>Tags</div><div>${tags}</div></div>` : '';
  const titleRow = title ? `<div><div>Title</div><div>${title}</div></div>` : '';
  const ogTitleMeta = ogTitle ? `<meta property="og:title" content="${ogTitle}">` : '';
  const pubDateMeta = pubDate ? `<meta name="publication-date" content="${pubDate}">` : '';
  const ogImageMeta = ogImage ? `<meta property="og:image" content="${ogImage}">` : '';

  return `<!DOCTYPE html><html><head>
    <title>Document Title</title>
    ${ogTitleMeta}
    ${pubDateMeta}
    ${ogImageMeta}
  </head><body><main>
    <div class="article-header"><h1>${words(1000)}</h1></div>
    <div class="section">
      <div class="card-metadata">
        ${titleRow}
        ${cardDateRow}
        ${cardImageRow}
        <div><div>primaryTag</div><div>caas:content-type/blog</div></div>
        ${tagsRow}
      </div>
      <p>${words(bodyWords)}</p>
    </div>
  </main></body></html>`;
}

let fetchStub;
let originalLana;

function stubFetch(routes) {
  fetchStub = sinon.stub(window, 'fetch').callsFake(async (url) => {
    const route = routes[url];
    if (!route) return { ok: false, status: 404, text: async () => '' };
    return { ok: true, status: 200, text: async () => route };
  });
}

describe('related-content-card', () => {
  beforeEach(async () => {
    originalLana = window.lana;
    window.lana = { log: sinon.spy() };
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    stubFetch({
      '/mock/full-article': buildArticle(),
      '/mock/sparse-article': buildArticle({
        title: 'Sparse Title.', cardDate: '', pubDate: '', tags: '', cardImage: false, bodyWords: 100,
      }),
    });
  });

  afterEach(() => {
    fetchStub.restore();
    window.lana = originalLana;
  });

  it('renders a card from authored data only (no link)', async () => {
    const block = document.querySelector('#card-data');
    await init(block);
    // Card is always a link element; absent an href it carries no destination.
    const anchor = block.querySelector('a.related-content-card-link');
    expect(anchor).to.exist;
    expect(anchor.hasAttribute('href')).to.be.false;
    expect(block.querySelector('h3').textContent).to.equal('Introducing Adobe Brand Intelligence.');
    // Authored date formatted to localized month + year.
    expect(block.querySelector('.related-content-card-eyebrow').textContent).to.equal('April 2026');
    // Authored reading time preserved verbatim; authored category wins.
    expect(block.querySelector('.related-content-card-readtime').textContent).to.equal('5 mins');
    expect(block.querySelector('.related-content-card-category').textContent).to.equal('news');
    expect(fetchStub.called).to.be.false;
  });

  it('builds a whole-card link from a linked article', async () => {
    const block = document.querySelector('#card-link');
    await init(block);
    const anchor = block.querySelector('a.related-content-card-link');
    expect(anchor).to.exist;
    expect(block.querySelectorAll('a').length).to.equal(1);
    expect(anchor.getAttribute('href')).to.contain('/mock/full-article');
    expect(block.querySelector('h3').textContent).to.equal('Card Metadata Title.');
    expect(block.querySelector('.related-content-card-eyebrow').textContent).to.equal('April 2026');
    // First caas:topic tag -> category label.
    expect(block.querySelector('.related-content-card-category').textContent).to.equal('News');
  });

  it('preserves the query when fetching a same-origin article', async () => {
    fetchStub.restore();
    stubFetch({ '/mock/full-article?version=2': buildArticle({ title: 'Version two.' }) });
    const block = document.querySelector('#card-link');
    block.querySelector('a').href = '/mock/full-article?version=2#section';
    await init(block);
    expect(fetchStub.calledOnceWithExactly('/mock/full-article?version=2')).to.be.true;
    expect(block.querySelector('h3').textContent).to.equal('Version two.');
    expect(block.querySelector('.related-content-card-link').hash).to.equal('#section');
  });

  it('preserves the origin when fetching a cross-origin article', async () => {
    const articleUrl = 'https://example.com/mock/full-article?version=2';
    fetchStub.restore();
    stubFetch({ [articleUrl]: buildArticle({ title: 'Other origin.', cardImage: false, ogImage: '' }) });
    const block = document.querySelector('#card-link');
    block.querySelector('a').href = `${articleUrl}#section`;
    await init(block);
    expect(fetchStub.calledOnceWithExactly(articleUrl)).to.be.true;
    expect(block.querySelector('h3').textContent).to.equal('Other origin.');
    expect(block.querySelector('.related-content-card-link').href).to.equal(`${articleUrl}#section`);
  });

  it('resolves relative linked image URLs against the article URL', async () => {
    const block = document.querySelector('#card-link');
    await init(block);
    const img = block.querySelector('.related-content-card-image img');
    expect(img.getAttribute('src')).to.contain('/mock/media_abc.png');
    expect(img.getAttribute('src').startsWith('http')).to.be.true;
    const source = block.querySelector('.related-content-card-image source');
    expect(source.getAttribute('srcset')).to.contain('/mock/media_abc.png');
    expect(img.getAttribute('alt')).to.equal('');
  });

  it('prefers authored title and image, filling gaps from the link', async () => {
    const block = document.querySelector('#card-mix');
    await init(block);
    expect(block.querySelector('h3').textContent).to.equal('A different title than what is in the card metadata.');
    // Authored image retained (not the linked image).
    expect(block.querySelector('.related-content-card-image img').getAttribute('src')).to.equal('/authored-mix.png');
    // Gaps filled from link.
    expect(block.querySelector('.related-content-card-eyebrow').textContent).to.equal('April 2026');
    expect(block.querySelector('.related-content-card-category').textContent).to.equal('News');
    expect(block.querySelector('a.related-content-card-link')).to.exist;
  });

  it('honors empty authored slots and partial overrides', async () => {
    const block = document.querySelector('#card-partial');
    await init(block);
    expect(block.querySelector('h3').textContent).to.equal('Authored heading D.');
    // Empty reading-time slot falls back to the computed linked value.
    expect(block.querySelector('.related-content-card-readtime').textContent).to.equal('2 min read');
    // Authored category wins over linked.
    expect(block.querySelector('.related-content-card-category').textContent)
      .to.equal('My Custom Category');
  });

  ['', '<h2></h2>'].forEach((heading) => {
    it(`preserves authored fields with an ${heading ? 'empty' : 'omitted'} title`, async () => {
      const block = document.querySelector('#card-partial');
      const textCell = block.querySelector('h2').parentElement;
      block.querySelector('a').parentElement.innerHTML = '<p><a href="/mock/full-article">Article</a></p>';
      textCell.innerHTML = `
        <p><strong>2026-06-15</strong></p>
        ${heading}
        <p>7 mins</p>
        <p>My Custom Category</p>`;
      await init(block);
      expect(block.querySelector('h3').textContent).to.equal('Card Metadata Title.');
      expect(block.querySelector('.related-content-card-eyebrow').textContent).to.equal('June 2026');
      expect(block.querySelector('.related-content-card-readtime').textContent).to.equal('7 mins');
      expect(block.querySelector('.related-content-card-category').textContent).to.equal('My Custom Category');
    });
  });

  ['#card-link', '#card-mix'].forEach((selector) => {
    it(`preserves linked metadata when the optional image is malformed (${selector})`, async () => {
      fetchStub.restore();
      stubFetch({ '/mock/full-article': buildArticle({ cardImageSrc: 'http://' }) });
      const block = document.querySelector(selector);
      const authoredTitle = block.querySelector('h2')?.textContent;
      await init(block);
      expect(block.querySelector('h3').textContent).to.equal(authoredTitle || 'Card Metadata Title.');
      expect(block.classList.contains('related-content-card-unresolved')).to.be.false;
      expect(block.querySelector('.related-content-card-eyebrow').textContent).to.equal('April 2026');
      expect(block.querySelector('.related-content-card-readtime').textContent).to.equal('2 min read');
      expect(block.querySelector('.related-content-card-category').textContent).to.equal('News');
      const img = block.querySelector('.related-content-card-image img');
      if (selector === '#card-mix') {
        expect(img.getAttribute('src')).to.equal('/authored-mix.png');
      } else {
        expect(img === null).to.be.true;
      }
      expect(window.lana.log.calledOnce).to.be.true;
      expect(window.lana.log.firstCall.args[0]).to.contain('failed to resolve linked image');
    });
  });

  it('omits absent optional fields without dangling separators', async () => {
    const block = document.querySelector('#card-sparse');
    await init(block);
    expect(block.querySelector('h3').textContent).to.equal('Sparse Title.');
    expect(block.querySelector('.related-content-card-eyebrow')).to.be.null;
    expect(block.querySelector('.related-content-card-category')).to.be.null;
    expect(block.querySelector('.related-content-card-separator')).to.be.null;
    // Reading time still present and localized.
    expect(block.querySelector('.related-content-card-readtime').textContent).to.equal('1 min read');
  });

  it('counts reading time from main text only, excluding header and card-metadata', async () => {
    const block = document.querySelector('#card-link');
    await init(block);
    // 400 body words / 200 wpm = 2 min; excluded header (1000 words) is ignored.
    expect(block.querySelector('.related-content-card-readtime').textContent).to.equal('2 min read');
  });

  it('falls back to og:title when no card-metadata Title exists', async () => {
    fetchStub.restore();
    stubFetch({ '/mock/full-article': buildArticle({ title: '' }) });
    const block = document.querySelector('#card-link');
    await init(block);
    // og:title trimmed of the "| Adobe Blog" ending.
    expect(block.querySelector('h3').textContent).to.equal('OG Title');
  });

  it('keeps the original link visible when the fetch fails', async () => {
    const block = document.querySelector('#card-fail');
    await init(block);
    expect(block.classList.contains('related-content-card-unresolved')).to.be.true;
    const anchor = block.querySelector('a');
    expect(anchor).to.exist;
    expect(anchor.getAttribute('href')).to.contain('/mock/missing');
    expect(block.querySelector('h3')).to.be.null;
  });
});
