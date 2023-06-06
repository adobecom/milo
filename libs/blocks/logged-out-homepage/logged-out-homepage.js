import {
  decorateButtons,
  decorateBlockBg,
  decorateBlockText,
} from '../../utils/decorate.js';

// size: [heading, body, ...detail]
// blockTypeSizes array order: heading, body, detail, button, link
const blockTypeSizes = {
  small: ['m', 's', 's', 'l', 's'],
  medium: ['l', 'm', 'm', 'l', 'm'],
  large: ['xl', 'm', 'l', 'l', 'm'],
  xlarge: ['xxl', 'l', 'xl', 'l', 'l'],

  /* TODO: add this to CSS */
  podFullSizePodDesktop: ['xl', 'm', 'l', 'm'],

  'link-pod': ['m', 'xs', 'm', 's', 'xs'],
  'news-pod': ['s', 'm', 'm', 's', 'xs'],
  'quick-tools-bar': ['l', 'l', 'm', 's', 'xs'],
  default: ['m', 'm', 'l', 's', 'xs'],
};

function goToDataHref() {
  window.location.href = this.dataset.href;
}

function parseBlockMetaData(el) {
  const rows = el.querySelectorAll(':scope > div');
  let metaDataFound = false;
  const results = {
    rows: [],
    metaData: {},
  };
  rows.forEach((row) => {
    if (metaDataFound) {
      const children = row.querySelectorAll(':scope > div');
      if (children.length === 2) {
        const key = children[0].innerText
          .toLowerCase()
          .trim()
          .split(' ')
          .join('-');
        const image = children[1].querySelector('img');
        const link = children[1].querySelector('a');
        if (image) {
          results.metaData[key] = image.getAttribute('src');
        } else if (link && link.href.includes('.mp4')) {
          results.metaData[key] = link.href.getAttribute('src');
        } else {
          results.metaData[key] = children[1].innerText.trim();
        }
        row.remove();
      }
    } else {
      const innerText = row.innerText.toLowerCase().trim().split(' ').join('');
      if (innerText === 'blockmetadata') {
        metaDataFound = true;
        row.remove();
      } else {
        results.rows.push(row);
      }
    }
  });
  return results;
}

function getBlockSize(el) {
  const sizes = [
    'small',
    'medium',
    'large',
    'xlarge',
    'link-pod',
    'news-pod',
    'quick-tools-bar',
    'default',
  ];
  return sizes.find((size) => el.classList.contains(size)) || sizes[7];
}

function convertToSVG(el, svgImage) {
  const svgFilePath = svgImage;

  // Select the current image.
  const image = el.querySelector('picture')
    ? el.querySelector('picture')
    : el.querySelector('img');

  // Create a new dom parser to turn the SVG string into an element.
  const parser = new DOMParser();

  // Fetch the file from the server.
  fetch(svgFilePath)
    .then((response) => response.text())
    .then((text) => {
      // Turn the raw text into a document with the svg element in it.
      const parsed = parser.parseFromString(text, 'text/html');

      // Select the <svg> element from that document.
      const svg = parsed.querySelector('svg');

      // If both the image and svg are found, replace the image with the svg.
      if (image !== null && svg !== null) {
        image.replaceWith(svg);
      }
    });
}

function decorateLinks(el, size) {
  const links = el.querySelectorAll('a:not(.con-button)');
  if (links.length === 0) return;
  links.forEach((link) => {
    if (
      link.closest('.section') &&
      link.closest('.section').querySelector('.quick-tools-bar')
    ) {
      link.setAttribute('class', 'con-button outline button-s');
      if (
        link.querySelector('img') &&
        link.querySelector('img').getAttribute('alt')
      ) {
        link.insertAdjacentHTML(
          'beforeEnd',
          `<span class="spectrum-Button-label">${link
            .querySelector('img')
            .getAttribute('alt')}</span>`
        );
        if (link.querySelector('img').getAttribute('src').includes('.svg')) {
          convertToSVG(link, link.querySelector('img').getAttribute('src'));
        }
      }
      // link.outerHTML = `<strong>${link.outerHTML}</strong>`;
    }
    const parent = link.closest('p, div');
    parent.setAttribute('class', `body-${size}`);
  });
}

function checkForBackgroundRows(el, rows) {
  el.classList.add('has-bg');
  const [head, ...tail] = rows;
  decorateBlockBg(el, head);
  return tail;
}

function camelize(str) {
  const str2 = str.split('-').join(' ');
  return str2
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
      index === 0 ? word.toLowerCase() : word.toUpperCase()
    )
    .replace(/\s+/g, '');
}

function positionBackgrounds(row, index, metaData) {
  const prefixes = ['background', 'background2'];
  const selectors = {
    mobile: ':scope > div',
    tablet: ':scope > div.tabletOnly, :scope div.desktopOnly',
    desktop: ':scope div.desktopOnly',
  };
  Object.entries(selectors).forEach(([selectorKey, selector]) => {
    Object.entries(metaData).forEach(([key, value]) => {
      if (
        key.includes(`${prefixes[index]}-`) &&
        (key.includes(`${selectorKey}-`) || selectorKey === 'mobile')
      ) {
        const bgs = row.querySelectorAll(selector);
        bgs.forEach((bg) => {
          if (!bg.classList.contains('positioned-background')) {
            bg.classList.add('positioned-background');
            const img = bg.querySelector('img');
            if (img) {
              bg.style.backgroundImage = `url('${img.getAttribute('src')}')`;
            }
          }
          bg.style[camelize(key.replace(prefixes[index], 'background'))] =
            value.toLowerCase();
        });
      }
    });
  });
}

export default function init(el) {
  const blockSize = getBlockSize(el);
  // TODO: check for auto buttons and auto secondary buttons to wrap links
  decorateButtons(el, `button-${blockTypeSizes[blockSize][3]}`);
  // TODO: check buttons for an <img> inside and alt text on image
  decorateLinks(el, blockTypeSizes[blockSize][4]);
  const parsedBlock = parseBlockMetaData(el);
  let { rows, metaData } = parsedBlock;
  // metaData.forEach(setting)

  if (rows.length > 1) {
    rows = checkForBackgroundRows(el, rows);
    if (rows.length > 1 && el.classList.contains('two-backgrounds')) {
      rows = checkForBackgroundRows(el, rows);
    }
  }

  const backgrounds = el.querySelectorAll(':scope > div.background');
  backgrounds.forEach((row, index) => {
    positionBackgrounds(row, index, metaData);
  });

  if (el.classList.contains('highlight')) {
    const [highlight, ...tail] = rows;
    highlight.classList.add('highlight-row');
    rows = tail;
    const firstChild = highlight.querySelector(':scope > div:first-child');
    if (el.classList.contains('highlight-custom-bg')) {
      const image = firstChild.querySelector('img');
      if (image) {
        highlight.style.backgroundImage = `url(${image.getAttribute('src')})`;
      } else if (firstChild.innerText.trim() !== '') {
        highlight.style.backgroundColor = firstChild.innerText;
      }
      firstChild.remove();
      if (highlight.innerText.trim() === '') {
        highlight.classList.add('highlight-empty');
      }
    }
  }

  const config = blockTypeSizes[blockSize];
  const overrides = ['-heading', '-body', '-detail'];
  overrides.forEach((override, index) => {
    const hasClass = [...el.classList].filter((listItem) =>
      listItem.includes(override)
    );
    if (hasClass.length) {
      config[index] = hasClass[0].split('-').shift().toLowerCase();
    }
  });
  decorateBlockText(el, config);
  rows.forEach((row) => {
    row.classList.add('foreground');
  });

  if (
    el.classList.contains('link-pod') ||
    el.classList.contains('click-pod') ||
    el.classList.contains('news-pod')
  ) {
    const links = el.querySelectorAll('a');
    if (el.classList.contains('click-pod') && links.length) {
      const link = links[0];
      el.dataset.href = link.href;
      el.addEventListener('click', goToDataHref);
    }
  }
}
