import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { checkImageDimensions, isViewportTooSmall, runChecks } from '../../../../libs/blocks/preflight/checks/assets.js';
import { STATUS } from '../../../../libs/blocks/preflight/checks/constants.js';

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

  describe('isViewportTooSmall', () => {
    it('checks viewport size correctly and uses mockImport when available', () => {
      mockMatchMedia.returns({ matches: false });
      expect(isViewportTooSmall()).to.be.true;
      mockMatchMedia.returns({ matches: true });
      expect(isViewportTooSmall()).to.be.false;

      window.mockImport = true;
      window.isViewportTooSmall = sinon.stub().returns(true);
      expect(isViewportTooSmall()).to.be.true;
      expect(window.isViewportTooSmall.calledOnce).to.be.true;
    });
  });

  describe('checkImageDimensions', () => {
    it('handles empty states and basic dimension checks', async () => {
      mockMatchMedia.returns({ matches: false });
      const smallViewportResult = await checkImageDimensions('test-url-1', mockDocument);
      expect(smallViewportResult.status).to.equal(STATUS.EMPTY);
      expect(smallViewportResult.description).to.include('Viewport is too small');

      mockMatchMedia.returns({ matches: true });
      mockDocument.querySelectorAll.withArgs('main picture img').returns([]);
      const noImagesResult = await checkImageDimensions('test-url-2', mockDocument);
      expect(noImagesResult.status).to.equal(STATUS.EMPTY);
      expect(noImagesResult.description).to.include('No images found');

      mockDocument.querySelectorAll.withArgs('main picture img').returns([mockImage]);
      mockImage.getAttribute.withArgs('width').returns('2000');
      mockImage.getAttribute.withArgs('height').returns('1000');
      mockImage.getAttribute.withArgs('src').returns('test.jpg');
      window.createTag = () => ({ append: sinon.stub() });

      const correctDimensionsResult = await checkImageDimensions('test-url-3', mockDocument);
      expect(correctDimensionsResult.status).to.equal(STATUS.PASS);
      expect(correctDimensionsResult.details.imagesWithMatch).to.have.lengthOf(1);
      expect(correctDimensionsResult.details.imagesWithMismatch).to.have.lengthOf(0);
    });

    it('handles various image edge cases', async () => {
      window.createTag = () => ({ append: sinon.stub() });

      mockImage.offsetWidth = 1200;
      mockDocument.documentElement.clientWidth = 1200;
      mockImage.getAttribute.withArgs('width').returns('3000');
      mockImage.getAttribute.withArgs('height').returns('1500');
      mockImage.getAttribute.withArgs('src').returns('test.jpg');
      const fullWidthResult = await checkImageDimensions('test-url-fullwidth', mockDocument);
      expect(fullWidthResult.status).to.equal(STATUS.PASS);

      mockImage.checkVisibility = sinon.stub().returns(false);
      const invisibleImageResult = await checkImageDimensions('test-url-invisible', mockDocument);
      expect(invisibleImageResult).to.have.property('status');

      mockImage.checkVisibility = sinon.stub().returns(true);
      mockImage.getAttribute.withArgs('src').returns('test.svg');
      const svgImageResult = await checkImageDimensions('test-url-svg', mockDocument);
      expect(svgImageResult).to.have.property('status');

      mockImage.complete = false;
      mockImage.addEventListener.withArgs('load').callsFake((event, handler) => {
        setTimeout(() => {
          mockImage.complete = true;
          handler();
        }, 10);
      });
      const incompleteImageResult = await checkImageDimensions('test-url-incomplete', mockDocument);
      expect(incompleteImageResult).to.have.property('status');
    });

    it('handles different scenarios with mockImport', async () => {
      window.mockImport = true;

      const mockStates = [
        {
          url: 'test-url-fail',
          result: {
            title: 'Image Dimensions',
            status: STATUS.FAIL,
            description: '1 image(s) have dimension mismatches.',
            details: { imagesWithMismatch: [{ src: 'test.jpg' }], imagesWithMatch: [] },
          },
          expectation: (result) => {
            expect(result.status).to.equal(STATUS.FAIL);
            expect(result.details.imagesWithMismatch).to.have.lengthOf(1);
          },
        },
        {
          url: 'test-url-empty',
          result: {
            title: 'Image Dimensions',
            status: STATUS.EMPTY,
            description: 'No eligible images found (visible, non-icon, non-SVG).',
          },
          expectation: (result) => {
            expect(result.status).to.equal(STATUS.EMPTY);
            expect(result.description).to.include('No eligible images found');
          },
        },
        {
          url: 'test-url-natural',
          result: {
            title: 'Image Dimensions',
            status: STATUS.PASS,
            description: 'Using natural dimensions',
            details: {
              imagesWithMatch: [{
                src: 'test.jpg',
                naturalWidth: 2000,
                naturalHeight: 1000,
                naturalDimensions: '2000x1000',
              }],
              imagesWithMismatch: [],
            },
          },
          expectation: (result) => {
            expect(result.details.imagesWithMatch[0].naturalDimensions).to.equal('2000x1000');
          },
        },
        {
          url: 'test-url-dimensions',
          result: {
            title: 'Image Dimensions',
            status: STATUS.PASS,
            description: 'Different recommended dimensions',
            details: {
              imagesWithMatch: [
                {
                  src: 'fullwidth.jpg',
                  isFullWidthImage: true,
                  recommendedDimensions: '2880x1440',
                },
                {
                  src: 'regular.jpg',
                  isFullWidthImage: false,
                  recommendedDimensions: '1600x800',
                },
              ],
              imagesWithMismatch: [],
            },
          },
          expectation: (result) => {
            expect(result.details.imagesWithMatch[0].recommendedDimensions).to.equal('2880x1440');
            expect(result.details.imagesWithMatch[1].recommendedDimensions).to.equal('1600x800');
          },
        },
      ];

      for (const state of mockStates) {
        window.checkImageDimensions = sinon.stub().returns(state.result);
        const result = await checkImageDimensions(state.url, mockDocument);
        state.expectation(result);
      }

      const checkDimStub = sinon.stub();
      checkDimStub.returns({
        title: 'Cached Result',
        status: STATUS.PASS,
        description: 'Testing cache behavior',
        details: { imagesWithMatch: [], imagesWithMismatch: [] },
      });

      window.checkImageDimensions = checkDimStub;

      const firstResult = await checkImageDimensions('test-url-cache', mockDocument);
      const secondResult = await checkImageDimensions('test-url-cache', mockDocument);

      expect(firstResult.title).to.equal(secondResult.title);
      expect(window.checkImageDimensions.called).to.be.true;
    });
  });

  describe('runChecks', () => {
    it('returns, caches, and deduplicates results correctly', async () => {
      const results = runChecks('test-url-basic', mockDocument);
      expect(results).to.be.an('array');
      expect(results).to.have.lengthOf(1);

      mockImage.getAttribute.withArgs('width').returns('2000');
      mockImage.getAttribute.withArgs('height').returns('1000');
      mockImage.getAttribute.withArgs('src').returns('test.jpg');

      const firstResult = await runChecks('test-url-cache', mockDocument)[0];
      expect(firstResult.status).to.equal(STATUS.PASS);

      mockDocument.querySelectorAll.withArgs('main picture img').returns([]);
      const secondResult = await runChecks('test-url-cache', mockDocument)[0];
      expect(secondResult.status).to.equal(STATUS.PASS);

      window.mockImport = true;
      window.runChecks = sinon.stub().returns(['mocked result']);
      const mockedResults = runChecks('test-url-mock', mockDocument);
      expect(window.runChecks.calledOnce).to.be.true;
      expect(mockedResults).to.deep.equal(['mocked result']);

      window.mockImport = true;
      window.checkImageDimensions = sinon.stub().returns({
        title: 'Test Check',
        status: STATUS.PASS,
      });

      const uniqueResults = runChecks('test-url-unique', mockDocument);
      expect(uniqueResults).to.be.an('array');
      const titles = uniqueResults.map((check) => check.title);
      const uniqueTitles = [...new Set(titles)];
      expect(titles.length).to.equal(uniqueTitles.length);
    });
  });
});
