/* Card-detail modal for the globe — a DI module (createGlobeModal(deps)).

   The clicked card mesh itself flies out of the sphere to a target position in
   world space on a SEPARATE WebGL canvas/scene (above the blurred main canvas)
   and becomes the visible "image"; HTML chrome (info panel, nav arrows, close,
   counter) is positioned to track its projected screen bounds. Owns: open/close
   /navigate state machine (MODAL_PHASE), the modal renderer+scene, the SDF
   material swap, desktop cross-warp nav, mobile swipe/pull gestures, and the
   per-frame modal animation.

   Coupling to the sphere is deliberately narrow and injected, not imported:
   the closing animation reads the live sphere-drag rotation via the injected
   `sphereRotEuler` / `sphereRotQuat` THREE objects (shared by reference, updated
   each frame by the core sphere stage); reparenting a card back to its slot goes
   through `snapToSphereSlot`; the sphere's nav-reactivity spring is triggered via
   `requestNavNudge` (the spring physics + sphereRotX/Y live in core). Motion-trail
   CA is the core `applyMotionCA`. Everything else (scene, camera, sphereGroup,
   cards, viewport, breakpoint, card dims) is read through getters so the module
   never holds a stale snapshot across a resize / breakpoint re-init. */
import * as THREE from '../three.module.min.js';
import { createModalMaterial } from './materials.js';
import { easeInOutCubic, easeOutCubic } from './math.js';

// ── Modal tuning (module scope — pure, no per-instance state) ──────────────────
// Modal lifecycle state machine. modalPhase holds one of these values.
// Transitions:
//   CLOSED  → OPENING        open()
//   OPENING → OPEN           open animation reaches aT≥1 (updateAnimation)
//   OPEN    → OPEN           navigate / commitSwipeNavigation (re-targets)
//   OPENING/OPEN → CLOSING   close()
//   CLOSING → CLOSED         close animation reaches aT≥1
// CLOSED is null so `if (modalPhase)` reads as "a modal interaction is live".
const MODAL_PHASE = Object.freeze({
  CLOSED: null,
  OPENING: 'opening',
  OPEN: 'open',
  CLOSING: 'closing',
});
// World-space camera→card distance the modal card flies to (perspective FOV 60°).
const MODAL_CAM_DIST = 16.4;
// SDF rounded-corner radius as a fraction of card height (22px on the 631px-tall
// source). Used by the modal layout math; materials.js mirrors it for the shader.
const SDF_CORNER_RADIUS = 22 / 631;
const MODAL_ANIM_DURATION = 350; // ms — open/close fly time (short so the card settles fast)
const CHROME_REVEAL_DUR = 300; // ms — chrome fade-in after the card is 90% settled
// Fisheye warp peaks (sin bell curve) per modal interaction.
const MODAL_WARP_OPEN = 0.30; // opening animation
const MODAL_WARP_CLOSE = 0.30; // closing animation
const MODAL_WARP_PULL = 0.40; // full mobile pull-down
const MODAL_WARP_SWIPE = 0.25; // full mobile horizontal swipe
// Desktop/tablet modal-nav cross-warp transition (old card warps out, new warps in).
const DN_NAV_DUR = 500; // ms
const DN_NAV_WARP = 0.40; // peak warp
// Desktop/tablet modal layout — sizes the modal image + bounds the chrome columns
// (see computeModalTarget / positionModalChrome). Vertical padding is symmetric so
// the image's center stays at viewport H/2 whether height- or width-constrained.
const DT_IMG_PAD_T = 80; // image top padding (landscape assets, uAspect > 1)
const DT_IMG_PAD_B = 80; // image bottom padding (landscape assets)
const DT_PORTRAIT_VPAD = 24; // tighter top/bottom padding for portrait / 1×1 (uAspect ≤ 1)
const DT_NAV_INSET = 24; // nav arrow inset baseline (feeds the image-width cap)
const DT_NAV_W = 44; // matches .card-modal__nav width
const DT_GROUP_PAD_H = DT_NAV_INSET + DT_NAV_W + 20; // 88px — keeps the image clear of chevrons

export default function createGlobeModal({
  q,
  getScene,
  getCamera,
  getSphereGroup,
  getRenderer,
  getCards,
  getCount,
  getCardMetadata,
  getViewport,
  getBP,
  getCardDims,
  cardAspect,
  caEnabled,
  // Sphere-rotation bridge (live THREE objects shared by reference + core callbacks):
  sphereRotEuler,
  sphereRotQuat,
  snapToSphereSlot,
  requestNavNudge,
  applyMotionCA,
}) {
  // ── Modal renderer / scene (separate canvas above the blurred main canvas) ──
  let modalRenderer = null;
  let modalScene = null;
  let modalCanvasEl = null;
  let modalEl = null;

  // ── Modal state ──
  let modalIdx = -1; // currently open card index, -1 if closed
  let modalCard = null; // reference to the card object whose mesh is animating
  let modalPhase = MODAL_PHASE.CLOSED;
  let modalAnimT0 = 0; // animation start timestamp
  // World-transform snapshots (THREE) — created in setup().
  let modalStartPos = null;
  let modalStartQuat = null;
  let modalStartScale = null;
  let modalCloseStartPos = null;
  let modalCloseStartQuat = null;
  let modalCloseStartScale = null;
  let chromeProjV = null; // reusable Vector3 for chrome positioning projection

  // Chrome reveal — elements fade + slide in after card is 90% settled.
  let modalChromeRevealT0 = -1; // timestamp when card first hit 90%; -1 = not yet
  let modalChromeFadeT = 0; // 0→1 fade progress for chrome elements

  // Tracks when the modal was last opened — used by close() to suppress the
  // synthetic 'click' browsers dispatch after touch pointerup (it lands on the
  // newly-visible backdrop and would immediately close the just-opened modal).
  let modalOpenedAt = 0;
  // setTimeout ID for the close-finalize cleanup. Tracked so opening a NEW modal
  // before it fires can cancel it (a stale firing would yank the new modal's
  // is-visible / modal-open / Lenis-pause state). See close() + open().
  let closeTimeoutId = null;
  // Element to restore focus to when the modal closes (typically the gallery
  // button that opened it, or whatever had focus before a mouse-click open).
  let modalFocusRestoreEl = null;
  // keydown listener (on document) — stored so setup() can detach a prior one
  // before re-adding on a breakpoint re-init (avoids stacking → double-nav).
  let keydownHandler = null;

  // ── Modal warp state (drives fisheye uWarp/uWarpCenter on the SDF material) ──
  let modalWarp = 0;
  const modalWarpCenter = new THREE.Vector2(0.5, 0.5);

  // ── Desktop modal-nav cross-warp transition ──
  let dnNavActive = false;
  let dnNavT0 = 0;
  let dnNavOldCard = null;
  let dnNavNewCard = null;

  function getModalIdx() { return modalIdx; }

  // True if `card` is currently managed by the modal — the active modal card, or a
  // swipe-neighbor parented into modalScene. The core per-card loop skips these so
  // it doesn't fight the transforms the modal drives for them.
  function isCardManaged(card) {
    return card === modalCard || (!!modalScene && card.mesh.parent === modalScene);
  }

  // Per-card SDF modal material, lazily built and cached on the card. The card's
  // current `.map` (texture) feeds the modal material; aspect is the rendered
  // world-space width/height (cardAspect × the card's sphereScaleX).
  function getModalMaterial(card) {
    if (!card.modalMat) {
      card.modalMat = createModalMaterial(card.mesh.material.map, card.sphereScaleX * cardAspect);
    }
    return card.modalMat;
  }

  // Reset the modal SDF material's animated uniforms to clean defaults. The SDF
  // material is cached per-card (card.modalMat), so a card mid-fade during an
  // interrupted nav (uOpacity stuck at e.g. 0.4) would inherit that stale value
  // next time it's shown — rendering dark + ghosted. Call whenever the SDF
  // material is (re)assigned to a card or a card leaves the modal flow.
  function resetModalMaterialUniforms(material, opacity) {
    const u = material && material.uniforms;
    if (!u) return;
    if (u.uOpacity) u.uOpacity.value = (typeof opacity === 'number' ? opacity : 1);
    if (u.uWarp) u.uWarp.value = 0;
    if (u.uMotionDir) u.uMotionDir.value.set(0, 0);
    // uWarpCenter is intentionally NOT reset here — callers set it (open: from
    // click origin, nav: 0.5/0.5) right after this.
  }

  // Map a viewport touch/click position to an approximate UV on the asset.
  // Asset visibly fills nearly the whole viewport on mobile (8px margins), so
  // viewport-fraction ≈ asset UV. Screen Y inverts (top→bottom = UV 1→0).
  function touchToWarpUV(clientX, clientY, out) {
    const { W, H } = getViewport();
    const v = out || new THREE.Vector2();
    v.x = Math.max(0, Math.min(1, clientX / W));
    v.y = Math.max(0, Math.min(1, 1 - clientY / H));
    return v;
  }

  // Push the current modalWarp / modalWarpCenter onto the active modal card's uniforms.
  function pushModalWarpUniforms() {
    if (!modalCard) return;
    const u = modalCard.mesh.material && modalCard.mesh.material.uniforms;
    if (!u || !u.uWarp || !u.uWarpCenter) return;
    u.uWarp.value = modalWarp;
    u.uWarpCenter.value.copy(modalWarpCenter);
  }

  // Compute target world position/quaternion/scale for the modal-active card.
  // Card is always 75% of viewport height; width follows the image's native aspect
  // ratio via sphereScaleX so portrait, square, and landscape assets all appear
  // undistorted. Width is clamped so very wide landscape cards don't overflow.
  // Recomputed per-frame so it stays anchored even if the camera is still moving.
  function computeModalTarget(outPos, outQuat, outScale, cardOverride) {
    // cardOverride: if provided, compute target for THIS card (used by the
    // swipe-neighbors logic to position prev/next at offset slots). Defaults to
    // the active modalCard.
    const card = cardOverride || modalCard;
    const camera = getCamera();
    const { W, H } = getViewport();
    const { w: CARD_W_SPHERE, h: CARD_H_SPHERE } = getCardDims();
    const camZ = camera.position.z;
    const dist = MODAL_CAM_DIST;

    // How many CSS pixels = 1 world unit at 'dist' from the perspective camera (FOV 60°).
    const pxPerWorld = H / (2 * dist * Math.tan(Math.PI / 6));

    // Mobile: top-left lock at (8,8). Asset height is COMPUTED so a 24px gap
    //   sits between asset bottom and the nav-arrow row, and another 24px below
    //   the nav arrows before the info panel (whose natural height was measured
    //   in open()). Width is proportional via sphereScaleX (aspect kept).
    // Desktop: centered horizontally, slight upward bias, width clamped to 92% W.
    const isMobile = (getBP() === 'sm');
    const sScaleX = (card && card.sphereScaleX) ? card.sphereScaleX : 1;
    let scaleY; let
      scaleX;

    if (isMobile) {
      // Mobile: VISIBLE asset always fills width = (viewport - 16px), 8px margins each side.
      // Height follows native aspect ratio (sphereScaleX × cardAspect).
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
      const SDF_RADIUS = SDF_CORNER_RADIUS;
      const uAspect = cardAspect * sScaleX;

      const visibleWidthPx = W - 2 * INSET;
      const cardWPx = visibleWidthPx / (1 - (2 * SDF_RADIUS) / uAspect);
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
      // screen Y is top→bottom; world Y is bottom→top
      const worldY = (H / 2 - centerScreenY) / pxPerWorld;
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
      const uAspect = cardAspect * sScaleX;
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
    const chromeEl = q('.card-modal-chrome');
    const camera = getCamera();
    if (!chromeEl || !camera) return;
    const { W, H } = getViewport();
    const { w: CARD_W_SPHERE, h: CARD_H_SPHERE } = getCardDims();
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

    if (!chromeProjV) chromeProjV = new THREE.Vector3();
    const pv = chromeProjV;

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
    const SDF_RADIUS_PX = SDF_CORNER_RADIUS * (cardBotPx - cardTopPx);
    const INSET = 24 + Math.round(SDF_RADIUS_PX);

    const isMobile = (getBP() === 'sm');

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

  // Write the authored metadata for card index i into the modal chrome DOM.
  function populateModal(i) {
    const targetEl = q('.card-modal-chrome') || modalEl;
    if (!targetEl) return;
    const meta = getCardMetadata(i);
    const imgEl = targetEl.querySelector('.card-modal__image');
    if (imgEl) { imgEl.src = meta.img; imgEl.alt = meta.name; }
    const roleLabelEl = targetEl.querySelector('.card-modal__role-label');
    if (roleLabelEl) roleLabelEl.textContent = meta.role;
    targetEl.querySelector('.card-modal__name').textContent = meta.name;
    targetEl.querySelector('.card-modal__description').textContent = meta.description;
    const counterEl = targetEl.querySelector('.card-modal__counter');
    // TODO: localize this
    if (counterEl) counterEl.textContent = `${i + 1}/${getCount()}`;
    const badgesEl = targetEl.querySelector('.card-modal__badges');
    badgesEl.innerHTML = '';
    meta.badges.forEach((b) => {
      const row = document.createElement('li');
      row.className = 'card-modal__badge';
      row.innerHTML = '<div class="card-modal__badge-left">'
          + `<div class="card-modal__badge-icon card-modal__badge-icon--${b.app.id}" aria-hidden="true">${b.app.abbr}</div>`
          + `<span class="card-modal__badge-app">${b.app.name}</span>`
        + '</div>'
        + `<span class="card-modal__badge-role">${b.role}</span>`;
      badgesEl.appendChild(row);
    });
  }

  // ── Swipe-neighbors helpers ───────────────────────────────────────────────
  // Pre-attach prev/next cards to modalScene at world offsets of ±viewport_width
  // so a horizontal swipe reveals them naturally (single CSS transform on the
  // canvas moves all three together — iOS Photos style).
  function attachCardToModal(card) {
    if (!card || !modalScene) return;
    if (card.mesh.parent === modalScene) return;
    modalScene.attach(card.mesh);
    card.mesh.origMaterial = card.mesh.material;
    card.mesh.material = getModalMaterial(card);
    card.mesh.renderOrder = 0;
    card.mesh.material.depthTest = true;
    // Reset cached SDF uniforms (uOpacity, uWarp, uMotionDir) so stale values
    // from a previous interrupted modal session don't carry over.
    resetModalMaterialUniforms(card.mesh.material, 1);
  }

  function detachCardToSphere(card) {
    const sphereGroup = getSphereGroup();
    if (!card || !sphereGroup) return;
    if (card.mesh.parent === sphereGroup) return;
    if (card.mesh.origMaterial) {
      card.mesh.material = card.mesh.origMaterial;
      card.mesh.origMaterial = null;
    }
    sphereGroup.attach(card.mesh);
    snapToSphereSlot(card);
    card.mesh.material.depthTest = true;
    card.mesh.renderOrder = 0;
  }

  // Position a card in modalScene at slot -1 (left), 0 (center), or +1 (right).
  // Slot 0 = the card's natural top-left-locked target. ±1 = offset by viewport_width.
  function positionCardInModal(card, slot) {
    if (!card) return;
    const { W, H } = getViewport();
    const tgtPos = new THREE.Vector3();
    const tgtQuat = new THREE.Quaternion();
    const tgtScale = new THREE.Vector3();
    computeModalTarget(tgtPos, tgtQuat, tgtScale, card);
    const pxPerWorld = H / (2 * MODAL_CAM_DIST * Math.tan(Math.PI / 6));
    const viewportWidthWorld = W / pxPerWorld;
    card.mesh.position.set(tgtPos.x + slot * viewportWidthWorld, tgtPos.y, tgtPos.z);
    card.mesh.quaternion.copy(tgtQuat);
    card.mesh.scale.copy(tgtScale);
  }

  // Attach prev/next of the current modalCard to modalScene at offset positions.
  function prepSwipeNeighbors() {
    const cards = getCards();
    if (!modalCard || cards.length < 3) return; // skip if too few cards for distinct neighbors
    const n = cards.length;
    const prevIdx = (modalIdx - 1 + n) % n;
    const nextIdx = (modalIdx + 1) % n;
    attachCardToModal(cards[prevIdx]);
    positionCardInModal(cards[prevIdx], -1);
    attachCardToModal(cards[nextIdx]);
    positionCardInModal(cards[nextIdx], 1);
  }

  // Return all non-current cards in modalScene back to sphereGroup.
  function clearSwipeNeighbors() {
    const sphereGroup = getSphereGroup();
    if (!modalScene || !sphereGroup) return;
    const cards = getCards();
    // Iterate a copy of children because detach mutates the list.
    const children = modalScene.children.slice();
    for (let i = 0; i < children.length; i += 1) {
      const child = children[i];
      // Keep the current card; return every other matching card to the sphere.
      if (!modalCard || child !== modalCard.mesh) {
        for (let j = 0; j < cards.length; j += 1) {
          if (cards[j].mesh === child) { detachCardToSphere(cards[j]); break; }
        }
      }
    }
  }

  // Finalize the desktop nav transition: detach old card back to the sphere,
  // restore its material, reset uniforms on the new card to clean defaults.
  // Safe to call whether or not the animation reached aT >= 1.
  function completeDesktopNavTransition() {
    if (!dnNavActive) return;
    const sphereGroup = getSphereGroup();
    if (dnNavOldCard) {
      // Reset the cached SDF material's animated uniforms BEFORE swapping back
      // to the basic material. The SDF material persists in card.modalMat —
      // if uOpacity was mid-fade (interrupted nav), it would stay stuck at
      // that value, and the next modal session would show this card ghosted.
      resetModalMaterialUniforms(dnNavOldCard.modalMat, 1);
      if (dnNavOldCard.mesh.origMaterial) {
        dnNavOldCard.mesh.material = dnNavOldCard.mesh.origMaterial;
        dnNavOldCard.mesh.origMaterial = null;
      }
      sphereGroup.attach(dnNavOldCard.mesh);
      snapToSphereSlot(dnNavOldCard);
      dnNavOldCard.mesh.material.depthTest = true;
      dnNavOldCard.mesh.renderOrder = 0;
    }
    if (dnNavNewCard) {
      // The new card stays as the active modal card with SDF material; just
      // restore uniforms to a clean "fully visible, no warp" state.
      resetModalMaterialUniforms(dnNavNewCard.mesh.material, 1);
      dnNavNewCard.mesh.renderOrder = 0;
    }
    dnNavOldCard = null;
    dnNavNewCard = null;
    dnNavActive = false;
  }

  // Begin the desktop modal-nav cross-warp transition. Old card stays at the
  // modal position with uOpacity easing to 0 and uWarp on a sin bell curve;
  // new card is placed at its own modal target (same screen position, possibly
  // different scale) with uOpacity easing to 1 and the same warp curve. Both
  // render at the same position; renderOrder controls draw order during blend.
  function startDesktopNavTransition(newIdx) {
    const cards = getCards();
    const oldCard = modalCard;
    const newCard = cards[newIdx];
    if (!oldCard || !newCard || !modalScene) return;

    // If a previous transition is mid-flight, finalize it first so we don't
    // leak the old-old card or its material into the wrong state.
    if (dnNavActive) completeDesktopNavTransition();

    // Attach new card to modalScene, swap to SDF material, position at modal target.
    modalScene.attach(newCard.mesh);
    newCard.mesh.origMaterial = newCard.mesh.material;
    newCard.mesh.material = getModalMaterial(newCard);
    // Start invisible (uOpacity=0) — animation fades it up to 1 over DN_NAV_DUR.
    // Helper also clears any stale uWarp / uMotionDir from a previous session.
    resetModalMaterialUniforms(newCard.mesh.material, 0);
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
    if (oldCard.mesh.material && oldCard.mesh.material.uniforms
      && oldCard.mesh.material.uniforms.uWarpCenter) {
      oldCard.mesh.material.uniforms.uWarpCenter.value.set(0.5, 0.5);
    }
    oldCard.mesh.renderOrder = 0;

    // Promote the new card to the "active" modalCard. The main modal animation
    // block's 'open' phase will keep it locked at tgtPos. Modal HTML content
    // updates to the new card's data.
    modalIdx = newIdx;
    modalCard = newCard;
    modalPhase = MODAL_PHASE.OPEN;
    populateModal(newIdx);
    requestNavNudge(newIdx);

    dnNavOldCard = oldCard;
    dnNavNewCard = newCard;
    dnNavT0 = (typeof performance !== 'undefined' ? performance.now() : Date.now());
    dnNavActive = true;
  }

  // Swipe-commit world-space swap. direction: +1 = next (swipe left), -1 = prev (swipe right).
  // Called after the CSS transition has settled the canvas at ±viewport_width.
  // Reorganizes modalScene cards so the visual position is identical before/after
  // the canvas reset → no snap.
  function commitSwipeNavigation(direction) {
    const cards = getCards();
    if (!modalCard || !modalScene || cards.length < 3) return;
    // Don't navigate while closing — same reason as navigate().
    if (modalPhase === MODAL_PHASE.CLOSING) return;
    const n = cards.length;
    const oldIdx = modalIdx;
    const newIdx = (oldIdx + direction + n) % n;
    const oldOppoIdx = (oldIdx - direction + n) % n; // old card on opposite side
    const newFarIdx = (oldIdx + 2 * direction + n) % n; // brand-new neighbor on swipe side

    // 1) Return the opposite-side old neighbor to the sphere.
    detachCardToSphere(cards[oldOppoIdx]);
    // 2) Old current → becomes new opposite-side neighbor.
    positionCardInModal(cards[oldIdx], -direction);
    // 3) The chosen neighbor is now the new current.
    modalCard = cards[newIdx];
    modalIdx = newIdx;
    positionCardInModal(modalCard, 0);
    // 4) Attach the new far neighbor (two steps in the swipe direction).
    attachCardToModal(cards[newFarIdx]);
    positionCardInModal(cards[newFarIdx], direction);

    populateModal(newIdx);

    // Sphere reactivity: spring the rotation partway toward facing the new slot.
    requestNavNudge(newIdx);
  }

  function open(i, originX, originY) {
    const cards = getCards();
    if (!modalEl || !cards[i]) return;
    // Cancel any pending close-finalize timeout from a previous close that
    // hasn't fired yet. Without this, the stale timeout fires mid-open and
    // strips is-visible / modal-open / restarts Lenis on our fresh modal —
    // the user clicks an image and the modal "won't show up."
    if (closeTimeoutId) {
      clearTimeout(closeTimeoutId);
      closeTimeoutId = null;
    }
    modalOpenedAt = (typeof performance !== 'undefined' ? performance.now() : Date.now());
    // Remember focus origin so we can restore it on close. Skip the modal
    // chrome itself in case open() is called from inside it (shouldn't
    // happen, but defensive).
    const focusedNow = document.activeElement;
    const chromeRoot = q('.card-modal-chrome');
    modalFocusRestoreEl = (chromeRoot && chromeRoot.contains(focusedNow)) ? null : focusedNow;
    modalIdx = i;
    modalCard = cards[i];
    // Pin warp center to click origin so the open-animation bulge emanates
    // from where the user tapped (or defaults to ~center if no origin given).
    if (typeof originX === 'number' && typeof originY === 'number') {
      touchToWarpUV(originX, originY, modalWarpCenter);
    } else {
      modalWarpCenter.set(0.5, 0.5);
    }
    modalWarp = 0; // bell curve in updateAnimation ramps it up from 0
    populateModal(i);

    // Snapshot the card's current WORLD transform (driven by sphereGroup rotation right now)
    modalCard.mesh.updateWorldMatrix(true, false);
    modalCard.mesh.getWorldPosition(modalStartPos);
    modalCard.mesh.getWorldQuaternion(modalStartQuat);
    modalCard.mesh.getWorldScale(modalStartScale);

    // Reparent into the *modal* scene (separate canvas, above the blur backdrop) so the card
    // stays sharp while the sphere is blurred. world transform preserved via attach().
    if (modalScene) modalScene.attach(modalCard.mesh);
    else getScene().attach(modalCard.mesh);

    // Swap to SDF shader material for crisp corners at modal scale (alphaMap pixelates).
    modalCard.mesh.origMaterial = modalCard.mesh.material;
    modalCard.mesh.material = getModalMaterial(modalCard);
    // Reset cached SDF uniforms — protects against stale values left by a
    // previous interrupted nav (e.g., uOpacity stuck mid-fade → ghosted image).
    resetModalMaterialUniforms(modalCard.mesh.material, 1);

    // Reset depth test/order — modal scene has only this one mesh
    modalCard.mesh.renderOrder = 0;
    modalCard.mesh.material.depthTest = true;
    if (modalCanvasEl) modalCanvasEl.style.display = 'block';

    modalPhase = MODAL_PHASE.OPENING;
    modalAnimT0 = (typeof performance !== 'undefined' ? performance.now() : Date.now());

    // Reset chrome reveal so elements start hidden and fade in after card settles.
    modalChromeRevealT0 = -1;
    modalChromeFadeT = 0;

    modalEl.classList.add('is-visible');
    modalEl.setAttribute('aria-hidden', 'false');
    const chromeEl = q('.card-modal-chrome');
    if (chromeEl) { chromeEl.classList.add('is-visible'); chromeEl.setAttribute('aria-hidden', 'false'); }
    positionModalChrome();
    requestAnimationFrame(() => {
      modalEl.classList.add('is-open');
      if (chromeEl) chromeEl.classList.add('is-open');
      // Move keyboard focus into the modal — close button is the safest default
      // (always present, no destructive default action). Falls back to chromeEl
      // for screen-reader announcement if close button is somehow missing.
      const closeBtn = chromeEl && chromeEl.querySelector('.card-modal__close');
      if (closeBtn) { try { closeBtn.focus(); } catch (e) { /* not focusable; ignore */ } }
    });

    const renderer = getRenderer();
    const canvas = renderer && renderer.domElement;
    if (canvas) canvas.classList.add('is-modal-active');
    document.documentElement.classList.add('modal-open');
    document.body.classList.add('modal-open');
    if (window.lenis) window.lenis.stop();

    // Pre-attach prev/next cards to modalScene at offset positions so horizontal
    // swipes reveal the neighbor mid-gesture (iOS Photos style). Mobile only.
    if (getBP() === 'sm') prepSwipeNeighbors();
  }

  function close() {
    // Suppress the synthetic 'click' event that fires after touch pointerup —
    // it lands on the just-revealed backdrop and would immediately close the
    // modal we're in the middle of opening. 200ms is well past the synthetic
    // click delay (~50ms) but short enough to not delay legitimate closes.
    const now = (typeof performance !== 'undefined' ? performance.now() : Date.now());
    if (now - modalOpenedAt < 200) return;
    if (!modalEl || modalIdx < 0 || !modalCard) return;
    // Re-entrancy guard: if a close is already in flight (CLOSING), additional
    // Escape/backdrop clicks are no-ops. Without this, a second close would
    // re-snapshot modalCloseStartPos mid-animation and jitter the card's return
    // path, plus re-schedule the finalize timeout.
    if (modalPhase === MODAL_PHASE.CLOSING) return;

    // If a desktop nav transition is still in flight, finalize it first so the
    // outgoing old card returns to its sphere slot cleanly before the close
    // animation starts on the (new) modalCard.
    if (dnNavActive) completeDesktopNavTransition();

    // Detach swipe-neighbor cards before the close animation begins so only the
    // current card flies back to the sphere; neighbors return to their slots silently.
    clearSwipeNeighbors();

    // Blur any focused element inside the modal chrome BEFORE aria-hidden=true gets
    // applied. Without this, the close button (which user just clicked) retains
    // focus → browser blocks aria-hidden + warns in console + can interfere with
    // subsequent pointer event delivery on touch in DevTools device emulation.
    const chromeEl = q('.card-modal-chrome');
    if (chromeEl && document.activeElement && chromeEl.contains(document.activeElement)) {
      document.activeElement.blur();
    }

    // Snapshot current world transform (the modal target) as the START for the closing animation.
    modalCard.mesh.updateWorldMatrix(true, false);
    modalCard.mesh.getWorldPosition(modalCloseStartPos);
    modalCard.mesh.getWorldQuaternion(modalCloseStartQuat);
    modalCard.mesh.getWorldScale(modalCloseStartScale);

    modalPhase = MODAL_PHASE.CLOSING;
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
    // The timeout ID is tracked so open() can cancel it if the user opens a new
    // modal in this 350ms window (otherwise a stale firing would remove the new
    // modal's is-visible / modal-open / Lenis-pause state).
    closeTimeoutId = setTimeout(() => {
      modalEl.classList.remove('is-visible');
      modalEl.setAttribute('aria-hidden', 'true');
      if (chromeEl) { chromeEl.classList.remove('is-visible'); chromeEl.setAttribute('aria-hidden', 'true'); }
      document.documentElement.classList.remove('modal-open');
      document.body.classList.remove('modal-open');
      if (window.lenis) window.lenis.start();
      // Restore focus to whatever the user had focused before opening the modal
      // (typically the gallery button that opened it for keyboard users).
      if (modalFocusRestoreEl && document.body.contains(modalFocusRestoreEl)) {
        try { modalFocusRestoreEl.focus(); } catch (e) { /* element gone; ignore */ }
      }
      modalFocusRestoreEl = null;
      closeTimeoutId = null;
    }, MODAL_ANIM_DURATION);

    const renderer = getRenderer();
    const canvas = renderer && renderer.domElement;
    if (canvas) canvas.classList.remove('is-modal-active');
  }

  function navigate(direction) {
    if (modalIdx < 0 || !modalCard) return;
    // Don't navigate while the modal is closing. Otherwise startDesktopNavTransition
    // would flip modalPhase from CLOSING back to OPEN, orphaning the close
    // animation: the in-flight modalCard never reaches aT >= 1, so it's never
    // reparented to sphereGroup, modalCanvasEl stays display:block, and the stale
    // close-finalize timeout still fires — leaving a card floating in modalScene
    // with no surrounding chrome (the "duplicate globe" appearance).
    if (modalPhase === MODAL_PHASE.CLOSING) return;
    const cards = getCards();
    const count = getCount();
    const next = (modalIdx + direction + count) % count;

    // Desktop/tablet: cross-warp transition (old warps in place, new cross-fades
    // over top with matching warp). Mobile keeps its instant-swap flow because
    // its arrow buttons are paired with the live swipe gesture which already
    // provides the warp + slide feel.
    if (getBP() !== 'sm') {
      startDesktopNavTransition(next);
      return;
    }

    // Detach swipe-neighbor cards before swap; they'll be re-prepped at the end
    // for the new modalCard. Mobile only.
    clearSwipeNeighbors();

    // Return the current card mesh to its slot in the sphere group (instant snap).
    const sphereGroup = getSphereGroup();
    const oldCard = modalCard;
    if (oldCard.mesh.origMaterial) {
      oldCard.mesh.material = oldCard.mesh.origMaterial;
      oldCard.mesh.origMaterial = null;
    }
    sphereGroup.attach(oldCard.mesh);
    snapToSphereSlot(oldCard);
    oldCard.mesh.material.depthTest = true;
    oldCard.mesh.renderOrder = 0;

    // Move the new card into the modal scene and snap it to the target position.
    const newCard = cards[next];
    if (modalScene) modalScene.attach(newCard.mesh);
    else getScene().attach(newCard.mesh);
    // Swap to SDF shader material for crisp corners at modal scale.
    newCard.mesh.origMaterial = newCard.mesh.material;
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
    modalPhase = MODAL_PHASE.OPEN;
    // Chrome stays fully visible during navigation — no animation, instant swap.
    modalChromeRevealT0 = -1;
    modalChromeFadeT = 1;
    populateModal(next);

    // Sphere reactivity: spring the rotation partway toward facing the new slot.
    requestNavNudge(next);

    // Prep prev/next of the new current for the next swipe gesture.
    if (getBP() === 'sm') prepSwipeNeighbors();
  }

  // Modal card animation (the flown-out card). The card is parented to the modal
  // scene during modal phases. It animates from its captured world transform →
  // target near camera (opening), or back to the current sphere slot world
  // transform (closing). The sphere keeps rotating behind it so the closing path
  // tracks the slot's live position. `sphereRotActive` is passed in from core.
  function updateAnimation(sphereRotActive) {
    if (modalCard && modalPhase) {
      const sphereGroup = getSphereGroup();
      const now = (typeof performance !== 'undefined' ? performance.now() : Date.now());
      const aT = Math.max(0, Math.min(1, (now - modalAnimT0) / MODAL_ANIM_DURATION));
      const aE = easeInOutCubic(aT);
      const tgtPos = new THREE.Vector3();
      const tgtQuat = new THREE.Quaternion();
      const tgtScale = new THREE.Vector3();

      // Capture modal card position before this frame's update for CA delta computation
      const prevModalX = modalCard.mesh.position.x;
      const prevModalY = modalCard.mesh.position.y;

      if (modalPhase === MODAL_PHASE.OPENING || modalPhase === MODAL_PHASE.OPEN) {
        computeModalTarget(tgtPos, tgtQuat, tgtScale);
        if (modalPhase === MODAL_PHASE.OPEN || aT >= 1) {
          modalCard.mesh.position.copy(tgtPos);
          modalCard.mesh.quaternion.copy(tgtQuat);
          modalCard.mesh.scale.copy(tgtScale);
          if (modalPhase === MODAL_PHASE.OPENING && aT >= 1) modalPhase = MODAL_PHASE.OPEN;
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
      } else if (modalPhase === MODAL_PHASE.CLOSING) {
        // Live target = the slot's current world transform.
        //   World position = (sphere drag rotation × spherePos) + sphereGroup.position
        //   World quat     = (sphere drag rotation) × sphereQuat
        // sphereGroup.rotation is identity (per-card rotation arch), so its matrixWorld
        // is just the z translation. Apply the drag rotation manually.
        sphereGroup.updateMatrixWorld(true);
        if (sphereRotActive) {
          tgtPos.copy(modalCard.spherePos).applyEuler(sphereRotEuler);
          tgtQuat.copy(sphereRotQuat).multiply(modalCard.sphereQuat);
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
          // / uMotionDir values would persist on card.modalMat and ghost the
          // next time this card is shown in modal.
          resetModalMaterialUniforms(modalCard.modalMat, 1);
          // Restore original MeshBasicMaterial before re-parenting to globe
          if (modalCard.mesh.origMaterial) {
            modalCard.mesh.material = modalCard.mesh.origMaterial;
            modalCard.mesh.origMaterial = null;
          }
          // Re-parent to sphereGroup and snap to canonical local transform
          // (with the current sphere-drag rotation baked in so there's no flash).
          sphereGroup.attach(modalCard.mesh);
          snapToSphereSlot(modalCard);
          modalCard.mesh.material.depthTest = true;
          modalCard.mesh.renderOrder = 0;
          if (modalCanvasEl) modalCanvasEl.style.display = 'none';
          modalPhase = MODAL_PHASE.CLOSED;
          modalCard = null;
          modalIdx = -1;
        }
      }

      // Modal CA — apply to the SDF ShaderMaterial while the card is actively moving.
      // Use amp = 1.0 so the full CA_MOTION_STRENGTH is available; the position delta
      // itself encodes velocity (small delta when settled = small smear). Clear to zero
      // once fully open so the static card shows no aberration.
      if (caEnabled && modalCard && modalCard.mesh.material.uniforms
        && modalCard.mesh.material.uniforms.uMotionDir) {
        if (modalPhase === MODAL_PHASE.OPEN) {
          modalCard.mesh.material.uniforms.uMotionDir.value.set(0, 0);
        } else if (modalPhase) {
          const mdx = modalCard.mesh.position.x - prevModalX;
          const mdy = modalCard.mesh.position.y - prevModalY;
          applyMotionCA(modalCard.mesh, mdx, mdy, 1.0);
        }
      }

      // Modal warp — fisheye intensity driven by phase. During open/close the warp
      // peaks mid-animation (bell curve via sin(aT·π)) and settles to 0 when OPEN.
      // While OPEN, the warp value is set externally by touch handlers (drag).
      if (modalPhase === MODAL_PHASE.OPENING) {
        modalWarp = Math.sin(Math.max(0, Math.min(1, aT)) * Math.PI) * MODAL_WARP_OPEN;
      } else if (modalPhase === MODAL_PHASE.CLOSING) {
        modalWarp = Math.sin(Math.max(0, Math.min(1, aT)) * Math.PI) * MODAL_WARP_CLOSE;
      } else if (modalPhase === MODAL_PHASE.OPEN) {
        // Decay any leftover warp once settled; touch handlers will set it again on drag.
        modalWarp *= 0.85;
        if (modalWarp < 0.001) modalWarp = 0;
      }
      // Skip the push during desktop nav cross-warp — that animation drives BOTH the
      // old and new card's uWarp uniforms directly (updateDesktopNav).
      if (!dnNavActive) pushModalWarpUniforms();

      // Keep chrome elements locked to the card's projected screen position every frame.
      // During OPENING this positions them at the final target so they fade in correctly.
      if (modalPhase === MODAL_PHASE.OPENING || modalPhase === MODAL_PHASE.OPEN) {
        positionModalChrome();
      }
    }
  }

  // Desktop modal-nav cross-warp transition. Both old + new card materials get
  // their uWarp uniform driven by a sin bell curve peaking at DN_NAV_WARP mid-flight;
  // opacity cross-fades via easeInOutCubic. At aT >= 1, finalize + detach the old card.
  function updateDesktopNav() {
    if (dnNavActive) {
      const dnNow = (typeof performance !== 'undefined' ? performance.now() : Date.now());
      const dnT = Math.max(0, Math.min(1, (dnNow - dnNavT0) / DN_NAV_DUR));
      if (dnT >= 1) {
        completeDesktopNavTransition();
      } else {
        const dnWarp = Math.sin(dnT * Math.PI) * DN_NAV_WARP;
        const dnE = easeInOutCubic(dnT);
        if (dnNavOldCard && dnNavOldCard.mesh.material && dnNavOldCard.mesh.material.uniforms) {
          dnNavOldCard.mesh.material.uniforms.uWarp.value = dnWarp;
          dnNavOldCard.mesh.material.uniforms.uOpacity.value = 1 - dnE;
        }
        if (dnNavNewCard && dnNavNewCard.mesh.material && dnNavNewCard.mesh.material.uniforms) {
          dnNavNewCard.mesh.material.uniforms.uWarp.value = dnWarp;
          dnNavNewCard.mesh.material.uniforms.uOpacity.value = dnE;
        }
      }
    }
  }

  // Render the flown-out modal card on its own canvas (called after the main scene).
  function render() {
    if (modalRenderer && modalScene && modalCard) {
      modalRenderer.render(modalScene, getCamera());
    }
  }

  // Re-size the modal renderer to match the viewport (called from core doLayout).
  function resize(w, h) {
    if (!modalRenderer) return;
    modalRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    modalRenderer.setSize(w, h);
  }

  // Create the modal renderer/scene + THREE temps and wire the DOM interactions.
  // Called once per init (and again after a breakpoint re-init).
  function setup() {
    const { W, H } = getViewport();

    // Modal renderer / scene — renders only the flown-out card on a separate canvas
    // above .card-modal__backdrop, so it stays sharp while the backdrop blurs the main canvas.
    modalCanvasEl = q('.modal-card-canvas');
    if (modalCanvasEl) {
      const modalGlOpts = { canvas: modalCanvasEl, antialias: true, alpha: true };
      modalRenderer = new THREE.WebGLRenderer(modalGlOpts);
      modalRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      modalRenderer.setSize(W, H);
      modalRenderer.setClearColor(0x000000, 0);
      modalScene = new THREE.Scene();
    }

    modalEl = q('.card-modal');
    if (!modalEl) return;
    modalStartPos = new THREE.Vector3();
    modalStartQuat = new THREE.Quaternion();
    modalStartScale = new THREE.Vector3();
    modalCloseStartPos = new THREE.Vector3();
    modalCloseStartQuat = new THREE.Quaternion();
    modalCloseStartScale = new THREE.Vector3();
    // Chrome div hosts the interactive elements (close, nav, info) above the WebGL card canvas.
    const chromeEl = q('.card-modal-chrome');
    const evtRoot = chromeEl || modalEl;
    evtRoot.querySelector('.card-modal__close').addEventListener('click', close);
    evtRoot.querySelector('.card-modal__nav--prev').addEventListener('click', () => { navigate(-1); });
    evtRoot.querySelector('.card-modal__nav--next').addEventListener('click', () => { navigate(1); });
    modalEl.querySelector('.card-modal__backdrop').addEventListener('click', close);

    // Detach any prior document keydown handler before re-adding (a breakpoint
    // re-init calls setup() again on the same instance — avoid stacking → double-nav).
    if (keydownHandler) document.removeEventListener('keydown', keydownHandler);
    keydownHandler = (e) => {
      if (modalIdx < 0) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
      // Block keyboard scroll keys (PageUp/Down, Home/End, Space, ArrowUp/Down)
      // while modal is open so the globe doesn't scroll/zoom behind the modal.
      // Space is exempted when focus is inside the modal chrome — Space should
      // activate a focused button (e.g., close), not be blocked.
      const chromeRoot = q('.card-modal-chrome');
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
          try { last.focus(); } catch (err) { /* not focusable; ignore */ }
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          try { first.focus(); } catch (err) { /* not focusable; ignore */ }
        }
      }
    };
    document.addEventListener('keydown', keydownHandler);

    // ── Mobile modal touch gestures: live 1:1 drag with rubber-band release ──
    // Horizontal: asset translates with finger; commit on release if past 25%
    //   viewport OR fast fling → animate off-screen and navigate.
    // Vertical (pull-down only): asset translates down + scales down with finger;
    //   commit on release if past 18% viewport OR fast fling → continue motion
    //   and close.
    // Implemented via CSS transforms on modal-card-canvas (cheap, GPU-composited)
    // so the chrome (info panel, nav arrows, close, counter) stays put — matches
    // iOS Photos UX where only the asset moves during the gesture.
    let swStartX = 0; let
      swStartY = 0;
    let swLastX = 0; let swLastY = 0; let
      swLastT = 0;
    let swAxis = null; // 'x' | 'y' | null (locks after first significant move)
    let swActive = false;
    let swVelX = 0; let
      swVelY = 0;
    const AXIS_LOCK_PX = 10;
    const COMMIT_DIST_X_FRAC = 0.25; // 25% of viewport width
    const COMMIT_DIST_Y_FRAC = 0.18; // 18% of viewport height
    const COMMIT_VEL_X = 0.4; // px/ms
    const COMMIT_VEL_Y = 0.6;
    const PULL_SCALE_DAMPING = 1600; // larger → less scale change per px pulled
    const PULL_SCALE_MIN = 0.80;

    modalEl.addEventListener('touchstart', (e) => {
      if (getBP() !== 'sm') return;
      if (modalIdx < 0) return;
      if (e.touches.length !== 1) return;
      if (!modalCanvasEl) return;
      swStartX = e.touches[0].clientX; swLastX = swStartX;
      swStartY = e.touches[0].clientY; swLastY = swStartY;
      swLastT = Date.now();
      swActive = true;
      swAxis = null;
      swVelX = 0;
      swVelY = 0;
      // Capture touch position as warp center (finger-anchored fisheye).
      touchToWarpUV(swStartX, swStartY, modalWarpCenter);
      // Drag follows finger 1:1 with no animation lag.
      modalCanvasEl.style.transition = 'none';
    }, { passive: true });

    modalEl.addEventListener('touchmove', (e) => {
      if (!swActive || e.touches.length !== 1) return;
      const x = e.touches[0].clientX;
      const y = e.touches[0].clientY;
      const dx = x - swStartX;
      const dy = y - swStartY;

      // Axis lock — first significant movement determines whether this is a
      // horizontal swipe or a vertical pull-down. Prevents diagonal jitter.
      if (swAxis === null) {
        if (Math.abs(dx) < AXIS_LOCK_PX && Math.abs(dy) < AXIS_LOCK_PX) return;
        swAxis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
      }

      // Velocity tracking — used for fling detection on touchend.
      const now = Date.now();
      const dt = now - swLastT;
      if (dt > 0) {
        swVelX = (x - swLastX) / dt;
        swVelY = (y - swLastY) / dt;
      }
      swLastX = x; swLastY = y; swLastT = now;

      if (swAxis === 'x') {
        modalCanvasEl.style.transform = `translate3d(${dx}px, 0, 0)`;
        // Horizontal swipe warp: scales with drag distance relative to viewport width.
        // 30% of viewport width = full peak. Capped at MODAL_WARP_SWIPE.
        modalWarp = Math.min(1, Math.abs(dx) / (window.innerWidth * 0.30)) * MODAL_WARP_SWIPE;
      } else {
        // Pull-down only — upward drag does nothing (clamped to 0).
        const pullY = Math.max(0, dy);
        const scale = Math.max(PULL_SCALE_MIN, 1 - pullY / PULL_SCALE_DAMPING);
        modalCanvasEl.style.transform = `translate3d(0, ${pullY}px, 0) scale(${scale.toFixed(3)})`;
        // Pull-down warp: scales with pull distance relative to viewport height.
        // 20% of viewport height = full peak. Capped at MODAL_WARP_PULL.
        modalWarp = Math.min(1, pullY / (window.innerHeight * 0.20)) * MODAL_WARP_PULL;
      }
      pushModalWarpUniforms();
    }, { passive: true });

    modalEl.addEventListener('touchend', (e) => {
      if (!swActive) return;
      swActive = false;
      if (!modalCanvasEl || swAxis === null) { swAxis = null; return; }
      if (e.changedTouches.length !== 1) return;
      const dx = e.changedTouches[0].clientX - swStartX;
      const dy = e.changedTouches[0].clientY - swStartY;

      if (swAxis === 'x') {
        const commit = Math.abs(dx) > window.innerWidth * COMMIT_DIST_X_FRAC
                  || Math.abs(swVelX) > COMMIT_VEL_X;
        if (commit) {
          // Animate canvas to translateX(±viewport_width) — that's exactly the
          // offset where the neighbor card lands at viewport center. Then swap
          // world positions in the same task as resetting CSS: the visible
          // result is identical before and after the reset (canvas shift + world
          // shift cancel), so no snap.
          //   swipe LEFT  (dx<0) → swipe direction -1 → +1 navigation (next)
          //   swipe RIGHT (dx>0) → swipe direction +1 → -1 navigation (previous)
          const cssDir = dx < 0 ? -1 : 1; // CSS animates toward swipe direction
          const navDir = -cssDir; // navigate direction (next = +1)
          modalCanvasEl.style.transition = 'transform 0.22s cubic-bezier(0.32, 0.72, 0, 1)';
          modalCanvasEl.style.transform = `translate3d(${cssDir * window.innerWidth}px, 0, 0)`;
          setTimeout(() => {
            modalCanvasEl.style.transition = 'none';
            commitSwipeNavigation(navDir);
            modalCanvasEl.style.transform = '';
          }, 220);
        } else {
          // Rubber-band back to center.
          modalCanvasEl.style.transition = 'transform 0.25s cubic-bezier(0.25, 0.1, 0.25, 1)';
          modalCanvasEl.style.transform = '';
        }
      } else {
        const pullCommit = dy > window.innerHeight * COMMIT_DIST_Y_FRAC
                      || swVelY > COMMIT_VEL_Y;
        if (pullCommit) {
          // Sync the mesh's WORLD position + scale to match the gesture's visible
          // state (which was driven purely by CSS transform on the canvas), then
          // reset CSS and call close(). close() snapshots the current world
          // transform as the close-animation start — so the fly-back to sphere
          // begins from where the user dragged the card, not from center. No snap.
          if (modalCard) {
            const { H: vpH } = getViewport();
            const pxPerWorld = vpH / (2 * MODAL_CAM_DIST * Math.tan(Math.PI / 6));
            const pulledY = Math.max(0, dy);
            const gestureScale = Math.max(PULL_SCALE_MIN, 1 - pulledY / PULL_SCALE_DAMPING);
            modalCard.mesh.position.y -= pulledY / pxPerWorld; // CSS down → world Y negative
            modalCard.mesh.scale.multiplyScalar(gestureScale);
          }
          modalCanvasEl.style.transition = 'none';
          modalCanvasEl.style.transform = '';
          close();
        } else {
          // Rubber-band back.
          modalCanvasEl.style.transition = 'transform 0.25s cubic-bezier(0.25, 0.1, 0.25, 1)';
          modalCanvasEl.style.transform = '';
        }
      }
      swAxis = null;
    }, { passive: true });
  }

  // Synchronously return the modal's DOM + page state to the closed baseline.
  // destroy() forces the phase straight to CLOSED without playing the close
  // animation, so the classes / scroll-lock / canvas that open() set are never
  // undone by the normal close path. A breakpoint re-init keeps the SAME modal
  // DOM (innerHTML is built once in init, not per initRuntime) — so without this
  // the modal stays visually stuck open after the rebuild: the flown-out card
  // mesh was dropped with the old modalScene (image vanishes), modalIdx is reset
  // to -1 so the re-wired close/nav buttons early-return (chrome goes dead), and
  // body stays scroll-locked. Queries the main canvas via `q` (not getRenderer)
  // because core destroy() nulls the renderer before calling modal.destroy().
  function resetModalDom() {
    if (modalEl) {
      modalEl.classList.remove('is-visible', 'is-open');
      modalEl.setAttribute('aria-hidden', 'true');
    }
    const chromeEl = q('.card-modal-chrome');
    if (chromeEl) {
      chromeEl.classList.remove('is-visible', 'is-open');
      chromeEl.setAttribute('aria-hidden', 'true');
    }
    if (modalCanvasEl) {
      modalCanvasEl.style.display = 'none';
      modalCanvasEl.style.transition = 'none';
      modalCanvasEl.style.transform = '';
    }
    const mainCanvas = q('.offer-globe-canvas');
    if (mainCanvas) mainCanvas.classList.remove('is-modal-active');
    document.documentElement.classList.remove('modal-open');
    document.body.classList.remove('modal-open');
    if (window.lenis) window.lenis.start();
    modalChromeRevealT0 = -1;
    modalChromeFadeT = 0;
    modalFocusRestoreEl = null;
  }

  // Dispose the modal renderer + clear the pending close timeout (mirrors the
  // main renderer's lifecycle in core destroy()). The keydown handler is removed
  // so it doesn't outlive a teardown, and the modal's DOM/page state is reset so
  // an open modal doesn't survive a breakpoint re-init stuck + non-functional.
  function destroy() {
    if (closeTimeoutId) { clearTimeout(closeTimeoutId); closeTimeoutId = null; }
    if (keydownHandler) { document.removeEventListener('keydown', keydownHandler); keydownHandler = null; }
    resetModalDom();
    if (modalRenderer) {
      modalRenderer.dispose();
      modalRenderer = null;
    }
    modalScene = null;
    modalCard = null;
    modalIdx = -1;
    modalPhase = MODAL_PHASE.CLOSED;
    dnNavActive = false;
  }

  return {
    setup,
    resize,
    render,
    updateAnimation,
    updateDesktopNav,
    open,
    navigate,
    close,
    getModalIdx,
    isCardManaged,
    destroy,
  };
}
