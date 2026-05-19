import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

// Capture the IntersectionObserver callback so tests can withhold/trigger
// the render loop. The block starts the rAF loop only when IO reports
// isIntersecting; not invoking the callback keeps the loop quiet.
let ioCallback;
window.IntersectionObserver = function MockIO(cb) {
  ioCallback = cb;
  this.observe = sinon.stub();
  this.unobserve = sinon.stub();
  this.disconnect = sinon.stub();
};

// The block uses MutationObserver only for self-removal cleanup; in tests
// the block isn't removed, so observe/disconnect can be no-ops.
window.MutationObserver = function MockMO() {
  this.observe = sinon.stub();
  this.disconnect = sinon.stub();
};

document.body.innerHTML = await readFile({ path: './mocks/body.html' });

const { default: init } = await import('../../../../libs/c2/blocks/dot-grid/dot-grid.js');

describe('dot-grid', () => {
  let block;

  before(async () => {
    block = document.querySelector('.dot-grid');
    await init(block);
  });

  it('replaces the authored block with a single .dot-grid-stage', () => {
    const stages = block.querySelectorAll(':scope > .dot-grid-stage');
    expect(stages.length).to.equal(1);
  });

  it('creates a canvas inside the stage', () => {
    expect(block.querySelector('.dot-grid-stage canvas')).to.exist;
  });

  it('mounts the card-scene container', () => {
    expect(block.querySelector('.card-scene')).to.exist;
  });

  it('decorates all 8 cards with the .card class', () => {
    expect(block.querySelectorAll('.card-scene .card').length).to.equal(8);
  });

  it('marks the title element with .acrobat-title', () => {
    expect(block.querySelector('.acrobat-title')).to.exist;
  });

  it('marks the marketing copy with .text-block', () => {
    expect(block.querySelector('.text-block')).to.exist;
  });

  it('marks the CTA element with .acrobat-cta', () => {
    expect(block.querySelector('.acrobat-cta')).to.exist;
  });

  it('renders the inline ADBE logo SVG inside the stage', () => {
    expect(block.querySelector('.dot-grid-stage .adbe-logo-svg')).to.exist;
  });

  it('builds card labels from the authored text', () => {
    const labels = [...block.querySelectorAll('.card-label-outer')].map((l) => l.textContent);
    expect(labels).to.include('Card 1');
    expect(labels).to.include('Card 8');
  });

  it('registers an IntersectionObserver to gate the render loop', () => {
    expect(ioCallback).to.be.a('function');
  });
});
