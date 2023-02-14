import { html } from '../../../libs/deps/htm-preact.js';
import { loadStyle } from '../../../libs/utils/utils.js';

loadStyle('components/FlexItem.css');

function FlexItem({ children, centered, spacing = 1 }) {
  let cls = 'flex-item';
  if (spacing && spacing > 1) cls += `-${spacing}`;
  if (centered) cls += ' text-centered';
  return html`<li class=${cls}>${children}</li>`;
}

export default FlexItem;
