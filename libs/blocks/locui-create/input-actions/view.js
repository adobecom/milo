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
  console.log('project', project.value);
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
    <div class="locui-table">
      <p>Project Name: <strong>${project.value.name || 'n/a'}</strong></p>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              ${tabelHeaders.map((heading) => html` <th>${heading}</th> `)}
            </tr>
          </thead>
          <tbody>
            ${project.value.locale.map(
              (entry) => html`
                <tr>
                  <td>${entry.languages}</td>
                  <td>${entry.locales.join(', ')}</td>
                  <td>
                    <select name="actions" id="actions">
                      <option value="english-copy">English Copy</option>
                      <option value="rollout">Rollout</option>
                      <option value="translate">Translate</option>
                    </select>
                  </td>
                  <td>
                    <select name="wf-type" id="wf-type">
                      <option value="default">Default</option>
                      <option value="hybrid">Hybrid MT</option>
                      <option value="standard">Standard</option>
                    </select>
                  </td>
                </tr>
              `
            )}
          </tbody>
        </table>
      </div>
      <${StepControls}
        onBack=${prevStep}
        nextLabel=${'Create Project'}
        onNext=${projectCreatedModal}
      />
    </div>
  `;
}
