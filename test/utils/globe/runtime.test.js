import { expect } from '@esm-bundle/chai';
import {
  MAX_VEL,
  createOrientationState,
  createScrollReader,
  stepOrientation,
} from '../../../libs/utils/globe/runtime.js';

const LIVE = {
  dtScale: 1,
  interactive: true,
  orientReset: false,
  frozen: false,
  browsing: false,
  spinEnabled: false,
  quoteOwnsCards: false,
  restK: 1,
};

const step = (state, input = {}) => stepOrientation(state, { ...LIVE, ...input });

describe('stepOrientation', () => {
  let state;

  beforeEach(() => {
    state = createOrientationState();
  });

  it('applies held travel under one frame\'s limit exactly', () => {
    state.drag.isDragging = true;
    state.drag.pendingX = MAX_VEL / 2;
    state.drag.pendingY = -MAX_VEL / 4;
    expect(step(state)).to.be.true;
    expect(state.orient.y).to.equal(MAX_VEL / 2);
    expect(state.orient.x).to.equal(-MAX_VEL / 4);
    expect(state.drag.pendingX).to.equal(0);
  });

  it('caps held travel past the limit and banks the rest', () => {
    state.drag.isDragging = true;
    state.drag.pendingX = MAX_VEL * 10;
    step(state);
    expect(state.orient.y).to.equal(MAX_VEL);
    expect(state.drag.pendingX).to.be.closeTo(MAX_VEL * 9, 1e-12);
  });

  it('negates travel once the camera is inside the sphere', () => {
    state.inside = true;
    state.drag.isDragging = true;
    state.drag.pendingX = MAX_VEL / 2;
    step(state);
    expect(state.orient.y).to.equal(-MAX_VEL / 2);
  });

  it('coasts on released velocity, which decays', () => {
    state.drag.velX = MAX_VEL;
    step(state);
    expect(state.orient.y).to.be.greaterThan(0);
    expect(state.drag.velX).to.be.lessThan(MAX_VEL);
  });

  it('spins only when enabled, interactive and not browsing', () => {
    step(state, { spinEnabled: true, interactive: false });
    step(state, { spinEnabled: true, browsing: true });
    step(state);
    expect(state.orient.y).to.equal(0);
    step(state, { spinEnabled: true });
    expect(state.orient.y).to.be.greaterThan(0);
  });

  it('holds its rotation while frozen and drops banked travel', () => {
    state.orient.y = 0.5;
    state.drag.isDragging = true;
    state.drag.pendingX = MAX_VEL;
    step(state, { frozen: true, spinEnabled: true });
    expect(state.orient.y).to.equal(0.5);
    expect(state.drag.pendingX).to.equal(0);
  });

  it('runs a nudge to its target and ends it', () => {
    Object.assign(state.nudge, { active: true, kind: 'rotate', targetY: 1, frames: 2 });
    step(state);
    expect(state.nudge.active).to.be.true;
    step(state);
    expect(state.orient.y).to.equal(1);
    expect(state.nudge.active).to.be.false;
  });

  it('cancels only browse\'s own nudge when browsing ends', () => {
    state.wasBrowsing = true;
    Object.assign(state.nudge, { active: true, kind: 'rotate', targetY: 1, frames: 10 });
    step(state);
    expect(state.nudge.active).to.be.true;

    state.wasBrowsing = true;
    state.nudge.kind = 'browse';
    step(state);
    expect(state.nudge.active).to.be.false;
  });

  it('allows a wider pitch while browsing and glides back to the resting cap', () => {
    state.orient.x = 1.4;
    step(state, { browsing: true });
    expect(state.orient.x).to.equal(1.4);
    step(state);
    expect(state.orient.x).to.equal(1.4);
    for (let i = 0; i < 100; i += 1) step(state);
    expect(state.orient.x).to.be.closeTo(Math.PI / 3, 1e-9);
  });

  it('gives way to the pull quote without moving', () => {
    state.orient.y = 0.5;
    state.warp = 0.1;
    state.drag.velX = MAX_VEL;
    state.nudge.active = true;
    expect(step(state, { quoteOwnsCards: true, spinEnabled: true })).to.be.true;
    expect(state.orient.y).to.equal(0.5);
    expect(state.warp).to.equal(0);
    expect(state.drag.velX).to.equal(0);
    expect(state.nudge.active).to.be.false;
  });

  it('resets orientation and inertia when the timeline asks', () => {
    state.orient.y = 0.5;
    state.drag.velX = MAX_VEL;
    expect(step(state, { orientReset: true })).to.be.false;
    expect(state.orient).to.deep.equal({ x: 0, y: 0, z: 0 });
    expect(state.drag.velX).to.equal(0);
  });

  it('warps while dragging and scales the warp by the hand-off', () => {
    state.drag.isDragging = true;
    for (let i = 0; i < 60; i += 1) step(state);
    const full = state.warp;
    expect(full).to.be.greaterThan(0);
    for (let i = 0; i < 60; i += 1) step(state, { restK: 0.5 });
    expect(state.warp).to.be.closeTo(full / 2, 1e-3);
    for (let i = 0; i < 60; i += 1) step(state, { restK: 0 });
    expect(state.warp).to.equal(0);
  });
});

describe('createScrollReader', () => {
  const scrollY = Object.getOwnPropertyDescriptor(window, 'scrollY');
  let y;

  beforeEach(() => {
    y = 1000;
    Object.defineProperty(window, 'scrollY', { configurable: true, get: () => y });
  });

  afterEach(() => {
    Object.defineProperty(window, 'scrollY', scrollY);
    delete window.lenis;
  });

  it('passes a large jump through and eases a small step', () => {
    const read = createScrollReader();
    y = 2000;
    expect(read()).to.equal(2000);
    y = 2004;
    const eased = read();
    expect(eased).to.be.greaterThan(2000);
    expect(eased).to.be.lessThan(2004);
  });

  it('uses Lenis only while it agrees with the document', () => {
    const read = createScrollReader();
    window.lenis = { isSmooth: true, animatedScroll: 1001.5 };
    expect(read()).to.equal(1001.5);
    window.lenis.animatedScroll = 1500;
    expect(read()).to.not.equal(1500);
    window.lenis.animatedScroll = NaN;
    expect(read()).to.be.a('number').and.not.NaN;
  });

  it('keeps separate state per reader', () => {
    const first = createScrollReader();
    y = 2000;
    const second = createScrollReader();
    expect(second()).to.equal(2000);
    y = 2004;
    first();
    expect(second()).to.be.lessThan(2004);
  });
});
