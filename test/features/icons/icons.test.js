import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { stub } from 'sinon';
import { setConfig, getConfig, createTag } from '../../../libs/utils/utils.js';

const { default: loadIcons } = await import('../../../libs/features/icons/icons.js');

const codeRoot = '/libs';
const conf = { codeRoot };
setConfig(conf);
const config = getConfig();

document.body.innerHTML = await readFile({ path: './mocks/body.html' });

let icons;

describe('Icon Suppprt', () => {
  let paramsGetStub;

  before(() => {
    paramsGetStub = stub(URLSearchParams.prototype, 'get');
    paramsGetStub.withArgs('cache').returns('off');
  });

  after(() => {
    paramsGetStub.restore();
  });

  before(async () => {
    icons = document.querySelectorAll('span.icon');
    await loadIcons(icons, config);
    await loadIcons(icons, config); // Test duplicate icon not created if run twice
  });

  it('Handles tooltip- prefix correctly', async () => {
    const tooltipIcon = createTag('span', { class: 'icon icon-tooltip-info' });
    await loadIcons([tooltipIcon], config);

    const svgIcon = tooltipIcon.querySelector(':scope svg');
    expect(svgIcon).to.exist;

    const iconName = tooltipIcon.classList[1].replace('icon-', '').replace(/tooltip-/, '');
    expect(iconName).to.equal('info');
  });

  it('Fetches successfully with cache control enabled', async () => {
    const otherIcons = [createTag('span', { class: 'icon icon-play' })];
    await loadIcons(otherIcons, config);
  });

  it('Replaces span.icon', async () => {
    const selector = icons[0].querySelector(':scope svg');
    expect(selector).to.exist;
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
