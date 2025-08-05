export const STATUS = {
  PASS: 'pass',
  FAIL: 'fail',
  LIMBO: 'limbo',
  EMPTY: 'empty',
};

export const CHECK_IDS = {

  H1_COUNT: 'h1-count',
  TITLE_SIZE: 'title-size',
  CANONICAL: 'canonical',
  META_DESCRIPTION: 'meta-description',
  BODY_SIZE: 'body-size',
  LOREM_IPSUM: 'lorem-ipsum',
  BROKEN_LINKS: 'broken-links',

  LCP_ELEMENT: 'lcp-element',
  SINGLE_BLOCK: 'single-block',
  PERSONALIZATION: 'personalization',
  IMAGE_SIZE: 'image-size',
  VIDEO_POSTER: 'video-poster',
  FRAGMENTS: 'fragments',
  PLACEHOLDERS: 'placeholders',
  ICONS: 'icons',

  IMAGE_DIMENSIONS: 'image-dimensions',
};

export const SEVERITY = {
  CRITICAL: 'critical',
  WARNING: 'warning',
};

export const CHECK_SEVERITY_MAP = {

  [CHECK_IDS.H1_COUNT]: SEVERITY.WARNING,
  [CHECK_IDS.TITLE_SIZE]: SEVERITY.WARNING,
  [CHECK_IDS.CANONICAL]: SEVERITY.WARNING,
  [CHECK_IDS.META_DESCRIPTION]: SEVERITY.WARNING,
  [CHECK_IDS.BODY_SIZE]: SEVERITY.WARNING,
  [CHECK_IDS.LOREM_IPSUM]: SEVERITY.CRITICAL,
  [CHECK_IDS.BROKEN_LINKS]: SEVERITY.CRITICAL,


  [CHECK_IDS.LCP_ELEMENT]: SEVERITY.CRITICAL,
  [CHECK_IDS.SINGLE_BLOCK]: SEVERITY.CRITICAL,
  [CHECK_IDS.PERSONALIZATION]: SEVERITY.WARNING,
  [CHECK_IDS.IMAGE_SIZE]: SEVERITY.WARNING,
  [CHECK_IDS.VIDEO_POSTER]: SEVERITY.WARNING,
  [CHECK_IDS.FRAGMENTS]: SEVERITY.WARNING,
  [CHECK_IDS.PLACEHOLDERS]: SEVERITY.WARNING,
  [CHECK_IDS.ICONS]: SEVERITY.WARNING,
  
  // Asset Checks - easily configurable
  [CHECK_IDS.IMAGE_DIMENSIONS]: SEVERITY.CRITICAL,
};

// Helper function to get severity for a check
export function getCheckSeverity(checkId) {
  return CHECK_SEVERITY_MAP[checkId] || SEVERITY.WARNING;
}

export const SEO_TITLES = {
  H1Count: 'H1 count',
  TitleSize: 'Title size',
  Canonical: 'Canonical',
  MetaDescription: 'Meta description',
  BodySize: 'Body size',
  Lorem: 'Lorem Ipsum',
  Links: 'Links',
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
