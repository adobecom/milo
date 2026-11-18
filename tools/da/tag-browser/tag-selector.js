/* eslint-disable no-underscore-dangle, import/no-unresolved */
import { LitElement, html, nothing } from 'https://da.live/nx/deps/lit/lit-core.min.js';
import getStyle from 'https://da.live/nx/utils/styles.js';

const style = await getStyle(import.meta.url);

class DaTagSelector extends LitElement {
  static properties = {
    rootTags: { type: Array },
    actions: { type: Object },
    _tags: { state: true },
    _activeTag: { state: true },
    _searchQuery: { state: true },
    _secondaryTags: { state: true },
  };

  constructor() {
    super();
    this._tags = [];
    this._activeTag = {};
    this._searchQuery = '';
    this._secondaryTags = false;
  }

  getTagValue() {
    return this._activeTag.value;
  }

  handleBlur() {
    this._secondaryTags = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this.shadowRoot.adoptedStyleSheets = [style];
    this.addEventListener('blur', this.handleBlur, true);
  }

  disconnectedCallback() {
    this.removeEventListener('blur', this.handleBlur, true);
    super.disconnectedCallback();
  }

  updated(changedProperties) {
    if (changedProperties.has('rootTags')) {
      this._tags = [this.rootTags];
      this._activeTag = {};
    }

    if (!changedProperties.has('_searchQuery')
      && (changedProperties.has('_tags') || changedProperties.has('_activeTag'))) {
      setTimeout(() => {
        const groups = this.renderRoot.querySelector('.tag-groups');
        if (!groups) return;
        const firstTag = groups.lastElementChild?.querySelector('.tag-title, .tag-info');
        firstTag?.focus();
        groups.scrollTo({ left: groups.scrollWidth, behavior: 'smooth' });
      }, 100);
    }
  }

  handleTagClick(tag, idx) {
    this._activeTag = tag;
    if (this._searchQuery) return;
    const groups = this._tags.slice(0, idx + 1);
    if (tag.children?.length) groups.push(tag.children);
    this._tags = groups;
  }

  handleTagInsert(tag) {
    if (tag.children?.length) return;
    const tagValue = this._secondaryTags ? `, ${tag.value}` : tag.value;
    this.actions.sendText(tagValue);
    this._secondaryTags = true;
  }

  handleBackClick() {
    if (this._searchQuery) {
      this.renderRoot.querySelector('.tag-title')?.focus();
      this._activeTag = {};
      return;
    }
    if (this._tags.length <= 1) return;
    const group = this._tags[this._tags.length - 1];
    const parent = this._tags[this._tags.length - 2]
      .find((tag) => tag.children === group) || {};
    if (this._activeTag.children?.length) this._tags = this._tags.slice(0, -1);
    this._activeTag = parent;
  }

  handleSearchInput(event) {
    const query = event.target.value.toLowerCase();
    if (query === this._searchQuery) return;
    this._searchQuery = query;
    this._activeTag = {};
  }

  filterTags(tags) {
    if (!this._searchQuery) return tags;
    return tags.flatMap((tag) => {
      if (tag.children?.length) return this.filterTags(tag.children);
      return tag.title.toLowerCase().includes(this._searchQuery)
        || tag.value.toLowerCase().includes(this._searchQuery) ? [tag] : [];
    });
  }

  renderSearchBar() {
    return html`
      <section class="tag-search">
        <div class="search-details">
          <input 
            type="text" 
            placeholder="Search tags..." 
            @input=${this.handleSearchInput} 
            value=${this._searchQuery} 
          />
          ${(this._searchQuery ? this._activeTag.value : this._tags.length > 1) ? html`
            <button class="tag-back" @click=${this.handleBackClick} aria-label="Go back">
              <svg class="icon"><use href="#spectrum-ChevronDown"/></svg>
            </button>
          ` : nothing}
        </div>
      </section>
    `;
  }

  renderTag(tag, idx) {
    const hasChildren = tag.children?.length > 0;
    const active = this._activeTag === tag
      || (hasChildren && tag.children === this._tags[idx + 1]);
    return html`
      <li class="tag-group">
        <div class="tag-details">
          <button 
            class="tag-title ${active ? 'active' : ''} ${hasChildren ? 'has-children' : ''}" 
            @click=${() => this.handleTagClick(tag, idx)}
            aria-pressed="${active}">
            ${tag.title}
          </button>
          ${hasChildren ? html`
            <button 
              class="tag-navigate"
              @click=${() => this.handleTagClick(tag, idx)}
              aria-label="Navigate to ${tag.title}">
              <svg class="icon"><use href="#spectrum-ChevronDown"/></svg>
            </button>
          ` : nothing}
          ${(idx > 0 || this._searchQuery) && !hasChildren ? html`
            <button
              class="tag-insert"
              @click=${() => this.handleTagInsert(tag)}
              aria-label="Insert tag ${tag.title}">
              <svg class="icon"><use href="#spectrum-AddCircle"/></svg>
            </button>
          ` : nothing}
        </div>
      </li>
    `;
  }

  renderTagGroup(group, idx) {
    return html`
      <ul class="tag-group-list">
        ${group.map((tag) => this.renderTag(tag, idx))}
      </ul>
    `;
  }

  render() {
    if (this._tags.length === 0) return nothing;
    const groups = this._searchQuery ? [this.filterTags(this.rootTags)] : this._tags;
    return html`
      <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <symbol id="spectrum-ChevronDown" viewBox="0 0 18 18">
            <path d="m4 6 5 5 5-5" fill="none" stroke="currentColor" stroke-width="2"/>
          </symbol>
          <symbol id="spectrum-AddCircle" viewBox="0 0 18 18">
            <circle cx="9" cy="9" r="7" fill="none" stroke="currentColor" stroke-width="1.5"/>
            <path d="M5 9h8M9 5v8" fill="none" stroke="currentColor" stroke-width="1.5"/>
          </symbol>
        </defs>
      </svg>
      <div class="tag-selector">
        ${this.renderSearchBar()}
        <ul class="tag-groups">
          ${groups.map((group, idx) => html`
            <li class="tag-group-column">
              ${this.renderTagGroup(group, idx)}
            </li>
          `)}
          ${this._activeTag.value && !this._activeTag.children?.length ? html`
            <li class="tag-group-column tag-info-column">
              <section class="tag-info" tabindex="-1" aria-label="Tag details">
                <dl>
                  <dt>Title</dt>
                  <dd>${this._activeTag.title}</dd>
                  <dt>Value</dt>
                  <dd>${this._activeTag.value}</dd>
                </dl>
                <button
                  type="button"
                  class="tag-info-insert"
                  @click=${() => this.handleTagInsert(this._activeTag)}
                  aria-label="Insert tag ${this._activeTag.title}">
                  <svg class="icon" aria-hidden="true"><use href="#spectrum-AddCircle"/></svg>
                  Insert Value
                </button>
              </section>
            </li>
          ` : nothing}
        </ul>
      </div>
    `;
  }
}

customElements.define('da-tag-selector', DaTagSelector);
