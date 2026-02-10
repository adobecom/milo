const MAS_IO_BASE = 'https://www.adobe.com/mas/io';
const FRAGMENT_CLIENT_URL = 'https://mas.adobe.com/studio/libs/fragment-client.js';
const API_KEY = 'wcms-commerce-ims-ro-user-milo';
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const WCS_URL = 'https://www.adobe.com/web_commerce_artifact';

// Maps URL path prefixes to COUNTRY_language (mirrors merch.js GeoMap)
const GeoMap = {
  ar: 'AR_es',
  be_en: 'BE_en',
  be_fr: 'BE_fr',
  be_nl: 'BE_nl',
  br: 'BR_pt',
  ca: 'CA_en',
  ch_de: 'CH_de',
  ch_fr: 'CH_fr',
  ch_it: 'CH_it',
  cl: 'CL_es',
  co: 'CO_es',
  la: 'DO_es',
  mx: 'MX_es',
  pe: 'PE_es',
  africa: 'MU_en',
  dk: 'DK_da',
  de: 'DE_de',
  ee: 'EE_et',
  eg_ar: 'EG_ar',
  eg_en: 'EG_en',
  es: 'ES_es',
  fr: 'FR_fr',
  gr_el: 'GR_el',
  gr_en: 'GR_en',
  ie: 'IE_en',
  il_he: 'IL_iw',
  it: 'IT_it',
  lv: 'LV_lv',
  lt: 'LT_lt',
  lu_de: 'LU_de',
  lu_en: 'LU_en',
  lu_fr: 'LU_fr',
  my_en: 'MY_en',
  my_ms: 'MY_ms',
  hu: 'HU_hu',
  mt: 'MT_en',
  mena_en: 'DZ_en',
  mena_ar: 'DZ_ar',
  nl: 'NL_nl',
  no: 'NO_nb',
  pl: 'PL_pl',
  pt: 'PT_pt',
  ro: 'RO_ro',
  si: 'SI_sl',
  sk: 'SK_sk',
  fi: 'FI_fi',
  se: 'SE_sv',
  tr: 'TR_tr',
  uk: 'GB_en',
  at: 'AT_de',
  cz: 'CZ_cs',
  bg: 'BG_bg',
  ru: 'RU_ru',
  ua: 'UA_uk',
  au: 'AU_en',
  in_en: 'IN_en',
  in_hi: 'IN_hi',
  id_en: 'ID_en',
  id_id: 'ID_id',
  nz: 'NZ_en',
  sa_ar: 'SA_ar',
  sa_en: 'SA_en',
  sg: 'SG_en',
  cn: 'CN_zh-Hans',
  tw: 'TW_zh-Hant',
  hk_zh: 'HK_zh-hant',
  jp: 'JP_ja',
  kr: 'KR_ko',
  za: 'ZA_en',
  ng: 'NG_en',
  cr: 'CR_es',
  ec: 'EC_es',
  pr: 'US_es',
  gt: 'GT_es',
  cis_en: 'TM_en',
  cis_ru: 'TM_ru',
  sea: 'SG_en',
  th_en: 'TH_en',
  th_th: 'TH_th',
};

let detectedLocale = 'en_US';

function getLocaleFromPrefix(prefix) {
  const geo = GeoMap[prefix];
  if (!geo) return 'en_US';
  const [country, language] = geo.split('_', 2);
  return `${language}_${country}`;
}

function updateLocaleBadge() {
  const badge = document.getElementById('locale-badge');
  if (badge) badge.textContent = detectedLocale;
}

let currentFragmentData = null;
const tableEntries = [];

function stripHtml(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
}

function parseStudioUrl(input) {
  const trimmed = input.trim();
  if (UUID_REGEX.test(trimmed)) {
    return { fragmentId: trimmed };
  }
  try {
    const url = new URL(trimmed);
    const hashParams = new URLSearchParams(url.hash.slice(1));
    const fragmentId = hashParams.get('query') || hashParams.get('fragmentId');
    if (!fragmentId || !UUID_REGEX.test(fragmentId)) {
      throw new Error('No valid fragment ID found in URL');
    }
    return { fragmentId };
  } catch {
    throw new Error('Could not extract a fragment ID. Paste a MAS Studio URL or UUID.');
  }
}

async function fetchPublished(fragmentId, locale) {
  const url = `${MAS_IO_BASE}/fragment?id=${fragmentId}&api_key=${API_KEY}&locale=${locale}`;
  const response = await fetch(url, { credentials: 'omit' });
  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`Failed to fetch fragment (${response.status}).`);
  }
  return response.json();
}

async function fetchDraft(fragmentId, locale) {
  const { previewFragment } = await import(FRAGMENT_CLIENT_URL);
  const data = await previewFragment(fragmentId, { locale });
  return data || null;
}

async function resolveFragment(fragmentId, locale) {
  const published = await fetchPublished(fragmentId, locale);
  if (published) return { data: published, source: 'published' };
  try {
    const draft = await fetchDraft(fragmentId, locale);
    if (draft) return { data: draft, source: 'draft' };
  } catch {
    // draft pipeline unavailable (e.g. off VPN)
  }
  throw new Error('Fragment not found. If unpublished, ensure you are on Adobe VPN.');
}

function normalizeFieldValue(value) {
  if (Array.isArray(value)) return value.length ? value.join(', ') : '';
  if (value && typeof value === 'object' && value.mimeType) {
    const raw = value.value || '';
    const text = stripHtml(raw).trim();
    return text || raw;
  }
  return String(value ?? '');
}

async function resolveInlinePrices(html, locale) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const spans = doc.querySelectorAll('span[is="inline-price"]');
  if (!spans.length) return null;

  const osiSet = new Set();
  spans.forEach((span) => {
    const osi = span.dataset.wcsOsi;
    if (osi) osiSet.add(osi);
  });
  if (!osiSet.size) return null;

  const [language, country] = locale.split('_');
  const params = new URLSearchParams({
    offer_selector_ids: [...osiSet].join(','),
    country,
    locale,
    landscape: 'PUBLISHED',
    api_key: API_KEY,
    language: 'MULT',
  });

  const res = await fetch(`${WCS_URL}?${params}`, { credentials: 'omit' });
  if (!res.ok) return null;
  const data = await res.json();

  const priceMap = new Map();
  for (const offer of data.resolvedOffers || []) {
    const osi = offer.offerSelectorIds?.[0];
    if (!osi) continue;
    const { price, formatString } = offer.priceDetails || {};
    const currency = formatString?.match(/'([^']+)'/)?.[1] || '$';
    const formatted = `${currency}${price?.toFixed(2) ?? '?'}`;
    const term = offer.term === 'MONTHLY' ? '/mo' : offer.term === 'ANNUAL' ? '/yr' : '';
    priceMap.set(osi, `${formatted}${term}`);
  }

  let result = html;
  spans.forEach((span) => {
    const osi = span.dataset.wcsOsi;
    const resolved = priceMap.get(osi);
    if (resolved) {
      result = result.replace(span.outerHTML, resolved);
    }
  });

  return stripHtml(result).trim();
}

function extractSurface(path) {
  if (!path) return null;
  const match = path.match(/\/content\/dam\/mas\/([^/]+)\//);
  return match ? match[1] : null;
}

function copyToClipboard(text, buttonEl) {
  const isIcon = buttonEl.classList.contains('btn-icon');
  navigator.clipboard.writeText(text).then(() => {
    buttonEl.classList.add('copied');
    if (!isIcon) {
      const original = buttonEl.textContent;
      buttonEl.textContent = 'Copied!';
      setTimeout(() => { buttonEl.textContent = original; }, 1500);
    }
    setTimeout(() => { buttonEl.classList.remove('copied'); }, 1500);
  }).catch(() => {
    if (!isIcon) {
      buttonEl.textContent = 'Failed';
      setTimeout(() => { buttonEl.textContent = 'Copy'; }, 1500);
    }
  });
}

function copyRichLink(href, displayText, buttonEl) {
  const richText = `<a href="${href}">${displayText}</a>`;
  navigator.clipboard.write([
    new ClipboardItem({
      'text/plain': new Blob([displayText], { type: 'text/plain' }),
      'text/html': new Blob([richText], { type: 'text/html' }),
    }),
  ]).then(() => {
    buttonEl.classList.add('copied');
    const original = buttonEl.textContent;
    buttonEl.textContent = 'Copied!';
    setTimeout(() => {
      buttonEl.textContent = original;
      buttonEl.classList.remove('copied');
    }, 1500);
  }).catch(() => {
    buttonEl.textContent = 'Failed';
    setTimeout(() => { buttonEl.textContent = displayText; }, 1500);
  });
}

function renderFields(fields, alias, fragmentId) {
  const container = document.getElementById('fields-list');
  const countEl = document.getElementById('field-count');
  container.innerHTML = '';

  const entries = Object.entries(fields)
    .map(([key, value]) => [key, normalizeFieldValue(value)])
    .filter(([, display]) => display);

  countEl.textContent = entries.length ? `${entries.length} fields` : '';
  if (!entries.length) {
    container.textContent = 'No fields found.';
    return;
  }

  entries.forEach(([key, display]) => {
    const row = document.createElement('div');
    row.className = 'field-row';

    const top = document.createElement('div');
    top.className = 'field-top';

    const info = document.createElement('div');
    info.className = 'field-info';

    const nameEl = document.createElement('div');
    nameEl.className = 'field-name';
    nameEl.textContent = key;
    info.appendChild(nameEl);

    const valueEl = document.createElement('div');
    valueEl.className = 'field-value';
    valueEl.textContent = display;
    info.appendChild(valueEl);

    const rawValue = fields[key];
    const rawHtml = rawValue?.mimeType ? rawValue.value : (typeof rawValue === 'string' ? rawValue : null);
    if (rawHtml && rawHtml.includes('is="inline-price"')) {
      resolveInlinePrices(rawHtml, detectedLocale).then((resolved) => {
        if (resolved) valueEl.textContent = resolved;
      });
    }

    top.appendChild(info);

    const copyBtn = document.createElement('button');
    copyBtn.type = 'button';
    if (alias) {
      const syntax = `${alias} → ${key}`;
      copyBtn.className = 'field-copy-btn';
      copyBtn.textContent = syntax;
      if (fragmentId) {
        const href = `https://mas.adobe.com/studio.html#content-type=merch-card&fragment=${fragmentId}&field=${key}`;
        copyBtn.addEventListener('click', () => copyRichLink(href, syntax, copyBtn));
      } else {
        copyBtn.addEventListener('click', () => copyToClipboard(syntax, copyBtn));
      }
    } else {
      copyBtn.className = 'field-copy-btn no-alias';
      copyBtn.textContent = 'Set alias to copy';
      copyBtn.disabled = true;
    }
    top.appendChild(copyBtn);

    row.appendChild(top);

    requestAnimationFrame(() => {
      if (valueEl.scrollHeight > valueEl.clientHeight) {
        valueEl.classList.add('truncated');
      }
    });

    container.appendChild(row);
  });
}

function updateTableSection() {
  const section = document.getElementById('table-section');
  const label = document.getElementById('table-label');

  if (tableEntries.length === 0) {
    section.classList.add('hidden');
    section.classList.remove('expanded');
  } else {
    section.classList.remove('hidden');
    label.textContent = `Fragments (${tableEntries.length})`;
  }
}

function renameEntry(oldAlias, newAlias) {
  const trimmed = newAlias.trim();
  if (!trimmed || trimmed === oldAlias) return;
  const duplicate = tableEntries.find((e) => e.alias === trimmed);
  if (duplicate) return;
  const entry = tableEntries.find((e) => e.alias === oldAlias);
  if (entry) {
    entry.alias = trimmed;
    renderTable(); // eslint-disable-line no-use-before-define
  }
}

function startEditing(aliasEl, alias) {
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'table-entry-alias-input';
  input.value = alias;
  aliasEl.replaceWith(input);
  input.focus();
  input.select();

  function commit() {
    renameEntry(alias, input.value);
  }

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); commit(); }
    if (e.key === 'Escape') { e.preventDefault(); renderTable(); } // eslint-disable-line no-use-before-define
  });
  input.addEventListener('blur', commit);
}

function removeFromTable(alias) {
  const idx = tableEntries.findIndex((e) => e.alias === alias);
  if (idx >= 0) tableEntries.splice(idx, 1);
  renderTable(); // eslint-disable-line no-use-before-define
}

function renderTable() {
  const container = document.getElementById('table-entries');
  container.innerHTML = '';

  tableEntries.forEach(({ alias, fragmentId }) => {
    const row = document.createElement('div');
    row.className = 'table-entry';

    const aliasEl = document.createElement('span');
    aliasEl.className = 'table-entry-alias';
    aliasEl.textContent = alias;
    aliasEl.title = 'Click to rename';
    aliasEl.addEventListener('click', () => startEditing(aliasEl, alias));

    const idEl = document.createElement('span');
    idEl.className = 'table-entry-id';
    idEl.textContent = fragmentId;

    const loadBtn = document.createElement('button');
    loadBtn.type = 'button';
    loadBtn.className = 'table-entry-load';
    loadBtn.title = `Inspect ${alias}`;
    loadBtn.innerHTML = '<svg width="12" height="12" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="7.5" cy="7.5" r="5.5"/><line x1="12" y1="12" x2="16" y2="16"/></svg>';
    loadBtn.addEventListener('click', () => {
      document.getElementById('studio-url').value = fragmentId;
      loadFragment(fragmentId, alias);
    });

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'table-entry-remove';
    removeBtn.textContent = '\u00d7';
    removeBtn.title = `Remove ${alias}`;
    removeBtn.addEventListener('click', () => removeFromTable(alias));

    row.append(aliasEl, idEl, loadBtn, removeBtn);
    container.appendChild(row);
  });

  updateTableSection();
}

function addToTable(alias, fragmentId) {
  const locale = detectedLocale;
  const existing = tableEntries.findIndex((e) => e.alias === alias);
  if (existing >= 0) {
    tableEntries[existing].fragmentId = fragmentId;
    tableEntries[existing].locale = locale;
  } else {
    tableEntries.push({ alias, fragmentId, locale });
  }
  renderTable();
  document.getElementById('table-section').classList.add('expanded');
}

function updateAddButton() {
  const alias = document.getElementById('alias-input').value.trim();
  const btn = document.getElementById('add-to-table-btn');
  btn.disabled = !alias || !currentFragmentData;
}

function showError(message) {
  const errorSection = document.getElementById('error-section');
  const errorMessage = document.getElementById('error-message');
  errorMessage.textContent = message;
  errorSection.classList.remove('hidden');
}

function hideError() {
  document.getElementById('error-section').classList.add('hidden');
}

function showLoading(show) {
  document.getElementById('loading-section').classList.toggle('hidden', !show);
}

async function loadFragment(fragmentId, alias) {
  const aliasInput = document.getElementById('alias-input');

  hideError();
  hideResults();
  currentFragmentData = null;
  aliasInput.value = alias || '';
  showLoading(true);

  try {
    const { data, source } = await resolveFragment(fragmentId, detectedLocale);
    currentFragmentData = data;
    showResults(data, source);
  } catch (e) {
    showError(e.message);
  } finally {
    showLoading(false);
  }
}

const MAX_ALIAS_LENGTH = 30;

function suggestAlias(title) {
  if (!title) return '';
  const toKebab = (str) => str.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  let alias = toKebab(title);
  if (alias.length > MAX_ALIAS_LENGTH && title.includes(':')) {
    alias = toKebab(title.split(':').pop());
  }
  if (alias.length > MAX_ALIAS_LENGTH) {
    alias = alias.slice(0, MAX_ALIAS_LENGTH).replace(/-[^-]*$/, '');
  }
  return alias;
}

function showResults(data, source) {
  const title = data.title || 'Untitled Fragment';
  document.getElementById('fragment-title').textContent = `Card: ${title}`;
  document.getElementById('fragment-id').textContent = data.id;
  document.getElementById('fragment-id').title = data.path || '';

  const badge = document.getElementById('source-badge');
  badge.textContent = source === 'draft' ? 'Draft' : 'Published';
  badge.className = `source-badge ${source}`;

  const surface = extractSurface(data.path);
  const surfaceBadge = document.getElementById('fragment-surface');
  surfaceBadge.textContent = surface || '';
  surfaceBadge.style.display = surface ? '' : 'none';

  const studioLink = document.getElementById('studio-link');
  if (surface) {
    studioLink.href = `https://mas.adobe.com/studio.html#path=${surface}&query=${data.id}`;
    studioLink.style.display = '';
  } else {
    studioLink.style.display = 'none';
  }

  const aliasInput = document.getElementById('alias-input');
  if (!aliasInput.value.trim()) {
    aliasInput.value = suggestAlias(data.title);
  }

  document.getElementById('fragment-meta').classList.remove('hidden');
  document.getElementById('fields-section').classList.remove('hidden');

  updateAddButton();

  const alias = aliasInput.value.trim();
  renderFields(data.fields || {}, alias, data.id);
}

function hideResults() {
  document.getElementById('fragment-meta').classList.add('hidden');
  document.getElementById('fields-section').classList.add('hidden');
}

async function detectLocale() {
  const params = new URLSearchParams(window.location.search);
  const referrer = params.get('referrer');
  if (!referrer) return;

  let previewPath;
  try {
    const { origin, pathname } = new URL(referrer);
    const split = origin.split('.');
    const topLevel = split.slice(Math.max(split.length - 2, 1)).join('.');
    const isEdit = topLevel === 'google.com' || topLevel === 'sharepoint.com';

    if (isEdit) {
      const owner = params.get('owner');
      const repo = params.get('repo');
      if (!owner || !repo) return;
      const url = `https://admin.hlx.page/status/${owner}/${repo}/main?editUrl=${referrer}`;
      const res = await fetch(url);
      const json = await res.json();
      previewPath = new URL(json.preview.url).pathname;
    } else {
      previewPath = pathname;
    }
  } catch { return; }

  const segments = previewPath.split('/').filter(Boolean);
  for (const segment of segments) {
    if (GeoMap[segment]) {
      detectedLocale = getLocaleFromPrefix(segment);
      updateLocaleBadge();
      return;
    }
  }
}

export default function init() {
  const fetchBtn = document.getElementById('fetch-btn');
  const urlInput = document.getElementById('studio-url');
  const aliasInput = document.getElementById('alias-input');
  const copyIdBtn = document.getElementById('copy-id-btn');
  const addToTableBtn = document.getElementById('add-to-table-btn');

  // Power-user locale override via URL param
  const params = new URLSearchParams(window.location.search);
  const localeOverride = params.get('locale');
  if (localeOverride) {
    detectedLocale = localeOverride;
  }
  updateLocaleBadge();

  // Auto-detect locale from sidekick context
  if (!localeOverride) {
    detectLocale();
  }

  async function inspectFragment() {
    const input = urlInput.value;
    if (!input.trim()) {
      showError('Please enter a MAS Studio URL or fragment UUID.');
      return;
    }

    let parsed;
    try {
      parsed = parseStudioUrl(input);
    } catch (e) {
      showError(e.message);
      return;
    }

    fetchBtn.disabled = true;
    await loadFragment(parsed.fragmentId);
    fetchBtn.disabled = false;
  }

  fetchBtn.addEventListener('click', inspectFragment);
  urlInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') inspectFragment();
  });

  aliasInput.addEventListener('input', () => {
    updateAddButton();
    if (currentFragmentData) {
      const alias = aliasInput.value.trim();
      renderFields(currentFragmentData.fields || {}, alias, currentFragmentData.id);
    }
  });

  copyIdBtn.addEventListener('click', () => {
    const id = document.getElementById('fragment-id').textContent;
    if (id) copyToClipboard(id, copyIdBtn);
  });

  addToTableBtn.addEventListener('click', () => {
    const alias = aliasInput.value.trim();
    if (alias && currentFragmentData) {
      addToTable(alias, currentFragmentData.id);
    }
  });

  const clearCardBtn = document.getElementById('clear-card-btn');
  clearCardBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    currentFragmentData = null;
    urlInput.value = '';
    hideResults();
    updateAddButton();
  });

  document.querySelectorAll('.section-toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      if (targetId) document.getElementById(targetId).classList.toggle('expanded');
    });
  });
}
