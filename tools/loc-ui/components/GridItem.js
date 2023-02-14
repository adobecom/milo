import { html } from '../../../libs/deps/htm-preact.js';

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
