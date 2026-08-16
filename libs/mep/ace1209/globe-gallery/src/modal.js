import * as THREE from '../three.module.min.js';
import { createModalMaterial } from './materials.js';
import { easeInOutCubic, easeOutCubic, coverFit } from './math.js';
import { escapeHtml, renderParagraphs } from './authoring.js';
/* eslint-disable import/no-relative-packages */
import { processTrackingLabels } from '../../../../martech/attributes.js';
import { getConfig } from '../../../../utils/utils.js';
/* eslint-enable import/no-relative-packages */

const perfNow = () => performance?.now() ?? Date.now();

// Modal lifecycle phases. CLOSED is null so `if (modalPhase)` reads as "modal live".
const MODAL_PHASE = Object.freeze({
  CLOSED: null,
  OPENING: 'opening',
  OPEN: 'open',
  CLOSING: 'closing',
});
// Camera→card distance the modal card flies to (perspective FOV 60°).
const MODAL_CAM_DIST = 16.4;
const MODAL_RADIUS_PX = 16; // on-screen modal corner radius at md+ (0 on mobile); see README
const MODAL_ANIM_DURATION = 350; // ms open/close fly time
const CHROME_REVEAL_DUR = 300; // ms chrome fade-in after card 90% settled
// Fisheye warp peaks (sin bell curve) per modal interaction.
const MODAL_WARP_OPEN = 0.30;
const MODAL_WARP_CLOSE = 0.30;
const MODAL_WARP_PULL = 0.40;
const MODAL_WARP_SWIPE = 0.25;
// Desktop/tablet modal-nav cross-warp transition.
const DN_NAV_DUR = 500; // ms
const DN_NAV_WARP = 0.40; // peak warp
// Desktop/tablet image fit — see computeModalTarget. Chrome placement is CSS.
const DT_IMG_MARGIN = 12; // gap between image and each viewport edge

export default function createGlobeModal({
  q,
  getScene,
  getCamera,
  getSphereGroup,
  getRenderer,
  getCards,
  getCount,
  getCardMetadata,
  // Lazily load a sharper texture for the opened card. (idx, onReady, onError) → Image|null.
  loadModalUpgrade,
  getViewport,
  getBP,
  getCardDims,
  cardAspect,
  getAntialias,
  caEnabled,
  // Localized "{index} of {count}" for the sr-only __position element.
  cardLabel,
  getReducedMotion,
  // Sphere-rotation bridge (live THREE object shared by reference).
  sphereRotQuat,
  snapToSphereSlot,
  // Applies the sphere's camera-facing tilt to a quat in place (no-op when CARD_FACE_CAMERA=0).
  applySphereFacing,
  requestNavNudge,
  applyMotionCA,
  restoreFocusOnClose,
}) {
  let modalRenderer = null;
  let modalScene = null;
  let modalCanvasEl = null;
  let modalEl = null;

  let modalIdx = -1; // currently open card index, -1 if closed
  let modalCard = null; // card whose mesh is animating
  let modalPhase = MODAL_PHASE.CLOSED;
  // Lazy hi-res modal texture: pending Image + owned CanvasTexture (1 resident at a time).
  let modalTexImg = null;
  let modalTexOwned = null;
  let modalTexCard = null;
  let modalAnimT0 = 0; // animation start timestamp
  // World-transform snapshots (THREE) — created in setup().
  let modalStartPos = null;
  let modalStartQuat = null;
  let modalStartScale = null;
  let modalCloseStartPos = null;
  let modalCloseStartQuat = null;
  let modalCloseStartScale = null;
  const scratchPos = new THREE.Vector3();
  const scratchQuat = new THREE.Quaternion();
  const scratchScale = new THREE.Vector3();
  const coverScratch = {}; // coverFit output (see pushModalCoverUV)
  let chromeNodes = null; // { chromeEl, els, settled } — see revealModalChrome

  // Chrome reveal — elements fade + slide in after card is 90% settled.
  let modalChromeRevealT0 = -1; // timestamp when card first hit 90%; -1 = not yet
  let modalChromeFadeT = 0; // 0→1 fade progress for chrome elements

  // close() uses this to suppress the synthetic click after touch pointerup (would self-close).
  let modalOpenedAt = 0;
  // close-finalize timeout id; open() cancels a stale one so it can't yank the new modal's state.
  let closeTimeoutId = null;
  // click/touch listeners wired once — DOM persists across re-inits so re-adding would stack.
  let listenersWired = false;
  // Held so Escape + the touch gestures can click them rather than call navigate()/close().
  // See README (Analytics).
  let prevBtn = null;
  let nextBtn = null;
  let closeBtn = null;

  let modalWarp = 0;
  const modalWarpCenter = new THREE.Vector2(0.5, 0.5);

  let dnNavActive = false;
  let dnNavT0 = 0;
  let dnNavOldCard = null;
  let dnNavNewCard = null;

  // Overflow gallery cards: the modal browses all getCount() images; indices past the barrel
  // get a lazy modal-only carrier that dissolves in/out instead of flying to a slot.
  // See README (Card count / Architecture notes). Keyed by gallery index.
  const overflowCards = new Map();
  // Shared 1×1 placeholder for overflow carriers before/after their image texture.
  let overflowPlaceholderTex = null;

  // Reset the modal to its closed identity (no open card). Shared by close-finalize + destroy().
  function closeModalIdentity() {
    modalPhase = MODAL_PHASE.CLOSED;
    modalCard = null;
    modalIdx = -1;
  }

  // Chrome starts hidden and fades in after the card settles.
  function resetChromeReveal() {
    modalChromeRevealT0 = -1;
    modalChromeFadeT = 0;
    if (chromeNodes) chromeNodes.settled = false; // else the next reveal would early-out at once
  }

  function getModalIdx() { return modalIdx; }

  const isRtl = () => document.documentElement.dir === 'rtl';

  // Desktop/tablet plane fit + the uRadius fraction for a constant MODAL_RADIUS_PX. See README.
  function modalDesktopFit(uAspect) {
    const { W, H } = getViewport();
    const cardHPx = Math.min(
      H - 2 * DT_IMG_MARGIN,
      (W - 2 * DT_IMG_MARGIN) / uAspect,
    );
    return { cardHPx, radiusFrac: MODAL_RADIUS_PX / cardHPx };
  }

  function modalRadiusFrac(uAspect) {
    if (getBP() === 'sm') return 0;
    return modalDesktopFit(uAspect).radiusFrac;
  }

  // Aspect the modal renders at: the DISPLAYED texture's, else the base texture's. See README.
  function modalUAspect(card) {
    return (card && (card.modalAspect || card.srcAspect)) || cardAspect;
  }

  // Barrel = cards with a real sphere slot; indices ≥ this are overflow.
  function barrelCount() { return getCards().length; }
  function isOverflowIdx(idx) { return idx >= barrelCount(); }
  function isOverflowCard(card) { return !!(card && card.isOverflow); }

  function ensureOverflowPlaceholder() {
    if (overflowPlaceholderTex) return overflowPlaceholderTex;
    const cv = document.createElement('canvas');
    cv.width = 1; cv.height = 1;
    const cx = cv.getContext('2d');
    cx.fillStyle = '#1a1a1a';
    cx.fillRect(0, 0, 1, 1);
    overflowPlaceholderTex = new THREE.CanvasTexture(cv);
    return overflowPlaceholderTex;
  }

  // Lazily build + cache a modal-only carrier for an index past the barrel.
  // Aspect stays at the base card aspect until the image decodes (loadOverflowTexture).
  function createOverflowCard(idx) {
    const { w, h } = getCardDims();
    const mat = createModalMaterial(ensureOverflowPlaceholder(), cardAspect);
    mat.uniforms.uRadius.value = modalRadiusFrac(cardAspect);
    const geo = new THREE.PlaneGeometry(w, h, 1, 1);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.material.depthTest = true;
    mesh.visible = false;
    mesh.renderOrder = 0;
    return {
      mesh,
      modalMat: mat,
      isOverflow: true,
      idx,
      // Dummy sphere-phase fields so defensive reads don't hit undefined (never flies to a slot).
      sphereScaleSX: 1,
      sphereScaleSY: 1,
      ownTex: null,
      pendingImg: null,
    };
  }

  // Card object for ANY gallery index: the real barrel card, or a lazy overflow carrier.
  function getGalleryCard(idx) {
    if (!isOverflowIdx(idx)) return getCards()[idx];
    let card = overflowCards.get(idx);
    if (!card) { card = createOverflowCard(idx); overflowCards.set(idx, card); }
    return card;
  }

  // Load an overflow carrier's image at the modal cap, swap in on decode, derive aspect. Owns
  // its texture per-card (disposed in retireOverflowCard) so a cross-fade keeps the outgoing image.
  function loadOverflowTexture(card, idx) {
    if (card.pendingImg) { card.pendingImg.onload = null; card.pendingImg.onerror = null; card.pendingImg.src = ''; card.pendingImg = null; }
    if (!loadModalUpgrade) return;
    card.pendingImg = loadModalUpgrade(idx, (tex) => {
      card.pendingImg = null;
      if (card.ownTex) card.ownTex.dispose();
      card.ownTex = tex;
      card.modalMat.uniforms.map.value = tex;
      if (tex.image && tex.image.width && tex.image.height) {
        card.modalAspect = tex.image.width / tex.image.height;
        card.modalMat.uniforms.uAspect.value = card.modalAspect;
      }
    }, () => { card.pendingImg = null; });
  }

  // Retire an overflow carrier on nav-away/close: unparent, hide, drop texture, reset material.
  function retireOverflowCard(card) {
    if (!isOverflowCard(card)) return;
    if (card.pendingImg) { card.pendingImg.onload = null; card.pendingImg.onerror = null; card.pendingImg.src = ''; card.pendingImg = null; }
    if (card.mesh.parent) card.mesh.parent.remove(card.mesh);
    card.mesh.visible = false;
    card.modalMat.uniforms.map.value = ensureOverflowPlaceholder();
    if (card.ownTex) { card.ownTex.dispose(); card.ownTex = null; }
    card.modalAspect = 0; // aspect belonged to the texture we just dropped
    // Reset animated uniforms (inlined to avoid a forward ref to resetModalMaterialUniforms).
    const u = card.modalMat.uniforms;
    u.uOpacity.value = 1;
    u.uWarp.value = 0;
    u.uMotionDir.value.set(0, 0);
  }

  // True if the card is the active modal card or a swipe-neighbor in modalScene (core loop skips).
  function isCardManaged(card) {
    return card === modalCard || (!!modalScene && card.mesh.parent === modalScene);
  }

  // Cancel a pending hi-res load + dispose the owned modal texture, resetting the card to its base.
  function releaseModalTexture() {
    if (modalTexImg) {
      modalTexImg.onload = null;
      modalTexImg.onerror = null;
      modalTexImg.src = '';
      modalTexImg = null;
    }
    if (modalTexOwned) {
      if (modalTexCard && modalTexCard.modalMat) {
        if (modalTexCard.isOverflow) {
          modalTexCard.modalMat.uniforms.map.value = ensureOverflowPlaceholder();
        } else {
          const baseMat = modalTexCard.mesh.origMaterial || modalTexCard.mesh.material;
          if (baseMat) modalTexCard.modalMat.uniforms.map.value = baseMat.map;
        }
        modalTexCard.modalAspect = 0; // back to the base texture, so back to the barrel's aspect
      }
      modalTexOwned.dispose();
      modalTexOwned = null;
    }
    modalTexCard = null;
  }

  // Per-card SDF modal material, lazily built + cached; base texture is the placeholder.
  function getModalMaterial(card) {
    // Overflow carriers ARE the modal material — just refresh the corner radius.
    if (card.isOverflow) {
      const u = card.modalMat.uniforms;
      u.uRadius.value = modalRadiusFrac(u.uAspect.value);
      return card.modalMat;
    }
    if (!card.modalMat) {
      card.modalMat = createModalMaterial(card.mesh.material.map, modalUAspect(card));
    } else {
      // Reset to base in case a prior open left a since-disposed hi-res texture.
      card.modalMat.uniforms.map.value = card.mesh.material.map;
      card.modalMat.uniforms.uAspect.value = modalUAspect(card);
    }
    card.modalMat.uniforms.uRadius.value = modalRadiusFrac(modalUAspect(card));
    return card.modalMat;
  }

  // Request the lazy hi-res texture for the ACTIVE modal card (not swipe-neighbors).
  function requestModalUpgrade(card, idx) {
    // Free any resident barrel hi-res first (overflow carriers own their texture per-card).
    releaseModalTexture();
    if (card.isOverflow) { loadOverflowTexture(card, idx); return; }
    if (!loadModalUpgrade) return;
    modalTexImg = loadModalUpgrade(idx, (tex) => {
      modalTexImg = null;
      // Bail if the modal closed or navigated away before the decode finished.
      if (modalCard !== card || modalPhase === MODAL_PHASE.CLOSED) {
        tex.dispose();
        return;
      }
      modalTexOwned = tex;
      modalTexCard = card;
      card.modalMat.uniforms.map.value = tex;
      if (tex.image && tex.image.width && tex.image.height) {
        card.modalAspect = tex.image.width / tex.image.height;
      }
    }, () => { modalTexImg = null; });
  }

  // Reset the cached SDF material's animated uniforms so a stale mid-fade value doesn't ghost.
  function resetModalMaterialUniforms(material, opacity) {
    const u = material && material.uniforms;
    if (!u) return;
    if (u.uOpacity) u.uOpacity.value = (typeof opacity === 'number' ? opacity : 1);
    if (u.uWarp) u.uWarp.value = 0;
    if (u.uMotionDir) u.uMotionDir.value.set(0, 0);
    if (u.uRepeat) u.uRepeat.value.set(1, 1);
    if (u.uOffset) u.uOffset.value.set(0, 0);
    // uWarpCenter intentionally NOT reset — callers set it right after.
  }

  // Crop the displayed texture to the aspect the plane is drawn at THIS frame (the core's
  // applyCardFit rule). Call after the frame's scale write. See README (Architecture notes).
  function pushModalCoverUV(card) {
    const u = card && card.mesh.material && card.mesh.material.uniforms;
    if (!u || !u.uRepeat) return;
    const { x, y } = card.mesh.scale;
    const c = coverFit(modalUAspect(card), cardAspect * (x / (y || 1)), coverScratch);
    u.uRepeat.value.set(c.rx, c.ry);
    u.uOffset.value.set(c.ox, c.oy);
  }

  // Map a viewport touch/click position to an approximate asset UV (screen Y inverts).
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

  // Target world pos/quat/scale for the modal card: visible photo contain-fit to the viewport
  // with native aspect kept (via modalUAspect). Recomputed per-frame. See README (Behavior notes).
  function computeModalTarget(outPos, outQuat, outScale, cardOverride) {
    // cardOverride: compute for this card (swipe-neighbors); defaults to modalCard.
    const card = cardOverride || modalCard;
    const camera = getCamera();
    const { W, H } = getViewport();
    const { w: CARD_W_SPHERE, h: CARD_H_SPHERE } = getCardDims();
    const camZ = camera.position.z;
    const dist = MODAL_CAM_DIST;

    // CSS pixels per world unit at 'dist' from the perspective camera (FOV 60°).
    const pxPerWorld = H / (2 * dist * Math.tan(Math.PI / 6));

    // Width is proportional to the image aspect (kept); the branches diverge mobile/desktop.
    const isMobile = (getBP() === 'sm');
    const uAspect = modalUAspect(card);
    const sScaleX = uAspect / cardAspect;
    let scaleY; let
      scaleX;

    if (isMobile) {
      // Mobile: full-bleed width, top-aligned, square corners; height follows aspect.
      const cardHPx = W / uAspect;
      scaleX = W / (CARD_W_SPHERE * pxPerWorld);
      scaleY = scaleX / sScaleX;
      outPos.set(0, (H / 2 - cardHPx / 2) / pxPerWorld, camZ - dist);
    } else {
      // Desktop/tablet: visible photo contain-fit to the viewport minus DT_IMG_MARGIN, aspect
      // kept — see README (Behavior notes).
      const { cardHPx } = modalDesktopFit(uAspect);
      scaleY = cardHPx / (CARD_H_SPHERE * pxPerWorld);
      scaleX = scaleY * sScaleX;

      // Centered at viewport center.
      outPos.set(0, 0, camZ - dist);
    }
    // uRadius tracks the fit, so it is re-pushed every frame — see README (Behavior notes).
    // uAspect rides along: it changes when the hi-res texture decodes mid-flight.
    if (card && card.modalMat) {
      card.modalMat.uniforms.uAspect.value = uAspect;
      card.modalMat.uniforms.uRadius.value = modalRadiusFrac(uAspect);
    }
    outQuat.identity();
    outScale.set(scaleX, scaleY, 1.0);
  }

  // Reveal fade only (opacity + an 8px slide-up), driven by modalChromeFadeT. Placement is pure
  // CSS — every offset is a per-breakpoint constant. See README (Modal chrome).
  function revealModalChrome() {
    const chromeEl = q('.globe-gallery-modal-chrome');
    if (!chromeEl) return;
    if (!chromeNodes || chromeNodes.chromeEl !== chromeEl) {
      chromeNodes = {
        chromeEl,
        els: [...chromeEl.querySelectorAll('.globe-gallery-modal-info, .globe-gallery-modal-close,'
          + ' .globe-gallery-modal-nav, .globe-gallery-modal-counter')],
      };
    }
    // transition:none while animating so CSS hover can't fight the per-frame write; cleared on the
    // settled frame so :hover animates again, then bail — nothing changes after.
    const settled = modalChromeFadeT >= 1;
    if (settled && chromeNodes.settled) return;
    chromeNodes.settled = settled;
    const cFade = easeOutCubic(modalChromeFadeT);
    const shift = settled ? '' : ` translateY(${Math.round((1 - cFade) * 8)}px)`;
    chromeNodes.els.forEach((el) => {
      el.style.opacity = String(cFade);
      // The counter's CSS centring transform must survive the slide (it has no wrapper).
      const base = el.classList.contains('globe-gallery-modal-counter') ? 'translateX(-50%)' : '';
      el.style.transform = settled ? '' : `${base}${shift}`.trim();
      el.style.transition = settled ? '' : 'none';
    });
  }

  // Set the description's mask fade lengths from scroll position; focusable only when it scrolls.
  function updateDescFade(descEl) {
    if (!descEl) return;
    const overflow = descEl.scrollHeight - descEl.clientHeight;
    const canScroll = overflow > 1;
    const top = canScroll && descEl.scrollTop > 1;
    const bottom = canScroll && descEl.scrollTop < overflow - 1;
    descEl.style.setProperty('--gg-desc-fade-top', top ? '20px' : '0');
    descEl.style.setProperty('--gg-desc-fade-bottom', bottom ? '20px' : '0');
    if (canScroll) descEl.tabIndex = 0;
    else if (document.activeElement !== descEl) descEl.removeAttribute('tabindex');
  }

  function scheduleDescFade() {
    const descEl = q('.globe-gallery-modal-description');
    if (descEl) requestAnimationFrame(() => { if (modalIdx >= 0) updateDescFade(descEl); });
  }

  function populateModal(i) {
    const targetEl = q('.globe-gallery-modal-chrome') || modalEl;
    if (!targetEl) return;
    const meta = getCardMetadata(i);
    // role="img" text alternative for the WebGL photo (no src — the visible photo is the canvas).
    const imgEl = targetEl.querySelector('.globe-gallery-modal-image');
    if (imgEl) {
      if (meta.alt) {
        imgEl.setAttribute('aria-label', meta.alt);
        imgEl.removeAttribute('aria-hidden');
      } else {
        imgEl.removeAttribute('aria-label');
        imgEl.setAttribute('aria-hidden', 'true');
      }
    }
    const roleLabelEl = targetEl.querySelector('.globe-gallery-modal-role-label');
    if (roleLabelEl) roleLabelEl.textContent = meta.role;
    targetEl.querySelector('.globe-gallery-modal-name').textContent = meta.name;
    renderParagraphs(targetEl.querySelector('.globe-gallery-modal-description'), meta.description);
    const counterEl = targetEl.querySelector('.globe-gallery-modal-counter');
    if (counterEl) {
      const pad = (n) => (String(n).length < 2 ? `0${n}` : String(n));
      counterEl.textContent = `${pad(i + 1)} / ${pad(getCount())}`;
    }
    // SR position — read via the dialog name (aria-labelledby) + heading (aria-describedby).
    const posEl = targetEl.querySelector('.globe-gallery-modal-position');
    if (posEl) posEl.textContent = cardLabel(i + 1, getCount());
    const badgesEl = targetEl.querySelector('.globe-gallery-modal-badges');
    badgesEl.innerHTML = '';
    const config = getConfig();
    meta.badges.forEach((b) => {
      const row = document.createElement('li');
      row.className = 'globe-gallery-modal-badge';
      // Labelled by product, not by card, and unindexed. See README (Analytics).
      const daall = `${processTrackingLabels(b.name, config, 20)}--globe_card_modal`;
      const nameHtml = b.href
        ? `<a class="globe-gallery-modal-badge-app globe-gallery-modal-badge-app-link" href="${escapeHtml(b.href)}" daa-ll="${escapeHtml(daall)}">${escapeHtml(b.name)}</a>`
        : `<span class="globe-gallery-modal-badge-app">${escapeHtml(b.name)}</span>`;
      // The logo is authored per row; rows without one just render the name (no empty chip).
      row.innerHTML = `<div class="globe-gallery-modal-badge-left">${b.icon || ''}${nameHtml}</div><span class="globe-gallery-modal-badge-role">${escapeHtml(b.role)}</span>`;
      badgesEl.appendChild(row);
    });
    const descEl = targetEl.querySelector('.globe-gallery-modal-description');
    if (descEl) descEl.scrollTop = 0;
    scheduleDescFade();
  }

  // Finalize the desktop nav transition: detach old card to sphere, reset uniforms on the new.
  function completeDesktopNavTransition() {
    if (!dnNavActive) return;
    const sphereGroup = getSphereGroup();
    if (dnNavOldCard) {
      if (isOverflowCard(dnNavOldCard)) {
        // No sphere slot — the cross-fade already faded it out; retire the carrier.
        retireOverflowCard(dnNavOldCard);
      } else {
        // Reset uniforms before swapping back to the basic material (else a mid-fade card ghosts).
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
    }
    if (dnNavNewCard) {
      // New card stays active — restore its uniforms to fully-visible, no warp.
      resetModalMaterialUniforms(dnNavNewCard.mesh.material, 1);
      dnNavNewCard.mesh.renderOrder = 0;
    }
    dnNavOldCard = null;
    dnNavNewCard = null;
    dnNavActive = false;
  }

  // Begin the desktop modal-nav cross-warp: old card warps + fades out, new warps + fades in at
  // the same screen position; renderOrder controls draw order during the blend.
  function startDesktopNavTransition(newIdx) {
    const oldCard = modalCard;
    const newCard = getGalleryCard(newIdx);
    if (!oldCard || !newCard || !modalScene) return;

    // Finalize any in-flight transition first so we don't leak the old-old card.
    if (dnNavActive) completeDesktopNavTransition();

    // Attach new card, swap to SDF material (overflow carriers already are it), position at target.
    modalScene.attach(newCard.mesh);
    newCard.mesh.visible = true;
    if (!newCard.isOverflow) newCard.mesh.origMaterial = newCard.mesh.material;
    newCard.mesh.material = getModalMaterial(newCard);
    requestModalUpgrade(newCard, newIdx);
    // Start invisible; animation fades to 1 over DN_NAV_DUR. Also clears stale warp/motion.
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
    pushModalCoverUV(newCard); // at its modal size already → identity

    // Lock old card warp center to (0.5, 0.5) so the bell curve emanates from center.
    if (oldCard.mesh.material && oldCard.mesh.material.uniforms
      && oldCard.mesh.material.uniforms.uWarpCenter) {
      oldCard.mesh.material.uniforms.uWarpCenter.value.set(0.5, 0.5);
    }
    oldCard.mesh.renderOrder = 0;

    // Promote new card to active modalCard; the 'open' phase keeps it locked at tgtPos.
    modalIdx = newIdx;
    modalCard = newCard;
    modalPhase = MODAL_PHASE.OPEN;
    populateModal(newIdx);
    // Nudge the sphere toward the new slot only when it HAS one (barrel). No-op for overflow.
    if (!isOverflowIdx(newIdx)) requestNavNudge(newIdx);

    dnNavOldCard = oldCard;
    dnNavNewCard = newCard;
    dnNavT0 = perfNow();
    dnNavActive = true;
  }

  function open(i, originX, originY) {
    const cards = getCards();
    if (!modalEl || !cards[i]) return;
    // Cancel a pending close-finalize timeout so it can't strip our fresh modal's state.
    if (closeTimeoutId) {
      clearTimeout(closeTimeoutId);
      closeTimeoutId = null;
    }
    modalOpenedAt = perfNow();
    modalIdx = i;
    modalCard = cards[i];
    // Pin warp center to click origin (default ~center).
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

    // Reparent into the modal scene (sharp above the blur); attach() preserves world transform.
    if (modalScene) modalScene.attach(modalCard.mesh);
    else getScene().attach(modalCard.mesh);

    // Swap to SDF shader material for crisp corners at modal scale (alphaMap pixelates).
    modalCard.mesh.origMaterial = modalCard.mesh.material;
    modalCard.mesh.material = getModalMaterial(modalCard);
    requestModalUpgrade(modalCard, i);
    // Reset cached SDF uniforms (stale mid-fade would ghost the image); the crop then comes from
    // the mesh's live scale — still the shape it had on the globe, mid-fold included.
    resetModalMaterialUniforms(modalCard.mesh.material, 1);
    pushModalCoverUV(modalCard);

    // Reset depth test/order — modal scene has only this one mesh.
    modalCard.mesh.renderOrder = 0;
    modalCard.mesh.material.depthTest = true;
    if (modalCanvasEl) modalCanvasEl.style.display = 'block';

    modalPhase = MODAL_PHASE.OPENING;
    modalAnimT0 = perfNow();

    // Reset chrome reveal so elements start hidden and fade in after card settles.
    resetChromeReveal();

    modalEl.classList.add('is-visible');
    modalEl.setAttribute('aria-hidden', 'true');
    const chromeEl = q('.globe-gallery-modal-chrome');
    // Enter top layer as native dialog: focus trap, inert background, Escape, focus-restore.
    if (chromeEl && !chromeEl.open) {
      try { chromeEl.showModal(); } catch (e) { /* already open / not connected; ignore */ }
    }
    revealModalChrome();
    requestAnimationFrame(() => {
      modalEl.classList.add('is-open');
      if (chromeEl) chromeEl.classList.add('is-open');
      const nameEl = chromeEl && chromeEl.querySelector('.globe-gallery-modal-name');
      const focusEl = nameEl || chromeEl;
      if (focusEl) { try { focusEl.focus(); } catch (e) { /* not focusable; ignore */ } }
    });

    const renderer = getRenderer();
    const canvas = renderer && renderer.domElement;
    if (canvas) canvas.classList.add('is-modal-active');
    document.documentElement.classList.add('globe-gallery-modal-open');
    document.body.classList.add('globe-gallery-modal-open');
    if (window.lenis) window.lenis.stop();
  }

  function close(viaPointer) {
    // Suppress only the synthetic click after touch pointerup (would immediately close the fresh
    // modal). Escape / pull-to-close are deliberate and must not be swallowed inside this window.
    if (viaPointer) {
      const now = perfNow();
      if (now - modalOpenedAt < 200) return;
    }
    if (!modalEl || modalIdx < 0 || !modalCard) return;
    // Re-entrancy guard: ignore extra close requests while already CLOSING (avoids jitter).
    if (modalPhase === MODAL_PHASE.CLOSING) return;

    // Captured for focus-restore below (modalIdx resets to -1 when the close animation completes).
    const restoreIdx = modalIdx;

    // Finalize any in-flight desktop nav first so the old card returns to its slot cleanly.
    if (dnNavActive) completeDesktopNavTransition();

    const chromeEl = q('.globe-gallery-modal-chrome');

    // Snapshot current world transform (the modal target) as the START for the closing animation.
    modalCard.mesh.updateWorldMatrix(true, false);
    modalCard.mesh.getWorldPosition(modalCloseStartPos);
    modalCard.mesh.getWorldQuaternion(modalCloseStartQuat);
    modalCard.mesh.getWorldScale(modalCloseStartScale);

    modalPhase = MODAL_PHASE.CLOSING;
    modalAnimT0 = perfNow();

    // Hide chrome immediately — it fades with the container.
    resetChromeReveal();

    modalEl.classList.remove('is-open');
    if (chromeEl) chromeEl.classList.remove('is-open');

    // Defer scroll-unlock + aria cleanup until the close animation completes, else scrolling
    // moves the slot the card is flying back to. open() cancels this timeout if a new modal opens.
    closeTimeoutId = setTimeout(() => {
      modalEl.classList.remove('is-visible');
      modalEl.setAttribute('aria-hidden', 'true');
      if (chromeEl) {
        chromeEl.classList.remove('is-open');
        // Leave the top layer; native dialog restores opener focus, then re-point to the
        // last-viewed card so the globe doesn't spin back (synchronous, no visible frame).
        if (chromeEl.open) chromeEl.close();
        if (restoreFocusOnClose) restoreFocusOnClose(restoreIdx);
      }
      document.documentElement.classList.remove('globe-gallery-modal-open');
      document.body.classList.remove('globe-gallery-modal-open');
      if (window.lenis) window.lenis.start();
      closeTimeoutId = null;
    }, MODAL_ANIM_DURATION);

    const renderer = getRenderer();
    const canvas = renderer && renderer.domElement;
    if (canvas) canvas.classList.remove('is-modal-active');
  }

  // Close via the button so Escape / pull-to-close report it. See README (Analytics).
  function clickClose() {
    if (closeBtn) closeBtn.click(); else close();
  }

  function navigate(direction) {
    if (modalIdx < 0 || !modalCard) return;
    // Don't navigate while closing, or startDesktopNavTransition would flip CLOSING→OPEN and orphan
    // the close animation (card left floating in modalScene — the "duplicate globe" bug).
    if (modalPhase === MODAL_PHASE.CLOSING) return;
    const count = getCount();
    if (count <= 1) return;
    const next = (modalIdx + direction + count) % count;
    // Every breakpoint uses the same cross-warp transition (old warps + fades out, new fades in).
    startDesktopNavTransition(next);
  }

  // Modal card animation: from the captured world transform → target near camera (open), or back
  // to the live sphere slot (close, which tracks the slot as the sphere keeps rotating).
  function updateAnimation(sphereRotActive) {
    if (modalCard && modalPhase) {
      const sphereGroup = getSphereGroup();
      const now = perfNow();
      // Reduced motion: force aT=1 so the fly snaps in one frame and the warp bell curves collapse.
      const aT = getReducedMotion()
        ? 1 : Math.max(0, Math.min(1, (now - modalAnimT0) / MODAL_ANIM_DURATION));
      const aE = easeInOutCubic(aT);
      const tgtPos = scratchPos;
      const tgtQuat = scratchQuat;
      const tgtScale = scratchScale;

      // Capture position before this frame's update for the CA delta.
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
        // Crop tracks that scale; a nav cross-warp owns its own cards' uniforms.
        if (!dnNavActive) pushModalCoverUV(modalCard);

        // Chrome reveal: start fade once card is 90% to target (skip at 1 — navigate snaps).
        if (modalChromeFadeT < 1) {
          if (getReducedMotion()) {
            modalChromeFadeT = 1; // chrome appears instantly
          } else {
            if (aT >= 0.90 && modalChromeRevealT0 < 0) modalChromeRevealT0 = now;
            modalChromeFadeT = modalChromeRevealT0 >= 0
              ? Math.max(0, Math.min(1, (now - modalChromeRevealT0) / CHROME_REVEAL_DUR))
              : 0;
          }
        }
      } else if (modalPhase === MODAL_PHASE.CLOSING && modalCard.isOverflow) {
        // Overflow carrier has no slot to fly back to — dissolve opacity to 0, then retire.
        const u = modalCard.mesh.material.uniforms;
        if (u && u.uOpacity) u.uOpacity.value = 1 - aE;
        if (aT >= 1) {
          retireOverflowCard(modalCard);
          releaseModalTexture();
          if (modalCanvasEl) modalCanvasEl.style.display = 'none';
          closeModalIdentity();
        }
      } else if (modalPhase === MODAL_PHASE.CLOSING) {
        // Live target = slot's world transform: (drag rotation × spherePos) + sphereGroup.position.
        // sphereGroup.rotation is identity, so apply the drag rotation manually.
        sphereGroup.updateMatrixWorld(true);
        if (sphereRotActive) {
          tgtPos.copy(modalCard.spherePos).applyQuaternion(sphereRotQuat);
          tgtQuat.copy(sphereRotQuat).multiply(modalCard.sphereQuat);
        } else {
          tgtPos.copy(modalCard.spherePos);
          tgtQuat.copy(modalCard.sphereQuat);
        }
        tgtPos.add(sphereGroup.position);
        // Match sphere-phase scale (equal-area) + facing tilt exactly, or the card jumps on the
        // last frame when snapToSphereSlot runs. applySphereFacing is a no-op where facing=0.
        tgtScale.set(modalCard.sphereScaleSX, modalCard.sphereScaleSY, 1);
        applySphereFacing(tgtQuat);

        modalCard.mesh.position.lerpVectors(modalCloseStartPos, tgtPos, aE);
        modalCard.mesh.quaternion.copy(modalCloseStartQuat).slerp(tgtQuat, aE);
        modalCard.mesh.scale.lerpVectors(modalCloseStartScale, tgtScale, aE);
        pushModalCoverUV(modalCard); // closes back down to the slot's crop, tracking the scale

        if (aT >= 1) {
          // Reset cached SDF uniforms before restoring the basic material (else it ghosts later).
          resetModalMaterialUniforms(modalCard.modalMat, 1);
          // Restore the card's own material before re-parenting to globe.
          if (modalCard.mesh.origMaterial) {
            modalCard.mesh.material = modalCard.mesh.origMaterial;
            modalCard.mesh.origMaterial = null;
          }
          // Re-parent to sphereGroup and snap (drag rotation baked in, no flash).
          sphereGroup.attach(modalCard.mesh);
          snapToSphereSlot(modalCard);
          modalCard.mesh.material.depthTest = true;
          modalCard.mesh.renderOrder = 0;
          if (modalCanvasEl) modalCanvasEl.style.display = 'none';
          // Free the opened card's hi-res texture (only the small base set stays resident).
          releaseModalTexture();
          closeModalIdentity();
        }
      }

      // Modal CA while the card moves; the position delta encodes velocity. Clear to 0 once OPEN.
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

      // Modal warp: sin(aT·π) bell curve on open/close, settles to 0 when OPEN (drag sets it then).
      if (modalPhase === MODAL_PHASE.OPENING) {
        modalWarp = Math.sin(Math.max(0, Math.min(1, aT)) * Math.PI) * MODAL_WARP_OPEN;
      } else if (modalPhase === MODAL_PHASE.CLOSING) {
        modalWarp = Math.sin(Math.max(0, Math.min(1, aT)) * Math.PI) * MODAL_WARP_CLOSE;
      } else if (modalPhase === MODAL_PHASE.OPEN) {
        // Decay any leftover warp once settled; touch handlers will set it again on drag.
        modalWarp *= 0.85;
        if (modalWarp < 0.001) modalWarp = 0;
      }
      // Skip during desktop nav cross-warp — updateDesktopNav drives both cards' uWarp directly.
      if (!dnNavActive) pushModalWarpUniforms();

      // Keep chrome locked to the card's projected position each frame (OPENING sets fade target).
      if (modalPhase === MODAL_PHASE.OPENING || modalPhase === MODAL_PHASE.OPEN) {
        revealModalChrome();
      }
    }
  }

  // Desktop nav cross-warp: both cards' uWarp on a sin bell curve; opacity cross-fades.
  function updateDesktopNav() {
    if (dnNavActive) {
      const dnNow = perfNow();
      // Reduced motion: force completion — the new card just becomes visible.
      const dnT = getReducedMotion() ? 1 : Math.max(0, Math.min(1, (dnNow - dnNavT0) / DN_NAV_DUR));
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
    // Resize can change whether the description overflows — re-measure the fade cue.
    if (modalIdx >= 0) scheduleDescFade();
  }

  // Create the modal renderer/scene + THREE temps and wire DOM interactions. Once per init.
  function setup() {
    const { W, H } = getViewport();

    // Modal renderer/scene: renders only the flown-out card, above the blurred main canvas.
    modalCanvasEl = q('.globe-gallery-modal-canvas');
    if (modalCanvasEl) {
      const modalGlOpts = { canvas: modalCanvasEl, antialias: getAntialias(), alpha: true };
      modalRenderer = new THREE.WebGLRenderer(modalGlOpts);
      modalRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      modalRenderer.setSize(W, H);
      modalRenderer.setClearColor(0x000000, 0);
      modalScene = new THREE.Scene();
    }

    modalEl = q('.globe-gallery-modal');
    if (!modalEl) return;
    modalStartPos = new THREE.Vector3();
    modalStartQuat = new THREE.Quaternion();
    modalStartScale = new THREE.Vector3();
    modalCloseStartPos = new THREE.Vector3();
    modalCloseStartQuat = new THREE.Quaternion();
    modalCloseStartScale = new THREE.Vector3();
    // Chrome div hosts the interactive elements (close, nav, info) above the WebGL card canvas.
    const chromeEl = q('.globe-gallery-modal-chrome');
    const evtRoot = chromeEl || modalEl;
    // Wire click + touch listeners once (DOM persists across re-inits — re-adding would stack).
    const alreadyWired = listenersWired;
    listenersWired = true;
    if (!alreadyWired) {
      closeBtn = evtRoot.querySelector('.globe-gallery-modal-close');
      // isTrusted is exactly viaPointer: the guard exists to swallow the browser's synthetic
      // click after a touch pointerup (trusted); ours from clickClose() are not.
      closeBtn.addEventListener('click', (e) => close(e.isTrusted));
      prevBtn = evtRoot.querySelector('.globe-gallery-modal-nav-prev');
      nextBtn = evtRoot.querySelector('.globe-gallery-modal-nav-next');
      prevBtn.addEventListener('click', () => { navigate(-1); });
      nextBtn.addEventListener('click', () => { navigate(1); });
      // Single-card gallery: nav is a no-op, so hide the arrows entirely (count is fixed).
      if (getCount() <= 1) { prevBtn.hidden = true; nextBtn.hidden = true; }
      const descEl = evtRoot.querySelector('.globe-gallery-modal-description');
      if (descEl) descEl.addEventListener('scroll', () => updateDescFade(descEl), { passive: true });
      // Escape → dialog 'cancel'; preventDefault to play the close animation, not instant close.
      if (chromeEl) {
        chromeEl.addEventListener('cancel', (e) => { e.preventDefault(); clickClose(); });
      }
    }

    // Touch gestures wired once too; nothing runs after this, so early-return.
    if (alreadyWired) return;

    // Mobile touch gestures: live 1:1 drag (CSS transform on the canvas) with rubber-band release.
    // Horizontal = swipe/navigate; vertical pull-down = close. Chrome stays put (iOS Photos UX).
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

    // Swipe/pull applies to touch-primary devices, not just the sm width band — tablets at
    // md (≥768, coarse pointer) get the same gesture nav the globe's yaw-only shape assumes.
    // Mirrors usesCylinderGeometry's '(pointer: coarse)' check. matchMedia-less → no gestures.
    const isTouchPrimary = () => !!window.matchMedia?.('(pointer: coarse)').matches;

    // Attach to the dialog (evtRoot), not modalEl — modalEl goes inert under showModal().
    evtRoot.addEventListener('touchstart', (e) => {
      if (!isTouchPrimary()) return;
      if (modalIdx < 0) return;
      if (e.touches.length !== 1) return;
      if (!modalCanvasEl) return;
      // Description owns its own touch scroll — don't hijack it for swipe/pull-to-close.
      if (e.target?.closest?.('.globe-gallery-modal-description')) return;
      swStartX = e.touches[0].clientX; swLastX = swStartX;
      swStartY = e.touches[0].clientY; swLastY = swStartY;
      swLastT = Date.now();
      swActive = true;
      swAxis = null;
      swVelX = 0;
      swVelY = 0;
      // Capture touch position as warp center (finger-anchored fisheye).
      touchToWarpUV(swStartX, swStartY, modalWarpCenter);
      // Drag follows finger 1:1 — no transition.
      modalCanvasEl.style.transition = 'none';
    }, { passive: true });

    evtRoot.addEventListener('touchmove', (e) => {
      if (!swActive || e.touches.length !== 1) return;
      const x = e.touches[0].clientX;
      const y = e.touches[0].clientY;
      const dx = x - swStartX;
      const dy = y - swStartY;

      // Axis lock — first significant move picks horizontal swipe vs vertical pull (no jitter).
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
        // Warp-only preview (no slide): the fisheye grows with drag, capped at MODAL_WARP_SWIPE.
        // Release commits the same cross-warp transition as the nav buttons.
        modalWarp = Math.min(1, Math.abs(dx) / (window.innerWidth * 0.30)) * MODAL_WARP_SWIPE;
      } else {
        // Pull-down only — upward drag does nothing (clamped to 0).
        const pullY = Math.max(0, dy);
        const scale = Math.max(PULL_SCALE_MIN, 1 - pullY / PULL_SCALE_DAMPING);
        modalCanvasEl.style.transform = `translate3d(0, ${pullY}px, 0) scale(${scale.toFixed(3)})`;
        // Pull-down warp: scales with pull / 20% viewport height, capped at MODAL_WARP_PULL.
        modalWarp = Math.min(1, pullY / (window.innerHeight * 0.20)) * MODAL_WARP_PULL;
      }
      pushModalWarpUniforms();
    }, { passive: true });

    evtRoot.addEventListener('touchend', (e) => {
      if (!swActive) return;
      swActive = false;
      if (!modalCanvasEl || swAxis === null) { swAxis = null; return; }
      if (e.changedTouches.length !== 1) return;
      const dx = e.changedTouches[0].clientX - swStartX;
      const dy = e.changedTouches[0].clientY - swStartY;

      if (swAxis === 'x') {
        const commit = Math.abs(dx) > window.innerWidth * COMMIT_DIST_X_FRAC
                  || Math.abs(swVelX) > COMMIT_VEL_X;
        // swipe left → next (+1), swipe right → prev (−1). Commit clicks the matching nav
        // button — same handler, plus it reports (see README, Analytics); a non-commit release
        // lets the preview warp decay back to 0 in updateAnimation. No canvas slide either way.
        if (commit) {
          // Clear the preview warp so it doesn't bleed onto the new card once the transition
          // ends and updateAnimation resumes pushing modalWarp — the cross-warp owns warp now.
          modalWarp = 0;
          const dir = (dx < 0 ? 1 : -1) * (isRtl() ? -1 : 1);
          const btn = dir < 0 ? prevBtn : nextBtn;
          // hidden on a single-card gallery — clicking would report a no-op nav.
          if (btn?.hidden === false) btn.click(); else navigate(dir);
        }
      } else {
        const pullCommit = dy > window.innerHeight * COMMIT_DIST_Y_FRAC
                      || swVelY > COMMIT_VEL_Y;
        if (pullCommit) {
          // Sync the mesh world pos+scale to the gesture's visible state, reset CSS, then close —
          // so the fly-back starts from where the user dragged, not center. No snap.
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
          clickClose();
        } else {
          // Rubber-band back.
          modalCanvasEl.style.transition = 'transform 0.25s cubic-bezier(0.25, 0.1, 0.25, 1)';
          modalCanvasEl.style.transform = '';
        }
      }
      swAxis = null;
    }, { passive: true });

    evtRoot.addEventListener('touchcancel', () => {
      if (!swActive) return;
      swActive = false;
      swAxis = null;
      if (!modalCanvasEl) return;
      modalCanvasEl.style.transition = 'transform 0.25s cubic-bezier(0.25, 0.1, 0.25, 1)';
      modalCanvasEl.style.transform = '';
    }, { passive: true });
  }

  // Synchronously return the modal DOM + page state to closed. destroy() forces phase to CLOSED
  // without the close animation, so a breakpoint re-init (same DOM) doesn't leave the modal stuck
  // open. Uses q() for the main canvas because core destroy() nulls the renderer first.
  function resetModalDom() {
    if (modalEl) {
      modalEl.classList.remove('is-visible', 'is-open');
      modalEl.setAttribute('aria-hidden', 'true');
    }
    const chromeEl = q('.globe-gallery-modal-chrome');
    if (chromeEl) {
      chromeEl.classList.remove('is-open');
      // Leave the top layer if a breakpoint re-init fires with the modal open.
      if (chromeEl.open) chromeEl.close();
    }
    if (modalCanvasEl) {
      modalCanvasEl.style.display = 'none';
      modalCanvasEl.style.transition = 'none';
      modalCanvasEl.style.transform = '';
    }
    const mainCanvas = q('.globe-gallery-canvas');
    if (mainCanvas) mainCanvas.classList.remove('is-modal-active');
    document.documentElement.classList.remove('globe-gallery-modal-open');
    document.body.classList.remove('globe-gallery-modal-open');
    if (window.lenis) window.lenis.start();
    resetChromeReveal();
  }

  function destroy() {
    if (closeTimeoutId) { clearTimeout(closeTimeoutId); closeTimeoutId = null; }
    resetModalDom();
    releaseModalTexture();
    // Dispose lazy overflow carriers — Three frees GPU memory only on explicit dispose.
    overflowCards.forEach((card) => {
      if (card.pendingImg) { card.pendingImg.onload = null; card.pendingImg.onerror = null; card.pendingImg.src = ''; card.pendingImg = null; }
      if (card.mesh.parent) card.mesh.parent.remove(card.mesh);
      card.mesh.geometry.dispose();
      card.modalMat.dispose();
      if (card.ownTex) { card.ownTex.dispose(); card.ownTex = null; }
    });
    overflowCards.clear();
    if (overflowPlaceholderTex) { overflowPlaceholderTex.dispose(); overflowPlaceholderTex = null; }
    if (modalRenderer) {
      modalRenderer.dispose();
      modalRenderer = null;
    }
    modalScene = null;
    closeModalIdentity();
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
