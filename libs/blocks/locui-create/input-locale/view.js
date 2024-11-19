import { html } from '../../../deps/htm-preact.js';
import { nextStep, prevStep, project } from '../store.js';
import StepControls from '../components/stepControls.js';

export default function InputLocales() {
  const errorPresent = false;
  function handleNext() {
    if (errorPresent) return;
    nextStep();
  }

  function handleBack() {
    prevStep();
  }

  return html`
    <div class="locui-form-container">
      <span>Project Name: ${project.value.name || 'n/a'}</span>
      <!-- set enable based on the errors present -->
      <div>
        <${StepControls} enable=${!errorPresent} onNext=${handleNext} onBack=${handleBack} />
      </div>
    </div>
  `;
}
