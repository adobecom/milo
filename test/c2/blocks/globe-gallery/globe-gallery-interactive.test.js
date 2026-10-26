/* eslint-disable max-classes-per-file */
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import * as THREE from '../../../../libs/deps/three.js';
import createInteraction from '../../../../libs/c2/blocks/globe-gallery/src/interaction.js';
import createCursor from '../../../../libs/c2/blocks/globe-gallery/src/cursor.js';
import createGlobeModal from '../../../../libs/c2/blocks/globe-gallery/src/modal.js';
import {
  createCardMaterial,
  createModalMaterial,
  createTextMaterial,
  createPlaceholderTexture,
  loadCardTextures,
  loadModalTexture,
  createClickDragTexture,
} from '../../../../libs/c2/blocks/globe-gallery/src/materials.js';
import {
  fetchFragmentCards,
  layoutQuote,
} from '../../../../libs/c2/blocks/globe-gallery/src/authoring.js';

function dispatch(target, type, props = {}) {
  const event = new Event(type, { bubbles: true, cancelable: true });
  Object.entries(props).forEach(([key, value]) => {
    Object.defineProperty(event, key, { configurable: true, value });
  });
  target.dispatchEvent(event);
  return event;
}

function nextFrame() {
  return new Promise((resolve) => {
    requestAnimationFrame(resolve);
  });
}

describe('globe-gallery: interaction', () => {
  let canvas;
  let camera;
  let mesh;
  let card;
  let drag;
  let live;
  let yawOnly;
  let cursorActive;
  let openModal;
  let onDrag;
  let interaction;

  beforeEach(() => {
    canvas = document.createElement('canvas');
    canvas.getBoundingClientRect = () => ({
      left: 0,
      top: 0,
      width: 100,
      height: 100,
    });
    canvas.setPointerCapture = sinon.spy();
    camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    camera.position.z = 5;
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
    mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      createCardMaterial({ texture: new THREE.Texture(), aspect: 1 }),
    );
    mesh.material.opacity = 1;
    mesh.updateMatrixWorld();
    card = {
      mesh,
      hoverTarget: 0,
      hoverUV: new THREE.Vector2(),
    };
    drag = {
      isDragging: false,
      velX: 0,
      velY: 0,
      pendingX: 0,
      pendingY: 0,
    };
    live = true;
    yawOnly = false;
    cursorActive = false;
    openModal = sinon.spy();
    onDrag = sinon.spy();
    interaction = createInteraction({
      getRenderer: () => ({ domElement: canvas }),
      getCamera: () => camera,
      getCards: () => [card],
      openModal,
      getDragSensitivity: () => 0.01,
      isGlobeLive: () => live,
      maxVel: 0.08,
      drag,
      getYawOnly: () => yawOnly,
      isCursorActive: () => cursorActive,
      onDrag,
    });
    interaction.setup(canvas);
  });

  afterEach(() => {
    interaction.teardown();
    mesh.geometry.dispose();
    mesh.material.dispose();
  });

  it('ignores non-primary, non-left, and inactive pointer downs', () => {
    dispatch(canvas, 'pointerdown', {
      button: 1,
      isPrimary: true,
      pointerId: 1,
    });
    dispatch(canvas, 'pointerdown', {
      button: 0,
      isPrimary: false,
      pointerId: 1,
    });
    live = false;
    dispatch(canvas, 'pointerdown', {
      button: 0,
      isPrimary: true,
      pointerId: 1,
    });

    expect(drag.isDragging).to.be.false;
    expect(canvas.setPointerCapture.called).to.be.false;
  });

  it('opens the card on a short stationary primary click', () => {
    dispatch(canvas, 'pointerdown', {
      button: 0,
      isPrimary: true,
      pointerId: 7,
      pointerType: 'mouse',
      clientX: 50,
      clientY: 50,
    });
    dispatch(canvas, 'pointerup', {
      pointerId: 7,
      clientX: 50,
      clientY: 50,
    });

    expect(canvas.setPointerCapture.calledWith(7)).to.be.true;
    expect(openModal.calledOnceWith(0, 50, 50)).to.be.true;
    expect(drag.isDragging).to.be.false;
  });

  it('turns mouse movement into exact yaw and pitch travel', () => {
    dispatch(canvas, 'pointerdown', {
      button: 0,
      isPrimary: true,
      pointerId: 2,
      pointerType: 'mouse',
      clientX: 20,
      clientY: 30,
    });
    dispatch(canvas, 'pointermove', {
      pointerId: 2,
      pointerType: 'mouse',
      clientX: 40,
      clientY: 40,
    });

    expect(drag.pendingX).to.equal(0.2);
    expect(drag.pendingY).to.equal(0.1);
    expect(onDrag.calledOnce).to.be.true;
    expect(Math.abs(drag.velX)).to.be.at.most(0.08);
    expect(Math.abs(drag.velY)).to.be.at.most(0.08);
  });

  it('suppresses pitch when yaw-only mode is active', () => {
    yawOnly = true;
    dispatch(canvas, 'pointerdown', {
      button: 0,
      isPrimary: true,
      pointerId: 2,
      pointerType: 'mouse',
      clientX: 20,
      clientY: 20,
    });
    dispatch(canvas, 'pointermove', {
      pointerId: 2,
      pointerType: 'mouse',
      clientX: 40,
      clientY: 50,
    });

    expect(drag.pendingX).to.equal(0.2);
    expect(drag.pendingY).to.equal(0);
  });

  it('locks touch gestures vertically for page scrolling', () => {
    dispatch(canvas, 'pointerdown', {
      button: 0,
      isPrimary: true,
      pointerId: 3,
      pointerType: 'touch',
      clientX: 20,
      clientY: 20,
    });
    dispatch(canvas, 'pointermove', {
      pointerId: 3,
      pointerType: 'touch',
      clientX: 22,
      clientY: 50,
    });

    expect(drag.pendingX).to.equal(0);
    expect(drag.pendingY).to.equal(0);
    expect(onDrag.called).to.be.false;
  });

  it('locks touch gestures horizontally and applies yaw only', () => {
    dispatch(canvas, 'pointerdown', {
      button: 0,
      isPrimary: true,
      pointerId: 3,
      pointerType: 'touch',
      clientX: 20,
      clientY: 20,
    });
    dispatch(canvas, 'pointermove', {
      pointerId: 3,
      pointerType: 'touch',
      clientX: 50,
      clientY: 25,
    });

    expect(drag.pendingX).to.equal(0.3);
    expect(drag.pendingY).to.equal(0);
    expect(onDrag.calledOnce).to.be.true;
  });

  it('ignores events from a pointer that does not own the drag', () => {
    dispatch(canvas, 'pointerdown', {
      button: 0,
      isPrimary: true,
      pointerId: 4,
      pointerType: 'mouse',
      clientX: 10,
      clientY: 10,
    });
    dispatch(canvas, 'pointermove', {
      pointerId: 5,
      pointerType: 'mouse',
      clientX: 80,
      clientY: 80,
    });
    dispatch(canvas, 'pointerup', {
      pointerId: 5,
      clientX: 80,
      clientY: 80,
    });

    expect(drag.pendingX).to.equal(0);
    expect(drag.isDragging).to.be.true;
    expect(openModal.called).to.be.false;
  });

  it('cancels without inertia or a click', () => {
    dispatch(canvas, 'pointerdown', {
      button: 0,
      isPrimary: true,
      pointerId: 4,
      pointerType: 'mouse',
      clientX: 10,
      clientY: 10,
    });
    dispatch(canvas, 'pointermove', {
      pointerId: 4,
      pointerType: 'mouse',
      clientX: 50,
      clientY: 20,
    });
    dispatch(canvas, 'pointercancel', { pointerId: 4 });

    expect(drag).to.deep.equal({
      isDragging: false,
      velX: 0,
      velY: 0,
      pendingX: 0,
      pendingY: 0,
    });
    expect(openModal.called).to.be.false;
  });

  it('applies native or custom cursor states and clears them on teardown', () => {
    interaction.applyCursor();
    expect(canvas.style.cursor).to.equal('grab');
    cursorActive = true;
    interaction.applyCursor();
    expect(canvas.style.cursor).to.equal('none');
    cursorActive = false;
    drag.isDragging = true;
    interaction.applyCursor();
    expect(canvas.style.cursor).to.equal('grabbing');

    interaction.teardown();
    expect(canvas.style.cursor).to.equal('');
  });
});

describe('globe-gallery: custom cursor', () => {
  let originalMatchMedia;
  let canvas;
  let live;
  let retired;
  let drag;
  let cursor;

  beforeEach(() => {
    originalMatchMedia = window.matchMedia;
    canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    live = true;
    retired = false;
    drag = { isDragging: false };
  });

  afterEach(() => {
    cursor?.teardown();
    canvas.remove();
    document.querySelectorAll('.globe-gallery-cursor, .globe-gallery-cursor-disc')
      .forEach((el) => el.remove());
    window.matchMedia = originalMatchMedia;
    document.documentElement.removeAttribute('dir');
  });

  function create(matches = true) {
    window.matchMedia = sinon.stub().returns({ matches });
    cursor = createCursor({
      getGlobeLive: () => live,
      getCursorRetired: () => retired,
      labelText: 'Explore',
      drag,
    });
    cursor.setup(canvas);
  }

  it('does not initialize for a coarse pointer', () => {
    create(false);
    expect(document.querySelector('.globe-gallery-cursor')).to.be.null;
  });

  it('activates only over a live canvas and positions all cursor pieces', () => {
    create();
    dispatch(canvas, 'mouseenter', { clientX: 100, clientY: 80 });
    cursor.update();

    expect(cursor.isActive()).to.be.true;
    expect(document.querySelector('.globe-gallery-cursor').classList
      .contains('globe-gallery-cursor-active')).to.be.true;
    expect(document.querySelector('.globe-gallery-cursor-text').textContent).to.equal('Explore');
    expect(document.querySelector('.globe-gallery-cursor-disc').style.left).to.equal('100px');
    expect(document.querySelector('.globe-gallery-cursor-ring-wrap').style.transform)
      .to.equal('translate(100px, 80px)');

    live = false;
    cursor.update();
    expect(cursor.isActive()).to.be.false;
  });

  it('tracks dragging, keyboard suppression, and pointer reactivation', () => {
    create();
    dispatch(canvas, 'mouseenter', { clientX: 20, clientY: 30 });
    drag.isDragging = true;
    cursor.update();
    expect(document.querySelector('.globe-gallery-cursor').classList
      .contains('globe-gallery-cursor-dragging')).to.be.true;

    document.dispatchEvent(new Event('focusin'));
    cursor.update();
    expect(cursor.isActive()).to.be.false;

    dispatch(canvas, 'mousemove', { clientX: 22, clientY: 32 });
    cursor.update();
    expect(cursor.isActive()).to.be.true;
  });

  it('retires after the fade delay and can become active again', () => {
    const clock = sinon.useFakeTimers();
    try {
      create();
      dispatch(canvas, 'mouseenter', { clientX: 20, clientY: 30 });
      cursor.update();
      retired = true;
      cursor.update();
      expect(cursor.isActive()).to.be.true;
      clock.tick(421);
      cursor.update();
      expect(cursor.isActive()).to.be.false;
      retired = false;
      cursor.update();
      expect(cursor.isActive()).to.be.true;
    } finally {
      clock.restore();
    }
  });

  it('places the label on the left in RTL and removes generated DOM on teardown', () => {
    document.documentElement.dir = 'rtl';
    create();
    const text = document.querySelector('.globe-gallery-cursor-text-wrap');
    Object.defineProperty(text, 'offsetWidth', { configurable: true, value: 40 });
    cursor.teardown();
    cursor = null;
    create();
    dispatch(canvas, 'mouseenter', { clientX: 100, clientY: 50 });
    cursor.update();

    expect(document.querySelector('.globe-gallery-cursor-text-wrap').style.transform)
      .to.include('translate(');
    cursor.teardown();
    expect(document.querySelector('.globe-gallery-cursor')).to.be.null;
    expect(document.querySelector('.globe-gallery-cursor-disc')).to.be.null;
  });
});

describe('globe-gallery: materials', () => {
  let originalImage;
  let originalBitmap;
  let originalLana;

  beforeEach(() => {
    originalImage = window.Image;
    originalBitmap = window.createImageBitmap;
    originalLana = window.lana;
  });

  afterEach(() => {
    window.Image = originalImage;
    window.createImageBitmap = originalBitmap;
    window.lana = originalLana;
  });

  it('initializes card uniforms and proxies opacity and map', () => {
    const texture = new THREE.Texture();
    const replacement = new THREE.Texture();
    const material = createCardMaterial({ texture, aspect: 1.5 });

    expect(material.uniforms.uMap.value).to.equal(texture);
    expect(material.uniforms.uAspect.value).to.equal(1.5);
    expect(material.opacity).to.equal(0);
    material.opacity = 0.75;
    material.map = replacement;
    expect(material.uniforms.uOpacity.value).to.equal(0.75);
    expect(material.uniforms.uMap.value).to.equal(replacement);
    expect(material.transparent).to.be.true;
    expect(material.depthWrite).to.be.false;
  });

  it('initializes modal and text material uniforms', () => {
    const texture = new THREE.Texture();
    const modal = createModalMaterial(texture, 2);
    const text = createTextMaterial({
      texture,
      aspect: 1.25,
      resolution: { x: 1600, y: 900 },
    });

    expect(modal.uniforms.map.value).to.equal(texture);
    expect(modal.uniforms.uAspect.value).to.equal(2);
    expect(modal.uniforms.uWarpCenter.value.toArray()).to.deep.equal([0.5, 0.5]);
    expect(text.uniforms.uResolution.value.toArray()).to.deep.equal([1600, 900]);
    expect(text.uniforms.uOpacity.value).to.equal(0);
  });

  it('creates a one-pixel sRGB placeholder texture', () => {
    const texture = createPlaceholderTexture();
    expect(texture.image.width).to.equal(1);
    expect(texture.image.height).to.equal(1);
    expect(texture.colorSpace).to.equal(THREE.SRGBColorSpace);
  });

  it('finishes the card batch when images fail and reports fallback aspects', async () => {
    const log = sinon.spy();
    window.lana = { log };
    window.Image = class FakeImage {
      set src(value) {
        this.currentSrc = value;
        queueMicrotask(() => this.onerror());
      }
    };
    const each = sinon.spy();
    let result;
    loadCardTextures({
      count: 2,
      getSrc: (i) => `/missing-${i}.jpg`,
      maxTexH: 100,
    }, each, (textures, aspects) => {
      result = { textures, aspects };
    });
    await Promise.resolve();

    expect(each.callCount).to.equal(2);
    expect(result.textures).to.have.length(2);
    expect(result.aspects).to.deep.equal([4 / 6, 4 / 6]);
    expect(log.callCount).to.equal(2);
  });

  it('loads and resizes successful card images before completing', async () => {
    window.Image = class FakeImage {
      constructor() {
        this.naturalWidth = 1000;
        this.naturalHeight = 500;
      }

      set src(value) {
        this.currentSrc = value;
        queueMicrotask(() => this.onload());
      }
    };
    window.createImageBitmap = sinon.stub().resolves({ width: 500, height: 250 });
    let result;
    loadCardTextures({
      count: 1,
      getSrc: () => '/wide.jpg',
      maxTexH: 200,
    }, null, (textures, aspects) => {
      result = { textures, aspects };
    });
    await Promise.resolve();
    await Promise.resolve();
    await nextFrame();

    expect(window.createImageBitmap.calledOnce).to.be.true;
    expect(window.createImageBitmap.firstCall.args[1]).to.include({
      resizeWidth: 400,
      resizeHeight: 200,
      imageOrientation: 'flipY',
    });
    expect(result.aspects).to.deep.equal([2]);
  });

  it('returns a cancellable modal image and calls its error callback', async () => {
    const error = sinon.spy();
    window.Image = class FakeImage {
      set src(value) {
        this.currentSrc = value;
        if (value) queueMicrotask(() => this.onerror());
      }
    };
    const image = loadModalTexture('/missing.jpg', 1000, sinon.spy(), error);
    await Promise.resolve();

    expect(image.currentSrc).to.equal('/missing.jpg');
    expect(error.calledOnce).to.be.true;
  });

  it('creates hint textures for landscape and portrait canvases', () => {
    const landscape = createClickDragTexture(2, 'Explore');
    const portrait = createClickDragTexture(0.5, 'Explore');

    expect(landscape.image.width).to.equal(2048);
    expect(landscape.image.height).to.equal(1024);
    expect(portrait.image.width).to.equal(1024);
    expect(portrait.image.height).to.equal(2048);
  });
});

describe('globe-gallery: modal DOM behavior', () => {
  let root;
  let scene;
  let sphereGroup;
  let camera;
  let mainCanvas;
  let cards;
  let metadata;
  let lenis;
  let upgrade;
  let modal;

  beforeEach(() => {
    root = document.createElement('div');
    root.innerHTML = `
      <canvas class="globe-gallery-canvas"></canvas>
      <div class="globe-gallery-modal" aria-hidden="true"></div>
      <dialog class="globe-gallery-modal-chrome">
        <div class="globe-gallery-modal-info">
          <h2 class="globe-gallery-modal-name"></h2>
          <p class="globe-gallery-modal-role-label"></p>
          <div class="globe-gallery-modal-description"></div>
          <ul class="globe-gallery-modal-badges"></ul>
        </div>
        <span class="globe-gallery-modal-image"></span>
        <button class="globe-gallery-modal-nav globe-gallery-modal-nav-prev"></button>
        <div class="globe-gallery-modal-counter"></div>
        <span class="globe-gallery-modal-position"></span>
        <button class="globe-gallery-modal-nav globe-gallery-modal-nav-next"></button>
        <button class="globe-gallery-modal-close"></button>
        <span class="globe-gallery-modal-announce"></span>
      </dialog>
    `;
    document.body.appendChild(root);
    mainCanvas = root.querySelector('.globe-gallery-canvas');
    scene = new THREE.Scene();
    sphereGroup = new THREE.Group();
    scene.add(sphereGroup);
    camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    camera.position.z = 10;
    const makeCard = () => {
      const map = new THREE.Texture();
      const material = createCardMaterial({ texture: map, aspect: 1 });
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);
      sphereGroup.add(mesh);
      return {
        mesh,
        srcAspect: 1,
        spherePos: new THREE.Vector3(),
        sphereQuat: new THREE.Quaternion(),
        sphereScaleSX: 1,
        sphereScaleSY: 1,
      };
    };
    cards = [makeCard(), makeCard()];
    const description = document.createElement('p');
    description.textContent = 'A detailed description.';
    metadata = [{
      alt: 'Artwork alt',
      role: 'Designer',
      name: 'Ada',
      description: [description],
      badges: [{
        name: '<Photoshop>',
        role: 'Featured',
        href: 'https://example.com/?a=1&b=2',
        icon: '',
      }],
    }, {
      alt: '',
      role: 'Director',
      name: 'Grace',
      description: [],
      badges: [],
    }];
    lenis = { stop: sinon.spy(), start: sinon.spy() };
    upgrade = sinon.spy(() => ({ src: '/upgrade' }));
    window.lenis = lenis;
    modal = createGlobeModal({
      q: (selector) => (selector === '.globe-gallery-modal-canvas'
        ? null : root.querySelector(selector)),
      getScene: () => scene,
      getCamera: () => camera,
      getSphereGroup: () => sphereGroup,
      getRenderer: () => ({ domElement: mainCanvas }),
      getCards: () => cards,
      getCount: () => cards.length,
      getCardMetadata: (i) => metadata[i],
      authoredNo: (i) => i + 1,
      stepCard: (i, direction) => (i + direction + cards.length) % cards.length,
      loadModalUpgrade: upgrade,
      getViewport: () => ({ W: 1000, H: 800 }),
      getBP: () => 'md',
      getCardDims: () => ({ w: 10, h: 10 }),
      cardAspect: 1,
      getAntialias: () => false,
      caEnabled: false,
      cardLabel: (i, count) => `${i} of ${count}`,
      getReducedMotion: () => true,
      sphereRotQuat: new THREE.Quaternion(),
      snapToSphereSlot: sinon.spy(),
      applySphereFacing: sinon.spy(),
      requestNavNudge: sinon.spy(),
      applyMotionCA: sinon.spy(),
      restoreFocusOnClose: sinon.spy(),
    });
    modal.setup();
  });

  afterEach(() => {
    modal.destroy();
    cards.forEach(({ mesh }) => {
      mesh.geometry.dispose();
      mesh.material.dispose();
    });
    root.remove();
    delete window.lenis;
    document.documentElement.classList.remove('globe-gallery-modal-open');
    document.body.classList.remove('globe-gallery-modal-open');
  });

  it('opens and populates accessible metadata, badges, and position', () => {
    modal.open(0, 100, 200);
    const chrome = root.querySelector('.globe-gallery-modal-chrome');

    expect(modal.getModalIdx()).to.equal(0);
    expect(root.querySelector('.globe-gallery-modal-name').textContent).to.equal('Ada');
    expect(root.querySelector('.globe-gallery-modal-role-label').textContent).to.equal('Designer');
    expect(root.querySelector('.globe-gallery-modal-description').textContent)
      .to.equal('A detailed description.');
    expect(root.querySelector('.globe-gallery-modal-image').getAttribute('aria-label'))
      .to.equal('Artwork alt');
    expect(root.querySelector('.globe-gallery-modal-counter').textContent).to.equal('01 / 02');
    expect(root.querySelector('.globe-gallery-modal-position').textContent).to.equal('1 of 2');
    expect(chrome.querySelector('.globe-gallery-modal-badge-app').textContent)
      .to.equal('<Photoshop>');
    expect(chrome.querySelector('.globe-gallery-modal-badge-app').getAttribute('href'))
      .to.equal('https://example.com/?a=1&b=2');
    expect(mainCanvas.classList.contains('is-modal-active')).to.be.true;
    expect(document.documentElement.classList.contains('globe-gallery-modal-open')).to.be.true;
    expect(lenis.stop.calledOnce).to.be.true;
    expect(modal.isCardManaged(cards[0])).to.be.true;
  });

  it('marks the canvas image decorative when no alt is authored', () => {
    modal.open(1);
    const image = root.querySelector('.globe-gallery-modal-image');
    expect(image.getAttribute('aria-hidden')).to.equal('true');
    expect(image.hasAttribute('aria-label')).to.be.false;
  });

  it('ignores invalid opens and navigation while closed', () => {
    modal.open(99);
    modal.navigate(1);
    expect(modal.getModalIdx()).to.equal(-1);
  });

  it('closes through reduced-motion animation and restores page state', () => {
    const clock = sinon.useFakeTimers();
    try {
      modal.open(0);
      modal.updateAnimation(false);
      modal.close(false);
      modal.updateAnimation(false);
      clock.tick(700);

      expect(modal.getModalIdx()).to.equal(-1);
      expect(mainCanvas.classList.contains('is-modal-active')).to.be.false;
      expect(document.documentElement.classList.contains('globe-gallery-modal-open')).to.be.false;
      expect(lenis.start.called).to.be.true;
    } finally {
      clock.restore();
    }
  });

  it('hides navigation controls for a single-card gallery', () => {
    modal.destroy();
    cards.length = 1;
    modal = createGlobeModal({
      q: (selector) => (selector === '.globe-gallery-modal-canvas'
        ? null : root.querySelector(selector)),
      getScene: () => scene,
      getCamera: () => camera,
      getSphereGroup: () => sphereGroup,
      getRenderer: () => null,
      getCards: () => cards,
      getCount: () => 1,
      getCardMetadata: () => metadata[0],
      authoredNo: () => 1,
      stepCard: () => 0,
      getViewport: () => ({ W: 1000, H: 800 }),
      getBP: () => 'md',
      getCardDims: () => ({ w: 10, h: 10 }),
      cardAspect: 1,
      getAntialias: () => false,
      caEnabled: false,
      cardLabel: () => '1 of 1',
      getReducedMotion: () => true,
      sphereRotQuat: new THREE.Quaternion(),
      snapToSphereSlot: () => {},
      applySphereFacing: () => {},
      requestNavNudge: () => {},
      applyMotionCA: () => {},
    });
    modal.setup();

    expect(root.querySelector('.globe-gallery-modal-nav-prev').hidden).to.be.true;
    expect(root.querySelector('.globe-gallery-modal-nav-next').hidden).to.be.true;
  });

  it('destroy synchronously resets modal classes and scrolling state', () => {
    modal.open(0);
    modal.destroy();

    expect(modal.getModalIdx()).to.equal(-1);
    expect(root.querySelector('.globe-gallery-modal').classList.contains('is-visible')).to.be.false;
    expect(mainCanvas.classList.contains('is-modal-active')).to.be.false;
    expect(document.documentElement.classList.contains('globe-gallery-modal-open')).to.be.false;
    expect(lenis.start.called).to.be.true;
  });

  it('accepts an active texture upgrade and disposes it when opening another card', () => {
    modal.open(0);
    const texture = new THREE.Texture({ width: 900, height: 600 });
    const dispose = sinon.spy(texture, 'dispose');
    upgrade.firstCall.args[1](texture);
    expect(cards[0].modalMat.uniforms.map.value).to.equal(texture);
    expect(cards[0].modalAspect).to.equal(1.5);

    modal.open(1);
    expect(dispose.calledOnce).to.be.true;
    expect(cards[0].modalAspect).to.equal(0);
  });

  it('disposes a stale texture that resolves after navigation', () => {
    modal.open(0);
    const ready = upgrade.firstCall.args[1];
    modal.open(1);
    const stale = new THREE.Texture();
    const dispose = sinon.spy(stale, 'dispose');
    ready(stale);

    expect(dispose.calledOnce).to.be.true;
    expect(modal.getModalIdx()).to.equal(1);
  });

  it('prevents native dialog cancellation and runs the animated close path', () => {
    const clock = sinon.useFakeTimers();
    try {
      modal.open(0);
      const cancel = new Event('cancel', { cancelable: true });
      root.querySelector('.globe-gallery-modal-chrome').dispatchEvent(cancel);
      expect(cancel.defaultPrevented).to.be.true;
      modal.updateAnimation(false);
      clock.tick(700);
      expect(modal.getModalIdx()).to.equal(-1);
    } finally {
      clock.restore();
    }
  });

  it('makes overflowing descriptions focusable and updates edge fades on scroll', () => {
    modal.open(0);
    const description = root.querySelector('.globe-gallery-modal-description');
    Object.defineProperties(description, {
      scrollHeight: { configurable: true, value: 300 },
      clientHeight: { configurable: true, value: 100 },
      scrollTop: { configurable: true, writable: true, value: 0 },
    });
    description.dispatchEvent(new Event('scroll'));
    expect(description.tabIndex).to.equal(0);
    expect(description.classList.contains('is-faded-bottom')).to.be.true;

    description.scrollTop = 200;
    description.dispatchEvent(new Event('scroll'));
    expect(description.classList.contains('is-faded-top')).to.be.true;
    expect(description.classList.contains('is-faded-bottom')).to.be.false;
  });
});

describe('globe-gallery: quote layout and fragment edge cases', () => {
  let fetchStub;

  afterEach(() => {
    fetchStub?.restore();
  });

  it('re-typesets from the authored quote and preserves accessible full text', () => {
    const quote = document.createElement('blockquote');
    quote.textContent = 'One two three four';
    Object.defineProperty(HTMLElement.prototype, 'offsetTop', {
      configurable: true,
      get() {
        const index = [...this.parentNode?.children || []].indexOf(this);
        return index >= 2 ? 20 : 0;
      },
    });

    const first = layoutQuote(quote);
    const second = layoutQuote(quote);
    expect(first).to.have.length.above(1);
    expect(second).to.have.length(first.length);
    expect(quote.querySelector('.globe-gallery-pullquote-sr').textContent)
      .to.equal('One two three four');
    expect([...quote.querySelectorAll('.globe-gallery-pullquote-line-inner')]
      .map((line) => line.textContent).join(' ')).to.equal('One two three four');
  });

  it('returns an empty layout for missing or blank quotes', () => {
    const blank = document.createElement('blockquote');
    expect(layoutQuote(null)).to.deep.equal([]);
    expect(layoutQuote(blank)).to.deep.equal([]);
    expect(blank.classList.contains('globe-gallery-pullquote-lines')).to.be.false;
  });

  it('parses image badges, unlinked badges, nested wrappers, and image-first cards', async () => {
    fetchStub = sinon.stub(window, 'fetch').resolves({
      ok: true,
      text: async () => `
        <div><div>
          <img src="/media_abc/card.jpg" alt="Card">
          <p><strong>Image First</strong></p>
          <ul>
            <li><img src="/icons/app.svg"> Unlinked App <ul><li>Beta</li></ul></li>
          </ul>
        </div></div>`,
    });

    const cards = await fetchFragmentCards('/fragment');
    expect(cards).to.have.length(1);
    expect(cards[0]).to.include({
      img: '/media_abc/card.jpg',
      name: 'Image First',
    });
    expect(cards[0].badges[0]).to.include({
      name: 'Unlinked App',
      role: 'Beta',
      href: null,
    });
    expect(cards[0].badges[0].icon).to.include('/icons/app.svg');
  });
});
