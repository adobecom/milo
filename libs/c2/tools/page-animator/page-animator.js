import { scanPage } from './scanner.js';
import StyleManager from './style-manager.js';
import { buildPanel, loadStoredState, saveState } from './panel.js';
import { serializeState, deserializeState, CONTROLS } from './controls.js';

(function init() {
  if (document.getElementById('page-animator-panel')) return;

  // Inject stylesheet
  const cssUrl = new URL('./page-animator.css', import.meta.url).href;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = cssUrl;
  document.head.appendChild(link);

  const styleManager = new StyleManager();
  const tree = scanPage();
  const stateMap = loadStoredState() || {};

  // Restore persisted animations
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
    const tree = currentPanel.querySelector('#pa-tree');
    if (!tree) return;
    e.preventDefault();
    e.stopPropagation();
    tree.scrollTop += e.deltaY;
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
})();
