import "./chunk-NE6SFPCS.js";

// ../utils/samplerum.js
function sampleRUM(checkpoint, data) {
  const timeShift = () => window.performance ? window.performance.now() : Date.now() - window.hlx.rum.firstReadTime;
  try {
    window.hlx = window.hlx || {};
    sampleRUM.enhance = () => {
    };
    if (!window.hlx.rum) {
      const param = new URLSearchParams(window.location.search).get("rum");
      const weight = window.SAMPLE_PAGEVIEWS_AT_RATE === "high" && 10 || window.SAMPLE_PAGEVIEWS_AT_RATE === "low" && 1e3 || param === "on" && 1 || 100;
      const id = Math.random().toString(36).slice(-4);
      const isSelected = param !== "off" && Math.random() * weight < 1;
      window.hlx.rum = { weight, id, isSelected, firstReadTime: window.performance ? window.performance.timeOrigin : Date.now(), sampleRUM, queue: [], collector: (...args) => window.hlx.rum.queue.push(args) };
      if (isSelected) {
        const dataFromErrorObj = (error) => {
          const errData = { source: "undefined error" };
          try {
            errData.target = error.toString();
            errData.source = error.stack.split("\n").filter((line) => line.match(/https?:\/\//)).shift().replace(/at ([^ ]+) \((.+)\)/, "$1@$2").replace(/ at /, "@").trim();
          } catch (err) {
          }
          return errData;
        };
        window.addEventListener("error", ({ error }) => {
          const errData = dataFromErrorObj(error);
          sampleRUM("error", errData);
        });
        window.addEventListener("unhandledrejection", ({ reason }) => {
          let errData = {
            source: "Unhandled Rejection",
            target: reason || "Unknown"
          };
          if (reason instanceof Error) {
            errData = dataFromErrorObj(reason);
          }
          sampleRUM("error", errData);
        });
        sampleRUM.baseURL = sampleRUM.baseURL || new URL(window.RUM_BASE || "/", new URL("https://rum.hlx.page"));
        sampleRUM.collectBaseURL = sampleRUM.collectBaseURL || sampleRUM.baseURL;
        sampleRUM.sendPing = (ck, time, pingData = {}) => {
          const rumData = JSON.stringify({ weight, id, referer: window.location.href, checkpoint: ck, t: time, ...pingData });
          const urlParams = window.RUM_PARAMS ? `?${new URLSearchParams(window.RUM_PARAMS).toString()}` : "";
          const { href: url, origin } = new URL(`.rum/${weight}${urlParams}`, sampleRUM.collectBaseURL);
          const body = origin === window.location.origin ? new Blob([rumData], { type: "application/json" }) : rumData;
          navigator.sendBeacon(url, body);
          console.debug(`ping:${ck}`, pingData);
        };
        sampleRUM.sendPing("top", timeShift());
        sampleRUM.enhance = () => {
          if (document.querySelector('script[src*="rum-enhancer"]')) return;
          const script = document.createElement("script");
          script.src = new URL(".rum/@adobe/helix-rum-enhancer@^2/src/index.js", sampleRUM.baseURL).href;
          document.head.appendChild(script);
        };
        if (!window.hlx.RUM_MANUAL_ENHANCE) {
          sampleRUM.enhance();
        }
      }
    }
    if (window.hlx.rum && window.hlx.rum.isSelected && checkpoint) {
      window.hlx.rum.collector(checkpoint, data, timeShift());
    }
    document.dispatchEvent(new CustomEvent("rum", { detail: { checkpoint, data } }));
  } catch (error) {
  }
}
export {
  sampleRUM
};
//# sourceMappingURL=samplerum-UMPZCNEM.js.map
