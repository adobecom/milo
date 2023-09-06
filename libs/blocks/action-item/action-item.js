import { decorateButtons } from '../../utils/decorate.js';
import { createTag } from '../../utils/utils.js';

function floatIcon(picture, icon) {
  icon.classList.add('floated-icon');
  picture.appendChild(icon);
}

function floatButton(picture, content) {
  decorateButtons(content);
  const btn = content.querySelector('.con-button');
  picture.classList.add('dark');
  if (btn) picture.appendChild(btn);
}

function getLinkAttrs(link) {
  const anchor = link.querySelector('a');
  let attrs = {};
  if (anchor) {
    attrs = Object.fromEntries([...anchor.attributes].map((attr) => [attr.name, attr.value]));
  }
  return attrs;
}

function getContent(el, variants, link) {
  const pictures = el.querySelectorAll('picture');
  const picture = pictures[0]?.parentElement;
  picture?.classList.add('main-image');
  const wrapLink = link && !variants.contains('float-button');
  const tag = wrapLink ? 'a' : 'div';
  const attrs = wrapLink ? getLinkAttrs(link) : {};
  if (variants.contains('float-icon') && pictures.length > 1) floatIcon(picture, pictures[1]);
  if (variants.contains('float-button') && link) floatButton(picture, link);
  if (variants.contains('static-links')) attrs.class = 'static';
  const content = createTag(tag, attrs, picture.closest('div'));
  return content;
}

export default function init(el) {
  const elems = el.querySelectorAll(':scope > div');
  const link = elems.length > 1 ? elems[elems.length - 1] : null;
  const content = getContent(elems[0], el.classList, link);
  el.replaceChildren(content);
}
