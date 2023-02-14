import { html } from '../../../../libs/deps/htm-preact.js';
import FlexContainer from '../FlexContainer.js';
import FlexItem from '../FlexItem.js';
import ActionButton from '../ActionButton.js';
import { loadStyle } from '../../../../libs/utils/utils.js';

loadStyle('components/Subprojects/subprojectcardstyle.css');

function SubprojectCard({ language, method, itemsCnt, completeCnt = 0, backgroundColor = '' }) {
  const langLabel = html`<div>
    <h5>LANGUAGE</h5>
    <h2>${language.toUpperCase()}</h2>
  </div>`;
  const cntLabel = html`<div>
    <h5>ITEMS/COMPLETE</h5>
    <h3>${itemsCnt}/${completeCnt}</dih3v>
  </div>`;
  const methodLabel = html`<div>
    <h5>METHOD</h5>
    <h3>${method}</h3>
  </div>`;

  const onClickHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const actionButton = html`<${ActionButton} onClickHandler=${onClickHandler}>
    Expand
  </${ActionButton}>`;

  let cls = 'subproject-card';

  return html`<div class=${cls} style=${`background-color: ${backgroundColor}`}>
    ${langLabel}
    ${cntLabel}
    ${methodLabel}
    <${FlexContainer} flexEnd>
      <${FlexItem} spacing=${4}>
        ${actionButton}
      </${FlexItem}>
    </${FlexContainer}>
  </div>`;
}

export default SubprojectCard;
