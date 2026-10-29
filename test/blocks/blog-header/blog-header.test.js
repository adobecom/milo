import { readFile, setViewport } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { stub, useFakeTimers } from 'sinon';
import { setConfig, MILO_EVENTS } from '../../../libs/utils/utils.js';
import { closeModal } from '../../../libs/blocks/modal/modal.js';
import initSideNavigation from '../../../libs/blocks/blog-side-navigation/blog-side-navigation.js';
import { waitFor } from '../../helpers/waitfor.js';
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
  'jump-to-section': 'JUMP TO SECTION',
};

setConfig({
  locales: { '': { ietf: 'en-US', tk: 'hah7vzn.css' } },
  miloLibs: '/libs',
  codeRoot: '/libs',
  placeholders,
});
window.lana = { log: stub() };

const svgText = await readFile({ path: '../../../libs/blocks/blog-header/blog-header.svg' });
const blogHeaderCss = await readFile({ path: '../../../libs/blocks/blog-header/blog-header.css' });
const sideNavigationCss = await readFile({ path: '../../../libs/blocks/blog-side-navigation/blog-side-navigation.css' });

function buildProfile({
  name = 'Profile Name',
  title = 'Profile Title',
  company = 'Profile Company',
  picture = true,
  social = true,
  background = '#f5f5f5',
} = {}) {
  const image = picture ? '<div><div><picture>'
    + '<source srcset="./media_rachel.png?width=200 200w">'
    + '<img src="./media_rachel.png" alt="Rachel"></picture></div></div>' : '';
  const socialLinks = social ? '<a href="https://linkedin.com/in/profile">LinkedIn</a>' : '';
  return `<div class="blog-author">${image}`
    + `<div><div><h1>${name}</h1></div></div>`
    + `<div><div>${title}</div></div>`
    + '<div><div>Profile biography, not job metadata.</div></div>'
    + `<div><div>${socialLinks}</div></div>`
    + `<div><div>${background}</div></div>`
    + `<div><div>${company}</div></div></div>`;
}

const profileHtml = buildProfile();

function mockFetch({
  profileStatus = 200,
  profileReject = false,
  profileBodyReject = false,
  profileMarkup = profileHtml,
} = {}) {
  return stub(window, 'fetch').callsFake((url) => {
    if (url.includes('blog-header.svg')) {
      return Promise.resolve({ ok: true, text: () => Promise.resolve(svgText) });
    }
    if (url.includes('.plain.html')) {
      if (profileReject) return Promise.reject(new Error('network down'));
      return Promise.resolve({
        ok: profileStatus === 200,
        status: profileStatus,
        text: () => (profileBodyReject
          ? Promise.reject(new Error('response body failed'))
          : Promise.resolve(profileMarkup)),
      });
    }
    return Promise.resolve({ ok: false, status: 404, text: () => Promise.resolve('') });
  });
}

let nextProfileId = 0;

function buildBlock({
  authors = 1,
  picture = false,
  link = true,
  summary = true,
  name = 'Rachel Thornton',
  title = 'Author Title',
  company = 'Company',
  metadata = true,
} = {}) {
  const main = document.createElement('main');
  const section = document.createElement('div');
  section.className = 'section';
  const block = document.createElement('div');
  block.className = 'blog-header';
  block.innerHTML = '<div><div><h1>Title of the article</h1></div></div>';
  if (summary) block.insertAdjacentHTML('beforeend', '<div><div>Summary of the article</div></div>');
  nextProfileId += 1;
  const profilePath = `/blog/authors/rachel-thornton-${nextProfileId}`;
  for (let i = 0; i < authors; i += 1) {
    const label = name ?? new URL(profilePath, window.location.origin).href;
    const authorName = link ? `<a href="${profilePath}">${label}</a>` : label;
    const pic = picture ? '<p><picture><img src="/authored.png" alt="Authored"></picture></p>' : '';
    const details = metadata ? `<p>${title}</p><p>${company}</p>` : '';
    const row = `<div><div>${pic}<p>${authorName}</p>${details}</div></div>`;
    block.insertAdjacentHTML('beforeend', row);
  }
  section.append(block);
  section.insertAdjacentHTML('beforeend', `<p>${'word '.repeat(400)}</p>`);
  main.append(section);
  document.body.append(main);
  return { main, block, profilePath };
}

function setMetadata(name, content) {
  const meta = document.createElement('meta');
  meta.setAttribute(name.includes(':') ? 'property' : 'name', name);
  meta.content = content;
  meta.className = 'blog-header-test-metadata';
  document.head.append(meta);
}

async function cleanup() {
  await Promise.all(
    [...document.querySelectorAll('.dialog-modal')].map((dialog) => closeModal(dialog, false)),
  );
  document.querySelectorAll('main, .blog-header-test-trigger, .blog-header-test-metadata')
    .forEach((el) => el.remove());
  window.lana.log.resetHistory();
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

  afterEach(async () => {
    await cleanup();
    fetchStub?.restore();
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
    expect(share.querySelector('svg').getAttribute('aria-hidden')).to.equal('true');
    expect(share.querySelector('svg').getAttribute('focusable')).to.equal('false');
    expect(block.querySelectorAll('.blog-header-author').length).to.equal(1);
    expect(window.sessionStorage.getItem('blog-reading-time')).to.equal('2');
  });

  it('automatically loads section navigation after article decoration without duplicating it', async () => {
    fetchStub = mockFetch();
    const { main, block } = buildBlock();
    await init(block);
    expect(main.querySelector('.blog-side-navigation')).not.to.exist;
    main.insertAdjacentHTML('beforeend', '<div class="section"><div class="content">'
      + '<h2>First section</h2><h2>Second section</h2></div></div>');
    document.dispatchEvent(new Event(MILO_EVENTS.DEFERRED));
    await waitFor(() => main.querySelector('.blog-side-navigation a'));
    const navigation = main.querySelector('.blog-side-navigation');
    expect([...navigation.querySelectorAll('a')].map((link) => link.getAttribute('href')))
      .to.deep.equal(['#section-1', '#section-2']);
    expect(navigation.querySelector('nav').getAttribute('aria-label')).to.equal('JUMP TO SECTION');
    document.dispatchEvent(new Event(MILO_EVENTS.DEFERRED));
    expect(main.querySelectorAll('.blog-side-navigation').length).to.equal(1);
  });

  it('does not duplicate an existing side navigation or initialize a removed header', async () => {
    fetchStub = mockFetch();
    const { main, block } = buildBlock();
    await init(block);
    main.insertAdjacentHTML('beforeend', '<div class="blog-side-navigation"></div>');
    document.dispatchEvent(new Event(MILO_EVENTS.DEFERRED));
    expect(main.querySelectorAll('.blog-side-navigation').length).to.equal(1);
    const detached = buildBlock();
    await init(detached.block);
    detached.main.remove();
    document.dispatchEvent(new Event(MILO_EVENTS.DEFERRED));
    expect(detached.main.querySelector('.blog-side-navigation')).not.to.exist;
  });

  it('preserves inline summary nodes without cloning them', async () => {
    fetchStub = mockFetch();
    const { block } = buildBlock({ link: false });
    const cell = block.children[1].firstElementChild;
    cell.innerHTML = 'Summary with <strong>emphasis</strong> and <a href="/details">a link</a>.';
    const link = cell.querySelector('a');
    const strong = cell.querySelector('strong');
    await init(block);
    const summary = block.querySelector('.blog-header-summary p');
    expect(summary.querySelector('a')).to.equal(link);
    expect(summary.querySelector('strong')).to.equal(strong);
  });

  it('keeps an authored summary paragraph without nesting paragraphs', async () => {
    fetchStub = mockFetch();
    const { block } = buildBlock({ link: false });
    const cell = block.children[1].firstElementChild;
    cell.innerHTML = '<p>Summary with <strong>emphasis</strong>.</p>';
    const paragraph = cell.firstElementChild;
    await init(block);
    expect(block.querySelector('.blog-header-summary p')).to.equal(paragraph);
    expect(block.querySelectorAll('.blog-header-summary p p').length).to.equal(0);
  });

  it('handles a title-only block without a summary row', async () => {
    fetchStub = mockFetch();
    const { block } = buildBlock({ authors: 0, summary: false });
    await init(block);
    expect(block.querySelector('.blog-header-title h1')).to.exist;
    expect(block.querySelectorAll('.blog-header-summary').length).to.equal(0);
    expect(block.querySelector('.blog-header-share')).to.exist;
  });

  it('fetches the author profile picture and resolves relative urls', async () => {
    fetchStub = mockFetch();
    const { block } = buildBlock();
    await init(block);
    await waitFor(() => block.querySelector('.blog-header-author-avatar img[src*="media_rachel"]'));
    const img = block.querySelector('.blog-header-author-avatar img');
    expect(img.getAttribute('src')).to.contain(`${window.location.origin}/blog/authors/media_rachel.png`);
    const source = block.querySelector('.blog-header-author-avatar source');
    expect(source.getAttribute('srcset')).to.contain(`${window.location.origin}/blog/authors/media_rachel.png`);
    expect(block.querySelector('.blog-header-author-name').textContent).to.equal('Rachel Thornton');
    expect(block.querySelector('.blog-header-author-meta').textContent).to.equal('Author Title | Company');
  });

  it('keeps an authored picture and does not fetch a profile', async () => {
    fetchStub = mockFetch();
    const { block } = buildBlock({ picture: true });
    await init(block);
    expect(block.querySelector('.blog-header-author-avatar img').getAttribute('src')).to.equal('/authored.png');
    expect(fetchStub.getCalls().some((c) => c.args[0].includes('.plain.html'))).to.equal(false);
  });

  [
    { link: true, enabled: true, tag: 'A' },
    { link: true, enabled: false, tag: 'SPAN' },
    { link: false, enabled: true, tag: 'SPAN' },
  ].forEach(({ link, enabled, tag }) => {
    it(`renders authored names as text with link=${link} and enabled=${enabled}`, async () => {
      fetchStub = mockFetch();
      if (!enabled) setMetadata('article-author-link', 'off');
      const { block } = buildBlock({ link, picture: true });
      const name = '<img src=x onerror="void 0"> & Author';
      const cell = block.children[2].firstElementChild;
      (cell.querySelector('a') || cell.querySelector('p:not(:has(picture))')).textContent = name;
      await init(block);
      const authorName = block.querySelector('.blog-header-author-name');
      expect(authorName.tagName).to.equal(tag);
      expect(authorName.textContent).to.equal(name);
      expect(authorName.children.length).to.equal(0);
    });
  });

  it('renders names fetched from author profiles as text', async () => {
    fetchStub = mockFetch({ profileMarkup: buildProfile({ name: '&lt;img src=x onerror="void 0"&gt; &amp; Author' }) });
    const { block } = buildBlock({ name: null });
    await init(block);
    await waitFor(() => block.querySelector('.blog-header-author-name').textContent
      === '<img src=x onerror="void 0"> & Author');
    const authorName = block.querySelector('.blog-header-author-name');
    expect(authorName.tagName).to.equal('A');
    expect(authorName.children.length).to.equal(0);
  });

  [
    // eslint-disable-next-line no-script-url -- payload must prove script URLs are rejected
    'javascript:void(0)',
    ' \tJaVa\nScRiPt:void(0)',
    'data:text/html,test',
    'vbscript:msgbox(1)',
    'file:///author.html',
    'https://[invalid',
  ].forEach((href) => {
    it(`rejects an unsafe or invalid author URL ${JSON.stringify(href)}`, async () => {
      fetchStub = mockFetch();
      const { block } = buildBlock({ metadata: false });
      block.querySelector('a').setAttribute('href', href);
      await init(block);
      const authorName = block.querySelector('.blog-header-author-name');
      expect(authorName.tagName).to.equal('SPAN');
      expect(authorName.textContent).to.equal('Rachel Thornton');
      expect(authorName.hasAttribute('href')).to.equal(false);
      expect(fetchStub.getCalls().some((c) => c.args[0].includes('.plain.html'))).to.equal(false);
      expect(window.lana.log.calledOnce).to.equal(true);
      expect(window.lana.log.firstCall.args[0]).to.contain('author profile URL');
    });
  });

  ['https://example.com/author', 'http://example.com/author', '//example.com/author']
    .forEach((href) => {
      it(`preserves an HTTP(S) author URL ${href}`, async () => {
        fetchStub = mockFetch();
        const { block } = buildBlock({ picture: true });
        block.querySelector('a').setAttribute('href', href);
        await init(block);
        expect(block.querySelector('a.blog-header-author-name').getAttribute('href')).to.equal(href);
        expect(window.lana.log.called).to.equal(false);
      });
    });

  it('fills title and company for a linked name without replacing the authored name', async () => {
    fetchStub = mockFetch();
    const { block } = buildBlock({ metadata: false });
    await init(block);
    await waitFor(() => block.querySelector('.blog-header-author-meta'));
    expect(block.querySelector('.blog-header-author-name').textContent).to.equal('Rachel Thornton');
    expect(block.querySelector('.blog-header-author-meta').textContent)
      .to.equal('Profile Title | Profile Company');
  });

  it('resolves a direct-link author beside a fully authored author, matching DA markup', async () => {
    fetchStub = mockFetch({
      profileMarkup: buildProfile({
        name: 'Rachel Thornton',
        title: '',
        company: '',
        social: false,
      }),
    });
    const { block } = buildBlock({ authors: 2 });
    const secondCell = block.children[3].firstElementChild;
    secondCell.replaceChildren(secondCell.querySelector('a'));
    await init(block);
    await waitFor(() => block.querySelectorAll('.blog-header-author-avatar picture').length === 2);
    const authors = block.querySelectorAll('.blog-header-author');
    expect(authors[1].querySelector('.blog-header-author-name').textContent)
      .to.equal('Rachel Thornton');
    expect(authors[1].querySelectorAll('.blog-header-author-meta').length).to.equal(0);
    expect(authors[0].querySelector('.blog-header-author-meta').textContent)
      .to.equal('Author Title | Company');
    expect(fetchStub.getCalls().filter((c) => c.args[0].includes('.plain.html')).length).to.equal(1);
  });

  it('resolves a direct URL link and preserves following authored metadata', async () => {
    fetchStub = mockFetch();
    const { block } = buildBlock({ name: null, company: '' });
    const cell = block.children[2].firstElementChild;
    const nameParagraph = cell.querySelector('p');
    nameParagraph.replaceWith(nameParagraph.querySelector('a'));
    await init(block);
    await waitFor(() => block.querySelector('.blog-header-author-name').textContent === 'Profile Name');
    expect(block.querySelector('.blog-header-author-meta').textContent)
      .to.equal('Author Title | Profile Company');
    expect(block.querySelector('.blog-header-author-avatar picture')).to.exist;
  });

  it('fills the name when a direct author link has no label', async () => {
    fetchStub = mockFetch();
    const { block } = buildBlock({ metadata: false });
    const cell = block.children[2].firstElementChild;
    const link = cell.querySelector('a');
    link.textContent = '';
    cell.replaceChildren(link);
    await init(block);
    await waitFor(() => block.querySelector('.blog-header-author-name').textContent === 'Profile Name');
    expect(block.querySelector('a.blog-header-author-name')).to.exist;
    expect(block.querySelector('.blog-header-author-avatar picture')).to.exist;
  });

  it('defers the interactive link until the profile name arrives', async () => {
    let release;
    const pending = new Promise((resolve) => { release = resolve; });
    fetchStub = stub(window, 'fetch').callsFake((url) => {
      if (url.includes('blog-header.svg')) {
        return Promise.resolve({ ok: true, text: () => Promise.resolve(svgText) });
      }
      if (url.includes('.plain.html')) {
        return pending.then(() => ({
          ok: true,
          status: 200,
          text: () => Promise.resolve(profileHtml),
        }));
      }
      return Promise.resolve({ ok: false, status: 404, text: () => Promise.resolve('') });
    });
    const { block } = buildBlock({ metadata: false });
    const cell = block.children[2].firstElementChild;
    const link = cell.querySelector('a');
    link.textContent = '';
    cell.replaceChildren(link);
    await init(block);
    expect(block.querySelectorAll('a.blog-header-author-name').length).to.equal(0);
    expect(block.querySelector('span.blog-header-author-name').textContent).to.equal('');
    release();
    await waitFor(() => !!block.querySelector('a.blog-header-author-name'));
    expect(block.querySelector('.blog-header-author-name').textContent).to.equal('Profile Name');
  });

  it('never exposes an unnamed author link when the profile is unavailable', async () => {
    fetchStub = mockFetch({ profileStatus: 404 });
    const { block } = buildBlock({ metadata: false });
    const cell = block.children[2].firstElementChild;
    const link = cell.querySelector('a');
    link.textContent = '';
    cell.replaceChildren(link);
    await init(block);
    await waitFor(() => window.lana.log.called);
    expect(block.querySelectorAll('a.blog-header-author-name').length).to.equal(0);
    expect(block.querySelector('span.blog-header-author-name').textContent).to.equal('');
  });

  it('fills the profile name when the authored link label is its URL', async () => {
    fetchStub = mockFetch();
    const { block, profilePath } = buildBlock({ name: null, metadata: false });
    await init(block);
    await waitFor(() => block.querySelector('.blog-header-author-name').textContent === 'Profile Name');
    expect(block.querySelector('.blog-header-author-name').getAttribute('href')).to.equal(profilePath);
    expect(block.querySelector('.blog-header-author-meta').textContent)
      .to.equal('Profile Title | Profile Company');
  });

  it('fills only a missing company while preserving an authored title', async () => {
    fetchStub = mockFetch();
    const { block } = buildBlock({ company: '' });
    await init(block);
    await waitFor(() => block.querySelector('.blog-header-author-meta').textContent
      === 'Author Title | Profile Company');
  });

  it('preserves an empty title slot and fills only the missing title', async () => {
    fetchStub = mockFetch();
    const { block } = buildBlock({ title: '' });
    await init(block);
    await waitFor(() => block.querySelector('.blog-header-author-meta').textContent
      === 'Profile Title | Company');
  });

  it('fetches missing metadata while keeping an authored picture', async () => {
    fetchStub = mockFetch();
    const { block } = buildBlock({ picture: true, metadata: false });
    await init(block);
    await waitFor(() => block.querySelector('.blog-header-author-meta'));
    expect(block.querySelector('.blog-header-author-avatar img').getAttribute('src'))
      .to.equal('/authored.png');
    expect(block.querySelector('.blog-header-author-meta').textContent)
      .to.equal('Profile Title | Profile Company');
    expect(fetchStub.getCalls().filter((c) => c.args[0].includes('.plain.html')).length).to.equal(1);
  });

  it('fills metadata even when the profile has no picture', async () => {
    fetchStub = mockFetch({ profileMarkup: buildProfile({ picture: false }) });
    const { block } = buildBlock({ metadata: false });
    await init(block);
    await waitFor(() => block.querySelector('.blog-header-author-meta'));
    expect(block.querySelector('.blog-header-avatar').getAttribute('src'))
      .to.equal('/libs/blocks/article-header/adobe-logo.svg');
    expect(block.querySelector('.blog-header-author-meta').textContent)
      .to.equal('Profile Title | Profile Company');
    expect(window.lana.log.called).to.equal(false);
  });

  it('fills company with empty social and background rows', async () => {
    fetchStub = mockFetch({ profileMarkup: buildProfile({ social: false, background: '' }) });
    const { block } = buildBlock({ metadata: false });
    await init(block);
    await waitFor(() => block.querySelector('.blog-header-author-meta'));
    expect(block.querySelector('.blog-header-author-meta').textContent)
      .to.equal('Profile Title | Profile Company');
  });

  it('reads company after social links in a shortened profile', async () => {
    const profileMarkup = '<div class="blog-author">'
      + '<div><div>Profile Name</div></div>'
      + '<div><div><a href="https://linkedin.com/in/profile">LinkedIn</a></div></div>'
      + '<div><div>Profile Company</div></div></div>';
    fetchStub = mockFetch({ profileMarkup });
    const { block } = buildBlock({ metadata: false });
    await init(block);
    await waitFor(() => block.querySelector('.blog-header-author-meta'));
    expect(block.querySelector('.blog-header-author-meta').textContent).to.equal('Profile Company');
  });

  it('does not use biography or background colors as missing title/company', async () => {
    fetchStub = mockFetch({ profileMarkup: buildProfile({ title: '', company: '', social: false }) });
    const { block } = buildBlock({ metadata: false });
    await init(block);
    await waitFor(() => block.querySelector('.blog-header-author-avatar picture'));
    expect(block.querySelectorAll('.blog-header-author-meta').length).to.equal(0);
    expect(window.lana.log.called).to.equal(false);
  });

  it('does not fetch missing profile fields when author links are disabled', async () => {
    setMetadata('article-author-link', 'off');
    fetchStub = mockFetch();
    const { block } = buildBlock({ picture: true, metadata: false });
    await init(block);
    expect(block.querySelector('.blog-header-author-name').tagName).to.equal('SPAN');
    expect(block.querySelectorAll('.blog-header-author-meta').length).to.equal(0);
    expect(fetchStub.getCalls().some((c) => c.args[0].includes('.plain.html'))).to.equal(false);
  });

  it('does not fetch missing metadata without a profile link', async () => {
    fetchStub = mockFetch();
    const { block } = buildBlock({ link: false, metadata: false });
    await init(block);
    expect(block.querySelectorAll('.blog-header-author-meta').length).to.equal(0);
    const avatar = block.querySelector('.blog-header-avatar');
    expect(avatar.getAttribute('src')).to.equal('/libs/blocks/article-header/adobe-logo.svg');
    expect(avatar.alt).to.equal('');
    expect(fetchStub.getCalls().some((c) => c.args[0].includes('.plain.html'))).to.equal(false);
  });

  it('uses the default avatar on a failed profile request and logs it', async () => {
    fetchStub = mockFetch({ profileStatus: 400 });
    const { block } = buildBlock();
    await init(block);
    await waitFor(() => window.lana.log.called);
    const img = block.querySelector('.blog-header-author-avatar img.blog-header-avatar');
    expect(img.getAttribute('src')).to.equal('/libs/blocks/article-header/adobe-logo.svg');
    expect(window.lana.log.called).to.equal(true);
  });

  it('keeps a URL-only label and omits missing metadata when the profile request fails', async () => {
    fetchStub = mockFetch({ profileReject: true });
    const { block, profilePath } = buildBlock({ name: null, metadata: false });
    await init(block);
    await waitFor(() => window.lana.log.called);
    expect(block.querySelector('.blog-header-author-name').textContent)
      .to.equal(new URL(profilePath, window.location.origin).href);
    expect(block.querySelectorAll('.blog-header-author-meta').length).to.equal(0);
    expect(block.querySelector('.blog-header-avatar').getAttribute('src'))
      .to.equal('/libs/blocks/article-header/adobe-logo.svg');
  });

  it('uses the default avatar and logs a rejected profile request', async () => {
    fetchStub = mockFetch({ profileReject: true });
    const { block } = buildBlock();
    await init(block);
    await waitFor(() => window.lana.log.called);
    expect(block.querySelector('.blog-header-avatar').getAttribute('src'))
      .to.equal('/libs/blocks/article-header/adobe-logo.svg');
    expect(window.lana.log.firstCall.args[0]).to.contain('network down');
  });

  it('uses the default avatar and logs a rejected response body', async () => {
    fetchStub = mockFetch({ profileBodyReject: true });
    const { block } = buildBlock();
    await init(block);
    await waitFor(() => window.lana.log.called);
    expect(block.querySelector('.blog-header-avatar').getAttribute('src'))
      .to.equal('/libs/blocks/article-header/adobe-logo.svg');
    expect(window.lana.log.firstCall.args[0]).to.contain('response body failed');
  });

  it('keeps the default avatar without logging when the profile has no picture', async () => {
    fetchStub = mockFetch({ profileMarkup: '<div class="blog-author"><p>Author</p></div>' });
    const { block } = buildBlock();
    await init(block);
    expect(block.querySelector('.blog-header-avatar').getAttribute('src'))
      .to.equal('/libs/blocks/article-header/adobe-logo.svg');
    expect(window.lana.log.called).to.equal(false);
  });

  [
    ['img', '<img src="about:error" alt="">'],
    ['picture', '<picture><img src="about:error" alt=""></picture>'],
  ].forEach(([type, image]) => {
    it(`keeps the Adobe logo for an about:error profile ${type} while resolving author details`, async () => {
      const profileMarkup = buildProfile({ picture: false }).replace(
        '<div class="blog-author">',
        `<div class="blog-author"><div><div>${image}</div></div>`,
      );
      fetchStub = mockFetch({ profileMarkup });
      const { block, profilePath } = buildBlock({ name: null, metadata: false });
      await init(block);
      await waitFor(() => block.querySelector('.blog-header-author-meta'));
      expect(block.querySelector('.blog-header-avatar').getAttribute('src'))
        .to.equal('/libs/blocks/article-header/adobe-logo.svg');
      expect(block.querySelector('.blog-header-author-name').textContent).to.equal('Profile Name');
      expect(block.querySelector('.blog-header-author-name').getAttribute('href')).to.equal(profilePath);
      expect(block.querySelector('.blog-header-author-meta').textContent)
        .to.equal('Profile Title | Profile Company');
      expect(window.lana.log.calledOnce).to.equal(true);
      expect(window.lana.log.firstCall.args[0]).to.contain('author profile image is invalid');
    });
  });

  it('deduplicates repeated profile requests for the same author', async () => {
    fetchStub = mockFetch();
    const { block, profilePath } = buildBlock({ authors: 2, metadata: false });
    await init(block);
    await waitFor(() => block.querySelectorAll('.blog-header-author-avatar picture').length === 2);
    const calls = fetchStub.getCalls().filter((c) => c.args[0].includes(`${profilePath}.plain.html`));
    expect(calls.length).to.equal(1);
    const pictures = block.querySelectorAll('.blog-header-author-avatar picture');
    expect(pictures[0]).not.to.equal(pictures[1]);
    const metadata = block.querySelectorAll('.blog-header-author-meta');
    expect([...metadata].map((meta) => meta.textContent))
      .to.deep.equal(['Profile Title | Profile Company', 'Profile Title | Profile Company']);
  });

  it('disables the author link and profile fetch when article-author-link is off', async () => {
    setMetadata('article-author-link', 'off');
    fetchStub = mockFetch();
    const { block } = buildBlock();
    await init(block);
    expect(block.querySelectorAll('a.blog-header-author-name').length).to.equal(0);
    expect(block.querySelector('span.blog-header-author-name').textContent).to.equal('Rachel Thornton');
    expect(fetchStub.getCalls().some((c) => c.args[0].includes('.plain.html'))).to.equal(false);
  });
});

describe('blog-header author layout', () => {
  let css;
  let stylesheet;
  let fetchStub;
  let originalViewport;
  let originalLang;

  before(async () => {
    css = (await Promise.all([
      readFile({ path: '../../../libs/styles/styles.css' }),
      readFile({ path: '../../../libs/blocks/blog-header/blog-header.css' }),
    ])).join('\n');
  });

  beforeEach(() => {
    originalViewport = { width: window.innerWidth, height: window.innerHeight };
    originalLang = document.documentElement.getAttribute('lang');
    stylesheet = document.createElement('style');
    stylesheet.textContent = css;
    document.head.append(stylesheet);
    fetchStub = mockFetch();
  });

  afterEach(async () => {
    await cleanup();
    stylesheet.remove();
    fetchStub.restore();
    if (originalLang === null) document.documentElement.removeAttribute('lang');
    else document.documentElement.setAttribute('lang', originalLang);
    await setViewport(originalViewport);
  });

  const longTitles = {
    English: 'Adobe Product Marketing Director with a very long job title | Adobe',
    Japanese: '\u30a2\u30c9\u30d3 '
      + '\u30d7\u30ed\u30c0\u30af\u30c8\u30de\u30fc\u30b1\u30c6\u30a3\u30f3\u30b0 '
      + '\u30c7\u30a3\u30ec\u30af\u30bf\u30fc | Adobe',
  };

  Object.entries(longTitles).forEach(([language, title]) => {
    [600, 768, 1024, 1199, 1200, 1440].forEach((width) => {
      it(`uses the responsive author layout with a long ${language} title at ${width}px`, async () => {
        await setViewport({ width, height: 900 });
        document.documentElement.lang = language === 'Japanese' ? 'ja' : 'en';
        const { block } = buildBlock({ authors: 2, link: false });
        await init(block);
        const authors = block.querySelectorAll('.blog-header-author');
        authors[1].querySelector('.blog-header-author-name').textContent = 'Alex Erickson';
        authors[1].querySelector('.blog-header-author-meta').textContent = title;
        const first = authors[0].getBoundingClientRect();
        const second = authors[1].getBoundingClientRect();
        const authorGroup = block.querySelector('.blog-header-authors');
        const group = authorGroup.getBoundingClientRect();
        const share = block.querySelector('.blog-header-share').getBoundingClientRect();
        const byline = block.querySelector('.blog-header-byline');

        if (width < 1200) {
          expect(first.width).to.be.closeTo(second.width, 0.5);
          expect(second.top).to.be.greaterThan(first.bottom);
          expect(first.left).to.be.closeTo(second.left, 0.5);
          expect(share.top).to.be.greaterThan(group.bottom);
          expect(share.left).to.be.closeTo(group.left, 0.5);
        } else {
          const firstInfo = authors[0].querySelector('.blog-header-author-info').getBoundingClientRect();
          expect(first.top).to.be.closeTo(second.top, 0.5);
          expect(first.width).to.be.lessThan(second.width);
          expect(first.right).to.be.closeTo(firstInfo.right, 0.5);
          expect(second.left - first.right)
            .to.be.closeTo(parseFloat(getComputedStyle(authorGroup).columnGap), 0.5);
          expect(group.right).to.be.lessThan(share.left);
          expect(share.right).to.be.closeTo(byline.getBoundingClientRect().right, 0.5);
        }
        expect(second.right).to.be.closeTo(group.right, 0.5);
        expect(byline.scrollWidth).to.be.at.most(byline.clientWidth);
        authors.forEach((author) => {
          expect(getComputedStyle(author).maxWidth).to.equal('none');
          expect(author.querySelector('.blog-header-author-avatar').getBoundingClientRect().width)
            .to.equal(width < 1200 ? 48 : 64);
          expect(author.scrollWidth).to.be.at.most(author.clientWidth);
        });
        expect(block.querySelector('.blog-header-share svg').getBoundingClientRect().width)
          .to.equal(width < 1200 ? 16 : 22);
      });
    });
  });

  it('allows author widths to exceed 340px on a wide desktop with long content', async () => {
    await setViewport({ width: 1440, height: 900 });
    const { block } = buildBlock({ authors: 2, link: false });
    await init(block);
    const authors = block.querySelectorAll('.blog-header-author');
    authors.forEach((author) => {
      author.querySelector('.blog-header-author-meta').textContent = longTitles.English.repeat(4);
    });
    authors.forEach((author) => {
      expect(getComputedStyle(author).maxWidth).to.equal('none');
      expect(author.getBoundingClientRect().width).to.be.greaterThan(340);
      expect(author.scrollWidth).to.be.at.most(author.clientWidth);
    });
    const share = block.querySelector('.blog-header-share').getBoundingClientRect();
    expect(authors[1].getBoundingClientRect().right).to.be.lessThan(share.left);
  });

  it('uses a single column when there is only one author on tablet', async () => {
    await setViewport({ width: 768, height: 900 });
    const { block } = buildBlock({ link: false });
    await init(block);
    const author = block.querySelector('.blog-header-author').getBoundingClientRect();
    const group = block.querySelector('.blog-header-authors').getBoundingClientRect();
    expect(author.width).to.be.closeTo(group.width, 0.5);
  });

  [375, 599, 600, 1199].forEach((width) => {
    it(`preserves stacked authors and the share button at ${width}px`, async () => {
      await setViewport({ width, height: 900 });
      const { block } = buildBlock({ authors: 2, link: false });
      await init(block);
      const authors = block.querySelectorAll('.blog-header-author');
      const first = authors[0].getBoundingClientRect();
      const second = authors[1].getBoundingClientRect();
      const share = block.querySelector('.blog-header-share').getBoundingClientRect();
      expect(second.top).to.be.greaterThan(first.bottom);
      expect(share.top).to.be.greaterThan(second.bottom);
      expect(authors[0].querySelector('.blog-header-author-avatar').getBoundingClientRect().width)
        .to.equal(48);
    });
  });
});

describe('blog-header section dividers', () => {
  let fetchStub;

  /* Builds top-level authored sections and an optional metadata-only section. */
  function buildSections({ noDividers = false, articleSections = 2, relatedContent = true } = {}) {
    const main = document.createElement('main');
    const headerSection = document.createElement('div');
    headerSection.className = 'section';
    const block = document.createElement('div');
    block.className = noDividers ? 'blog-header no-dividers' : 'blog-header';
    block.innerHTML = '<div><div><h1>Title of the article</h1></div></div>'
      + '<div><div>Summary of the article</div></div>';
    headerSection.append(block);
    main.append(headerSection);

    for (let i = 0; i < articleSections; i += 1) {
      const section = document.createElement('div');
      section.className = 'section';
      section.innerHTML = `<div><p>Article paragraph ${i}</p></div>`;
      main.append(section);
    }

    if (relatedContent) {
      const section = document.createElement('div');
      section.className = 'section';
      section.innerHTML = '<div class="card-metadata" hidden></div>';
      main.append(section);
    }

    document.body.append(main);
    return { main, headerSection, block };
  }

  const frameHeight = (headerSection) => parseFloat(
    headerSection.style.getPropertyValue('--blog-divider-height'),
  );
  const distance = (from, to) => to.getBoundingClientRect().bottom
    - from.getBoundingClientRect().top;

  async function addSideNavigation({ headerSection, main }) {
    [...main.children].slice(1).forEach((section) => {
      if (section.querySelector('.card-metadata')) return;
      section.firstElementChild.classList.add('content');
    });
    main.querySelector('.content').insertAdjacentHTML('afterbegin', '<h2>Article section</h2>');
    const navigation = document.createElement('div');
    navigation.className = 'blog-side-navigation';
    headerSection.append(navigation);
    await initSideNavigation(navigation);
    return {
      navigation,
      layout: main.querySelector('.blog-article-layout'),
      article: main.querySelector('.blog-article-content'),
    };
  }

  afterEach(async () => {
    await cleanup();
    fetchStub?.restore();
  });

  it('marks only the header section and ignores the metadata-only section', async () => {
    fetchStub = mockFetch();
    const { main, headerSection, block } = buildSections();
    await init(block);
    const sections = [...main.children];
    expect(headerSection.classList.contains('blog-divider-frame')).to.equal(true);
    expect(sections.slice(1).some((section) => section.classList.contains('blog-divider-frame')))
      .to.equal(false);
    expect(frameHeight(headerSection)).to.be.closeTo(distance(headerSection, sections[2]), 0.01);
  });

  it('ends the frame at the last section when related content is absent', async () => {
    fetchStub = mockFetch();
    const { main, headerSection, block } = buildSections({ relatedContent: false });
    await init(block);
    expect(frameHeight(headerSection))
      .to.be.closeTo(distance(headerSection, main.lastElementChild), 0.01);
  });

  it('spans collapsed margins without changing article geometry', async () => {
    fetchStub = mockFetch();
    const { main, headerSection, block } = buildSections();
    const sections = [...main.children];
    sections[1].firstElementChild.firstElementChild.style.marginBlock = '24px';
    sections[2].firstElementChild.firstElementChild.style.marginBlock = '32px';
    const original = sections.map((section) => section.getBoundingClientRect());
    await init(block);
    // Header decoration changes its height, so compare the divider with the final layout.
    expect(frameHeight(headerSection)).to.be.closeTo(distance(headerSection, sections[2]), 0.01);
    expect(sections[2].getBoundingClientRect().top - sections[1].getBoundingClientRect().bottom)
      .to.equal(original[2].top - original[1].bottom);
    expect(sections[1].getBoundingClientRect().height).to.equal(original[1].height);
    expect(sections[2].getBoundingClientRect().height).to.equal(original[2].height);
  });

  it('updates the continuous frame when article content resizes', async () => {
    fetchStub = mockFetch();
    const { main, headerSection, block } = buildSections();
    await init(block);
    const height = frameHeight(headerSection);
    const lastArticle = main.children[2];
    lastArticle.insertAdjacentHTML('beforeend', '<div style="height: 100px"></div>');
    await waitFor(() => frameHeight(headerSection) > height);
    expect(frameHeight(headerSection)).to.be.closeTo(distance(headerSection, lastArticle), 0.01);
  });

  it('includes the full final section and refreshes when authored cards grow', async () => {
    fetchStub = mockFetch();
    const { main, headerSection, block } = buildSections();
    const relatedSection = main.lastElementChild;
    relatedSection.insertAdjacentHTML('afterbegin', '<div class="content"><p>Final article paragraph.</p></div>'
      + '<div class="text"><h2>Recommended for you</h2></div>'
      + '<div class="related-content-card" style="height: 100px"></div>');
    const articleEnd = relatedSection.firstElementChild;
    await init(block);
    const expectedHeight = distance(headerSection, relatedSection);
    expect(frameHeight(headerSection)).to.be.closeTo(expectedHeight, 0.01);

    relatedSection.querySelector('.related-content-card').style.height = '300px';
    await waitFor(() => frameHeight(headerSection) > expectedHeight);
    expect(frameHeight(headerSection)).to.be.closeTo(distance(headerSection, relatedSection), 0.01);

    const afterCards = frameHeight(headerSection);
    articleEnd.insertAdjacentHTML('beforeend', '<div style="height: 100px"></div>');
    await waitFor(() => frameHeight(headerSection) > afterCards);
    expect(frameHeight(headerSection)).to.be.closeTo(distance(headerSection, relatedSection), 0.01);
  });

  it('detects the final article wrapper created after header initialization', async () => {
    fetchStub = mockFetch();
    const { main, headerSection, block } = buildSections();
    await init(block);
    const height = frameHeight(headerSection);
    const relatedSection = main.lastElementChild;
    relatedSection.insertAdjacentHTML('afterbegin', '<div class="content"><p>Later decorated article text.</p></div>'
      + '<div class="text"><h2>Recommended for you</h2></div>');
    await waitFor(() => frameHeight(headerSection) > height);
    expect(frameHeight(headerSection))
      .to.be.closeTo(distance(headerSection, relatedSection), 0.01);
  });

  it('frames trailing blocks without a sidenav and excludes the footer promo', async () => {
    fetchStub = mockFetch();
    const { main, headerSection, block } = buildSections();
    main.insertAdjacentHTML('beforeend', '<div class="section"><div class="tag-cta" style="height: 100px">'
      + 'Explore related resources</div></div>'
      + '<div class="section" data-footer-promo><div style="height: 200px">Footer promo</div></div>');
    const lastSection = main.querySelector('.tag-cta').parentElement;
    await init(block);
    expect(frameHeight(headerSection)).to.be.closeTo(distance(headerSection, lastSection), 0.01);
  });

  it('recognizes an undecorated authorable layout boundary without a sidenav', async () => {
    fetchStub = mockFetch();
    const { main, headerSection, block } = buildSections({ relatedContent: false });
    const lastSection = main.lastElementChild;
    main.insertAdjacentHTML('beforeend', '<div class="section"><div class="section-metadata" hidden>'
      + '<div><div>Style</div><div>blog-layout-end</div></div></div></div>'
      + '<div class="section"><div style="height: 200px">Outside the layout</div></div>');
    await init(block);
    expect(frameHeight(headerSection)).to.be.closeTo(distance(headerSection, lastSection), 0.01);
  });

  it('ends the frame with the side navigation layout once it wraps the article', async () => {
    fetchStub = mockFetch();
    const fixture = buildSections();
    await init(fixture.block);
    const { layout, article } = await addSideNavigation(fixture);
    article.insertAdjacentHTML('beforeend', '<div style="height: 150px"></div>');
    await waitFor(() => (
      Math.abs(frameHeight(fixture.headerSection) - distance(fixture.headerSection, layout)) < 0.01
    ));
    expect(frameHeight(fixture.headerSection))
      .to.be.closeTo(distance(fixture.headerSection, layout), 0.01);
  });

  it('disables every divider when no-dividers is set', async () => {
    fetchStub = mockFetch();
    const { main, headerSection, block } = buildSections({ noDividers: true });
    await init(block);
    expect(main.querySelector('.blog-divider-frame')).to.not.exist;
    expect(headerSection.style.getPropertyValue('--blog-divider-height')).to.equal('');
  });

  describe('divider styling', () => {
    const originalViewport = { width: window.innerWidth, height: window.innerHeight };
    let style;

    beforeEach(() => {
      fetchStub = mockFetch();
      style = document.createElement('style');
      // Core styles.css positions every top-level section.
      style.textContent = `main > .section { position: relative; }\n${blogHeaderCss}\n${sideNavigationCss}`;
      document.head.append(style);
    });

    afterEach(async () => {
      style.remove();
      await setViewport(originalViewport);
    });

    function buildStyledSections(options) {
      const fixture = buildSections(options);
      fixture.main.style.cssText = '--grid-margins-width: 120px; '
        + '--grid-container-width: calc(100% - 240px); --color-gray-400: #B6B6B6;';
      return fixture;
    }

    const rects = (elements) => elements.map((element) => element.getBoundingClientRect().toJSON());

    function disableRule(selector) {
      style.sheet.insertRule(`${selector} { content: none !important; }`, style.sheet.cssRules.length);
    }

    it('reserves the header gap before the sidenav loads and keeps it after', async () => {
      await setViewport({ width: 1440, height: 900 });
      const fixture = buildStyledSections();
      const { main, headerSection, block } = fixture;
      await init(block);
      const firstArticle = main.children[1];
      const headerBottom = () => headerSection.getBoundingClientRect().bottom;
      expect(firstArticle.getBoundingClientRect().top - headerBottom()).to.equal(48);
      const articleTop = firstArticle.getBoundingClientRect().top;

      const { layout, article, navigation } = await addSideNavigation(fixture);
      expect(layout.getBoundingClientRect().top - headerBottom()).to.equal(48);
      expect(article.getBoundingClientRect().top).to.equal(articleTop);
      expect(navigation.getBoundingClientRect().top - headerBottom()).to.equal(76);
    });

    it('draws the sidenav rule midway through the gap from the header rule to the article end', async () => {
      await setViewport({ width: 1440, height: 900 });
      const fixture = buildStyledSections();
      await init(fixture.block);
      const { layout, article, navigation } = await addSideNavigation(fixture);
      const gap = parseFloat(getComputedStyle(layout).columnGap);
      const frame = getComputedStyle(layout, '::before');
      const layoutRect = layout.getBoundingClientRect();
      expect(frame.content).to.equal('""');
      expect(frame.pointerEvents).to.equal('none');
      expect(frame.backgroundImage).to.include('rgb(182, 182, 182)');
      expect(gap).to.equal(112);
      expect(navigation.getBoundingClientRect().width).to.equal(280);
      expect(layoutRect.left + parseFloat(frame.left) - navigation.getBoundingClientRect().right)
        .to.be.closeTo(56, 0.5);
      expect(layoutRect.left + parseFloat(frame.left) + gap / 2)
        .to.be.closeTo(article.getBoundingClientRect().left, 0.5);
      expect(layoutRect.top + parseFloat(frame.top))
        .to.equal(fixture.headerSection.getBoundingClientRect().bottom);
      expect(layoutRect.top + parseFloat(frame.top) + parseFloat(frame.height))
        .to.be.closeTo(layoutRect.bottom, 0.5);

      const elements = [layout, navigation, article, ...article.children];
      const before = rects(elements);
      disableRule('.blog-divider-frame + .blog-article-layout::before');
      expect(rects(elements)).to.deep.equal(before);
    });

    it('mirrors the sidenav rule in right-to-left layouts', async () => {
      await setViewport({ width: 1440, height: 900 });
      const fixture = buildStyledSections();
      fixture.main.dir = 'rtl';
      await init(fixture.block);
      const { layout, article } = await addSideNavigation(fixture);
      const gap = parseFloat(getComputedStyle(layout).columnGap);
      const frame = getComputedStyle(layout, '::before');
      expect(gap).to.equal(112);
      expect(layout.getBoundingClientRect().right - parseFloat(frame.right) - gap / 2)
        .to.be.closeTo(article.getBoundingClientRect().right, 0.5);
    });

    it('leaves the sidenav layout unchanged when no-dividers is set', async () => {
      await setViewport({ width: 1440, height: 900 });
      const fixture = buildStyledSections({ noDividers: true });
      await init(fixture.block);
      const { layout, article, navigation } = await addSideNavigation(fixture);
      const { top } = layout.getBoundingClientRect();
      expect(top).to.equal(fixture.headerSection.getBoundingClientRect().bottom);
      expect(article.getBoundingClientRect().top).to.equal(top);
      expect(navigation.getBoundingClientRect().top).to.equal(top);
      expect(getComputedStyle(layout).columnGap).to.equal('56px');
      expect(getComputedStyle(layout, '::before').content).to.equal('none');
      expect(getComputedStyle(fixture.headerSection, '::after').content).to.equal('none');
    });

    [599, 375].forEach((width) => {
      it(`moves the header rule below the sidenav in the stacked layout at ${width}px`, async () => {
        await setViewport({ width, height: 900 });
        const fixture = buildStyledSections();
        await init(fixture.block);
        expect(getComputedStyle(fixture.headerSection, '::after').content).to.equal('""');
        const { layout, article, navigation } = await addSideNavigation(fixture);
        expect(getComputedStyle(layout, '::before').content).to.equal('none');
        expect(getComputedStyle(fixture.headerSection).marginBlockEnd).to.equal('0px');
        expect(getComputedStyle(navigation).marginBlockStart).to.equal('0px');
        expect(getComputedStyle(fixture.headerSection, '::after').content).to.equal('none');

        const rule = getComputedStyle(article, '::before');
        const navRect = navigation.querySelector('nav').getBoundingClientRect();
        const ruleTop = article.getBoundingClientRect().top + parseFloat(rule.top);
        expect(rule.content).to.equal('""');
        expect(rule.pointerEvents).to.equal('none');
        expect(rule.blockSize).to.equal(width < 600 ? '1.5px' : '2px');
        expect(rule.borderImageSource).to.include(width < 600
          ? 'linear-gradient(rgb(192, 192, 192), rgb(192, 192, 192))'
          : 'repeating-linear-gradient');
        expect(rule.borderImageOutset).to.equal(`0 ${width}px`);
        expect(ruleTop - navRect.bottom).to.equal(56);
        expect(article.getBoundingClientRect().top - (ruleTop + parseFloat(rule.height)))
          .to.equal(56);
      });
    });

    [600, 768, 1199].forEach((width) => {
      it(`keeps header and vertical sidenav rules in the tablet rail layout at ${width}px`, async () => {
        await setViewport({ width, height: 900 });
        const fixture = buildStyledSections();
        await init(fixture.block);
        const { layout, article, navigation } = await addSideNavigation(fixture);
        const gap = parseFloat(getComputedStyle(layout).columnGap);
        const rule = getComputedStyle(layout, '::before');
        expect(getComputedStyle(fixture.headerSection, '::after').content).to.equal('""');
        expect(rule.content).to.equal('""');
        expect(getComputedStyle(article, '::before').content).to.equal('none');
        expect(getComputedStyle(navigation).position).to.equal('sticky');
        expect(gap).to.equal(64);
        expect(layout.getBoundingClientRect().left + parseFloat(rule.left)
          - navigation.getBoundingClientRect().right).to.be.closeTo(32, 0.5);
        expect(layout.getBoundingClientRect().left + parseFloat(rule.left) + gap / 2)
          .to.be.closeTo(article.getBoundingClientRect().left, 0.5);
        expect(layout.getBoundingClientRect().top + parseFloat(rule.top))
          .to.equal(fixture.headerSection.getBoundingClientRect().bottom);
      });
    });

    it('positions the frame 56px into the gutters above section backgrounds without changing layout', async () => {
      await setViewport({ width: 1440, height: 900 });
      const { main, headerSection, block } = buildStyledSections();
      const tableSection = main.children[1];
      tableSection.style.cssText = 'position: relative; display: grid; background: white';
      await init(block);

      const frame = getComputedStyle(headerSection, '::before');
      expect(frame.content).to.equal('""');
      expect(frame.insetInlineStart).to.equal('64px');
      expect(frame.insetInlineEnd).to.equal('64px');
      expect(frame.zIndex).to.equal('1');
      expect(frame.pointerEvents).to.equal('none');
      expect(frame.backgroundImage).to.include('rgb(182, 182, 182)');
      expect(parseFloat(frame.blockSize)).to.be.closeTo(frameHeight(headerSection), 0.01);
      expect(getComputedStyle(tableSection).display).to.equal('grid');

      const before = rects([...main.children]);
      disableRule('.blog-divider-frame::before');
      expect(rects([...main.children])).to.deep.equal(before);
    });

    it('clamps both frame offsets at the viewport edge when the gutters are narrower than 56px', async () => {
      await setViewport({ width: 768, height: 900 });
      const { main, headerSection, block } = buildStyledSections();
      main.style.setProperty('--grid-margins-width', '40px');
      await init(block);
      const frame = getComputedStyle(headerSection, '::before');
      expect(frame.insetInlineStart).to.equal('0px');
      expect(frame.insetInlineEnd).to.equal('0px');
    });

    it('hides vertical framing on mobile while retaining the full-width header rule', async () => {
      await setViewport({ width: 375, height: 900 });
      const { headerSection, block } = buildStyledSections();
      await init(block);
      expect(getComputedStyle(headerSection, '::before').content).to.equal('none');
      const bottom = getComputedStyle(headerSection, '::after');
      expect(bottom.content).to.equal('""');
      expect(parseFloat(bottom.width))
        .to.be.closeTo(headerSection.getBoundingClientRect().width, 0.01);
      expect(bottom.blockSize).to.equal('1.5px');
      expect(bottom.backgroundImage)
        .to.equal('linear-gradient(rgb(192, 192, 192), rgb(192, 192, 192))');
    });
  });
});

describe('blog-header reading progress', () => {
  const originalViewport = { width: window.innerWidth, height: window.innerHeight };
  let fetchStub;
  let scrollStub;
  let heightStub;
  let style;
  let styleObserver;
  let scrollTop;
  let viewportHeight;

  const nextFrame = () => new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(resolve));
  });
  const progress = (bar) => new DOMMatrix(getComputedStyle(bar).transform).a;

  function mockRect(element, top, bottom) {
    stub(element, 'getBoundingClientRect').callsFake(
      () => new DOMRect(0, top - scrollTop, 600, bottom - top),
    );
  }

  function buildArticle() {
    const { main, block } = buildBlock({ authors: 0 });
    block.classList.add('no-dividers');
    const headerSection = block.closest('.section');
    mockRect(headerSection, 0, 400);
    main.insertAdjacentHTML('beforeend', '<div class="section"><div class="content">'
      + '<h2>Article section</h2><p>First copy.</p></div></div>'
      + '<div class="section"><div class="content"><p>Final copy.</p></div></div>'
      + '<div class="section"><div class="text">Related articles</div>'
      + '<div class="card-metadata"></div></div>');
    const [first, last] = main.querySelectorAll('.content');
    mockRect(first, 600, 1800);
    mockRect(last, 1800, 2600);
    const globalNav = document.createElement('header');
    globalNav.className = 'global-navigation';
    stub(globalNav, 'getBoundingClientRect').returns(new DOMRect(0, 0, 600, 64));
    main.prepend(globalNav);
    return {
      main, block, headerSection, first, last, related: main.lastElementChild,
    };
  }

  async function scrollTo(top) {
    scrollTop = top;
    window.dispatchEvent(new Event('scroll'));
    await nextFrame();
  }

  beforeEach(() => {
    fetchStub = mockFetch();
    scrollTop = 1000;
    viewportHeight = 800;
    scrollStub = stub(window, 'scrollY').get(() => scrollTop);
    heightStub = stub(window, 'innerHeight').get(() => viewportHeight);
    style = document.createElement('style');
    style.textContent = blogHeaderCss;
    document.head.append(style);
  });

  afterEach(async () => {
    styleObserver?.disconnect();
    styleObserver = undefined;
    await cleanup();
    window.dispatchEvent(new Event('scroll'));
    await nextFrame();
    style.remove();
    scrollStub.restore();
    heightStub.restore();
    fetchStub.restore();
    await setViewport(originalViewport);
  });

  it('fills between the article boundaries, clamps, and reverses without counting related cards', async () => {
    const { block } = buildArticle();
    await init(block);
    const bar = block.querySelector('.blog-progress-bar');
    expect(bar.hidden).to.equal(false);
    expect(bar.getAttribute('aria-hidden')).to.equal('true');
    expect(block.closest('.section').classList.contains('blog-divider-frame')).to.equal(false);
    expect(progress(bar)).to.be.closeTo((1000 - 536) / (1800 - 536), 0.000001);
    await scrollTo(1800);
    expect(progress(bar)).to.equal(1);
    await scrollTo(2200);
    expect(progress(bar)).to.equal(1);
    await scrollTo(536);
    expect(progress(bar)).to.equal(0);
    await scrollTo(400);
    expect(progress(bar)).to.equal(0);
    await scrollTo(1000);
    expect(progress(bar)).to.be.closeTo((1000 - 536) / (1800 - 536), 0.000001);
  });

  it('counts final copy sharing the related-cards section without requiring side navigation', async () => {
    const { block, last, related } = buildArticle();
    const lastSection = last.parentElement;
    related.prepend(last);
    lastSection.remove();
    await init(block);
    const bar = block.querySelector('.blog-progress-bar');
    expect(progress(bar)).to.be.closeTo((1000 - 536) / (1800 - 536), 0.000001);
    await scrollTo(1800);
    expect(progress(bar)).to.equal(1);
  });

  ['same section', 'separate section', 'mixed related-cards section'].forEach((layout) => {
    it(`starts at a leading AI summary in the ${layout}, including after reparenting`, async () => {
      const { block, headerSection, first, last, related } = buildArticle();
      if (layout === 'mixed related-cards section') {
        const lastSection = last.parentElement;
        first.parentElement.append(last, ...related.children);
        lastSection.remove();
        related.remove();
      }
      await init(block);
      const bar = block.querySelector('.blog-progress-bar');
      expect(progress(bar)).to.be.closeTo((1000 - 536) / (1800 - 536), 0.000001);
      const summary = document.createElement('div');
      summary.className = 'ai-summary';
      summary.innerHTML = '<div><div><h2>Key takeaways</h2><p>Summary copy.</p></div></div>';
      mockRect(summary, 400, 600);
      if (layout === 'separate section') {
        const section = document.createElement('div');
        section.className = 'section';
        section.append(summary);
        first.parentElement.before(section);
      } else {
        first.before(summary);
      }
      await nextFrame();
      expect(progress(bar)).to.be.closeTo((1000 - 336) / (1800 - 336), 0.000001);
      await scrollTo(336);
      expect(progress(bar)).to.equal(0);
      await scrollTo(400);
      expect(progress(bar)).to.be.closeTo((400 - 336) / (1800 - 336), 0.000001);
      const navigation = document.createElement('div');
      navigation.className = 'blog-side-navigation';
      headerSection.append(navigation);
      await initSideNavigation(navigation);
      await nextFrame();
      expect(progress(bar)).to.be.closeTo((400 - 336) / (1800 - 336), 0.000001);
      await scrollTo(1800);
      expect(progress(bar)).to.equal(1);
    });
  });

  it('omits the bar for short articles and restores it when the viewport gets smaller', async () => {
    const { block } = buildArticle();
    viewportHeight = 2200;
    await init(block);
    const bar = block.querySelector('.blog-progress-bar');
    expect(bar.hidden).to.equal(true);
    viewportHeight = 2064;
    window.dispatchEvent(new Event('resize'));
    await nextFrame();
    expect(bar.hidden).to.equal(true);
    viewportHeight = 800;
    window.dispatchEvent(new Event('resize'));
    await nextFrame();
    expect(bar.hidden).to.equal(false);
    expect(progress(bar)).to.be.closeTo((1000 - 536) / (1800 - 536), 0.000001);
    viewportHeight = 2200;
    window.dispatchEvent(new Event('resize'));
    await nextFrame();
    expect(bar.hidden).to.equal(true);
  });

  it('does not create a bar when no-progress-bar is authored', async () => {
    const { block } = buildArticle();
    block.classList.add('no-progress-bar');
    await init(block);
    expect(block.querySelector('.blog-progress-bar')).not.to.exist;
  });

  it('discovers article copy added after initialization', async () => {
    const { main, block, first, last, related } = buildArticle();
    const sections = [first.parentElement, last.parentElement];
    sections.forEach((section) => section.remove());
    await init(block);
    const bar = block.querySelector('.blog-progress-bar');
    expect(bar.hidden).to.equal(true);
    related.before(...sections);
    await nextFrame();
    expect(bar.hidden).to.equal(false);
    expect(progress(bar)).to.be.closeTo((1000 - 536) / (1800 - 536), 0.000001);
    expect(main.querySelector('.blog-article-layout')).not.to.exist;
  });

  it('refreshes cached boundaries when copy is replaced or decorated through a class change', async () => {
    const { block, last } = buildArticle();
    last.classList.remove('content');
    await init(block);
    const bar = block.querySelector('.blog-progress-bar');
    expect(progress(bar)).to.equal(1);
    last.classList.add('content');
    await nextFrame();
    expect(progress(bar)).to.be.closeTo((1000 - 536) / (1800 - 536), 0.000001);
    const replacement = last.cloneNode(true);
    mockRect(replacement, 1800, 3400);
    last.replaceWith(replacement);
    await nextFrame();
    expect(progress(bar)).to.be.closeTo((1000 - 536) / (2600 - 536), 0.000001);
  });

  it('remeasures cached copy when its height changes without replacing the element', async () => {
    const { block, last } = buildArticle();
    await init(block);
    const bar = block.querySelector('.blog-progress-bar');
    last.getBoundingClientRect.callsFake(
      () => new DOMRect(0, 1800 - scrollTop, 600, 1600),
    );
    last.style.height = '1600px';
    await waitFor(() => Math.abs(progress(bar) - (1000 - 536) / (2600 - 536)) < 0.000001);
    expect(bar.hidden).to.equal(false);
  });

  it('preserves progress after deferred side navigation reparents the article', async () => {
    const { main, block, headerSection } = buildArticle();
    await init(block);
    const bar = block.querySelector('.blog-progress-bar');
    const before = progress(bar);
    const navigation = document.createElement('div');
    navigation.className = 'blog-side-navigation';
    headerSection.append(navigation);
    await initSideNavigation(navigation);
    await nextFrame();
    expect(main.querySelector('.blog-article-layout')).to.exist;
    expect(progress(bar)).to.equal(before);
    await scrollTo(1800);
    expect(progress(bar)).to.equal(1);
  });

  [false, true].forEach((noDividers) => {
    it(`follows stage's mobile divider and tablet rail with no-dividers=${noDividers}`, async () => {
      await setViewport({ width: 599, height: 900 });
      scrollTop = 0;
      style.textContent += sideNavigationCss;
      const { main, block, headerSection } = buildArticle();
      block.classList.toggle('no-dividers', noDividers);
      await init(block);
      const navigation = document.createElement('div');
      navigation.className = 'blog-side-navigation';
      headerSection.append(navigation);
      await initSideNavigation(navigation);
      const article = main.querySelector('.blog-article-content');
      mockRect(article, 600, 2600);
      await nextFrame();
      const bar = block.querySelector('.blog-progress-bar');
      expect(getComputedStyle(navigation).display).to.equal('contents');
      const gap = noDividers ? 32 : 113.5;
      expect(parseFloat(bar.style.top)).to.equal(600 - gap / 2 - 4);
      expect(progress(bar)).to.equal(0);
      await scrollTo(600);
      expect(parseFloat(bar.style.top)).to.equal(64);
      await scrollTo(0);
      expect(parseFloat(bar.style.top)).to.equal(600 - gap / 2 - 4);
      for (const width of [600, 1199, 1440]) {
        await setViewport({ width, height: 900 });
        await nextFrame();
        expect(parseFloat(bar.style.top)).to.equal(395);
      }
    });
  });

  [
    ['blog-layout-end', '<div class="section blog-layout-end"></div>'],
    ['footer promo', '<div class="section" data-footer-promo></div>'],
    ['undecorated section metadata', '<div class="section"><div class="section-metadata" hidden>'
      + '<div><div>Style</div><div>blog-layout-end</div></div></div></div>'],
  ].forEach(([name, boundary]) => {
    it(`respects hidden sections and ${name} before and after reparenting`, async () => {
      const { main, block, headerSection, first, related } = buildArticle();
      related.remove();
      first.parentElement.insertAdjacentHTML(
        'beforebegin',
        '<div class="section" hidden><div class="content">Hidden copy</div></div>',
      );
      mockRect(main.querySelector('[hidden] > .content'), 100, 900);
      main.insertAdjacentHTML(
        'beforeend',
        `${boundary}<div class="section"><div class="content">Footer copy</div></div>`,
      );
      mockRect(main.lastElementChild.firstElementChild, 3000, 5000);
      await init(block);
      const bar = block.querySelector('.blog-progress-bar');
      const expected = (1000 - 536) / (1800 - 536);
      expect(progress(bar)).to.be.closeTo(expected, 0.000001);
      const navigation = document.createElement('div');
      navigation.className = 'blog-side-navigation';
      headerSection.append(navigation);
      await initSideNavigation(navigation);
      await nextFrame();
      expect(progress(bar)).to.be.closeTo(expected, 0.000001);
      await scrollTo(1800);
      expect(progress(bar)).to.equal(1);
    });
  });

  it('reuses article discovery and avoids unchanged style writes after completion', async () => {
    const { block, last } = buildArticle();
    await init(block);
    const bar = block.querySelector('.blog-progress-bar');
    await scrollTo(2000);
    const queries = stub(last.parentElement, 'querySelectorAll').callThrough();
    const changes = [];
    styleObserver = new MutationObserver((records) => changes.push(...records));
    styleObserver.observe(bar, { attributes: true, attributeFilter: ['style', 'hidden'] });
    await scrollTo(2100);
    await scrollTo(2200);
    expect(queries.called).to.equal(false);
    expect(changes).to.have.length(0);
    expect(progress(bar)).to.equal(1);
  });
});

describe('blog-header share modal', () => {
  let fetchStub;
  let clipboardStub;
  let writeText;
  let clock;

  beforeEach(() => {
    fetchStub = mockFetch();
    writeText = stub().resolves();
    clipboardStub = stub(navigator, 'clipboard').value({ writeText });
  });

  afterEach(async () => {
    await cleanup();
    clock?.restore();
    clock = null;
    clipboardStub.restore();
    fetchStub.restore();
  });

  it('derives the share url from the canonical link', () => {
    const link = document.createElement('link');
    link.rel = 'canonical';
    link.href = 'https://business.adobe.com/blog/post';
    link.className = 'blog-header-test-metadata';
    document.head.append(link);
    expect(getShareUrl()).to.equal('https://business.adobe.com/blog/post');
    expect(getShareData().url).to.equal('https://business.adobe.com/blog/post');
  });

  [
    'https://business.adobe.com/blog/media_share.png?width=1200&format=webp#preview',
    '//business.adobe.com/blog/media_share.png?width=1200&format=webp#preview',
    '/blog/media_share.png?width=1200&format=webp#preview',
  ].forEach((image) => {
    it(`uses the current page origin for the share image ${image}`, () => {
      setMetadata('og:image', image);
      expect(getShareData().image)
        .to.equal(`${window.location.origin}/blog/media_share.png?width=1200&format=webp#preview`);
    });
  });

  it('resolves page-relative share images against the current page', () => {
    setMetadata('og:image', './media_share.png?width=1200');
    expect(getShareData().image)
      .to.equal(new URL('./media_share.png?width=1200', window.location.href).href);
  });

  it('omits the share image when no image metadata is authored', () => {
    expect(getShareData().image).to.equal('');
  });

  it('logs invalid share image URLs without preventing sharing', () => {
    setMetadata('og:image', 'https://[invalid');
    const data = getShareData();
    expect(data.image).to.equal('');
    expect(window.lana.log.calledOnce).to.equal(true);
    expect(window.lana.log.firstCall.args[0]).to.contain('Invalid share image URL');
    expect(data.url).to.equal(getShareUrl());
  });

  it('opens a modal with the preview card and share actions', async () => {
    setMetadata('og:image', 'https://business.adobe.com/blog/media_share.png?width=1200');
    setMetadata('og:image:alt', 'Article preview');
    const trigger = document.createElement('button');
    trigger.className = 'blog-header-test-trigger';
    document.body.append(trigger);
    const dialog = await openShareModal(trigger);
    expect(dialog).to.exist;
    expect(dialog.classList.contains('blog-share-modal')).to.equal(true);
    const image = dialog.querySelector('.blog-share-card-image');
    expect(image.src).to.equal(`${window.location.origin}/blog/media_share.png?width=1200`);
    expect(image.alt).to.equal('Article preview');
    expect(dialog.querySelector('.blog-share-heading').textContent).to.equal('Share post');
    expect(dialog.querySelector('.dialog-close').getAttribute('aria-label')).to.equal('Close share dialog');
    const actions = dialog.querySelectorAll('.blog-share-action');
    expect(actions.length).to.equal(4);
    expect([...actions].map((action) => action.getAttribute('aria-label')))
      .to.deep.equal(['Share on X', 'Share via email', 'Share on LinkedIn', 'Copy link']);
  });

  [
    { metadata: 'og:title', selector: '.blog-share-card-title strong' },
    { metadata: 'og:description', selector: '.blog-share-card-desc' },
    { metadata: 'description', selector: '.blog-share-card-desc' },
  ].forEach(({ metadata, selector }) => {
    it(`renders ${metadata} as text rather than HTML in the share card`, async () => {
      const value = '<img src=x onerror="void 0"> & Article';
      setMetadata(metadata, value);
      const dialog = await openShareModal();
      const element = dialog.querySelector(selector);
      expect(element).to.exist;
      expect(element.textContent).to.equal(value);
      expect(element.children.length).to.equal(0);
    });
  });

  it('renders the document title fallback as text rather than HTML in the share card', async () => {
    const originalTitle = document.title;
    const value = '<img src=x onerror="void 0"> & Article';
    try {
      document.title = value;
      const dialog = await openShareModal();
      const title = dialog.querySelector('.blog-share-card-title strong');
      expect(title.textContent).to.equal(value);
      expect(title.children.length).to.equal(0);
    } finally {
      document.title = originalTitle;
    }
  });

  it('honors authored share order without duplicate actions', async () => {
    setMetadata('blog-share-platforms', 'copy, email, copy, unsupported, x');
    const dialog = await openShareModal();
    const actions = dialog.querySelectorAll('.blog-share-action');
    expect([...actions].map((action) => action.getAttribute('aria-label')))
      .to.deep.equal(['Copy link', 'Share via email', 'Share on X']);
    expect([...actions].every((action) => action.querySelector('svg').childElementCount > 0))
      .to.equal(true);
  });

  it('omits copy when the Clipboard API is unavailable', async () => {
    clipboardStub.value(undefined);
    const dialog = await openShareModal();
    expect(dialog.querySelectorAll('.blog-share-action').length).to.equal(3);
    expect(dialog.querySelectorAll('.blog-share-copy').length).to.equal(0);
  });

  it('reuses the same dialog for concurrent and repeated opens', async () => {
    const [first, second] = await Promise.all([openShareModal(), openShareModal()]);
    expect(first === second).to.equal(true);
    expect(await openShareModal() === first).to.equal(true);
    expect(document.querySelectorAll('#blog-share-modal').length).to.equal(1);
  });

  it('restores trigger focus through the shared modal lifecycle, not a global event', async () => {
    const trigger = document.createElement('button');
    trigger.className = 'blog-header-test-trigger';
    document.body.append(trigger);
    trigger.focus();
    const dialog = await openShareModal(trigger);
    const focused = document.activeElement;
    window.dispatchEvent(new Event('milo:modal:closed'));
    expect(document.activeElement === focused).to.equal(true);
    await closeModal(dialog);
    expect(document.activeElement === trigger).to.equal(true);
    expect(trigger.hasAttribute('data-is-modal-trigger')).to.equal(false);
    const reopened = await openShareModal(trigger);
    expect(reopened === dialog).to.equal(false);
  });

  it('copies the share URL and clears localized success feedback', async () => {
    const dialog = await openShareModal();
    clock = useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    const button = dialog.querySelector('.blog-share-copy');
    const feedback = dialog.querySelector('.blog-share-feedback');
    const status = dialog.querySelector('.blog-share-status');
    button.click();
    await clock.tickAsync(0);
    expect(writeText.calledOnceWithExactly(getShareUrl())).to.equal(true);
    expect(feedback.textContent).to.equal('Link copied');
    expect(status.textContent).to.equal('Link copied');
    expect(button.classList.contains('blog-share-copied')).to.equal(true);
    await clock.tickAsync(3000);
    expect(feedback.textContent).to.equal('');
    expect(button.classList.contains('blog-share-copied')).to.equal(false);
    expect(status.textContent).to.equal('Link copied');
  });

  it('keeps a persistent status region separate from the decorative badge', async () => {
    const dialog = await openShareModal();
    const feedback = dialog.querySelector('.blog-share-feedback');
    const status = dialog.querySelector('.blog-share-status');
    expect(feedback.getAttribute('aria-hidden')).to.equal('true');
    expect(feedback.hasAttribute('role')).to.equal(false);
    expect(status.getAttribute('role')).to.equal('status');
    expect(status.getAttribute('aria-live')).to.equal('polite');
    expect(status.classList.contains('sr-only')).to.equal(true);
    expect(getComputedStyle(status).display).not.to.equal('none');
  });

  it('marks decorative share icons as hidden from assistive technology', async () => {
    const dialog = await openShareModal();
    const icons = dialog.querySelectorAll('.blog-share-action svg');
    expect(icons.length).to.equal(4);
    expect([...icons].every((svg) => svg.getAttribute('aria-hidden') === 'true'
      && svg.getAttribute('focusable') === 'false')).to.equal(true);
  });

  it('clears previous copy feedback and announces a clipboard failure', async () => {
    const dialog = await openShareModal();
    clock = useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    const button = dialog.querySelector('.blog-share-copy');
    const feedback = dialog.querySelector('.blog-share-feedback');
    const status = dialog.querySelector('.blog-share-status');
    button.click();
    await clock.tickAsync(0);
    writeText.rejects(new Error('permission denied'));
    button.click();
    expect(feedback.textContent).to.equal('');
    expect(status.textContent).to.equal('');
    await clock.tickAsync(0);
    expect(feedback.textContent).to.equal('Copy failed');
    expect(status.textContent).to.equal('Copy failed');
    expect(button.classList.contains('blog-share-copied')).to.equal(false);
    await clock.tickAsync(3000);
    expect(feedback.textContent).to.equal('');
  });
});
