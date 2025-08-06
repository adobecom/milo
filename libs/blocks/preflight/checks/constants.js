export const STATUS = {
  PASS: 'pass',
  FAIL: 'fail',
  LIMBO: 'limbo',
  EMPTY: 'empty',
};

export const SEVERITY = {
  CRITICAL: 'critical',
  WARNING: 'warning',
};

export const CHECKS = {
  H1_COUNT: {
    id: 'h1-count',
    severity: SEVERITY.WARNING,
    title: 'H1 count',
  },
  TITLE_SIZE: {
    id: 'title-size',
    severity: SEVERITY.WARNING,
    title: 'Title size',
  },
  CANONICAL: {
    id: 'canonical',
    severity: SEVERITY.WARNING,
    title: 'Canonical',
  },
  META_DESCRIPTION: {
    id: 'meta-description',
    severity: SEVERITY.WARNING,
    title: 'Meta description',
  },
  BODY_SIZE: {
    id: 'body-size',
    severity: SEVERITY.WARNING,
    title: 'Body size',
  },
  LOREM_IPSUM: {
    id: 'lorem-ipsum',
    severity: SEVERITY.CRITICAL,
    title: 'Lorem Ipsum',
  },
  BROKEN_LINKS: {
    id: 'broken-links',
    severity: SEVERITY.CRITICAL,
    title: 'Links',
  },
  LCP_ELEMENT: {
    id: 'lcp-element',
    severity: SEVERITY.CRITICAL,
    title: 'LCP',
  },
  SINGLE_BLOCK: {
    id: 'single-block',
    severity: SEVERITY.CRITICAL,
    title: 'Single Block',
  },
  PERSONALIZATION: {
    id: 'personalization',
    severity: SEVERITY.WARNING,
    title: 'Personalization',
  },
  IMAGE_SIZE: {
    id: 'image-size',
    severity: SEVERITY.WARNING,
    title: 'Images Size',
  },
  VIDEO_POSTER: {
    id: 'video-poster',
    severity: SEVERITY.WARNING,
    title: 'Videos',
  },
  FRAGMENTS: {
    id: 'fragments',
    severity: SEVERITY.WARNING,
    title: 'Fragments',
  },
  PLACEHOLDERS: {
    id: 'placeholders',
    severity: SEVERITY.WARNING,
    title: 'Placeholders',
  },
  ICONS: {
    id: 'icons',
    severity: SEVERITY.WARNING,
    title: 'Icons',
  },
  IMAGE_DIMENSIONS: {
    id: 'image-dimensions',
    severity: SEVERITY.CRITICAL,
    title: 'Asset Dimensions',
  },
};
