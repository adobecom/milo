import { getConfig } from '../../utils/utils.js';

const AUTH_TIMEOUT_MS = 5 * 60 * 1000;

function getSidekick() {
  return document.querySelector('aem-sidekick');
}

function getPluginActionBarShadow() {
  return getSidekick()?.shadowRoot?.querySelector('plugin-action-bar')?.shadowRoot;
}

export function isSidekickAuthed() {
  return !!getPluginActionBarShadow()?.querySelector('env-switcher');
}

function safeInvoke(cb, value) {
  try {
    cb(value);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('[sidekick-auth] subscriber threw:', e);
  }
}

export function createSidekickAuthWatcher() {
  const state = {
    resolved: false,
    timedOut: false,
    watching: false,
    subscribers: [],
    observers: [],
    timeoutId: null,
  };

  function teardownObservers() {
    state.observers.forEach((o) => o.disconnect());
    state.observers = [];
    if (state.timeoutId) {
      clearTimeout(state.timeoutId);
      state.timeoutId = null;
    }
    state.watching = false;
  }

  function resolveAuthed() {
    if (state.resolved) return;
    state.resolved = true;
    const toNotify = state.subscribers.slice();
    state.subscribers = [];
    teardownObservers();
    toNotify.forEach((cb) => safeInvoke(cb, true));
  }

  function watchEnvSwitcher(pluginBarShadow) {
    if (pluginBarShadow.querySelector('env-switcher')) {
      resolveAuthed();
      return;
    }
    const observer = new MutationObserver(() => {
      if (pluginBarShadow.querySelector('env-switcher')) resolveAuthed();
    });
    observer.observe(pluginBarShadow, { childList: true, subtree: true });
    state.observers.push(observer);
  }

  function watchPluginActionBar(sidekickShadow) {
    const existing = sidekickShadow.querySelector('plugin-action-bar');
    if (existing?.shadowRoot) {
      watchEnvSwitcher(existing.shadowRoot);
      return;
    }
    const observer = new MutationObserver(() => {
      const pluginBar = sidekickShadow.querySelector('plugin-action-bar');
      if (!pluginBar?.shadowRoot) return;
      observer.disconnect();
      state.observers = state.observers.filter((o) => o !== observer);
      watchEnvSwitcher(pluginBar.shadowRoot);
    });
    observer.observe(sidekickShadow, { childList: true, subtree: true });
    state.observers.push(observer);
  }

  function watchSidekick() {
    const existing = getSidekick();
    if (existing?.shadowRoot) {
      watchPluginActionBar(existing.shadowRoot);
      return;
    }
    const observer = new MutationObserver(() => {
      const sidekick = getSidekick();
      if (!sidekick?.shadowRoot) return;
      observer.disconnect();
      state.observers = state.observers.filter((o) => o !== observer);
      watchPluginActionBar(sidekick.shadowRoot);
    });
    observer.observe(document.body, { childList: true });
    state.observers.push(observer);
  }

  function startWatching() {
    if (state.watching || state.resolved || state.timedOut) return;
    state.watching = true;
    state.timeoutId = setTimeout(() => {
      state.timedOut = true;
      state.subscribers = [];
      teardownObservers();
    }, AUTH_TIMEOUT_MS);
    watchSidekick();
  }

  return function onSidekickAuth(callback, { envs = ['prod'] } = {}) {
    const envName = getConfig().env?.name;

    if (!envs.includes(envName)) {
      safeInvoke(callback, true);
      return;
    }

    if (state.resolved) {
      safeInvoke(callback, true);
      return;
    }

    const currentlyAuthed = isSidekickAuthed();
    safeInvoke(callback, currentlyAuthed);

    if (currentlyAuthed) {
      resolveAuthed();
      return;
    }

    if (state.timedOut) return;

    state.subscribers.push(callback);
    startWatching();
  };
}

export const onSidekickAuth = createSidekickAuthWatcher();
