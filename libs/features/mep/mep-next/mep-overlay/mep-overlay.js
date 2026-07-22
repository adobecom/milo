import { createTag, loadStyle, getConfig } from '../../../../utils/utils.js';
import { onSidekickAuth } from '../../sidekick-auth.js';
import {
  CARD_STORAGE_KEY,
  getExpandedCards,
  toSlug,
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
  getMasRegions,
  findGeoGroupForLocale,
} from './mep-overlay-logic.js';
import {
  TOGGLE_KEYS,
  toggleHighlight,
  getParameters,
  getPageUpdates,
  refreshPageUpdateCounts,
} from './mep-overlay-highlight.js';
import svgs from './mep-overlay-svg.js';

let authenticated = false;
const domParser = new DOMParser();

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

function svgIcon(key) {
  const el = domParser.parseFromString(svgs[key], 'image/svg+xml').documentElement;
  [el, ...el.querySelectorAll('*')].forEach((node) => {
    [...node.attributes]
      .filter(({ name }) => /^on/i.test(name))
      .forEach(({ name: attr }) => node.removeAttribute(attr));
  });
  return el;
}

function calcGnavOffset() {
  const header = document.querySelector('header');
  if (!header) return 0;
  const elements = [
    header,
    document.querySelector('.feds-localnav'),
    document.querySelector('.feds-promo-aside-wrapper'),
  ].filter(Boolean);
  return Math.max(0, ...elements.map((el) => el.getBoundingClientRect().bottom));
}

function getGnavOffset() {
  return new Promise((resolve) => {
    const height = calcGnavOffset();
    if (height) { resolve(height); return; }
    const observer = new MutationObserver(() => {
      const calculation = calcGnavOffset();
      if (calculation) { observer.disconnect(); resolve(calculation); }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
    setTimeout(() => { observer.disconnect(); resolve(0); }, 3000);
  });
}

function updateGnavOffset() {
  const offset = calcGnavOffset();
  document.querySelector('.mep-fab')?.style.setProperty('top', `${offset + 16}px`);
  const drawer = document.querySelector('#mep-drawer');
  if (drawer) {
    drawer.style.top = `${offset}px`;
    drawer.style.height = `calc(100vh - ${offset}px)`;
  }
}

function buildRow(label, value) {
  const cls = value === 'on' ? 'mep-row-value emphasis' : 'mep-row-value';
  const row = createTag('div', { class: cls }, value);
  return createTag('div', { class: 'mep-row' }, [createTag('h2', {}, label), row]);
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

function buildManifestCard(manifest) {
  const link = createTag('a', { href: manifest.editUrl, target: '_blank' }, [
    createTag('span', {}, `${manifest.index}. `),
    createTag('span', { class: 'mep-manifest-filename' }, manifest.fileName),
  ]);
  const header = createTag('div', { class: 'mep-manifest-header' }, [
    createTag('span', { class: 'mep-overline' }, 'Manifest'),
    createTag('h1', {}, [link, svgIcon('icon-expand-circle-down')]),
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

function buildManifestList() {
  const { manifests } = getManifestList();
  return manifests.map((manifest) => buildManifestCard(manifest));
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
  const id = `toggle-${toSlug(title)}${pageId}`;
  const input = createTag('input', { type: 'checkbox', id });
  const switchEl = createTag('label', { class: 'mep-switch' }, [
    input,
    createTag('span', { class: 'mep-switch-track' }),
  ]);
  const desc = typeof description === 'function' ? description(title) : description;
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

async function buildSpoofGeo(card, pageId) {
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

    ['icon-radio-unchecked', 'icon-radio-checked'].forEach((icon) => label.prepend(svgIcon(icon)));

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

function buildCardContent(card, pageId) {
  if (card.getData) return buildSummaryData(card);
  if (card.header === 'Spoof Geo') return buildSpoofGeo(card, pageId);
  if (card.header === 'Load Manifest') return buildLoadManifest(card, pageId);
  if (card.header === 'Toggle' || card.header === 'Highlight') return buildToggle(card, pageId);
  return createTag('div', {}, 'No content available');
}

function buildCard(card, pageId) {
  const cardEl = createTag('div', { class: 'mep-card' });
  if (!card?.header) return cardEl;

  const headerEl = createTag('h1', {}, card.header);
  headerEl.appendChild(svgIcon('icon-expand-circle-down'));

  const bodyEl = createTag('div', { class: 'mep-card-body' });
  cardEl.ready = Promise.resolve(buildCardContent(card, pageId))
    .then((nodes) => bodyEl.append(...[nodes].flat()));

  markExpanded(cardEl, card.header);
  cardEl.append(headerEl, bodyEl);
  return cardEl;
}

function buildFAB(gnavOffset) {
  const fab = createTag('button', {
    class: 'mep-fab',
    style: `top: ${gnavOffset + 16}px`,
    popovertarget: 'mep-drawer',
  });
  fab.appendChild(svgIcon('icon-mep'));
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
    createTag('a', { class: 'con-button button-l fill', title: 'Preview' }, 'Preview'),
  ]);
}

function buildActionsContent(pageId) {
  if (!authenticated) return [buildLoginCard()];
  return [
    ...buildManifestList(),
    ...CARD_DATA.actions.map(([header, data]) => (
      buildCard({ header, label: data }, pageId)
    )),
  ];
}

function buildTabsAndBody(pageId) {
  const tabDefs = [
    ['Actions', buildActionsContent(pageId)],
    ['Summary', CARD_DATA.summary.map(([header, data]) => buildCard({ header, getData: data }, pageId))],
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

  const selectEl = document.querySelector('select.mep-spoof-geo');
  if (!selectEl) return;

  if (!mepAkamaiLocale) {
    const radioEl = document.querySelector('#spoof-geo-top-markets');
    if (!radioEl || radioEl.disabled) return;
    radioEl.checked = true;
    await populateGeoSelect(selectEl, 'spoof-geo-top-markets');
    selectEl.value = '';
    return;
  }

  const id = await findGeoGroupForLocale(mepAkamaiLocale);
  if (!id) return;
  const radioEl = document.querySelector(`#${id}`);
  if (!radioEl || radioEl.disabled) return;

  radioEl.checked = true;
  await populateGeoSelect(selectEl, id);
  selectEl.value = mepAkamaiLocale;
}

function checkAuthAndBuild(pageId) {
  onSidekickAuth(async (isAuthed) => {
    if (isAuthed === authenticated) return;
    authenticated = isAuthed;

    const drawerEl = document.querySelector('#mep-drawer');
    const contentEl = drawerEl?.querySelector('.mep-tab-content[data-tab="0"]');
    if (!contentEl) return;

    if (!authenticated) {
      contentEl.replaceChildren(buildLoginCard());
      drawerEl.querySelector('.mep-footer')?.remove();
      return;
    }

    const cards = buildActionsContent(pageId);
    contentEl.replaceChildren(...cards);
    drawerEl.appendChild(buildFooter());
    await Promise.all(cards.map((c) => c.ready).filter(Boolean));
    setDefaultValues();
    setPreviewButton();
  }, { envs: ['prod'] });
}

function buildDrawer(gnavOffset, pageId) {
  const logoLink = createTag('a', { class: 'logo-mep', href: 'https://main--milo--adobecom.aem.page/docs/authoring/features/mmm/', target: '_blank' });
  logoLink.appendChild(svgIcon('logo-mep'));

  const closeBtn = createTag('button', { class: 'icon-close', popovertarget: 'mep-drawer', popovertargetaction: 'hide' });
  closeBtn.appendChild(svgIcon('icon-close'));

  const navEl = createTag('div', { class: 'mep-navigation' }, [logoLink, closeBtn]);
  const { tabsEl, bodyEl } = buildTabsAndBody(pageId);
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

async function buildAdditionalManifests() {
  const data = await getAdditionalManifests();
  const manifests = data?.activities ?? [];
  if (!manifests.length) return;

  const drawerEl = document.querySelector('#mep-drawer');
  const manifestEls = [...drawerEl.querySelectorAll('.mep-manifest-card')];
  const lastManifestEl = manifestEls[manifestEls.length - 1];

  if (!lastManifestEl || lastManifestEl.classList.contains('mmm-manifest-card')) return;

  for (const manifest of manifests) {
    const manifestEl = buildManifestCard(manifest);
    manifestEl.classList.add('mmm-manifest-card');
    lastManifestEl.after(manifestEl);
  }
}

function setEventListeners() {
  window.addEventListener('scroll', updateGnavOffset, { passive: true });
  window.addEventListener('resize', updateGnavOffset, { passive: true });

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
    if (event.target.type !== 'checkbox') setPreviewButton(event);
  });
}

function setMasObserver() {
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
  const masObserver = new MutationObserver(() => {
    if (!document.querySelector('#mep-drawer')?.matches(':popover-open')) return;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      refreshPageUpdateCounts();
      refreshMasSummary();
      refreshSpoofGeoMas();
    }, 200);
  });
  masObserver.observe(document.body, { childList: true, subtree: true });
}

async function buildOverlay() {
  const gnavOffset = await getGnavOffset();

  const pageId = getPageId();
  document.querySelector('main').append(
    buildFAB(gnavOffset),
    buildDrawer(gnavOffset, pageId),
  );
  checkAuthAndBuild(pageId);
}

export default async function init() {
  loadStyle(new URL('./mep-overlay.css', import.meta.url));
  loadStyle(new URL('./mep-overlay-highlight.css', import.meta.url));
  await buildOverlay();
  setEventListeners();
  setMasObserver();
}

export { buildCardContent as __buildCardContent };
