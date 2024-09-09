import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

import titleAppend from '../../../libs/features/title-append/title-append.js';

describe('Title Append', () => {
  describe('titleAppend', () => {
    beforeEach(async () => {
      document.head.innerHTML = await readFile({ path: './mocks/head.html' });
    });

    it('should not append when appendage is falsey', () => {
      titleAppend('');
      expect(document.title).to.equal('Document Title');
    });

    it('should append string to doc title', () => {
      titleAppend('NOODLE');
      expect(document.title).to.equal('Document Title NOODLE');
    });
  });
  describe('titleAppend with social metdata', () => {
    beforeEach(async () => {
      document.head.innerHTML = await readFile({ path: './mocks/head-social.html' });
    });

    it('should append to og:title', () => {
      titleAppend('NOODLE');
      const actualTitle = document.querySelector('meta[property="og:title"]').getAttribute('content');
      expect(actualTitle).to.equal('Document Title NOODLE');
    });

    it('should append string to twitter:title', () => {
      titleAppend('NOODLE');
      const actualTitle = document.querySelector('meta[name="twitter:title"]').getAttribute('content');
      expect(actualTitle).to.equal('Document Title NOODLE');
    });
  });
});
