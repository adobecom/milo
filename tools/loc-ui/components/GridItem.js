import { html } from '../../../libs/deps/htm-preact.js';
import { loadStyle } from '../../../libs/utils/utils.js';

loadStyle('components/GridItem.css');

function GridItem({ children, extraCls }) {
  let cls = `grid-item`;
  if (extraCls) {
    extraCls.forEach((extra) => {
      cls += ' ' + extra;
    });
  }
  return html`<div class=${cls}>${children}</div>`;
}

export default GridItem;
