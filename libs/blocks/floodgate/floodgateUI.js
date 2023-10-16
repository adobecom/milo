import { html, render } from '../../deps/htm-preact.js';
import Floodgate from './floodgate/view.js';

export default function init(el) {
  render(html`<${Floodgate} />`, el);
}
