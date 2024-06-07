import { html } from '../../../deps/htm-preact.js';
import {
  urls,
  languages,
  allowSyncToLangstore,
  allowSendForLoc,
  allowRollout,
  allowCancelProject,
  projectCancelled,
  heading,
} from '../utils/state.js';
import {
  sendForLoc,
  showRolloutOptions,
  showRollout,
  rolloutAll,
  startSyncToLangstore,
  cancelLocProject,
} from './index.js';

export default function Actions() {
  const hasErrors = urls.value.filter((url) => url.valid !== undefined && !url.valid)?.length > 0;
  const canAct = allowSyncToLangstore.value
              || allowSendForLoc.value
              || allowRollout.value
              || allowCancelProject.value;
  const canActStyle = canAct ? 'locui-section-label' : 'locui-section-label is-invisible';
  const canReRollAll = languages.value.some((lang) => lang.status === 'completed');
  const canRollAll = languages.value.some((lang) => lang.status === 'translated');

  if (hasErrors) {
    return html`
      <div class=locui-section>
        <div class=locui-section-heading>
            <div>
              <h2 class="locui-section-label cancelled">Project has errors</h2>
              <i>Some URLs returned errors during validation. To create this project, please fix errors and try again.</i>
            </div>
        </div>
      </div>
    `;
  }

  if (projectCancelled.value) {
    return html`
      <div class=locui-section>
        <div class=locui-section-heading>
            <div>
              <h2 class="locui-section-label cancelled">Project Cancelled</h2>
              <i>Note: All processes have been stopped but documents were not deleted from SharePoint.</i>
            </div>
        </div>
      </div>
    `;
  }

  if (!languages?.value?.length) {
    return html`
      <div class=locui-section>
        <div class=locui-section-heading>
            <div>
              <h2 class="locui-section-label">No Languages Configured</h2>
              <i>To start a localization project languages need to be configured. Please select language preferences in the ${heading.value.editUrl ? html`
                  <a href="${heading.value.editUrl}" target="_blank">excel file</a>` : 'excel file'} to proceed.</i>
            </div>
        </div>
      </div>
    `;
  }

  return html`
    <div class=locui-section>
      <div class=locui-section-heading>
        <h2 class="${canActStyle}">Actions</h2>
      </div>
      <div class=locui-url-heading-actions>
        ${allowSyncToLangstore.value && html`
          <button
            onClick=${startSyncToLangstore}
            class=locui-urls-heading-action>
            Sync to Langstore <span>(${urls.value[0].langstore.lang})</span>
          </button>
        `}
        ${allowSendForLoc.value && html`
          <button
            onClick=${sendForLoc}
            class=locui-urls-heading-action>
            Start project
          </button>
        `}
        ${allowRollout.value && html`
          <div class=locui-url-heading-action-group>
            ${!showRolloutOptions.value && html`
              <button
                onClick=${showRollout}
                class=locui-urls-heading-action>
                Rollout all
              </button>
            `}
            ${showRolloutOptions.value && html`
              ${canRollAll && html`
                <button
                  onClick=${(e) => rolloutAll(e, false)}
                  class=locui-urls-heading-action>
                  Rollout all translated
                </button>
              `}
              ${canReRollAll && html`
                <button
                  onClick=${(e) => rolloutAll(e, true)}
                  class=locui-urls-heading-action>
                  Re-rollout all completed
                </button>
              `}
            `}
          </div>
        `}
        ${allowCancelProject.value && html`
          <button
            onClick=${() => cancelLocProject()}
            class="locui-urls-heading-action cancel">
            Cancel Project
          </button>
        `}
      </div>
    </div>
  `;
}
