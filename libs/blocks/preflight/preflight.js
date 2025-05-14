import { html, render, signal } from '../../deps/htm-preact.js';
import { createTag, getConfig } from '../../utils/utils.js';
import General from './panels/general.js';
import SEO from './panels/seo.js';
import Accessibility from './panels/accessibility.js';
import Martech from './panels/martech.js';
import Performance from './panels/performance.js';
import Assets from './panels/assets.js';

const HEADING = 'Milo Preflight';
const IMG_PATH = '/blocks/preflight/img';

const CHECK_API = 'https://spacecat.experiencecloud.live/api/ci';
const CHECK_KEY = (() => {
  const storedKey = sessionStorage.getItem('preflight-key');
  if (storedKey) return storedKey;

  const params = new URLSearchParams(window.location.search);
  const queryKey = params.get('preflight-key');
  if (queryKey) {
    sessionStorage.setItem('preflight-key', queryKey);
    return queryKey;
  }

  return null;
})();

const tabs = signal([
  { title: 'General', selected: true },
  { title: 'SEO' },
  { title: 'Martech' },
  { title: 'Accessibility' },
  { title: 'Performance' },
  { title: 'Assets' },
]);

function setTab(active) {
  tabs.value = tabs.value.map((tab) => {
    const selected = tab.title === active.title;
    return { ...tab, selected };
  });
}

function setPanel(title, checks) {
  switch (title) {
    case 'General':
      return html`<${General} />`;
    case 'SEO':
      return html`<${SEO} checks=${checks} />`;
    case 'Martech':
      return html`<${Martech} />`;
    case 'Accessibility':
      return html`<${Accessibility} />`;
    case 'Performance':
      return html`<${Performance} />`;
    case 'Assets':
      return html`<${Assets} />`;
    default:
      return html`<p>No matching panel.</p>`;
  }
}

function TabButton(props) {
  const id = `tab-${props.idx + 1}`;
  const selected = props.tab.selected === true;
  return html`
    <button
      id=${id}
      class=preflight-tab-button
      key=${props.tab.title}
      aria-selected=${selected}
      onClick=${() => setTab(props.tab)}>
      ${props.tab.title}
    </button>`;
}

function TabPanel(props) {
  const id = `panel-${props.idx + 1}`;
  const labeledBy = `tab-${props.idx + 1}`;
  const selected = props.tab.selected === true;

  return html`
    <div
      id=${id}
      class=preflight-tab-panel
      aria-labelledby=${labeledBy}
      key=${props.tab.title}
      aria-selected=${selected}
      role="tabpanel">
      ${setPanel(props.tab.title, props.checks)}
    </div>`;
}

function Preflight(data) {
  return html`
    <div class=preflight-heading>
      <p id=preflight-title>${HEADING}</p>
      <div class=preflight-tab-button-group role="tablist" aria-labelledby=preflight-title>
        ${tabs.value.map((tab, idx) => html`<${TabButton} tab=${tab} idx=${idx} />`)}
      </div>
    </div>
    <div class=preflight-content>
      ${tabs.value.map((tab, idx) => html`<${TabPanel} tab=${tab} idx=${idx} checks=${data.checks} />`)}
    </div>
  `;
}

function preloadAssets(el) {
  return new Promise((resolve) => {
    const { miloLibs, codeRoot } = getConfig();
    const base = miloLibs || codeRoot;
    const bg = createTag('img', { src: `${base}${IMG_PATH}/preflight-bg.png` });
    const pic = createTag('picture', { class: 'bg-img' }, bg);
    bg.addEventListener('load', () => {
      resolve(pic);
      el.insertAdjacentElement('afterbegin', pic);

      // Lazily load other images
      const check = createTag('link', { rel: 'preload', as: 'image', href: `${base}${IMG_PATH}/check.svg` });
      const expand = createTag('link', { rel: 'preload', as: 'image', href: `${base}${IMG_PATH}/expand.svg` });
      document.head.append(check, expand);
    });
  });
}

async function getJobId() {
  try {
    if (!CHECK_KEY) throw new Error('No preflight key found');
    const res = await fetch(`${CHECK_API}/preflight/jobs`, {
      method: 'POST',
      headers: {
        'x-api-key': CHECK_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pageUrl: window.location.href }),
    });
    const data = await res.json();
    return data.jobId;
  } catch (err) {
    // TODO: handle error
    return null;
  }
}

async function getJobResults(jobId) {
  const MAX_RETRIES = 10;
  const POLL_INTERVAL = 500;
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      if (!CHECK_KEY) throw new Error('No preflight key found');
      const res = await fetch(`${CHECK_API}/preflight/jobs/${jobId}`, { headers: { 'x-api-key': CHECK_KEY } });
      const data = await res.json();
      if (data.status === 'COMPLETED') return data;
      await new Promise((resolve) => {
        setTimeout(resolve, POLL_INTERVAL);
      });
      retries += 1;
    } catch (err) {
      // TODO: handle error
      return null;
    }
  }

  // Max retries exceeded
  return null;
}

function formatChecks(checks) {
  return checks.result;
}

async function getChecks() {
  const jobId = await getJobId();
  if (!jobId) return null;
  const checks = await getJobResults(jobId);
  if (!checks) return null;
  return formatChecks(checks);
}

export default async function init(el) {
  await preloadAssets(el);
  const checks = await getChecks();
  render(html`<${Preflight} checks=${checks} />`, el);
}
