import { html, render } from '../../deps/htm-preact.js';
import InputLocales from './input-locale/view.js';
import InputUrls from './input-urls/view.js';
import { currentStep } from './store.js';
import StepTracker from './components/stepTracker.js';
import InputActions from './input-actions/view.js';
import Header from '../milostudio-header/header.js';
import Sidenav from '../milostudio-sidenav/sidenav.js';

function Create() {
  return html`
    <div class="locui-create-container">
      <div class="header">
        <${Header} />
      </div> 
      <div class="side-nav">
        <${Sidenav} />
      </div>
      <div class="main-content">
        <h3>Create New Project</h2>
        <${StepTracker} />
        ${currentStep.value === 1 && html`<${InputUrls} />`}
        ${currentStep.value === 2 && html`<${InputLocales} />`}
        ${currentStep.value === 3 && html`<${InputActions} />`}
      </div>
    </div>
  `;
}

export default function init(el) {
  render(html`<${Create} />`, el);
}
