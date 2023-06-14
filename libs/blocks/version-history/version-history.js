import { html, render } from '../../deps/htm-preact.js';
import View from './view.js';
import loginToSharePoint from '../../utils/deps/login.js';
import { createHistoryTag } from './index.js';

export default async function init(el) {
  if (window.self === window.top) {
    document.body.classList.add('in-page');
  }

  render(
    html`<${View} loginToSharePoint=${loginToSharePoint} createHistoryTag=${createHistoryTag}/>`, el);
}
