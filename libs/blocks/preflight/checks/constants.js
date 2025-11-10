export const STATUS = {
  PASS: 'pass',
  FAIL: 'fail',
  LIMBO: 'limbo',
  EMPTY: 'empty',
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

export const ASO_TIMEOUT_MS = 60_000;
export const ASO_POLL_INTERVAL_MS = 2_000;
export const ASO_MAX_RETRIES = Math.ceil(ASO_TIMEOUT_MS / ASO_POLL_INTERVAL_MS);
