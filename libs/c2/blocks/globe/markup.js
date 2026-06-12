/* GLOBE_MARKUP + buildGlobeDom: the DOM the runtime expects, built into the block. */

// ── DOM the runtime expects ──────────────────────────────────────────────────
// The original prototype hand-authored these nodes in index.html. We build them
// inside the block element instead. The runtime finds nodes by querying *within
// the block root* (root.querySelector('.class')), so ids are no longer needed
// for lookup → more than one globe can coexist on a page.
//
// Two things still require a real id, made unique per instance via `gid`:
//   • the CA SVG filter — referenced from CSS as `filter: url(#ca-filter-<gid>)`.
//   • the modal heading — referenced by the dialog's `aria-labelledby`.
//
// Fixed-position overlays (ca-svg, pull-quote, modal) can live inside the block:
// position:fixed escapes the relative/sticky ancestors here (no transform/filter
// on the chain).
const buildMarkup = (gid) => `
  <div class="offer-world">
    <canvas class="offer-globe-canvas" style="position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:3;display:none;pointer-events:auto;touch-action:pan-y;"></canvas>
  </div>

  <svg class="ca-svg" aria-hidden="true" focusable="false" style="position:absolute;width:0;height:0;overflow:hidden">
    <defs>
      <filter id="ca-filter-${gid}" color-interpolation-filters="sRGB">
        <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="rch"/>
        <feOffset in="rch" class="ca-r-offset" dx="0" dy="0" result="rOff"/>
        <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="gch"/>
        <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="bch"/>
        <feOffset in="bch" class="ca-b-offset" dx="0" dy="0" result="bOff"/>
        <feComposite in="rOff" in2="gch" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="rg"/>
        <feComposite in="rg" in2="bOff" operator="arithmetic" k1="0" k2="1" k3="1" k4="0"/>
      </filter>
    </defs>
  </svg>

  <aside class="offer-arc-copy" role="region" aria-label="Image gallery intro">
    <h2 class="offer-arc-copy__title">Deliver professional work that stands out.</h2>
    <p class="offer-arc-copy__body">Whether you're designing a logo, or retouching 100 event photos, you can get the results you want with apps that set the industry standard.</p>
  </aside>

  <div class="offer-pullquote-pin">
    <div class="offer-pullquote">
      <blockquote class="offer-pullquote__quote">&ldquo;I wear a lot of different hats. Creative Cloud gives me all the apps under one umbrella, so it&rsquo;s easy to share my ideas with the world.&rdquo;</blockquote>
      <div class="offer-pullquote__attribution">
        <p class="offer-pullquote__name">Frankie Gaw</p>
        <p class="offer-pullquote__role">Professional Foodie and Designer</p>
      </div>
    </div>
  </div>

  <div class="card-modal" aria-hidden="true">
    <div class="card-modal__backdrop"></div>
  </div>

  <canvas class="modal-card-canvas" style="position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:115;display:none;pointer-events:none;"></canvas>

  <div class="card-modal-chrome" role="dialog" aria-modal="true" aria-labelledby="card-modal-name-${gid}" aria-describedby="card-modal-description-${gid}" aria-hidden="true">
    <button class="card-modal__nav card-modal__nav--prev" type="button" aria-label="Previous card">
      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M15 5l-7 7 7 7" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>
    <button class="card-modal__nav card-modal__nav--next" type="button" aria-label="Next card">
      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M9 5l7 7-7 7" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>
    <div class="card-modal__counter" aria-hidden="true"></div>
    <button class="card-modal__close" type="button" aria-label="Close">
      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>
    </button>
    <img class="card-modal__image" alt="" />
    <div class="card-modal__info">
      <p class="card-modal__role-label">Photographer</p>
      <h2 class="card-modal__name" id="card-modal-name-${gid}"></h2>
      <p class="card-modal__description" id="card-modal-description-${gid}"></p>
      <ul class="card-modal__badges" aria-label="Apps used"></ul>
    </div>
  </div>
`;

export default function buildGlobeDom(el, gid) {
  el.classList.add('offer-pin-spacer');
  el.innerHTML = buildMarkup(gid);
}
