import { scanPage, readBlockAnimations } from './scanner.js';
import StyleManager from './style-manager.js';
import { buildPanel, loadStoredState, saveState, loadStaggerState, saveStaggerState } from './panel.js';
import { serializeState, deserializeState, CONTROLS, buildStaggerCssRules } from './controls.js';

const MODE_KEY = `pa-panel-mode:${window.location.pathname}`;
const POS_KEY = `pa-panel-pos:${window.location.pathname}`;
const THEME_KEY = 'pc-theme';
const FOLLOW_KEY = 'pa-follow-hover';
const SNAP_ZONE = 60;

function applyTheme(theme) {
  document.documentElement.classList.toggle('pc-theme-dark', theme === 'dark');
}

function loadTheme() {
  return localStorage.getItem(THEME_KEY) || 'light';
}

function saveTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
}

function loadMode() {
  return localStorage.getItem(MODE_KEY) || 'right';
}

function saveMode(mode) {
  localStorage.setItem(MODE_KEY, mode);
}

function loadPos() {
  try {
    return JSON.parse(localStorage.getItem(POS_KEY) || 'null') || { x: 60, y: 60 };
  } catch {
    return { x: 60, y: 60 };
  }
}

function savePos(pos) {
  localStorage.setItem(POS_KEY, JSON.stringify(pos));
}

(function init() { // eslint-disable-line wrap-iife
  if (document.getElementById('page-animator-panel')) return;

  // Inject stylesheet
  const cssUrl = new URL('./page-animator.css', import.meta.url).href;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = cssUrl;
  document.head.appendChild(link);

  const styleManager = new StyleManager();
  const tree = scanPage();
  const blockStateMap = readBlockAnimations();
  const blockSourceIds = new Set(Object.keys(blockStateMap));
  const stateMap = { ...blockStateMap, ...(loadStoredState() || {}) };
  const staggerMap = loadStaggerState() || {};

  Object.entries(stateMap).forEach(([animId, state]) => {
    styleManager.updateRule(animId, state);
  });

  Object.entries(staggerMap).forEach(([sectionId, staggerState]) => {
    const section = tree.find((s) => s.id === sectionId);
    if (!section) return;
    const blockIds = section.blocks.map((b) => b.id);
    const staggerCss = buildStaggerCssRules(sectionId, blockIds, staggerState);
    styleManager.updateStaggerRule(sectionId, staggerCss);
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
      el.removeAttribute('data-pa-label');
      styleManager.removeRule(animId);
      CONTROLS.filter((c) => c.cssVar.startsWith('--')).forEach((c) => {
        el.style.removeProperty(c.cssVar);
      });
    },
    onStaggerUpdate(sectionId, blockIds, staggerState) {
      const css = buildStaggerCssRules(sectionId, blockIds, staggerState);
      styleManager.updateStaggerRule(sectionId, css);
      saveStaggerState(staggerMap);
    },
    onStaggerReset(sectionId) {
      styleManager.removeStaggerRule(sectionId);
    },
  };

  // eslint-disable-next-line max-len
  let currentPanel = buildPanel(tree, stateMap, callbacks, blockStateMap, blockSourceIds, staggerMap);
  document.body.appendChild(currentPanel);

  // Snap preview rectangle (shown while dragging near a screen edge)
  const snapPreview = document.createElement('div');
  snapPreview.id = 'page-animator-snap-preview';
  document.body.appendChild(snapPreview);

  // Bottom-right toolbar with the Animator toggle button
  const toolbar = document.createElement('div');
  toolbar.id = 'page-animator-toolbar';
  toolbar.innerHTML = '<button type="button" class="pa-toolbar-btn" id="pa-toolbar-btn">Animator</button>';
  document.body.appendChild(toolbar);
  const toolbarBtn = toolbar.querySelector('#pa-toolbar-btn');

  // Detect other tools' toolbar buttons in the bottom-right corner (annotations, etc.)
  // and shift our toolbar left of them via a CSS variable that combines with the
  // open/close offset rules above.
  const OWN_IDS = new Set(['page-animator-toolbar', 'page-animator-panel', 'page-animator-snap-preview']);

  function positionToolbar() {
    const gap = 8;
    let extra = 0;
    [...document.body.children].forEach((el) => {
      if (OWN_IDS.has(el.id)) return;
      const style = getComputedStyle(el);
      if (style.position !== 'fixed' || style.display === 'none' || style.visibility === 'hidden') return;
      const rect = el.getBoundingClientRect();
      // Only count small toolbar-sized elements anchored to bottom-right; ignore
      // full-height side panels (they stack via z-index and shouldn't push us).
      if (rect.width === 0 || rect.width > 200 || rect.height > 80) return;
      const inBottomRight = rect.bottom > window.innerHeight - 120
        && rect.right > window.innerWidth - 120;
      if (!inBottomRight) return;
      extra += rect.width + gap;
    });
    toolbar.style.setProperty('--pa-extra-offset', `${extra}px`);
  }

  positionToolbar();
  // Re-check whenever body's children change — other tools may load later
  const positionObserver = new MutationObserver(() => positionToolbar());
  positionObserver.observe(document.body, { childList: true });
  window.addEventListener('resize', positionToolbar);

  function applyMode(panelEl, mode, pos) {
    panelEl.classList.remove('pa-panel-left', 'pa-panel-floating');
    document.documentElement.classList.remove('pa-panel-left', 'pa-panel-floating');
    if (mode === 'left') {
      panelEl.classList.add('pa-panel-left');
      document.documentElement.classList.add('pa-panel-left');
    } else if (mode === 'floating') {
      panelEl.classList.add('pa-panel-floating');
      document.documentElement.classList.add('pa-panel-floating');
      panelEl.style.setProperty('--pa-float-x', `${pos.x}px`);
      panelEl.style.setProperty('--pa-float-y', `${pos.y}px`);
    }
  }

  function setPanelOpen(panelEl, open) {
    panelEl.classList.toggle('pa-open', open);
    document.documentElement.classList.toggle('pa-panel-open', open);
    toolbarBtn.classList.toggle('pa-toolbar-btn-active', open);
  }

  // Restore last-used mode + position + theme, then open the panel
  applyTheme(loadTheme());
  applyMode(currentPanel, loadMode(), loadPos());
  setPanelOpen(currentPanel, true);

  function syncThemeBtn(panelEl) {
    const btn = panelEl.querySelector('#pa-theme-btn');
    if (!btn) return;
    const isDark = document.documentElement.classList.contains('pc-theme-dark');
    btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true"><path d="M11.5 8.4A4.6 4.6 0 015.6 2.5a.4.4 0 00-.55-.46A5.6 5.6 0 1011.96 9a.4.4 0 00-.46-.6z"></path></svg>';
    btn.classList.toggle('pa-btn-active', isDark);
  }

  function syncFollowBtn(panelEl) {
    const btn = panelEl.querySelector('#pa-follow-btn');
    if (!btn) return;
    const on = localStorage.getItem(FOLLOW_KEY) !== 'off';
    btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 18 18" fill="currentColor" aria-hidden="true"><path d="M10.5,8a.5.5,0,0,0,.5-.5v-3a.5.5,0,0,0-.5-.5H5V1.8675A.3665.3665,0,0,0,4.63451,1.5h-.004a.359.359,0,0,0-.2565.108L.0945,5.508a.36751.36751,0,0,0,0,.492L4.374,10.392a.359.359,0,0,0,.2565.108A.3665.3665,0,0,0,5,10.13651V8Z"></path><path d="M17.9055,12,13.626,7.608a.359.359,0,0,0-.2565-.108A.3665.3665,0,0,0,13,7.86349V10H7.5a.5.5,0,0,0-.5.5v3a.5.5,0,0,0,.5.5H13v2.1325a.3665.3665,0,0,0,.36549.36751h.004a.359.359,0,0,0,.2565-.108l4.2795-3.9A.36751.36751,0,0,0,17.9055,12Z"></path></svg>';
    btn.classList.toggle('pa-btn-active', on);
  }

  function wireDrag(panelEl) {
    const header = panelEl.querySelector('.pa-header');
    if (!header) return;

    let dragging = false;
    let offsetX = 0;
    let offsetY = 0;
    let panelWidth = 0;
    let snapSide = null;

    header.addEventListener('pointerdown', (e) => {
      if (e.target.closest('button')) return;
      dragging = true;
      const rect = panelEl.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      panelWidth = rect.width;

      panelEl.classList.add('pa-panel-dragging');
      header.classList.add('pa-header-dragging');

      // If we're docked, jump into floating mode at the current visual position
      if (!panelEl.classList.contains('pa-panel-floating')) {
        panelEl.classList.remove('pa-panel-left');
        document.documentElement.classList.remove('pa-panel-left');
        panelEl.classList.add('pa-panel-floating');
        document.documentElement.classList.add('pa-panel-floating');
        panelEl.style.setProperty('--pa-float-x', `${rect.left}px`);
        panelEl.style.setProperty('--pa-float-y', `${rect.top}px`);
      }

      header.setPointerCapture(e.pointerId);
      e.preventDefault();
    });

    header.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const panelLeft = e.clientX - offsetX;
      const panelRight = panelLeft + panelWidth;
      panelEl.style.setProperty('--pa-float-x', `${panelLeft}px`);
      panelEl.style.setProperty('--pa-float-y', `${e.clientY - offsetY}px`);

      if (panelLeft < SNAP_ZONE) {
        snapSide = 'left';
        snapPreview.classList.add('pa-snap-visible', 'pa-snap-left');
        snapPreview.classList.remove('pa-snap-right');
      } else if (panelRight > window.innerWidth - SNAP_ZONE) {
        snapSide = 'right';
        snapPreview.classList.add('pa-snap-visible', 'pa-snap-right');
        snapPreview.classList.remove('pa-snap-left');
      } else {
        snapSide = null;
        snapPreview.classList.remove('pa-snap-visible', 'pa-snap-left', 'pa-snap-right');
      }
    });

    header.addEventListener('pointerup', (e) => {
      if (!dragging) return;
      dragging = false;
      panelEl.classList.remove('pa-panel-dragging');
      header.classList.remove('pa-header-dragging');
      header.releasePointerCapture(e.pointerId);
      snapPreview.classList.remove('pa-snap-visible', 'pa-snap-left', 'pa-snap-right');

      if (snapSide === 'left') {
        applyMode(panelEl, 'left', loadPos());
        saveMode('left');
      } else if (snapSide === 'right') {
        applyMode(panelEl, 'right', loadPos());
        saveMode('right');
      } else {
        const x = parseFloat(panelEl.style.getPropertyValue('--pa-float-x')) || 60;
        const y = parseFloat(panelEl.style.getPropertyValue('--pa-float-y')) || 60;
        saveMode('floating');
        savePos({ x, y });
      }
      snapSide = null;
    });
  }

  function wireListeners(panelEl) {
    toolbarBtn.onclick = () => setPanelOpen(panelEl, !panelEl.classList.contains('pa-open'));
    panelEl.querySelector('#pa-close-btn').addEventListener('click', () => setPanelOpen(panelEl, false));
    syncThemeBtn(panelEl);
    syncFollowBtn(panelEl);

    panelEl.querySelector('#pa-theme-btn').addEventListener('click', () => {
      const next = document.documentElement.classList.contains('pc-theme-dark') ? 'light' : 'dark';
      applyTheme(next);
      saveTheme(next);
      syncThemeBtn(panelEl);
    });

    panelEl.querySelector('#pa-follow-btn').addEventListener('click', () => {
      const next = localStorage.getItem(FOLLOW_KEY) === 'off' ? 'on' : 'off';
      localStorage.setItem(FOLLOW_KEY, next);
      syncFollowBtn(panelEl);
    });

    // Route wheel events explicitly to the tree — prevents page scroll from stealing focus
    panelEl.addEventListener('wheel', (e) => {
      const treeEl = panelEl.querySelector('#pa-tree');
      if (!treeEl) return;
      e.preventDefault();
      e.stopPropagation();
      treeEl.scrollTop += e.deltaY;
    }, { passive: false });

    wireDrag(panelEl);

    panelEl.querySelector('#pa-download-btn').addEventListener('click', () => {
      const json = serializeState(tree, stateMap, staggerMap);
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
          const { stateMap: importedState, staggerMap: importedStagger } = deserializeState(json);
          Object.assign(stateMap, importedState);
          Object.entries(importedState).forEach(([id, st]) => styleManager.updateRule(id, st));
          Object.assign(staggerMap, importedStagger);
          Object.entries(importedStagger).forEach(([sectionId, staggerState]) => {
            const section = tree.find((s) => s.id === sectionId);
            if (!section) return;
            const blockIds = section.blocks.map((b) => b.id);
            const css = buildStaggerCssRules(sectionId, blockIds, staggerState);
            styleManager.updateStaggerRule(sectionId, css);
          });
          saveState(stateMap);
          saveStaggerState(staggerMap);
          // eslint-disable-next-line max-len
          const fresh = buildPanel(tree, stateMap, callbacks, blockStateMap, blockSourceIds, staggerMap);
          panelEl.replaceWith(fresh);
          applyMode(fresh, loadMode(), loadPos());
          setPanelOpen(fresh, true);
          currentPanel = fresh;
          wireListeners(fresh);
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error('[page-animator] Import failed:', err);
          // eslint-disable-next-line no-alert
          alert(`Import failed: ${err.message}`);
        }
      });
      input.click();
    });
  }

  wireListeners(currentPanel);
})();
