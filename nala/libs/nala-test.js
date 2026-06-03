/**
 * Base Playwright test fixture for Nala.
 *
 * Extends the default `page` fixture to install EDS request pacing on every test page,
 * keeping combined RPS under the AEM.live 200 rps per-hostname limit.
 * See eds-throttle.js for configuration env vars (NALA_EDS_MAX_RPS, NALA_EDS_THROTTLE_DISABLED).
 *
 * Usage — replace the @playwright/test import in test files:
 *   import { test, expect } from '../../libs/nala-test.js';
 */

import { test as base, expect } from '@playwright/test';
import { installEdsThrottleOnPage } from './eds-throttle.js';

export const test = base.extend({
    page: async ({ page }, use) => {
        await installEdsThrottleOnPage(page);
        await use(page);
    },
});

export { expect };
