/* eslint-disable import/no-named-as-default-member */
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { html, render } from '../../../../libs/deps/htm-preact.js';
import General, { runGeneralChecks } from '../../../../libs/blocks/preflight/panels/general.js';
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
  });
});
