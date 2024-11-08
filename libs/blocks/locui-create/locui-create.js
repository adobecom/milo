import { html, render } from '../../deps/htm-preact.js';
import LocCreate from './create/view.js';

export default function init(el) {
  render(html`<${LocCreate} />`, el);
}
