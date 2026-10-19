import { expect } from '@esm-bundle/chai';
import createQuoteParticles, { MAX_CARDS, rasterizeQuote, sampleCardPalette, pendingFonts } from '../../../../libs/c2/blocks/globe-gallery/src/quote-particles.js';
import { buildGlobeDom } from '../../../../libs/c2/blocks/globe-gallery/src/authoring.js';

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
    expect(t.count).to.be.greaterThan(100).and.at.most(5000);
    expect(t.dst).to.have.length(t.count * 3);
    expect(t.color).to.have.length(t.count * 3);
    for (let i = 0; i < t.count; i += 1) {
      expect(t.dst[i * 3]).to.be.within(box.left, box.right + 1);
      expect(t.dst[i * 3 + 1] + originTop).to.be.within(box.top, box.bottom + 1);
    }
    expect(t.size).to.be.within(1.2, 4);
  });

  it('caps the target count at the budget and skips sr-only text', () => {
    const { fig } = mountFigure();
    const all = rasterizeQuote(fig, 0, 1e9);
    const capped = rasterizeQuote(fig, 0, 200);
    expect(capped.count).to.equal(200);
    fig.querySelector('.sr-only').textContent = 'Something much longer that would add a lot of ink';
    expect(Math.abs(rasterizeQuote(fig, 0, 1e9).count - all.count)).to.be.below(all.count * 0.05);
  });

  it('returns null with nothing to draw', () => {
    const { fig } = mountFigure();
    expect(rasterizeQuote(fig, 0, 0)).to.be.null;
    fig.querySelectorAll('blockquote, figcaption').forEach((el) => { el.textContent = ''; });
    expect(rasterizeQuote(fig, 0, 1000)).to.be.null;
  });

  it('samples a card palette, and tolerates a missing image', () => {
    const c = document.createElement('canvas');
    c.width = 24;
    c.height = 32;
    const ctx = c.getContext('2d');
    ctx.fillStyle = 'rgb(255, 0, 0)';
    ctx.fillRect(0, 0, 24, 32);
    const pal = sampleCardPalette(c);
    expect(pal).to.have.length(12 * 16 * 3);
    expect(pal[0]).to.be.closeTo(1, 0.01);
    expect(pal[1]).to.be.closeTo(0, 0.01);
    expect(sampleCardPalette(null)).to.be.null;
  });

  it('reports no pending fonts for a system font', () => {
    const { fig } = mountFigure();
    expect(pendingFonts(fig)).to.be.an('array');
  });

  it('builds a points object into the scene and disposes it', () => {
    const { fig } = mountFigure();
    const added = [];
    const scene = {
      add: (o) => added.push(o),
      remove: (o) => added.splice(added.indexOf(o), 1),
    };
    const fx = createQuoteParticles(scene, 1000);
    expect(fx.isBuilt()).to.be.false;
    const targets = rasterizeQuote(fig, 0, 500);
    fx.scatterCardQuads(800, 600);
    fx.build({ targets, palettes: [null], cardCount: MAX_CARDS + 10 });
    expect(fx.isBuilt()).to.be.true;
    expect(added).to.have.length(1);
    const pts = added[0];
    expect(pts.isPoints).to.be.true;
    expect(pts.isMesh).to.be.false;
    expect(pts.frustumCulled).to.be.false;
    expect(pts.visible).to.be.false;
    const slots = pts.geometry.getAttribute('aCard').array;
    for (let i = 0; i < targets.count; i += 1) expect(slots[i * 3]).to.be.below(MAX_CARDS);
    fx.setCardQuad(MAX_CARDS + 1, 0, 0, 0, 0, 0, 0); // out of range: ignored
    fx.setFrame({
      fly: 0.5, fade: 1, pinTop: 0, W: 800, H: 600, dpr: 1,
    });
    expect(pts.material.uniforms.uFly.value).to.equal(0.5);
    fx.setVisible(true);
    expect(pts.visible).to.be.true;
    fx.dispose();
    expect(added).to.have.length(0);
    expect(fx.isBuilt()).to.be.false;
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
