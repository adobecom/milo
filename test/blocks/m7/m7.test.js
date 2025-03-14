import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import init from '../../../libs/blocks/m7/m7.js';

describe('m7business autoblock', () => {
  before(async () => {
    window.lana = { log: sinon.stub() };
  });

  beforeEach(() => {
    document.head.innerHTML = '';
  });

  it('Converts business plans link to M7 link no meta m7-pa-code', () => {
    const a = document.createElement('a');
    a.setAttribute('href', 'https://www.adobe.com/creativecloud/business-plans.html');
    init(a);
    expect(a.href).to.equal('https://www.adobe.com/creativecloud/business-plans.html');
  });

  it('Converts business plans link to M7 link', () => {
    document.head.innerHTML = '<meta name="m7-pa-code" content="ccsn_direct_individual">';
    const a = document.createElement('a');
    a.setAttribute('href', 'https://www.adobe.com/creativecloud/business-plans.html');
    init(a);
    expect(a.href).to.equal('https://commerce.adobe.com/store/segmentation?cli=creative&cs=t&co=US&pa=ccsn_direct_individual');
  });

  it('Converts education plans link to M7 link', () => {
    document.head.innerHTML = '<meta name="m7-pa-code" content="ccsn_direct_individual">';
    const a = document.createElement('a');
    a.setAttribute('href', 'https://www.adobe.com/creativecloud/education-plans.html');
    init(a);
    expect(a.href).to.equal('https://commerce.adobe.com/store/segmentation?cli=creative&cs=t&co=US&pa=ccsn_direct_individual&ms=EDU');
  });

  it('Handles the errors gracefully', () => {
    document.head.innerHTML = '<meta name="m7-pa-code" content="ccsn_direct_individual">';
    const element = { href: null };
    init(element);
    expect(element).to.exist;
    expect(element.href).to.be.null;
    expect(window.lana.log.calledOnce).to.be.true;
    expect(window.lana.log.calledWith('Cannot generate M7 URL. TypeError: Cannot read properties of null (reading \'includes\')')).to.be.true;
  });
});
