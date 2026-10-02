import { createTag } from '../../../../utils/utils.js';
import { getManifestList } from '../mep-overlay/mep-overlay-logic.js';

const domParser = new DOMParser();

const DOWNLOAD_ICON = "<svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M5 20h14v-2H5v2zM19 9h-4V3H9v6H5l7 7 7-7z' /></svg>";

const EXPORT_LABEL = 'Export Page Data';

const toText = (value) => (value == null ? '' : String(value));

function toFullUrl(url) {
  try {
    return new URL(toText(url), window.location.origin).href;
  } catch {
    return toText(url);
  }
}

export function getManifestRows(manifest) {
  const rows = [];
  if (manifest.targetActivityName) rows.push(['Campaign', manifest.targetActivityName]);
  rows.push(['Source', manifest.source]);
  rows.push(['Consent Type', manifest.consentType]);
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
    url: toFullUrl(manifest.editUrl),
    status: getManifestStatus(manifest),
    rows: manifest.malformed
      ? []
      : getManifestRows(manifest).map(([label, value]) => [label, toText(value)]),
    variants: (manifest.options ?? [])
      .filter(({ value }) => value && value !== 'default')
      .map(({ label, selected }) => ({
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

async function runExport(button, getSource) {
  if (button.disabled) return;
  button.disabled = true;
  button.setAttribute('aria-busy', 'true');
  try {
    const { default: buildXlsx } = await import('./mep-export-xlsx.js');
    const blob = buildXlsx(await collectExportData(await getSource()));
    const host = window.location.hostname.replace(/[^a-z0-9.-]/gi, '-');
    const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
    downloadBlob(blob, `mep-export-${host}-${stamp}.xlsx`);
  } catch (e) {
    window.lana?.log(`MEP export failed: ${e.message}`, { tags: 'mep-export', errorType: 'e' });
  } finally {
    button.disabled = false;
    button.removeAttribute('aria-busy');
  }
}

export default function buildExportButton(getSource) {
  const button = createTag('button', {
    class: 'mep-export',
    type: 'button',
    'aria-label': EXPORT_LABEL,
  });
  button.append(domParser.parseFromString(DOWNLOAD_ICON, 'image/svg+xml').documentElement);
  button.addEventListener('click', () => runExport(button, getSource));
  return button;
}
