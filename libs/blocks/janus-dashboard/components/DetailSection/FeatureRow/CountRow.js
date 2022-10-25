import { html, useContext, useState } from '../../../../../deps/htm-preact.js';
import { FilterContext } from '../../../wrappers/FilterWrapper.js';
import { PreprocessContext } from '../../../wrappers/PreprocessWrapper.js';
import GridContainer from '../../GridContainer.js';
import GridItem from '../../GridItem.js';
import { EXPECTED } from '../../constants.js';
import { filterByTeam, filterByFeature } from '../../utils.js';
import Clickable from '../../Clickable.js';

export default function CountRow({ feature, getSetStatusCB, status, closeDetail, showDetail }) {
  const { flattened } = useContext(PreprocessContext);
  const { state: filterState } = useContext(FilterContext);
  const { team } = filterState;
  let total = 0;
  let passed = 0;
  const filteredData = filterByTeam(flattened, team);
  filterByFeature(filteredData, feature).forEach((test) => {
    if (test.search.status === 'passed') {
      passed += 1;
    }
    total += 1;
  });
  const failed = total - passed;
  return html`
    <${GridContainer}>
      <${GridItem}>
        <span class="feature-row-head">${feature}</span>
      </${GridItem}>
      <${GridItem}>
        <${Clickable} 
          onClick=${status == null && showDetail ? closeDetail : getSetStatusCB(null)}
        >
          ${total}
          ${status === null && showDetail ? html`<hr />` : null}
        </${Clickable}>
      </${GridItem}>
      <${GridItem}>
        <${Clickable} 
          onClick=${status === 'passed' && showDetail ? closeDetail : getSetStatusCB('passed')}
        >
          ${passed}
          ${status === 'passed' && showDetail ? html`<hr />` : null}
        </${Clickable}>
      </${GridItem}>
      <${GridItem}>
        <${Clickable} 
          onClick=${status === 'failed' && showDetail ? closeDetail : getSetStatusCB('failed')}
        >
          ${failed}
          ${status === 'failed' && showDetail ? html`<hr />` : null}
        </${Clickable}>
      </${GridItem}>
    <//>`;
}
