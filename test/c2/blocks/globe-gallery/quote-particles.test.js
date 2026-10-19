import { expect } from '@esm-bundle/chai';
import * as THREE from '../../../../libs/deps/three.js';
import createQuoteParticles, { QUOTE_LIVE_P } from '../../../../libs/c2/blocks/globe-gallery/src/quote-particles.js';

function mount(quote = 'Creativity connects us.') {
  document.body.innerHTML = `
    <div class="rail" style="position:relative;height:600px;width:800px">
      <figure class="fig" style="position:absolute;top:100px;left:50px;width:600px;margin:0;padding:24px;
        --gg-crosshair-width:1px;--gg-pq-rule-color:#444">
        <blockquote class="globe-gallery-pullquote-quote" style="--gg-pq-ink:#fafafa;font:40px/48px sans-serif;margin:0">${quote}</blockquote>
        <p class="globe-gallery-pullquote-name" style="--gg-pq-ink:#fafafa;font:16px sans-serif;margin:0">Alex</p>
      </figure>
    </div>`;
  return {
    figureEl: document.querySelector('.fig'),
    railEl: document.querySelector('.rail'),
  };
}

describe('globe-gallery: quote particles', () => {
  let fx;
  afterEach(() => {
    fx?.dispose();
    fx = null;
    document.body.innerHTML = '';
  });

  it('samples every target from the drawn quote inside the figure box', async () => {
    const { figureEl, railEl } = mount();
    fx = createQuoteParticles({ figureEl, railEl, count: 2000 });
    expect(await fx.layout({ dpr: 1 })).to.be.true;
    expect(fx.isReady()).to.be.true;
    const [points, plane] = fx.object.children;
    expect(points).to.be.instanceOf(THREE.Points);
    const pos = points.geometry.attributes.position.array;
    const box = figureEl.getBoundingClientRect();
    const rail = railEl.getBoundingClientRect();
    for (let i = 0; i < pos.length; i += 3) {
      expect(pos[i]).to.be.within(box.left - rail.left - 6, box.right - rail.left + 6);
      expect(pos[i + 1]).to.be.within(box.top - rail.top - 6, box.bottom - rail.top + 6);
    }
    expect(plane.material.uniforms.uMap.value).to.be.instanceOf(THREE.CanvasTexture);
  });

  it('tiles each card quad edge to edge, or spreads over the viewport without any', async () => {
    const { figureEl, railEl } = mount();
    fx = createQuoteParticles({ figureEl, railEl, count: 500 });
    await fx.layout({ dpr: 1 });
    const { aSrc, aSrcSize, aSrcCol } = fx.object.children[0].geometry.attributes;
    // A 100 × 200 px card at (100, 100), seen straight on.
    const project = (u, v) => [100 + 100 * u, 100 + 200 * v];
    fx.setSources([{
      pts: [100, 100, 200, 100, 200, 300, 100, 300],
      project,
      alpha: 0.5,
      tex: null,
      mirror: false,
      repeat: { x: 1, y: 1 },
      offset: { x: 0, y: 0 },
    }], 800, 600);
    let covered = 0;
    for (let i = 0; i < 500; i += 1) {
      expect(aSrc.array[i * 2]).to.be.within(100, 200);
      expect(aSrc.array[i * 2 + 1]).to.be.within(100, 300);
      expect(aSrcCol.array[i * 4 + 3]).to.equal(0.5);
      covered += aSrcSize.array[i] ** 2;
    }
    // Tiles overlap a little, so together they cover at least the card.
    expect(covered).to.be.at.least(100 * 200);
    fx.setSources([], 800, 600);
    expect(aSrcCol.array[3]).to.equal(0);
    expect(aSrc.array[0]).to.be.within(0, 800);
  });

  it('crosses from points to the text plane and idles once drawn at rest', async () => {
    const { figureEl, railEl } = mount();
    fx = createQuoteParticles({ figureEl, railEl, count: 500 });
    await fx.layout({ dpr: 1 });
    const [points, plane] = fx.object.children;
    const view = { W: 800, H: 600, dpr: 1 };
    fx.update(0, { ...view, active: false });
    expect(fx.object.visible).to.be.false;
    fx.update(0.3, view);
    expect(fx.object.visible).to.be.true;
    expect(points.visible).to.be.true;
    expect(plane.visible).to.be.false;
    fx.update(1, view);
    expect(points.visible).to.be.false;
    expect(plane.material.uniforms.uOpacity.value).to.equal(1);
    expect(QUOTE_LIVE_P).to.be.below(1);
    expect(fx.isIdle()).to.be.false;
    fx.markDrawn();
    expect(fx.isIdle()).to.be.true;
    fx.update(1, { ...view, W: 900 });
    expect(fx.isIdle()).to.be.false;
    fx.markDrawn();
    fx.invalidate();
    expect(fx.isIdle()).to.be.false;
    fx.update(0.5, { ...view, fadeIn: 0.25 });
    expect(points.material.uniforms.uIn.value).to.equal(0.25);
    fx.update(1, { ...view, active: false });
    expect(fx.object.visible).to.be.false;
  });

  it('stays unready for an empty figure', async () => {
    const { figureEl, railEl } = mount('');
    figureEl.querySelector('p').textContent = '';
    fx = createQuoteParticles({ figureEl, railEl, count: 100 });
    expect(await fx.layout({ dpr: 1 })).to.be.false;
    expect(fx.isReady()).to.be.false;
  });
});
