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

describe('Icon Support', () => {
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

  it('Creates default tooltip ', async () => {
    const tooltip = document.querySelector('.milo-tooltip.right');
    expect(tooltip).to.exist;
    expect(tooltip.dataset.tooltip).to.equal('This is my tooltip text.');
  });

  it('Creates top tooltip', async () => {
    const tooltip = document.querySelector('.milo-tooltip.top');
    expect(tooltip).to.exist;
  });
});

describe('Tooltip Integration with loadIcons', () => {
  let iconTooltip;
  let wrapper;
  let normalIcon;

  beforeEach(() => {
    iconTooltip = createTag('span', { class: 'icon icon-tooltip' });
    wrapper = createTag('em', {}, 'top|This is a tooltip text.');
    wrapper.appendChild(iconTooltip);
    document.body.appendChild(wrapper);

    normalIcon = createTag('span', { class: 'icon icon-play' });
    document.body.appendChild(normalIcon);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('Should only decorate icons with "icon-tooltip" class', async () => {
    await loadIcons([iconTooltip, normalIcon], config);

    expect(iconTooltip.dataset.tooltip).to.equal('This is a tooltip text.');
    expect(iconTooltip.classList.contains('milo-tooltip')).to.be.true;
    expect(normalIcon.dataset.tooltip).to.be.undefined;
    expect(normalIcon.classList.contains('milo-tooltip')).to.be.false;
  });

  it('Tooltip should not be visible by default', async () => {
    await loadIcons([iconTooltip], config);

    const tooltipContent = document.querySelector('.milo-tooltip[data-tooltip]');
    expect(tooltipContent).to.exist;
    expect(tooltipContent.style.display).to.equal('');
    expect(tooltipContent.style.visibility).to.equal('');
  });

  it('Should replace wrapper with icon', async () => {
    await loadIcons([iconTooltip], config);
    expect(document.body.contains(wrapper)).to.be.false;
    expect(document.body.contains(iconTooltip)).to.be.true;
  });

  it('Should assign correct default icon class and name', async () => {
    await loadIcons([iconTooltip], config);
    expect(iconTooltip.classList.contains('icon-info')).to.be.true;
    expect(iconTooltip.dataset.name).to.be.undefined;
  });
});
