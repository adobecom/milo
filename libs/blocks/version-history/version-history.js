import { html, render } from '../../deps/htm-preact.js';
import View from './view.js';

export default function init(el) {
  render(html`<${View}/>`, el);
}
