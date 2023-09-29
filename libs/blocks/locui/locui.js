import { html, render } from '../../deps/htm-preact.js';
import Localization from './loc/view.js';

export default function init(el) {
  // a meaningless comment
  render(html`<${Localization} />`, el);
}
