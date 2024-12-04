import { html } from '../../../deps/htm-preact.js';
import StepControls from '../components/stepControls.js';
import useInputActions from './index.js';
import { prevStep } from '../store.js';

export default function InputActionsView() {
  const {
    project,
    languageCount,
    isFormValid,
    handleActionSelect,
    handleWorkflowSelect,
    projectCreatedModal,
  } = useInputActions();

  const tabelHeaders = [
    `Languages (${languageCount})`,
    'Locales',
    'Action',
    'Workflow type',
  ];

  const handleNext = () => {
    if (isFormValid) {
      projectCreatedModal();
    }
  };
  return html`
  <div class="locui-form-container">
    <div class="locui-table">
      <p class="locui-project-name">
        Project Name: <strong>${project.value.name || 'n/a'}</strong>
      </p>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              ${tabelHeaders.map((heading) => html`<th>${heading}</th>`)}
            </tr>
          </thead>
          <tbody>
            ${project.value.languages.map((entry) => html`
              <tr>
                <td>${entry.language}</td>
                <td>${entry.locales.join(', ')}</td>
                <td>
                  <select
                    value=${entry.action || ''}
                    class="form-field-select"
                    onChange=${(e) => handleActionSelect(e, entry)}
                    name="actions"
                    id="actions"
                  >
                    <option value="" disabled hidden>Select</option>
                    <option value="English Copy">English Copy</option>
                    <option value="Rollout">Rollout</option>
                    <option value="Translate">Translate</option>
                  </select>
                </td>
                <td>
                  <select
                    value=${entry.workflow || ''}
                    class="form-field-select"
                    onChange=${(e) => handleWorkflowSelect(e, entry)}
                    name="wf-type"
                    id="wf-type"
                  >
                    <option value="" disabled hidden>Select</option>
                    <option value="HybridMT">HybridMT</option>
                    <option value="Standard">Standard</option>
                  </select>
                </td>
              </tr>
            `)}
          </tbody>
        </table>
      </div>
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
