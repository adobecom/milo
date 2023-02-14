import { html } from '../../../../libs/deps/htm-preact.js';
import GridContainer from '../GridContainer.js';
import GridItem from '../GridItem.js';
import WordIconButton from '../WordIconButton.js';
import GlobeIconButton from '../GlobeIconButton.js';
import ActionButton from '../ActionButton.js';
import useFilterStr from '../../hooks/useFilterStr.js';
import { loadStyle } from '../../../../libs/utils/utils.js';
import { actionToNextState, updateOneLocaleOneItem } from '../utils.js';
import { useProgressState } from '../../wrappers/ProgressStateWrapper.js';

loadStyle('components/SubprojectDetails/LocaleSummaryGrid.css');

export default function ItemGrid({ itemsMap, locale }) {
  const { regex, renderFilterInput } = useFilterStr();
  const { states } = useProgressState();

  return html`<div>${renderFilterInput()}
    <${GridContainer} extraCls=${['locale-summary-grid']}>
      <${GridItem} extraCls=${['url']}>
        <h5>SOURCE URL</h5>
      </${GridItem}>  
      <${GridItem} extraCls=${['edit']}>
        <h5>EDIT</h5>
      </${GridItem}>
      <${GridItem} extraCls=${['preview']}>
        <h5>PREVIEW</h5>
      </${GridItem}>
      <${GridItem} extraCls=${['progress']}>
        <h5>PROGRESS</h5>
      </${GridItem}>
      <${GridItem} extraCls=${['action']}>
        <h5>ACTION</h5>
      </${GridItem}>
      ${Object.keys(itemsMap)
        .filter((item) => regex.test(item))
        .map((item) => {
          const { url, sourceEditUrl, sourcePreviewUrl, status } = itemsMap[item];
          const action = actionToNextState(status);

          const sourceEditUrlOnClickHandler = () => {
            alert(sourceEditUrl);
          };
          const sourcePreviewOnClickHandler = () => {
            alert(sourcePreviewUrl);
          };
          const actionOnClickHandler = () => {
            updateOneLocaleOneItem(states, locale, item);
          };

          return html`
          <${GridItem} extraCls=${['url']}>
            ${url}
          </${GridItem}>
          <${GridItem} extraCls=${['edit']}>
            <${WordIconButton} onClick=${sourceEditUrlOnClickHandler} />
          </${GridItem}>
          <${GridItem} extraCls=${['preview']}>
            <${GlobeIconButton} onClick=${sourcePreviewOnClickHandler} />
          </${GridItem}>
          <${GridItem} extraCls=${['status']}>
            ${status}
          </${GridItem}>
          <${GridItem} extraCls=${['action']}>
            <${ActionButton} onClick=${actionOnClickHandler}>${action}</${ActionButton}>
          </${GridItem}>
        `;
        })}
    </${GridContainer}></div>`;
}
