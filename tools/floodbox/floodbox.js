/* eslint-disable import/no-unresolved, no-underscore-dangle, class-methods-use-this */
import { html, nothing } from 'https://da.live/deps/lit/dist/index.js';

export function handleToggleList(e) {
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

export function handleClear(event) {
  event.preventDefault();
  const field = event.target.closest('button').previousElementSibling;
  field.value = '';
  this._canPromote = false;
  this._gbExpPath = '';
  this.requestUpdate();
}

export function renderBadge(name, length, hasCancel, hasList = false) {
  const lowerName = name.toLowerCase();
  const hasExpand = length > 0 && lowerName !== 'total';

  return html`
    <div class="detail-card detail-card-${lowerName}">
      <div>
        <h3>${name}</h3>
        <p>${length}</p>
      </div>
      <div class="detail-card-actions">
        ${hasCancel ? html`<button class="cancel-button" @click=${this.handleCancel}>${this._cancelText}</button>` : nothing}
        ${hasExpand && hasList ? html`
          <button class="toggle-list-icon" @click=${this.handleToggleList} data-name="${lowerName}">
            <svg class="icon"><use href="#spectrum-chevronDown"/></svg>
          </button>
        ` : nothing}
      </div>
    </div>`;
}

export function renderList(name, urls) {
  return html`
    <div class="url-list url-list-${name.toLowerCase()}">
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

export function renderClearButton() {
  return html`<button class="icon-button clear-button" @click=${this.handleClear}><svg class="icon"><use href="#spectrum-close"/></svg></button>`;
}
