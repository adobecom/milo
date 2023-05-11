import { html } from '../../deps/htm-preact.js';

function StepIndicator({ currentStep, totalSteps, prevStepIndicator = [] }) {
  const dotIndicators = html`
    <div class="dot-indicators ${totalSteps > 3 ? 'dot-indicators--wide' : ''}">
      ${Array.from({ length: totalSteps }).map((_, index) => {
    let className;
    switch (true) {
      case index === currentStep:
        className = 'current';
        break;
      case prevStepIndicator.includes(index):
        className = 'prev';
        break;
      default:
        className = 'future';
    }
    return html`<div class="dot ${className}"></div>`;
  })}
    </div>
  `;
  return dotIndicators;
}

export default StepIndicator;
