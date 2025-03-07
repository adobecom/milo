import { expect } from '@esm-bundle/chai';
import { setConfig } from '../../../libs/utils/utils.js';

const {
  getPdfConfig,
  CLIENT_ID_PAGE,
  CLIENT_ID_LIVE,
  CLIENT_ID_HLX_PAGE,
  CLIENT_ID_HLX_LIVE,
} = await import('../../../libs/blocks/pdf-viewer/pdf-viewer.js');
const CONSUMER_CONFIG = {
  local: {
    pdfViewerClientId: 'localID',
    pdfViewerReportSuite: 'localReportSuite',
  },
  stage: {
    pdfViewerClientId: 'stageID',
    pdfViewerReportSuite: 'stageReportSuite',
  },
  prod: {
    pdfViewerClientId: 'prodID',
    pdfViewerReportSuite: 'prodReportSuite',
  },
  page: {
    pdfViewerClientId: 'pageID',
    pdfViewerReportSuite: 'pageReportSuite',
  },
  live: {
    pdfViewerClientId: 'liveID',
    pdfViewerReportSuite: 'liveReportSuite',
  },
  hlxPage: {
    pdfViewerClientId: 'hlxPageID',
    pdfViewerReportSuite: 'hlxPageReportSuite',
  },
  hlxLive: {
    pdfViewerClientId: 'hlxLiveID',
    pdfViewerReportSuite: 'hlxLiveReportSuite',
  },
};

describe('PDF Viewer', () => {
  describe('getPdfConfig', () => {
    it('gets milo local config', () => {
      setConfig({});
      expect(getPdfConfig(window.location)).to.eql({ clientId: 'a76f1668fd3244d98b3838e189900a5e', reportSuiteId: undefined });
    });

    it('gets milo page config', () => {
      const location = { host: 'main--milo--adobecom.aem.page' };
      setConfig({ clientEnv: 'stage' });
      expect(getPdfConfig(location)).to.eql({
        clientId: CLIENT_ID_PAGE,
        reportSuiteId: undefined,
      });
    });

    it('gets milo live config', () => {
      const location = { host: 'main--milo--adobecom.aem.live' };
      setConfig({ clientEnv: 'stage' });
      expect(getPdfConfig(location)).to.eql({
        clientId: CLIENT_ID_LIVE,
        reportSuiteId: undefined,
      });
    });

    it('gets milo hlxPage config', () => {
      const location = { host: 'main--milo--adobecom.hlx.page' };
      setConfig({ clientEnv: 'stage' });
      expect(getPdfConfig(location)).to.eql({
        clientId: CLIENT_ID_HLX_PAGE,
        reportSuiteId: undefined,
      });
    });

    it('gets milo hlxLive config', () => {
      const location = { host: 'main--milo--adobecom.hlx.live' };
      setConfig({ clientEnv: 'stage' });
      expect(getPdfConfig(location)).to.eql({
        clientId: CLIENT_ID_HLX_LIVE,
        reportSuiteId: undefined,
      });
    });

    it('gets milo prod config', () => {
      const location = { host: 'milo.adobe.com' };
      setConfig({ clientEnv: 'prod' });
      expect(getPdfConfig(location)).to.eql({ clientId: '3c0a5ddf2cc04d3198d9e48efc390fa9', reportSuiteId: undefined });
    });

    it('gets consumer local config', () => {
      setConfig(CONSUMER_CONFIG);
      expect(getPdfConfig(window.location)).to.eql({
        clientId: 'localID',
        reportSuiteId: 'localReportSuite',
      });
    });

    it('gets consumer page config', () => {
      const location = { host: 'main--bacom--adobecom.aem.page' };
      setConfig(CONSUMER_CONFIG);
      expect(getPdfConfig(location)).to.eql({
        clientId: 'pageID',
        reportSuiteId: 'pageReportSuite',
      });
    });

    it('gets consumer live config', () => {
      const location = { host: 'main--bacom--adobecom.aem.live' };
      setConfig(CONSUMER_CONFIG);
      expect(getPdfConfig(location)).to.eql({
        clientId: 'liveID',
        reportSuiteId: 'liveReportSuite',
      });
    });

    it('gets consumer hlxPage config', () => {
      const location = { host: 'main--bacom--adobecom.hlx.page' };
      setConfig(CONSUMER_CONFIG);
      expect(getPdfConfig(location)).to.eql({
        clientId: 'hlxPageID',
        reportSuiteId: 'hlxPageReportSuite',
      });
    });

    it('gets consumer hlxLive config', () => {
      const location = { host: 'main--bacom--adobecom.hlx.live' };
      setConfig(CONSUMER_CONFIG);
      expect(getPdfConfig(location)).to.eql({
        clientId: 'hlxLiveID',
        reportSuiteId: 'hlxLiveReportSuite',
      });
    });

    it('gets consumer stage config', () => {
      const location = { host: 'business.stage.adobe.com' };
      setConfig({ ...CONSUMER_CONFIG, clientEnv: 'stage' });
      expect(getPdfConfig(location)).to.eql({
        clientId: 'stageID',
        reportSuiteId: 'stageReportSuite',
      });
    });

    it('gets consumer prod config', () => {
      const location = { host: 'business.adobe.com' };
      setConfig({ ...CONSUMER_CONFIG, clientEnv: 'prod' });
      expect(getPdfConfig(location)).to.eql({
        clientId: 'prodID',
        reportSuiteId: 'prodReportSuite',
      });
    });
  });
});
