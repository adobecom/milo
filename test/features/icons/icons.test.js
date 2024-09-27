import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { setConfig, getConfig, createTag } from '../../../libs/utils/utils.js';
import { waitForElement } from '../../helpers/waitfor.js';

const { default: loadIcons, setNodeIndexClass } = await import('../../../libs/features/icons/icons.js');

const codeRoot = '/libs';
const conf = { codeRoot };
setConfig(conf);
const config = getConfig();

const mockRes = ({ payload, status = 200, ok = true } = {}) => new Promise((resolve) => {
  resolve({
    status,
    ok,
    json: () => payload,
    text: () => payload,
  });
});

document.body.innerHTML = await readFile({ path: './mocks/body.html' });

const originalFetch = window.fetch;
let icons;
const svgEx = `<?xml version="1.0" encoding="UTF-8"?>
<svg id="arrow-down" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18">
  <path fill="currentcolor" d="M12,10V1.5a.5.5,0,0,0-.5-.5h-5a.5.5,0,0,0-.5.5V10H2.5035a.25.25,0,0,0-.177.427L9,17.1l6.673-6.673A.25.25,0,0,0,15.4965,10Z"></path>
</svg>`;

describe('Icon Support', () => {
  // let paramsGetStub;

  beforeEach(() => {
    window.fetch = sinon.stub().callsFake(() => mockRes({}));
  });

  afterEach(() => {
    // Do not build up any test state - reset window.fetch to it's original state
    window.fetch = originalFetch;
  });

  // before(() => {
  //   paramsGetStub = sinon.stub(URLSearchParams.prototype, 'get');
  //   paramsGetStub.withArgs('cache').returns('off');
  // });

  // after(() => {
  //   paramsGetStub.restore();
  // });

  before(async () => {
    // icons = document.querySelectorAll('span.icon');
    // await loadIcons(icons, config);
    // await loadIcons(icons, config); // Test duplicate icon not created if run twice
  });

  it('Fetches successfully with cache control enabled', async () => {
    const otherIcons = [createTag('span', { class: 'icon icon-play' })];
    await loadIcons(otherIcons, config);
  });

  it('Replaces span.icon', async () => {
    const payload = svgEx;
    window.fetch.returns(mockRes({ payload }));

    icons = document.querySelectorAll('span.icon');
    await loadIcons(icons, config);

    const selector = await waitForElement('span.icon svg');
    expect(selector).to.exist;
  });

  it('Sets node index class', async () => {
    icons = document.querySelectorAll('span.icon');
    setNodeIndexClass(icons);
    const secondIconHasIndexClass = icons[2].classList.contains('node-index-last');
    expect(secondIconHasIndexClass).to.be.true;
  });

  it('No duplicate icon', async () => {
    const svgs = icons[0].querySelectorAll(':scope svg');
    expect(svgs.length).to.equal(1);
  });

  it('Creates default tooltip', async () => {
    const tooltip = document.querySelector('.milo-tooltip.right');
    expect(tooltip).to.exist;
    expect(tooltip.dataset.tooltip).to.equal('This is my tooltip text.');
  });

  it('Creates top tooltip', async () => {
    const tooltip = document.querySelector('.milo-tooltip.top');
    expect(tooltip).to.exist;
  });
});
