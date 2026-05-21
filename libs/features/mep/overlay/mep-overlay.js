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

  const marginOffset = 16;
  const gnavOffset = await getGnavOffset();

  function parseSvg(svgString) {
    return new DOMParser().parseFromString(svgString, 'image/svg+xml').documentElement;
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

    const closeBtn = createTag('button', { class: 'icon-close', popovertarget: 'mep-drawer', popovertargetaction: 'hide' });
    closeBtn.appendChild(parseSvg(svgData.svg['icon-close']));
    navigationDiv.appendChild(closeBtn);

    const mepTabsDiv = createTag('div', { class: 'mep-tabs' });
    const mepContentDiv = createTag('div', { class: 'mep-body' });

    const tabs = [
      { name: 'Actions', cards: [1, 2, 3] },
      { name: 'Summary', cards: [4, 5, 6] },
    ];

    tabs.forEach(({ name, cards }, index) => {
      const active = index === 0 ? ' active' : '';
      mepTabsDiv.appendChild(createTag('div', { class: `mep-tab${active}`, 'data-tab': index }, name));
      const contentEl = createTag('div', { class: `mep-tab-content${active}`, 'data-tab': index });
      cards.forEach((n) => contentEl.appendChild(createTag('div', { class: 'mep-card' }, `Card ${n}`)));
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

function addEventListeners() {
  const tabs = document.querySelectorAll('.mep-tab');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const index = tab.getAttribute('data-tab');
      changeTab(index);
    });
  });
}

async function init() {
  loadStyle(new URL('./mep-overlay.css', import.meta.url));
  await buildOverlay();
  addEventListeners();
}

init();
