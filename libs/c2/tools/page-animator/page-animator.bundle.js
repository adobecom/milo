// Page Animator — self-contained bundle (no external imports)
// Source: libs/c2/tools/page-animator/
(function init() {
  if (document.getElementById('page-animator-panel')) return;

  // ─── Inlined: page-animator.css ────────────────────────────────────────────
  const CSS = `
#page-animator-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 320px;
  height: 100vh;
  background: #1e1e1e;
  color: #e0e0e0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 13px;
  z-index: 999999;
  display: flex;
  flex-direction: column;
  box-shadow: -4px 0 20px rgb(0 0 0 / 50%);
  transform: translateX(100%);
  transition: transform 0.2s ease;
}

#page-animator-panel.pa-open {
  transform: translateX(0);
}

#page-animator-tab {
  position: fixed;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  background: #0d66d0;
  color: white;
  padding: 10px 5px;
  writing-mode: vertical-rl;
  cursor: pointer;
  z-index: 999998;
  border-radius: 4px 0 0 4px;
  font-size: 12px;
  font-family: -apple-system, sans-serif;
  user-select: none;
  transition: right 0.2s ease;
}

#page-animator-panel.pa-open + #page-animator-tab {
  right: 320px;
}

.pa-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #0d66d0;
  font-weight: 600;
  font-size: 14px;
  flex-shrink: 0;
  gap: 8px;
}

.pa-header-actions {
  display: flex;
  gap: 6px;
}

.pa-btn {
  background: rgb(255 255 255 / 20%);
  border: none;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 11px;
  white-space: nowrap;
}

.pa-btn:hover {
  background: rgb(255 255 255 / 35%);
}

.pa-tree {
  overflow-y: auto;
  overscroll-behavior: contain;
  flex: 1;
  padding: 8px 0;
}

.pa-section-group {
  margin-bottom: 4px;
}

.pa-section-label {
  padding: 8px 16px;
  font-weight: 600;
  color: #888;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.pa-item {
  padding: 6px 16px 6px 28px;
  cursor: pointer;
  border-radius: 4px;
  margin: 1px 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.pa-item:hover {
  background: #2a2a2a;
}

.pa-item.pa-selected {
  background: #1e3a5f;
}

.pa-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #444;
  flex-shrink: 0;
}

.pa-item.pa-has-anim .pa-dot {
  background: #0d66d0;
}

.pa-controls {
  padding: 12px 16px;
  border-top: 1px solid #2a2a2a;
  background: #252525;
}

.pa-control {
  margin-bottom: 10px;
}

.pa-control-label {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
  color: #999;
  font-size: 11px;
}

.pa-control-label span {
  color: #e0e0e0;
}

.pa-control input[type='range'] {
  width: 100%;
  accent-color: #0d66d0;
  cursor: pointer;
}

.pa-control select {
  width: 100%;
  background: #333;
  border: 1px solid #444;
  color: #e0e0e0;
  padding: 5px 6px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
}

.pa-reset-btn {
  width: 100%;
  margin-top: 4px;
  background: #333;
  border: 1px solid #444;
  color: #e0e0e0;
  padding: 6px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.pa-reset-btn:hover {
  background: #3a3a3a;
}

.pa-highlight {
  outline: 2px solid #0d66d0 !important;
  outline-offset: 3px !important;
  scroll-margin: 20px;
}
`;

  // ─── Inlined: controls.js ──────────────────────────────────────────────────
  const CONTROLS = [
    { label: 'Opacity from', cssVar: '--pa-opacity-from', type: 'range', min: 0, max: 1, step: 0.01, default: 1, unit: '' },
    { label: 'Translate Y', cssVar: '--pa-translate-y', type: 'range', min: -200, max: 200, step: 1, default: 0, unit: 'px' },
    { label: 'Translate X', cssVar: '--pa-translate-x', type: 'range', min: -200, max: 200, step: 1, default: 0, unit: 'px' },
    { label: 'Scale from', cssVar: '--pa-scale', type: 'range', min: 0, max: 2, step: 0.01, default: 1, unit: '' },
    { label: 'Blur', cssVar: '--pa-blur', type: 'range', min: 0, max: 20, step: 0.5, default: 0, unit: 'px' },
    { label: 'Easing', cssVar: '--pa-easing', type: 'select', options: ['ease', 'ease-in-out', 'cubic-bezier(0.42,0,0,1)', 'linear'], default: 'cubic-bezier(0.42,0,0,1)', unit: '', emitProp: false },
    { label: 'Range start', cssVar: 'range-start', type: 'select', options: ['entry 0%', 'entry 25%', 'entry 50%'], default: 'entry 0%', unit: '' },
    { label: 'Range end', cssVar: 'range-end', type: 'select', options: ['entry 75%', 'entry 100%', 'cover 50%'], default: 'entry 100%', unit: '' },
    { label: 'Opacity start %', cssVar: 'timing-opacity-start', type: 'range', min: 0, max: 100, step: 1, default: 0, unit: '%', commitOnInput: true },
    { label: 'Opacity end %', cssVar: 'timing-opacity-end', type: 'range', min: 0, max: 100, step: 1, default: 100, unit: '%', commitOnInput: true },
    { label: 'Transform start %', cssVar: 'timing-transform-start', type: 'range', min: 0, max: 100, step: 1, default: 0, unit: '%', commitOnInput: true },
    { label: 'Transform end %', cssVar: 'timing-transform-end', type: 'range', min: 0, max: 100, step: 1, default: 100, unit: '%', commitOnInput: true },
    { label: 'Blur start %', cssVar: 'timing-blur-start', type: 'range', min: 0, max: 100, step: 1, default: 0, unit: '%', commitOnInput: true },
    { label: 'Blur end %', cssVar: 'timing-blur-end', type: 'range', min: 0, max: 100, step: 1, default: 100, unit: '%', commitOnInput: true },
  ];

  const ANIM_PROPS = [
    {
      cssProperty: 'opacity',
      timingStart: 'timing-opacity-start',
      timingEnd: 'timing-opacity-end',
      fromValue: () => 'var(--pa-opacity-from, 1)',
      toValue: () => '1',
    },
    {
      cssProperty: 'transform',
      timingStart: 'timing-transform-start',
      timingEnd: 'timing-transform-end',
      fromValue: () => 'translate3d(var(--pa-translate-x, 0px), var(--pa-translate-y, 0px), 0) scale(var(--pa-scale, 1))',
      toValue: () => 'translate3d(0, 0, 0) scale(1)',
    },
    {
      cssProperty: 'filter',
      timingStart: 'timing-blur-start',
      timingEnd: 'timing-blur-end',
      fromValue: () => 'blur(var(--pa-blur, 0px))',
      toValue: () => 'blur(0)',
    },
  ];

  function generateAnimId(sectionIdx, blockIdx = null) {
    return blockIdx === null
      ? `section-${sectionIdx}`
      : `section-${sectionIdx}-block-${blockIdx}`;
  }

  function getDefaultState() {
    return Object.fromEntries(CONTROLS.map((c) => [c.cssVar, c.default]));
  }

  function buildCssRule(animId, state) {
    const rangeStart = state['range-start'] ?? 'entry 0%';
    const rangeEnd = state['range-end'] ?? 'entry 100%';
    const easing = state['--pa-easing'] ?? 'cubic-bezier(0.42,0,0,1)';

    const customProps = CONTROLS
      .filter((c) => c.cssVar.startsWith('--') && c.emitProp !== false)
      .map((c) => `  ${c.cssVar}: ${state[c.cssVar] ?? c.default}${c.unit};`)
      .join('\n');

    const stopSet = new Set([0, 100]);
    ANIM_PROPS.forEach(({ timingStart, timingEnd }) => {
      stopSet.add(state[timingStart] ?? 0);
      stopSet.add(state[timingEnd] ?? 100);
    });
    const stops = [...stopSet].sort((a, b) => a - b);

    const keyframeBlocks = stops.map((pct) => {
      const declarations = [];
      ANIM_PROPS.forEach(({ cssProperty, timingStart, timingEnd, fromValue, toValue }) => {
        const s = state[timingStart] ?? 0;
        const e = state[timingEnd] ?? 100;
        if (pct === 0 || pct === s) {
          declarations.push(`    ${cssProperty}: ${fromValue()};`);
        } else if (pct === e || pct === 100) {
          declarations.push(`    ${cssProperty}: ${toValue()};`);
        }
      });
      if (!declarations.length) return null;
      return `  ${pct}% {\n${declarations.join('\n')}\n  }`;
    }).filter(Boolean);

    const keyframes = `@keyframes pa-anim-${animId} {\n${keyframeBlocks.join('\n')}\n}`;
    const rule = `[data-anim-id="${animId}"] {\n  animation: pa-anim-${animId} ${easing} both;\n  animation-timeline: view();\n  animation-range: ${rangeStart} ${rangeEnd};\n${customProps}\n}`;
    return `${keyframes}\n${rule}`;
  }

  function serializeState(tree, stateMap) {
    const animations = [];
    tree.forEach((section) => {
      if (stateMap[section.id]) {
        const sel = `.section:nth-child(${section.domIndex + 1})`;
        animations.push({ id: section.id, selector: sel, properties: { ...stateMap[section.id] } });
      }
      section.blocks.forEach((block) => {
        if (stateMap[block.id]) {
          const sel = `.section:nth-child(${section.domIndex + 1}) .${block.el.classList[0]}`;
          animations.push({ id: block.id, selector: sel, properties: { ...stateMap[block.id] } });
        }
      });
    });
    return { version: 1, animations };
  }

  function deserializeState(json) {
    return Object.fromEntries(json.animations.map((a) => [a.id, a.properties]));
  }

  // ─── Inlined: scanner.js ───────────────────────────────────────────────────
  const SKIP_CLASSES = new Set(['section-metadata', 'visually-hidden']);

  function scanPage() {
    return [...document.querySelectorAll('.section')].map((section, sIdx) => {
      const sId = generateAnimId(sIdx);
      section.dataset.animId = sId;

      const blocks = [...section.children].filter(
        (el) => el.classList.length > 0 && ![...el.classList].some((c) => SKIP_CLASSES.has(c)),
      );

      return {
        id: sId,
        label: `Section ${sIdx + 1}`,
        el: section,
        domIndex: sIdx,
        blocks: blocks.map((block, bIdx) => {
          const bId = generateAnimId(sIdx, bIdx);
          block.dataset.animId = bId;
          return { id: bId, label: block.classList[0], el: block };
        }),
      };
    });
  }

  // ─── Inlined: style-manager.js ─────────────────────────────────────────────
  class StyleManager {
    constructor() {
      this.el = document.createElement('style');
      this.el.id = 'page-animator-styles';
      document.head.appendChild(this.el);
      this.rules = new Map();
      this._flush();
    }

    _flush() {
      this.el.textContent = [...this.rules.values()].join('\n');
    }

    updateRule(animId, state) {
      this.rules.set(animId, buildCssRule(animId, state));
      this._flush();
    }

    removeRule(animId) {
      this.rules.delete(animId);
      this._flush();
    }
  }

  // ─── Inlined: panel.js ─────────────────────────────────────────────────────
  const STORAGE_KEY = `pa:${window.location.pathname}`;

  function loadStoredState() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    } catch {
      return null;
    }
  }

  function saveState(stateMap) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateMap));
  }

  function buildPanel(tree, stateMap, callbacks) {
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

  // ─── Inlined: page-animator.js (entry point) ───────────────────────────────
  const styleEl = document.createElement('style');
  styleEl.textContent = CSS;
  document.head.appendChild(styleEl);

  const styleManager = new StyleManager();
  const tree = scanPage();
  const stateMap = loadStoredState() || {};

  Object.entries(stateMap).forEach(([animId, state]) => {
    styleManager.updateRule(animId, state);
  });

  const callbacks = {
    onLiveUpdate(el, cssVar, value) {
      el.style.setProperty(cssVar, value);
    },
    onCommitUpdate(animId, state) {
      styleManager.updateRule(animId, state);
      CONTROLS.filter((c) => c.cssVar.startsWith('--')).forEach((c) => {
        document.querySelector(`[data-anim-id="${animId}"]`)?.style.removeProperty(c.cssVar);
      });
    },
    onReset(el, animId) {
      el.classList.remove('pa-highlight');
      styleManager.removeRule(animId);
      CONTROLS.filter((c) => c.cssVar.startsWith('--')).forEach((c) => {
        el.style.removeProperty(c.cssVar);
      });
    },
  };

  let currentPanel = buildPanel(tree, stateMap, callbacks);

  let gnavHeight = 0;
  const topEl = document.elementFromPoint(window.innerWidth - 160, 10);
  if (topEl) {
    let node = topEl;
    while (node && node !== document.documentElement) {
      if (getComputedStyle(node).position === 'fixed') {
        const bottom = Math.round(node.getBoundingClientRect().bottom);
        if (bottom > 0 && bottom < 300) gnavHeight = bottom;
        break;
      }
      node = node.parentElement;
    }
  }
  currentPanel.style.top = `${gnavHeight}px`;
  currentPanel.style.height = `calc(100vh - ${gnavHeight}px)`;

  currentPanel.addEventListener('wheel', (e) => {
    const treeEl = currentPanel.querySelector('#pa-tree');
    if (!treeEl) return;
    e.preventDefault();
    e.stopPropagation();
    treeEl.scrollTop += e.deltaY;
  }, { passive: false });

  document.body.appendChild(currentPanel);

  const tab = document.createElement('div');
  tab.id = 'page-animator-tab';
  tab.textContent = 'Animator';
  currentPanel.insertAdjacentElement('afterend', tab);

  function wireListeners(panelEl) {
    tab.onclick = () => panelEl.classList.toggle('pa-open');

    panelEl.querySelector('#pa-download-btn').addEventListener('click', () => {
      const json = serializeState(tree, stateMap);
      const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'page-animations.json';
      a.click();
      URL.revokeObjectURL(a.href);
    });

    panelEl.querySelector('#pa-import-btn').addEventListener('click', () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.addEventListener('change', async () => {
        try {
          const text = await input.files[0].text();
          const json = JSON.parse(text);
          const imported = deserializeState(json);
          Object.assign(stateMap, imported);
          Object.entries(imported).forEach(([id, state]) => styleManager.updateRule(id, state));
          saveState(stateMap);
          const fresh = buildPanel(tree, stateMap, callbacks);
          panelEl.replaceWith(fresh);
          fresh.classList.add('pa-open');
          currentPanel = fresh;
          wireListeners(fresh);
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error('[page-animator] Import failed:', err);
          alert(`Import failed: ${err.message}`);
        }
      });
      input.click();
    });

    panelEl.querySelector('#pa-da-btn').addEventListener('click', async () => {
      const token = window.adobeIMS?.getAccessToken()?.token;

      if (!token) {
        alert('Sign in to Adobe first, then try again.');
        return;
      }

      const json = serializeState(tree, stateMap);
      const daPath = `${window.location.pathname}.animations.json`;
      let res;
      try {
        res = await fetch(`https://admin.da.live/source${daPath}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(json, null, 2),
        });
      } catch (err) {
        alert(`DA save failed: ${err.message}`);
        return;
      }

      if (!res.ok) {
        alert(`DA save failed: ${res.status} ${res.statusText}`);
        return;
      }

      window.open(`https://da.live${daPath}`, '_blank');
    });
  }

  wireListeners(currentPanel);
}());
