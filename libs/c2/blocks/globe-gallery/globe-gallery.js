import * as THREE from '../../../deps/three.js';
import {
  parseAuthoredContent, renderModalContent, fetchFragmentCards, buildGlobeDom,
  optimizeImgUrl,
} from './src/authoring.js';
import {
  easeOutCubic, easeInOutCubic, lerpN, clamp01, TAN_HALF_FOV, CARD_ASPECT, seededRandom,
} from '../../../utils/globe/core.js';
import { CARD_ORDER_BASE, CA_ENABLED, HOVER_SCALE, initGlobeBlock } from '../../../utils/globe/runtime.js';
import * as TL from './src/timeline.js';
import {
  easeInOutQuint, buildArcCtx, getFanData, cssToWorld, rotateArcPoint, arcCamZ,
} from './src/timeline.js';

const BREAKPOINTS = {
  sm: {
    minWidth: 0,
    ARC_SPAN: 3.6,
    SPHERE_R: 18,
    CARD_H_SPHERE: 11.0, // PlaneGeometry base only; masonry sets the visible size
    CARD_W_ARC: 220,
    CAM_Z_SPHERE: 70,
    CAM_Z_END: -60,
    NEAR_FADE_START: 2.0,
    NEAR_FADE_END: 1.5,
    GRID_WINDOW_COLS: 3,
    GRID_ROWS: 8,
    CARD_FACE_CAMERA: 0,
    CARD_ROLL_JITTER: 0.18,
    ARC_DENSE_FRACTION: 0.5,
    CYL_COLS_FIT: 0.65,
    DRAG_GEARING: 0.53, // fraction of 1:1 surface tracking
    ENTRY_LEAD_VH: 0.55,
    ARC_RAMP_T: 0.20,
  },
  md: {
    minWidth: 768,
    ARC_SPAN: 4.50,
    SPHERE_R: 35,
    CARD_H_SPHERE: 10.5,
    CARD_W_ARC: 456,
    CAM_Z_SPHERE: 57,
    CAM_Z_END: -60,
    NEAR_FADE_START: 2.0,
    NEAR_FADE_END: 1.6,
    GRID_WINDOW_COLS: 9,
    GRID_ROWS: 5,
    CARD_FACE_CAMERA: 0, // 0 = radially outward (true sphere)
    CARD_ROLL_JITTER: 0.5, // per-card random roll: ±half this, in radians
    ARC_DENSE_FRACTION: 0.4, // share clustered into the off-screen arc flank
    DRAG_GEARING: 0.6, // fraction of 1:1 surface tracking
    ENTRY_LEAD_VH: 0.5,
    ARC_RAMP_T: 0.1,
  },
};

const ROLL_SEED = 'One day I will return to your side';
const PEEL_SEED = 'You Shall Not pass!';
const TILT_SEED = 'Git Gud!';

const GRID_GAP_RATIO = 0.5; // gap between cards = 0.5× card width
const ARC_DENSE_SPLIT = 0.50; // fanT boundary: low-i cards below it peel first

const CA_STRENGTH = 0.01; // radial UV shift per channel

const CARD_ORDER_HANDOVER_T = 0.5;

function createHooks(rt) {
  let cameraOrtho;
  let gridTilts = [];
  let arcCtx = null; // current arc context, rebuilt per frame in tick() via buildArcCtx

  const arcCopy = { el: null, opStr: '', transformStr: '' };

  const foldRotQuat = new THREE.Quaternion();
  const stageQuat = new THREE.Quaternion();
  const stageEuler = new THREE.Euler(0, 0, 0, 'XYZ');
  const tmpVec3 = new THREE.Vector3();
  const fanScratch = {};
  const wpScratch = {};
  const stageScratch = {};
  const entryScratch = {};
  const phase = { gpE: 0, fdE: 0 };

  function computeGridLayout() {
    if (rt.cards.length === 0) return;
    const { GRID_WINDOW_COLS, GRID_ROWS, CARD_W_SPHERE } = rt.bp;
    const gridCardW = (rt.bp.name === 'sm')
      ? rt.W / (GRID_WINDOW_COLS + (GRID_WINDOW_COLS - 1) * GRID_GAP_RATIO)
      : rt.W / GRID_WINDOW_COLS;
    const gridGap = gridCardW * GRID_GAP_RATIO;
    const gridCardH = gridCardW / CARD_ASPECT;
    const gridCols = Math.max(GRID_WINDOW_COLS, Math.ceil(rt.cards.length / GRID_ROWS));
    const colShift = Math.round((gridCols - GRID_WINDOW_COLS) / 2);
    const totalW = GRID_WINDOW_COLS * gridCardW + (GRID_WINDOW_COLS - 1) * gridGap;
    const totalH = GRID_ROWS * gridCardH + (GRID_ROWS - 1) * gridGap;
    const tiltEuler = new THREE.Euler(0, 0, 0);
    // Column-major: i=0 → lower-right, sweeping bottom-to-top then right-to-left.
    for (let i = 0; i < rt.cards.length; i += 1) {
      const card = rt.cards[i];
      const col = GRID_WINDOW_COLS - 1 - Math.floor(i / GRID_ROWS) + colShift;
      const row = GRID_ROWS - 1 - (i % GRID_ROWS);
      const gx = -totalW / 2 + col * (gridCardW + gridGap) + gridCardW / 2;
      const gy = totalH / 2 - row * (gridCardH + gridGap) - gridCardH / 2;
      const tilt = gridTilts[i] || 0;
      // Written through, not replaced — this reruns on every resize.
      card.gridPos.set(gx, gy, 0);
      card.gridScale = gridCardW / CARD_W_SPHERE;
      card.gridTilt = tilt;
      card.gridQuat.setFromEuler(tiltEuler.set(0, 0, tilt));
    }
  }

  // Cards not yet on the sphere subtract sphGroupZ. Must run at sphereFormT===0 too.
  function updateSphereGroupDepth(frame) {
    const { sphereFormT, scrollT } = frame;
    const { FOLD_SPHERE_DIST, CAM_Z_SPHERE } = rt.bp;
    const sphereFormT3 = sphereFormT * sphereFormT * sphereFormT;
    const foldSphDist = lerpN(FOLD_SPHERE_DIST, CAM_Z_SPHERE, sphereFormT3);
    // For the hint-text stage: its plane scale tracks the live camera↔sphere distance.
    frame.foldSphDist = foldSphDist;
    const sphGroupZ = scrollT === 0 ? (rt.camera.position.z - foldSphDist) : 0;
    rt.sphereGroup.position.z = sphGroupZ;
    return sphGroupZ;
  }

  function updateArcCopy(frame) {
    if (rt.reducedMotion || !arcCopy.el) return;
    const arcCopyInE = easeOutCubic(Math.min(1, frame.arcCopyEntryT / TL.ARC_COPY_IN_ENTRY_T));
    const arcCopyOutT = Math.max(0, Math.min(
      1,
      (frame.progress - TL.ARC_COPY_OUT_START) / (TL.ARC_COPY_OUT_END - TL.ARC_COPY_OUT_START),
    ));
    const arcCopyOutE = easeInOutCubic(arcCopyOutT);
    const arcCopyOp = arcCopyInE * (1 - arcCopyOutE);
    const arcCopySlide = 24 * (1 - arcCopyInE);
    const opStr = arcCopyOp.toFixed(3);
    const transformStr = `translateY(${arcCopySlide.toFixed(1)}px)`;
    if (opStr !== arcCopy.opStr) { arcCopy.el.style.opacity = opStr; arcCopy.opStr = opStr; }
    arcCopy.el.style.pointerEvents = arcCopyOp > 0 ? 'auto' : 'none';
    if (transformStr !== arcCopy.transformStr) {
      arcCopy.el.style.transform = transformStr;
      arcCopy.transformStr = transformStr;
    }
  }

  function placeFoldingCard(card, mesh, fdE, stage, prevMeshX, prevMeshY, frame) {
    const { sphereRotActive } = frame;
    mesh.visible = true;
    // Sphere endpoint is fully rotated; the lerp itself unwinds it.
    let sX; let sY; let sZ;
    if (sphereRotActive) {
      tmpVec3.copy(card.spherePos).applyQuaternion(rt.rotQuat);
      sX = tmpVec3.x; sY = tmpVec3.y; sZ = tmpVec3.z;
    } else {
      sX = card.spherePos.x; sY = card.spherePos.y; sZ = card.spherePos.z;
    }
    mesh.position.set(
      lerpN(stage.x, sX, fdE),
      lerpN(stage.y, sY, fdE),
      lerpN(stage.z, sZ, fdE),
    );
    // Hover lands before the fold ends, so scale for it here too or the card pops at fdE 1.
    // Both axes, so applyCardFit's aspect is unchanged.
    const hs = 1 + card.hoverT * HOVER_SCALE;
    mesh.scale.set(
      lerpN(stage.scale, card.sphereScaleSX, fdE) * hs,
      lerpN(stage.scale, card.sphereScaleSY, fdE) * hs,
      1,
    );
    rt.field.applyCardFit(mesh, card); // reads the scale set just above: fold framing stays exact
    // Slerp to the UPRIGHT grid quat, not the live peel spin, then reapply the residual peel
    // spin about local Z. Both are load-bearing.
    if (sphereRotActive) {
      foldRotQuat.copy(rt.rotQuat).multiply(card.sphereQuat);
      mesh.quaternion.slerpQuaternions(card.gridQuat, foldRotQuat, fdE);
    } else {
      mesh.quaternion.slerpQuaternions(card.gridQuat, card.sphereQuat, fdE);
    }
    const residualZ = stage.rotZ - card.gridTilt;
    if (residualZ !== 0) {
      stageQuat.setFromEuler(stageEuler.set(0, 0, residualZ));
      mesh.quaternion.multiply(stageQuat); // local-Z (in-plane) spin, post-multiply
    }
    // Blend by fdE so it lands continuous with placeSphereCard.
    rt.field.applyCardFacing(mesh, fdE);
    mesh.material.opacity = 1;
    rt.field.applyMotionCA(mesh, mesh.position.x - prevMeshX, mesh.position.y - prevMeshY);
  }

  function placeGridCard(card, mesh, prevMeshX, prevMeshY, frame) {
    const { sphGroupZ } = frame;
    mesh.visible = true;
    mesh.position.set(card.gridPos.x, card.gridPos.y, card.gridPos.z - sphGroupZ);
    mesh.scale.setScalar(card.gridScale);
    rt.field.applyCardFit(mesh, card, CARD_ASPECT);
    mesh.quaternion.copy(card.gridQuat);
    mesh.material.opacity = 1;
    rt.field.applyMotionCA(mesh, mesh.position.x - prevMeshX, mesh.position.y - prevMeshY);
  }

  // Transform on the arc→grid continuum at peel ease gpE (0 = arc, 1 = grid). Serves the
  // arc/peel render AND the origin of the fold lerp.
  function computeCardEntry(i, frame, out) {
    const { N_TOTAL, ARC_DENSE_COUNT } = rt.bp;
    const rawT = clamp01(i / Math.max(1, N_TOTAL - 1));
    const splitR = ARC_DENSE_COUNT / Math.max(1, N_TOTAL - 1);
    out.fanT = rawT < splitR
      ? (rawT / Math.max(0.001, splitR)) * ARC_DENSE_SPLIT
      : ARC_DENSE_SPLIT + ((rawT - splitR) / Math.max(0.001, 1 - splitR)) * (1 - ARC_DENSE_SPLIT);
    const delay = TL.ARC_ENTRY_STAGGER
      * Math.min(1, (1 - out.fanT) / (1 - ARC_DENSE_SPLIT));
    const span = Math.max(0.01, 1 - TL.ARC_ENTRY_STAGGER);
    const rotT = clamp01((frame.arcCopyEntryT - delay) / span);
    out.rot = (1 - easeInOutQuint(rotT)) * TL.ENTRY_ROT_MAX;
    return out;
  }

  function computeCardStage(card, i, gpE, frame, entry) {
    const { arcScale, sphGroupZ } = frame;
    const { fanT, rot: entryRot } = entry;
    const fan = getFanData(fanT, arcCtx, fanScratch);
    const wp = entryRot > 0.001
      ? rotateArcPoint(fan.px, fan.py, entryRot, arcCtx, rt.W, rt.H, wpScratch)
      : cssToWorld(fan.px, fan.py, rt.W, rt.H, wpScratch);
    const webglRot = -fan.cssRot - entryRot;

    // First peel frame's rotation, normalized within ±π of gridTilt. Direct z-angle lerp,
    // NOT slerp.
    if (gpE <= 0) {
      card.peelStartRot = null;
    } else if (card.peelStartRot == null) {
      let startRot = webglRot;
      while (startRot - card.gridTilt > Math.PI) startRot -= 2 * Math.PI;
      while (startRot - card.gridTilt < -Math.PI) startRot += 2 * Math.PI;
      card.peelStartRot = startRot;
    }

    stageScratch.x = lerpN(wp.x, card.gridPos.x, gpE);
    stageScratch.y = lerpN(wp.y, card.gridPos.y, gpE);
    stageScratch.z = lerpN(-sphGroupZ, card.gridPos.z - sphGroupZ, gpE);
    stageScratch.scale = lerpN(arcScale, card.gridScale, gpE);
    stageScratch.rotZ = card.peelStartRot == null
      ? webglRot
      : card.peelStartRot + (card.gridTilt - card.peelStartRot) * gpE;
    return stageScratch;
  }

  function placeArcCard(card, mesh, gpE, stage, prevMeshX, prevMeshY) {
    mesh.visible = true;
    rt.field.applyCardFit(mesh, card, CARD_ASPECT); // first phase a card renders in: must fit here
    mesh.position.set(stage.x, stage.y, stage.z);
    mesh.scale.setScalar(stage.scale);
    mesh.rotation.set(0, 0, stage.rotZ);
    mesh.material.opacity = 1;
    rt.field.applyMotionCA(mesh, mesh.position.x - prevMeshX, mesh.position.y - prevMeshY);
  }

  function applyCardOrder(card, mesh, i, frame) {
    if (frame.sphereFormT <= CARD_ORDER_HANDOVER_T) mesh.renderOrder = CARD_ORDER_BASE + i;
    else rt.field.applyDepthOrder(card, mesh, frame);
  }

  return {
    entryCamZ: () => arcCamZ(rt.H),
    viewOffsetY: ({ sphereFormT }) => (rt.navH / 2) * sphereFormT,
    browseScrollTop: () => (rt.reducedMotion
      ? rt.worldEl.getBoundingClientRect().top + window.scrollY
      : rt.blockDocTop + rt.formedScrollPx() * TL.BROWSE_VIEW_SCROLL_FRAC),
    // Ortho on the arc, perspective from the fold on.
    activeCamera: ({ sphereFormT }) => (sphereFormT === 0 ? cameraOrtho : rt.camera),
    fillFrameInput(input) {
      input.arcScale = rt.bp.CARD_W_ARC / rt.bp.CARD_W_SPHERE;
      input.entryLeadVh = rt.bp.ENTRY_LEAD_VH;
    },
    beforeBuild(canvas) {
      arcCopy.el = rt.q('.globe-arc-copy');
      if (rt.reducedMotion) rt.worldEl.before(arcCopy.el);
      else rt.worldEl.after(arcCopy.el);
      arcCopy.opStr = '';
      arcCopy.transformStr = '';

      // RM: canvas into normal flow so the globe scrolls away. Non-RM must restate `fixed` — the
      // only other place it is set is the inline style this would otherwise clear.
      canvas.style.position = rt.reducedMotion ? 'absolute' : 'fixed';
    },
    onCameraReady() {
      const { W, H } = rt;
      // Arc phase: flat 2D, 1 world unit = 1 CSS pixel.
      cameraOrtho = new THREE.OrthographicCamera(-W / 2, W / 2, H / 2, -H / 2, 1, 5000);
      cameraOrtho.position.set(0, 0, 100);
      cameraOrtho.lookAt(0, 0, 0);
    },
    onResize() {
      const { W, H } = rt;
      cameraOrtho.left = -W / 2;
      cameraOrtho.right = W / 2;
      cameraOrtho.top = H / 2;
      cameraOrtho.bottom = -H / 2;
      cameraOrtho.updateProjectionMatrix();
      computeGridLayout();
    },
    onCardsBuilt() {
      const { N_TOTAL } = rt.bp;
      const peelRandom = seededRandom(PEEL_SEED);
      rt.cards.forEach((card) => {
        card.gridPos = new THREE.Vector3();
        card.gridScale = 1;
        card.gridTilt = 0;
        card.gridQuat = new THREE.Quaternion();
        card.peelJitter = peelRandom();
        card.peelStartRot = null; // set on the first peel frame, cleared back at gpE 0
      });
      const tiltRandom = seededRandom(TILT_SEED);
      gridTilts = Array.from(
        { length: N_TOTAL },
        () => (tiltRandom() - 0.5) * 0.175, // ±5° in radians
      );
      computeGridLayout();
    },
    onDestroy() {
      cameraOrtho = null;
      if (arcCopy.el) arcCopy.el.style.cssText = '';
    },
    beforeFrame(frame) {
      arcCtx = buildArcCtx(frame.arcPanT, rt.W, rt.H, rt.bp.ARC_SPAN, rt.bp.ARC_RAMP_T);
    },
    beforeCards(frame) {
      frame.sphGroupZ = updateSphereGroupDepth(frame);
    },
    afterFrame: updateArcCopy,
    hintSphereDist: (frame) => frame.foldSphDist,
    cardProgress(card, i, frame) {
      const { progress, gridFormT, gpWin } = frame;
      const { N_TOTAL } = rt.bp;

      const baseDelay = (i / Math.max(1, N_TOTAL - 1)) * TL.GRID_PEEL_STAGGER;
      const jitter = (card.peelJitter - 0.5) * TL.GRID_PEEL_JITTER;
      const gpDelay = Math.max(0, Math.min(TL.GRID_PEEL_STAGGER, baseDelay + jitter));
      const gpLocalT = clamp01((gridFormT - gpDelay) / Math.max(0.01, gpWin));
      const gpE = easeOutCubic(gpLocalT);

      // Gated on the RAW peel localT, not the eased gpE.
      const foldStartProg = TL.cardFoldStartProgress(gpDelay);
      const fdLocalT = clamp01((progress - foldStartProg) / TL.PROGRESS_FOLD_DUR);
      const fdE = gpLocalT >= TL.FOLD_START_LOCAL_T ? easeInOutCubic(fdLocalT) : 0;

      computeCardEntry(i, frame, entryScratch);
      phase.gpE = gpE;
      phase.fdE = fdE;

      if (!CA_ENABLED) return 0;
      return Math.max(
        entryScratch.rot / TL.ENTRY_ROT_MAX,
        gpE * (1 - gpE) * 4,
        fdE * (1 - fdE) * 4,
      ) * CA_STRENGTH;
    },
    placeCard(card, mesh, i, frame) {
      const { gpE, fdE } = phase;

      mesh.material.uniforms.uReveal.value = card.revealT;
      mesh.material.uniforms.uContourFade.value = 1;
      mesh.material.uniforms.uDissolve.value = 1 - card.revealT;

      const prevMeshX = mesh.position.x;
      const prevMeshY = mesh.position.y;

      // Latest phase first. Sphere + settled-grid skip the stage compute.
      card.onSphere = fdE >= 1;
      if (fdE >= 1) {
        rt.field.placeSphereCard(card, mesh, frame);
      } else if (gpE >= 1 && fdE === 0) {
        placeGridCard(card, mesh, prevMeshX, prevMeshY, frame);
      } else {
        const stage = computeCardStage(card, i, gpE, frame, entryScratch);
        if (fdE > 0) placeFoldingCard(card, mesh, fdE, stage, prevMeshX, prevMeshY, frame);
        else placeArcCard(card, mesh, gpE, stage, prevMeshX, prevMeshY);
      }
      applyCardOrder(card, mesh, i, frame);
    },
  };
}

const SPEC = {
  name: 'globe-gallery',
  breakpoints: BREAKPOINTS,
  rollSeed: ROLL_SEED,
  timeline: TL,
  bpExtras: (cfg, nTotal) => ({
    ARC_SPAN: cfg.ARC_SPAN,
    CARD_W_ARC: cfg.CARD_W_ARC,
    // Sphere-camera distance at fold start → ~70% viewport height; lerps to CAM_Z_SPHERE.
    FOLD_SPHERE_DIST: Math.round(cfg.SPHERE_R / (0.35 * TAN_HALF_FOV)),
    GRID_WINDOW_COLS: cfg.GRID_WINDOW_COLS,
    GRID_ROWS: cfg.GRID_ROWS,
    ENTRY_LEAD_VH: cfg.ENTRY_LEAD_VH,
    ARC_RAMP_T: cfg.ARC_RAMP_T,
    // Clamped so the spread keeps ≥1 card.
    ARC_DENSE_COUNT: Math.min(
      Math.round(cfg.ARC_DENSE_FRACTION * nTotal),
      Math.max(0, nTotal - 1),
    ),
  }),
  pullQuote: { requireOnSphere: true, manageCanvas: true },
  modal: { bodyOpenClass: true, renderContent: renderModalContent },
  cardImageUrl: (meta, cap) => optimizeImgUrl(meta.img, cap, 'height'),
  modalImageUrl: (meta, cap) => optimizeImgUrl(meta.img, cap),
  createHooks,
  // Before buildGlobeDom() wipes the children.
  setup(el) {
    const {
      arcCopy, pullQuote, hintText, touchHint, instructions, labels, fragmentHref,
    } = parseAuthoredContent(el);
    const gid = buildGlobeDom(el, labels, { arcCopy, pullQuote, touchHint });
    return {
      hintText,
      instructions,
      labels,
      gid,
      async loadCards() {
        if (!fragmentHref) {
          window.lana?.log?.('globe-gallery: no fragment link authored', { tags: 'globe-gallery', severity: 'warn' });
          return null;
        }
        return fetchFragmentCards(fragmentHref);
      },
    };
  },
};

export default function init(el) {
  return initGlobeBlock(el, SPEC);
}
