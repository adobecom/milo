import { html } from '../../../deps/htm-preact.js';
import { currentStep } from './state.js';

const STEPS = ['Enter URL(s)', 'Select Language(s)', 'Action'];

export default function StepTracker({ steps = STEPS }) {
  return html`
    <div class="locui-step-tracker row">
      ${steps.map(
    (step, i) => html`
          <div key=${step}>
            ${i > 0 && html`<span class="step-chevron">></span>`}
            <span class=${currentStep.value >= i + 1 ? 'step-active' : ''}
              >${step}</span
            >
          </div>
        `,
  )}
    </div>
  `;
}
