import { CONTROLS, getDefaultState } from './controls.js';

const STORAGE_KEY = `pa:${window.location.pathname}`;

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

export function buildPanel(tree, stateMap, callbacks) {
  const { onLiveUpdate, onCommitUpdate, onReset } = callbacks;

  const panel = document.createElement('div');
  panel.id = 'page-animator-panel';
  panel.innerHTML = `
    <div class="pa-header">
      <span>Page Animator</span>
      <div class="pa-header-actions">
        <button class="pa-btn" id="pa-import-btn">Import</button>
        <button class="pa-btn" id="pa-download-btn">&#8595; JSON</button>
        <button class="pa-btn" id="pa-da-btn">Save to DA</button>
      </div>
    </div>
    <div class="pa-tree" id="pa-tree"></div>
  `;

  let selectedId = null;
  let selectedEl = null;

  function selectItem(item) {
    if (selectedEl) selectedEl.classList.remove('pa-highlight');
    selectedId = item.id;
    selectedEl = item.el;
    selectedEl.classList.add('pa-highlight');
    selectedEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    renderTree();
  }

  function renderTree() {
    const treeEl = panel.querySelector('#pa-tree');
    treeEl.innerHTML = '';

    tree.forEach((section) => {
      const group = document.createElement('div');
      group.className = 'pa-section-group';

      const sLabel = document.createElement('div');
      sLabel.className = 'pa-section-label';
      sLabel.textContent = section.label;
      group.appendChild(sLabel);

      const allItems = [{ id: section.id, label: 'Section itself', el: section.el }, ...section.blocks];

      allItems.forEach((item) => {
        const row = document.createElement('div');
        const isSelected = item.id === selectedId;
        const hasAnim = !!stateMap[item.id];
        row.className = `pa-item${isSelected ? ' pa-selected' : ''}${hasAnim ? ' pa-has-anim' : ''}`;
        row.innerHTML = `<span class="pa-dot"></span><span>${item.label}</span>`;
        row.addEventListener('click', () => selectItem(item));
        group.appendChild(row);

        if (isSelected) {
          group.appendChild(buildControls(item));
        }
      });

      treeEl.appendChild(group);
    });
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
        div.innerHTML = `
          <div class="pa-control-label">${ctrl.label} <span>${val}${ctrl.unit}</span></div>
          <input type="range" min="${ctrl.min}" max="${ctrl.max}" step="${ctrl.step}" value="${val}" data-var="${ctrl.cssVar}" data-unit="${ctrl.unit}">
        `;

        const input = div.querySelector('input');
        const valSpan = div.querySelector('span');

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
        div.innerHTML = `<div class="pa-control-label">${ctrl.label}</div><select>${opts}</select>`;
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

    const resetBtn = document.createElement('button');
    resetBtn.className = 'pa-reset-btn';
    resetBtn.textContent = 'Reset animation';
    resetBtn.addEventListener('click', () => {
      delete stateMap[item.id];
      onReset(item.el, item.id);
      saveState(stateMap);
      renderTree();
    });
    wrap.appendChild(resetBtn);

    return wrap;
  }

  renderTree();
  return panel;
}
