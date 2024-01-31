import { decorateTextOverrides, decorateBlockText, decorateBlockBg, decorateIconStack, decorateButtons } from '../../utils/decorate.js';
import { createTag, getConfig, loadStyle } from '../../utils/utils.js';

const blockTypeSizes = {
  large: ['xxl', 'm', 'l'],
  default: ['xl', 'm', 'l'],
};
const objFitOptions = ['fill', 'contain', 'cover', 'none', 'scale-down'];

function getBlockSize(el) {
  const sizes = Object.keys(blockTypeSizes);
  const size = sizes.find((s) => el.classList.contains(`${s}`)) || 'default';
  return blockTypeSizes[size];
}

function handleSupplementalText(foreground) {
  if (!foreground.querySelector('.action-area')) return;
  const nextP = foreground.querySelector('.action-area + p');
  const lastP = foreground.querySelector('.action-area ~ p:last-child');
  if (nextP) nextP.className = '';
  if (lastP) lastP.className = 'supplemental-text';
}

function setObjectFitAndPos(text, pic, bgEl) {
  const backgroundConfig = text.split(',').map((c) => c.toLowerCase().trim());
  const fitOption = objFitOptions.filter((c) => backgroundConfig.includes(c));
  const focusOption = backgroundConfig.filter((c) => !fitOption.includes(c));
  if (fitOption) [pic.querySelector('img').style.objectFit] = fitOption;
  bgEl.innerHTML = '';
  bgEl.append(pic);
  bgEl.append(document.createTextNode(focusOption.join(',')));
}

function handleObjectFit(bgRow) {
  const bgConfig = bgRow.querySelectorAll('div');
  [...bgConfig].forEach((r) => {
    const pic = r.querySelector('picture');
    if (!pic) return;
    let text = '';
    const pchild = [...r.querySelectorAll('p:not(:empty)')].filter((p) => p.innerHTML.trim() !== '');
    if (pchild.length > 2) text = pchild[1]?.textContent.trim();
    if (!text && r.textContent) text = r.textContent;
    if (!text) return;
    setObjectFitAndPos(text, pic, r);
  });
}

function handleClickableBrick(el, foreground) {
  if (!el.classList.contains('click')) return;
  const links = foreground.querySelectorAll('.brick-text a');
  if (links.length !== 1) { el.classList.remove('click'); return; }
  const a = links[0];
  const linkDiv = createTag('span', { class: [...a.classList, 'first-link'].join(' ') }, a.innerHTML);
  a.replaceWith(linkDiv, a);
  a.className = 'foreground';
  el.appendChild(a);
  a.innerHTML = foreground.innerHTML;
  foreground.remove();
}

function decorateSupplementalText(el) {
  const supplementalEl = el.querySelector('.foreground p.supplemental-text');
  if (!supplementalEl) return;
  supplementalEl.className = 'body-xs supplemental-text';
}

function decorateForeground(el, foreground) {
  const fgtext = foreground.querySelector('h1, h2, h3, h4, h5, h6, p')?.closest('div');
  fgtext.closest('div').classList.add('brick-text');
  if (foreground.querySelectorAll(':scope > div').length > 1) {
    if (!el.classList.contains('stack')) {
      foreground.closest('.brick').classList.add('split');
      if (!el.classList.contains('center')) el.classList.add('row');
    }
    const mediaEl = foreground.querySelector('div:not([class])');
    mediaEl.classList.add('brick-media');
    el.classList.add((foreground.firstElementChild === mediaEl) ? 'media-left' : 'media-right');
  }
  const hasIconArea = fgtext.querySelector('p')?.querySelector('img');
  if (hasIconArea) {
    const iconArea = fgtext.querySelector('p');
    iconArea.classList.add('icon-area');
    if (iconArea.querySelectorAll('img').length > 1) iconArea.classList.add('icon-gap-s');
  }
}

function decorateFillButtons(actionArea) {
  if (!actionArea) return;
  const btns = actionArea.querySelectorAll('a.con-button.blue');
  btns.forEach((b) => {
    b.classList.remove('blue');
    b.classList.add('fill');
  });
}

function decorateBricks(el) {
  if (!el.classList.contains('light')) el.classList.add('dark');
  const elems = el.querySelectorAll(':scope > div');
  if (elems.length > 1) {
    handleObjectFit(elems[elems.length - 2]);
    decorateBlockBg(el, elems[elems.length - 2], { useHandleFocalpoint: true });
  }
  if (elems.length > 2) {
    el.style.background = elems[0].textContent;
    elems[0].remove();
  }
  const foreground = elems[elems.length - 1];
  foreground.classList.add('foreground');
  decorateForeground(el, foreground);
  const blockFormatting = getBlockSize(el);
  decorateButtons(foreground, 'button-l');
  decorateBlockText(foreground, blockFormatting);
  if (el.classList.contains('button-fill')) decorateFillButtons(foreground.querySelector('.action-area'));
  el.querySelector('.icon-area')?.classList.remove('detail-l');
  decorateIconStack(el);
  el.querySelector('.icon-stack-area')?.classList.add('body-xs');
  handleSupplementalText(foreground);
  handleClickableBrick(el, foreground);
  return foreground;
}

export default function init(el) {
  if (el.className.includes('rounded-corners')) {
    const { miloLibs, codeRoot } = getConfig();
    const base = miloLibs || codeRoot;
    loadStyle(`${base}/styles/rounded-corners.css`);
  }
  decorateBricks(el);
  decorateTextOverrides(el);
  decorateSupplementalText(el);
}
