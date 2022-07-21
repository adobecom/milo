/* global describe it */
import { expect } from '@esm-bundle/chai';
import setJsonLdProductInfo from '../../../../../libs/blocks/review/utils/setJsonLdProductInfo.js';

describe('setJsonLdProductInfo Util', () => {
  it('could set header', () => {
    setJsonLdProductInfo({ product: 'PS' }, 2.8, 10);
    const ldJsonTag = document.head.querySelector(
      'script[type="application/ld+json"]'
    );
    // eslint-disable-next-line no-unused-expressions
    expect(ldJsonTag).to.be.not.null;
  });
});
