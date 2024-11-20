import { html } from '../../../deps/htm-preact.js';
import { prevStep, project } from '../store.js';
import StepControls from '../components/stepControls.js';
import projectCreatedModal from './index.js';

const tabelHeaders = ['Languages', 'Locales', 'Action', 'Workflow type'];

export default function InputActions() {
  const handleActionSelect = (ev, entry) => {
    // console.log("Action", ev.target.value, entry)
    entry.action = ev.target.value;
  };

  const handleWorkflowSelect = (ev, entry) => {
    // console.log("Workflow", ev, entry)
    entry.workflow = ev.target.value;
  };

  const handleNext = () => {
    projectCreatedModal();
  };

  return html`
  <div class="locui-form-container">
    <div class="locui-table">
      <p class="locui-project-name">Project Name: <strong>${project.value.name || 'n/a'}</strong></p>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              ${tabelHeaders.map((heading) => (html`
                <th>${heading}</th>
              `))}
            </tr>
          </thead>
          <tbody>
            ${project.value.locale.map((entry) => (html`
              <tr>
                <td>${entry.languages}</td>
                <td>
                  <!-- ${entry.localeList.map((locale) => html`
                    <button class="locale-list-item">${locale}</button>
                  `)} -->
                  ${entry.localeList.join(', ')}
                </td>
                <td>
                  <select 
                    value=${entry.action}
                    class="form-field-select" 
                    onChange=${(e) => handleActionSelect(e, entry)}
                    name="actions" 
                    id="actions"
                  >
                    <option value="" disabled selected hidden>Select</option>
                    <option value="English Copy">English Copy</option>
                    <option value="Rollout">Rollout</option>
                    <option value="Translate">Translate</option>
                  </select>
                </td>
                <td>
                  <select 
                    value=${entry.workflow}
                    class="form-field-select" 
                    onChange=${(e) => handleWorkflowSelect(e, entry)}
                    name="wf-type" 
                    id="wf-type"
                  >
                    <option value="" disabled selected hidden>Select</option>
                    <option value="HybridMT">HybridMT</option>
                    <option value="Standard">Standard</option>
                  </select>  
                </td>
              </tr>  
            `))}
          </tbody>
        </table>
      </div>
    </div>
    <div class="step-controls">
      <${StepControls} 
        onBack=${prevStep} 
        nextLabel=${'Create Project'}
        onNext=${handleNext}
      />
    </div>
  </div>
`;
}
