import { html, render } from '../../deps/htm-preact.js';
import View from './view.js';
import loginToSharePoint from '../../utils/deps/login.js';
import { createHistoryTag } from './index.js';

export default async function init(el) {
  render(
    html`<${View} loginToSharePoint=${loginToSharePoint} createHistoryTag=${createHistoryTag}/>`, el);
}
