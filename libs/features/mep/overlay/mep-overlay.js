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

  function generateFAB() {
    const mepFabDiv = createTag('div', { class: 'mep-fab', style: `top: ${gnavOffset + marginOffset}px` });
    const mepIconLogoSvg = parseSvg(svgData.svg['icon-mep']);
    mepFabDiv.appendChild(mepIconLogoSvg);
    bodyEl.appendChild(mepFabDiv);
  }

  function generateDrawer() {
    // Header
    const mepHeaderDiv = createTag('div', { class: 'mep-header' });
    const mepLogoSvg = parseSvg(svgData.svg['logo-mep']);
    const mepCloseSvg = parseSvg(svgData.svg['icon-close']);
    mepHeaderDiv.append(mepLogoSvg, mepCloseSvg);

    // Body
    const mepContentDiv = createTag('div', { class: 'mep-body' });

    const cards = [1, 2, 3];
    cards.forEach((card) => {
      const cardDiv = createTag('div', { class: 'mep-card' }, `Card ${card}`);
      mepContentDiv.appendChild(cardDiv);
    });

    // Footer
    const mepFooterDiv = createTag('div', { class: 'mep-footer' });
    const previewBtn = createTag(
      'a',
      {
        class: 'con-button button-l fill',
        title: 'Preview',
        href: '#',
      },
      'Preview',
    );
    mepFooterDiv.append(previewBtn);

    // Drawer
    const mepDrawerDiv = createTag('div', { class: 'mep-drawer', style: `top: ${gnavOffset}px; height: calc(100vh - ${gnavOffset}px)` });
    mepDrawerDiv.append(mepHeaderDiv, mepContentDiv, mepFooterDiv);

    bodyEl.appendChild(mepDrawerDiv);
  }

  generateFAB();
  generateDrawer();
}

async function init() {
  loadStyle(new URL('./mep-overlay.css', import.meta.url));
  await buildOverlay();
}

init();
