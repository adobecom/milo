import { expect } from '@esm-bundle/chai';
import { createRenderer } from '../../../libs/utils/globe/gl.js';

const nextEvent = (target, type) => new Promise((resolve) => {
  target.addEventListener(type, resolve, { once: true });
});
const afterTask = () => new Promise((resolve) => { setTimeout(resolve); });

describe('createRenderer', () => {
  it('leaves nothing that throws when a canvas lost at creation is restored', async () => {
    const canvas = document.createElement('canvas');
    const ext = canvas.getContext('webgl2').getExtension('WEBGL_lose_context');
    canvas.addEventListener('webglcontextlost', (e) => e.preventDefault());
    const lost = nextEvent(canvas, 'webglcontextlost');
    ext.loseContext();
    await lost;
    expect(() => createRenderer(canvas, false)).to.throw();
    await afterTask();

    const errors = [];
    const onError = (e) => {
      errors.push(e.message);
      e.preventDefault();
    };
    window.addEventListener('error', onError);
    const restored = nextEvent(canvas, 'webglcontextrestored');
    ext.restoreContext();
    await restored;
    await afterTask();
    window.removeEventListener('error', onError);
    expect(errors).to.deep.equal([]);
  });

  it('builds a renderer on a healthy canvas', () => {
    const renderer = createRenderer(document.createElement('canvas'), false);
    expect(renderer.getContext().isContextLost()).to.be.false;
    renderer.dispose();
  });
});
