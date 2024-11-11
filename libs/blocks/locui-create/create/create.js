import { html } from '../../../deps/htm-preact.js';
import InputLocales from './inputLocales.js';
import InputUrls from './inputUrls.js';
import { currentStep } from './state.js';
import StepTracker from './stepTraker.js';
import InputActions from './inputActions.js';
import Header from '../components/header.js';
import Sidenav from '../components/sidenav.js';

export default function Create() {
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
