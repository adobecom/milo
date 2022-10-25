import { html, useReducer, createContext } from '../../../deps/htm-preact.js';

// manual enum
export const ActionTypes = {
  SET_SHOW_DETAIL: 0,
  SET_STATE: 1,
  TOGGLE_SHOW_DETAIL: 2,
};

const initialState = {
  showDetail: false,
  status: null,
  team: null,
  feature: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_SHOW_DETAIL:
      return { ...state, showDetail: action.payload };
    case ActionTypes.TOGGLE_SHOW_DETAIL:
      return { ...state, showDetail: !state.showDetail };
    case ActionTypes.SET_STATE:
      return Object.keys(action.payload).reduce(
        (acc, currKey) => ({ ...acc, [currKey]: action.payload[currKey] }),
        { ...state },
      );
    default:
      return state;
  }
};

export const FilterContext = createContext();

function FilterWrapper({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  console.log({ filterState: state });
  return html` <${FilterContext.Provider} value=${{ state, dispatch }}> ${children} <//> `;
}

export default FilterWrapper;
