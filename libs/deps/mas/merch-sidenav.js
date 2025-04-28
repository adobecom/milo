var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};

// src/sidenav/merch-sidenav.js
import { html as html4, css as css4, LitElement as LitElement4 } from "/libs/deps/lit-all.min.js";

// node_modules/@spectrum-web-components/reactive-controllers/src/MatchMedia.js
var MatchMediaController = class {
  constructor(e, t) {
    this.key = Symbol("match-media-key");
    this.matches = false;
    this.host = e, this.host.addController(this), this.media = window.matchMedia(t), this.matches = this.media.matches, this.onChange = this.onChange.bind(this), e.addController(this);
  }
  hostConnected() {
    var e;
    (e = this.media) == null || e.addEventListener("change", this.onChange);
  }
  hostDisconnected() {
    var e;
    (e = this.media) == null || e.removeEventListener("change", this.onChange);
  }
  onChange(e) {
    this.matches !== e.matches && (this.matches = e.matches, this.host.requestUpdate(this.key, !this.matches));
  }
};

// src/sidenav/merch-sidenav-heading.css.js
import { css } from "/libs/deps/lit-all.min.js";
var headingStyles = css`
    h2 {
        font-size: 11px;
        font-style: normal;
        font-weight: 500;
        height: 32px;
        letter-spacing: 0.06em;
        padding: 0 12px;
        line-height: 32px;
        color: #737373;
    }
`;

// src/merch-search.js
import { html, LitElement } from "/libs/deps/lit-all.min.js";

// src/constants.js
var Commitment = Object.freeze({
  MONTH: "MONTH",
  YEAR: "YEAR",
  TWO_YEARS: "TWO_YEARS",
  THREE_YEARS: "THREE_YEARS",
  PERPETUAL: "PERPETUAL",
  TERM_LICENSE: "TERM_LICENSE",
  ACCESS_PASS: "ACCESS_PASS",
  THREE_MONTHS: "THREE_MONTHS",
  SIX_MONTHS: "SIX_MONTHS"
});
var Term = Object.freeze({
  ANNUAL: "ANNUAL",
  MONTHLY: "MONTHLY",
  TWO_YEARS: "TWO_YEARS",
  THREE_YEARS: "THREE_YEARS",
  P1D: "P1D",
  P1Y: "P1Y",
  P3Y: "P3Y",
  P10Y: "P10Y",
  P15Y: "P15Y",
  P3D: "P3D",
  P7D: "P7D",
  P30D: "P30D",
  HALF_YEARLY: "HALF_YEARLY",
  QUARTERLY: "QUARTERLY"
});
var SELECTOR_MAS_INLINE_PRICE = 'span[is="inline-price"][data-wcs-osi]';
var SELECTOR_MAS_CHECKOUT_LINK = 'a[is="checkout-link"][data-wcs-osi],button[is="checkout-button"][data-wcs-osi]';
var SELECTOR_MAS_ELEMENT = `${SELECTOR_MAS_INLINE_PRICE},${SELECTOR_MAS_CHECKOUT_LINK}`;
var EVENT_MERCH_SEARCH_CHANGE = "merch-search:change";
var EVENT_MERCH_SIDENAV_SELECT = "merch-sidenav:select";
var CheckoutWorkflowStep = Object.freeze({
  CHECKOUT: "checkout",
  CHECKOUT_EMAIL: "checkout/email",
  SEGMENTATION: "segmentation",
  BUNDLE: "bundle",
  COMMITMENT: "commitment",
  RECOMMENDATION: "recommendation",
  EMAIL: "email",
  PAYMENT: "payment",
  CHANGE_PLAN_TEAM_PLANS: "change-plan/team-upgrade/plans",
  CHANGE_PLAN_TEAM_PAYMENT: "change-plan/team-upgrade/payment"
});
var CheckoutWorkflow = Object.freeze({ V2: "UCv2", V3: "UCv3" });
var Env = Object.freeze({
  STAGE: "STAGE",
  PRODUCTION: "PRODUCTION",
  LOCAL: "LOCAL"
});

// src/utils.js
function debounce(func, delay) {
  let debounceTimer;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => func.apply(context, args), delay);
  };
}
function createTag(tag, attributes = {}, content = null, is = null) {
  const element = is ? document.createElement(tag, { is }) : document.createElement(tag);
  if (content instanceof HTMLElement) {
    element.appendChild(content);
  } else {
    element.innerHTML = content;
  }
  for (const [key, value] of Object.entries(attributes)) {
    element.setAttribute(key, value);
  }
  return element;
}

// src/deeplink.js
var EVENT_HASHCHANGE = "hashchange";
function parseState(hash = window.location.hash) {
  const result = [];
  const keyValuePairs = hash.replace(/^#/, "").split("&");
  for (const pair of keyValuePairs) {
    const [key, value = ""] = pair.split("=");
    if (key) {
      result.push([key, decodeURIComponent(value.replace(/\+/g, " "))]);
    }
  }
  return Object.fromEntries(result);
}
function pushStateFromComponent(component, value) {
  if (component.deeplink) {
    const state = {};
    state[component.deeplink] = value;
    pushState(state);
  }
}
function pushState(state) {
  const hash = new URLSearchParams(window.location.hash.slice(1));
  Object.entries(state).forEach(([key, value2]) => {
    if (value2) {
      hash.set(key, value2);
    } else {
      hash.delete(key);
    }
  });
  hash.sort();
  const value = hash.toString();
  if (value === window.location.hash)
    return;
  let lastScrollTop = window.scrollY || document.documentElement.scrollTop;
  window.location.hash = value;
  window.scrollTo(0, lastScrollTop);
}
function deeplink(callback) {
  const handler = () => {
    if (window.location.hash && !window.location.hash.includes("="))
      return;
    const state = parseState(window.location.hash);
    callback(state);
  };
  handler();
  window.addEventListener(EVENT_HASHCHANGE, handler);
  return () => {
    window.removeEventListener(EVENT_HASHCHANGE, handler);
  };
}

// src/merch-search.js
var MerchSearch = class extends LitElement {
  get search() {
    return this.querySelector(`sp-search`);
  }
  constructor() {
    super();
    this.handleInput = () => {
      pushStateFromComponent(this, this.search.value);
      if (this.search.value) {
        this.dispatchEvent(
          new CustomEvent(EVENT_MERCH_SEARCH_CHANGE, {
            bubbles: true,
            composed: true,
            detail: {
              type: "search",
              value: this.search.value
            }
          })
        );
      }
    };
    this.handleInputDebounced = debounce(this.handleInput.bind(this));
  }
  connectedCallback() {
    super.connectedCallback();
    if (!this.search)
      return;
    this.search.addEventListener("input", this.handleInputDebounced);
    this.search.addEventListener("submit", this.handleInputSubmit);
    this.updateComplete.then(() => {
      this.setStateFromURL();
    });
    this.startDeeplink();
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.search.removeEventListener("input", this.handleInputDebounced);
    this.search.removeEventListener("submit", this.handleInputSubmit);
    this.stopDeeplink?.();
  }
  /*
   * set the state of the search based on the URL
   */
  setStateFromURL() {
    const state = parseState();
    const value = state[this.deeplink];
    if (value) {
      this.search.value = value;
    }
  }
  startDeeplink() {
    this.stopDeeplink = deeplink(({ search }) => {
      this.search.value = search ?? "";
    });
  }
  handleInputSubmit(event) {
    event.preventDefault();
  }
  render() {
    return html`<slot></slot>`;
  }
};
__publicField(MerchSearch, "properties", {
  deeplink: { type: String }
});
customElements.define("merch-search", MerchSearch);

// src/sidenav/merch-sidenav-list.js
import { html as html2, LitElement as LitElement2, css as css2 } from "/libs/deps/lit-all.min.js";
var MerchSidenavList = class extends LitElement2 {
  constructor() {
    super();
    this.handleClickDebounced = debounce(this.handleClick.bind(this));
  }
  selectElement(element, selected = true) {
    if (element.parentNode.tagName === "SP-SIDENAV-ITEM") {
      this.selectElement(element.parentNode, false);
    }
    if (selected) {
      this.selectedElement = element;
      this.selectedText = element.label;
      this.selectedValue = element.value;
      setTimeout(() => {
        element.selected = true;
      }, 1);
      this.dispatchEvent(
        new CustomEvent(EVENT_MERCH_SIDENAV_SELECT, {
          bubbles: true,
          composed: true,
          detail: {
            type: "sidenav",
            value: this.selectedValue,
            elt: this.selectedElement
          }
        })
      );
    }
  }
  /**
   * click handler to manage first level items state of sidenav
   * @param {*} param
   */
  handleClick({ target: item }, shouldUpdateHash = true) {
    const { value, parentNode } = item;
    this.selectElement(item);
    if (parentNode?.tagName === "SP-SIDENAV") {
      item.selected = true;
      parentNode.querySelectorAll(
        "sp-sidenav-item[expanded],sp-sidenav-item[selected]"
      ).forEach((item2) => {
        if (item2.value !== value) {
          item2.expanded = false;
          item2.selected = false;
        }
      });
    } else if (parentNode?.tagName === "SP-SIDENAV-ITEM") {
      const topLevelItems = parentNode.closest("sp-sidenav")?.querySelectorAll(":scope > sp-sidenav-item");
      [...topLevelItems].filter((item2) => item2 !== parentNode).forEach((item2) => {
        item2.expanded = false;
      });
      parentNode.closest("sp-sidenav")?.querySelectorAll("sp-sidenav-item[selected]").forEach((item2) => {
        if (item2.value !== value) {
          item2.selected = false;
        }
      });
    }
    if (shouldUpdateHash) {
      pushStateFromComponent(this, value);
    }
  }
  /**
   * leaf level item selection handler
   * @param {*} event
   */
  selectionChanged({ target: { value, parentNode } }) {
    this.selectElement(
      this.querySelector(`sp-sidenav-item[value="${value}"]`)
    );
    pushStateFromComponent(this, value);
  }
  startDeeplink() {
    this.stopDeeplink = deeplink(
      (params) => {
        const value = params[this.deeplink] ?? "all";
        const element = this.querySelector(
          `sp-sidenav-item[value="${value}"]`
        );
        if (!element)
          return;
        this.updateComplete.then(() => {
          if (element.firstElementChild?.tagName === "SP-SIDENAV-ITEM") {
            element.expanded = true;
          }
          if (element.parentNode?.tagName === "SP-SIDENAV-ITEM") {
            element.parentNode.expanded = true;
          }
          this.handleClick({ target: element }, !!window.location.hash.includes("category"));
        });
      }
    );
  }
  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("click", this.handleClickDebounced);
    this.updateComplete.then(() => {
      if (!this.deeplink)
        return;
      this.startDeeplink();
    });
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("click", this.handleClickDebounced);
    this.stopDeeplink?.();
  }
  render() {
    return html2`<div
            aria-label="${this.label}"
            @change="${(e) => this.selectionChanged(e)}"
        >
            ${this.sidenavListTitle ? html2`<h2>${this.sidenavListTitle}</h2>` : ""}
            <slot></slot>
        </div>`;
  }
};
__publicField(MerchSidenavList, "properties", {
  sidenavListTitle: { type: String },
  label: { type: String },
  deeplink: { type: String, attribute: "deeplink" },
  selectedText: {
    type: String,
    reflect: true,
    attribute: "selected-text"
  },
  selectedValue: {
    type: String,
    reflect: true,
    attribute: "selected-value"
  }
});
__publicField(MerchSidenavList, "styles", [
  css2`
            :host {
                display: block;
                contain: content;
                padding-top: 16px;
            }
            .right {
                position: absolute;
                right: 0;
            }

            ::slotted(sp-sidenav.resources) {
                --mod-sidenav-item-background-default-selected: transparent;
                --mod-sidenav-content-color-default-selected: var(
                    --highcontrast-sidenav-content-color-default,
                    var(
                        --mod-sidenav-content-color-default,
                        var(--spectrum-sidenav-content-color-default)
                    )
                );
            }
        `,
  headingStyles
]);
customElements.define("merch-sidenav-list", MerchSidenavList);

// src/sidenav/merch-sidenav-checkbox-group.js
import { html as html3, LitElement as LitElement3, css as css3 } from "/libs/deps/lit-all.min.js";
var MerchSidenavCheckboxGroup = class extends LitElement3 {
  constructor() {
    super();
    this.selectedValues = [];
  }
  /**
   * leaf level item change handler
   * @param {*} event
   */
  selectionChanged({ target }) {
    const name = target.getAttribute("name");
    if (name) {
      const index = this.selectedValues.indexOf(name);
      if (target.checked && index === -1) {
        this.selectedValues.push(name);
      } else if (!target.checked && index >= 0) {
        this.selectedValues.splice(index, 1);
      }
    }
    pushStateFromComponent(this, this.selectedValues.join(","));
  }
  addGroupTitle() {
    const id = "sidenav-checkbox-group-title";
    const h3El = createTag("h3", { id });
    h3El.textContent = this.sidenavCheckboxTitle;
    this.prepend(h3El);
    [...this.children].forEach((el) => {
      if (el.id && el.id !== id) {
        el.setAttribute("role", "group");
        el.setAttribute("aria-labelledby", id);
      }
    });
  }
  startDeeplink() {
    this.stopDeeplink = deeplink(
      ({ types }) => {
        if (types) {
          const newTypes = types.split(",");
          [.../* @__PURE__ */ new Set([...newTypes, ...this.selectedValues])].forEach((name) => {
            const checkbox = this.querySelector(`sp-checkbox[name=${name}]`);
            if (checkbox)
              checkbox.checked = newTypes.includes(name);
          });
          this.selectedValues = newTypes;
        } else {
          this.selectedValues.forEach((name) => {
            const checkbox = this.querySelector(`sp-checkbox[name=${name}]`);
            if (checkbox)
              checkbox.checked = false;
          });
          this.selectedValues = [];
        }
      }
    );
  }
  connectedCallback() {
    super.connectedCallback();
    this.updateComplete.then(async () => {
      this.addGroupTitle();
      this.startDeeplink();
    });
  }
  disconnectedCallback() {
    this.stopDeeplink?.();
  }
  render() {
    return html3`<div aria-label="${this.label}">
            <div
                @change="${(e) => this.selectionChanged(e)}"
                class="checkbox-group"
            >
                <slot></slot>
            </div>
        </div>`;
  }
};
__publicField(MerchSidenavCheckboxGroup, "properties", {
  sidenavCheckboxTitle: { type: String },
  label: { type: String },
  deeplink: { type: String },
  selectedValues: { type: Array, reflect: true },
  value: { type: String }
});
__publicField(MerchSidenavCheckboxGroup, "styles", css3`
        :host {
            display: block;
            contain: content;
            border-top: 1px solid var(--color-gray-200);
            padding: 12px;
        }
        .checkbox-group {
            display: flex;
            flex-direction: column;
        }
    `);
customElements.define(
  "merch-sidenav-checkbox-group",
  MerchSidenavCheckboxGroup
);

// src/media.js
var SPECTRUM_MOBILE_LANDSCAPE = "(max-width: 700px)";
var TABLET_DOWN = "(max-width: 1199px)";

// src/bodyScrollLock.js
var isIosDevice = /iP(ad|hone|od)/.test(window?.navigator?.platform) || window?.navigator?.platform === "MacIntel" && window.navigator.maxTouchPoints > 1;
var documentListenerAdded = false;
var previousBodyOverflowSetting;
var disableBodyScroll = (targetElement) => {
  if (!targetElement)
    return;
  if (isIosDevice) {
    document.body.style.position = "fixed";
    targetElement.ontouchmove = (event) => {
      if (event.targetTouches.length === 1) {
        event.stopPropagation();
      }
    };
    if (!documentListenerAdded) {
      document.addEventListener("touchmove", (e) => e.preventDefault());
      documentListenerAdded = true;
    }
  } else {
    previousBodyOverflowSetting = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }
};
var enableBodyScroll = (targetElement) => {
  if (!targetElement)
    return;
  if (isIosDevice) {
    targetElement.ontouchstart = null;
    targetElement.ontouchmove = null;
    document.body.style.position = "";
    document.removeEventListener("touchmove", (e) => e.preventDefault());
    documentListenerAdded = false;
  } else {
    if (previousBodyOverflowSetting !== void 0) {
      document.body.style.overflow = previousBodyOverflowSetting;
      previousBodyOverflowSetting = void 0;
    }
  }
};

// src/sidenav/merch-sidenav.js
var _target;
var MerchSideNav = class extends LitElement4 {
  constructor() {
    super();
    // modal target
    __privateAdd(this, _target, void 0);
    __publicField(this, "mobileDevice", new MatchMediaController(this, SPECTRUM_MOBILE_LANDSCAPE));
    __publicField(this, "mobileAndTablet", new MatchMediaController(this, TABLET_DOWN));
    this.modal = false;
  }
  get filters() {
    return this.querySelector("merch-sidenav-list");
  }
  get search() {
    return this.querySelector("merch-search");
  }
  render() {
    return this.mobileAndTablet.matches ? this.asDialog : this.asAside;
  }
  get asDialog() {
    if (!this.modal)
      return;
    return html4`
            <sp-theme  color="light" scale="medium">
                <sp-dialog-base
                    slot="click-content"
                    dismissable
                    underlay
                    no-divider
                >
                    <div id="content">
                        <div id="sidenav">
                            <div>
                                <h2>${this.sidenavTitle}</h2>
                                <slot></slot>
                            </div>
                            <sp-link href="#" @click="${this.closeModal}"
                                >${this.closeText || "Close"}</sp-link
                            >
                        </div>
                    </div>
                </sp-dialog-base>
            </sp-theme>
        `;
  }
  get asAside() {
    return html4`<sp-theme  color="light" scale="medium"
            ><h2>${this.sidenavTitle}</h2>
            <slot></slot
        ></sp-theme>`;
  }
  get dialog() {
    return this.shadowRoot.querySelector("sp-dialog-base");
  }
  closeModal(e) {
    e.preventDefault();
    this.dialog?.close();
    document.body.classList.remove("merch-modal");
  }
  openModal() {
    this.updateComplete.then(async () => {
      disableBodyScroll(this.dialog);
      document.body.classList.add("merch-modal");
      const options = {
        trigger: __privateGet(this, _target),
        notImmediatelyClosable: true,
        type: "auto"
      };
      const overlay = await window.__merch__spectrum_Overlay.open(
        this.dialog,
        options
      );
      overlay.addEventListener("close", () => {
        this.modal = false;
        document.body.classList.remove("merch-modal");
        enableBodyScroll(this.dialog);
      });
      this.shadowRoot.querySelector("sp-theme").append(overlay);
    });
  }
  updated() {
    if (this.modal)
      this.openModal();
  }
  showModal({ target }) {
    __privateSet(this, _target, target);
    this.modal = true;
  }
};
_target = new WeakMap();
__publicField(MerchSideNav, "properties", {
  sidenavTitle: { type: String },
  closeText: { type: String, attribute: "close-text" },
  modal: { type: Boolean, attribute: "modal", reflect: true }
});
__publicField(MerchSideNav, "styles", [
  css4`
            :host {
                display: block;
                z-index: 2;
            }

            :host h2 {
              color: var(--spectrum-global-color-gray-900);
            }

            :host(:not([modal])) {
                --mod-sidenav-item-background-default-selected: #222;
                --mod-sidenav-content-color-default-selected: #fff;
            }

            #content {
                width: 100%;
                min-width: 300px;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: baseline;
            }
            

            :host([modal]) ::slotted(merch-search) {
                display: none;
            }

            #sidenav {
                display: flex;
                flex-direction: column;
                max-width: 248px;
                overflow-y: auto;
                place-items: center;
                position: relative;
                width: 100%;
                padding-bottom: 16px;
            }

            sp-dialog-base #sidenav {
                padding-top: 16px;
                max-width: 300px;
                max-height: 80dvh;
                min-height: min(500px, 80dvh);
                background: #ffffff 0% 0% no-repeat padding-box;
                box-shadow: 0px 1px 4px #00000026;
            }

            sp-link {
                position: absolute;
                top: 16px;
                right: 16px;
            }
        `,
  headingStyles
]);
customElements.define("merch-sidenav", MerchSideNav);
export {
  MerchSideNav
};
