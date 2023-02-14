import { html } from '../../../libs/deps/htm-preact.js';
import { loadStyle } from '../../../libs/utils/utils.js';

loadStyle('components/SmallLoader.css');

export default function SmallLoader({ color }) {
  return html` <div class="loader-container-small">
    <div class=${`small-loader ${color}`}></div>
  </div>`;
}
