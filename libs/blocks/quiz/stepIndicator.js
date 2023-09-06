import { html } from '../../deps/htm-preact.js';

function StepIndicator({
  currentStep,
  totalSteps,
  prevStepIndicator = [],
  bottom = false,
  top = false,
}) {
  const quizSteps = html`
    <div class="quiz-step-container${totalSteps > 3 ? ' wide' : ''}${top ? ' top' : ''}${bottom ? ' bottom' : ''}">
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
    return html`<div class="quiz-step ${className}"></div>`;
  })}
    </div>
  `;
  return quizSteps;
}

export default StepIndicator;
