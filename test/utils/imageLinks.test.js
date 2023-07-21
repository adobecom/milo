import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { decorateImageLinks } from '../../../libs/utils/utils.js';

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

  it('Fails gracefully', () => {
    const i = document.querySelector('.bad-url');
    expect(i.alt).to.equal('img/badurl#_blank | image link bad url');
  });
});
