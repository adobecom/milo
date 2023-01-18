import { getConfig, createTag } from '../../utils/utils.js';
import { sampleRUM } from '../../utils/samplerum.js';

async function load404() {
  const { locale } = getConfig();
  const main = document.body.querySelector('main');
  main.innerHTML = '';
  let resp = await fetch(`${locale.contentRoot}/404.plain.html`);
  if (!resp || !resp.ok) {
    resp = await fetch('/404.plain.html');
  }
  const columns = createTag('div', { class: 'columns-404' });
  const html = await resp.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // picture for background img
  const picture = doc.querySelector('picture');
  picture.classList.add('bg-img');

  // sections
  const sections = doc.querySelectorAll('body > div');
  const header = [...sections].shift();
  header.classList.add('header-404', 'section');
  sections.forEach((section) => {
    if (section.querySelector('ul')) {
      if (section.querySelectorAll('li').length > 5) {
        section.classList.add('split-items');
      }
      section.classList.add('column');
      columns.append(section);
    } else {
      section.classList.add('section');
    }
  });

  // appending background img, header, columns
  main.append(picture, header, columns);
  header.querySelector('p').remove();

  // appending other sections to main
  main.append(...doc.querySelectorAll('body > *'));

  sampleRUM('404', { source: document.referrer, target: window.location.href });
}

function log404() {
  const logFile = '/drafts/jck/404-logs';
  const requestDate = new Date().toISOString();
  const requestUrl = window.location.href;
  fetch(logFile, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      'data': {
        'date': requestDate,
        'url': requestUrl,
      },
    })
  })
    .catch((error) => {
      console.error('Error logging the 404:', error);
    });
}

(async function init() {
  load404();
  log404();
}());
