import { html } from '../../../deps/htm-preact.js';
import { prevStep, project } from '../store.js';
import StepControls from '../components/stepControls.js';
import projectCreatedModal from './index.js';

const tabelHeaders = ['Languages', 'Locales', 'Action', 'Workflow type'];

// replaced by project.value data
const tableEntries = [
  {
    languages: 'Chinese',
    locales: ['cn'],
  },
  {
    languages: 'English',
    locales: ['it_en', 'ae_en'],
  },
  {
    languages: 'French',
    locales: ['fr', 'be_fr'],
  },
  {
    languages: 'German',
    locales: ['de'],
  },
  {
    languages: 'Italian',
    locales: ['ch_it'],
  },
  {
    languages: 'Japanese',
    locales: ['jp'],
  },
  {
    languages: 'Japanese',
    locales: ['jp'],
  },
];

export default function InputActions() {
  const handleCreateProject = () => {};
  return html`
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
          `))}
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
