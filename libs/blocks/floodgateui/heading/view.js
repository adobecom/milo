import { html } from '../../../deps/htm-preact.js';
import { canRefresh, heading } from '../utils/state.js';
import { account } from '../../../tools/sharepoint/state.js';
import handleRefresh from './index.js';

export default function Heading() {
  return html`
    <div class=fgui-project-heading>
      <div class=fgui-project-heading-column>
        <h2 class=fgui-section-label>Project</h2>
        <div class=fgui-project-details-project>
          <span>${heading.value.name}</span>
          ${heading.value.editUrl
            && html`
              <a class=fgui-project-details-edit
                 href="${heading.value.editUrl}"
                 target="_blank">Edit</a>`}
          ${heading.value.name && html`
            <button class="fgui-project-details-refresh" onclick=${handleRefresh} style=${"cursor: pointer;"}>
              Refresh
            </button>
          `}
        </div>
      </div>
      <div class=fgui-project-heading-column>
        <h2 class=fgui-section-label>SOURCE CONTENT:</h2>
        <div class=fgui-project-details-name>
          <span>${heading.value.source}</span>
        </div>
      </div>
      <div class=fgui-project-heading-column>
        <h2 class=fgui-section-label>FLOODGATE CONTENT:</h2>
        <div class=fgui-project-details-name>
          <span>${heading.value.floodgate}</span>
        </div>
      </div>
      <div class=fgui-project-heading-column>
        <h2 class=fgui-section-label>LOGGED IN</h2>
        <div class=fgui-project-details-name>
          <span>${account.value.name}</span>
        </div>
      </div>
    </div>`;
}
