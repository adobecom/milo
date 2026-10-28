import { expect } from '@esm-bundle/chai';
import * as THREE from '../../../../libs/deps/three.js';

// Shared by globe-gallery and firefly-globe: `block` is the class prefix, `pre` the CSS var prefix,
// `mod` the block's quote-particles.js.
export default function quoteParticlesSuite({ block, pre, mod }) {
  const { default: createQuoteParticles, QUOTE_LIVE_P, coherentOrder, createCardScatter } = mod;

  // A static camera at z 0 (zoom span 0), fov 60 over an 800 × 600 view.
  const cam = new THREE.PerspectiveCamera(60, 800 / 600, 0.1, 100);
  const E = cam.projectionMatrix.elements;
  const VIEW = { W: 800, H: 600, zoom: [0, 0, 0, 0], proj: [E[0], E[5], E[8], E[9]] };
  // A card facing the camera at depth D, its screen box (x0, y0, w, h) px from the static camera.
  function cardAt(x0, y0, w, h, D = 30) {
    const X = (x) => ((2 * x) / 800 - 1) * (D / E[0]);
    const Y = (y) => (1 - (2 * y) / 600) * (D / E[5]);
    return {
      origin: new THREE.Vector3(X(x0), Y(y0), -D),
      axisU: new THREE.Vector3(X(x0 + w) - X(x0), 0, 0),
      axisV: new THREE.Vector3(0, Y(y0 + h) - Y(y0), 0),
      tex: new THREE.Texture(),
      repeat: new THREE.Vector2(1, 1),
      offset: new THREE.Vector2(0, 0),
      aspect: w / h,
      radius: 0.03,
      alpha: 1,
      order: 0,
    };
  }

  function mount(quote = 'Creativity connects us.') {
    document.body.innerHTML = `
      <div class="rail" style="position:relative;height:600px;width:800px">
        <figure class="fig" style="position:absolute;top:100px;left:50px;width:600px;margin:0;padding:24px;
          --${pre}-crosshair-width:1px;--${pre}-pq-rule-color:#444">
          <blockquote class="${block}-pullquote-quote" style="--${pre}-pq-ink:#fafafa;font:40px/48px sans-serif;margin:0">${quote}</blockquote>
          <p class="${block}-pullquote-name" style="--${pre}-pq-ink:#fafafa;font:16px sans-serif;margin:0">Alex</p>
        </figure>
      </div>`;
    return {
      figureEl: document.querySelector('.fig'),
      railEl: document.querySelector('.rail'),
    };
  }

  describe(`${block}: quote particles`, () => {
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
      await fx.setSources([], VIEW);
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
      const card = (x0) => cardAt(x0, 100, 100, 200);
      await fx.setSources([card(100), card(5000)], VIEW);
      const pointsOf = () => fx.object.children.filter((o) => o instanceof THREE.Points);
      expect(pointsOf()).to.have.length(1);
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
        if (inner < 0.1) { edge += aRand.array[i * 4 + 1]; ne += 1; }
        if (inner > 0.4) { centre += aRand.array[i * 4 + 1]; nc += 1; }
      }
      // Edge first: the rim is released well before the middle.
      expect(edge / ne).to.be.below(centre / nc);
      expect(points.material.uniforms.uMap.value).to.be.instanceOf(THREE.Texture);
      await fx.setSources([], VIEW);
      expect(pointsOf()).to.have.length(1);
      const fallback = fx.object.children.find((o) => o instanceof THREE.Points);
      expect(fallback.material.uniforms.uScreenSrc.value).to.equal(1);
    });

    it('keeps the current pairing on screen until a re-pair is ready, and drops it on release', async () => {
      const { figureEl, railEl } = mount();
      fx = createQuoteParticles({ figureEl, railEl, count: 500 });
      await fx.layout({ dpr: 1 });
      const pointsOf = () => fx.object.children.filter((o) => o instanceof THREE.Points);
      await fx.setSources([cardAt(100, 100, 100, 200)], VIEW);
      fx.update(0.3, { W: 800, H: 600, dpr: 1 });
      const [old] = pointsOf();
      const next = fx.setSources([cardAt(300, 100, 100, 200)], VIEW);
      expect(fx.isPaired()).to.be.true;
      expect(old.visible).to.be.true;
      expect(pointsOf().filter((o) => o.visible)).to.deep.equal([old]);
      await next;
      expect(pointsOf()).to.have.length(1);
      expect(pointsOf()[0]).to.not.equal(old);
      expect(pointsOf()[0].visible).to.be.true;
      fx.clearSources();
      expect(fx.isPaired()).to.be.false;
      expect(pointsOf()).to.have.length(0);
    });

    it('shows the finished quote before any pairing, but not the flight', async () => {
      const { figureEl, railEl } = mount();
      fx = createQuoteParticles({ figureEl, railEl, count: 500 });
      await fx.layout({ dpr: 1 });
      const view = { W: 800, H: 600, dpr: 1 };
      fx.update(0.3, view);
      expect(fx.object.visible).to.be.false;
      fx.update(1, view);
      expect(fx.object.visible).to.be.true;
    });

    it('crosses from points to the text plane', async () => {
      const { figureEl, railEl } = mount();
      fx = createQuoteParticles({ figureEl, railEl, count: 500 });
      await fx.layout({ dpr: 1 });
      await fx.setSources([], VIEW);
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
      fx.update(0.5, { ...view, zoom: [0.2, 0.4, 57, 117] });
      expect(points.material.uniforms.uZoomT.value.toArray()).to.deep.equal([0.2, 0.4]);
      expect(points.material.uniforms.uCamZ.value.toArray()).to.deep.equal([57, 117]);
      fx.update(1, { ...view, active: false });
      expect(fx.object.visible).to.be.false;
    });

    it('lands each glyph by reading order', async () => {
      const { figureEl, railEl } = mount();
      fx = createQuoteParticles({ figureEl, railEl, count: 800 });
      await fx.layout({ dpr: 1 });
      await fx.setSources([], VIEW);
      const points = fx.object.children.find((o) => o instanceof THREE.Points);
      const { position, aRand } = points.geometry.attributes;
      let left = 0; let right = 0; let nl = 0; let nr = 0;
      for (let i = 0; i < position.count; i += 1) {
        const arrive = aRand.array[i * 4 + 3];
        expect(arrive).to.be.within(0.4 - 0.02, 0.75 + 0.02 + 1e-6); // ± the arrival jitter
        expect(arrive - aRand.array[i * 4]).to.be.at.least(0.15 - 1e-6); // no rushed flight
        if (position.array[i * 3] < 300) {
          left += arrive; nl += 1;
        } else {
          right += arrive; nr += 1;
        }
      }
      expect(left / nl).to.be.below(right / nr);
      // The crosshair's left rule (x ≈ 74.5) is one left-to-right instant, top to bottom alike.
      const rule = [];
      for (let i = 0; i < position.count; i += 1) {
        if (Math.abs(position.array[i * 3] - 74.5) < 1) rule.push(aRand.array[i * 4 + 3]);
      }
      expect(rule.length).to.be.above(10);
      expect(Math.max(...rule) - Math.min(...rule)).to.be.at.most(2 * 0.02 + 0.01);
      // The crosshair's other centre lines, from the figure box (padding 24, 1px rules).
      const fig = figureEl.getBoundingClientRect();
      const rail = railEl.getBoundingClientRect();
      const rx = fig.right - rail.left - 24 - 0.5;
      const topY = fig.top - rail.top + 24.5;
      const botY = fig.bottom - rail.top - 24 - 0.5;
      // The right rule draws down from its top after the wave reaches it, so it lands last.
      const rRule = [];
      for (let i = 0; i < position.count; i += 1) {
        if (Math.abs(position.array[i * 3] - rx) < 1) {
          rRule.push([position.array[i * 3 + 1], aRand.array[i * 4 + 3]]);
        }
      }
      rRule.sort((a, b) => a[0] - b[0]);
      const third = Math.floor(rRule.length / 3);
      const mean = (a) => a.reduce((sum, [, v]) => sum + v, 0) / a.length;
      expect(third).to.be.above(3);
      expect(mean(rRule.slice(0, third)) + 0.03).to.be.below(mean(rRule.slice(-third)));
      expect(mean(rRule.slice(0, third))).to.be.above(Math.max(...rule));
      // The bottom rule lags the top one more and more, meeting the right rule at the corner.
      const nearCorner = (y) => {
        const o = [];
        for (let i = 0; i < position.count; i += 1) {
          const x = position.array[i * 3];
          if (Math.abs(position.array[i * 3 + 1] - y) < 1 && x > rx - 120 && x < rx - 2) {
            o.push([x, aRand.array[i * 4 + 3]]);
          }
        }
        return mean(o);
      };
      expect(nearCorner(botY)).to.be.above(nearCorner(topY) + 0.03);
      // The crosshair finishes landing shortly after the text.
      const last = [0, 0];
      for (let i = 0; i < position.count; i += 1) {
        const [x, y] = [position.array[i * 3], position.array[i * 3 + 1]];
        const off = Math.min(...[x - 74.5, x - rx, y - topY, y - botY].map(Math.abs));
        const k = off < 1.5 ? 1 : 0;
        last[k] = Math.max(last[k], aRand.array[i * 4 + 3]);
      }
      expect(last[1] - last[0]).to.be.within(0.35 * 0.1 - 0.04, 0.35 * 0.1 + 0.04);
      const view = { W: 800, H: 600, dpr: 1 };
      fx.update(QUOTE_LIVE_P, view);
      expect(points.visible).to.be.false;
    });

    it('stays unready for an empty figure', async () => {
      const { figureEl, railEl } = mount('');
      figureEl.querySelector('p').textContent = '';
      fx = createQuoteParticles({ figureEl, railEl, count: 100 });
      expect(await fx.layout({ dpr: 1 })).to.be.false;
      expect(fx.isReady()).to.be.false;
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

    it('pairs card pixels with nearby targets', async () => {
      const { figureEl, railEl } = mount();
      fx = createQuoteParticles({ figureEl, railEl, count: 3000 });
      await fx.layout({ dpr: 1 });
      // Cards spread around the quote, as on the page: pixels should go to the nearer glyphs,
      // not across the figure.
      const card = (x0, y0) => cardAt(x0, y0, 200, 150);
      await fx.setSources([card(30, 400), card(560, 30)], VIEW);
      const draws = fx.object.children.filter((o) => o instanceof THREE.Points);
      expect(draws).to.have.length(2);
      expect(draws.reduce((sum, d) => sum + d.geometry.attributes.aRand.count, 0))
        .to.be.within(2800, 3000);
      draws.forEach((d) => {
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

    it('lays sources out from the runway, not the frame: whole cards, budget by area in view', async () => {
      const { figureEl, railEl } = mount();
      fx = createQuoteParticles({ figureEl, railEl, count: 3000 });
      await fx.layout({ dpr: 1 });
      // The camera dollies from z 0 to −25 over the flight: a card near the right edge runs off
      // screen early, one in the middle stays.
      const view = { ...VIEW, zoom: [0, 1, 0, 25] };
      const cards = [cardAt(600, 250, 190, 140), cardAt(300, 200, 200, 150)];
      const draws = () => fx.object.children.filter((o) => o instanceof THREE.Points);
      const snapshot = () => draws()
        .map((o) => [...o.geometry.attributes.aRand.array, ...o.geometry.attributes.aUv.array]);
      await fx.setSources(cards, view);
      const first = snapshot();
      const [edgeCard, midCard] = draws().map((o) => o.geometry.attributes.aUv);
      // Each converts whole: its grid spans the card.
      [edgeCard, midCard].forEach((uv) => {
        const us = uv.array.filter((_, i) => i % 2 === 0);
        expect(Math.min(...us)).to.be.below(0.05);
        expect(Math.max(...us)).to.be.above(0.95);
      });
      expect(edgeCard.count).to.be.below(midCard.count);
      // The same cards and runway give the same particles, whenever it runs.
      await fx.setSources(cards, view);
      expect(snapshot()).to.deep.equal(first);
    });
  });

  describe(`${block}: DOM swap at rest`, () => {
    afterEach(() => { document.body.innerHTML = ''; document.head.querySelector(`#${pre}-css`)?.remove(); });

    it('keeps the DOM quote transparent while the canvas draws it, and inks it on the swap', async () => {
      const link = document.createElement('link');
      link.id = `${pre}-css`;
      link.rel = 'stylesheet';
      link.href = `/libs/c2/blocks/${block}/${block}.css`;
      await new Promise((r) => { link.onload = r; document.head.append(link); });
      document.body.innerHTML = `
        <div class="${block} ${block}-pq-particles">
          <figure class="${block}-pullquote">
            <blockquote class="${block}-pullquote-quote" style="--${pre}-pq-ink:rgb(250, 250, 250)">Q</blockquote>
          </figure>
        </div>`;
      const fig = document.querySelector(`.${block}-pullquote`);
      const quote = document.querySelector(`.${block}-pullquote-quote`);
      const alpha = () => {
        const c = getComputedStyle(quote).color;
        const m = c.match(/[\d.]+/g).map(Number);
        return m.length > 3 ? m[3] : 1;
      };
      expect(alpha()).to.equal(0);
      // Still positioned and in the a11y tree: only the ink is gone.
      expect(getComputedStyle(fig).display).to.not.equal('none');
      expect(getComputedStyle(fig).visibility).to.equal('visible');
      fig.style.setProperty(`--${pre}-pq-dom`, '1');
      expect(alpha()).to.equal(1);
      fig.style.setProperty(`--${pre}-pq-dom`, '0.5');
      expect(alpha()).to.be.closeTo(0.5, 0.01);
      // Forced colours / failed raster: the DOM keeps its own ink regardless.
      fig.style.removeProperty(`--${pre}-pq-dom`);
      fig.classList.add('is-dom');
      expect(alpha()).to.equal(1);
    });
  });

  const nearCard = (d) => ({
    d,
    origin: new THREE.Vector3(-1, 2, -10),
    axisU: new THREE.Vector3(2, 0, 0),
    axisV: new THREE.Vector3(0, -3, 0),
    tex: new THREE.Texture(),
    repeat: new THREE.Vector2(1, 1),
    offset: new THREE.Vector2(0, 0),
    mirror: false,
    aspect: 2 / 3,
    radius: 0.03,
    alpha: 1,
    order: 3,
  });

  describe(`${block}: near-camera card scatter`, () => {
    let fx;
    afterEach(() => { fx?.dispose(); fx = null; });

    it('tiles every card with one shared grid', () => {
      fx = createCardScatter({ expand: 1.5 });
      fx.setGrid(40, 60);
      fx.update([nearCard(0.2), nearCard(0.6)], { W: 800, H: 600, dpr: 1 });
      const draws = fx.object.children.filter((o) => o instanceof THREE.Points);
      expect(draws).to.have.length(2);
      expect(draws[0].geometry.attributes.aUv.count).to.equal(2400);
      expect(draws[0].geometry).to.equal(draws[1].geometry);
      expect(draws[1].material.uniforms.uScatterP.value).to.equal(0.6);
      expect(draws[0].geometry.attributes.aUv.array[0]).to.be.closeTo(1 / 80, 1e-6);
    });

    it('pools its draws and keeps the grid until it changes', () => {
      fx = createCardScatter({ expand: 1.5 });
      fx.setGrid(10, 10);
      const view = { W: 800, H: 600, dpr: 1 };
      fx.update([nearCard(0.1), nearCard(0.2), nearCard(0.3)], view);
      const geo = fx.object.children[0].geometry;
      fx.update([nearCard(0.5)], view);
      const points = fx.object.children.filter((o) => o instanceof THREE.Points);
      expect(points).to.have.length(3);
      expect(points.filter((o) => o.visible)).to.have.length(1);
      fx.setGrid(10, 10);
      expect(fx.object.children[0].geometry).to.equal(geo);
      fx.setGrid(12, 10);
      expect(points[0].geometry.attributes.aUv.count).to.equal(120);
      expect(points.every((o) => o.geometry === points[0].geometry)).to.be.true;
      fx.update([], view);
      expect(points.filter((o) => o.visible)).to.have.length(0);
    });
  });
}
