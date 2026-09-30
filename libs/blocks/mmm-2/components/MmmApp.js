import { html, useState, useEffect } from '../../../deps/htm-preact.js';
import TabNav, { TABS } from './TabNav.js';
import SearchView from './SearchView.js';
import InactivityReportView from './InactivityReportView.js';
import MetadataLookupView from './MetadataLookupView.js';

const DEFAULT_TAB = TABS[0].key;
const TAB_KEYS = TABS.map((t) => t.key);

function getTabFromUrl() {
  const tab = new URLSearchParams(window.location.search).get('tab');
  return TAB_KEYS.includes(tab) ? tab : DEFAULT_TAB;
}

function setTabInUrl(tab) {
  const url = new URL(window.location.href);
  if (tab === DEFAULT_TAB) url.searchParams.delete('tab');
  else url.searchParams.set('tab', tab);
  window.history.pushState({ mmm2Tab: tab }, '', url);
}

function MmmApp() {
  const [activeTab, setActiveTab] = useState(getTabFromUrl);

  useEffect(() => {
    const onPopState = () => setActiveTab(getTabFromUrl());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const selectTab = (tab) => {
    if (tab === activeTab) return;
    setTabInUrl(tab);
    setActiveTab(tab);
  };

  return html`
    <div class="mmm2-app">
      <${TabNav} activeTab=${activeTab} onSelect=${selectTab} />
      <div
        role="tabpanel"
        id="mmm2-tabpanel-${activeTab}"
        aria-labelledby="mmm2-tab-${activeTab}"
        class="mmm2-tabpanel"
      >
        ${activeTab === 'search' && html`<${SearchView} />`}
        ${activeTab === 'inactivity' && html`<${InactivityReportView} />`}
        ${activeTab === 'metadata-lookup' && html`<${MetadataLookupView} />`}
      </div>
    </div>
  `;
}

export default MmmApp;
