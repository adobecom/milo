import { html, signal, useEffect } from '../../../deps/htm-preact.js';

const NOT_FOUND = { preview: { lastModified: 'Not found' }, live: { lastModified: 'Not found' } };

const content = signal({});

function getAdminUrl(url, type) {
  const project = url.hostname === 'localhost' ? 'main--milo--adobecom' : url.hostname.split('.')[0];
  const [branch, repo, owner] = project.split('--');
  return `https://admin.hlx.page/${type}/${owner}/${repo}/${branch}${url.pathname}`;
}

async function getStatus(suppliedPath) {
  const url = new URL(suppliedPath);
  const adminUrl = getAdminUrl(url, 'status');
  const resp = await fetch(adminUrl);
  if (!resp.ok) return {};
  const json = await resp.json();
  const preview = json.preview.lastModified || 'Never';
  const live = json.live.lastModified || 'Never';
  return { url, preview, live };
}

function findLinks(parent, selector) {
  return [...parent.querySelectorAll(selector)].map((el) => {
    const { modalPath, modalHash, path: fragmentPath } = el.dataset;
    const dataPath = modalPath ? `${modalPath}${modalHash}` : fragmentPath;
    let path = dataPath ? `${window.location.origin}${dataPath}` : el.href;
    path = path.endsWith('/') ? `${path}index` : path;
    return getStatus(path);
  });
}

async function setContent() {
  if (content.value.page) return;
  const main = document.querySelector('main');
  const header = document.querySelector('header');

  const page = await getStatus(window.location.href);
  const fragments = await Promise.all(findLinks(main, '.fragment, a[data-modal-path]'));
  const links = await Promise.all(findLinks(main, 'a[href^="/"'));

  const tmp = {
    page: { items: [page] },
    fragments: { items: fragments },
    links: { items: links },
  };

  if (header) {
    const navLinks = await Promise.all(findLinks(header, 'a[href^="/"'));
    tmp.nav = { items: navLinks, closed: true };
  }

  content.value = tmp;
}

async function handleAction(action) {
  Object.keys(content.value).map(async (key) => {
    content.value[key].items.forEach(async (item, idx) => {
      if (!item.checked) return;
      content.value[key].items[idx].action = action;
      content.value = { ...content.value };
      const adminUrl = getAdminUrl(item.url, action);
      const resp = await fetch(adminUrl, { method: 'POST' });
      const json = resp.ok ? await resp.json() : NOT_FOUND;
      content.value[key].items[idx] = {
        ...item,
        action: null,
        preview: json.preview?.lastModified || item.preview,
        live: json.live?.lastModified || item.live,
      };
      content.value = { ...content.value };
    });
  });
}

function handleChange(target, name, idx) {
  if (target.nodeName === 'A') return;
  content.value[name].items[idx].checked = !content.value[name].items[idx].checked;
  content.value = { ...content.value };
}

function toggleGroup(name) {
  content.value[name].closed = !content.value[name].closed;
  content.value = { ...content.value };
}

function prettyDate(string) {
  if (Number.isNaN(Date.parse(string))) return string;

  const date = new Date(string);
  const localeDate = date.toLocaleString();
  const splitDate = localeDate.split(', ');

  return html`
    <span class=preflight-date>${splitDate[0]}</span>
    <span class=preflight-time>${splitDate[1]}</span>
  `;
}

function prettyPath(url) {
  if (url.pathname === window.location.pathname) return url.pathname;
  return url.hash ? `${url.pathname} (${url.hash})` : url.pathname;
}

function Item({ name, item, idx }) {
  const isChecked = item.checked ? ' is-checked' : '';

  return html`
    <div class="preflight-group-row preflight-group-detail${isChecked}"
      onClick=${(e) => handleChange(e.target, name, idx)}>
      <p><a href=${item.url.pathname} target=_blank>${prettyPath(item.url)}</a></p>
      <p class=preflight-date-wrapper>${item.action === 'preview' ? 'Previewing' : prettyDate(item.preview)}</p>
      <p class=preflight-date-wrapper>${item.action === 'live' ? 'Publishing' : prettyDate(item.live)}</p>
    </div>`;
}

function ContentGroup({ name, group }) {
  if (group.items.length === 0) return null;
  const isClosed = group.closed ? ' is-closed' : '';

  return html`
    <div class="preflight-content-group${isClosed}">
      <div class="preflight-group-row preflight-group-heading" onClick=${() => toggleGroup(name)}>
        <div class="preflight-group-expand"></div>
        <p class=preflight-content-heading>${name}</p>
        ${name === 'page' && html`
          <p class=preflight-content-heading>Previewed</p>
          <p class=preflight-content-heading>Published</p>
        `}
      </div>
      <div class=preflight-group-items>
      ${group.items.map((item, idx) => html`<${Item} name=${name} idx=${idx} item=${item} />`)}
      </div>
    </div>`;
}

export default function General() {
  useEffect(() => { setContent(); }, []);

  const checked = Object.keys(content.value)
    .find((key) => content.value[key].items.find((item) => item.checked));

  return html`
    <div class=preflight-general-content>
      ${Object.keys(content.value).map((key) => html`<${ContentGroup} name=${key} group=${content.value[key]} />`)}
    </div>
    ${checked && html`
      <div class=preflight-actions>
        <div id=preview-action class=preflight-action-wrapper>
          <button class=preflight-action onClick=${() => handleAction('preview')}>Preview</button>
        </div>
        <div id=publish-action class=preflight-action-wrapper>
          <button class=preflight-action onClick=${() => handleAction('live')}>Publish</button>
        </div>
      </div>`}
    `;
}
