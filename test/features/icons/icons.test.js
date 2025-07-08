import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { setConfig, getConfig, createTag } from '../../../libs/utils/utils.js';

const { default: loadIcons } = await import('../../../libs/features/icons/icons.js');

setConfig({ codeRoot: '/libs' });
const config = getConfig();
let icons;
let fetchStub;
let paramsGetStub;

describe('Icon Support', () => {
  beforeEach(async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    paramsGetStub = sinon.stub(URLSearchParams.prototype, 'get');
    paramsGetStub.withArgs('cache').returns('off');
    fetchStub = sinon.stub(window, 'fetch');
    fetchStub.resolves({
      ok: true,
      text: () => Promise.resolve(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z"/>
        </svg>
      `),
    });
    window.lana.log = sinon.spy();
    icons = document.querySelectorAll('span.icon');
  });

  afterEach(() => {
    document.body.innerHTML = '';
    sinon.restore();
  });

  it('Falls back to Milo icons when federal icon fetch fails', async () => {
    const icon = createTag('span', { class: 'icon icon-play' });
    document.body.appendChild(icon);

    fetchStub.callsFake((url) => {
      if (url.includes('/federal/')) return Promise.reject(new Error('Failed to fetch federal icon'));

      return Promise.resolve({
        ok: true,
        text: () => Promise.resolve(`
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg">
          <symbol id="play" viewBox="0 0 18 18">
            <path fill="currentcolor" d="M4.73,2H3.5a.5.5,0,0,0-.5.5v13a.5.5,0,0,0,.5.5H4.73a1,1,0,0,0,.5035-.136l11.032-6.433a.5.5,0,0,0,0-.862L5.2335,2.136A1,1,0,0,0,4.73,2Z" />
          </symbol>
        </svg>
        `),
      });
    });

    await loadIcons([icon], config);
    expect(icon.querySelector('svg')).to.exist;
  });

  it('Handles fetchIconList', async () => {
    const { fetchIconList } = await import('../../../libs/features/icons/icons.js');

    fetchStub.resolves({
      ok: true,
      json: () => Promise.resolve({ content: { data: ['icon1', 'icon2'] } }),
    });

    const result = await fetchIconList('https://example.com/icons');
    expect(result).to.deep.equal(['icon1', 'icon2']);

    fetchStub.rejects(new Error('Network error'));
    await fetchIconList('https://example.com/icons');
    expect(window.lana.log.calledOnce).to.be.true;
    const lanaCallArguments = window.lana.log.getCall(0).args;
    expect(lanaCallArguments[0]).to.include('Failed to fetch iconList');
    expect(lanaCallArguments[1].tags).to.equal('icons');
    expect(lanaCallArguments[1].errorType).to.equal('error');
  });

  it('Handles tooltip prefix correctly', async () => {
    const tooltipIcon = createTag('span', { class: 'icon icon-tooltip-info' });
    document.body.appendChild(tooltipIcon);
    await loadIcons([tooltipIcon], config);
    expect(tooltipIcon.querySelector(':scope svg')).to.exist;
    expect(tooltipIcon.classList[1].replace('icon-tooltip-', '')).to.equal('info');
  });

  it('Fetches successfully with cache control enabled', async () => {
    const otherIcons = [createTag('span', { class: 'icon icon-play' })];
    document.body.appendChild(otherIcons[0]);

    await loadIcons(otherIcons, config);
    expect(otherIcons[0].querySelector('svg')).to.exist;
  });

  it('Renders an SVG after loading the icons', async () => {
    await loadIcons(icons, config);
    const selector = icons[0].querySelector(':scope svg');
    expect(selector).to.exist;
  });

  it('No duplicate icon', async () => {
    await loadIcons(icons, config);
    const svgs = icons[0].querySelectorAll(':scope svg');
    expect(svgs.length).to.equal(1);
  });

  it('Creates default tooltip (right-aligned)', async () => {
    await loadIcons(icons, config);
    const tooltip = document.querySelector('.milo-tooltip.right');
    expect(tooltip).to.exist;
    expect(tooltip.dataset.tooltip).to.equal('This is my tooltip text.');
  });

  it('Creates top tooltip', async () => {
    const tooltipWrapper = createTag('em', {}, 'top|This is my tooltip text.');
    const tooltipIcon = createTag('span', { class: 'icon icon-tooltip' });
    tooltipWrapper.appendChild(tooltipIcon);
    document.body.appendChild(tooltipWrapper);

    await loadIcons([tooltipIcon], config);
    const tooltip = document.querySelector('.milo-tooltip.top');
    expect(tooltip).to.exist;
  });

  it('Handles invalid SVG response', async () => {
    const icon = createTag('span', { class: 'icon icon-invalid' });
    document.body.appendChild(icon);

    fetchStub.resolves({
      ok: true,
      text: () => Promise.resolve('<invalid>Definitely a SVG</invalid>'),
    });

    await loadIcons([icon], config);
    expect(window.lana.log.getCalls().length > 0).to.be.true;
    const lanaCallArguments = window.lana.log.getCall(1).args;
    expect(lanaCallArguments[0]).to.include('No fallback Milo icon found for invalid');
    expect(lanaCallArguments[1].tags).to.equal('icons');
    expect(lanaCallArguments[1].errorType).to.equal('error');
  });
});

describe('Tooltip', () => {
  let iconTooltip;
  let wrapper;
  let normalIcon;
  let container;

  beforeEach(() => {
    container = createTag('div');
    iconTooltip = createTag('span', { class: 'icon icon-tooltip' });
    wrapper = createTag('em', {}, 'top|This is a tooltip text.');
    wrapper.appendChild(iconTooltip);
    container.appendChild(wrapper);

    normalIcon = createTag('span', { class: 'icon icon-play' });
    container.appendChild(normalIcon);
    document.body.appendChild(container);
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
    await loadIcons([iconTooltip], config);
    const tooltip = document.querySelector('.milo-tooltip');
    expect(tooltip).to.exist;
    expect(tooltip.dataset.tooltip).to.equal('This is a tooltip text.');
    expect(tooltip.getAttribute('role')).to.equal('button');
    expect(tooltip.className).to.contain('top');
  });

  it('Creates a tooltip without default alignment (left)', async () => {
    const customTooltip = createTag('span', { class: 'icon icon-tooltip milo-tooltip left', 'data-tooltip': 'Left-aligned tooltip' });
    container.appendChild(customTooltip);

    await loadIcons([customTooltip], config);

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
    container.appendChild(customIcon);

    await loadIcons([customIcon], config);

    expect(customIcon.classList.contains('icon-warning')).to.be.true;
    expect(customIcon.classList.contains('icon-info')).to.be.false;
  });

  it('Should not add tooltip if data-tooltip is missing', async () => {
    const noTooltipIcon = createTag('span', { class: 'icon icon-tooltip' });
    container.appendChild(noTooltipIcon);

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
