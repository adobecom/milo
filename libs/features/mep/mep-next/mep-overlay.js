import { createTag, loadStyle } from '../../../utils/utils.js';
import {
  getPageId,
  getManifestsFound,
  getFoundation,
  getTargetIntegration,
  getPersonalization,
  getPerformanceConsent,
  getAdvertisingConsent,
  getLingoUpdates,
  getLangFirst,
  getGeoFolder,
  getCountryCookie,
  getUserCountry,
  getGeoUser,
  getManifestList,
  setPreviewButton,
} from './mep-next.js';

const SUMMARY_DATA_GETTERS = {
  'Manifests Found': getManifestsFound,
  Foundation: getFoundation,
  'Target Integration': getTargetIntegration,
  Personalization: getPersonalization,
  Performance: getPerformanceConsent,
  Advertising: getAdvertisingConsent,
  'Mep Lingo Updates': getLingoUpdates,
  'Lang First': getLangFirst,
  'Geo Folder': getGeoFolder,
  'Country Cookie': getCountryCookie,
  'User Country': getUserCountry,
  'Geo + User': async () => getGeoUser(),
};

function parseSvg(svgString) {
  return new DOMParser().parseFromString(svgString, 'image/svg+xml').documentElement;
}

function calcGnavHeight() {
  const header = document.querySelector('header');
  const fedsLocalNav = document.querySelector('.feds-localnav');
  if (!header?.offsetHeight) return 0;
  return header.offsetHeight + (fedsLocalNav?.offsetHeight || 0);
}

function getGnavOffset() {
  return new Promise((resolve) => {
    const height = calcGnavHeight();
    if (height) { resolve(height); return; }
    const observer = new MutationObserver(() => {
      const h = calcGnavHeight();
      if (h) { observer.disconnect(); resolve(h); }
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

function buildManifestCard(manifest, svgData) {
  const link = createTag('a', { href: manifest.editUrl, target: '_blank' }, [
    createTag('span', {}, `${manifest.index}. `),
    createTag('span', { class: 'mep-manifest-filename' }, manifest.fileName),
  ]);
  const header = createTag('div', { class: 'mep-manifest-header' }, [
    createTag('span', { class: 'mep-overline' }, 'Manifest'),
    createTag('h1', {}, [link, parseSvg(svgData.svg['icon-expand-circle-down'])]),
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
    rows.push(onRow);
    rows.push(buildRow('Off', manifest.eventEnd));
  }

  const select = createTag('select', { name: 'experiences', class: 'mep-manifest-variants' });
  manifest.options.forEach((option) => {
    const attrs = { name: option.name, value: option.value, title: option.title };
    if (option.id) attrs.id = option.id;
    if (option.dataManifest) attrs['data-manifest'] = option.dataManifest;
    const optEl = createTag('option', attrs, option.label);
    if (option.selected) optEl.selected = true;
    select.append(optEl);
  });

  const card = createTag('div', { class: 'mep-card mep-manifest-card expanded' });
  card.append(header, createTag('div', { class: 'mep-card-body' }, rows), select);
  return card;
}

function buildManifestList(svgData) {
  const { manifests } = getManifestList();
  return manifests.map((manifest) => buildManifestCard(manifest, svgData));
}

function buildLoadManifest(card, pageId) {
  return createTag('input', { class: 'mep-load-manifest', type: 'text', name: `new-manifest${pageId}`, placeholder: card.placeholder });
}

function buildToggle(card, pageId) {
  return card.label.map((item) => {
    const id = `toggle-${item.title.replace(/\s+/g, '-').toLowerCase()}${pageId}`;
    const inputAttrs = { type: 'checkbox', id };
    if (item.isChecked) inputAttrs.checked = '';
    const input = createTag('input', inputAttrs);
    const switchEl = createTag('label', { class: 'mep-switch' }, [
      input,
      createTag('span', { class: 'mep-switch-track' }),
    ]);
    const textEl = createTag('div', { class: 'mep-toggle-text' }, [
      createTag('h2', {}, item.title),
      createTag('p', { class: 'mep-row-value' }, item.description),
    ]);
    return createTag('div', { class: 'mep-toggle-row' }, [textEl, switchEl]);
  });
}

function buildSpoofGeo(card, pageId, svgData) {
  const options = card.label.map((val, index) => {
    const id = `spoof-geo-${val}`;
    const radioInput = createTag('input', { type: 'radio', id, name: `spoof-geo${pageId}`, value: val });
    radioInput.checked = index === 0;
    const label = createTag('label', { for: id }, val);
    ['icon-radio-unchecked', 'icon-radio-checked'].forEach((icon) => label.prepend(parseSvg(svgData.svg[icon])));
    return createTag('div', { class: 'mep-radio-row' }, [radioInput, label]);
  });
  const select = createTag('select', { class: 'mep-spoof-geo', name: `spoof-geo${pageId}` });
  return [...options, select];
}

async function buildSummaryData(card) {
  return Promise.all(card.label?.map(async (item) => {
    const value = await SUMMARY_DATA_GETTERS[item]?.();
    return createTag('div', { class: 'mep-row' }, [
      createTag('h2', {}, item),
      createTag('div', { class: 'mep-row-value' }, value),
    ]);
  }));
}

function buildCardContent(card, svgData, pageId) {
  const builders = {
    'Load Manifest': () => buildLoadManifest(card, pageId),
    Toggle: () => buildToggle(card, pageId),
    Highlight: () => buildToggle(card, pageId),
    'Spoof Geo': () => buildSpoofGeo(card, pageId, svgData),
    Page: () => buildSummaryData(card),
    Consent: () => buildSummaryData(card),
    Lingo: () => buildSummaryData(card),
  };
  return builders[card.header]?.() ?? createTag('div', {}, 'No content available');
}

function buildCard(card, svgData, pageId) {
  const cardEl = createTag('div', { class: 'mep-card expanded' });
  if (!card?.header) return cardEl;

  const headerEl = createTag('h1', {}, card.header);
  headerEl.appendChild(parseSvg(svgData.svg['icon-expand-circle-down']));

  const bodyEl = createTag('div', { class: 'mep-card-body' });
  Promise.resolve(buildCardContent(card, svgData, pageId)).then((content) => {
    bodyEl.append(...[content].flat());
  });

  cardEl.append(headerEl, bodyEl);
  return cardEl;
}

function buildFAB(gnavOffset, svgData) {
  const fab = createTag('button', { class: 'mep-fab', style: `top: ${gnavOffset + 16}px`, popovertarget: 'mep-drawer' });
  fab.appendChild(parseSvg(svgData.svg['icon-mep']));
  return fab;
}

function buildDrawer(gnavOffset, svgData, cardData, pageId) {
  const logoLink = createTag('a', { class: 'logo-mep', href: 'https://main--milo--adobecom.aem.page/docs/authoring/features/mmm/', target: '_blank' });
  logoLink.appendChild(parseSvg(svgData.svg['logo-mep']));

  const closeBtn = createTag('button', { class: 'icon-close', popovertarget: 'mep-drawer', popovertargetaction: 'hide' });
  closeBtn.appendChild(parseSvg(svgData.svg['icon-close']));

  const navEl = createTag('div', { class: 'mep-navigation' }, [logoLink, closeBtn]);
  const tabsEl = createTag('div', { class: 'mep-tabs' });
  const bodyEl = createTag('div', { class: 'mep-body' });

  ['Actions', 'Summary'].forEach((name, index) => {
    const active = index === 0 ? ' active' : '';
    tabsEl.appendChild(createTag('div', { class: `mep-tab${active}`, 'data-tab': index }, name));

    const contentEl = createTag('div', { class: `mep-tab-content${active}`, 'data-tab': index });
    if (name === 'Actions') buildManifestList(svgData).forEach((el) => contentEl.appendChild(el));
    const section = cardData[name.toLowerCase()] ?? {};
    Object.values(section).forEach((card) => {
      contentEl.appendChild(buildCard(card, svgData, pageId));
    });
    bodyEl.appendChild(contentEl);
  });

  const headerEl = createTag('div', { class: 'mep-header' }, [navEl, tabsEl]);
  const footerEl = createTag('div', { class: 'mep-footer' }, [
    createTag('a', { class: 'con-button button-l fill', title: 'Preview', href: '#' }, 'Preview'),
  ]);

  return createTag('div', {
    id: 'mep-drawer',
    class: 'mep-drawer',
    popover: 'manual',
    style: `top: ${gnavOffset}px; height: calc(100vh - ${gnavOffset}px)`,
  }, [headerEl, bodyEl, footerEl]);
}

function addEventListeners() {
  const drawerEl = document.querySelector('#mep-drawer');

  drawerEl.addEventListener('click', (e) => {
    const tab = e.target.closest('.mep-tab');
    if (tab) {
      const tabIndex = tab.getAttribute('data-tab');
      drawerEl.querySelectorAll('[data-tab]').forEach((el) => {
        el.classList.toggle('active', el.getAttribute('data-tab') === tabIndex);
      });
      return;
    }
    if (e.target.closest('.mep-card svg')) e.target.closest('.mep-card').classList.toggle('expanded');
  });

  drawerEl.addEventListener('change', (e) => {
    if (e.target.type === 'checkbox') e.target.toggleAttribute('checked', e.target.checked);
    setPreviewButton(e);
  });

  drawerEl.addEventListener('input', (e) => {
    if (e.target.type === 'text') setPreviewButton(e);
  });
}

async function buildOverlay() {
  const [svgData, cardData, gnavOffset] = await Promise.all([
    fetch(new URL('./mep-svg.json', import.meta.url)).then((r) => r.json()),
    fetch(new URL('./mep-card.json', import.meta.url)).then((r) => r.json()),
    getGnavOffset(),
  ]);

  const pageId = getPageId();
  document.body.append(
    buildFAB(gnavOffset, svgData),
    buildDrawer(gnavOffset, svgData, cardData, pageId),
  );
}

async function init() {
  loadStyle(new URL('./mep-overlay.css', import.meta.url));
  await buildOverlay();
  addEventListeners();
}

init();
