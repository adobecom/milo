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
} from './mep-next.js';

function getGnavOffset() {
  const calcHeight = () => {
    const header = document.querySelector('header');
    const fedsLocalNav = document.querySelector('.feds-localnav');
    if (!header?.offsetHeight) return 0;
    return header.offsetHeight + (fedsLocalNav?.offsetHeight || 0);
  };

  return new Promise((resolve) => {
    const height = calcHeight();
    if (height) { resolve(height); return; }
    const observer = new MutationObserver(() => {
      const h = calcHeight();
      if (h) { observer.disconnect(); resolve(h); }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  });
}

async function buildOverlay() {
  const bodyEl = document.querySelector('body');

  const svgUrl = new URL('./mep-svg.json', import.meta.url);
  const svgData = await fetch(svgUrl).then((r) => r.json());

  const cardUrl = new URL('./mep-card.json', import.meta.url);
  const cardData = await fetch(cardUrl).then((r) => r.json());

  const marginOffset = 16;
  const gnavOffset = await getGnavOffset();

  function parseSvg(svgString) {
    return new DOMParser().parseFromString(svgString, 'image/svg+xml').documentElement;
  }

  function buildManifestList() {
    const { manifests } = getManifestList();

    function buildRow(label, value) {
      const val = (typeof value === 'string' || value == null)
        ? createTag('div', { class: 'mep-row-value' }, value ?? '')
        : value;
      return createTag('div', { class: 'mep-row' }, [createTag('h2', {}, label), val]);
    }

    return manifests.map((manifest) => {
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
      card.append(header, createTag('div', { class: 'mep-card-body' }, [...rows, select]));
      return card;
    });
  }

  function buildCardContent(card) {
    const pageId = getPageId();

    function buildLoadManifest() {
      const mepManifestInput = createTag('input', { class: 'mep-load-manifest', name: `new-manifest-${pageId}`, placeholder: card.placeholder });
      return mepManifestInput;
    }

    function buildToggle() {
      return card.label.map((item) => {
        const id = `toggle-${item.title.replace(/\s+/g, '-').toLowerCase()}-${pageId}`;
        const switchEl = createTag('label', { class: 'mep-switch', for: id }, [
          createTag('input', { type: 'checkbox', id }),
          createTag('span', { class: 'mep-switch-track' }),
        ]);
        const textEl = createTag('div', { class: 'mep-toggle-text' }, [
          createTag('h2', {}, item.title),
          createTag('p', { class: 'mep-row-value' }, item.description),
        ]);
        return createTag('div', { class: 'mep-toggle-row' }, [textEl, switchEl]);
      });
    }

    function buildSpoofGeo() {
      const options = card.label.map((val, index) => {
        const id = `spoof-geo-${val}`;
        const radioInput = createTag('input', { type: 'radio', id, name: `spoof-geo-${pageId}`, value: val });
        radioInput.checked = index === 0;
        const label = createTag('label', { for: id }, val);
        ['icon-radio-unchecked', 'icon-radio-checked'].forEach((icon) => label.prepend(parseSvg(svgData.svg[icon])));
        return createTag('div', { class: 'mep-radio-row' }, [radioInput, label]);
      });
      const select = createTag('select', { class: 'mep-spoof-geo', name: `spoof-geo-${pageId}` });
      return [...options, select];
    }

    const getData = { // Key needs to match Json label
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

    async function buildSummaryData() {
      return Promise.all(card.label?.map(async (item) => {
        const mepRowEl = createTag('div', { class: 'mep-row' });
        const mepLabelEl = createTag('h2', {}, item);
        const value = await getData[item]?.();
        const mepValueEl = createTag('div', { class: 'mep-row-value' }, value);
        mepRowEl.append(mepLabelEl, mepValueEl);
        return mepRowEl;
      }));
    }

    function buildDefault() {
      return createTag('div', {}, 'No content available');
    }

    const buildCards = { // Key needs to match Json header
      'Load Manifest': () => buildLoadManifest(),
      Toggle: () => buildToggle(),
      Highlight: () => buildToggle(),
      'Spoof Geo': () => buildSpoofGeo(),
      Page: () => buildSummaryData(),
      Consent: () => buildSummaryData(),
      Lingo: () => buildSummaryData(),
    };

    return buildCards[card.header]?.() || buildDefault();
  }

  function buildCard(card) {
    const mepCardDiv = createTag('div', { class: 'mep-card expanded' });
    if (card?.header) {
      const headerDiv = createTag('h1', {}, card.header);
      headerDiv.appendChild(parseSvg(svgData.svg['icon-expand-circle-down']));
      const cardBodyDiv = createTag('div', { class: 'mep-card-body' });
      Promise.resolve(buildCardContent(card)).then((content) => {
        cardBodyDiv.append(...[content].flat());
      });
      mepCardDiv.append(headerDiv, cardBodyDiv);
    }
    return mepCardDiv;
  }

  function buildFAB() {
    const mepFabDiv = createTag('button', { class: 'mep-fab', style: `top: ${gnavOffset + marginOffset}px`, popovertarget: 'mep-drawer' });
    const mepIconLogoSvg = parseSvg(svgData.svg['icon-mep']);
    mepFabDiv.appendChild(mepIconLogoSvg);
    bodyEl.appendChild(mepFabDiv);
  }

  function buildDrawer() {
    const navigationDiv = createTag('div', { class: 'mep-navigation' });

    const logoLink = createTag('a', { class: 'logo-mep', href: 'https://main--milo--adobecom.aem.page/docs/authoring/features/mmm/', target: '_blank' });
    logoLink.appendChild(parseSvg(svgData.svg['logo-mep']));
    navigationDiv.appendChild(logoLink);

    const mepCloseBtn = createTag('button', { class: 'icon-close', popovertarget: 'mep-drawer', popovertargetaction: 'hide' });
    mepCloseBtn.appendChild(parseSvg(svgData.svg['icon-close']));
    navigationDiv.appendChild(mepCloseBtn);

    const mepTabsDiv = createTag('div', { class: 'mep-tabs' });
    const mepContentDiv = createTag('div', { class: 'mep-body' });

    const tabs = [
      { name: 'Actions' },
      { name: 'Summary' },
    ];

    tabs.forEach(({ name }, index) => {
      const active = index === 0 ? ' active' : '';
      mepTabsDiv.appendChild(createTag('div', { class: `mep-tab${active}`, 'data-tab': index }, name));
      const contentEl = createTag('div', { class: `mep-tab-content${active}`, 'data-tab': index });
      const section = cardData[name.toLowerCase()] ?? {};
      if (name === 'Actions') buildManifestList().forEach((el) => contentEl.appendChild(el));
      Object.values(section).forEach((card) => contentEl.appendChild(buildCard(card)));
      mepContentDiv.appendChild(contentEl);
    });

    const mepHeaderDiv = createTag('div', { class: 'mep-header' });
    mepHeaderDiv.append(navigationDiv, mepTabsDiv);

    const mepFooterDiv = createTag('div', { class: 'mep-footer' });
    mepFooterDiv.append(createTag('a', { class: 'con-button button-l fill', title: 'Preview', href: '#' }, 'Preview'));

    const mepDrawerDiv = createTag('div', { id: 'mep-drawer', class: 'mep-drawer', popover: 'manual', style: `top: ${gnavOffset}px; height: calc(100vh - ${gnavOffset}px)` });
    mepDrawerDiv.append(mepHeaderDiv, mepContentDiv, mepFooterDiv);
    bodyEl.appendChild(mepDrawerDiv);
  }

  buildFAB();
  buildDrawer();
}

function addTabListeners() {
  function changeTab(tabIndex) {
    const tabs = document.querySelectorAll('[data-tab]');

    tabs.forEach((tab) => {
      const index = tab.getAttribute('data-tab');
      if (index === tabIndex) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });
  }
  const tabs = document.querySelectorAll('.mep-tab');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const index = tab.getAttribute('data-tab');
      changeTab(index);
    });
  });
}

function addCardListeners() {
  function toggleCard(event) {
    event.target.closest('.mep-card').classList.toggle('expanded');
  }

  const cards = document.querySelectorAll('.mep-card');
  cards.forEach((card) => {
    const icon = card.querySelector('svg');
    if (icon) {
      icon.addEventListener('click', (event) => {
        toggleCard(event);
      });
    }
  });
}

function addEventListeners() {
  addTabListeners();
  addCardListeners();
}

async function init() {
  loadStyle(new URL('./mep-overlay.css', import.meta.url));
  await buildOverlay();
  addEventListeners();
}

init();
