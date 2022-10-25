import { html, useContext } from '../../../../deps/htm-preact.js';
import { PreprocessContext } from '../../wrappers/PreprocessWrapper.js';
import GridContainer from '../GridContainer.js';
import GridItem from '../GridItem.js';
import { FilterContext, ActionTypes } from '../../wrappers/FilterWrapper.js';
import Clickable from '../Clickable.js';

function SummaryRow() {
  const data = useContext(PreprocessContext);
  const { dispatch } = useContext(FilterContext);
  const { totalCnt, totalFailedCnt, totalPassedCnt } = data;
  const getOnClickStatus = (status) => () => {
    dispatch({ type: ActionTypes.SET_STATE, payload: { status, showDetail: true, team: null } });
  };
  return html`<div class="section-divider">
    <${GridContainer} spaceAround
      ><${GridItem}>
        <div class="summary-big-num">
          <div class="title">Total</div>
          <div class="num"><${Clickable} onClick=${getOnClickStatus(null)}>${totalCnt}</${Clickable}></div>
        </div> <//
      ><${GridItem}
        ><div class="summary-big-num">
          <div class="title">Passed</div>
          <div class="num"><${Clickable} onClick=${getOnClickStatus('passed')}>${totalPassedCnt}</${Clickable}></div>
        </div> <//
      ><${GridItem}>
        <div class="summary-big-num">
          <div class="title">Failed</div>
          <div class="num"><${Clickable} onClick=${getOnClickStatus('failed')}>${totalFailedCnt}</${Clickable}></div>
        </div>
      <//><//
    >
  </div>`;
}

export default SummaryRow;
