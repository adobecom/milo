const TYPE_BY_PARENT = { STRONG: 'accent', EM: 'outline', A: 'accent' };
const BUTTON_SUFFIX = /#_button-([a-zA-Z-]+)/g;

export function getButtonType(buttonParent) {
  let { nodeName } = buttonParent;
  if (nodeName === 'STRONG') {
    nodeName = buttonParent.parentElement?.nodeName === 'EM' ? 'EM' : nodeName;
  }
  return TYPE_BY_PARENT[nodeName] || 'outline';
}

function sizeClass(size) {
  if (size === null || size === undefined || size === false || size === '') return null;
  const bare = String(size).replace(/^button-/, '');
  return bare ? `s2-button-size-${bare}` : null;
}

const FALLBACK_BASE = 'https://spectrum2.invalid/';

function baseOf(target) {
  const base = target.ownerDocument?.baseURI;
  try {
    if (base && new URL('x', base)) return base;
  } catch (e) { /* not a usable base: fall back */ }
  return FALLBACK_BASE;
}

function protocolOf(href, base) {
  try { return new URL(href, base).protocol; } catch (e) { return null; }
}

function stripButtonSuffixes(target) {
  const href = target.getAttribute('href');
  if (!href) return;
  const matches = [...href.matchAll(BUTTON_SUFFIX)];
  if (!matches.length) return;
  let next = href;
  matches.forEach((match) => { next = next.replace(match[0], ''); });
  const base = baseOf(target);
  const before = protocolOf(href, base);
  if (before === null || before !== protocolOf(next, base)) return;
  matches.forEach((match) => {
    if (target.dataset.modalHash) {
      target.setAttribute('data-modal-hash', target.dataset.modalHash.replace(match[0], ''));
    }
    target.classList.add(match[1]);
  });
  target.setAttribute('href', next);
}

export function decorateButtons(el, size) {
  const buttons = el.querySelectorAll('em a, strong a, p > a strong');
  if (buttons.length === 0) return [];
  const sizeCls = sizeClass(size);
  const decorated = [];

  buttons.forEach((button) => {
    if ((button.classList.contains('merch-card-autoblock') || button.classList.contains('merch'))
      && button.classList.contains('link-block')) return;
    const parent = button.parentElement;
    if (!parent) return;
    let target = button;
    const buttonType = getButtonType(parent);
    if (button.nodeName === 'STRONG') {
      target = parent;
    } else {
      parent.insertAdjacentElement('afterend', button);
      parent.remove();
    }
    target.classList.add('s2-button', `s2-button-${buttonType}`);
    if (sizeCls) target.classList.add(sizeCls);
    stripButtonSuffixes(target);
    const actionArea = button.closest('p, div');
    if (actionArea) {
      actionArea.classList.add('s2-action-area');
      actionArea.nextElementSibling?.classList.add('s2-supplemental');
    }
    decorated.push(target);
  });
  return decorated;
}
