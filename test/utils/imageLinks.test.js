import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { decorateImageLinks } from '../../libs/utils/utils.js';

document.body.innerHTML = await readFile({ path: './mocks/image-links.html' });

describe('Image Link', () => {
  beforeEach(() => {
    sinon.spy(console, 'log');
  });

  afterEach(() => {
    console.log.restore();
  });

  decorateImageLinks(document);

  it('Creates an image link from an alt attribute with url and pipe', () => {
    const links = document.querySelectorAll('a');
    expect(links[0]).to.exist;
    expect(links[0].nodeName).to.equal('A');
  });

  it('Replaces the image in-place', () => {
    const i = document.querySelector('#inline-image');
    expect(i.children[1].nodeName).to.equal('A');
    expect(i.querySelector('a picture')).to.exist;
  });

  it('Fails gracefully', () => {
    const i = document.querySelector('.bad-url');
    expect(i.alt).to.equal('img/badurl#_blank | image link bad url');
  });

  it('Has video play button', async () => {
    const p = document.querySelector('.image-link-play');
    await new Promise((resolve) => { setTimeout(resolve, 500); });
    expect(p.querySelector('.modal-img-link')).to.exist;
  });

  it('Returns image-video-link promises that resolve the play button deterministically', async () => {
    const container = document.createElement('div');
    container.innerHTML = '<p class="image-link-play-regression"><picture><img src="./test/utils/mocksmedia_.png" alt="https://www.adobe.com | image link | :play:" class="image-link"/></picture></p>';
    document.body.append(container);
    const promises = decorateImageLinks(container);
    expect(Array.isArray(promises)).to.be.true;
    expect(promises.length).to.equal(1);
    await Promise.all(promises);
    // Once the returned promises resolve, the modal image link is guaranteed to exist
    // without relying on an arbitrary timeout (prevents the block-decoration race).
    expect(container.querySelector('.modal-img-link')).to.exist;
  });

  it('Returns an empty array when there are no image links', () => {
    const container = document.createElement('div');
    container.innerHTML = '<p>no images here</p>';
    expect(decorateImageLinks(container)).to.deep.equal([]);
  });

  it('Creates an image link with parameters', () => {
    const p = document.querySelector('#link-with-params');
    const url = new URL(p.querySelector('a').href);
    expect(url.search).to.equal('?form=off');
  });
});
