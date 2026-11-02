import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import * as THREE from '../../../../libs/deps/three.js';
import createGlobeControls from '../../../../libs/c2/blocks/firefly-globe/src/controls.js';
import createGalleryA11y from '../../../../libs/c2/blocks/firefly-globe/src/a11y.js';
import createInteraction from '../../../../libs/c2/blocks/firefly-globe/src/interaction.js';
import createCursor from '../../../../libs/c2/blocks/firefly-globe/src/cursor.js';
import {
  createCardMaterial, createModalMaterial, createTextMaterial, createPlaceholderTexture,
  loadCardTextures, loadModalTexture, loadHintFont, createClickDragTexture,
} from '../../../../libs/c2/blocks/firefly-globe/src/materials.js';
import createGlobeModal from '../../../../libs/c2/blocks/firefly-globe/src/modal.js';

const tick = () => new Promise((resolve) => { setTimeout(resolve, 0); });

function pointer(type, id, x, y, pointerType = 'mouse') {
  const event = new Event(type, { bubbles: true, cancelable: true });
  Object.defineProperties(event, {
    pointerId: { value: id },
    pointerType: { value: pointerType },
    isPrimary: { value: true },
    button: { value: 0 },
    clientX: { value: x },
    clientY: { value: y },
  });
  return event;
}

describe('firefly-globe controls', () => {
  let root;
  let controls;
  let rotate;
  let visible;
  let dismissed;

  beforeEach(() => {
    root = document.createElement('div');
    root.innerHTML = `<div class="firefly-globe-controls">
      <button class="firefly-globe-spin-toggle"></button><div class="firefly-globe-hint"></div>
      <button class="firefly-globe-rotate" data-dir="-1"></button>
      <button class="firefly-globe-rotate" data-dir="1"></button></div><div class="after"></div>`;
    document.body.append(root);
    rotate = sinon.spy();
    visible = true;
    dismissed = false;
    controls = createGlobeControls({
      q: (sel) => root.querySelector(sel),
      labels: { pauseSpin: 'Pause', resumeSpin: 'Resume' },
      getVisible: () => visible,
      getHintDismissed: () => dismissed,
      rotate,
    });
  });
  afterEach(() => { controls.teardown(); root.remove(); });

  it('reorders tab stops, tracks visibility/hint and toggles the spin state', () => {
    controls.setup();
    const layer = root.querySelector('.firefly-globe-controls');
    const spin = layer.querySelector('.firefly-globe-spin-toggle');
    expect(root.lastElementChild).to.equal(layer);
    controls.update();
    expect(layer.classList.contains('is-visible')).to.equal(true);
    expect(spin.getAttribute('aria-label')).to.equal('Pause');
    spin.click();
    expect(controls.isSpinPaused()).to.equal(true);
    expect(spin.getAttribute('daa-ll')).to.equal('resume_spin--firefly_globe');
    dismissed = true;
    visible = false;
    controls.update();
    expect(layer.classList.contains('is-visible')).to.equal(false);
    expect(layer.querySelector('.firefly-globe-hint').classList.contains('is-dismissed')).to.equal(true);
    layer.querySelector('[data-dir="-1"]').click();
    layer.querySelector('[data-dir="1"]').click();
    expect(rotate.args).to.deep.equal([[-1], [1]]);
  });

  it('removes listeners/classes on teardown and preserves pause across setup', () => {
    controls.setup();
    const spin = root.querySelector('.firefly-globe-spin-toggle');
    spin.click();
    controls.update();
    controls.teardown();
    spin.click();
    root.querySelector('.firefly-globe-rotate').click();
    expect(rotate.called).to.equal(false);
    expect(controls.isSpinPaused()).to.equal(true);
    expect(root.querySelector('.firefly-globe-controls').classList.contains('is-visible')).to.equal(false);
    controls.setup();
    expect(spin.getAttribute('aria-label')).to.equal('Resume');
  });
});

describe('firefly-globe accessibility gallery', () => {
  let root;
  let gallery;
  let modalIdx;
  let formed;
  let center;
  let open;
  let focus;

  beforeEach(() => {
    root = document.createElement('div');
    root.innerHTML = '<div class="firefly-globe-canvas"></div>';
    document.body.append(root);
    modalIdx = -1;
    formed = true;
    center = sinon.spy();
    open = sinon.spy();
    focus = sinon.spy();
    gallery = createGalleryA11y({
      q: (sel) => root.querySelector(sel),
      getCount: () => 3,
      cardOrder: [2, 0, 1],
      getModalIdx: () => modalIdx,
      isGlobeFormed: () => formed,
      getCardLabel: (i) => `Image ${i}`,
      centerCard: center,
      openCard: open,
      onFocus: focus,
      galleryInstructions: 'Browse images',
      gid: 'test',
    });
  });
  afterEach(() => { gallery.teardown(); root.remove(); });

  it('builds one entry stop and ordered inert browse buttons without duplicating on setup', () => {
    gallery.setup();
    gallery.setup();
    const widget = root.querySelector('.firefly-globe-a11y');
    const cards = root.querySelector('.firefly-globe-a11y-cards');
    expect(root.querySelectorAll('.firefly-globe-a11y')).to.have.length(1);
    expect(widget.tabIndex).to.equal(0);
    expect(widget.getAttribute('aria-labelledby')).to.equal('firefly-globe-a11y-desc-test');
    expect(cards.inert).to.equal(true);
    expect([...cards.children].map((el) => el.dataset.idx)).to.deep.equal(['2', '0', '1']);
    expect(cards.firstElementChild.getAttribute('aria-label')).to.equal('Image 2');
  });

  it('enters only when formed, centers focused cards, and Escape collapses', () => {
    gallery.setup();
    const widget = root.querySelector('.firefly-globe-a11y');
    const cards = root.querySelector('.firefly-globe-a11y-cards');
    formed = false;
    widget.click();
    expect(gallery.isBrowsing()).to.equal(false);
    formed = true;
    widget.click();
    expect(gallery.isBrowsing()).to.equal(true);
    expect(cards.inert).to.equal(false);
    expect(document.activeElement.dataset.idx).to.equal('2');
    expect(center.lastCall.args).to.deep.equal([2]);
    gallery.setFocusRect(20, 30, 40, 50);
    expect(cards.firstElementChild.style.borderRadius).to.equal('1.75px');
    gallery.focusCard(1);
    expect(gallery.getFocusedIdx()).to.equal(1);
    expect(focus.called).to.equal(true);
    document.activeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(gallery.isBrowsing()).to.equal(false);
    expect(cards.inert).to.equal(true);
    expect(document.activeElement).to.equal(widget);
  });

  it('gates tab stops during modal, tracks canvas opens without opening, and tears down', () => {
    gallery.setup();
    const widget = root.querySelector('.firefly-globe-a11y');
    const cards = root.querySelector('.firefly-globe-a11y-cards');
    widget.click();
    gallery.trackCardOpen(0);
    expect(open.called).to.equal(false);
    expect(cards.inert).to.equal(false);
    modalIdx = 0;
    gallery.updateTabStops();
    expect(cards.inert).to.equal(true);
    expect(widget.tabIndex).to.equal(-1);
    modalIdx = -1;
    gallery.updateTabStops();
    expect(cards.inert).to.equal(false);
    gallery.teardown();
    expect(gallery.getFocusedIdx()).to.equal(-1);
    expect(root.querySelector('.firefly-globe-a11y')).to.equal(null);
    widget.click();
    expect(gallery.isBrowsing()).to.equal(false);
  });

  it('collapses when focus leaves browsing, except while the modal is open', () => {
    gallery.setup();
    const widget = root.querySelector('.firefly-globe-a11y');
    const cards = root.querySelector('.firefly-globe-a11y-cards');
    widget.click();
    modalIdx = 0;
    cards.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: widget }));
    expect(gallery.isBrowsing()).to.equal(true);
    modalIdx = -1;
    cards.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: widget }));
    expect(gallery.isBrowsing()).to.equal(false);
    expect(widget.tabIndex).to.equal(0);
  });
});

describe('firefly-globe pointer interaction', () => {
  let canvas;
  let interaction;
  let drag;
  let onDrag;
  let open;
  let live;
  let yawOnly;
  let card;
  let camera;

  beforeEach(() => {
    canvas = document.createElement('div');
    document.body.append(canvas);
    canvas.setPointerCapture = sinon.spy();
    canvas.getBoundingClientRect = () => ({ left: 0, top: 0, width: 100, height: 100 });
    drag = { isDragging: false, velX: 0, velY: 0, pendingX: 0, pendingY: 0 };
    onDrag = sinon.spy();
    open = sinon.spy();
    live = true;
    yawOnly = false;
    camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    camera.position.z = 5;
    camera.updateMatrixWorld();
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      createCardMaterial({ texture: null, aspect: 1 }),
    );
    mesh.material.opacity = 1;
    mesh.updateMatrixWorld();
    card = { mesh, hoverTarget: 0, hoverUV: new THREE.Vector2() };
    interaction = createInteraction({
      getRenderer: () => ({ domElement: canvas }),
      getCamera: () => camera,
      getCards: () => [card],
      openModal: open,
      getDragSensitivity: () => 1,
      isGlobeLive: () => live,
      maxVel: 0.5,
      drag,
      getYawOnly: () => yawOnly,
      onDrag,
    });
    interaction.setup(canvas);
  });
  afterEach(() => {
    interaction.teardown();
    canvas.remove();
    card.mesh.geometry.dispose();
    card.mesh.material.dispose();
  });
  const send = (el, type, id, x, y, pointerType) => {
    el.dispatchEvent(pointer(type, id, x, y, pointerType));
  };

  it('opens a picked card on a short tap, but not when hidden or not live', () => {
    send(canvas, 'pointerdown', 1, 50, 50);
    send(canvas, 'pointerup', 1, 50, 50);
    expect(open.firstCall.args).to.deep.equal([0, 50, 50]);
    card.mesh.material.opacity = 0.05;
    send(canvas, 'pointerdown', 2, 50, 50);
    send(canvas, 'pointerup', 2, 50, 50);
    live = false;
    send(canvas, 'pointerdown', 3, 50, 50);
    send(canvas, 'pointerup', 3, 50, 50);
    expect(open.callCount).to.equal(1);
    expect(canvas.setPointerCapture.callCount).to.equal(2);
  });

  it('keeps a single pointer owner, reports dragging once, clamps inertia and preserves it on release', () => {
    send(canvas, 'pointerdown', 1, 50, 50);
    send(canvas, 'pointermove', 2, 80, 80);
    expect(drag.pendingX).to.equal(0);
    send(canvas, 'pointermove', 1, 90, 70);
    send(canvas, 'pointermove', 1, 95, 75);
    expect(onDrag.callCount).to.equal(1);
    expect(drag.pendingX).to.equal(45);
    expect(drag.pendingY).to.equal(25);
    expect(Math.abs(drag.velX)).to.be.at.most(0.5);
    expect(Math.abs(drag.velY)).to.be.at.most(0.5);
    send(canvas, 'pointerup', 2, 95, 75);
    expect(drag.isDragging).to.equal(true);
    send(canvas, 'pointerup', 1, 95, 75);
    expect(drag.isDragging).to.equal(false);
    expect(open.called).to.equal(false);
  });

  it('locks touch to horizontal yaw and leaves vertical scrolling untouched', () => {
    send(canvas, 'pointerdown', 1, 50, 50, 'touch');
    send(canvas, 'pointermove', 1, 53, 54, 'touch');
    expect(drag.pendingX).to.equal(0);
    send(canvas, 'pointermove', 1, 70, 52, 'touch');
    expect(drag.pendingX).to.equal(20);
    expect(drag.pendingY).to.equal(0);
    send(canvas, 'pointercancel', 1, 70, 52, 'touch');
    send(canvas, 'pointerdown', 2, 50, 50, 'pen');
    send(canvas, 'pointermove', 2, 51, 70, 'pen');
    send(canvas, 'pointermove', 2, 90, 70, 'pen');
    expect(drag.pendingX).to.equal(0);
    expect(onDrag.callCount).to.equal(1);
    send(canvas, 'pointerup', 2, 90, 70, 'pen');
    expect(open.called).to.equal(false);
  });

  it('cancels without inertia, respects yaw-only, and removes listeners on teardown', () => {
    yawOnly = true;
    send(canvas, 'pointerdown', 1, 50, 50);
    send(canvas, 'pointermove', 1, 70, 80);
    expect(drag.pendingY).to.equal(0);
    send(canvas, 'lostpointercapture', 1, 70, 80);
    expect(drag.isDragging).to.equal(false);
    send(canvas, 'pointerdown', 2, 50, 50);
    send(canvas, 'pointermove', 2, 70, 80);
    send(canvas, 'pointercancel', 2, 70, 80);
    expect([drag.velX, drag.velY, drag.pendingX, drag.pendingY]).to.deep.equal([0, 0, 0, 0]);
    interaction.teardown();
    send(canvas, 'pointerdown', 3, 50, 50);
    expect(drag.isDragging).to.equal(false);
    expect(canvas.style.cursor).to.equal('');
  });

  it('changes hover cursor with the live gate', () => {
    send(canvas, 'pointermove', 1, 50, 50);
    expect(card.hoverTarget).to.equal(1);
    expect(canvas.style.cursor).to.equal('pointer');
    live = false;
    interaction.applyCursor();
    expect(canvas.style.cursor).to.equal('');
    send(canvas, 'pointermove', 1, 50, 50);
    expect(card.hoverTarget).to.equal(0);
  });

  it('does not treat a ten-pixel move or a slow press as a click', () => {
    const clock = sinon.useFakeTimers({ toFake: ['performance'] });
    try {
      send(canvas, 'pointerdown', 1, 50, 50);
      send(canvas, 'pointermove', 1, 60, 50);
      send(canvas, 'pointerup', 1, 60, 50);
      expect(onDrag.calledOnce).to.equal(true);
      expect(open.called).to.equal(false);
      send(canvas, 'pointerdown', 2, 50, 50);
      clock.tick(500);
      send(canvas, 'pointerup', 2, 50, 50);
      expect(open.called).to.equal(false);
    } finally {
      clock.restore();
    }
  });
});

describe('firefly-globe custom cursor', () => {
  let canvas;
  let cursor;
  let fine;
  let live;
  let retired;
  let clock;
  let originalMatchMedia;

  beforeEach(() => {
    canvas = document.createElement('div');
    document.body.append(canvas);
    fine = true;
    live = true;
    retired = false;
    originalMatchMedia = window.matchMedia;
    window.matchMedia = () => ({ matches: fine });
    clock = sinon.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'performance'] });
    cursor = createCursor({
      getGlobeLive: () => live,
      getCursorRetired: () => retired,
      labelText: 'Drag globe',
    });
  });
  afterEach(() => {
    cursor.teardown();
    canvas.remove();
    document.dir = '';
    window.matchMedia = originalMatchMedia;
    clock.restore();
  });

  it('only mounts for fine pointers and positions label in LTR and RTL', () => {
    fine = false;
    cursor.setup(canvas);
    expect(document.querySelector('.firefly-globe-cursor')).to.equal(null);
    fine = true;
    cursor.setup(canvas);
    cursor.setup(canvas);
    expect(document.querySelectorAll('.firefly-globe-cursor')).to.have.length(1);
    const node = document.querySelector('.firefly-globe-cursor');
    const text = node.querySelector('.firefly-globe-cursor-text-wrap');
    expect(node.querySelector('span').textContent).to.equal('Drag globe');
    canvas.dispatchEvent(new MouseEvent('mouseenter', { clientX: 100, clientY: 50 }));
    cursor.update();
    expect(node.classList.contains('firefly-globe-cursor-active')).to.equal(true);
    expect(text.style.transform).to.equal('translate(132px, 39px)');
    document.dir = 'rtl';
    canvas.dispatchEvent(new MouseEvent('mousemove', { clientX: 120, clientY: 60 }));
    cursor.update();
    expect(text.style.transform).to.equal(`translate(${120 - text.offsetWidth - 32}px, 49px)`);
  });

  it('suppresses on focus/blur, retires after fade, and resets on teardown', () => {
    cursor.setup(canvas);
    const node = document.querySelector('.firefly-globe-cursor');
    canvas.dispatchEvent(new MouseEvent('mouseenter', { clientX: 10, clientY: 20 }));
    cursor.update();
    document.dispatchEvent(new Event('focusin'));
    cursor.update();
    expect(node.classList.contains('firefly-globe-cursor-active')).to.equal(false);
    canvas.dispatchEvent(new MouseEvent('mousemove', { clientX: 20, clientY: 20 }));
    retired = true;
    cursor.update();
    expect(node.classList.contains('firefly-globe-cursor-retiring')).to.equal(true);
    clock.tick(420);
    cursor.update();
    expect(node.classList.contains('firefly-globe-cursor-active')).to.equal(false);
    retired = false;
    live = false;
    cursor.update();
    expect(node.classList.contains('firefly-globe-cursor-active')).to.equal(false);
    cursor.teardown();
    expect(node.isConnected).to.equal(false);
    canvas.dispatchEvent(new MouseEvent('mouseenter', { clientX: 1, clientY: 1 }));
    cursor.update();
    expect(document.querySelector('.firefly-globe-cursor')).to.equal(null);
  });
});

describe('firefly-globe materials and texture loaders', () => {
  let images;
  let originalImage;
  let bitmapStub;
  let log;
  let originalLana;

  beforeEach(() => {
    images = [];
    originalImage = window.Image;
    window.Image = class {
      constructor() { images.push(this); }

      set src(value) { this.url = value; }

      get src() { return this.url; }
    };
    bitmapStub = sinon.stub(window, 'createImageBitmap').resolves({ width: 100, height: 50 });
    originalLana = window.lana;
    log = sinon.spy();
    window.lana = { log };
  });
  afterEach(() => {
    window.Image = originalImage;
    bitmapStub.restore();
    window.lana = originalLana;
  });

  it('initializes shader uniforms and proxies map/opacity without an actual renderer', () => {
    const texture = createPlaceholderTexture();
    const card = createCardMaterial({ texture, aspect: 1.5 });
    expect([texture.image.width, texture.image.height]).to.deep.equal([1, 1]);
    expect(card.uniforms.uReveal.value).to.equal(0);
    expect(card.uniforms.uContourFade.value).to.equal(1);
    expect(card.uniforms.uAspect.value).to.equal(1.5);
    card.opacity = 0.7;
    card.map = null;
    card.needsUpdate = true;
    expect(card.uniforms.uOpacity.value).to.equal(0.7);
    expect(card.uniforms.uMap.value).to.equal(null);
    expect(card.needsUpdate).to.equal(false);
    const modal = createModalMaterial(texture, 2);
    expect(modal.uniforms.map.value).to.equal(texture);
    expect(modal.uniforms.uRadius.value).to.be.closeTo(22 / 631, 0.00001);
    const text = createTextMaterial({ texture, aspect: 1.2, resolution: { x: 800, y: 600 } });
    expect(text.uniforms.uResolution.value.toArray()).to.deep.equal([800, 600]);
    [texture, card, modal, text].forEach((resource) => resource.dispose());
  });

  it('loads cards independently, caps panorama dimensions and reports completion in index order', async () => {
    const each = sinon.spy();
    const done = sinon.spy();
    loadCardTextures({
      count: 2,
      getSrc: (i) => `/card-${i}.jpg`,
      maxTexH: 100,
      getCrossOrigin: () => 'anonymous',
    }, each, done);
    expect(images.map((img) => [img.src, img.crossOrigin])).to.deep.equal([
      ['/card-0.jpg', 'anonymous'], ['/card-1.jpg', 'anonymous'],
    ]);
    images[1].naturalWidth = 1000;
    images[1].naturalHeight = 100;
    images[1].onload();
    await tick();
    expect(bitmapStub.firstCall.args[1]).to.include({ resizeWidth: 250, resizeHeight: 25 });
    expect(done.called).to.equal(false);
    images[0].naturalWidth = 100;
    images[0].naturalHeight = 200;
    images[0].onload();
    await tick();
    expect(each.args.map(([i]) => i)).to.deep.equal([1, 0]);
    expect(done.calledOnce).to.equal(true);
    expect(done.firstCall.args[1]).to.deep.equal([2, 2]);
    done.firstCall.args[0].forEach((tex) => tex.dispose());
  });

  it('falls back on card network/decode failures and invokes completion once', async () => {
    const done = sinon.spy();
    loadCardTextures({ count: 2, getSrc: (i) => `/bad-${i}`, maxTexH: 32 }, null, done);
    images[0].onerror();
    bitmapStub.rejects(new Error('decode'));
    images[1].naturalWidth = 40;
    images[1].naturalHeight = 20;
    images[1].onload();
    await tick();
    expect(done.calledOnce).to.equal(true);
    expect(done.firstCall.args[1]).to.deep.equal([4 / 6, 2]);
    expect(log.callCount).to.equal(2);
    done.firstCall.args[0].forEach((tex) => tex.dispose());
  });

  it('returns a cancellable modal Image and calls ready/error as appropriate', async () => {
    const ready = sinon.spy();
    const error = sinon.spy();
    const image = loadModalTexture('/large.jpg', 128, ready, error, 'use-credentials');
    expect(image).to.equal(images[0]);
    expect(image.crossOrigin).to.equal('use-credentials');
    image.naturalWidth = 400;
    image.naturalHeight = 200;
    image.onload();
    await tick();
    expect(bitmapStub.firstCall.args[1]).to.include({ resizeWidth: 128, resizeHeight: 64 });
    expect(ready.calledOnce).to.equal(true);
    ready.firstCall.args[0].dispose();
    loadModalTexture('/missing.jpg', 128, ready, error);
    images[1].onerror();
    expect(error.calledOnce).to.equal(true);
    expect(log.calledOnce).to.equal(true);
  });

  it('loads the authored heading font for the hint text', async () => {
    const load = sinon.stub(document.fonts, 'load').resolves([]);
    document.documentElement.style.setProperty('--heading-font-family', 'Test Heading');
    try {
      await loadHintFont('Explore');
      expect(load.calledOnceWith('900 100px Test Heading', 'Explore')).to.equal(true);
    } finally {
      load.restore();
      document.documentElement.style.removeProperty('--heading-font-family');
    }
  });

  it('creates landscape and portrait hint textures and releases their canvases after upload', () => {
    const landscape = createClickDragTexture(2, 'Explore');
    const portrait = createClickDragTexture(0.5, 'Explore');
    expect([landscape.image.width, landscape.image.height]).to.deep.equal([2048, 1024]);
    expect([portrait.image.width, portrait.image.height]).to.deep.equal([1024, 2048]);
    const canvas = landscape.image;
    landscape.onUpdate();
    expect([canvas.width, canvas.height]).to.deep.equal([0, 0]);
    landscape.dispose();
    portrait.dispose();
  });
});

describe('firefly-globe modal without a WebGL canvas', () => {
  let root;
  let modal;
  let scene;
  let sphere;
  let cards;
  let restore;
  let upgrade;
  let step;
  let clock;

  beforeEach(() => {
    clock = sinon.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    root = document.createElement('div');
    root.innerHTML = `<div class="firefly-globe-modal" aria-hidden="true">
      <div class="firefly-globe-modal-chrome">
        <button class="firefly-globe-modal-close"></button>
        <button class="firefly-globe-modal-nav-prev"></button>
        <button class="firefly-globe-modal-nav-next"></button>
        <div class="firefly-globe-modal-image"></div>
        <div class="firefly-globe-modal-name">
          <img class="firefly-globe-modal-model-icon"><span class="firefly-globe-modal-model-label"></span>
        </div>
        <div class="firefly-globe-modal-prompt"></div>
        <div class="firefly-globe-modal-counter"></div>
        <div class="firefly-globe-modal-position"></div>
        <div class="firefly-globe-modal-announce"></div>
        <a class="firefly-globe-modal-cta"></a>
      </div></div>`;
    document.body.append(root);
    const modalNode = root.firstElementChild;
    scene = new THREE.Scene();
    sphere = new THREE.Group();
    scene.add(sphere);
    cards = [0, 1].map(() => {
      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(1, 1),
        createCardMaterial({ texture: null, aspect: 1 }),
      );
      sphere.add(mesh);
      return {
        mesh,
        srcAspect: 1,
        spherePos: new THREE.Vector3(),
        sphereQuat: new THREE.Quaternion(),
        sphereScaleSX: 1,
        sphereScaleSY: 1,
      };
    });
    restore = sinon.spy();
    upgrade = sinon.spy(() => ({ src: '/upgrade' }));
    step = sinon.spy((i, dir) => (i + dir + 2) % 2);
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    camera.position.z = 30;
    modal = createGlobeModal({
      q: (sel) => root.querySelector(sel) || modalNode.querySelector(sel),
      getScene: () => scene,
      getCamera: () => camera,
      getSphereGroup: () => sphere,
      getRenderer: () => null,
      getCards: () => cards,
      getCount: () => cards.length,
      getCardMetadata: (i) => (i ? {} : {
        alt: 'Photo',
        modelId: 'firefly',
        modelVersionName: 'Firefly 3',
        prompt: 'A prompt',
        fireflyUrl: '/try',
      }),
      authoredNo: (i) => i + 1,
      stepCard: step,
      loadModalUpgrade: upgrade,
      getViewport: () => ({ W: 1000, H: 800 }),
      getCanvasTop: () => 0,
      getBP: () => 'md',
      getCardDims: () => ({ w: 1, h: 1 }),
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
      restoreFocusOnClose: restore,
      iconBaseUrl: '/libs/c2/blocks/firefly-globe/icons/',
    });
    modal.setup();
  });
  afterEach(() => {
    modal.destroy(true);
    cards.forEach(({ mesh, modalMat }) => {
      mesh.geometry.dispose();
      mesh.material.dispose();
      modalMat?.dispose();
    });
    root.remove();
    clock.restore();
  });

  it('moves DOM to body and populates metadata, then restores the card after close', () => {
    const el = document.querySelector('.firefly-globe-modal');
    expect(el.parentNode).to.equal(document.body);
    modal.open(0);
    expect(modal.getModalIdx()).to.equal(0);
    expect(el.querySelector('.firefly-globe-modal-image').getAttribute('aria-label')).to.equal('Photo');
    expect(el.querySelector('.firefly-globe-modal-model-icon').getAttribute('src'))
      .to.equal('/libs/c2/blocks/firefly-globe/icons/firefly.svg');
    expect(el.querySelector('.firefly-globe-modal-model-label').textContent).to.equal('Firefly 3');
    expect(el.querySelector('.firefly-globe-modal-counter').textContent).to.equal('01 / 02');
    expect(el.querySelector('.firefly-globe-modal-cta').getAttribute('href')).to.equal('/try');
    expect(modal.isCardManaged(cards[0])).to.equal(true);
    expect(upgrade.calledOnce).to.equal(true);
    modal.updateAnimation(false);
    el.querySelector('.firefly-globe-modal-close').click();
    modal.updateAnimation(false);
    clock.tick(350);
    expect(modal.getModalIdx()).to.equal(-1);
    expect(cards[0].mesh.parent).to.equal(sphere);
    expect(restore.firstCall.args).to.deep.equal([0]);
    expect(el.classList.contains('is-visible')).to.equal(false);
  });

  it('ignores invalid opens and navigation without a renderer, and destroys open state', () => {
    modal.open(100);
    expect(modal.getModalIdx()).to.equal(-1);
    modal.open(0);
    modal.setup();
    document.querySelector('.firefly-globe-modal-nav-next').click();
    expect(step.calledOnceWithExactly(0, 1)).to.equal(true);
    modal.navigate(-1);
    expect(step.callCount).to.equal(2);
    expect(modal.getModalIdx()).to.equal(0);
    modal.destroy(true);
    expect(modal.getModalIdx()).to.equal(-1);
    expect(document.querySelector('.firefly-globe-modal')).to.equal(null);
    expect(document.documentElement.classList.contains('firefly-globe-modal-open')).to.equal(false);
  });

  it('clears absent metadata and cancels a pending upgrade when opening another card', () => {
    modal.open(0);
    const pending = upgrade.firstCall.returnValue;
    const ready = upgrade.firstCall.args[1];
    modal.open(1);
    const el = document.querySelector('.firefly-globe-modal');
    expect(pending.onload).to.equal(null);
    expect(pending.onerror).to.equal(null);
    expect(pending.src).to.equal('');
    expect(el.querySelector('.firefly-globe-modal-image').getAttribute('aria-hidden')).to.equal('true');
    expect(el.querySelector('.firefly-globe-modal-model-icon').hasAttribute('hidden')).to.equal(true);
    expect(el.querySelector('.firefly-globe-modal-cta').hasAttribute('href')).to.equal(false);
    expect(el.querySelector('.firefly-globe-modal-counter').textContent).to.equal('02 / 02');
    const stale = { dispose: sinon.spy() };
    ready(stale);
    expect(stale.dispose.calledOnce).to.equal(true);
    expect(modal.getModalIdx()).to.equal(1);
  });

  it('accepts the active high-resolution texture and disposes it when another card opens', () => {
    modal.open(0);
    const ready = upgrade.firstCall.args[1];
    const texture = new THREE.Texture({ width: 800, height: 400 });
    const dispose = sinon.spy(texture, 'dispose');
    ready(texture);
    expect(cards[0].modalMat.uniforms.map.value).to.equal(texture);
    expect(cards[0].modalAspect).to.equal(2);

    modal.open(1);
    expect(dispose.calledOnce).to.equal(true);
    expect(cards[0].modalAspect).to.equal(0);
  });

  it('uses model id fallback text, hides unknown icons, and closes through dialog cancel', () => {
    modal.open(1);
    const el = document.querySelector('.firefly-globe-modal');
    const chrome = el.querySelector('.firefly-globe-modal-chrome');
    expect(el.querySelector('.firefly-globe-modal-model-label').textContent).to.equal('');
    expect(el.querySelector('.firefly-globe-modal-model-icon').hidden).to.equal(true);
    const cancel = new Event('cancel', { cancelable: true });
    chrome.dispatchEvent(cancel);
    expect(cancel.defaultPrevented).to.equal(true);
    modal.updateAnimation(false);
    clock.tick(350);
    expect(modal.getModalIdx()).to.equal(-1);
  });

  it('makes overflowing prompt copy keyboard-scrollable and removes the fade at the bottom', () => {
    modal.open(0);
    const prompt = document.querySelector('.firefly-globe-modal-prompt');
    Object.defineProperties(prompt, {
      scrollHeight: { configurable: true, value: 300 },
      clientHeight: { configurable: true, value: 100 },
      scrollTop: { configurable: true, writable: true, value: 0 },
    });
    prompt.dispatchEvent(new Event('scroll'));
    expect(prompt.tabIndex).to.equal(0);
    expect(prompt.classList.contains('is-faded-bottom')).to.equal(true);
    prompt.scrollTop = 200;
    prompt.dispatchEvent(new Event('scroll'));
    expect(prompt.classList.contains('is-faded-top')).to.equal(true);
    expect(prompt.classList.contains('is-faded-bottom')).to.equal(false);
  });
});
