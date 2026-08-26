/**
 * Base Playwright test fixture for Nala.
 *
 * Extends the default `context` fixture to install EDS request pacing on every test context,
 * keeping combined RPS under the AEM.live 200 rps per-hostname limit.
 * Covers all pages in the context including those created with context.newPage().
 * See eds-throttle.js for configuration env vars (NALA_EDS_MAX_RPS, NALA_EDS_THROTTLE_DISABLED).
 *
 * Usage — replace the @playwright/test import in test files:
 *   import { test, expect } from '../../libs/nala-test.js';
 */

import { test as base, expect } from '@playwright/test';
import { installEdsThrottleOnContext } from './eds-throttle.js';

export const test = base.extend({
  context: async ({ context }, use) => {
    await installEdsThrottleOnContext(context);
    await use(context);
  },
});

export { expect };
