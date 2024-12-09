import { html } from '../../../deps/htm-preact.js';
import StepControls from '../components/stepControls.js';
import useInputActions from './index.js';
import { prevStep, project } from '../store.js';
import { LOCALIZATION_TYPES } from '../utils/constant.js';

function TranslateActions({ languageCount, handleActionSelect, handleWorkflowSelect }) {
  const tableHeaders = [`Languages (${languageCount})`,
    'Action',
    'Workflow type'];
  return html` <div class="table-wrapper table-translate">
        <table>
          <thead>
            <tr>
              ${tableHeaders.map((heading) => html`<th>${heading}</th>`)}
            </tr>
          </thead>
          <tbody>
            ${project.value.languages.map((entry) => html`
              <tr>
                <td>${entry.language}</td>
                <td>
                  <select
                    value=${entry.action || ''}
                    class="form-field-select"
                    onChange=${(e) => handleActionSelect(e, entry)}
                    name="actions"
                    id="actions"
                  >
                    <option value="English Copy">English Copy</option>
                    <option value="Translate">Translate</option>
                  </select>
                </td>
                <td>
                  <select
                    value=${entry.workflow || 'default'}
                    class="form-field-select"
                    onChange=${(e) => handleWorkflowSelect(e, entry)}
                    name="wf-type"
                    id="wf-type"
                  >
                    <option value="default">Default</option>
                    <option value="HybridMT">HybridMT</option>
                    <option value="Standard">Standard</option>
                  </select>
                </td>
              </tr>
            `)}
          </tbody>
        </table>
      </div>`;
}

function RolloutActions({ languageCount }) {
  const tableHeaders = [`Languages (${languageCount})`, 'Locales', 'Action'];
  return html` <div class="table-wrapper table-rollout">
  <table>
    <thead>
      <tr>
        ${tableHeaders.map((heading) => html`<th>${heading}</th>`)}
      </tr>
    </thead>
    <tbody>
      ${project.value.languages.map((entry) => html`
        <tr>
          <td>${entry.language}</td>
          <td>
           <div class="locale-list-container">
            ${entry?.locales ? entry.locales.map((locale) => html`
              <div class='locale-list-item'>${locale}</div>`) : 'No Locale found'}
           </div>
          </td>
          <td>
           Rollout
          </td>
        </tr>
      `)}
    </tbody>
  </table>
</div>`;
}

export default function InputActionsView() {
  const {
    languageCount,
    isFormValid,
    handleActionSelect,
    handleWorkflowSelect,
    projectCreatedModal,
  } = useInputActions();

  const handleNext = () => {
    if (isFormValid) {
      projectCreatedModal();
    }
  };

  return html`
  <div class="locui-form-container">
    <div class="locui-table">
      <h2 class="locui-project-type">${project.value.type === LOCALIZATION_TYPES.translation ? 'Translate' : 'Rollout'}</p>
      <p class="locui-project-name">
        Project Name: <strong>${project.value.name || 'n/a'}</strong>
      </p>
      ${project.value.type === LOCALIZATION_TYPES.translation ? html`<${TranslateActions} languageCount=${languageCount} handleActionSelect=${handleActionSelect} handleWorkflowSelect=${handleWorkflowSelect} />`
    : html`<${RolloutActions} languageCount=${languageCount} />`}
     
    </div>
    <div class="step-controls">
      <${StepControls}
        onBack=${prevStep}
        nextLabel="Create Project"
        onNext=${handleNext}
        nextDisabled=${!isFormValid}
      />
    </div>
  </div>
  `;
}
