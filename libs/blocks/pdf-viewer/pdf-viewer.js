/* global AdobeDC */

import { createTag, getConfig, loadScript } from '../../utils/utils.js';

const API_SOURCE_URL = 'https://acrobatservices.adobe.com/view-sdk/viewer.js';
const PDF_RENDER_DIV_ID = 'adobe-dc-view';
export const CLIENT_ID_PAGE = '762c730cf6184796bcd02ff8b79ce6fc';
export const CLIENT_ID_LIVE = 'cf650e2632384d8fb33d82d2997804d8';
export const CLIENT_ID_HLX_PAGE = '600a4521c23d4c7eb9c7b039bee534a0';
export const CLIENT_ID_HLX_LIVE = '96e41871f28349e08b3562747a72dc75';

export const getPdfConfig = (location) => {
  const { host } = location;
  const { env, page, live, hlxPage, hlxLive } = getConfig();
  let clientId = env.consumer?.pdfViewerClientId || env.pdfViewerClientId;
  let reportSuiteId = env.consumer?.pdfViewerReportSuite || env.pdfViewerReportSuite;

  if (host.includes('.aem.page')) {
    clientId = page?.pdfViewerClientId || CLIENT_ID_PAGE;
    reportSuiteId = page?.pdfViewerReportSuite || env.pdfViewerReportSuite;
  }

  if (host.includes('.aem.live')) {
    clientId = live?.pdfViewerClientId || CLIENT_ID_LIVE;
    reportSuiteId = live?.pdfViewerReportSuite || env.pdfViewerReportSuite;
  }

  if (host.includes('.hlx.page')) {
    clientId = hlxPage?.pdfViewerClientId || env.consumer?.pdfViewerClientId || CLIENT_ID_HLX_PAGE;
    reportSuiteId = hlxPage?.pdfViewerReportSuite
      || env.consumer?.pdfViewerReportSuite
      || env.pdfViewerReportSuite;
  }

  if (host.includes('.hlx.live')) {
    clientId = hlxLive?.pdfViewerClientId || live?.pdfViewerClientId || CLIENT_ID_HLX_LIVE;
    reportSuiteId = hlxLive?.pdfViewerReportSuite
      || live?.pdfViewerReportSuite
      || env.pdfViewerReportSuite;
  }

  return { clientId, reportSuiteId };
};

const initViewer = async (a, url) => {
  const id = `${PDF_RENDER_DIV_ID}_${Math.random().toString().slice(2)}`;
  const pdfViewerDiv = createTag('div', { class: 'pdf-container', id });

  pdfViewerDiv.dataset.pdfSrc = url;
  a?.insertAdjacentElement('afterend', pdfViewerDiv);
  a?.remove();

  await loadScript(API_SOURCE_URL);
  const fileName = decodeURI(url?.split('/').pop());
  const { clientId, reportSuiteId } = getPdfConfig(window.location);

  /* c8 ignore next 42 */
  const handleViewSdkReady = () => {
    const adobeDCView = new AdobeDC.View(
      {
        clientId,
        divId: id,
        reportSuiteId,
      },
    );
    adobeDCView.previewFile(
      {
        content: { location: { url } },
        metaData: { fileName },
      },
      { embedMode: 'IN_LINE' },
    );

    adobeDCView.registerCallback(
      AdobeDC.View.Enum.CallbackType.EVENT_LISTENER,
      (event) => {
        /* eslint-disable-next-line no-underscore-dangle */
        window._satellite?.track('event', {
          xdm: {},
          data: {
            web: { webInteraction: { name: event.type } },
            _adobe_corpnew: { digitalData: event.data },
          },
        });
      },
      {
        listenOn: [
          AdobeDC.View.Enum.PDFAnalyticsEvents.DOCUMENT_OPEN,
          AdobeDC.View.Enum.PDFAnalyticsEvents.PAGE_VIEW,
          AdobeDC.View.Enum.PDFAnalyticsEvents.BOOKMARK_ITEM_CLICK,
          AdobeDC.View.Enum.PDFAnalyticsEvents.DOCUMENT_DOWNLOAD,
          AdobeDC.View.Enum.PDFAnalyticsEvents.DOCUMENT_PRINT,
          AdobeDC.View.Enum.PDFAnalyticsEvents.TEXT_SEARCH,
          AdobeDC.View.Enum.PDFAnalyticsEvents.TEXT_COPY,
          AdobeDC.View.Enum.PDFAnalyticsEvents.ZOOM_LEVEL,
        ],
        enablePDFAnalytics: true,
      },
    );
    document.removeEventListener('adobe_dc_view_sdk.ready', handleViewSdkReady);
  };
  document.addEventListener('adobe_dc_view_sdk.ready', handleViewSdkReady);
};

const init = async (a) => {
  const url = a?.href;

  if (!url) return;

  const hiddenSection = a.closest('.section.hide-block.form-success');
  if (hiddenSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(async (entry) => {
        if (entry.isIntersecting) {
          await initViewer(a, url);
          observer.disconnect();
        }
      });
    });
    observer.observe(hiddenSection);
    return;
  }

  await initViewer(a, url);
};

export default init;
