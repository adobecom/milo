import { createTag, loadStyle, getConfig } from '../../../../utils/utils.js';
import { onSidekickAuth } from '../../sidekick-auth.js';
import {
  getPageId,
  getManifestList,
  getAdditionalManifests,
  getPageSummary,
  getConsentSummary,
  getLingoSummary,
  getMasSummary,
  getCaasSummary,
  getLingoAvailability,
  getMasAvailability,
  getSpoofGeoOptions,
  setPreviewButton,
  getLingoRegions,
  getMasRegions,
  TOP_MARKETS,
} from './mep-overlay-logic.js';
import {
  TOGGLE_KEYS,
  toggleHighlight,
  getParameters,
  getPageUpdates,
  setHighlightData,
  setBadgeEventListeners,
} from './mep-overlay-highlight.js';
import { saveToMmm } from '../mep-next.js';

const CARD_STORAGE_KEY = 'mep-expanded-cards';

let authenticated = false;

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
    ['Spoof Geo', ['Top Markets', 'MEP Lingo', 'Lingo M@S']],
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

function parseSvg(svgString) {
  return new DOMParser().parseFromString(svgString, 'image/svg+xml').documentElement;
}

function svgIcon(svgData, key) {
  return parseSvg(svgData.svg[key]);
}

function getGnavOffset() {
  const calculate = () => {
    const header = document.querySelector('header');
    if (!header?.offsetHeight) return 0;
    const localNav = document.querySelector('.feds-localnav');
    const promoAside = document.querySelector('.feds-promo-aside-wrapper');
    return header.offsetHeight + (localNav?.offsetHeight || 0) + (promoAside?.offsetHeight || 0);
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
  const row = createTag('div', { class: 'mep-row-value' }, value);
  return createTag('div', { class: 'mep-row' }, [createTag('h2', {}, label), row]);
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

const toSlug = (str) => str.toLowerCase().replace(/@|\s+/g, (m) => (m === '@' ? 'a' : '-')).replace(/[^\w-]/g, '');

function buildToggleRow([title, description], pageId) {
  const id = `toggle-${toSlug(title)}${pageId}`;
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

async function populateGeoSelect(selectEl, id) {
  const geoOptions = await getSpoofGeoOptions(id) ?? [];
  selectEl.replaceChildren(...geoOptions.map(({ value, label, selected }) => {
    const opt = createTag('option', { value }, label);
    if (selected) opt.selected = true;
    return opt;
  }));
}

async function buildSpoofGeo(card, pageId, svgData) {
  const availabilityChecks = {
    'spoof-geo-mep-lingo': getLingoAvailability,
    'spoof-geo-lingo-mas': getMasAvailability,
  };

  const radioGroupName = `spoof-geo${pageId}`;
  const selectEl = createTag('select', { class: 'mep-spoof-geo', name: radioGroupName });
  const labelMap = new Map();
  let firstAvailableChecked = false;

  async function buildRadioRow(val) {
    const id = `spoof-geo-${toSlug(val)}`;
    const radioInput = createTag('input', { type: 'radio', id, name: radioGroupName, value: val });

    const checkAvailability = availabilityChecks[id];
    const isUnavailable = checkAvailability && !await checkAvailability();

    if (isUnavailable) {
      radioInput.disabled = true;
    } else if (!firstAvailableChecked) {
      radioInput.checked = true;
      firstAvailableChecked = true;
      await populateGeoSelect(selectEl, id);
    }

    const label = createTag('label', { for: id, 'data-value': val }, val);
    labelMap.set(id, label);

    ['icon-radio-unchecked', 'icon-radio-checked'].forEach((icon) => label.prepend(svgIcon(svgData, icon)));

    radioInput.addEventListener('change', async () => {
      await populateGeoSelect(selectEl, id);
      const saved = label.dataset.selected;
      if (saved) selectEl.value = saved;
    });

    return createTag('div', { class: 'mep-radio-row' }, [radioInput, label]);
  }

  const rows = await Promise.all(card.label.map(buildRadioRow));

  selectEl.addEventListener('change', () => {
    const checkedRadio = document.querySelector(`input[name="${radioGroupName}"]:checked`);
    if (checkedRadio) labelMap.get(checkedRadio.id)?.setAttribute('data-selected', selectEl.value);
  });

  return [...rows, selectEl];
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
  Promise.resolve(buildCardContent(card, svgData, pageId))
    .then((nodes) => bodyEl.append(...[nodes].flat()));

  markExpanded(cardEl, card.header);
  cardEl.append(headerEl, bodyEl);
  return cardEl;
}

function buildFAB(gnavOffset, svgData) {
  const fab = createTag('button', {
    class: 'mep-fab',
    style: `top: ${gnavOffset + 16}px`,
    popovertarget: 'mep-drawer',
  });
  fab.appendChild(svgIcon(svgData, 'icon-mep'));
  return fab;
}

function buildLoginCard() {
  return createTag('div', { class: 'mep-card expanded center' }, [
    createTag('h1', {}, 'Content Unavailable'),
    createTag('p', { class: 'mep-card-body' }, 'Sign into AEM Sidekick for options.'),
  ]);
}

function buildFooter() {
  return createTag('div', { class: 'mep-footer' }, [
    createTag('a', { class: 'con-button button-l fill', title: 'Preview', href: '#' }, 'Preview'),
  ]);
}

function buildActionsContent(svgData, pageId) {
  if (!authenticated) return [buildLoginCard()];
  return [
    ...buildManifestList(svgData),
    ...CARD_DATA.actions.map(([header, data]) => (
      buildCard({ header, label: data }, svgData, pageId)
    )),
  ];
}

function buildTabsAndBody(svgData, pageId) {
  const tabDefs = [
    ['Actions', buildActionsContent(svgData, pageId)],
    ['Summary', CARD_DATA.summary.map(([header, data]) => buildCard({ header, getData: data }, svgData, pageId))],
  ];

  const tabsEl = createTag('div', { class: 'mep-tabs' });
  const bodyEl = createTag('div', { class: 'mep-body' });

  tabDefs.forEach(([name, content], index) => {
    const isActive = index === 0;
    const tabEl = createTag('div', { class: `mep-tab${isActive ? ' active' : ''}`, 'data-tab': index }, name);
    const contentEl = createTag('div', { class: `mep-tab-content${isActive ? ' active' : ''}`, 'data-tab': index });
    content.forEach((el) => contentEl.appendChild(el));
    tabsEl.appendChild(tabEl);
    bodyEl.appendChild(contentEl);
  });

  return { tabsEl, bodyEl };
}

function checkAuthAndBuild(svgData, pageId) {
  onSidekickAuth((isAuthed) => {
    const mockAuth = new URLSearchParams(window.location.search).get('mock-auth');
    const finalAuth = mockAuth !== null ? mockAuth === 'true' : isAuthed;
    // eslint-disable-next-line no-console
    console.log('[mep-overlay] sidekick auth state:', finalAuth, mockAuth !== null ? '(mocked)' : '');
    if (finalAuth === authenticated) return;
    authenticated = finalAuth;

    const drawerEl = document.querySelector('#mep-drawer');
    const contentEl = drawerEl?.querySelector('.mep-tab-content[data-tab="0"]');
    if (!contentEl) return;

    if (!authenticated) {
      contentEl.replaceChildren(buildLoginCard());
      drawerEl.querySelector('.mep-footer')?.remove();
      return;
    }

    contentEl.replaceChildren(...buildActionsContent(svgData, pageId));
    drawerEl.appendChild(buildFooter());
  }, { envs: ['prod', 'stage'] });
}

function buildDrawer(gnavOffset, svgData, pageId) {
  const logoLink = createTag('a', { class: 'logo-mep', href: 'https://main--milo--adobecom.aem.page/docs/authoring/features/mmm/', target: '_blank' });
  logoLink.appendChild(svgIcon(svgData, 'logo-mep'));

  const closeBtn = createTag('button', { class: 'icon-close', popovertarget: 'mep-drawer', popovertargetaction: 'hide' });
  closeBtn.appendChild(svgIcon(svgData, 'icon-close'));

  const navEl = createTag('div', { class: 'mep-navigation' }, [logoLink, closeBtn]);
  const { tabsEl, bodyEl } = buildTabsAndBody(svgData, pageId);
  const headerEl = createTag('div', { class: 'mep-header' }, [navEl, tabsEl]);
  const children = [headerEl, bodyEl];
  if (authenticated) children.push(buildFooter());

  return createTag('div', {
    id: 'mep-drawer',
    class: 'mep-drawer',
    popover: 'manual',
    style: `top: ${gnavOffset}px; height: calc(100vh - ${gnavOffset}px)`,
  }, children);
}

function buildAdditionalManifests() {
  const manifests = getAdditionalManifests();
  const drawerEl = document.querySelector('#mep-drawer');
  const manifestEls = [...drawerEl.querySelectorAll('.mep-manifest-card')];
  const lastManifestEl = manifestEls[manifestEls.length - 1];

  if (!lastManifestEl || lastManifestEl.classList.contains('mmm-manifest-card')) return;

  const expandSvg = lastManifestEl.querySelector('.icon-expand-circle-down').outerHTML;
  const svgData = { svg: { 'icon-expand-circle-down': expandSvg } };

  for (const manifest of manifests) {
    const manifestEl = buildManifestCard(manifest, svgData);
    manifestEl.classList.add('mmm-manifest-card');
    lastManifestEl.after(manifestEl);
  }
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

async function setDefaultValues() {
  const {
    mepCaasHighlight,
    mepMasHighlight,
    mepOtherHighlight,
    mepHighlight,
    mepAkamaiLocale,
  } = getParameters();
  [
    [`#${TOGGLE_KEYS.mep}`, mepHighlight],
    [`#${TOGGLE_KEYS.caas}`, mepCaasHighlight],
    [`#${TOGGLE_KEYS.mas}`, mepMasHighlight],
    [`#${TOGGLE_KEYS.other}`, mepOtherHighlight],
  ].forEach(([id, param]) => {
    if (!param) return;
    const checkbox = document.querySelector(id);
    if (!checkbox) return;
    checkbox.toggleAttribute('checked', true);
    toggleHighlight({ target: checkbox });
  });

  if (!mepAkamaiLocale) {
    const radioEl = document.querySelector('#spoof-geo-top-markets');
    const selectEl = document.querySelector('select.mep-spoof-geo');
    if (!radioEl || radioEl.disabled || !selectEl) return;
    radioEl.checked = true;
    await populateGeoSelect(selectEl, 'spoof-geo-top-markets');
    selectEl.value = '';
    return;
  }

  const masRegions = await getMasRegions();
  const geoGroups = [
    ['spoof-geo-top-markets', TOP_MARKETS],
    ['spoof-geo-mep-lingo', getLingoRegions()],
    ['spoof-geo-lingo-mas', masRegions],
  ];

  const match = geoGroups.find(([, regions]) => regions.includes(mepAkamaiLocale));
  if (!match) return;

  const [id] = match;
  const radioEl = document.querySelector(`#${id}`);
  if (!radioEl || radioEl.disabled) return;

  radioEl.checked = true;
  const selectEl = document.querySelector('select.mep-spoof-geo');
  if (!selectEl) return;

  await populateGeoSelect(selectEl, id);
  selectEl.value = mepAkamaiLocale;
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

  const refreshSpoofGeoMas = async () => {
    const input = document.querySelector('#spoof-geo-lingo-mas');
    if (!input?.disabled) return;
    if (await getMasAvailability()) {
      input.disabled = false;

      const { mepAkamaiLocale } = getParameters();
      if (!mepAkamaiLocale) return;

      const masRegions = await getMasRegions();
      if (!masRegions.includes(mepAkamaiLocale)) return;

      input.checked = true;
      const selectEl = document.querySelector('select.mep-spoof-geo');
      if (!selectEl) return;

      await populateGeoSelect(selectEl, 'spoof-geo-lingo-mas');
      selectEl.value = mepAkamaiLocale;
    }
  };

  let debounceTimer;
  const observer = new MutationObserver((mutations) => {
    if (!hasMasChanges(mutations)) return;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      refreshMasSummary();
      refreshSpoofGeoMas();
    }, 200);
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

async function buildOverlay() {
  const [svgData, gnavOffset] = await Promise.all([
    fetch(new URL('./mep-overlay-svg.json', import.meta.url)).then((r) => r.json()),
    getGnavOffset(),
  ]);

  const pageId = getPageId();
  document.querySelector('main').append(
    buildFAB(gnavOffset, svgData),
    buildDrawer(gnavOffset, svgData, pageId),
  );
  checkAuthAndBuild(svgData, pageId);
}

async function init() {
  saveToMmm();
  loadStyle(new URL('./mep-overlay.css', import.meta.url));
  loadStyle(new URL('./mep-overlay-highlight.css', import.meta.url));
  await buildOverlay();
  setEventListeners();
  setDefaultValues();
  setPreviewButton();
  setMasObserver();
  setHighlightData();
  setBadgeEventListeners();
}

init();
