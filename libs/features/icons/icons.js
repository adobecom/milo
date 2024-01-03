/**
 * @typedef Options
 * @property {Boolean} debug Should we output messages to console
 * @property {Boolean} lazy Load icons lazily
 * @property {String} defaultDir Default icon set
 * @property {Array.<string, iconType>} supportedPrefixTypes Supported Prefix Types
 * @property {Array.<string, iconSize>} supportedSuffixSizes Supported Suffix Sizes
 */
const options = {
  debug: true,
  lazy: true,
  defaultDir: 'core',
  supportedPrefixTypes: ['sI-', 'test-'],
  // supportedPrefixTypes Cannot start with a digit,
  // two hyphens or a hyphen followed by a number
  supportedSuffixSizes: ['-xxs', '-xs', '-s', '-m', '-l', '-xl', '-xxl', '-initial'],
};
const CACHE = {};

/**
 * @var {IntersectionObserver}
 */
const observer = new window.IntersectionObserver((entries, observerRef) => {
  entries.forEach(async (entry) => {
    if (entry.isIntersecting) {
      observerRef.unobserve(entry.target);
      entry.target.init();
    }
  });
});

function log(message, type = '') {
  if (options.debug) {
    console.log(`${type} ${message}`);
  }
}

/**
 * @param {string} fileName
 * @param {IconSet} iconSet
 * @param {string} iconUrl
 * @return {Promise<String, Error>}
 */
function getIconSvg(fileName, folderName, iconUrl) {
  if (!folderName) {
    throw Error(`Icon set ${folderName} does not exists`);
  }
  const cacheKey = `${fileName}`;

  // If we have it in cache
  if (iconUrl && CACHE[cacheKey]) {
    log(`Fetching ${cacheKey} from cache`, '💾');
    return CACHE[cacheKey];
  }

  // Or resolve
  log(`Fetching ${cacheKey} from /${folderName}/ - url:${iconUrl}`, '💵');
  CACHE[cacheKey] = fetch(iconUrl).then((response) => {
    if (response.ok) {
      return response.text();
    }
    throw Error(response.status);
  });
  return CACHE[cacheKey];
}

/**
 * @param {MiloIcon} miloIcon
 * @param {string} fileName
 * @param {string} folderName
 * @param {string} iconUrl
 */
function refreshIcon(miloIcon, fileName, folderName, iconUrl) {
  getIconSvg(fileName, folderName, iconUrl)
    .then((iconData) => {
      // Strip class attribute as it may be affected by css
      // if (iconData.includes("class=")) {
      //   iconData = iconData.replace(/ class="([a-z- ]*)"/g, "");
      // }
      // Fix fill to currentColor
      let data = iconData;
      if (folderName === 'sI') {
        // TODO: is this ok?
        data = data.replaceAll('var(--iconFill,#6E6E6E)', 'currentColor');
      }
      // If we have some html, pass it along (useful for svg anim)
      if (miloIcon.defaultHTML) {
        data = data.replace('</svg>', `${miloIcon.defaultHTML}</svg>`);
      }
      miloIcon.innerHTML = data;
    })
    .catch((error) => {
      miloIcon.innerHTML = '<span>⚠️</span>';
      console.error(`Failed to load icon ${fileName} (error ${error})`);
    });
}

/**
 * @param {HTMLElement} element
 * @returns {Boolean}
 */
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0
    && rect.left >= 0
    && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
    && rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

class MiloIconElement extends HTMLElement {
  /**
   * @param {object} opts
   * @returns {Options} The updated option object
   */

  /**
   * @return {String|null}
   */
  get type() {
    return this.getAttribute('type') || null;
  }

  // This tells the browser we want to be told
  // if the `name` attribute changes.
  static get observedAttributes() {
    return ['name'];
  }

  connectedCallback() {
    // innerHTML is not available because not parsed yet
    // setTimeout also allows whenDefined to kick in before init
    setTimeout(() => {
      if (options.lazy && !isInViewport(this)) {
        // observer will call init when element is visible
        observer.observe(this);
      } else {
        // init directly
        this.init();
      }
    });
  }

  init() {
    // Store default content as we will inject it back later
    this.defaultHTML = this.innerHTML;
    this.loadIcon();
  }

  loadIcon() {
    const name = this.getAttribute('name');
    if (!name) return;
    const type = this.getAttribute('type');
    const url = this.getAttribute('url');
    this.innerHTML = '';
    refreshIcon(this, name, type, url);
  }

  attributeChangedCallback(attr, oldVal, newVal) {
    // Wait until properly loaded for the first time
    if (typeof this.defaultHTML !== 'string') {
      return;
    }
    log(`Attr ${attr} changed from ${oldVal} to ${newVal}`);
    if (newVal) {
      this.loadIcon();
    }
  }
}

customElements.define('milo-icon', MiloIconElement);

function getIconAttributes(iconName, baseUrl) {
  const attrs = {
    name: iconName,
    type: options.defaultDir,
    url: `${baseUrl}/img/icons/${options.defaultDir}/${iconName}.svg`,
  };

  const prefixName = options.supportedPrefixTypes.filter((type) => iconName.startsWith(type));
  const hasPrefix = (prefixName.length > 0);
  if (hasPrefix) {
    const newName = iconName.replace(prefixName, '');
    const folderName = prefixName[0].replace('-', '');
    attrs.type = folderName;
    attrs.name = newName;
    attrs.url = `${baseUrl}/img/icons/${folderName}/${newName}.svg`;
  }

  const suffixSize = options.supportedSuffixSizes.filter((size) => iconName.endsWith(size));
  const hasSize = (suffixSize.length > 0);
  if (hasSize) {
    const newName = attrs.name.replace(suffixSize, '');
    attrs.name = newName;
    attrs.size = suffixSize[0].substring(1);
    attrs.url = `${baseUrl}/img/icons/${attrs.type}/${newName}.svg`;
  }

  const props = Object.keys(attrs).map((k) => `${k}="${attrs[k]}"`).join(' ');
  return props;
}

async function decorateIcons(icons, base) {
  [...icons].forEach(async (icon) => {
    const iconName = icon.classList[1].replace('icon-', '');
    const attrs = getIconAttributes(iconName, base);
    icon.insertAdjacentHTML('afterbegin', `<milo-icon ${attrs}></milo-icon>`);
    return icon;
  });
}

export default async function loadIcons(icons, base) {
  await decorateIcons(icons, base);
}
