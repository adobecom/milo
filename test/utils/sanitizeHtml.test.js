import { expect } from '@esm-bundle/chai';
import { readFile } from '@web/test-runner-commands';
import { sanitizeHtml } from '../../libs/utils/sanitizeHtml.js';

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
