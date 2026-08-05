export function normalizeText(text) {
  return (text || '').replace(/\s+/g, ' ').trim();
}

export function getXPath(node, root) {
  const segs = [];
  let el = node;
  while (el && el !== root && el.parentElement) {
    let index = 1;
    let sib = el.previousElementSibling;
    while (sib) {
      if (sib.tagName === el.tagName) index += 1;
      sib = sib.previousElementSibling;
    }
    segs.unshift(`${el.tagName.toLowerCase()}[${index}]`);
    el = el.parentElement;
  }
  return `/${segs.join('/')}`;
}
