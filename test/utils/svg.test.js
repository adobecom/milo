import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { decorateSVG } from '../../libs/utils/utils.js';

document.body.innerHTML = await readFile({ path: './mocks/svg.html' });

describe('Decorate SVGs', () => {
  beforeEach(() => {
    sinon.spy(console, 'log');
  });

  afterEach(() => {
    console.log.restore();
  });

  it('Relative SVG', async () => {
    const el = document.querySelector('#relative');
    const pic = decorateSVG(el);
    const img = pic.querySelector('img');
    expect(pic.nodeName).to.equal('PICTURE');
    expect(img.alt).to.be.empty;
    expect(img.src).to.equal('http://localhost:2000/my-icon.svg');
  });

  it('Fully qualified SVG', async () => {
    const el = document.querySelector('#fully-qualified');
    const pic = decorateSVG(el);
    expect(pic.nodeName).to.equal('PICTURE');
    expect(pic.querySelector('img').src).to.equal('https://milo.adobe.com/my-icon.svg');
  });

  it('Fully qualified SVG', async () => {
    const el = document.querySelector('#in-fragments-folder');
    const pic = decorateSVG(el);
    expect(pic.nodeName).to.equal('PICTURE');
    expect(pic.querySelector('img').src).to.equal('https://milo.adobe.com/fragments/my-icon.svg');
  });

  it('Alt text SVG', async () => {
    const el = document.querySelector('#alttext');
    const pic = decorateSVG(el);
    expect(pic.nodeName).to.equal('PICTURE');
    expect(pic.querySelector('img').alt).to.equal('My Icon');
  });

  it('Alt text with extra pipe SVG', async () => {
    const el = document.querySelector('#alttext-pipe');
    const pic = decorateSVG(el);
    expect(pic.nodeName).to.equal('PICTURE');
    expect(pic.querySelector('img').alt).to.equal('My Icon | Is cool');
  });

  it('SVG links to page w/ alt text', async () => {
    const el = document.querySelector('#svg-link');
    const a = decorateSVG(el);
    const img = a.querySelector('img');
    expect(a.nodeName).to.equal('A');
    expect(a.href).to.equal('https://milocollege.com/');
    expect(img.alt).to.equal('My Icon w/ link');
  });

  it('Does not make an SVG', async () => {
    const el = document.querySelector('#no-svg');
    const a = decorateSVG(el);
    expect(a.nodeName).to.equal('A');
    expect(a.href).to.equal('https://otis.adobe.com/');
  });

  it('Fails gracefully', async () => {
    const el = document.querySelector('#fail-gracefully');
    const a = decorateSVG(el);
    expect(a.nodeName).to.equal('A');
    expect(a.href).to.equal('https://adobe.com/');
    expect(console.log.args[0][0]).to.equal('Failed to create SVG.');
  });
});
