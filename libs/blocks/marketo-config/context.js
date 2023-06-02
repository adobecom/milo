import { createContext, html, useReducer } from '../../deps/htm-preact.js';
import { parseEncodedConfig } from '../../utils/utils.js';

const renameKeys = (obj, newKeys) => {
  const keyValues = Object.keys(obj).map((key) => {
    const newKey = newKeys[key] || key;
    return { [newKey]: obj[key] };
  });
  return Object.assign({}, ...keyValues);
};

export const saveStateToLocalStorage = (state, lsKey) => {
  localStorage.setItem(lsKey, JSON.stringify(state));
};

const getHashConfig = () => {
  const { hash } = window.location;
  if (!hash) return null;
  window.location.hash = '';

  const encodedConfig = hash.startsWith('#') ? hash.substring(1) : hash;
  return parseEncodedConfig(encodedConfig);
}

const getInitialState = (defaultState, lsKey) => {
  const hashConfig = getHashConfig() ?? null;
  const mergedState = { ...defaultState };

  if (hashConfig) {
    Object.assign(mergedState, hashConfig);
    return mergedState;
  }

  const lsState = localStorage.getItem(lsKey);
  if (lsState) {
    try {
      Object.assign(mergedState, JSON.parse(lsState));
    } catch (e) {
      // ignore
    }
  }

  return mergedState;
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_VALUE':
      return { ...state, [action.prop]: action.value };
    default:
      console.log('DEFAULT');
      return state;
  }
};

export const ConfiguratorContext = createContext();

export const ConfiguratorProvider = ({ children, defaultState = {}, lsKey = 'configuratorState' }) => {
  const [state, dispatch] = useReducer(reducer, getInitialState(defaultState, lsKey));

  return html`
    <${ConfiguratorContext.Provider} value=${{ state, dispatch }}>
      ${children}
    </ConfiguratorContext.Provider>`;
};
