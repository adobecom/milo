import { expect } from '@esm-bundle/chai';
import init, { generateM7Link } from '../../../libs/blocks/m7business/m7business.js';

describe('m7business autoblock', () => {
  it('Converts business plans link to M7 link', async () => {
    const a = document.createElement('a');
    a.setAttribute('href', 'https://www.adobe.com/creativecloud/business-plans.html');
    await init(a);
    expect(a.href).to.equal('https://commerce.adobe.com/store/segmentation?cli=creative&co=US&pa=ccsn_direct_individual&cs=t');
  });

  it('Converts business plans link to M7 link for signed in user', async () => {
    const buIms = window.adobeIMS;
    const profile = { countryCode: 'CH' };
    window.adobeIMS = { getProfile: () => profile, isSignedInUser: () => true };
    const m7Link = await generateM7Link([]);
    expect(m7Link).to.equal('https://commerce.adobe.com/store/segmentation?cli=creative&co=CH&pa=ccsn_direct_individual&cs=t');
    window.adobeIMS = buIms;
  });
});
