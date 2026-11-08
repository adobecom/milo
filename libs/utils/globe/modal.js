import * as THREE from '../../deps/three.js';
import {
  easeInOutCubic, easeOutCubic, clamp01, cssNumber, decayToZero, coverFit, pxPerWorldAt, capDpr,
  CARD_ASPECT, isCoarsePointer, isRtl, planeAspect,
} from './core.js';
import { createModalMaterial } from './gl.js';
import { setLang } from './authoring.js';

// Modal lifecycle phases. CLOSED is null so `if (modalPhase)` reads as "modal live".
const MODAL_PHASE = Object.freeze({
  CLOSED: null,
  OPENING: 'opening',
  OPEN: 'open',
  CLOSING: 'closing',
});
const MODAL_CAM_DIST = 16.4;
const MODAL_RADIUS_PX = 16;
const MODAL_ANIM_FALLBACK_MS = 350;
const MODAL_ANIM_VAR = '--globe-modal-anim-ms';
const CHROME_REVEAL_MS = 300;
const MODAL_WARP_FLY = 0.30;
const MODAL_WARP_PULL = 0.40;
const MODAL_WARP_SWIPE = 0.25;
const MODAL_WARP_DECAY = 0.85;
const CROSS_NAV_MS = 500;
const CROSS_NAV_WARP = 0.40;
const DESKTOP_IMG_MARGIN = 12;

const AXIS_LOCK_PX = 10;
const COMMIT_DIST_X_FRAC = 0.25;
const COMMIT_DIST_Y_FRAC = 0.18;
const COMMIT_VEL_X = 0.4;
const COMMIT_VEL_Y = 0.6;
const PULL_SCALE_DAMPING = 1600;
const PULL_SCALE_MIN = 0.80;
const TAP_KEEP_SEL = 'button, a, .globe-modal-info, .globe-modal-counter';
const CHROME_FADE_SEL = [
  '.globe-modal-info', '.globe-modal-close', '.globe-modal-nav', '.globe-modal-counter',
].join();

const pad = (n) => String(n).padStart(2, '0');

const pullScale = (pullY) => Math.max(PULL_SCALE_MIN, 1 - pullY / PULL_SCALE_DAMPING);

export default function createGlobeModal(ctx, {
  renderContent,
  hoistToBody = false,
  bodyOpenClass = false,
  tracksCanvasTop = false,
  cardLabel,
  loadModalUpgrade,
  requestNavNudge,
  restoreFocusOnClose,
}) {
  const { q } = ctx;
  const canvasTop = () => (tracksCanvasTop
    ? ctx.renderer.domElement.getBoundingClientRect().top : 0);
  let modalRenderer = null;
  let appliedModalDpr = 0;
  let modalScene = null;
  let modalCanvasEl = null;
  let modalEl = null;
  let chromeEl = null;

  let modalIdx = -1;
  let modalCard = null;
  let modalPhase = MODAL_PHASE.CLOSED;
  // Pending Image + owned CanvasTexture; 1 resident at a time.
  let modalTexImg = null;
  let modalTexOwned = null;
  let modalTexCard = null;
  let modalAnimT0 = 0;
  let modalAnimMs = MODAL_ANIM_FALLBACK_MS;
  const newPose = () => ({
    pos: new THREE.Vector3(),
    quat: new THREE.Quaternion(),
    scale: new THREE.Vector3(),
  });
  const openFrom = newPose();
  const closeFrom = newPose();
  const target = newPose();
  const coverScratch = {};
  let chromeNodes = null;

  let modalChromeRevealT0 = -1;
  let modalChromeFadeT = 0;

  // Suppresses the synthetic click after touch pointerup, which would self-close.
  let modalOpenedAt = 0;
  let modalCanvasTopPx = 0;
  // open() cancels a stale one so it can't yank the new modal's state.
  let closeTimeoutId = null;
  // Wired once — the DOM persists across re-inits, so re-adding would stack them.
  let listenersWired = false;
  // Escape and touch gestures click these so those paths report.
  let prevBtn = null;
  let nextBtn = null;
  let closeBtn = null;

  let modalWarp = 0;
  const modalWarpCenter = new THREE.Vector2(0.5, 0.5);

  let crossNav = null;

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

  const getModalIdx = () => modalIdx;

  function capturePose(mesh, pose) {
    mesh.updateWorldMatrix(true, false);
    mesh.getWorldPosition(pose.pos);
    mesh.getWorldQuaternion(pose.quat);
    mesh.getWorldScale(pose.scale);
  }

  function setPose(mesh, pose) {
    mesh.position.copy(pose.pos);
    mesh.quaternion.copy(pose.quat);
    mesh.scale.copy(pose.scale);
  }

  function blendPose(mesh, from, to, t) {
    mesh.position.lerpVectors(from.pos, to.pos, t);
    mesh.quaternion.copy(from.quat).slerp(to.quat, t);
    mesh.scale.lerpVectors(from.scale, to.scale, t);
  }

  function desktopCardHPx(uAspect) {
    const { W, H } = ctx;
    return Math.min(H - 2 * DESKTOP_IMG_MARGIN, (W - 2 * DESKTOP_IMG_MARGIN) / uAspect);
  }

  // The uRadius fraction that holds MODAL_RADIUS_PX constant.
  const modalRadiusFrac = (uAspect) => (
    ctx.bp.name === 'sm' ? 0 : MODAL_RADIUS_PX / desktopCardHPx(uAspect)
  );

  // The DISPLAYED texture's aspect, else the base texture's.
  function modalUAspect(card) {
    return card?.modalAspect || card?.srcAspect || CARD_ASPECT;
  }

  // Active modal card or a swipe-neighbour in modalScene; the runtime loop skips these.
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
      const { mesh, modalMat } = modalTexCard;
      modalMat.uniforms.map.value = (mesh.origMaterial || mesh.material).map;
      modalTexCard.modalAspect = 0;
      modalTexOwned.dispose();
      modalTexOwned = null;
    }
    modalTexCard = null;
  }

  function getModalMaterial(card) {
    const aspect = modalUAspect(card);
    card.modalMat ||= createModalMaterial({ texture: card.mesh.material.map, aspect });
    const u = card.modalMat.uniforms;
    // In case a prior open left a since-disposed hi-res texture.
    u.map.value = card.mesh.material.map;
    u.uAspect.value = aspect;
    u.uRadius.value = modalRadiusFrac(aspect);
    return card.modalMat;
  }

  // ACTIVE modal card only, not swipe-neighbours.
  function requestModalUpgrade(card, idx) {
    releaseModalTexture();
    if (!loadModalUpgrade) return;
    const img = loadModalUpgrade(idx, (tex) => {
      const current = modalTexImg === img;
      if (current) modalTexImg = null;
      // The modal may have closed or navigated away before the decode finished.
      if (!current || modalCard !== card || modalPhase === MODAL_PHASE.CLOSED) {
        tex.dispose();
        return;
      }
      modalTexOwned = tex;
      modalTexCard = card;
      card.modalMat.uniforms.map.value = tex;
      if (tex.image?.width && tex.image.height) {
        card.modalAspect = tex.image.width / tex.image.height;
      }
    }, () => { if (modalTexImg === img) modalTexImg = null; });
    modalTexImg = img;
  }

  // A stale mid-fade value would ghost otherwise. uWarpCenter is left to the callers.
  function resetModalMaterialUniforms(material, opacity) {
    const u = material.uniforms;
    u.uOpacity.value = opacity;
    u.uWarp.value = 0;
    u.uMotionDir.value.set(0, 0);
    u.uRepeat.value.set(1, 1);
    u.uOffset.value.set(0, 0);
  }

  // Crop to the aspect the plane is drawn at THIS frame. Call after the frame's scale write.
  function pushModalCoverUV(card) {
    const u = card.mesh.material.uniforms;
    const c = coverFit(modalUAspect(card), planeAspect(card.mesh.scale), coverScratch);
    u.uRepeat.value.set(c.rx, c.ry);
    u.uOffset.value.set(c.ox, c.oy);
  }

  function touchToWarpUV(clientX, clientY, out) {
    const { W, H } = ctx;
    out.set(clamp01(clientX / W), clamp01(1 - clientY / H));
  }

  function pushModalWarpUniforms() {
    if (!modalCard) return;
    const u = modalCard.mesh.material.uniforms;
    u.uWarp.value = modalWarp;
    u.uWarpCenter.value.copy(modalWarpCenter);
  }

  function shiftForCanvasOffset(pos) {
    if (!modalCanvasTopPx) return;
    const depth = ctx.camera.position.z - pos.z;
    if (depth > 0.01) pos.y -= modalCanvasTopPx / pxPerWorldAt(depth, ctx.H);
  }

  function skewOffsetPx() {
    const { view } = ctx.camera;
    return view?.enabled ? -view.offsetY : 0;
  }

  // Visible photo contain-fit to the viewport, native aspect kept. Recomputed per-frame.
  function computeModalTarget(out, card = modalCard) {
    const { W, H } = ctx;
    const pxPerWorld = pxPerWorldAt(MODAL_CAM_DIST, H);
    const uAspect = modalUAspect(card);
    const isMobile = ctx.bp.name === 'sm';
    const cardHPx = isMobile ? Math.min(W / uAspect, H) : desktopCardHPx(uAspect);
    const topPx = isMobile ? H / 2 - cardHPx / 2 : 0;
    const scaleY = cardHPx / (ctx.bp.CARD_H_SPHERE * pxPerWorld);
    out.pos.set(0, (topPx + skewOffsetPx()) / pxPerWorld, ctx.camera.position.z - MODAL_CAM_DIST);
    // uRadius tracks the fit and uAspect changes when the hi-res texture decodes mid-flight,
    // so both are re-pushed every frame.
    if (card?.modalMat) {
      card.modalMat.uniforms.uAspect.value = uAspect;
      card.modalMat.uniforms.uRadius.value = modalRadiusFrac(uAspect);
    }
    out.quat.identity();
    out.scale.set((scaleY * uAspect) / CARD_ASPECT, scaleY, 1);
  }

  function photoRectPx() {
    if (!modalCard || modalPhase !== MODAL_PHASE.OPEN) return null;
    const { W, H } = ctx;
    const { CARD_W_SPHERE: cardW, CARD_H_SPHERE: cardH } = ctx.bp;
    const pxPerWorld = pxPerWorldAt(MODAL_CAM_DIST, H);
    const { position, scale } = modalCard.mesh;
    const halfW = 0.5 * cardW * scale.x * pxPerWorld;
    const halfH = 0.5 * cardH * scale.y * pxPerWorld;
    const cx = W / 2 + position.x * pxPerWorld;
    const cy = H / 2 - position.y * pxPerWorld;
    return { left: cx - halfW, right: cx + halfW, top: cy - halfH, bottom: cy + halfH };
  }

  // Reveal fade only (opacity + an 8px slide-up). Placement is pure CSS.
  function revealModalChrome() {
    chromeNodes ||= { els: [...chromeEl.querySelectorAll(CHROME_FADE_SEL)] };
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
      const base = el.classList.contains('globe-modal-counter') ? 'translateX(-50%)' : '';
      el.style.transform = settled ? '' : `${base}${shift}`.trim();
      el.style.transition = settled ? '' : 'none';
    });
  }

  function updateDescFade(descEl) {
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
    const descEl = q('.globe-modal-description');
    if (descEl) requestAnimationFrame(() => { if (modalIdx >= 0) updateDescFade(descEl); });
  }

  function announce(parts = []) {
    const el = chromeEl.querySelector('.globe-modal-announce');
    el.replaceChildren(...parts.filter(([t]) => t).flatMap(([t, lang], n) => {
      const span = document.createElement('span');
      span.textContent = t;
      setLang(span, lang);
      return n ? ['. ', span] : [span];
    }));
  }

  function populateModal(i, speak) {
    const meta = ctx.cardMeta(i);
    // Text alternative for the WebGL photo; there is no src, the photo is the canvas.
    const imgEl = chromeEl.querySelector('.globe-modal-image');
    if (meta.alt) {
      imgEl.setAttribute('aria-label', meta.alt);
      setLang(imgEl, meta.lang);
      imgEl.removeAttribute('aria-hidden');
    } else {
      imgEl.removeAttribute('aria-label');
      imgEl.removeAttribute('lang');
      imgEl.setAttribute('aria-hidden', 'true');
    }
    const { descEl, speech } = renderContent(chromeEl, meta);
    const counterEl = chromeEl.querySelector('.globe-modal-counter');
    counterEl.textContent = `${pad(ctx.authoredNo(i))} / ${pad(ctx.count)}`;
    const position = cardLabel(ctx.authoredNo(i), ctx.count);
    chromeEl.querySelectorAll('.globe-modal-position').forEach((el) => {
      el.textContent = position;
    });
    announce(speak ? [...speech, [position]] : []);
    descEl.scrollTop = 0;
    scheduleDescFade();
  }

  function takeIntoModal(card, idx, opacity) {
    card.mesh.origMaterial = card.mesh.material;
    card.mesh.material = getModalMaterial(card);
    requestModalUpgrade(card, idx);
    resetModalMaterialUniforms(card.mesh.material, opacity);
  }

  // Uniforms reset before the card material comes back, else it ghosts later. Drag rotation is
  // baked into the slot, so no flash.
  function returnCardToSphere(card) {
    resetModalMaterialUniforms(card.modalMat, 1);
    if (card.mesh.origMaterial) {
      card.mesh.material = card.mesh.origMaterial;
      card.mesh.origMaterial = null;
    }
    ctx.sphereGroup.attach(card.mesh);
    ctx.field.snapCardToSphereSlot(card);
    card.mesh.renderOrder = 0;
  }

  function finishCrossNav() {
    if (!crossNav) return;
    const { oldCard, newCard } = crossNav;
    returnCardToSphere(oldCard);
    resetModalMaterialUniforms(newCard.mesh.material, 1);
    newCard.mesh.renderOrder = 0;
    crossNav = null;
  }

  // Old card warps + fades out, new warps + fades in at the same screen position; renderOrder
  // controls draw order during the blend.
  function startCrossNav(newIdx) {
    const oldCard = modalCard;
    const newCard = ctx.cards[newIdx];
    if (!oldCard || !newCard || !modalScene) return;

    // Finalize any in-flight transition first, or the old-old card leaks.
    finishCrossNav();

    modalScene.attach(newCard.mesh);
    newCard.mesh.visible = true;
    takeIntoModal(newCard, newIdx, 0);
    newCard.mesh.material.uniforms.uWarpCenter.value.set(0.5, 0.5);
    newCard.mesh.renderOrder = 1;

    computeModalTarget(target, newCard);
    setPose(newCard.mesh, target);
    pushModalCoverUV(newCard);

    oldCard.mesh.material.uniforms.uWarpCenter.value.set(0.5, 0.5);
    oldCard.mesh.renderOrder = 0;

    modalIdx = newIdx;
    modalCard = newCard;
    modalPhase = MODAL_PHASE.OPEN;
    populateModal(newIdx, true);
    requestNavNudge(newIdx);

    crossNav = { oldCard, newCard, t0: performance.now() };
  }

  function cancelPendingClose() {
    clearTimeout(closeTimeoutId);
    closeTimeoutId = null;
  }

  function setPageLocked(locked) {
    document.documentElement.classList.toggle('globe-modal-open', locked);
    if (bodyOpenClass) document.body.classList.toggle('globe-modal-open', locked);
    if (locked) window.lenis?.stop();
    else window.lenis?.start();
  }

  function ensureModalRenderer() {
    if (modalRenderer || !modalCanvasEl) return;
    const { W, H } = ctx;
    const modalGlOpts = { canvas: modalCanvasEl, antialias: ctx.bp.ANTIALIAS, alpha: true };
    modalRenderer = new THREE.WebGLRenderer(modalGlOpts);
    appliedModalDpr = capDpr();
    modalRenderer.setPixelRatio(appliedModalDpr);
    modalRenderer.setSize(W, H);
    modalRenderer.setClearColor(0x000000, 0);
    modalScene = new THREE.Scene();
  }

  function open(i, originX, originY) {
    const { cards } = ctx;
    if (!modalEl || !cards[i]) return;
    // So it can't strip the fresh modal's state.
    cancelPendingClose();
    ensureModalRenderer();
    modalCanvasTopPx = canvasTop();
    modalOpenedAt = performance.now();
    modalIdx = i;
    modalCard = cards[i];
    if (typeof originX === 'number' && typeof originY === 'number') {
      touchToWarpUV(originX, originY, modalWarpCenter);
    } else {
      modalWarpCenter.set(0.5, 0.5);
    }
    modalWarp = 0;
    populateModal(i);

    capturePose(modalCard.mesh, openFrom);
    shiftForCanvasOffset(openFrom.pos);

    (modalScene || ctx.scene).attach(modalCard.mesh);

    // Crisp corners at modal scale; alphaMap pixelates. A stale mid-fade would ghost. The crop
    // then comes from the mesh's live scale — the shape it had on the globe, mid-fold included.
    takeIntoModal(modalCard, i, 1);
    pushModalCoverUV(modalCard);

    modalCard.mesh.renderOrder = 0;
    if (modalCanvasEl) modalCanvasEl.style.display = 'block';

    modalPhase = MODAL_PHASE.OPENING;
    modalAnimT0 = performance.now();

    resetChromeReveal();

    modalEl.classList.add('is-visible');
    // Native dialog: focus trap, inert background, Escape, focus-restore.
    if (!chromeEl.open) {
      try { chromeEl.showModal(); } catch { /* already open / not connected; ignore */ }
    }
    revealModalChrome();
    requestAnimationFrame(() => {
      if (!modalPhase || modalPhase === MODAL_PHASE.CLOSING) return;
      modalEl.classList.add('is-open');
      chromeEl.classList.add('is-open');
    });
    setPageLocked(true);
  }

  function close(viaPointer) {
    // Only the synthetic click after touch pointerup. Escape / pull-to-close are deliberate and
    // must not be swallowed inside this window.
    if (viaPointer && performance.now() - modalOpenedAt < 200) return;
    if (!modalEl || modalIdx < 0 || !modalCard || modalPhase === MODAL_PHASE.CLOSING) return;

    const restoreIdx = modalIdx;

    finishCrossNav();

    capturePose(modalCard.mesh, closeFrom);

    modalCanvasTopPx = canvasTop();
    modalPhase = MODAL_PHASE.CLOSING;
    modalAnimT0 = performance.now();

    resetChromeReveal();

    modalEl.classList.remove('is-open');
    chromeEl.classList.remove('is-open');

    // Deferred until the close animation completes, else scrolling moves the slot the card is
    // flying back to. open() cancels this timeout if a new modal opens.
    closeTimeoutId = setTimeout(() => {
      modalEl.classList.remove('is-visible');
      // The native dialog restores opener focus; re-point to the last-viewed card so the
      // globe doesn't spin back. Synchronous, so no visible frame.
      if (chromeEl.open) chromeEl.close();
      restoreFocusOnClose?.(restoreIdx);
      setPageLocked(false);
      closeTimeoutId = null;
    }, modalAnimMs);
  }

  // Close via the button so Escape / pull-to-close report it.
  function clickClose() {
    closeBtn.click();
  }

  function backdropTap(touch) {
    const rect = photoRectPx();
    if (!rect) return;
    const { clientX: x, clientY: y } = touch;
    if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) return;
    if (touch.target?.closest?.(TAP_KEEP_SEL)) return;
    clickClose();
  }

  // Navigating while closing would flip CLOSING→OPEN and orphan the close animation, leaving the
  // card floating in modalScene.
  function navigate(direction) {
    if (modalIdx < 0 || !modalCard || modalPhase === MODAL_PHASE.CLOSING || ctx.count <= 1) return;
    startCrossNav(ctx.stepCard(modalIdx, direction));
  }

  // Captured world transform → target near camera (open), or back to the live sphere slot
  // (close), which tracks the slot as the sphere keeps rotating.
  function updateAnimation(sphereRotActive, dtScale = 1) {
    if (!modalCard || !modalPhase) return;
    const { mesh } = modalCard;
    const now = performance.now();
    // RM: aT=1 snaps the fly in one frame and collapses the warp bell curves.
    const aT = ctx.reducedMotion ? 1 : clamp01((now - modalAnimT0) / modalAnimMs);
    const aE = easeInOutCubic(aT);
    const prevX = mesh.position.x;
    const prevY = mesh.position.y;

    if (modalPhase === MODAL_PHASE.CLOSING) {
      const { sphereGroup } = ctx;
      // sphereGroup.rotation is identity, so apply the drag rotation manually.
      sphereGroup.updateMatrixWorld(true);
      ctx.field.slotPose(modalCard, sphereRotActive, target.pos, target.quat);
      target.pos.add(sphereGroup.position);
      shiftForCanvasOffset(target.pos);
      // Must match placeSphereCard's scale and tilt, or the card jumps on snapCardToSphereSlot.
      target.scale.set(modalCard.sphereScaleSX, modalCard.sphereScaleSY, 1);
      ctx.field.applySphereFacing(target.quat);

      blendPose(mesh, closeFrom, target, aE);
      pushModalCoverUV(modalCard);

      if (aT >= 1) {
        returnCardToSphere(modalCard);
        if (modalCanvasEl) modalCanvasEl.style.display = 'none';
        releaseModalTexture();
        closeModalIdentity();
      }
    } else {
      computeModalTarget(target);
      if (modalPhase === MODAL_PHASE.OPEN || aT >= 1) {
        setPose(mesh, target);
        modalPhase = MODAL_PHASE.OPEN;
      } else {
        blendPose(mesh, openFrom, target, aE);
      }
      // A nav cross-warp owns its own cards' uniforms.
      if (!crossNav) pushModalCoverUV(modalCard);

      // Start the fade once the card is 90% to target; skip at 1, navigate snaps.
      if (modalChromeFadeT < 1) {
        if (ctx.reducedMotion) {
          modalChromeFadeT = 1;
        } else {
          if (aT >= 0.90 && modalChromeRevealT0 < 0) modalChromeRevealT0 = now;
          modalChromeFadeT = modalChromeRevealT0 >= 0
            ? clamp01((now - modalChromeRevealT0) / CHROME_REVEAL_MS)
            : 0;
        }
      }
      revealModalChrome();
    }

    if (modalPhase === MODAL_PHASE.OPEN) {
      // Settled: no motion fringe, and the drag owns the warp.
      mesh.material.uniforms.uMotionDir.value.set(0, 0);
      modalWarp = decayToZero(modalWarp, MODAL_WARP_DECAY ** dtScale);
    } else if (modalPhase) {
      // In flight: the position delta encodes velocity; sin(aT·π) warp bell curve.
      ctx.field.applyMotionCA(mesh, mesh.position.x - prevX, mesh.position.y - prevY, 1.0);
      modalWarp = Math.sin(aT * Math.PI) * MODAL_WARP_FLY;
    }
    // updateCrossNav drives both cards' uWarp directly.
    if (!crossNav) pushModalWarpUniforms();
  }

  function fadeNavCard(card, warp, opacity) {
    const u = card.mesh.material.uniforms;
    u.uWarp.value = warp;
    u.uOpacity.value = opacity;
  }

  // Both cards' uWarp on a sin bell curve; opacity cross-fades.
  function updateCrossNav() {
    if (!crossNav) return;
    const t = ctx.reducedMotion ? 1 : clamp01((performance.now() - crossNav.t0) / CROSS_NAV_MS);
    if (t >= 1) {
      finishCrossNav();
      return;
    }
    const warp = Math.sin(t * Math.PI) * CROSS_NAV_WARP;
    const e = easeInOutCubic(t);
    fadeNavCard(crossNav.oldCard, warp, 1 - e);
    fadeNavCard(crossNav.newCard, warp, e);
  }

  function render() {
    if (modalRenderer && modalCard) modalRenderer.render(modalScene, ctx.camera);
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

  function resetCanvasTransform(transition = 'none') {
    Object.assign(modalCanvasEl.style, { transition, transform: '' });
  }

  const hoist = (el) => {
    if (hoistToBody && el && el.parentNode !== document.body) document.body.append(el);
  };

  function setup() {
    modalCanvasEl ||= q('.globe-modal-canvas');
    hoist(modalCanvasEl);
    modalEl ||= q('.globe-modal');
    if (!modalEl) return;
    const declaredMs = cssNumber(modalEl, MODAL_ANIM_VAR, 0);
    modalAnimMs = declaredMs > 0 ? declaredMs : MODAL_ANIM_FALLBACK_MS;
    hoist(modalEl);
    modalEl.style.setProperty(MODAL_ANIM_VAR, modalAnimMs);
    chromeEl ||= q('.globe-modal-chrome');
    chromeNodes = null;
    if (listenersWired) return;
    listenersWired = true;
    closeBtn = chromeEl.querySelector('.globe-modal-close');
    // viaPointer: the guard swallows the browser's synthetic click; clickClose()'s is untrusted.
    closeBtn.addEventListener('click', (e) => close(e.isTrusted));
    prevBtn = chromeEl.querySelector('.globe-modal-nav-prev');
    nextBtn = chromeEl.querySelector('.globe-modal-nav-next');
    prevBtn.addEventListener('click', () => { navigate(-1); });
    nextBtn.addEventListener('click', () => { navigate(1); });
    // Single-card gallery: nav is a no-op, so hide the arrows.
    [prevBtn, nextBtn].forEach((btn) => { btn.hidden = ctx.count <= 1; });
    const descEl = chromeEl.querySelector('.globe-modal-description');
    descEl?.addEventListener('scroll', () => updateDescFade(descEl), { passive: true });
    // preventDefault so the close animation plays instead of an instant close.
    chromeEl.addEventListener('cancel', (e) => {
      e.preventDefault();
      clickClose();
    });

    // Live 1:1 drag (CSS transform on the canvas) with rubber-band release. Horizontal =
    // swipe/navigate, vertical pull-down = close. Chrome stays put.
    const swipe = { active: false, axis: null };
    const springBack = () => resetCanvasTransform('transform 0.25s cubic-bezier(0.25, 0.1, 0.25, 1)');
    const endSwipe = () => {
      const { axis } = swipe;
      swipe.active = false;
      swipe.axis = null;
      return axis;
    };

    const click = { x: 0, y: 0, target: null };
    chromeEl.addEventListener('pointerdown', (e) => {
      Object.assign(click, { x: e.clientX, y: e.clientY, target: e.target });
    });

    chromeEl.addEventListener('click', (e) => {
      if (isCoarsePointer() || modalIdx < 0 || e.target !== click.target) return;
      if (Math.abs(e.clientX - click.x) > AXIS_LOCK_PX
        || Math.abs(e.clientY - click.y) > AXIS_LOCK_PX) return;
      backdropTap(e);
    });

    // Attach to the dialog, not modalEl — modalEl goes inert under showModal().
    chromeEl.addEventListener('touchstart', (e) => {
      if (!isCoarsePointer() || modalIdx < 0 || e.touches.length !== 1 || !modalCanvasEl) return;
      // Description owns its own touch scroll.
      if (e.target?.closest?.('.globe-modal-description')) return;
      const { clientX: x, clientY: y } = e.touches[0];
      Object.assign(swipe, {
        active: true,
        axis: null,
        startX: x,
        startY: y,
        lastX: x,
        lastY: y,
        lastT: performance.now(),
        velX: 0,
        velY: 0,
      });
      touchToWarpUV(x, y, modalWarpCenter);
      modalCanvasEl.style.transition = 'none';
    }, { passive: true });

    chromeEl.addEventListener('touchmove', (e) => {
      if (!swipe.active || e.touches.length !== 1) return;
      const { clientX: x, clientY: y } = e.touches[0];
      const dx = x - swipe.startX;
      const dy = y - swipe.startY;

      // First significant move picks horizontal swipe vs vertical pull.
      if (!swipe.axis) {
        if (Math.abs(dx) < AXIS_LOCK_PX && Math.abs(dy) < AXIS_LOCK_PX) return;
        swipe.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
      }

      const now = performance.now();
      const dt = now - swipe.lastT;
      if (dt > 0) {
        swipe.velX = (x - swipe.lastX) / dt;
        swipe.velY = (y - swipe.lastY) / dt;
      }
      Object.assign(swipe, { lastX: x, lastY: y, lastT: now });

      const { W, H } = ctx;
      if (swipe.axis === 'x') {
        // Warp-only preview, no slide. Release commits the same cross-warp as the nav buttons.
        modalWarp = Math.min(1, Math.abs(dx) / (W * 0.30)) * MODAL_WARP_SWIPE;
      } else {
        const pullY = Math.max(0, dy);
        modalCanvasEl.style.transform = `translate3d(0, ${pullY}px, 0) scale(${pullScale(pullY).toFixed(3)})`;
        modalWarp = Math.min(1, pullY / (H * 0.20)) * MODAL_WARP_PULL;
      }
      pushModalWarpUniforms();
    }, { passive: true });

    chromeEl.addEventListener('touchend', (e) => {
      if (!swipe.active) return;
      const axis = endSwipe();
      if (!axis) {
        // No axis lock means the finger never travelled AXIS_LOCK_PX: a tap, not a gesture.
        if (e.changedTouches.length === 1) backdropTap(e.changedTouches[0]);
        return;
      }
      if (e.changedTouches.length !== 1) {
        springBack();
        return;
      }
      const dx = e.changedTouches[0].clientX - swipe.startX;
      const dy = e.changedTouches[0].clientY - swipe.startY;
      const { W, H } = ctx;

      if (axis === 'x') {
        const commit = Math.abs(dx) > W * COMMIT_DIST_X_FRAC || Math.abs(swipe.velX) > COMMIT_VEL_X;
        // Commit clicks the matching nav button, so that path reports.
        if (commit) {
          // Else it bleeds onto the new card once updateAnimation resumes pushing modalWarp.
          modalWarp = 0;
          const dir = (dx < 0 ? 1 : -1) * (isRtl() ? -1 : 1);
          const btn = dir < 0 ? prevBtn : nextBtn;
          // hidden on a single-card gallery — clicking would report a no-op nav.
          if (btn.hidden) navigate(dir);
          else btn.click();
        }
      } else {
        const pullCommit = dy > H * COMMIT_DIST_Y_FRAC || swipe.velY > COMMIT_VEL_Y;
        if (pullCommit) {
          // So the fly-back starts from where the user dragged, not centre.
          if (modalCard) {
            const pxPerWorld = pxPerWorldAt(MODAL_CAM_DIST, H);
            const pulledY = Math.max(0, dy);
            modalCard.mesh.position.y -= pulledY / pxPerWorld; // CSS down → world Y negative
            modalCard.mesh.scale.multiplyScalar(pullScale(pulledY));
          }
          resetCanvasTransform();
          clickClose();
        } else {
          springBack();
        }
      }
    }, { passive: true });

    chromeEl.addEventListener('touchcancel', () => {
      if (!swipe.active) return;
      endSwipe();
      springBack();
    }, { passive: true });
  }

  // Synchronous, so a breakpoint re-init on the same DOM can't leave it stuck open.
  function resetModalDom() {
    modalEl?.classList.remove('is-visible', 'is-open');
    chromeEl?.classList.remove('is-open');
    if (chromeEl?.open) chromeEl.close();
    if (modalCanvasEl) {
      modalCanvasEl.style.display = 'none';
      resetCanvasTransform();
    }
    setPageLocked(false);
    resetChromeReveal();
  }

  function destroy(finalize) {
    cancelPendingClose();
    resetModalDom();
    releaseModalTexture();
    modalRenderer?.dispose();
    modalRenderer = null;
    modalScene = null;
    closeModalIdentity();
    crossNav = null;
    if (finalize) {
      modalCanvasEl?.remove();
      modalEl?.remove();
    }
  }

  return {
    setup,
    resize,
    render,
    updateAnimation,
    updateCrossNav,
    open,
    navigate,
    close,
    getModalIdx,
    isCardManaged,
    destroy,
  };
}
