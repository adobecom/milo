import { expect } from '@esm-bundle/chai';
import { readFile } from '@web/test-runner-commands';
import { sanitizeHtml, sanitizeHtmlBody } from '../../libs/utils/sanitizeHtml.js';

describe('sanitizeHtml Util', () => {
  it('could sanitize HTML', async () => {
    const htmlXss = await readFile({ path: './mocks/xss.html' });
    expect(htmlXss.includes('alert')).to.be.true;
    const html = sanitizeHtml(htmlXss);
    expect(html.innerHTML.includes('alert')).to.be.false;
    expect(html.innerHTML.includes('nested text')).to.be.true;
    expect(html.innerHTML.includes('nested link')).to.be.true;
  });

  it('could sanitize empty string', async () => {
    const html = sanitizeHtml('');
    expect(html).to.be.null;
  });
});

describe('sanitizeHtmlBody Util', () => {
  it('returns full body element including all root siblings', async () => {
    const htmlXss = await readFile({ path: './mocks/xss.html' });
    const body = sanitizeHtmlBody(htmlXss);
    expect(body.tagName.toLowerCase()).to.equal('body');
    expect(body.innerHTML.includes('alert')).to.be.false;
    expect(body.innerHTML.includes('nested text')).to.be.true;
  });

  it('returns empty body for empty string', async () => {
    const body = sanitizeHtmlBody('');
    expect(body.tagName.toLowerCase()).to.equal('body');
    expect(body.childNodes.length).to.equal(0);
  });
});
