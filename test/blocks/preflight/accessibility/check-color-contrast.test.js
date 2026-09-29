import { expect } from '@esm-bundle/chai';
import checkColorContrast from '../../../../libs/blocks/preflight/accessibility/check-color-contrast.js';

// 1x1 transparent PNG data URI - loads synchronously, no network.
const PNG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M8AAAMBAQDJ/pLvAAAAAElFTkSuQmCC';
const CONFIG = { checks: ['color-contrast'] };

describe('preflight accessibility check-color-contrast', () => {
  const created = [];
  const add = (html) => {
    const tpl = document.createElement('template');
    tpl.innerHTML = html.trim();
    const el = tpl.content.firstElementChild;
    document.body.append(el);
    created.push(el);
    return el;
  };

  beforeEach(() => {
    // Stub ColorThief so loadColorThief() short-circuits (no network / colorThief.js load).
    window.ColorThief = function ColorThief() {
      this.getColor = () => [10, 10, 10];
    };
  });

  afterEach(() => {
    while (created.length) created.pop().remove();
    delete window.ColorThief;
  });

  it('returns [] when color-contrast check is not enabled', async () => {
    const el = add('<h1 style="color:#000">Heading</h1>');
    expect(await checkColorContrast([el], { checks: [] })).to.deep.equal([]);
  });

  it('passes high-contrast text (black on white)', async () => {
    const el = add('<h1 style="color:rgb(0,0,0)">Heading</h1>');
    expect(await checkColorContrast([el], CONFIG)).to.deep.equal([]);
  });

  it('flags low-contrast text over a color background', async () => {
    const el = add('<h1 style="color:rgb(180,180,180)">Low contrast</h1>');
    const res = await checkColorContrast([el], CONFIG);
    expect(res).to.have.lengthOf(1);
    expect(res[0].id).to.equal('color-contrast');
    expect(res[0].impact).to.equal('serious');
  });

  it('uses the relaxed 3:1 threshold for large text', async () => {
    // rgb(140,140,140) on white ~= 3.3:1 -> fails at 4.5 (normal) but passes at 3.0 (large).
    const large = add('<h1 style="color:rgb(140,140,140);font-size:30px">Big</h1>');
    expect(await checkColorContrast([large], CONFIG)).to.deep.equal([]);
    const normal = add('<h2 style="color:rgb(140,140,140);font-size:14px">Small</h2>');
    expect(await checkColorContrast([normal], CONFIG)).to.have.lengthOf(1);
  });

  it('ignores non-heading/non-button elements', async () => {
    const el = add('<p style="color:rgb(200,200,200)">paragraph</p>');
    expect(await checkColorContrast([el], CONFIG)).to.deep.equal([]);
  });

  it('ignores hidden or empty elements', async () => {
    const hidden = add('<h1 style="color:rgb(200,200,200);display:none">hidden</h1>');
    const empty = add('<h2 style="color:rgb(200,200,200)">   </h2>');
    expect(await checkColorContrast([hidden, empty], CONFIG)).to.deep.equal([]);
  });

  it('samples an ancestor background-image when present', async () => {
    const el = add(`<h1 style="background-image:url(${PNG});color:rgb(20,20,20)">Over bg image</h1>`);
    const res = await checkColorContrast([el], CONFIG);
    expect(res).to.have.lengthOf(1);
    expect(res[0].id).to.equal('color-contrast-image');
    expect(res[0].nodes[0]).to.have.property('background', 'rgb(10, 10, 10)');
  });

  it('reports a color-contrast-image violation when a nearby image is sampled', async () => {
    const el = add(`<h1 style="color:rgb(20,20,20)">Over image<img src="${PNG}" alt="x"></h1>`);
    const res = await checkColorContrast([el], CONFIG);
    expect(res).to.have.lengthOf(1);
    expect(res[0].id).to.equal('color-contrast-image');
    expect(res[0].nodes[0]).to.have.property('background', 'rgb(10, 10, 10)');
  });
});
