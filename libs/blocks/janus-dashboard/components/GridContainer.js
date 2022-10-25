import { html } from '../../../deps/htm-preact.js';

function GridContainer({ children, spaceAround, flexEnd }) {
  return html`<ul
    class=${`grid-container${spaceAround ? ' space-around' : ''}${flexEnd ? ' flex-end' : ''}`}
  >
    ${children}
  </ul>`;
}

export default GridContainer;
