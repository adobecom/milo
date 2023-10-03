import { decorateBlockBg, decorateBlockHrs, decorateBlockText } from '../../utils/decorate.js';
import { createTag } from '../../utils/utils.js';

// function decorateBadge(el) {
//   const header = el.querySelector('h1', 'h2', 'h3', 'h4', 'h5', 'h6');
//   const brackets = header.innerHTML.indexOf('[[');
//   console.log('decorateBadge el', el, 'header.innerHTML', header.innerHTML);
// }

function decorateBadge(el) {
  // Use a regular expression to match text between '[[', ']]'
  const regex = /\[\[(.*?)\]\]/g;
  const header = el.querySelector('h1', 'h2', 'h3', 'h4', 'h5', 'h6');
  const matches = header.innerHTML.match(regex);
  if (matches) {
    [...matches].forEach((match) => {
      const found = match.substring(2, match.length - 2);
      if (found !== '') {
        const badge = createTag('span', { class: 'badge' }, found);
        header.innerHTML = header.innerHTML.replace(regex, '');
        header.append(badge);
        console.log('decorateBadge - foundMatch', found, header);
      }
    });
  }
}

export default async function init(el) {
  el.classList.add('con-block');
  let rows = el.querySelectorAll(':scope > div');
  const { default: quizResults } = await import('../quiz-results/quiz-results.js');
  if (rows.length > 1) {
    if (rows[0].textContent !== '') el.classList.add('has-bg');
    const [head, ...tail] = rows;
    decorateBlockBg(el, head);
    rows = tail;
  }
  const foreground = rows[0];
  const fRows = foreground.querySelectorAll(':scope > div');
  let copy = fRows[0];
  if (fRows.length === 2) {
    const anyTag = foreground.querySelector('p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6');
    copy = anyTag.closest('div');
    const asset = foreground.querySelector('div > picture', 'div > video');
    if (asset) {
      asset.parentElement.classList.add('asset');
      foreground.classList.add('has-asset');
      if (el.classList.contains('split')) {
        const bgSplit = createTag('div', { class: 'background-split' }, asset);
        el.append(bgSplit);
      }
    } else {
      [...fRows].forEach((row) => {
        if (row.childElementCount === 0) {
          row.classList.add('empty-asset');
          foreground.classList.add('has-asset');
        }
      });
    }
  }
  copy.classList.add('copy');
  decorateBlockText(copy, ['xxl', 'm', 'l']); // heading, body, detail
  const assetRow = foreground.querySelector(':scope > div').classList.contains('asset');
  if (assetRow) el.classList.add('asset-left');
  const staticCopy = createTag('div', { class: 'static' }, copy.innerHTML);
  copy.innerHTML = '';
  decorateBadge(staticCopy);
  copy.append(staticCopy);
  foreground.classList.add('foreground');
  rows.shift();
  copy.append(...rows);
  [...rows].forEach(async (row) => {
    const cols = row.querySelectorAll(':scope > div');
    const isFragRow = cols[0].textContent.trim() === 'nested-fragments';
    if (isFragRow) {
      cols[0].parentElement.classList.add('nested', cols[1].textContent.trim());
      // row.append(fragRows);
      const wrapper = createTag('div', { class: 'copy-wrapper' });
      row.append(wrapper);
      wrapper.append(...cols);
      await quizResults(row);
    } else {
      row.classList.add('static');
      decorateBlockHrs(row);
    }
  });
}
