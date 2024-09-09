import { expect } from '@esm-bundle/chai';
import sanitizeComment from '../../libs/utils/sanitizeComment.js';

describe('sanitizeComment Util', () => {
  it('could sanitize a comment', () => {
    const input = '?Comment at #$http://www.adobe.com';
    const expectedOutput = 'Comment at http://www.adobe.com';
    expect(sanitizeComment(input)).to.be.equal(expectedOutput);
  });
});
