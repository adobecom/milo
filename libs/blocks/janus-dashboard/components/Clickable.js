import { html } from '../../../deps/htm-preact.js';

function Clickable({ children, onClick, color }) {
  return html`<span class=${`clickable${color ? ` ${color}` : ''}`} onClick=${onClick}
    >${children}</span
  >`;
}

export default Clickable;
