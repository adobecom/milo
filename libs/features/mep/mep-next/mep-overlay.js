import { createTag, loadStyle } from '../../../utils/utils.js';

function getGnavOffset() {
  return new Promise((resolve) => {
    const headerEl = document.querySelector('header');
    if (headerEl?.offsetHeight) {
      resolve(headerEl.offsetHeight);
      return;
    }
    const observer = new MutationObserver(() => {
      const el = document.querySelector('header');
      if (el?.offsetHeight) {
        observer.disconnect();
        resolve(el.offsetHeight);
      }
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

  function buildCard(card) {
    const mepCardDiv = createTag('div', { class: 'mep-card' });
    if (card?.header) {
      const mepIconCloseSvg = parseSvg(svgData.svg['icon-expand-circle-down']);
      const headerDiv = createTag('h1', {}, card.header);
      const cardBodyDiv = createTag('div', { class: 'mep-card-body' }, 'Card Body');
      headerDiv.appendChild(mepIconCloseSvg);
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

function toggleCard(event) {
  event.target.closest('.mep-card').classList.toggle('expanded');
}

function addEventListeners() {
  const tabs = document.querySelectorAll('.mep-tab');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const index = tab.getAttribute('data-tab');
      changeTab(index);
    });
  });

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

async function init() {
  loadStyle(new URL('./mep-overlay.css', import.meta.url));
  await buildOverlay();
  addEventListeners();
}

init();
