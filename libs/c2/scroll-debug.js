const PROPERTIES = [
  {
    section: 'Lenis',
    key: 'lerp',
    urlKey: 'lerp',
    label: 'lerp',
    type: 'number',
    defaultValue: 0.06,
    inputAttrs: { step: '0.01', min: '0', max: '1' },
    apply: (val, ctx) => {
      ctx.lerpRef.value = val;
      if (ctx.lerpState.mode === 'base') ctx.lenis.options.lerp = val;
    },
  },
  {
    section: 'Lenis',
    key: 'wheelMultiplier',
    urlKey: 'wm',
    label: 'wheelMultiplier',
    type: 'number',
    defaultValue: 0.65,
    inputAttrs: { step: '0.05', min: '0', max: '2' },
    apply: (val, ctx) => {
      ctx.lenis.options.wheelMultiplier = val;
    },
  },
  {
    section: 'Parallax',
    key: 'easing',
    urlKey: 'pe',
    label: '--parallax-easing',
    type: 'text',
    defaultValue: 'cubic-bezier(0.42, 0, 0, 1)',
    cssTarget: ':root',
    cssVar: '--parallax-easing',
  },
  {
    section: 'Parallax',
    key: 'rangeStartName',
    urlKey: 'pss',
    label: 'range-start-name',
    type: 'select',
    options: ['entry', 'cover', 'exit'],
    defaultValue: 'entry',
    cssTarget: '[class*="parallax-"]',
    cssVar: '--parallax-range-start-name',
  },
  {
    section: 'Parallax',
    key: 'rangeStartLength',
    urlKey: 'psl',
    label: 'range-start-length (%)',
    type: 'number',
    defaultValue: 0,
    inputAttrs: { step: '5', min: '-100', max: '200' },
    cssTarget: '[class*="parallax-"]',
    cssVar: '--parallax-range-start-length',
    formatValue: (v) => `${v}%`,
  },
  {
    section: 'Parallax',
    key: 'rangeEndName',
    urlKey: 'pes',
    label: 'range-end-name',
    type: 'select',
    options: ['entry', 'cover', 'exit'],
    defaultValue: 'cover',
    cssTarget: '[class*="parallax-"]',
    cssVar: '--parallax-range-end-name',
  },
  {
    section: 'Parallax',
    key: 'rangeEndLength',
    urlKey: 'pel',
    label: 'range-end-length (%)',
    type: 'number',
    defaultValue: 80,
    inputAttrs: { step: '5', min: '-100', max: '200' },
    cssTarget: '[class*="parallax-"]',
    cssVar: '--parallax-range-end-length',
    formatValue: (v) => `${v}%`,
  },
  {
    section: 'Parallax',
    key: 'staggerRangeEndLength',
    urlKey: 'srel',
    label: 'stagger range-end-length (%)',
    type: 'number',
    defaultValue: 60,
    inputAttrs: { step: '5', min: '-100', max: '200' },
    cssTarget: '[class*="parallax-stagger-"]',
    cssVar: '--parallax-range-end-length',
    formatValue: (v) => `${v}%`,
  },
  {
    section: 'Parallax',
    key: 'staggerDrift',
    urlKey: 'psd',
    label: 'stagger-drift (px)',
    type: 'number',
    defaultValue: 48,
    inputAttrs: { step: '4', min: '0', max: '200' },
    cssTarget: '[class*="parallax-"]',
    cssVar: '--parallax-stagger-drift',
    formatValue: (v) => `${v}px`,
  },
  {
    section: 'Parallax',
    key: 'staggerCol1',
    urlKey: 'sc1',
    label: 'stagger-col-1',
    type: 'number',
    defaultValue: 1.5,
    inputAttrs: { step: '0.25', min: '0', max: '20' },
    cssTarget: '[class*="parallax-"]',
    cssVar: '--parallax-stagger-col-1',
  },
  {
    section: 'Parallax',
    key: 'staggerCol2',
    urlKey: 'sc2',
    label: 'stagger-col-2',
    type: 'number',
    defaultValue: 3.25,
    inputAttrs: { step: '0.25', min: '0', max: '20' },
    cssTarget: '[class*="parallax-"]',
    cssVar: '--parallax-stagger-col-2',
  },
  {
    section: 'Parallax',
    key: 'staggerCol3',
    urlKey: 'sc3',
    label: 'stagger-col-3',
    type: 'number',
    defaultValue: 5.5,
    inputAttrs: { step: '0.25', min: '0', max: '20' },
    cssTarget: '[class*="parallax-"]',
    cssVar: '--parallax-stagger-col-3',
  },
  {
    section: 'Parallax',
    key: 'staggerCol4',
    urlKey: 'sc4',
    label: 'stagger-col-4',
    type: 'number',
    defaultValue: 7.75,
    inputAttrs: { step: '0.25', min: '0', max: '20' },
    cssTarget: '[class*="parallax-"]',
    cssVar: '--parallax-stagger-col-4',
  },
  {
    section: 'Line-height reveal',
    key: 'textRevealMagnitude',
    urlKey: 'trm',
    label: 'magnitude (px)',
    type: 'number',
    defaultValue: 40,
    inputAttrs: { step: '5', min: '0', max: '200' },
    cssTarget: '.parallax-line-height .foreground .content > *',
    cssVar: '--text-reveal-magnitude',
    formatValue: (v) => `${v}px`,
  },
];

const cssOverrides = new Map();
let cssOverrideStyleEl;

function renderCssOverrides() {
  if (!cssOverrideStyleEl) {
    cssOverrideStyleEl = document.createElement('style');
    cssOverrideStyleEl.id = 'scroll-debug-overrides';
    document.head.append(cssOverrideStyleEl);
  }
  const css = Array.from(cssOverrides)
    .map(([sel, props]) => {
      const decls = Array.from(props).map(([k, v]) => `${k}: ${v};`).join(' ');
      return `${sel} { ${decls} }`;
    })
    .join('\n');
  cssOverrideStyleEl.textContent = css;
}

function applyCssOverride(target, prop, value) {
  if (!cssOverrides.has(target)) cssOverrides.set(target, new Map());
  cssOverrides.get(target).set(prop, value);
  renderCssOverrides();
}

function parseValue(str, prop) {
  if (prop.type === 'number') {
    const n = parseFloat(str);
    return Number.isNaN(n) ? prop.defaultValue : n;
  }
  return str;
}

function applyProperty(prop, value, ctx) {
  if (prop.apply) {
    prop.apply(value, ctx);
  } else if (prop.cssVar) {
    const formatted = prop.formatValue ? prop.formatValue(value) : value;
    applyCssOverride(prop.cssTarget, prop.cssVar, formatted);
  }
}

function styleInput(input, prop) {
  Object.assign(input.style, {
    width: prop.type === 'text' ? '180px' : '70px',
    background: '#111',
    color: '#0f0',
    border: '1px solid #333',
    padding: '2px 4px',
    font: 'inherit',
  });
}

function buildInput(prop, currentValue, onChange) {
  let input;
  if (prop.type === 'select') {
    input = document.createElement('select');
    prop.options.forEach((opt) => {
      const o = document.createElement('option');
      o.value = opt;
      o.textContent = opt;
      if (opt === currentValue) o.selected = true;
      input.append(o);
    });
  } else {
    input = document.createElement('input');
    input.type = prop.type;
    input.value = currentValue;
    if (prop.inputAttrs) {
      Object.entries(prop.inputAttrs).forEach(([k, v]) => input.setAttribute(k, v));
    }
  }
  styleInput(input, prop);
  input.addEventListener('input', () => onChange(parseValue(input.value, prop)));
  return input;
}

const STORAGE_KEY = 'scroll-debug-collapsed';

function buildPanel(state, ctx) {
  const panel = document.createElement('div');
  Object.assign(panel.style, {
    position: 'fixed',
    top: '12px',
    right: '12px',
    zIndex: '999999',
    padding: '10px 12px',
    background: 'rgb(0 0 0 / 90%)',
    color: '#0f0',
    font: '12px/1.5 ui-monospace, monospace',
    borderRadius: '6px',
    pointerEvents: 'auto',
    minWidth: '260px',
    maxHeight: 'calc(100vh - 24px)',
    overflowY: 'auto',
    userSelect: 'none',
  });

  const header = document.createElement('div');
  Object.assign(header.style, {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
  });
  header.innerHTML = `
    <span style="flex:1;display:grid;grid-template-columns:auto 1fr;column-gap:8px;">
      <span>delta:</span> <span data-status="delta">0</span>
      <span>mode:</span>  <span data-status="mode">base</span>
    </span>
    <span data-toggle style="font-weight:bold;">▼</span>
  `;
  panel.append(header);

  const body = document.createElement('div');
  panel.append(body);

  const toggleCell = header.querySelector('[data-toggle]');
  const setCollapsed = (collapsed) => {
    body.style.display = collapsed ? 'none' : 'block';
    toggleCell.textContent = collapsed ? '▶' : '▼';
    try { localStorage.setItem(STORAGE_KEY, collapsed ? '1' : '0'); } catch { /* noop */ }
  };
  header.addEventListener('click', () => {
    setCollapsed(body.style.display !== 'none');
  });
  let initialCollapsed = false;
  try { initialCollapsed = localStorage.getItem(STORAGE_KEY) === '1'; } catch { /* noop */ }
  setCollapsed(initialCollapsed);

  const sections = new Map();
  PROPERTIES.forEach((prop) => {
    let section = sections.get(prop.section);
    if (!section) {
      const hr = document.createElement('hr');
      Object.assign(hr.style, { border: 'none', borderTop: '1px solid #333', margin: '8px 0' });
      body.append(hr);
      section = document.createElement('div');
      const title = document.createElement('div');
      title.textContent = prop.section;
      Object.assign(title.style, { fontWeight: 'bold', marginBottom: '4px' });
      section.append(title);
      body.append(section);
      sections.set(prop.section, section);
    }

    const row = document.createElement('label');
    Object.assign(row.style, {
      display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px',
    });
    const labelText = document.createElement('span');
    labelText.textContent = `${prop.label}:`;
    Object.assign(labelText.style, { flex: '1', fontSize: '11px' });
    row.append(labelText);

    const input = buildInput(prop, state[prop.key], (val) => {
      state[prop.key] = val;
      applyProperty(prop, val, ctx);
    });
    row.append(input);
    section.append(row);
  });

  const hr2 = document.createElement('hr');
  Object.assign(hr2.style, { border: 'none', borderTop: '1px solid #333', margin: '8px 0' });
  body.append(hr2);

  const shareBtn = document.createElement('button');
  shareBtn.textContent = 'Copy share link';
  Object.assign(shareBtn.style, {
    width: '100%',
    background: '#111',
    color: '#0f0',
    border: '1px solid #333',
    padding: '6px',
    font: 'inherit',
    cursor: 'pointer',
  });
  shareBtn.addEventListener('click', async () => {
    const shareUrl = new URL(window.location.href);
    PROPERTIES.forEach((prop) => {
      if (state[prop.key] !== prop.defaultValue) {
        shareUrl.searchParams.set(prop.urlKey, state[prop.key]);
      } else {
        shareUrl.searchParams.delete(prop.urlKey);
      }
    });
    try {
      await navigator.clipboard.writeText(shareUrl.href);
      shareBtn.textContent = 'Copied!';
    } catch {
      shareBtn.textContent = 'Copy failed';
    }
    setTimeout(() => { shareBtn.textContent = 'Copy share link'; }, 1500);
  });
  body.append(shareBtn);

  return panel;
}

export default function init({ lenis, lerpRef, lerpState }) {
  const ctx = { lenis, lerpRef, lerpState };
  const state = {};
  const url = new URL(window.location.href);

  PROPERTIES.forEach((prop) => {
    const urlVal = url.searchParams.get(prop.urlKey);
    const value = urlVal !== null ? parseValue(urlVal, prop) : prop.defaultValue;
    state[prop.key] = value;
    applyProperty(prop, value, ctx);
  });

  const panel = buildPanel(state, ctx);
  document.body.append(panel);

  const deltaCell = panel.querySelector('[data-status="delta"]');
  const modeCell = panel.querySelector('[data-status="mode"]');
  const render = () => {
    deltaCell.textContent = (lenis.animatedScroll - lenis.targetScroll).toFixed(3);
    modeCell.textContent = lerpState.mode;
    modeCell.style.color = lerpState.mode === 'fast' ? '#f80' : '#0f0';
    requestAnimationFrame(render);
  };
  requestAnimationFrame(render);
}
