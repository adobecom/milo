import { createTag, loadStyle } from '../../../../utils/utils.js';
import { getManifestList } from '../mep-overlay/mep-overlay-logic.js';

const FAB_OFFSET = 24;
const FAB_STEP = 48;

const domParser = new DOMParser();

const ICONS = {
  xlsx: "<svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M3 3h18v18H3V3zM5 5v4h6V5H5zM13 5v4h6V5h-6zM5 11v3h6v-3H5zM13 11v3h6v-3h-6zM5 16v3h6v-3H5zM13 16v3h6v-3h-6z' /></svg>",
  docx: "<svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z' /></svg>",
};

const EXPORTS = {
  xlsx: {
    title: 'Export to Excel',
    build: async (data) => (await import('./mep-export-xlsx.js')).default(data),
  },
  docx: {
    title: 'Export to Word',
    build: async (data) => (await import('./mep-export-docx.js')).default(data),
  },
};

const toText = (value) => (value == null ? '' : String(value));

export function getManifestRows(manifest) {
  const rows = [];
  if (manifest.targetActivityName) rows.push(['Campaign', manifest.targetActivityName]);
  rows.push(['Source', manifest.source]);
  rows.push(['Consent Req', manifest.consentType]);
  if (manifest.countryRestriction) rows.push(['Allowed User Countries', manifest.countryRestriction]);
  rows.push(['Type', manifest.manifestType || 'none']);
  rows.push(['Override Name', manifest.manifestOverrideName || 'none']);
  rows.push(['Execution Order', manifest.executionOrder || 'none']);
  if (manifest.showActive) rows.push(['Active?', manifest.isActive]);
  if (manifest.lastSeen) rows.push(['Last Seen', manifest.lastSeen]);
  if (manifest.eventStart && manifest.eventEnd) {
    rows.push(['On', manifest.eventStart], ['Off', manifest.eventEnd]);
  }
  rows.push(['Experience', manifest.isDefaultSelected ? 'default (control)' : manifest.selectedVariantName]);
  return rows;
}

function toExportRows(pairs) {
  return pairs.map(([label, value]) => [
    toText(label),
    Array.isArray(value)
      ? value.map(([subLabel, subValue]) => [toText(subLabel), toText(subValue)])
      : toText(value),
  ]);
}

function toExportManifest(manifest, getManifestStatus) {
  return {
    index: manifest.index,
    name: toText(manifest.fileName),
    url: toText(manifest.editUrl),
    status: getManifestStatus(manifest),
    rows: manifest.malformed
      ? []
      : getManifestRows(manifest).map(([label, value]) => [label, toText(value)]),
    variants: (manifest.options ?? []).map(({ label, selected }) => ({
      label: toText(label),
      selected: !!selected,
    })),
  };
}

function getExportManifests({ authenticated, additionalManifests }) {
  if (!authenticated) return [];
  const includeAdditional = !!document.querySelector('.mmm-manifest-card:not([hidden])');
  return [...getManifestList().manifests, ...(includeAdditional ? additionalManifests : [])];
}

async function collectExportData(source) {
  const summary = await Promise.all(source.summary.map(async ([title, getData]) => ({
    title,
    rows: toExportRows((await getData?.()) ?? []),
  })));
  return {
    pageUrl: window.location.href,
    exportedAt: new Date().toLocaleString(),
    summary: summary.filter(({ rows }) => rows.length),
    manifests: getExportManifests(source)
      .map((manifest) => toExportManifest(manifest, source.getManifestStatus)),
  };
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = createTag('a', { href: url, download: filename });
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function runExport(type, button, getSource) {
  if (button.disabled) return;
  button.disabled = true;
  button.setAttribute('aria-busy', 'true');
  try {
    const blob = await EXPORTS[type].build(await collectExportData(await getSource()));
    const host = window.location.hostname.replace(/[^a-z0-9.-]/gi, '-');
    const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
    downloadBlob(blob, `mep-export-${host}-${stamp}.${type}`);
  } catch (e) {
    window.lana?.log(`MEP export failed: ${e.message}`, { tags: 'mep-export', errorType: 'e' });
  } finally {
    button.disabled = false;
    button.removeAttribute('aria-busy');
  }
}

function buildExportButton(type, getSource) {
  const { title } = EXPORTS[type];
  const button = createTag('button', {
    class: 'mep-export-fab',
    type: 'button',
    'aria-label': title,
    'aria-describedby': `mep-export-tooltip-${type}`,
  });
  button.append(domParser.parseFromString(ICONS[type], 'image/svg+xml').documentElement, createTag('span', {
    id: `mep-export-tooltip-${type}`,
    class: 'mep-export-tooltip',
    role: 'tooltip',
  }, title));
  button.addEventListener('click', () => runExport(type, button, getSource));
  return button;
}

// Sits one FAB slot below the overlay's MEP FAB, which is placed at gnavOffset + FAB_OFFSET.
const getTop = (gnavOffset) => gnavOffset + FAB_OFFSET + FAB_STEP;

export default function buildExportSidebar(gnavOffset, getSource) {
  loadStyle(new URL('./mep-export.css', import.meta.url));
  const element = createTag('div', {
    class: 'mep-export-sidebar',
    role: 'group',
    'aria-label': 'Export page data',
    style: `top: ${getTop(gnavOffset)}px`,
  }, [buildExportButton('xlsx', getSource), buildExportButton('docx', getSource)]);

  return {
    element,
    setOffset: (offset) => element.style.setProperty('top', `${getTop(offset)}px`),
  };
}
