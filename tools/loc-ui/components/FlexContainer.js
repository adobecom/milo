import { html } from '../../../libs/deps/htm-preact.js';

function FlexContainer({ children, spaceAround, spaceBetween, flexEnd }) {
  let cls = `flex-container`;
  if (spaceAround) cls += ' space-around';
  if (spaceBetween) cls += 'space-between';
  if (flexEnd) cls += ' flex-end';
  return html`<ul class=${cls}>
    ${children}
  </ul>`;
}

export default FlexContainer;
