/* audience-resting -- GENERATED from Figma 8510:87627. Do not hand-edit: regenerate.
 *
 * The authored table carries CONTENT ONLY, in document order. This file owns
 * the STRUCTURE, so an author never has to mirror a div tree in a spreadsheet.
 * Content is matched to slots positionally, which is why SLOTS is emitted
 * alongside: a mismatch between what was authored and what the design declares
 * is reported, not silently absorbed.
 */
const BLOCK = "audience-resting";
const SLOTS = [[{"kind":"text","cls":"audience-resting-eyebrow","tag":"h2","lines":1},{"kind":"image","cls":"audience-resting-vector","tag":"div","lines":1},{"kind":"image","cls":"audience-resting-asset","tag":"div","lines":1},{"kind":"text","cls":"audience-resting-eyebrow-2","tag":"p","lines":1}],[{"kind":"text","cls":"audience-resting-eyebrow-3","tag":"h2","lines":1},{"kind":"image","cls":"audience-resting-vector-2","tag":"div","lines":1},{"kind":"image","cls":"audience-resting-asset-2","tag":"div","lines":1},{"kind":"text","cls":"audience-resting-eyebrow-4","tag":"p","lines":1}],[{"kind":"text","cls":"audience-resting-eyebrow-5","tag":"h2","lines":1},{"kind":"image","cls":"audience-resting-vector-3","tag":"div","lines":1},{"kind":"image","cls":"audience-resting-frame-2087327770","tag":"div","lines":1},{"kind":"text","cls":"audience-resting-eyebrow-6","tag":"p","lines":1}],[{"kind":"text","cls":"audience-resting-eyebrow-7","tag":"h2","lines":1},{"kind":"image","cls":"audience-resting-vector-4","tag":"div","lines":1},{"kind":"image","cls":"audience-resting-frame-2087328029","tag":"div","lines":1},{"kind":"text","cls":"audience-resting-eyebrow-8","tag":"p","lines":1}]];
const STRUCTURE = {"cls":"audience-resting-audience-resting","slot":null,"children":[{"cls":"audience-resting-routing-carousel","slot":null,"children":[{"cls":"audience-resting-firefly","slot":null,"children":[{"cls":"audience-resting-frame-2087327505","slot":null,"children":[{"cls":"audience-resting-eyebrow","slot":"text","children":[]},{"cls":"audience-resting-vector","slot":"image","children":[]}]},{"cls":"audience-resting-asset","slot":"image","children":[]},{"cls":"audience-resting-frame-2087327722","slot":null,"children":[{"cls":"audience-resting-eyebrow-2","slot":"text","children":[]}]}]},{"cls":"audience-resting-firefly-2","slot":null,"children":[{"cls":"audience-resting-frame-2087327505-2","slot":null,"children":[{"cls":"audience-resting-eyebrow-3","slot":"text","children":[]},{"cls":"audience-resting-vector-2","slot":"image","children":[]}]},{"cls":"audience-resting-asset-2","slot":"image","children":[]},{"cls":"audience-resting-frame-2087327722-2","slot":null,"children":[{"cls":"audience-resting-eyebrow-4","slot":"text","children":[]}]}]},{"cls":"audience-resting-acrobat","slot":null,"children":[{"cls":"audience-resting-frame-2087327505-3","slot":null,"children":[{"cls":"audience-resting-eyebrow-5","slot":"text","children":[]},{"cls":"audience-resting-vector-3","slot":"image","children":[]}]},{"cls":"audience-resting-frame-2087327770","slot":"image","children":[]},{"cls":"audience-resting-frame-2087327722-3","slot":null,"children":[{"cls":"audience-resting-eyebrow-6","slot":"text","children":[]}]}]},{"cls":"audience-resting-genstudio","slot":null,"children":[{"cls":"audience-resting-frame-2087327505-4","slot":null,"children":[{"cls":"audience-resting-eyebrow-7","slot":"text","children":[]},{"cls":"audience-resting-vector-4","slot":"image","children":[]}]},{"cls":"audience-resting-frame-2087328029","slot":"image","children":[{"cls":"audience-resting-layer-1","slot":null,"children":[]}]},{"cls":"audience-resting-frame-2087327774","slot":null,"children":[{"cls":"audience-resting-eyebrow-8","slot":"text","children":[]}]}]}]}]};

function build(node, pool) {
  const el = document.createElement(node.slot === 'text' ? (pool.tagFor(node.cls) || 'div') : 'div');
  el.className = node.cls;
  if (node.slot === 'text') {
    const v = pool.text(node.cls);
    if (v) el.innerHTML = v;
  } else if (node.slot === 'image') {
    const v = pool.image(node.cls);
    if (v) el.append(v);
  }
  for (const c of node.children) el.append(build(c, pool));
  return el;
}

const KIND_LABEL = { text: 'text', image: 'an image' };

/**
 * Check the authored table against SLOTS before anything is rendered.
 *
 * This used to be done inline and permissively, while a comment above it
 * claimed mismatches were reported. They were not. Every case below was
 * SILENT, and the last one destroyed the author's own content:
 *
 *   - too few cells in a row   -> the slot was skipped, leaving a blank where
 *                                 the design has content, so the block looked
 *                                 deliberately empty rather than mis-authored
 *   - a cell of the wrong kind -> skipped identically
 *   - an extra cell            -> discarded
 *   - an EXTRA ROW             -> the loop stopped early, leaving the row out
 *                                 of the pool, and replaceChildren() below
 *                                 then DELETED it
 *
 * An author who cannot see that their content was dropped cannot fix it.
 */
function validate(rows) {
  const problems = [];
  if (rows.length !== SLOTS.length) {
    problems.push(`expected ${SLOTS.length} row(s), found ${rows.length}`);
  }
  rows.forEach((row, ri) => {
    const spec = SLOTS[ri];
    if (!spec) {
      problems.push(`row ${ri + 1} is surplus: this block defines only ${SLOTS.length} row(s)`);
      return;
    }
    const cells = [...row.children];
    if (cells.length !== spec.length) {
      problems.push(`row ${ri + 1}: expected ${spec.length} cell(s), found ${cells.length}`);
    }
    spec.forEach((sl, ci) => {
      const cell = cells[ci];
      if (!cell) {
        problems.push(`row ${ri + 1} cell ${ci + 1}: missing ${KIND_LABEL[sl.kind]}`);
        return;
      }
      const pic = cell.querySelector('picture, img');
      const kind = pic ? 'image' : 'text';
      if (kind !== sl.kind) {
        problems.push(`row ${ri + 1} cell ${ci + 1}: expected ${KIND_LABEL[sl.kind]}, `
          + `found ${KIND_LABEL[kind]}`);
      } else if (sl.kind === 'text' && !cell.textContent.trim()) {
        problems.push(`row ${ri + 1} cell ${ci + 1} (${sl.cls}) is empty`);
      }
    });
  });
  return problems;
}

export default function init(el) {
  const rows = [...el.children];

  const problems = validate(rows);
  if (problems.length) {
    // Leave the authored table exactly as the author wrote it. Rendering a
    // partial block over content we could not place would hide the mistake,
    // and replaceChildren() would destroy the evidence of it.
    el.classList.add('is-invalid');
    el.dataset.blockError = problems.join('; ');
    // eslint-disable-next-line no-console
    console.error(`[${BLOCK}] authoring does not match this block's contract:`, problems);
    return;
  }

  const texts = new Map();
  const images = new Map();
  const tags = new Map();
  rows.forEach((row, ri) => {
    const spec = SLOTS[ri];
    const cells = [...row.children];
    spec.forEach((sl, ci) => {
      const cell = cells[ci];
      if (sl.kind === 'text') {
        texts.set(sl.cls, cell.innerHTML.trim());
        tags.set(sl.cls, sl.tag);
      } else {
        images.set(sl.cls, cell.querySelector('picture, img'));
      }
    });
  });

  const pool = {
    text: (c) => texts.get(c),
    image: (c) => images.get(c),
    tagFor: (c) => tags.get(c),
  };
  const root = build(STRUCTURE, pool);
  el.replaceChildren(...root.children);
  el.classList.add('is-ready');
}
