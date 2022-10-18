import { createTag, getConfig, loadScript } from '../../utils/utils.js';

const API_SOURCE_URL = 'https://documentcloud.adobe.com/view-sdk/viewer.js';
const PDF_RENDER_DIV_ID = 'adobe-dc-view';
const {
  env,
  pdfViewerClientIdStage,
  pdfViewerClientIdProd,
  pdfViewerReportSuiteQA,
  pdfViewerReportSuiteProd,
} = getConfig();

const init = async (a) => {
  const isProdEnv = env.name === 'prod';
  const url = a?.href;

  if (!url) return;

  const foundPdfs = document.querySelectorAll('.pdf-container');
  const idSuffix = foundPdfs.length + 1;

  const pdfViewerDiv = createTag('div', { class: 'pdf-container', id: `${PDF_RENDER_DIV_ID}_${idSuffix}` });

  a?.insertAdjacentElement('afterend', pdfViewerDiv);
  a?.remove();

  await loadScript(API_SOURCE_URL);
  const fileName = decodeURI(url?.split('/').pop());

  /* c8 ignore next 16 */
  const handleViewSdkReady = () => {
    const adobeDCView = new AdobeDC.View(
      {
        clientId: isProdEnv ? pdfViewerClientIdProd : pdfViewerClientIdStage,
        divId: `${PDF_RENDER_DIV_ID}_${idSuffix}`,
        reportSuiteId: isProdEnv ? pdfViewerReportSuiteProd : pdfViewerReportSuiteQA,
      },
    );
    adobeDCView.previewFile(
      {
        content: { location: { url } },
        metaData: { fileName },
      },
    );
    document.removeEventListener('adobe_dc_view_sdk.ready', handleViewSdkReady);
  };
  document.addEventListener('adobe_dc_view_sdk.ready', handleViewSdkReady);
};

export default init;
