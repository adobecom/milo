import {
  stylePublish
} from "./chunk-CVDLXPU4.js";
import "./chunk-MWL56EAN.js";
import "./chunk-NE6SFPCS.js";

// ../utils/sidekick.js
function init({ createTag, loadBlock, loadScript, loadStyle }) {
  const sendToCaasListener = async (e) => {
    const { host, project, ref: branch, repo, owner } = e.detail.data.config;
    const { sendToCaaS } = await import("https://milo.adobe.com/tools/send-to-caas/send-to-caas.js");
    sendToCaaS({ host, project, branch, repo, owner }, loadScript, loadStyle);
  };
  const checkSchemaListener = async () => {
    const schema = document.querySelector('script[type="application/ld+json"]');
    if (schema === null) return;
    const resultsUrl = "https://search.google.com/test/rich-results?url=";
    window.open(`${resultsUrl}${encodeURIComponent(window.location.href)}`, "check-schema");
  };
  const preflightListener = async () => {
    const preflight = createTag("div", { class: "preflight" });
    const content = await loadBlock(preflight);
    const { getModal } = await import("./modal-JZCKO3U4.js");
    getModal(null, { id: "preflight", content, closeEvent: "closeModal" });
  };
  document.addEventListener("send-to-caas", async (e) => {
    const { host, project, branch, repo, owner } = e.detail;
    const { sendToCaaS } = await import("./send-to-caas-LGEZRSDO.js");
    sendToCaaS({ host, project, branch, repo, owner }, loadScript, loadStyle);
  });
  const sk = document.querySelector("aem-sidekick, helix-sidekick");
  sk.addEventListener("custom:send-to-caas", sendToCaasListener);
  sk.addEventListener("custom:check-schema", checkSchemaListener);
  sk.addEventListener("custom:preflight", preflightListener);
  stylePublish(sk);
}
export {
  init as default
};
//# sourceMappingURL=sidekick-QZNX6CDT.js.map
