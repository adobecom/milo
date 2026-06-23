import { html, render, signal, useEffect } from '../../deps/htm-preact.js';
import { getConfig } from '../../utils/utils.js';
import General from './panels/general.js';
import SEO from './panels/seo.js';
import Accessibility from './accessibility/accessibility.js';
import Martech from './panels/martech.js';
import Merch from './panels/merch.js';
import Performance from './panels/performance.js';
import Assets from './panels/assets.js';

const HEADING = 'Milo Preflight';

// Tab definitions with icons (emoji used as lightweight SVG-free icons)
const TAB_ICONS = {
  General: '⚙️',
  SEO: '🔍',
  Martech: '📊',
  'M@S': '🛒',
  Accessibility: '♿',
  Performance: '⚡',
  Assets: '🖼️',
};

const tabs = signal([
  { title: 'General', selected: true, errorCount: 0, warnCount: 0 },
  { title: 'SEO', errorCount: 0, warnCount: 0 },
  { title: 'Martech', errorCount: 0, warnCount: 0 },
  { title: 'M@S', errorCount: 0, warnCount: 0 },
  { title: 'Accessibility', errorCount: 0, warnCount: 0 },
  { title: 'Performance', errorCount: 0, warnCount: 0 },
  { title: 'Assets', errorCount: 0, warnCount: 0 },
]);

// Track whether Preflight is open (for notification suppression)
const isOpen = signal(false);

function setTab(active) {
  tabs.value = tabs.value.map((tab) => ({
    ...tab,
    selected: tab.title === active.title,
  }));
}

function setPanel(title) {
  switch (title) {
    case 'General': return html`<${General} />`;
    case 'SEO': return html`<${SEO} />`;
    case 'Martech': return html`<${Martech} />`;
    case 'M@S': return html`<${Merch} />`;
    case 'Accessibility': return html`<${Accessibility} />`;
    case 'Performance': return html`<${Performance} />`;
    case 'Assets': return html`<${Assets} />`;
    default: return html`<p>No matching panel.</p>`;
  }
}

/**
 * Progress ring SVG — replaces the old CSS spinner.
 */
function ProgressRing() {
  return html`
    <svg
      class="preflight-progress-ring"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false">
      <circle cx="12" cy="12" r="9" />
    </svg>`;
}

/**
 * Single nav-rail item.
 */
function NavItem({ tab, idx }) {
  const id = `tab-${idx + 1}`;
  const selected = tab.selected === true;
  const hasErrors = tab.errorCount > 0;
  const hasWarnings = tab.warnCount > 0;
  const badgeCount = tab.errorCount + tab.warnCount;
  const badgeClass = hasErrors ? 'preflight-nav-badge badge-error' : 'preflight-nav-badge badge-warning';

  return html`
    <button
      id=${id}
      class="preflight-nav-item"
      aria-selected=${selected}
      role="tab"
      title=${tab.title}
      onClick=${() => setTab(tab)}>
      <span class="preflight-nav-icon" aria-hidden="true">${TAB_ICONS[tab.title] || '•'}</span>
      <span class="preflight-nav-label">${tab.title}</span>
      ${badgeCount > 0 && html`
        <span class=${badgeClass} aria-label="${badgeCount} issue${badgeCount !== 1 ? 's' : ''}">
          ${badgeCount}
        </span>`}
    </button>`;
}

/**
 * Tab panel wrapper.
 */
function TabPanel({ tab, idx }) {
  const id = `panel-${idx + 1}`;
  const labeledBy = `tab-${idx + 1}`;
  const selected = tab.selected === true;

  return html`
    <div
      id=${id}
      class="preflight-tab-panel"
      aria-labelledby=${labeledBy}
      aria-selected=${selected}
      role="tabpanel">
      ${setPanel(tab.title)}
    </div>`;
}

/**
 * Main Preflight component.
 */
function Preflight() {
  const activeTab = tabs.value.find((t) => t.selected) || tabs.value[0];

  // Keyboard navigation: ArrowUp/ArrowDown move between nav items
  function handleNavKeyDown(e) {
    const items = [...document.querySelectorAll('.preflight-nav-item')];
    const current = items.findIndex((el) => el === document.activeElement);
    if (e.key === 'ArrowDown' && current < items.length - 1) {
      e.preventDefault();
      items[current + 1].focus();
    } else if (e.key === 'ArrowUp' && current > 0) {
      e.preventDefault();
      items[current - 1].focus();
    }
  }

  return html`
    <nav
      class="preflight-nav"
      role="tablist"
      aria-label="Preflight sections"
      onKeyDown=${handleNavKeyDown}>
      <div class="preflight-nav-header">
        <h2>${HEADING}</h2>
      </div>
      ${tabs.value.map((tab, idx) => html`<${NavItem} tab=${tab} idx=${idx} />`)}
    </nav>
    <main class="preflight-main" role="main">
      <div class="preflight-main-header">
        <h3>${activeTab.title}</h3>
      </div>
      <div class="preflight-main-body">
        ${tabs.value.map((tab, idx) => html`<${TabPanel} tab=${tab} idx=${idx} />`)}
      </div>
    </main>`;
}

/**
 * Suppress / restore Milo notifications while Preflight is open.
 * We dispatch custom events that the notification module can listen to;
 * we also attempt to close any currently-visible notification banner.
 */
function suppressNotifications() {
  // Dismiss any active notification
  const activeNotif = document.querySelector('.milo-notification, [data-notification-active]');
  if (activeNotif) activeNotif.remove();
  // Signal suppression via custom event
  window.dispatchEvent(new CustomEvent('preflight:open'));
}

function restoreNotifications() {
  window.dispatchEvent(new CustomEvent('preflight:close'));
}

export default async function init(el) {
  // Mark open and suppress notifications
  isOpen.value = true;
  suppressNotifications();

  // Listen for modal close to restore notifications
  const observer = new MutationObserver(() => {
    if (!document.contains(el)) {
      isOpen.value = false;
      restoreNotifications();
      observer.disconnect();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  render(html`<${Preflight} />`, el);
}
