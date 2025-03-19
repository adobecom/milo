// test/aria-labels.test.js
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { readFile } from '@web/test-runner-commands';
import addAriaLabels, {
  getTextBeforeHeader,
  getProduct,
  getVisibleHeaders,
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

  describe('getVisibleHeaders', () => {
    it('should get visible headers only', async () => {
      const html = await readFile({ path: './mocks/aria/visible-headers.html' });
      const parser = new DOMParser();
      document.body.innerHTML = parser.parseFromString(html, 'text/html').body.innerHTML;
      const headers = getVisibleHeaders(document.body, 1);
      expect(headers.length).to.equal(1);
      expect(headers[0].textContent).to.equal('Visible');
    });
  });

  describe('findBlockContainers', () => {
    it('should find direct divs with common prefix', async () => {
      const html = await readFile({ path: './mocks/aria/block-containers.html' });
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const containers = findBlockContainers(doc.body.firstElementChild);
      expect(containers.length).to.equal(2);
    });

    it('should return container when no direct divs', async () => {
      const html = await readFile({ path: './mocks/aria/block-containers.html' });
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const containers = findBlockContainers(doc.body.lastElementChild);
      expect(containers.length).to.equal(1);
      expect(containers[0]).to.equal(doc.body.lastElementChild);
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
      expect(cta.getAttribute('aria-label')).to.equal('Learn More Express details');
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
      sandbox.stub(window, 'fetch').rejects(new Error('Network error'));
      await addAriaLabels();
      expect(window.lana.log.called).to.be.true;
    });

    it.only('should process CTAs with valid config', async () => {
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
  });
});
