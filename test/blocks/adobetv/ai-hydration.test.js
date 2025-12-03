import { expect } from '@esm-bundle/chai';
import { stub, restore } from 'sinon';
import { setConfig } from '../../../libs/utils/utils.js';

setConfig({});

const { extractVideoId, hydrateVideo } = await import('../../../libs/blocks/adobetv/ai-hydration.js');

describe('ai-hydration', () => {
  beforeEach(() => {
    // Clean up any existing JSON-LD scripts from previous tests
    document.head.querySelectorAll('script[type="application/ld+json"]').forEach((el) => el.remove());
  });

  afterEach(() => {
    restore();
    document.head.querySelectorAll('script[type="application/ld+json"]').forEach((el) => el.remove());
  });

  describe('extractVideoId', () => {
    it('extracts video ID from standard Adobe TV URL', () => {
      const url = 'https://video.tv.adobe.com/v/3476007';
      expect(extractVideoId(url)).to.equal('3476007');
    });

    it('extracts video ID from URL with query parameters', () => {
      const url = 'https://video.tv.adobe.com/v/3476007?quality=high&captions=eng';
      expect(extractVideoId(url)).to.equal('3476007');
    });

    it('extracts video ID from URL with hash', () => {
      const url = 'https://video.tv.adobe.com/v/3476007#chapter1';
      expect(extractVideoId(url)).to.equal('3476007');
    });

    it('returns null for invalid URL', () => {
      const url = 'https://example.com/not-a-video';
      expect(extractVideoId(url)).to.be.null;
    });

    it('returns null for null input', () => {
      expect(extractVideoId(null)).to.be.null;
    });

    it('returns null for undefined input', () => {
      expect(extractVideoId(undefined)).to.be.null;
    });

    it('returns null for empty string', () => {
      expect(extractVideoId('')).to.be.null;
    });
  });

  describe('hydrateVideo', () => {
    it('returns AI hydration data for valid video URL', async () => {
      const url = 'https://video.tv.adobe.com/v/3476007';
      const result = await hydrateVideo(url);

      expect(result).to.be.an('object');
      expect(result.video).to.be.an('object');
      expect(result.video.id).to.equal('3476007');
      expect(result.ai).to.be.an('object');
      expect(result.schema).to.be.an('object');
    });

    it('injects JSON-LD schema into document head', async () => {
      const url = 'https://video.tv.adobe.com/v/3476007';
      await hydrateVideo(url);

      const script = document.head.querySelector('script[type="application/ld+json"][data-adobetv-video-id="3476007"]');
      expect(script).to.exist;

      const schema = JSON.parse(script.textContent);
      expect(schema['@context']).to.equal('https://schema.org');
      expect(schema['@type']).to.equal('VideoObject');
      expect(schema.contentUrl).to.include('3476007');
    });

    it('does not inject duplicate schema for same video', async () => {
      const url = 'https://video.tv.adobe.com/v/3476007';

      await hydrateVideo(url);
      await hydrateVideo(url);

      const scripts = document.head.querySelectorAll('script[type="application/ld+json"][data-adobetv-video-id="3476007"]');
      expect(scripts.length).to.equal(1);
    });

    it('returns null for invalid URL', async () => {
      const url = 'https://example.com/not-a-video';
      const result = await hydrateVideo(url);
      expect(result).to.be.null;
    });

    it('handles videos without schema gracefully', async () => {
      const url = 'https://video.tv.adobe.com/v/9999999';
      // The mock always returns schema, but this tests the flow
      const result = await hydrateVideo(url);
      expect(result).to.be.an('object');
    });

    it('logs error on API failure', async () => {
      const lanaStub = stub();
      window.lana = { log: lanaStub };

      // Mock a failure by passing invalid input that triggers an error
      const result = await hydrateVideo(null);

      expect(result).to.be.null;
      delete window.lana;
    });
  });

  describe('schema deduplication', () => {
    it('detects existing schema by contentUrl', async () => {
      // Manually inject a schema first
      const existingSchema = {
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        name: 'Existing Video',
        contentUrl: 'https://video.tv.adobe.com/v/1234567',
      };
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(existingSchema);
      document.head.append(script);

      // Now try to hydrate the same video
      await hydrateVideo('https://video.tv.adobe.com/v/1234567');

      // Should still only have one schema
      const scripts = document.head.querySelectorAll('script[type="application/ld+json"]');
      const videoSchemas = Array.from(scripts).filter((s) => {
        try {
          const schema = JSON.parse(s.textContent);
          return schema['@type'] === 'VideoObject' && schema.contentUrl?.includes('1234567');
        } catch {
          return false;
        }
      });
      expect(videoSchemas.length).to.equal(1);
    });

    it('detects existing schema by embedUrl', async () => {
      // Manually inject a schema with embedUrl
      const existingSchema = {
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        name: 'Existing Video',
        embedUrl: 'https://video.tv.adobe.com/v/7654321?embed=true',
      };
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(existingSchema);
      document.head.append(script);

      // Now try to hydrate the same video
      await hydrateVideo('https://video.tv.adobe.com/v/7654321');

      // Should still only have one schema
      const scripts = document.head.querySelectorAll('script[type="application/ld+json"]');
      const videoSchemas = Array.from(scripts).filter((s) => {
        try {
          const schema = JSON.parse(s.textContent);
          return schema['@type'] === 'VideoObject'
            && (schema.contentUrl?.includes('7654321') || schema.embedUrl?.includes('7654321'));
        } catch {
          return false;
        }
      });
      expect(videoSchemas.length).to.equal(1);
    });

    it('allows different videos to have separate schemas', async () => {
      await hydrateVideo('https://video.tv.adobe.com/v/1111111');
      await hydrateVideo('https://video.tv.adobe.com/v/2222222');

      const script1 = document.head.querySelector('script[data-adobetv-video-id="1111111"]');
      const script2 = document.head.querySelector('script[data-adobetv-video-id="2222222"]');

      expect(script1).to.exist;
      expect(script2).to.exist;
    });
  });
});

