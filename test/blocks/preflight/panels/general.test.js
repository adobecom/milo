/* eslint-disable import/no-named-as-default-member */
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { html, render } from '../../../../libs/deps/htm-preact.js';
import General, { runGeneralChecks, getStatus } from '../../../../libs/blocks/preflight/panels/general.js';
import { setConfig } from '../../../../libs/utils/utils.js';

const waitFor = async (fn, tries = 80) => {
  for (let i = 0; i < tries; i += 1) {
    if (fn()) return;
    // eslint-disable-next-line no-await-in-loop
    await new Promise((r) => { setTimeout(r, 15); });
  }
  throw new Error('waitFor timed out');
};

describe('preflight panels general', () => {
  describe('runGeneralChecks', () => {
    let main;
    let header;

    beforeEach(() => {
      main = document.createElement('main');
      main.innerHTML = `
        <div class="fragment" data-path="/frag/one">frag</div>
        <a data-modal-path="/modal/two" data-modal-hash="#open">modal</a>
        <div data-path="/libs/excluded">excluded</div>
        <a href="/internal-link">internal</a>
        <img src="/pic.svg" alt="svg">
      `;
      header = document.createElement('header');
      header.innerHTML = '<a href="/nav-link">nav</a>';
      document.body.append(main, header);
    });

    afterEach(() => { main.remove(); header.remove(); });

    it('always includes the current page as a single item', () => {
      const content = runGeneralChecks();
      expect(content.page.items).to.have.lengthOf(1);
      expect(content.page.items[0].url.pathname).to.equal(window.location.pathname);
    });

    it('collects fragment/modal links and excludes /libs/ paths', () => {
      const paths = runGeneralChecks().fragments.items.map((i) => i.url.pathname);
      expect(paths).to.include('/frag/one');
      expect(paths).to.include('/modal/two');
      expect(paths).to.not.include('/libs/excluded');
    });

    it('marks the nav group closed by default', () => {
      expect(runGeneralChecks().nav.closed).to.be.true;
    });

    it('collects internal links, svgs and nav links into their groups', () => {
      const content = runGeneralChecks();
      expect(content.links.items.map((i) => i.url.pathname)).to.include('/internal-link');
      expect(content.svgs.items.map((i) => i.url.pathname)).to.include('/pic.svg');
      expect(content.nav.items.map((i) => i.url.pathname)).to.include('/nav-link');
    });
  });

  describe('General component', () => {
    let container;

    beforeEach(() => {
      setConfig({ georouting: { enabled: 'off' } });
      container = document.createElement('div');
      document.body.append(container);
      sinon.stub(window, 'fetch').resolves({ ok: true, status: 200, json: () => Promise.resolve({}) });
    });

    afterEach(() => { render(null, container); container.remove(); sinon.restore(); });

    it('renders the Structure, Localization and Content sections', async () => {
      render(html`<${General} />`, container);
      await waitFor(() => container.querySelectorAll('.preflight-item').length > 0);
      const headings = [...container.querySelectorAll('.preflight-structure-title')].map((p) => p.textContent);
      expect(headings).to.include('Structure');
      expect(headings).to.include('Localization');
      expect(headings).to.include('Content');
      const itemTitles = [...container.querySelectorAll('.preflight-item-title')].map((p) => p.textContent);
      expect(itemTitles).to.include('Navigation');
    });

    it('selects all items and exposes the Preview action', async () => {
      render(html`<${General} />`, container);
      await waitFor(() => container.querySelector('#select-action button'));
      container.querySelector('#select-action button').click();
      await waitFor(() => container.querySelector('#preview-action'));
      container.querySelector('#preview-action button').click();
      // handleAction fires a POST for the checked page item.
      await waitFor(() => window.fetch.getCalls().some((c) => c.args[1]?.method === 'POST'));
      expect(window.fetch.getCalls().some((c) => c.args[1]?.method === 'POST')).to.be.true;
    });

    it('collapses a content group when its heading is clicked', async () => {
      render(html`<${General} />`, container);
      await waitFor(() => container.querySelector('.preflight-group-heading'));
      const heading = container.querySelector('.preflight-group-heading');
      const group = heading.closest('.preflight-content-group');
      const wasClosed = group.classList.contains('is-closed');
      heading.click();
      await waitFor(() => group.classList.contains('is-closed') !== wasClosed);
      expect(group.classList.contains('is-closed')).to.equal(!wasClosed);
    });
  });

  describe('getStatus', () => {
    afterEach(() => sinon.restore());

    const stubAdmin = (statusJson, ok = true) => {
      sinon.stub(window, 'fetch').callsFake((url) => {
        if (String(url).includes('publish-permissions-config')) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
        }
        return Promise.resolve({ ok, json: () => Promise.resolve(statusJson) });
      });
    };

    it('returns Non AEM EDS Content for non-edge-delivery hosts', async () => {
      const res = await getStatus(new URL('https://example.com/some/page'));
      expect(res.preview).to.equal('Non AEM EDS Content');
      expect(res.live).to.equal('Non AEM EDS Content');
      expect(res.edit).to.be.null;
    });

    it('maps preview/live/edit from the admin status response', async () => {
      stubAdmin({
        preview: { lastModified: '2024-01-01' },
        live: { lastModified: '2024-02-01' },
        edit: { url: 'https://sharepoint/edit' },
      });
      const res = await getStatus(new URL('https://main--milo--adobecom.aem.page/foo'));
      expect(res.preview).to.equal('2024-01-01');
      expect(res.live).to.equal('2024-02-01');
      expect(res.edit).to.equal('https://sharepoint/edit');
      expect(res.publish).to.have.property('canPublish');
    });

    it('derives a da.live edit link from the source location', async () => {
      stubAdmin({
        preview: { lastModified: '2024-01-01', sourceLocation: 'markup:https://content.da.live/org/repo/foo' },
        live: {},
      });
      const res = await getStatus(new URL('https://main--milo--adobecom.aem.page/foo'));
      expect(res.edit).to.equal('https://da.live/edit#/org/repo/foo');
      expect(res.live).to.equal('Never');
    });

    it('returns an empty object when the admin call is not ok', async () => {
      stubAdmin({}, false);
      const res = await getStatus(new URL('https://main--milo--adobecom.aem.page/foo'));
      expect(res).to.deep.equal({});
    });

    it('resolves cross-repo /federal/ paths against the federal repo', async () => {
      const captured = [];
      sinon.stub(window, 'fetch').callsFake((url) => {
        captured.push(String(url));
        if (String(url).includes('publish-permissions-config')) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
        }
        const body = { preview: {}, live: {} };
        return Promise.resolve({ ok: true, json: () => Promise.resolve(body) });
      });
      await getStatus(new URL('https://main--milo--adobecom.aem.page/federal/x'));
      expect(captured.some((u) => u.includes('/adobecom/federal/main/federal/x'))).to.be.true;
    });
  });
});
