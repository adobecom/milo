import { expect } from '@esm-bundle/chai';
import { createRenderer } from '../../../libs/utils/globe/gl.js';

describe('createRenderer', () => {
  it('rejects a missing context without registering context listeners', () => {
    const canvas = document.createElement('canvas');
    canvas.getContext = () => null;
    let added = 0;
    canvas.addEventListener = () => { added += 1; };
    expect(() => createRenderer(canvas, false)).to.throw('creating WebGL context');
    expect(added).to.equal(0);
  });

  it('rejects a lost context without registering context listeners', () => {
    const canvas = document.createElement('canvas');
    canvas.getContext = () => ({ isContextLost: () => true });
    let added = 0;
    canvas.addEventListener = () => { added += 1; };
    expect(() => createRenderer(canvas, false)).to.throw('lost');
    expect(added).to.equal(0);
  });

  it('builds a renderer on a healthy canvas', () => {
    const renderer = createRenderer(document.createElement('canvas'), false);
    expect(renderer.getContext().isContextLost()).to.be.false;
    renderer.dispose();
  });
});
