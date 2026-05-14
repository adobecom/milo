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
      <span>Page Animator</span>
      <div class="pa-header-actions">
        <button class="pa-btn" id="pa-import-btn">Import</button>
        <button class="pa-btn" id="pa-download-btn">&#8595; JSON</button>
        <button class="pa-btn" id="pa-help-btn">Instructions</button>
      </div>
    </div>
    <div class="pa-instructions" id="pa-instructions" hidden>
      <ul>
        <li>Click a section label to collapse or expand it.</li>
        <li>Click any item in the tree to open its controls. Click again to close. This will also scroll the page to the item and highlight it on the page.</li>
        <li>Adjust sliders and dropdowns to configure the animation. Scroll the page near the item you are editing to see the animation work in real time as you scroll.</li>
        <li>Click the <strong>json</strong> button to save a copy of the current animation panel to you local machine. This can be shared with others to share progress.</li>
        <li>Click the <strong>import</strong> button to load a saved copy of the animation panel from your local machine. Navigate to where you saved "page-animations.json". You can use this to collaborate with others or to start from a saved state. This will overwrite the current animation panel.</li>
        <li>Click <strong>Reset animation</strong> to remove an animation from an element.</li>
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

  panel.querySelector('#pa-help-btn').addEventListener('click', () => {
    const instructions = panel.querySelector('#pa-instructions');
    instructions.hidden = !instructions.hidden;
  });

  let selectedId = null;
  let selectedEl = null;
  const collapsedSections = new Set();

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
        const tip = ctrl.tooltip ? `<span class="pa-tooltip" aria-label="${ctrl.tooltip}">ℹ︎<span class="pa-tooltip-text">${ctrl.tooltip}</span></span>` : '';
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
        const tip = ctrl.tooltip ? `<span class="pa-tooltip" aria-label="${ctrl.tooltip}">ℹ︎<span class="pa-tooltip-text">${ctrl.tooltip}</span></span>` : '';
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

  function renderTree() {
    const treeEl = panel.querySelector('#pa-tree');
    treeEl.innerHTML = '';

    tree.forEach((section) => {
      const group = document.createElement('div');
      group.className = 'pa-section-group';

      const isCollapsed = collapsedSections.has(section.id);

      const sLabel = document.createElement('div');
      sLabel.className = `pa-section-label${isCollapsed ? ' pa-collapsed' : ''}`;
      sLabel.textContent = section.label;
      sLabel.addEventListener('click', () => {
        if (collapsedSections.has(section.id)) collapsedSections.delete(section.id);
        else collapsedSections.add(section.id);
        renderTree();
      });
      group.appendChild(sLabel);

      if (!isCollapsed) {
        const allItems = [{ id: section.id, label: 'Section itself', el: section.el }, ...section.blocks];

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
  }

  function selectItem(item) {
    if (selectedEl) selectedEl.classList.remove('pa-highlight');
    if (selectedId === item.id) {
      selectedId = null;
      selectedEl = null;
      renderTree();
      return;
    }
    selectedId = item.id;
    selectedEl = item.el;
    selectedEl.classList.add('pa-highlight');
    selectedEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    renderTree();
  }

  renderTree();
  return panel;
}
