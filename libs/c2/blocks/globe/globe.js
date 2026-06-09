/* eslint-disable */
/* PROTOTYPE PORT — lint disabled for the verbatim ES5 runtime ported from the
   hub-creative offer-globe.js prototype. To be cleaned up (no-var, naming,
   max-len, etc.) during the refactor pass. See PROGRESS.md. */
/* ─────────────────────────────────────────────────────────────────────────
   Offer Globe — Three.js WebGL globe variant.

   Phases (progress 0→1 across 850vh .offer-pin-spacer):
     0.00 – 0.55  Arc: 45 cards rotate across viewport
     0.14 – 0.65  Grid peel: cards peel off arc into 9×5 grid (staggered)
     0.37 – 0.78  Sphere fold: each card folds to sphere immediately after arriving in grid
     0.78 – 1.00  Zoom: camera flies through sphere
   ───────────────────────────────────────────────────────────────────────── */
import { loadScript } from '../../../utils/utils.js';

// Vendored THREE (UMD global) + card textures live next to this module.
const THREE_SRC = new URL('./three.min.js', import.meta.url).href;
const ASSET_BASE = new URL('./assets/', import.meta.url).href;

// ── Authoring ────────────────────────────────────────────────────────────────
// Adobe app catalog used to render the modal badge chips (the id drives the
// brand-colored icon class in globe.css, e.g. .card-modal__badge-icon--photoshop).
// At module scope so both placeholder generation and authored-badge parsing share it.
const APP_CATALOG = [
  { id: 'photoshop', name: 'Photoshop', abbr: 'Ps' },
  { id: 'lightroom', name: 'Lightroom', abbr: 'Lr' },
  { id: 'illustrator', name: 'Illustrator', abbr: 'Ai' },
  { id: 'premiere', name: 'Premiere Pro', abbr: 'Pr' },
  { id: 'aftereffects', name: 'After Effects', abbr: 'Ae' },
  { id: 'firefly', name: 'Firefly', abbr: 'Ff' },
  { id: 'express', name: 'Express', abbr: 'Ex' },
  { id: 'fresco', name: 'Fresco', abbr: 'Fr' },
];

// Resolve a badge's app from an authored token (matches id / name / abbr,
// case-insensitive). Unknown apps still render, with a derived 2-letter abbr.
function findApp(token) {
  const t = (token || '').trim();
  const key = t.toLowerCase();
  const match = APP_CATALOG.find(
    (a) => a.id === key || a.name.toLowerCase() === key || a.abbr.toLowerCase() === key,
  );
  if (match) return match;
  return { id: 'photoshop', name: t || 'App', abbr: t.slice(0, 2) || 'Ap' };
}

// AUTHORING CONTRACT:
// The block has three authored rows (direct child <div>s):
//   Row 0 — arc-copy:   heading → .offer-arc-copy__title; <p> → .offer-arc-copy__body
//   Row 1 — cards:      a fragment link resolved by Milo before init() fires.
//                       Each card in the fragment is a flat sequence of elements
//                       (separated by <hr> for multiple cards):
//                         <p><em>Role</em></p>
//                         <p><strong>Name</strong></p>
//                         <p>Description text</p>
//                         <ul><li>App<ul><li>Role</li></ul></li>…</ul>
//                         <p><picture>…</picture></p>
//   Row 2 — pull-quote: heading → .offer-pullquote__quote;
//                       first <p> → .offer-pullquote__name;
//                       second <p> → .offer-pullquote__role
// Returns { cards, arcCopy, pullQuote }. cards falls back to [] (factory uses placeholders).

function parseArcCopy(row) {
  const heading = row.querySelector('h1,h2,h3,h4,h5,h6');
  const paras = [...row.querySelectorAll('p')]
    .filter((p) => !p.querySelector('picture,img'))
    .map((p) => p.textContent.trim())
    .filter(Boolean);
  return {
    title: heading ? heading.textContent.trim() : paras.shift() || '',
    body: paras.join(' '),
  };
}

function parsePullQuote(row) {
  const quoteEl = row.querySelector('blockquote') || row.querySelector('h1,h2,h3,h4,h5,h6');
  const paras = [...row.querySelectorAll('p')].map((p) => p.textContent.trim()).filter(Boolean);
  return {
    quote: quoteEl ? quoteEl.textContent.trim() : paras.shift() || '',
    name: paras[0] || '',
    role: paras[1] || '',
  };
}

function parseFragmentCardSegment(nodes) {
  let picture = null; let img = null;
  let role = 'Photographer'; let name = ''; let description = '';
  const badges = [];

  for (const node of nodes) {
    const tag = node.nodeName && node.nodeName.toUpperCase();
    if (!tag) continue;

    if (tag === 'P') {
      const pic = node.querySelector('picture');
      if (pic) { picture = pic; img = pic.querySelector('img'); continue; }
      const i = node.querySelector('img');
      if (i) { img = i; continue; }
      const em = node.querySelector('em');
      if (em) { role = em.textContent.trim(); continue; }
      const strong = node.querySelector('strong');
      if (strong) { name = strong.textContent.trim(); continue; }
      const text = node.textContent.trim();
      if (text && !description) description = text;
    } else if (tag === 'UL') {
      node.querySelectorAll(':scope > li').forEach((li) => {
        const nestedLi = li.querySelector('ul > li');
        if (nestedLi) {
          const appText = [...li.childNodes]
            .filter((n) => n.nodeType === Node.TEXT_NODE)
            .map((n) => n.textContent.trim())
            .join('').trim();
          const roleText = nestedLi.textContent.trim();
          if (appText) badges.push({ app: findApp(appText), role: roleText });
        } else {
          // Legacy pipe-separated format: "Photoshop | Compositing"
          const parts = li.textContent.split('|').map((s) => s.trim()).filter(Boolean);
          if (parts[0]) badges.push({ app: findApp(parts[0]), role: parts.slice(1).join(' ') });
        }
      });
    }
  }

  if (!img) return null;
  return {
    img: img.currentSrc || img.getAttribute('src') || img.src,
    picture,
    name: name || 'Untitled',
    role,
    description,
    badges,
  };
}

function parseFragmentCards(row) {
  const hasDirectContent = [...row.children].some((n) => n.nodeName === 'P' || n.nodeName === 'UL');

  if (!hasDirectContent) {
    // Children are section divs (each fragment section = one card). Recurse into each.
    const divs = [...row.querySelectorAll(':scope > div')];
    return divs.flatMap((div) => parseFragmentCards(div));
  }

  // Flat content — split by <hr> to handle multiple cards within a single section.
  const segments = [];
  let current = [];
  [...row.childNodes].forEach((node) => {
    if (node.nodeName === 'HR') {
      if (current.length) { segments.push(current); current = []; }
    } else if (node.nodeType !== Node.TEXT_NODE || node.textContent.trim()) {
      current.push(node);
    }
  });
  if (current.length) segments.push(current);
  return segments.map((nodes) => parseFragmentCardSegment(nodes)).filter(Boolean);
}

// Fetch the fragment's full .plain.html and parse all card sections from it.
// Called in parallel with loadScript(THREE_SRC) so there's no extra wall-clock cost.
async function fetchFragmentCards(href) {
  try {
    const resp = await fetch(`${href}.plain.html`);
    if (!resp.ok) return null;
    const html = await resp.text();
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    const cards = [...tmp.querySelectorAll(':scope > div')]
      .flatMap((section) => parseFragmentCards(section))
      .filter(Boolean);
    return cards.length ? cards : null;
  } catch (e) {
    return null;
  }
}

function parseAuthoredContent(el) {
  const rows = [...el.querySelectorAll(':scope > div')];
  if (!rows.length) return { cards: [], arcCopy: null, pullQuote: null, fragmentHref: null };

  let cardRows = rows;
  let arcCopy = null;
  let pullQuote = null;

  if (rows.length > 1 && !rows[0].querySelector('picture, img')) {
    arcCopy = parseArcCopy(rows[0]);
    cardRows = cardRows.slice(1);
  }

  if (cardRows.length > 1 && !cardRows[cardRows.length - 1].querySelector('picture, img')) {
    pullQuote = parsePullQuote(cardRows[cardRows.length - 1]);
    cardRows = cardRows.slice(0, -1);
  }

  // Extract the fragment href before buildGlobeDom() wipes the DOM.
  // Canonical path: the link is authored with #_dnb (e.g. /fragments/…#_dnb) so
  // Milo skips auto-resolution and the raw <a href> is still in the DOM here.
  // Strip the hash before fetching. Fall back to data-path + image origin if
  // Milo already replaced the link (e.g. on a page that predates the #_dnb convention).
  const fragmentHref = (() => {
    for (const row of cardRows) {
      const a = row.querySelector('a[href]');
      if (a) return a.href.replace(/#.*$/, '');
      const pathEl = row.querySelector('[data-path]');
      if (pathEl) {
        const imgSrc = row.querySelector('img')?.src;
        const origin = imgSrc ? new URL(imgSrc).origin : window.location.origin;
        return `${origin}${pathEl.dataset.path}`;
      }
    }
    return null;
  })();

  const cards = cardRows.flatMap((row) => parseFragmentCards(row)).filter(Boolean);
  return { cards, arcCopy, pullQuote, fragmentHref };
}

// The globe runtime, ported verbatim from the hub-creative offer-globe.js
// prototype. Originally an IIFE exposing window.offerGlobe; now a factory that
// returns { init, destroy }. See PROGRESS.md for the porting notes:
//   - gsap.ticker → requestAnimationFrame (startTicker/stopTicker below)
//   - Lenis reads → window.scrollY
//   - texture paths → ASSET_BASE
function createGlobeRuntime(authoredCards) {
  if (typeof THREE === 'undefined') { return null; }

  // rAF driver replacing gsap.ticker.
  let _rafId = 0;
  function _rafLoop() { tick(); _rafId = requestAnimationFrame(_rafLoop); }
  function startTicker() { if (!_rafId) _rafId = requestAnimationFrame(_rafLoop); }
  function stopTicker() { if (_rafId) { cancelAnimationFrame(_rafId); _rafId = 0; } }

  // ── Image lists ────────────────────────────────────────────────────────────
  // Placeholder card images — used ONLY when the block has no authored content.
  // 45 images: 23 from assets/offer/ + 22 from assets/globe/. The old arc/globe
  // grouping was vestigial (the arc set was shared with the prototype's dropped
  // tile variant); the runtime indexes one flat, uniform pool. Real authored
  // content replaces this list entirely. See parseAuthoredContent / README.
  const PLACEHOLDER_IMGS = [
    'offer/arc-01', 'offer/arc-02', 'offer/arc-03', 'offer/arc-04', 'offer/arc-05',
    'offer/arc-06', 'offer/arc-07', 'offer/arc-08', 'offer/arc-09', 'offer/arc-10',
    'offer/arc-11', 'offer/arc-12', 'offer/arc-13', 'offer/arc-14', 'offer/arc-15',
    'offer/arc-16', 'offer/arc-17', 'offer/arc-18', 'offer/arc-19', 'offer/arc-20',
    'offer/arc-21', 'offer/arc-22', 'offer/arc-23',
    'globe/01', 'globe/02', 'globe/03', 'globe/06', 'globe/12', 'globe/13',
    'globe/14', 'globe/15', 'globe/16', 'globe/17', 'globe/28', 'globe/29',
    'globe/48', 'globe/49', 'globe/58', 'globe/59', 'globe/60', 'globe/61',
    'globe/62', 'globe/63', 'globe/64', 'globe/65',
  ].map((p) => `${ASSET_BASE}${p}.png`);

  // ── Placeholder card metadata ──────────────────────────────────────────────
  // Feeds buildPlaceholderCards() when the block has no authored content.
  // Deterministic per index so card 5 always shows the same person. The app
  // catalog itself lives at module scope (APP_CATALOG) so authored-content
  // parsing can resolve badge apps by name/abbr/id too.
  const MODAL_ROLES = {
    photoshop: ['Compositing', 'Retouching', 'Color grading'],
    lightroom: ['Color correction', 'Organization', 'Presets'],
    illustrator: ['Vector art', 'Logos', 'Illustrations'],
    premiere: ['Editing', 'Cuts', 'Sequencing'],
    aftereffects: ['Animation', 'Effects', 'Motion graphics'],
    firefly: ['AI generation', 'Concept art', 'References'],
    express: ['Quick edits', 'Templates', 'Social posts'],
    fresco: ['Sketching', 'Painting', 'Drafts'],
  };
  const MODAL_PHOTOGRAPHERS = [
    'Vincent van Gogh', 'Frida Kahlo', 'Andy Warhol', 'Cindy Sherman',
    'Annie Leibovitz', 'Steve McCurry', 'Henri Cartier-Bresson', 'Dorothea Lange',
    'Ansel Adams', 'Diane Arbus', 'Richard Avedon', 'Helmut Newton',
    'Mary Ellen Mark', 'Garry Winogrand', 'Sebastião Salgado', 'Vivian Maier',
    'Robert Frank', 'Walker Evans', 'Imogen Cunningham', 'Berenice Abbott',
    'Yousuf Karsh', 'Edward Weston', 'Sally Mann', 'Nan Goldin',
    'Wolfgang Tillmans', 'Lynsey Addario', 'Tyler Mitchell', 'Joel Meyerowitz',
    'Saul Leiter', 'Stephen Shore', 'William Eggleston', 'Lee Friedlander',
    'Eugene Smith', 'Robert Capa', 'Margaret Bourke-White', 'Eve Arnold',
    'Inge Morath', 'Daido Moriyama', 'Hiroshi Sugimoto', 'Andreas Gursky',
    'Thomas Struth', 'Edward Burtynsky', 'Gordon Parks', 'Gregory Crewdson',
    'Catherine Opie',
  ];
  // Synthesize `count` placeholder cards from the bundled images + mock people.
  // Card shape matches parseAuthoredContent (see module scope): the runtime and
  // modal consume the same { img, picture, name, role, description, badges }.
  function buildPlaceholderCards(count) {
    const out = [];
    for (let i = 0; i < count; i++) {
      const name = MODAL_PHOTOGRAPHERS[i] || `Photographer ${i}`;
      const app1 = APP_CATALOG[i % APP_CATALOG.length];
      let app2 = APP_CATALOG[(i + 3) % APP_CATALOG.length];
      if (app2.id === app1.id) app2 = APP_CATALOG[(i + 5) % APP_CATALOG.length];
      const roles1 = MODAL_ROLES[app1.id];
      const roles2 = MODAL_ROLES[app2.id];
      const firstName = name.split(' ')[0];
      out.push({
        img: PLACEHOLDER_IMGS[i % PLACEHOLDER_IMGS.length],
        picture: null,
        name,
        role: 'Photographer',
        description: `${firstName} uses ${app1.name} and ${app2.name} to organize`
          + ` and apply consistent edits across a shoot, then turn to ${app1.name}`
          + ' for precise retouching and final refinements.',
        badges: [
          { app: app1, role: roles1[i % roles1.length] },
          { app: app2, role: roles2[(i + 1) % roles2.length] },
        ],
      });
    }
    return out;
  }

  // The card content the runtime renders: authored cards if the block had any,
  // otherwise PLACEHOLDER_COUNT generated cards (preserves the prototype look).
  const PLACEHOLDER_COUNT = 45;
  const CARD_CONTENT = (authoredCards && authoredCards.length)
    ? authoredCards
    : buildPlaceholderCards(PLACEHOLDER_COUNT);

  // Per-card accessor. Wraps so any authored count fills the per-breakpoint
  // N_TOTAL (45 desktop/tablet, 24 mobile) without breaking the grid math.
  // (Aligning N_TOTAL/grid to the authored count is a later refinement.)
  function getCardMetadata(i) {
    const len = CARD_CONTENT.length;
    return CARD_CONTENT[((i % len) + len) % len];
  }

  // ── Constants ──────────────────────────────────────────────────────────────

  // Image-derived (texture aspect, never changes)
  const CARD_ASPECT = 456 / 631; // portrait

  // ── Breakpoints ─────────────────────────────────────────────────────────
  // Visual-layout knobs that change between viewport sizes. Tablet & mobile start as
  // EXACT mirrors of desktop — tuning a non-desktop BP cannot affect desktop because
  // each BP holds its own values. Resolved once at init() via resolveBP(W); crossing
  // a BP boundary on resize triggers full destroy() + init() (see doLayout).
  //
  // To add a new breakpoint: copy one of the entries below, give it a new key (e.g.
  // 'largeDesktop'), set minWidth, and update resolveBP() to test for it.
  // Thresholds match the ACOM design system (Consonant 2.0):
  //   desktop ≥1024, tablet 768–1023, mobile <768.
  // Type/layout @media queries in CSS use the same boundaries.
  const BREAKPOINTS = {
    desktop: {
      minWidth: 1024,
      N_TOTAL: 45,
      ARC_SPAN: 4.50,
      SPHERE_R: 35,
      CARD_H_SPHERE: 6.5,
      CARD_W_ARC: 456,
      CAM_Z_SPHERE: 65,
      CAM_Z_END: -60,
      GRID_COLS: 9,
      GRID_ROWS: 5,
      ARC_DENSE_COUNT: 27,
    },
    tablet: {
      minWidth: 768,
      N_TOTAL: 45,
      ARC_SPAN: 4.50,
      SPHERE_R: 35,
      CARD_H_SPHERE: 6.5,
      CARD_W_ARC: 456,
      CAM_Z_SPHERE: 65,
      CAM_Z_END: -60,
      GRID_COLS: 9,
      GRID_ROWS: 5,
      ARC_DENSE_COUNT: 27,
    },
    mobile: {
      // Tuned for 375x667 portrait. Sphere fits ~88% viewport width / 49% height
      // at SPHERE_R=20, CAM_Z_SPHERE=70. Card count + grid layout adjusted to
      // portrait orientation. Arc cards sized to fit within viewport with margin.
      // ARC_DENSE_COUNT=0 → cards spread uniformly across arc (no off-screen
      // dense cluster), since N_TOTAL=24 isn't crowded enough to need clustering.
      minWidth: 0,
      N_TOTAL: 24,
      ARC_SPAN: 3.6,
      SPHERE_R: 20,
      CARD_H_SPHERE: 6.0,
      CARD_W_ARC: 220,
      CAM_Z_SPHERE: 70,
      CAM_Z_END: -60,
      GRID_COLS: 3,
      GRID_ROWS: 8,
      ARC_DENSE_COUNT: 0,
    },
  };

  function resolveBP(w) {
    if (w >= BREAKPOINTS.desktop.minWidth) return { name: 'desktop', cfg: BREAKPOINTS.desktop };
    if (w >= BREAKPOINTS.tablet.minWidth) return { name: 'tablet', cfg: BREAKPOINTS.tablet };
    return { name: 'mobile', cfg: BREAKPOINTS.mobile };
  }

  // ── Per-BP values — declared here, assigned by applyBP() before buildCards() runs ──
  // Do NOT read these at module load time; their values are only valid after init().
  let N_TOTAL; let N_VISIBLE; let ARC_SPAN; let SPHERE_R; let CARD_H_SPHERE; let CARD_W_SPHERE;
  let CARD_W_ARC; let CAM_Z_SPHERE; let CAM_Z_END; let FOLD_SPHERE_DIST; let GRID_COLS; let GRID_ROWS;
  let ARC_DENSE_COUNT;
  let currentBPName = null;

  function applyBP(cfg) {
    N_TOTAL = cfg.N_TOTAL;
    N_VISIBLE = N_TOTAL; // all cards on arc simultaneously (no conveyor)
    ARC_SPAN = cfg.ARC_SPAN;
    SPHERE_R = cfg.SPHERE_R;
    CARD_H_SPHERE = cfg.CARD_H_SPHERE;
    CARD_W_SPHERE = CARD_H_SPHERE * CARD_ASPECT;
    CARD_W_ARC = cfg.CARD_W_ARC;
    CAM_Z_SPHERE = cfg.CAM_Z_SPHERE;
    CAM_Z_END = cfg.CAM_Z_END;
    // Sphere-camera distance at fold start → ~70% viewport height; lerps to CAM_Z_SPHERE.
    FOLD_SPHERE_DIST = Math.round(SPHERE_R / (0.35 * Math.tan(Math.PI / 6)));
    GRID_COLS = cfg.GRID_COLS;
    GRID_ROWS = cfg.GRID_ROWS;
    ARC_DENSE_COUNT = cfg.ARC_DENSE_COUNT;
  }

  // ── Non-BP timing/physics constants (identical across breakpoints) ──
  const ARC_STAGGER = 0.594;
  const P_PAN_END = 0.55;
  const P_ARC_PREROLL = 0.30;

  // Grid peel expressed as arc-rotation fraction (0=arc start, 1=arc end).
  const P_GRID_ARC_START = 0.30;
  const P_GRID_ARC_END = 0.60;

  const P_FOLD_DUR = 0.25;
  const P_ZOOM_END = 1.00;

  // Drag / auto-rotation
  const DRAG_FRICTION = 0.94;
  const DRAG_SENSITIVITY = 0.005;
  const MAX_VEL = 0.06;
  const AUTO_ROT_SPEED = 0.000045;

  // Sphere becomes interactive (drag-rotate, hover, click → modal) at this
  // sphereFormT threshold rather than waiting for full formation. Lower = sphere
  // can be grabbed mid-fold. Above ≥0.5 the lerped card positions are close
  // enough to sphere that rotating the group still reads as spinning the sphere.
  const SPHERE_INTERACTIVE_T = 0.8;

  const GRID_GAP_RATIO = 0.5; // gap between cards = 0.5× card width (computed per layout)

  const GRID_PEEL_STAGGER = 0.20; // arc→grid: stagger peels across 20% of formation phase (more simultaneous)
  const ARC_PEEL_JITTER = 0.40; // per-card random offset added to gpDelay — breaks the linear cascade for an organic feel

  // Non-uniform fanT distribution along the arc:
  //   Cards [0, ARC_DENSE_COUNT-1] cluster tight into fanT [0, ARC_DENSE_SPLIT] (off-screen flank).
  //   Cards [ARC_DENSE_COUNT, N-1] spread across fanT [ARC_DENSE_SPLIT, 1] (the visible upper arc).
  // The clustered cards peel first (low i = early gpDelay), so they vanish before rotation
  // would otherwise bring their compressed fanT region into view.
  // ARC_DENSE_COUNT is per-BP (in BREAKPOINTS) since it must scale with N_TOTAL.
  const ARC_DENSE_SPLIT = 0.50;

  // Chromatic aberration (Options B + C)
  const CA_ENABLED = true; // master kill switch — set false to disable all CA without removing code
  const CA_STRENGTH = 0.012; // radial UV shift per channel (bell-curve at transition peaks; Option B)
  const CA_MOTION_STRENGTH = 1.0; // directional UV shift max — peel / fold / sphere / modal
  const CA_MOTION_STRENGTH_ARC = 0.04; // softer clamp while cards sit on the arc

  // ── Hover (sphere phase only) ──
  // Polished/premium feel — settles in/out, no continuous animation while hovered.
  const HOVER_CA = 0.025; // CA bump composed additively onto transition CA
  const HOVER_WARP = 0.4; // barrel-distortion amount sent to shader
  const HOVER_SCALE = 0.25; // scale multiplier added: 1.0 → 1.25
  const HOVER_RATE = 0.15; // per-frame lerp toward target (~125ms to 80%)

  // ── Sphere-drag warp (all breakpoints) ──
  // Hybrid intensity: a baseline while actively dragging, plus a velocity-driven
  // burst that decays naturally with dragVel via DRAG_FRICTION after release.
  // Applied to ALL sphere cards (front + back) using each card's own center (0.5, 0.5).
  const SPHERE_DRAG_WARP_BASELINE = 0.05; // constant while isDragging
  const SPHERE_DRAG_WARP_VEL = 3.5; // multiplier on drag-speed (px/frame in world units)
  const SPHERE_DRAG_WARP_MAX = 0.25; // cap on combined value
  let _sphereDragWarp = 0; // current value pushed to all sphere cards
  const SCROLL_VEL_MAX = 15; // px/frame scroll speed that saturates motion trail at full strength
  const CA_PX_MAX = 3; // max vertical pixel shift for global canvas SVG filter (Option C)

  // ── State ──────────────────────────────────────────────────────────────────
  let renderer; let scene; let camera; let cameraOrtho; let
    sphereGroup;
  let modalRenderer; let modalScene; let
    modalCanvasEl; // separate canvas/scene for the flown-out modal card
  let cards = []; // { mesh, spherePos, sphereQuat, gridPos, gridScale, gridTilt, gridQuat, gridCol, gridRow }
  let textures = [];
  const cardTexData = []; // per-card: sphereScaleX, arc UV crop values — populated in done(), read in buildCards()
  let gridCardW = 0; let
    gridTilts = [];

  let progress = 0;
  let arcCopyEntryT = 0;
  let spacerOffsetTop = 0;
  let spacerHeight = 0;
  let W = 0; let
    H = 0;

  const pqEl = document.getElementById('offer-pullquote');
  let pqShown = false;
  let pqPrevZoom = 0;

  let caFilterR = null; // SVG feOffset element for red channel  (Option C)
  let caFilterB = null; // SVG feOffset element for blue channel (Option C)
  let prevLenisY = 0; // previous frame scroll position — used to compute scrollVel
  let scrollVel = 0; // |lenisY - prevLenisY| — drives motion trail intensity

  let sphereRotY = 0; let
    sphereRotX = 0;
  let dragVelX = 0; let
    dragVelY = 0;
  let isDragging = false; let lastMX = 0; let
    lastMY = 0;
  let tickerAdded = false;

  // Per-card sphere-rotation state (THREE objects). The sphere drag rotation is applied
  // MANUALLY to each card in the sphere/fold blocks of tick() — sphereGroup.rotation is
  // kept at identity so cards in non-sphere phases (arc/grid) aren't transformed by stale
  // drag rotation. Lazy-initialized in setupModal() where THREE is loaded.
  let _sphereRotEuler = null;
  let _sphereRotQuat = null;
  let _foldRotQuat = null;
  let _tmpVec3 = null;

  // Modal-nav "reactivity nudge": when user navigates prev/next within the modal,
  // drive a spring on sphereRotY/X toward a target derived from the new card's slot
  // position. Sphere visibly rotates behind the blur to acknowledge the navigation.
  // Magnitude scales with angular distance to the new card's actual position, so a
  // close neighbor gives a small nudge and a back-of-sphere card gives a bigger one
  // (capped). Slight overshoot + decay for a "bouncy" feel.
  let _navNudgeActive = false;
  let _navNudgeTargetY = 0;
  let _navNudgeTargetX = 0;
  let _navNudgeVelY = 0;
  let _navNudgeVelX = 0;
  const NAV_NUDGE_FACTOR = 0.25; // 25% of full alignment angle — gentler
  const NAV_NUDGE_MAX_Y = 0.45; // ~26° cap so distant cards don't cause big swings
  const NAV_NUDGE_MAX_X = 0.18; // ~10° cap (X is already clamped to ±π/3 elsewhere)
  const NAV_NUDGE_STIFF = 0.05; // softer pull
  const NAV_NUDGE_DAMP = 0.86; // closer to critical damping → minimal overshoot

  // ── Desktop modal-nav warp transition ───────────────────────────────────
  // On desktop only (mobile uses live swipe gestures), clicking the prev/next
  // arrow triggers a cross-warp transition: the old card stays put and warps,
  // while the new card cross-dissolves in on top — also warped. Both cards'
  // uWarp uniforms follow a sin bell curve peaking mid-transition.
  let _dnNavActive = false;
  let _dnNavT0 = 0;
  let _dnNavOldCard = null;
  let _dnNavNewCard = null;
  const DN_NAV_DUR = 500; // ms
  const DN_NAV_WARP = 0.40; // peak warp (matches Pronounced option)

  // Click-vs-drag detection (canvas needs both — drag for sphere rotation, click for modal)
  let pointerDownX = 0; let pointerDownY = 0; let
    pointerDownT = 0;

  // Card detail modal state — the clicked card mesh itself flies to a target position
  // in world space and becomes the visible "image". HTML provides the info panel + chrome.
  let modalIdx = -1; // currently open card index, -1 if closed
  let modalCard = null; // reference to the card object whose mesh is animating
  let modalPhase = null; // 'opening' | 'open' | 'closing' | null
  let modalAnimT0 = 0; // animation start timestamp
  const MODAL_ANIM_DURATION = 350; // ms — shorter so card settles quickly
  // THREE.Vector3 / Quaternion instances — created lazily in setupModal() where THREE is loaded
  let modalStartPos = null;
  let modalStartQuat = null;
  let modalStartScale = null;
  let modalCloseStartPos = null;
  let modalCloseStartQuat = null;
  let modalCloseStartScale = null;
  let modalEl = null;
  let raycaster = null;
  let mouseNDC = null;
  let _chromeProjV = null; // reusable Vector3 for chrome positioning projection

  // Chrome reveal — elements fade + slide in after card is 90% settled.
  let modalChromeRevealT0 = -1; // timestamp when card first hit 90%; -1 = not yet
  let modalChromeFadeT = 0; // 0→1 fade progress for chrome elements
  const CHROME_REVEAL_DUR = 300; // ms for chrome fade-in after trigger

  // Current arc context (computed once per frame)
  let _ctx = null;

  // ── Easing ─────────────────────────────────────────────────────────────────
  function easeOutCubic(t) { return 1 - (1 - t) ** 3; }
  function easeInOutCubic(t) { return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2; }
  function easeOutSine(t) { return Math.sin(t * Math.PI / 2); }

  function lerpN(a, b, t) { return a + (b - a) * t; }
  function lerpV3(out, a, b, t) {
    out.x = lerpN(a.x, b.x, t);
    out.y = lerpN(a.y, b.y, t);
    out.z = lerpN(a.z, b.z, t);
  }

  // ── Arc math ── direct port of CSS tile variant ────────────────────────────
  function arcRotationEase(t) {
    const k = 0.08; const
      a = 1 / (k * (2 - k));
    const v0 = a * k * k; const
      s = 2 * a * k;
    return t <= k ? a * t * t : v0 + s * (t - k);
  }

  function buildArcCtx(arcPanT) {
    const arcRot0 = arcRotationEase(arcPanT);
    const R = Math.max(W, H) * 1.5; // smaller radius = more visible arc curvature
    const alpha = Math.atan2(H, W);
    const fanCX = W * 0.5 - R * Math.sin(alpha);
    const fanCY = H * 0.5 + R * Math.cos(alpha) - H * 0.15;
    const thetaM = Math.atan2(-Math.cos(alpha), Math.sin(alpha));
    const rotOffset = ARC_SPAN * 0.5 - ARC_SPAN * 1.5 * arcRot0;
    const effectiveSpan = ARC_SPAN * (1 + 0.4 * arcRot0);
    _ctx = {
      R,
      fanCX,
      fanCY,
      thetaM,
      rotOffset,
      effectiveSpan,
    };
  }

  // t = 0..1 normalized position across the arc span (0 = one end, 1 = other end)
  function getFanData(t) {
    const angle = _ctx.thetaM + _ctx.effectiveSpan / 2
              - t * _ctx.effectiveSpan
              + _ctx.rotOffset;
    const px = _ctx.fanCX + _ctx.R * Math.cos(angle);
    const py = _ctx.fanCY + _ctx.R * Math.sin(angle);
    // Radial direction (CSS screen space, Y-down)
    const rx = Math.cos(angle);
    const ry = Math.sin(angle);
    // CSS card rotation (in radians) — tangent to arc circle
    const cssRot = Math.atan2(rx, -ry);
    return { px, py, rx, ry, cssRot };
  }

  // Convert CSS screen coordinates to WebGL world coordinates
  // (origin at screen center; Y flipped)
  function cssToWorld(px, py) {
    return { x: px - W / 2, y: -(py - H / 2) };
  }

  // Rotate a point (in CSS screen space) around (fanCX, fanCY) by angle A (CW in CSS)
  // then convert to world space.
  function rotateArcPoint(px, py, A) {
    const dx = px - _ctx.fanCX;
    const dy = py - _ctx.fanCY;
    const cosA = Math.cos(A); const
      sinA = Math.sin(A);
    const rpx = _ctx.fanCX + dx * cosA - dy * sinA;
    const rpy = _ctx.fanCY + dx * sinA + dy * cosA;
    return cssToWorld(rpx, rpy);
  }

  // ── Rounded-rect alpha masks ───────────────────────────────────────────────
  // Draws a white rounded rect on black background. Three.js alphaMap uses the
  // green channel as the alpha multiplier: white=opaque, black=transparent.
  //
  // createRoundedMask() → high-res portrait mask (arc/grid phases, shared).
  // createRoundedMaskForAspect(aspect) → per-aspect mask for the sphere phase.
  //   Canvas W/H ratio matches the card's final world-space shape so corner arcs
  //   are physically circular, not elliptical. Cache avoids duplicate canvases.

  function createRoundedMask() {
    // High-resolution portrait mask for arc/grid phases.
    const cw = 1024; const
      ch = Math.round(1024 * (631 / 456)); // 1416
    const r = Math.round(cw * (22 / 456)); // 49px — proportional 22px corner
    const c = document.createElement('canvas');
    c.width = cw; c.height = ch;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, cw, ch);
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.lineTo(cw - r, 0);
    ctx.arcTo(cw, 0, cw, r, r);
    ctx.lineTo(cw, ch - r);
    ctx.arcTo(cw, ch, cw - r, ch, r);
    ctx.lineTo(r, ch);
    ctx.arcTo(0, ch, 0, ch - r, r);
    ctx.lineTo(0, r);
    ctx.arcTo(0, 0, r, 0, r);
    ctx.closePath();
    ctx.fill();
    const tex = new THREE.CanvasTexture(c);
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.generateMipmaps = true;
    if (renderer) tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    tex.needsUpdate = true;
    return tex;
  }

  // Cache keyed by Math.round(aspect * 100) so e.g. 0.72 and 1.78 get distinct entries.
  const _sphereMaskCache = {};

  function createRoundedMaskForAspect(aspect) {
    // Canvas whose W:H matches the card's world-space shape after non-uniform scale.
    // Corner radius r is 22/631 of canvas height — same physical proportion as arc mask.
    const H_c = 512;
    const W_c = Math.max(1, Math.round(H_c * aspect));
    const r = Math.round(H_c * (22 / 631));
    const c = document.createElement('canvas');
    c.width = W_c; c.height = H_c;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W_c, H_c);
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.lineTo(W_c - r, 0);
    ctx.arcTo(W_c, 0, W_c, r, r);
    ctx.lineTo(W_c, H_c - r);
    ctx.arcTo(W_c, H_c, W_c - r, H_c, r);
    ctx.lineTo(r, H_c);
    ctx.arcTo(0, H_c, 0, H_c - r, r);
    ctx.lineTo(0, r);
    ctx.arcTo(0, 0, r, 0, r);
    ctx.closePath();
    ctx.fill();
    const tex = new THREE.CanvasTexture(c);
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.generateMipmaps = true;
    if (renderer) tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    tex.needsUpdate = true;
    return tex;
  }

  function getSphereMask(sphereScaleX) {
    // aspect = world-space width/height of the sphere card after scale(sphereScaleX, 1, 1)
    const aspect = sphereScaleX * CARD_ASPECT;
    const key = Math.round(aspect * 100);
    if (!_sphereMaskCache[key]) {
      _sphereMaskCache[key] = createRoundedMaskForAspect(aspect);
    }
    return _sphereMaskCache[key];
  }

  // ── Modal SDF shader material ─────────────────────────────────────────────
  // Used only for the modal-active card. A rasterized alphaMap will always pixelate
  // at modal scale (card ~75vh, textures at 512–1024px). The SDF computes the rounded
  // rect boundary in the fragment shader at native screen resolution with 1-pixel AA
  // via fwidth — perfectly sharp at any zoom level.
  //
  // uAspect = world-space width/height of the rendered card (CARD_ASPECT × sphereScaleX).
  // The SDF coordinate space maps UV (0,1)×(0,1) → pos in [-A/2,A/2]×[-0.5,0.5] so
  // corner radius uRadius is expressed as a fraction of card height (22/631 ≈ 0.0349).

  const _MODAL_VERT = [
    'varying vec2 vUv;',
    'void main() {',
    '  vUv = uv;',
    '  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
    '}',
  ].join('\n');

  const _MODAL_FRAG = [
    'uniform sampler2D map;',
    'uniform float uAspect;',
    'uniform float uRadius;',
    'uniform float uOpacity;',
    'uniform vec2 uMotionDir;', // card velocity in UV space — drives motion-trail CA; (0,0) = off
    'uniform float uWarp;', // fisheye intensity (0 = none, ~0.4 = strong bulge); used in open/close/drag
    'uniform vec2 uWarpCenter;', // UV anchor for fisheye (0.5, 0.5 default; touch UV during drag)
    'varying vec2 vUv;',
    'float rrSDF(vec2 p, vec2 b, float r) {',
    '  vec2 q = abs(p) - b + r;',
    '  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;',
    '}',
    'void main() {',
    // SDF rounded-rect clip uses raw vUv so the card's geometry outline doesn't warp.
    '  vec2 pos = (vUv - 0.5) * vec2(uAspect, 1.0);',
    '  float d = rrSDF(pos, vec2(uAspect * 0.5 - uRadius, 0.5 - uRadius), uRadius);',
    '  float px = fwidth(pos.y);',
    '  float alpha = 1.0 - smoothstep(-px, px, d);',
    // Fisheye/barrel warp anchored at uWarpCenter — same formula as the globe-card
    // hover shader. Image content bulges outward around the anchor point.
    '  vec2 d2 = vUv - uWarpCenter;',
    '  float r2 = dot(d2, d2);',
    '  vec2 warpedUv = d2 / (1.0 + uWarp * r2 * 4.0) + uWarpCenter;',
    // Motion-trail CA: R trails behind card motion, B ghosts ahead. Sampled on warpedUv.
    '  float r = texture2D(map, warpedUv - uMotionDir).r;',
    '  float g = texture2D(map, warpedUv).g;',
    '  float b = texture2D(map, warpedUv + uMotionDir * 0.5).b;',
    // Re-encode linear→sRGB (Three.js uploads SRGBColorSpace textures decoded to linear)
    '  vec3 srgb = pow(max(vec3(r, g, b), 0.0), vec3(1.0 / 2.2));',
    '  gl_FragColor = vec4(srgb, alpha * uOpacity);',
    '}',
  ].join('\n');

  function createModalShaderMaterial(texture, sphereScaleX) {
    return new THREE.ShaderMaterial({
      uniforms: {
        map: { value: texture },
        uAspect: { value: sphereScaleX * CARD_ASPECT },
        uRadius: { value: 22.0 / 631.0 },
        uOpacity: { value: 1.0 },
        uMotionDir: { value: new THREE.Vector2(0, 0) },
        uWarp: { value: 0 },
        uWarpCenter: { value: new THREE.Vector2(0.5, 0.5) },
      },
      vertexShader: _MODAL_VERT,
      fragmentShader: _MODAL_FRAG,
      transparent: true,
      depthTest: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      extensions: { derivatives: true }, // enables fwidth in WebGL1; no-op in WebGL2
    });
  }

  function getModalMaterial(card) {
    if (!card._modalMat) {
      card._modalMat = createModalShaderMaterial(card.mesh.material.map, card.sphereScaleX);
    }
    return card._modalMat;
  }

  // Reset the modal SDF material's animated uniforms to clean defaults.
  // The SDF material is cached per-card (card._modalMat), so a card that was
  // mid-fade during an interrupted nav (uOpacity stuck at e.g. 0.4) would
  // inherit that stale value the next time it's shown in the modal — making
  // the image render dark and ghosted. Call this whenever the SDF material
  // is (re)assigned to a card or whenever a card leaves the modal flow.
  function _resetModalMaterialUniforms(material, opacity) {
    const u = material && material.uniforms;
    if (!u) return;
    if (u.uOpacity) u.uOpacity.value = (typeof opacity === 'number' ? opacity : 1);
    if (u.uWarp) u.uWarp.value = 0;
    if (u.uMotionDir) u.uMotionDir.value.set(0, 0);
    // uWarpCenter is intentionally NOT reset here — callers set it (open: from
    // click origin, nav: 0.5/0.5) right after this.
  }

  // ── Card ShaderMaterial — chromatic aberration (Option B) ─────────────────
  // uCA = 0 → normal render; uCA > 0 → R/B channels split outward from card center.
  // uRepeat/uOffset replicate the texture cover-crop that MeshBasicMaterial tracked
  // via texture.repeat/offset (ShaderMaterial doesn't apply the texture matrix).
  // sRGB re-encode: Three.js uploads SRGBColorSpace textures decoded to linear;
  // custom ShaderMaterial must re-encode linear→sRGB to match MeshBasicMaterial output.
  const CARD_VERT = [
    'varying vec2 vUv;',
    'void main() {',
    '  vUv = uv;',
    '  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
    '}',
  ].join('\n');

  const CARD_FRAG = [
    'uniform sampler2D uMap;',
    'uniform sampler2D uAlphaMap;',
    'uniform float uOpacity;',
    'uniform float uCA;',
    'uniform float uWarp;', // barrel-distortion amount (0 = none, ~0.07 = subtle bulge); used for hover
    'uniform vec2 uHoverPos;', // anchor point for the warp in UV space; cursor position on card during hover
    'uniform vec2 uRepeat;',
    'uniform vec2 uOffset;',
    'uniform vec2 uMotionDir;', // card motion in UV space × intensity; (0,0) = no smear
    'varying vec2 vUv;',
    'void main() {',
    // Fisheye magnify anchored at uHoverPos (cursor position in UV space).
    // Dividing the offset-from-cursor by (1 + uWarp * r² * 4) samples from closer
    // to the cursor as r grows, so image content visually expands AROUND the cursor —
    // the classic "lens loupe" look. uHoverPos = (0.5, 0.5) → centered fisheye.
    '  vec2 d  = vUv - uHoverPos;',
    '  float r2 = dot(d, d);',
    '  vec2 warpedUv = d / (1.0 + uWarp * r2 * 4.0) + uHoverPos;',
    '  vec2 baseUv = warpedUv * uRepeat + uOffset;',
    '  float a = texture2D(uAlphaMap, vUv).g;',
    // Radial CA (transition peaks) + directional motion trail (velocity-driven)
    // R: trails behind — displaced opposite to motion + radial spread outward
    // G: current position, no displacement
    // B: ghost slightly ahead — displaced in motion direction + radial spread inward
    '  vec2 radial = (vUv - 0.5) * uCA;',
    '  float r = texture2D(uMap, baseUv + radial - uMotionDir).r;',
    '  float g = texture2D(uMap, baseUv).g;',
    '  float b = texture2D(uMap, baseUv - radial + uMotionDir * 0.5).b;',
    '  vec3 srgb = pow(max(vec3(r, g, b), 0.0), vec3(1.0 / 2.2));',
    '  gl_FragColor = vec4(srgb, a * uOpacity);',
    '}',
  ].join('\n');

  // ── Fibonacci sphere distribution ──────────────────────────────────────────
  function fibSpherePos(i, total, radius) {
    const phi = Math.acos(1 - 2 * (i + 0.5) / total);
    const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);
    return new THREE.Vector3(
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta),
    );
  }

  // ── Camera Z for arc phase ──────────────────────────────────────────────────
  // Set camera Z so that at z=0 frustum height = H, making 1 world unit = 1 CSS pixel
  function arcCamZ() {
    return H / (2 * Math.tan(Math.PI / 6)); // fov=60, half-angle=30°
  }

  // ── Grid layout (9×5 = 45 cards, sized to fit viewport) ───────────────────
  function computeGridLayout() {
    if (cards.length === 0) return;
    // Desktop/tablet: cards fill viewport width via W/GRID_COLS; gaps push grid
    // off-screen by design (cards on the side overflow as a "more cards beyond" cue).
    // Mobile: fit the grid within the viewport exactly — solve cardW so that
    // GRID_COLS*cardW + (GRID_COLS-1)*cardW*GRID_GAP_RATIO == W. No overflow.
    const isMobile = (currentBPName === 'mobile');
    gridCardW = isMobile
      ? W / (GRID_COLS + (GRID_COLS - 1) * GRID_GAP_RATIO)
      : W / GRID_COLS;
    const gridGap = gridCardW * GRID_GAP_RATIO;
    const gridCardH = gridCardW / CARD_ASPECT;
    const totalW = GRID_COLS * gridCardW + (GRID_COLS - 1) * gridGap;
    const totalH = GRID_ROWS * gridCardH + (GRID_ROWS - 1) * gridGap;
    // Column-major layout: i=0 → col 8 row 4 (lower-right), then sweeps bottom-to-top
    // within each column, moving right-to-left. Adjacent arc cards land in the same column.
    for (let i = 0; i < cards.length; i++) {
      const col = GRID_COLS - 1 - Math.floor(i / GRID_ROWS);
      const row = GRID_ROWS - 1 - (i % GRID_ROWS);
      const gx = -totalW / 2 + col * (gridCardW + gridGap) + gridCardW / 2;
      const gy = totalH / 2 - row * (gridCardH + gridGap) - gridCardH / 2;
      const tilt = gridTilts[i] || 0;
      cards[i].gridPos = new THREE.Vector3(gx, gy, 0);
      cards[i].gridScale = gridCardW / CARD_W_SPHERE;
      cards[i].gridTilt = tilt;
      cards[i].gridQuat = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, tilt));
      cards[i].gridCol = col;
      cards[i].gridRow = row;
    }
  }

  // ── Texture loading ────────────────────────────────────────────────────────
  // file:// security notes:
  //   • Three.js TextureLoader sets img.crossOrigin='anonymous' → CORS mode →
  //     Chrome rejects file:// origins → img.onerror fires → fallback colors.
  //   • new THREE.Texture(imgElement) → gl.texImage2D(img) → Chrome SecurityError
  //     for file:// img elements → crashes tick → blank screen.
  //   • SOLUTION: draw img onto a 2D canvas (no origin restriction) then wrap with
  //     THREE.CanvasTexture. Canvas texImage2D is allowed for same-origin content.
  //     If drawImage also fails, the onerror fallback paints a dark placeholder.
  function loadAllTextures(onDone) {
    let loaded = 0;
    textures = new Array(N_TOTAL);

    function makeCanvas(w, h, color) {
      const cv = document.createElement('canvas');
      cv.width = w || 4; cv.height = h || 6;
      const ctx2 = cv.getContext('2d');
      ctx2.fillStyle = color || '#555';
      ctx2.fillRect(0, 0, cv.width, cv.height);
      return cv;
    }

    function done(i, tex) {
      tex.colorSpace = THREE.SRGBColorSpace;
      // Cover-fit: crop the texture so its native aspect isn't stretched to the portrait card plane.
      // Source images vary (square-ish to portrait); the plane is fixed at 456:631 ≈ 0.722.
      const imgW = (tex.image && tex.image.width) || 1;
      const imgH = (tex.image && tex.image.height) || 1;
      const imgAspect = imgW / imgH;
      const planeAspect = CARD_W_SPHERE / CARD_H_SPHERE; // 0.722
      if (imgAspect > planeAspect) {
        // Image wider than plane → crop left/right, keep center
        tex.repeat.x = planeAspect / imgAspect;
        tex.offset.x = (1 - tex.repeat.x) / 2;
      } else if (imgAspect < planeAspect) {
        // Image taller than plane → crop top/bottom, keep center
        tex.repeat.y = imgAspect / planeAspect;
        tex.offset.y = (1 - tex.repeat.y) / 2;
      }
      // Store aspect data so buildCards() can set per-card sphere scale + UV lerp start values.
      // sphereScaleX: how much to stretch card width so it shows native ratio on the sphere.
      // arcRepeat/Offset: the cover-crop UV values applied above (lerp start for fold morph).
      cardTexData[i] = {
        sphereScaleX: imgAspect / planeAspect,
        arcRepeatX: tex.repeat.x,
        arcRepeatY: tex.repeat.y,
        arcOffsetX: tex.offset.x,
        arcOffsetY: tex.offset.y,
      };
      textures[i] = tex;
      loaded++;
      if (loaded === N_TOTAL) onDone();
    }

    function tryLoad(i) {
      const img = new Image();
      img.onload = function () {
        const cw = img.naturalWidth || 512;
        const ch = img.naturalHeight || 512;
        const cv = makeCanvas(cw, ch, '#555');
        let usedCv = cv;
        try {
          cv.getContext('2d').drawImage(img, 0, 0);
          // Verify canvas is not tainted (throws SecurityError on file:// if cross-origin)
          cv.getContext('2d').getImageData(0, 0, 1, 1);
        } catch (e) {
          // Canvas is tainted — use a fresh untainted fallback so gl.texImage2D won't crash
          usedCv = makeCanvas(cw, ch, '#444');
        }
        done(i, new THREE.CanvasTexture(usedCv));
      };
      img.onerror = function () {
        done(i, new THREE.CanvasTexture(makeCanvas(4, 6, '#555')));
      };
      img.src = getCardMetadata(i).img; // no crossOrigin — needed so img.onload fires
    }

    for (let i = 0; i < N_TOTAL; i++) {
      tryLoad(i);
    }
  }

  // ── Build scene geometry ────────────────────────────────────────────────────
  function buildCards() {
    sphereGroup = new THREE.Group();
    scene.add(sphereGroup);
    cards = [];

    const roundedMask = createRoundedMask();

    for (let i = 0; i < N_TOTAL; i++) {
      // cardTexData is fully populated by the time buildCards() fires (called from onDone)
      const ctd = cardTexData[i] || {};
      const sScaleX = ctd.sphereScaleX !== undefined ? ctd.sphereScaleX : 1;

      const geo = new THREE.PlaneGeometry(CARD_W_SPHERE, CARD_H_SPHERE, 1, 1);
      var mat;
      if (CA_ENABLED) {
        mat = new THREE.ShaderMaterial({
          uniforms: {
            uMap: { value: textures[i] },
            uAlphaMap: { value: roundedMask },
            uOpacity: { value: 0 },
            uCA: { value: 0 },
            uRepeat: {
              value: new THREE.Vector2(
                ctd.arcRepeatX !== undefined ? ctd.arcRepeatX : 1,
                ctd.arcRepeatY !== undefined ? ctd.arcRepeatY : 1,
              ),
            },
            uOffset: {
              value: new THREE.Vector2(
                ctd.arcOffsetX !== undefined ? ctd.arcOffsetX : 0,
                ctd.arcOffsetY !== undefined ? ctd.arcOffsetY : 0,
              ),
            },
            uMotionDir: { value: new THREE.Vector2(0, 0) },
            uWarp: { value: 0 },
            uHoverPos: { value: new THREE.Vector2(0.5, 0.5) },
          },
          vertexShader: CARD_VERT,
          fragmentShader: CARD_FRAG,
          side: THREE.DoubleSide,
          transparent: true,
          depthTest: true,
          depthWrite: false,
        });
        // Proxy material properties → uniforms so tick loop code works without modification.
        // IIFE captures `mat` by value per iteration (var is function-scoped; closures share
        // the same binding without it — all proxies would reference the last material created).
        // needsUpdate setter is suppressed — uniform texture swaps don't require shader relink.
        !(function (m) {
          Object.defineProperty(m, 'opacity', { get() { return m.uniforms.uOpacity.value; }, set(v) { m.uniforms.uOpacity.value = v; } });
          Object.defineProperty(m, 'alphaMap', { get() { return m.uniforms.uAlphaMap.value; }, set(v) { m.uniforms.uAlphaMap.value = v; } });
          Object.defineProperty(m, 'map', { get() { return m.uniforms.uMap.value; }, set(v) { m.uniforms.uMap.value = v; } });
          Object.defineProperty(m, 'needsUpdate', { get() { return false; }, set() {} });
        }(mat));
      } else {
        mat = new THREE.MeshBasicMaterial({
          map: textures[i],
          alphaMap: roundedMask,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0,
          alphaTest: 0.0,
          depthTest: true,
          depthWrite: false,
        });
      }
      const mesh = new THREE.Mesh(geo, mat);
      mesh.renderOrder = N_VISIBLE - i;
      sphereGroup.add(mesh);

      // Sphere target position (Fibonacci)
      const sp = fibSpherePos(i, N_TOTAL, SPHERE_R);

      // Sphere orientation: face center + random z-rotation
      const m = new THREE.Matrix4().lookAt(sp, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1, 0));
      const sq = new THREE.Quaternion().setFromRotationMatrix(m);
      const rz = (Math.random() - 0.5) * 0.5;
      sq.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), rz));

      // Column-major mapping (matches computeGridLayout)
      // ctd / sScaleX already declared above (before material creation)
      cards.push({
        mesh,
        spherePos: sp,
        sphereQuat: sq,
        gridPos: new THREE.Vector3(),
        gridScale: 1,
        gridTilt: 0,
        gridQuat: new THREE.Quaternion(),
        gridCol: GRID_COLS - 1 - Math.floor(i / GRID_ROWS),
        gridRow: GRID_ROWS - 1 - (i % GRID_ROWS),
        peelJitter: Math.random(),
        sphereScaleX: sScaleX,
        arcRepeatX: ctd.arcRepeatX !== undefined ? ctd.arcRepeatX : 1,
        arcRepeatY: ctd.arcRepeatY !== undefined ? ctd.arcRepeatY : 1,
        arcOffsetX: ctd.arcOffsetX !== undefined ? ctd.arcOffsetX : 0,
        arcOffsetY: ctd.arcOffsetY !== undefined ? ctd.arcOffsetY : 0,
        arcMask: roundedMask,
        sphereMask: getSphereMask(sScaleX),
        hoverT: 0, // eased 0→1 hover progress (sphere phase only)
        hoverTarget: 0, // instant 0|1 set by onHover() raycast
        hoverUV: new THREE.Vector2(0.5, 0.5), // cursor position on card in UV space
      });
    }
    // Seed per-card random tilts once so they stay stable across resize
    gridTilts = [];
    for (let ti = 0; ti < N_TOTAL; ti++) {
      gridTilts.push((Math.random() - 0.5) * 0.175); // ±5° in radians
    }
    computeGridLayout();
  }

  // ── Drag + click ───────────────────────────────────────────────────────────
  function onPointerDown(e) {
    if (modalIdx >= 0) return; // modal open — don't drag the globe
    isDragging = true;
    lastMX = e.clientX; lastMY = e.clientY;
    dragVelX = dragVelY = 0;
    pointerDownX = e.clientX;
    pointerDownY = e.clientY;
    pointerDownT = Date.now();
  }
  function onPointerMove(e) {
    if (!isDragging) return;
    dragVelX = Math.max(-MAX_VEL, Math.min(MAX_VEL, (e.clientX - lastMX) * DRAG_SENSITIVITY));
    dragVelY = Math.max(-MAX_VEL, Math.min(MAX_VEL, -(e.clientY - lastMY) * DRAG_SENSITIVITY));
    lastMX = e.clientX; lastMY = e.clientY;
  }
  function onPointerUp(e) {
    const wasDragging = isDragging;
    isDragging = false;
    if (!wasDragging) return;
    // Click vs drag thresholds — tuned for both mouse and touch.
    // 10px / 500ms is generous enough for fingertip taps (which can jitter 8–15px)
    // while still distinguishing from intentional drag gestures.
    const dx = Math.abs(e.clientX - pointerDownX);
    const dy = Math.abs(e.clientY - pointerDownY);
    const dt = Date.now() - pointerDownT;
    if (dx < 10 && dy < 10 && dt < 500 && sphereFormTAtLastTick >= SPHERE_INTERACTIVE_T && modalIdx < 0) {
      handleCardClick(e);
    }
  }

  // ── Card click → modal ────────────────────────────────────────────────────
  // sphereFormT is computed inside tick(); cache it so the click handler (which fires
  // between ticks) knows whether the sphere is in the clickable state.
  var sphereFormTAtLastTick = 0;

  function handleCardClick(e) {
    if (!renderer || !camera) return;
    const canvas = renderer.domElement;
    const rect = canvas.getBoundingClientRect();
    mouseNDC.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouseNDC.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouseNDC, camera);
    const meshes = cards.map((c) => c.mesh);
    const hits = raycaster.intersectObjects(meshes, false);
    if (hits.length > 0) {
      const hitMesh = hits[0].object;
      for (let i = 0; i < cards.length; i++) {
        if (cards[i].mesh === hitMesh) {
          openCardModal(i, e.clientX, e.clientY);
          break;
        }
      }
    }
  }

  // ── Hover cursor ──────────────────────────────────────────────────────────
  function onHover(e) {
    if (!renderer || !camera) return;
    const canvas = renderer.domElement;
    // Only show pointer + run hover state during sphere + zoom phases.
    // When out of sphere phase, clear ALL hoverTargets so the ease-out kicks in.
    if (sphereFormTAtLastTick < SPHERE_INTERACTIVE_T || modalIdx >= 0) {
      canvas.style.cursor = '';
      for (let ci = 0; ci < cards.length; ci++) cards[ci].hoverTarget = 0;
      return;
    }
    const rect = canvas.getBoundingClientRect();
    mouseNDC.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouseNDC.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouseNDC, camera);
    const meshes = cards.map((c) => c.mesh);
    const hits = raycaster.intersectObjects(meshes, false);
    canvas.style.cursor = hits.length > 0 ? 'pointer' : '';

    // First-hit mesh is the front-most card. Set its hoverTarget to 1, clear all others.
    // Also capture the UV at the cursor — the shader anchors its fisheye warp at this point.
    const hitMesh = hits.length > 0 ? hits[0].object : null;
    const hitUV = hits.length > 0 ? hits[0].uv : null;
    for (let i = 0; i < cards.length; i++) {
      const isHit = (cards[i].mesh === hitMesh);
      cards[i].hoverTarget = isHit ? 1 : 0;
      if (isHit && hitUV) cards[i].hoverUV.copy(hitUV);
    }
  }

  // Compute target world position/quaternion/scale for the modal-active card.
  // Card is always 75% of viewport height; width follows the image's native aspect ratio
  // via sphereScaleX so portrait, square, and landscape assets all appear undistorted.
  // Width is clamped to 92vw so very wide landscape cards don't overflow on narrow screens.
  // Recomputed per-frame so it stays anchored even if the camera is still moving.
  function computeModalTarget(outPos, outQuat, outScale, cardOverride) {
    // cardOverride: if provided, compute target for THIS card (used by the
    // swipe-neighbors logic to position prev/next at offset slots). Defaults to
    // the active modalCard.
    const card = cardOverride || modalCard;
    const camZ = camera.position.z;
    const dist = 16.4;

    // How many CSS pixels = 1 world unit at 'dist' from the perspective camera (FOV 60°).
    const pxPerWorld = H / (2 * dist * Math.tan(Math.PI / 6));

    // Mobile: top-left lock at (8,8). Asset height is COMPUTED so a 24px gap
    //   sits between asset bottom and the nav-arrow row, and another 24px below
    //   the nav arrows before the info panel (whose natural height was measured
    //   in openCardModal). Width is proportional via sphereScaleX (aspect kept).
    // Desktop: centered horizontally, slight upward bias, width clamped to 92% W.
    const isMobile = (currentBPName === 'mobile');
    const sScaleX = (card && card.sphereScaleX) ? card.sphereScaleX : 1;
    let scaleY; let
      scaleX;

    if (isMobile) {
      // Mobile: VISIBLE asset always fills width = (viewport - 16px), 8px margins each side.
      // Height follows native aspect ratio (sphereScaleX × CARD_ASPECT).
      //
      // SDF math: the modal shader rounds the geometry by uRadius (= 22/631) in
      // normalized units where height = 1. In screen pixels the inset is uniform
      // = uRadius × cardHPx on ALL four sides. So:
      //   visible_width  = cardWPx − 2·uRadius·cardHPx
      //   visible_height = cardHPx − 2·uRadius·cardHPx = cardHPx · (1 − 2·uRadius)
      // Substituting cardHPx = cardWPx / uAspect and solving for cardWPx:
      //   visible_width = cardWPx · (1 − 2·uRadius / uAspect)
      //   cardWPx = visible_width / (1 − 2·uRadius / uAspect)
      const INSET = 8;
      const SDF_RADIUS = 22.0 / 631.0;
      var uAspect = CARD_ASPECT * sScaleX;

      const visibleWidthPx = W - 2 * INSET;
      const cardWPx = visibleWidthPx / (1 - 2 * SDF_RADIUS / uAspect);
      const cardHPx = cardWPx / uAspect;

      scaleX = cardWPx / (CARD_W_SPHERE * pxPerWorld);
      scaleY = scaleX / sScaleX;

      // Position GEOMETRY corner offset by the SDF inset so the VISIBLE top-left
      // corner of the rendered rounded rectangle lands at exactly (INSET, INSET).
      // Asset height grows with portrait aspect — may overlap the info panel area
      // for very tall sources; this is the accepted trade-off for symmetric margins.
      const visibleInsetPx = SDF_RADIUS * cardHPx;
      const centerScreenX = (INSET - visibleInsetPx) + cardWPx / 2;
      const centerScreenY = (INSET - visibleInsetPx) + cardHPx / 2;
      const worldX = (centerScreenX - W / 2) / pxPerWorld;
      const worldY = (H / 2 - centerScreenY) / pxPerWorld; // screen Y is top→bottom; world Y is bottom→top
      outPos.set(worldX, worldY, camZ - dist);
    } else {
      // Desktop / tablet — image is centered in the viewport. The info panel
      // is anchored to bottom-right of viewport (positioned by chrome logic),
      // so the image no longer pairs horizontally with the info panel.
      //
      // Sizing rules:
      //   - Portrait / 1x1 (uAspect ≤ 1): fill viewport height minus 24px top
      //       + 24px bottom margins. Image grows as large as the aspect lets it.
      //       Cap horizontally to the chevron-bounded width so the image never
      //       extends under the chevron columns.
      //   - Landscape (uAspect > 1): keep the 80/80 vertical padding (height
      //       isn't the limiting factor for landscape anyway). Cap horizontally
      //       to the chevron-bounded width.
      //
      // Image is centered at viewport center (W/2, H/2) for all aspects so the
      // nav arrows (centered at mid-viewport) align with image middle.
      var uAspect = CARD_ASPECT * sScaleX;
      const availW = W - 2 * DT_GROUP_PAD_H;

      let imgH; let
        imgW;
      if (uAspect <= 1) {
        // Portrait / square: height-first.
        imgH = H - 2 * DT_PORTRAIT_VPAD;
        imgW = imgH * uAspect;
      } else {
        // Landscape: width-driven, but capped by 80/80 vertical padding.
        imgH = H - DT_IMG_PAD_T - DT_IMG_PAD_B;
        imgW = imgH * uAspect;
      }
      if (imgW > availW) {
        imgW = Math.max(1, availW);
        imgH = imgW / uAspect;
      }

      scaleY = imgH / (CARD_H_SPHERE * pxPerWorld);
      scaleX = scaleY * sScaleX;

      // Image centered at viewport center, both axes → world (0, 0, camZ-dist).
      outPos.set(0, 0, camZ - dist);
    }
    outQuat.identity();
    outScale.set(scaleX, scaleY, 1.0);
  }

  // Projects the modal card's screen-space bounds and positions the chrome elements
  // (close button, info panel, nav buttons) to align with the card's visible area.
  // Called every frame when modal is open so elements stay locked to the card.
  function positionModalChrome() {
    const chromeEl = document.getElementById('card-modal-chrome');
    if (!chromeEl || !camera) return;
    const infoEl = chromeEl.querySelector('.card-modal__info');
    const closeEl = chromeEl.querySelector('.card-modal__close');
    const prevEl = chromeEl.querySelector('.card-modal__nav--prev');
    const nextEl = chromeEl.querySelector('.card-modal__nav--next');

    const tgtPos = new THREE.Vector3();
    const tgtQuat = new THREE.Quaternion();
    const tgtScale = new THREE.Vector3();
    computeModalTarget(tgtPos, tgtQuat, tgtScale);

    const halfH = CARD_H_SPHERE * tgtScale.y * 0.5;
    const halfW = CARD_W_SPHERE * tgtScale.x * 0.5;

    if (!_chromeProjV) _chromeProjV = new THREE.Vector3();
    const pv = _chromeProjV;

    // Project card edges to screen pixels
    pv.set(0, tgtPos.y + halfH, tgtPos.z).project(camera);
    const cardTopPx = (1 - pv.y) * 0.5 * H;

    pv.set(0, tgtPos.y - halfH, tgtPos.z).project(camera);
    const cardBotPx = (1 - pv.y) * 0.5 * H;

    pv.set(tgtPos.x - halfW, tgtPos.y, tgtPos.z).project(camera);
    const cardLeftPx = (pv.x + 1) * 0.5 * W;

    pv.set(tgtPos.x + halfW, tgtPos.y, tgtPos.z).project(camera);
    const cardRightPx = (pv.x + 1) * 0.5 * W;

    // Clamp to visible viewport (card may bleed off edges at large scale)
    const visTop = Math.max(0, cardTopPx);
    const visBot = Math.min(H, cardBotPx);
    const visLeft = Math.max(0, cardLeftPx);
    const visRight = Math.min(W, cardRightPx);

    // The SDF shader insets the visual card boundary by uRadius * card_height_px from the
    // geometry bounds. INSET accounts for that so chrome elements have 24px of *visible*
    // card (rendered photo) around them — not just geometry.
    const SDF_RADIUS_PX = (22.0 / 631.0) * (cardBotPx - cardTopPx);
    const INSET = 24 + Math.round(SDF_RADIUS_PX);

    const isMobile = (currentBPName === 'mobile');

    if (isMobile) {
      // ── Mobile layout ──
      //   Close button → top-right of viewport (16px inset)
      //   Nav arrows → bottom-left & bottom-right of viewport (16px inset)
      //   Info panel → bottom-anchored, bottom edge 16px above nav arrow tops
      //   Asset (computed in computeModalTarget) → top-left with 24px gap to info top
      const EDGE = 16; const NAV_H = 44; const
        INFO_TO_NAV_GAP = 16;

      if (closeEl) {
        closeEl.style.position = 'absolute';
        closeEl.style.top = `${EDGE}px`;
        closeEl.style.right = `${EDGE}px`;
        closeEl.style.bottom = 'auto';
        closeEl.style.left = 'auto';
      }

      // Nav arrows: bottom corners
      if (prevEl) {
        prevEl.style.position = 'absolute';
        prevEl.style.bottom = `${EDGE}px`;
        prevEl.style.left = `${EDGE}px`;
        prevEl.style.top = 'auto';
        prevEl.style.right = 'auto';
      }
      if (nextEl) {
        nextEl.style.position = 'absolute';
        nextEl.style.bottom = `${EDGE}px`;
        nextEl.style.right = `${EDGE}px`;
        nextEl.style.top = 'auto';
        nextEl.style.left = 'auto';
      }

      // Info panel: bottom-anchored. Bottom edge = (nav bottom edge + nav height + gap).
      // Math: nav bottom = 16, nav top = 16 + 44 = 60 from viewport bottom.
      //       info bottom = 60 + 16 = 76 from viewport bottom (16px above nav tops).
      // Panel left/right edges sit at 8px (matching the asset's 8px viewport margins),
      // so panel width = asset visible width = (viewport - 16).
      if (infoEl) {
        const infoBottomPx = EDGE + NAV_H + INFO_TO_NAV_GAP;
        infoEl.style.position = 'absolute';
        infoEl.style.bottom = `${infoBottomPx}px`;
        infoEl.style.top = 'auto';
        infoEl.style.left = '8px';
        infoEl.style.right = '8px';
        infoEl.style.width = 'auto';
        infoEl.style.minHeight = ''; // clear desktop value if responsive resize happened
      }
    } else {
      // ── Desktop / tablet: info OVERLAID on the image's lower area ──
      // DELIBERATE DIVERGENCE FROM THE PROTOTYPE (hub-creative/offer-globe.js
      // anchored a fixed-width info panel to the viewport's bottom-right). The
      // authored card images are portrait, so a viewport-anchored panel landed
      // in the empty space beside the centered image. Per design, the role /
      // name / description / badges now overlay the lower portion of the image
      // itself, with a CSS gradient scrim on .card-modal__info for legibility.
      // All chrome is anchored to the image's projected bounds, not the
      // viewport. See README.md / PROGRESS.md (modal layout note).
      //
      // visTop/visBot/visLeft/visRight (clamped image bounds) and INSET (24px +
      // SDF rounded-corner radius) were computed above. Inset keeps overlaid
      // chrome on the photo, not over the transparent rounded corner.
      const imgLeft = visLeft + INSET;
      const imgRight = visRight - INSET;
      const imgTop = visTop + INSET;
      const imgBot = visBot - INSET;
      const imgInnerW = Math.max(1, imgRight - imgLeft);
      const imageMidY = (visTop + visBot) / 2;

      // Info panel: overlaid on the image, left-aligned, spanning the image's
      // inner width, bottom edge at the image's lower inset. Auto height.
      if (infoEl) {
        infoEl.style.position = 'absolute';
        infoEl.style.top = 'auto';
        infoEl.style.bottom = `${H - imgBot}px`;
        infoEl.style.left = `${imgLeft}px`;
        infoEl.style.right = 'auto';
        infoEl.style.width = `${imgInnerW}px`;
        infoEl.style.minHeight = '';
      }

      // Close button: top-right corner of the image.
      if (closeEl) {
        closeEl.style.position = 'absolute';
        closeEl.style.top = `${imgTop}px`;
        closeEl.style.right = `${W - imgRight}px`;
        closeEl.style.bottom = 'auto';
        closeEl.style.left = 'auto';
      }

      // Nav arrows: in the margin OUTSIDE the image's left/right edges (in the
      // dark backdrop area, not over the photo), vertically centered on the
      // image. Clamped to a 16px viewport inset so they never run off-screen
      // when the image is wide.
      const NAV_GAP = 24;
      const navTop = imageMidY - DT_NAV_W / 2;
      if (prevEl) {
        prevEl.style.position = 'absolute';
        prevEl.style.top = `${navTop}px`;
        prevEl.style.left = `${Math.max(16, visLeft - NAV_GAP - DT_NAV_W)}px`;
        prevEl.style.right = 'auto';
        prevEl.style.bottom = 'auto';
      }
      if (nextEl) {
        nextEl.style.position = 'absolute';
        nextEl.style.top = `${navTop}px`;
        nextEl.style.left = `${Math.min(visRight + NAV_GAP, W - 16 - DT_NAV_W)}px`;
        nextEl.style.right = 'auto';
        nextEl.style.bottom = 'auto';
      }

      // Counter: just below the image, left-aligned with it (clamped on screen).
      const counterEl = chromeEl.querySelector('.card-modal__counter');
      if (counterEl) {
        counterEl.style.position = 'absolute';
        counterEl.style.top = `${Math.min(visBot + 8, H - 28)}px`;
        counterEl.style.left = `${imgLeft}px`;
        counterEl.style.right = 'auto';
        counterEl.style.bottom = 'auto';
        counterEl.style.transform = '';
      }
    }

    // Chrome fade + slide-up: driven by modalChromeFadeT (0→1 after card is 90% settled).
    // transition:none during the reveal so JS animation isn't fought by CSS hover transitions.
    const cFade = easeOutCubic(modalChromeFadeT);
    const cShift = Math.round((1 - cFade) * 8);
    const cTrans = modalChromeFadeT >= 1 ? '' : 'none';
    [infoEl, closeEl, prevEl, nextEl].forEach((el) => {
      if (!el) return;
      el.style.opacity = String(cFade);
      el.style.transform = modalChromeFadeT >= 1 ? '' : (`translateY(${cShift}px)`);
      el.style.transition = cTrans;
    });
  }

  // Tracks when the modal was last opened. Used by closeCardModal to suppress the
  // synthetic 'click' event that browsers dispatch on touch interactions after
  // pointerup — that click lands on the newly-visible backdrop and would
  // immediately close the just-opened modal.
  let _modalOpenedAt = 0;
  // setTimeout ID for the close-finalize cleanup (removes is-visible / modal-open
  // / restarts Lenis after MODAL_ANIM_DURATION). Tracked so that opening a NEW
  // modal before the timeout fires can cancel it — otherwise a stale timeout
  // would yank the just-opened modal's classes after ~350ms, and the new modal
  // would mysteriously go invisible. See closeCardModal + openCardModal.
  let _closeTimeoutId = null;

  // ── A11y: keyboard navigation ───────────────────────────────────────────
  // Parallel hidden DOM list of buttons that mirror each card on the globe.
  // Tab/Shift+Tab moves through them; focusing a button drives the same hover
  // state on the corresponding WebGL card; Enter/Space opens the modal.
  // Buttons get tabindex=0 only while the sphere is interactive (≥ INTERACTIVE_T
  // and no modal open). Cached and gated via _a11yInteractive so we only iterate
  // when the state actually flips.
  let _galleryBtns = null; // NodeList of buttons (set in setupGlobeGalleryA11y)
  let _a11yInteractive = false; // current tabbable state of the gallery buttons
  // Focus ring (a DOM element positioned each frame to match the focused card's
  // projected screen bounds). Updated in tick when _focusedCardIdx >= 0.
  let _focusRingEl = null;
  let _focusedCardIdx = -1;
  // Pool of corner Vector3s for projection (avoid per-frame allocation).
  let _ringCorners = null;
  let _ringTmpVec = null;
  // Element to restore focus to when modal closes (typically the gallery button
  // that opened the modal, or whatever had focus before mouse-click open).
  let _modalFocusRestoreEl = null;
  // Measured each time a modal is opened on mobile (after populateModal). Used by
  // computeModalTarget to size the asset such that there's a consistent 24px gap
  // between asset bottom and the info panel top, regardless of info content height.
  let _modalInfoHeight = 220;

  // ── Modal warp state (drives fisheye uWarp/uWarpCenter on modal SDF material) ──
  // Updated each tick by either animation phase (opening/closing) or active gesture.
  let _modalWarp = 0;
  const _modalWarpCenter = new THREE.Vector2(0.5, 0.5);
  const MODAL_WARP_OPEN = 0.30; // peak during opening animation (bell curve over aT)
  const MODAL_WARP_CLOSE = 0.30; // peak during closing animation
  const MODAL_WARP_PULL = 0.40; // peak at full pull-down
  const MODAL_WARP_SWIPE = 0.25; // peak at full horizontal swipe

  // ── Desktop split-view modal layout ───────────────────────────────────────
  // Image + info panel are a single group, collectively centered horizontally
  // in the viewport with DT_IMG_INFO_GAP between them. Chrome elements:
  //   - Close: top-right of viewport
  //   - Nav arrows: at viewport LEFT and RIGHT edges (right chevron's right
  //     inset matches the close button's right inset)
  //   - Counter: centered horizontally on viewport
  // (Mobile uses its own stacked layout, unchanged.)
  var DT_INFO_WIDTH = 400; // fixed info panel width on desktop
  const DT_IMG_INFO_GAP = 48; // VISIBLE gap (px) between the image's visible
  //   right edge and the first text character in
  //   the info panel. The positioning math below
  //   compensates for the SDF rounded-corner inset
  //   on the card AND the panel's CSS padding-left
  //   so this constant matches what you measure on
  //   screen.
  const DT_INFO_PADDING_L = 24; // matches .card-modal__info { padding: 0 24px ... }
  var DT_INFO_MARGIN = 24; // info panel's bottom/right margin from viewport edges
  // Symmetric vertical padding so the image's center is always at viewport H/2 —
  // both when the image fills the available height AND when width-constraint
  // shrinks it (otherwise an asymmetric padding pushes the smaller image
  // toward the top). 80px clears both the close button (bot edge at y=62) and
  // the counter (top edge at y=H−68) with ~12px+ breathing room either way.
  // Used for LANDSCAPE assets (uAspect > 1).
  var DT_IMG_PAD_T = 80; // image top padding (from viewport top)
  var DT_IMG_PAD_B = 80; // image bottom padding (from viewport bottom)
  // Tighter vertical padding for portrait / 1x1 (uAspect ≤ 1) — these scale up
  // to fill the viewport height minus 24px top/bottom margins. The info panel
  // is at bottom-right corner, so visual overlap with the image is accepted by
  // design at narrow viewports.
  var DT_PORTRAIT_VPAD = 24;
  var DT_CLOSE_INSET = 24; // close-button inset from viewport top-right
  var DT_NAV_INSET = 24; // nav arrow inset from viewport edges
  //   (right chevron's right inset = close-button right inset)
  var DT_NAV_W = 44; // matches .card-modal__nav width
  var DT_GROUP_PAD_H = DT_NAV_INSET + DT_NAV_W + 20; // 88px — chevron column + breathing
  // room between chevron and the
  // image+info group when group hits
  // its max width

  function _pushModalWarpUniforms() {
    if (!modalCard) return;
    const u = modalCard.mesh.material && modalCard.mesh.material.uniforms;
    if (!u || !u.uWarp || !u.uWarpCenter) return;
    u.uWarp.value = _modalWarp;
    u.uWarpCenter.value.copy(_modalWarpCenter);
  }

  // Map a viewport touch/click position to an approximate UV on the asset.
  // Asset visibly fills nearly the whole viewport on mobile (8px margins),
  // so viewport-fraction ≈ asset UV. Screen Y inverts (top→bottom = UV 1→0).
  function _touchToWarpUV(clientX, clientY, out) {
    out = out || new THREE.Vector2();
    out.x = Math.max(0, Math.min(1, clientX / W));
    out.y = Math.max(0, Math.min(1, 1 - clientY / H));
    return out;
  }

  // ── Swipe-neighbors helpers ───────────────────────────────────────────────
  // Pre-attach prev/next cards to modalScene at world offsets of ±viewport_width
  // so a horizontal swipe reveals them naturally (single CSS transform on the
  // canvas moves all three together — iOS Photos style).

  function _attachCardToModal(card) {
    if (!card || !modalScene) return;
    if (card.mesh.parent === modalScene) return;
    modalScene.attach(card.mesh);
    card.mesh._origMaterial = card.mesh.material;
    card.mesh.material = getModalMaterial(card);
    card.mesh.renderOrder = 0;
    card.mesh.material.depthTest = true;
    // Reset cached SDF uniforms (uOpacity, uWarp, uMotionDir) so stale values
    // from a previous interrupted modal session don't carry over.
    _resetModalMaterialUniforms(card.mesh.material, 1);
  }

  function _detachCardToSphere(card) {
    if (!card || !sphereGroup) return;
    if (card.mesh.parent === sphereGroup) return;
    if (card.mesh._origMaterial) {
      card.mesh.material = card.mesh._origMaterial;
      card.mesh._origMaterial = null;
    }
    sphereGroup.attach(card.mesh);
    _snapCardToSphereSlot(card);
    card.mesh.material.depthTest = true;
    card.mesh.renderOrder = 0;
  }

  // Modal-nav reactivity: compute the spring target that will rotate the sphere
  // partway toward facing the new card's slot, then activate the spring. Called
  // from navigateModal (arrow click) and _commitSwipeNavigation (mobile swipe).
  function _triggerModalNavNudge(newIdx) {
    if (!_sphereRotEuler || !cards[newIdx]) return;
    const newCard = cards[newIdx];
    // World position of new card's slot under the CURRENT sphere rotation.
    const wp = _tmpVec3.copy(newCard.spherePos).applyEuler(_sphereRotEuler);
    // alignDeltaY: rotation around Y that would bring the card's projected XZ
    // position to the +Z axis (facing the camera). Sign: positive Y rotation moves
    // a +X-side card toward +Z, so the delta is -atan2(x, z).
    const alignDeltaY = -Math.atan2(wp.x, wp.z);
    // alignDeltaX: rotation around X that would bring the card's Y component to
    // 0 after the Y alignment. Approximate (Y and X rotations don't commute) but
    // close enough at NUDGE_FACTOR scale.
    const horiz = Math.sqrt(wp.x * wp.x + wp.z * wp.z);
    const alignDeltaX = Math.atan2(wp.y, horiz);
    // Scaled, clamped deltas — subtle nudge that grows with distance but capped.
    const nudgeY = Math.max(-NAV_NUDGE_MAX_Y, Math.min(NAV_NUDGE_MAX_Y, alignDeltaY * NAV_NUDGE_FACTOR));
    const nudgeX = Math.max(-NAV_NUDGE_MAX_X, Math.min(NAV_NUDGE_MAX_X, alignDeltaX * NAV_NUDGE_FACTOR));
    _navNudgeTargetY = sphereRotY + nudgeY;
    _navNudgeTargetX = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, sphereRotX + nudgeX));
    _navNudgeActive = true;
  }

  // Begin the desktop modal-nav cross-warp transition. Old card stays at the
  // modal position with uOpacity easing to 0 and uWarp on a sin bell curve;
  // new card is placed at its own modal target (same screen position, possibly
  // different scale) with uOpacity easing to 1 and the same warp curve. Both
  // render at the same position; renderOrder controls draw order during blend.
  function _startDesktopNavTransition(newIdx) {
    const oldCard = modalCard;
    const newCard = cards[newIdx];
    if (!oldCard || !newCard || !modalScene) return;

    // If a previous transition is mid-flight, finalize it first so we don't
    // leak the old-old card or its material into the wrong state.
    if (_dnNavActive) _completeDesktopNavTransition();

    // Attach new card to modalScene, swap to SDF material, position at modal target.
    modalScene.attach(newCard.mesh);
    newCard.mesh._origMaterial = newCard.mesh.material;
    newCard.mesh.material = getModalMaterial(newCard);
    // Start invisible (uOpacity=0) — animation fades it up to 1 over DN_NAV_DUR.
    // Helper also clears any stale uWarp / uMotionDir from a previous session.
    _resetModalMaterialUniforms(newCard.mesh.material, 0);
    newCard.mesh.material.uniforms.uWarpCenter.value.set(0.5, 0.5);
    newCard.mesh.material.depthTest = true;
    newCard.mesh.renderOrder = 1; // above oldCard during blend

    const tgtPos = new THREE.Vector3();
    const tgtQuat = new THREE.Quaternion();
    const tgtScale = new THREE.Vector3();
    computeModalTarget(tgtPos, tgtQuat, tgtScale, newCard);
    newCard.mesh.position.copy(tgtPos);
    newCard.mesh.quaternion.copy(tgtQuat);
    newCard.mesh.scale.copy(tgtScale);

    // Lock old card warp center to (0.5, 0.5) so the bell curve emanates from center.
    if (oldCard.mesh.material && oldCard.mesh.material.uniforms && oldCard.mesh.material.uniforms.uWarpCenter) {
      oldCard.mesh.material.uniforms.uWarpCenter.value.set(0.5, 0.5);
    }
    oldCard.mesh.renderOrder = 0;

    // Promote the new card to the "active" modalCard. The main modal animation
    // block's 'open' phase will keep it locked at tgtPos. Modal HTML content
    // updates to the new card's data.
    modalIdx = newIdx;
    modalCard = newCard;
    modalPhase = 'open';
    populateModal(newIdx);
    _triggerModalNavNudge(newIdx);

    _dnNavOldCard = oldCard;
    _dnNavNewCard = newCard;
    _dnNavT0 = (typeof performance !== 'undefined' ? performance.now() : Date.now());
    _dnNavActive = true;
  }

  // Finalize the desktop nav transition: detach old card back to the sphere,
  // restore its material, reset uniforms on the new card to clean defaults.
  // Safe to call whether or not the animation reached aT >= 1.
  function _completeDesktopNavTransition() {
    if (!_dnNavActive) return;
    if (_dnNavOldCard) {
      // Reset the cached SDF material's animated uniforms BEFORE swapping back
      // to the basic material. The SDF material persists in card._modalMat —
      // if uOpacity was mid-fade (interrupted nav), it would stay stuck at
      // that value, and the next modal session would show this card ghosted.
      _resetModalMaterialUniforms(_dnNavOldCard._modalMat, 1);
      if (_dnNavOldCard.mesh._origMaterial) {
        _dnNavOldCard.mesh.material = _dnNavOldCard.mesh._origMaterial;
        _dnNavOldCard.mesh._origMaterial = null;
      }
      sphereGroup.attach(_dnNavOldCard.mesh);
      _snapCardToSphereSlot(_dnNavOldCard);
      _dnNavOldCard.mesh.material.depthTest = true;
      _dnNavOldCard.mesh.renderOrder = 0;
    }
    if (_dnNavNewCard) {
      // The new card stays as the active modal card with SDF material; just
      // restore uniforms to a clean "fully visible, no warp" state.
      _resetModalMaterialUniforms(_dnNavNewCard.mesh.material, 1);
      _dnNavNewCard.mesh.renderOrder = 0;
    }
    _dnNavOldCard = null;
    _dnNavNewCard = null;
    _dnNavActive = false;
  }

  // Set a card's local transform to its canonical sphere slot with the current
  // sphere-drag rotation baked in. Used by reparent sites so there's no one-frame
  // flash of an unrotated card before tick()'s sphere block re-applies rotation.
  function _snapCardToSphereSlot(card) {
    if (!card || !card.mesh) return;
    const hasRot = (sphereRotY !== 0 || sphereRotX !== 0);
    if (hasRot && _sphereRotEuler) {
      _sphereRotEuler.set(sphereRotX, sphereRotY, 0, 'YXZ');
      _sphereRotQuat.setFromEuler(_sphereRotEuler);
      card.mesh.position.copy(card.spherePos).applyEuler(_sphereRotEuler);
      card.mesh.quaternion.copy(_sphereRotQuat).multiply(card.sphereQuat);
    } else {
      card.mesh.position.copy(card.spherePos);
      card.mesh.quaternion.copy(card.sphereQuat);
    }
    card.mesh.scale.set(card.sphereScaleX, 1, 1);
  }

  // Position a card in modalScene at slot -1 (left), 0 (center), or +1 (right).
  // Slot 0 = the card's natural top-left-locked target. ±1 = offset by viewport_width.
  function _positionCardInModal(card, slot) {
    if (!card) return;
    const tgtPos = new THREE.Vector3();
    const tgtQuat = new THREE.Quaternion();
    const tgtScale = new THREE.Vector3();
    computeModalTarget(tgtPos, tgtQuat, tgtScale, card);
    const pxPerWorld = H / (2 * 16.4 * Math.tan(Math.PI / 6));
    const viewportWidthWorld = W / pxPerWorld;
    card.mesh.position.set(tgtPos.x + slot * viewportWidthWorld, tgtPos.y, tgtPos.z);
    card.mesh.quaternion.copy(tgtQuat);
    card.mesh.scale.copy(tgtScale);
  }

  // Attach prev/next of the current modalCard to modalScene at offset positions.
  function _prepSwipeNeighbors() {
    if (!modalCard || cards.length < 3) return; // skip if too few cards to have distinct neighbors
    const n = cards.length;
    const prevIdx = (modalIdx - 1 + n) % n;
    const nextIdx = (modalIdx + 1) % n;
    _attachCardToModal(cards[prevIdx]);
    _positionCardInModal(cards[prevIdx], -1);
    _attachCardToModal(cards[nextIdx]);
    _positionCardInModal(cards[nextIdx], 1);
  }

  // Return all non-current cards in modalScene back to sphereGroup.
  function _clearSwipeNeighbors() {
    if (!modalScene || !sphereGroup) return;
    // Iterate a copy of children because detach mutates the list.
    const children = modalScene.children.slice();
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (modalCard && child === modalCard.mesh) continue; // keep the current
      // Find the matching card object
      for (let j = 0; j < cards.length; j++) {
        if (cards[j].mesh === child) { _detachCardToSphere(cards[j]); break; }
      }
    }
  }

  // Swipe-commit world-space swap. direction: +1 = next (swipe left), -1 = prev (swipe right).
  // Called after the CSS transition has settled the canvas at ±viewport_width.
  // Reorganizes modalScene cards so the visual position is identical before/after
  // the canvas reset → no snap.
  function _commitSwipeNavigation(direction) {
    if (!modalCard || !modalScene || cards.length < 3) return;
    if (modalPhase === 'closing') return; // Don't navigate while closing — same reason as navigateModal.
    const n = cards.length;
    const oldIdx = modalIdx;
    const newIdx = (oldIdx + direction + n) % n;
    const oldOppoIdx = (oldIdx - direction + n) % n; // old card on opposite side
    const newFarIdx = (oldIdx + 2 * direction + n) % n; // brand-new neighbor on swipe side

    // 1) Return the opposite-side old neighbor to the sphere.
    _detachCardToSphere(cards[oldOppoIdx]);
    // 2) Old current → becomes new opposite-side neighbor.
    _positionCardInModal(cards[oldIdx], -direction);
    // 3) The chosen neighbor is now the new current.
    modalCard = cards[newIdx];
    modalIdx = newIdx;
    _positionCardInModal(modalCard, 0);
    // 4) Attach the new far neighbor (two steps in the swipe direction).
    _attachCardToModal(cards[newFarIdx]);
    _positionCardInModal(cards[newFarIdx], direction);

    populateModal(newIdx);

    // Sphere reactivity: spring the rotation partway toward facing the new slot.
    _triggerModalNavNudge(newIdx);
  }

  function openCardModal(i, originX, originY) {
    if (!modalEl || !cards[i]) return;
    // Cancel any pending close-finalize timeout from a previous close that
    // hasn't fired yet. Without this, the stale timeout fires mid-open and
    // strips is-visible / modal-open / restarts Lenis on our fresh modal —
    // the user clicks an image and the modal "won't show up."
    if (_closeTimeoutId) {
      clearTimeout(_closeTimeoutId);
      _closeTimeoutId = null;
    }
    _modalOpenedAt = (typeof performance !== 'undefined' ? performance.now() : Date.now());
    // Remember focus origin so we can restore it on close. Skip the modal
    // chrome itself in case openCardModal is called from inside it (shouldn't
    // happen, but defensive).
    const focusedNow = document.activeElement;
    const chromeRoot = document.getElementById('card-modal-chrome');
    _modalFocusRestoreEl = (chromeRoot && chromeRoot.contains(focusedNow)) ? null : focusedNow;
    modalIdx = i;
    modalCard = cards[i];
    // Pin warp center to click origin so the open-animation bulge emanates
    // from where the user tapped (or defaults to ~center if no origin given).
    if (typeof originX === 'number' && typeof originY === 'number') {
      _touchToWarpUV(originX, originY, _modalWarpCenter);
    } else {
      _modalWarpCenter.set(0.5, 0.5);
    }
    _modalWarp = 0; // bell curve in tick ramps it up from 0
    populateModal(i);

    // Measure the info panel's natural height on mobile so computeModalTarget can
    // size the asset such that the 24px gap to info stays consistent across
    // modals with different content lengths. Temporarily position offscreen
    // (visibility:hidden) so the measurement doesn't flash on screen.
    if (currentBPName === 'mobile') {
      const infoMeasureEl = document.querySelector('.card-modal__info');
      if (infoMeasureEl) {
        const savedStyle = infoMeasureEl.style.cssText;
        infoMeasureEl.style.position = 'absolute';
        infoMeasureEl.style.visibility = 'hidden';
        infoMeasureEl.style.top = '0';
        infoMeasureEl.style.bottom = 'auto';
        infoMeasureEl.style.left = '16px';
        infoMeasureEl.style.right = '16px';
        infoMeasureEl.style.width = 'auto';
        _modalInfoHeight = infoMeasureEl.offsetHeight;
        infoMeasureEl.style.cssText = savedStyle;
      }
    }

    // Snapshot the card's current WORLD transform (driven by sphereGroup rotation right now)
    modalCard.mesh.updateWorldMatrix(true, false);
    modalCard.mesh.getWorldPosition(modalStartPos);
    modalCard.mesh.getWorldQuaternion(modalStartQuat);
    modalCard.mesh.getWorldScale(modalStartScale);

    // Reparent into the *modal* scene (separate canvas, above the blur backdrop) so the card
    // stays sharp while the sphere is blurred. world transform preserved via attach().
    if (modalScene) modalScene.attach(modalCard.mesh);
    else scene.attach(modalCard.mesh);

    // Swap to SDF shader material for crisp corners at modal scale (alphaMap pixelates).
    modalCard.mesh._origMaterial = modalCard.mesh.material;
    modalCard.mesh.material = getModalMaterial(modalCard);
    // Reset cached SDF uniforms — protects against stale values left by a
    // previous interrupted nav (e.g., uOpacity stuck mid-fade → ghosted image).
    _resetModalMaterialUniforms(modalCard.mesh.material, 1);

    // Reset depth test/order — modal scene has only this one mesh
    modalCard.mesh.renderOrder = 0;
    modalCard.mesh.material.depthTest = true;
    if (modalCanvasEl) modalCanvasEl.style.display = 'block';

    modalPhase = 'opening';
    modalAnimT0 = (typeof performance !== 'undefined' ? performance.now() : Date.now());

    // Reset chrome reveal so elements start hidden and fade in after card settles.
    modalChromeRevealT0 = -1;
    modalChromeFadeT = 0;

    modalEl.classList.add('is-visible');
    modalEl.setAttribute('aria-hidden', 'false');
    const chromeEl = document.getElementById('card-modal-chrome');
    if (chromeEl) { chromeEl.classList.add('is-visible'); chromeEl.setAttribute('aria-hidden', 'false'); }
    positionModalChrome();
    requestAnimationFrame(() => {
      modalEl.classList.add('is-open');
      if (chromeEl) chromeEl.classList.add('is-open');
      // Move keyboard focus into the modal — close button is the safest default
      // (always present, no destructive default action). Falls back to chromeEl
      // for screen-reader announcement if close button is somehow missing.
      const closeBtn = chromeEl && chromeEl.querySelector('.card-modal__close');
      if (closeBtn) { try { closeBtn.focus(); } catch (e) {} }
    });

    const canvas = renderer && renderer.domElement;
    if (canvas) canvas.classList.add('is-modal-active');
    document.documentElement.classList.add('modal-open');
    document.body.classList.add('modal-open');
    if (window.lenis) window.lenis.stop();

    // Pre-attach prev/next cards to modalScene at offset positions so horizontal
    // swipes reveal the neighbor mid-gesture (iOS Photos style). Mobile only.
    if (currentBPName === 'mobile') _prepSwipeNeighbors();
  }

  function closeCardModal() {
    // Suppress the synthetic 'click' event that fires after touch pointerup —
    // it lands on the just-revealed backdrop and would immediately close the
    // modal we're in the middle of opening. 200ms is well past the synthetic
    // click delay (~50ms) but short enough to not delay legitimate closes.
    const now = (typeof performance !== 'undefined' ? performance.now() : Date.now());
    if (now - _modalOpenedAt < 200) return;
    if (!modalEl || modalIdx < 0 || !modalCard) return;
    // Re-entrancy guard: if a close is already in flight (modalPhase ===
    // 'closing'), additional Escape/backdrop clicks are no-ops. Without this,
    // a second close would re-snapshot modalCloseStartPos mid-animation and
    // jitter the card's return path, plus re-schedule the finalize timeout.
    if (modalPhase === 'closing') return;

    // If a desktop nav transition is still in flight, finalize it first so the
    // outgoing old card returns to its sphere slot cleanly before the close
    // animation starts on the (new) modalCard.
    if (_dnNavActive) _completeDesktopNavTransition();

    // Detach swipe-neighbor cards before the close animation begins so only the
    // current card flies back to the sphere; neighbors return to their slots silently.
    _clearSwipeNeighbors();

    // Blur any focused element inside the modal chrome BEFORE aria-hidden=true gets
    // applied. Without this, the close button (which user just clicked) retains
    // focus → browser blocks aria-hidden + warns in console + can interfere with
    // subsequent pointer event delivery on touch in DevTools device emulation.
    const chromeEl = document.getElementById('card-modal-chrome');
    if (chromeEl && document.activeElement && chromeEl.contains(document.activeElement)) {
      document.activeElement.blur();
    }

    // Snapshot current world transform (the modal target) as the START for the closing animation.
    modalCard.mesh.updateWorldMatrix(true, false);
    modalCard.mesh.getWorldPosition(modalCloseStartPos);
    modalCard.mesh.getWorldQuaternion(modalCloseStartQuat);
    modalCard.mesh.getWorldScale(modalCloseStartScale);

    modalPhase = 'closing';
    modalAnimT0 = (typeof performance !== 'undefined' ? performance.now() : Date.now());

    // Immediately hide chrome elements — they'll hide with the container fade.
    modalChromeRevealT0 = -1;
    modalChromeFadeT = 0;

    modalEl.classList.remove('is-open');
    if (chromeEl) chromeEl.classList.remove('is-open');

    // Defer the page-scroll UNLOCK and aria/visibility cleanup until the close
    // animation completes (MODAL_ANIM_DURATION). Earlier this happened
    // synchronously here, which let the user scroll during the 350ms close
    // animation — sphereFormT would change underneath the in-flight modal card,
    // making its return-to-sphere trajectory chase a moving target.
    //
    // The timeout ID is tracked so openCardModal can cancel it if the user
    // opens a new modal in this 350ms window (otherwise a stale firing would
    // remove the new modal's is-visible / modal-open / Lenis-pause state).
    _closeTimeoutId = setTimeout(() => {
      modalEl.classList.remove('is-visible');
      modalEl.setAttribute('aria-hidden', 'true');
      if (chromeEl) { chromeEl.classList.remove('is-visible'); chromeEl.setAttribute('aria-hidden', 'true'); }
      document.documentElement.classList.remove('modal-open');
      document.body.classList.remove('modal-open');
      if (window.lenis) window.lenis.start();
      // Restore focus to whatever the user had focused before opening the modal
      // (typically the gallery button that opened it for keyboard users).
      if (_modalFocusRestoreEl && document.body.contains(_modalFocusRestoreEl)) {
        try { _modalFocusRestoreEl.focus(); } catch (e) {}
      }
      _modalFocusRestoreEl = null;
      _closeTimeoutId = null;
    }, MODAL_ANIM_DURATION);

    const canvas = renderer && renderer.domElement;
    if (canvas) canvas.classList.remove('is-modal-active');
  }

  function navigateModal(direction) {
    if (modalIdx < 0 || !modalCard) return;
    // Don't navigate while the modal is closing. Otherwise _startDesktopNavTransition
    // would flip modalPhase from 'closing' back to 'open', orphaning the close
    // animation: the in-flight modalCard never reaches aT >= 1, so it's never
    // reparented to sphereGroup, modalCanvasEl stays display:block, and the stale
    // close-finalize timeout still fires — leaving a card floating in modalScene
    // with no surrounding chrome (the "duplicate globe" appearance).
    if (modalPhase === 'closing') return;
    const next = (modalIdx + direction + N_TOTAL) % N_TOTAL;

    // Desktop/tablet: cross-warp transition (old warps in place, new cross-fades
    // over top with matching warp). Mobile keeps its instant-swap flow because
    // its arrow buttons are paired with the live swipe gesture which already
    // provides the warp + slide feel.
    if (currentBPName !== 'mobile') {
      _startDesktopNavTransition(next);
      return;
    }

    // Detach swipe-neighbor cards before swap; they'll be re-prepped at the end
    // for the new modalCard. Mobile only.
    _clearSwipeNeighbors();

    // Return the current card mesh to its slot in the sphere group (instant snap).
    const oldCard = modalCard;
    if (oldCard.mesh._origMaterial) {
      oldCard.mesh.material = oldCard.mesh._origMaterial;
      oldCard.mesh._origMaterial = null;
    }
    sphereGroup.attach(oldCard.mesh);
    _snapCardToSphereSlot(oldCard);
    oldCard.mesh.material.depthTest = true;
    oldCard.mesh.renderOrder = 0;

    // Move the new card into the modal scene and snap it to the target position.
    const newCard = cards[next];
    if (modalScene) modalScene.attach(newCard.mesh);
    else scene.attach(newCard.mesh);
    // Swap to SDF shader material for crisp corners at modal scale.
    newCard.mesh._origMaterial = newCard.mesh.material;
    newCard.mesh.material = getModalMaterial(newCard);
    newCard.mesh.renderOrder = 0;
    newCard.mesh.material.depthTest = true;

    const tgtPos = new THREE.Vector3();
    const tgtQuat = new THREE.Quaternion();
    const tgtScale = new THREE.Vector3();
    computeModalTarget(tgtPos, tgtQuat, tgtScale);
    newCard.mesh.position.copy(tgtPos);
    newCard.mesh.quaternion.copy(tgtQuat);
    newCard.mesh.scale.copy(tgtScale);

    modalIdx = next;
    modalCard = newCard;
    modalPhase = 'open';
    // Chrome stays fully visible during navigation — no animation, instant swap.
    modalChromeRevealT0 = -1;
    modalChromeFadeT = 1;
    populateModal(next);

    // Sphere reactivity: spring the rotation partway toward facing the new slot.
    _triggerModalNavNudge(next);

    // Prep prev/next of the new current for the next swipe gesture.
    if (currentBPName === 'mobile') _prepSwipeNeighbors();
  }

  function populateModal(i) {
    const targetEl = document.getElementById('card-modal-chrome') || modalEl;
    if (!targetEl) return;
    const meta = getCardMetadata(i);
    const imgEl = targetEl.querySelector('.card-modal__image');
    if (imgEl) { imgEl.src = meta.img; imgEl.alt = `${meta.name} — photograph`; }
    const roleLabelEl = targetEl.querySelector('.card-modal__role-label');
    if (roleLabelEl) roleLabelEl.textContent = meta.role || 'Photographer';
    targetEl.querySelector('.card-modal__name').textContent = meta.name;
    targetEl.querySelector('.card-modal__description').textContent = meta.description;
    const counterEl = targetEl.querySelector('.card-modal__counter');
    if (counterEl) counterEl.textContent = `${i + 1}/${N_TOTAL}`;
    const badgesEl = targetEl.querySelector('.card-modal__badges');
    badgesEl.innerHTML = '';
    meta.badges.forEach((b) => {
      const row = document.createElement('div');
      row.className = 'card-modal__badge';
      row.innerHTML = '<div class="card-modal__badge-left">'
          + `<div class="card-modal__badge-icon card-modal__badge-icon--${b.app.id}">${b.app.abbr}</div>`
          + `<span class="card-modal__badge-app">${b.app.name}</span>`
        + '</div>'
        + `<span class="card-modal__badge-role">${b.role}</span>`;
      badgesEl.appendChild(row);
    });
  }

  // Build the hidden focusable button list that mirrors the cards on the globe.
  // Called after buildCards() once card metadata is available. Each button:
  //   - Focusing it sets card.hoverTarget=1 on the corresponding mesh (the WebGL
  //     hover effect — scale + warp — gives sighted keyboard users a visual cue).
  //   - Click/Enter/Space opens the modal at that card.
  //   - aria-label includes photographer name + position so screen readers can
  //     announce "View photo by William Eggleston, 1 of 45".
  // tabindex stays -1 until the sphere is interactive — see the toggle in tick().
  function setupGlobeGalleryA11y() {
    const canvas = document.getElementById('offer-globe-canvas');
    if (!canvas || !canvas.parentNode) return;

    // Remove existing on re-init so we don't double up.
    const existing = document.getElementById('globe-gallery-a11y');
    if (existing && existing.parentNode) existing.parentNode.removeChild(existing);

    const container = document.createElement('div');
    container.id = 'globe-gallery-a11y';
    container.className = 'globe-gallery-a11y';
    container.setAttribute('role', 'region');
    container.setAttribute('aria-label', 'Image gallery');

    const list = document.createElement('ul');
    list.className = 'globe-gallery-a11y__list';

    for (let i = 0; i < N_TOTAL; i++) {
      const meta = getCardMetadata(i);
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'globe-gallery-a11y__btn';
      btn.setAttribute('aria-label', `View photo by ${meta.name}, ${i + 1} of ${N_TOTAL}`);
      btn.dataset.cardIdx = String(i);
      btn.tabIndex = -1; // off until the sphere is interactive
      btn.textContent = `${meta.name}, ${i + 1} of ${N_TOTAL}`;

      (function (idx, btnEl) {
        btnEl.addEventListener('focus', () => {
          // Drive the WebGL hover state on the focused card; clear the rest so
          // there's only ever one hover at a time (matches mouse behavior).
          for (let ci = 0; ci < cards.length; ci++) {
            cards[ci].hoverTarget = (ci === idx ? 1 : 0);
          }
          // Only show the projected focus ring for keyboard focus (matches
          // :focus-visible behavior in CSS — mouse clicks shouldn't display it).
          _focusedCardIdx = idx;
          if (_focusRingEl && btnEl.matches(':focus-visible')) {
            _focusRingEl.classList.add('is-visible');
          }
        });
        btnEl.addEventListener('blur', () => {
          if (cards[idx]) cards[idx].hoverTarget = 0;
          if (_focusedCardIdx === idx) _focusedCardIdx = -1;
          if (_focusRingEl) _focusRingEl.classList.remove('is-visible');
        });
        btnEl.addEventListener('click', () => {
          if (modalIdx >= 0) return;
          if (sphereFormTAtLastTick < SPHERE_INTERACTIVE_T) return;
          // Use viewport center as the click origin so the open-warp emanates
          // from screen center (we don't have a click position from keyboard).
          openCardModal(idx, W / 2, H / 2);
        });
      }(i, btn));

      li.appendChild(btn);
      list.appendChild(li);
    }

    container.appendChild(list);
    canvas.parentNode.appendChild(container);
    _galleryBtns = container.querySelectorAll('.globe-gallery-a11y__btn');
    _a11yInteractive = false;

    // Single focus-ring element that tracks the projected bounding box of
    // whichever card is currently focused. position:fixed so it's relative to
    // the viewport, sized + rounded per-frame in tick().
    if (!_focusRingEl) {
      _focusRingEl = document.createElement('div');
      _focusRingEl.className = 'globe-gallery-a11y__focus-ring';
      _focusRingEl.setAttribute('aria-hidden', 'true');
      document.body.appendChild(_focusRingEl);
    }
    // Pre-allocate projection scratch (4 corners + 1 tmp) — reused each frame
    // so the focus-ring update doesn't allocate.
    if (!_ringCorners && typeof THREE !== 'undefined') {
      _ringCorners = [
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
      ];
      _ringTmpVec = new THREE.Vector3();
    }
    _focusedCardIdx = -1;
  }

  function setupModal() {
    modalEl = document.getElementById('card-modal');
    if (!modalEl) return;
    raycaster = new THREE.Raycaster();
    mouseNDC = new THREE.Vector2();
    modalStartPos = new THREE.Vector3();
    modalStartQuat = new THREE.Quaternion();
    modalStartScale = new THREE.Vector3();
    modalCloseStartPos = new THREE.Vector3();
    modalCloseStartQuat = new THREE.Quaternion();
    modalCloseStartScale = new THREE.Vector3();
    _sphereRotEuler = new THREE.Euler(0, 0, 0, 'YXZ');
    _sphereRotQuat = new THREE.Quaternion();
    _foldRotQuat = new THREE.Quaternion();
    _tmpVec3 = new THREE.Vector3();
    // Chrome div hosts the interactive elements (close, nav, info) above the WebGL card canvas.
    const chromeEl = document.getElementById('card-modal-chrome');
    const evtRoot = chromeEl || modalEl;
    evtRoot.querySelector('.card-modal__close').addEventListener('click', closeCardModal);
    evtRoot.querySelector('.card-modal__nav--prev').addEventListener('click', () => { navigateModal(-1); });
    evtRoot.querySelector('.card-modal__nav--next').addEventListener('click', () => { navigateModal(1); });
    modalEl.querySelector('.card-modal__backdrop').addEventListener('click', closeCardModal);
    document.addEventListener('keydown', (e) => {
      if (modalIdx < 0) return;
      if (e.key === 'Escape') closeCardModal();
      if (e.key === 'ArrowLeft') navigateModal(-1);
      if (e.key === 'ArrowRight') navigateModal(1);
      // Block keyboard scroll keys (PageUp/Down, Home/End, Space, ArrowUp/Down)
      // while modal is open so the globe doesn't scroll/zoom behind the modal.
      // Space is exempted when focus is inside the modal chrome — Space should
      // activate a focused button (e.g., close), not be blocked.
      const chromeRoot = document.getElementById('card-modal-chrome');
      const focusInChrome = chromeRoot && chromeRoot.contains(document.activeElement);
      if (e.key === 'PageUp' || e.key === 'PageDown'
          || e.key === 'Home' || e.key === 'End'
          || e.key === 'ArrowUp' || e.key === 'ArrowDown'
          || (e.key === ' ' && !focusInChrome)) {
        e.preventDefault();
      }
      // Focus trap: when Tab/Shift+Tab would leave the modal chrome, wrap
      // around to the other end so focus stays inside the modal.
      if (e.key === 'Tab' && chromeRoot) {
        const focusables = chromeRoot.querySelectorAll('button:not([disabled])');
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          try { last.focus(); } catch (err) {}
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          try { first.focus(); } catch (err) {}
        }
      }
    });

    // ── Mobile modal touch gestures: live 1:1 drag with rubber-band release ──
    // Horizontal: asset translates with finger; commit on release if past 25%
    //   viewport OR fast fling → animate off-screen and navigateModal.
    // Vertical (pull-down only): asset translates down + scales down with finger;
    //   commit on release if past 18% viewport OR fast fling → continue motion
    //   and closeCardModal.
    // Implemented via CSS transforms on modal-card-canvas (cheap, GPU-composited)
    // so the chrome (info panel, nav arrows, close, counter) stays put — matches
    // iOS Photos UX where only the asset moves during the gesture.
    let _swStartX = 0; let
      _swStartY = 0;
    let _swLastX = 0; let _swLastY = 0; let
      _swLastT = 0;
    let _swAxis = null; // 'x' | 'y' | null (locks after first significant move)
    let _swActive = false;
    let _swVelX = 0; let
      _swVelY = 0;
    const AXIS_LOCK_PX = 10;
    const COMMIT_DIST_X_FRAC = 0.25; // 25% of viewport width
    const COMMIT_DIST_Y_FRAC = 0.18; // 18% of viewport height
    const COMMIT_VEL_X = 0.4; // px/ms
    const COMMIT_VEL_Y = 0.6;
    const PULL_SCALE_DAMPING = 1600; // larger → less scale change per px pulled
    const PULL_SCALE_MIN = 0.80;

    modalEl.addEventListener('touchstart', (e) => {
      if (currentBPName !== 'mobile') return;
      if (modalIdx < 0) return;
      if (e.touches.length !== 1) return;
      if (!modalCanvasEl) return;
      _swStartX = _swLastX = e.touches[0].clientX;
      _swStartY = _swLastY = e.touches[0].clientY;
      _swLastT = Date.now();
      _swActive = true;
      _swAxis = null;
      _swVelX = 0;
      _swVelY = 0;
      // Capture touch position as warp center (finger-anchored fisheye).
      _touchToWarpUV(_swStartX, _swStartY, _modalWarpCenter);
      // Drag follows finger 1:1 with no animation lag.
      modalCanvasEl.style.transition = 'none';
    }, { passive: true });

    modalEl.addEventListener('touchmove', (e) => {
      if (!_swActive || e.touches.length !== 1) return;
      const x = e.touches[0].clientX;
      const y = e.touches[0].clientY;
      const dx = x - _swStartX;
      const dy = y - _swStartY;

      // Axis lock — first significant movement determines whether this is a
      // horizontal swipe or a vertical pull-down. Prevents diagonal jitter.
      if (_swAxis === null) {
        if (Math.abs(dx) < AXIS_LOCK_PX && Math.abs(dy) < AXIS_LOCK_PX) return;
        _swAxis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
      }

      // Velocity tracking — used for fling detection on touchend.
      const now = Date.now();
      const dt = now - _swLastT;
      if (dt > 0) {
        _swVelX = (x - _swLastX) / dt;
        _swVelY = (y - _swLastY) / dt;
      }
      _swLastX = x; _swLastY = y; _swLastT = now;

      if (_swAxis === 'x') {
        modalCanvasEl.style.transform = `translate3d(${dx}px, 0, 0)`;
        // Horizontal swipe warp: scales with drag distance relative to viewport width.
        // 30% of viewport width = full peak. Capped at MODAL_WARP_SWIPE.
        _modalWarp = Math.min(1, Math.abs(dx) / (window.innerWidth * 0.30)) * MODAL_WARP_SWIPE;
      } else {
        // Pull-down only — upward drag does nothing (clamped to 0).
        const pullY = Math.max(0, dy);
        const scale = Math.max(PULL_SCALE_MIN, 1 - pullY / PULL_SCALE_DAMPING);
        modalCanvasEl.style.transform = `translate3d(0, ${pullY}px, 0) scale(${scale.toFixed(3)})`;
        // Pull-down warp: scales with pull distance relative to viewport height.
        // 20% of viewport height = full peak. Capped at MODAL_WARP_PULL.
        _modalWarp = Math.min(1, pullY / (window.innerHeight * 0.20)) * MODAL_WARP_PULL;
      }
      _pushModalWarpUniforms();
    }, { passive: true });

    modalEl.addEventListener('touchend', (e) => {
      if (!_swActive) return;
      _swActive = false;
      if (!modalCanvasEl || _swAxis === null) { _swAxis = null; return; }
      if (e.changedTouches.length !== 1) return;
      const dx = e.changedTouches[0].clientX - _swStartX;
      const dy = e.changedTouches[0].clientY - _swStartY;

      if (_swAxis === 'x') {
        const commit = Math.abs(dx) > window.innerWidth * COMMIT_DIST_X_FRAC
                  || Math.abs(_swVelX) > COMMIT_VEL_X;
        if (commit) {
          // Animate canvas to translateX(±viewport_width) — that's exactly the
          // offset where the neighbor card lands at viewport center. Then swap
          // world positions in the same task as resetting CSS: the visible
          // result is identical before and after the reset (canvas shift + world
          // shift cancel), so no snap.
          //   swipe LEFT  (dx<0) → swipe direction -1 → +1 navigation (next)
          //   swipe RIGHT (dx>0) → swipe direction +1 → -1 navigation (previous)
          const cssDir = dx < 0 ? -1 : 1; // CSS animates toward swipe direction
          const navDir = -cssDir; // navigateModal direction (next = +1)
          modalCanvasEl.style.transition = 'transform 0.22s cubic-bezier(0.32, 0.72, 0, 1)';
          modalCanvasEl.style.transform = `translate3d(${cssDir * window.innerWidth}px, 0, 0)`;
          setTimeout(() => {
            modalCanvasEl.style.transition = 'none';
            _commitSwipeNavigation(navDir);
            modalCanvasEl.style.transform = '';
          }, 220);
        } else {
          // Rubber-band back to center.
          modalCanvasEl.style.transition = 'transform 0.25s cubic-bezier(0.25, 0.1, 0.25, 1)';
          modalCanvasEl.style.transform = '';
        }
      } else {
        const pullCommit = dy > window.innerHeight * COMMIT_DIST_Y_FRAC
                      || _swVelY > COMMIT_VEL_Y;
        if (pullCommit) {
          // Sync the mesh's WORLD position + scale to match the gesture's visible
          // state (which was driven purely by CSS transform on the canvas), then
          // reset CSS and call closeCardModal. closeCardModal snapshots the current
          // world transform as the close-animation start — so the fly-back to sphere
          // begins from where the user dragged the card, not from center. No snap.
          if (modalCard) {
            const pxPerWorld = H / (2 * 16.4 * Math.tan(Math.PI / 6));
            const pulledY = Math.max(0, dy);
            const gestureScale = Math.max(PULL_SCALE_MIN, 1 - pulledY / PULL_SCALE_DAMPING);
            modalCard.mesh.position.y -= pulledY / pxPerWorld; // CSS down → world Y negative
            modalCard.mesh.scale.multiplyScalar(gestureScale);
          }
          modalCanvasEl.style.transition = 'none';
          modalCanvasEl.style.transform = '';
          closeCardModal();
        } else {
          // Rubber-band back.
          modalCanvasEl.style.transition = 'transform 0.25s cubic-bezier(0.25, 0.1, 0.25, 1)';
          modalCanvasEl.style.transform = '';
        }
      }
      _swAxis = null;
    }, { passive: true });
  }

  // ── Motion-trail CA helper ────────────────────────────────────────────────────
  // dx/dy: world-space position delta this frame (new - prev).
  // ampOverride: optional 0-1 amplitude; when omitted, amplitude is derived from
  //   the greater of scroll velocity and globe drag speed so globe spin and modal
  //   animation both drive CA without relying on scroll.
  function applyMotionCA(mesh, dx, dy, ampOverride, strength) {
    if (!CA_ENABLED) return;
    const s = strength !== undefined ? strength : CA_MOTION_STRENGTH;
    const sX = Math.max(mesh.scale.x, 0.01);
    const sY = Math.max(mesh.scale.y, 0.01);
    const uvDX = dx / (CARD_W_SPHERE * sX);
    const uvDY = dy / (CARD_H_SPHERE * sY);
    const dragSpeed = Math.sqrt(dragVelX * dragVelX + dragVelY * dragVelY);
    const amp = ampOverride !== undefined
      ? ampOverride
      : Math.min(1.0, Math.max(scrollVel / SCROLL_VEL_MAX, dragSpeed / MAX_VEL));
    const mx = Math.max(-s, Math.min(s, uvDX * amp));
    const my = Math.max(-s, Math.min(s, uvDY * amp));
    mesh.material.uniforms.uMotionDir.value.set(mx, my);
  }

  // ── UV helper — routes to shader uniforms (CA on) or texture properties (CA off) ──
  function setCardUV(mesh, rx, ry, ox, oy) {
    if (CA_ENABLED) {
      mesh.material.uniforms.uRepeat.value.set(rx, ry);
      mesh.material.uniforms.uOffset.value.set(ox, oy);
    } else {
      const _mt = mesh.material.map;
      if (_mt) { _mt.repeat.set(rx, ry); _mt.offset.set(ox, oy); }
    }
  }

  // ── Per-frame tick ─────────────────────────────────────────────────────────
  function tick() {
    if (!renderer || !scene || !camera || !sphereGroup) return;

    const lenisY = window.scrollY;
    scrollVel = Math.abs(lenisY - prevLenisY); // px/frame — drives motion trail intensity
    prevLenisY = lenisY;
    const entryStart = spacerOffsetTop - H * 0.85;
    const entryRange = H * 0.85 + H * 0.20;
    arcCopyEntryT = Math.max(0, Math.min(1, (lenisY - entryStart) / entryRange));
    progress = Math.max(0, Math.min(1, (lenisY - spacerOffsetTop) / spacerHeight));

    // ── Phase t values ──
    // arcPanT: preroll animates in WITH the entry (0 before section, P_ARC_PREROLL by entry)
    // so the arc is already in motion as the section scrolls into view.
    const arcPanT = Math.min(1, progress / P_PAN_END + P_ARC_PREROLL * arcCopyEntryT);
    const slideT = Math.max(arcCopyEntryT, Math.max(0, Math.min(1, progress / 0.07)));
    const slideE = easeOutSine(slideT);

    // gridFormT driven by arc rotation — peel is always relative to how far the arc has rotated
    const gridFormT = Math.max(0, Math.min(
      1,
      (arcPanT - P_GRID_ARC_START) / (P_GRID_ARC_END - P_GRID_ARC_START),
    ));

    // Convert arc-pan arrival times to progress units for fold/zoom phase calculations.
    // arcPanT(progress) ≈ progress/P_PAN_END + P_ARC_PREROLL  →  progress ≈ (arcPanT - P_ARC_PREROLL) * P_PAN_END
    const gpWin = 1.0 - GRID_PEEL_STAGGER;
    const foldFirstArcT = P_GRID_ARC_START + gpWin * (P_GRID_ARC_END - P_GRID_ARC_START);
    const foldFirst = Math.max(0, (foldFirstArcT - P_ARC_PREROLL) * P_PAN_END);
    const foldLast = Math.max(0, (P_GRID_ARC_END - P_ARC_PREROLL) * P_PAN_END) + P_FOLD_DUR;
    const sphereFormT = Math.max(0, Math.min(1, (progress - foldFirst) / (foldLast - foldFirst)));
    const zoomT = Math.max(0, Math.min(1, (progress - foldLast) / (P_ZOOM_END - foldLast)));
    sphereFormTAtLastTick = sphereFormT; // cache for click handler

    // ── A11y: enable / disable gallery button tab-stops based on whether the
    //          sphere is currently interactive. Only iterates when the state
    //          flips (not every frame), so it's effectively free at idle. ──
    if (_galleryBtns) {
      const wantInteractive = (sphereFormT >= SPHERE_INTERACTIVE_T) && (modalIdx < 0);
      if (wantInteractive !== _a11yInteractive) {
        _a11yInteractive = wantInteractive;
        for (let ga = 0; ga < _galleryBtns.length; ga++) {
          _galleryBtns[ga].tabIndex = wantInteractive ? 0 : -1;
        }
      }
    }

    // ── Build arc context ──
    buildArcCtx(arcPanT);

    // ── Active camera ──
    // Arc phase (no folding yet): ortho — flat 2D.
    // Fold phase: perspective, camera approaches CAM_Z_SPHERE in lockstep with the fold so
    //   sphere reaches normal size exactly when cards finish folding.
    // Zoom-through: perspective, camera continues from CAM_Z_SPHERE to CAM_Z_END.
    let activeCamera;
    const camZArc = arcCamZ();
    if (sphereFormT === 0) {
      activeCamera = cameraOrtho;
      camera.position.z = camZArc;
      camera.updateProjectionMatrix();
    } else {
      activeCamera = camera;
      // Approach (camZArc → CAM_Z_SPHERE) uses easeInCubic: accelerates into the sphere,
      // matching velocity with the zoom phase (easeOutCubic starts fast). Sphere apparent
      // size is kept constant by sphereGroup.position.z offset, not camera proximity.
      const camZ = zoomT === 0
        ? lerpN(camZArc, CAM_Z_SPHERE, sphereFormT * sphereFormT * sphereFormT)
        : lerpN(CAM_Z_SPHERE, CAM_Z_END, easeOutCubic(zoomT));
      camera.position.z = camZ;
      camera.updateProjectionMatrix();
    }

    // ── Sphere rotation (drag + gentle auto) ──
    // sphereRotY/sphereRotX accumulate from drag input while above the interactive
    // threshold. They are NOT written to sphereGroup.rotation — the rotation is
    // applied PER-CARD in the sphere/fold blocks below, scaled by each card's own
    // fdE. This means:
    //   - Cards in sphere phase (fdE = 1) render fully rotated.
    //   - Cards mid-fold (fdE in (0, 1)) lerp between unrotated grid position and
    //     rotated sphere position, so rotation "unwinds" naturally as a card
    //     unfolds back to grid.
    //   - Cards in arc/grid/peel phases (fdE = 0) are never rotated — eliminating
    //     the off-screen drift that the previous sphereGroup-level rotation caused.
    //
    // sphereGroup.rotation is forced to identity each frame so any external code that
    // queries world matrices (modal world-snapshots, sphereGroup.attach) gets the
    // baked-in rotation from each mesh's local position, not from a group transform.
    sphereGroup.rotation.x = 0;
    sphereGroup.rotation.y = 0;

    // ── Modal-navigation spring nudge ──
    // Runs even while modal is open (drag accumulation is gated, but the spring is
    // independent). Drives sphereRotY/X toward the target set by _triggerModalNavNudge.
    // Slight underdamping (damp < critical) gives a small overshoot + settle.
    if (_navNudgeActive) {
      const nDy = _navNudgeTargetY - sphereRotY;
      const nDx = _navNudgeTargetX - sphereRotX;
      _navNudgeVelY = (_navNudgeVelY + nDy * NAV_NUDGE_STIFF) * NAV_NUDGE_DAMP;
      _navNudgeVelX = (_navNudgeVelX + nDx * NAV_NUDGE_STIFF) * NAV_NUDGE_DAMP;
      sphereRotY += _navNudgeVelY;
      sphereRotX += _navNudgeVelX;
      // Settle when position is at target AND velocity is essentially zero.
      if (Math.abs(nDy) < 0.001 && Math.abs(nDx) < 0.001
          && Math.abs(_navNudgeVelY) < 0.001 && Math.abs(_navNudgeVelX) < 0.001) {
        _navNudgeActive = false;
        _navNudgeVelY = 0;
        _navNudgeVelX = 0;
      }
    }
    if (sphereFormT >= SPHERE_INTERACTIVE_T) {
      // Pause auto-rotation + drag while a modal is open — sphere freezes at its current rotation
      if (modalIdx < 0) {
        if (!isDragging) {
          dragVelX *= DRAG_FRICTION;
          dragVelY *= DRAG_FRICTION;
          dragVelX += AUTO_ROT_SPEED;
        }
        sphereRotY += dragVelX;
        sphereRotX += dragVelY;
        sphereRotX = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, sphereRotX));
      }

      // ── Sphere-drag warp ──
      // Baseline (while actively held) + velocity burst that decays via dragVel friction.
      // Smoothly ease toward a per-frame target rather than snapping. Without easing,
      // releasing a drag (or clicking — pointerup flips isDragging to false AND
      // modal-open flips modalIdx non-negative) caused the baseline component (0.05)
      // to drop to 0 in one frame — the remaining sphere cards' barrel distortion
      // popped, which read as a pixel-level "jump" right when the modal opened.
      let _warpTarget;
      if (modalIdx < 0) {
        const dragSpeed = Math.sqrt(dragVelX * dragVelX + dragVelY * dragVelY);
        const burst = dragSpeed * SPHERE_DRAG_WARP_VEL;
        const baseline = isDragging ? SPHERE_DRAG_WARP_BASELINE : 0;
        _warpTarget = Math.min(SPHERE_DRAG_WARP_MAX, baseline + burst);
      } else {
        _warpTarget = 0;
      }
      _sphereDragWarp += (_warpTarget - _sphereDragWarp) * 0.20;
      if (Math.abs(_sphereDragWarp) < 0.001) _sphereDragWarp = 0;
    } else {
      // Below interactive threshold: stop accumulating drag inertia/auto-rot.
      // sphereRotY/sphereRotX are preserved while mid-scroll so a brief dip below
      // and back doesn't lose the user's accumulated rotation. Zero only at the very
      // top of the section so a fresh entry into the sphere starts upright.
      // Warp eases (same rate as the interactive-zone branch) rather than snapping.
      dragVelX = 0;
      dragVelY = 0;
      _sphereDragWarp += (0 - _sphereDragWarp) * 0.20;
      if (Math.abs(_sphereDragWarp) < 0.001) _sphereDragWarp = 0;
      if (sphereFormT < 0.01) {
        sphereRotY = 0;
        sphereRotX = 0;
      }
    }

    // Update the per-frame rotation Euler/Quaternion used by the sphere block + any
    // snap-to-sphere helpers. _sphereRotActive is a fast-path flag so the rotation
    // math can be skipped when the sphere is upright.
    const _sphereRotActive = (sphereRotY !== 0 || sphereRotX !== 0);
    if (_sphereRotEuler) {
      _sphereRotEuler.set(sphereRotX, sphereRotY, 0, 'YXZ');
      _sphereRotQuat.setFromEuler(_sphereRotEuler);
    }

    // ── Modal card animation (the flown-out card) ──
    // The card is parented to the scene root during modal phases. It animates from its
    // captured world transform → target near camera (opening), or back to current sphere
    // slot world transform (closing). Sphere keeps rotating behind it so the closing path
    // tracks the slot's live position.
    if (modalCard && modalPhase) {
      const now = (typeof performance !== 'undefined' ? performance.now() : Date.now());
      const aT = Math.max(0, Math.min(1, (now - modalAnimT0) / MODAL_ANIM_DURATION));
      const aE = easeInOutCubic(aT);
      const tgtPos = new THREE.Vector3();
      const tgtQuat = new THREE.Quaternion();
      const tgtScale = new THREE.Vector3();

      // Capture modal card position before this frame's update for CA delta computation
      const prevModalX = modalCard.mesh.position.x;
      const prevModalY = modalCard.mesh.position.y;

      if (modalPhase === 'opening' || modalPhase === 'open') {
        computeModalTarget(tgtPos, tgtQuat, tgtScale);
        if (modalPhase === 'open' || aT >= 1) {
          modalCard.mesh.position.copy(tgtPos);
          modalCard.mesh.quaternion.copy(tgtQuat);
          modalCard.mesh.scale.copy(tgtScale);
          if (modalPhase === 'opening' && aT >= 1) modalPhase = 'open';
        } else {
          modalCard.mesh.position.lerpVectors(modalStartPos, tgtPos, aE);
          modalCard.mesh.quaternion.copy(modalStartQuat).slerp(tgtQuat, aE);
          modalCard.mesh.scale.lerpVectors(modalStartScale, tgtScale, aE);
        }

        // Chrome reveal: start fade-in once card is 90% to its target position.
        // Guard: skip if already at 1 (navigate snaps chrome instantly — no re-animation).
        if (modalChromeFadeT < 1) {
          if (aT >= 0.90 && modalChromeRevealT0 < 0) modalChromeRevealT0 = now;
          modalChromeFadeT = modalChromeRevealT0 >= 0
            ? Math.max(0, Math.min(1, (now - modalChromeRevealT0) / CHROME_REVEAL_DUR))
            : 0;
        }
      } else if (modalPhase === 'closing') {
        // Live target = the slot's current world transform.
        //   World position = (sphere drag rotation × spherePos) + sphereGroup.position
        //   World quat     = (sphere drag rotation) × sphereQuat
        // sphereGroup.rotation is identity (per-card rotation arch), so its matrixWorld
        // is just the z translation. Apply the drag rotation manually.
        sphereGroup.updateMatrixWorld(true);
        if (_sphereRotActive) {
          tgtPos.copy(modalCard.spherePos).applyEuler(_sphereRotEuler);
          tgtQuat.copy(_sphereRotQuat).multiply(modalCard.sphereQuat);
        } else {
          tgtPos.copy(modalCard.spherePos);
          tgtQuat.copy(modalCard.sphereQuat);
        }
        tgtPos.add(sphereGroup.position);
        tgtScale.set(modalCard.sphereScaleX, 1, 1);

        modalCard.mesh.position.lerpVectors(modalCloseStartPos, tgtPos, aE);
        modalCard.mesh.quaternion.copy(modalCloseStartQuat).slerp(tgtQuat, aE);
        modalCard.mesh.scale.lerpVectors(modalCloseStartScale, tgtScale, aE);

        if (aT >= 1) {
          // Reset the cached SDF material's animated uniforms before swapping
          // back to the basic material. Without this, leftover uOpacity / uWarp
          // / uMotionDir values would persist on card._modalMat and ghost the
          // next time this card is shown in modal.
          _resetModalMaterialUniforms(modalCard._modalMat, 1);
          // Restore original MeshBasicMaterial before re-parenting to globe
          if (modalCard.mesh._origMaterial) {
            modalCard.mesh.material = modalCard.mesh._origMaterial;
            modalCard.mesh._origMaterial = null;
          }
          // Re-parent to sphereGroup and snap to canonical local transform
          // (with the current sphere-drag rotation baked in so there's no flash).
          sphereGroup.attach(modalCard.mesh);
          _snapCardToSphereSlot(modalCard);
          modalCard.mesh.material.depthTest = true;
          modalCard.mesh.renderOrder = 0;
          if (modalCanvasEl) modalCanvasEl.style.display = 'none';
          modalPhase = null;
          modalCard = null;
          modalIdx = -1;
        }
      }

      // Modal CA — apply to the SDF ShaderMaterial while the card is actively moving.
      // Use amp = 1.0 so the full CA_MOTION_STRENGTH is available; the position delta
      // itself encodes velocity (small delta when settled = small smear). Clear to zero
      // once fully open so the static card shows no aberration.
      if (CA_ENABLED && modalCard && modalCard.mesh.material.uniforms && modalCard.mesh.material.uniforms.uMotionDir) {
        if (modalPhase === 'open') {
          modalCard.mesh.material.uniforms.uMotionDir.value.set(0, 0);
        } else if (modalPhase) {
          const mdx = modalCard.mesh.position.x - prevModalX;
          const mdy = modalCard.mesh.position.y - prevModalY;
          applyMotionCA(modalCard.mesh, mdx, mdy, 1.0);
        }
      }

      // Modal warp — fisheye intensity driven by phase. During open/close the warp
      // peaks mid-animation (bell curve via sin(aT·π)) and settles to 0 when 'open'.
      // While 'open', the warp value is set externally by touch handlers (drag).
      if (modalPhase === 'opening') {
        _modalWarp = Math.sin(Math.max(0, Math.min(1, aT)) * Math.PI) * MODAL_WARP_OPEN;
      } else if (modalPhase === 'closing') {
        _modalWarp = Math.sin(Math.max(0, Math.min(1, aT)) * Math.PI) * MODAL_WARP_CLOSE;
      } else if (modalPhase === 'open') {
        // Decay any leftover warp once settled; touch handlers will set it again on drag.
        _modalWarp *= 0.85;
        if (_modalWarp < 0.001) _modalWarp = 0;
      }
      // Skip the push during desktop nav cross-warp — that animation drives BOTH the
      // old and new card's uWarp uniforms directly below.
      if (!_dnNavActive) _pushModalWarpUniforms();

      // Keep chrome elements locked to the card's projected screen position every frame.
      // During 'opening' this positions them at the final target so they fade in correctly.
      if (modalPhase === 'opening' || modalPhase === 'open') {
        positionModalChrome();
      }
    }

    // ── Desktop modal-nav cross-warp transition ──
    // Both old and new card materials get their uWarp uniform driven by a sin bell
    // curve peaking at DN_NAV_WARP mid-flight. Opacity cross-fades via easeInOutCubic.
    // At aT >= 1, finalize and detach the old card back to its sphere slot.
    if (_dnNavActive) {
      const dnNow = (typeof performance !== 'undefined' ? performance.now() : Date.now());
      const dnT = Math.max(0, Math.min(1, (dnNow - _dnNavT0) / DN_NAV_DUR));
      if (dnT >= 1) {
        _completeDesktopNavTransition();
      } else {
        const dnWarp = Math.sin(dnT * Math.PI) * DN_NAV_WARP;
        const dnE = easeInOutCubic(dnT);
        if (_dnNavOldCard && _dnNavOldCard.mesh.material && _dnNavOldCard.mesh.material.uniforms) {
          _dnNavOldCard.mesh.material.uniforms.uWarp.value = dnWarp;
          _dnNavOldCard.mesh.material.uniforms.uOpacity.value = 1 - dnE;
        }
        if (_dnNavNewCard && _dnNavNewCard.mesh.material && _dnNavNewCard.mesh.material.uniforms) {
          _dnNavNewCard.mesh.material.uniforms.uWarp.value = dnWarp;
          _dnNavNewCard.mesh.material.uniforms.uOpacity.value = dnE;
        }
      }
    }

    // Canvas visibility — instantly visible once the section approaches; no opacity fade.
    // The arc's own rotation/slide-up handles the "appearing" feel.
    const canvas = renderer.domElement;
    const showTrigger = spacerOffsetTop - H * 0.85; // matches arcCopyEntryT start point
    if (lenisY < showTrigger || zoomT >= 0.95) {
      canvas.style.display = 'none';
    } else {
      canvas.style.display = 'block';
      canvas.style.opacity = '1';
    }

    // Pull-quote — fades in as soon as the zoom phase begins (zoomT > 0).
    if (pqEl) {
      if (zoomT >= 0.38 && !pqShown) {
        pqShown = true;
        pqEl.classList.add('is-active');
      } else if (zoomT < 0.50 && pqShown && zoomT < pqPrevZoom) {
        pqShown = false;
        pqEl.classList.remove('is-active');
      }
      pqPrevZoom = zoomT;
    }

    // Switch depth-sort strategy: arc needs manual order; sphere needs camera-distance sort
    renderer.sortObjects = sphereFormT > 0.5;

    // During fold: slide sphereGroup forward so the sphere-camera distance lerps from
    // FOLD_SPHERE_DIST (70% viewport height) at fold start to CAM_Z_SPHERE (93%) at fold
    // complete — easeInCubic holds it near 70% through formation, then swells to full size.
    // Cards NOT yet on the sphere subtract this offset from their local z so they stay at
    // world z≈0 and appear at their correct size from the camera.
    //
    // IMPORTANT: the formula runs at sphereFormT === 0 too (not gated on sphereFormT > 0)
    // so sphGroupZ is CONTINUOUS at that boundary. Previously the condition was
    //   `(sphereFormT > 0 && zoomT === 0) ? (camZ - foldSphDist) : 0`
    // which jumped sphGroupZ from 0 → ~490 in one frame when the first card began
    // folding. For cards still in grid this canceled out (their mesh.position.z compensates
    // by -sphGroupZ → world z stays 0), but for the card that just transitioned into the
    // FOLD block, its world z = (sphGroupZ + spherePos.z) × fdE jumped from 0 → ~25 in one
    // frame — a visible forward "dart" that read as a scene glitch during scroll.
    // Using camera.position.z directly (always set in both ortho/perspective branches above).
    const foldSphDist = lerpN(FOLD_SPHERE_DIST, CAM_Z_SPHERE, sphereFormT * sphereFormT * sphereFormT);
    const sphGroupZ = zoomT === 0 ? (camera.position.z - foldSphDist) : 0;
    sphereGroup.position.z = sphGroupZ;

    // No conveyor: all cards on arc simultaneously, slot = i for every card.
    const windowPos = 0;

    const entryYOffset = (1 - slideE) * H * 0.30;
    const arcScale = CARD_W_ARC / CARD_W_SPHERE;
    // Entry rotation: arc holds off-screen for the first 5% of entry (while text settles),
    // then sweeps counter-clockwise into its final fanned position over the remaining 95%.
    const arcEntryT = Math.max(0, Math.min(1, (arcCopyEntryT - 0.05) / 0.95));
    const entryRot = (1 - easeOutCubic(arcEntryT)) * 0.9;

    // ── Option C: global chromatic aberration SVG filter on the WebGL canvas ──
    // Vertical shift (dy) tracks scroll velocity — scroll is vertical so R/B shift up/down.
    // Resets to zero when scrolling stops so the canvas returns to clean on every settle.
    if (CA_ENABLED && caFilterR) {
      const scrollVelNorm = Math.min(1.0, scrollVel / SCROLL_VEL_MAX);
      const globalCA = scrollVelNorm * CA_PX_MAX;
      if (globalCA > 0.05) {
        caFilterR.setAttribute('dx', '0');
        caFilterR.setAttribute('dy', (-globalCA).toFixed(2));
        caFilterB.setAttribute('dx', '0');
        caFilterB.setAttribute('dy', (globalCA * 0.5).toFixed(2));
        canvas.style.filter = 'url(#ca-filter)';
      } else {
        canvas.style.filter = '';
      }
    }

    for (let i = 0; i < N_TOTAL; i++) {
      const card = cards[i];
      const { mesh } = card;

      // Skip the modal-active card — its transform is driven by the modal animation loop above.
      // Also skip any card whose mesh is parented into modalScene (i.e., the prev/next
      // swipe-neighbors). Their positions/materials/scales are managed by the swipe
      // helpers; the main tick loop would otherwise overwrite them every frame.
      if (card === modalCard) continue;
      if (modalScene && mesh.parent === modalScene) continue;

      // ── Arc → grid peel stagger: i-based base cascade + per-card jitter for organic timing ──
      const baseDelay = (i / (N_TOTAL - 1)) * GRID_PEEL_STAGGER;
      const jitter = (card.peelJitter - 0.5) * ARC_PEEL_JITTER;
      const gpDelay = Math.max(0, Math.min(GRID_PEEL_STAGGER, baseDelay + jitter));
      const gpLocalT = Math.max(0, Math.min(1, (gridFormT - gpDelay) / Math.max(0.01, gpWin)));
      const gpE = easeOutCubic(gpLocalT);

      // ── Grid → sphere fold: starts immediately when this card arrives in grid ──
      // Convert arc-pan arrival back to progress for fold timer
      const gpArrivalArcT = P_GRID_ARC_START + Math.min(1, gpDelay + gpWin) * (P_GRID_ARC_END - P_GRID_ARC_START);
      const gpArrivalProg = Math.max(0, (gpArrivalArcT - P_ARC_PREROLL) * P_PAN_END);
      const fdLocalT = Math.max(0, Math.min(1, (progress - gpArrivalProg) / P_FOLD_DUR));
      const fdE = gpE >= 1 ? easeInOutCubic(fdLocalT) : 0;

      // ── Option B: per-card CA strength driven by transition state ──
      // Arc entry: CA peaks when entryRot is large (arc rotating in), fades to 0 when settled.
      // Peel + fold: bell curve (peaks at midpoint of each transition, 0 at start/end).
      let cardCA = 0;
      if (CA_ENABLED) {
        cardCA = Math.max(
          entryRot / 0.9,
          gpE * (1 - gpE) * 4,
          fdE * (1 - fdE) * 4,
        ) * CA_STRENGTH;
        mesh.material.uniforms.uCA.value = cardCA;
        // uWarp default = 0 every frame; sphere block re-applies based on hoverT below.
        mesh.material.uniforms.uWarp.value = 0;
      }

      // ── Hover state ease ──
      // Gated on the GLOBAL interactive threshold (same as drag/click), not per-card
      // fdE. Previously `if (fdE < 1) card.hoverTarget = 0;` blocked hover on any card
      // still finishing its fold animation — meaning hover wouldn't activate at
      // sphereFormT = 0.8 for the late-folding cards even though drag/click did.
      // Hover VISUAL effects still only render inside the sphere block (fdE >= 1)
      // so a card lerping through fold doesn't get scale/warp applied mid-motion.
      if (sphereFormT < SPHERE_INTERACTIVE_T) card.hoverTarget = 0;
      card.hoverT += (card.hoverTarget - card.hoverT) * HOVER_RATE;

      // Capture position BEFORE this frame's section block updates it — delta drives motion CA.
      const prevMeshX = mesh.position.x;
      const prevMeshY = mesh.position.y;

      // ── Fully in sphere ──
      if (fdE >= 1) {
        mesh.visible = true;
        const hs = 1 + card.hoverT * HOVER_SCALE; // 1.0 → 1.08 on hover
        // Apply manual sphere-drag rotation: world position = R × spherePos.
        // sphereGroup.rotation is identity, so the rotated local position becomes the
        // rotated world position (offset only by sphereGroup.position.z).
        if (_sphereRotActive) {
          mesh.position.copy(card.spherePos).applyEuler(_sphereRotEuler);
        } else {
          mesh.position.copy(card.spherePos);
        }
        mesh.scale.set(card.sphereScaleX * hs, hs, hs);
        setCardUV(mesh, 1, 1, 0, 0);
        if (mesh.material.alphaMap !== card.sphereMask) {
          mesh.material.alphaMap = card.sphereMask;
          mesh.material.needsUpdate = true;
        }
        if (_sphereRotActive) {
          mesh.quaternion.copy(_sphereRotQuat).multiply(card.sphereQuat);
        } else {
          mesh.quaternion.copy(card.sphereQuat);
        }
        mesh.renderOrder = 0;
        mesh.material.opacity = 1;
        // Hover composes additively on top of transition CA (which is 0 in steady sphere state).
        // uHoverPos anchors the warp at the cursor's UV position on this card when hovered;
        // when not hovered, the sphere-drag warp uses each card's own center (0.5, 0.5).
        if (CA_ENABLED) {
          mesh.material.uniforms.uCA.value = cardCA + card.hoverT * HOVER_CA;
          mesh.material.uniforms.uWarp.value = card.hoverT * HOVER_WARP + _sphereDragWarp;
          if (card.hoverT > 0.01) {
            mesh.material.uniforms.uHoverPos.value.copy(card.hoverUV);
          } else {
            mesh.material.uniforms.uHoverPos.value.set(0.5, 0.5);
          }
        }
        // Sphere phase: local position is constant (sphereGroup rotates). Approximate
        // world-space delta as depth × angular velocity — front-facing cards (large z) show
        // more CA than side-facing cards (z ≈ 0), giving a convincing rotation smear.
        applyMotionCA(mesh, card.spherePos.z * dragVelX, -card.spherePos.z * dragVelY);
        continue;
      }

      // ── Grid → sphere fold ──
      if (fdE > 0) {
        mesh.visible = true;
        // Sphere endpoint is FULLY rotated by the current drag; the lerp itself
        // handles the unwind (at fdE=0 the card is at unrotated gridPos, at fdE=1
        // it's at fully-rotated sphere position; in between, a straight-line lerp
        // between those two world points). Quaternion slerps between gridQuat and
        // the rotated sphereQuat by fdE, so orientation reaches the rotated slot
        // exactly when position does.
        //
        // Cards with fdE = 0 fall through to the grid/arc blocks below where no
        // rotation is applied — so non-sphere-phase cards are never transformed
        // by the drag rotation.
        var sX; var sY; var
          sZ;
        if (_sphereRotActive) {
          _tmpVec3.copy(card.spherePos).applyEuler(_sphereRotEuler);
          sX = _tmpVec3.x; sY = _tmpVec3.y; sZ = _tmpVec3.z;
        } else {
          sX = card.spherePos.x; sY = card.spherePos.y; sZ = card.spherePos.z;
        }
        mesh.position.set(
          lerpN(card.gridPos.x, sX, fdE),
          lerpN(card.gridPos.y, sY, fdE),
          lerpN(card.gridPos.z - sphGroupZ, sZ, fdE),
        );
        mesh.scale.set(
          lerpN(card.gridScale, card.sphereScaleX, fdE),
          lerpN(card.gridScale, 1, fdE),
          1,
        );
        setCardUV(
          mesh,
          lerpN(card.arcRepeatX, 1, fdE),
          lerpN(card.arcRepeatY, 1, fdE),
          lerpN(card.arcOffsetX, 0, fdE),
          lerpN(card.arcOffsetY, 0, fdE),
        );
        if (mesh.material.alphaMap !== card.arcMask) {
          mesh.material.alphaMap = card.arcMask;
          mesh.material.needsUpdate = true;
        }
        if (_sphereRotActive) {
          _foldRotQuat.copy(_sphereRotQuat).multiply(card.sphereQuat);
          mesh.quaternion.slerpQuaternions(card.gridQuat, _foldRotQuat, fdE);
        } else {
          mesh.quaternion.slerpQuaternions(card.gridQuat, card.sphereQuat, fdE);
        }
        mesh.renderOrder = 0;
        mesh.material.opacity = 1;
        applyMotionCA(mesh, mesh.position.x - prevMeshX, mesh.position.y - prevMeshY);
        continue;
      }

      // ── Fully in grid (dwell phase) ──
      if (gpE >= 1) {
        mesh.visible = true;
        mesh.position.set(card.gridPos.x, card.gridPos.y, card.gridPos.z - sphGroupZ);
        mesh.scale.setScalar(card.gridScale);
        setCardUV(mesh, card.arcRepeatX, card.arcRepeatY, card.arcOffsetX, card.arcOffsetY);
        if (mesh.material.alphaMap !== card.arcMask) {
          mesh.material.alphaMap = card.arcMask;
          mesh.material.needsUpdate = true;
        }
        mesh.quaternion.copy(card.gridQuat);
        mesh.renderOrder = N_TOTAL - i;
        mesh.material.opacity = 1;
        applyMotionCA(mesh, mesh.position.x - prevMeshX, mesh.position.y - prevMeshY);
        continue;
      }

      // ── Arc phase: waiting to peel, or actively peeling arc→grid ──
      const slot = i - windowPos;
      const rawT = Math.max(0, Math.min(1, slot / (N_VISIBLE - 1)));
      // Non-uniform fanT distribution (see constants block): cluster low-i cards off-screen,
      // spread high-i cards across the visible upper arc for ~17% overlap instead of ~35%.
      const splitR = ARC_DENSE_COUNT / (N_VISIBLE - 1);
      var fanT;
      if (rawT < splitR) {
        fanT = (rawT / Math.max(0.001, splitR)) * ARC_DENSE_SPLIT;
      } else {
        fanT = ARC_DENSE_SPLIT
             + ((rawT - splitR) / Math.max(0.001, 1 - splitR)) * (1 - ARC_DENSE_SPLIT);
      }
      const fan = getFanData(fanT);
      const arcDelay = fanT * ARC_STAGGER;
      const arcLocalT = Math.max(0, Math.min(1, (arcPanT - arcDelay) / Math.max(0.01, 1 - ARC_STAGGER)));
      const arcLocalE = easeInOutCubic(arcLocalT);
      const pxPushed = fan.px + fan.rx * 60 * arcLocalE;
      const pyPushed = fan.py + fan.ry * 60 * arcLocalE;
      const wp = entryRot > 0.001 ? rotateArcPoint(pxPushed, pyPushed, entryRot) : cssToWorld(pxPushed, pyPushed);
      const arcY = wp.y - entryYOffset;
      const webglRot = -fan.cssRot - entryRot;

      mesh.visible = true;

      if (mesh.material.alphaMap !== card.arcMask) {
        mesh.material.alphaMap = card.arcMask;
        mesh.material.needsUpdate = true;
      }

      if (gpE <= 0) {
        // Arc phase — reset peel snapshot so the next peel re-captures cleanly
        card.peelStartRot = null;
        mesh.position.set(wp.x, arcY, -sphGroupZ);
        mesh.scale.setScalar(arcScale);
        mesh.rotation.set(0, 0, webglRot);
        mesh.renderOrder = N_VISIBLE - Math.round(slot);
        mesh.material.opacity = 1;
        applyMotionCA(mesh, wp.x - prevMeshX, arcY - prevMeshY, undefined, CA_MOTION_STRENGTH_ARC);
      } else {
        // Peel phase — snapshot the rotation on the first frame, normalized to within ±π of
        // gridTilt for shortest angular path. Direct z-angle lerp avoids the quaternion slerp
        // hemisphere flip that snaps when webglRot wraps across atan2's discontinuity (angle = π/2).
        if (card.peelStartRot == null) {
          let startRot = webglRot;
          while (startRot - card.gridTilt > Math.PI) startRot -= 2 * Math.PI;
          while (startRot - card.gridTilt < -Math.PI) startRot += 2 * Math.PI;
          card.peelStartRot = startRot;
        }
        const interpRot = card.peelStartRot + (card.gridTilt - card.peelStartRot) * gpE;
        mesh.position.set(
          lerpN(wp.x, card.gridPos.x, gpE),
          lerpN(arcY, card.gridPos.y, gpE),
          -sphGroupZ,
        );
        mesh.scale.setScalar(lerpN(arcScale, card.gridScale, gpE));
        mesh.rotation.set(0, 0, interpRot);
        mesh.renderOrder = N_TOTAL + N_VISIBLE - i;
        mesh.material.opacity = 1;
        applyMotionCA(mesh, mesh.position.x - prevMeshX, mesh.position.y - prevMeshY);
      }
    }

    // ── Arc copy element ──
    const arcCopyEl = document.querySelector('.offer-arc-copy');
    if (arcCopyEl) {
      const P_HEADLINE_IN = 0.25;
      const P_ARC_COPY_OUT = 0.50;
      const arcCopyInE = easeOutCubic(Math.min(1, arcCopyEntryT / 0.336));
      const arcCopyOutT = Math.max(0, Math.min(
        1,
        (progress - P_HEADLINE_IN) / (P_ARC_COPY_OUT - P_HEADLINE_IN),
      ));
      const arcCopyOutE = easeOutCubic(arcCopyOutT);
      const arcCopyOp = arcCopyInE * (1 - arcCopyOutE);
      const arcCopySlide = 24 * (1 - arcCopyInE);
      // Mobile pins to 8px from viewport left (matches nav pill outer padding).
      // Desktop/tablet uses the 24px-grid-aligned position with centering offset.
      const gridLeft = (currentBPName === 'mobile')
        ? 8
        : 24 + Math.max(0, (W - 48 - 1392) / 2);
      arcCopyEl.style.left = `${gridLeft}px`;
      arcCopyEl.style.opacity = arcCopyOp.toFixed(3);
      arcCopyEl.style.transform = `translateY(${arcCopySlide.toFixed(1)}px)`;
    }

    renderer.render(scene, activeCamera);

    // Render the modal card on its own canvas (above the blur backdrop) when active
    if (modalRenderer && modalScene && modalCard) {
      modalRenderer.render(modalScene, camera);
    }

    // ── A11y: focus ring projection ──
    // If a gallery button is currently focused (via :focus-visible), project
    // the corresponding card's 4 corners to screen space, compute the bounding
    // box, and position the ring DOM element to match. Border-radius scales
    // proportionally with the card's projected height (the sphere card's
    // texture-baked rounded corners do the same).
    if (_focusRingEl && _focusedCardIdx >= 0 && _focusedCardIdx < cards.length
        && _focusRingEl.classList.contains('is-visible') && _ringCorners) {
      const fmesh = cards[_focusedCardIdx].mesh;
      if (fmesh && fmesh.visible) {
        fmesh.updateMatrixWorld(true);
        const halfW_ring = CARD_W_SPHERE * 0.5;
        const halfH_ring = CARD_H_SPHERE * 0.5;
        _ringCorners[0].set(-halfW_ring, -halfH_ring, 0);
        _ringCorners[1].set(halfW_ring, -halfH_ring, 0);
        _ringCorners[2].set(halfW_ring, halfH_ring, 0);
        _ringCorners[3].set(-halfW_ring, halfH_ring, 0);
        let fMinX = Infinity; let fMinY = Infinity; let fMaxX = -Infinity; let
          fMaxY = -Infinity;
        for (let rc = 0; rc < 4; rc++) {
          _ringTmpVec.copy(_ringCorners[rc]).applyMatrix4(fmesh.matrixWorld).project(camera);
          const sx = (_ringTmpVec.x + 1) * 0.5 * W;
          const sy = (1 - _ringTmpVec.y) * 0.5 * H;
          if (sx < fMinX) fMinX = sx;
          if (sy < fMinY) fMinY = sy;
          if (sx > fMaxX) fMaxX = sx;
          if (sy > fMaxY) fMaxY = sy;
        }
        const ringW = Math.max(0, fMaxX - fMinX);
        const ringH = Math.max(0, fMaxY - fMinY);
        _focusRingEl.style.left = `${Math.round(fMinX)}px`;
        _focusRingEl.style.top = `${Math.round(fMinY)}px`;
        _focusRingEl.style.width = `${Math.round(ringW)}px`;
        _focusRingEl.style.height = `${Math.round(ringH)}px`;
        // Match the card's texture-baked corner radius (22/631 of card height).
        _focusRingEl.style.borderRadius = `${Math.round(ringH * 22 / 631)}px`;
      }
    }
  }

  // ── Layout ─────────────────────────────────────────────────────────────────
  let _resizeHandler = null;
  let _layoutObs = null; // ResizeObserver keeping spacer metrics fresh as page content loads
  let _bpMediaQueries = []; // matchMedia listeners for BP boundaries (DevTools toggle backup)

  // ── Dev badge ──────────────────────────────────────────────────────────────
  // Tiny fixed-corner label showing current BP + viewport width. Removable: just
  // delete this function and the call in init(). Kept intentionally lightweight —
  // pure DOM, no styling dependency outside its inline styles.
  function updateBPBadge(name, w, h) {
    let el = document.getElementById('bp-badge');
    if (!el) {
      el = document.createElement('div');
      el.id = 'bp-badge';
      el.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:9999;'
        + 'padding:6px 10px;border-radius:999px;background:rgba(20,20,20,0.92);'
        + 'color:#fff;font:600 11px/1 system-ui,sans-serif;letter-spacing:0.02em;'
        + 'pointer-events:none;user-select:none;box-shadow:0 4px 18px rgba(0,0,0,0.18);';
      document.body.appendChild(el);
    }
    el.textContent = `${name} • ${w}×${h}`;
  }

  // ── Init ───────────────────────────────────────────────────────────────────
  function init() {
    const canvas = document.getElementById('offer-globe-canvas');
    if (!canvas) return;

    W = window.innerWidth;
    H = window.innerHeight;

    // Resolve breakpoint and apply its constants BEFORE anything reads N_TOTAL,
    // SPHERE_R, etc. CSS is intentionally NOT BP-aware here — author per-BP CSS
    // with traditional @media queries. The dev badge shows the active BP.
    const bp = resolveBP(W);
    currentBPName = bp.name;
    applyBP(bp.cfg);
    updateBPBadge(bp.name, W, H);

    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    renderer.sortObjects = false; // we manage order via mesh.renderOrder

    scene = new THREE.Scene();

    // Modal renderer / scene — renders only the flown-out card on a separate canvas above the
    // .card-modal__backdrop, so it stays sharp while the backdrop blurs the main canvas.
    modalCanvasEl = document.getElementById('modal-card-canvas');
    if (modalCanvasEl) {
      modalRenderer = new THREE.WebGLRenderer({ canvas: modalCanvasEl, antialias: true, alpha: true });
      modalRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      modalRenderer.setSize(W, H);
      modalRenderer.setClearColor(0x000000, 0);
      modalScene = new THREE.Scene();
    }

    // Perspective camera — used during sphere + zoom phases
    camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 5000);
    camera.position.set(0, 0, arcCamZ());
    camera.lookAt(0, 0, 0);

    // Orthographic camera — used during arc phase for true flat 2D (no perspective distortion)
    // Bounds map 1 world unit = 1 CSS pixel, matching the arc math coordinate space.
    cameraOrtho = new THREE.OrthographicCamera(-W / 2, W / 2, H / 2, -H / 2, 1, 5000);
    cameraOrtho.position.set(0, 0, 100);
    cameraOrtho.lookAt(0, 0, 0);

    const spacer = document.getElementById('offer-pin-spacer');
    function doLayout() {
      W = window.innerWidth;
      H = window.innerHeight;

      // Crossing a breakpoint boundary → full destroy()+init() so all geometry,
      // textures, and grid layout rebuild with the new BP's constants. Falls
      // through to the same-BP path otherwise (cheap resize handling).
      const nextBP = resolveBP(W);
      if (nextBP.name !== currentBPName) {
        destroy();
        init();
        return;
      }
      updateBPBadge(currentBPName, W, H);

      spacerOffsetTop = spacer ? spacer.getBoundingClientRect().top + window.scrollY : 0;
      spacerHeight = spacer ? spacer.offsetHeight : window.innerHeight * 7;
      // Re-apply DPR — Chrome's DevTools device-emulation toggle changes DPR but
      // doesn't always fire 'resize'; without this the canvas would keep the old DPR's
      // internal buffer size and render at the wrong resolution.
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(W, H);
      if (modalRenderer) {
        modalRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        modalRenderer.setSize(W, H);
      }
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      cameraOrtho.left = -W / 2;
      cameraOrtho.right = W / 2;
      cameraOrtho.top = H / 2;
      cameraOrtho.bottom = -H / 2;
      cameraOrtho.updateProjectionMatrix();
      computeGridLayout();
    }
    doLayout();
    if (_resizeHandler) window.removeEventListener('resize', _resizeHandler);
    _resizeHandler = doLayout;
    window.addEventListener('resize', _resizeHandler, { passive: true });

    // Recompute spacer metrics whenever page height changes (images/blocks loading
    // above the spacer shift its offsetTop; spacerHeight=0 at first paint makes
    // progress=Infinity and skips straight to the zoom/pull-quote phase).
    if (_layoutObs) _layoutObs.disconnect();
    _layoutObs = new ResizeObserver(function () {
      spacerOffsetTop = spacer ? spacer.getBoundingClientRect().top + window.scrollY : 0;
      spacerHeight = spacer ? (spacer.offsetHeight || window.innerHeight * 7) : window.innerHeight * 7;
    });
    _layoutObs.observe(document.body);

    // matchMedia listeners for the BP boundaries are a backup for the 'resize' event,
    // which Chrome doesn't always fire when DevTools device-emulation is toggled.
    // Each listener fires once when the viewport crosses its boundary in either direction.
    if (_bpMediaQueries.length === 0) {
      const queries = [
        window.matchMedia('(max-width: 767px)'),
        window.matchMedia('(min-width: 768px) and (max-width: 1023px)'),
        window.matchMedia('(min-width: 1024px)'),
      ];
      const onMQChange = function () { doLayout(); };
      queries.forEach((mq) => {
        if (mq.addEventListener) mq.addEventListener('change', onMQChange);
        else mq.addListener(onMQChange); // Safari < 14 fallback
        _bpMediaQueries.push({ mq, handler: onMQChange });
      });
    }

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('mousemove', onHover);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    // pointercancel fires when the browser hijacks the gesture (common in Chrome
    // DevTools touch emulation with touch-action restrictions). Treat it as
    // pointerup so taps still register — the dx/dy/dt thresholds inside onPointerUp
    // already filter out genuine drags from taps.
    window.addEventListener('pointercancel', onPointerUp);

    canvas.style.display = 'block';

    // Cache SVG filter elements for Option C global CA
    caFilterR = document.getElementById('ca-r-offset');
    caFilterB = document.getElementById('ca-b-offset');

    setupModal();

    loadAllTextures(() => {
      buildCards();
      setupGlobeGalleryA11y();
      if (!tickerAdded) {
        startTicker();
        tickerAdded = true;
      }
    });
  }

  function destroy() {
    stopTicker();
    tickerAdded = false;
    if (_resizeHandler) {
      window.removeEventListener('resize', _resizeHandler);
      _resizeHandler = null;
    }
    if (_layoutObs) {
      _layoutObs.disconnect();
      _layoutObs = null;
    }
    if (_bpMediaQueries.length) {
      _bpMediaQueries.forEach((entry) => {
        if (entry.mq.removeEventListener) entry.mq.removeEventListener('change', entry.handler);
        else entry.mq.removeListener(entry.handler);
      });
      _bpMediaQueries = [];
    }
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
    window.removeEventListener('pointercancel', onPointerUp);
    if (renderer) {
      renderer.domElement.removeEventListener('mousemove', onHover);
      renderer.domElement.style.cursor = '';
      renderer.domElement.style.filter = '';
      renderer.dispose();
      renderer.domElement.style.display = 'none';
    }
    cards = [];
    if (scene) { while (scene.children.length) scene.remove(scene.children[0]); }
    renderer = null; scene = null; camera = null; cameraOrtho = null; sphereGroup = null;
    // A11y gallery cleanup so a fresh init starts clean.
    const galleryEl = document.getElementById('globe-gallery-a11y');
    if (galleryEl && galleryEl.parentNode) galleryEl.parentNode.removeChild(galleryEl);
    if (_focusRingEl && _focusRingEl.parentNode) _focusRingEl.parentNode.removeChild(_focusRingEl);
    _galleryBtns = null;
    _a11yInteractive = false;
    _focusRingEl = null;
    _focusedCardIdx = -1;
    _ringCorners = null;
    _ringTmpVec = null;
    // Reset arc-copy and pull-quote inline styles
    const arcCopyEl = document.querySelector('.offer-arc-copy');
    if (arcCopyEl) arcCopyEl.style.cssText = '';
    if (pqEl) { pqEl.classList.remove('is-active'); pqShown = false; pqPrevZoom = 0; }
    prevLenisY = 0; scrollVel = 0;
    // NOTE: currentBPName and <html data-bp> are intentionally NOT cleared here.
    // doLayout() relies on currentBPName to detect crossings, and init() will
    // overwrite both. Clearing them would break the re-init flow.
  }

  return { init, destroy };
}

// ── DOM the runtime expects ──────────────────────────────────────────────────
// The original prototype hand-authored these nodes in index.html. We build them
// inside the block element instead. Ids are kept because the runtime looks them
// up via document.getElementById (so only one globe per page for now — see
// PROGRESS.md "Open questions"). Fixed-position overlays (ca-svg, arc-copy,
// pull-quote, modal) can live inside the block: position:fixed escapes the
// relative/sticky ancestors here (no transform/filter on the chain).
const GLOBE_MARKUP = `
  <div class="offer-world" id="offer-world">
    <canvas id="offer-globe-canvas" style="position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:95;display:none;pointer-events:auto;touch-action:pan-y;"></canvas>
  </div>

  <svg id="ca-svg" aria-hidden="true" focusable="false" style="position:absolute;width:0;height:0;overflow:hidden">
    <defs>
      <filter id="ca-filter" color-interpolation-filters="sRGB">
        <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="rch"/>
        <feOffset in="rch" id="ca-r-offset" dx="0" dy="0" result="rOff"/>
        <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="gch"/>
        <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="bch"/>
        <feOffset in="bch" id="ca-b-offset" dx="0" dy="0" result="bOff"/>
        <feComposite in="rOff" in2="gch" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="rg"/>
        <feComposite in="rg" in2="bOff" operator="arithmetic" k1="0" k2="1" k3="1" k4="0"/>
      </filter>
    </defs>
  </svg>

  <div class="offer-arc-copy">
    <p class="offer-arc-copy__title">Deliver professional work that stands out.</p>
    <p class="offer-arc-copy__body">Whether you're designing a logo, or retouching 100 event photos, you can get the results you want with apps that set the industry standard.</p>
  </div>

  <div class="offer-pullquote" id="offer-pullquote">
    <blockquote class="offer-pullquote__quote">&ldquo;I wear a lot of different hats. Creative Cloud gives me all the apps under one umbrella, so it&rsquo;s easy to share my ideas with the world.&rdquo;</blockquote>
    <div class="offer-pullquote__attribution">
      <p class="offer-pullquote__name">Frankie Gaw</p>
      <p class="offer-pullquote__role">Professional Foodie and Designer</p>
    </div>
  </div>

  <div id="card-modal" class="card-modal" aria-hidden="true">
    <div class="card-modal__backdrop"></div>
  </div>

  <canvas id="modal-card-canvas" style="position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:115;display:none;pointer-events:none;"></canvas>

  <div id="card-modal-chrome" class="card-modal-chrome" role="dialog" aria-modal="true" aria-labelledby="card-modal-name" aria-hidden="true">
    <button class="card-modal__nav card-modal__nav--prev" type="button" aria-label="Previous card">
      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M15 5l-7 7 7 7" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>
    <button class="card-modal__nav card-modal__nav--next" type="button" aria-label="Next card">
      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M9 5l7 7-7 7" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>
    <div class="card-modal__counter" id="card-modal-counter" aria-hidden="true"></div>
    <button class="card-modal__close" type="button" aria-label="Close">
      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>
    </button>
    <img class="card-modal__image" alt="" />
    <div class="card-modal__info">
      <p class="card-modal__role-label">Photographer</p>
      <h3 class="card-modal__name" id="card-modal-name"></h3>
      <p class="card-modal__description"></p>
      <div class="card-modal__badges"></div>
    </div>
  </div>
`;

function buildGlobeDom(el) {
  el.id = 'offer-pin-spacer';
  el.classList.add('offer-pin-spacer');
  el.innerHTML = GLOBE_MARKUP;
}

// ── Block entry point ────────────────────────────────────────────────────────
export default async function init(el) {
  if (el.dataset.globeReady) return el;
  el.dataset.globeReady = 'true';

  // Reduced-motion: skip the WebGL experience entirely and collapse the tall
  // scroll spacer. TODO (iterate): author a static poster fallback like pdf-space.
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reducedMotion.matches) {
    el.classList.add('globe--reduced');
    return el;
  }

  // Extract authored content BEFORE buildGlobeDom() wipes the block's children.
  // fragmentHref is captured here so it survives the DOM wipe.
  const { cards: domCards, arcCopy, pullQuote, fragmentHref } = parseAuthoredContent(el);

  buildGlobeDom(el);

  // Inject authored text into the built DOM slots (fallback to GLOBE_MARKUP defaults if absent).
  if (arcCopy) {
    const titleEl = el.querySelector('.offer-arc-copy__title');
    const bodyEl = el.querySelector('.offer-arc-copy__body');
    if (titleEl && arcCopy.title) titleEl.textContent = arcCopy.title;
    if (bodyEl && arcCopy.body) bodyEl.textContent = arcCopy.body;
  }
  if (pullQuote) {
    const quoteEl = el.querySelector('.offer-pullquote__quote');
    const nameEl = el.querySelector('.offer-pullquote__name');
    const roleEl = el.querySelector('.offer-pullquote__role');
    if (quoteEl && pullQuote.quote) quoteEl.textContent = pullQuote.quote;
    if (nameEl && pullQuote.name) nameEl.textContent = pullQuote.name;
    if (roleEl && pullQuote.role) roleEl.textContent = pullQuote.role;
  }

  // Fetch the full fragment and load THREE in parallel — no extra wall-clock cost.
  const [threeOk, fetchedCards] = await Promise.all([
    loadScript(THREE_SRC).then(() => true).catch(() => false),
    fragmentHref ? fetchFragmentCards(fragmentHref) : Promise.resolve(null),
  ]);

  if (!threeOk) {
    el.classList.add('globe--reduced');
    return el;
  }

  // Prefer fully-fetched cards; fall back to what was in the DOM at init() time;
  // fall back again to [] so the runtime uses its built-in placeholder cards.
  const cards = fetchedCards || domCards;
  const runtime = createGlobeRuntime(cards);
  if (!runtime) { el.classList.add('globe--reduced'); return el; }
  runtime.init();
  el._globeRuntime = runtime;

  // Teardown when the block is removed from the document (SPA / MEP swaps).
  const removalObserver = new MutationObserver(() => {
    if (document.contains(el)) return;
    runtime.destroy();
    removalObserver.disconnect();
  });
  if (el.parentElement) removalObserver.observe(el.parentElement, { childList: true });

  return el;
}
