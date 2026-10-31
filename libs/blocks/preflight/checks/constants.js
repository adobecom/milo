export const STATUS = {
  PASS: 'pass',
  FAIL: 'fail',
  LIMBO: 'limbo',
  EMPTY: 'empty',
};

export const STATUS_TO_ICON_MAP = {
  [STATUS.PASS]: 'green',
  [STATUS.FAIL]: 'red',
  [STATUS.LIMBO]: 'orange',
  [STATUS.EMPTY]: 'empty',
};

export const SEVERITY = {
  CRITICAL: 'critical',
  WARNING: 'warning',
};

// Declared highest first; PRIORITY_ORDER follows this order.
export const PRIORITY = {
  BLOCKER: 'Blocker',
  CRITICAL: 'Critical',
  MAJOR: 'Major',
  NORMAL: 'Normal',
};

export const PRIORITY_ORDER = Object.values(PRIORITY);

// Display-only ranking for the preview pop-up, keyed by check id (or name when a
// check has no id). It never changes `severity`, which metrics and scoring use.
// Asset dimensions rank per fold via the -above-fold / -below-fold keys.
// Unlisted checks rank from severity: critical → Critical, anything else → Normal.
export const CHECK_PRIORITIES = {
  'M@S Unpublished Fragments': PRIORITY.BLOCKER,
  navigation: PRIORITY.BLOCKER,
  footer: PRIORITY.BLOCKER,
  links: PRIORITY.BLOCKER,
  'broken-links': PRIORITY.BLOCKER,
  'lorem-ipsum': PRIORITY.BLOCKER,
  title: PRIORITY.CRITICAL,
  'title-size': PRIORITY.CRITICAL,
  description: PRIORITY.CRITICAL,
  'meta-description': PRIORITY.CRITICAL,
  'h1-count': PRIORITY.CRITICAL,
  'region-selector': PRIORITY.CRITICAL,
  breadcrumbs: PRIORITY.CRITICAL,
  accessibility: PRIORITY.CRITICAL,
  'image-dimensions-above-fold': PRIORITY.CRITICAL,
  'static-prices': PRIORITY.CRITICAL,
  'body-size': PRIORITY.MAJOR,
  'lcp-element': PRIORITY.MAJOR,
  'single-block': PRIORITY.MAJOR,
  canonical: PRIORITY.MAJOR,
  georouting: PRIORITY.MAJOR,
  'image-size': PRIORITY.NORMAL,
  'video-poster': PRIORITY.NORMAL,
  fragments: PRIORITY.NORMAL,
  placeholders: PRIORITY.NORMAL,
  icons: PRIORITY.NORMAL,
  personalization: PRIORITY.NORMAL,
  'image-dimensions-below-fold': PRIORITY.NORMAL,
};

export const PERFORMANCE_IDS = {
  lcpElement: 'lcp-element',
  singleBlock: 'single-block',
  personalization: 'personalization',
  imageSize: 'image-size',
  videoPoster: 'video-poster',
  fragments: 'fragments',
  placeholders: 'placeholders',
  icons: 'icons',
};

export const PERFORMANCE_SEVERITIES = {
  lcpElement: 'critical',
  singleBlock: 'critical',
  personalization: 'warning',
  imageSize: 'warning',
  videoPoster: 'warning',
  fragments: 'warning',
  placeholders: 'warning',
  icons: 'warning',
};

export const SEO_TITLES = {
  h1Count: 'H1 count',
  title: 'Title size',
  canonical: 'Canonical',
  description: 'Meta description',
  bodySize: 'Body size',
  loremIpsum: 'Lorem Ipsum',
  links: 'Links',
};

export const SEO_IDS = {
  title: 'title',
  description: 'description',
  h1Count: 'h1-count',
  canonical: 'canonical',
  bodySize: 'body-size',
  loremIpsum: 'lorem-ipsum',
  links: 'links',
};

// Alternative IDs for native preflight checkId compatibility
export const SEO_CHECK_IDS = {
  title: 'title-size',
  description: 'meta-description',
  h1Count: 'h1-count',
  canonical: 'canonical',
  bodySize: 'body-size',
  loremIpsum: 'lorem-ipsum',
  links: 'broken-links',
};

export const SEO_SEVERITIES = {
  title: 'critical',
  description: 'critical',
  h1Count: 'critical',
  canonical: 'warning',
  bodySize: 'critical',
  loremIpsum: 'critical',
  links: 'critical',
};

export const SEO_DESCRIPTIONS = {
  title: 'Title size is appropriate.',
  description: 'Meta description is present and within the recommended character limit.',
  h1Count: 'Found exactly one H1 heading.',
  canonical: 'Canonical reference is valid.',
  bodySize: 'Body content has a good length.',
  loremIpsum: 'No Lorem ipsum is used on the page.',
  links: 'Links are valid.',
};

export const STRUCTURE_TITLES = {
  navigation: 'Navigation',
  footer: 'Footer',
  regionSelector: 'Region selector',
  georouting: 'Georouting',
  breadcrumbs: 'Breadcrumbs',
};

export const STRUCTURE_IDS = {
  navigation: 'navigation',
  footer: 'footer',
  regionSelector: 'region-selector',
  georouting: 'georouting',
  breadcrumbs: 'breadcrumbs',
};

export const STRUCTURE_SEVERITIES = {
  navigation: 'critical',
  footer: 'critical',
  regionSelector: 'critical',
  georouting: 'warning',
  breadcrumbs: 'critical',
};

export const PERFORMANCE_TITLES = {
  Performance: 'Performance',
  LcpEl: 'LCP',
  SingleBlock: 'Single Block',
  ImageSize: 'Images Size',
  VideoPoster: 'Videos',
  Fragments: 'Fragments',
  Personalization: 'Personalization',
  Placeholders: 'Placeholders',
  Icons: 'Icons',
};

export const ASSETS_TITLES = { AssetDimensions: 'Asset Dimensions' };

export const ASSETS_IDS = { imageDimensions: 'image-dimensions' };

export const ASSETS_SEVERITIES = { imageDimensions: 'critical' };

export const ASO_TIMEOUT_MS = 60_000;
export const ASO_POLL_INTERVAL_MS = 2_000;
export const ASO_MAX_RETRIES = Math.ceil(ASO_TIMEOUT_MS / ASO_POLL_INTERVAL_MS);
