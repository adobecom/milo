import { scanPage, readBlockAnimations } from './scanner.js';
import StyleManager from './style-manager.js';
import { buildPanel, loadStoredState, saveState, loadStaggerState, saveStaggerState } from './panel.js';
import { serializeState, deserializeState, CONTROLS, buildStaggerCssRules } from './controls.js';

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

  // Restore persisted animations
  Object.entries(stateMap).forEach(([animId, state]) => {
    styleManager.updateRule(animId, state);
  });

  // Restore persisted stagger animations
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

  // Check what fixed element is covering the top-right corner (where our panel header will be).
  // Using elementFromPoint before the panel is injected gives us the exact gnav element.
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

  // Route wheel events explicitly to the tree — prevents page scroll from stealing focus
  currentPanel.addEventListener('wheel', (e) => {
    const treeEl = currentPanel.querySelector('#pa-tree');
    if (!treeEl) return;
    e.preventDefault();
    e.stopPropagation();
    treeEl.scrollTop += e.deltaY;
  }, { passive: false });

  document.body.appendChild(currentPanel);
  currentPanel.classList.add('pa-open');

  const tab = document.createElement('div');
  tab.id = 'page-animator-tab';
  tab.textContent = 'Animator';
  currentPanel.insertAdjacentElement('afterend', tab);

  function wireListeners(panelEl) {
    tab.onclick = () => panelEl.classList.toggle('pa-open');

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
          fresh.classList.add('pa-open');
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
