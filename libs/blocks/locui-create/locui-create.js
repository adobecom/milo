import { html, render } from '../../deps/htm-preact.js';
import Create from './create/view.js';

export default function init(el) {
  render(html`<${Create} />`, el);
}
