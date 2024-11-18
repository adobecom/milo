import { html } from '../../../deps/htm-preact.js';
import { prevStep, project, setProject } from '../store.js';
import StepControls from '../components/stepControls.js';
import projectCreatedModal from './index.js';

const tabelHeaders = ['Languages', 'Locales', 'Action', 'Workflow type'];

// replaced by project.value data
const tableEntries = [
  {
    languages: 'Chinese',
    locales: ['cn'],
    action: '',
    workflow: '',
  },
  {
    languages: 'English',
    locales: ['it_en', 'ae_en'],
    action: '',
    workflow: '',
  },
  {
    languages: 'French',
    locales: ['fr', 'be_fr'],
    action: '',
    workflow: '',
  },
  {
    languages: 'German',
    locales: ['de'],
    action: '',
    workflow: '',
  },
  {
    languages: 'Italian',
    locales: ['ch_it'],
    action: '',
    workflow: '',
  },
  {
    languages: 'Japanese',
    locales: ['jp'],
    action: '',
    workflow: '',
  },
  {
    languages: 'Japanese',
    locales: ['jp'],
    action: '',
    workflow: '',
  },
];

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
    // console.log(tableEntries)
    setProject({ tableEntries });
    projectCreatedModal();
  };

  return html`
  <div class="locui-form-container">
    <div class="locui-table">
      <p>Project Name: <strong>${project.value.name || 'n/a'}</strong></p>
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
            ${tableEntries.map((entry) => (html`
              <tr>
                <td>${entry.languages}</td>
                <td>
                  ${entry.locales.map((locale) => html`
                    <button class="locale-list-item">${locale}</button>
                  `)}
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
