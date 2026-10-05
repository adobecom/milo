import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { stub } from 'sinon';
import { setConfig, getConfig } from '../../../libs/utils/utils.js';
import init, {
  getReadingTime,
  openShareModal,
  getShareUrl,
  getShareData,
} from '../../../libs/blocks/blog-header/blog-header.js';

const placeholders = {
  'blog-share': 'Share',
  'blog-share-post': 'Share post',
  'blog-share-close': 'Close share dialog',
  'blog-share-x': 'Share on X',
  'blog-share-email': 'Share via email',
  'blog-share-linkedin': 'Share on LinkedIn',
  'blog-share-copy-link': 'Copy link',
  'blog-share-link-copied': 'Link copied',
  'blog-share-copy-error': 'Copy failed',
  '1-min-read': '1 min read',
  '5-min-read': '5 min read',
};

setConfig({
  locales: { '': { ietf: 'en-US', tk: 'hah7vzn.css' } },
  miloLibs: '/libs',
  codeRoot: '/libs',
  placeholders,
});
window.lana = { log: stub() };

const svgText = await readFile({ path: '../../../libs/blocks/blog-header/blog-header.svg' });

const profileHtml = '<body><div class="blog-author"><div>'
  + '<picture><source srcset="./media_rachel.png?width=200 200w">'
  + '<img src="./media_rachel.png" alt="Rachel"></picture></div></div></body>';

function mockFetch({ profileStatus = 200, profileReject = false } = {}) {
  return stub(window, 'fetch').callsFake((url) => {
    if (url.includes('blog-header.svg')) {
      return Promise.resolve({ ok: true, text: () => Promise.resolve(svgText) });
    }
    if (url.includes('.plain.html')) {
      if (profileReject) return Promise.reject(new Error('network down'));
      return Promise.resolve({
        ok: profileStatus === 200,
        status: profileStatus,
        text: () => Promise.resolve(profileHtml),
      });
    }
    return Promise.resolve({ ok: false, status: 404, text: () => Promise.resolve('') });
  });
}

function buildBlock({ authors = 1, picture = false, link = true } = {}) {
  const main = document.createElement('main');
  const section = document.createElement('div');
  const block = document.createElement('div');
  block.className = 'blog-header';
  block.innerHTML = '<div><div><h1>Title of the article</h1></div></div>'
    + '<div><div>Summary of the article</div></div>';
  for (let i = 0; i < authors; i += 1) {
    const name = link ? '<a href="/blog/authors/rachel-thornton">Rachel Thornton</a>' : 'Rachel Thornton';
    const pic = picture ? '<p><picture><img src="/authored.png" alt="Authored"></picture></p>' : '';
    const row = `<div><div>${pic}<p>${name}</p><p>Author Title</p><p>Company</p></div></div>`;
    block.insertAdjacentHTML('beforeend', row);
  }
  block.insertAdjacentHTML('beforeend', `<p>${'word '.repeat(400)}</p>`);
  section.append(block);
  main.append(section);
  document.body.append(main);
  return { main, block };
}

describe('blog-header reading time', () => {
  let main;

  beforeEach(() => {
    main = document.createElement('main');
  });

  it('returns zero for empty or whitespace-only content', () => {
    expect(getReadingTime(main)).to.equal(0);
    main.textContent = ' \n\t ';
    expect(getReadingTime(main)).to.equal(0);
  });

  it('rounds up at the 200-word boundary', () => {
    main.textContent = 'word '.repeat(199);
    expect(getReadingTime(main)).to.equal(1);
    main.textContent = 'word '.repeat(200);
    expect(getReadingTime(main)).to.equal(1);
    main.textContent = 'word '.repeat(201);
    expect(getReadingTime(main)).to.equal(2);
  });

  it('counts headings, lists, and authored table cells without requiring whitespace', () => {
    main.innerHTML = '<h2>Heading</h2><p>Paragraph</p><ul><li>List</li></ul>'
      + '<div class="table"><div><div>Cell</div><div>Cell</div></div></div>'
      + `<p>${'word '.repeat(196)}</p>`;
    expect(getReadingTime(main)).to.equal(2);
  });

  it('preserves words split across inline markup and separates line breaks', () => {
    main.innerHTML = '<p>auto<strong>mation</strong> <a href="/">link</a><br>next '
      + `${'word '.repeat(197)}</p>`;
    expect(getReadingTime(main)).to.equal(1);
  });

  it('excludes header details, authoring metadata, and non-readable content', () => {
    const excluded = 'word '.repeat(200);
    main.innerHTML = `<div class="blog-header">${excluded}</div>`
      + `<div class="section-metadata">${excluded}</div>`
      + `<div class="card-metadata">${excluded}</div>`
      + `<div class="reading-time">${excluded}</div>`
      + `<script type="application/json">${excluded}</script><style>${excluded}</style>`
      + `<template>${excluded}</template><nav>${excluded}</nav>`
      + `<p hidden>${excluded}</p><p aria-hidden="true">${excluded}</p><p>Article</p>`;
    const original = main.innerHTML;
    expect(getReadingTime(main)).to.equal(1);
    expect(main.innerHTML).to.equal(original);
  });
});

describe('blog-header decoration', () => {
  let fetchStub;

  afterEach(() => {
    fetchStub?.restore();
    document.querySelectorAll('main, .dialog-modal, .modal-curtain').forEach((el) => el.remove());
    window.lana.log.resetHistory?.();
  });

  it('builds the eyebrow, title, summary, authors, and share button', async () => {
    fetchStub = mockFetch();
    const { main, block } = buildBlock();
    const readingTime = await init(block);
    expect(readingTime).to.equal(getReadingTime(main));
    expect(block.querySelector('.blog-header-eyebrow-end').textContent).to.equal('2 min read');
    expect(block.querySelector('.blog-header-title h1')).to.exist;
    expect(block.querySelector('.blog-header-summary')).to.exist;
    const share = block.querySelector('.blog-header-share');
    expect(share.getAttribute('aria-haspopup')).to.equal('dialog');
    expect(share.textContent).to.contain('Share');
    expect(share.querySelector('svg')).to.exist;
  });

  it('fetches the author profile picture and resolves relative urls', async () => {
    fetchStub = mockFetch();
    const { block } = buildBlock();
    await init(block);
    const img = await new Promise((resolve) => {
      const check = () => {
        const found = block.querySelector('.blog-header-author-avatar img.blog-header-avatar[src*="media_rachel"]');
        if (found) resolve(found);
        else setTimeout(check, 10);
      };
      check();
    });
    expect(img.getAttribute('src')).to.contain(`${window.location.origin}/blog/authors/media_rachel.png`);
    const source = block.querySelector('.blog-header-author-avatar source');
    expect(source.getAttribute('srcset')).to.contain(`${window.location.origin}/blog/authors/media_rachel.png`);
  });

  it('keeps an authored picture and does not fetch a profile', async () => {
    fetchStub = mockFetch();
    const { block } = buildBlock({ picture: true });
    await init(block);
    expect(block.querySelector('.blog-header-author-avatar img').getAttribute('src')).to.equal('/authored.png');
    expect(fetchStub.getCalls().some((c) => c.args[0].includes('.plain.html'))).to.equal(false);
  });

  it('uses the default avatar on a failed profile request and logs it', async () => {
    fetchStub = mockFetch({ profileStatus: 400 });
    const { block } = buildBlock();
    await init(block);
    await new Promise((r) => { setTimeout(r, 50); });
    const img = block.querySelector('.blog-header-author-avatar img.blog-header-avatar');
    expect(img.getAttribute('src')).to.contain('author-placeholder.png');
    expect(window.lana.log.called).to.equal(true);
  });

  it('deduplicates repeated profile requests for the same author', async () => {
    fetchStub = mockFetch();
    const { block } = buildBlock({ authors: 2 });
    await init(block);
    await new Promise((r) => { setTimeout(r, 50); });
    const calls = fetchStub.getCalls().filter((c) => c.args[0].includes('rachel-thornton.plain.html'));
    expect(calls.length).to.equal(1);
  });

  it('disables the author link and profile fetch when article-author-link is off', async () => {
    const meta = document.createElement('meta');
    meta.name = 'article-author-link';
    meta.content = 'off';
    document.head.append(meta);
    fetchStub = mockFetch();
    const { block } = buildBlock();
    await init(block);
    expect(block.querySelector('a.blog-header-author-name')).to.equal(null);
    expect(block.querySelector('span.blog-header-author-name').textContent).to.equal('Rachel Thornton');
    expect(fetchStub.getCalls().some((c) => c.args[0].includes('.plain.html'))).to.equal(false);
    meta.remove();
  });
});

describe('blog-header share modal', () => {
  let fetchStub;

  beforeEach(() => { fetchStub = mockFetch(); });

  afterEach(() => {
    fetchStub.restore();
    document.querySelectorAll('.dialog-modal, .modal-curtain').forEach((el) => el.remove());
  });

  it('derives the share url from the canonical link', () => {
    const link = document.createElement('link');
    link.rel = 'canonical';
    link.href = 'https://business.adobe.com/blog/post';
    document.head.append(link);
    expect(getShareUrl()).to.equal('https://business.adobe.com/blog/post');
    expect(getShareData().url).to.equal('https://business.adobe.com/blog/post');
    link.remove();
  });

  it('opens a modal with the preview card and share actions', async () => {
    const config = getConfig();
    config.placeholders = placeholders;
    const trigger = document.createElement('button');
    document.body.append(trigger);
    const dialog = await openShareModal(trigger);
    expect(dialog).to.exist;
    expect(dialog.classList.contains('blog-share-modal')).to.equal(true);
    expect(dialog.querySelector('.blog-share-heading').textContent).to.equal('Share post');
    expect(dialog.querySelector('.dialog-close').getAttribute('aria-label')).to.equal('Close share dialog');
    const actions = dialog.querySelectorAll('.blog-share-action');
    expect(actions.length).to.be.greaterThan(2);
    trigger.remove();
  });
});
