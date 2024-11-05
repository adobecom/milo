import {
  debounce
} from "./chunk-B2JWVRT6.js";
import "./chunk-NE6SFPCS.js";

// ../blocks/modal/modal.merch.js
var MOBILE_MAX = 599;
var TABLET_MAX = 1199;
window.addEventListener("pageshow", (event) => {
  if (event.persisted && document.querySelector(".dialog-modal.commerce-frame iframe")) {
    window.location.reload();
  }
});
function adjustModalHeight(contentHeight) {
  if (!(window.location.hash || document.getElementById("checkout-link-modal"))) return;
  let selector = "#checkout-link-modal";
  if (!/=/.test(window.location.hash)) selector = `${selector},div.dialog-modal.commerce-frame${window.location.hash}`;
  const dialog = document.querySelector(selector);
  const iframe = dialog?.querySelector("iframe");
  const iframeWrapper = dialog?.querySelector(".milo-iframe");
  if (!contentHeight || !iframe || !iframeWrapper) return;
  if (contentHeight === "100%") {
    iframe.style.height = "100%";
    iframeWrapper.style.removeProperty("height");
    dialog.style.removeProperty("height");
  } else {
    const verticalMargins = 20;
    const clientHeight = document.documentElement.clientHeight - verticalMargins;
    if (clientHeight <= 0) return;
    const newHeight = contentHeight > clientHeight ? clientHeight : contentHeight;
    iframe.style.height = "100%";
    iframeWrapper.style.height = `${newHeight}px`;
    dialog.style.height = `${newHeight}px`;
  }
}
function sendViewportDimensionsToIframe(source) {
  const viewportWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
  source.postMessage({ mobileMax: MOBILE_MAX, tabletMax: TABLET_MAX, viewportWidth }, "*");
}
function sendViewportDimensionsOnRequest(source) {
  sendViewportDimensionsToIframe(source);
  window.addEventListener("resize", debounce(() => sendViewportDimensionsToIframe(source), 10));
}
function reactToMessage({ data, source }) {
  if (data === "viewportWidth" && source) {
    sendViewportDimensionsOnRequest(source);
  }
  if (data?.contentHeight) {
    adjustModalHeight(data?.contentHeight);
  }
}
function adjustStyles({ dialog, iframe }) {
  const isAutoHeightAdjustment = /\/mini-plans\/.*mid=ft.*web=1/.test(iframe.src);
  if (isAutoHeightAdjustment) {
    dialog.classList.add("height-fit-content");
    setTimeout(() => {
      const { height } = window.getComputedStyle(iframe);
      if (height === "0px") {
        iframe.style.height = "100%";
      }
    }, 2e3);
  } else {
    iframe.style.height = "100%";
  }
}
async function enableCommerceFrameFeatures({ dialog, iframe }) {
  if (!dialog || !iframe) return;
  adjustStyles({ dialog, iframe });
  window.addEventListener("message", reactToMessage);
}
export {
  MOBILE_MAX,
  TABLET_MAX,
  adjustModalHeight,
  adjustStyles,
  enableCommerceFrameFeatures as default,
  sendViewportDimensionsOnRequest,
  sendViewportDimensionsToIframe
};
//# sourceMappingURL=modal.merch-ILIM5VBD.js.map
