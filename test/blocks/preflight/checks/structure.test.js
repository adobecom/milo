/* eslint-disable import/no-named-as-default-member */
import { expect } from '@esm-bundle/chai';
import { setConfig } from '../../../../libs/utils/utils.js';
import structure from '../../../../libs/blocks/preflight/checks/structure.js';

const {
  checkNav, checkFooter, checkRegionSelector, checkGeorouting, checkBreadcrumbs, runChecks,
} = structure;

describe('preflight checks structure', () => {
  let container;
  const metas = [];

  const setMeta = (name, content) => {
    const m = document.createElement('meta');
    m.setAttribute('name', name);
    m.setAttribute('content', content);
    document.head.append(m);
    metas.push(m);
  };
  const body = (html) => { container.innerHTML = html; };

  beforeEach(() => {
    setConfig({ georouting: { enabled: 'off' } });
    container = document.createElement('div');
    document.body.append(container);
  });

  afterEach(() => {
    container.remove();
    while (metas.length) metas.pop().remove();
  });

  describe('checkNav', () => {
    it('is EMPTY when navigation is off via metadata', () => {
      setMeta('header', 'off');
      expect(checkNav(document).status).to.equal('empty');
    });

    it('FAILs when the header element is missing', () => {
      const res = checkNav(document);
      expect(res.status).to.equal('fail');
      expect(res.description).to.contain('Header element not found');
    });

    it('is LIMBO when enabled but not yet loaded', () => {
      body('<header><span>x</span></header>');
      expect(checkNav(document).status).to.equal('limbo');
    });

    it('FAILs when loaded but empty', () => {
      body('<header class="ready"></header>');
      expect(checkNav(document).status).to.equal('fail');
    });

    it('FAILs when loaded but has unresolved fragment links', () => {
      body('<header class="ready"><a href="/fragments/nav">nav</a></header>');
      const res = checkNav(document);
      expect(res.status).to.equal('fail');
      expect(res.details.unresolvedFragments).to.equal(1);
    });

    it('PASSes when loaded with content', () => {
      body('<header class="ready"><nav><a href="/home">Home</a></nav></header>');
      const res = checkNav(document);
      expect(res.status).to.equal('pass');
      expect(res.details.type).to.equal('globalnav');
    });

    it('reports loaded via data-block-status', () => {
      body('<header data-block-status="loaded"><nav><a>Home</a></nav></header>');
      expect(checkNav(document).status).to.equal('pass');
    });
  });

  describe('checkFooter', () => {
    it('is EMPTY when footer is off', () => {
      setMeta('footer', 'off');
      expect(checkFooter(document).status).to.equal('empty');
    });

    it('FAILs when the footer element is missing', () => {
      expect(checkFooter(document).description).to.contain('Footer element not found');
    });

    it('is LIMBO when enabled but not loaded', () => {
      body('<footer><span>x</span></footer>');
      expect(checkFooter(document).status).to.equal('limbo');
    });

    it('PASSes when loaded with content', () => {
      body('<footer class="ready"><div>Adobe</div></footer>');
      expect(checkFooter(document).status).to.equal('pass');
    });
  });

  describe('checkRegionSelector', () => {
    it('is EMPTY when the footer is off', () => {
      setMeta('footer', 'off');
      expect(checkRegionSelector(document).status).to.equal('empty');
    });

    it('FAILs when footer is enabled but missing', () => {
      expect(checkRegionSelector(document).status).to.equal('fail');
    });

    it('PASSes when a modal-configured region anchor exists', () => {
      body('<footer class="ready"><div class="region-selector"><a data-modal-path="/regions">Change region</a></div></footer>');
      expect(checkRegionSelector(document).status).to.equal('pass');
    });

    it('FAILs when the region selector is not loaded', () => {
      body('<footer class="ready"><div class="region-selector"></div></footer>');
      expect(checkRegionSelector(document).status).to.equal('fail');
    });
  });

  describe('checkGeorouting', () => {
    it('is EMPTY when georouting is off in config', () => {
      setConfig({ georouting: { enabled: 'off' } });
      expect(checkGeorouting(document).status).to.equal('empty');
    });

    it('PASSes when georouting is on', () => {
      setConfig({ georouting: { enabled: 'on' } });
      const res = checkGeorouting(document);
      expect(res.status).to.equal('pass');
      expect(res.description).to.contain('on');
    });

    it('is EMPTY when metadata turns georouting off', () => {
      setConfig({ georouting: { enabled: 'on' } });
      setMeta('georouting', 'off');
      expect(checkGeorouting(document).status).to.equal('empty');
    });
  });

  describe('checkBreadcrumbs', () => {
    it('is EMPTY when breadcrumbs are not enabled', () => {
      expect(checkBreadcrumbs(document).status).to.equal('empty');
    });

    it('FAILs when enabled but not rendered', () => {
      body('<header class="has-breadcrumbs"></header>');
      expect(checkBreadcrumbs(document).status).to.equal('fail');
    });

    it('PASSes when breadcrumbs are rendered with items', () => {
      body('<header class="has-breadcrumbs"></header><nav class="feds-breadcrumbs"><ul><li>Home</li></ul></nav>');
      expect(checkBreadcrumbs(document).status).to.equal('pass');
    });

    it('FAILs when rendered but empty', () => {
      body('<header class="has-breadcrumbs"></header><nav class="feds-breadcrumbs"></nav>');
      expect(checkBreadcrumbs(document).status).to.equal('fail');
    });
  });

  describe('runChecks', () => {
    it('returns all five structure checks', () => {
      const ids = runChecks({ area: document }).map((r) => r.id);
      expect(ids).to.deep.equal(['navigation', 'footer', 'region-selector', 'georouting', 'breadcrumbs']);
    });
  });
});
