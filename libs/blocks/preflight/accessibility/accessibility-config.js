export const AXE_CORE_CONFIG = {
  include: [['body']],
  exclude: [['.preflight'], ['aem-sidekick'], ['header'], ['.global-navigation'], ['footer'], ['.global-footer']],
  runOnly: {
    type: 'tag',
    values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
  },
};

export const CUSTOM_CHECKS_CONFIG = {
  checks: ['altText', 'color-contrast'],
  include: [['body']],
  exclude: [['.preflight'], ['aem-sidekick'], ['header'], ['.global-navigation'], ['footer'], ['.global-footer']],
};
