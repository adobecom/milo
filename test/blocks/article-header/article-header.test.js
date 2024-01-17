import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

import { setConfig, getConfig } from '../../../libs/utils/utils.js';
import { delay, waitForElement } from '../../helpers/waitfor.js';

const locales = { '': { ietf: 'en-US', tk: 'hah7vzn.css' } };
const conf = { locales, miloLibs: 'http://localhost:2000/libs' };
setConfig(conf);
const config = getConfig();

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const { default: init } = await import('../../../libs/blocks/article-header/article-header.js');

const invalidDoc = await readFile({ path: './mocks/body-invalid.html' });

describe('article header', () => {
  before(async () => {
    const block = document.body.querySelector('.article-header');
    config.locale.contentRoot = '/test/blocks/article-header/mocks';
    config.taxonomyRoot = undefined;

    await init(block);
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
    const stub = sinon.stub(window, 'open');
    shareLink.click();

    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.querySelector('h1').textContent);
    expect(stub.calledOnce).to.be.true;
    expect(stub.firstCall.args[0]).to.equal(`https://www.twitter.com/share?&url=${url}&text=${title}`);
    expect(stub.firstCall.args[2]).to.equal('popup,top=233,left=233,width=700,height=467');

    stub.restore();
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

  it('sets default taxonomy path to "topics"', () => {
    const categoryLink = document.querySelector('.article-category a');
    expect(categoryLink.href.includes('/topics/')).to.be.true;
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
