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
  const block = document.body.querySelector('.article-header');

  it('creates article header block', async () => {
    config.locale.contentRoot = '/test/blocks/article-header/mocks';

    await init(block);
    expect(document.body.querySelector('.article-category')).to.be.exist;
    expect(document.body.querySelector('.article-title')).to.be.exist;
    expect(document.body.querySelector('.article-author-image')).to.be.exist;
    expect(document.body.querySelector('.article-author')).to.be.exist;
    expect(document.body.querySelector('.article-date')).to.be.exist;
    expect(document.body.querySelector('.article-byline-sharing')).to.be.exist;
  });

  it('should open link popup when share links are clicked', () => {
    const shareLink = document.querySelector('.article-byline-sharing a');
    const spy = sinon.spy(shareLink, 'click');
    shareLink.click();
    expect(spy.called).to.be.true;
  });

  it('should add copy-failure class to link if the copy fails', async () => {
    const writeTextStub = sinon.stub(navigator.clipboard, 'writeText').rejects();
    const copyLink = document.body.querySelector('.article-byline-sharing #copy-to-clipboard');
    sinon.fake();
    copyLink.click();
    await delay(200);

    expect(copyLink.classList.contains('copy-failure')).to.be.true;

    writeTextStub.restore();
  });

  it('should copy to clipboard when link icon is clicked and show the tooltip', async () => {
    const writeTextStub = sinon.stub(navigator.clipboard, 'writeText').resolves();
    const copyLink = document.body.querySelector('.article-byline-sharing #copy-to-clipboard');
    sinon.fake();
    copyLink.click();

    const tooltip = await waitForElement('.copied-to-clipboard');

    expect(tooltip).to.be.exist;
    writeTextStub.restore();
  });
});

describe('test the invalid block', () => {
  beforeEach(() => {
    document.body.innerHTML = invalidDoc;
  });

  it('tests invalid url', async () => {
    await init(document.body.querySelector('.article-header'));
    const authorTextEl = await waitForElement('.article-author p');
    const authorLink = document.querySelector('.article-author a');
    expect(authorTextEl).to.be.exist;
    expect(authorLink).to.not.exist;
  });

  it('adds invalid-date when invalid date is provided', async () => {
    await init(document.body.querySelector('.article-header'));

    const date = await waitForElement('.article-date-invalid');
    console.log(date);
    expect(date).to.be.exist;
  });
});
