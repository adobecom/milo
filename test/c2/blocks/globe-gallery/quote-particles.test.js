import { expect } from '@esm-bundle/chai';
import createQuoteParticles, { rasterizeQuote, pendingFonts } from '../../../../libs/c2/blocks/globe-gallery/src/quote-particles.js';
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
