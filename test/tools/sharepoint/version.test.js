import { expect } from '@esm-bundle/chai';
import { getVersions, createVersion } from '../../../libs/tools/sharepoint/version.js';

// getServiceConfig() memoizes per session, so only one sharepoint.site value
// can be tested here; the "valid site" case is covered in getValidatedSharePointSite.test.js.
const MALICIOUS_ORIGIN = 'http://localhost:2000/test/tools/sharepoint/mocks/malicious';

describe('version.js SharePoint site validation (VULN-38270)', () => {
  before(async () => {
    const { setConfig } = await import('../../../libs/utils/utils.js');
    setConfig({ codeRoot: '/libs', locales: { '': { ietf: 'en-US', tk: 'hah7vzn.css' } } });
  });

  it('getVersions rejects a config whose sharepoint.site does not resolve to Adobe\'s Graph/SharePoint host', async () => {
    let error;
    try {
      await getVersions({}, MALICIOUS_ORIGIN, 'some-item-id');
    } catch (err) {
      error = err;
    }
    expect(error).to.exist;
    expect(error.message).to.equal('Could not verify SharePoint site.');
  });

  it('createVersion rejects the same malicious config before any SharePoint call is made', async () => {
    let error;
    try {
      await createVersion(MALICIOUS_ORIGIN, 'some-item-id', 'a comment');
    } catch (err) {
      error = err;
    }
    expect(error).to.exist;
    expect(error.message).to.equal('Could not verify SharePoint site.');
  });
});
