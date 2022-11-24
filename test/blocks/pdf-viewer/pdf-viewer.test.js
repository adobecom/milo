import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { setConfig } from '../../../libs/utils/utils.js';

const { default: pdfViewer, getPdfConfig } = await import('../../../libs/blocks/pdf-viewer/pdf-viewer.js');

describe('PDF Viewer', () => {
  it('does not render when there are no pdf links', async () => {
    await pdfViewer(undefined);
    expect(document.querySelectorAll('.pdf-container').length).to.equal(0);
  });

  it('renders PDFs embedded onto the page', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const pdf = document.querySelectorAll('a');

    pdf.forEach(async (link) => {
      await pdfViewer(link);
      expect(document.querySelector('.pdf-container')).to.exist;
      expect(document.querySelector('iframe')).to.exist;
    });
    expect(document.querySelectorAll('.pdf-container').length).to.equal(2);
  });

  it('gets correct config for milo', () => {
    setConfig({});
    expect(getPdfConfig()).to.eql({ clientId: '600a4521c23d4c7eb9c7b039bee534a0', reportSuiteId: undefined });
  });

  it('gets correct config for client', () => {
    const consumer = {
      pdfViewerClientId: '3b685312b5784de6943647df19f1f492',
      pdfViewerReportSuite: 'adbadobedxqa',
    };
    setConfig({ local: consumer });

    expect(getPdfConfig()).to.eql({
      clientId: consumer.pdfViewerClientId,
      reportSuiteId: consumer.pdfViewerReportSuite,
    });
  });
});
