import { html } from '../../../deps/htm-preact.js';

export default function StepControls({
  nextLabel = 'Next',
  backLabel = 'Back',
  nextDisabled,
  backDisabled,
  onNext,
  onBack,
}) {
  return html`
    <div class="locui-step-controls">
      ${onBack &&
      html`<button
        class=${`s2-btn secondary ${backDisabled && 'disabled'}`}
        onclick=${onBack}
      >
        ${backLabel}
      </button>`}
      <div class="flex-1" />
      ${onNext &&
      html`<button
        class=${`s2-btn accent ${nextDisabled && 'disabled'}`}
        onclick=${onNext}
      >
        ${nextLabel}
      </button>`}
    </div>
  `;
}
