import { expect } from '@esm-bundle/chai';
import { enablePersonalizationV2, rememberSignedInEcid } from '../../libs/utils/utils.js';

function mockPerformanceData(serverTimingData) {
  window.performance.getEntriesByType = () => [{ serverTiming: serverTimingData }];
}

describe('enablePersonalizationV2', () => {
  it('should return true when personalization-v2 meta tag is present and user is signed out', () => {
    const metaTag = document.createElement('meta');
    metaTag.setAttribute('name', 'personalization-v2');
    metaTag.setAttribute('content', 'personalization-v2');
    document.head.appendChild(metaTag);

    mockPerformanceData([]);

    const result = enablePersonalizationV2();
    expect(result).to.be.true;
    metaTag.parentNode.removeChild(metaTag);
  });

  it('should return false when personalization-v2 meta tag is present and user is signed in', () => {
    const metaTag = document.createElement('meta');
    metaTag.setAttribute('name', 'personalization-v2');
    metaTag.setAttribute('content', 'personalization-v2');
    document.head.appendChild(metaTag);
    mockPerformanceData([{ name: 'sis', description: '1' }]);

    const result = enablePersonalizationV2();
    expect(result).to.be.false;
    metaTag.parentNode.removeChild(metaTag);
  });

  it('should return false when personalization-v2 meta tag is absent', () => {
    const result = enablePersonalizationV2();
    expect(result).to.be.false;
  });

  it('should return true when serverTiming is empty (signed out)', () => {
    const metaTag = document.createElement('meta');
    metaTag.setAttribute('name', 'personalization-v2');
    metaTag.setAttribute('content', 'personalization-v2');
    document.head.appendChild(metaTag);

    mockPerformanceData([]);

    const result = enablePersonalizationV2();
    expect(result).to.be.true;
    metaTag.parentNode.removeChild(metaTag);
  });

  it('should return false when serverTiming has `sis` other than `0` (signed in)', () => {
    const metaTag = document.createElement('meta');
    metaTag.setAttribute('name', 'personalization-v2');
    metaTag.setAttribute('content', 'personalization-v2');
    document.head.appendChild(metaTag);

    mockPerformanceData([{ name: 'sis', description: '1' }]);

    const result = enablePersonalizationV2();
    expect(result).to.be.false;
    metaTag.parentNode.removeChild(metaTag);
  });

  it('should return true when serverTiming has `sis` equal to `0` (signed out)', () => {
    const metaTag = document.createElement('meta');
    metaTag.setAttribute('name', 'personalization-v2');
    metaTag.setAttribute('content', 'personalization-v2');
    document.head.appendChild(metaTag);

    mockPerformanceData([{ name: 'sis', description: '0' }]);

    const result = enablePersonalizationV2();
    expect(result).to.be.true;
    metaTag.parentNode.removeChild(metaTag);
  });

  it('should return false when serverTiming has other data but `sis` is missing (signed in)', () => {
    const metaTag = document.createElement('meta');
    metaTag.setAttribute('name', 'personalization-v2');
    metaTag.setAttribute('content', 'personalization-v2');
    document.head.appendChild(metaTag);

    mockPerformanceData([{ name: 'other', description: 'value' }]);

    const result = enablePersonalizationV2();
    expect(result).to.be.false;
    metaTag.parentNode.removeChild(metaTag);
  });

  describe('personalization-v2-signed-in opt-in', () => {
    const AMCV = 'AMCV_9E1005A551ED61CA0A490D45%40AdobeOrg';
    const KEY = 'milo-signed-in-ecid';
    const MINUTE = 60 * 1000;
    const setEcid = (ecid) => {
      document.cookie = `${AMCV}=${encodeURIComponent(`MCMID|${ecid}`)}; path=/`;
    };
    const saveNote = (ecid, ageMs) => {
      localStorage.setItem(KEY, JSON.stringify({ ecid, time: Date.now() - ageMs }));
    };
    const readNote = () => JSON.parse(localStorage.getItem(KEY));
    const addMeta = (name, content) => {
      const meta = document.createElement('meta');
      meta.setAttribute('name', name);
      meta.setAttribute('content', content);
      document.head.appendChild(meta);
      return meta;
    };
    let metas = [];

    beforeEach(() => {
      mockPerformanceData([{ name: 'sis', description: '1' }]);
      setEcid('111');
      metas = [addMeta('personalization-v2', 'on'), addMeta('personalization-v2-signed-in', 'on')];
    });
    afterEach(() => {
      metas.forEach((meta) => meta.remove());
      document.cookie = `${AMCV}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      localStorage.removeItem(KEY);
    });

    it('returns true for a signed-in user when the page opts in and the ECID is linked', () => {
      saveNote('111', 3 * MINUTE);
      expect(enablePersonalizationV2()).to.be.true;
    });

    it('returns false on a browser whose ECID was never seen signed in', () => {
      expect(enablePersonalizationV2()).to.be.false;
    });

    it('returns false until Adobe has had time to link the ECID', () => {
      saveNote('111', 30 * 1000);
      expect(enablePersonalizationV2()).to.be.false;
    });

    it('returns false when the browser now has a different ECID', () => {
      saveNote('222', 3 * MINUTE);
      expect(enablePersonalizationV2()).to.be.false;
    });

    it('returns false for a signed-in user when the opt-in is off', () => {
      saveNote('111', 3 * MINUTE);
      metas[1].setAttribute('content', 'off');
      expect(enablePersonalizationV2()).to.be.false;
    });

    it('returns false when the opt-in is on but personalization-v2 is absent', () => {
      saveNote('111', 3 * MINUTE);
      metas[0].remove();
      expect(enablePersonalizationV2()).to.be.false;
    });

    it('keeps the first time for the same ECID, so later page views do not restart the wait', () => {
      saveNote('111', 3 * MINUTE);
      rememberSignedInEcid();
      expect(enablePersonalizationV2()).to.be.true;
    });

    it('starts a new wait when the ECID changes', () => {
      saveNote('222', 3 * MINUTE);
      rememberSignedInEcid();
      expect(readNote().ecid).to.equal('111');
      expect(enablePersonalizationV2()).to.be.false;
    });
  });
});
