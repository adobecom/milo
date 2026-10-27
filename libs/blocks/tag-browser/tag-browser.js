// eslint-disable-next-line import/no-unresolved -- The host supplies the DA SDK.
import DA_SDK from 'https://da.live/nx/utils/sdk.js';
import { LitElement, html, nothing } from '../../deps/lit-all.min.js';
import { fetchTags, mergeTags } from './tag-utils.js';

const stylesheet = new URL('./tag-browser.css', import.meta.url).href;

class TagBrowser extends LitElement {
  static properties = {
    rootTags: { type: Array },
    actions: { type: Object },
    tags: { state: true },
    activeTag: { state: true },
    searchQuery: { state: true },
    secondaryTags: { state: true },
  };

  constructor() {
    super();
    this.tags = [];
    this.activeTag = {};
    this.searchQuery = '';
    this.secondaryTags = false;
  }

  getTagSegments() {
    return (this.activeTag.activeTag ? this.activeTag.activeTag.split('/') : [])
      .concat(this.activeTag.name);
  }

  handleBlur() {
    this.secondaryTags = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('blur', this.handleBlur, true);
  }

  disconnectedCallback() {
    this.removeEventListener('blur', this.handleBlur, true);
    super.disconnectedCallback();
  }

  updated(changedProperties) {
    if (changedProperties.has('rootTags')) {
      this.tags = [this.rootTags];
      this.activeTag = {};
    }

    if (changedProperties.has('tags')) {
      setTimeout(() => {
        const groups = this.renderRoot.querySelector('.tag-groups');
        if (!groups) return;
        groups.lastElementChild?.querySelector('.tag-title')?.focus();
        groups.scrollTo({ left: groups.scrollWidth, behavior: 'smooth' });
      }, 100);
    }
  }

  handleTagClick(tag, idx) {
    this.activeTag = tag;
    if (!tag.children?.length) return;
    this.tags = [...this.tags.slice(0, idx + 1), tag.children];
  }

  handleTagInsert(tag) {
    this.activeTag = tag;
    const value = this.secondaryTags ? `, ${tag.value}` : tag.value;
    this.actions.sendText(value);
    console.log('Inserted tag:', tag);
    this.secondaryTags = true;
  }

  handleBackClick() {
    if (this.tags.length <= 1) return;
    this.tags = this.tags.slice(0, -1);
    this.activeTag = this.tags[this.tags.length - 1]
      .find((tag) => this.activeTag.activeTag?.includes(tag.name)) || {};
  }

  handleSearchInput(event) {
    this.searchQuery = event.target.value.toLowerCase();
  }

  filterTags(tags) {
    if (!this.searchQuery) return tags;
    return tags.filter((tag) => tag.title.toLowerCase().includes(this.searchQuery));
  }

  renderSearchBar() {
    return html`
      <section class="tag-search">
        <div class="search-details">
          <input
            type="text"
            aria-label="Search tags"
            placeholder="Search tags..."
            @input=${this.handleSearchInput}
            .value=${this.searchQuery}
          />
          ${this.tags.length > 1 ? html`
            <button class="tag-back" @click=${this.handleBackClick} aria-label="Go back">
              <svg class="icon" aria-hidden="true"><use href="#spectrum-ChevronDown"/></svg>
            </button>
          ` : nothing}
        </div>
      </section>
    `;
  }

  renderTag(tag, idx) {
    const active = this.getTagSegments()[idx] === tag.name;
    const hasChildren = tag.children?.length > 0;
    return html`
      <li class="tag-group">
        <div class="tag-details">
          <button
            class="tag-title ${active ? 'active' : ''} ${hasChildren ? 'has-children' : ''}"
            @click=${() => this.handleTagClick(tag, idx)}
            aria-pressed="${active}">
            ${tag.title.split('/').pop()}
          </button>
          ${hasChildren ? html`
            <button
              class="tag-navigate"
              @click=${() => this.handleTagClick(tag, idx)}
              aria-label="Navigate to ${tag.title}">
              <svg class="icon" aria-hidden="true"><use href="#spectrum-ChevronDown"/></svg>
            </button>
          ` : nothing}
          ${tag.value ? html`
            <button
              class="tag-insert"
              ?disabled=${!this.actions}
              @click=${() => this.handleTagInsert(tag)}
              aria-label="Insert tag ${tag.title}">
              <svg class="icon" aria-hidden="true"><use href="#spectrum-AddCircle"/></svg>
            </button>
          ` : nothing}
        </div>
      </li>
    `;
  }

  renderTagGroup(group, idx) {
    return html`
      <ul class="tag-group-list">
        ${this.filterTags(group).map((tag) => this.renderTag(tag, idx))}
      </ul>
    `;
  }

  render() {
    return html`
      <link rel="stylesheet" href=${stylesheet}>
      <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <g id="spectrum-ChevronDown">
          <path fill="currentColor" d="M4,7.01a1,1,0,0,1,1.7055-.7055l3.289,3.286,3.289-3.286a1,1,0,0,1,1.437,1.3865l-.0245.0245L9.7,11.7075a1,1,0,0,1-1.4125,0L4.293,7.716A.9945.9945,0,0,1,4,7.01Z"/>
        </g>
        <g id="spectrum-AddCircle">
          <path fill="currentColor" d="M9,1a8,8,0,1,0,8,8A8,8,0,0,0,9,1Zm5,8.5a.5.5,0,0,1-.5.5H10v3.5a.5.5,0,0,1-.5.5h-1a.5.5,0,0,1-.5-.5V10H4.5A.5.5,0,0,1,4,9.5v-1A.5.5,0,0,1,4.5,8H8V4.5A.5.5,0,0,1,8.5,4h1a.5.5,0,0,1,.5.5V8h3.5a.5.5,0,0,1,.5.5Z"/>
        </g>
      </svg>
      <div class="tag-browser">
        ${this.renderSearchBar()}
        <ul class="tag-groups">
          ${this.tags.map((group, idx) => html`
            <li class="tag-group-column">
              ${this.renderTagGroup(group, idx)}
            </li>
          `)}
        </ul>
      </div>
    `;
  }
}

customElements.define('milo-tag-browser', TagBrowser);

function browserTags(tags, ancestors = []) {
  return tags.map((tag) => {
    const name = tag.id.split('/').pop();
    return {
      name,
      title: tag.label,
      value: tag.value,
      activeTag: ancestors.join('/'),
      children: browserTags(tag.children, [...ancestors, name]),
    };
  });
}

function showError(block, message) {
  const error = document.createElement('p');
  error.textContent = message;
  const reload = document.createElement('button');
  reload.textContent = 'Reload';
  reload.addEventListener('click', () => window.location.reload());
  block.replaceChildren(error, reload);
}

export default async function init(block) {
  const sources = [...block.children].map((row) => {
    const [label, cell] = row.children;
    return {
      label: label?.textContent.trim(),
      url: cell?.querySelector('a')?.getAttribute('href') || cell?.textContent.trim(),
    };
  }).filter(({ label, url }) => label || url);

  try {
    if (!sources.length) throw new Error('Missing source');
    const trees = await Promise.all(sources.map(({ url }) => (
      url ? fetchTags(url).catch(() => {
        console.warn(`Failed to fetch tags from ${url}`);
        return [];
      }) : []
    )));
    const rootTags = browserTags(trees.reduce((tags, tree) => mergeTags(tags, tree), []));
    if (!rootTags.length) throw new Error('No tags found');
    const browser = document.createElement('milo-tag-browser');
    browser.tabIndex = 0;
    browser.rootTags = rootTags;
    block.replaceChildren(browser);
    if (window.parent !== window) {
      const { actions } = await DA_SDK;
      if (!actions?.sendText) {
        showError(block, 'Please log in to view tags.');
        return;
      }
      browser.actions = actions;
    }
  } catch {
    showError(block, 'Could not load tags.');
  }
}
