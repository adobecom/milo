import { expect } from '@esm-bundle/chai';
import createQuoteParticles, { rasterizeQuote, colorGrid, pendingFonts } from '../../../../libs/c2/blocks/globe-gallery/src/quote-particles.js';
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

  it('shrinks a card photo to a cached colour grid, and tolerates a missing image', () => {
    const c = document.createElement('canvas');
    c.width = 64;
    c.height = 32;
    const ctx = c.getContext('2d');
    ctx.fillStyle = 'rgb(255, 0, 0)';
    ctx.fillRect(0, 0, 64, 32);
    const grid = colorGrid(c);
    expect(grid.w).to.equal(256);
    expect(grid.h).to.equal(128);
    expect(grid.data[0]).to.equal(255);
    expect(grid.data[1]).to.equal(0);
    expect(colorGrid(c)).to.equal(grid);
    expect(colorGrid(null)).to.be.null;
  });

  it('reports no pending fonts for a system font', () => {
    const { fig } = mountFigure();
    expect(pendingFonts(fig)).to.be.an('array');
  });

  it('builds a points object, spreads sources over the far-side quads, and disposes', () => {
    const { fig } = mountFigure();
    const added = [];
    const scene = {
      add: (o) => added.push(o),
      remove: (o) => added.splice(added.indexOf(o), 1),
    };
    const fx = createQuoteParticles(scene, 1000);
    expect(fx.isBuilt()).to.be.false;
    const targets = rasterizeQuote(fig, 0, 500);
    // Sources set before the build are kept and applied to it.
    const quad = {
      pts: [100, 100, 200, 100, 200, 300, 100, 300],
      project: (u, v) => [100 + 100 * u, 100 + 200 * v],
      alpha: 0.5,
      mirror: false,
      image: null,
      repeat: { x: 1, y: 1 },
      offset: { x: 0, y: 0 },
    };
    fx.setSources([quad], 800, 600);
    fx.build(targets);
    expect(fx.isBuilt()).to.be.true;
    expect(added).to.have.length(1);
    const pts = added[0];
    expect(pts.isPoints).to.be.true;
    expect(pts.isMesh).to.be.false;
    expect(pts.frustumCulled).to.be.false;
    expect(pts.visible).to.be.false;
    const src = pts.geometry.getAttribute('aSrc').array;
    const size = pts.geometry.getAttribute('aSrcSize').array;
    const col = pts.geometry.getAttribute('aSrcColor').array;
    for (let i = 0; i < targets.count; i += 1) {
      expect(src[i * 2]).to.be.within(100, 200);
      expect(src[i * 2 + 1]).to.be.within(100, 300);
      expect(col[i * 4 + 3]).to.equal(0.5);
      expect(size[i]).to.be.greaterThan(0);
    }
    // A grid of tiles: 500 over a 100×200 card is ~16×31 cells of ~6.3px, drawn at 1.2×.
    expect(size[0]).to.be.within(6, 10);
    // No far-side card left: sources start invisible.
    fx.setSources([], 800, 600);
    expect(pts.geometry.getAttribute('aSrcColor').array[3]).to.equal(0);
    fx.setFrame({
      p: 0.5, fadeIn: 1, fade: 1, pinTop: 0, W: 800, H: 600, dpr: 1,
    });
    expect(pts.material.uniforms.uP.value).to.equal(0.5);
    expect(pts.material.uniforms.uIn.value).to.equal(1);
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
