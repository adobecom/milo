import { decorateTextOverrides, decorateBlockText, decorateBlockBg, decorateIconStack } from '../../utils/decorate.js';
import { createTag } from '../../utils/utils.js';

const blockTypeSizes = {
  full: ['xxl', 'm', 'l'],
  default: ['xl', 'm', 'l'],
};
const objFitOptions = ['fill', 'contain', 'cover', 'none', 'scale-down'];

function getBlockSize(el) {
  const sizes = Object.keys(blockTypeSizes);
  const size = sizes.find((s) => el.classList.contains(`${s}-grid`)) || 'default';
  return blockTypeSizes[size];
}

function handleBrickFragment(el) {
  if (!el.closest('.fragment')) return;
  const gridVariant = [...el.classList]?.find((c) => c.match(/-grid/));
  if (!gridVariant || !el.closest('.section.masonry-layout')) return;
  if (!el.parentNode.classList.contains('.section.masonry-layout')) {
    el.closest('.section.masonry-layout div:not([class])')?.classList.add(gridVariant);
  }
}

function decorateDefaultButton(foreground) {
  if (!foreground.querySelector('.action-area')) return;
  const btns = foreground.querySelectorAll('.con-button');
  [...btns].forEach((btn) => btn.classList.add('button-l'));
  const nextP = foreground.querySelector('.action-area + p');
  const lastP = foreground.querySelector('.action-area ~ p:last-child');
  if (nextP) nextP.className = '';
  if (lastP) lastP.className = 'supplemental-text';
}

function handleObjectFit(bgRow) {
  const bgConfig = bgRow.querySelectorAll('div');
  [...bgConfig].forEach((r) => {
    const image = r.querySelector('img');
    if (!image) return;
    const pchild = r.querySelectorAll(':scope > p');
    if (pchild.length < 2) return;
    const backgroundConfig = pchild[1].textContent.split(',').map((c) => c.toLowerCase().trim());
    const fitOption = objFitOptions.filter((c) => backgroundConfig.includes(c));
    const focusOption = backgroundConfig.filter((c) => !fitOption.includes(c));
    pchild[1].innerText = focusOption.join(',');
    if (fitOption.length) [image.style.objectFit] = fitOption;
  });
}

function handleClickableBrick(el, foreground) {
  if (!el.classList.contains('click')) return;
  const links = foreground.querySelectorAll('a');
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

function decorateBricks(el) {
  handleBrickFragment(el);
  const elems = el.querySelectorAll(':scope > div');
  if (elems.length > 1) {
    handleObjectFit(elems[elems.length - 2]);
    decorateBlockBg(el, elems[elems.length - 2], { useHandleFocalpoint: true });
  }
  if (elems.length > 2) {
    el.querySelector('.background').style.background = elems[0].textContent;
    elems[0].remove();
  }
  const foreground = elems[elems.length - 1];
  foreground.classList.add('foreground');
  const hasIconArea = foreground.querySelector('p')?.querySelector('img');
  if (hasIconArea) foreground.querySelector('p').classList.add('icon-area');
  const blockFormatting = getBlockSize(el);
  decorateBlockText(foreground, blockFormatting);
  decorateIconStack(el);
  el.querySelector('.icon-stack-area')?.classList.add('body-xs');
  decorateDefaultButton(foreground);
  handleClickableBrick(el, foreground);
  return foreground;
}

export default async function init(el) {
  decorateBricks(el);
  decorateTextOverrides(el);
  decorateSupplementalText(el);
}
