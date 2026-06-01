const milolibs = new URLSearchParams(window.location.search).get('milolibs');
const { hostname: HOST, port: PORT } = window.location;

// Set window.forgeSidekick.parallel = true in the console to show tools side by side.
window.forgeSidekick ??= { parallel: false };

const style = document.createElement('style');
style.textContent = '.forge-hidden { display: none !important; }';
document.head.appendChild(style);

function miloSrc(path) {
  if (milolibs === 'local' || (HOST === 'localhost' && PORT === '6456')) {
    return `http://localhost:6456${path}`;
  }
  if (HOST === 'localhost' && PORT === '3000') {
    return `http://localhost:3000${path}`;
  }
  if (milolibs && milolibs !== 'local') {
    const tld = HOST.includes('.aem.page') ? 'aem.page' : 'aem.live';
    return `https://${milolibs}--milo--adobecom.${tld}${path}`;
  }
  return `https://main--milo--adobecom.aem.live${path}`;
}

// ownedEls: null = not yet loaded, array = loaded (tracked body children)
const TOOLS = {
  'forge-adjustments': { ownedEls: null },
  'forge-annotations': { ownedEls: null },
  'forge-animator': { ownedEls: null },
};

// Animator owns elements that aren't tracked by the MutationObserver path below
// (its loader special-cases ownedEls = []). Toggle forge-hidden on its known IDs
// directly so its toolbar disappears when another tool is active — keeps the
// bottom-right corner uncluttered when only one tool should be visible.
const ANIMATOR_ELEMENT_IDS = ['page-animator-panel', 'page-animator-toolbar'];

function hideForge(id) {
  if (id === 'forge-animator') {
    const panel = document.getElementById('page-animator-panel');
    panel?.classList.remove('pa-open');
    ANIMATOR_ELEMENT_IDS.forEach((elId) => document.getElementById(elId)?.classList.add('forge-hidden'));
    return;
  }
  TOOLS[id].ownedEls?.forEach((el) => el.classList.add('forge-hidden'));
}

function showForge(id) {
  if (id === 'forge-animator') {
    ANIMATOR_ELEMENT_IDS.forEach((elId) => document.getElementById(elId)?.classList.remove('forge-hidden'));
    document.getElementById('page-animator-panel')?.classList.add('pa-open');
    return;
  }
  TOOLS[id].ownedEls?.forEach((el) => el.classList.remove('forge-hidden'));
}

function dismissOthers(activeId) {
  if (window.forgeSidekick.parallel) return;
  Object.keys(TOOLS).forEach((id) => {
    if (id !== activeId && TOOLS[id].ownedEls !== null) {
      hideForge(id);
      // eslint-disable-next-line no-console
      console.info(`[Forge] ${id} hidden. Set window.forgeSidekick.parallel = true to show tools side by side.`);
    }
  });
}

// Track every direct child added to document.body while the script loads,
// so we can hide/show the whole tool without knowing its internal DOM.
async function loadAndTrack(id, loadScript, src, type) {
  const tool = TOOLS[id];

  if (tool.ownedEls !== null) {
    showForge(id);
    return;
  }

  if (id === 'forge-animator') {
    // Animator manages visibility via pa-open; we don't need to track elements.
    tool.ownedEls = [];
    await loadScript(src, type);
    return;
  }

  tool.ownedEls = [];
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((m) => m.addedNodes.forEach((n) => {
      if (n.nodeType === Node.ELEMENT_NODE) tool.ownedEls.push(n);
    }));
  });
  observer.observe(document.body, { childList: true });

  await loadScript(src, type);
  // One rAF gives async/React tools a tick to finish rendering into the body.
  await new Promise(requestAnimationFrame);
  observer.disconnect();
}

// Dismiss others when the animator toolbar button is clicked to expand the panel.
// Delegated from document so it works regardless of when the button is added.
document.addEventListener('click', (e) => {
  if (!e.target.closest('#pa-toolbar-btn')) return;
  const panel = document.getElementById('page-animator-panel');
  if (panel && !panel.classList.contains('pa-open')) dismissOthers('forge-animator');
}, { capture: true });

export default async function handleForge(type, { loadScript }) {
  if (type === 'custom:forge-adjustments') {
    dismissOthers('forge-adjustments');
    await loadAndTrack('forge-adjustments', loadScript, window.forgeSources?.adjustments || 'http://localhost:3001/overlay.js');
  } else if (type === 'custom:forge-annotations') {
    dismissOthers('forge-annotations');
    await loadAndTrack('forge-annotations', loadScript, window.forgeSources?.annotations || 'https://page-commenter.jingleh12345.workers.dev/page-commenter.js');
  } else if (type === 'custom:forge-animator') {
    dismissOthers('forge-animator');
    await loadAndTrack('forge-animator', loadScript, window.forgeSources?.animator || miloSrc('/libs/c2/tools/page-animator/page-animator.js'), 'module');
  } else if (type === 'custom:forge-publish') {
    loadScript(window.forgeSources?.publish || 'http://localhost:3001/forge-publish.js');
  }
}
