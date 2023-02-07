import { createTag, getConfig, loadScript } from '../../utils/utils.js';

const API_SOURCE_URL = 'https://documentcloud.adobe.com/view-sdk/viewer.js';
const PDF_RENDER_DIV_ID = 'adobe-dc-view';
const CLIENT_ID_LIVE = '96e41871f28349e08b3562747a72dc75';

export const getPdfConfig = () => {
  const { env, live } = getConfig();
  const { host, href } = window.location;
  const location = new URL(href);
  const query = location.searchParams.get('env');
  let clientId = env.consumer?.pdfViewerClientId || env.pdfViewerClientId;
  let reportSuiteId = env.consumer?.pdfViewerReportSuite || env.pdfViewerReportSuite;

  if (host.includes('hlx.live') || query === 'live') {
    /* c8 ignore next 2 */
    clientId = live?.pdfViewerClientId || CLIENT_ID_LIVE;
    reportSuiteId = live?.pdfViewerReportSuite || env.pdfViewerReportSuite;
  }

  return { clientId, reportSuiteId };
};

const init = async (a) => {
  const url = a?.href;

  if (!url) return;

  const foundPdfs = document.querySelectorAll('.pdf-container');
  const idSuffix = foundPdfs.length + 1;

  const pdfViewerDiv = createTag('div', { class: 'pdf-container', id: `${PDF_RENDER_DIV_ID}_${idSuffix}` });

  a?.insertAdjacentElement('afterend', pdfViewerDiv);
  a?.remove();

  await loadScript(API_SOURCE_URL);
  const fileName = decodeURI(url?.split('/').pop());
  const { clientId, reportSuiteId } = getPdfConfig();

  /* c8 ignore next 16 */
  const handleViewSdkReady = () => {
    const adobeDCView = new AdobeDC.View(
      {
        clientId,
        divId: `${PDF_RENDER_DIV_ID}_${idSuffix}`,
        reportSuiteId,
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
