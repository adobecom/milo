/**
 * @typedef Options
 * @property {Boolean} debug Should we output messages to console
 * @property {Boolean} lazy Load icons lazily
 * @property {String} defaultSet Default icon set
 * @property {Array.<string, iconType>} supportedSets Supported Suffix Sets
 * @property {Array.<string, iconSize>} supportedSizes Supported Suffix Sizes
 */
const options = {
  debug: false,
  lazy: false,
  defaultSet: 's1',
  supportedSets: ['-s2', '-sx', '-test'],
  supportedSizes: ['-size-xxs', '-size-xs', '-size-s', '-size-m', '-size-l', '-size-xl', '-size-xxl', '-size-initial'],
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
 * @param {string} folderName
 * @param {url} iconUrl
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
 * @param {HTMLElement} miloIcon
 * @param {string} fileName
 * @param {string} folderName
 * @param {string} iconUrl
 */
function refreshIcon(miloIcon, fileName, folderName, iconUrl) {
  getIconSvg(fileName, folderName, iconUrl)
    .then((iconData) => {
      let data = iconData;
      // If we have some html, pass it along (useful for svg anim)
      if (miloIcon.defaultHTML) {
        data = data.replace('</svg>', `${miloIcon.defaultHTML}</svg>`);
      }
      miloIcon.innerHTML = data;
    })
    .catch((error) => {
      miloIcon.innerHTML = '<span>⚠️</span>';
      console.error(`miloIcon ${miloIcon})`);
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
    const dataUrl = this.getAttribute('data-url');
    this.innerHTML = '';
    refreshIcon(this, name, type, dataUrl);
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

function getIconAttributes(icon, baseUrl) {
  const iconName = icon.classList[1].replace('icon-', '');
  let libOrigin = 'https://milo.adobe.com/libs';
  // const { origin } = window.location;
  // if (origin.includes('localhost') || origin.includes('.hlx.')) {
  //   libOrigin = `https://main--milo--adobecom.hlx.${origin.includes('hlx.live') ? 'live' : 'page'}`;
  // }

  // console.log('libOrigin', libOrigin);
  // console.log('baseUrl', baseUrl);

  const attrs = {
    name: iconName,
    type: options.defaultSet,
    'data-url': `${baseUrl}/img/icons/${options.defaultSet}/${iconName}.svg`,
  };

  const setName = options.supportedSets.filter((name) => iconName.endsWith(name));
  if (setName.length > 0) {
    const newName = iconName.replace(setName, '');
    const folderName = setName[0].replace('-', '');
    attrs.type = folderName;
    attrs.name = newName;
    attrs["data-url"] = `${baseUrl}/img/icons/${folderName}/${newName}.svg`;
  }

  const suffixSize = options.supportedSizes.filter((size) => iconName.includes(size));
  if (suffixSize.length > 0) {
    const newName = attrs.name.replace(suffixSize, '');
    attrs.name = newName;
    attrs.size = suffixSize[0].replace('-size-', '');
    attrs["data-url"] = `${baseUrl}/img/icons/${attrs.type}/${newName}.svg`;
  }

  return attrs;
}

export function setNodeIndexClass(icons) {
  icons.forEach(async (icon) => {
    const parent = icon.parentNode;
    const children = parent.childNodes;
    const nodeIndex = Array.prototype.indexOf.call(children, icon);
    let indexClass = (nodeIndex === children.length - 1) ? 'last' : 'middle';
    if (nodeIndex === 0) indexClass = 'first'
    if (children.length === 1) indexClass = 'only'
    icon.classList.add(`node-index-${indexClass}`);
  });
}

function decorateToolTip(icon) {
  const wrapper = icon.closest('em');
  wrapper.className = 'tooltip-wrapper';
  if (!wrapper) return;
  const conf = wrapper.textContent.split('|');
  // Text is the last part of a tooltip
  const content = conf.pop().trim();
  if (!content) return;
  icon.dataset.tooltip = content;
  // Position is the next to last part of a tooltip
  const place = conf.pop()?.trim().toLowerCase() || 'right';
  icon.className = `icon icon-info milo-tooltip ${place}`;
  wrapper.parentElement.replaceChild(icon, wrapper);
}

export default async function loadIcons(icons, base) {
  icons.forEach(async (icon) => {
    const { classList } = icon;
    if (classList.contains('icon-tooltip')) decorateToolTip(icon);
    const attrs = getIconAttributes(icon, base);
    icon.classList.add(`icon-milo-${attrs.name}`);

    if (attrs.size === 'initial') icon.classList.add('size-initial'); 
    const attributes = Object.keys(attrs).map((k) => `${k}="${attrs[k]}"`).join(' ');
    icon.insertAdjacentHTML('afterbegin', `<milo-icon ${attributes}></milo-icon>`);
    
    // const svgElem = `<svg xmlns="http://www.w3.org/2000/svg" class="icon-milo">
    //   <image crossorigin="anonymous" href="${base}/img/icons/s1/${iconName}.svg"/>
    // </svg>`;
    // const svgImg = `<img src="${base}/img/icons/s1/${iconName}.svg"/>`;
    // icon.insertAdjacentHTML('afterbegin', svgImg);
    return icon;
  });
}
