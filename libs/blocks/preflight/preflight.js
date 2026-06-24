import { html, render, signal } from '../../deps/htm-preact.js';
import { createTag, getConfig, loadStyle } from '../../utils/utils.js';
import { getPreflightResults } from './checks/preflightApi.js';
import { runChecks as runLocalizationChecks } from './checks/localization.js';
import { SEVERITY } from './checks/constants.js';
import General from './panels/general.js';
import SEO from './panels/seo.js';
import Accessibility from './accessibility/accessibility.js';
import Martech from './panels/martech.js';
import Merch from './panels/merch.js';
import Performance from './panels/performance.js';
import Assets from './panels/assets.js';

const HEADING = 'Milo Preflight';
const SUBHEADING = 'Pre-publish quality checks for this page';
const IMG_PATH = '/blocks/preflight/img';
// c2 (--s2a-*) design tokens are only defined on c2 pages; preflight runs on every Milo
// page, so load them at :root so both the modal and the page-injected overlays resolve.
const C2_TOKENS = ['tokens.primitives.css', 'tokens.primitives.light.css', 'tokens.semantic.light.css'];

const svg = (paths) => html`<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;

const ICONS = {
  general: svg(html`<rect x="2.5" y="2.5" width="6" height="6" rx="1.5" /><rect x="11.5" y="2.5" width="6" height="6" rx="1.5" /><rect x="2.5" y="11.5" width="6" height="6" rx="1.5" /><rect x="11.5" y="11.5" width="6" height="6" rx="1.5" />`),
  seo: svg(html`<circle cx="8.5" cy="8.5" r="5.5" /><line x1="12.5" y1="12.5" x2="17" y2="17" />`),
  martech: svg(html`<line x1="4" y1="16.5" x2="4" y2="11" /><line x1="10" y1="16.5" x2="10" y2="5.5" /><line x1="16" y1="16.5" x2="16" y2="9" />`),
  mas: svg(html`<path d="M9.6 2.5H4A1.5 1.5 0 0 0 2.5 4v5.6L10.9 18l6.6-6.6L9.6 2.5z" /><circle cx="6" cy="6" r="1.1" />`),
  accessibility: svg(html`<circle cx="10" cy="3.8" r="1.6" /><path d="M3.5 7.3c2 1 4 1.5 6.5 1.5s4.5-.5 6.5-1.5" /><path d="M10 7v5" /><path d="M6.8 17.5 10 12l3.2 5.5" />`),
  performance: svg(html`<path d="M3.2 15.5a7 7 0 1 1 13.6 0" /><line x1="10" y1="13.5" x2="13.2" y2="9.2" /><circle cx="10" cy="13.5" r="1" fill="currentColor" stroke="none" />`),
  assets: svg(html`<rect x="2.5" y="3.8" width="15" height="12.4" rx="2" /><circle cx="7" cy="8" r="1.4" /><path d="M3.2 14.5 7.5 11l3 2.2L14 9.8l3.5 3.4" />`),
};

const tabs = signal([
  { title: 'General', desc: 'Page structure, localization and content status.', icon: ICONS.general, selected: true },
  { title: 'SEO', desc: 'Search engine optimization checks for this page.', icon: ICONS.seo },
  { title: 'Martech', desc: 'Marketing metadata extracted for tagging.', icon: ICONS.martech },
  { title: 'M@S', desc: 'Merch-at-scale fragment and offer checks.', icon: ICONS.mas },
  { title: 'Accessibility', desc: 'WCAG conformance and alt-text auditing.', icon: ICONS.accessibility },
  { title: 'Performance', desc: 'Core Web Vitals and LCP readiness.', icon: ICONS.performance },
  { title: 'Assets', desc: 'Image dimensions and asset optimization.', icon: ICONS.assets },
]);

function setTab(active) {
  tabs.value = tabs.value.map((tab) => {
    const selected = tab.title === active.title;
    return { ...tab, selected };
  });
}

// Per-tab issue counts surfaced as badges in the rail. Keyed by tab title.
const tabStatus = signal({});

// Each tab maps to a category returned by getPreflightResults().runChecks.
// Martech extracts metadata only, so it has no pass/fail state.
const TAB_CATEGORY = {
  General: 'structure',
  SEO: 'seo',
  'M@S': 'merch',
  Accessibility: 'accessibility',
  Performance: 'performance',
  Assets: 'assets',
};

// structure/seo/performance return one check per item, so failing checks map 1:1
// to the cards the panel shows.
function countChecks(checks = []) {
  return checks.reduce((acc, check) => {
    if (check?.status === 'fail') {
      if (check.severity === SEVERITY.WARNING) acc.warnings += 1;
      else acc.errors += 1;
    } else if (check?.status === 'limbo') {
      acc.warnings += 1;
    }
    return acc;
  }, { errors: 0, warnings: 0 });
}

// accessibility/merch/assets return a single aggregate check whose granular counts
// live in `details`, so the badge matches the items the panel actually lists.
function countCategory(title, runChecks) {
  const checks = runChecks[TAB_CATEGORY[title]] || [];
  const [first] = checks;
  if (title === 'Accessibility') {
    return { errors: first?.status === 'fail' ? first.details?.issuesCount || 0 : 0, warnings: 0 };
  }
  if (title === 'M@S') {
    return { errors: first?.status === 'fail' ? first.details?.unpublished?.length || 0 : 0, warnings: 0 };
  }
  if (title === 'Assets') {
    return {
      errors: first?.details?.criticalAssetFailures?.length || 0,
      warnings: first?.details?.warningAssetFailures?.length || 0,
    };
  }
  return countChecks(checks);
}

// Localization (faulty links) is shown in the General panel but is not part of
// the central run, so fold its violations into the General badge separately.
async function getLocalizationErrors() {
  try {
    const [loc] = await runLocalizationChecks({ area: document });
    return loc?.details?.violations?.length || 0;
  } catch {
    return 0;
  }
}

async function loadIssueCounts() {
  try {
    const results = await getPreflightResults({ url: window.location.href, area: document });
    if (!results?.runChecks) return;
    const status = Object.keys(TAB_CATEGORY).reduce((acc, title) => {
      acc[title] = countCategory(title, results.runChecks);
      return acc;
    }, {});
    const locErrors = await getLocalizationErrors();
    status.General = {
      errors: status.General.errors + locErrors,
      warnings: status.General.warnings,
    };
    tabStatus.value = status;
  } catch (e) {
    window.lana?.log?.(`Preflight tab badges failed: ${e}`, { tags: 'preflight' });
  }
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
      role="tab"
      key=${props.tab.title}
      aria-selected=${selected}
      onClick=${() => setTab(props.tab)}>
      <span class=preflight-tab-icon>${props.tab.icon}</span>
      <span class=preflight-tab-label>${props.tab.title}</span>
      ${(() => {
    const counts = tabStatus.value[props.tab.title];
    const total = counts ? counts.errors + counts.warnings : 0;
    if (!total) return null;
    const badgeClass = counts.errors ? 'has-errors' : 'has-warnings';
    const label = `${total} ${counts.errors ? 'issue' : 'warning'}${total === 1 ? '' : 's'}`;
    return html`<span class="preflight-tab-badge ${badgeClass}" title=${label} aria-label=${label}>${total}</span>`;
  })()}
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
  const active = tabs.value.find((tab) => tab.selected) || tabs.value[0];
  return html`
    <aside class=preflight-sidebar>
      <div class=preflight-brand>
        <p id=preflight-title>${HEADING}</p>
        <p class=preflight-subtitle>${SUBHEADING}</p>
      </div>
      <nav class=preflight-tab-button-group role="tablist" aria-orientation="vertical" aria-labelledby=preflight-title>
        ${tabs.value.map((tab, idx) => html`<${TabButton} tab=${tab} idx=${idx} />`)}
      </nav>
    </aside>
    <main class=preflight-main>
      <header class=preflight-main-header>
        <h2 class=preflight-main-title>${active.title}</h2>
        <p class=preflight-main-desc>${active.desc}</p>
      </header>
      <div class=preflight-content>
        ${tabs.value.map((tab, idx) => html`<${TabPanel} tab=${tab} idx=${idx} />`)}
      </div>
    </main>
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
  loadIssueCounts();
}
