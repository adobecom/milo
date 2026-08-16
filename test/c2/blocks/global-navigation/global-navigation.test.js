import { expect } from '@esm-bundle/chai';
import { stub } from 'sinon';
import { getFederalDomain } from '../../../../libs/c2/blocks/global-navigation/global-navigation.js';

const DEFAULT = 'https://main--federal--adobecom.aem.page/federal';

describe('c2 global-navigation getFederalDomain fedsbranch validation', () => {
  let getStub;
  const setFedsbranch = (value) => {
    getStub = stub(URLSearchParams.prototype, 'get').callThrough();
    getStub.withArgs('fedsbranch').returns(value);
  };

  afterEach(() => {
    getStub?.restore();
  });

  it('accepts a valid branch name', () => {
    setFedsbranch('my-branch');
    expect(getFederalDomain({})).to.equal('https://my-branch--federal--adobecom.aem.page/federal');
  });

  it('accepts the local sentinel', () => {
    setFedsbranch('local');
    expect(getFederalDomain({})).to.equal('http://localhost:3000/federal');
  });

  it('lowercases before validating', () => {
    setFedsbranch('My-Branch');
    expect(getFederalDomain({})).to.equal('https://my-branch--federal--adobecom.aem.page/federal');
  });

  it('rejects a value that would break out of the host authority', () => {
    setFedsbranch('hoodhmnd.github.io/poc/x#');
    const result = getFederalDomain({});
    expect(result).to.not.include('github');
    expect(result).to.equal(DEFAULT);
  });

  it('rejects a slash-injected value', () => {
    setFedsbranch('foo/bar');
    expect(getFederalDomain({})).to.equal(DEFAULT);
  });

  it('rejects an at-sign-injected value', () => {
    setFedsbranch('foo@evil.com');
    expect(getFederalDomain({})).to.equal(DEFAULT);
  });

  it('ignores an empty value', () => {
    setFedsbranch('   ');
    expect(getFederalDomain({})).to.equal(DEFAULT);
  });

  it('ignores fedsbranch entirely on prod', () => {
    setFedsbranch('my-branch');
    expect(getFederalDomain({ clientEnv: 'prod' })).to.equal('https://www.adobe.com/federal');
  });
});
