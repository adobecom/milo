/* eslint-disable import/no-unresolved, no-underscore-dangle, class-methods-use-this */
import { html, nothing } from 'https://da.live/deps/lit/dist/index.js';

function handleToggleList(e) {
  const card = e.target.closest('.detail-card');
  const { name } = e.target.closest('button').dataset;
  const list = this.shadowRoot.querySelector(`.url-list-${name}`);
  const cards = this.shadowRoot.querySelectorAll('.detail-card');
  const lists = this.shadowRoot.querySelectorAll('.url-list');

  const isExpanded = card.classList.contains('is-expanded');
  [...cards, ...lists].forEach((el) => { el.classList.remove('is-expanded'); });
  if (isExpanded) return;

  card.classList.add('is-expanded');
  list.classList.add('is-expanded');
}

function handleClear(event) {
  event.preventDefault();
  const field = event.target.closest('button').previousElementSibling;
  field.value = '';
  this._canPromote = false;
  this._repoReady = false;
  this._gbExpPath = '';
  this.requestUpdate();
}

function handleCheck(app, url) {
  url.checked = !url.checked;
  app.urls = [...app.urls];
}

function updateTabUi(app, target, delay = 0) {
  setTimeout(() => {
    const tabNav = app.shadowRoot.querySelectorAll('.tab-nav li');
    const tabs = app.shadowRoot.querySelectorAll('.tab-step');
    const activeNav = app.shadowRoot.querySelector(`.tab-nav li[data-target='${target}']`);
    const activeTab = app.shadowRoot.querySelector(`.tab-step[data-id='${target}']`);
    [...tabs, ...tabNav].forEach((el) => { el.classList.remove('active'); });
    if (activeNav) activeNav.querySelector('button').removeAttribute('disabled');
    if (activeNav) activeNav.classList.add('active');
    if (activeTab) activeTab.classList.add('active');
  }, delay);
}

function renderBadge(name, length, hasList = false, hasCancel = false) {
  const lowerName = name.toLowerCase().replace(/\W+/g, '-');
  const hasExpand = length > 0 && hasList;

  return html`
    <div class="detail-card detail-card-${lowerName}">
      <div>
        <h3>${name}</h3>
        <p>${length}</p>
      </div>
      <div class="detail-card-actions">
        ${hasCancel ? html`<button class="cancel-button" @click=${this.handleCancel}>${this._cancelText}</button>` : nothing}
        ${hasExpand ? html`
          <button class="toggle-list-icon" @click=${this.handleToggleList} data-name="${lowerName}">
            <svg class="icon"><use href="#spectrum-chevronDown"/></svg>
          </button>
        ` : nothing}
      </div>
    </div>`;
}

function renderList(name, urls) {
  const lowerName = name.toLowerCase().replace(/ /g, '-');

  return html`
    <div class="url-list url-list-${lowerName}">
      <h2>${name}</h2>
      <ul class="urls-result">
        ${urls.map((url) => html`
          <li>
            <div class="url-path">${url.href}</div>
            <div class="url-status result-${url.status ? url.status : 'waiting'}">
              ${url.status ? url.status : 'waiting'}
            </div>
          </li>
        `)}
      </ul>
    </div>
  `;
}

function renderChecklist(app, urls) {
  return html`
    <ul class="url-checklist">
      ${urls ? urls.map((url) => html`
        <li>
          <div class="path">${url}</div>
        </li>
      `) : nothing}
    </ul>
  `;
}

function renderClearButton() {
  return html`<button class="icon-button clear-button" @click=${this.handleClear}><svg class="icon"><use href="#spectrum-close"/></svg></button>`;
}

function renderTabNav(app, config) {
  return html`
    <ul class="tab-nav">
      ${config.map((step, index) => html`
        <li data-target="${step.id}">
          <button disabled class="ribbon" @click=${() => this.updateTabUi(app, step.id)}>${index + 1}. ${step.title}</button>
        </li>
      `)}
    </ul>
  `;
}

export {
  handleToggleList,
  handleClear,
  handleCheck,
  updateTabUi,
  renderBadge,
  renderList,
  renderChecklist,
  renderClearButton,
  renderTabNav,
};
