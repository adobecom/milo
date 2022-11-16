import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { setConfig } from '../../../libs/utils/utils.js';

const config = {
  env: 'stage',
  pdfViewerClientIdStage: '600a4521c23d4c7eb9c7b039bee534a0',
};

setConfig(config);

let pdfViewer;

describe('PDF Viewer', () => {
  before(async () => {
    const mod = await import('../../../libs/blocks/pdf-viewer/pdf-viewer.js');
    pdfViewer = mod.default;
  });

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
});
