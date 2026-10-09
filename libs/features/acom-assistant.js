/*
 * Shared AcomAssistant Client loader.
 *
 * window.AdobeMessagingExperienceClient is a single per-page instance -- only one
 * initialize() call is allowed per the client's own docs (a second call returns
 * { status: 'error', type: 'init_already_done' }). This module is the one place
 * that loads the script/CSS and calls initialize(), so every integrating surface
 * (GNav input, Brand Concierge blocks, chat links) shares the BC client instead
 * of racing to init it themselves. Later configuration updates use reinitialize().
 * Initialization/readiness must be confirmed by SDK callbacks within 30 seconds;
 * a timeout is a failure, not permission to open. Only pre-initialization script
 * failures are retried, avoiding duplicate initialize() calls on the same SDK.
 *
 * Reference: https://wiki.corp.adobe.com/spaces/Infinity/pages/4028260006/Client+API+Reference
 */

import { getConfig } from '../utils/utils.js';

let clientPromise = null;
let resolvedClient = null;
let mergedConfig = {};
let isReady = false;
let readyPromise = null;
let pendingReinitializeConfig = {};
let reinitializePromise = null;
let lifecycleError = null;
let readyGate;
const pendingMessages = [];
const CLIENT_TIMEOUT = 5000;
const READINESS_TIMEOUT = 30000;

function logError(error) {
  window.lana?.log?.(`AcomAssistant: ${error.message}`, {
    tags: 'acom-assistant',
    severity: 'error',
  });
}

function withTimeout(promise, message, timeoutMs = CLIENT_TIMEOUT) {
  let timer;
  const timeout = new Promise((resolve, reject) => {
    timer = setTimeout(() => reject(new Error(message)), timeoutMs);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

function createReadinessGate(message) {
  let resolve;
  let reject;
  const promise = withTimeout(new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  }), message, READINESS_TIMEOUT);
  // Startup can happen before any interaction awaits this gate.
  promise.catch((error) => {
    if (!lifecycleError) logError(error);
    lifecycleError ||= error;
    isReady = false;
    pendingMessages.length = 0;
  });
  return { promise, resolve, reject };
}

function checkClientResult(result, operation) {
  if (result?.status === 'error' || result?.status === 'blocked') {
    throw new Error(`${operation} failed (${result.type || result.status})`);
  }
}

function startReadinessWait() {
  isReady = false;
  readyGate = createReadinessGate('client readiness timed out');
  readyPromise = readyGate.promise;
}

function failInitialization(error) {
  const failure = error instanceof Error ? error : new Error(String(error));
  if (!lifecycleError) logError(failure);
  lifecycleError ||= failure;
  isReady = false;
  pendingMessages.length = 0;
  readyGate.reject(failure);
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
    // Match BC's own consent gate (bc-utils handleConsent): functional cookies (C0002).
    cookiesEnabled: !!window.adobePrivacy?.activeCookieGroups()?.includes('C0002'),
    cookies: { mcid: await getEcid() },
    loadedVia: 'milo',
  };
}

function assistantBase(env) {
  return env === 'stage'
    ? 'https://integration-client.messaging.adobe.com/latest/AdobeMessagingClient'
    : 'https://client.messaging.adobe.com/latest/AdobeMessagingClient';
}

function flushPendingMessages(client) {
  if (lifecycleError) return;
  isReady = true;
  pendingMessages.splice(0).forEach((payload) => client.sendUserMessage(payload));
}

function scheduleReinitialize(client, config) {
  pendingReinitializeConfig = mergeAcomConfig(pendingReinitializeConfig, config);
  if (reinitializePromise) return reinitializePromise;

  reinitializePromise = (async () => {
    await readyPromise;
    if (lifecycleError) throw lifecycleError;
    while (Object.keys(pendingReinitializeConfig).length) {
      const reinitializeConfig = pendingReinitializeConfig;
      pendingReinitializeConfig = {};
      startReadinessWait();
      const result = await withTimeout(
        Promise.resolve(client.reinitialize(reinitializeConfig)),
        'client reinitialization timed out',
        READINESS_TIMEOUT,
      );
      checkClientResult(result, 'reinitialize');
      // The SDK's "init_started" return is an acknowledgement, not completion.
      await readyPromise;
    }
    flushPendingMessages(client);
  })().catch((error) => {
    pendingReinitializeConfig = {};
    failInitialization(error);
    throw error;
  }).finally(() => {
    reinitializePromise = null;
  });
  return reinitializePromise;
}

/**
 * Idempotently loads and initializes the AcomAssistant Client, merging in
 * partialConfig (appid/context/callbacks, etc). The first caller wins the race
 * to actually call initialize(); later callers fold their config in via
 * reinitialize() once the client is ready and await that update's callbacks.
 * The first call returns after starting initialize(); opening waits for readiness.
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
      await scheduleReinitialize(client, partialConfig);
    }
    if (lifecycleError) throw lifecycleError;
    return client;
  }

  clientPromise = (async () => {
    const autoDefaults = await getAutoDefaults();
    mergedConfig = mergeAcomConfig(autoDefaults, mergedConfig);

    loadStyle(`${assistantBase(mergedConfig.env)}.css`);
    try {
      await withTimeout(
        Promise.resolve(loadScript(`${assistantBase(mergedConfig.env)}.js`)),
        'client script load timed out',
      );
      const clientReady = await waitForCondition(() => !!window.AdobeMessagingExperienceClient);
      if (!clientReady) {
        throw new Error('client script did not expose window.AdobeMessagingExperienceClient');
      }
    } catch (error) {
      clientPromise = null;
      logError(error);
      throw error;
    }

    const client = window.AdobeMessagingExperienceClient;
    startReadinessWait();

    const initializeConfig = {
      ...mergedConfig,
      callbacks: {
        ...mergedConfig.callbacks,
        initCallback: (...args) => {
          mergedConfig.callbacks?.initCallback?.(...args);
        },
        onReadyCallback: (...args) => {
          readyGate.resolve();
          if (!reinitializePromise) flushPendingMessages(client);
          mergedConfig.callbacks?.onReadyCallback?.(...args);
        },
        initErrorCallback: (...args) => {
          failInitialization(new Error(`init failed (${args[0]})`));
          mergedConfig.callbacks?.initErrorCallback?.(...args);
        },
        getContextCallback: (...args) => mergedConfig.callbacks?.getContextCallback?.(...args)
          || { appid: mergedConfig.appid, appver: mergedConfig.appver },
      },
    };
    try {
      Promise.resolve(client.initialize(initializeConfig))
        .then((result) => checkClientResult(result, 'initialize'))
        .catch(failInitialization);
    } catch (error) {
      failInitialization(error);
      throw error;
    }
    resolvedClient = client;
    return client;
  })();

  return clientPromise;
}

let bootstrapPromise = null;

/** Initializes the client once per page for every BC entry point (C1 and C2 bootstraps).
 *  Later callers reuse the first config instead of triggering reinitialize(), which the
 *  SDK rejects once its UI has loaded. */
export function initAcomAssistantOnce(config, deps) {
  bootstrapPromise ||= loadAcomAssistant(config, deps).catch((error) => {
    bootstrapPromise = null;
    throw error;
  });
  return bootstrapPromise;
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
  if (lifecycleError) throw lifecycleError;
  await reinitializePromise;
  if (lifecycleError) throw lifecycleError;
  if (isReady) client.sendUserMessage(payload);
  else pendingMessages.push(payload);
}

export async function getAcomAssistantPrompts() {
  const client = await clientPromise;
  return client ? client.getPrompts() : null;
}

/** Opens the initialized BC experience. Every entry point uses the same BC identity. */
export async function openAcomAssistantChat(sourceInfo) {
  const client = await clientPromise;
  if (!client) return;
  await readyPromise;
  await reinitializePromise;
  if (lifecycleError) throw lifecycleError;
  await client.openMessagingWindow(sourceInfo);
}
