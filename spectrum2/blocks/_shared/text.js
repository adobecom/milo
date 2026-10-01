import { decorateButtons } from './buttons.js';

const ELEMENT_NODE = 1;
const TEXT_NODE = 3;

export const TEXT_ROLES = Object.freeze({
  c2: Object.freeze({
    heading: Object.freeze(['1', '2', '3', '4', '5', '6', 'super']),
    body: Object.freeze(['lg', 'md', 'sm', 'xs']),
    detail: Object.freeze([]),
  }),
  c1: Object.freeze({
    heading: Object.freeze(['xxs', 'xs', 's', 'm', 'l', 'xl', 'xxl', 'xxxl']),
    body: Object.freeze(['xxs', 'xs', 's', 'm', 'l', 'xl', 'xxl']),
    detail: Object.freeze(['xs', 's', 'm', 'l', 'xl']),
  }),
});

export const TEXT_DEFAULTS = Object.freeze({
  c2: Object.freeze({ heading: '2', body: 'md', button: 'md' }),
  c1: Object.freeze({ heading: 'm', body: 's', detail: 'm' }),
});

const isSet = (v) => v !== null && v !== undefined && v !== false && v !== '';

export function isTextRole(origin, kind, size) {
  const roles = TEXT_ROLES[origin]?.[kind];
  return !!roles && isSet(size) && roles.includes(String(size));
}

export function roleClass(origin, kind, size) {
  if (kind === 'eyebrow') return 's2-eyebrow';
  if (origin === 'c2' && kind === 'heading' && String(size) === 'super') return 's2-super';
  return `s2-${kind}-${size}`;
}

function checkRole(origin, kind, size) {
  if (!isSet(size)) return null;
  if (!isTextRole(origin, kind, size)) {
    throw new Error(`spectrum2: ${JSON.stringify(size)} is not a ${origin} ${kind} role (TEXT_ROLES.${origin}.${kind})`);
  }
  return roleClass(origin, kind, size);
}

export function decorateIconArea(el) {
  el.querySelectorAll('.icon').forEach((icon) => {
    const parent = icon.parentElement;
    if (!parent) return;
    parent.classList.add('s2-icon-area');
    if (icon.textContent.includes('persona')) parent.classList.add('s2-persona-area');
  });
}

export function decorateIconStack(el) {
  const ulElems = el.querySelectorAll('ul');
  if (!ulElems.length) return;
  const stackEl = ulElems[ulElems.length - 1];
  stackEl.classList.add('s2-icon-stack-area', 's2-body-s');
  el.classList.add('s2-icon-stack');
  [...stackEl.querySelectorAll('li')].forEach((item) => {
    const links = item.querySelectorAll('a');
    if (links.length <= 1) return;
    const picIndex = links[0].querySelector('a picture') ? 0 : 1;
    const linkImg = links[picIndex];
    const linkText = links[1 - picIndex];
    const linkPic = linkImg.querySelector('picture');
    if (linkPic) {
      linkText.prepend(linkPic);
      linkImg.remove();
    }
  });
}

function elContainsText(el) {
  return [...el.childNodes].some((node) => {
    if (node.nodeType === TEXT_NODE) return node.textContent.trim() !== '';
    if (node.nodeType !== ELEMENT_NODE) return false;
    if (node.textContent.trim() !== '') return true;
    return node.tagName.includes('-') && !node.hidden;
  });
}

export function decorateBlockText(container, cfg) {
  if (!container) return;
  if (!cfg || typeof cfg !== 'object' || Array.isArray(cfg)) {
    throw new TypeError('spectrum2: decorateBlockText needs an explicit cfg object { origin, heading, body, ... }');
  }
  const { origin, type = null } = cfg;
  if (origin !== 'c1' && origin !== 'c2') {
    throw new Error(`spectrum2: decorateBlockText cfg.origin must be 'c1' or 'c2' (got ${JSON.stringify(origin)})`);
  }
  const headingCls = checkRole(origin, 'heading', cfg.heading);
  const bodyCls = checkRole(origin, 'body', cfg.body);
  const detailCls = origin === 'c1' ? checkRole(origin, 'detail', cfg.detail) : null;

  if (!container.classList.contains('default')) {
    let headings = [...container.querySelectorAll('h1, h2, h3, h4, h5, h6')];
    if (type === 'hasDetailHeading' && headings.length > 1) headings = headings.slice(1);
    if (headingCls) headings.forEach((h) => h.classList.add(headingCls));
    if (detailCls || origin === 'c2') {
      const prevSib = headings[0]?.previousElementSibling;
      prevSib?.classList.toggle(origin === 'c2' ? 's2-eyebrow' : detailCls, !prevSib.querySelector('picture'));
      decorateIconArea(container);
    }
    if (bodyCls) {
      const emptyEls = container.querySelectorAll(':is(p, ul, ol, div):not([class])');
      if (emptyEls.length) {
        [...emptyEls].filter(elContainsText).forEach((e) => e.classList.add(bodyCls));
      } else if (!container.classList.length && elContainsText(container)) {
        container.classList.add(bodyCls);
      }
    }
  }
  decorateButtons(container, isSet(cfg.button) ? cfg.button : null);
  if (type === 'merch') decorateIconStack(container);
}

const GRAMMARS = {
  c2: {
    types: ['heading', 'body', 'button'],
    parse(cls) {
      if (!['heading-', 'body-', 'button-'].some((p) => cls.startsWith(p))) return null;
      const parts = cls.split('-');
      return { type: parts[0], modifier: parts[1] };
    },
  },
  c1: {
    types: ['heading', 'body', 'detail'],
    parse(cls) {
      if (!['-heading', '-body', '-detail'].some((s) => cls.endsWith(s))) return null;
      const parts = cls.split('-');
      return { type: parts[1], modifier: parts[0] };
    },
  },
};

function familyTest(grammar, type) {
  if (grammar === 'c2' && type === 'heading') return (c) => c === 's2-super' || c.startsWith('s2-heading-');
  if (type === 'button') return (c) => c.startsWith('s2-button-size-');
  return (c) => c.startsWith(`s2-${type}-`);
}

function replacementClass(grammar, type, modifier) {
  if (type === 'button') return `s2-button-size-${modifier}`;
  return roleClass(grammar, type, modifier);
}

export function applyTextOverrides(el, grammar, target = el) {
  if (grammar === 'none') return [];
  const spec = GRAMMARS[grammar];
  if (!spec) throw new Error(`spectrum2: applyTextOverrides grammar must be 'c1', 'c2' or 'none' (got ${JSON.stringify(grammar)})`);
  const overrides = [...el.classList].filter((cls) => spec.parse(cls));
  if (!overrides.length) return [];
  const scope = target || el;
  const applied = [];
  overrides.forEach((override) => {
    const { type, modifier } = spec.parse(override);
    if (spec.types.includes(type) && modifier) {
      const inFamily = familyTest(grammar, type);
      const next = replacementClass(grammar, type, modifier);
      let count = 0;
      scope.querySelectorAll('[class]').forEach((node) => {
        const current = [...node.classList].find(inFamily);
        if (!current) return;
        node.classList.replace(current, next);
        count += 1;
      });
      if (count) applied.push(override);
    }
    el.classList.remove(override);
  });
  return applied;
}
