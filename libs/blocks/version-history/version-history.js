import { html, render } from '../../deps/htm-preact.js';
import loginToSharePoint from '../../tools/sharepoint/login.js';
import { createHistoryTag } from './index.js';
import View from './view.js';

export default async function init(el) {
  if (window.self === window.top) {
    document.body.classList.add('in-page');
  }

  render(
    html`<${View} loginToSharePoint=${loginToSharePoint} createHistoryTag=${createHistoryTag}/>`, el);
}
