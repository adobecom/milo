import { html, useContext } from '../../../../deps/htm-preact.js';
import Card from '../Card.js';
import SummaryRow from './SummaryRow.js';
import TeamRow from './TeamRow.js';
import { FilterContext, ActionTypes } from '../../wrappers/FilterWrapper.js';
import GridContainer from '../GridContainer.js';
import GridItem from '../GridItem.js';
import Button from '../Button.js';

export default function SummarySection() {
  const { dispatch } = useContext(FilterContext);
  const toggleDetails = () => {
    dispatch({ type: ActionTypes.TOGGLE_SHOW_DETAIL });
  };
  return html`
    <div class="section-divider">
      <${Card}>
        <${SummaryRow} />
        <${TeamRow} />
        <${GridContainer} flexEnd>
          <${GridItem}>
          <div style='margin-top: 2em'></div>
            <${Button} onClick=${toggleDetails}>
              Toggle Details
            </${Button}>
          </${GridItem}>
        </${GridContainer}>
      <//>
    </div>
  `;
}
