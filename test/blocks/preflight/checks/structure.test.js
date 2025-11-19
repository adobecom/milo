import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import preflightApi from '../../../../libs/blocks/preflight/checks/preflightApi.js';
import { STATUS, SEVERITY } from '../../../../libs/blocks/preflight/checks/constants.js';

const { runChecks } = preflightApi.structure;

describe('Preflight Structure Checks', () => {
  let mockDocument;
  let mockHeader;
  let mockFooter;

  beforeEach(() => {
    mockHeader = {
      classList: { contains: sinon.stub().returns(true) },
      dataset: { blockStatus: 'loaded' },
      querySelectorAll: sinon.stub().returns([{ textContent: 'nav item' }]),
      textContent: 'Navigation content',
    };

    mockFooter = {
      classList: { contains: sinon.stub().returns(true) },
      dataset: { blockStatus: 'loaded' },
      querySelectorAll: sinon.stub().returns([{ textContent: 'footer item' }]),
      textContent: 'Footer content',
      querySelector: sinon.stub(),
    };

    mockDocument = {
      querySelector: sinon.stub(),
      querySelectorAll: sinon.stub(),
    };

    // Mock getMetadata function
    global.getMetadata = sinon.stub();
    global.isLocalNav = sinon.stub().returns(false);
  });

  afterEach(() => {
    sinon.restore();
    delete global.getMetadata;
    delete global.isLocalNav;
  });

  describe('Sanity Checks', () => {
    it('preflightApi.structure.runChecks exists', () => {
      expect(runChecks).to.exist;
    });

    it('returns array of structure check results', () => {
      const results = runChecks({ area: mockDocument });
      expect(results).to.be.an('array');
      expect(results).to.have.length(5); // nav, footer, regionSelector, georouting, breadcrumbs
    });
  });

  describe('Navigation Check', () => {
    it('returns EMPTY status when header is disabled via metadata', () => {
      global.getMetadata.withArgs('header').returns('off');
      mockDocument.querySelector.withArgs('header').returns(null);

      const results = runChecks({ area: mockDocument });
      const navResult = results[0];

      expect(navResult.id).to.equal('navigation');
      expect(navResult.status).to.equal(STATUS.EMPTY);
      expect(navResult.severity).to.equal(SEVERITY.CRITICAL);
      expect(navResult.description).to.include('Navigation is off via metadata');
    });

    it('returns FAIL status when header is enabled but element not found', () => {
      global.getMetadata.withArgs('header').returns('on');
      mockDocument.querySelector.withArgs('header').returns(null);

      const results = runChecks({ area: mockDocument });
      const navResult = results[0];

      expect(navResult.status).to.equal(STATUS.FAIL);
      expect(navResult.severity).to.equal(SEVERITY.CRITICAL);
      expect(navResult.description).to.include('Header element not found');
    });

    it('returns LIMBO status when header is enabled but not loaded', () => {
      global.getMetadata.withArgs('header').returns('on');
      mockHeader.classList.contains.returns(false);
      mockHeader.dataset.blockStatus = 'loading';
      mockDocument.querySelector.withArgs('header').returns(mockHeader);

      const results = runChecks({ area: mockDocument });
      const navResult = results[0];

      expect(navResult.status).to.equal(STATUS.LIMBO);
      expect(navResult.severity).to.equal(SEVERITY.CRITICAL);
      expect(navResult.description).to.include('Navigation enabled but not loaded yet');
    });

    it('returns PASS status when header is properly loaded', () => {
      global.getMetadata.withArgs('header').returns('on');
      mockDocument.querySelector.withArgs('header').returns(mockHeader);

      const results = runChecks({ area: mockDocument });
      const navResult = results[0];

      expect(navResult.status).to.equal(STATUS.PASS);
      expect(navResult.severity).to.equal(SEVERITY.CRITICAL);
      expect(navResult.description).to.include('Navigation loaded');
    });
  });

  describe('Footer Check', () => {
    it('returns EMPTY status when footer is disabled via metadata', () => {
      global.getMetadata.withArgs('footer').returns('off');
      mockDocument.querySelector.withArgs('footer').returns(null);

      const results = runChecks({ area: mockDocument });
      const footerResult = results[1];

      expect(footerResult.status).to.equal(STATUS.EMPTY);
      expect(footerResult.severity).to.equal(SEVERITY.CRITICAL);
      expect(footerResult.description).to.include('Footer is off via metadata');
    });

    it('returns FAIL status when footer is enabled but not rendering', () => {
      global.getMetadata.withArgs('footer').returns('on');
      mockDocument.querySelector.withArgs('footer').returns(null);

      const results = runChecks({ area: mockDocument });
      const footerResult = results[1];

      expect(footerResult.status).to.equal(STATUS.FAIL);
      expect(footerResult.severity).to.equal(SEVERITY.CRITICAL);
      expect(footerResult.description).to.include('Footer element not found');
    });
  });

  describe('Region Selector Check', () => {
    it('returns EMPTY status when footer is disabled', () => {
      global.getMetadata.withArgs('footer').returns('off');
      mockDocument.querySelector.withArgs('footer').returns(null);

      const results = runChecks({ area: mockDocument });
      const regionResult = results[2];

      expect(regionResult.status).to.equal(STATUS.EMPTY);
      expect(regionResult.severity).to.equal(SEVERITY.CRITICAL);
      expect(regionResult.description).to.include('Region selector is off (footer disabled)');
    });

    it('returns FAIL status when footer is enabled but region selector not available', () => {
      global.getMetadata.withArgs('footer').returns('on');
      mockFooter.querySelector.returns(null); // No region selector found
      mockDocument.querySelector.withArgs('footer').returns(mockFooter);

      const results = runChecks({ area: mockDocument });
      const regionResult = results[2];

      expect(regionResult.status).to.equal(STATUS.FAIL);
      expect(regionResult.severity).to.equal(SEVERITY.CRITICAL);
      expect(regionResult.description).to.include('Region selector is not loaded');
    });
  });

  describe('Georouting Check', () => {
    it('returns EMPTY status and is not critical', () => {
      global.getMetadata.withArgs('georouting').returns('on');

      const results = runChecks({ area: mockDocument });
      const georoutingResult = results[3];

      expect(georoutingResult.status).to.equal(STATUS.EMPTY);
      expect(georoutingResult.severity).to.equal('warning'); // Not critical
      expect(georoutingResult.description).to.include('Georouting is on');
    });
  });

  describe('Breadcrumbs Check', () => {
    it('returns EMPTY status when breadcrumbs are disabled via metadata', () => {
      global.getMetadata.withArgs('breadcrumbs').returns('off');
      mockDocument.querySelector.withArgs('header.has-breadcrumbs').returns(null);

      const results = runChecks({ area: mockDocument });
      const breadcrumbsResult = results[4];

      expect(breadcrumbsResult.status).to.equal(STATUS.EMPTY);
      expect(breadcrumbsResult.severity).to.equal(SEVERITY.CRITICAL);
      expect(breadcrumbsResult.description).to.include('Breadcrumbs are off');
    });

    it('returns FAIL status when breadcrumbs are enabled but not rendered', () => {
      global.getMetadata.withArgs('breadcrumbs').returns('on');
      mockDocument.querySelector.withArgs('header.has-breadcrumbs').returns({ classList: { contains: () => true } });
      mockDocument.querySelector.withArgs('.feds-breadcrumbs').returns(null);

      const results = runChecks({ area: mockDocument });
      const breadcrumbsResult = results[4];

      expect(breadcrumbsResult.status).to.equal(STATUS.FAIL);
      expect(breadcrumbsResult.severity).to.equal(SEVERITY.CRITICAL);
      expect(breadcrumbsResult.description).to.include('Breadcrumbs enabled but not rendered');
    });
  });
});

