import { html } from '../../../../libs/deps/htm-preact.js';
import { useProgressState } from '../../wrappers/ProgressStateWrapper.js';
import ItemGrid from './ItemGrid.js';
import FlexContainer from '../FlexContainer.js';
import FlexItem from '../FlexItem.js';
import ActionButton from '../ActionButton.js';
import { loadStyle } from '../../../../libs/utils/utils.js';
import { colors, stateFuncs, updateOneLocaleAllItems } from '../utils.js';

loadStyle('components/SubprojectDetails/LocaleSummaryBlock.css');

export default function SubprojectDetails({ locale }) {
  const { subprojectStates, states } = useProgressState();
  const backgroundColor = colors[Object.keys(subprojectStates).indexOf(locale) % 4];
  const localeState = subprojectStates[locale];
  const itemsMap = localeState.items;
  const method = localeState.method;
  const rolloutLocales = localeState.rolloutLocales;

  const canSendAllToGlaaS = Object.keys(itemsMap).some((item) => stateFuncs.canSendToGlaaS(itemsMap[item].status));
  const sendAllToGlaaSHandler = () => {
    updateOneLocaleAllItems(states, locale, stateFuncs.canSendToGlaaS);
  };

  const canRolloutAll = Object.keys(itemsMap).some((item) => stateFuncs.canRollout(itemsMap[item].status));
  const rolloutAllHandler = () => {
    updateOneLocaleAllItems(states, locale, stateFuncs.canRollout);
  };

  const canSaveAll = Object.keys(itemsMap).some((item) => stateFuncs.canSave(itemsMap[item].status));
  const saveAllHandler = () => {
    updateOneLocaleAllItems(states, locale, stateFuncs.canSave);
  };

  const headerRow = html`
    <${FlexContainer} spaceBetween>
      <${FlexItem} spacing=${1}>
        <h5>LANGUAGE</h5><h2>${locale.toUpperCase()}</h2>
      </${FlexItem}>
      <${FlexItem} spacing=${2}>
        <h5>METHOD</h5><h3>${method}</h3>
      </${FlexItem}>
      <${FlexItem} spacing=${2}>
        <${ActionButton} disabled=${!canSendAllToGlaaS} onClick=${sendAllToGlaaSHandler}>SEND ALL TO GLAAS</${ActionButton}>
      </${FlexItem}>
      <${FlexItem} spacing=${3}>
        <${ActionButton} disabled=${!canSaveAll} onClick=${saveAllHandler}>SAVE TO ${locale.toUpperCase()} LANGSTORE</${ActionButton}>
      </${FlexItem}>
      <${FlexItem} spacing=${2}>
        <${ActionButton} disabled=${!canRolloutAll} onClick=${rolloutAllHandler}>ROLLOUT ALL</${ActionButton}>
      </${FlexItem}>
    </${FlexContainer}>`;
  const rolloutLocaleStr = JSON.stringify(rolloutLocales, null, 1).replace(/"/g, '').replace(/^\[/, '').replace(/\]$/, '');
  const rolloutLocalesRow = html`<div>
    <div>
      <h5>ROLLOUT LOCALES <span class="clickable">EDIT</span></h5>
    </div>
    <h3>${rolloutLocaleStr}</h3>
  </div>`;

  return html`<div class=${'locale-summary-block'} style=${`background-color: ${backgroundColor}`}>
    ${headerRow} ${rolloutLocalesRow}
    <${ItemGrid} itemsMap=${itemsMap} locale=${locale} />
  </div>`;
}
