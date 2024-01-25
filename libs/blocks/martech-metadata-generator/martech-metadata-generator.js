import parseMd from '../../../tools/loc/helix/parseMarkdown.bundle.js';
import { createTag } from '../../utils/utils.js';

const params = new URLSearchParams(window.location.search);
const referrer = params.get('referrer');
const owner = params.get('owner');
const repo = params.get('repo');
const ref = params.get('ref');
const formEl = createTag('form', { action: '#' });
const statusEl = createTag('p', {}, 'Enter document URL (leave blank to use current document)');
const inputEl = createTag('input', { type: 'text' });
const btn = createTag('button', { class: 'con-button' }, 'Build');
const state = {
  hasBuilt: false,
  lastUrl: '#',
};
let clipboardData = '';

function getTable(strings) {
  const table = document.createElement('table');
  table.setAttribute('border', 1);
  const headerRow = document.createElement('tr');
  headerRow.append(createTag('th', { colspan: 2, style: 'width: 100%' }, 'martech metadata'));
  table.append(headerRow);
  strings.forEach((str) => {
    const tr = document.createElement('tr');
    tr.append(createTag('td', { colspan: 1 }, ''));
    tr.append(createTag('td', { colspan: 1 }, createTag('h3', { 'data-ccp-parastyle': 'DNT' }, str)));
    table.append(tr);
  });
  return table.outerHTML;
}

function handleCopy() {
  navigator.clipboard.write(clipboardData);
}

function handleError(e, msg = 'An unknown error occurred') {
  statusEl.innerText = msg;
  formEl.classList.remove('loading');
  btn.innerText = 'Build';
  /* eslint-disable-next-line no-console */
  console.error(e);
}

function handleSuccess() {
  formEl.classList.remove('loading');
  btn.innerText = 'Copy';
  statusEl.innerText = 'Table built and copied, ready to paste into document';
  state.hasBuilt = true;
}

async function handleBuild() {
  formEl.classList.add('loading');
  statusEl.innerText = 'Please wait...';
  btn.innerText = 'Loading...';
  if (state.lastUrl === inputEl.value) return handleSuccess();
  state.lastUrl = inputEl.value;
  let json;
  let md;
  try {
    const res = await fetch(`https://admin.hlx.page/status/${owner}/${repo}/${ref}?editUrl=${inputEl.value || referrer}`);
    json = await res.json();
  } catch (e) {
    return handleError(e);
  }
  if (json.preview.status === 404) return handleError(404, 'Document must be previewed first');
  try {
    const mdFetch = await fetch(`${json.resourcePath}`);
    md = await mdFetch.text();
  } catch (e) {
    return handleError(e);
  }
  const doc = { content: { data: md }, log: '' };
  parseMd(doc);
  const items = [];
  const searchItems = (arr) => {
    for (const child of arr) {
      if (child.type.match(/link|heading/) && !child.children[0].value.startsWith('http')) {
        items.push(child.children[0].value);
        /* eslint-disable-next-line no-continue */
        continue;
      }
      if (child.children) searchItems(child.children);
    }
  };
  searchItems(doc.content.mdast.children);
  /* global ClipboardItem */
  clipboardData = [new ClipboardItem({ 'text/html': new Blob([getTable(items)], { type: 'text/html' }) })];
  handleCopy();
  handleSuccess();
  return true;
}

export default async function init(el) {
  el.classList.add('con-block', 'dark');
  formEl.append(statusEl);
  formEl.append(inputEl);
  formEl.append(btn);
  formEl.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!state.hasBuilt) handleBuild();
    else handleCopy();
  });
  inputEl.addEventListener('input', () => {
    if (inputEl.value !== state.lastUrl) {
      statusEl.innerText = 'Enter document URL (leave blank to use current document)';
      btn.innerText = 'Build';
      state.hasBuilt = false;
    } else {
      state.hasBuilt = true;
    }
  });
  el.append(formEl);
}
