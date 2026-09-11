import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { setConfig } from '../../../../libs/utils/utils.js';
import {
  checkH1s,
  checkTitle,
  checkCanon,
  checkDescription,
  checkBody,
  checkLorem,
  connectionError,
  validLinkFilter,
  checkLinks,
} from '../../../../libs/blocks/preflight/checks/seo.js';

const areaWith = (innerHTML) => {
  const div = document.createElement('div');
  div.innerHTML = innerHTML;
  return div;
};

describe('preflight checks seo', () => {
  describe('checkH1s', () => {
    it('fails with no H1', () => {
      expect(checkH1s(areaWith('')).status).to.equal('fail');
    });
    it('passes with exactly one H1', () => {
      expect(checkH1s(areaWith('<h1>Title</h1>')).status).to.equal('pass');
    });
    it('fails with multiple H1s', () => {
      const res = checkH1s(areaWith('<h1>a</h1><h1>b</h1>'));
      expect(res.status).to.equal('fail');
      expect(res.description).to.contain('2 H1');
    });
  });

  describe('checkTitle', () => {
    it('fails a too-short title', () => {
      expect(checkTitle({ title: 'short' }).status).to.equal('fail');
    });
    it('passes a reasonable title', () => {
      expect(checkTitle({ title: 'A perfectly reasonable page title' }).status).to.equal('pass');
    });
    it('fails a too-long title', () => {
      expect(checkTitle({ title: 'x'.repeat(80) }).status).to.equal('fail');
    });
  });

  describe('checkCanon', () => {
    afterEach(() => sinon.restore());

    it('passes (self-referencing) when there is no canonical', async () => {
      const res = await checkCanon(areaWith(''));
      expect(res.status).to.equal('pass');
      expect(res.description).to.contain('self-referencing');
    });
    it('passes when the canonical resolves ok', async () => {
      sinon.stub(window, 'fetch').resolves({ ok: true, status: 200 });
      const res = await checkCanon(areaWith('<link rel="canonical" href="https://example.com/x">'));
      expect(res.status).to.equal('pass');
    });
    it('fails when the canonical errors', async () => {
      sinon.stub(window, 'fetch').resolves({ ok: false, status: 404 });
      expect((await checkCanon(areaWith('<link rel="canonical" href="https://example.com/x">'))).status).to.equal('fail');
    });
    it('fails when the canonical redirects', async () => {
      sinon.stub(window, 'fetch').resolves({ ok: true, status: 301 });
      const res = await checkCanon(areaWith('<link rel="canonical" href="https://example.com/x">'));
      expect(res.status).to.equal('fail');
      expect(res.description).to.contain('redirects');
    });
    it('is limbo when the canonical cannot be crawled', async () => {
      sinon.stub(window, 'fetch').rejects(new Error('blocked'));
      expect((await checkCanon(areaWith('<link rel="canonical" href="https://example.com/x">'))).status).to.equal('limbo');
    });
  });

  describe('checkDescription', () => {
    it('fails when there is no meta description', async () => {
      expect((await checkDescription(areaWith(''))).status).to.equal('fail');
    });
    it('fails a too-short description', async () => {
      expect((await checkDescription(areaWith('<meta name="description" content="short">'))).status).to.equal('fail');
    });
    it('passes a well-sized description', async () => {
      const content = 'A meta description that is comfortably within the recommended length range.';
      expect((await checkDescription(areaWith(`<meta name="description" content="${content}">`))).status).to.equal('pass');
    });
    it('fails a too-long description', async () => {
      const content = 'x'.repeat(200);
      expect((await checkDescription(areaWith(`<meta name="description" content="${content}">`))).status).to.equal('fail');
    });
  });

  describe('checkBody', () => {
    it('passes with enough content', async () => {
      const area = { documentElement: { innerText: 'x'.repeat(150) } };
      expect((await checkBody(area)).status).to.equal('pass');
    });
    it('fails with too little content', async () => {
      const area = { documentElement: { innerText: 'short' } };
      expect((await checkBody(area)).status).to.equal('fail');
    });
  });

  describe('checkLorem', () => {
    const area = (innerHTML) => ({
      documentElement: { innerHTML },
      getElementById: () => null,
    });
    it('fails when lorem ipsum is present', async () => {
      expect((await checkLorem(area('<p>Lorem Ipsum dolor</p>'))).status).to.equal('fail');
    });
    it('passes when lorem ipsum is absent', async () => {
      expect((await checkLorem(area('<p>Real content</p>'))).status).to.equal('pass');
    });
  });

  describe('connectionError', () => {
    it('returns a VPN-specific limbo message', () => {
      const res = connectionError({ isVpnError: true });
      expect(res.status).to.equal('limbo');
      expect(res.description).to.contain('VPN');
    });
    it('returns a generic limbo message', () => {
      expect(connectionError({ isVpnError: false }).description).to.contain('Unable to connect');
    });
  });

  describe('validLinkFilter and checkLinks', () => {
    let lanaBackup;

    beforeEach(() => {
      lanaBackup = window.lana;
      window.lana = { log: sinon.spy() };
      setConfig({ env: { name: 'prod' } });
      sinon.stub(window, 'fetch').callsFake((url, opts = {}) => {
        const u = String(url);
        if (u.includes('/.milo/config.json')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({
              configs: {
                data: [
                  { key: 'prod.preflight.ignoreDomains', value: 'news.adobe.com' },
                  { key: 'prod.spidy.url', value: 'https://spidy.test' },
                ],
              },
            }),
          });
        }
        if (u.includes('/api/url-http-status')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ data: [{ url: 'https://example.com/broken', status: 404 }] }),
          });
        }
        if (opts.method === 'HEAD' || u === 'https://spidy.test') {
          return Promise.resolve({ ok: true, status: 200 });
        }
        return Promise.reject(new Error(`unexpected fetch ${u}`));
      });
    });

    afterEach(() => {
      sinon.restore();
      window.lana = lanaBackup;
    });

    it('filters out tel/mailto/anchor/ignored-domain links and rewrites page->live', async () => {
      const area = areaWith(`
        <a href="https://example.com/ok">ok</a>
        <a href="tel:123">tel</a>
        <a href="mailto:x@y.z">mail</a>
        <a href="https://news.adobe.com/x">ignored</a>
        <a href="https://main--milo--adobecom.hlx.page/p">hlx</a>
      `);
      const links = await validLinkFilter(area);
      const hrefs = links.map((l) => l.href);
      expect(hrefs).to.include('https://example.com/ok');
      expect(hrefs.some((h) => h.startsWith('tel:'))).to.be.false;
      expect(hrefs.some((h) => h.startsWith('mailto:'))).to.be.false;
      // Compare the parsed hostname, not a URL substring (CodeQL: incomplete URL
      // substring sanitization — a substring can match arbitrary hosts).
      expect(links.some((l) => l.hostname === 'news.adobe.com')).to.be.false;
      const hlx = links.find((l) => l.hostname.endsWith('hlx.page'));
      expect(hlx.liveHref).to.contain('hlx.live');
    });

    it('reports broken links from the spidy service', async () => {
      const area = areaWith('<a href="https://example.com/broken">broken</a>');
      const res = await checkLinks({ area });
      expect(res.status).to.equal('fail');
      expect(res.details.badLinks).to.have.lengthOf(1);
      expect(area.querySelector('a').classList.contains('problem-link')).to.be.true;
    });
  });
});
