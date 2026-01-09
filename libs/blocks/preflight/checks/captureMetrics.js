import { getConfig } from '../../../utils/utils.js';

const getLogsEndpoint = () => {
  const currentUrl = window.location.href.toLowerCase();

  // Manual override for local development
  if (currentUrl.includes('preflightlogs=local')) {
    return 'http://localhost:8080/preflight-logs';
  }
  
  // Manual override for staging
  if (currentUrl.includes('preflightlogs=stage')) {
    return 'https://milo-core-stage.adobe.io/preflight-logs';
  }
  
  // Manual override for production
  if (currentUrl.includes('preflightlogs=prod')) {
    return 'https://milo-core-prod.adobe.io/preflight-logs';
  }

  // Auto-detect based on AEM environment
  const hostname = window.location.hostname.toLowerCase();
  
  // AEM Preview/Stage (.aem.page) -> Send to staging backend
  if (hostname.includes('.aem.page')) {
    console.log('🔍 Detected AEM Preview environment -> routing to staging backend');
    return 'https://milo-core-stage.adobe.io/preflight-logs';
  }
  
  // AEM Published/Live (.aem.live) -> Send to production backend  
  if (hostname.includes('.aem.live')) {
    console.log('🚀 Detected AEM Live environment -> routing to production backend');
    return 'https://milo-core-prod.adobe.io/preflight-logs';
  }
  
  // Default to production for other domains
  console.log('🌐 Unknown environment -> defaulting to production backend');
  return 'https://milo-core-prod.adobe.io/preflight-logs';
};

const ID_TO_COLUMN = {
  // Performance Checks
  'lcp-element': 'performance_valid_lcp',
  'single-block': 'performance_first_section_one_block',
  'image-size': 'performance_lcp_image_size_kb',
  'video-poster': 'performance_video_poster',
  fragments: 'performance_fragments_within_lcp',
  personalization: 'performance_personalization',
  placeholders: 'performance_placeholders_within_lcp',
  icons: 'performance_icons_within_lcp',

  // Asset Checks
  'image-dimensions': 'assets_images_dimension_mismatch',

  // SEO Checks
  'h1-count': 'seo_h1_count',
  title: 'seo_title_length',
  canonical: 'seo_canonical_status',
  description: 'seo_meta_description_length',
  'body-size': 'seo_body_size',
  'lorem-ipsum': 'seo_has_lorem_ipsum',
  links: 'seo_bad_links_count',

  // Structure Checks
  navigation: 'structure_navigation_status',
  footer: 'structure_footer_status',
  'region-selector': 'structure_region_selector_status',
  breadcrumbs: 'structure_breadcrumbs_status',
  georouting: 'structure_georouting_status',
};

const capture = async (results) => {
  const token = window.adobeIMS?.getAccessToken()?.token;
  const config = getConfig();
  const { imsClientId } = config;
  
  if (!token || !imsClientId) return null;

  let profile;
  try {
    profile = await window.adobeIMS.getProfile();
  } catch (error) {
    console.warn('IMS profile fetch failed, continuing without profile data');
    profile = { email: '' };
  }

  const transformedResults = {
    performance: results.performance?.map((check) => ({
      ...check,
      key: ID_TO_COLUMN[check.checkId],
    })),
    seo: results.seo?.map((check) => ({
      ...check,
      key: ID_TO_COLUMN[check.checkId],
    })),
    assets: results.assets?.map((check) => ({
      ...check,
      key: ID_TO_COLUMN[check.checkId],
    })),
    structure: results.structure?.map((check) => ({
      ...check,
      key: ID_TO_COLUMN[check.checkId],
    })),
  };

  const contextData = {
    email: profile?.email || '',
    url: window.location.href,
    project_key: window.location.hostname.split('--')[1] || imsClientId,
    window_width: window.innerWidth,
    window_height: window.innerHeight,
    performance_lcp: 0,
    performance_fcp: 0,
    performance_ttfb: 0,
    performance_cls: 0,
  };

  contextData.performance_fcp = window.performance
    .getEntriesByType('paint')
    .find((entry) => entry.name === 'first-contentful-paint')?.startTime;

  contextData.performance_ttfb = window.performance
    .getEntriesByType('navigation')[0]?.responseStart;

  await new Promise((resolve) => {
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      contextData.performance_cls = entries.reduce((sum, entry) => sum + entry.value, 0);
      resolve(entries);
    }).observe({ type: 'layout-shift', buffered: true });
  });

  await new Promise((resolve) => {
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      contextData.performance_lcp = lastEntry.startTime;
      resolve(lastEntry);
    }).observe({ type: 'largest-contentful-paint', buffered: true });
  });

  return {
    results: transformedResults,
    contextData,
    token,
    imsClientId,
  };
};

const sendMetrics = async (metricsData) => {
  if (!metricsData) return { success: false, error: 'No metrics data to send' };

  const { results, contextData, token, imsClientId } = metricsData;
  const endpoint = getLogsEndpoint();

  try {
    const response = await fetch(`${endpoint}?clientId=${imsClientId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...results,
        ...contextData,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: `HTTP ${response.status}: ${errorText || response.statusText}` };
    }
    
    const responseData = await response.json();
    return { success: true, status: response.status, data: responseData };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

const captureMetrics = async (results) => {
  try {
    const metrics = await capture(results);
    const response = await sendMetrics(metrics);
    return response;
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export default captureMetrics;
