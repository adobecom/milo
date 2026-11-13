/* eslint-disable import/no-unresolved */
import DA_SDK from 'https://da.live/nx/utils/sdk.js';

const DEFAULT_TAGS = '.da/tag-browser';
const TAG_SHEET = new URLSearchParams(window.location.search).get('tags') || DEFAULT_TAGS;
const ADMIN_SOURCE = 'https://admin.da.live/source/';

const withTimeout = (p, ms, d) => Promise.race([p, new Promise((r) => { setTimeout(r, ms, d); })]);

function groupTags(tags) {
  const groups = [];
  tags.forEach(({ value, title }) => {
    let children = groups;
    value.split('/').slice(0, -1).filter(Boolean).forEach((segment) => {
      let group = children.find((tag) => tag.value === segment && tag.children.length > 0);
      if (!group) {
        group = { value: segment, title: segment, children: [] };
        children.push(group);
      }
      children = group.children;
    });
    children.push({ value, title, children: [] });
  });
  return groups;
}

async function fetchTags(path, context, token) {
  const { org, repo } = context;
  const opts = { headers: { Authorization: `Bearer ${token}` } };
  const tagUrl = `${ADMIN_SOURCE}${org}/${repo}/${path}.json`;
  const resp = await fetch(tagUrl, opts);
  if (!resp.ok) throw new Error('Could not load tags.');

  const json = await resp.json();
  const sheets = Array.isArray(json.data) ? [['Tags', json]] : Object.entries(json);
  return sheets
    .filter(([, sheet]) => Array.isArray(sheet?.data) && sheet.data.length > 0)
    .map(([name, sheet]) => ({
      value: name,
      title: name,
      children: groupTags(sheet.data),
    }));
}

function showError(message) {
  const mainElement = document.body.querySelector('main');
  const div = document.createElement('div');
  div.className = 'error-message';
  div.setAttribute('role', 'alert');
  const errorMessage = document.createElement('p');
  errorMessage.textContent = message;

  const reloadButton = document.createElement('button');
  reloadButton.type = 'button';
  reloadButton.textContent = 'Reload App';
  reloadButton.addEventListener('click', () => window.location.reload());

  div.append(errorMessage, reloadButton);
  mainElement.replaceChildren(div);
}

(async function init() {
  const { context, actions, token } = await withTimeout(DA_SDK, 5000, {});
  if (!context || !actions || !token) {
    showError('Please log in to view tags.');
    return;
  }

  const rootTags = await fetchTags(TAG_SHEET, context, token).catch(() => null);
  if (!rootTags?.length) {
    showError('Could not load tags.');
    return;
  }

  await import('./tag-selector.js');
  const tagSelector = document.createElement('da-tag-selector');
  tagSelector.tabIndex = 0;
  tagSelector.rootTags = rootTags;
  tagSelector.actions = actions;
  document.body.querySelector('main').replaceChildren(tagSelector);
}());
