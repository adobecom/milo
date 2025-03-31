import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import init, { generateM7Link } from '../../../libs/blocks/m7/m7.js';
import { setConfig } from '../../../libs/utils/utils.js';

describe('m7business autoblock', () => {
  before(async () => {
    window.lana = { log: sinon.stub() };
  });

  beforeEach(() => {
    document.head.innerHTML = '';
  });

  it('Converts business plans link to M7 link no meta m7-pa-code', async () => {
    const buIms = window.adobeIMS;
    window.adobeIMS = { initialized: true, getProfile: () => {}, isSignedInUser: () => false };
    const a = document.createElement('a');
    a.setAttribute('href', 'https://www.adobe.com/creativecloud/business-plans.html');
    await init(a);
    expect(a.href).to.equal('https://www.adobe.com/creativecloud/business-plans.html');
    window.adobeIMS = buIms;
  });

  it('Converts business plans link to M7 link', async () => {
    document.head.innerHTML = '<meta name="m7-pa-code" content="ccsn_direct_individual">';
    const buIms = window.adobeIMS;
    window.adobeIMS = { initialized: true, getProfile: () => {}, isSignedInUser: () => false };
    const a = document.createElement('a');
    a.setAttribute('href', 'https://www.adobe.com/creativecloud/business-plans.html');
    await init(a);
    expect(a.href).to.equal('https://commerce.adobe.com/store/segmentation?cli=creative&cs=t&co=US&pa=ccsn_direct_individual');
    window.adobeIMS = buIms;
  });

  it('Converts education plans link to M7 link', async () => {
    document.head.innerHTML = '<meta name="m7-pa-code" content="ccsn_direct_individual">';
    const buIms = window.adobeIMS;
    window.adobeIMS = { initialized: true, getProfile: () => {}, isSignedInUser: () => false };
    const a = document.createElement('a');
    a.setAttribute('href', 'https://www.adobe.com/creativecloud/education-plans.html');
    await init(a);
    expect(a.href).to.equal('https://commerce.adobe.com/store/segmentation?cli=creative&cs=t&co=US&pa=ccsn_direct_individual&ms=EDU');
    window.adobeIMS = buIms;
  });

  it('Handles the errors gracefully', async () => {
    document.head.innerHTML = '<meta name="m7-pa-code" content="ccsn_direct_individual">';
    const buIms = window.adobeIMS;
    window.adobeIMS = { initialized: true, getProfile: () => {}, isSignedInUser: () => false };
    const element = { href: null };
    await init(element);
    expect(element).to.exist;
    expect(element.href).to.be.null;
    expect(window.lana.log.calledOnce).to.be.true;
    expect(window.lana.log.calledWith('Cannot generate M7 URL. TypeError: Cannot read properties of null (reading \'includes\')')).to.be.true;
    window.adobeIMS = buIms;
  });

  it('Converts business plans link to M7 link for signed in user - IMS not ready', async () => {
    document.head.innerHTML = '<meta name="m7-pa-code" content="ccsn_direct_individual">';
    const buIms = window.adobeIMS;
    const profile = { countryCode: 'CH' };
    window.adobeIMS = { initialized: false, getProfile: () => profile, isSignedInUser: () => true };
    const a = document.createElement('a');
    a.setAttribute('href', 'https://www.adobe.com/creativecloud/business-plans.html');
    setTimeout(() => {
      window.dispatchEvent(new window.CustomEvent('getImsLibInstance'));
      expect(a.href).to.equal('https://commerce.adobe.com/store/segmentation?cli=creative&cs=t&co=US&pa=ccsn_direct_individual');
      window.adobeIMS = buIms;
    }, 100);
    await init(a);
  });

  it('Converts business plans link to M7 link for signed in user', async () => {
    const cfg = {
      pathname: '/ch_fr/blah.html',
      locales: {
        '': { ietf: 'en-US' },
        ch_fr: { ietf: 'fr-CH' },
      },
    };
    setConfig(cfg);
    document.head.innerHTML = '<meta name="m7-pa-code" content="ccsn_direct_individual">';
    const buIms = window.adobeIMS;
    const profile = { countryCode: 'CH' };
    window.adobeIMS = { initialized: true, getProfile: () => profile, isSignedInUser: () => true };
    const m7Link = await generateM7Link('/creativecloud/business-plans');
    expect(m7Link).to.equal('https://commerce.adobe.com/store/segmentation?cli=creative&cs=t&co=CH&pa=ccsn_direct_individual&lang=fr');
    window.adobeIMS = buIms;
  });
});
