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

  it('Fetches successfully with cache control enabled', async () => {
    const otherIcons = [createTag('span', { class: 'icon icon-play' })];
    await loadIcons(otherIcons, config);
  });

  it('Replaces span.icon', async () => {
    const selector = icons[0].querySelector(':scope svg');
    expect(selector).to.exist;
  });

  it('No duplicate icon', async () => {
    await loadIcons(icons, config);
    const svgs = icons[0].querySelectorAll(':scope svg');
    expect(svgs.length).to.equal(1);
  });

  it('Creates default tooltip (right-aligned)', () => {
    const tooltip = document.querySelector('.milo-tooltip.right');
    expect(tooltip).to.exist;
    expect(tooltip.dataset.tooltip).to.equal('This is my tooltip text.');
  });

  it('Creates top tooltip', () => {
    const tooltip = document.querySelector('.milo-tooltip.top');
    expect(tooltip).to.exist;
  });
});

describe('Tooltip', () => {
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

  it('Tooltip should become visible on focus', async () => {
    document.body.appendChild(wrapper);
    await loadIcons([iconTooltip], config);
    const tooltip = document.querySelector('.milo-tooltip');
    expect(tooltip).to.exist;
    expect(tooltip.dataset.tooltip).to.equal('This is a tooltip text.');
    expect(tooltip.getAttribute('role')).to.equal('button');
    expect(tooltip.className).to.contain('top');
  });

  it('Creates a tooltip without default alignment (left)', () => {
    const customTooltip = createTag('span', { class: 'icon icon-tooltip milo-tooltip left', 'data-tooltip': 'Left-aligned tooltip' });
    document.body.appendChild(customTooltip);

    loadIcons([customTooltip], config);

    const tooltip = document.querySelector('.milo-tooltip.left');
    expect(tooltip).to.exist;
    expect(tooltip.dataset.tooltip).to.equal('Left-aligned tooltip');
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

  it('Should not assign default icon class if already defined', async () => {
    const customIcon = createTag('span', { class: 'icon icon-warning' });
    document.body.appendChild(customIcon);

    await loadIcons([customIcon], config);

    expect(customIcon.classList.contains('icon-warning')).to.be.true;
    expect(customIcon.classList.contains('icon-info')).to.be.false;
  });

  it('Should not add tooltip if data-tooltip is missing', async () => {
    const noTooltipIcon = createTag('span', { class: 'icon icon-tooltip' });
    document.body.appendChild(noTooltipIcon);

    await loadIcons([noTooltipIcon], config);

    expect(noTooltipIcon.classList.contains('milo-tooltip')).to.be.false;
    expect(noTooltipIcon.dataset.tooltip).to.be.undefined;
  });

  it('should show and hide tooltip on hover, focus, and Escape key', async () => {
    await loadIcons([iconTooltip], config);
    const tooltip = document.querySelector('.milo-tooltip');
    expect(tooltip).to.exist;

    // Create events with tooltip as target for document to catch
    const mouseenterEvent = new Event('mouseenter', { bubbles: true });
    Object.defineProperty(mouseenterEvent, 'target', { value: tooltip });
    document.dispatchEvent(mouseenterEvent);
    expect(tooltip.classList.contains('hide-tooltip')).to.be.false;

    const mouseleaveEvent = new Event('mouseleave', { bubbles: true });
    Object.defineProperty(mouseleaveEvent, 'target', { value: tooltip });
    document.dispatchEvent(mouseleaveEvent);
    expect(tooltip.classList.contains('hide-tooltip')).to.be.true;

    const focusEvent = new Event('focus', { bubbles: true });
    Object.defineProperty(focusEvent, 'target', { value: tooltip });
    document.dispatchEvent(focusEvent);
    expect(tooltip.classList.contains('hide-tooltip')).to.be.false;

    const blurEvent = new Event('blur', { bubbles: true });
    Object.defineProperty(blurEvent, 'target', { value: tooltip });
    document.dispatchEvent(blurEvent);
    expect(tooltip.classList.contains('hide-tooltip')).to.be.true;

    // For Escape key, we need to simulate a keydown event on document
    const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
    Object.defineProperty(escapeEvent, 'target', { value: tooltip });
    document.dispatchEvent(escapeEvent);
    expect(tooltip.classList.contains('hide-tooltip')).to.be.true;
  });
});
