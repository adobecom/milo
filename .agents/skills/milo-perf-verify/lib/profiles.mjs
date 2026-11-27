// Device profiles for the before/after performance check. Widths sit inside Milo's breakpoints
// (mobile < 600, tablet 600-1199, desktop >= 1200). Throttling follows Lighthouse's lab presets so numbers
// are comparable with a Lighthouse run; the check only ever compares before with after under the SAME profile.
const ANDROID_PHONE = 'Mozilla/5.0 (Linux; Android 11; moto g power (2022)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36';
const ANDROID_TABLET = 'Mozilla/5.0 (Linux; Android 13; SM-X700) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';
const MBPS = (n) => (n * 1024 * 1024) / 8;

export const PROFILES = {
  mobile: {
    context: { viewport: { width: 412, height: 915 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, userAgent: ANDROID_PHONE },
    cpu: 4,
    // Lighthouse mobile ("slow 4G"): 150 ms RTT, 1.6 Mbps down, 750 Kbps up
    net: { latency: 150, downloadThroughput: MBPS(1.6), uploadThroughput: MBPS(0.75) },
  },
  tablet: {
    context: { viewport: { width: 820, height: 1180 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, userAgent: ANDROID_TABLET },
    cpu: 2,
    net: { latency: 40, downloadThroughput: MBPS(10), uploadThroughput: MBPS(10) },
  },
  desktop: {
    context: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, isMobile: false, hasTouch: false },
    cpu: 1,
    // Lighthouse desktop: 40 ms RTT, 10 Mbps
    net: { latency: 40, downloadThroughput: MBPS(10), uploadThroughput: MBPS(10) },
  },
};

export const describeProfile = (name) => {
  const p = PROFILES[name];
  const { width, height } = p.context.viewport;
  const net = p.net ? `${((p.net.downloadThroughput * 8) / 1024 / 1024).toFixed(1)} Mbps, ${p.net.latency} ms RTT` : 'no network throttle';
  return `${width}x${height} @${p.context.deviceScaleFactor}x, CPU ${p.cpu}x, ${net}`;
};

// Apply the profile's CPU and network throttling to a page through CDP. Returns the CDP session.
export async function throttle(context, page, name) {
  const p = PROFILES[name];
  const cdp = await context.newCDPSession(page);
  await cdp.send('Network.enable');
  if (p.net) await cdp.send('Network.emulateNetworkConditions', { offline: false, ...p.net });
  if (p.cpu > 1) await cdp.send('Emulation.setCPUThrottlingRate', { rate: p.cpu });
  return cdp;
}

// Local mode: every consumer site resolves ?milolibs=local to http://localhost:6456, so two local checkouts
// cannot both own that address. Each side's requests to it are rewritten to that side's own port, and BOTH
// sides go through the same interception, so neither pays an overhead the other does not.
export const LOCAL_LIBS = 'http://localhost:6456';
export async function routeLocalLibs(page, port) {
  if (!port) return;
  await page.route(`${LOCAL_LIBS}/**`, async (route) => {
    const url = route.request().url().replace(LOCAL_LIBS, `http://localhost:${port}`);
    const response = await route.fetch({ url });
    await route.fulfill({ response });
  });
}

// A page URL with milolibs (and martech) set, keeping everything else.
export function withMilolibs(pageUrl, milolibs, martech = 'off') {
  const u = new URL(pageUrl);
  if (milolibs) u.searchParams.set('milolibs', milolibs);
  if (martech) u.searchParams.set('martech', martech);
  return u.toString();
}
