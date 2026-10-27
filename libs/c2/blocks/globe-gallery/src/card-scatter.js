import * as THREE from '../../../../deps/three.js';
import { QUOTE_POINTS_VERT, QUOTE_POINTS_FRAG } from './shaders.js';

// The near-camera dissolve: a card the camera is about to pass breaks up into the same tiles as
// the quote's particles (QUOTE_POINTS_* in scatter mode); the whole card turns to dots at once,
// which burst outward together and crumble to nothing (all timing is in the shader). Every card
// shares one grid geometry; each dissolving card is one draw of it, with its live pose, texture
// and dissolve progress as uniforms, so it is a pure function of the card's state on that frame:
// spin, drag and scroll in either direction just re-evaluate it. See README (Near-camera dissolve).

export default function createCardScatter({ expand }) {
  const group = new THREE.Group();
  const shared = {
    uScatterExpand: { value: expand },
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

  // cols × rows tiles over a card. Rebuilt only when the grid changes (layout).
  function setGrid(cols, rows) {
    const key = `${cols}x${rows}`;
    if (key === gridKey) return;
    gridKey = key;
    const k = cols * rows;
    const uvs = new Float32Array(k * 2);
    const cells = new Float32Array(k * 2);
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        const j = r * cols + c;
        const u = (c + 0.5) / cols;
        const v = (r + 0.5) / rows;
        uvs.set([u, v], j * 2);
        cells.set([1 / cols, 1 / rows], j * 2);
      }
    }
    const next = new THREE.BufferGeometry();
    next.setAttribute('position', new THREE.BufferAttribute(new Float32Array(k * 3), 3));
    next.setAttribute('aUv', new THREE.BufferAttribute(uvs, 2));
    next.setAttribute('aCell', new THREE.BufferAttribute(cells, 2));
    next.setAttribute('aDstCol', new THREE.BufferAttribute(new Float32Array(k * 3), 3));
    next.setAttribute('aRand', new THREE.BufferAttribute(new Float32Array(k * 4), 4));
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

  // Compiles the particle program (the quote's too) up front, not on the first band frame.
  function warm(renderer, camera) {
    setGrid(1, 1);
    const { points } = slot(0);
    points.visible = true;
    renderer.compile(group, camera);
    points.visible = false;
  }

  return {
    object: group,
    warm,
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
