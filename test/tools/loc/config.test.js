import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import {
  ADOBE_ENTRA_AUTHORITY,
  MILO_ENTRA_CLIENT_ID,
} from '../../../libs/utils/utils.js';

const { getConfig, getSharepointConfig } = await import('../../../tools/loc/config.js');

const VALID_SITE = 'https://graph.microsoft.com/v1.0/sites/adobe.sharepoint.com,d21b93ad-c3bc-4896-b58e-fd76f04c2834,563e43e2-09db-47a2-8d99-92b6161a051b';
const ATTACKER = {
  clientId: '11111111-1111-1111-1111-111111111111',
  authority: 'https://login.microsoftonline.com/common',
};

const spConfig = (overrides = {}) => ({
  sp: {
    data: [{
      site: VALID_SITE,
      rootFolders: '/milo',
      fgRootFolder: '/milo-<fgColor>',
      shareurl: 'https://adobe.sharepoint.com/share',
      fgShareUrl: 'https://adobe.sharepoint.com/share-<fgColor>',
      ...ATTACKER,
      ...overrides,
    }],
  },
});

const locConfig = ({ glaasUrl = 'https://glaas-stage.corp.adobe.com/', site = VALID_SITE } = {}) => ({
  ...spConfig({ site }),
  locales: { data: [{ languagecode: 'fr', workflow: 'Standard' }] },
  workflows: { data: [{ name: 'Standard' }] },
  glaas: { data: [{ url: glaasUrl, clientId: 'glaas-client' }] },
});

describe('tools/loc getSharepointConfig (MWPW-210165)', () => {
  it('rejects a config whose sp.site is not Adobe\'s Graph/SharePoint site', () => {
    const hostile = [
      'https://evil.example',
      'https://evil.example/v1.0/sites/adobe.sharepoint.com,x,y',
      `${VALID_SITE}.evil.example`,
      undefined,
    ];
    hostile.forEach((site) => {
      expect(() => getSharepointConfig(spConfig({ site })), `${site}`)
        .to.throw('Could not verify SharePoint site.');
    });
  });

  it('ignores clientId/authority from config and uses the pinned Entra app', () => {
    const { clientApp, api } = getSharepointConfig(spConfig(), 'pink');
    expect(clientApp.auth).to.deep.equal({
      clientId: MILO_ENTRA_CLIENT_ID,
      authority: ADOBE_ENTRA_AUTHORITY,
    });
    expect(api.file.get.baseURI).to.equal(`${VALID_SITE}/drive/root:/milo`);
    expect(api.file.get.fgBaseURI).to.equal(`${VALID_SITE}/drive/root:/milo-pink`);
  });
});

describe('tools/loc getConfig (MWPW-210165)', () => {
  const originalUrl = window.location.href;
  let configJson;

  before(() => {
    const referrer = encodeURIComponent('https://adobe.sharepoint.com/:x:/r/sites/adobecom/project.xlsx');
    window.history.replaceState({}, '', `?referrer=${referrer}&owner=adobecom&repo=milo`);
    sinon.stub(window, 'fetch').callsFake(async () => ({ ok: true, json: async () => configJson }));
  });

  after(() => {
    sinon.restore();
    window.history.replaceState({}, '', originalUrl);
  });

  it('rejects a GLaaS url outside Adobe\'s corp network', async () => {
    const hostile = ['https://evil.example', 'http://glaas.corp.adobe.com', 'https://corp.adobe.com.evil.example', 'not-a-url'];
    for (const glaasUrl of hostile) {
      configJson = locConfig({ glaasUrl });
      let error;
      try { await getConfig(); } catch (e) { error = e; }
      expect(error?.message, glaasUrl).to.equal('Could not verify GLaaS URL.');
    }
  });

  it('rejects a config with an attacker sp.site', async () => {
    configJson = locConfig({ site: 'https://evil.example' });
    let error;
    try { await getConfig(); } catch (e) { error = e; }
    expect(error?.message).to.equal('Could not verify SharePoint site.');
  });

  it('loads config only from the validated origin', async () => {
    configJson = locConfig();
    const config = await getConfig();
    expect(window.fetch.lastCall.args[0])
      .to.equal('https://main--milo--adobecom.aem.page/drafts/localization/configs/config.json');
    expect(config.glaas.url).to.equal('https://glaas-stage.corp.adobe.com/');
    expect(config.sp.clientApp.auth.clientId).to.equal(MILO_ENTRA_CLIENT_ID);
  });
});
