function stringToHTML(str) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(str, 'text/html');
  return doc.body || document.createElement('body');
}

function removeScripts(html) {
  const scripts = html.querySelectorAll('script');
  scripts.forEach((script) => script.remove());
}

function isPossiblyDangerous(name, value) {
  const val = value.replace(/\s+/g, '').toLowerCase();
  if (['src', 'href', 'xlink:href'].includes(name)) {
    // eslint-disable-next-line no-script-url
    if (val.includes('javascript:') || val.includes('data:text/html')) return true;
  }
  if (name.startsWith('on')) return true;
  return false;
}

function removeAttributes(elem) {
  [...elem.attributes].forEach((attr) => {
    const { name, value } = attr;
    if (isPossiblyDangerous(name, value)) {
      elem.removeAttribute(name);
    }
  });
}

// eslint-disable-next-line import/prefer-default-export
export function sanitizeHtml(html) {
  const htmlElem = stringToHTML(html);
  removeScripts(htmlElem);
  [htmlElem, ...htmlElem.querySelectorAll('*')].forEach(removeAttributes);
  return htmlElem.firstChild;
}
