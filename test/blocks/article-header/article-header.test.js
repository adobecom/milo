import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon, { stub } from 'sinon';
import { setConfig, getConfig } from '../../../libs/utils/utils.js';
import { delay, waitForElement } from '../../helpers/waitfor.js';

const locales = { '': { ietf: 'en-US', tk: 'hah7vzn.css' } };
const conf = { locales, miloLibs: 'http://localhost:2000/libs' };
setConfig(conf);
const config = getConfig();
window.lana = { log: stub() };

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const { default: init } = await import('../../../libs/blocks/article-header/article-header.js');
const { loadTaxonomy } = await import('../../../libs/blocks/article-feed/article-helpers.js');

const invalidDoc = await readFile({ path: './mocks/body-invalid.html' });

describe('article header', () => {
  before(async () => {
    const block = document.body.querySelector('.article-header');
    config.locale.contentRoot = '/test/blocks/article-header/mocks';
    config.taxonomyRoot = undefined;
    await init(block);
  });

  it('should log unknown topic', async () => {
    try {
      const div = document.createElement('div');
      div.setAttribute('data-topic-link', ['abcd']);
      document.body.append(div);
      await loadTaxonomy();
      expect(window.lana.log.args[0][0]).to.equal('Trying to get a link for an unknown topic: abcd (current page)');
    } catch (e) {
      console.log(e);
    }
  });
  it('creates article header block', () => {
    expect(document.body.querySelector('.article-category')).to.exist;
    expect(document.body.querySelector('.article-title')).to.exist;
    expect(document.body.querySelector('.article-author-image')).to.exist;
    expect(document.body.querySelector('.article-author')).to.exist;
    expect(document.body.querySelector('.article-date')).to.exist;
    expect(document.body.querySelector('.article-byline-sharing')).to.exist;
  });

  it('should open link popup when share links are clicked', () => {
    // first share link is twitter
    const shareLink = document.querySelector('.article-byline-sharing a');
    const windowStub = sinon.stub(window, 'open');
    shareLink.click();

    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.querySelector('h1').textContent);
    expect(windowStub.calledOnce).to.be.true;
    expect(windowStub.firstCall.args[0]).to.equal(`https://www.twitter.com/share?&url=${url}&text=${title}`);
    expect(windowStub.firstCall.args[2]).to.equal('popup,top=233,left=233,width=700,height=467');

    windowStub.restore();
  });

  it('updates share text after deferred event', async () => {
    document.dispatchEvent(new Event('milo:deferred'));
    const shareLink = document.querySelector('.article-byline-sharing a');
    await delay(100);
    expect(shareLink.getAttribute('aria-label')).to.equal('Click to share on twitter');
  });

  it('should add copy-failure class to link if the copy fails', async () => {
    const writeTextStub = sinon.stub(navigator.clipboard, 'writeText').rejects();
    const copyLink = document.body.querySelector('.article-byline-sharing #copy-to-clipboard');
    sinon.fake();
    copyLink.click();
    await delay(200);

    expect(copyLink.classList.contains('copy-failure')).to.true;

    writeTextStub.restore();
  });

  it('should copy to clipboard when link icon is clicked and show the tooltip', async () => {
    const writeTextStub = sinon.stub(navigator.clipboard, 'writeText').resolves();
    const copyLink = document.body.querySelector('.article-byline-sharing #copy-to-clipboard');
    sinon.fake();
    copyLink.click();

    const tooltip = await waitForElement('.copied-to-clipboard');

    expect(tooltip).to.exist;
    writeTextStub.restore();
  });

  it('updates copy text after deferred event', async () => {
    document.dispatchEvent(new Event('milo:deferred'));
    const writeTextStub = sinon.stub(navigator.clipboard, 'writeText').resolves();
    const copyLink = document.body.querySelector('.article-byline-sharing #copy-to-clipboard');
    sinon.fake();
    copyLink.click();
    const tooltip = await waitForElement('.copied-to-clipboard');
    expect(tooltip.textContent).to.equal('Link copied to clipboard');
    writeTextStub.restore();
  });

  it('sets default taxonomy path to "topics"', () => {
    const categoryLink = document.querySelector('.article-category a');
    expect(categoryLink.href.includes('/topics/')).to.be.true;
  });

  it('adds an author image from a link', () => {
    const img = document.querySelector('.article-author-image img');
    const link = document.querySelector('.article-author a');
    expect(img).to.exist;
    expect(link).to.exist;
  });

  it('adds an author image from data attribute', async () => {
    await init(document.querySelector('#article-header-no-author-link'));
    const img = document.querySelector('.article-author-image img');
    const author = document.querySelector('.article-author [data-author-page]');
    expect(img).to.exist;
    expect(author).to.exist;
  });
});

describe('test the invalid article header', () => {
  beforeEach(() => {
    document.body.innerHTML = invalidDoc;
  });

  it('does not init if the element is invalid', async () => {
    await init(document.body.querySelector('.article-header'));
    const authorTextEl = await waitForElement('.article-author');
    const authorLink = document.querySelector('.article-author a');
    expect(authorTextEl).to.exist;
    expect(authorLink).to.not.exist;
  });

  it('adds invalid-date when invalid date is provided', async () => {
    await init(document.body.querySelector('.article-header'));
    const date = await waitForElement('.article-date-invalid');
    expect(date).to.exist;
  });

  it('does not add invalid-date on prod', async () => {
    setConfig({ ...conf, env: { name: 'prod' } });
    await init(document.body.querySelector('.article-header'));

    const date = await waitForElement('.article-date');
    expect(date).to.exist;
    expect(date.classList.contains('article-date-invalid')).to.be.false;
  });
});

describe('article header', () => {
  it('allows a blank category', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body-without-category.html' });
    await init(document.body.querySelector('.article-header'));
    expect(document.body.querySelector('.article-category a')).to.be.null;
  });

  it('supports a featured video', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body-video.html' });
    const el = document.body.querySelector('.article-header');
    await init(el);
    expect(el.querySelector('.article-feature-video video')).to.exist;
  });
});
