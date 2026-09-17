/* hero -- GENERATED from Figma 8510:87590. Do not hand-edit: regenerate.
 *
 * The authored table carries CONTENT ONLY, in document order. This file owns
 * the STRUCTURE, so an author never has to mirror a div tree in a spreadsheet.
 * Content is matched to slots positionally, which is why SLOTS is emitted
 * alongside: a mismatch between what was authored and what the design declares
 * is reported, not silently absorbed.
 */
const BLOCK = "hero";
const SLOTS = [[{"kind":"image","cls":"hero-group-601597","tag":"div","lines":1}],[{"kind":"image","cls":"hero-vector","tag":"div","lines":1},{"kind":"text","cls":"hero-label","tag":"p","lines":1},{"kind":"image","cls":"hero-dropdown","tag":"div","lines":1},{"kind":"text","cls":"hero-label-2","tag":"p","lines":1},{"kind":"text","cls":"hero-label-3","tag":"p","lines":1},{"kind":"text","cls":"hero-label-4","tag":"p","lines":1},{"kind":"text","cls":"hero-label-5","tag":"p","lines":1},{"kind":"text","cls":"hero-label-6","tag":"p","lines":1},{"kind":"image","cls":"hero-vector-2","tag":"div","lines":1},{"kind":"text","cls":"hero-label-7","tag":"p","lines":1},{"kind":"text","cls":"hero-label-8","tag":"p","lines":1}],[{"kind":"text","cls":"hero-headline","tag":"p","lines":1},{"kind":"text","cls":"hero-headline-3","tag":"h2","lines":2},{"kind":"text","cls":"hero-body-2","tag":"p","lines":1},{"kind":"image","cls":"hero-tile","tag":"div","lines":1},{"kind":"image","cls":"hero-logo","tag":"div","lines":1},{"kind":"text","cls":"hero-try-acrobat-studio","tag":"p","lines":1},{"kind":"image","cls":"hero-vector-3","tag":"div","lines":1}]];
const STRUCTURE = {"cls":"hero-hero","slot":null,"children":[{"cls":"hero-image-mosiac","slot":null,"children":[{"cls":"hero-group-601597","slot":"image","children":[]}]},{"cls":"hero-frame-2147230457","slot":null,"children":[{"cls":"hero-nav-bar-container","slot":null,"children":[{"cls":"hero-lnav","slot":null,"children":[{"cls":"hero-main-nav","slot":null,"children":[{"cls":"hero-logo-primary-links","slot":null,"children":[{"cls":"hero-vector","slot":"image","children":[]},{"cls":"hero-main-menu-item","slot":null,"children":[{"cls":"hero-text-container","slot":null,"children":[{"cls":"hero-label","slot":"text","children":[]}]},{"cls":"hero-icon","slot":null,"children":[{"cls":"hero-dropdown","slot":"image","children":[]}]}]},{"cls":"hero-slash","slot":null,"children":[]},{"cls":"hero-main-menu-item-2","slot":null,"children":[{"cls":"hero-text-container-2","slot":null,"children":[{"cls":"hero-label-2","slot":"text","children":[]}]}]},{"cls":"hero-main-menu-item-3","slot":null,"children":[{"cls":"hero-text-container-3","slot":null,"children":[{"cls":"hero-label-3","slot":"text","children":[]}]}]},{"cls":"hero-main-menu-item-4","slot":null,"children":[{"cls":"hero-text-container-4","slot":null,"children":[{"cls":"hero-label-4","slot":"text","children":[]}]}]},{"cls":"hero-main-menu-item-5","slot":null,"children":[{"cls":"hero-text-container-5","slot":null,"children":[{"cls":"hero-label-5","slot":"text","children":[]}]}]},{"cls":"hero-main-menu-item-6","slot":null,"children":[{"cls":"hero-text-container-6","slot":null,"children":[{"cls":"hero-label-6","slot":"text","children":[]}]}]}]},{"cls":"hero-nav-utility","slot":null,"children":[{"cls":"hero-applications","slot":null,"children":[{"cls":"hero-vector-2","slot":"image","children":[]}]},{"cls":"hero-actions","slot":null,"children":[{"cls":"hero-children","slot":null,"children":[{"cls":"hero-button-primary-solid-on-light","slot":null,"children":[{"cls":"hero-button-core-primary","slot":null,"children":[{"cls":"hero-label-7","slot":"text","children":[]}]}]},{"cls":"hero-button-primary-outlined-on-light","slot":null,"children":[{"cls":"hero-button-core-primary-2","slot":null,"children":[{"cls":"hero-label-8","slot":"text","children":[]}]}]}]}]}]}]},{"cls":"hero-divider","slot":null,"children":[]}]}]},{"cls":"hero-copy","slot":null,"children":[{"cls":"hero-app-id","slot":null,"children":[{"cls":"hero-headline","slot":"text","children":[]}]},{"cls":"hero-headline-body","slot":null,"children":[{"cls":"hero-headline-3","slot":"text","children":[]},{"cls":"hero-body-2","slot":"text","children":[]}]},{"cls":"hero-promo","slot":null,"children":[{"cls":"hero-chic-type","slot":null,"children":[{"cls":"hero-pr","slot":null,"children":[{"cls":"hero-tile","slot":"image","children":[]},{"cls":"hero-mnemonic-logo","slot":null,"children":[{"cls":"hero-logo","slot":"image","children":[]}]}]},{"cls":"hero-try-acrobat-studio","slot":"text","children":[]}]},{"cls":"hero-plus","slot":null,"children":[{"cls":"hero-vector-3","slot":"image","children":[]}]}]}]}]}]};

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
