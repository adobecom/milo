import { html } from '../../../../libs/deps/htm-preact.js';
import FlexContainer from '../FlexContainer.js';
import FlexItem from '../FlexItem.js';
import ActionButton from '../ActionButton.js';

function SubprojectCard({
  language,
  method,
  itemsCnt,
  completeCnt = 0,
  backgroundColor = '',
}) {
  const langLabel = html`<div>
    <div>LANGUAGE</div>
    <div>${language}</div>
  </div>`;
  const cntLabel = html`<div>
    <div>ITEMS/COMPLETE</div>
    <div>${itemsCnt}/${completeCnt}</div>
  </div>`;
  const methodLabel = html`<div>
    <div>METHOD</div>
    <div>${method}</div>
  </div>`;
  const actionButton = html`<${ActionButton}>
    SAVE ALL
  </${ActionButton}>`;

  let cls = 'subproject-card';

  return html`<div class=${cls} style=${`background-color: ${backgroundColor}`}>
    ${langLabel}
    ${cntLabel}
    ${methodLabel}
    <${FlexContainer} flexEnd>
      <${FlexItem}>
        ${actionButton}
      </${FlexItem}>
    </${FlexContainer}>
  </div>`;
}

export default SubprojectCard;
