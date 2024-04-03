import { html, signal, useEffect } from '../../../deps/htm-preact.js';
import { createTag } from '../../../utils/utils.js';

const martechBlock = signal(null);
const copiedTimeout = signal(null);
const btnText = signal('Copy Table');

function getTable(strings) {
  const table = document.createElement('table');
  table.setAttribute('border', 1);
  const headerRow = document.createElement('tr');
  headerRow.append(createTag('th', { colspan: 2, style: 'width: 100%' }, 'martech metadata'));
  table.append(headerRow);
  [...strings].forEach((str) => {
    const tr = document.createElement('tr');
    tr.append(createTag('td', { colspan: 1 }, createTag('h3', {}, str)));
    tr.append(createTag('td', { colspan: 1 }, createTag('h3', { 'data-ccp-parastyle': 'DNT' }, str)));
    table.append(tr);
  });
  return table.outerHTML;
}

async function checkMartechMeta() {
  const elementList = 'h1, h2, h3, h4, h5, h6, a, .tracking-header, .click-link, .con-button';
  const strings = [...document.querySelectorAll(`main :is(${elementList})`)]
    .filter((el) => !el.closest('[class*="metadata"]') && !el.innerText.startsWith('http')
      && !el.querySelector(elementList))
    .reduce((acc, curr) => {
      const str = curr.innerText.trim();
      if (str) acc.push(str);
      return acc;
    }, []);
  martechBlock.value = getTable(new Set(strings));
}

function copyTable() {
  try {
    /* global ClipboardItem */
    const clipboardData = [new ClipboardItem({ 'text/html': new Blob([martechBlock.value], { type: 'text/html' }) })];
    navigator.clipboard.write(clipboardData);
    btnText.value = '✔ Copied!';
  } catch (e) {
    btnText.value = 'ⓧ Error Copying';
    /* eslint-disable-next-line no-console */
    console.error(e);
  }
  if (copiedTimeout.value) clearTimeout(copiedTimeout.value);
  copiedTimeout.value = setTimeout(() => {
    btnText.value = 'Copy Table';
  }, 5000);
}

export default function Martech() {
  useEffect(() => { checkMartechMeta(); }, []);

  return html`
  <div class="access-columns martech">
    ${martechBlock.value && html`
      <button class="preflight-action" onclick=${copyTable}>${btnText.value}</button>
      <div dangerouslySetInnerHTML="${{ __html: martechBlock.value }}"></div>
    `}
  </div>`;
}
