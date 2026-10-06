import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { stub, useFakeTimers } from 'sinon';
import { setConfig } from '../../../libs/utils/utils.js';
import { closeModal } from '../../../libs/blocks/modal/modal.js';
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
};

setConfig({
  locales: { '': { ietf: 'en-US', tk: 'hah7vzn.css' } },
  miloLibs: '/libs',
  codeRoot: '/libs',
  placeholders,
});
window.lana = { log: stub() };

const svgText = await readFile({ path: '../../../libs/blocks/blog-header/blog-header.svg' });

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
  meta.name = name;
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
    expect(block.querySelector('.blog-header-summary p p')).to.equal(null);
  });

  it('handles a title-only block without a summary row', async () => {
    fetchStub = mockFetch();
    const { block } = buildBlock({ authors: 0, summary: false });
    await init(block);
    expect(block.querySelector('.blog-header-title h1')).to.exist;
    expect(block.querySelector('.blog-header-summary')).to.equal(null);
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
    expect(authors[1].querySelector('.blog-header-author-meta')).to.equal(null);
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
    expect(block.querySelector('a.blog-header-author-name')).to.equal(null);
    await waitFor(() => block.querySelector('.blog-header-author-name').textContent === 'Profile Name');
    expect(block.querySelector('a.blog-header-author-name')).to.exist;
    expect(block.querySelector('.blog-header-author-avatar picture')).to.exist;
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
    expect(block.querySelector('a.blog-header-author-name')).to.equal(null);
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
      .to.contain('author-placeholder.png');
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
    expect(block.querySelector('.blog-header-author-meta')).to.equal(null);
    expect(window.lana.log.called).to.equal(false);
  });

  it('does not fetch missing profile fields when author links are disabled', async () => {
    setMetadata('article-author-link', 'off');
    fetchStub = mockFetch();
    const { block } = buildBlock({ picture: true, metadata: false });
    await init(block);
    expect(block.querySelector('.blog-header-author-name').tagName).to.equal('SPAN');
    expect(block.querySelector('.blog-header-author-meta')).to.equal(null);
    expect(fetchStub.getCalls().some((c) => c.args[0].includes('.plain.html'))).to.equal(false);
  });

  it('does not fetch missing metadata without a profile link', async () => {
    fetchStub = mockFetch();
    const { block } = buildBlock({ link: false, metadata: false });
    await init(block);
    expect(block.querySelector('.blog-header-author-meta')).to.equal(null);
    expect(fetchStub.getCalls().some((c) => c.args[0].includes('.plain.html'))).to.equal(false);
  });

  it('uses the default avatar on a failed profile request and logs it', async () => {
    fetchStub = mockFetch({ profileStatus: 400 });
    const { block } = buildBlock();
    await init(block);
    await waitFor(() => window.lana.log.called);
    const img = block.querySelector('.blog-header-author-avatar img.blog-header-avatar');
    expect(img.getAttribute('src')).to.contain('author-placeholder.png');
    expect(window.lana.log.called).to.equal(true);
  });

  it('keeps a URL-only label and omits missing metadata when the profile request fails', async () => {
    fetchStub = mockFetch({ profileReject: true });
    const { block, profilePath } = buildBlock({ name: null, metadata: false });
    await init(block);
    await waitFor(() => window.lana.log.called);
    expect(block.querySelector('.blog-header-author-name').textContent)
      .to.equal(new URL(profilePath, window.location.origin).href);
    expect(block.querySelector('.blog-header-author-meta')).to.equal(null);
    expect(block.querySelector('.blog-header-avatar').getAttribute('src'))
      .to.contain('author-placeholder.png');
  });

  it('uses the default avatar and logs a rejected profile request', async () => {
    fetchStub = mockFetch({ profileReject: true });
    const { block } = buildBlock();
    await init(block);
    await waitFor(() => window.lana.log.called);
    expect(block.querySelector('.blog-header-avatar').getAttribute('src'))
      .to.contain('author-placeholder.png');
    expect(window.lana.log.firstCall.args[0]).to.contain('network down');
  });

  it('uses the default avatar and logs a rejected response body', async () => {
    fetchStub = mockFetch({ profileBodyReject: true });
    const { block } = buildBlock();
    await init(block);
    await waitFor(() => window.lana.log.called);
    expect(block.querySelector('.blog-header-avatar').getAttribute('src'))
      .to.contain('author-placeholder.png');
    expect(window.lana.log.firstCall.args[0]).to.contain('response body failed');
  });

  it('keeps the default avatar without logging when the profile has no picture', async () => {
    fetchStub = mockFetch({ profileMarkup: '<div class="blog-author"><p>Author</p></div>' });
    const { block } = buildBlock();
    await init(block);
    expect(block.querySelector('.blog-header-avatar').getAttribute('src'))
      .to.contain('author-placeholder.png');
    expect(window.lana.log.called).to.equal(false);
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
    expect(block.querySelector('a.blog-header-author-name')).to.equal(null);
    expect(block.querySelector('span.blog-header-author-name').textContent).to.equal('Rachel Thornton');
    expect(fetchStub.getCalls().some((c) => c.args[0].includes('.plain.html'))).to.equal(false);
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

  it('opens a modal with the preview card and share actions', async () => {
    const trigger = document.createElement('button');
    trigger.className = 'blog-header-test-trigger';
    document.body.append(trigger);
    const dialog = await openShareModal(trigger);
    expect(dialog).to.exist;
    expect(dialog.classList.contains('blog-share-modal')).to.equal(true);
    expect(dialog.querySelector('.blog-share-heading').textContent).to.equal('Share post');
    expect(dialog.querySelector('.dialog-close').getAttribute('aria-label')).to.equal('Close share dialog');
    const actions = dialog.querySelectorAll('.blog-share-action');
    expect(actions.length).to.equal(4);
    expect([...actions].map((action) => action.getAttribute('aria-label')))
      .to.deep.equal(['Share on X', 'Share via email', 'Share on LinkedIn', 'Copy link']);
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
    expect(dialog.querySelector('.blog-share-copy')).to.equal(null);
  });

  it('reuses the same dialog for concurrent and repeated opens', async () => {
    const [first, second] = await Promise.all([openShareModal(), openShareModal()]);
    expect(first).to.equal(second);
    expect(await openShareModal()).to.equal(first);
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
    expect(document.activeElement).to.equal(focused);
    await closeModal(dialog);
    expect(document.activeElement).to.equal(trigger);
    expect(trigger.hasAttribute('data-is-modal-trigger')).to.equal(false);
    const reopened = await openShareModal(trigger);
    expect(reopened).not.to.equal(dialog);
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
