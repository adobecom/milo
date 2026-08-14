/**
 * MEP-only Playwright test fixture.
 *
 * Self-contained EDS request pacing for the MEP Nala projects. Intentionally does NOT
 * depend on the shared libs/nala-test.js / eds-throttle.js so changes here never affect
 * the MAS run (and MAS changes never affect MEP).
 *
 * Two deliberate differences from the shared throttle:
 *   1. Document requests are exempt — page.goto() navigation is never queued behind the
 *      pacing chain, which is what times out slower webkit/firefox workers.
 *   2. The per-worker cap is derived from the real MEP CI concurrency: the `mep` job runs
 *      mep-chromium + mep-firefox + mep-webkit together (3 projects x workers:2 = 6 workers)
 *      against one hostname. 180 / 6 = ~30 rps/worker keeps combined RPS under the
 *      ~200 rps/hostname AEM.live limit.
 *
 * Usage — replace the @playwright/test import in MEP test files:
 *   import { test, expect } from './mep-test.js';
 *
 * Env overrides:
 *   MEP_NALA_THROTTLE_DISABLED=1   disable pacing entirely
 *   MEP_NALA_MAX_RPS=<n>           force a specific per-worker cap
 */

import { test as base, expect } from '@playwright/test';

/** Combined RPS budget with headroom under the ~200 rps/hostname AEM.live limit. */
const MEP_SAFE_TOTAL_RPS = 180;
/** mep-chromium + mep-firefox + mep-webkit, each workers:2, run together in the MEP CI job. */
const MEP_CONCURRENT_WORKERS = 6;

function resolveMaxRps() {
  if (process.env.MEP_NALA_THROTTLE_DISABLED === '1') return 0;
  const override = process.env.MEP_NALA_MAX_RPS;
  if (override !== undefined && override !== '') {
    const v = Number.parseInt(override, 10);
    if (Number.isFinite(v) && v > 0) return v;
    console.warn(`[NALA][MEP] MEP_NALA_MAX_RPS="${override}" is not a positive integer — ignoring.\n`);
  }
  return Math.floor(MEP_SAFE_TOTAL_RPS / MEP_CONCURRENT_WORKERS);
}

function isEdsEdgeHost(url) {
  try {
    const { hostname } = new URL(url);
    return (
      hostname.endsWith('.aem.live')
      || hostname.endsWith('.aem.page')
      || hostname.endsWith('.hlx.page')
      || hostname.endsWith('.hlx.live')
      || hostname === 'aem.live'
    );
  } catch {
    return false;
  }
}

/** Serialize route.continue() for EDS hosts with a minimum gap (per worker process). */
function throttleGap(maxRps) {
  const minGapMs = 1000 / maxRps;
  if (!globalThis.mepThrottleChain) globalThis.mepThrottleChain = Promise.resolve();

  const next = globalThis.mepThrottleChain.then(async () => {
    const last = globalThis.mepThrottleLastAt ?? 0;
    const wait = Math.max(0, minGapMs - (Date.now() - last));
    if (wait > 0) {
      // eslint-disable-next-line no-promise-executor-return
      await new Promise((r) => { setTimeout(r, wait); });
    }
    globalThis.mepThrottleLastAt = Date.now();
  });

  globalThis.mepThrottleChain = next.catch(() => {});
  return next;
}

function logOnce(maxRps) {
  if (maxRps <= 0 || globalThis.mepThrottleLogged) return;
  globalThis.mepThrottleLogged = true;
  console.info(
    `[NALA][MEP] EDS throttle active: ~${maxRps} rps/worker x ${MEP_CONCURRENT_WORKERS} workers = `
    + `~${maxRps * MEP_CONCURRENT_WORKERS} rps combined (budget ${MEP_SAFE_TOTAL_RPS}). `
    + 'Set MEP_NALA_THROTTLE_DISABLED=1 to disable or MEP_NALA_MAX_RPS to override.\n',
  );
}

export const test = base.extend({
  context: async ({ context }, use) => {
    const maxRps = resolveMaxRps();
    if (maxRps > 0) {
      logOnce(maxRps);
      await context.route('**/*', async (route) => {
        const req = route.request();
        // Document requests (page.goto navigations) are exempt so they never queue.
        if (req.resourceType() !== 'document' && isEdsEdgeHost(req.url())) {
          await throttleGap(maxRps);
        }
        await route.continue();
      });
    }
    await use(context);
  },
});

export { expect };
