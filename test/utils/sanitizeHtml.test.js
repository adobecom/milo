import { expect } from '@esm-bundle/chai';
import { readFile } from '@web/test-runner-commands';
import { sanitizeHtmlBody } from '../../libs/features/personalization/personalization.js';

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
