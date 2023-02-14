import { html } from '../../../../libs/deps/htm-preact.js';
import SubprojectCard from './SubprojectCard.js';
import FlexContainer from '../FlexContainer.js';
import FlexItem from '../FlexItem.js';

// TODO: confirm color
const colors = ['#E9E9E9', '#FED3E9', '#F8F786', '#B1D9F5'];
// FIXME: use data
const locales = [
  {
    language: 'de',
    itemsCnt: 11,
    method: 'Human',
  },
  {
    language: 'pt',
    itemsCnt: 164,
    completeCnt: 56,
    method: 'Machine + Human',
  },
  {
    language: 'en-gb',
    itemsCnt: 263,
    method: 'Alternate Language',
  },
  {
    language: 'en',
    itemsCnt: 45,
    method: 'Copy',
  },
];
export default function Subprojects() {
  const cards = locales.map(
    ({ language, itemsCnt, completeCnt, method }, index) => html`<${FlexItem}>
      <${SubprojectCard}
        language=${language}
        itemsCnt=${itemsCnt}
        completeCnt=${completeCnt}
        method=${method}
        backgroundColor=${colors[index % 4]}
      />
    </${FlexItem}>`,
  );
  return html`<${FlexContainer}>
      ${cards}
    </${FlexContainer}>`;
}
