import { html, render, useEffect, useState } from '../../deps/htm-preact.js';
import InputLocales from './input-locale/view.js';
import InputUrls from './input-urls/view.js';
import {
  currentStep,
  env,
  fetchDraftProject,
  fetchLocaleDetails,
  getUserToken,
  loading,
  project,
} from './store.js';
import StepTracker from './components/stepTracker.js';
import InputActions from './input-actions/view.js';
import Header from '../milostudio-header/milostudio-header.js';
import Sidenav from '../milostudio-sidenav/sidenav.js';
import { getConfig, loadStyle } from '../../utils/utils.js';
import { getEnvQueryParam } from './utils/utils.js';
import Toast from './components/toast.js';

function Create() {
  const [toast, setToast] = useState({ type: '', message: '' });

  useEffect(() => {
    const setup = async () => {
      try {
        await fetchLocaleDetails();
        await getUserToken();
        env.value = getEnvQueryParam();

        /* Fetch draft project if project key is found in url params */
        const searchParams = new URLSearchParams(window.location.search);
        const projectKey = searchParams.get('projectKey');
        if (projectKey) {
          const error = await fetchDraftProject(projectKey);
          if (error) {
            setToast({ type: 'error', message: error });
          } else {
            setToast({
              type: 'info',
              message: `Project ${project.value.name} fetched succesfully.`,
            });
          }
        }
      } catch (error) {
        // console.error('Error fetching locale details:', error);
      }
    };

    setup();
  }, []);

  return html`
    <div class="locui-create-container">
      <div class="header">
        <${Header} />
      </div>
      <div class="side-nav">
        <${Sidenav} />
      </div>
      <div class="main-content">
        <h3>Create New Project</h3>
        <${StepTracker} />
        ${currentStep.value === 1 && html`<${InputUrls} />`}
        ${currentStep.value === 2 && html`<${InputLocales} />`}
        ${currentStep.value === 3 && html`<${InputActions} />`}
      </div>

      ${loading.value
      && html`<div class="fullscreen-loader">
        <div class="locui-create-loader" />
      </div>`}
      
      ${toast.message
      && html`
        <${Toast}
          message=${toast.message}
          type=${toast.type}
          onClose=${() => setToast({ ...toast, message: '' })}
        />
      `}
    </div>
  `;
}

export default function init(el) {
  const { miloLibs, codeRoot } = getConfig();
  const base = miloLibs || codeRoot;
  loadStyle(`${base}/blocks/milostudio-header/milostudio-header.css`);
  render(html`<${Create} />`, el);
}
