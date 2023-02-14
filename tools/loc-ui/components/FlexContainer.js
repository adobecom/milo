import { html } from '../../../libs/deps/htm-preact.js';
import { loadStyle } from '../../../libs/utils/utils.js';

loadStyle('components/FlexContainer.css');

function FlexContainer({ children, spaceAround, spaceBetween, flexEnd, flexStart, extraClass }) {
  let cls = `flex-container`;
  if (spaceAround) cls += ' space-around';
  if (spaceBetween) cls += ' space-between';
  if (flexEnd) cls += ' flex-end';
  if (flexStart) cls += ' flex-start';

  if (extraClass) {
    extraClass.forEach((c) => {
      cls += ` ${c}`;
    });
  }

  return html`<ul class=${cls}>
    ${children}
  </ul>`;
}

export default FlexContainer;
