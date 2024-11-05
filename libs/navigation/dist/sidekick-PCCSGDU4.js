import {
  getCustomConfig
} from "./chunk-MWL56EAN.js";
import "./chunk-NE6SFPCS.js";

// ../tools/utils/publish.js
var userCanPublishPage = async (detail, isBulk = true) => {
  if (!detail) return false;
  const { live, profile, webPath } = detail;
  let canPublish = isBulk ? live?.permissions?.includes("write") : true;
  let message = "Publishing is currently disabled for this page";
  const config = await getCustomConfig("/.milo/publish-permissions-config.json");
  const item = config?.urls?.data?.find(({ url }) => url.endsWith("**") ? webPath.includes(url.slice(0, -2)) : url === webPath);
  if (item) {
    canPublish = false;
    if (item.message) message = item.message;
    const group = config[item.group];
    if (group && profile?.email) {
      let isDeny;
      const user = group.data?.find(({ allow, deny }) => {
        if (deny) {
          isDeny = true;
          return deny === profile.email;
        }
        return allow === profile.email;
      });
      canPublish = isDeny ? !user : !!user;
    }
  }
  return { canPublish, message };
};
var publish_default = userCanPublishPage;

// ../utils/sidekick-decorate.js
var PUBLISH_BTN = ".publish.plugin button";
var PROFILE = ".profile-email";
var CONFIRM_MESSAGE = "Are you sure? This will publish to production.";
function stylePublish(sk) {
  const setupPublishBtn = async (page, btn) => {
    const { canPublish, message } = await publish_default(page, false);
    if (canPublish) {
      btn.removeAttribute("disabled");
    } else {
      btn.setAttribute("disabled", true);
    }
    const messageText = btn.querySelector("span");
    const text = canPublish ? CONFIRM_MESSAGE : message;
    if (messageText) {
      messageText.innerText = text;
    } else {
      btn.insertAdjacentHTML("beforeend", `<span>${text}</span>`);
    }
  };
  const style = new CSSStyleSheet();
  style.replaceSync(`
    :host {
      --bg-color: rgb(129 27 14);
      --text-color: #fff0f0;
      color-scheme: light dark;
    }
    .publish.plugin {
      order: 100;
    }
    .publish.plugin button {
      position: relative;
    }
    .publish.plugin button:not([disabled=true]) {
      background: var(--bg-color);
      border-color: #b46157;
      color: var(--text-color);
    }
    .publish.plugin button:not([disabled=true]):hover {
      background-color: var(--hlx-sk-button-hover-bg);
      border-color: unset;
      color: var(--hlx-sk-button-hover-color);
    }
    .publish.plugin button > span {
      display: none;
      background: #666;
      border-radius: 4px;
      line-height: 1.2rem;
      padding: 8px 12px;
      position: absolute;
      top: 34px;
      left: 50%;
      transform: translateX(-50%);
      width: 150px;
      white-space: pre-wrap;
    }
    .publish.plugin button:not([disabled=true]) > span {
      background: var(--bg-color);
    }
    .publish.plugin button:hover > span {
      display: block;
      color: var(--text-color);
    }
    .publish.plugin button > span:before {
      content: '';
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-bottom: 6px solid #666;
      position: absolute;
      text-align: center;
      top: -6px;
      left: 50%;
      transform: translateX(-50%);
    }
    .publish.plugin button:not([disabled=true]) > span:before {
      border-bottom: 6px solid var(--bg-color);
    }
  `);
  sk.shadowRoot.adoptedStyleSheets = [style];
  sk.addEventListener("statusfetched", async (event) => {
    const page = event?.detail?.data;
    const btn = event?.target?.shadowRoot?.querySelector(PUBLISH_BTN);
    if (page && btn) {
      setupPublishBtn(page, btn);
    }
  });
  setTimeout(async () => {
    const btn = sk.shadowRoot.querySelector(PUBLISH_BTN);
    btn?.setAttribute("disabled", true);
    const message = btn?.querySelector("span");
    if (btn && !message) {
      const page = {
        webPath: window.location.pathname,
        // added for edge case where the statusfetched event isnt fired on refresh
        profile: { email: sk.shadowRoot.querySelector(PROFILE)?.innerText }
      };
      setupPublishBtn(page, btn);
    }
  }, 500);
}

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
    const { getModal } = await import("./modal-EFZY44VD.js");
    getModal(null, { id: "preflight", content, closeEvent: "closeModal" });
  };
  document.addEventListener("send-to-caas", async (e) => {
    const { host, project, branch, repo, owner } = e.detail;
    const { sendToCaaS } = await import("./send-to-caas-CU6NNK35.js");
    sendToCaaS({ host, project, branch, repo, owner }, loadScript, loadStyle);
  });
  const sk = document.querySelector("aem-sidekick, helix-sidekick");
  sk.addEventListener("custom:send-to-caas", sendToCaasListener);
  sk.addEventListener("custom:check-schema", checkSchemaListener);
  sk.addEventListener("custom:preflight", preflightListener);
  if (sk.nodeName === "HELIX-SIDEKICK") stylePublish(sk);
}
export {
  init as default
};
//# sourceMappingURL=sidekick-PCCSGDU4.js.map
