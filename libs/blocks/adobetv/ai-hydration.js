import { createTag } from '../../utils/utils.js';

// Mock API base URL - replace with actual endpoint when available
const AI_HYDRATION_API_BASE = 'https://api.adobe.com/ai-hydration/v1/video';

/**
 * Extracts the video ID from an Adobe TV URL
 * @param {string} url - The Adobe TV video URL (e.g., https://video.tv.adobe.com/v/3476007)
 * @returns {string|null} - The video ID or null if not found
 */
export function extractVideoId(url) {
  if (!url) return null;
  const match = url.match(/\/v\/(\d+)/);
  return match ? match[1] : null;
}

/**
 * Checks if a JSON-LD schema for this video already exists in the document head
 * @param {string} videoId - The video ID to check for
 * @returns {boolean} - True if schema already exists
 */
function videoSchemaExists(videoId) {
  const existingSchemas = document.head.querySelectorAll('script[type="application/ld+json"]');
  return Array.from(existingSchemas).some((script) => {
    try {
      const schema = JSON.parse(script.textContent);
      if (schema['@type'] !== 'VideoObject') return false;
      // Check if contentUrl or embedUrl contains the video ID
      const contentUrl = schema.contentUrl || '';
      const embedUrl = schema.embedUrl || '';
      return contentUrl.includes(`/v/${videoId}`) || embedUrl.includes(`/v/${videoId}`);
    } catch {
      return false;
    }
  });
}

/**
 * Injects a VideoObject JSON-LD schema into the document head
 * @param {object} schema - The schema object to inject
 * @param {string} videoId - The video ID for deduplication
 */
function injectVideoSchema(schema, videoId) {
  if (videoSchemaExists(videoId)) {
    return;
  }

  const script = createTag(
    'script',
    {
      type: 'application/ld+json',
      'data-adobetv-video-id': videoId,
    },
    JSON.stringify(schema),
  );
  document.head.append(script);
}

/**
 * Mock API call - returns mock data for development
 * Replace this with actual API call when endpoint is available
 * @param {string} videoId - The video ID to fetch data for
 * @returns {Promise<object>} - The mock AI hydration data
 */
async function mockApiFetch(videoId) {
  // Simulate network delay
  await new Promise((resolve) => { setTimeout(resolve, 100); });

  return {
    video: {
      id: videoId,
      title: 'Adobe Workfront and Frame.io Enterprise Experience Overview',
      description: 'Learn how Adobe Workfront and Frame.io work together to streamline your creative workflows',
      url: `https://video.tv.adobe.com/v/${videoId}`,
      thumbnail: 'https://images-tv.adobe.com/mpcv3/3724077c-b289-47ab-8171-9682e7985d39/thumbnail.jpg',
      duration: '5:34',
      durationSeconds: 334,
      uploadDate: '2024-11-20T10:00:00Z',
      language: 'en',
    },
    ai: {
      summary: 'This video provides a comprehensive overview of how Adobe Workfront and Frame.io work together to create a seamless enterprise experience for creative teams.',
      titles: {
        descriptive: 'Adobe Workfront & Frame.io: Complete Enterprise Integration Guide',
        engaging: 'Transform Your Creative Workflow: Workfront + Frame.io Power Combo!',
        seo: 'Adobe Workfront Frame.io Integration Tutorial | Enterprise Creative Workflow Management',
      },
      chapters: [
        { title: 'Introduction to Workfront & Frame.io', time: '0:00', seconds: 0 },
        { title: 'Setting Up Your Workspace', time: '1:15', seconds: 75 },
        { title: 'Asset Review & Approval Workflows', time: '2:30', seconds: 150 },
        { title: 'Collaboration Features', time: '3:45', seconds: 225 },
        { title: 'Automation & Best Practices', time: '4:50', seconds: 290 },
      ],
      seoKeywords: [
        'Adobe Workfront',
        'Frame.io',
        'Project Management',
        'Creative Workflow',
        'Collaboration',
        'Enterprise',
      ],
      transcript: 'Welcome to this overview of Adobe Workfront and Frame.io enterprise experience. Today we\'ll explore how these two powerful platforms work together to revolutionize your creative operations...',
    },
    schema: {
      '@context': 'https://schema.org',
      '@type': 'VideoObject',
      name: 'Adobe Workfront and Frame.io Enterprise Experience Overview',
      description: 'Learn how Adobe Workfront and Frame.io work together to streamline your creative workflows',
      thumbnailUrl: 'https://images-tv.adobe.com/mpcv3/3724077c-b289-47ab-8171-9682e7985d39/thumbnail.jpg',
      uploadDate: '2024-11-20T10:30:00Z',
      duration: 'PT5M34S',
      contentUrl: `https://video.tv.adobe.com/v/${videoId}`,
      embedUrl: `https://video.tv.adobe.com/v/${videoId}?embed=true`,
    },
  };
}

/**
 * Fetches AI hydration data from the API
 * @param {string} videoId - The video ID to fetch data for
 * @returns {Promise<object|null>} - The AI hydration data or null on error
 */
async function fetchAiHydrationData(videoId) {
  // TODO: Replace mock with actual API call when endpoint is available
  // const response = await fetch(`${AI_HYDRATION_API_BASE}/${videoId}`);
  // if (!response.ok) throw new Error(`AI Hydration API error: ${response.status}`);
  // return response.json();

  return mockApiFetch(videoId);
}

/**
 * Initiates AI hydration for an Adobe TV video
 * Fetches AI-generated metadata and injects JSON-LD schema if available
 * @param {string} videoUrl - The Adobe TV video URL
 * @returns {Promise<object|null>} - The AI hydration data or null on error
 */
export async function hydrateVideo(videoUrl) {
  const videoId = extractVideoId(videoUrl);
  if (!videoId) {
    return null;
  }

  try {
    const data = await fetchAiHydrationData(videoId);

    // Inject JSON-LD schema if present in response
    if (data?.schema) {
      injectVideoSchema(data.schema, videoId);
    }

    return data;
  } catch (error) {
    window.lana?.log(`AI Hydration failed for video ${videoId}: ${error.message}`, { tags: 'adobetv' });
    return null;
  }
}

export default hydrateVideo;

