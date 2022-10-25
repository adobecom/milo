import { html } from '../../../deps/htm-preact.js';
import GridContainer from './GridContainer.js';
import GridItem from './GridItem.js';

export default function Loader() {
  return html`<div class="loader-container">
    <${GridItem}>
      <div class="loader-text">Loading...</div>
    <//>
  <//>`;
}
