const COL_OFFSETS_F = [-0.462, -0.154, 0.154, 0.462];
const COL_GAP_F = COL_OFFSETS_F[1] - COL_OFFSETS_F[0];
const CARD_WIDTH = 192;
const ROW_CARD_H = 230;
const LAYER_DIST = 700;
const REVEAL_SCROLL = 500;
const GRID_PAN_MAX = 300;
const GRID_PAN_SLOW_RATE = 0.28;
const GRID_PAN_BLEND = 130;
const ACROBAT_START_SCROLL = REVEAL_SCROLL + GRID_PAN_MAX;
const ACROBAT_END_SCROLL = ACROBAT_START_SCROLL + 900;
const ARC_INTRO_FRACTION = 0.10;
const ARC_PAN_END = 1350;
const ARC_PEEL_OVERLAP = ARC_PAN_END * (1 - ARC_INTRO_FRACTION);
const ARC_GRID_END = ARC_PAN_END + 1000;
const ARC_ACROBAT_DUR = 2200;
const ARC_SETTLE_DUR = 1700;
const ARC_ACROBAT_START = ARC_GRID_END + ARC_SETTLE_DUR;
// FAN_IDX maps grid [row][col] → arc position. Arc reads column-by-column L→R,
// bottom-to-top within each column; fanIdx=0 is lower-right (peels first).
const FAN_IDX = [
  [7, 5, 3, 1],
  [6, 4, 2, 0],
];

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - ((-2 * t + 2) ** 3) / 2;
}
function easeOutCubic(t) {
  return 1 - ((1 - t) ** 3);
}
// Quadratic ease-in for first 8%, then constant velocity — essentially linear after ramp.
function arcRotationEase(t) {
  const k = 0.08;
  const a = 1 / (k * (2 - k));
  const v0 = a * k * k;
  const s = 2 * a * k;
  return t <= k ? a * t * t : v0 + s * (t - k);
}
function easeOutSine(t) {
  return Math.sin((t * Math.PI) / 2);
}
function easeInOutSine(t) {
  return -(Math.cos(Math.PI * t) - 1) / 2;
}
function easeOutBack(t) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * ((t - 1) ** 3) + c1 * ((t - 1) ** 2);
}

function hexToRgb(hex) {
  const v = parseInt(hex.replace('#', ''), 16);
  return [Math.floor(v / 65536) % 256, Math.floor(v / 256) % 256, v % 256];
}

// Reads authored content: each row is a direct child <div>; each cell within a
// row has a <picture> followed by a text label. Card height is derived from the
// picture's authored aspect ratio.
function parseAuthoredCards(el) {
  const rows = [...el.children].filter((c) => c.tagName === 'DIV');
  const cards = [];
  rows.forEach((rowEl, rowIdx) => {
    const cells = [...rowEl.children].filter((c) => c.tagName === 'DIV');
    cells.forEach((cellEl, colIdx) => {
      const picture = cellEl.querySelector('picture');
      const img = cellEl.querySelector('img');
      const label = cellEl.textContent.trim();
      const imgW = (img && parseInt(img.getAttribute('width'), 10)) || CARD_WIDTH;
      const imgH = (img && parseInt(img.getAttribute('height'), 10)) || ROW_CARD_H;
      cards.push({
        colIdx,
        rowIdx,
        cardH: Math.round(CARD_WIDTH * (imgH / imgW)),
        label,
        html: picture ? picture.outerHTML : '',
      });
    });
  });
  return cards;
}

const CANVAS_HTML = '<canvas id="c"></canvas>';

const ARC_SVG_HTML = `
<svg id="arc-256-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 793 714" fill="none" overflow="visible">
  <path id="arc-256-path" d="M772.755 713.494H611.337C604.324 713.622 597.432 711.662 591.536 707.862C585.641 704.063 581.01 698.596 578.231 692.158L402.994 282.541C402.537 280.946 401.577 279.541 400.258 278.534C398.94 277.527 397.331 276.972 395.672 276.95C394.013 276.929 392.391 277.442 391.046 278.414C389.701 279.386 388.706 280.766 388.207 282.348L279 542.424C278.407 543.83 278.172 545.362 278.315 546.882C278.457 548.402 278.974 549.863 279.819 551.134C280.663 552.406 281.809 553.449 283.155 554.171C284.501 554.893 286.004 555.27 287.531 555.27H407.571C411.208 555.27 414.763 556.341 417.795 558.348C420.827 560.356 423.2 563.211 424.618 566.559L477.174 683.481C478.567 686.762 479.125 690.337 478.799 693.886C478.473 697.435 477.273 700.848 475.306 703.821C473.338 706.793 470.665 709.232 467.526 710.92C464.386 712.608 460.876 713.492 457.311 713.494H20.3044C17.0176 713.475 13.7866 712.642 10.8994 711.072C8.01233 709.501 5.5588 707.241 3.75759 704.492C1.95639 701.743 0.863449 698.592 0.576217 695.318C0.288985 692.045 0.816374 688.751 2.11138 685.731L280.081 23.9607C282.922 16.9565 287.809 10.9715 294.105 6.78681C300.401 2.60216 307.812 0.412351 315.372 0.50329H475.697C483.259 0.403187 490.675 2.58926 496.973 6.77504C503.271 10.9608 508.157 16.951 510.991 23.9607L790.885 685.731C792.18 688.746 792.709 692.035 792.426 695.304C792.142 698.573 791.055 701.721 789.261 704.469C787.466 707.216 785.021 709.478 782.141 711.053C779.261 712.627 776.037 713.466 772.755 713.494V713.494Z"/>
</svg>`;

const WORLD_HTML = '<div id="world"></div>';

const TEXT_BLOCK_HTML = `
<div id="text-block">
  <h2 id="text-headline">Create beautifully.</h2>
  <p id="text-body">Design stunning PDFs, presentations, and social content with professional templates and AI tools — all inside Acrobat.</p>
  <a href="#" id="text-cta">Learn more <img class="text-cta-chevron" src="assets/chevron.svg" alt=""></a>
</div>`;

const ACROBAT_WIN_HTML = `
<div id="acrobat-win">
  <div class="ac-bar">
    <div class="ac-bar-l">
      <div class="ac-addspace">
        <span class="ac-addspace-ico"><svg viewBox="0 0 18 18" fill="none"><rect x="2" y="2" width="6.5" height="6.5" rx="1.5" fill="#ebebeb"/><rect x="9.5" y="2" width="6.5" height="6.5" rx="1.5" fill="#ebebeb" opacity=".55"/><rect x="2" y="9.5" width="6.5" height="6.5" rx="1.5" fill="#ebebeb" opacity=".55"/><rect x="9.5" y="9.5" width="6.5" height="6.5" rx="1.5" fill="#ebebeb" opacity=".3"/></svg></span>
        Add to PDF Space
      </div>
      <div class="ac-divv"></div>
      <div class="ac-tabs">
        <span class="ac-tab ac-tab-on">All tools</span>
        <span class="ac-tab">Edit</span>
        <span class="ac-tab">Convert</span>
        <span class="ac-tab">E-Sign</span>
      </div>
      <div class="ac-divv"></div>
      <span class="ac-ico ac-ico-dim"><svg viewBox="0 0 18 18" fill="none"><path d="M5 8L3 6l2-2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 6h7a4 4 0 1 1 0 8H7" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" fill="none"/></svg></span>
      <span class="ac-ico ac-ico-dim"><svg viewBox="0 0 18 18" fill="none"><path d="M13 8l2-2-2-2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 6H8a4 4 0 1 0 0 8h3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" fill="none"/></svg></span>
    </div>
    <div class="ac-bar-r">
      <span class="ac-findtext">Find text or tools</span>
      <span class="ac-ico"><svg viewBox="0 0 18 18" fill="none"><circle cx="7.5" cy="7.5" r="4.5" stroke="currentColor" stroke-width="1.4"/><line x1="11" y1="11" x2="15.5" y2="15.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg></span>
      <span class="ac-ico"><svg viewBox="0 0 18 18" fill="none"><path d="M3 10V8a6 6 0 0 1 12 0v2" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linecap="round"/><rect x="2" y="10" width="3" height="5" rx="1.5" fill="currentColor"/><rect x="13" y="10" width="3" height="5" rx="1.5" fill="currentColor"/></svg></span>
      <div class="ac-divv"></div>
      <span class="ac-ico"><svg viewBox="0 0 18 18" fill="none"><path d="M5 13a4 4 0 1 1 1-7.9A5 5 0 0 1 15 9a3 3 0 0 1-2 5H5z" stroke="currentColor" stroke-width="1.3" fill="none"/><path d="M9 10v4M7 12.5l2 2 2-2" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg></span>
      <span class="ac-ico"><svg viewBox="0 0 18 18" fill="none"><rect x="4" y="2" width="10" height="14" rx="1" stroke="currentColor" stroke-width="1.3" fill="none"/><rect x="6" y="2" width="5" height="4" stroke="currentColor" stroke-width="1" fill="none"/><rect x="5" y="11" width="8" height="4" stroke="currentColor" stroke-width="1" fill="none"/></svg></span>
      <span class="ac-ico"><svg viewBox="0 0 18 18" fill="none"><rect x="4" y="2" width="10" height="4" rx=".5" fill="currentColor" opacity=".6"/><rect x="2" y="6" width="14" height="7" rx="1" stroke="currentColor" stroke-width="1.3" fill="none"/><rect x="5" y="12" width="8" height="4.5" rx=".5" fill="currentColor" opacity=".6"/><circle cx="13.5" cy="9.5" r="1" fill="currentColor"/></svg></span>
      <div class="ac-divv"></div>
      <span class="ac-share">Share</span>
      <span class="ac-aiassist">
        <span class="ac-aiassist-ico"><svg viewBox="0 0 18 18"><path d="M9 1.5L10.4 7H16l-4.8 3.5 1.8 5.5L9 13l-4 3 1.8-5.5L2 7h5.6Z" fill="white"/></svg></span>
        AI Assistant
      </span>
    </div>
  </div>
  <div class="ac-bar-sep"></div>
  <div class="ac-body">
    <div class="ac-lhp">
      <div class="ac-lhp-hdr">
        <span class="ac-lhp-hdr-title">All tools</span>
        <span class="ac-lhp-hdr-x"><svg viewBox="0 0 18 18" fill="none"><line x1="3" y1="3" x2="15" y2="15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="15" y1="3" x2="3" y2="15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></span>
      </div>
      <div class="ac-tools">
        <div class="ac-tool">
          <span class="ac-tool-ico"><svg viewBox="0 0 18 18"><rect x="1" y="1" width="16" height="16" rx="3" fill="#4285F4"/><rect x="4" y="4" width="4" height="4" rx=".8" fill="white" opacity=".9"/><rect x="10" y="4" width="4" height="4" rx=".8" fill="white" opacity=".7"/><rect x="4" y="10" width="4" height="4" rx=".8" fill="white" opacity=".7"/><rect x="10" y="10" width="4" height="4" rx=".8" fill="white" opacity=".5"/></svg></span>
          <span class="ac-tool-lbl">Create a PDF Space</span>
          <span class="ac-badge-new">NEW</span>
        </div>
        <div class="ac-tool">
          <span class="ac-tool-ico"><svg viewBox="0 0 18 18"><rect x="1" y="1" width="16" height="16" rx="3" fill="url(#ai-grad)"/><defs><linearGradient id="ai-grad" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#676dfc"/><stop offset="1" stop-color="#ff6a54"/></linearGradient></defs><path d="M9 4l1 3.5H14l-3 2.2 1.1 3.3L9 11l-3.1 2 1.1-3.3L4 7.5h4Z" fill="white"/></svg></span>
          <span class="ac-tool-lbl">AI Assistant</span>
        </div>
        <div class="ac-tool">
          <span class="ac-tool-ico"><svg viewBox="0 0 18 18"><rect x="1" y="1" width="16" height="16" rx="3" fill="#5258E4"/><rect x="4" y="5" width="10" height="1.5" rx=".75" fill="white" opacity=".9"/><rect x="4" y="8" width="8" height="1.5" rx=".75" fill="white" opacity=".7"/><rect x="4" y="11" width="9" height="1.5" rx=".75" fill="white" opacity=".5"/></svg></span>
          <span class="ac-tool-lbl">Generative summary</span>
        </div>
        <div class="ac-tool">
          <span class="ac-tool-ico"><svg viewBox="0 0 18 18"><rect x="1" y="1" width="16" height="16" rx="3" fill="#E53935"/><rect x="5" y="4" width="8" height="10" rx="1" fill="white" opacity=".85"/><line x1="9" y1="7" x2="9" y2="12" stroke="#E53935" stroke-width="1.4" stroke-linecap="round"/><path d="M6.5 9.5L9 12l2.5-2.5" stroke="#E53935" stroke-width="1.2" stroke-linecap="round" fill="none"/></svg></span>
          <span class="ac-tool-lbl">Export a PDF</span>
        </div>
        <div class="ac-tool">
          <span class="ac-tool-ico"><svg viewBox="0 0 18 18"><rect x="1" y="1" width="16" height="16" rx="3" fill="#F57C00"/><rect x="5" y="4" width="8" height="10" rx="1" fill="white" opacity=".85"/><path d="M11 6L7 10l-.5 2 2-.5 4-4L11 6z" fill="#F57C00"/></svg></span>
          <span class="ac-tool-lbl">Edit a PDF</span>
        </div>
        <div class="ac-tool">
          <span class="ac-tool-ico"><svg viewBox="0 0 18 18"><rect x="1" y="1" width="16" height="16" rx="3" fill="#1976D2"/><path d="M9 5c1 0 3.5 1 3.5 4S10 13 9 13s-3.5-1-3.5-4 2.5-4 3.5-4z" fill="white" opacity=".85"/><path d="M7 9.5 C8 11 10 11 11 9.5" stroke="#1976D2" stroke-width="1" fill="none" stroke-linecap="round"/></svg></span>
          <span class="ac-tool-lbl">Request e-signatures</span>
        </div>
        <div class="ac-tool">
          <span class="ac-tool-ico"><svg viewBox="0 0 18 18"><rect x="1" y="1" width="16" height="16" rx="3" fill="#C62828"/><rect x="5" y="4" width="8" height="10" rx="1" fill="white" opacity=".85"/><line x1="9" y1="7" x2="9" y2="12" stroke="#C62828" stroke-width="1.4" stroke-linecap="round"/><line x1="6.5" y1="9.5" x2="11.5" y2="9.5" stroke="#C62828" stroke-width="1.4" stroke-linecap="round"/></svg></span>
          <span class="ac-tool-lbl">Create a PDF</span>
        </div>
        <div class="ac-tool">
          <span class="ac-tool-ico"><svg viewBox="0 0 18 18"><rect x="1" y="1" width="16" height="16" rx="3" fill="#AD1457"/><path d="M12 4l1.5 1.5-7.5 7.5L4 13l.5-2L12 4z" fill="white" opacity=".9"/><circle cx="5.5" cy="12.5" r="1.5" fill="none" stroke="white" stroke-width="1"/></svg></span>
          <span class="ac-tool-lbl">Stylize this PDF</span>
        </div>
        <div class="ac-tool">
          <span class="ac-tool-ico"><svg viewBox="0 0 18 18"><rect x="1" y="1" width="16" height="16" rx="3" fill="#2E7D32"/><rect x="4" y="4" width="10" height="10" rx="1" fill="white" opacity=".2"/><path d="M6 10 C7 8 9 7.5 11 8 C12 8.5 13 10 12 11.5" stroke="white" stroke-width="1.3" fill="none" stroke-linecap="round"/><circle cx="6" cy="10" r="1" fill="white"/></svg></span>
          <span class="ac-tool-lbl">Fill &amp; Sign</span>
        </div>
        <div class="ac-tool">
          <span class="ac-tool-ico"><svg viewBox="0 0 18 18"><rect x="1" y="1" width="16" height="16" rx="3" fill="#00695C"/><circle cx="9" cy="9" r="5" stroke="white" stroke-width="1.2" fill="none" opacity=".85"/><line x1="9" y1="4" x2="9" y2="14" stroke="white" stroke-width="1" opacity=".6"/><ellipse cx="9" cy="9" rx="2.5" ry="5" stroke="white" stroke-width="1" fill="none" opacity=".6"/></svg></span>
          <span class="ac-tool-lbl">Translate this PDF</span>
        </div>
        <div class="ac-tool">
          <span class="ac-tool-ico"><svg viewBox="0 0 18 18"><rect x="1" y="1" width="16" height="16" rx="3" fill="#B71C1C"/><rect x="3" y="5" width="6" height="8" rx="1" fill="white" opacity=".85"/><rect x="9" y="5" width="6" height="8" rx="1" fill="white" opacity=".65"/><path d="M9 9h0" stroke="white" stroke-width="2" stroke-linecap="round"/></svg></span>
          <span class="ac-tool-lbl">Combine files</span>
        </div>
        <span class="ac-viewmore">View more</span>
      </div>
    </div>
    <div class="ac-qt">
      <div class="ac-qt-btn ac-qt-btn-on">
        <svg viewBox="0 0 18 18" fill="none"><path d="M4 2v13l3.2-3.2 2 4.2 1.6-.8-2-4.2 4.2-.1L4 2z" fill="#ebebeb"/></svg>
      </div>
      <div class="ac-qt-btn">
        <svg viewBox="0 0 18 18" fill="none"><circle cx="7.5" cy="7.5" r="4.5" stroke="#ebebeb" stroke-width="1.3"/><line x1="11" y1="11" x2="15.5" y2="15.5" stroke="#ebebeb" stroke-width="1.3" stroke-linecap="round"/><line x1="5.5" y1="7.5" x2="9.5" y2="7.5" stroke="#ebebeb" stroke-width="1.3" stroke-linecap="round"/><line x1="7.5" y1="5.5" x2="7.5" y2="9.5" stroke="#ebebeb" stroke-width="1.3" stroke-linecap="round"/></svg>
      </div>
      <div class="ac-qt-btn">
        <svg viewBox="0 0 18 18" fill="none"><path d="M2 3h14v10H9.5L6 16v-3H2V3z" stroke="#ebebeb" stroke-width="1.3" fill="none"/></svg>
      </div>
      <div class="ac-qt-btn">
        <svg viewBox="0 0 18 18" fill="none"><path d="M5 10l2-5h4l2 5-1.5 2H6.5L5 10z" fill="#ebebeb" opacity=".7"/><line x1="4" y1="15" x2="14" y2="15" stroke="#ebebeb" stroke-width="1.5" stroke-linecap="round"/></svg>
      </div>
      <div class="ac-qt-btn">
        <svg viewBox="0 0 18 18" fill="none"><path d="M3 4h12M9 4v10" stroke="#ebebeb" stroke-width="1.5" stroke-linecap="round"/><line x1="6" y1="14" x2="12" y2="14" stroke="#ebebeb" stroke-width="1.3" stroke-linecap="round"/><line x1="14" y1="10" x2="14" y2="14" stroke="#4488ff" stroke-width="1.5" stroke-linecap="round"/></svg>
      </div>
      <div class="ac-qt-btn">
        <svg viewBox="0 0 18 18" fill="none"><path d="M3 14 C5 9 7 6 10 5L13 3.5 14.5 5 13 6.5 C10 8 7.5 11 5 15" stroke="#ebebeb" stroke-width="1.3" fill="none" stroke-linecap="round"/><line x1="3" y1="15" x2="8" y2="15" stroke="#ebebeb" stroke-width="1.3" stroke-linecap="round"/></svg>
      </div>
      <div class="ac-qt-btn">
        <svg viewBox="0 0 18 18" fill="none"><circle cx="9" cy="4.5" r="1.5" fill="#ebebeb"/><circle cx="9" cy="9" r="1.5" fill="#ebebeb"/><circle cx="9" cy="13.5" r="1.5" fill="#ebebeb"/></svg>
      </div>
    </div>
    <div class="ac-cvs"></div>
    <div class="ac-rhr">
      <div class="ac-rhr-btn">
        <svg viewBox="0 0 18 18"><path d="M9 2.5l1.2 4H15l-3.8 2.8 1.5 4.5L9 11.5l-3.7 2.3 1.5-4.5L3 6.5h4.8Z" fill="#5258E4"/></svg>
      </div>
      <div class="ac-rhr-btn">
        <svg viewBox="0 0 18 18" fill="none"><path d="M2 3h14v10H9.5L6 16v-3H2V3z" stroke="#ebebeb" stroke-width="1.3"/><line x1="5" y1="7" x2="13" y2="7" stroke="#ebebeb" stroke-width="1" opacity=".6"/><line x1="5" y1="10" x2="10" y2="10" stroke="#ebebeb" stroke-width="1" opacity=".6"/></svg>
      </div>
      <div class="ac-rhr-btn">
        <svg viewBox="0 0 18 18" fill="none"><path d="M5 2h8v14l-4-3-4 3V2z" stroke="#ebebeb" stroke-width="1.3" fill="none"/></svg>
      </div>
      <div class="ac-rhr-btn">
        <svg viewBox="0 0 18 18" fill="none"><rect x="4" y="4" width="10" height="12" rx="1" stroke="#ebebeb" stroke-width="1.3"/><rect x="6" y="2" width="10" height="12" rx="1" stroke="#ebebeb" stroke-width="1.3" opacity=".45"/></svg>
      </div>
      <div class="ac-rhr-btn">
        <svg viewBox="0 0 18 18" fill="none"><rect x="5" y="5" width="10" height="11" rx="1" stroke="#ebebeb" stroke-width="1.3"/><path d="M5 5V3h-2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h9v-2" stroke="#ebebeb" stroke-width="1.3" fill="none"/></svg>
      </div>
      <div class="ac-rhr-sep"></div>
      <div class="ac-rhr-num">1</div>
      <div class="ac-rhr-zoom">100</div>
      <div class="ac-rhr-btn">
        <svg viewBox="0 0 18 18" fill="none"><path d="M4 12l5-5 5 5" stroke="#ebebeb" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
      <div class="ac-rhr-btn">
        <svg viewBox="0 0 18 18" fill="none"><path d="M4 6l5 5 5-5" stroke="#ebebeb" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
      <div class="ac-rhr-spacer"></div>
      <div class="ac-rhr-btn">
        <svg viewBox="0 0 18 18" fill="none"><path d="M14 7A6 6 0 1 0 11 13" stroke="#ebebeb" stroke-width="1.4" stroke-linecap="round" fill="none"/><path d="M14 3v4h-4" stroke="#ebebeb" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
      </div>
      <div class="ac-rhr-btn">
        <svg viewBox="0 0 18 18" fill="none"><line x1="2" y1="9" x2="16" y2="9" stroke="#ebebeb" stroke-width="1.3"/><path d="M5 6L2 9l3 3M13 6l3 3-3 3" stroke="#ebebeb" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
      </div>
      <div class="ac-rhr-btn">
        <svg viewBox="0 0 18 18" fill="none"><circle cx="7.5" cy="7.5" r="4.5" stroke="#ebebeb" stroke-width="1.3"/><line x1="11" y1="11" x2="15.5" y2="15.5" stroke="#ebebeb" stroke-width="1.3" stroke-linecap="round"/><line x1="5.5" y1="7.5" x2="9.5" y2="7.5" stroke="#ebebeb" stroke-width="1.3" stroke-linecap="round"/><line x1="7.5" y1="5.5" x2="7.5" y2="9.5" stroke="#ebebeb" stroke-width="1.3" stroke-linecap="round"/></svg>
      </div>
      <div class="ac-rhr-btn">
        <svg viewBox="0 0 18 18" fill="none"><circle cx="7.5" cy="7.5" r="4.5" stroke="#ebebeb" stroke-width="1.3"/><line x1="11" y1="11" x2="15.5" y2="15.5" stroke="#ebebeb" stroke-width="1.3" stroke-linecap="round"/><line x1="5.5" y1="7.5" x2="9.5" y2="7.5" stroke="#ebebeb" stroke-width="1.3" stroke-linecap="round"/></svg>
      </div>
    </div>
  </div>
</div>
<div id="acrobat-title">Test drive PDF Spaces.</div>
<div id="acrobat-cta"><span>Try it Free</span></div>`;

const TEMPLATE = CANVAS_HTML + ARC_SVG_HTML + WORLD_HTML + TEXT_BLOCK_HTML + ACROBAT_WIN_HTML;

export default function init(el) {
  const authoredCards = parseAuthoredCards(el);

  const stage = document.createElement('div');
  stage.className = 'dot-grid-stage';
  stage.innerHTML = TEMPLATE;
  el.textContent = '';
  el.append(stage);

  const canvas = el.querySelector('#c');
  const ctx = canvas.getContext('2d');
  const world = el.querySelector('#world');
  const acrobatWinEl = el.querySelector('#acrobat-win');
  const acrobatTitleEl = el.querySelector('#acrobat-title');
  const acrobatCtaEl = el.querySelector('#acrobat-cta');
  const textBlockEl = el.querySelector('#text-block');
  const arc256Svg = el.querySelector('#arc-256-svg');
  const arc256Path = el.querySelector('#arc-256-path');

  const cfg = {
    spacing: 16,
    dotSize: 1.0,
    mouseRadius: 125,
    repelForce: 20,
    spring: 0.01,
    damping: 0.59,
    colSpread: 1.0,
    rowGap: 0.38,
    cardScale: 1.15,
    opacity: 1.0,
    bgColor: '#f6f6f6',
    dotColor: '#969696',
  };

  const arcStagger = 0.50;
  const arcSpan = 0.80;
  const arcLiftZoom = 1.00;
  const arcYTilt = 25;
  const arcXTilt = 10;
  const introStagger = 0.50;
  const introCompress = 0.20;
  const introDistance = 1.30;

  let W = 0;
  let H = 0;
  let dots = [];
  const mouse = { x: -9999, y: -9999 };

  const scroll = { current: 0 };
  let activeLayer = 0;
  let zDepth = 0;
  let cardRevealOffset = REVEAL_SCROLL;
  let layerShiftX = 0;
  let layerShiftXTarget = 0;
  let layerShiftY = 0;
  let layerShiftYTarget = 0;
  let gridPanY = 0;
  let arcGridPanY = 0;
  let acrobatT = 0;
  let arcPanT = 0;
  let arcToGridT = 0;
  const arcMode = true;
  let frozenTextY = 0;
  let scrollColSpread = 1.20;
  let scrollRowGap = 0.60;
  let scrollT = 0;
  const baseColSpread = 1.20;
  const baseRowGap = 0.60;

  const modalInfluence = { radius: 0, targetRadius: 0 };
  const cardClickEnabled = false;
  let expandedCard = null;

  const ATTRACT_RADIUS = 190;
  const MAX_DISPLACE = 36;
  const NEIGHBOR_PUSH = 48;

  const layerDefs = [authoredCards];

  const allLayers = layerDefs.map((cards, li) => {
    const layerEl = document.createElement('div');
    layerEl.className = 'layer';
    world.appendChild(layerEl);

    const cardObjects = cards.map((def) => {
      const cardEl = document.createElement('div');
      cardEl.className = 'card';
      cardEl.innerHTML = def.html;
      layerEl.appendChild(cardEl);

      let labelEl = null;
      if (def.label) {
        labelEl = document.createElement('div');
        labelEl.className = 'card-label-outer';
        labelEl.textContent = def.label;
        labelEl.style.opacity = '0';
        layerEl.appendChild(labelEl);
      }

      const card = {
        colIdx: def.colIdx,
        rowIdx: def.rowIdx,
        fanIdx: FAN_IDX[def.rowIdx][def.colIdx],
        width: CARD_WIDTH,
        height: def.cardH ?? ROW_CARD_H,
        html: def.html,
        el: cardEl,
        labelEl,
        baseX: 0,
        baseY: 0,
        visualCx: 0,
        visualCy: 0,
        anchorX: 0,
        anchorY: 0,
        dotIdx: -1,
        hoverScale: 1.0,
        hoverTarget: 1.0,
        layerIndex: li,
        pushX: 0,
        pushY: 0,
        pushTX: 0,
        pushTY: 0,
        magnetX: 0,
        magnetY: 0,
        magnetTX: 0,
        magnetTY: 0,
        magnetT: 0,
        expandT: 0,
        expandTargetT: 0,
      };
      cardEl.addEventListener('click', (e) => {
        e.stopPropagation();
        // eslint-disable-next-line no-use-before-define
        if (cardClickEnabled) openCard(card);
      });
      return card;
    });

    return { el: layerEl, cards: cardObjects };
  });

  function getArcIntroLocalT(card) {
    const staggerStart = (1 - card.fanIdx / 7) * introStagger * ARC_INTRO_FRACTION;
    const staggerDur = ARC_INTRO_FRACTION - staggerStart;
    return Math.max(0, Math.min(1, (arcPanT - staggerStart) / staggerDur));
  }

  function getArcToGridLocalT(card) {
    const delay = (card.fanIdx / 7) * arcStagger;
    const win = 1 - arcStagger;
    return Math.max(0, Math.min(1, (arcToGridT - delay) / win));
  }

  // Fan arc position — diagonal arc upper-left to lower-right, bowing toward upper-right.
  function getFanCenter(card) {
    const alpha = Math.atan2(H, W);
    const arcZoom = 1.4 - 0.4 * easeOutCubic(arcToGridT);
    const R = Math.max(W, H) * 1.2 * arcZoom;
    const fanCX = W * 0.5 - R * Math.sin(alpha);
    const fanCY = H * 0.5 + R * Math.cos(alpha) - H * 0.15;
    const thetaM = Math.atan2(-Math.cos(alpha), Math.sin(alpha));
    const rotOffset = arcSpan * 0.5 - arcSpan * 1.5 * arcRotationEase(arcPanT);
    const effectiveSpan = arcSpan * (1 + 0.4 * arcRotationEase(arcPanT));
    const angle = thetaM + effectiveSpan / 2 - (card.fanIdx / 7) * effectiveSpan + rotOffset;

    let x = fanCX + R * Math.cos(angle);
    let y = fanCY + R * Math.sin(angle);
    const arcRot = (Math.atan2(Math.cos(angle), -Math.sin(angle)) * 180) / Math.PI;

    // Flatten arc to horizontal row as cards peel — blend projection axis arc tangent → horizontal.
    const flattenT = easeInOutCubic(Math.min(1, arcToGridT / 0.5));
    let rot = arcRot;
    if (flattenT > 0) {
      const midAngle = thetaM + rotOffset;
      const midX = fanCX + R * Math.cos(midAngle);
      const midY = fanCY + R * Math.sin(midAngle);
      const curTdX = -Math.sin(midAngle);
      const curTdY = Math.cos(midAngle);
      const blendTdX = curTdX + (1 - curTdX) * flattenT;
      const blendTdY = curTdY * (1 - flattenT);
      const tdLen = Math.sqrt(blendTdX * blendTdX + blendTdY * blendTdY);
      const tdX = blendTdX / tdLen;
      const tdY = blendTdY / tdLen;
      const proj = (x - midX) * tdX + (y - midY) * tdY;
      const lineX = midX + proj * tdX;
      const lineY = midY + proj * tdY;
      x += (lineX - x) * flattenT;
      y += (lineY - y) * flattenT;
      rot = arcRot * (1 - flattenT);
    }

    return {
      x,
      y,
      rot,
      rx: Math.cos(angle),
      ry: Math.sin(angle),
    };
  }

  function getAcrobatTarget(colIdx, rowIdx, cardH) {
    const winW = Math.min(W * 0.686, 988);
    const WIN_L = (W - winW) / 2;
    const WIN_T = H * 0.21 + 12;
    const scale = winW / 988;
    const COL_X = [355, 516, 677, 838];
    const ROW_CY = [194, 409];
    const cw = 146 * scale;
    const ch = cardH * (cw / CARD_WIDTH);
    return {
      x: WIN_L + COL_X[colIdx] * scale - cw / 2,
      y: WIN_T + ROW_CY[rowIdx] * scale - ch / 2,
      w: cw,
      h: ch,
    };
  }

  function buildGrid() {
    const sp = cfg.spacing;
    dots = [];
    const cols = Math.ceil(W / sp) + 2;
    const rows = Math.ceil(H / sp) + 2;
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        const x = c * sp;
        const y = r * sp;
        dots.push({
          ox: x, oy: y, x, y, vx: 0, vy: 0,
        });
      }
    }
  }

  function positionCards() {
    allLayers.forEach((layer) => {
      layer.cards.forEach((card) => {
        const cx = W * (0.5 + COL_OFFSETS_F[card.colIdx] * scrollColSpread);
        const rowAnchor = arcMode ? (-0.2 + 0.7 * scrollT) : 0.5;
        const cy = H * (0.5 + (card.rowIdx - rowAnchor) * scrollRowGap);
        card.baseX = cx - card.width / 2;
        card.baseY = cy - card.height / 2;
      });
    });
  }

  function updateCardAnchors() {
    if (!dots.length) return;
    const sp = cfg.spacing;
    const cols = Math.ceil(W / sp) + 2;
    allLayers.forEach((layer) => {
      layer.cards.forEach((card) => {
        const cx = (arcMode && card.visualCx !== 0)
          ? card.visualCx
          : card.baseX + card.width / 2;
        const cy = (arcMode && card.visualCy !== 0)
          ? card.visualCy
          : card.baseY + card.height / 2 + cardRevealOffset - gridPanY;
        const gc = Math.round(cx / sp);
        const gr = Math.max(0, Math.round(cy / sp));
        const idx = gr * cols + gc;
        card.dotIdx = Math.max(0, Math.min(dots.length - 1, idx));
        card.anchorX = dots[card.dotIdx].ox;
        card.anchorY = dots[card.dotIdx].oy;
      });
    });
  }

  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
    buildGrid();
    positionCards();
    updateCardAnchors();
  }

  function update() {
    const al = Math.max(0, Math.min(2, Math.round(zDepth)));
    activeLayer = al;
    const activeCards = allLayers[al].cards;

    dots.forEach((d) => {
      let effectiveMR = cfg.mouseRadius;
      let effectiveRF = cfg.repelForce;

      const effReveal = arcMode ? 0 : cardRevealOffset;
      const effPanY = arcMode ? arcGridPanY : gridPanY;
      let boost = 0;
      activeCards.forEach((card) => {
        const bx = (arcMode && card.visualCx !== 0)
          ? card.visualCx
          : card.baseX + card.width / 2;
        const by = (arcMode && card.visualCy !== 0)
          ? card.visualCy
          : card.baseY + card.height / 2 + effReveal - effPanY;
        const cdx = mouse.x - bx;
        const cdy = mouse.y - by;
        const cd = Math.sqrt(cdx * cdx + cdy * cdy);
        if (cd < 280) boost = Math.max(boost, 1 - cd / 280);
      });
      if (boost > 0) {
        effectiveMR = cfg.mouseRadius * (1 + boost * 1.5);
        effectiveRF = cfg.repelForce * (1 + boost * 0.8);
      }

      const dx = d.x - mouse.x;
      const dy = d.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < effectiveMR && dist > 0) {
        const force = (1 - dist / effectiveMR) * effectiveRF;
        d.vx += (dx / dist) * force;
        d.vy += (dy / dist) * force;
      }

      if (modalInfluence.radius > 0) {
        const mdx = d.x - W / 2;
        const mdy = d.y - H / 2;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < modalInfluence.radius && mdist > 0) {
          const mforce = (1 - mdist / modalInfluence.radius) * 3.0;
          d.vx += (mdx / mdist) * mforce;
          d.vy += (mdy / mdist) * mforce;
        }
      }

      d.vx += (d.ox - d.x) * cfg.spring;
      d.vy += (d.oy - d.y) * cfg.spring;
      d.vx *= cfg.damping;
      d.vy *= cfg.damping;
      d.x += d.vx;
      d.y += d.vy;
    });

    modalInfluence.radius += (modalInfluence.targetRadius - modalInfluence.radius) * 0.08;
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const al = activeLayer;
    const activeCards = allLayers[al].cards;
    const r = cfg.dotSize;

    dots.forEach((d) => {
      let darken = 0;
      activeCards.forEach((card) => {
        const hoverFactor = Math.min(1, Math.max(0, (card.hoverScale - 1.0) / 0.30));
        if (hoverFactor <= 0) return;
        const bx = (arcMode && card.visualCx !== 0) ? card.visualCx : card.baseX + card.width / 2;
        const revealOff = arcMode ? 0 : cardRevealOffset;
        const panOff = arcMode ? arcGridPanY : gridPanY;
        const by = (arcMode && card.visualCy !== 0)
          ? card.visualCy
          : card.baseY + card.height / 2 + revealOff - panOff;
        const ddx = d.ox - bx;
        const ddy = d.oy - by;
        const dd = Math.sqrt(ddx * ddx + ddy * ddy);
        if (dd < 280) darken = Math.max(darken, ((1 - dd / 280) ** 0.75) * hoverFactor);
      });

      const [dr, dg, db] = hexToRgb(cfg.dotColor);
      const cr = Math.round(dr + (5 - dr) * darken);
      const cg = Math.round(dg + (5 - dg) * darken);
      const cb = Math.round(db + (5 - db) * darken);
      const arcDotFade = arcMode ? arcToGridT : 1;
      const alpha = (0.45 + darken * 0.1) * (arcMode ? 1 : (1 - acrobatT)) * arcDotFade;
      if (alpha <= 0) return;

      ctx.beginPath();
      ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${cr},${cg},${cb},${alpha})`;
      ctx.fill();
    });
  }

  function setLabelPos(card, cx, cy, scale, opacity) {
    if (!card.labelEl) return;
    if (opacity <= 0) {
      card.labelEl.style.opacity = '0';
      return;
    }
    card.labelEl.style.left = `${cx - (CARD_WIDTH / 2) * scale}px`;
    card.labelEl.style.top = `${cy + (card.height / 2) * scale + 8}px`;
    card.labelEl.style.transform = `scale(${scale})`;
    card.labelEl.style.opacity = opacity.toFixed(3);
  }

  // Card rendering: 4-branch state machine — exactly one branch runs per card per frame.
  function updateCardPositions() {
    allLayers.forEach((layer) => {
      layer.cards.forEach((card) => {
        card.hoverScale += (card.hoverTarget - card.hoverScale) * 0.12;
        card.pushX += (card.pushTX - card.pushX) * 0.10;
        card.pushY += (card.pushTY - card.pushY) * 0.10;
        card.magnetX += (card.magnetTX - card.magnetX) * 0.10;
        card.magnetY += (card.magnetTY - card.magnetY) * 0.10;
        card.expandT += (card.expandTargetT - card.expandT) * 0.10;

        const interactFade = 1 - acrobatT;

        let dx = 0;
        let dy = 0;
        if (!arcMode && card.dotIdx >= 0 && card.dotIdx < dots.length) {
          const dot = dots[card.dotIdx];
          const smoothT = Math.min(1, (card.hoverScale - 1.0) / 0.30);
          const dotInfluence = (1 - smoothT) * interactFade;
          dx = (dot.x - dot.ox) * dotInfluence;
          dy = (dot.y - dot.oy) * dotInfluence;
        }

        if (!arcMode) {
          dx += (card.pushX + card.magnetX) * interactFade;
          dy += (card.pushY + card.magnetY) * interactFade;
        }

        const effectiveReveal = arcMode ? 0 : cardRevealOffset;
        const effectivePanY = arcMode ? arcGridPanY : gridPanY;

        if (arcMode && arcPanT < ARC_INTRO_FRACTION && acrobatT <= 0) {
          card.el.classList.remove('is-expanded');
          card.expandTargetT = 0;

          const introLocalT = getArcIntroLocalT(card);
          const introEase = easeOutCubic(introLocalT);

          const fanPos = getFanCenter(card);
          const arcZoomI = 1.4 - 0.4 * easeOutCubic(arcToGridT);
          const fanDepth = 1 - (card.fanIdx / 7) * 0.30;
          const fanScale = cfg.cardScale * (1 + arcLiftZoom) * fanDepth * arcZoomI;

          const alpha = Math.atan2(H, W);
          const R = Math.max(W, H) * 1.2 * arcZoomI;
          const fanCX = W * 0.5 - R * Math.sin(alpha);
          const fanCY = H * 0.5 + R * Math.cos(alpha) - H * 0.15;
          const thetaM = Math.atan2(-Math.cos(alpha), Math.sin(alpha));
          const compSpan = arcSpan * introCompress;
          const compAngle = thetaM + compSpan / 2 - (card.fanIdx / 7) * compSpan + 0.28;
          const compX = fanCX + R * Math.cos(compAngle);
          const compY = fanCY + R * Math.sin(compAngle);
          const compRot = (Math.atan2(Math.cos(compAngle), -Math.sin(compAngle)) * 180) / Math.PI;

          const extraOffX = W * (0.5 + (1 - card.fanIdx / 7) * introDistance);
          const extraOffY = (1 - card.fanIdx / 7) * H * 0.3;
          const startX = compX + extraOffX;
          const startY = compY + extraOffY + H * 0.35;

          const posX = startX + (fanPos.x - startX) * introEase;
          const posY = startY + (fanPos.y - startY) * introEase;
          const rotation = compRot + (fanPos.rot - compRot) * introEase;

          const furtherness = 1 - card.fanIdx / 7;
          const startScale = 0.50 - furtherness * 0.20;
          const scaleFactor = startScale + (1 - startScale) * introEase;
          const scale = fanScale * scaleFactor * (0.93 + 0.07 * easeOutBack(introLocalT));
          const introOpacity = Math.min(1, introLocalT / 0.10);

          card.visualCx = posX;
          card.visualCy = posY;
          card.el.style.zIndex = String(31 - card.fanIdx);

          const tx = posX - card.baseX - CARD_WIDTH / 2;
          const ty = posY - card.baseY - card.height / 2;
          card.el.style.left = `${card.baseX}px`;
          card.el.style.top = `${card.baseY}px`;
          card.el.style.width = `${CARD_WIDTH}px`;
          card.el.style.height = `${card.height}px`;
          const tiltFactor = Math.max(0, 1 - arcToGridT / 0.12);
          const screenYNorm = (fanPos.y - H / 2) / (H / 2);
          const cardYTilt = screenYNorm * arcYTilt * tiltFactor;
          const cardXTilt = -screenYNorm * arcXTilt * tiltFactor;
          card.el.style.transform = `translate(${tx}px,${ty}px) scale(${scale}) rotate(${rotation}deg) rotateY(${cardYTilt.toFixed(2)}deg) rotateX(${cardXTilt.toFixed(2)}deg)`;
          card.el.style.opacity = (cfg.opacity * introOpacity).toFixed(3);
          card.el.style.boxShadow = '0 4px 7.1px 0 rgba(0,0,0,0.15), 0 18px 25.1px 0 rgba(0,0,0,0.15), 0 60px 60px 0 rgba(0,0,0,0.15)';
          setLabelPos(card, posX, posY, scale, 0);
        } else if (arcMode && arcToGridT < 1 && acrobatT <= 0) {
          card.el.classList.remove('is-expanded');
          card.expandTargetT = 0;

          const cardPeelT = getArcToGridLocalT(card);
          const fanPos = getFanCenter(card);
          const arcZoom = 1.4 - 0.4 * easeOutCubic(arcToGridT);
          const fanDepth = 1 - (card.fanIdx / 7) * 0.30;
          const fanScale = cfg.cardScale * (1 + arcLiftZoom) * fanDepth * arcZoom;

          const arcLocalDelay = (card.fanIdx / 7) * arcStagger;
          const arcLocalWin = Math.max(0.01, 1 - arcStagger);
          const arcLocalT = Math.max(0, Math.min(1, (arcPanT - arcLocalDelay) / arcLocalWin));
          const arcLocalE = easeInOutCubic(arcLocalT);

          const pushedX = fanPos.x + fanPos.rx * 60 * arcLocalE;
          const pushedY = fanPos.y + fanPos.ry * 60 * arcLocalE;

          const gridCx = card.baseX + CARD_WIDTH / 2;
          const gridCy = card.baseY + card.height / 2;

          const totalPeelE = easeOutCubic(cardPeelT);
          const posX = pushedX + (gridCx - pushedX) * totalPeelE + dx;
          const posY = pushedY + (gridCy - pushedY) * totalPeelE + dy;
          const scale = fanScale + (cfg.cardScale - fanScale) * totalPeelE;
          const rotation = fanPos.rot * (1 - totalPeelE);

          card.visualCx = posX;
          card.visualCy = posY;

          const isPeeling = cardPeelT > 0.01;
          if (cardPeelT < 0.995) {
            const zBase = isPeeling ? 32 : 20;
            card.el.style.zIndex = String(zBase + (7 - card.fanIdx));
          } else {
            card.el.style.zIndex = '';
          }

          const tx = posX - card.baseX - CARD_WIDTH / 2;
          const ty = posY - card.baseY - card.height / 2;
          card.el.style.left = `${card.baseX}px`;
          card.el.style.top = `${card.baseY}px`;
          card.el.style.width = `${CARD_WIDTH}px`;
          card.el.style.height = `${card.height}px`;
          const tiltFactor = Math.max(0, 1 - arcToGridT / 0.12);
          const screenYNorm = (fanPos.y - H / 2) / (H / 2);
          const cardYTilt = screenYNorm * arcYTilt * tiltFactor;
          const cardXTilt = -screenYNorm * arcXTilt * tiltFactor;
          card.el.style.transform = `translate(${tx}px,${ty}px) scale(${scale}) rotate(${rotation}deg) rotateY(${cardYTilt.toFixed(2)}deg) rotateX(${cardXTilt.toFixed(2)}deg)`;
          card.el.style.opacity = cfg.opacity;
          const shadowA = (0.15 * (1 - cardPeelT)).toFixed(3);
          card.el.style.boxShadow = `0 4px 7.1px 0 rgba(0,0,0,${shadowA}), 0 18px 25.1px 0 rgba(0,0,0,${shadowA}), 0 60px 60px 0 rgba(0,0,0,${shadowA})`;
          const peelReveal = Math.max(0, Math.min(1, (cardPeelT - 0.8) / 0.2));
          setLabelPos(card, posX, posY, cfg.cardScale, peelReveal);
        } else if (acrobatT <= 0) {
          const expandW = CARD_WIDTH + (600 - CARD_WIDTH) * card.expandT;
          const expandH = card.height + (650 - card.height) * card.expandT;
          const dw = expandW - CARD_WIDTH;
          const dh = expandH - card.height;
          const scale = cfg.cardScale * card.hoverScale;

          card.visualCx = card.baseX + CARD_WIDTH / 2 + dx;
          card.visualCy = card.baseY + card.height / 2 + dy + effectiveReveal - effectivePanY;
          card.el.style.left = `${card.baseX - dw / 2}px`;
          card.el.style.top = `${card.baseY - dh / 2}px`;
          card.el.style.width = `${expandW}px`;
          card.el.style.height = `${expandH}px`;
          card.el.style.transform = `translate(${dx}px,${dy + effectiveReveal - effectivePanY}px) scale(${scale})`;
          card.el.style.opacity = cfg.opacity;
          card.el.style.boxShadow = '';
          card.el.style.zIndex = card.expandT > 0.01 ? 50 : '';
          if (card.expandT > 0.15) card.el.classList.add('is-expanded');
          else card.el.classList.remove('is-expanded');
          setLabelPos(card, card.visualCx, card.visualCy, scale, 1);
        } else {
          card.el.classList.remove('is-expanded');
          card.expandTargetT = 0;

          const target = getAcrobatTarget(card.colIdx, card.rowIdx, card.height);
          const endCx = target.x + target.w / 2;
          const endCy = target.y + target.h / 2;
          const endScale = target.w / CARD_WIDTH;

          const startCx = card.baseX + CARD_WIDTH / 2 + dx;
          const startCy = card.baseY + card.height / 2 + dy + effectiveReveal - effectivePanY;

          const et = easeInOutSine(acrobatT);
          const cx = startCx + (endCx - startCx) * et;
          const cy = startCy + (endCy - startCy) * et;
          const scale = cfg.cardScale + (endScale - cfg.cardScale) * et;
          card.visualCx = cx;
          card.visualCy = cy;
          const tx = cx - card.baseX - CARD_WIDTH / 2;
          const ty = cy - card.baseY - card.height / 2;
          card.el.style.left = `${card.baseX}px`;
          card.el.style.top = `${card.baseY}px`;
          card.el.style.width = `${CARD_WIDTH}px`;
          card.el.style.height = `${card.height}px`;
          card.el.style.transform = `translate(${tx}px,${ty}px) scale(${scale})`;
          card.el.style.opacity = cfg.opacity;
          card.el.style.boxShadow = '';
          card.el.style.zIndex = '';
          setLabelPos(card, cx, cy, scale, 1);
        }
      });
    });
  }

  function updateLayerTransforms() {
    layerShiftX += (layerShiftXTarget - layerShiftX) * 0.08;
    layerShiftY += (layerShiftYTarget - layerShiftY) * 0.08;

    allLayers.forEach((layer, li) => {
      const diff = zDepth - li;
      const absDiff = Math.abs(diff);
      const tz = -diff * LAYER_DIST;
      const op = Math.max(0, 1 - absDiff * 1.3);
      const tx = li === 0 ? layerShiftX : 0;
      const ty = li === 0 ? layerShiftY : 0;
      layer.el.style.transform = `translateX(${tx}px) translateY(${ty}px) translateZ(${tz}px)`;
      layer.el.style.opacity = op;
      layer.el.style.pointerEvents = (absDiff < 0.5 && acrobatT <= 0 && (!arcMode || arcToGridT >= 1)) ? 'auto' : 'none';
    });
  }

  function openCard(card) {
    // eslint-disable-next-line no-use-before-define
    if (expandedCard === card) { collapseCard(); return; }
    // eslint-disable-next-line no-use-before-define
    if (expandedCard) collapseCard();

    expandedCard = card;
    card.expandTargetT = 1;
    card.hoverTarget = 1.0;
    modalInfluence.targetRadius = 300;

    layerShiftXTarget = W / 2 - (card.baseX + CARD_WIDTH / 2);
    layerShiftYTarget = H / 2 - (card.baseY + card.height / 2 + cardRevealOffset - gridPanY);

    const ex = card.baseX + CARD_WIDTH / 2;
    const ey = card.baseY + card.height / 2;
    allLayers[0].cards.forEach((c) => {
      if (c === card) return;
      const cx = c.baseX + CARD_WIDTH / 2;
      const cy = c.baseY + c.height / 2;
      const ddx = cx - ex;
      const ddy = cy - ey;
      const dist = Math.sqrt(ddx * ddx + ddy * ddy);
      if (dist > 0) {
        c.pushTX = (ddx / dist) * 260;
        c.pushTY = (ddy / dist) * 380;
      }
    });
  }

  function collapseCard() {
    if (!expandedCard) return;
    expandedCard.expandTargetT = 0;
    allLayers[0].cards.forEach((c) => { c.pushTX = 0; c.pushTY = 0; });
    expandedCard = null;
    modalInfluence.targetRadius = 0;
    layerShiftXTarget = 0;
    layerShiftYTarget = 0;
  }

  function updateCardMagnetism() {
    if (!allLayers.length) return;
    const activeCards = allLayers[0].cards;

    if (arcMode) {
      activeCards.forEach((c) => {
        c.magnetTX = 0;
        c.magnetTY = 0;
        c.magnetT = 0;
        c.hoverTarget = 1.0;
      });
      return;
    }

    if (expandedCard) {
      activeCards.forEach((c) => {
        c.magnetTX = 0;
        c.magnetTY = 0;
        c.magnetT = 0;
        c.hoverTarget = 1.0;
      });
      return;
    }

    let mostAttractedCard = null;
    let mostAttractedT = 0;

    activeCards.forEach((card) => {
      const cx = (arcMode && card.visualCx !== 0)
        ? card.visualCx
        : card.baseX + card.width / 2;
      const cy = (arcMode && card.visualCy !== 0)
        ? card.visualCy
        : card.baseY + card.height / 2 + cardRevealOffset - gridPanY;
      const dist = Math.sqrt((mouse.x - cx) ** 2 + (mouse.y - cy) ** 2);

      if (dist < ATTRACT_RADIUS) {
        const t = (1 - dist / ATTRACT_RADIUS) ** 1.5;
        card.magnetT = t;
        card.hoverTarget = 1.0 + 0.30 * t;
        const vcx = card.visualCx || cx;
        const vcy = card.visualCy || cy;
        const ddx = mouse.x - vcx;
        const ddy = mouse.y - vcy;
        const vdist = Math.max(8, Math.sqrt(ddx * ddx + ddy * ddy));
        card.magnetTX = (ddx / vdist) * t * MAX_DISPLACE;
        card.magnetTY = (ddy / vdist) * t * MAX_DISPLACE;
        if (t > mostAttractedT) {
          mostAttractedT = t;
          mostAttractedCard = card;
        }
      } else {
        card.magnetT = 0;
        card.hoverTarget = 1.0;
        card.magnetTX = 0;
        card.magnetTY = 0;
      }
    });

    if (mostAttractedT > 0.01 && mostAttractedCard) {
      const ncx = (arcMode && mostAttractedCard.visualCx !== 0)
        ? mostAttractedCard.visualCx
        : mostAttractedCard.baseX + mostAttractedCard.width / 2;
      const ncy = (arcMode && mostAttractedCard.visualCy !== 0)
        ? mostAttractedCard.visualCy
        : mostAttractedCard.baseY + mostAttractedCard.height / 2 + cardRevealOffset - gridPanY;
      activeCards.forEach((card) => {
        if (card === mostAttractedCard) return;
        const cx = (arcMode && card.visualCx !== 0)
          ? card.visualCx
          : card.baseX + card.width / 2;
        const cy = (arcMode && card.visualCy !== 0)
          ? card.visualCy
          : card.baseY + card.height / 2 + cardRevealOffset - gridPanY;
        const repDx = cx - ncx;
        const repDy = cy - ncy;
        const repDist = Math.sqrt(repDx * repDx + repDy * repDy);
        if (repDist > 0) {
          card.magnetTX = (repDx / repDist) * mostAttractedT * NEIGHBOR_PUSH;
          card.magnetTY = (repDy / repDist) * mostAttractedT * NEIGHBOR_PUSH;
        }
      });
    }
  }

  let rafId = 0;
  let running = false;

  // Total virtual scroll units consumed by the animation (arc mode).
  const ANIM_SCROLL_TOTAL = ARC_ACROBAT_START + ARC_ACROBAT_DUR;

  function readScrollProgress() {
    const rect = el.getBoundingClientRect();
    const panRange = Math.max(1, el.offsetHeight - window.innerHeight);
    return Math.max(0, Math.min(1, -rect.top / panRange));
  }

  function loop() {
    if (!running) return;
    scroll.current = readScrollProgress() * ANIM_SCROLL_TOTAL;
    zDepth = 0;
    cardRevealOffset = Math.max(0, REVEAL_SCROLL - scroll.current);

    const rawPan = Math.max(0, scroll.current - REVEAL_SCROLL);
    if (rawPan <= GRID_PAN_MAX) {
      gridPanY = rawPan;
    } else {
      const over = rawPan - GRID_PAN_MAX;
      if (over < GRID_PAN_BLEND) {
        const decel = (1 - GRID_PAN_SLOW_RATE) / (2 * GRID_PAN_BLEND);
        gridPanY = GRID_PAN_MAX + over - decel * over * over;
      } else {
        const blendIntegral = (GRID_PAN_BLEND * (1 + GRID_PAN_SLOW_RATE)) / 2;
        gridPanY = GRID_PAN_MAX + blendIntegral + GRID_PAN_SLOW_RATE * (over - GRID_PAN_BLEND);
      }
    }

    const arcTextPanT = arcMode
      ? Math.max(0, Math.min(1, (scroll.current - ARC_GRID_END) / ARC_SETTLE_DUR))
      : 0;
    const arcRevealT = arcMode
      ? Math.max(0, Math.min(1, (scroll.current - ARC_GRID_END) / 400))
      : 0;

    if (arcMode) {
      arcPanT = Math.max(0, Math.min(1, scroll.current / ARC_PAN_END));
      const peelStart = ARC_PAN_END - ARC_PEEL_OVERLAP;
      const peelT = (scroll.current - peelStart) / (ARC_GRID_END - peelStart);
      arcToGridT = Math.max(0, Math.min(1, peelT));
      const acT = (scroll.current - ARC_ACROBAT_START) / ARC_ACROBAT_DUR;
      acrobatT = Math.max(0, Math.min(1, acT));
      if (scroll.current >= ARC_ACROBAT_START - 150 && expandedCard) collapseCard();
    } else {
      arcPanT = 0;
      arcToGridT = 1;
      if (scroll.current >= ACROBAT_START_SCROLL - 150 && expandedCard) collapseCard();
      const span = ACROBAT_END_SCROLL - ACROBAT_START_SCROLL;
      acrobatT = Math.max(0, Math.min(1, (scroll.current - ACROBAT_START_SCROLL) / span));
    }

    const acrobatSlide = easeInOutSine(acrobatT);
    const acrobatScale = 2.5 - 1.5 * acrobatSlide;
    const winH = H * 0.63;
    const topOverhang = ((2.5 - 1) / 2) * winH;
    const offscreenY = H + topOverhang + 30;
    const acrobatTranslateY = (1 - acrobatSlide) * offscreenY;
    acrobatWinEl.style.transform = `translateY(${acrobatTranslateY}px) scale(${acrobatScale})`;

    const arc256PeelStart = ARC_PAN_END * ARC_INTRO_FRACTION;
    const arc256Span = ARC_ACROBAT_START - arc256PeelStart;
    const arc256RawT = (scroll.current - arc256PeelStart) / arc256Span;
    const arc256Progress = Math.max(0, Math.min(1, arc256RawT));
    const arc256DrawT = easeInOutSine(arc256Progress);
    const arc256FadeIn = Math.max(0, Math.min(1, arc256Progress * 6));
    const arc256FadeOut = Math.max(0, 1 - Math.max(0, Math.min(1, (acrobatT - 0.4) / 0.3)));
    // eslint-disable-next-line no-use-before-define
    arc256Path.style.strokeDashoffset = arc256Length * (1 - arc256DrawT);
    arc256Svg.style.opacity = arc256FadeIn * arc256FadeOut;

    const titleRawT = (scroll.current - ARC_ACROBAT_START) / (ARC_ACROBAT_DUR + 350);
    const titleAnimT = Math.max(0, Math.min(1, titleRawT));
    const titleSlide = easeOutCubic(titleAnimT);
    const titleScale = 0.92 + 0.08 * titleSlide;
    if (acrobatTitleEl) {
      acrobatTitleEl.style.transform = `translateY(${acrobatTranslateY}px) scale(${titleScale})`;
      acrobatTitleEl.style.opacity = titleSlide;
    }
    if (acrobatCtaEl) acrobatCtaEl.style.transform = `translateY(${acrobatTranslateY}px)`;

    if (acrobatT > 0) {
      layerShiftXTarget = 0;
      layerShiftYTarget = 0;
    }

    scrollT = arcMode ? arcToGridT : Math.min(1, scroll.current / REVEAL_SCROLL);
    const compressedColGapPx = W * COL_GAP_F * 0.75 - CARD_WIDTH;
    const compressedRowGap = (compressedColGapPx + ROW_CARD_H) / H;
    if (arcMode) {
      const postPeelT = easeOutSine(arcTextPanT);
      const acrobatCmp = easeInOutSine(acrobatT);
      scrollColSpread = baseColSpread + (0.75 - baseColSpread) * arcToGridT
        - 0.15 * postPeelT - 0.15 * acrobatCmp;
      scrollRowGap = baseRowGap + (compressedRowGap - baseRowGap) * arcToGridT
        - 0.04 * postPeelT - 0.04 * acrobatCmp;
      const textAtRestY = H * (0.5 + 0.5 * compressedRowGap) + ROW_CARD_H / 2 + 90;
      const arcPanTarget = Math.max(0, textAtRestY - H * 0.50);
      arcGridPanY = arcPanTarget * easeOutSine(arcTextPanT);
    } else {
      scrollColSpread = baseColSpread + (0.75 - baseColSpread) * scrollT;
      scrollRowGap = baseRowGap + (compressedRowGap - baseRowGap) * scrollT;
      arcGridPanY = 0;
    }

    const textEt = easeInOutSine(acrobatT);
    const textScale = 1 - 0.28 * textEt;
    if (arcMode) {
      const col3Right = W * (0.5 + COL_OFFSETS_F[3] * scrollColSpread) + CARD_WIDTH / 2;
      const arcTextLeft = col3Right - textBlockEl.offsetWidth;
      frozenTextY = H * (0.5 + 0.5 * scrollRowGap) + ROW_CARD_H / 2 + 90 + H * 0.12 - arcGridPanY;
      textBlockEl.style.left = `${arcTextLeft}px`;
      const arcReveal = Math.min(1, arcRevealT * 2.5);
      const arcTextFadeT = Math.max(0, Math.min(1, (acrobatT - 0.4) / 0.3));
      const textOpacity = Math.max(0, 1 - arcTextFadeT) * arcReveal;
      textBlockEl.style.transform = `translateY(${frozenTextY}px) scale(${textScale})`;
      textBlockEl.style.opacity = textOpacity;
    } else {
      const textScrollT = Math.min(1, scroll.current / REVEAL_SCROLL);
      const textColSpread = baseColSpread + (0.75 - baseColSpread) * textScrollT;
      const tCompColGapPx = W * COL_GAP_F * textColSpread - CARD_WIDTH;
      const tCompRowGap = (tCompColGapPx + ROW_CARD_H) / H;
      const textRowGapVal = baseRowGap + (tCompRowGap - baseRowGap) * textScrollT;
      const textLeft = W * (0.5 + COL_OFFSETS_F[0] * textColSpread) - CARD_WIDTH / 2;
      const textBaseY = H * (0.5 + 0.5 * textRowGapVal) + ROW_CARD_H / 2 + 90;
      if (acrobatT <= 0) frozenTextY = textBaseY - gridPanY;
      const textOpacity = Math.max(0, 1 - textEt);
      textBlockEl.style.left = `${textLeft}px`;
      textBlockEl.style.transform = `translateY(${frozenTextY}px) scale(${textScale})`;
      textBlockEl.style.opacity = textOpacity;
    }

    positionCards();
    updateCardAnchors();
    updateCardMagnetism();
    update();
    draw();
    updateCardPositions();
    updateLayerTransforms();
    rafId = requestAnimationFrame(loop);
  }

  const onResize = () => resize();
  const onMouseMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };
  const onMouseLeave = () => { mouse.x = -9999; mouse.y = -9999; };
  const onDocClick = () => { if (cardClickEnabled && expandedCard) collapseCard(); };
  const onKeyDown = (e) => { if (e.key === 'Escape') collapseCard(); };

  window.addEventListener('resize', onResize);
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseleave', onMouseLeave);
  document.addEventListener('click', onDocClick);
  document.addEventListener('keydown', onKeyDown);

  // dasharray >> path length so the full dash covers the path with no snake effect
  const arc256Length = Math.max(arc256Path.getTotalLength(), 3000) * 2 + 500;
  arc256Path.style.strokeDasharray = arc256Length;
  arc256Path.style.strokeDashoffset = arc256Length;

  resize();

  const startLoop = () => {
    if (running) return;
    running = true;
    loop();
  };
  const stopLoop = () => {
    running = false;
    cancelAnimationFrame(rafId);
    rafId = 0;
  };

  const io = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) startLoop();
    else stopLoop();
  }, { rootMargin: '200px 0px' });
  io.observe(el);

  new MutationObserver((_, observer) => {
    if (document.contains(el)) return;
    stopLoop();
    io.disconnect();
    window.removeEventListener('resize', onResize);
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseleave', onMouseLeave);
    document.removeEventListener('click', onDocClick);
    document.removeEventListener('keydown', onKeyDown);
    observer.disconnect();
  }).observe(document.body, { childList: true, subtree: true });

  return el;
}
