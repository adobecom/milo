import {
  lanaLog,
  toFragment
} from "./chunk-I4EBDGNP.js";
import "./chunk-Z64B4EXQ.js";
import {
  processTrackingLabels
} from "./chunk-LHF7GOQG.js";
import "./chunk-EI44K5W3.js";
import {
  decorateAutoBlock,
  loadBlock
} from "./chunk-ZEVYWJU7.js";
import "./chunk-NE6SFPCS.js";

// ../blocks/global-navigation/features/aside/aside.js
async function decorateAside({ headerElem, promoPath } = {}) {
  const onError = () => {
    headerElem?.classList.remove("has-promo");
    lanaLog({ message: "Gnav Promo fragment not replaced, potential CLS" });
    return "";
  };
  const fragLink = toFragment`<a href="${promoPath}">${promoPath}</a>`;
  const fragTemplate = toFragment`<div>${fragLink}</div>`;
  decorateAutoBlock(fragLink);
  if (!fragLink.classList.contains("fragment")) return onError();
  await loadBlock(fragLink).catch(() => onError());
  const aside = fragTemplate.querySelector(".aside");
  if (fragTemplate.contains(fragLink) || !aside) return onError();
  aside.removeAttribute("data-block");
  aside.setAttribute("daa-lh", "Promo");
  aside.querySelectorAll("a").forEach((link, index) => {
    link.setAttribute("daa-ll", `${processTrackingLabels(link.textContent)}--${index + 1}`);
  });
  return aside;
}
export {
  decorateAside as default
};
//# sourceMappingURL=aside-3A4QYQCL.js.map
