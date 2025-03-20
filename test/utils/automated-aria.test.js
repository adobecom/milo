// test/aria-labels.test.js
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { readFile } from '@web/test-runner-commands';
import addAriaLabels, {
  getTextBeforeHeader,
  getProduct,
  findBlockContainers,
  addAriaLabelToCTA,
} from '../../libs/utils/automated-aria.js';

const { setConfig } = await import('../../libs/utils/utils.js');

const mockConfig = {};
setConfig(mockConfig);

describe('ARIA Labels Utility Functions', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('getTextBeforeHeader', () => {
    it('should get text before header', async () => {
      const html = await readFile({ path: './mocks/aria/text-before-header.html' });
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      expect(getTextBeforeHeader(doc.body.firstElementChild)).to.equal('Some text\n  Some more text');
    });

    it('should return empty string when no header', async () => {
      const html = await readFile({ path: './mocks/aria/text-before-header.html' });
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      expect(getTextBeforeHeader(doc.body.lastElementChild)).to.equal('');
    });
  });

  describe('getProduct', () => {
    const productNames = [{ us: 'Photoshop' }, { us: 'Acrobat Pro' }];

    it('should find product in text', () => {
      expect(getProduct('Get Photoshop Now', productNames)).to.equal('Photoshop');
      expect(getProduct('acrobat pro here', productNames)).to.equal('Acrobat Pro');
    });

    it('should return empty string when no match', () => {
      expect(getProduct('No product', productNames)).to.equal('');
    });
  });

  describe('findBlockContainers', () => {
    it('should find direct divs with common prefix', async () => {
      const html = await readFile({ path: './mocks/aria/block-containers.html' });
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const containers = findBlockContainers(doc.body.querySelectorAll(':scope > div')[0]);
      expect(containers.length).to.equal(2);
    });

    it('should return container when no direct divs', async () => {
      const html = await readFile({ path: './mocks/aria/block-containers.html' });
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const containers = findBlockContainers(doc.body.querySelectorAll(':scope > div')[1]);
      expect(containers.length).to.equal(1);
      expect(containers[0]).to.equal(doc.body.querySelectorAll(':scope > div')[1]);
    });
  });

  describe('addAriaLabelToCTA', () => {
    const productNames = [{ us: 'Photoshop' }, { us: 'Acrobat Pro' }];
    const textsToAddProductNames = ['buy now'];
    const textsToAddHeaders = ['learn more'];

    it('should add product name to CTA', async () => {
      const html = await readFile({ path: './mocks/aria/cta-labels.html' });
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const cta = doc.querySelector('.con-button');
      addAriaLabelToCTA(cta, productNames, textsToAddProductNames, textsToAddHeaders);
      expect(cta.getAttribute('aria-label')).to.equal('Buy Now Photoshop');
    });

    it('should add header to CTA', async () => {
      const html = await readFile({ path: './mocks/aria/cta-labels.html' });
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const cta = doc.querySelectorAll('.con-button')[1];
      addAriaLabelToCTA(cta, productNames, textsToAddProductNames, textsToAddHeaders);
      expect(cta.getAttribute('aria-label')).to.equal('Learn More - Express details');
    });
  });

  describe('addAriaLabels', () => {
    beforeEach(() => {
      window.lana = { log: sinon.stub() };
    });

    afterEach(() => {
      delete window.lana;
    });

    it('should handle fetch errors gracefully', async () => {
      const html = await readFile({ path: './mocks/aria/cta-labels.html' });
      const parser = new DOMParser();
      document.body.innerHTML = parser.parseFromString(html, 'text/html').body.innerHTML;
      sandbox.stub(window, 'fetch').rejects(new Error('Network error'));
      await addAriaLabels();
      expect(window.lana.log.called).to.be.true;
    });

    it('should process CTAs with valid config', async () => {
      const config = JSON.parse(await readFile({ path: './mocks/aria/cta-aria-label-config.json' }));
      const products = JSON.parse(await readFile({ path: './mocks/aria/product-names.json' }));
      sandbox.stub(window, 'fetch')
        .onFirstCall()
        .resolves({ json: () => Promise.resolve(config) })
        .onSecondCall()
        .resolves({ json: () => Promise.resolve(products) });
      const html = await readFile({ path: './mocks/aria/cta-labels.html' });
      const parser = new DOMParser();
      document.body.innerHTML = parser.parseFromString(html, 'text/html').body.innerHTML;
      await addAriaLabels();
      const cta = document.querySelector('.con-button');
      expect(cta.getAttribute('aria-label')).to.equal('Buy Now Adobe Photoshop Extended');
    });

    it('should handle multiple CTAs with different scenarios', async () => {
      const config = JSON.parse(await readFile({ path: './mocks/aria/cta-aria-label-config.json' }));
      const products = JSON.parse(await readFile({ path: './mocks/aria/product-names.json' }));
      sandbox.stub(window, 'fetch')
        .onFirstCall()
        .resolves({ json: () => Promise.resolve(config) })
        .onSecondCall()
        .resolves({ json: () => Promise.resolve(products) });
      const html = await readFile({ path: './mocks/aria/block-containers.html' });
      const parser = new DOMParser();
      document.body.innerHTML = parser.parseFromString(html, 'text/html').body.querySelectorAll(':scope > div')[2].outerHTML;
      await addAriaLabels();
      // Check first CTA with Photoshop
      const cta1 = document.querySelector('.card-one .con-button');
      expect(cta1.getAttribute('aria-label')).to.equal('Buy Now Photoshop');
      // Check second CTA with Lightroom
      const cta2 = document.querySelector('.card-two .con-button');
      expect(cta2.getAttribute('aria-label')).to.equal('Buy Now Lightroom');
      // Check third CTA with multiple headers (should have no aria-label)
      const cta3 = document.querySelector('.card-three .con-button');
      expect(cta3.hasAttribute('aria-label')).to.be.false;
      // Check final CTA with Adobe Express
      const cta4 = document.querySelector('.card-container > h3 + .con-button');
      expect(cta4.getAttribute('aria-label')).to.equal('Free trial Adobe Express');
    });

    it('should handle multiple CTAs with containers within containers', async () => {
      const config = JSON.parse(await readFile({ path: './mocks/aria/cta-aria-label-config.json' }));
      const products = JSON.parse(await readFile({ path: './mocks/aria/product-names.json' }));
      sandbox.stub(window, 'fetch')
        .onFirstCall()
        .resolves({ json: () => Promise.resolve(config) })
        .onSecondCall()
        .resolves({ json: () => Promise.resolve(products) });
      const html = await readFile({ path: './mocks/aria/block-containers.html' });
      const parser = new DOMParser();
      document.body.innerHTML = parser.parseFromString(html, 'text/html').body.querySelectorAll(':scope > div')[3].outerHTML;
      await addAriaLabels();
      // Check first CTA with Photoshop
      const cta1div = document.querySelector('.card-one .div-one .con-button');
      expect(cta1div.getAttribute('aria-label')).to.equal('Buy Now Photoshop');
      // Check second CTA with Lightroom
      const cta2div = document.querySelector('.card-one .div-two .con-button');
      expect(cta2div.getAttribute('aria-label')).to.equal('Buy Now Acrobat');
      // Check third CTA with multiple headers (should have no aria-label)
      const cta3div = document.querySelector('.card-one .div-three .con-button');
      expect(cta3div.hasAttribute('aria-label')).to.be.false;

      // Check first CTA with Photoshop
      const cta1 = document.querySelector('.card-one .con-button');
      expect(cta1.getAttribute('aria-label')).to.equal('Buy Now Photoshop');
      // Check second CTA with Lightroom
      const cta2 = document.querySelector('.card-two .con-button');
      expect(cta2.getAttribute('aria-label')).to.equal('Buy Now Lightroom');
      // Check third CTA with multiple headers (should have no aria-label)
      const cta3 = document.querySelector('.card-three .con-button');
      expect(cta3.hasAttribute('aria-label')).to.be.false;
      // Check final CTA with Adobe Express
      const cta4 = document.querySelector('.card-container > h3 + .con-button');
      expect(cta4.getAttribute('aria-label')).to.equal('Free trial Adobe Express');
    });

    it('Does not modify existing aria-labels', async () => {
      const config = JSON.parse(await readFile({ path: './mocks/aria/cta-aria-label-config.json' }));
      const products = JSON.parse(await readFile({ path: './mocks/aria/product-names.json' }));
      sandbox.stub(window, 'fetch')
        .onFirstCall()
        .resolves({ json: () => Promise.resolve(config) })
        .onSecondCall()
        .resolves({ json: () => Promise.resolve(products) });
      const html = await readFile({ path: './mocks/aria/tabs.html' });
      const parser = new DOMParser();
      document.body.innerHTML = parser.parseFromString(html, 'text/html').body.innerHTML;
      await addAriaLabels();

      // Check CTAs in first tab panel
      const firstPanel = document.querySelector('#tab-panel-mini-compare-1');
      expect(firstPanel.querySelector('[aria-label="Select Lightroom"]')).to.exist;
      expect(firstPanel.querySelector('[aria-label="Select Photography"]')).to.exist;
      expect(firstPanel.querySelector('[aria-label="Select Creative Cloud All Apps"]')).to.exist;

      // Check CTAs in second tab panel
      const secondPanel = document.querySelector('#tab-panel-mini-compare-2');
      expect(secondPanel.querySelector('[aria-label="Select Creative Cloud All Apps for Students and Teachers"]')).to.exist;

      // Check CTAs in third tab panel
      const thirdPanel = document.querySelector('#tab-panel-mini-compare-3');
      expect(thirdPanel.querySelector('[aria-label="Select Lightroom for Teams"]')).to.exist;
      expect(thirdPanel.querySelector('[aria-label="Select Creative Cloud All Apps for business"]')).to.exist;
    });

    it('should add aria-labels to CTAs in aside promotion', async () => {
      const config = JSON.parse(await readFile({ path: './mocks/aria/cta-aria-label-config.json' }));
      const products = JSON.parse(await readFile({ path: './mocks/aria/product-names.json' }));
      sandbox.stub(window, 'fetch')
        .onFirstCall()
        .resolves({ json: () => Promise.resolve(config) })
        .onSecondCall()
        .resolves({ json: () => Promise.resolve(products) });
      const html = await readFile({ path: './mocks/aria/aside-promotion.html' });
      const parser = new DOMParser();
      document.body.innerHTML = parser.parseFromString(html, 'text/html').body.innerHTML;
      await addAriaLabels();

      // Check mobile CTAs
      const mobileCTAs = document.querySelector('.mobile-up .action-area').querySelectorAll('.con-button');
      expect(mobileCTAs[0].getAttribute('aria-label')).to.not.exist;
      expect(mobileCTAs[1].getAttribute('aria-label')).to.not.exist;

      // Check tablet CTAs
      const tabletCTAs = document.querySelector('.tablet-up .action-area').querySelectorAll('.con-button');
      expect(tabletCTAs[0].getAttribute('aria-label')).to.equal('Free trial Creative Cloud');
      expect(tabletCTAs[1].getAttribute('aria-label')).to.equal('Buy now Creative Cloud');

      // Check desktop CTAs
      const desktopCTAs = document.querySelector('.desktop-up .action-area').querySelectorAll('.con-button');
      expect(desktopCTAs[0].getAttribute('aria-label')).to.equal('Free trial Creative Cloud');
      expect(desktopCTAs[1].getAttribute('aria-label')).to.equal('Buy now Creative Cloud');
    });
  });
});
