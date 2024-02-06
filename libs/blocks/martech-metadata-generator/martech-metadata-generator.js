import { createTag, getConfig, loadIms } from '../../utils/utils.js';
// import { getImsToken } from '../../../tools/utils/utils.js';
import { replaceText } from '../../features/placeholders.js';

const config = getConfig();
const params = new URLSearchParams(window.location.search);
const referrer = params.get('referrer');
const owner = params.get('owner');
const repo = params.get('repo');
const ref = params.get('ref');
const formEl = createTag('form', { action: '#', class: 'loading' });
const statusEl = createTag('p', {}, 'Generating table, please wait...');
const copyBtn = createTag('button', { class: 'con-button' }, 'Copy');
const buildBtn = createTag('button', { class: 'con-button' }, 'Rebuild');
let clipboardData = '';

function getTable(strings) {
  const table = document.createElement('table');
  table.setAttribute('border', 1);
  const headerRow = document.createElement('tr');
  headerRow.append(createTag('th', { colspan: 2, style: 'width: 100%' }, 'martech metadata'));
  table.append(headerRow);
  strings.forEach((str) => {
    const tr = document.createElement('tr');
    tr.append(createTag('td', { colspan: 1 }, createTag('h3', {}, str)));
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
  buildBtn.innerText = 'Build';
  /* eslint-disable-next-line no-console */
  console.error(e);
}

function handleSuccess() {
  formEl.classList.remove('loading');
  buildBtn.innerText = 'Rebuild';
  statusEl.innerText = 'Table built, click Copy and paste into document';
}

export const loadScript = (url, type) => new Promise((resolve, reject) => {
  let script = document.querySelector(`head > script[src="${url}"]`);
  if (!script) {
    const { head } = document;
    script = document.createElement('script');
    script.setAttribute('src', url);
    if (type) {
      script.setAttribute('type', type);
    }
    head.append(script);
  }

  if (script.dataset.loaded) {
    resolve(script);
    return;
  }

  const onScript = (event) => {
    script.removeEventListener('load', onScript);
    script.removeEventListener('error', onScript);

    if (event.type === 'error') {
      reject(new Error(`error loading script: ${script.src}`));
    } else if (event.type === 'load') {
      script.dataset.loaded = true;
      resolve(script);
    }
  };

  script.addEventListener('load', onScript);
  script.addEventListener('error', onScript);
});

async function handleBuild() {
  formEl.classList.add('loading');
  statusEl.innerText = 'Generating table, please wait....';
  let json;
  let body;
  try {
    const res = await fetch(`https://admin.hlx.page/status/${owner}/${repo}/${ref}?editUrl=${referrer}`);
    json = await res.json();
  } catch (e) { return handleError(e); }
  try {
    await fetch(
      `https://admin.hlx.page/preview/${owner}/${repo}/${ref}${json.webPath}`,
      { method: 'POST' },
    );
  } catch (e) { return handleError('Failed to preview document'); }
  try {
    const mdFetch = await fetch(`${json.preview.url}`);
    body = await mdFetch.text();
  } catch (e) { return handleError(e); }
  const dummy = createTag('html', {}, body);
  const els = [...dummy.querySelectorAll('main :is(h1, h2, h3, h4, h5, h6, a)')]
    .filter((el) => !el.closest('[class*="metadata"]') && !el.innerText.startsWith('http'));
  const items = await els.reduce(async (accP, curr) => {
    const acc = await accP;
    const str = await replaceText(curr.innerText, config);
    if (str) acc.push(str);
    return acc;
  }, []);
  /* global ClipboardItem */
  clipboardData = [new ClipboardItem({ 'text/html': new Blob([getTable(items)], { type: 'text/html' }) })];
  handleSuccess();
  return true;
}

export default async function init(el) {
  document.addEventListener('sidekick-ready', () => {
    const sidekick = document.querySelector('helix-sidekick');
    sidekick.addEventListener('statusfetched', async () => {
      await loadIms();
      // window.adobeIMS.signIn();
      // const token = window.adobeIMS.getAccessToken();
      console.log(window.adobeIMS.getAccessToken());
    });
  }, { once: true });
  el.classList.add('con-block', 'dark');
  formEl.append(statusEl);
  formEl.append(copyBtn);
  formEl.append(buildBtn);
  buildBtn.addEventListener('click', (e) => {
    e.preventDefault();
    handleBuild();
  });
  copyBtn.addEventListener('click', (e) => {
    e.preventDefault();
    handleCopy();
  });
  el.append(formEl);
  handleBuild();
}
