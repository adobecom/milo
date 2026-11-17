import { expect } from '@esm-bundle/chai';
import { stub } from 'sinon';
import * as utils from '../../../../libs/utils/utils.js';
import { waitFor } from '../../../helpers/waitfor.js';
import initAiSummary from '../../../../libs/c2/blocks/ai-summary/ai-summary.js';
import initTagCta from '../../../../libs/c2/blocks/tag-cta/tag-cta.js';
import initRelatedCard from '../../../../libs/c2/blocks/related-content-card/related-content-card.js';
import initBlogHeader from '../../../../libs/c2/blocks/blog-header/blog-header.js';
import initSideNavigation from '../../../../libs/c2/blocks/blog-side-navigation/blog-side-navigation.js';
import initRelatedContent from '../../../../libs/c2/blocks/blog-related-content/blog-related-content.js';

const placeholders = {
  'blog-share': 'Share',
  'jump-to-section': 'JUMP TO SECTION',
  '1-min-read': '1 min read',
  '5-min-read': '5 min read',
};

utils.setConfig({
  locales: { '': { ietf: 'en-US', tk: 'hah7vzn.css' } },
  miloLibs: '/libs',
  codeRoot: '/libs',
  placeholders,
});
window.lana = { log: stub() };

const C2_BLOG_BLOCKS = [
  'ai-summary',
  'blog-header',
  'blog-related-content',
  'blog-side-navigation',
  'related-content-card',
  'tag-cta',
];

describe('blog C2 migration: routing', () => {
  let foundationMeta;

  beforeEach(() => {
    foundationMeta = document.createElement('meta');
    foundationMeta.name = 'foundation';
    foundationMeta.content = 'c2';
    document.head.appendChild(foundationMeta);
  });

  afterEach(() => {
    foundationMeta.remove();
  });

  C2_BLOG_BLOCKS.forEach((name) => {
    it(`loads ${name} from the C2 directory on a foundation=c2 page`, async () => {
      const block = document.createElement('div');
      block.className = name;
      document.body.append(block);

      await utils.loadBlock(block);

      // Registered as a C2 block, so it is not rejected as a C1-only block.
      expect(block.dataset.reason).to.be.undefined;
      expect(block.dataset.blockStatus, `${name} should initialize successfully`).to.equal('loaded');
      const link = document.head.querySelector(
        `link[rel="stylesheet"][href$="/c2/blocks/${name}/${name}.css"]`,
      );
      expect(link, `${name} CSS should load from /c2/blocks`).to.exist;

      block.remove();
    });
  });
});

describe('blog C2 migration: retained behavior', () => {
  it('ai-summary classifies image and content rows', () => {
    const block = document.createElement('div');
    block.className = 'ai-summary';
    block.innerHTML = '<div><picture><img src="x.png" alt=""></picture></div>'
      + '<div><p>Summary copy</p></div>';
    initAiSummary(block);
    expect(block.children[0].classList.contains('ai-summary-image')).to.be.true;
    expect(block.children[1].classList.contains('ai-summary-content')).to.be.true;
  });

  it('tag-cta renders authored links as a pill list', async () => {
    const block = document.createElement('div');
    block.className = 'tag-cta';
    block.innerHTML = '<div><div><h2>Tags</h2></div></div>'
      + '<div><div><a href="https://example.com/a">Alpha</a>'
      + '<a href="https://example.com/b">Beta</a></div></div>';
    await initTagCta(block);
    const items = block.querySelectorAll('.tag-cta-list > li');
    expect(block.querySelector('.tag-cta-heading')).to.exist;
    expect(items.length).to.equal(2);
  });

  it('related-content-card uses authored content when the linked article is unavailable', async () => {
    const fetchStub = stub(window, 'fetch').resolves({ ok: false, status: 404 });
    const block = document.createElement('div');
    block.className = 'related-content-card';
    block.innerHTML = '<div><div><h3><a href="https://example.com/post">A Post</a></h3>'
      + '<p><strong>2024-01-02</strong></p><p>3 min read</p><p>Design</p></div></div>';
    try {
      await initRelatedCard(block);
      expect(fetchStub.calledOnceWithExactly('https://example.com/post')).to.be.true;
      const link = block.querySelector('.related-content-card-link');
      expect(link).to.exist;
      expect(link.getAttribute('href')).to.equal('https://example.com/post');
      expect(block.querySelector('.related-content-card-title').textContent).to.equal('A Post');
    } finally {
      fetchStub.restore();
    }
  });

  it('blog-header decorates the eyebrow and byline', async () => {
    const main = document.createElement('main');
    const section = document.createElement('div');
    section.className = 'section';
    const block = document.createElement('div');
    block.className = 'blog-header';
    block.innerHTML = '<div><div><h1>Blog Title</h1></div></div>'
      + '<div><div><p>A short summary.</p></div></div>'
      + '<div><div><p>Jane Doe</p></div></div>';
    section.append(block);
    main.append(section);
    document.body.append(main);

    const readingTime = await initBlogHeader(block);

    expect(typeof readingTime).to.equal('number');
    expect(block.querySelector('.blog-header-eyebrow')).to.exist;
    expect(block.querySelector('.blog-header-byline')).to.exist;
    main.remove();
  });

  describe('blog-header schema', () => {
    const production = 'https://business.adobe.com';
    let fetchStub;
    let canonical;
    let main;
    let profileId = 0;

    const posting = () => {
      const script = document.head.querySelector('script[data-blog-schema="posting"]');
      return script ? JSON.parse(script.textContent) : null;
    };

    const profile = (social) => '<div class="blog-author">'
      + '<div><div><picture><img src="./media_jane.png" alt=""></picture></div></div>'
      + '<div><div><h1>Jane Doe</h1></div></div>'
      + '<div><div>Staff Writer</div></div>'
      + '<div><div>Jane writes about automation.</div></div>'
      + `<div><div>${social}</div></div>`
      + '<div><div>Adobe</div></div></div>';

    const buildHeader = (author) => {
      main = document.createElement('main');
      main.innerHTML = '<div class="section"><div class="blog-header">'
        + '<div><div><h1>Blog Title</h1></div></div>'
        + '<div><div><p>A short summary.</p></div></div>'
        + `<div><div><p>${author}</p></div></div></div></div>`;
      document.body.append(main);
      return main.querySelector('.blog-header');
    };

    beforeEach(() => {
      profileId += 1;
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      canonical.href = `${production}/blog/article?milolibs=preview#section`;
      document.head.append(canonical);
      fetchStub = stub(window, 'fetch').resolves({ ok: false, status: 404, text: async () => '' });
    });

    afterEach(() => {
      fetchStub.restore();
      canonical.remove();
      main?.remove();
      document.head.querySelectorAll('script[data-blog-schema]').forEach((el) => el.remove());
    });

    it('injects BlogPosting with a Person sourced from the author profile', async () => {
      const path = `/blog/authors/jane-doe-${profileId}`;
      fetchStub.withArgs(`${window.location.origin}${path}.plain.html`).resolves({
        ok: true,
        text: async () => profile('<a href="https://www.linkedin.com/in/jane">LinkedIn</a>'),
      });
      await initBlogHeader(buildHeader(`<a href="${path}">Jane Doe</a>`));
      await waitFor(() => posting()?.author.length === 1);

      expect(posting()['@type']).to.equal('BlogPosting');
      expect(posting().headline).to.equal('Blog Title');
      expect(posting().url).to.equal(`${production}/blog/article`);
      expect(posting().author[0]).to.deep.include({
        '@type': 'Person',
        name: 'Jane Doe',
        url: `${production}${path}`,
        '@id': `${production}${path}#person`,
        jobTitle: 'Staff Writer',
        sameAs: ['https://www.linkedin.com/in/jane'],
      });
    });

    it('omits non-social profile links from sameAs', async () => {
      const path = `/blog/authors/jane-doe-${profileId}`;
      fetchStub.withArgs(`${window.location.origin}${path}.plain.html`).resolves({
        ok: true,
        text: async () => profile('<a href="https://example.com/jane">Site</a>'),
      });
      await initBlogHeader(buildHeader(`<a href="${path}">Jane Doe</a>`));
      await waitFor(() => posting()?.author.length === 1);

      expect(posting().author[0]).not.to.have.property('sameAs');
    });

    it('injects BlogPosting without authors when no author page is linked', async () => {
      await initBlogHeader(buildHeader('Jane Doe'));
      await waitFor(() => posting() !== null);

      expect(posting().author).to.deep.equal([]);
    });
  });

  it('blog-side-navigation hides itself without a blog header', async () => {
    const main = document.createElement('main');
    const block = document.createElement('div');
    block.className = 'blog-side-navigation';
    main.append(block);
    document.body.append(main);

    await initSideNavigation(block);

    expect(block.hidden).to.be.true;
    main.remove();
  });

  it('blog-related-content hides outside the side navigation', async () => {
    const block = document.createElement('div');
    block.className = 'blog-related-content';
    document.body.append(block);

    await initRelatedContent(block);

    expect(block.hidden).to.be.true;
    block.remove();
  });
});
