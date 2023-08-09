import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const { default: init } = await import('../../../libs/blocks/marquee-anchors/marquee-anchors.js');

describe('marquee-anchors', () => {
  beforeEach(() => {
    sinon.spy(console, 'log');
  });

  afterEach(() => {
    console.log.restore();
  });

  const marquees = document.querySelectorAll('.marquee-anchors');
  marquees.forEach((marquee) => {
    init(marquee);
  });

  it('has a copy area', () => {
    const copy = marquees[0].querySelector('.copy');
    expect(copy).to.exist;
  });

  it('has a links area and anchor-link', () => {
    const links = marquees[0].querySelector('.links');
    expect(links).to.exist;
    const anchorLinks = marquees[0].querySelector('.links .anchor-link');
    expect(anchorLinks).to.exist;
  });

  it('adds the external class for external links', () => {
    const links = marquees[1].querySelector('.external');
    expect(links).to.exist;
  });

  it('does not add the external class if the window has a hash or query praram', () => {
    window.location.hash = 'a-string';

    const links = marquees[0].querySelector('.external');
    expect(links).to.be.null;
  });
});
