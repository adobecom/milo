/* eslint-disable max-classes-per-file */
/* eslint-disable no-undef */
import { expect } from '@esm-bundle/chai';
import '../../../libs/features/mas/src/mas-tooltip.js';

describe('MasTooltip Component', () => {
  let hasSpectrumStub;

  beforeEach(() => {
    document.body.innerHTML = '';

    // Stub customElements.get to control whether Spectrum is available
    hasSpectrumStub = sinon.stub(customElements, 'get');
  });

  afterEach(() => {
    hasSpectrumStub.restore();
  });

  describe('Milo Tooltip Mode', () => {
    beforeEach(() => {
      // Simulate Spectrum not being available
      hasSpectrumStub.returns(undefined);
    });

    it('should render Milo tooltip when Spectrum is not available', async () => {
      const masTooltip = document.createElement('mas-tooltip');
      masTooltip.setAttribute('content', 'Test tooltip content');
      masTooltip.setAttribute('placement', 'bottom');
      masTooltip.innerHTML = '<span>Hover me</span>';

      document.body.appendChild(masTooltip);
      await masTooltip.updateComplete;

      const miloTooltip = masTooltip.shadowRoot.querySelector('.milo-tooltip');
      expect(miloTooltip).to.exist;
      expect(miloTooltip.getAttribute('data-tooltip')).to.equal('Test tooltip content');
      expect(miloTooltip.classList.contains('bottom')).to.be.true;
      expect(miloTooltip.getAttribute('aria-label')).to.equal('Test tooltip content');
    });

    it('should apply correct position classes', async () => {
      const positions = ['top', 'bottom', 'left', 'right'];

      for (const position of positions) {
        const masTooltip = document.createElement('mas-tooltip');
        masTooltip.setAttribute('content', 'Tooltip');
        masTooltip.setAttribute('placement', position);
        masTooltip.innerHTML = '<span>Content</span>';

        document.body.appendChild(masTooltip);
        await masTooltip.updateComplete;

        const miloTooltip = masTooltip.shadowRoot.querySelector('.milo-tooltip');
        expect(miloTooltip.classList.contains(position)).to.be.true;

        masTooltip.remove();
      }
    });

    it('should not render tooltip without content', async () => {
      const masTooltip = document.createElement('mas-tooltip');
      masTooltip.innerHTML = '<span>No tooltip</span>';

      document.body.appendChild(masTooltip);
      await masTooltip.updateComplete;

      const miloTooltip = masTooltip.shadowRoot.querySelector('.milo-tooltip');
      expect(miloTooltip).to.not.exist;

      // Should still render the slot content
      const slot = masTooltip.shadowRoot.querySelector('slot');
      expect(slot).to.exist;
    });
  });

  describe('Spectrum Tooltip Mode', () => {
    beforeEach(() => {
      // Simulate Spectrum being available
      hasSpectrumStub.withArgs('sp-tooltip').returns(class SpTooltip {});
    });

    it('should render Spectrum tooltip when available', async () => {
      const masTooltip = document.createElement('mas-tooltip');
      masTooltip.setAttribute('content', 'Spectrum tooltip');
      masTooltip.setAttribute('placement', 'right');
      masTooltip.setAttribute('variant', 'positive');
      masTooltip.innerHTML = '<button>Click me</button>';

      document.body.appendChild(masTooltip);
      await masTooltip.updateComplete;

      const overlayTrigger = masTooltip.shadowRoot.querySelector('overlay-trigger');
      expect(overlayTrigger).to.exist;
      expect(overlayTrigger.getAttribute('placement')).to.equal('right');

      const spTooltip = overlayTrigger.querySelector('sp-tooltip');
      expect(spTooltip).to.exist;
      expect(spTooltip.textContent.trim()).to.equal('Spectrum tooltip');
      expect(spTooltip.getAttribute('variant')).to.equal('positive');
    });
  });

  describe('Integration with merch-icon', () => {
    it('should work when wrapped around merch-icon', async () => {
      hasSpectrumStub.returns(undefined); // Milo mode

      const masTooltip = document.createElement('mas-tooltip');
      masTooltip.setAttribute('content', 'Icon tooltip');
      masTooltip.innerHTML = '<merch-icon src="icon.svg" alt="Icon"></merch-icon>';

      document.body.appendChild(masTooltip);
      await masTooltip.updateComplete;

      const miloTooltip = masTooltip.shadowRoot.querySelector('.milo-tooltip');
      expect(miloTooltip).to.exist;

      // Check that slot content is preserved
      const slot = masTooltip.shadowRoot.querySelector('slot');
      expect(slot).to.exist;
    });
  });

  describe('Icon-based tooltip', () => {
    beforeEach(() => {
      hasSpectrumStub.returns(undefined); // Milo mode
    });

    it('should render icon with tooltip using tooltip-text attribute', async () => {
      const masTooltip = document.createElement('mas-tooltip');
      masTooltip.setAttribute('src', 'https://www.adobe.com/express/code/icons/info.svg');
      masTooltip.setAttribute('size', 'xs');
      masTooltip.setAttribute('tooltip-text', 'This is an icon tooltip');
      masTooltip.setAttribute('tooltip-placement', 'bottom');

      document.body.appendChild(masTooltip);
      await masTooltip.updateComplete;

      const miloTooltip = masTooltip.shadowRoot.querySelector('.milo-tooltip');
      expect(miloTooltip).to.exist;
      expect(miloTooltip.getAttribute('data-tooltip')).to.equal('This is an icon tooltip');
      expect(miloTooltip.classList.contains('bottom')).to.be.true;

      const icon = masTooltip.shadowRoot.querySelector('merch-icon');
      expect(icon).to.exist;
      expect(icon.getAttribute('src')).to.equal('https://www.adobe.com/express/code/icons/info.svg');
      expect(icon.getAttribute('size')).to.equal('xs');
    });

    it('should render icon without tooltip when tooltip-text is not provided', async () => {
      const masTooltip = document.createElement('mas-tooltip');
      masTooltip.setAttribute('src', 'https://www.adobe.com/express/code/icons/info.svg');
      masTooltip.setAttribute('size', 's');

      document.body.appendChild(masTooltip);
      await masTooltip.updateComplete;

      const icon = masTooltip.shadowRoot.querySelector('merch-icon');
      expect(icon).to.exist;
      expect(icon.getAttribute('size')).to.equal('s');

      const miloTooltip = masTooltip.shadowRoot.querySelector('.milo-tooltip');
      expect(miloTooltip).to.not.exist;
    });

    it('should work with Spectrum tooltips when available', async () => {
      hasSpectrumStub.withArgs('sp-tooltip').returns(class SpTooltip {});

      const masTooltip = document.createElement('mas-tooltip');
      masTooltip.setAttribute('src', 'https://www.adobe.com/express/code/icons/info.svg');
      masTooltip.setAttribute('size', 'm');
      masTooltip.setAttribute('tooltip-text', 'Spectrum icon tooltip');
      masTooltip.setAttribute('tooltip-placement', 'right');

      document.body.appendChild(masTooltip);
      await masTooltip.updateComplete;

      const overlayTrigger = masTooltip.shadowRoot.querySelector('overlay-trigger');
      expect(overlayTrigger).to.exist;
      expect(overlayTrigger.getAttribute('placement')).to.equal('right');

      const spTooltip = overlayTrigger.querySelector('sp-tooltip');
      expect(spTooltip).to.exist;
      expect(spTooltip.textContent.trim()).to.equal('Spectrum icon tooltip');

      const icon = masTooltip.shadowRoot.querySelector('merch-icon');
      expect(icon).to.exist;
      expect(icon.getAttribute('size')).to.equal('m');
    });
  });
});
