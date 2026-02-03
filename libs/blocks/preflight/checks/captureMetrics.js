import { getConfig } from '../../../utils/utils.js';

const getLogsEndpoint = () => {
  const currentUrl = window.location.href.toLowerCase();

  if (currentUrl.includes('preflightlogs=local')) {
    return 'http://localhost:8080/preflight-logs';
  }
  if (currentUrl.includes('preflightlogs=stage')) {
    return 'https://milo-core-stage.adobe.io/preflight-logs';
  }
  return 'https://milo-core-prod.adobe.io/preflight-logs';
};

const ID_TO_COLUMN = {
  // Accessibility Checks
  accessibility: 'accessibility_metrics',

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
  'h1-count': 'seo_h1_status',
  title: 'seo_title_size_status',
  'title-size': 'seo_title_size_status', // Alternative title checkID
  canonical: 'seo_canonical_status',
  description: 'seo_meta_description_status',
  'meta-description': 'seo_meta_description_status', // Alternative description checkId
  'body-size': 'seo_body_size_status',
  'lorem-ipsum': 'seo_lorem_ipsum_status',
  links: 'seo_bad_links_count',
  'broken-links': 'seo_bad_links_count', // Alternative broken checkId

  // Structure Checks
  navigation: 'structure_navigation_status',
  footer: 'structure_footer_status',
  'region-selector': 'structure_region_selector_status',
  breadcrumbs: 'structure_breadcrumbs_status',
  georouting: 'structure_georouting_status',
};

const normalizeStatus = (check) => {
  const rawStatus = check?.status;
  if (rawStatus === 'pass') return 'pass';
  if (rawStatus === 'fail') {
    if (check?.severity === 'warning') return 'warning';
    return 'fail';
  }
  return 'skipped';
};

const mapChecksWithColumn = (checks) => checks?.map((check) => ({
  ...check,
  status: normalizeStatus(check),
  key: ID_TO_COLUMN[check.checkId || check.id],
}));

const capture = async (results) => {
  const token = window.adobeIMS.getAccessToken()?.token;
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

  const resolvedPerformance = results.performance
    ? await Promise.all(results.performance)
    : undefined;
  const resolvedSeo = results.seo
    ? await Promise.all(results.seo)
    : undefined;
  const resolvedAssets = results.assets
    ? await Promise.all(results.assets)
    : undefined;
  const resolvedStructure = results.structure
    ? await Promise.all(results.structure)
    : undefined;
  const resolvedAccessibility = results.accessibility
    ? await Promise.all(results.accessibility)
    : undefined;

  const accessibilitySummary = resolvedAccessibility?.[0];

  const transformedResults = {
    accessibility: mapChecksWithColumn(resolvedAccessibility),
    performance: mapChecksWithColumn(resolvedPerformance),
    seo: mapChecksWithColumn(resolvedSeo),
    assets: mapChecksWithColumn(resolvedAssets),
    structure: mapChecksWithColumn(resolvedStructure),
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
    accessibility_issues_count: accessibilitySummary?.details?.issuesCount ?? null,
    accessibility_metrics: accessibilitySummary?.details?.violations ?? null,
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
      return { success: false, error: `HTTP ${response.status}: ${response.statusText}` };
    }
    return { success: true, status: response.status };
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
