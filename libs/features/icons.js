let fetchedIcons;
let fetched = false;

async function getSVGsfromFile(path) {
  /* c8 ignore next */
  if (!path) return null;
  const resp = await fetch(path);
  /* c8 ignore next */
  if (!resp.ok) return null;
  const miloIcons = {};
  const text = await resp.text();
  const parser = new DOMParser();
  const parsedText = parser.parseFromString(text, 'image/svg+xml');
  const symbols = parsedText.querySelectorAll('symbol');
  symbols.forEach((symbol) => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    while (symbol.firstChild) svg.appendChild(symbol.firstChild);
    [...symbol.attributes].forEach((attr) => svg.attributes.setNamedItem(attr.cloneNode()));
    svg.classList.add('icon-milo', `icon-milo-${svg.id}`);
    miloIcons[svg.id] = svg;
  });
  return miloIcons;
}

// eslint-disable-next-line no-async-promise-executor
export const fetchIcons = (config) => new Promise(async (resolve) => {
  /* c8 ignore next */
  if (fetched) { resolve(fetchedIcons); return; }
  const { miloLibs, codeRoot } = config;
  const base = miloLibs || codeRoot;
  fetchedIcons = await getSVGsfromFile(`${base}/img/icons/icons.svg`);
  fetched = true;
  resolve(fetchedIcons);
});

export default async function loadIcons(domIcons, config) {
  const icons = await fetchIcons(config);
  /* c8 ignore next */
  if (!icons) return;
  domIcons.forEach(async (i) => {
    const svg = i.querySelector('svg');
    /* c8 ignore next */
    if (svg) return;
    const iconName = i.classList[1].replace('icon-', '');
    if (!icons[iconName]) return;
    const parent = i.parentElement;
    if (parent.childNodes.length > 1) {
      if (parent.lastChild === i) {
        i.classList.add('margin-left');
      } else if (parent.firstChild === i) {
        i.classList.add('margin-right');
      } else {
        i.classList.add('margin-left', 'margin-right');
      }
    }
    i.insertAdjacentHTML('afterbegin', icons[iconName].outerHTML);
  });
}
