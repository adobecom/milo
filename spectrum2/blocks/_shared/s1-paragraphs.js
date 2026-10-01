const ELEMENT = 1;
const TEXT = 3;
const PHRASING = new Set(['A', 'ABBR', 'B', 'BDI', 'BDO', 'BR', 'CITE', 'CODE', 'DATA', 'DEL', 'DFN', 'EM', 'I',
  'INS', 'KBD', 'MARK', 'Q', 'S', 'SAMP', 'SMALL', 'SPAN', 'STRONG', 'SUB', 'SUP', 'TIME', 'U', 'VAR', 'WBR',
  'PICTURE', 'IMG', 'SVG', 'VIDEO']);
const MEDIA = new Set(['PICTURE', 'IMG', 'SVG', 'VIDEO']);

const tagOf = (n) => (n.nodeType === ELEMENT ? n.tagName.toUpperCase() : '');
const isBlankText = (n) => n.nodeType === TEXT && !n.nodeValue.trim();
const isInline = (n) => n.nodeType === TEXT || PHRASING.has(tagOf(n));

// eslint-disable-next-line import/prefer-default-export
export function paragraphsOf(cell, make, { keep = false, media = false } = {}) {
  const parts = [];
  let run = [];
  const flush = () => {
    while (run.length && isBlankText(run[run.length - 1])) run.pop();
    const nodes = run;
    run = [];
    if (!nodes.length) return;
    if (!media && nodes.every((n) => MEDIA.has(tagOf(n)) || isBlankText(n))) {
      parts.push(...nodes.filter((n) => n.nodeType === ELEMENT));
      return;
    }
    const p = make('p');
    nodes.forEach((n, i) => {
      if (n.nodeType !== TEXT) { p.append(keep ? n.cloneNode(true) : n); return; }
      let text = n.nodeValue;
      if (i === 0) text = text.trimStart();
      if (i === nodes.length - 1) text = text.trimEnd();
      p.append(text);
    });
    parts.push(p);
  };
  [...(cell?.childNodes || [])].forEach((n) => {
    if (n.nodeType === TEXT) {
      if (run.length || n.nodeValue.trim()) run.push(n);
      return;
    }
    if (n.nodeType !== ELEMENT) return;
    if (isInline(n)) { run.push(n); return; }
    flush();
    parts.push(n);
  });
  flush();
  return parts;
}
