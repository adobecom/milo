import { createContext, html, useReducer } from '../../deps/htm-preact.js';
import { parseEncodedConfig } from '../../utils/utils.js';
import { sanitizeHtmlBody } from '../../utils/sanitizeHtml.js';

// Allowlist-sanitize a single config value: strip <script>, on* handlers and
// unsafe URL schemes, then serialize back to a string. Serializing re-encodes
// HTML entities, which neutralizes entity-encoded payloads (the VULN-36919
// bypass) instead of decoding them the way the previous .textContent fix did,
// while still preserving legitimate inline markup.
export const sanitizeConfigValue = (value) => {
  if (typeof value !== 'string') return value;
  return sanitizeHtmlBody(value).innerHTML;
};

export const sanitizeHashConfig = (config) => {
  if (!config || typeof config !== 'object') return config;
  return Object.fromEntries(
    Object.entries(config).map(([key, value]) => [key, sanitizeConfigValue(value)]),
  );
};

export const saveStateToLocalStorage = (state, lsKey) => {
  localStorage.setItem(lsKey, JSON.stringify(state));
};

export const loadStateFromLocalStorage = (lsKey) => {
  const lsState = localStorage.getItem(lsKey);
  if (lsState) {
    try {
      // Sanitize on load too: the stored config feeds the marketo preview sink,
      // so a poisoned store (any origin) must not resurrect an XSS payload.
      return sanitizeHashConfig(JSON.parse(lsState));
      /* c8 ignore next 2 */
      // eslint-disable-next-line no-empty
    } catch (e) { }
  }
  return null;
};

function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/* c8 ignore next 7 */
const getHashConfig = () => {
  const { hash } = window.location;
  if (!hash) return null;
  window.location.hash = '';

  const encodedConfig = hash.startsWith('#') ? hash.substring(1) : hash;
  return sanitizeHashConfig(parseEncodedConfig(encodedConfig));
};

const getInitialState = (defaultState, lsKey) => {
  const hashConfig = getHashConfig() ?? null;
  const mergedState = { ...defaultState };

  /* c8 ignore next 4 */
  if (hashConfig) {
    Object.assign(mergedState, hashConfig);
    return mergedState;
  }

  const lsState = loadStateFromLocalStorage(lsKey);
  if (lsState) Object.assign(mergedState, lsState);

  return mergedState;
};

const createReducer = (defaultState) => (state, action) => {
  switch (action.type) {
    case 'SET_VALUE':
      return { ...state, [action.prop]: action.value };
    case 'RESET_STATE':
      return { ...deepCopy(defaultState), reset: Date.now() };
    /* c8 ignore next 2 */
    default:
      return state;
  }
};

export const ConfiguratorContext = createContext();

export const ConfiguratorProvider = ({ children, defaultState = {}, lsKey = 'configuratorState' }) => {
  const reducer = createReducer(defaultState);
  const [state, dispatch] = useReducer(reducer, getInitialState(defaultState, lsKey));

  return html`
    <${ConfiguratorContext.Provider} value=${{ state, dispatch }}>
      ${children}
    </${ConfiguratorContext.Provider}>`;
};
