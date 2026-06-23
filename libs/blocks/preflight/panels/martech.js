import { html, signal, useEffect } from '../../../deps/htm-preact.js';

const martechRows = signal([]);
const copiedTimeout = signal(null);
const btnText = signal('Copy Table');

// Keep raw HTML for clipboard copy
const martechHtml = signal('');

function buildHtmlTable(strings) {
  const table = document.createElement('table');
  table.setAttribute('border', 1);
  const headerRow = document.createElement('tr');
  const th = document.createElement('th');
  th.setAttribute('colspan', 2);
  th.style.width = '100%';
  th.textContent = 'martech metadata';
  headerRow.append(th);
  table.append(headerRow);
  [...strings].forEach((str) => {
    const tr = document.createElement('tr');
    const td1 = document.createElement('td');
    const h3a = document.createElement('h3');
    h3a.textContent = str;
    td1.append(h3a);
    const td2 = document.createElement('td');
    const h3b = document.createElement('h3');
    h3b.setAttribute('data-ccp-parastyle', 'DNT');
    h3b.textContent = str;
    td2.append(h3b);
    tr.append(td1, td2);
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
  const unique = [...new Set(strings)];
  martechRows.value = unique;
  martechHtml.value = buildHtmlTable(new Set(strings));
}

function copyTable() {
  try {
    /* global ClipboardItem */
    const clipboardData = [new ClipboardItem({ 'text/html': new Blob([martechHtml.value], { type: 'text/html' }) })];
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

  if (!martechRows.value.length) {
    return html`<div class="access-columns martech"><p>Loading martech metadata…</p></div>`;
  }

  return html`
    <div class="access-columns martech">
      <button class="martech-copy-btn" onclick=${copyTable}>${btnText.value}</button>
      <div class="martech-table-wrapper">
        <table class="martech-table">
          <thead>
            <tr>
              <th>String</th>
              <th>DNT Copy</th>
            </tr>
          </thead>
          <tbody>
            ${martechRows.value.map((str) => {
    const truncated = str.length > 60 ? `${str.slice(0, 57)}…` : str;
    return html`
              <tr>
                <td title=${str.length > 60 ? str : ''}>${truncated}</td>
                <td title=${str.length > 60 ? str : ''}>${truncated}</td>
              </tr>`;
  })}
          </tbody>
        </table>
      </div>
    </div>`;
}
