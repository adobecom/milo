import { expect } from '@esm-bundle/chai';
import { stub } from 'sinon';
import getUserEventHistory from '../../../../libs/blocks/global-navigation/utilities/getUserEventHistory.js';
import { mockRes } from '../test-utilities.js';
import { setConfig } from '../../../../libs/utils/utils.js';

describe('getUserEventHistory', () => {
  const ogFetch = window.fetch;
  beforeEach(() => {
    window.fetch = stub().callsFake(() => mockRes({ payload: true }));
  });
  afterEach(() => {
    window.fetch = ogFetch;
    window.adobeIMS = undefined;
  });

  it('throws an error if the user is not signed in', async () => {
    window.adobeIMS = { isSignedInUser: () => false };
    try {
      await getUserEventHistory();
    } catch (e) {
      expect(e.message).to.equal('User not signed in');
    }
  });

  it('should return true if a user has been historically registered', async () => {
    window.adobeIMS = {
      isSignedInUser: () => true,
      getProfile: () => ({ id: 'mock' }),
    };
    setConfig({ env: { name: 'prod' } });
    const res = await getUserEventHistory();
    expect(res).to.be.true;
  });
});
