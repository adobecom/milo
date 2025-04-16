import { expect } from '@esm-bundle/chai';
import {
  getLocalesFromUi,
  createRedirectsList,
  processRedirects,
} from '../../../libs/blocks/redirects-formatter/utils/process-redirects.js';

describe('Process Redirects', () => {
  describe('getLocalesFromUi', () => {
    it('should return an array of checked locale IDs', () => {
      const nodeList = [
        { id: 'en', checked: true },
        { id: 'fr', checked: false },
        { id: 'de', checked: true },
      ];
      const result = getLocalesFromUi(nodeList);
      expect(result).to.deep.equal(['en', 'de']);
    });

    it('should return empty array when no locales checked', () => {
      const nodeList = [
        { id: 'en', checked: false },
        { id: 'fr', checked: false },
      ];
      expect(getLocalesFromUi(nodeList)).to.deep.equal([]);
    });
  });

  describe('createRedirectsList', () => {
    let originalBody;

    beforeEach(() => {
      originalBody = document.body.innerHTML;
    });

    afterEach(() => {
      document.body.innerHTML = originalBody;
    });

    it('should create pairs from textarea input', () => {
      document.body.innerHTML = `
        <div class="redirect-input">
          <textarea class="redirect-pairs">/path1  /path2
/path3   /path4</textarea>
        </div>
      `;
      const inputArea = document.querySelector('.redirect-input');
      const result = createRedirectsList(inputArea);
      expect(result).to.deep.equal([
        { source: '/path1', destination: '/path2' },
        { source: '/path3', destination: '/path4' },
      ]);
    });

    it('should create pairs from input containers', () => {
      document.body.innerHTML = `
        <div class="redirect-input">
          <div class="input-container">
            <input type="text" class="source" value="/source1">
            <input type="text" class="destination" value="/dest1">
          </div>
          <div class="input-container">
            <input type="text" class="source" value="/source2">
            <input type="text" class="destination" value="/dest2">
          </div>
        </div>
      `;
      const inputArea = document.querySelector('.redirect-input');
      const result = createRedirectsList(inputArea);
      expect(result).to.deep.equal([
        { source: '/source1', destination: '/dest1' },
        { source: '/source2', destination: '/dest2' },
      ]);
    });
  });

  describe('processRedirects', () => {
    it('should process redirects for multiple locales', () => {
      const redirectList = [{
        source: 'https://www.example.com/path1',
        destination: 'https://www.adobe.com/path2',
      }];
      const locales = ['en', 'fr'];
      const errorCallback = () => {};

      const result = processRedirects(redirectList, locales, errorCallback);
      expect(result).to.deep.equal([
        ['/en/path1', 'https://www.adobe.com/en/path2.html'],
        ['/fr/path1', 'https://www.adobe.com/fr/path2.html'],
      ]);
    });

    it('should handle blog paths without adding .html', () => {
      const redirectList = [{
        source: 'https://example.com/blog/post1',
        destination: 'https://adobe.com/blog/post2',
      }];
      const locales = ['en'];
      const errorCallback = () => {};

      const result = processRedirects(redirectList, locales, errorCallback);
      expect(result).to.deep.equal([
        ['/en/blog/post1', 'https://adobe.com/en/blog/post2'],
      ]);
    });

    it('should call error callback for invalid URLs', () => {
      let errorCalled = false;
      const redirectList = [{
        source: 'invalid-url',
        destination: 'https://www.adobe.com/path',
      }];
      const locales = ['en'];
      const errorCallback = () => { errorCalled = true; };

      processRedirects(redirectList, locales, errorCallback);
      expect(errorCalled).to.be.true;
    });

    it('should handle external domains without adding .html', () => {
      const redirectList = [{
        source: 'https://example.com/path1',
        destination: 'https://external.com/path2',
      }];
      const locales = ['en'];
      const errorCallback = () => {};

      const result = processRedirects(redirectList, locales, errorCallback);
      expect(result).to.deep.equal([
        ['/en/path1', 'https://external.com/en/path2'],
      ]);
    });
  });
});
