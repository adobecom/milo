import { html } from '../../../deps/htm-preact.js';

export const TABS = [
  { key: 'search', label: 'Manifest Manager' },
  { key: 'inactivity', label: 'Inactivity Report' },
  { key: 'metadata-lookup', label: 'Metadata Lookup' },
];

function TabNav({ activeTab, onSelect }) {
  return html`
    <nav class="mmm2-tab-nav" role="tablist" aria-label="MMM views">
      ${TABS.map((tab) => html`
        <button
          key=${tab.key}
          type="button"
          role="tab"
          id="mmm2-tab-${tab.key}"
          class="mmm2-tab-button ${activeTab === tab.key ? 'is-active' : ''}"
          aria-selected=${activeTab === tab.key}
          aria-controls="mmm2-tabpanel-${tab.key}"
          onClick=${() => onSelect(tab.key)}
        >
          ${tab.label}
        </button>
      `)}
    </nav>
  `;
}

export default TabNav;
