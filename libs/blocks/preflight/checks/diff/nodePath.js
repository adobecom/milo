export function normalizeText(text) {
  return (text || '').replace(/\s+/g, ' ').trim();
}

export function getXPath(node, root) {
  const segments = [];
  let el = node;
  while (el && el !== root && el.parentElement) {
    let index = 1;
    let sibling = el.previousElementSibling;
    while (sibling) {
      if (sibling.tagName === el.tagName) index += 1;
      sibling = sibling.previousElementSibling;
    }
    segments.unshift(`${el.tagName.toLowerCase()}[${index}]`);
    el = el.parentElement;
  }
  return `/${segments.join('/')}`;
}
