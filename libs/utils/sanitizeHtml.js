function stringToHTML(str) {
  const emptyBody = document.createElement('body');
  if (!str?.trim()) return emptyBody;
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(str, 'text/html');
    return doc.body || emptyBody;
  } catch (err) {
    return emptyBody;
  }
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
  [...elem.attributes].forEach(({ name, value }) => {
    if (isPossiblyDangerous(name, value)) {
      elem.removeAttribute(name);
    }
  });
}

function sanitize(html) {
  const htmlElem = stringToHTML(html);
  removeScripts(htmlElem);
  [htmlElem, ...htmlElem.querySelectorAll('*')].forEach(removeAttributes);
  return htmlElem;
}

// Returns firstChild for backwards compatibility with existing consumers.
export function sanitizeHtml(html) {
  return sanitize(html).firstChild;
}

// Returns the full body element — use when the fragment may have multiple root elements.
export function sanitizeHtmlBody(html) {
  return sanitize(html);
}
