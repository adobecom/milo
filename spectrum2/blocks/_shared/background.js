const MEDIA = 'img, video, a[href*=".mp4"]';
const TEXT_NODE = 3;
const MAX_COLOUR_LENGTH = 2048;
const FORBIDDEN = /url\(|image\(|[;{}\\]|expression/i;

const NAMED_COLOURS = new Set(`aliceblue antiquewhite aqua aquamarine azure beige bisque black
blanchedalmond blue blueviolet brown burlywood cadetblue chartreuse chocolate coral cornflowerblue
cornsilk crimson cyan darkblue darkcyan darkgoldenrod darkgray darkgreen darkgrey darkkhaki
darkmagenta darkolivegreen darkorange darkorchid darkred darksalmon darkseagreen darkslateblue
darkslategray darkslategrey darkturquoise darkviolet deeppink deepskyblue dimgray dimgrey dodgerblue
firebrick floralwhite forestgreen fuchsia gainsboro ghostwhite gold goldenrod gray green greenyellow
grey honeydew hotpink indianred indigo ivory khaki lavender lavenderblush lawngreen lemonchiffon
lightblue lightcoral lightcyan lightgoldenrodyellow lightgray lightgreen lightgrey lightpink
lightsalmon lightseagreen lightskyblue lightslategray lightslategrey lightsteelblue lightyellow lime
limegreen linen magenta maroon mediumaquamarine mediumblue mediumorchid mediumpurple mediumseagreen
mediumslateblue mediumspringgreen mediumturquoise mediumvioletred midnightblue mintcream mistyrose
moccasin navajowhite navy oldlace olive olivedrab orange orangered orchid palegoldenrod palegreen
paleturquoise palevioletred papayawhip peachpuff peru pink plum powderblue purple rebeccapurple red
rosybrown royalblue saddlebrown salmon sandybrown seagreen seashell sienna silver skyblue slateblue
slategray slategrey snow springgreen steelblue tan teal thistle tomato turquoise violet wheat white
whitesmoke yellow yellowgreen transparent currentcolor`.split(/\s+/));

const COLOUR_FUNCTIONS = new Set(['rgb', 'rgba', 'hsl', 'hsla', 'hwb', 'lab', 'lch', 'oklab', 'oklch', 'color']);
const GRADIENT_FUNCTIONS = new Set(['linear', 'radial', 'conic']
  .flatMap((g) => [`${g}-gradient`, `repeating-${g}-gradient`]));
const ARG_KEYWORDS = new Set(`to left right top bottom center at circle ellipse closest-side
closest-corner farthest-side farthest-corner from in none srgb srgb-linear display-p3 a98-rgb
prophoto-rgb rec2020 lab oklab xyz xyz-d50 xyz-d65 hsl hwb lch oklch shorter longer increasing
decreasing hue`.split(/\s+/));
const UNITS = new Set(`% deg grad rad turn px em rem ex ch cap ic lh rlh vw vh vi vb vmin vmax svw svh
lvw lvh dvw dvh cqw cqh cqi cqb cqmin cqmax cm mm q in pt pc`.split(/\s+/));

const NUMBER_RE = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?([a-z]+|%)?/i;
const IDENT_RE = /^-?[a-z][a-z0-9-]*/i;
const HEX_RE = /^#([0-9a-f]+)(?![a-z0-9_-])/i;

function tokenize(text) {
  const tokens = [];
  let rest = text;
  while (rest.length) {
    const ws = rest.match(/^\s+/);
    if (ws) {
      rest = rest.slice(ws[0].length);
    } else if (rest[0] === ',' || rest[0] === '/' || rest[0] === ')') {
      tokens.push({ t: rest[0] });
      rest = rest.slice(1);
    } else if (rest[0] === '#') {
      const m = rest.match(HEX_RE);
      if (!m || ![3, 4, 6, 8].includes(m[1].length)) return null;
      tokens.push({ t: 'hex' });
      rest = rest.slice(m[0].length);
    } else if (/^[+-]?[\d.]/.test(rest)) {
      const m = rest.match(NUMBER_RE);
      if (!m || (m[1] && !UNITS.has(m[1].toLowerCase()))) return null;
      tokens.push({ t: 'num' });
      rest = rest.slice(m[0].length);
    } else {
      const m = rest.match(IDENT_RE);
      if (!m) return null;
      const name = m[0].toLowerCase();
      rest = rest.slice(m[0].length);
      if (rest[0] === '(') {
        tokens.push({ t: 'fn', name });
        rest = rest.slice(1);
      } else {
        tokens.push({ t: 'ident', name });
      }
    }
  }
  return tokens;
}

function parseArgs(tokens, start, allowColourFns) {
  let i = start;
  while (i < tokens.length) {
    const tok = tokens[i];
    if (tok.t === ')') return i + 1;
    if (tok.t === 'fn') {
      if (!allowColourFns || !COLOUR_FUNCTIONS.has(tok.name)) return -1;
      i = parseArgs(tokens, i + 1, false);
      if (i < 0) return -1;
    } else if (tok.t === 'ident') {
      if (!NAMED_COLOURS.has(tok.name) && !ARG_KEYWORDS.has(tok.name)) return -1;
      i += 1;
    } else {
      i += 1;
    }
  }
  return -1;
}

export function isAuthoredColour(value) {
  if (typeof value !== 'string') return false;
  const text = value.trim();
  if (!text || text.length > MAX_COLOUR_LENGTH || FORBIDDEN.test(text)) return false;
  const tokens = tokenize(text);
  if (!tokens || !tokens.length) return false;
  const first = tokens[0];

  if (first.t === 'hex') return tokens.length === 1;
  if (first.t === 'ident') return tokens.length === 1 && NAMED_COLOURS.has(first.name);
  if (first.t !== 'fn') return false;
  if (COLOUR_FUNCTIONS.has(first.name)) return parseArgs(tokens, 1, false) === tokens.length;

  let i = 0;
  while (i < tokens.length) {
    const tok = tokens[i];
    if (tok.t !== 'fn' || !GRADIENT_FUNCTIONS.has(tok.name)) return false;
    i = parseArgs(tokens, i + 1, true);
    if (i < 0) return false;
    if (i === tokens.length) return true;
    if (tokens[i].t !== ',') return false;
    i += 1;
  }
  return false;
}

export function applyAuthoredColour(el, text) {
  const value = (text || '').trim();
  if (!isAuthoredColour(value)) return null;
  el.style.setProperty('--_authored-bg', value);
  return value;
}

const POSITION_KEYWORDS = new Set(['left', 'right', 'top', 'bottom', 'center']);
const LENGTH_RE = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(%|px|em|rem|vw|vh|vmin|vmax)?$/i;

function objectPosition(parts) {
  const words = parts.join(' ').trim().split(/\s+/).filter(Boolean);
  if (!words.length || words.length > 4) return null;
  const ok = words.every((w) => POSITION_KEYWORDS.has(w) || LENGTH_RE.test(w));
  return ok ? words.join(' ') : null;
}

function setObjectPosition(image, value) {
  if (value) image.style.setProperty('--_object-position', value);
  return value;
}

export function handleFocalpoint(pic, child, removeChild) {
  const image = pic?.querySelector('img');
  if (!child || !image) return null;
  let text = '';
  if (child.childElementCount === 2) {
    const dataElement = child.querySelectorAll('p')[1];
    text = dataElement?.textContent;
    if (removeChild) dataElement?.remove();
  } else if (child.textContent) {
    text = child.textContent;
    if (removeChild) [...child.childNodes].forEach((c) => c.nodeType === TEXT_NODE && c.remove());
  }
  if (!text) return null;
  const [x, y = ''] = text.trim().toLowerCase().split(',');
  return setObjectPosition(image, objectPosition([x, y]));
}

export function setBackgroundFocus(pic) {
  const img = pic?.querySelector('img');
  if (!img) return null;
  const { title } = img.dataset;
  if (!title?.startsWith('data-focal:')) return null;
  const coords = title.split(':')[1]?.split(',');
  if (coords?.length !== 2) return null;
  const [x, y] = coords.map((c) => c.trim());
  delete img.dataset.title;
  const numeric = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/;
  if (!numeric.test(x) || !numeric.test(y)) return null;
  return setObjectPosition(img, `${x}% ${y}%`);
}

export function decorateBlockBg(block, node, { useHandleFocalpoint = false, className = 's2-background' } = {}) {
  if (!node) return { kind: 'none', value: null };
  const childCount = node.childElementCount;
  if (node.querySelector(MEDIA) || childCount > 1) {
    node.classList.add(className);
    const binaryVP = [['s2-mobile-only'], ['s2-tablet-only', 's2-desktop-only']];
    const allVP = [['s2-mobile-only'], ['s2-tablet-only'], ['s2-desktop-only']];
    const viewports = childCount === 2 ? binaryVP : allVP;
    const rejected = [];
    [...node.children].forEach((child, i) => {
      if (childCount > 1 && i < viewports.length) child.classList.add(...viewports[i]);
      const pic = child.querySelector('picture');
      setBackgroundFocus(pic);
      if (useHandleFocalpoint && pic
        && (child.childElementCount === 2 || child.textContent?.trim())) {
        handleFocalpoint(pic, child, true);
      }
      child.querySelector('video')?.setAttribute('disablepictureinpicture', 'true');
      if (!child.querySelector(MEDIA)) {
        const text = child.textContent;
        if (!applyAuthoredColour(child, text) && text.trim()) rejected.push(text.trim());
        child.classList.add('s2-expand-background');
        child.textContent = '';
      }
    });
    return rejected.length ? { kind: 'media', value: node, rejected } : { kind: 'media', value: node };
  }
  const text = node.textContent;
  node.remove();
  const value = applyAuthoredColour(block, text);
  if (value) return { kind: 'colour', value };
  return text.trim() ? { kind: 'none', value: null, rejected: text.trim() } : { kind: 'none', value: null };
}
