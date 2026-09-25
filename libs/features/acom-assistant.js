/*
 * Shared AcomAssistant Client loader.
 *
 * window.AdobeMessagingExperienceClient is a single per-page instance -- only one
 * initialize() call is allowed per the client's own docs (a second call returns
 * { status: 'error', type: 'init_already_done' }). This module is the one place
 * that loads the script/CSS and calls initialize(), so every integrating surface
 * (GNav link, Brand Concierge blocks) shares one client instead of racing to init
 * it themselves. Later callers fold their config in via reinitialize().
 *
 * Reference: https://wiki.corp.adobe.com/spaces/Infinity/pages/4028260006/Client+API+Reference
 */

import { getConfig } from '../utils/utils.js';

let clientPromise = null;
let resolvedClient = null;
let mergedConfig = {};
let isReady = false;
let initSettledPromise = null;
let readyPromise = null;
let pendingIdentity = null;
const pendingMessages = [];

/**
 * Sets which surface's identity getContextCallback should report on the next CTA/host-link
 * click. Surfaces sharing this one client (GNav Jarvis link, Brand Concierge) call this right
 * before triggering their own open, so a single session can serve a different appid/appver
 * per entry point instead of being locked to whichever surface won the initialize() race.
 */
export function setAcomAssistantIdentity(identity) {
  pendingIdentity = identity;
}

function mergeCallbacks(target = {}, source = {}) {
  const merged = { ...target };
  Object.entries(source).forEach(([name, fn]) => {
    if (typeof fn !== 'function') return;
    const existing = merged[name];
    merged[name] = existing
      ? (...args) => { existing(...args); fn(...args); }
      : fn;
  });
  return merged;
}

function mergeAcomConfig(target = {}, source = {}) {
  return {
    ...target,
    ...source,
    context: {
      ...target.context,
      ...source.context,
      userData: { ...target.context?.userData, ...source.context?.userData },
    },
    callbacks: mergeCallbacks(target.callbacks, source.callbacks),
  };
}

function waitForCondition(checkFn, timeout = 5000, interval = 100) {
  return new Promise((resolve) => {
    const start = Date.now();
    const check = () => {
      if (checkFn()) {
        resolve(true);
      } else if (Date.now() - start >= timeout) {
        resolve(false);
      } else {
        setTimeout(check, interval);
      }
    };
    check();
  });
}

async function getEcid() {
  if (!window.alloy) return undefined;
  return window.alloy('getIdentity').then((data) => data?.identity?.ECID).catch(() => undefined);
}

async function getAutoDefaults() {
  const config = getConfig();
  const { locale } = config || {};
  let language;
  let region;
  if (locale?.ietf?.includes('-')) {
    [language, region] = locale.ietf.split('-');
  } else if (locale?.prefix) {
    [region, language] = locale.prefix.replace('/', '').split('_');
    if (region === 'africa') region = 'ZA';
  }

  return {
    env: config?.env?.name !== 'prod' ? 'stage' : 'prod',
    language: language || 'en',
    region,
    clientId: window.adobeid?.client_id,
    accessToken: window.adobeIMS?.isSignedInUser()
      ? `Bearer ${window.adobeIMS.getAccessToken()?.token}` : undefined,
    cookiesEnabled: window.adobePrivacy?.activeCookieGroups()?.length > 1,
    cookies: { mcid: await getEcid() },
    loadedVia: 'milo',
  };
}

function assistantBase(env) {
  return env === 'stage'
    ? 'https://dev-client.messaging.adobe.com/latest/AdobeMessagingClient'
    : 'https://client.messaging.adobe.com/latest/AdobeMessagingClient';
}

function flushPendingMessages(client) {
  isReady = true;
  pendingMessages.splice(0).forEach((payload) => client.sendUserMessage(payload));
}

/**
 * Idempotently loads and initializes the AcomAssistant Client, merging in
 * partialConfig (appid/context/callbacks, etc). The first caller wins the race
 * to actually call initialize(); later callers fold their config in via
 * reinitialize() once the client is available.
 *
 * loadScript/loadStyle are injected (not imported directly) so tests can mock
 * the network load, same convention as the rest of libs/features.
 */
export async function loadAcomAssistant(partialConfig = {}, { loadScript, loadStyle } = {}) {
  mergedConfig = mergeAcomConfig(mergedConfig, partialConfig);

  if (clientPromise) {
    const client = await clientPromise;
    if (client && (partialConfig.context || partialConfig.appid || partialConfig.accessToken)) {
      // Deferred: calling reinitialize() while the first initialize() is still mid-flight
      // is blocked/dropped server-side ({ status: 'blocked', type: 'init_in_progress' }).
      initSettledPromise.then(() => client.reinitialize(partialConfig));
    }
    return client;
  }

  clientPromise = (async () => {
    const autoDefaults = await getAutoDefaults();
    mergedConfig = mergeAcomConfig(autoDefaults, mergedConfig);

    // Fire-and-forget the load (matching bc-bootstrap.js's loadWebclient) -- don't block
    // the init chain on the script tag's own load promise, which can hang or reject
    // independently of whether window.AdobeMessagingExperienceClient ever shows up.
    loadStyle(`${assistantBase(mergedConfig.env)}.css`);
    Promise.resolve(loadScript(`${assistantBase(mergedConfig.env)}.js`)).catch(() => {});

    const clientReady = await waitForCondition(() => !!window.AdobeMessagingExperienceClient);
    if (!clientReady) {
      window.lana?.log('AcomAssistant: client script did not expose window.AdobeMessagingExperienceClient', { tags: 'acom-assistant', severity: 'error' });
      clientPromise = null;
      return null;
    }

    const client = window.AdobeMessagingExperienceClient;
    let resolveInitSettled;
    let resolveReady;
    initSettledPromise = new Promise((resolve) => { resolveInitSettled = resolve; });
    readyPromise = new Promise((resolve) => { resolveReady = resolve; });
    setTimeout(resolveInitSettled, 5000);
    setTimeout(resolveReady, 5000);

    client.initialize({
      ...mergedConfig,
      callbacks: {
        ...mergedConfig.callbacks,
        initCallback: (...args) => {
          resolveInitSettled();
          mergedConfig.callbacks?.initCallback?.(...args);
        },
        onReadyCallback: (...args) => {
          flushPendingMessages(client);
          resolveReady();
          mergedConfig.callbacks?.onReadyCallback?.(...args);
        },
        initErrorCallback: (...args) => {
          resolveInitSettled();
          window.lana?.log(`AcomAssistant: init failed (${args[0]})`, { tags: 'acom-assistant', severity: 'error' });
          mergedConfig.callbacks?.initErrorCallback?.(...args);
        },
        getContextCallback: (...args) => pendingIdentity
          || mergedConfig.callbacks?.getContextCallback?.(...args)
          || { appid: mergedConfig.appid, appver: mergedConfig.appver },
      },
    });
    resolvedClient = client;
    return client;
  })();

  return clientPromise;
}

/** Synchronous access to the client once resolved -- null before then. Useful for
 *  click handlers that need to branch on current state without awaiting. */
export function getAcomAssistantClient() {
  return resolvedClient;
}

export async function sendAcomAssistantUserMessage(payload) {
  if (!payload?.label) return;
  const client = await clientPromise;
  if (!client) return;
  if (isReady) client.sendUserMessage(payload);
  else pendingMessages.push(payload);
}

export async function getAcomAssistantPrompts() {
  const client = await clientPromise;
  return client ? client.getPrompts() : null;
}

export async function openAcomAssistantChat(sourceInfo) {
  const client = await clientPromise;
  if (!client) return;
  await readyPromise;
  client.openMessagingWindow(sourceInfo);
}
