import { expect } from '@esm-bundle/chai';
import init from '../../../libs/blocks/m7education/m7education.js';

describe('m7education autoblock', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
  });

  it('Converts education plans link to M7 link', () => {
    document.head.innerHTML = '<meta name="m7-pa-code" content="ccsn_direct_individual">';
    const a = document.createElement('a');
    a.setAttribute('href', 'https://www.adobe.com/creativecloud/education-plans.html');
    init(a);
    expect(a.href).to.equal('https://commerce.adobe.com/store/segmentation?cli=creative&cs=t&co=US&pa=ccsn_direct_individual&ms=EDU');
  });

  it('Converts education plans link to M7 link no meta m7-pa-code', () => {
    const a = document.createElement('a');
    a.setAttribute('href', 'https://www.adobe.com/creativecloud/education-plans.html');
    init(a);
    expect(a.href).to.equal('https://www.adobe.com/creativecloud/education-plans.html');
  });
});
