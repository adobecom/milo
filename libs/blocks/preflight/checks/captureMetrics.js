import { getConfig } from '../../../utils/utils.js';

const getLogsEndpoint = () => {
  const currentUrl = window.location.href.toLowerCase();
  if (currentUrl.includes('preflightlogs=local')) return 'http://localhost:8080/preflight-logs';
  if (currentUrl.includes('preflightlogs=stage')) return 'https://milo-core-stage.adobe.io/preflight-logs';
  return 'https://milo-core-prod.adobe.io/preflight-logs';
};

const ID_TO_COLUMN = {
  // Performance
  'lcp-element': 'performance_valid_lcp',
  'single-block': 'performance_first_section_one_block',
  'image-size': 'performance_lcp_image_size_kb',
  'video-poster': 'performance_video_poster',
  fragments: 'performance_fragments_within_lcp',
  personalization: 'performance_personalization',
  placeholders: 'performance_placeholders_within_lcp',
  icons: 'performance_icons_within_lcp',
  // Assets
  'image-dimensions': 'assets_images_dimension_mismatch',
  // SEO (covers both OG ids and ASO checkIds)
  'h1-count': 'seo_h1_status',
  title: 'seo_title_size_status',
  'title-size': 'seo_title_size_status',
  canonical: 'seo_canonical_status',
  description: 'seo_meta_description_status',
  'meta-description': 'seo_meta_description_status',
  'body-size': 'seo_body_size_status',
  'lorem-ipsum': 'seo_lorem_ipsum_status',
  links: 'seo_bad_links_count',
  'broken-links': 'seo_bad_links_count',
  // Structure
  navigation: 'structure_navigation_status',
  footer: 'structure_footer_status',
  'region-selector': 'structure_region_selector_status',
  breadcrumbs: 'structure_breadcrumbs_status',
  georouting: 'structure_georouting_status',
};

const mapChecksWithColumn = (checks) => checks?.map((check) => ({
  ...check,
  key: ID_TO_COLUMN[check.checkId || check.id],
}));

async function capture(results) {
  const token = window.adobeIMS?.getAccessToken()?.token;
  const { imsClientId } = getConfig();
  if (!token || !imsClientId) return null;

  let profile;
  try {
    profile = await window.adobeIMS.getProfile();
  } catch {
    window.lana?.log?.('IMS profile fetch failed, continuing without profile data', { tags: 'preflight', errorType: 'i' });
    profile = { email: '' };
  }

  const [
    resolvedPerformance,
    resolvedSeo,
    resolvedAssets,
    resolvedStructure,
    resolvedAccessibility,
  ] = await Promise.all([
    results.performance ? Promise.all(results.performance) : [],
    results.seo ? Promise.all(results.seo) : [],
    results.assets ? Promise.all(results.assets) : [],
    results.structure ? Promise.all(results.structure) : [],
    results.accessibility ? Promise.all(results.accessibility) : [],
  ]);

  const accessibilitySummary = resolvedAccessibility[0];

  const transformedResults = {
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
    accessibility_issues_count: accessibilitySummary?.details?.issuesCount ?? null,
    accessibility_metrics: accessibilitySummary?.details?.violations ?? null,
  };

  return { results: transformedResults, contextData, token, imsClientId };
}

async function sendMetrics(metricsData) {
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
      body: JSON.stringify({ ...results, ...contextData }),
    });

    if (!response.ok) return { success: false, error: `HTTP ${response.status}: ${response.statusText}` };
    return { success: true, status: response.status };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export default async function captureMetrics(results) {
  try {
    const metrics = await capture(results);
    return await sendMetrics(metrics);
  } catch (error) {
    return { success: false, error: error.message };
  }
}
