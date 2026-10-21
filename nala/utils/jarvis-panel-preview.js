/* eslint-env node */

const { parseArgs } = require('node:util');
const { chromium } = require('playwright');

const DEFAULT_URL = 'https://www.stage.adobe.com/creativecloud.html';
const INIT_URL = 'https://integration-server.messaging.adobe.com/core/v1/messaging/init';
const CONVERSATION_URL = 'https://assistant-integration.adobe.io/brand-concierge/conversations';
const LOCAL_UI = 'https://localhost.corp.adobe.com:3443';

function isLocalSurface(surface) {
  if (typeof surface !== 'string') return false;
  return surface === `web://${new URL(LOCAL_UI).host}/`;
}

async function installSurfaceOverride(context, log = console.log) {
  const surfaces = new WeakMap();

  await context.route((url) => url.origin + url.pathname === INIT_URL, async (route) => {
    const request = route.request();
    if (request.method() !== 'POST') return route.continue();
    const page = request.frame().page();
    surfaces.delete(page);
    try {
      const response = await route.fetch();
      if (response.ok()) {
        const data = await response.json();
        if (data.releaseControl?.showAdobeMessaging) {
          const url = new URL(data.releaseControl.assistantUiURL);
          if (url.protocol !== 'https:' || !url.hostname.endsWith('.assistant.adobe.com')) {
            throw new Error('Integration did not supply a hosted assistant UI URL');
          }
          const surface = `web://${url.host}${url.pathname}`;
          surfaces.set(page, surface);
          log(`[Jarvis preview] Discovered integration surface: ${surface}`);
        } else {
          log('[Jarvis preview] Integration disabled this SDK. Check the documented client-version pin.');
        }
      }
      return await route.fulfill({ response });
    } catch {
      log('[Jarvis preview] Could not read integration initialization; aborting the request.');
      return route.abort('failed');
    }
  });

  await context.route((url) => url.origin + url.pathname === CONVERSATION_URL, async (route) => {
    const request = route.request();
    if (request.method() !== 'POST'
      || new URL(request.frame().url()).origin !== LOCAL_UI) return route.continue();
    try {
      const payload = request.postDataJSON();
      let rewritten = 0;
      payload.events.forEach((event) => {
        const conversation = event.query?.conversation;
        if (!Array.isArray(conversation?.surfaces)) return;
        conversation.surfaces = conversation.surfaces.map((surface) => {
          if (!isLocalSurface(surface)) return surface;
          const deployed = surfaces.get(request.frame().page());
          if (!deployed) throw new Error('No integration surface was discovered for this page');
          rewritten += 1;
          return deployed;
        });
      });
      if (!rewritten) return await route.continue();
      await route.continue({ postData: JSON.stringify(payload) });
      log(`[Jarvis preview] Rewrote ${rewritten} local conversation surface(s); all other fields unchanged.`);
      return undefined;
    } catch {
      log('[Jarvis preview] Could not rewrite the conversation surface; reload after integration initialization.');
      return route.abort('failed');
    }
  });
}

async function openPreview({ url = DEFAULT_URL, headless = false } = {}) {
  const target = new URL(url);
  if (target.protocol !== 'https:' || !target.hostname.endsWith('.stage.adobe.com')) {
    throw new Error('Use an HTTPS *.stage.adobe.com preview URL, not production.');
  }
  target.searchParams.set('milolibs', 'local');
  target.searchParams.set('jarvis-panel', 'local');
  const browser = await chromium.launch({
    channel: 'chrome',
    headless,
    args: ['--disable-features=LocalNetworkAccessChecks,LocalNetworkAccessChecksWebRTC'],
  });
  try {
    const context = await browser.newContext({
      ignoreHTTPSErrors: true,
      serviceWorkers: 'block',
      viewport: { width: 1440, height: 900 },
    });
    await installSurfaceOverride(context);
    const page = await context.newPage();
    await page.goto(target.href);
    console.log(`[Jarvis preview] Opened ${target.href}`);
    return { browser, context, page };
  } catch (error) {
    await browser.close();
    throw error;
  }
}

async function main() {
  const { values, positionals } = parseArgs({
    options: { smoke: { type: 'boolean', default: false } },
    allowPositionals: true,
  });
  if (positionals.length > 1) throw new Error('Provide at most one preview URL.');
  const { browser, page } = await openPreview({ url: positionals[0], headless: values.smoke });
  try {
    if (values.smoke) {
      await page.locator('#chat-panel-toggle').click({ timeout: 45000 });
      await page.waitForFunction(
        () => window.AdobeMessagingExperienceClient?.isAdobeMessagingClientInitialized()
          || document.querySelector('#chat-panel [role="alert"]'),
        null,
        { timeout: 45000 },
      );
      if (await page.locator('#chat-panel [role="alert"]').count()) {
        throw new Error('The local panel failed to initialize. Check the SDK version pin and frontend servers.');
      }
      const response = page.waitForResponse((candidate) => {
        const url = new URL(candidate.url());
        return url.origin + url.pathname === CONVERSATION_URL
          && candidate.request().method() === 'POST';
      });
      await page.evaluate(() => window.AdobeMessagingExperienceClient
        .sendUserMessage({ label: 'Which Photoshop features help with photo editing?' }));
      const result = await response;
      if (result.status() !== 200) throw new Error(`Conversation returned HTTP ${result.status()}.`);
      console.log('[Jarvis preview] Conversation returned HTTP 200.');
    } else {
      console.log('[Jarvis preview] Use Ask to test. Close the browser or press Ctrl+C to stop.');
      const stop = () => browser.close();
      process.once('SIGINT', stop);
      process.once('SIGTERM', stop);
      await new Promise((resolve) => {
        browser.once('disconnected', resolve);
      });
      process.removeListener('SIGINT', stop);
      process.removeListener('SIGTERM', stop);
    }
  } finally {
    await browser.close();
  }
}

module.exports = { installSurfaceOverride, openPreview };

if (require.main === module) {
  main().catch((error) => {
    console.error(`[Jarvis preview] ${error.message}`);
    process.exitCode = 1;
  });
}
