import { html, useEffect } from '../../../deps/htm-preact.js';
import { autoSetup, setup } from './index.js';
import { showLogin, heading, languages, urls } from '../utils/state.js';
import { account } from '../../../tools/sharepoint/state.js';

import Heading from '../heading/view.js';
import Langs from '../langs/view.js';
import Actions from '../actions/view.js';
import Urls from '../urls/view.js';
import Status from '../status/view.js';

export default function Localization() {
  useEffect(() => { autoSetup(); }, []);
  if (!account.value.username) {
    return html`
      <h1>Milo Localization</h1>
      ${showLogin.value && html`
        <p>The login popup was blocked.<br/>Please use the button below.</p>
        <button class=loc-action onClick="${setup}">Open login</button>
      `}
    `;
  }

  return html`
    <h1>Milo Localization</h1>
    ${heading.value.editUrl && html`<${Heading} />`}
    ${languages.value.length > 0 && html`<${Langs} />`}
    ${urls.value.length > 0 && html`<${Actions} />`}
    ${urls.value.length > 0 && html`<${Urls} />`}
    <${Status} />`;
}
