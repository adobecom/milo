import { CONTROLS, getDefaultState, STAGGER_CONTROLS, getDefaultStaggerState } from './controls.js';

const STORAGE_KEY = `pa:${window.location.pathname}`;
const STAGGER_KEY = `pa-stagger:${window.location.pathname}`;

export function loadStoredState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
  } catch {
    return null;
  }
}

export function saveState(stateMap) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stateMap));
}

export function loadStaggerState() {
  try {
    return JSON.parse(localStorage.getItem(STAGGER_KEY) || 'null');
  } catch {
    return null;
  }
}

export function saveStaggerState(map) {
  localStorage.setItem(STAGGER_KEY, JSON.stringify(map));
}

export function buildPanel(
  tree,
  stateMap,
  callbacks,
  blockStateMap = {},
  blockSourceIds = new Set(),
  staggerMap = {},
) {
  const { onLiveUpdate, onCommitUpdate, onReset, onStaggerUpdate, onStaggerReset } = callbacks;

  const panel = document.createElement('div');
  panel.id = 'page-animator-panel';
  panel.innerHTML = `
    <div class="pa-header">
      <div class="pa-header-title">
        <span class="pa-drag-handle" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="9" cy="6" r="1.5"></circle><circle cx="15" cy="6" r="1.5"></circle>
            <circle cx="9" cy="12" r="1.5"></circle><circle cx="15" cy="12" r="1.5"></circle>
            <circle cx="9" cy="18" r="1.5"></circle><circle cx="15" cy="18" r="1.5"></circle>
          </svg>
        </span>
        <strong>Page Animator</strong>
        <button class="pa-icon-btn" id="pa-close-btn" aria-label="Close panel" title="Close panel">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
          </svg>
        </button>
      </div>
      <div class="pa-header-actions">
        <button class="pa-btn" id="pa-import-btn" title="Import animations">Import</button>
        <button class="pa-btn" id="pa-download-btn" title="Share animations"><svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M6 1.5v6.5m0 0L3.5 5.5M6 8L8.5 5.5M2 10h8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path></svg> Share</button>
        <button class="pa-btn" id="pa-collapse-btn" aria-label="Collapse all sections" title="Collapse all sections"></button>
        <button class="pa-btn" id="pa-follow-btn" aria-label="Auto-scroll page on hover" title="Sync block highlight to panel">&#9678;</button>
        <button class="pa-btn" id="pa-theme-btn" aria-label="Toggle theme" title="Toggle theme">&#9790;</button>
        <button class="pa-btn" id="pa-help-btn" aria-label="Show help" title="Show help"><svg width="14" height="14" viewBox="0 0 18 18" fill="currentColor" aria-hidden="true"><path d="M9,1a8,8,0,1,0,8,8A8,8,0,0,0,9,1Zm.0235,13.438a1.345,1.345,0,0,1-.11595-2.6875q.05795-.00251.11595,0a1.31,1.31,0,0,1,1.39719,1.21658q.00408.05912.00281.11842a1.29052,1.29052,0,0,1-1.4,1.3525Zm1.783-6.409-.1.105c-.3945.4145-.842.884-.842,1.1755a1.38555,1.38555,0,0,0,.1795.674l.0725.1385-.0565.2145a.30851.30851,0,0,1-.2835.189H8.4355a.43352.43352,0,0,1-.325-.1175A2.05554,2.05554,0,0,1,7.688,9.1455a3.0589,3.0589,0,0,1,1.1125-2.075c.1-.1095.195-.21.2875-.3045.3145-.3255.5065-.5355.5065-.7575,0-.154,0-.6225-.893-.6225a2.959,2.959,0,0,0-1.5795.4595.296.296,0,0,1-.3265-.01L6.677,5.751l-.0275-.2215v-1.45A.4395.4395,0,0,1,6.846,3.67a4.13751,4.13751,0,0,1,2.15-.55,2.55036,2.55036,0,0,1,2.75,2.636A3.0655,3.0655,0,0,1,10.8065,8.029Z"></path></svg></button>
      </div>
    </div>
    <div class="pa-instructions" id="pa-instructions" hidden>
      <ul>
        <li>Click a section label to collapse or expand it. Or, click the <strong>collapse all sections</strong> button to toggle all sections open or closed.</li>
        <li>Click any item in the tree to toggle display or hide its controls. This will also scroll the page to the block and highlight it on the page.</li>
        <li>Toggle the <strong>sync block highlight to panel</strong> button. When enabled, hovering over a block name in the panel automatically scrolls the page to that block.</li>
        <li>Adjust sliders and dropdowns to configure the animation. Scroll the page near the item you are editing to see the animation work in real time as you scroll.</li>
        <li>Click the <strong>share</strong> button to save and share a copy of the current animation settings. Use this to collaborate with others or to start from a saved state.</li>
        <li>Click the <strong>import</strong> button to load a saved copy of the animation panel settings. Use this to collaborate with others or to start from a saved state. <em>This will override the current animation panel settings.</em></li>
        <li>Click <strong>Reset animation</strong> reset the animation to the default values.</li>
      </ul>
      <div class="pa-instructions-dots">
        <span class="pa-dot"></span> No animation &nbsp;
        <span class="pa-dot" style="background:#0d66d0"></span> Panel animation &nbsp;
        <span class="pa-dot" style="background:#2d9e5f"></span> From DA block &nbsp;
        <span class="pa-dot" style="background:#c064c8"></span> Has stagger
      </div>
    </div>
    <div class="pa-tree" id="pa-tree"></div>
  `;

  const helpBtn = panel.querySelector('#pa-help-btn');
  helpBtn.addEventListener('click', () => {
    const instructions = panel.querySelector('#pa-instructions');
    instructions.hidden = !instructions.hidden;
    helpBtn.classList.toggle('pa-btn-active', !instructions.hidden);
  });

  let selectedId = null;
  let selectedEl = null;
  const collapsedSections = new Set();

  const TOOLTIP_ICON = '<svg width="12" height="12" viewBox="0 0 18 18" fill="currentColor" aria-hidden="true"><path d="M9,1a8,8,0,1,0,8,8A8,8,0,0,0,9,1ZM8.85,3.15a1.359,1.359,0,0,1,1.43109,1.28286q.00352.06452.00091.12914A1.332,1.332,0,0,1,8.85,5.9935a1.3525,1.3525,0,0,1-1.432-1.432A1.3585,1.3585,0,0,1,8.72033,3.14907Q8.78516,3.14643,8.85,3.15ZM11,13.5a.5.5,0,0,1-.5.5h-3a.5.5,0,0,1-.5-.5v-1a.5.5,0,0,1,.5-.5H8V9H7.5A.5.5,0,0,1,7,8.5v-1A.5.5,0,0,1,7.5,7h2a.5.5,0,0,1,.5.5V12h.5a.5.5,0,0,1,.5.5Z"></path></svg>';
  const COLLAPSE_ICON = '<svg width="14" height="14" viewBox="0 0 18 18" fill="currentColor" aria-hidden="true"><path d="M4.5,4H13V1.5a.5.5,0,0,0-.5-.5H1.5a.5.5,0,0,0-.5.5v11a.5.5,0,0,0,.5.5H4V4.5A.5.5,0,0,1,4.5,4Z"></path><path d="M5,5.5v11a.5.5,0,0,0,.5.5h11a.5.5,0,0,0,.5-.5V5.5a.5.5,0,0,0-.5-.5H5.5A.5.5,0,0,0,5,5.5ZM7.25,12A.25.25,0,0,1,7,11.75v-1.5A.25.25,0,0,1,7.25,10h7.5a.25.25,0,0,1,.25.25v1.5a.25.25,0,0,1-.25.25Z"></path></svg>';
  const EXPAND_ICON = '<svg width="14" height="14" viewBox="0 0 18 18" fill="currentColor" aria-hidden="true"><path d="M4.5,4H13V1.5a.5.5,0,0,0-.5-.5H1.5a.5.5,0,0,0-.5.5v11a.5.5,0,0,0,.5.5H4V4.5A.5.5,0,0,1,4.5,4Z"></path><path d="M5,5.5v11a.5.5,0,0,0,.5.5h11a.5.5,0,0,0,.5-.5V5.5a.5.5,0,0,0-.5-.5H5.5A.5.5,0,0,0,5,5.5ZM14.75,12H12v2.75a.25.25,0,0,1-.25.25h-1.5a.25.25,0,0,1-.25-.25V12H7.25A.25.25,0,0,1,7,11.75v-1.5A.25.25,0,0,1,7.25,10H10V7.25A.25.25,0,0,1,10.25,7h1.5a.25.25,0,0,1,.25.25V10h2.75a.25.25,0,0,1,.25.25v1.5A.25.25,0,0,1,14.75,12Z"></path></svg>';
  const LENIS_ID = 'pa-lenis';
  const collapseBtn = panel.querySelector('#pa-collapse-btn');

  // Includes the Lenis pseudo-section so the collapse-all toolbar button toggles it too.
  const getAllSectionIds = () => [LENIS_ID, ...tree.map((s) => s.id)];

  function syncCollapseBtn() {
    const ids = getAllSectionIds();
    const allCollapsed = ids.length > 0 && ids.every((id) => collapsedSections.has(id));
    const label = allCollapsed ? 'Expand all sections' : 'Collapse all sections';
    collapseBtn.innerHTML = allCollapsed ? EXPAND_ICON : COLLAPSE_ICON;
    collapseBtn.setAttribute('aria-label', label);
    collapseBtn.setAttribute('title', label);
  }

  collapseBtn.addEventListener('click', () => {
    const ids = getAllSectionIds();
    const allCollapsed = ids.every((id) => collapsedSections.has(id));
    if (allCollapsed) collapsedSections.clear();
    else ids.forEach((id) => collapsedSections.add(id));
    // eslint-disable-next-line no-use-before-define
    renderTree();
  });

  function buildCopyHtml(item) {
    const sectionNode = tree.find(
      (s) => s.id === item.id || s.blocks.some((b) => b.id === item.id),
    );
    let header;
    if (sectionNode.id === item.id) {
      header = 'animation';
    } else {
      const blockClass = item.el.classList[0];
      const sameClass = sectionNode.blocks.filter((b) => b.el.classList[0] === blockClass);
      const sibIdx = sameClass.findIndex((b) => b.id === item.id);
      const variantToken = blockClass.includes('-') ? `(${blockClass})` : blockClass;
      header = sibIdx > 0 ? `animation ${variantToken} ${sibIdx + 1}` : `animation ${variantToken}`;
    }
    const state = stateMap[item.id] || getDefaultState();
    const rows = CONTROLS.map((c) => `<tr><td>${c.cssVar}</td><td>${state[c.cssVar] ?? c.default}</td></tr>`).join('');
    return `<table><tr><td colspan="2">${header}</td></tr>${rows}</table>`;
  }

  function buildControls(item) {
    const state = stateMap[item.id] || getDefaultState();
    const wrap = document.createElement('div');
    wrap.className = 'pa-controls';

    CONTROLS.forEach((ctrl) => {
      const div = document.createElement('div');
      div.className = 'pa-control';

      if (ctrl.type === 'range') {
        const val = state[ctrl.cssVar] ?? ctrl.default;
        const tip = ctrl.tooltip ? `<span class="pa-tooltip" aria-label="${ctrl.tooltip}">${TOOLTIP_ICON}<span class="pa-tooltip-text">${ctrl.tooltip}</span></span>` : '';
        div.innerHTML = `
          <div class="pa-control-label">${ctrl.label}${tip} <span class="pa-val">${val}${ctrl.unit}</span></div>
          <input type="range" min="${ctrl.min}" max="${ctrl.max}" step="${ctrl.step}" value="${val}" data-var="${ctrl.cssVar}" data-unit="${ctrl.unit}">
        `;

        const input = div.querySelector('input');
        const valSpan = div.querySelector('.pa-val');

        input.addEventListener('input', () => {
          const num = parseFloat(input.value);
          valSpan.textContent = `${num}${ctrl.unit}`;
          if (!stateMap[item.id]) stateMap[item.id] = getDefaultState();
          stateMap[item.id][ctrl.cssVar] = num;
          if (ctrl.commitOnInput) {
            onCommitUpdate(item.id, stateMap[item.id]);
          } else {
            onLiveUpdate(item.el, ctrl.cssVar, `${num}${ctrl.unit}`);
          }
        });

        input.addEventListener('change', () => {
          onCommitUpdate(item.id, stateMap[item.id]);
          saveState(stateMap);
        });
      } else {
        const val = state[ctrl.cssVar] ?? ctrl.default;
        const opts = ctrl.options.map((o) => `<option${o === val ? ' selected' : ''}>${o}</option>`).join('');
        const tip = ctrl.tooltip ? `<span class="pa-tooltip" aria-label="${ctrl.tooltip}">${TOOLTIP_ICON}<span class="pa-tooltip-text">${ctrl.tooltip}</span></span>` : '';
        div.innerHTML = `<div class="pa-control-label">${ctrl.label}${tip}</div><select>${opts}</select>`;
        const select = div.querySelector('select');
        select.addEventListener('change', () => {
          if (!stateMap[item.id]) stateMap[item.id] = getDefaultState();
          stateMap[item.id][ctrl.cssVar] = select.value;
          onCommitUpdate(item.id, stateMap[item.id]);
          saveState(stateMap);
        });
      }

      wrap.appendChild(div);
    });

    const fromBlock = blockSourceIds.has(item.id);

    const resetBtn = document.createElement('button');
    resetBtn.className = 'pa-reset-btn';
    resetBtn.textContent = fromBlock ? 'Reset to block' : 'Reset animation';
    resetBtn.addEventListener('click', () => {
      if (fromBlock) {
        stateMap[item.id] = { ...blockStateMap[item.id] };
        onCommitUpdate(item.id, stateMap[item.id]);
        const stored = loadStoredState() || {};
        delete stored[item.id];
        saveState(stored);
      } else {
        delete stateMap[item.id];
        onReset(item.el, item.id);
        saveState(stateMap);
      }
      // eslint-disable-next-line no-use-before-define
      renderTree();
    });
    wrap.appendChild(resetBtn);

    const copyBtn = document.createElement('button');
    copyBtn.className = 'pa-reset-btn';
    copyBtn.textContent = fromBlock ? 'Copy updated' : 'Copy to DA';
    copyBtn.style.marginTop = '6px';
    copyBtn.addEventListener('click', () => {
      if (!stateMap[item.id]) stateMap[item.id] = getDefaultState();
      const html = buildCopyHtml(item);
      const blob = new Blob([html], { type: 'text/html' });
      navigator.clipboard.write([new ClipboardItem({ 'text/html': blob })]).then(() => {
        const prev = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        setTimeout(() => { copyBtn.textContent = prev; }, 1500);
      });
    });
    wrap.appendChild(copyBtn);

    return wrap;
  }

  function buildStaggerControls(section) {
    const blockIds = section.blocks.map((b) => b.id);
    const state = staggerMap[section.id] || getDefaultStaggerState();
    const wrap = document.createElement('div');
    wrap.className = 'pa-stagger-controls';

    const heading = document.createElement('div');
    heading.className = 'pa-stagger-heading';
    heading.textContent = 'Stagger Effect';
    wrap.appendChild(heading);

    STAGGER_CONTROLS.forEach((ctrl) => {
      const div = document.createElement('div');
      div.className = 'pa-control';
      const tip = ctrl.tooltip ? `<span class="pa-tooltip" aria-label="${ctrl.tooltip}">ℹ︎<span class="pa-tooltip-text">${ctrl.tooltip}</span></span>` : '';

      if (ctrl.type === 'range') {
        const val = state[ctrl.cssVar] ?? ctrl.default;
        div.innerHTML = `
          <div class="pa-control-label">${ctrl.label}${tip} <span class="pa-val">${val}${ctrl.unit}</span></div>
          <input type="range" min="${ctrl.min}" max="${ctrl.max}" step="${ctrl.step}" value="${val}" data-var="${ctrl.cssVar}">
        `;
        const input = div.querySelector('input');
        const valSpan = div.querySelector('.pa-val');
        input.addEventListener('input', () => {
          const num = parseFloat(input.value);
          valSpan.textContent = `${num}${ctrl.unit}`;
          if (!staggerMap[section.id]) staggerMap[section.id] = getDefaultStaggerState();
          staggerMap[section.id][ctrl.cssVar] = num;
          onStaggerUpdate(section.id, blockIds, staggerMap[section.id]);
          saveStaggerState(staggerMap);
        });
      } else {
        const val = state[ctrl.cssVar] ?? ctrl.default;
        const opts = ctrl.options.map((o) => `<option${o === val ? ' selected' : ''}>${o}</option>`).join('');
        div.innerHTML = `<div class="pa-control-label">${ctrl.label}${tip}</div><select>${opts}</select>`;
        const select = div.querySelector('select');
        select.addEventListener('change', () => {
          if (!staggerMap[section.id]) staggerMap[section.id] = getDefaultStaggerState();
          staggerMap[section.id][ctrl.cssVar] = select.value;
          onStaggerUpdate(section.id, blockIds, staggerMap[section.id]);
          saveStaggerState(staggerMap);
        });
      }
      wrap.appendChild(div);
    });

    const resetBtn = document.createElement('button');
    resetBtn.className = 'pa-reset-btn';
    resetBtn.textContent = 'Reset stagger';
    resetBtn.addEventListener('click', () => {
      delete staggerMap[section.id];
      onStaggerReset(section.id);
      saveStaggerState(staggerMap);
      // eslint-disable-next-line no-use-before-define
      renderTree();
    });
    wrap.appendChild(resetBtn);

    return wrap;
  }

  // Lenis section — always sits at the top of the tree. Controls live page-scroll
  // inertia (lerp) and wheel sensitivity (wheelMultiplier). Reads/writes Lenis
  // options directly via window.lenis; the lerp setter also updates
  // window.lenisBaseLerp so the fast-scroll throttle in utils.js honors it.
  // LENIS_ID is declared higher up so the collapse-all toolbar button can include it.
  const LENIS_DEFAULT_LERP = 0.08;
  const LENIS_DEFAULT_WHEEL = 1;

  function buildLenisRange(opts) {
    const div = document.createElement('div');
    div.className = 'pa-control';
    const tip = `<span class="pa-tooltip" aria-label="${opts.tooltip}">${TOOLTIP_ICON}<span class="pa-tooltip-text">${opts.tooltip}</span></span>`;
    div.innerHTML = `
      <div class="pa-control-label">${opts.label}${tip} <span class="pa-val">${opts.value}</span></div>
      <input type="range" min="${opts.min}" max="${opts.max}" step="${opts.step}" value="${opts.value}">
    `;
    const input = div.querySelector('input');
    const valSpan = div.querySelector('.pa-val');
    input.addEventListener('input', () => {
      const num = parseFloat(input.value);
      valSpan.textContent = num;
      opts.onChange(num);
    });
    return div;
  }

  function buildLenisControls() {
    const wrap = document.createElement('div');
    wrap.className = 'pa-controls';
    const { lenis } = window;
    const currentLerp = lenis?.options?.lerp ?? LENIS_DEFAULT_LERP;
    const currentWheel = lenis?.options?.wheelMultiplier ?? LENIS_DEFAULT_WHEEL;

    wrap.appendChild(buildLenisRange({
      label: 'Lerp',
      value: currentLerp,
      min: 0.02,
      max: 0.5,
      step: 0.01,
      tooltip: 'Scroll smoothing curve. Lower = smoother but laggy; higher = snappier but less smooth. Default 0.08.',
      onChange: (v) => {
        if (!window.lenis) return;
        window.lenisBaseLerp = v;
        window.lenis.options.lerp = v;
      },
    }));

    wrap.appendChild(buildLenisRange({
      label: 'Wheel multiplier',
      value: currentWheel,
      min: 0.3,
      max: 3,
      step: 0.1,
      tooltip: 'Scales how far each mouse-wheel tick scrolls (wheel only — not trackpad or touch). Lower = finer scrubbing of scroll animations; higher = faster page traversal. Default 1.',
      onChange: (v) => {
        if (!window.lenis) return;
        window.lenis.options.wheelMultiplier = v;
      },
    }));

    const resetBtn = document.createElement('button');
    resetBtn.className = 'pa-reset-btn';
    resetBtn.textContent = 'Reset Lenis';
    resetBtn.addEventListener('click', () => {
      if (!window.lenis) return;
      window.lenisBaseLerp = LENIS_DEFAULT_LERP;
      window.lenis.options.lerp = LENIS_DEFAULT_LERP;
      window.lenis.options.wheelMultiplier = LENIS_DEFAULT_WHEEL;
      // eslint-disable-next-line no-use-before-define
      renderTree();
    });
    wrap.appendChild(resetBtn);

    return wrap;
  }

  function buildLenisSection() {
    const group = document.createElement('div');
    group.className = 'pa-section-group';
    const isCollapsed = collapsedSections.has(LENIS_ID);

    const sLabel = document.createElement('div');
    sLabel.className = `pa-section-label${isCollapsed ? ' pa-collapsed' : ''}`;
    sLabel.textContent = 'Lenis';
    sLabel.addEventListener('click', () => {
      if (collapsedSections.has(LENIS_ID)) collapsedSections.delete(LENIS_ID);
      else collapsedSections.add(LENIS_ID);
      // eslint-disable-next-line no-use-before-define
      renderTree();
    });
    group.appendChild(sLabel);

    if (!isCollapsed) group.appendChild(buildLenisControls());
    return group;
  }

  function renderTree() {
    const treeEl = panel.querySelector('#pa-tree');
    treeEl.innerHTML = '';

    treeEl.appendChild(buildLenisSection());

    tree.forEach((section) => {
      const group = document.createElement('div');
      group.className = 'pa-section-group';

      const isCollapsed = collapsedSections.has(section.id);

      const sLabel = document.createElement('div');
      sLabel.className = `pa-section-label${isCollapsed ? ' pa-collapsed' : ''}`;
      const counts = new Map();
      section.blocks.forEach((b) => counts.set(b.label, (counts.get(b.label) || 0) + 1));
      const summary = [...counts.entries()]
        .map(([name, n]) => (n > 1 ? `${name} ×${n}` : name))
        .join(', ');
      sLabel.textContent = section.label;
      if (summary) {
        const span = document.createElement('span');
        span.className = 'pa-section-summary';
        span.textContent = summary;
        sLabel.appendChild(span);
      }
      sLabel.addEventListener('click', () => {
        if (collapsedSections.has(section.id)) collapsedSections.delete(section.id);
        else collapsedSections.add(section.id);
        renderTree();
      });
      group.appendChild(sLabel);

      if (!isCollapsed) {
        const allItems = [{ id: section.id, label: 'Section block', el: section.el }, ...section.blocks];

        allItems.forEach((item) => {
          const row = document.createElement('div');
          const isSelected = item.id === selectedId;
          const hasAnim = !!stateMap[item.id];
          const fromBlock = blockSourceIds.has(item.id);
          const hasStagger = item.id === section.id && !!staggerMap[section.id]?.['--pa-stagger-drift'];
          row.className = `pa-item${isSelected ? ' pa-selected' : ''}${hasAnim ? ' pa-has-anim' : ''}${fromBlock ? ' pa-from-block' : ''}${hasStagger ? ' pa-has-stagger' : ''}`;
          row.innerHTML = `<span class="pa-dot"></span><span>${item.label}</span>`;
          // eslint-disable-next-line no-use-before-define
          row.addEventListener('click', () => selectItem(item));
          row.addEventListener('mouseenter', () => {
            if (item.id !== selectedId) {
              item.el.classList.add('pa-highlight');
              item.el.setAttribute('data-pa-label', item.label);
              // Auto-scroll page to keep hovered element in view — toggled via #pa-follow-btn.
              if (localStorage.getItem('pa-follow-hover') !== 'off') {
                item.el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
              }
            }
          });
          row.addEventListener('mouseleave', () => {
            if (item.id !== selectedId) {
              item.el.classList.remove('pa-highlight');
              item.el.removeAttribute('data-pa-label');
            }
          });
          group.appendChild(row);

          if (isSelected) {
            group.appendChild(buildControls(item));
            if (item.id === section.id && section.blocks.length > 1) {
              group.appendChild(buildStaggerControls(section));
            }
          }
        });
      }

      treeEl.appendChild(group);
    });
    syncCollapseBtn();
  }

  function selectItem(item) {
    if (selectedEl) {
      selectedEl.classList.remove('pa-highlight');
      selectedEl.removeAttribute('data-pa-label');
    }
    if (selectedId === item.id) {
      selectedId = null;
      selectedEl = null;
      renderTree();
      return;
    }
    selectedId = item.id;
    selectedEl = item.el;
    selectedEl.classList.add('pa-highlight');
    selectedEl.setAttribute('data-pa-label', item.label);
    selectedEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    renderTree();
  }

  renderTree();
  return panel;
}
