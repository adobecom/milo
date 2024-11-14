import { html } from '../../../deps/htm-preact.js';

export default function StepControls({
  nextLabel = 'Next',
  backLabel = 'Back',
  onNext,
  onBack,
  enable = true,
}) {
  return html`
    <div class="locui-step-controls">
      ${onBack
      && html`<button class="s2-btn secondary" onclick=${onBack}>
        ${backLabel}
      </button>`}
      <div class="flex-1" />
      ${onNext
      && html`<button class=${`s2-btn ${enable ? 'accent' : 'secondary'}`} onclick=${onNext}>
        ${nextLabel}
      </button>`}
    </div>
  `;
}
