import { createTag, loadStyle, getConfig } from '../../../../utils/utils.js';
import { onSidekickAuth } from '../../sidekick-auth.js';
import {
  getPageId,
  getManifestList,
  getAdditionalManifests,
  getPageSummary,
  getConsentSummary,
  getMasSummary,
  getLingoSummary,
  getCaasSummary,
  setPreviewButton,
} from './mep-overlay-logic.js';
import {
  toggleHighlight,
  getParameters,
  getPageUpdates,
  setBadgeEventListeners,
} from './mep-overlay-highlight.js';
import { saveToMmm } from '../mep-next.js';

const CARD_DATA = {
  actions: [
    ['Highlight', [
      ['MEP', getPageUpdates],
      ['Caas', getPageUpdates],
      ['M@S', getPageUpdates],
      ['Other Fragments', getPageUpdates],
    ]],
    ['Toggle', [
      ['Preview Link', 'Add mepButton=off'],
      ['Manifest Manager', 'Data for last 7 days'],
    ]],
    ['Spoof Geo', ['MEP Lingo', 'Lingo M@S', 'Top Markets']],
    ['Load Manifest', 'Enter manifest path'],
  ],
  summary: [
    ['Page', getPageSummary],
    ['Consent', getConsentSummary],
    ['Lingo', getLingoSummary],
    ['M@S', getMasSummary],
    ['CaaS', getCaasSummary],
  ],
};

const CARD_STORAGE_KEY = 'mep-expanded-cards';

function parseSvg(svgString) {
  return new DOMParser().parseFromString(svgString, 'image/svg+xml').documentElement;
}

function svgIcon(svgData, key) {
  return parseSvg(svgData.svg[key]);
}

function getGnavOffset() {
  const calculate = () => {
    const header = document.querySelector('header');
    const localNav = document.querySelector('.feds-localnav');
    if (!header?.offsetHeight) return 0;
    return header.offsetHeight + (localNav?.offsetHeight || 0);
  };
  return new Promise((resolve) => {
    const height = calculate();
    if (height) { resolve(height); return; }
    const observer = new MutationObserver(() => {
      const calculation = calculate();
      if (calculation) { observer.disconnect(); resolve(calculation); }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  });
}

function buildRow(label, value) {
  const val = (typeof value === 'string' || value == null)
    ? createTag('div', { class: 'mep-row-value' }, value ?? '')
    : value;
  return createTag('div', { class: 'mep-row' }, [createTag('h2', {}, label), val]);
}

function getExpandedCards() {
  try {
    return new Set(JSON.parse(localStorage.getItem(CARD_STORAGE_KEY)) || []);
  } catch { return new Set(); }
}

function markExpanded(el, key) {
  el.dataset.cardKey = key;
  if (getExpandedCards().has(key)) el.classList.add('expanded');
}

function toggleExpandedCard(cardEl) {
  const key = cardEl.dataset.cardKey;
  const isExpanded = cardEl.classList.toggle('expanded');
  const expanded = getExpandedCards();
  expanded[isExpanded ? 'add' : 'delete'](key);
  localStorage.setItem(CARD_STORAGE_KEY, JSON.stringify([...expanded]));
}

function buildManifestCard(manifest, svgData) {
  const link = createTag('a', { href: manifest.editUrl, target: '_blank' }, [
    createTag('span', {}, `${manifest.index}. `),
    createTag('span', { class: 'mep-manifest-filename' }, manifest.fileName),
  ]);
  const header = createTag('div', { class: 'mep-manifest-header' }, [
    createTag('span', { class: 'mep-overline' }, 'Manifest'),
    createTag('h1', {}, [link, svgIcon(svgData, 'icon-expand-circle-down')]),
  ]);

  const rows = [];
  if (manifest.targetActivityName) rows.push(buildRow('Campaign', manifest.targetActivityName));
  rows.push(buildRow('Experience', manifest.isDefaultSelected ? 'default (control)' : manifest.selectedVariantName));
  rows.push(buildRow('Source', manifest.source));
  rows.push(buildRow('Mktg Action', manifest.mktgAction));
  if (manifest.geoRestriction) rows.push(buildRow('Geo', manifest.geoRestriction));
  if (manifest.showActive) rows.push(buildRow('Active?', manifest.isActive));
  if (manifest.lastSeen) rows.push(buildRow('Last Seen', manifest.lastSeen));

  if (manifest.eventStart && manifest.eventEnd) {
    const onRow = buildRow('On', manifest.eventStart);
    onRow.querySelector('h2').append(createTag('a', { href: `?instant=${manifest.eventStartIso}`, target: '_blank' }, 'Instant'));
    rows.push(onRow, buildRow('Off', manifest.eventEnd));
  }

  const select = createTag('select', { name: 'experiences', class: 'mep-manifest-variants' });
  manifest.options.forEach((option) => {
    const attrs = {
      name: option.name,
      value: option.value,
      title: option.title,
      ...(option.id && { id: option.id }),
      ...(option.dataManifest && { 'data-manifest': option.dataManifest }),
    };
    const optEl = createTag('option', attrs, option.label);
    if (option.selected) optEl.selected = true;
    select.append(optEl);
  });

  const card = createTag('div', { class: 'mep-card mep-manifest-card' });
  markExpanded(card, manifest.editUrl);
  card.append(header, createTag('div', { class: 'mep-card-body' }, rows), select);
  return card;
}

function buildManifestList(svgData) {
  const { manifests } = getManifestList();
  return manifests.map((manifest) => buildManifestCard(manifest, svgData));
}

function buildLoadManifest(card, pageId) {
  return createTag('input', {
    class: 'mep-load-manifest',
    type: 'text',
    name: `new-manifest${pageId}`,
    placeholder: card.label,
  });
}

function buildToggleRow([title, description], pageId) {
  const slug = title.toLowerCase().replace(/@|\s+/g, (m) => (m === '@' ? 'a' : '-')).replace(/[^\w-]/g, '');
  const id = `toggle-${slug}${pageId}`;
  const input = createTag('input', { type: 'checkbox', id });
  const switchEl = createTag('label', { class: 'mep-switch' }, [
    input,
    createTag('span', { class: 'mep-switch-track' }),
  ]);
  const desc = typeof description === 'function' ? description() : description;
  const textEl = createTag('div', { class: 'mep-toggle-text' }, [
    createTag('h2', {}, title),
    createTag('p', { class: 'mep-row-value' }, desc),
  ]);
  return createTag('div', { class: 'mep-toggle-row' }, [textEl, switchEl]);
}

function buildToggle(card, pageId) {
  const isProd = getConfig().env?.name === 'prod';
  return card.label
    .filter(([title]) => title !== 'Manifest Manager' || isProd)
    .map((item) => buildToggleRow(item, pageId));
}

function buildSpoofGeo(card, pageId, svgData) {
  const options = card.label.map((val, index) => {
    const id = `spoof-geo-${val}`;
    const radioInput = createTag('input', { type: 'radio', id, name: `spoof-geo${pageId}`, value: val });
    radioInput.checked = index === 0;
    const label = createTag('label', { for: id }, val);
    ['icon-radio-unchecked', 'icon-radio-checked'].forEach((icon) => label.prepend(svgIcon(svgData, icon)));
    return createTag('div', { class: 'mep-radio-row' }, [radioInput, label]);
  });
  return [...options, createTag('select', { class: 'mep-spoof-geo', name: `spoof-geo${pageId}` })];
}

function buildNestedSection(label, subPairs) {
  const rows = subPairs.map(([subLabel, subValue]) => createTag('div', { class: 'mep-surfaces-row' }, [
    createTag('div', { class: 'mep-row-value' }, subLabel),
    createTag('div', {}, String(subValue ?? '')),
  ]));
  return createTag('div', { class: 'mep-row-section' }, [createTag('h2', {}, label), ...rows]);
}

async function buildSummaryData(card) {
  const pairs = await card.getData?.();
  if (!pairs) return createTag('div', {}, 'No content available');
  return pairs.flatMap(([label, value]) => (
    Array.isArray(value) ? buildNestedSection(label, value) : buildRow(label, value)
  ));
}

function buildCardContent(card, svgData, pageId) {
  if (card.getData) return buildSummaryData(card);
  const builders = {
    'Load Manifest': () => buildLoadManifest(card, pageId),
    Toggle: () => buildToggle(card, pageId),
    'Spoof Geo': () => buildSpoofGeo(card, pageId, svgData),
  };
  builders.Highlight = builders.Toggle;
  return builders[card.header]?.() ?? createTag('div', {}, 'No content available');
}

function buildCard(card, svgData, pageId) {
  const cardEl = createTag('div', { class: 'mep-card' });
  if (!card?.header) return cardEl;

  const headerEl = createTag('h1', {}, card.header);
  headerEl.appendChild(svgIcon(svgData, 'icon-expand-circle-down'));

  const bodyEl = createTag('div', { class: 'mep-card-body' });
  Promise.resolve(buildCardContent(card, svgData, pageId)).then((content) => {
    bodyEl.append(...[content].flat());
  });

  markExpanded(cardEl, card.header);
  cardEl.append(headerEl, bodyEl);
  return cardEl;
}

function buildFAB(gnavOffset, svgData) {
  const fab = createTag('button', { class: 'mep-fab', style: `top: ${gnavOffset + 16}px`, popovertarget: 'mep-drawer' });
  fab.appendChild(svgIcon(svgData, 'icon-mep'));
  return fab;
}

function buildDrawerContents(svgData, pageId, isAuthed) {
  const logoLink = createTag('a', { class: 'logo-mep', href: 'https://main--milo--adobecom.aem.page/docs/authoring/features/mmm/', target: '_blank' });
  logoLink.appendChild(svgIcon(svgData, 'logo-mep'));

  const closeBtn = createTag('button', { class: 'icon-close', popovertarget: 'mep-drawer', popovertargetaction: 'hide' });
  closeBtn.appendChild(svgIcon(svgData, 'icon-close'));

  const navEl = createTag('div', { class: 'mep-navigation' }, [logoLink, closeBtn]);

  if (!isAuthed) {
    const headerEl = createTag('div', { class: 'mep-header' }, [navEl]);
    const messageEl = createTag('div', { class: 'mep-unauthed-message' }, [
      createTag('h2', {}, 'Sign in with AEM Sidekick'),
      createTag('p', {}, 'Install and sign in to AEM Sidekick to manage manifests on this page.'),
    ]);
    return [headerEl, messageEl];
  }

  const tabsEl = createTag('div', { class: 'mep-tabs' });
  const bodyEl = createTag('div', { class: 'mep-body' });

  ['Actions', 'Summary'].forEach((name, index) => {
    const tabEl = createTag('div', { class: 'mep-tab', 'data-tab': index }, name);
    const contentEl = createTag('div', { class: 'mep-tab-content', 'data-tab': index });
    if (index === 0) {
      tabEl.classList.add('active');
      contentEl.classList.add('active');
      buildManifestList(svgData).forEach((el) => contentEl.appendChild(el));
    }
    const section = CARD_DATA[name.toLowerCase()];
    const cards = section.map(([header, data]) => (
      name === 'Summary' ? { header, getData: data } : { header, label: data }
    ));
    cards.forEach((card) => contentEl.appendChild(buildCard(card, svgData, pageId)));
    tabsEl.appendChild(tabEl);
    bodyEl.appendChild(contentEl);
  });

  const headerEl = createTag('div', { class: 'mep-header' }, [navEl, tabsEl]);
  const footerEl = createTag('div', { class: 'mep-footer' }, [
    createTag('a', { class: 'con-button button-l fill', title: 'Preview', href: '#' }, 'Preview'),
  ]);

  return [headerEl, bodyEl, footerEl];
}

function buildDrawer(gnavOffset, svgData, pageId, isAuthed) {
  const className = isAuthed ? 'mep-drawer' : 'mep-drawer mep-unauthed';
  return createTag('div', {
    id: 'mep-drawer',
    class: className,
    popover: 'manual',
    style: `top: ${gnavOffset}px; height: calc(100vh - ${gnavOffset}px)`,
  }, buildDrawerContents(svgData, pageId, isAuthed));
}

function buildAdditionalManifests() {
  const manifests = getAdditionalManifests();
  const drawerEl = document.querySelector('#mep-drawer');
  const manifestEls = [...drawerEl.querySelectorAll('.mep-manifest-card')];
  const lastManifestEl = manifestEls[manifestEls.length - 1];

  if (lastManifestEl.classList.contains('mmm-manifest-card')) return;

  const expandSvg = lastManifestEl.querySelector('.icon-expand-circle-down').outerHTML;
  const svgData = { svg: { 'icon-expand-circle-down': expandSvg } };
  manifests.forEach((manifest) => {
    const manifestEl = buildManifestCard(manifest, svgData);
    manifestEl.classList.add('mmm-manifest-card');
    lastManifestEl.after(manifestEl);
  });
}

function setEventListeners() {
  const drawerEl = document.querySelector('#mep-drawer');

  drawerEl.addEventListener('click', (event) => {
    const tab = event.target.closest('.mep-tab');
    if (tab) {
      const tabIndex = tab.getAttribute('data-tab');
      drawerEl.querySelectorAll('[data-tab]').forEach((el) => {
        el.classList.toggle('active', el.getAttribute('data-tab') === tabIndex);
      });
      return;
    }
    const cardEl = event.target.closest('.mep-card svg') && event.target.closest('.mep-card');
    if (cardEl) toggleExpandedCard(cardEl);
  });

  drawerEl.addEventListener('change', (event) => {
    if (event.target.type === 'checkbox') event.target.toggleAttribute('checked', event.target.checked);
    setPreviewButton(event);
  });

  drawerEl.addEventListener('input', (event) => {
    if (event.target.id === 'toggle-manifest-manager') buildAdditionalManifests();
    toggleHighlight(event);
    setPreviewButton(event);
  });
}

function setDefaultValues() {
  const { mepCaasHighlight, mepMasHighlight, mepOtherHighlight, mepHighlight } = getParameters();
  [
    ['#toggle-mep', mepHighlight],
    ['#toggle-caas', mepCaasHighlight],
    ['#toggle-mas', mepMasHighlight],
    ['#toggle-other-fragments', mepOtherHighlight],
  ].forEach(([id, param]) => {
    if (!param) return;
    const checkbox = document.querySelector(id);
    if (!checkbox) return;
    checkbox.toggleAttribute('checked', true);
    toggleHighlight({ target: checkbox });
  });
}

function setMasObserver() {
  const MAS_SELECTOR = 'merch-card, mas-field, [data-mas-block], [data-wcs-osi]';

  const isMasNode = (node) => (
    node.nodeType === Node.ELEMENT_NODE
    && (node.matches(MAS_SELECTOR) || node.querySelector(MAS_SELECTOR))
  );

  const hasMasChanges = (mutations) => mutations.some(
    ({ addedNodes }) => [...addedNodes].some(isMasNode),
  );

  const refreshMasSummary = () => {
    const bodyEl = document.querySelector('[data-card-key="M@S"] .mep-card-body');
    if (!bodyEl) return;

    const rows = getMasSummary().flatMap(([label, value]) => (
      Array.isArray(value) ? buildNestedSection(label, value) : buildRow(label, value)
    ));
    bodyEl.replaceChildren(...rows);
  };

  let debounceTimer;
  const observer = new MutationObserver((mutations) => {
    if (!hasMasChanges(mutations)) return;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(refreshMasSummary, 200);
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

function buildOverlay({ svgData, gnavOffset, pageId, isAuthed }) {
  document.body.append(
    buildFAB(gnavOffset, svgData),
    buildDrawer(gnavOffset, svgData, pageId, isAuthed),
  );
}

async function init() {
  saveToMmm();
  loadStyle(new URL('./mep-overlay.css', import.meta.url));
  loadStyle(new URL('./mep-overlay-highlight.css', import.meta.url));
  const [svgData, gnavOffset] = await Promise.all([
    fetch(new URL('./mep-overlay-svg.json', import.meta.url)).then((r) => r.json()),
    getGnavOffset(),
  ]);
  const pageId = getPageId();
  setMasObserver();
  setBadgeEventListeners();

  function rebuildOverlay(isAuthed) {
    const existing = document.querySelector('#mep-drawer');
    if (existing?.matches(':popover-open')) {
      // In-place content swap. Popover stays open; event handlers persist
      // because they're delegated on the drawer element, not its children.
      existing.replaceChildren(...buildDrawerContents(svgData, pageId, isAuthed));
      existing.className = isAuthed ? 'mep-drawer' : 'mep-drawer mep-unauthed';
      setDefaultValues();
      setPreviewButton();
      return;
    }
    existing?.remove();
    document.querySelector('.mep-fab')?.remove();
    buildOverlay({ svgData, gnavOffset, pageId, isAuthed });
    setEventListeners();
    setDefaultValues();
    setPreviewButton();
  }

  // TEMP: `envs` expanded to include stage/local for preview-page testing.
  // Revert to default envs (`['prod']`) before merge.
  onSidekickAuth((isAuthed) => {
    // TEMP: `?mock-auth=true|false` overrides the real sidekick state for testing.
    // Remove this block before merge.
    const mockAuth = new URLSearchParams(window.location.search).get('mock-auth');
    let finalAuth = isAuthed;
    if (mockAuth === 'true') finalAuth = true;
    else if (mockAuth === 'false') finalAuth = false;
    // TEMP: remove before merge. Verifies auth state.
    // eslint-disable-next-line no-console
    console.log('[mep-overlay] sidekick auth state:', finalAuth, mockAuth ? '(mocked)' : '');

    rebuildOverlay(finalAuth);
  }, { envs: ['prod', 'stage'] });
}

init();
