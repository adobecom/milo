import { expect } from '@esm-bundle/chai';
import * as THREE from '../../../../libs/deps/three.js';
import createQuoteParticles, { QUOTE_LIVE_P, parseMotion, coherentOrder } from '../../../../libs/c2/blocks/globe-gallery/src/quote-particles.js';

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
    await fx.setSources([], 800, 600);
    const points = fx.object.children.find((o) => o instanceof THREE.Points);
    const plane = fx.object.children.find((o) => !(o instanceof THREE.Points));
    expect(points.geometry.attributes.position.count).to.equal(2000);
    const pos = points.geometry.attributes.position.array;
    const box = figureEl.getBoundingClientRect();
    const rail = railEl.getBoundingClientRect();
    for (let i = 0; i < pos.length; i += 3) {
      expect(pos[i]).to.be.within(box.left - rail.left - 6, box.right - rail.left + 6);
      expect(pos[i + 1]).to.be.within(box.top - rail.top - 6, box.bottom - rail.top + 6);
    }
    expect(plane.material.uniforms.uMap.value).to.be.instanceOf(THREE.CanvasTexture);
  });

  it('tiles each card with a draw over its real texture, or spreads over the view', async () => {
    const { figureEl, railEl } = mount();
    fx = createQuoteParticles({ figureEl, railEl, count: 500 });
    await fx.layout({ dpr: 1 });
    // A 100 × 200 px card at (100, 100), seen straight on; a second one fully off screen.
    const card = (x0) => ({
      project: (u, v) => [x0 + 100 * u, 100 + 200 * v],
      origin: new THREE.Vector3(-1, 2, -30),
      axisU: new THREE.Vector3(2, 0, 0),
      axisV: new THREE.Vector3(0, -4, 0),
      tex: new THREE.Texture(),
      repeat: new THREE.Vector2(1, 1),
      offset: new THREE.Vector2(0, 0),
      mirror: false,
      aspect: 0.5,
      radius: 0.03,
      alpha: 1,
      order: -5,
    });
    await fx.setSources([card(100), card(5000)], 800, 600);
    expect(fx.drawCount()).to.equal(2); // one card draw + the text plane
    const points = fx.object.children.find((o) => o instanceof THREE.Points);
    const { aUv, aRand } = points.geometry.attributes;
    expect(aUv.count).to.be.within(450, 500);
    let edge = 0; let centre = 0; let ne = 0; let nc = 0;
    for (let i = 0; i < aUv.count; i += 1) {
      const u = aUv.array[i * 2];
      const v = aUv.array[i * 2 + 1];
      expect(u).to.be.within(0, 1);
      expect(v).to.be.within(0, 1);
      const inner = Math.min(u, 1 - u, v, 1 - v);
      if (inner < 0.1) { edge += aRand.array[i * 4]; ne += 1; }
      if (inner > 0.4) { centre += aRand.array[i * 4]; nc += 1; }
    }
    // Edge first: the rim departs well before the middle.
    expect(edge / ne).to.be.below(centre / nc);
    expect(points.material.uniforms.uMap.value).to.be.instanceOf(THREE.Texture);
    await fx.setSources([], 800, 600);
    expect(fx.drawCount()).to.equal(2);
    const fallback = fx.object.children.find((o) => o instanceof THREE.Points);
    expect(fallback.material.uniforms.uScreenSrc.value).to.equal(1);
  });

  it('crosses from points to the text plane and idles once drawn at rest', async () => {
    const { figureEl, railEl } = mount();
    fx = createQuoteParticles({ figureEl, railEl, count: 500 });
    await fx.layout({ dpr: 1 });
    await fx.setSources([], 800, 600);
    const points = fx.object.children.find((o) => o instanceof THREE.Points);
    const plane = fx.object.children.find((o) => !(o instanceof THREE.Points));
    const view = { W: 800, H: 600, dpr: 1 };
    fx.update(0, { ...view, active: false });
    expect(fx.object.visible).to.be.false;
    fx.update(0.3, view);
    expect(fx.object.visible).to.be.true;
    expect(points.visible).to.be.true;
    expect(plane.visible).to.be.false;
    fx.update(1, view);
    expect(points.visible).to.be.false;
    expect(plane.visible).to.be.true;
    expect(plane.material.uniforms.uP.value).to.equal(1);
    expect(QUOTE_LIVE_P).to.be.below(1);
    expect(fx.isIdle()).to.be.false;
    fx.markDrawn();
    expect(fx.isIdle()).to.be.true;
    fx.update(1, { ...view, W: 900 });
    expect(fx.isIdle()).to.be.false;
    fx.markDrawn();
    fx.invalidate();
    expect(fx.isIdle()).to.be.false;
    fx.update(0.5, { ...view, zoom: [0.2, 0.4, 57, 117] });
    expect(points.material.uniforms.uZoomT.value.toArray()).to.deep.equal([0.2, 0.4]);
    expect(points.material.uniforms.uCamZ.value.toArray()).to.deep.equal([57, 117]);
    fx.update(1, { ...view, active: false });
    expect(fx.object.visible).to.be.false;
  });

  it('lands each glyph by reading order and is still once the last one is crisp', async () => {
    const { figureEl, railEl } = mount();
    fx = createQuoteParticles({ figureEl, railEl, count: 800 });
    await fx.layout({ dpr: 1 });
    await fx.setSources([], 800, 600);
    const points = fx.object.children.find((o) => o instanceof THREE.Points);
    const { position, aRand } = points.geometry.attributes;
    let left = 0; let right = 0; let nl = 0; let nr = 0;
    for (let i = 0; i < position.count; i += 1) {
      const arrive = aRand.array[i * 4 + 3];
      expect(arrive).to.be.within(0.45 - 0.02, 0.8 + 0.02 + 1e-6); // ± the arrival jitter
      expect(arrive - aRand.array[i * 4]).to.be.at.least(0.15 - 1e-6); // no rushed flight
      if (position.array[i * 3] < 300) {
        left += arrive; nl += 1;
      } else {
        right += arrive; nr += 1;
      }
    }
    expect(left / nl).to.be.below(right / nr);
    const view = { W: 800, H: 600, dpr: 1 };
    fx.update(QUOTE_LIVE_P, view);
    expect(points.visible).to.be.false;
    fx.markDrawn();
    fx.update(0.97, view);
    expect(fx.isIdle()).to.be.true; // nothing left to fill in after the last landing
  });

  it('stays unready for an empty figure', async () => {
    const { figureEl, railEl } = mount('');
    figureEl.querySelector('p').textContent = '';
    fx = createQuoteParticles({ figureEl, railEl, count: 100 });
    expect(await fx.layout({ dpr: 1 })).to.be.false;
    expect(fx.isReady()).to.be.false;
  });

  it('parses the motion mode, falling back to abc', () => {
    expect(parseMotion('?pqmotion=swirl')).to.equal('swirl');
    expect(parseMotion('?martech=off&pqmotion=converge')).to.equal('converge');
    expect(parseMotion('?pqmotion=abc')).to.equal('abc');
    expect(parseMotion('?pqmotion=toString')).to.equal('abc');
    expect(parseMotion('?pqmotion=nope')).to.equal('abc');
    expect(parseMotion('')).to.equal('abc');
  });

  it('orders points so consecutive points are near each other', () => {
    const N = 4096;
    const xs = new Float32Array(N).map(() => Math.random() * 1000);
    const ys = new Float32Array(N).map(() => Math.random() * 600);
    const order = coherentOrder(xs, ys);
    expect(new Set(order).size).to.equal(N);
    let step = 0; let rand = 0;
    for (let i = 1; i < N; i += 1) {
      step += Math.hypot(xs[order[i]] - xs[order[i - 1]], ys[order[i]] - ys[order[i - 1]]);
      rand += Math.hypot(xs[i] - xs[i - 1], ys[i] - ys[i - 1]);
    }
    expect(step).to.be.below(rand / 6);
  });

  ['abc', 'swirl', 'converge'].forEach((motion) => {
    it(`pairs card pixels with nearby targets (${motion})`, async () => {
      const { figureEl, railEl } = mount();
      fx = createQuoteParticles({ figureEl, railEl, count: 3000, motion });
      await fx.layout({ dpr: 1 });
      // Cards spread around the quote, as on the page: pixels should go to the nearer glyphs,
      // not across the figure.
      const card = (x0, y0) => ({
        project: (u, v) => [x0 + 200 * u, y0 + 150 * v],
        origin: new THREE.Vector3(),
        axisU: new THREE.Vector3(1, 0, 0),
        axisV: new THREE.Vector3(0, -1, 0),
        tex: new THREE.Texture(),
        repeat: new THREE.Vector2(1, 1),
        offset: new THREE.Vector2(0, 0),
        mirror: false,
        aspect: 1.2,
        radius: 0.03,
        alpha: 1,
        order: 0,
      });
      await fx.setSources([card(0, 400), card(560, 0)], 800, 600);
      const stats = fx.getStats();
      expect(stats.count).to.be.within(2800, 3000);
      expect(stats.meanPath).to.be.below(stats.meanPathRandom * 0.8);
      const draws = fx.object.children.filter((o) => o instanceof THREE.Points);
      expect(draws).to.have.length(2);
      draws.forEach((d) => {
        expect(d.material.defines.PQ_MOTION).to.equal({ abc: 0, swirl: 1, converge: 2 }[motion]);
        const { aRand } = d.geometry.attributes;
        for (let i = 0; i < aRand.count; i += 1) {
          const [leave, arrive] = [aRand.array[i * 4], aRand.array[i * 4 + 3]];
          expect(leave).to.be.at.least(0);
          expect(arrive).to.be.above(leave);
          expect(arrive).to.be.at.most(QUOTE_LIVE_P);
        }
      });
      // The left card mostly feeds glyphs further left than the right card does.
      const meanX = (d) => {
        const pos = d.geometry.attributes.position;
        let sum = 0;
        for (let i = 0; i < pos.count; i += 1) sum += pos.array[i * 3];
        return sum / pos.count;
      };
      expect(meanX(draws[0])).to.be.below(meanX(draws[1]));
    });
  });
});
