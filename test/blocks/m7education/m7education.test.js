import { expect } from '@esm-bundle/chai';
import init from '../../../libs/blocks/m7education/m7education.js';

describe('m7education autoblock', () => {
  it('Converts education plans link to M7 link', async () => {
    const a = document.createElement('a');
    a.setAttribute('href', 'https://www.adobe.com/creativecloud/education-plans.html');
    await init(a);
    expect(a.href).to.equal('https://commerce.adobe.com/store/segmentation?cli=creative&co=US&pa=ccsn_direct_individual&cs=t&ms=EDU');
  });
});
