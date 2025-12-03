import { expect } from '@esm-bundle/chai';
import { stub, restore } from 'sinon';
import { setConfig } from '../../../libs/utils/utils.js';

setConfig({});

const { extractVideoId, hydrateVideo } = await import('../../../libs/blocks/adobetv/ai-hydration.js');

// Mock API response factory (matches real API response structure)
const createMockResponse = (videoId) => ({
  video: {
    id: videoId,
    title: 'Test Video Title',
    description: 'Test video description',
    url: `https://images-tv.adobe.com/test/${videoId}.mp4`,
    thumbnail: 'https://images-tv.adobe.com/test/thumbnail.jpg',
    duration: '5:34',
    durationSeconds: 334,
    uploadDate: '2024-11-20T10:00:00Z',
    language: 'en',
  },
  ai: {
    summary: 'Test summary',
    titles: {
      descriptive: { title: 'Descriptive Title', reasoning: 'test', variant: 1 },
      engaging: { title: 'Engaging Title', reasoning: 'test', variant: 2 },
      seo: { title: 'SEO Title', reasoning: 'test', variant: 3 },
    },
    chapters: [
      { title: 'Chapter 1', time: 0, seconds: 0, description: null },
    ],
    seoKeywords: ['test', 'video'],
    transcript: 'Test transcript content',
  },
  schema: {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: 'Test Video Title',
    description: 'Test video description',
    thumbnailUrl: 'https://images-tv.adobe.com/test/thumbnail.jpg',
    uploadDate: '2024-11-20T10:30:00Z',
    duration: 'PT5M34S',
    contentUrl: `https://images-tv.adobe.com/test/${videoId}.mp4`,
    embedUrl: `https://publish.tv.adobe.com/bucket/10/category/1116/video/${videoId}`,
  },
});

describe('ai-hydration', () => {
  let fetchStub;

  beforeEach(() => {
    // Clean up any existing JSON-LD scripts from previous tests
    document.head.querySelectorAll('script[type="application/ld+json"]').forEach((el) => el.remove());

    // Stub fetch to return mock API responses
    fetchStub = stub(window, 'fetch');
    fetchStub.callsFake((url) => {
      const urlObj = new URL(url);
      const videoId = urlObj.searchParams.get('videoId');
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(createMockResponse(videoId)),
      });
    });
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

    it('calls API with correct video ID', async () => {
      const url = 'https://video.tv.adobe.com/v/3476007';
      await hydrateVideo(url);

      expect(fetchStub.calledOnce).to.be.true;
      const fetchUrl = fetchStub.firstCall.args[0];
      expect(fetchUrl).to.include('videoId=3476007');
    });

    it('injects JSON-LD schema into document head', async () => {
      const url = 'https://video.tv.adobe.com/v/3476007';
      await hydrateVideo(url);

      const script = document.head.querySelector('script[type="application/ld+json"][data-adobetv-video-id="3476007"]');
      expect(script).to.exist;

      const schema = JSON.parse(script.textContent);
      expect(schema['@context']).to.equal('https://schema.org');
      expect(schema['@type']).to.equal('VideoObject');
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

    it('handles API errors gracefully', async () => {
      fetchStub.restore();
      fetchStub = stub(window, 'fetch').rejects(new Error('Network error'));

      const lanaStub = stub();
      window.lana = { log: lanaStub };

      const url = 'https://video.tv.adobe.com/v/3476007';
      const result = await hydrateVideo(url);

      expect(result).to.be.null;
      expect(lanaStub.calledOnce).to.be.true;
      expect(lanaStub.firstCall.args[0]).to.include('AI Hydration failed');

      delete window.lana;
    });

    it('handles non-ok API responses', async () => {
      fetchStub.restore();
      fetchStub = stub(window, 'fetch').resolves({
        ok: false,
        status: 404,
      });

      const lanaStub = stub();
      window.lana = { log: lanaStub };

      const url = 'https://video.tv.adobe.com/v/3476007';
      const result = await hydrateVideo(url);

      expect(result).to.be.null;
      expect(lanaStub.calledOnce).to.be.true;

      delete window.lana;
    });

    it('handles response without schema', async () => {
      fetchStub.restore();
      fetchStub = stub(window, 'fetch').resolves({
        ok: true,
        json: () => Promise.resolve({
          video: { id: '3476007' },
          ai: { summary: 'Test' },
          // No schema property
        }),
      });

      const url = 'https://video.tv.adobe.com/v/3476007';
      const result = await hydrateVideo(url);

      expect(result).to.be.an('object');
      const script = document.head.querySelector('script[data-adobetv-video-id="3476007"]');
      expect(script).to.be.null; // No schema injected
    });
  });

  describe('schema deduplication', () => {
    it('detects existing schema by data attribute', async () => {
      // Inject a schema with our data attribute first
      const existingSchema = {
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        name: 'Existing Video',
      };
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-adobetv-video-id', '1234567');
      script.textContent = JSON.stringify(existingSchema);
      document.head.append(script);

      // Now try to hydrate the same video
      await hydrateVideo('https://video.tv.adobe.com/v/1234567');

      // Should still only have one schema
      const scripts = document.head.querySelectorAll('script[data-adobetv-video-id="1234567"]');
      expect(scripts.length).to.equal(1);
    });

    it('detects existing schema by contentUrl with /v/ pattern', async () => {
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

      // Should still only have one schema (the original one, no new one injected)
      const scripts = document.head.querySelectorAll('script[type="application/ld+json"]');
      const videoSchemas = Array.from(scripts).filter((s) => {
        try {
          const parsedSchema = JSON.parse(s.textContent);
          return parsedSchema['@type'] === 'VideoObject';
        } catch {
          return false;
        }
      });
      expect(videoSchemas.length).to.equal(1);
    });

    it('detects existing schema by embedUrl with /video/ pattern', async () => {
      // Manually inject a schema with embedUrl (real API format)
      const existingSchema = {
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        name: 'Existing Video',
        embedUrl: 'https://publish.tv.adobe.com/bucket/10/category/1116/video/7654321',
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
          const parsedSchema = JSON.parse(s.textContent);
          return parsedSchema['@type'] === 'VideoObject';
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
