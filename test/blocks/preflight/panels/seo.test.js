import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { html, render } from '../../../../libs/deps/htm-preact.js';
import SEO, { sendResults } from '../../../../libs/blocks/preflight/panels/seo.js';

const waitFor = async (fn, tries = 80) => {
  for (let i = 0; i < tries; i += 1) {
    if (fn()) return;
    // eslint-disable-next-line no-await-in-loop
    await new Promise((r) => { setTimeout(r, 15); });
  }
  throw new Error('waitFor timed out');
};

describe('preflight panels seo', () => {
  let robotsMeta;

  beforeEach(() => {
    robotsMeta = document.createElement('meta');
    robotsMeta.setAttribute('name', 'robots');
    robotsMeta.setAttribute('content', 'noindex, nofollow');
    document.head.append(robotsMeta);
  });

  afterEach(() => {
    robotsMeta.remove();
    sinon.restore();
  });

  describe('sendResults', () => {
    it('posts the SEO summary payload to the preflight endpoint', async () => {
      const fetchStub = sinon.stub(window, 'fetch').resolves({ ok: true });
      await sendResults();
      expect(fetchStub.calledOnce).to.be.true;
      const [url, opts] = fetchStub.firstCall.args;
      expect(url).to.contain('/seo/preflight');
      expect(opts.method).to.equal('POST');
      const { data } = JSON.parse(opts.body);
      expect(data.url).to.equal(window.location.href);
      expect(data.robots).to.equal('noindex, nofollow');
      expect(data.https).to.be.oneOf(['HTTPS', 'HTTP']);
    });

    it("defaults robots to 'all' when the meta content is empty", async () => {
      robotsMeta.setAttribute('content', '');
      const fetchStub = sinon.stub(window, 'fetch').resolves({ ok: true });
      await sendResults();
      const { data } = JSON.parse(fetchStub.firstCall.args[1].body);
      expect(data.robots).to.equal('all');
    });
  });

  describe('SEO component', () => {
    let container;

    beforeEach(() => {
      container = document.createElement('div');
      document.body.append(container);
      // Exclude the current URL so getResults() bails before the heavy checks,
      // and make the suite resolve to the non-ASO (OG) path.
      sinon.stub(window, 'fetch').callsFake((url) => {
        const u = String(url);
        if (u.includes('preflight-exclusions')) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve({ data: [{ path: '**' }] }) });
        }
        if (u.includes('preflight-config.json')) {
          return Promise.resolve({ json: () => Promise.resolve({ data: [] }) });
        }
        return Promise.reject(new Error(`unexpected fetch ${u}`));
      });
    });

    afterEach(() => { render(null, container); container.remove(); });

    it('renders the seven default SEO check items', async () => {
      render(html`<${SEO} />`, container);
      await waitFor(() => container.querySelectorAll('.preflight-item').length >= 7);
      const titles = [...container.querySelectorAll('.preflight-item-title')].map((p) => p.textContent);
      expect(titles).to.include('Title size');
      expect(titles).to.include('H1 count');
      expect(titles).to.include('Canonical');
      expect(container.querySelectorAll('.preflight-item')).to.have.lengthOf(7);
    });
  });
});
