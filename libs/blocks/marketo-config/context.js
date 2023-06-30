import { createContext, html, useReducer } from '../../deps/htm-preact.js';
import { parseEncodedConfig } from '../../utils/utils.js';

export const saveStateToLocalStorage = (state, lsKey) => {
  localStorage.setItem(lsKey, JSON.stringify(state));
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
  return parseEncodedConfig(encodedConfig);
};

const getInitialState = (defaultState, lsKey) => {
  const hashConfig = getHashConfig() ?? null;
  const mergedState = { ...defaultState };

  /* c8 ignore next 4 */
  if (hashConfig) {
    Object.assign(mergedState, hashConfig);
    return mergedState;
  }

  const lsState = localStorage.getItem(lsKey);
  if (lsState) {
    try {
      Object.assign(mergedState, JSON.parse(lsState));
      /* c8 ignore next 2 */
      // eslint-disable-next-line no-empty
    } catch (e) { }
  }

  return mergedState;
};

const createReducer = (defaultState) => (state, action) => {
  switch (action.type) {
    case 'SET_VALUE':
      return { ...state, [action.prop]: action.value };
    case 'RESET_STATE':
      return deepCopy(defaultState);
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
