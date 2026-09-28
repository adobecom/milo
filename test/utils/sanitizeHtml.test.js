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

describe('sanitizeHtml URL scheme allowlist', () => {
  const attrOf = (html, selector, attr) => sanitizeHtmlBody(html)
    .querySelector(selector)?.getAttribute(attr);

  const stripped = [
    ['vbscript: on href', '<a href="vbscript:msgbox(1)">x</a>', 'a', 'href'],
    ['data:text/html iframe', '<iframe src="data:text/html,<script>alert(1)</script>"></iframe>', 'iframe', 'src'],
    ['data:application/xhtml+xml iframe', '<iframe src="data:application/xhtml+xml,<x/>"></iframe>', 'iframe', 'src'],
    ['data:text/javascript', '<iframe src="data:text/javascript,alert(1)"></iframe>', 'iframe', 'src'],
    ['data:image/svg+xml img', '<img src="data:image/svg+xml,<svg onload=alert(1)>">', 'img', 'src'],
    ['data: on object', '<object data="data:text/html,<script>alert(1)</script>"></object>', 'object', 'data'],
    ['blob: on href', '<a href="blob:https://x/abc">x</a>', 'a', 'href'],
    ['ftp: on href', '<a href="ftp://host/file.zip">x</a>', 'a', 'href'],
    ['ftp: on img src', '<img src="ftp://host/a.png">', 'img', 'src'],
    ['tab-obfuscated javascript', '<a href="java\tscript:alert(1)">x</a>', 'a', 'href'],
    ['control-char-prefixed javascript', '<a href="\x01javascript:alert(1)">x</a>', 'a', 'href'],
    ['whitespace-obfuscated data svg', '<img src="data:image/ svg+xml,<svg onload=alert(1)>">', 'img', 'src'],
    // eslint-disable-next-line no-script-url
    ['javascript: on form action', '<form action="javascript:alert(1)"><button>x</button></form>', 'form', 'action'],
    // eslint-disable-next-line no-script-url
    ['javascript: on button formaction', '<form><button formaction="javascript:alert(1)">x</button></form>', 'button', 'formaction'],
  ];

  stripped.forEach(([name, html, selector, attr]) => {
    it(`strips ${name}`, () => {
      expect(attrOf(html, selector, attr)).to.be.null;
    });
  });

  const preserved = [
    ['https', '<a href="https://adobe.com/x">x</a>', 'a', 'href'],
    ['http', '<a href="http://adobe.com/x">x</a>', 'a', 'href'],
    ['relative path', '<a href="/products/photoshop">x</a>', 'a', 'href'],
    ['anchor', '<a href="#section">x</a>', 'a', 'href'],
    ['query', '<a href="?q=1">x</a>', 'a', 'href'],
    ['protocol-relative', '<img src="//cdn.adobe.com/a.png">', 'img', 'src'],
    ['mailto', '<a href="mailto:a@b.com">x</a>', 'a', 'href'],
    ['tel', '<a href="tel:+15551234">x</a>', 'a', 'href'],
    ['data: empty placeholder', '<img src="data:,">', 'img', 'src'],
    ['data:image raster', '<img src="data:image/png;base64,iVBOR">', 'img', 'src'],
    ['bookmark authoring anchor', '<a href="bookmark://thing">x</a>', 'a', 'href'],
    ['relative object data', '<object data="/report.pdf"></object>', 'object', 'data'],
    ['relative form action', '<form action="/subscribe"><button>x</button></form>', 'form', 'action'],
    ['https button formaction', '<form><button formaction="https://adobe.com/s">x</button></form>', 'button', 'formaction'],
  ];

  preserved.forEach(([name, html, selector, attr]) => {
    it(`preserves ${name}`, () => {
      expect(attrOf(html, selector, attr)).to.not.be.null;
    });
  });
});
