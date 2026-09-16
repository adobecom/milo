import { expect } from '@esm-bundle/chai';
import getServiceConfig from '../../../libs/utils/service-config.js';
import { getMSALConfig } from '../../../libs/tools/sharepoint/msal.js';

// Milo's first-party Entra app + Adobe tenant, confirmed against
// main--milo--adobecom.aem.live/.milo/config.json.
const FIRST_PARTY_CLIENT_ID = '008626ae-f818-43d8-9d7f-26afe05e771d';
const FIRST_PARTY_AUTHORITY = 'https://login.microsoftonline.com/fa7b1b5a-7b34-4387-94ae-d2c178decee1';

// A poisoned .milo/config.json served from an attacker-controlled repo/owner
// origin, carrying clientId/authority that point login at the attacker's app.
const MALICIOUS_ORIGIN = 'http://localhost:2000/test/tools/sharepoint/mocks/malicious';

describe('msal.js OAuth config pinning (MWPW-206105 / VULN-38270)', () => {
  before(async () => {
    const { setConfig } = await import('../../../libs/utils/utils.js');
    setConfig({ codeRoot: '/libs', locales: { '': { ietf: 'en-US', tk: 'hah7vzn.css' } } });
    // getServiceConfig() memoizes per session; prime it with the malicious
    // config so getMSALConfig()'s own no-arg call resolves to attacker values.
    await getServiceConfig(MALICIOUS_ORIGIN);
  });

  it('pins clientId to Milo\'s first-party Entra app, ignoring the client-fetched config', async () => {
    const { auth } = await getMSALConfig({});
    expect(auth.clientId).to.equal(FIRST_PARTY_CLIENT_ID);
  });

  it('pins authority to Adobe\'s tenant, ignoring the client-fetched config', async () => {
    const { auth } = await getMSALConfig({});
    expect(auth.authority).to.equal(FIRST_PARTY_AUTHORITY);
  });
});
