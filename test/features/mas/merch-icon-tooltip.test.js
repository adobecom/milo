/* eslint-disable no-undef */
import { expect } from '@esm-bundle/chai';
import '../../../libs/features/mas/src/merch-icon.js';
import '../../../libs/features/mas/src/mas-tooltip.js';

describe('MerchIcon Tooltip Handling', () => {
  let hasSpectrumStub;

  beforeEach(() => {
    document.body.innerHTML = '';

    // Stub customElements.get to control whether Spectrum is available
    hasSpectrumStub = sinon.stub(customElements, 'get');
  });

  afterEach(() => {
    hasSpectrumStub.restore();
  });

  describe('When Spectrum is not available', () => {
    beforeEach(() => {
      // Simulate Spectrum not being available
      hasSpectrumStub.returns(undefined);
    });

    it('should convert sp-tooltip children to mas-tooltip', async () => {
      const merchIcon = document.createElement('merch-icon');
      merchIcon.setAttribute('src', 'test-icon.svg');
      merchIcon.setAttribute('alt', 'Test icon');
      merchIcon.innerHTML = '<sp-tooltip placement="bottom">Icon tooltip text</sp-tooltip>';

      document.body.appendChild(merchIcon);

      // Wait for the tooltip conversion
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Check that sp-tooltip was removed
      expect(merchIcon.querySelector('sp-tooltip')).to.not.exist;

      // Check that mas-tooltip was created
      const masTooltip = merchIcon.querySelector('mas-tooltip');
      expect(masTooltip).to.exist;
      expect(masTooltip.getAttribute('content')).to.equal('Icon tooltip text');
      expect(masTooltip.getAttribute('placement')).to.equal('bottom');

      // Check that the image is inside the tooltip
      const img = masTooltip.querySelector('img');
      expect(img).to.exist;
      expect(img.getAttribute('src')).to.equal('test-icon.svg');
    });

    it('should handle overlay-trigger with sp-tooltip', async () => {
      const merchIcon = document.createElement('merch-icon');
      merchIcon.setAttribute('src', 'test-icon.svg');
      merchIcon.innerHTML = `
        <overlay-trigger placement="right">
          <sp-tooltip>Overlay tooltip content</sp-tooltip>
        </overlay-trigger>
      `;

      document.body.appendChild(merchIcon);

      // Wait for the tooltip conversion
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Check that overlay-trigger was removed
      expect(merchIcon.querySelector('overlay-trigger')).to.not.exist;

      // Check that mas-tooltip was created
      const masTooltip = merchIcon.querySelector('mas-tooltip');
      expect(masTooltip).to.exist;
      expect(masTooltip.getAttribute('content')).to.equal('Overlay tooltip content');
      expect(masTooltip.getAttribute('placement')).to.equal('right');
    });

    it('should preserve href when converting tooltips', async () => {
      const merchIcon = document.createElement('merch-icon');
      merchIcon.setAttribute('src', 'test-icon.svg');
      merchIcon.setAttribute('href', 'https://example.com');
      merchIcon.innerHTML = '<sp-tooltip>Link tooltip</sp-tooltip>';

      document.body.appendChild(merchIcon);
      await merchIcon.updateComplete;

      // Wait for the tooltip conversion
      await new Promise((resolve) => setTimeout(resolve, 100));

      const masTooltip = merchIcon.querySelector('mas-tooltip');
      expect(masTooltip).to.exist;

      // Check that the link is preserved inside the tooltip
      const link = masTooltip.querySelector('a');
      expect(link).to.exist;
      expect(link.getAttribute('href')).to.equal('https://example.com');
    });
  });

  describe('When Spectrum is available', () => {
    beforeEach(() => {
      // Simulate Spectrum being available
      hasSpectrumStub.withArgs('sp-tooltip').returns(class SpTooltip {});
    });

    it('should not convert sp-tooltip children', async () => {
      const merchIcon = document.createElement('merch-icon');
      merchIcon.setAttribute('src', 'test-icon.svg');
      merchIcon.innerHTML = '<sp-tooltip>Keep this tooltip</sp-tooltip>';

      document.body.appendChild(merchIcon);

      // Wait to ensure no conversion happens
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Check that sp-tooltip is still there
      expect(merchIcon.querySelector('sp-tooltip')).to.exist;
      expect(merchIcon.querySelector('mas-tooltip')).to.not.exist;
    });
  });

  describe('Edge cases', () => {
    it('should handle merch-icon without tooltips', async () => {
      hasSpectrumStub.returns(undefined);

      const merchIcon = document.createElement('merch-icon');
      merchIcon.setAttribute('src', 'test-icon.svg');
      merchIcon.setAttribute('alt', 'Simple icon');

      document.body.appendChild(merchIcon);
      await merchIcon.updateComplete;

      // Wait to ensure nothing breaks
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Should render normally
      const img = merchIcon.shadowRoot.querySelector('img');
      expect(img).to.exist;
      expect(img.getAttribute('src')).to.equal('test-icon.svg');
      expect(img.getAttribute('alt')).to.equal('Simple icon');
    });

    it('should handle empty sp-tooltip', async () => {
      hasSpectrumStub.returns(undefined);

      const merchIcon = document.createElement('merch-icon');
      merchIcon.setAttribute('src', 'test-icon.svg');
      merchIcon.innerHTML = '<sp-tooltip></sp-tooltip>';

      document.body.appendChild(merchIcon);

      // Wait for the tooltip conversion
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Should create tooltip even with empty content
      const masTooltip = merchIcon.querySelector('mas-tooltip');
      expect(masTooltip).to.exist;
      expect(masTooltip.getAttribute('content')).to.equal('');
    });
  });
});
