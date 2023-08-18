import { decorateButtons } from '../../utils/decorate.js';
import { createTag } from '../../utils/utils.js';

function floatIcon(picture, icon) {
  icon.classList.add('floated-icon');
  picture.appendChild(icon);
}

function floatButton(picture, content) {
  decorateButtons(content);
  const btn = content.querySelector('.con-button');
  if (!btn) return;
  picture.classList.add('dark');
  picture.appendChild(btn);
}

function getLinkAttrs(link) {
  const anchor = link.querySelector('a');
  if (!anchor) return {};
  return Object.fromEntries([...anchor.attributes].map((attr) => [attr.name, attr.value]));
}

function getContent(el, variants, link) {
  const pictures = el.querySelectorAll('picture');
  const mainPic = pictures[0];
  const picture = mainPic?.parentElement;
  picture?.classList.add('main-image');
  const wrapLink = link && !variants.contains('float-button');
  const tag = wrapLink ? 'a' : 'div';
  let attrs = wrapLink ? getLinkAttrs(link) : {};
  if (variants.contains('float-icon') && pictures.length > 1) floatIcon(picture, pictures[1]);
  if (variants.contains('float-button') && link) floatButton(picture, link);
  if (variants.contains('static-links')) attrs = { ...attrs, class: 'static' };
  const content = createTag(tag, { ...attrs }, picture.closest('div'));
  return content;
}

export default function init(el) {
  const elems = el.querySelectorAll(':scope > div');
  if (!elems.length) return;
  const link = elems.length > 1 ? elems[elems.length - 1] : null;
  const content = getContent(elems[0], el.classList, link);
  el.replaceChildren(content);
}
