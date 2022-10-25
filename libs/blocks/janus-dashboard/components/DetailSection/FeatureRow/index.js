import { html, useReducer } from '../../../../../deps/htm-preact.js';
import DetailRows from './DetailRows.js';
import CountRow from './CountRow.js';
import { filterByStatus } from '../../utils.js';
import GridContainer from '../../GridContainer.js';
import GridItem from '../../GridItem.js';

// manual enum again
export const ActionTypes = {
  SET_STATUS: 0,
  CLOSE_DETAIL: 1,
};
const initialState = { showDetail: false, status: null };
const reducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_STATUS:
      return { ...state, showDetail: true, status: action.payload };
    case ActionTypes.CLOSE_DETAIL:
      return { ...state, showDetail: false, status: null };
    default:
      return state;
  }
};

export default function FeatureRow({ data, feature }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const getSetStatusCB = (status) => () => {
    dispatch({ type: ActionTypes.SET_STATUS, payload: status });
  };
  const closeDetail = () => {
    dispatch({ type: ActionTypes.CLOSE_DETAIL });
  };
  const countRow = html`<${CountRow}
    feature=${feature}
    getSetStatusCB=${getSetStatusCB}
    closeDetail=${closeDetail}
    status=${state.status}
    showDetail=${state.showDetail}
  />`;
  const filteredData = filterByStatus(data, state.status);
  const detailRow = state.showDetail
    ? html`<${DetailRows} data=${filteredData} status=${state.status} />`
    : null;

  return html` <div>
    <div>${countRow}</div>
    <${GridContainer} spaceAround><${GridItem}>${detailRow}</${GridItem}><//>
  </div>`;
}
