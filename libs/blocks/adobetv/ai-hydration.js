import { createTag } from '../../utils/utils.js';

// AI Hydration API endpoint
const AI_HYDRATION_API = 'https://14257-vortex-stage.adobeioruntime.net/api/v1/web/vortex/get-video-metadata';

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
  // First check for schemas injected by this module (fastest check)
  if (document.head.querySelector(`script[data-adobetv-video-id="${videoId}"]`)) {
    return true;
  }

  // Fall back to parsing existing JSON-LD schemas
  const existingSchemas = document.head.querySelectorAll('script[type="application/ld+json"]');
  return Array.from(existingSchemas).some((script) => {
    try {
      const schema = JSON.parse(script.textContent);
      if (schema['@type'] !== 'VideoObject') return false;
      // Check if contentUrl or embedUrl contains the video ID
      // Handles both /v/{id} and /video/{id} patterns
      const contentUrl = schema.contentUrl || '';
      const embedUrl = schema.embedUrl || '';
      const idPattern = new RegExp(`/(v|video)/${videoId}($|[?#/])`);
      return idPattern.test(contentUrl) || idPattern.test(embedUrl);
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
 * Fetches AI hydration data from the API
 * @param {string} videoId - The video ID to fetch data for
 * @returns {Promise<object|null>} - The AI hydration data or null on error
 */
async function fetchAiHydrationData(videoId) {
  const url = `${AI_HYDRATION_API}?videoId=${encodeURIComponent(videoId)}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`AI Hydration API error: ${response.status}`);
  }
  return response.json();
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

