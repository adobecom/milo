import { expect } from '@esm-bundle/chai';
import * as THREE from '../../../../libs/deps/three.js';
import createCardScatter from '../../../../libs/c2/blocks/globe-gallery/src/card-scatter.js';

const card = (d) => ({
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

describe('globe-gallery: near-camera card scatter', () => {
  let fx;
  afterEach(() => { fx?.dispose(); fx = null; });

  it('tiles every card with one shared grid', () => {
    fx = createCardScatter();
    fx.setGrid(40, 60);
    expect(fx.tileCount()).to.equal(2400);
    fx.update([card(0.2), card(0.6)], { W: 800, H: 600, dpr: 1 });
    const draws = fx.object.children.filter((o) => o instanceof THREE.Points);
    expect(draws).to.have.length(2);
    expect(draws[0].geometry).to.equal(draws[1].geometry);
    expect(draws[1].material.uniforms.uScatterP.value).to.equal(0.6);
    expect(draws[0].geometry.attributes.aUv.array[0]).to.be.closeTo(1 / 80, 1e-6);
  });

  it('pools its draws and keeps the grid until it changes', () => {
    fx = createCardScatter();
    fx.setGrid(10, 10);
    const view = { W: 800, H: 600, dpr: 1 };
    fx.update([card(0.1), card(0.2), card(0.3)], view);
    const geo = fx.object.children[0].geometry;
    fx.update([card(0.5)], view);
    const points = fx.object.children.filter((o) => o instanceof THREE.Points);
    expect(points).to.have.length(3);
    expect(points.filter((o) => o.visible)).to.have.length(1);
    expect(fx.drawCount()).to.equal(1);
    fx.setGrid(10, 10);
    expect(fx.object.children[0].geometry).to.equal(geo);
    fx.setGrid(12, 10);
    expect(fx.tileCount()).to.equal(120);
    expect(points.every((o) => o.geometry === points[0].geometry)).to.be.true;
    fx.update([], view);
    expect(fx.drawCount()).to.equal(0);
  });
});
