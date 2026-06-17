import { html, render, signal } from '../../deps/htm-preact.js';
import { createTag, getConfig, loadStyle } from '../../utils/utils.js';
import General from './panels/general.js';
import SEO from './panels/seo.js';
import Accessibility from './accessibility/accessibility.js';
import Martech from './panels/martech.js';
import Merch from './panels/merch.js';
import Performance from './panels/performance.js';
import Assets from './panels/assets.js';

const HEADING = 'Milo Preflight';
const IMG_PATH = '/blocks/preflight/img';
// c2 (--s2a-*) design tokens are only defined on c2 pages; preflight runs on every Milo
// page, so load them at :root so both the modal and the page-injected overlays resolve.
const C2_TOKENS = ['tokens.primitives.css', 'tokens.semantic.light.css'];

const tabs = signal([
  { title: 'General', selected: true },
  { title: 'SEO' },
  { title: 'Martech' },
  { title: 'M@S' },
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

function setPanel(title) {
  switch (title) {
    case 'General':
      return html`<${General} />`;
    case 'SEO':
      return html`<${SEO} />`;
    case 'Martech':
      return html`<${Martech} />`;
    case 'M@S':
      return html`<${Merch} />`;
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
      ${setPanel(props.tab.title)}
    </div>`;
}

export function Preflight() {
  return html`
    <div class=preflight-heading>
      <p id=preflight-title>${HEADING}</p>
      <div class=preflight-tab-button-group role="tablist" aria-labelledby=preflight-title>
        ${tabs.value.map((tab, idx) => html`<${TabButton} tab=${tab} idx=${idx} />`)}
      </div>
    </div>
    <div class=preflight-content>
      ${tabs.value.map((tab, idx) => html`<${TabPanel} tab=${tab} idx=${idx} />`)}
    </div>
  `;
}

function loadAssets() {
  const { miloLibs, codeRoot } = getConfig();
  const base = miloLibs || codeRoot;
  C2_TOKENS.forEach((file) => loadStyle(`${base}/c2/styles/deps/${file}`));
  // Preload the icons used as CSS masks across the panels.
  const check = createTag('link', { rel: 'preload', as: 'image', href: `${base}${IMG_PATH}/check.svg` });
  const expand = createTag('link', { rel: 'preload', as: 'image', href: `${base}${IMG_PATH}/expand.svg` });
  document.head.append(check, expand);
}

export default function init(el) {
  loadAssets();
  render(html`<${Preflight} />`, el);
}
