import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { setConfig } from '../../../../libs/utils/utils.js';

setConfig({ codeRoot: '/libs', locales: { '': { ietf: 'en-US' } } });
const { default: init, getShareUrl } = await import('../../../../libs/c2/blocks/share-c2/share-c2.js');

const waitFor = async (check, tries = 50) => {
  for (let i = 0; i < tries; i += 1) {
    if (check()) return;
    // eslint-disable-next-line no-await-in-loop
    await new Promise((r) => { setTimeout(r, 20); });
  }
};

function makeBlock(html, classes = '') {
  const el = document.createElement('div');
  el.className = `share-c2 ${classes}`.trim();
  el.innerHTML = `<div><div>${html}</div></div>`;
  document.body.append(el);
  return el;
}

describe('share-c2', () => {
  let writeText;

  beforeEach(() => {
    writeText = sinon.stub(navigator.clipboard, 'writeText').resolves();
  });

  afterEach(() => {
    sinon.restore();
    document.querySelectorAll('.share-c2, .c2-toast').forEach((el) => el.remove());
  });

  it('renders an outline button with the authored label', () => {
    const el = makeBlock('Copy page link');
    init(el);
    const button = el.querySelector('button.con-button.outline.share-c2-button');
    expect(button).to.exist;
    expect(button.textContent.trim()).to.equal('Copy page link');
    expect(el.children.length).to.equal(1);
  });

  it('applies fill and blue button styles from block variants', () => {
    const el = makeBlock('Share', 'blue');
    init(el);
    expect(el.querySelector('button').classList.contains('blue')).to.be.true;
    expect(el.querySelector('button').classList.contains('outline')).to.be.false;
  });

  it('copies the page URL without query or hash and shows a toast', async () => {
    const el = makeBlock('Share');
    init(el);
    el.querySelector('button').click();
    await waitFor(() => document.querySelector('.c2-toast-positive'));
    const { origin, pathname } = window.location;
    const canonical = document.querySelector('link[rel="canonical"]')?.href;
    expect(writeText.calledOnceWith(canonical ?? `${origin}${pathname}`)).to.be.true;
    expect(document.querySelector('.c2-toast-positive')).to.exist;
  });

  it('copies an authored link instead of the page URL', async () => {
    const el = makeBlock('<a href="https://www.adobe.com/products/photoshop.html">Share Photoshop</a>');
    init(el);
    expect(el.querySelector('button').textContent.trim()).to.equal('Share Photoshop');
    el.querySelector('button').click();
    await waitFor(() => writeText.called);
    expect(writeText.calledOnceWith('https://www.adobe.com/products/photoshop.html')).to.be.true;
  });

  it('is icon-only with an accessible name when no label is authored', async () => {
    const el = makeBlock('');
    init(el);
    const button = el.querySelector('button');
    expect(button.classList.contains('icon-only')).to.be.true;
    await waitFor(() => button.hasAttribute('aria-label'));
    expect(button.getAttribute('aria-label')).to.not.be.empty;
  });

  it('shows an error toast when copying fails', async () => {
    writeText.rejects(new Error('denied'));
    const el = makeBlock('Share');
    init(el);
    el.querySelector('button').click();
    await waitFor(() => document.querySelector('.c2-toast-negative'));
    expect(document.querySelector('.c2-toast-negative [role="alert"]')).to.exist;
  });

  it('prefers the canonical URL', () => {
    const link = document.createElement('link');
    link.rel = 'canonical';
    link.href = 'https://www.adobe.com/canonical.html';
    document.head.append(link);
    expect(getShareUrl()).to.equal('https://www.adobe.com/canonical.html');
    link.remove();
  });
});
