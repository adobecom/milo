import { decorateBlockBg, decorateBlockHrs, decorateBlockText, decorateTextOverrides } from '../../utils/decorate.js';
import { createTag } from '../../utils/utils.js';

const contentTypes = ['list', 'qrcode', 'lockup', 'text', 'background'];
const rowTypeKeyword = 'milo-row-type-';

function decorateList(el) {
  el.classList.add('body-l', 'align-left');
  const listItems = el.querySelectorAll('ul li', 'ol li');
  if (listItems.length) {
    const firstDiv = el.querySelector(':scope > div');
    firstDiv.classList.add('foreground');
    [...listItems].forEach((item) => {
      const firstElemIsIcon = item.children[0]?.classList.contains('icon');
      if (firstElemIsIcon) item.classList.add('icon-item');
      if (!item.parentElement.classList.contains('icon-list')) item.parentElement.classList.add('icon-list');
    });
  }
}

function decorateQr(el) {
  const text = el.querySelector(':scope > div');
  if (!text && !text.children) return;
  const classes = ['qr-code-img', 'google-play', 'app-store'];
  [...text.children].forEach((e, i) => {
    e.classList.add(classes[i]);
  });
}

function decorateLockup(el) {
  const rows = el.querySelectorAll(':scope > p');
  const firstRowImg = rows[0]?.querySelector('img');
  if (firstRowImg) rows[0].classList.add('flex-row');
}

function decorateBg(el) {
  const block = el.closest('.hero-marquee');
  block.style.background = el.textContent.trim();
  el.remove();
}

function decorateBadge(el) {
  const regex = /\[\[(.*?)\]\]/g;
  const header = el.querySelector('h1, h2, h3, h4, h5, h6');
  const matches = header.innerHTML.match(regex);
  if (!matches) return;
  matches.forEach((match) => {
    const badgeText = match.substring(2, match.length - 2);
    /* c8 ignore next */
    if (!badgeText) return;
    const badge = createTag('span', { class: 'badge' }, badgeText);
    header.innerHTML = header.innerHTML.replace(regex, '');
    header.append(badge);
  });
}

function extendButtonsClass(text) {
  const buttons = text.querySelectorAll('.con-button');
  if (buttons.length === 0) return;
  buttons.forEach((button) => { button.classList.add('button-l', 'button-justified-mobile'); });
}

function parseKeyString(str) {
  const regex = /^(\w+)\s*\((.*)\)$/;
  const match = str.match(regex);
  if (!match) return { key: str };
  const key = match[1];
  const classes = match[2].split(',').map((c) => c.trim());
  const result = { key, classes };
  return result;
}

function loadContentType(el, key, classes) {
  if (key === 'lockup') {
    const child = el.querySelector(':scope > div');
    if (child) child.classList.add('flex-row');
  }
  if (key === 'list') decorateList(el);
  if (key === 'qrcode') decorateQr(el);
  if (key === 'background') decorateBg(el);
  if (classes !== undefined && classes.length) el.classList.add(...classes);
}

export default async function init(el) {
  el.classList.add('con-block');
  let rows = el.querySelectorAll(':scope > div');
  if (rows.length > 1 && rows[0].textContent !== '') {
    el.classList.add('has-bg');
    const [head, ...tail] = rows;
    decorateBlockBg(el, head);
    rows = tail;
  }
  // get first row that's not a keyword key/value row
  const mainRowIndex = rows.findIndex((row) => {
    const firstColText = row.children[0].textContent.toLowerCase().trim();
    return !firstColText.includes(rowTypeKeyword);
  });
  const foreground = rows[mainRowIndex];
  const fRows = foreground.querySelectorAll(':scope > div');
  foreground.classList.add('foreground', `cols-${fRows.length}`);
  let copy = fRows[0];
  const anyTag = foreground.querySelector('p, h1, h2, h3, h4, h5, h6');
  const asset = foreground.querySelector('div > picture', 'div > video');
  copy = anyTag.closest('div');
  copy.classList.add('copy');

  if (asset) {
    asset.parentElement.classList.add('asset');
    foreground.classList.add('has-asset');
    if (el.classList.contains('split')) {
      el.appendChild(createTag('div', { class: 'background-split' }, asset));
    }
  } else {
    [...fRows].forEach((row) => {
      if (row.childElementCount === 0) {
        row.classList.add('empty-asset');
        foreground.classList.add('has-asset');
      }
    });
  }

  // if (fRows.length === 1) foreground.classList.add('fw');
  decorateBlockText(copy, ['xxl', 'm', 'l']); // heading, body, detail
  decorateLockup(copy);
  extendButtonsClass(copy);
  const assetRow = foreground.querySelector(':scope > div').classList.contains('asset');
  if (assetRow) el.classList.add('asset-left');
  const mainCopy = createTag('div', { class: 'main-copy static' }, copy.innerHTML);
  decorateBadge(mainCopy);
  rows.splice(mainRowIndex, 1);
  if (mainRowIndex > 0) {
    for (let i = 0; i < mainRowIndex; i += 1) {
      rows[i].classList.add('prepend');
    }
  }
  copy.innerHTML = '';
  copy.append(mainCopy);
  [...rows].forEach((row) => {
    if (row.classList.contains('prepend')) {
      mainCopy.before(row);
    } else {
      copy.append(row);
    }
  });

  [...rows].forEach(async (row) => {
    const cols = row.querySelectorAll(':scope > div');
    const firstCol = cols[0];
    const firstColText = firstCol.textContent.toLowerCase().trim();
    const isKeywordRow = firstColText.includes(rowTypeKeyword);
    if (isKeywordRow) {
      const keyValue = firstColText.replace(rowTypeKeyword, '').trim();
      const parsed = parseKeyString(keyValue);
      firstCol.parentElement.classList.add(`row-${parsed.key}`, 'con-block');
      firstCol.remove();
      cols[1].classList.add('row-wrapper');
      if (contentTypes.includes(parsed.key)) loadContentType(row, parsed.key, parsed.classes);
    } else {
      row.classList.add('static');
      decorateBlockHrs(row);
    }
  });
  decorateTextOverrides(el, ['-heading', '-body', '-detail'], mainCopy);
}
