import * as THREE from '../../../../deps/three.js';
import { QUOTE_POINTS_VERT, QUOTE_POINTS_FRAG } from './shaders.js';
import { seededRandom } from './quote-particles.js';

// The near-camera dissolve: a card the camera is about to pass breaks up into the same tiles as
// the quote's particles (QUOTE_POINTS_* in scatter mode), rim first, and drifts out along the
// swirl flow to nothing. Every card shares one grid geometry; each dissolving card is one draw
// of it, with its live pose, texture and dissolve progress as uniforms, so it is a pure
// function of the card's state on that frame: spin, drag and scroll in either direction just
// re-evaluate it. See README (Near-camera dissolve).

const EDGE_LEAD = 0.75; // share of a tile's release set by its distance from the card's edge
const RELEASE_SPAN = 0.55; // every tile has left its card by this much of the dissolve
const SEED = 7;

export default function createCardScatter() {
  const group = new THREE.Group();
  const shared = {
    uP: { value: 0 },
    uView: { value: new THREE.Vector2(1, 1) },
    uDpr: { value: 1 },
    uDstSize: { value: 2 },
    uAlpha: { value: 1 },
    uZoomT: { value: new THREE.Vector2() },
    uCamZ: { value: new THREE.Vector2() },
  };
  let geo = null;
  let gridKey = '';
  const slots = []; // [{ points, mat }], grown on demand and reused
  let used = 0;

  // cols × rows tiles over a card, edge first. Rebuilt only when the grid changes (layout).
  function setGrid(cols, rows) {
    const key = `${cols}x${rows}`;
    if (key === gridKey) return;
    gridKey = key;
    const k = cols * rows;
    const rnd = seededRandom(SEED);
    const uvs = new Float32Array(k * 2);
    const cells = new Float32Array(k * 2);
    const rand = new Float32Array(k * 4);
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        const j = r * cols + c;
        const u = (c + 0.5) / cols;
        const v = (r + 0.5) / rows;
        uvs.set([u, v], j * 2);
        cells.set([1 / cols, 1 / rows], j * 2);
        const inner = Math.min(1, 2 * Math.min(u, 1 - u, v, 1 - v));
        rand[j * 4] = RELEASE_SPAN * (EDGE_LEAD * inner + (1 - EDGE_LEAD) * rnd());
      }
    }
    const next = new THREE.BufferGeometry();
    next.setAttribute('position', new THREE.BufferAttribute(new Float32Array(k * 3), 3));
    next.setAttribute('aUv', new THREE.BufferAttribute(uvs, 2));
    next.setAttribute('aCell', new THREE.BufferAttribute(cells, 2));
    next.setAttribute('aDstCol', new THREE.BufferAttribute(new Float32Array(k * 3), 3));
    next.setAttribute('aRand', new THREE.BufferAttribute(rand, 4));
    slots.forEach(({ points }) => { points.geometry = next; });
    if (geo) geo.dispose();
    geo = next;
  }

  function slot(i) {
    if (slots[i]) return slots[i];
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        ...shared,
        uMap: { value: null },
        uRepeat: { value: new THREE.Vector2(1, 1) },
        uOffset: { value: new THREE.Vector2() },
        uMirror: { value: 0 },
        uAspect: { value: 1 },
        uRadius: { value: 0 },
        uCardAlpha: { value: 1 },
        uOrigin: { value: new THREE.Vector3() },
        uAxisU: { value: new THREE.Vector3(1, 0, 0) },
        uAxisV: { value: new THREE.Vector3(0, -1, 0) },
        uScreenSrc: { value: 0 },
        uScatterP: { value: 0 },
      },
      vertexShader: QUOTE_POINTS_VERT,
      fragmentShader: QUOTE_POINTS_FRAG,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });
    const points = new THREE.Points(geo, mat);
    points.frustumCulled = false;
    group.add(points);
    slots[i] = { points, mat };
    return slots[i];
  }

  // cards: [{ d (0 → 1 dissolve), origin, axisU, axisV (live world; u right, v down), tex,
  // repeat, offset, mirror, aspect, radius, alpha, order }].
  function update(cards, { W, H, dpr }) {
    shared.uView.value.set(W, H);
    shared.uDpr.value = dpr;
    used = geo ? cards.length : 0;
    for (let i = 0; i < used; i += 1) {
      const c = cards[i];
      const { points, mat } = slot(i);
      const u = mat.uniforms;
      u.uMap.value = c.tex;
      u.uRepeat.value.copy(c.repeat);
      u.uOffset.value.copy(c.offset);
      u.uMirror.value = c.mirror ? 1 : 0;
      u.uAspect.value = c.aspect;
      u.uRadius.value = c.radius;
      u.uCardAlpha.value = c.alpha;
      u.uOrigin.value.copy(c.origin);
      u.uAxisU.value.copy(c.axisU);
      u.uAxisV.value.copy(c.axisV);
      u.uScatterP.value = c.d;
      points.renderOrder = c.order;
      points.visible = true;
    }
    for (let i = used; i < slots.length; i += 1) slots[i].points.visible = false;
  }

  return {
    object: group,
    setGrid,
    update,
    tileCount: () => (geo ? geo.attributes.aUv.count : 0),
    drawCount: () => used,
    dispose() {
      slots.forEach(({ points, mat }) => { group.remove(points); mat.dispose(); });
      slots.length = 0;
      if (geo) geo.dispose();
      geo = null;
      if (group.parent) group.parent.remove(group);
    },
  };
}
