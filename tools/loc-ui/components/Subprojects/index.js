import { html } from '../../../../libs/deps/htm-preact.js';
import SubprojectCard from './SubprojectCard.js';
import FlexContainer from '../FlexContainer.js';
import FlexItem from '../FlexItem.js';
import ActionButton from '../ActionButton.js';
import useFilterStr from '../../hooks/useFilterStr.js';
import { useProgressState } from '../../wrappers/ProgressStateWrapper.js';

import { colors, stateFuncs, moveStateForward } from '../utils.js';

export default function Subprojects({ showingSubproject, setShowingSubproject }) {
  const { regex, renderFilterInput } = useFilterStr();
  const { subprojectStates, allItems, states } = useProgressState();

  const locales = Object.keys(subprojectStates);
  const cards = locales
    .filter((locale) => regex.test(locale))
    .map((locale, index) => {
      const { itemsCnt, completeCnt, method } = subprojectStates[locale];
      const onClickHandler = (e) => {
        e.preventDefault();
        if (showingSubproject === locale) {
          setShowingSubproject(null);
          return;
        }
        setShowingSubproject(locale);
      };
      return html`<div class="mr-1" onClick=${onClickHandler}>
        <${SubprojectCard} language=${locale} itemsCnt=${itemsCnt} completeCnt=${completeCnt} method=${method} backgroundColor=${colors[index % 4]} />
      </div>`;
    });

  // FIXME: auto-do this when startProject
  const canSyncAllToENLangstore = allItems.some((item) => item.inENLangstore === false);
  const syncAllToENLangstoreHandler = () => {
    const clonedStates = structuredClone(states.value);
    clonedStates.allItems.forEach((item) => {
      item.inENLangstore = true;
    });
    Object.keys(clonedStates.subprojectStates).forEach((language) => {
      const locale = clonedStates.subprojectStates[language];
      const itemsMap = locale.items;
      Object.keys(itemsMap).forEach((url) => {
        const item = itemsMap[url];
        if (!stateFuncs.canCopy(item.status)) return;
        item.status = moveStateForward(item.status, language);
      });
    });
    states.value = clonedStates;
  };

  const canSendAllToGlaaS = allItems.every((item) => item.inENLangstore === true)
    && Object.keys(subprojectStates).some(
      (locale) => Object.keys(subprojectStates[locale].items).some(
        (item) => stateFuncs.canSendToGlaaS(subprojectStates[locale].items[item].status)));
  const sendAllToGlaasHandler = () => {
    const clonedStates = structuredClone(states.value);
    Object.keys(clonedStates.subprojectStates).forEach((language) => {
      const locale = clonedStates.subprojectStates[language];
      const itemsMap = locale.items;
      Object.keys(itemsMap).forEach((url) => {
        const item = itemsMap[url];
        if (!stateFuncs.canSendToGlaaS(item.status)) return;
        item.status = moveStateForward(item.status, language);
      });
    });
    states.value = clonedStates;
  };

  return html`<div>
    <h2>Sub-Projects</h2>
      ${renderFilterInput()}

    <div class='mt-1'>
      <${FlexContainer} extraClass=${['overflow-x-auto', 'flex-flow-no-wrap']} flexStart>
        ${cards}
      </${FlexContainer}>
    </div>
    
    <div class='mt-1'>
    <${FlexContainer} flexEnd>
      <${FlexItem} spacing=${4}>
        <div class='mr-1'>
          <${ActionButton} disabled=${!canSyncAllToENLangstore} onClick=${syncAllToENLangstoreHandler}>
            SYNC ALL TO EN LANGSTORE
          </${ActionButton}>
        </div>
      </${FlexItem}>
      <${FlexItem} spacing=${2}>
        <${ActionButton} disabled=${!canSendAllToGlaaS} onClick=${sendAllToGlaasHandler}>
          SEND ALL TO GLAAS
        </${ActionButton}>
      </${FlexItem}>
    </${FlexContainer}>
    </div>
    
    </div>`;
}
