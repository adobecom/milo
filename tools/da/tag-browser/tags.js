/* eslint-disable import/no-unresolved */
import DA_SDK from 'https://da.live/nx/utils/sdk.js';

const DEFAULT_TAGS = 'https://main--milo--adobecom.aem.page/drafts/bmarshal/tags.json';
const TAG_SHEET = new URLSearchParams(window.location.search).get('tags') || DEFAULT_TAGS;

const withTimeout = (p, ms, d) => Promise.race([p, new Promise((r) => { setTimeout(r, ms, d); })]);

function groupTags(tags) {
  const groups = [];
  tags.forEach(({ name, title }) => {
    let children = groups;
    name.split('/').slice(0, -1).filter(Boolean).forEach((segment) => {
      let group = children.find((tag) => tag.name === segment && tag.children.length > 0);
      if (!group) {
        group = { name: segment, title: segment, children: [] };
        children.push(group);
      }
      children = group.children;
    });
    children.push({ name, title, children: [] });
  });
  return groups;
}

async function fetchTags(url) {
  const resp = await fetch(url);
  if (!resp.ok) throw new Error('Could not load tags.');

  const json = await resp.json();
  const sheets = Array.isArray(json.data) ? [['Tags', json]] : Object.entries(json);
  return sheets
    .filter(([, sheet]) => Array.isArray(sheet?.data) && sheet.data.length > 0)
    .map(([name, sheet]) => ({
      name,
      title: name,
      children: groupTags(sheet.data),
    }));
}

function showError(message, link = null) {
  const mainElement = document.body.querySelector('main');
  const errorMessage = document.createElement('p');
  errorMessage.textContent = message;

  if (link) {
    const linkEl = document.createElement('a');
    linkEl.textContent = 'View Here';
    linkEl.href = link;
    linkEl.target = '_blank';
    errorMessage.append(linkEl);
  }

  const reloadButton = document.createElement('button');
  reloadButton.textContent = 'Reload';
  reloadButton.addEventListener('click', () => window.location.reload());

  mainElement.replaceChildren(errorMessage, reloadButton);
}

(async function init() {
  const { context, actions } = await withTimeout(DA_SDK, 5000, {});
  if (!context || !actions) {
    showError('Please log in to view tags.');
    return;
  }

  const rootTags = await fetchTags(TAG_SHEET).catch(() => null);
  if (!rootTags?.length) {
    showError('Could not load tags. ', TAG_SHEET);
    return;
  }

  await import('./tag-browser.js');
  const daTagBrowser = document.createElement('da-tag-browser');
  daTagBrowser.tabIndex = 0;
  daTagBrowser.rootTags = rootTags;
  daTagBrowser.actions = actions;
  document.body.querySelector('main').replaceChildren(daTagBrowser);
}());
