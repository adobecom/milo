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
 * Extracts keywords from AI data
 * @param {object} aiData - The AI hydration data
 * @returns {string} - Comma-separated keywords
 */
function extractKeywords(aiData) {
  const keywords = [];
  
  // Add SEO keywords if available
  if (aiData?.ai?.seoKeywords && Array.isArray(aiData.ai.seoKeywords)) {
    keywords.push(...aiData.ai.seoKeywords);
  }
  
  // Extract keywords from titles if available
  if (aiData?.ai?.titles) {
    const titles = aiData.ai.titles;
    Object.values(titles).forEach(titleObj => {
      if (titleObj?.title) {
        // Extract meaningful words from titles (optional enhancement)
        keywords.push(titleObj.title);
      }
    });
  }
  
  return keywords.join(', ');
}

/**
 * Creates chapter/clip objects from AI chapters data
 * @param {Array} chapters - Array of chapter objects from AI data
 * @param {string} baseUrl - Base URL for the video
 * @returns {Array} - Array of Clip objects for hasPart property
 */
function createChapterClips(chapters, baseUrl) {
  if (!chapters || !Array.isArray(chapters) || chapters.length === 0) {
    return null;
  }
  
  return chapters
    .filter(chapter => chapter.title && chapter.seconds !== undefined)
    .map(chapter => ({
      '@type': 'Clip',
      name: chapter.title,
      startOffset: chapter.seconds,
      url: `${baseUrl}#t=${chapter.seconds}`
    }));
}

/**
 * Extracts topics from AI summary for the 'about' property
 * @param {object} aiData - The AI hydration data
 * @returns {Array|null} - Array of Thing objects or null
 */
function extractAboutTopics(aiData) {
  const topics = new Set();
  
  // Extract from titles
  if (aiData?.ai?.titles) {
    const titles = aiData.ai.titles;
    // Add key themes from descriptive title
    if (titles.descriptive?.title) {
      const title = titles.descriptive.title;
      // Example: Extract key terms (you can enhance this logic)
      if (title.includes('Adobe Summit')) topics.add('Adobe Summit');
      if (title.includes('AI')) topics.add('Artificial Intelligence in Marketing');
      if (title.includes('Marketing')) topics.add('Digital Marketing');
      if (title.includes('Customer Experience')) topics.add('Customer Experience Management');
    }
  }
  
  // Extract from summary (basic keyword extraction)
  if (aiData?.ai?.summary) {
    const summary = aiData.ai.summary.toLowerCase();
    if (summary.includes('ai') || summary.includes('artificial intelligence')) {
      topics.add('Artificial Intelligence');
    }
    if (summary.includes('marketing')) {
      topics.add('Digital Marketing');
    }
    if (summary.includes('customer experience')) {
      topics.add('Customer Experience');
    }
  }
  
  if (topics.size === 0) return null;
  
  return Array.from(topics).map(topic => ({
    '@type': 'Thing',
    name: topic
  }));
}

/**
 * Enhances the schema with additional SEO and LLM-friendly properties
 * @param {object} baseSchema - The base schema from API
 * @param {object} aiData - The full AI hydration data
 * @param {string} videoId - The video ID
 * @returns {object} - Enhanced schema object
 */
function enhanceSchema(baseSchema, aiData, videoId) {
  const enhanced = { ...baseSchema };
  
  // Add language if available
  if (aiData?.video?.language) {
    enhanced.inLanguage = aiData.video.language;
  }
  
  // Use AI summary as abstract/description if available and better than default
  if (aiData?.ai?.summary) {
    // Use summary as abstract (full summary)
    enhanced.abstract = aiData.ai.summary;
    
    // If description is generic, replace with a better one from AI titles
    if (enhanced.description?.includes('Description for') && aiData.ai.titles?.descriptive?.title) {
      enhanced.description = aiData.ai.titles.descriptive.title;
    }
  }
  
  // Add keywords
  const keywords = extractKeywords(aiData);
  if (keywords) {
    enhanced.keywords = keywords;
  }
  
  // Add chapters as hasPart
  const chapters = createChapterClips(
    aiData?.ai?.chapters,
    enhanced.embedUrl || enhanced.contentUrl
  );
  if (chapters && chapters.length > 0) {
    enhanced.hasPart = chapters;
  }
  
  // Add about topics
  const aboutTopics = extractAboutTopics(aiData);
  if (aboutTopics && aboutTopics.length > 0) {
    enhanced.about = aboutTopics;
  }
  
  // Add publisher
  enhanced.publisher = {
    '@type': 'Organization',
    name: 'Adobe',
    url: 'https://www.adobe.com'
  };
  
  // Add transcript if available
  if (aiData?.ai?.transcript) {
    enhanced.transcript = aiData.ai.transcript;
  }
  
  return enhanced;
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

    // Inject enhanced JSON-LD schema if present in response
    if (data?.schema) {
      const enhancedSchema = enhanceSchema(data.schema, data, videoId);
      injectVideoSchema(enhancedSchema, videoId);
    }

    return data;
  } catch (error) {
    window.lana?.log(`AI Hydration failed for video ${videoId}: ${error.message}`, { tags: 'adobetv' });
    return null;
  }
}

export default hydrateVideo;
