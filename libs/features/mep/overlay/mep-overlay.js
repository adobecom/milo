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

  function generateFAB() {
    const mepFabEl = createTag('div', { class: 'mep-fab', style: `top: ${gnavOffset + marginOffset}px` });
    mepFabEl.innerHTML = svgData.svg['icon-mep-logo'];

    bodyEl.appendChild(mepFabEl);
  }

  function generateDrawer() {
    const mepOverlayEl = createTag('div', { class: 'mep-overlay', style: `top: ${gnavOffset}px` });
    bodyEl.appendChild(mepOverlayEl);
  }

  generateFAB();
  generateDrawer();
}

async function init() {
  loadStyle(new URL('./mep-overlay.css', import.meta.url));
  await buildOverlay();
}

init();
