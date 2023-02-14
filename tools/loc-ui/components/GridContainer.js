import { html } from '../../../libs/deps/htm-preact.js';

function GridContainer({ children, extraCls }) {
  let cls = `grid-container`;
  if (extraCls) {
    extraCls.forEach((extra) => {
      cls += ' ' + extra;
    });
  }
  return html`<div class=${cls}>${children}</div>`;
}

export default GridContainer;
