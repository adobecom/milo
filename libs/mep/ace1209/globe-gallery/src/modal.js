import * as THREE from '../three.module.min.js';
import { createModalMaterial } from './materials.js';
import {
  easeInOutCubic, easeOutCubic, clamp01, coverFit, pxPerWorldAt, capDpr,
} from './math.js';
import { escapeHtml, renderParagraphs, hangParagraphs } from './authoring.js';
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
const MODAL_CAM_DIST = 16.4;
const MODAL_RADIUS_PX = 16; // on-screen modal corner radius at md+ (0 on mobile); see README
const MODAL_ANIM_FALLBACK = 350; // ms open/close fly time
const CHROME_REVEAL_DUR = 300; // ms chrome fade-in after card 90% settled
// Fisheye warp peaks (sin bell curve).
const MODAL_WARP_OPEN = 0.30;
const MODAL_WARP_CLOSE = 0.30;
const MODAL_WARP_PULL = 0.40;
const MODAL_WARP_SWIPE = 0.25;
const MODAL_WARP_DECAY = 0.85;
const DN_NAV_DUR = 500; // ms
const DN_NAV_WARP = 0.40; // peak warp
// Desktop/tablet image fit; chrome placement is CSS.
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
  authoredNo,
  stepCard,
  loadModalUpgrade,
  getViewport,
  getBP,
  getCardDims,
  cardAspect,
  getAntialias,
  caEnabled,
  cardLabel,
  getReducedMotion,
  sphereRotQuat,
  snapToSphereSlot,
  // Applies the sphere's camera-facing tilt to a quat IN PLACE.
  applySphereFacing,
  requestNavNudge,
  applyMotionCA,
  restoreFocusOnClose,
}) {
  let modalRenderer = null;
  let appliedModalDpr = 0;
  let modalScene = null;
  let modalCanvasEl = null;
  let modalEl = null;
  let chromeEl = null;

  let modalIdx = -1; // currently open card index, -1 if closed
  let modalCard = null; // card whose mesh is animating
  let modalPhase = MODAL_PHASE.CLOSED;
  // Pending Image + owned CanvasTexture; 1 resident at a time.
  let modalTexImg = null;
  let modalTexOwned = null;
  let modalTexCard = null;
  let modalAnimT0 = 0; // animation start timestamp
  let modalAnimMs = MODAL_ANIM_FALLBACK;
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
  let chromeNodes = null; // { els, settled } — see revealModalChrome

  let modalChromeRevealT0 = -1; // timestamp when card first hit 90%; -1 = not yet
  let modalChromeFadeT = 0; // 0→1 fade progress for chrome elements

  // Suppresses the synthetic click after touch pointerup, which would self-close.
  let modalOpenedAt = 0;
  // open() cancels a stale one so it can't yank the new modal's state.
  let closeTimeoutId = null;
  // Wired once — the DOM persists across re-inits, so re-adding would stack them.
  let listenersWired = false;
  // Held so Escape + touch gestures can click them rather than call navigate()/close(), which
  // is what makes those paths report.
  let prevBtn = null;
  let nextBtn = null;
  let closeBtn = null;

  let modalWarp = 0;
  const modalWarpCenter = new THREE.Vector2(0.5, 0.5);

  let dnNavActive = false;
  let dnNavT0 = 0;
  let dnNavOldCard = null;
  let dnNavNewCard = null;

  // Shared by close-finalize and destroy().
  function closeModalIdentity() {
    modalPhase = MODAL_PHASE.CLOSED;
    modalCard = null;
    modalIdx = -1;
  }

  function resetChromeReveal() {
    modalChromeRevealT0 = -1;
    modalChromeFadeT = 0;
    if (chromeNodes) chromeNodes.settled = false; // else the next reveal would early-out at once
  }

  function getModalIdx() { return modalIdx; }

  const isRtl = () => document.documentElement.dir === 'rtl';

  // Plane fit + the uRadius fraction that holds MODAL_RADIUS_PX constant.
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

  // The DISPLAYED texture's aspect, else the base texture's.
  function modalUAspect(card) {
    return (card && (card.modalAspect || card.srcAspect)) || cardAspect;
  }

  // Active modal card or a swipe-neighbour in modalScene; the core loop skips these.
  function isCardManaged(card) {
    return card === modalCard || (!!modalScene && card.mesh.parent === modalScene);
  }

  // Cancel a pending hi-res load + dispose the owned texture, resetting the card to its base.
  function releaseModalTexture() {
    if (modalTexImg) {
      modalTexImg.onload = null;
      modalTexImg.onerror = null;
      modalTexImg.src = '';
      modalTexImg = null;
    }
    if (modalTexOwned) {
      if (modalTexCard && modalTexCard.modalMat) {
        const baseMat = modalTexCard.mesh.origMaterial || modalTexCard.mesh.material;
        if (baseMat) modalTexCard.modalMat.uniforms.map.value = baseMat.map;
        modalTexCard.modalAspect = 0; // back to the base texture, so back to the barrel's aspect
      }
      modalTexOwned.dispose();
      modalTexOwned = null;
    }
    modalTexCard = null;
  }

  function getModalMaterial(card) {
    if (!card.modalMat) {
      card.modalMat = createModalMaterial(card.mesh.material.map, modalUAspect(card));
    } else {
      // In case a prior open left a since-disposed hi-res texture.
      card.modalMat.uniforms.map.value = card.mesh.material.map;
      card.modalMat.uniforms.uAspect.value = modalUAspect(card);
    }
    card.modalMat.uniforms.uRadius.value = modalRadiusFrac(modalUAspect(card));
    return card.modalMat;
  }

  // ACTIVE modal card only, not swipe-neighbours.
  function requestModalUpgrade(card, idx) {
    releaseModalTexture();
    if (!loadModalUpgrade) return;
    modalTexImg = loadModalUpgrade(idx, (tex) => {
      modalTexImg = null;
      // The modal may have closed or navigated away before the decode finished.
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

  // A stale mid-fade value would ghost otherwise.
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

  // Crop to the aspect the plane is drawn at THIS frame. Call after the frame's scale write.
  function pushModalCoverUV(card) {
    const u = card && card.mesh.material && card.mesh.material.uniforms;
    if (!u || !u.uRepeat) return;
    const { x, y } = card.mesh.scale;
    const c = coverFit(modalUAspect(card), cardAspect * (x / (y || 1)), coverScratch);
    u.uRepeat.value.set(c.rx, c.ry);
    u.uOffset.value.set(c.ox, c.oy);
  }

  function touchToWarpUV(clientX, clientY, out) {
    const { W, H } = getViewport();
    const v = out || new THREE.Vector2();
    v.x = clamp01(clientX / W);
    v.y = clamp01(1 - clientY / H);
    return v;
  }

  function pushModalWarpUniforms() {
    if (!modalCard) return;
    const u = modalCard.mesh.material && modalCard.mesh.material.uniforms;
    if (!u || !u.uWarp || !u.uWarpCenter) return;
    u.uWarp.value = modalWarp;
    u.uWarpCenter.value.copy(modalWarpCenter);
  }

  function skewOffsetPx() {
    const { view } = getCamera();
    return view && view.enabled === true ? -view.offsetY : 0;
  }

  // Visible photo contain-fit to the viewport, native aspect kept. Recomputed per-frame.
  function computeModalTarget(outPos, outQuat, outScale, cardOverride) {
    // cardOverride targets a swipe-neighbour; defaults to modalCard.
    const card = cardOverride || modalCard;
    const camera = getCamera();
    const { W, H } = getViewport();
    const { w: CARD_W_SPHERE, h: CARD_H_SPHERE } = getCardDims();
    const camZ = camera.position.z;
    const dist = MODAL_CAM_DIST;

    const pxPerWorld = pxPerWorldAt(dist, H);

    const isMobile = (getBP() === 'sm');
    const uAspect = modalUAspect(card);
    const sScaleX = uAspect / cardAspect;
    let scaleY; let
      scaleX;

    if (isMobile) {
      // Full-bleed width, top-aligned, square corners; height follows aspect.
      const cardHPx = W / uAspect;
      scaleX = W / (CARD_W_SPHERE * pxPerWorld);
      scaleY = scaleX / sScaleX;
      outPos.set(0, (H / 2 - cardHPx / 2 + skewOffsetPx()) / pxPerWorld, camZ - dist);
    } else {
      // Contain-fit to the viewport minus DT_IMG_MARGIN, aspect kept.
      const { cardHPx } = modalDesktopFit(uAspect);
      scaleY = cardHPx / (CARD_H_SPHERE * pxPerWorld);
      scaleX = scaleY * sScaleX;

      outPos.set(0, skewOffsetPx() / pxPerWorld, camZ - dist);
    }
    // uRadius tracks the fit and uAspect changes when the hi-res texture decodes mid-flight,
    // so both are re-pushed every frame.
    if (card && card.modalMat) {
      card.modalMat.uniforms.uAspect.value = uAspect;
      card.modalMat.uniforms.uRadius.value = modalRadiusFrac(uAspect);
    }
    outQuat.identity();
    outScale.set(scaleX, scaleY, 1.0);
  }

  function photoRectPx() {
    if (!modalCard || modalPhase !== MODAL_PHASE.OPEN) return null;
    const { W, H } = getViewport();
    const { w: cardW, h: cardH } = getCardDims();
    const pxPerWorld = pxPerWorldAt(MODAL_CAM_DIST, H);
    const { position, scale } = modalCard.mesh;
    const halfW = 0.5 * cardW * scale.x * pxPerWorld;
    const halfH = 0.5 * cardH * scale.y * pxPerWorld;
    const cx = W / 2 + position.x * pxPerWorld;
    const cy = H / 2 - position.y * pxPerWorld; // world +Y is screen-up
    return { left: cx - halfW, right: cx + halfW, top: cy - halfH, bottom: cy + halfH };
  }

  // Reveal fade only (opacity + an 8px slide-up). Placement is pure CSS.
  function revealModalChrome() {
    if (!chromeEl) return;
    if (!chromeNodes) {
      chromeNodes = {
        els: [...chromeEl.querySelectorAll('.globe-gallery-modal-info, .globe-gallery-modal-close,'
          + ' .globe-gallery-modal-nav, .globe-gallery-modal-counter')],
      };
    }
    // transition:none while animating so CSS hover can't fight the per-frame write; cleared on
    // the settled frame so :hover animates again.
    const settled = modalChromeFadeT >= 1;
    if (settled && chromeNodes.settled) return;
    chromeNodes.settled = settled;
    const cFade = easeOutCubic(modalChromeFadeT);
    const shift = settled ? '' : ` translateY(${Math.round((1 - cFade) * 8)}px)`;
    chromeNodes.els.forEach((el) => {
      el.style.opacity = String(cFade);
      // The counter has no wrapper, so its CSS centring transform must survive the slide.
      const base = el.classList.contains('globe-gallery-modal-counter') ? 'translateX(-50%)' : '';
      el.style.transform = settled ? '' : `${base}${shift}`.trim();
      el.style.transition = settled ? '' : 'none';
    });
  }

  function updateDescFade(descEl) {
    if (!descEl) return;
    const overflow = descEl.scrollHeight - descEl.clientHeight;
    const canScroll = overflow > 1;
    const top = canScroll && descEl.scrollTop > 1;
    const bottom = canScroll && descEl.scrollTop < overflow - 1;
    descEl.classList.toggle('is-faded-top', top);
    descEl.classList.toggle('is-faded-bottom', bottom);
    if (canScroll) descEl.tabIndex = 0;
    else if (document.activeElement !== descEl) descEl.removeAttribute('tabindex');
  }

  function scheduleDescFade() {
    const descEl = q('.globe-gallery-modal-description');
    if (descEl) requestAnimationFrame(() => { if (modalIdx >= 0) updateDescFade(descEl); });
  }

  function announce(text) {
    const el = chromeEl && chromeEl.querySelector('.globe-gallery-modal-announce');
    if (el) el.textContent = text;
  }

  function populateModal(i, speak) {
    const targetEl = chromeEl || modalEl;
    if (!targetEl) return;
    const meta = getCardMetadata(i);
    // Text alternative for the WebGL photo; there is no src, the photo is the canvas.
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
    const descEl = targetEl.querySelector('.globe-gallery-modal-description');
    renderParagraphs(descEl, meta.description);
    hangParagraphs(descEl);
    const counterEl = targetEl.querySelector('.globe-gallery-modal-counter');
    if (counterEl) {
      const pad = (n) => (String(n).length < 2 ? `0${n}` : String(n));
      counterEl.textContent = `${pad(authoredNo(i))} / ${pad(getCount())}`;
    }
    const position = cardLabel(authoredNo(i), getCount());
    targetEl.querySelectorAll('.globe-gallery-modal-position').forEach((el) => {
      el.textContent = position;
    });
    announce(speak ? [meta.name, meta.role, position].filter(Boolean).join('. ') : '');
    const badgesEl = targetEl.querySelector('.globe-gallery-modal-badges');
    badgesEl.innerHTML = '';
    const config = getConfig();
    meta.badges.forEach((b) => {
      const row = document.createElement('li');
      row.className = 'globe-gallery-modal-badge';
      // Labelled by product, not by card, and unindexed.
      const daall = `${processTrackingLabels(b.name, config, 20)}--globe_card_modal`;
      const nameHtml = b.href
        ? `<a class="globe-gallery-modal-badge-app globe-gallery-modal-badge-app-link" href="${escapeHtml(b.href)}" daa-ll="${escapeHtml(daall)}">${escapeHtml(b.name)}</a>`
        : `<span class="globe-gallery-modal-badge-app">${escapeHtml(b.name)}</span>`;
      // Rows without a logo just render the name — no empty chip.
      row.innerHTML = `<div class="globe-gallery-modal-badge-left">${b.icon || ''}${nameHtml}</div><span class="globe-gallery-modal-badge-role">${escapeHtml(b.role)}</span>`;
      badgesEl.appendChild(row);
    });
    if (descEl) descEl.scrollTop = 0;
    scheduleDescFade();
  }

  function completeDesktopNavTransition() {
    if (!dnNavActive) return;
    const sphereGroup = getSphereGroup();
    if (dnNavOldCard) {
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
      resetModalMaterialUniforms(dnNavNewCard.mesh.material, 1);
      dnNavNewCard.mesh.renderOrder = 0;
    }
    dnNavOldCard = null;
    dnNavNewCard = null;
    dnNavActive = false;
  }

  // Old card warps + fades out, new warps + fades in at the same screen position; renderOrder
  // controls draw order during the blend.
  function startDesktopNavTransition(newIdx) {
    const oldCard = modalCard;
    const newCard = getCards()[newIdx];
    if (!oldCard || !newCard || !modalScene) return;

    // Finalize any in-flight transition first, or the old-old card leaks.
    if (dnNavActive) completeDesktopNavTransition();

    modalScene.attach(newCard.mesh);
    newCard.mesh.visible = true;
    newCard.mesh.origMaterial = newCard.mesh.material;
    newCard.mesh.material = getModalMaterial(newCard);
    requestModalUpgrade(newCard, newIdx);
    // Also clears stale warp/motion.
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

    // So the bell curve emanates from centre.
    if (oldCard.mesh.material && oldCard.mesh.material.uniforms
      && oldCard.mesh.material.uniforms.uWarpCenter) {
      oldCard.mesh.material.uniforms.uWarpCenter.value.set(0.5, 0.5);
    }
    oldCard.mesh.renderOrder = 0;

    modalIdx = newIdx;
    modalCard = newCard;
    modalPhase = MODAL_PHASE.OPEN;
    populateModal(newIdx, true);
    requestNavNudge(newIdx);

    dnNavOldCard = oldCard;
    dnNavNewCard = newCard;
    dnNavT0 = perfNow();
    dnNavActive = true;
  }

  function open(i, originX, originY) {
    const cards = getCards();
    if (!modalEl || !cards[i]) return;
    // So it can't strip the fresh modal's state.
    if (closeTimeoutId) {
      clearTimeout(closeTimeoutId);
      closeTimeoutId = null;
    }
    modalOpenedAt = perfNow();
    modalIdx = i;
    modalCard = cards[i];
    if (typeof originX === 'number' && typeof originY === 'number') {
      touchToWarpUV(originX, originY, modalWarpCenter);
    } else {
      modalWarpCenter.set(0.5, 0.5);
    }
    modalWarp = 0; // bell curve in updateAnimation ramps it up from 0
    populateModal(i);

    // Snapshot the card's current WORLD transform
    modalCard.mesh.updateWorldMatrix(true, false);
    modalCard.mesh.getWorldPosition(modalStartPos);
    modalCard.mesh.getWorldQuaternion(modalStartQuat);
    modalCard.mesh.getWorldScale(modalStartScale);

    // attach() preserves the world transform.
    if (modalScene) modalScene.attach(modalCard.mesh);
    else getScene().attach(modalCard.mesh);

    // Crisp corners at modal scale; alphaMap pixelates.
    modalCard.mesh.origMaterial = modalCard.mesh.material;
    modalCard.mesh.material = getModalMaterial(modalCard);
    requestModalUpgrade(modalCard, i);
    // A stale mid-fade would ghost. The crop then comes from the mesh's live scale — still the
    // shape it had on the globe, mid-fold included.
    resetModalMaterialUniforms(modalCard.mesh.material, 1);
    pushModalCoverUV(modalCard);

    modalCard.mesh.renderOrder = 0;
    modalCard.mesh.material.depthTest = true;
    if (modalCanvasEl) modalCanvasEl.style.display = 'block';

    modalPhase = MODAL_PHASE.OPENING;
    modalAnimT0 = perfNow();

    resetChromeReveal();

    modalEl.classList.add('is-visible');
    modalEl.setAttribute('aria-hidden', 'true');
    // Native dialog: focus trap, inert background, Escape, focus-restore.
    if (chromeEl && !chromeEl.open) {
      try { chromeEl.showModal(); } catch (e) { /* already open / not connected; ignore */ }
    }
    revealModalChrome();
    requestAnimationFrame(() => {
      modalEl.classList.add('is-open');
      if (chromeEl) chromeEl.classList.add('is-open');
    });

    const renderer = getRenderer();
    const canvas = renderer && renderer.domElement;
    if (canvas) canvas.classList.add('is-modal-active');
    document.documentElement.classList.add('globe-gallery-modal-open');
    document.body.classList.add('globe-gallery-modal-open');
    if (window.lenis) window.lenis.stop();
  }

  function close(viaPointer) {
    // Only the synthetic click after touch pointerup. Escape / pull-to-close are deliberate and
    // must not be swallowed inside this window.
    if (viaPointer) {
      const now = perfNow();
      if (now - modalOpenedAt < 200) return;
    }
    if (!modalEl || modalIdx < 0 || !modalCard) return;
    // Ignore extra close requests while already CLOSING.
    if (modalPhase === MODAL_PHASE.CLOSING) return;

    // modalIdx resets to -1 when the close animation completes.
    const restoreIdx = modalIdx;

    // So the old card returns to its slot cleanly.
    if (dnNavActive) completeDesktopNavTransition();

    // The START for the closing animation.
    modalCard.mesh.updateWorldMatrix(true, false);
    modalCard.mesh.getWorldPosition(modalCloseStartPos);
    modalCard.mesh.getWorldQuaternion(modalCloseStartQuat);
    modalCard.mesh.getWorldScale(modalCloseStartScale);

    modalPhase = MODAL_PHASE.CLOSING;
    modalAnimT0 = perfNow();

    resetChromeReveal();

    modalEl.classList.remove('is-open');
    if (chromeEl) chromeEl.classList.remove('is-open');

    // Deferred until the close animation completes, else scrolling moves the slot the card is
    // flying back to. open() cancels this timeout if a new modal opens.
    closeTimeoutId = setTimeout(() => {
      modalEl.classList.remove('is-visible');
      modalEl.setAttribute('aria-hidden', 'true');
      if (chromeEl) {
        chromeEl.classList.remove('is-open');
        // The native dialog restores opener focus; re-point to the last-viewed card so the
        // globe doesn't spin back. Synchronous, so no visible frame.
        if (chromeEl.open) chromeEl.close();
        if (restoreFocusOnClose) restoreFocusOnClose(restoreIdx);
      }
      document.documentElement.classList.remove('globe-gallery-modal-open');
      document.body.classList.remove('globe-gallery-modal-open');
      if (window.lenis) window.lenis.start();
      closeTimeoutId = null;
    }, modalAnimMs);

    const renderer = getRenderer();
    const canvas = renderer && renderer.domElement;
    if (canvas) canvas.classList.remove('is-modal-active');
  }

  // Close via the button so Escape / pull-to-close report it.
  function clickClose() {
    if (closeBtn) closeBtn.click(); else close();
  }

  const TAP_KEEP_SEL = 'button, a, .globe-gallery-modal-info, .globe-gallery-modal-counter';
  function backdropTap(touch) {
    const rect = photoRectPx();
    if (!rect) return;
    const x = touch.clientX;
    const y = touch.clientY;
    if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) return;
    if (touch.target?.closest?.(TAP_KEEP_SEL)) return;
    clickClose();
  }

  function navigate(direction) {
    if (modalIdx < 0 || !modalCard) return;
    // Navigating while closing would flip CLOSING→OPEN and orphan the close animation, leaving
    // the card floating in modalScene.
    if (modalPhase === MODAL_PHASE.CLOSING) return;
    if (getCount() <= 1) return;
    const next = stepCard(modalIdx, direction);
    startDesktopNavTransition(next);
  }

  // Captured world transform → target near camera (open), or back to the live sphere slot
  // (close), which tracks the slot as the sphere keeps rotating.
  function updateAnimation(sphereRotActive, dtScale = 1) {
    if (modalCard && modalPhase) {
      const sphereGroup = getSphereGroup();
      const now = perfNow();
      // RM: aT=1 snaps the fly in one frame and collapses the warp bell curves.
      const aT = getReducedMotion()
        ? 1 : clamp01((now - modalAnimT0) / modalAnimMs);
      const aE = easeInOutCubic(aT);
      const tgtPos = scratchPos;
      const tgtQuat = scratchQuat;
      const tgtScale = scratchScale;

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
        // A nav cross-warp owns its own cards' uniforms.
        if (!dnNavActive) pushModalCoverUV(modalCard);

        // Start the fade once the card is 90% to target; skip at 1, navigate snaps.
        if (modalChromeFadeT < 1) {
          if (getReducedMotion()) {
            modalChromeFadeT = 1; // chrome appears instantly
          } else {
            if (aT >= 0.90 && modalChromeRevealT0 < 0) modalChromeRevealT0 = now;
            modalChromeFadeT = modalChromeRevealT0 >= 0
              ? clamp01((now - modalChromeRevealT0) / CHROME_REVEAL_DUR)
              : 0;
          }
        }
      } else if (modalPhase === MODAL_PHASE.CLOSING) {
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
        // Must match sphere-phase scale + facing tilt exactly, or the card jumps on the last
        // frame when snapToSphereSlot runs.
        tgtScale.set(modalCard.sphereScaleSX, modalCard.sphereScaleSY, 1);
        applySphereFacing(tgtQuat);

        modalCard.mesh.position.lerpVectors(modalCloseStartPos, tgtPos, aE);
        modalCard.mesh.quaternion.copy(modalCloseStartQuat).slerp(tgtQuat, aE);
        modalCard.mesh.scale.lerpVectors(modalCloseStartScale, tgtScale, aE);
        pushModalCoverUV(modalCard); // closes back down to the slot's crop, tracking the scale

        if (aT >= 1) {
          // Before restoring the basic material, else it ghosts later.
          resetModalMaterialUniforms(modalCard.modalMat, 1);
          if (modalCard.mesh.origMaterial) {
            modalCard.mesh.material = modalCard.mesh.origMaterial;
            modalCard.mesh.origMaterial = null;
          }
          // Drag rotation baked in, so no flash.
          sphereGroup.attach(modalCard.mesh);
          snapToSphereSlot(modalCard);
          modalCard.mesh.material.depthTest = true;
          modalCard.mesh.renderOrder = 0;
          if (modalCanvasEl) modalCanvasEl.style.display = 'none';
          releaseModalTexture();
          closeModalIdentity();
        }
      }

      // The position delta encodes velocity. Cleared to 0 once OPEN.
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

      // sin(aT·π) bell curve on open/close; drag owns it once OPEN.
      if (modalPhase === MODAL_PHASE.OPENING) {
        modalWarp = Math.sin(clamp01(aT) * Math.PI) * MODAL_WARP_OPEN;
      } else if (modalPhase === MODAL_PHASE.CLOSING) {
        modalWarp = Math.sin(clamp01(aT) * Math.PI) * MODAL_WARP_CLOSE;
      } else if (modalPhase === MODAL_PHASE.OPEN) {
        modalWarp *= MODAL_WARP_DECAY ** dtScale;
        if (modalWarp < 0.001) modalWarp = 0;
      }
      // updateDesktopNav drives both cards' uWarp directly.
      if (!dnNavActive) pushModalWarpUniforms();

      // Keep chrome locked to the card's projected position each frame.
      if (modalPhase === MODAL_PHASE.OPENING || modalPhase === MODAL_PHASE.OPEN) {
        revealModalChrome();
      }
    }
  }

  // Both cards' uWarp on a sin bell curve; opacity cross-fades.
  function updateDesktopNav() {
    if (dnNavActive) {
      const dnNow = perfNow();
      // RM: force completion.
      const dnT = getReducedMotion() ? 1 : clamp01((dnNow - dnNavT0) / DN_NAV_DUR);
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

  function render() {
    if (!(modalRenderer && modalScene && modalCard)) return;
    modalRenderer.render(modalScene, getCamera());
  }

  function resize(w, h) {
    if (!modalRenderer) return;
    const dpr = capDpr();
    if (dpr !== appliedModalDpr) {
      appliedModalDpr = dpr;
      modalRenderer.setPixelRatio(dpr);
    }
    modalRenderer.setSize(w, h);
    // Resize can change whether the description overflows.
    if (modalIdx >= 0) scheduleDescFade();
  }

  // Once per init.
  function setup() {
    const { W, H } = getViewport();

    modalCanvasEl = q('.globe-gallery-modal-canvas');
    if (modalCanvasEl) {
      const modalGlOpts = { canvas: modalCanvasEl, antialias: getAntialias(), alpha: true };
      modalRenderer = new THREE.WebGLRenderer(modalGlOpts);
      appliedModalDpr = capDpr();
      modalRenderer.setPixelRatio(appliedModalDpr);
      modalRenderer.setSize(W, H);
      modalRenderer.setClearColor(0x000000, 0);
      modalScene = new THREE.Scene();
    }

    modalEl = q('.globe-gallery-modal');
    if (!modalEl) return;
    const declaredMs = parseFloat(
      getComputedStyle(modalEl).getPropertyValue('--gg-modal-anim-ms'),
    );
    modalAnimMs = Number.isFinite(declaredMs) && declaredMs > 0 ? declaredMs : MODAL_ANIM_FALLBACK;
    modalStartPos = new THREE.Vector3();
    modalStartQuat = new THREE.Quaternion();
    modalStartScale = new THREE.Vector3();
    modalCloseStartPos = new THREE.Vector3();
    modalCloseStartQuat = new THREE.Quaternion();
    modalCloseStartScale = new THREE.Vector3();
    chromeEl = q('.globe-gallery-modal-chrome');
    chromeNodes = null;
    const evtRoot = chromeEl || modalEl;
    const alreadyWired = listenersWired;
    listenersWired = true;
    if (!alreadyWired) {
      closeBtn = evtRoot.querySelector('.globe-gallery-modal-close');
      // isTrusted is exactly viaPointer: the guard swallows the browser's synthetic click after
      // a touch pointerup; ours from clickClose() are not trusted.
      closeBtn.addEventListener('click', (e) => close(e.isTrusted));
      prevBtn = evtRoot.querySelector('.globe-gallery-modal-nav-prev');
      nextBtn = evtRoot.querySelector('.globe-gallery-modal-nav-next');
      prevBtn.addEventListener('click', () => { navigate(-1); });
      nextBtn.addEventListener('click', () => { navigate(1); });
      // Single-card gallery: nav is a no-op, so hide the arrows.
      if (getCount() <= 1) { prevBtn.hidden = true; nextBtn.hidden = true; }
      const descEl = evtRoot.querySelector('.globe-gallery-modal-description');
      if (descEl) descEl.addEventListener('scroll', () => updateDescFade(descEl), { passive: true });
      // preventDefault so the close animation plays instead of an instant close.
      if (chromeEl) {
        chromeEl.addEventListener('cancel', (e) => { e.preventDefault(); clickClose(); });
      }
    }

    if (alreadyWired) return;

    // Live 1:1 drag (CSS transform on the canvas) with rubber-band release. Horizontal =
    // swipe/navigate, vertical pull-down = close. Chrome stays put.
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

    // Follows POINTER type, not the width band, mirroring usesCylinderGeometry.
    const isTouchPrimary = () => !!window.matchMedia?.('(pointer: coarse)').matches;

    let clickStartX = 0;
    let clickStartY = 0;
    let clickStartTarget = null;
    evtRoot.addEventListener('pointerdown', (e) => {
      clickStartX = e.clientX;
      clickStartY = e.clientY;
      clickStartTarget = e.target;
    });

    evtRoot.addEventListener('click', (e) => {
      if (isTouchPrimary()) return;
      if (modalIdx < 0) return;
      if (e.target !== clickStartTarget) return;
      if (Math.abs(e.clientX - clickStartX) > AXIS_LOCK_PX
        || Math.abs(e.clientY - clickStartY) > AXIS_LOCK_PX) return;
      backdropTap(e);
    });

    // Attach to the dialog, not modalEl — modalEl goes inert under showModal().
    evtRoot.addEventListener('touchstart', (e) => {
      if (!isTouchPrimary()) return;
      if (modalIdx < 0) return;
      if (e.touches.length !== 1) return;
      if (!modalCanvasEl) return;
      // Description owns its own touch scroll.
      if (e.target?.closest?.('.globe-gallery-modal-description')) return;
      swStartX = e.touches[0].clientX; swLastX = swStartX;
      swStartY = e.touches[0].clientY; swLastY = swStartY;
      swLastT = Date.now();
      swActive = true;
      swAxis = null;
      swVelX = 0;
      swVelY = 0;
      touchToWarpUV(swStartX, swStartY, modalWarpCenter);
      modalCanvasEl.style.transition = 'none';
    }, { passive: true });

    evtRoot.addEventListener('touchmove', (e) => {
      if (!swActive || e.touches.length !== 1) return;
      const x = e.touches[0].clientX;
      const y = e.touches[0].clientY;
      const dx = x - swStartX;
      const dy = y - swStartY;

      // First significant move picks horizontal swipe vs vertical pull.
      if (swAxis === null) {
        if (Math.abs(dx) < AXIS_LOCK_PX && Math.abs(dy) < AXIS_LOCK_PX) return;
        swAxis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
      }

      const now = Date.now();
      const dt = now - swLastT;
      if (dt > 0) {
        swVelX = (x - swLastX) / dt;
        swVelY = (y - swLastY) / dt;
      }
      swLastX = x; swLastY = y; swLastT = now;

      const { W: vpW, H: vpH } = getViewport();
      if (swAxis === 'x') {
        // Warp-only preview, no slide. Release commits the same cross-warp as the nav buttons.
        modalWarp = Math.min(1, Math.abs(dx) / (vpW * 0.30)) * MODAL_WARP_SWIPE;
      } else {
        const pullY = Math.max(0, dy);
        const scale = Math.max(PULL_SCALE_MIN, 1 - pullY / PULL_SCALE_DAMPING);
        modalCanvasEl.style.transform = `translate3d(0, ${pullY}px, 0) scale(${scale.toFixed(3)})`;
        modalWarp = Math.min(1, pullY / (vpH * 0.20)) * MODAL_WARP_PULL;
      }
      pushModalWarpUniforms();
    }, { passive: true });

    evtRoot.addEventListener('touchend', (e) => {
      if (!swActive) return;
      swActive = false;
      if (!modalCanvasEl || swAxis === null) {
        // No axis lock means the finger never travelled AXIS_LOCK_PX: a tap, not a gesture.
        if (swAxis === null && e.changedTouches.length === 1) backdropTap(e.changedTouches[0]);
        swAxis = null;
        return;
      }
      if (e.changedTouches.length !== 1) return;
      const dx = e.changedTouches[0].clientX - swStartX;
      const dy = e.changedTouches[0].clientY - swStartY;
      const { W: vpW, H: vpH } = getViewport();

      if (swAxis === 'x') {
        const commit = Math.abs(dx) > vpW * COMMIT_DIST_X_FRAC
                  || Math.abs(swVelX) > COMMIT_VEL_X;
        // Commit clicks the matching nav button, so that path reports.
        if (commit) {
          // Else it bleeds onto the new card once updateAnimation resumes pushing modalWarp.
          modalWarp = 0;
          const dir = (dx < 0 ? 1 : -1) * (isRtl() ? -1 : 1);
          const btn = dir < 0 ? prevBtn : nextBtn;
          // hidden on a single-card gallery — clicking would report a no-op nav.
          if (btn?.hidden === false) btn.click(); else navigate(dir);
        }
      } else {
        const pullCommit = dy > vpH * COMMIT_DIST_Y_FRAC
                      || swVelY > COMMIT_VEL_Y;
        if (pullCommit) {
          // So the fly-back starts from where the user dragged, not centre.
          if (modalCard) {
            const pxPerWorld = pxPerWorldAt(MODAL_CAM_DIST, vpH);
            const pulledY = Math.max(0, dy);
            const gestureScale = Math.max(PULL_SCALE_MIN, 1 - pulledY / PULL_SCALE_DAMPING);
            modalCard.mesh.position.y -= pulledY / pxPerWorld; // CSS down → world Y negative
            modalCard.mesh.scale.multiplyScalar(gestureScale);
          }
          modalCanvasEl.style.transition = 'none';
          modalCanvasEl.style.transform = '';
          clickClose();
        } else {
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

  // Synchronous, so a breakpoint re-init on the same DOM can't leave it stuck open. q() because
  // core destroy() nulls the renderer first.
  function resetModalDom() {
    if (modalEl) {
      modalEl.classList.remove('is-visible', 'is-open');
      modalEl.setAttribute('aria-hidden', 'true');
    }
    if (chromeEl) {
      chromeEl.classList.remove('is-open');
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
