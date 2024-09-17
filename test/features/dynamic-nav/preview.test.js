import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { setConfig } from '../../../libs/utils/utils.js';
import dynamicNav from '../../../libs/features/dynamic-navigation/dynamic-navigation.js';
import preview from '../../../libs/features/dynamic-navigation/preview.js';

describe('Dynamic Nav Preview', () => {
  beforeEach(() => {
    const conf = { dynamicNavKey: 'bacom' };
    setConfig(conf);
    window.sessionStorage.setItem('gnavSource', 'some-source-string');
  });

  describe('Utility functions', () => {
    it('Parses an entry page and returns the correct dynamic-nav information', async () => {
      document.head.innerHTML = await readFile({ path: './mocks/entry.html' });
      window.sessionStorage.removeItem('gnavSource');
      dynamicNav('gnav/aem-sites', 'bacom');
      const previewInfo = preview();
      console.log(previewInfo);
      expect(previewInfo.isConsumerEnabled).to.equal(true);
      expect(previewInfo.consumerKey).to.equal('bacom');
      expect(previewInfo.originalNavSource).to.equal('Metadata not found: site gnav source');
      expect(previewInfo.navSourceInStorage).to.equal('gnav/aem-sites');
    });

    it('Parses an on page and returns the correct dynamic-nav information', async () => {
      document.head.innerHTML = await readFile({ path: './mocks/on.html' });
      dynamicNav('gnav/aem-sites', 'bacom');
      const previewInfo = preview();
      console.log(previewInfo);
      expect(previewInfo.isConsumerEnabled).to.equal(true);
      expect(previewInfo.consumerKey).to.equal('bacom');
      expect(previewInfo.originalNavSource).to.equal('Metadata not found: site gnav source');
      expect(previewInfo.navSourceInStorage).to.equal('some-source-string');
    });

    it('Parses metadata and returns the correct dynamic-nav-state', async () => {
      expect(true).to.equal(false);
    });
  });

  describe('Element creation and placement', () => {
    it('Creates the preview button', () => {
      expect(true).to.equal(false);
    });

    it('Attaches the preview button to the correct place in the nav', () => {

    });
  });
});
