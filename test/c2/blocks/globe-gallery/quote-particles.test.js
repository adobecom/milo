import { expect } from '@esm-bundle/chai';
import createQuoteParticles, {
  rasterizeQuote, pendingFonts, readingOrder, readingX, revealFront, coherentOrder, flightWindow,
} from '../../../../libs/c2/blocks/globe-gallery/src/quote-particles.js';
import { Vector3 } from '../../../../libs/deps/three.js';
import { buildGlobeDom } from '../../../../libs/c2/blocks/globe-gallery/src/authoring.js';
import * as TL from '../../../../libs/c2/blocks/globe-gallery/src/timeline.js';

function mountFigure() {
  document.body.innerHTML = `
    <div class="pin" style="position:relative;padding-top:40px">
      <figure class="fig" style="margin:0;width:400px;font:32px sans-serif;color:rgb(250, 250, 250)">
        <blockquote style="margin:0">Hello world again</blockquote>
        <span class="sr-only">Hidden duplicate copy</span>
        <figcaption style="color:rgb(198, 198, 198)">Name</figcaption>
      </figure>
    </div>`;
  return {
    pin: document.querySelector('.pin'),
    fig: document.querySelector('.fig'),
  };
}

describe('globe-gallery: quote particles', () => {
  afterEach(() => { document.body.innerHTML = ''; });

  it('rasterizes the DOM text into in-box targets relative to the origin', () => {
    const { pin, fig } = mountFigure();
    const originTop = pin.getBoundingClientRect().top;
    const box = fig.getBoundingClientRect();
    const t = rasterizeQuote(fig, originTop, 5000);
    expect(t).to.exist;
    expect(t.count).to.equal(5000);
    expect(t.dst).to.have.length(t.count * 3);
    expect(t.color).to.have.length(t.count * 3);
    for (let i = 0; i < t.count; i += 1) {
      expect(t.dst[i * 3]).to.be.within(box.left, box.right + 1);
      expect(t.dst[i * 3 + 1] + originTop).to.be.within(box.top, box.bottom + 1);
    }
    expect(t.size).to.be.within(1.2, 4);
  });

  it('always fills the budget, cycling the ink when it is short, and skips sr-only text', () => {
    const { fig } = mountFigure();
    expect(rasterizeQuote(fig, 0, 200).count).to.equal(200);
    const many = rasterizeQuote(fig, 0, 200000);
    expect(many.count).to.equal(200000);
    const before = rasterizeQuote(fig, 0, 5000);
    fig.querySelector('.sr-only').textContent = 'Something much longer that would add a lot of ink';
    const after = rasterizeQuote(fig, 0, 5000);
    // The same ink either way: the dot size (ink per particle) is unchanged.
    expect(after.size).to.be.closeTo(before.size, 0.05);
  });

  it('returns null with nothing to draw', () => {
    const { fig } = mountFigure();
    expect(rasterizeQuote(fig, 0, 0)).to.be.null;
    fig.querySelectorAll('blockquote, figcaption').forEach((el) => { el.textContent = ''; });
    expect(rasterizeQuote(fig, 0, 1000)).to.be.null;
  });

  it('reports no pending fonts for a system font', () => {
    const { fig } = mountFigure();
    expect(pendingFonts(fig)).to.be.an('array');
  });

  it('lays tiles over the far-side cards in world space, one draw per card, and disposes', () => {
    const { fig } = mountFigure();
    const added = [];
    const scene = {
      add: (o) => added.push(o),
      remove: (o) => added.splice(added.indexOf(o), 1),
    };
    const fx = createQuoteParticles(scene, 1000);
    expect(fx.isBuilt()).to.be.false;
    const targets = rasterizeQuote(fig, 0, 500);
    // Two cards: a 100×200 px one and a 50×50 px one, on the z = −10 plane in world space.
    const card = (x0, y0, w, h) => ({
      project: (u, v) => [x0 + w * u, y0 + h * v],
      world: (u, v, out) => out.set(x0 + w * u, -(y0 + h * v), -10),
      axisU: new Vector3(w, 0, 0),
      axisV: new Vector3(0, h, 0),
      depth: 10,
      texture: { isTexture: true },
      repeat: { x: 1, y: 1 },
      offset: { x: 0, y: 0 },
      aspect: w / h,
      radius: 0.03,
      ca: 0,
      mirror: false,
      alpha: 0.5,
    });
    // Sources set before the build are kept and applied to it.
    fx.setSources([card(100, 100, 100, 200), card(400, 100, 50, 50)], 800, 600);
    fx.build(targets);
    expect(fx.isBuilt()).to.be.true;
    expect(added).to.have.length(1);
    const pts = added[0];
    expect(pts.isPoints).to.be.true;
    expect(pts.isMesh).to.be.false;
    expect(pts.frustumCulled).to.be.false;
    expect(pts.visible).to.be.false;
    // One contiguous group per card, sized by on-screen area (20000 : 2500 px²).
    const { groups } = pts.geometry;
    expect(fx.getDrawCount()).to.equal(2);
    expect(groups[0].count + groups[1].count).to.equal(500);
    expect(groups[0].count).to.be.within(440, 450);
    expect(pts.material[0].uniforms.uAlpha.value).to.equal(0.5);
    const w = pts.geometry.getAttribute('aSrcWorld').array;
    const uv = pts.geometry.getAttribute('aUv').array;
    const rel = pts.geometry.getAttribute('aRelease').array;
    for (let i = 0; i < groups[0].count; i += 1) {
      expect(w[i * 3]).to.be.within(100, 200);
      expect(-w[i * 3 + 1]).to.be.within(100, 300);
      expect(w[i * 3 + 2]).to.equal(-10);
      expect(uv[i * 2]).to.be.within(0, 1);
    }
    // Edge-first: a rim tile is released before a centre tile.
    let rimRel = Infinity; let midRel = -Infinity;
    for (let i = 0; i < groups[0].count; i += 1) {
      const edge = Math.min(uv[i * 2], 1 - uv[i * 2], uv[i * 2 + 1], 1 - uv[i * 2 + 1]);
      if (edge < 0.05) rimRel = Math.min(rimRel, rel[i]);
      if (edge > 0.4) midRel = Math.max(midRel, rel[i]);
    }
    expect(rimRel).to.be.below(midRel);
    // No far-side card left: one invisible stand-in group.
    fx.setSources([], 800, 600);
    expect(fx.getDrawCount()).to.equal(1);
    expect(pts.material[0].uniforms.uAlpha.value).to.equal(0);
    fx.setFrame({
      p: 0.5, fade: 1, pinTop: 0, W: 800, H: 600, dpr: 1, zoom: [0.2, 0.1], camZ: [57, -60],
    });
    expect(pts.material[0].uniforms.uP.value).to.equal(0.5);
    expect(pts.material[0].uniforms.uZoom.value.x).to.equal(0.2);
    fx.setVisible(true);
    expect(pts.visible).to.be.true;
    fx.dispose();
    expect(added).to.have.length(0);
    expect(fx.isBuilt()).to.be.false;
  });

  it('pairs sources with targets by position, holding them on the cards until paired', async () => {
    const { fig } = mountFigure();
    const scene = { add: () => {}, remove: () => {} };
    const fx = createQuoteParticles(scene, 1000);
    const targets = rasterizeQuote(fig, 0, 2000);
    let pts = null;
    fx.build(targets);
    scene.add = (o) => { pts = o; };
    // Four cards tiling the area the quote lands in, as the far side does around the view centre.
    const card = (x0, y0) => ({
      project: (u, v) => [x0 + 210 * u, y0 + 110 * v],
      world: (u, v, out) => out.set(x0 + 210 * u, -(y0 + 110 * v), -10),
      axisU: new Vector3(210, 0, 0),
      axisV: new Vector3(0, 110, 0),
      depth: 10,
      texture: { isTexture: true },
      repeat: { x: 1, y: 1 },
      offset: { x: 0, y: 0 },
      aspect: 210 / 110,
      radius: 0.03,
      ca: 0,
      mirror: false,
      alpha: 1,
    });
    const cards = [card(0, 0), card(210, 0), card(0, 110), card(210, 110)];
    fx.build(targets);
    const pending = fx.setSources(cards, 800, 600);
    // The hand-off frame: nothing departs or reveals yet.
    const seed = pts.geometry.getAttribute('aSeed').array;
    expect(seed[1]).to.be.above(1);
    const stats = await pending;
    // Locality: the coherent pairing's mean path is far shorter than a random pairing's.
    // (The fixture's source and target extents differ, which sets a floor on any pairing's path.)
    expect(stats.meanPath).to.be.below(stats.meanPathRandom * 0.75);
    // Every particle now departs after its release and lands in reading order.
    const rel = pts.geometry.getAttribute('aRelease').array;
    for (let i = 0; i < 2000; i += 1) {
      expect(seed[i * 4 + 1]).to.be.at.least(rel[i]);
      expect(seed[i * 4 + 3]).to.be.above(seed[i * 4 + 1]);
      expect(seed[i * 4 + 3]).to.be.at.most(1);
    }
    fx.dispose();
  });

  it('orders points by x bands then y, and flies a fixed time ending at the arrival', () => {
    const xs = Float32Array.from({ length: 64 }, (_, i) => i % 8);
    const ys = Float32Array.from({ length: 64 }, (_, i) => Math.floor(i / 8));
    const order = [...coherentOrder(xs, ys)];
    expect(new Set(order).size).to.equal(64);
    // The first band is the leftmost column, read top to bottom.
    expect(order.slice(0, 8).map((i) => xs[i])).to.deep.equal(new Array(8).fill(0));
    expect(order.slice(0, 8).map((i) => ys[i])).to.deep.equal([0, 1, 2, 3, 4, 5, 6, 7]);
    const [leave, arrive] = flightWindow(1, 1, 0.05);
    expect(arrive - leave).to.be.closeTo(0.3, 0.001);
    const [early] = flightWindow(0, 1, 0.25);
    expect(early).to.be.at.least(0.29); // never before it has let go of the camera
  });

  it('reveals the text in the same reading-order wave the particles land in', () => {
    const box = { x0: 0, x1: 1000, y0: 0, y1: 500, rtl: false };
    expect(readingOrder(0, 0, box)).to.equal(0);
    expect(readingOrder(1000, 500, box)).to.equal(1);
    expect(readingX(readingOrder(420, 250, box), 250, box)).to.be.closeTo(420, 1e-6);
    const rtl = { ...box, rtl: true };
    expect(readingX(readingOrder(420, 250, rtl), 250, rtl)).to.be.closeTo(420, 1e-6);
    // Nothing crisp before the first arrival; all of it crisp before the flight ends.
    expect(revealFront(0.5).o0).to.be.below(0);
    expect(revealFront(1).o1).to.be.above(1);
    const mid = revealFront(0.75);
    expect(mid.o1).to.be.below(mid.o0);
  });

  it('maps a zoomT back to scroll, net of the quote hold', () => {
    const span = { blockDocTop: 1000, blockHeight: 6200, formPx: 3600, holdPx: 700 };
    const y = TL.scrollYAtZoomT(0.3, span);
    const frame = TL.createFrame();
    const input = { ...TL.createFrameInput(), ...span, scrollY: y, viewportH: 1000, arcScale: 1 };
    TL.deriveFrame(frame, input);
    expect(frame.zoomT).to.be.closeTo(0.3, 1e-6);
    input.scrollY = span.blockDocTop + span.blockHeight - span.holdPx + 10;
    TL.deriveFrame(frame, input);
    expect(frame.zoomT).to.equal(1);
  });

  it('builds the pin as a single sticky wrapper around the figure', () => {
    const el = document.createElement('div');
    document.body.append(el);
    buildGlobeDom(el, {}, {
      arcCopy: { title: 'T', body: [] },
      pullQuote: { quote: 'Q', name: 'N', role: 'R' },
      touchHint: { paras: [], text: 'hint' },
    });
    const pin = el.querySelector('.globe-gallery-pullquote-pin');
    expect(pin.firstElementChild.matches('figure.globe-gallery-pullquote')).to.be.true;
    expect(el.querySelector('.globe-gallery-pullquote-rail')).to.be.null;
    expect(pin.previousElementSibling.matches('.globe-gallery-arc-copy')).to.be.true;
  });
});
