/* eslint-disable import/prefer-default-export */

/**
 * Adds custom metadata to the current Playwright test execution.
 *
 * Metadata is stored as a test annotation and can be consumed by custom
 * reporters, dashboards, CI pipelines, or Slack notifications.
 *
 * Example:
 * addTestMetaData(test, {
 *   pageUrl,
 *   locale: '<fr>',
 *   feature: 'Lingo',
 *   owner: 'Lingo QA',
 * });
 *
 * @param {import('@playwright/test').TestType} test - Playwright test instance.
 * @param {Object} metadata - Arbitrary metadata associated with the test.
 */
export function addTestMetaData(test, metadata = {}) {
  test.info().annotations.push({
    type: 'nala-metadata',
    description: JSON.stringify(metadata),
  });
}
