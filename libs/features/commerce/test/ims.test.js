import { expect, sinon } from './utils.js';
import { pollImsCountry } from '../src/ims.js';

describe('pollImsCountry', () => {
  afterEach(() => {
    delete window.adobeIMS;
  });

  it('resolves to undefined for anonymous user', async () => {
    window.adobeIMS = { isSignedInUser: () => false };
    expect(await pollImsCountry()).to.be.undefined;
  });

  it('resolves to country set in IMS user profile', async () => {
    window.adobeIMS = {
      isSignedInUser: () => true,
      getProfile: () => Promise.resolve({ countryCode: 'CH' }),
    };
    expect(await pollImsCountry()).to.equal('CH');
  });

  it('resolves to undefined by timeout if IMS was not detected', async () => {
    const IMS_POLL_INTERVAL = 1;
    const IMS_POLL_MAX_ATTEMPTS = 3;
    const promise = pollImsCountry({
      interval: IMS_POLL_INTERVAL,
      maxAttempts: IMS_POLL_MAX_ATTEMPTS,
    });
    
    const clock = sinon.useFakeTimers();
    let attempt = -1;
    while (++attempt < IMS_POLL_MAX_ATTEMPTS) {
      clock.tick(IMS_POLL_INTERVAL);
      clock.runAll();
    }
    clock.restore();

    expect(await promise).to.be.undefined;
  });
});
