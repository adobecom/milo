import { expect } from '@esm-bundle/chai';
import { readFile } from '@web/test-runner-commands';
import { stub } from 'sinon';
import { setConfig } from '../../../libs/utils/utils.js';

import {
  safeJsonParse,
  getLocalizedValue,
  getScreenSizeCategory,
  extractAspectRatio,
  getItemTypeFromAspectRatio,
  getImageRendition,
  buildAndGetGalleryElements,
  createFireflyURL,
} from '../../../libs/blocks/firefly-gallery/firefly-gallery.js';

const sleep = (ms) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const ogDocument = document.body.innerHTML;
const { default: init } = await import('../../../libs/blocks/firefly-gallery/firefly-gallery.js');

let fetchStub;
class MockIntersectionObserver {
  constructor(callback) {
    this.callback = callback;
    this.elements = [];
  }

  observe(element) {
    this.elements.push(element);
    this.callback([
      {
        isIntersecting: true,
        target: element,
      },
    ], this);
  }

  unobserve(element) {
    this.elements = this.elements.filter((el) => el !== element);
  }
}

const mockFireflyAssets = {
  _embedded: {
    assets: [
      {
        id: 'asset1',
        urn: 'urn:asset:1',
        title: 'Test Image 1',
        custom: {
          input: {
            'firefly#prompts': { 'en-US': 'A beautiful sunset' },
            'firefly#inputModel': JSON.stringify({ aspectRatio: 1.5 }),
          },
        },
        _links: {
          rendition: {
            href: 'https://example.com/rendition/{format}/{dimension}/{size}',
            max_width: 1500,
            max_height: 1000,
          },
        },
        _embedded: {
          owner: {
            display_name: 'Test User',
            _links: {
              images: [
                { width: 24, href: 'https://example.com/avatar.jpg' },
              ],
            },
          },
        },
      },
      {
        id: 'asset2',
        urn: 'urn:asset:2',
        title: 'Test Video 1',
        custom: { input: { 'firefly#prompts': { 'en-US': 'A flowing river' } } },
        _links: {
          rendition: {
            href: 'https://example.com/rendition/{format}/{dimension}/{size}',
            max_width: 1920,
            max_height: 1080,
          },
        },
      },
    ],
  },
};

describe('Firefly Gallery', () => {
  beforeEach(() => {
    window.IntersectionObserver = MockIntersectionObserver;

    fetchStub = stub(window, 'fetch').resolves({
      ok: true,
      json: () => Promise.resolve(mockFireflyAssets),
    });

    setConfig({ locale: { ietf: 'en-US' } });
  });

  afterEach(() => {
    document.body.innerHTML = ogDocument;
    fetchStub.restore();
    delete window.IntersectionObserver;
  });

  describe('Helper Functions', () => {
    it('safeJsonParse should parse valid JSON', () => {
      const result = safeJsonParse('{"test": "value"}');
      expect(result).to.deep.equal({ test: 'value' });
    });

    it('safeJsonParse should return default value for invalid JSON', () => {
      const result = safeJsonParse('invalid json', { default: true });
      expect(result).to.deep.equal({ default: true });
    });

    it('getLocalizedValue should return correct localized value', () => {
      const localizations = {
        'en-US': 'English value',
        'fr-FR': 'French value',
      };

      expect(getLocalizedValue(localizations, 'en-US')).to.equal('English value');
      expect(getLocalizedValue(localizations, 'fr-FR')).to.equal('French value');
      expect(getLocalizedValue(localizations, 'de-DE')).to.equal('English value');
      expect(getLocalizedValue(null, 'en-US', 'default')).to.equal('default');
    });

    it('getScreenSizeCategory should return correct category based on window width', () => {
      const originalInnerWidth = window.innerWidth;
      window.innerWidth = 500;
      expect(getScreenSizeCategory()).to.equal('mobile');

      window.innerWidth = 700;
      expect(getScreenSizeCategory()).to.equal('tablet');

      window.innerWidth = 1000;
      expect(getScreenSizeCategory()).to.equal('desktop');

      window.innerWidth = originalInnerWidth;
    });

    it('extractAspectRatio should correctly extract aspect ratio from asset', () => {
      const asset = {
        _links: {
          rendition: {
            max_width: 1000,
            max_height: 500,
          },
        },
      };

      expect(extractAspectRatio(asset)).to.equal(2);

      const assetWithModel = { custom: { input: { 'firefly#inputModel': JSON.stringify({ aspectRatio: 1.5 }) } } };

      expect(extractAspectRatio(assetWithModel)).to.equal(1.5);
    });

    it('getItemTypeFromAspectRatio should classify aspect ratios correctly', () => {
      expect(getItemTypeFromAspectRatio(0.5)).to.equal('tall');
      expect(getItemTypeFromAspectRatio(0.9)).to.equal('portrait');
      expect(getItemTypeFromAspectRatio(1.1)).to.equal('square');
      expect(getItemTypeFromAspectRatio(1.5)).to.equal('short');
    });

    it('createFireflyURL should generate correct URLs', () => {
      expect(createFireflyURL('urn:asset:123', 'image'))
        .to.equal('https://firefly.adobe.com/open?assetOrigin=community&assetType=ImageGeneration&id=urn:asset:123');

      expect(createFireflyURL('urn:asset:456', 'video'))
        .to.equal('https://firefly.adobe.com/open?assetOrigin=community&assetType=VideoGeneration&id=urn:asset:456');

      expect(createFireflyURL('urn:asset:789', 'image', 'TESTCGENID'))
        .to.equal('https://firefly.adobe.com/open?assetOrigin=community&assetType=ImageGeneration&id=urn:asset:789&promoid=TESTCGENID&mv=other');
    });

    it('getImageRendition should return correct URL with appropriate size', () => {
      const asset = { _links: { rendition: { href: 'https://example.com/{format}/{dimension}/{size}' } } };

      const originalGetScreenSizeCategory = getScreenSizeCategory;
      window.getScreenSizeCategory = () => 'desktop';

      const renditionUrl = getImageRendition(asset, 'short');
      expect(renditionUrl).to.include('300');

      window.getScreenSizeCategory = originalGetScreenSizeCategory;
    });
  });

  describe('Gallery Structure', () => {
    it('buildAndGetGalleryElements should return correct DOM structure', () => {
      const { container, content } = buildAndGetGalleryElements();

      expect(container.classList.contains('firefly-gallery-container')).to.be.true;
      expect(content.classList.contains('firefly-gallery-content')).to.be.true;
      expect(container.querySelector('.firefly-gallery-fade')).to.exist;
    });
  });

  describe('Firefly Gallery Initialization', () => {
    it('should initialize the gallery with proper classes', async () => {
      const galleryEl = document.createElement('div');
      galleryEl.innerHTML = `
        <div><div>ImageGeneration | TESTCGENID</div></div>
        <div><div>Open in Firefly</div></div>
      `;
      document.body.appendChild(galleryEl);

      await init(galleryEl);

      expect(galleryEl.classList.contains('firefly-gallery-block')).to.be.true;
      expect(galleryEl.querySelector('.firefly-gallery-container')).to.exist;
      expect(galleryEl.querySelector('.firefly-gallery-content')).to.exist;
      expect(galleryEl.querySelector('.firefly-gallery-masonry-grid')).to.exist;

      expect(fetchStub.calledOnce).to.be.true;
      const url = fetchStub.firstCall.args[0];
      expect(url).to.include('ImageGeneration');
    });

    it('should handle video assets correctly', async () => {
      const galleryEl = document.createElement('div');
      galleryEl.innerHTML = `
        <div><div>VideoGeneration | TESTVIDCGENID</div></div>
        <div><div>View Video</div></div>
      `;
      document.body.appendChild(galleryEl);

      const videoAsset = {
        // eslint-disable-next-line no-underscore-dangle
        ...mockFireflyAssets._embedded.assets[0],
        assetType: 'video',
      };

      fetchStub.restore();
      fetchStub = stub(window, 'fetch').resolves({
        ok: true,
        json: () => Promise.resolve({ _embedded: { assets: [videoAsset] } }),
      });

      await init(galleryEl);

      // Let the async operations complete
      await sleep(0);

      expect(fetchStub.calledOnce).to.be.true;
      const url = fetchStub.firstCall.args[0];
      expect(url).to.include('VideoGeneration');
    });

    it('should handle touch events and manage focus correctly', async () => {
      const galleryEl = document.createElement('div');
      galleryEl.innerHTML = `
    <div><div>VideoGeneration | TESTCGENID</div></div>
    <div><div>View</div></div>
  `;
      document.body.appendChild(galleryEl);

      await init(galleryEl);

      await sleep(10);

      const overlays = galleryEl.querySelectorAll('.firefly-gallery-overlay');
      if (overlays.length >= 2) {
        const firstOverlay = overlays[0];
        const secondOverlay = overlays[1];

        firstOverlay.focus();
        expect(document.activeElement).to.equal(firstOverlay);

        const touchEvent = new TouchEvent('touchstart', {
          bubbles: true,
          cancelable: true,
          view: window,
        });
        secondOverlay.dispatchEvent(touchEvent);

        expect(document.activeElement).to.not.equal(firstOverlay);
      }
    });

    it('should handle API errors gracefully', async () => {
      const galleryEl = document.createElement('div');
      galleryEl.innerHTML = `
        <div><div>ImageGeneration | TESTERRCGENID</div></div>
        <div><div>View</div></div>
      `;
      document.body.appendChild(galleryEl);

      fetchStub.restore();
      fetchStub = stub(window, 'fetch').rejects(new Error('API Error'));

      await init(galleryEl);

      expect(galleryEl.querySelector('.firefly-gallery-masonry-grid')).to.exist;
    });
  });

  describe('Responsive Behavior', () => {
    it('should handle resize events and update images', async () => {
      const galleryEl = document.createElement('div');
      galleryEl.innerHTML = `
        <div><div>ImageGeneration | TESTRESIZE</div></div>
        <div><div>View</div></div>
      `;
      document.body.appendChild(galleryEl);

      await init(galleryEl);
      await sleep(10);

      const resizeEvent = new Event('resize');
      window.dispatchEvent(resizeEvent);

      await sleep(300);

      expect(galleryEl.querySelector('.firefly-gallery-masonry-grid')).to.exist;
    });
  });
});
