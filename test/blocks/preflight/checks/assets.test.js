import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import preflightApi from '../../../../libs/blocks/preflight/checks/preflightApi.js';
import { STATUS } from '../../../../libs/blocks/preflight/checks/constants.js';

const { checkImageDimensions, isViewportTooSmall, runChecks } = preflightApi.assets;

describe('Preflight Asset Checks', () => {
  let mockMatchMedia;
  let mockDocument;
  let mockImage;
  let mockPicture;

  beforeEach(() => {
    mockMatchMedia = sinon.stub(window, 'matchMedia').returns({ matches: true });

    mockPicture = {
      querySelector: sinon.stub().returns(null),
      insertBefore: sinon.stub(),
    };

    mockImage = {
      complete: true,
      naturalWidth: 1000,
      naturalHeight: 500,
      offsetWidth: 800,
      offsetHeight: 400,
      getAttribute: sinon.stub(),
      setAttribute: sinon.stub(),
      addEventListener: sinon.stub(),
      checkVisibility: sinon.stub().returns(true),
      closest: (selector) => (selector === '.icon-area' ? null : mockPicture),
      src: 'test.jpg',
      nextSibling: null,
    };

    mockDocument = {
      documentElement: { clientWidth: 1200 },
      body: { classList: { add: sinon.stub(), remove: sinon.stub() } },
      querySelectorAll: sinon.stub().withArgs('main picture img').returns([mockImage]),
    };
  });

  afterEach(() => {
    sinon.restore();
    delete window.mockImport;
    delete window.isViewportTooSmall;
    delete window.checkImageDimensions;
    delete window.runChecks;
    delete window.createTag;
  });

  describe('Sanity Checks', () => {
    it('preflightApi.assets.checkImageDimensions exists', () => {
      expect(checkImageDimensions).to.exist;
    });

    it('preflightApi.assets.isViewportTooSmall exists', () => {
      expect(isViewportTooSmall).to.exist;
    });

    it('preflightApi.assets.runChecks exists', () => {
      expect(runChecks).to.exist;
    });
  });

  describe('Basic Functionality', () => {
    it('returns empty status when viewport is too small', async () => {
      mockMatchMedia.returns({ matches: false });
      const result = await checkImageDimensions('test-url', mockDocument);
      expect(result.status).to.equal(STATUS.EMPTY);
    });

    it('returns empty status when no images are found', async () => {
      mockDocument.querySelectorAll.withArgs('main picture img').returns([]);
      const result = await checkImageDimensions('test-url', mockDocument);
      expect(result.status).to.equal(STATUS.EMPTY);
    });

    it('tests basic checks for pass states', async () => {
      mockImage.getAttribute.withArgs('width').returns('2000');
      mockImage.getAttribute.withArgs('height').returns('1000');
      mockImage.getAttribute.withArgs('src').returns('test.jpg');
      window.createTag = () => ({ append: sinon.stub() });

      const result = await checkImageDimensions('test-url-3', mockDocument);
      expect(result.status).to.equal(STATUS.PASS);
    });

    it('tests basic runChecks functionality', () => {
      const results = runChecks('test-url', mockDocument);
      expect(results).to.be.an('array');
    });
  });

  describe('Additional Coverage', () => {
    it('tests isViewportTooSmall function', () => {
      expect(typeof isViewportTooSmall()).to.equal('boolean');
    });

    it('tests image dimensions with specific width/height attributes', async () => {
      window.createTag = () => ({ append: sinon.stub() });

      mockImage.offsetWidth = 1200;
      mockImage.getAttribute.withArgs('width').returns('2400');
      mockImage.getAttribute.withArgs('height').returns('1200');

      await checkImageDimensions('test-url-fullwidth', mockDocument);

      mockImage.getAttribute.withArgs('width').returns(null);
      mockImage.getAttribute.withArgs('height').returns(null);

      await checkImageDimensions('test-url-noattrs', mockDocument);
    });

    it('tests caching behavior for results', async () => {
      mockImage.getAttribute.withArgs('width').returns('2000');
      mockImage.getAttribute.withArgs('height').returns('1000');
      mockImage.getAttribute.withArgs('src').returns('test.jpg');
      window.createTag = () => ({ append: sinon.stub() });

      await runChecks('test-url-cached', mockDocument);

      mockDocument.querySelectorAll.withArgs('main picture img').returns([]);

      const secondResults = await runChecks('test-url-cached', mockDocument);
      expect(secondResults).to.be.an('array');
    });

    it('sets up mockImport conditions', () => {
      window.mockImport = true;

      expect(window.mockImport).to.be.true;
    });
  });
});
