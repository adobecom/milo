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

const URL_ATTRS = ['src', 'href', 'xlink:href', 'data', 'action', 'formaction'];
const SAFE_SCHEMES = ['http:', 'https:', 'mailto:', 'tel:', 'bookmark:'];

// Browsers ignore C0/C1 controls, whitespace, zero-width chars, and the BOM
// inside URLs, so strip them before extracting the scheme. This keeps the
// anchored scheme match from being evaded by a leading control char or by
// whitespace splitting the scheme (e.g. `\x01https:` or `data:image/ svg+xml`).
function isIgnoredChar(code) {
  return code <= 0x20
    || (code >= 0x7f && code <= 0x9f)
    || (code >= 0x200b && code <= 0x200d)
    || code === 0xfeff;
}

// Cap normalization past the longest prefix we test so a large inline
// `data:image` URI isn't walked in full.
const SCHEME_SCAN_LIMIT = 64;

function normalizeUrlValue(value) {
  let out = '';
  for (let i = 0; i < value.length && out.length < SCHEME_SCAN_LIMIT; i += 1) {
    if (!isIgnoredChar(value.charCodeAt(i))) out += value[i];
  }
  return out.toLowerCase();
}

function isSafeUrlValue(value) {
  const val = normalizeUrlValue(value);
  const scheme = val.match(/^[a-z][a-z0-9+.-]*:/)?.[0];
  if (!scheme) return true; // relative / anchor / query / protocol-relative
  // bookmark: is an inert DA authoring-anchor scheme, kept for authored content.
  if (SAFE_SCHEMES.includes(scheme)) return true;
  if (scheme === 'data:') {
    // Allow the empty placeholder and raster images; SVG can carry script.
    return val === 'data:,'
      || (val.startsWith('data:image/') && !val.startsWith('data:image/svg'));
  }
  return false;
}

function isPossiblyDangerous(name, value) {
  if (name.startsWith('on')) return true;
  if (URL_ATTRS.includes(name)) return !isSafeUrlValue(value);
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
