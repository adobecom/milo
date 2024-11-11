import { html } from '../../../deps/htm-preact.js';
import { prevStep, project } from './state.js';
import StepControls from './stepControls.js';

export default function InputActions() {
  return html`
  <div>
    <table>
      <tbody>
        ${Object.entries(project.value).map(
    ([key, value]) => html`
            <tr>
              <td style=${{ textAlign: 'end', color: '#999' }}><i>${key}</i></td>
              <td class="pl-8">${value.toString()}</td>
            </tr>
          `,
  )}
      </tbody>
    </table>
    <${StepControls} onBack=${prevStep} />
  </div>
`;
}
