var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
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
var __privateMethod = (obj, member, method) => {
  __accessCheck(obj, member, "access private method");
  return method;
};

// ../../utils/lana.js
(function iife() {
  const MSG_LIMIT = 2e3;
  const defaultOptions = {
    clientId: "",
    endpoint: "https://www.adobe.com/lana/ll",
    endpointStage: "https://www.stage.adobe.com/lana/ll",
    errorType: "e",
    sampleRate: 1,
    tags: "",
    implicitSampleRate: 1,
    useProd: true,
    isProdDomain: false
  };
  const w3 = window;
  function isProd() {
    const { host } = window.location;
    if (host.substring(host.length - 10) === ".adobe.com" && host.substring(host.length - 15) !== ".corp.adobe.com" && host.substring(host.length - 16) !== ".stage.adobe.com") {
      return true;
    }
    return false;
  }
  function mergeOptions(op1, op2) {
    if (!op1) {
      op1 = {};
    }
    if (!op2) {
      op2 = {};
    }
    function getOpt(key) {
      if (op1[key] !== void 0) {
        return op1[key];
      }
      if (op2[key] !== void 0) {
        return op2[key];
      }
      return defaultOptions[key];
    }
    return Object.keys(defaultOptions).reduce((options, key) => {
      options[key] = getOpt(key);
      return options;
    }, {});
  }
  function log2(msg, options) {
    msg = msg && msg.stack ? msg.stack : msg || "";
    if (msg.length > MSG_LIMIT) {
      msg = `${msg.slice(0, MSG_LIMIT)}<trunc>`;
    }
    const o8 = mergeOptions(options, w3.lana.options);
    if (!o8.clientId) {
      console.warn("LANA ClientID is not set in options.");
      return;
    }
    const sampleRateParam = parseInt(new URL(window.location).searchParams.get("lana-sample"), 10);
    const sampleRate = sampleRateParam || (o8.errorType === "i" ? o8.implicitSampleRate : o8.sampleRate);
    if (!w3.lana.debug && !w3.lana.localhost && sampleRate <= Math.random() * 100)
      return;
    const isProdDomain = isProd() || o8.isProdDomain;
    const endpoint = !isProdDomain || !o8.useProd ? o8.endpointStage : o8.endpoint;
    const queryParams = [
      `m=${encodeURIComponent(msg)}`,
      `c=${encodeURI(o8.clientId)}`,
      `s=${sampleRate}`,
      `t=${encodeURI(o8.errorType)}`
    ];
    if (o8.tags) {
      queryParams.push(`tags=${encodeURI(o8.tags)}`);
    }
    if (!isProdDomain || w3.lana.debug || w3.lana.localhost)
      console.log("LANA Msg: ", msg, "\nOpts:", o8);
    if (!w3.lana.localhost || w3.lana.debug) {
      const xhr = new XMLHttpRequest();
      if (w3.lana.debug) {
        queryParams.push("d");
        xhr.addEventListener("load", () => {
          console.log("LANA response:", xhr.responseText);
        });
      }
      xhr.open("GET", `${endpoint}?${queryParams.join("&")}`);
      xhr.send();
      return xhr;
    }
  }
  function sendUnhandledError(e7) {
    log2(e7.reason || e7.error || e7.message, { errorType: "i" });
  }
  function hasDebugParam() {
    return w3.location.search.toLowerCase().indexOf("lanadebug") !== -1;
  }
  function isLocalhost() {
    return w3.location.host.toLowerCase().indexOf("localhost") !== -1;
  }
  w3.lana = {
    debug: false,
    log: log2,
    options: mergeOptions(w3.lana && w3.lana.options)
  };
  if (hasDebugParam())
    w3.lana.debug = true;
  if (isLocalhost())
    w3.lana.localhost = true;
  w3.addEventListener("error", sendUnhandledError);
  w3.addEventListener("unhandledrejection", sendUnhandledError);
})();

// src/constants.js
var constants_exports = {};
__export(constants_exports, {
  CLASS_NAME_FAILED: () => CLASS_NAME_FAILED,
  CLASS_NAME_HIDDEN: () => CLASS_NAME_HIDDEN,
  CLASS_NAME_PENDING: () => CLASS_NAME_PENDING,
  CLASS_NAME_RESOLVED: () => CLASS_NAME_RESOLVED,
  CheckoutWorkflow: () => CheckoutWorkflow,
  CheckoutWorkflowStep: () => CheckoutWorkflowStep,
  Commitment: () => Commitment,
  ERROR_MESSAGE_BAD_REQUEST: () => ERROR_MESSAGE_BAD_REQUEST,
  ERROR_MESSAGE_MISSING_LITERALS_URL: () => ERROR_MESSAGE_MISSING_LITERALS_URL,
  ERROR_MESSAGE_OFFER_NOT_FOUND: () => ERROR_MESSAGE_OFFER_NOT_FOUND,
  EVENT_AEM_ERROR: () => EVENT_AEM_ERROR,
  EVENT_AEM_LOAD: () => EVENT_AEM_LOAD,
  EVENT_MAS_ERROR: () => EVENT_MAS_ERROR,
  EVENT_MAS_READY: () => EVENT_MAS_READY,
  EVENT_MERCH_ADDON_AND_QUANTITY_UPDATE: () => EVENT_MERCH_ADDON_AND_QUANTITY_UPDATE,
  EVENT_MERCH_CARD_ACTION_MENU_TOGGLE: () => EVENT_MERCH_CARD_ACTION_MENU_TOGGLE,
  EVENT_MERCH_CARD_COLLECTION_SHOWMORE: () => EVENT_MERCH_CARD_COLLECTION_SHOWMORE,
  EVENT_MERCH_CARD_COLLECTION_SORT: () => EVENT_MERCH_CARD_COLLECTION_SORT,
  EVENT_MERCH_CARD_READY: () => EVENT_MERCH_CARD_READY,
  EVENT_MERCH_OFFER_READY: () => EVENT_MERCH_OFFER_READY,
  EVENT_MERCH_OFFER_SELECT_READY: () => EVENT_MERCH_OFFER_SELECT_READY,
  EVENT_MERCH_QUANTITY_SELECTOR_CHANGE: () => EVENT_MERCH_QUANTITY_SELECTOR_CHANGE,
  EVENT_MERCH_SEARCH_CHANGE: () => EVENT_MERCH_SEARCH_CHANGE,
  EVENT_MERCH_SIDENAV_SELECT: () => EVENT_MERCH_SIDENAV_SELECT,
  EVENT_MERCH_STOCK_CHANGE: () => EVENT_MERCH_STOCK_CHANGE,
  EVENT_MERCH_STORAGE_CHANGE: () => EVENT_MERCH_STORAGE_CHANGE,
  EVENT_OFFER_SELECTED: () => EVENT_OFFER_SELECTED,
  EVENT_TYPE_FAILED: () => EVENT_TYPE_FAILED,
  EVENT_TYPE_READY: () => EVENT_TYPE_READY,
  EVENT_TYPE_RESOLVED: () => EVENT_TYPE_RESOLVED,
  Env: () => Env,
  HEADER_X_REQUEST_ID: () => HEADER_X_REQUEST_ID,
  LOG_NAMESPACE: () => LOG_NAMESPACE,
  Landscape: () => Landscape,
  MARK_DURATION_SUFFIX: () => MARK_DURATION_SUFFIX,
  MARK_START_SUFFIX: () => MARK_START_SUFFIX,
  MODAL_TYPE_3_IN_1: () => MODAL_TYPE_3_IN_1,
  NAMESPACE: () => NAMESPACE,
  PARAM_AOS_API_KEY: () => PARAM_AOS_API_KEY,
  PARAM_ENV: () => PARAM_ENV,
  PARAM_LANDSCAPE: () => PARAM_LANDSCAPE,
  PARAM_WCS_API_KEY: () => PARAM_WCS_API_KEY,
  PROVIDER_ENVIRONMENT: () => PROVIDER_ENVIRONMENT,
  SELECTOR_MAS_CHECKOUT_LINK: () => SELECTOR_MAS_CHECKOUT_LINK,
  SELECTOR_MAS_ELEMENT: () => SELECTOR_MAS_ELEMENT,
  SELECTOR_MAS_INLINE_PRICE: () => SELECTOR_MAS_INLINE_PRICE,
  SELECTOR_MAS_SP_BUTTON: () => SELECTOR_MAS_SP_BUTTON,
  STATE_FAILED: () => STATE_FAILED,
  STATE_PENDING: () => STATE_PENDING,
  STATE_RESOLVED: () => STATE_RESOLVED,
  TAG_NAME_SERVICE: () => TAG_NAME_SERVICE,
  Term: () => Term,
  WCS_PROD_URL: () => WCS_PROD_URL,
  WCS_STAGE_URL: () => WCS_STAGE_URL
});
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
var NAMESPACE = "merch";
var CLASS_NAME_HIDDEN = "hidden";
var EVENT_TYPE_READY = "wcms:commerce:ready";
var TAG_NAME_SERVICE = "mas-commerce-service";
var SELECTOR_MAS_INLINE_PRICE = 'span[is="inline-price"][data-wcs-osi]';
var SELECTOR_MAS_CHECKOUT_LINK = 'a[is="checkout-link"][data-wcs-osi],button[is="checkout-button"][data-wcs-osi]';
var SELECTOR_MAS_SP_BUTTON = "sp-button[data-wcs-osi]";
var SELECTOR_MAS_ELEMENT = `${SELECTOR_MAS_INLINE_PRICE},${SELECTOR_MAS_CHECKOUT_LINK}`;
var EVENT_MERCH_OFFER_READY = "merch-offer:ready";
var EVENT_MERCH_OFFER_SELECT_READY = "merch-offer-select:ready";
var EVENT_MERCH_CARD_READY = "merch-card:ready";
var EVENT_MERCH_CARD_ACTION_MENU_TOGGLE = "merch-card:action-menu-toggle";
var EVENT_OFFER_SELECTED = "merch-offer:selected";
var EVENT_MERCH_STOCK_CHANGE = "merch-stock:change";
var EVENT_MERCH_STORAGE_CHANGE = "merch-storage:change";
var EVENT_MERCH_QUANTITY_SELECTOR_CHANGE = "merch-quantity-selector:change";
var EVENT_MERCH_ADDON_AND_QUANTITY_UPDATE = "merch-modal:addon-and-quantity-update";
var EVENT_MERCH_SEARCH_CHANGE = "merch-search:change";
var EVENT_MERCH_CARD_COLLECTION_SORT = "merch-card-collection:sort";
var EVENT_MERCH_CARD_COLLECTION_SHOWMORE = "merch-card-collection:showmore";
var EVENT_MERCH_SIDENAV_SELECT = "merch-sidenav:select";
var EVENT_AEM_LOAD = "aem:load";
var EVENT_AEM_ERROR = "aem:error";
var EVENT_MAS_READY = "mas:ready";
var EVENT_MAS_ERROR = "mas:error";
var CLASS_NAME_FAILED = "placeholder-failed";
var CLASS_NAME_PENDING = "placeholder-pending";
var CLASS_NAME_RESOLVED = "placeholder-resolved";
var ERROR_MESSAGE_BAD_REQUEST = "Bad WCS request";
var ERROR_MESSAGE_OFFER_NOT_FOUND = "Commerce offer not found";
var ERROR_MESSAGE_MISSING_LITERALS_URL = "Literals URL not provided";
var EVENT_TYPE_FAILED = "mas:failed";
var EVENT_TYPE_RESOLVED = "mas:resolved";
var LOG_NAMESPACE = "mas/commerce";
var PARAM_ENV = "commerce.env";
var PARAM_LANDSCAPE = "commerce.landscape";
var PARAM_AOS_API_KEY = "commerce.aosKey";
var PARAM_WCS_API_KEY = "commerce.wcsKey";
var WCS_PROD_URL = "https://www.adobe.com/web_commerce_artifact";
var WCS_STAGE_URL = "https://www.stage.adobe.com/web_commerce_artifact_stage";
var STATE_FAILED = "failed";
var STATE_PENDING = "pending";
var STATE_RESOLVED = "resolved";
var Landscape = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED"
};
var HEADER_X_REQUEST_ID = "X-Request-Id";
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
var PROVIDER_ENVIRONMENT = {
  PRODUCTION: "PRODUCTION"
};
var MODAL_TYPE_3_IN_1 = {
  TWP: "twp",
  D2P: "d2p",
  CRM: "crm"
};
var MARK_START_SUFFIX = ":start";
var MARK_DURATION_SUFFIX = ":duration";

// node_modules/@dexter/tacocat-core/src/utilities.js
var namespace = "tacocat.js";
var equalsCaseInsensitive = (value1, value2) => String(value1 ?? "").toLowerCase() == String(value2 ?? "").toLowerCase();
var escapeHtml = (html) => `${html ?? ""}`.replace(
  /[&<>'"]/g,
  (tag) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;"
  })[tag] ?? tag
) ?? "";
function getParameter(key, defaults = {}, { metadata = true, search = true, storage = true } = {}) {
  let param;
  if (search && param == null) {
    const params = new URLSearchParams(window.location.search);
    const searchKey = isString(search) ? search : key;
    param = params.get(searchKey);
  }
  if (storage && param == null) {
    const storageKey = isString(storage) ? storage : key;
    param = window.sessionStorage.getItem(storageKey) ?? window.localStorage.getItem(storageKey);
  }
  if (metadata && param == null) {
    const metadataKey = toKebabCase(isString(metadata) ? metadata : key);
    const element = document.documentElement.querySelector(
      `meta[name="${metadataKey}"]`
    );
    param = element?.content;
  }
  return param == null ? defaults[key] : param;
}
var isBoolean = (value) => typeof value === "boolean";
var isFunction = (value) => typeof value === "function";
var isNumber = (value) => typeof value === "number";
var isObject = (value) => value != null && typeof value === "object";
var isString = (value) => typeof value === "string";
var isNotEmptyString = (value) => isString(value) && value;
var isPositiveFiniteNumber = (value) => isNumber(value) && Number.isFinite(value) && value > 0;
function omitProperties(target, test = (value) => value == null || value === "") {
  if (target != null) {
    Object.entries(target).forEach(([key, value]) => {
      if (test(value))
        delete target[key];
    });
  }
  return target;
}
function toBoolean(value, defaultValue) {
  if (isBoolean(value))
    return value;
  const string = String(value);
  if (string === "1" || string === "true")
    return true;
  if (string === "0" || string === "false")
    return false;
  return defaultValue;
}
function toEnumeration(value, enumeration, defaultValue) {
  const values = Object.values(enumeration);
  return values.find((candidate) => equalsCaseInsensitive(candidate, value)) ?? defaultValue ?? values[0];
}
function toKebabCase(value = "") {
  return String(value).replace(
    /(\p{Lowercase_Letter})(\p{Uppercase_Letter})/gu,
    (_3, p1, p22) => `${p1}-${p22}`
  ).replace(/\W+/gu, "-").toLowerCase();
}
function toPositiveFiniteInteger(value, defaultValue = 1) {
  if (!isNumber(value)) {
    value = Number.parseInt(value, 10);
  }
  if (!Number.isNaN(value) && value > 0 && Number.isFinite(value)) {
    return value;
  }
  return defaultValue;
}

// node_modules/@dexter/tacocat-core/src/log.js
var epoch = Date.now();
var suffix = () => `(+${Date.now() - epoch}ms)`;
var loggers = /* @__PURE__ */ new Set();
var isDebugEnabled = toBoolean(
  getParameter("tacocat.debug", {}, { metadata: false }),
  typeof process !== "undefined" && process.env?.DEBUG
);
function createLog(source) {
  const prefix = `[${namespace}/${source}]`;
  const assert = (condition, message, ...args) => {
    if (!condition) {
      error(message, ...args);
      return false;
    }
    return true;
  };
  const debug = isDebugEnabled ? (message, ...args) => {
    console.debug(`${prefix} ${message}`, ...args, suffix());
  } : () => {
  };
  const error = (message, ...args) => {
    const prefixedMessage = `${prefix} ${message}`;
    loggers.forEach(
      ([errorLogger]) => errorLogger(prefixedMessage, ...args)
    );
  };
  const warn = (message, ...args) => {
    const prefixedMessage = `${prefix} ${message}`;
    loggers.forEach(
      ([, warnLogger]) => warnLogger(prefixedMessage, ...args)
    );
  };
  return { assert, debug, error, warn };
}
function registerLogger(errorLogger, warnLogger) {
  const logger = [errorLogger, warnLogger];
  loggers.add(logger);
  return () => {
    loggers.delete(logger);
  };
}
registerLogger(
  (message, ...args) => {
    console.error(message, ...args, suffix());
  },
  (message, ...args) => {
    console.warn(message, ...args, suffix());
  }
);

// node_modules/@dexter/tacocat-core/src/promotion.js
var NO_PROMO_TEXT = "no promo";
var CLASS = "promo-tag";
var PROMO_VARIANT = "yellow";
var NOPROMO_VARIANT = "neutral";
var fullPromoText = (promo, old, isOverriden) => {
  const promoText = (promo2) => promo2 || NO_PROMO_TEXT;
  const suffix2 = isOverriden ? ` (was "${promoText(old)}")` : "";
  return `${promoText(promo)}${suffix2}`;
};
var PROMO_CONTEXT_CANCEL_VALUE = "cancel-context";
var computePromoStatus = (overriden, configured) => {
  const localPromoUnset = overriden === PROMO_CONTEXT_CANCEL_VALUE;
  const localPromoSet = !localPromoUnset && overriden?.length > 0;
  const isOverriden = (localPromoSet || localPromoUnset) && //in case configured equals override, we consider no override
  (configured && configured != overriden || //in case it does not have been configured, if overriden to cancel,
  // we consider no override
  !configured && !localPromoUnset);
  const isPromo = isOverriden && localPromoSet || !isOverriden && !!configured;
  const effectivePromoCode = isPromo ? overriden || configured : void 0;
  return {
    effectivePromoCode,
    overridenPromoCode: overriden,
    className: isPromo ? CLASS : `${CLASS} no-promo`,
    text: fullPromoText(effectivePromoCode, configured, isOverriden),
    variant: isPromo ? PROMO_VARIANT : NOPROMO_VARIANT,
    isOverriden
  };
};

// node_modules/@pandora/data-models-odm/esm/businessDimensions.js
var OfferType;
(function(OfferType2) {
  OfferType2["BASE"] = "BASE";
  OfferType2["TRIAL"] = "TRIAL";
  OfferType2["PROMOTION"] = "PROMOTION";
})(OfferType || (OfferType = {}));
var Commitment2;
(function(Commitment3) {
  Commitment3["MONTH"] = "MONTH";
  Commitment3["YEAR"] = "YEAR";
  Commitment3["TWO_YEARS"] = "TWO_YEARS";
  Commitment3["THREE_YEARS"] = "THREE_YEARS";
  Commitment3["PERPETUAL"] = "PERPETUAL";
  Commitment3["TERM_LICENSE"] = "TERM_LICENSE";
  Commitment3["ACCESS_PASS"] = "ACCESS_PASS";
  Commitment3["THREE_MONTHS"] = "THREE_MONTHS";
  Commitment3["SIX_MONTHS"] = "SIX_MONTHS";
})(Commitment2 || (Commitment2 = {}));
var Term2;
(function(Term3) {
  Term3["ANNUAL"] = "ANNUAL";
  Term3["MONTHLY"] = "MONTHLY";
  Term3["TWO_YEARS"] = "TWO_YEARS";
  Term3["THREE_YEARS"] = "THREE_YEARS";
  Term3["P1D"] = "P1D";
  Term3["P1Y"] = "P1Y";
  Term3["P3Y"] = "P3Y";
  Term3["P10Y"] = "P10Y";
  Term3["P15Y"] = "P15Y";
  Term3["P3D"] = "P3D";
  Term3["P7D"] = "P7D";
  Term3["P30D"] = "P30D";
  Term3["HALF_YEARLY"] = "HALF_YEARLY";
  Term3["QUARTERLY"] = "QUARTERLY";
})(Term2 || (Term2 = {}));
var CustomerSegment;
(function(CustomerSegment2) {
  CustomerSegment2["INDIVIDUAL"] = "INDIVIDUAL";
  CustomerSegment2["TEAM"] = "TEAM";
  CustomerSegment2["ENTERPRISE"] = "ENTERPRISE";
})(CustomerSegment || (CustomerSegment = {}));
var MarketSegment;
(function(MarketSegment2) {
  MarketSegment2["COM"] = "COM";
  MarketSegment2["EDU"] = "EDU";
  MarketSegment2["GOV"] = "GOV";
})(MarketSegment || (MarketSegment = {}));
var SalesChannel;
(function(SalesChannel2) {
  SalesChannel2["DIRECT"] = "DIRECT";
  SalesChannel2["INDIRECT"] = "INDIRECT";
})(SalesChannel || (SalesChannel = {}));
var BuyingProgram;
(function(BuyingProgram2) {
  BuyingProgram2["ENTERPRISE_PRODUCT"] = "ENTERPRISE_PRODUCT";
  BuyingProgram2["ETLA"] = "ETLA";
  BuyingProgram2["RETAIL"] = "RETAIL";
  BuyingProgram2["VIP"] = "VIP";
  BuyingProgram2["VIPMP"] = "VIPMP";
  BuyingProgram2["FREE"] = "FREE";
})(BuyingProgram || (BuyingProgram = {}));

// node_modules/@dexter/tacocat-core/src/wcsUtils.js
var ABM = "ABM";
var PUF = "PUF";
var M2M = "M2M";
var PERPETUAL = "PERPETUAL";
var P3Y = "P3Y";
var TAX_INCLUSIVE_DETAILS = "TAX_INCLUSIVE_DETAILS";
var TAX_EXCLUSIVE = "TAX_EXCLUSIVE";
var PlanType = {
  ABM,
  PUF,
  M2M,
  PERPETUAL,
  P3Y
};
var planTypes = {
  [ABM]: { commitment: Commitment2.YEAR, term: Term2.MONTHLY },
  [PUF]: { commitment: Commitment2.YEAR, term: Term2.ANNUAL },
  [M2M]: { commitment: Commitment2.MONTH, term: Term2.MONTHLY },
  [PERPETUAL]: { commitment: Commitment2.PERPETUAL, term: void 0 },
  [P3Y]: { commitment: Commitment2.THREE_MONTHS, term: Term2.P3Y }
};
var errorValueNotOffer = "Value is not an offer";
var applyPlanType = (offer) => {
  if (typeof offer !== "object")
    return errorValueNotOffer;
  const { commitment, term } = offer;
  const planType = getPlanType(commitment, term);
  return { ...offer, planType };
};
var getPlanType = (commitment, term) => {
  switch (commitment) {
    case void 0:
      return errorValueNotOffer;
    case "":
      return "";
    case Commitment2.YEAR:
      return term === Term2.MONTHLY ? ABM : term === Term2.ANNUAL ? PUF : "";
    case Commitment2.MONTH:
      return term === Term2.MONTHLY ? M2M : "";
    case Commitment2.PERPETUAL:
      return PERPETUAL;
    case Commitment2.TERM_LICENSE:
      return term === Term2.P3Y ? P3Y : "";
    default:
      return "";
  }
};
function forceTaxExclusivePrice(offer) {
  const { priceDetails } = offer;
  const {
    price: price2,
    priceWithoutDiscount,
    priceWithoutTax,
    priceWithoutDiscountAndTax,
    taxDisplay
  } = priceDetails;
  if (taxDisplay !== TAX_INCLUSIVE_DETAILS)
    return offer;
  const amendedOffer = {
    ...offer,
    priceDetails: {
      ...priceDetails,
      price: priceWithoutTax ?? price2,
      priceWithoutDiscount: priceWithoutDiscountAndTax ?? priceWithoutDiscount,
      taxDisplay: TAX_EXCLUSIVE
    }
  };
  if (amendedOffer.offerType === "TRIAL" && amendedOffer.priceDetails.price === 0) {
    amendedOffer.priceDetails.price = amendedOffer.priceDetails.priceWithoutDiscount;
  }
  return amendedOffer;
}

// src/utilities.js
var MAS_COMMERCE_SERVICE = "mas-commerce-service";
function selectOffers(offers, { country, forceTaxExclusive, perpetual }) {
  let selected;
  if (offers.length < 2)
    selected = offers;
  else {
    const language = country === "GB" || perpetual ? "EN" : "MULT";
    const [first, second] = offers;
    selected = [first.language === language ? first : second];
  }
  if (forceTaxExclusive) {
    selected = selected.map(forceTaxExclusivePrice);
  }
  return selected;
}
var setImmediate = (getConfig) => window.setTimeout(getConfig);
function toQuantity(value, defaultValue = 1) {
  if (value == null)
    return [defaultValue];
  let quantity = (Array.isArray(value) ? value : String(value).split(",")).map(toPositiveFiniteInteger).filter(isPositiveFiniteNumber);
  if (!quantity.length)
    quantity = [defaultValue];
  return quantity;
}
function toOfferSelectorIds(value) {
  if (value == null)
    return [];
  const ids = Array.isArray(value) ? value : String(value).split(",");
  return ids.filter(isNotEmptyString);
}
function getService() {
  return document.getElementsByTagName(MAS_COMMERCE_SERVICE)?.[0];
}

// src/lana.js
var config = {
  clientId: "merch-at-scale",
  delimiter: "\xB6",
  ignoredProperties: ["analytics", "literals", "element"],
  serializableTypes: ["Array", "Object"],
  sampleRate: 1,
  tags: "acom",
  isProdDomain: false
};
var PAGE_LIMIT = 1e3;
function isError(value) {
  return value instanceof Error || typeof value?.originatingRequest === "string";
}
function serializeValue(value) {
  if (value == null)
    return void 0;
  const type = typeof value;
  if (type === "function") {
    return value.name ? `function ${value.name}` : "function";
  }
  if (type === "object") {
    if (value instanceof Error)
      return value.message;
    if (typeof value.originatingRequest === "string") {
      const { message, originatingRequest, status } = value;
      return [message, status, originatingRequest].filter(Boolean).join(" ");
    }
    const objectType = value[Symbol.toStringTag] ?? Object.getPrototypeOf(value).constructor.name;
    if (!config.serializableTypes.includes(objectType))
      return objectType;
  }
  return value;
}
function serializeParam(key, value) {
  if (config.ignoredProperties.includes(key))
    return void 0;
  return serializeValue(value);
}
var lanaAppender = {
  append(entry) {
    if (entry.level !== "error")
      return;
    const { message, params } = entry;
    const errors = [];
    const values = [];
    let payload = message;
    params.forEach((param) => {
      if (param != null) {
        (isError(param) ? errors : values).push(param);
      }
    });
    if (errors.length) {
      payload += " " + errors.map(serializeValue).join(" ");
    }
    const { pathname, search } = window.location;
    let page = `${config.delimiter}page=${pathname}${search}`;
    if (page.length > PAGE_LIMIT) {
      page = `${page.slice(0, PAGE_LIMIT)}<trunc>`;
    }
    payload += page;
    if (values.length) {
      payload += `${config.delimiter}facts=`;
      payload += JSON.stringify(values, serializeParam);
    }
    window.lana?.log(payload, config);
  }
};
function updateConfig(newConfig) {
  Object.assign(
    config,
    Object.fromEntries(
      Object.entries(newConfig).filter(
        ([key, value]) => key in config && value !== "" && value !== null && value !== void 0 && !Number.isNaN(value)
        // Correctly exclude NaN
      )
    )
  );
}

// src/log.js
var HostEnv = {
  LOCAL: "local",
  PROD: "prod",
  STAGE: "stage"
};
var LogLevels = {
  DEBUG: "debug",
  ERROR: "error",
  INFO: "info",
  WARN: "warn"
};
var appenders = /* @__PURE__ */ new Set();
var filters = /* @__PURE__ */ new Set();
var loggerIndexes = /* @__PURE__ */ new Map();
var consoleAppender = {
  append({ level, message, params, timestamp, source }) {
    console[level](
      `${timestamp}ms [${source}] %c${message}`,
      "font-weight: bold;",
      ...params
    );
  }
};
var debugFilter = { filter: ({ level }) => level !== LogLevels.DEBUG };
var quietFilter = { filter: () => false };
function createEntry(level, message, namespace2, params, source) {
  return {
    level,
    message,
    namespace: namespace2,
    get params() {
      if (params.length === 1 && isFunction(params[0])) {
        params = params[0]();
        if (!Array.isArray(params))
          params = [params];
      }
      return params;
    },
    source,
    timestamp: performance.now().toFixed(3)
  };
}
function handleEntry(entry) {
  if ([...filters].every((filter) => filter(entry))) {
    appenders.forEach((appender) => appender(entry));
  }
}
function createLog2(namespace2) {
  const index = (loggerIndexes.get(namespace2) ?? 0) + 1;
  loggerIndexes.set(namespace2, index);
  const id = `${namespace2} #${index}`;
  const log2 = {
    id,
    namespace: namespace2,
    module: (name) => createLog2(`${log2.namespace}/${name}`),
    updateConfig
  };
  Object.values(LogLevels).forEach((level) => {
    log2[level] = (message, ...params) => handleEntry(createEntry(level, message, namespace2, params, id));
  });
  return Object.seal(log2);
}
function use(...plugins) {
  plugins.forEach((plugin) => {
    const { append, filter } = plugin;
    if (isFunction(filter))
      filters.add(filter);
    if (isFunction(append))
      appenders.add(append);
  });
}
function init(env = {}) {
  const { name } = env;
  const debug = toBoolean(
    getParameter("commerce.debug", { search: true, storage: true }),
    name === HostEnv.LOCAL
  );
  if (debug)
    use(consoleAppender);
  else
    use(debugFilter);
  if (name === HostEnv.PROD)
    use(lanaAppender);
  return Log;
}
function reset() {
  appenders.clear();
  filters.clear();
}
var Log = {
  ...createLog2(LOG_NAMESPACE),
  Level: LogLevels,
  Plugins: { consoleAppender, debugFilter, quietFilter, lanaAppender },
  init,
  reset,
  use
};

// src/mas-error.js
var MasError = class _MasError extends Error {
  /**
   * Creates a new MasError instance
   * @param {string} message - The error message
   * @param {Object} context - Additional context information about the error
   * @param {unknown} cause - The original error that caused this error
   */
  constructor(message, context, cause) {
    super(message, { cause });
    this.name = "MasError";
    if (context.response) {
      const requestId = context.response.headers?.get(HEADER_X_REQUEST_ID);
      if (requestId) {
        context.requestId = requestId;
      }
      if (context.response.status) {
        context.status = context.response.status;
        context.statusText = context.response.statusText;
      }
      if (context.response.url) {
        context.url = context.response.url;
      }
    }
    delete context.response;
    this.context = context;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, _MasError);
    }
  }
  /**
   * Returns a string representation of the error including context
   * @returns {string} String representation of the error
   */
  toString() {
    const contextStr = Object.entries(this.context || {}).map(([key, value]) => `${key}: ${JSON.stringify(value)}`).join(", ");
    let errorString = `${this.name}: ${this.message}`;
    if (contextStr) {
      errorString += ` (${contextStr})`;
    }
    if (this.cause) {
      errorString += `
Caused by: ${this.cause}`;
    }
    return errorString;
  }
};

// src/mas-element.js
var StateClassName = {
  [STATE_FAILED]: CLASS_NAME_FAILED,
  [STATE_PENDING]: CLASS_NAME_PENDING,
  [STATE_RESOLVED]: CLASS_NAME_RESOLVED
};
var StateEventType = {
  [STATE_FAILED]: EVENT_TYPE_FAILED,
  [STATE_RESOLVED]: EVENT_TYPE_RESOLVED
};
var _service;
var MasElement = class {
  constructor(wrapperElement) {
    __privateAdd(this, _service, void 0);
    __publicField(this, "changes", /* @__PURE__ */ new Map());
    __publicField(this, "connected", false);
    __publicField(this, "error");
    __publicField(this, "log");
    __publicField(this, "options");
    __publicField(this, "promises", []);
    __publicField(this, "state", STATE_PENDING);
    __publicField(this, "timer", null);
    __publicField(this, "value");
    __publicField(this, "version", 0);
    __publicField(this, "wrapperElement");
    this.wrapperElement = wrapperElement;
    this.log = Log.module("mas-element");
  }
  update() {
    [STATE_FAILED, STATE_PENDING, STATE_RESOLVED].forEach((state) => {
      this.wrapperElement.classList.toggle(
        StateClassName[state],
        state === this.state
      );
    });
  }
  notify() {
    if (this.state === STATE_RESOLVED || this.state === STATE_FAILED) {
      if (this.state === STATE_RESOLVED) {
        this.promises.forEach(
          ({ resolve }) => resolve(this.wrapperElement)
        );
      } else if (this.state === STATE_FAILED) {
        this.promises.forEach(({ reject }) => reject(this.error));
      }
      this.promises = [];
    }
    let detail = this.error;
    if (this.error instanceof MasError) {
      detail = {
        message: this.error.message,
        ...this.error.context
      };
    }
    this.wrapperElement.dispatchEvent(
      new CustomEvent(StateEventType[this.state], {
        bubbles: true,
        detail
      })
    );
  }
  /**
   * Adds name/value of the updated attribute to the `changes` map,
   * requests placeholder update.
   */
  attributeChangedCallback(name, _3, value) {
    this.changes.set(name, value);
    this.requestUpdate();
  }
  /**
   * Triggers when this component is connected to DOM.
   * Subscribes to the `ready` event of the commerce service,
   * requests placeholder update.
   */
  connectedCallback() {
    __privateSet(this, _service, getService());
    this.requestUpdate(true);
  }
  /**
   * Triggers when this component is disconnected from DOM.
   * Runs and then erases all disposers.
   */
  disconnectedCallback() {
    if (this.connected) {
      this.connected = false;
      this.log?.debug("Disconnected:", { element: this.wrapperElement });
    }
  }
  /**
   * Returns a promise resolving to this placeholder
   * when its value is resolved or rejected.
   * If placeholder is not pending for completion of an async operation
   * the returned promise is already resolved or rejected.
   */
  onceSettled() {
    const { error, promises, state } = this;
    if (STATE_RESOLVED === state)
      return Promise.resolve(this.wrapperElement);
    if (STATE_FAILED === state)
      return Promise.reject(error);
    return new Promise((resolve, reject) => {
      promises.push({ resolve, reject });
    });
  }
  /**
   * Sets component state to "RESOLVED".
   * Updates its class list and stored value, notifies observers and fires "RESOLVED" event.
   */
  toggleResolved(version, value, options) {
    if (version !== this.version)
      return false;
    if (options !== void 0)
      this.options = options;
    this.state = STATE_RESOLVED;
    this.value = value;
    this.update();
    this.log?.debug("Resolved:", { element: this.wrapperElement, value });
    setImmediate(() => this.notify());
    return true;
  }
  /**
   * Sets component state to "FAILED".
   * Updates its class list and stored error, notifies observers and fires "FAILED" event.
   */
  toggleFailed(version, error, options) {
    if (version !== this.version)
      return false;
    if (options !== void 0)
      this.options = options;
    this.error = error;
    this.state = STATE_FAILED;
    this.update();
    const wcName = this.wrapperElement.getAttribute("is");
    this.log?.error(`${wcName}: Failed to render: ${error.message}`, {
      element: this.wrapperElement,
      ...error.context,
      ...__privateGet(this, _service)?.duration
    });
    setImmediate(() => this.notify());
    return true;
  }
  /**
   * Sets component state to "PENDING".
   * Increments its version, updates CSS classes, notifies observers and fires "PENDING" event.
   */
  togglePending(options) {
    this.version++;
    if (options)
      this.options = options;
    this.state = STATE_PENDING;
    this.update();
    this.log?.debug("Pending:", {
      osi: this.wrapperElement?.options?.wcsOsi
    });
    return this.version;
  }
  /**
   * Queues task to update this component.
   * Skips rendering if update is not forced and no changes were accumulated since the previous update.
   * Calls `render` method to perform the update.
   * Restores previous state of the component if the `render` method returned `false`.
   */
  requestUpdate(force = false) {
    if (!this.wrapperElement.isConnected || !getService())
      return;
    if (this.timer)
      return;
    const { error, options, state, value, version } = this;
    this.state = STATE_PENDING;
    this.timer = setImmediate(async () => {
      this.timer = null;
      let changes = null;
      if (this.changes.size) {
        changes = Object.fromEntries(this.changes.entries());
        this.changes.clear();
      }
      if (this.connected) {
        this.log?.debug("Updated:", {
          element: this.wrapperElement,
          changes
        });
      } else {
        this.connected = true;
        this.log?.debug("Connected:", {
          element: this.wrapperElement,
          changes
        });
      }
      if (changes || force) {
        try {
          const result = await this.wrapperElement.render?.();
          if (result === false && this.state === STATE_PENDING && this.version === version) {
            this.state = state;
            this.error = error;
            this.value = value;
            this.update();
            this.notify();
          }
        } catch (error2) {
          this.toggleFailed(this.version, error2, options);
        }
      }
    });
  }
};
_service = new WeakMap();
function cleanupDataset(dataset = {}) {
  Object.entries(dataset).forEach(([key, value]) => {
    const remove = value == null || value === "" || value?.length === 0;
    if (remove)
      delete dataset[key];
  });
  return dataset;
}
function createMasElement(Class, dataset = {}) {
  const { tag, is } = Class;
  const element = document.createElement(tag, { is });
  element.setAttribute("is", is);
  Object.assign(element.dataset, cleanupDataset(dataset));
  return element;
}
function updateMasElement(element, dataset = {}) {
  if (element instanceof HTMLElement) {
    Object.assign(element.dataset, cleanupDataset(dataset));
    return element;
  }
  return null;
}

// src/checkout-mixin.js
var CLASS_NAME_DOWNLOAD = "download";
var CLASS_NAME_UPGRADE = "upgrade";
function createCheckoutElement(Class, options = {}, innerHTML = "") {
  const service = getService();
  if (!service)
    return null;
  const {
    checkoutMarketSegment,
    checkoutWorkflow,
    checkoutWorkflowStep,
    entitlement,
    upgrade,
    modal,
    perpetual,
    promotionCode,
    quantity,
    wcsOsi,
    extraOptions,
    analyticsId
  } = service.collectCheckoutOptions(options);
  const element = createMasElement(Class, {
    checkoutMarketSegment,
    checkoutWorkflow,
    checkoutWorkflowStep,
    entitlement,
    upgrade,
    modal,
    perpetual,
    promotionCode,
    quantity,
    wcsOsi,
    extraOptions,
    analyticsId
  });
  if (innerHTML)
    element.innerHTML = `<span style="pointer-events: none;">${innerHTML}</span>`;
  return element;
}
function CheckoutMixin(Base) {
  return class CheckoutBase extends Base {
    constructor() {
      super(...arguments);
      /* c8 ignore next 1 */
      __publicField(this, "checkoutActionHandler");
      __publicField(this, "masElement", new MasElement(this));
    }
    attributeChangedCallback(name, oldValue, value) {
      this.masElement.attributeChangedCallback(name, oldValue, value);
    }
    connectedCallback() {
      this.masElement.connectedCallback();
      this.addEventListener("click", this.clickHandler);
    }
    disconnectedCallback() {
      this.masElement.disconnectedCallback();
      this.removeEventListener("click", this.clickHandler);
    }
    onceSettled() {
      return this.masElement.onceSettled();
    }
    get value() {
      return this.masElement.value;
    }
    get options() {
      return this.masElement.options;
    }
    get isOpen3in1Modal() {
      const masFF3in1 = document.querySelector("meta[name=mas-ff-3in1]");
      return Object.values(MODAL_TYPE_3_IN_1).includes(this.getAttribute("data-modal")) && (!masFF3in1 || masFF3in1.content !== "off");
    }
    requestUpdate(force = false) {
      return this.masElement.requestUpdate(force);
    }
    static get observedAttributes() {
      return [
        "data-checkout-workflow",
        "data-checkout-workflow-step",
        "data-extra-options",
        "data-ims-country",
        "data-perpetual",
        "data-promotion-code",
        "data-quantity",
        "data-template",
        "data-wcs-osi",
        "data-entitlement",
        "data-upgrade",
        "data-modal"
      ];
    }
    async render(overrides = {}) {
      const service = getService();
      if (!service)
        return false;
      if (!this.dataset.imsCountry) {
        service.imsCountryPromise.then((countryCode) => {
          if (countryCode)
            this.dataset.imsCountry = countryCode;
        });
      }
      overrides.imsCountry = null;
      const options = service.collectCheckoutOptions(overrides, this);
      if (!options.wcsOsi.length)
        return false;
      let extraOptions;
      try {
        extraOptions = JSON.parse(options.extraOptions ?? "{}");
      } catch (e7) {
        this.masElement.log?.error(
          "cannot parse exta checkout options",
          e7
        );
      }
      const version = this.masElement.togglePending(options);
      this.setCheckoutUrl("");
      const promises = service.resolveOfferSelectors(options);
      let offers = await Promise.all(promises);
      offers = offers.map((offer) => selectOffers(offer, options));
      options.country = this.dataset.imsCountry || options.country;
      const checkoutAction = await service.buildCheckoutAction?.(
        offers.flat(),
        { ...extraOptions, ...options },
        this
      );
      return this.renderOffers(
        offers.flat(),
        options,
        {},
        checkoutAction,
        version
      );
    }
    /**
     * Renders checkout link href for provided offers into this component.
     * @param {Commerce.Wcs.Offer[]} offers
     * @param {Commerce.Checkout.Options} options
     * @param {Commerce.Checkout.AnyOptions} overrides
     * @param {Commerce.Checkout.CheckoutAction} checkoutAction
     * @param {number} version
     */
    renderOffers(offers, options, overrides = {}, checkoutAction = void 0, version = void 0) {
      const service = getService();
      if (!service)
        return false;
      const extraOptions = JSON.parse(
        this.dataset.extraOptions ?? "null"
      );
      options = { ...extraOptions, ...options, ...overrides };
      version ?? (version = this.masElement.togglePending(options));
      if (this.checkoutActionHandler) {
        this.checkoutActionHandler = void 0;
      }
      if (checkoutAction) {
        this.classList.remove(CLASS_NAME_DOWNLOAD, CLASS_NAME_UPGRADE);
        this.masElement.toggleResolved(version, offers, options);
        const { url, text, className, handler } = checkoutAction;
        if (url) {
          this.setCheckoutUrl(url);
        }
        if (text)
          this.firstElementChild.innerHTML = text;
        if (className)
          this.classList.add(...className.split(" "));
        if (handler) {
          this.setCheckoutUrl("#");
          this.checkoutActionHandler = handler.bind(this);
        }
      }
      if (offers.length) {
        if (this.masElement.toggleResolved(version, offers, options)) {
          if (!this.classList.contains(CLASS_NAME_DOWNLOAD) && !this.classList.contains(CLASS_NAME_UPGRADE)) {
            const url = service.buildCheckoutURL(offers, options);
            this.setCheckoutUrl(options.modal === "true" ? "#" : url);
          }
          return true;
        }
      } else {
        const error = new Error(
          `Not provided: ${options?.wcsOsi ?? "-"}`
        );
        if (this.masElement.toggleFailed(version, error, options)) {
          this.setCheckoutUrl("#");
          return true;
        }
      }
    }
    setCheckoutUrl() {
    }
    clickHandler(e7) {
    }
    updateOptions(options = {}) {
      const service = getService();
      if (!service)
        return false;
      const {
        checkoutMarketSegment,
        checkoutWorkflow,
        checkoutWorkflowStep,
        entitlement,
        upgrade,
        modal,
        perpetual,
        promotionCode,
        quantity,
        wcsOsi
      } = service.collectCheckoutOptions(options);
      updateMasElement(this, {
        checkoutMarketSegment,
        checkoutWorkflow,
        checkoutWorkflowStep,
        entitlement,
        upgrade,
        modal,
        perpetual,
        promotionCode,
        quantity,
        wcsOsi
      });
      return true;
    }
  };
}

// src/checkout-link.js
var _CheckoutLink = class _CheckoutLink extends CheckoutMixin(HTMLAnchorElement) {
  static createCheckoutLink(options = {}, innerHTML = "") {
    return createCheckoutElement(_CheckoutLink, options, innerHTML);
  }
  setCheckoutUrl(value) {
    this.setAttribute("href", value);
  }
  get isCheckoutLink() {
    return true;
  }
  clickHandler(e7) {
    if (this.checkoutActionHandler) {
      this.checkoutActionHandler?.(e7);
      return;
    }
  }
};
__publicField(_CheckoutLink, "is", "checkout-link");
__publicField(_CheckoutLink, "tag", "a");
var CheckoutLink = _CheckoutLink;
if (!window.customElements.get(CheckoutLink.is)) {
  window.customElements.define(CheckoutLink.is, CheckoutLink, {
    extends: CheckoutLink.tag
  });
}

// src/buildCheckoutUrl.js
var AF_DRAFT_LANDSCAPE = "p_draft_landscape";
var UCV3_PREFIX = "/store/";
var PARAMETERS = /* @__PURE__ */ new Map([
  ["countrySpecific", "cs"],
  ["customerSegment", "cs"],
  ["quantity", "q"],
  ["authCode", "code"],
  ["checkoutPromoCode", "apc"],
  ["rurl", "rUrl"],
  ["curl", "cUrl"],
  ["ctxrturl", "ctxRtUrl"],
  ["country", "co"],
  ["language", "lang"],
  ["clientId", "cli"],
  ["context", "ctx"],
  ["productArrangementCode", "pa"],
  ["offerType", "ot"],
  ["marketSegment", "ms"]
]);
var ALLOWED_KEYS = /* @__PURE__ */ new Set([
  "af",
  "ai",
  "apc",
  "appctxid",
  "cli",
  "co",
  "cs",
  "csm",
  "ctx",
  "ctxRtUrl",
  "DCWATC",
  "dp",
  // Enable digital payments for iframe context
  "fr",
  // represents the commerce app redirecting to UC
  "gsp",
  "ijt",
  "lang",
  "lo",
  "mal",
  "ms",
  "mv",
  "mv2",
  "nglwfdata",
  "ot",
  "otac",
  "pa",
  "pcid",
  // Unified Paywall configuration ID for analytics
  "promoid",
  "q",
  "rf",
  "sc",
  "scl",
  "sdid",
  "sid",
  // x-adobe-clientsession
  "spint",
  "svar",
  "th",
  "thm",
  "trackingid",
  "usid",
  "workflowid",
  "context.guid",
  "so.ca",
  "so.su",
  "so.tr",
  "so.va"
]);
var REQUIRED_KEYS = ["env", "workflowStep", "clientId", "country"];
var mapParameterName = (field) => PARAMETERS.get(field) ?? field;
function addParameters(inputParameters, resultParameters, allowedKeys) {
  for (const [key, value] of Object.entries(inputParameters)) {
    const mappedKey = mapParameterName(key);
    if (value != null && allowedKeys.has(mappedKey)) {
      resultParameters.set(mappedKey, value);
    }
  }
}
function getHostName(env) {
  switch (env) {
    case PROVIDER_ENVIRONMENT.PRODUCTION:
      return "https://commerce.adobe.com";
    default:
      return "https://commerce-stg.adobe.com";
  }
}
function setItemsParameter(items, parameters) {
  for (const idx in items) {
    const item = items[idx];
    for (const [key, value] of Object.entries(item)) {
      if (value == null)
        continue;
      const parameterName = mapParameterName(key);
      parameters.set(`items[${idx}][${parameterName}]`, value);
    }
  }
}
function add3in1Parameters({ url, modal, customerSegment, marketSegment, quantity, productArrangementCode, addonProductArrangementCode }) {
  const masFF3in1 = document.querySelector("meta[name=mas-ff-3in1]");
  if (!Object.values(MODAL_TYPE_3_IN_1).includes(modal) || !url?.searchParams || !customerSegment || !marketSegment || masFF3in1?.content === "off")
    return url;
  url.searchParams.set("rtc", "t");
  url.searchParams.set("lo", "sl");
  if (url.searchParams.get("cli") !== "doc_cloud") {
    url.searchParams.set("cli", modal === MODAL_TYPE_3_IN_1.CRM ? "creative" : "mini_plans");
  }
  if (modal === MODAL_TYPE_3_IN_1.CRM) {
    url.searchParams.set("af", "uc_segmentation_hide_tabs,uc_new_user_iframe,uc_new_system_close");
  } else if (modal === MODAL_TYPE_3_IN_1.TWP || modal === MODAL_TYPE_3_IN_1.D2P) {
    url.searchParams.set("af", "uc_new_user_iframe,uc_new_system_close");
    if (customerSegment === "INDIVIDUAL" && marketSegment === "EDU") {
      url.searchParams.set("ms", "e");
    }
    if (customerSegment === "TEAM" && marketSegment === "COM") {
      url.searchParams.set("cs", "t");
    }
  }
  if (quantity) {
    url.searchParams.set("q", quantity);
  }
  if (addonProductArrangementCode) {
    url.searchParams.set("ao", addonProductArrangementCode);
  }
  console.log("productArrangementCode", productArrangementCode);
  if (productArrangementCode) {
    url.searchParams.set("pa", productArrangementCode);
  }
  return url;
}
function buildCheckoutUrl(checkoutData) {
  console.log("checkoutData", checkoutData);
  validateCheckoutData(checkoutData);
  const { env, items, workflowStep, ms, marketSegment, customerSegment, ot, offerType, pa, productArrangementCode, landscape, modal, ...rest } = checkoutData;
  const segmentationParameters = {
    marketSegment: marketSegment ?? ms,
    offerType: offerType ?? ot,
    productArrangementCode: productArrangementCode ?? pa
  };
  let url = new URL(getHostName(env));
  url.pathname = `${UCV3_PREFIX}${workflowStep}`;
  if (workflowStep !== CheckoutWorkflowStep.SEGMENTATION && workflowStep !== CheckoutWorkflowStep.CHANGE_PLAN_TEAM_PLANS) {
    setItemsParameter(items, url.searchParams);
  }
  if (workflowStep === CheckoutWorkflowStep.SEGMENTATION) {
    addParameters(segmentationParameters, url.searchParams, ALLOWED_KEYS);
  }
  addParameters(rest, url.searchParams, ALLOWED_KEYS);
  if (landscape === Landscape.DRAFT) {
    addParameters({ af: AF_DRAFT_LANDSCAPE }, url.searchParams, ALLOWED_KEYS);
  }
  url = add3in1Parameters({
    url,
    modal,
    customerSegment: customerSegment ?? items?.[0]?.customerSegment,
    marketSegment: ms ?? marketSegment ?? items?.[0]?.marketSegment,
    quantity: items?.[0]?.quantity > 1 && items?.[0]?.quantity,
    productArrangementCode: productArrangementCode ?? items?.[0]?.productArrangementCode,
    addonProductArrangementCode: productArrangementCode ? items?.find((item) => item.productArrangementCode !== productArrangementCode)?.productArrangementCode : items?.[1]?.productArrangementCode
  });
  return url.toString();
}
function validateCheckoutData(checkoutData) {
  for (const key of REQUIRED_KEYS) {
    if (!checkoutData[key]) {
      throw new Error('Argument "checkoutData" is not valid, missing: ' + key);
    }
  }
  if (checkoutData.workflowStep !== CheckoutWorkflowStep.SEGMENTATION && checkoutData.workflowStep !== CheckoutWorkflowStep.CHANGE_PLAN_TEAM_PLANS && !checkoutData.items) {
    throw new Error('Argument "checkoutData" is not valid, missing: items');
  }
  return true;
}

// src/defaults.js
var Defaults = Object.freeze({
  checkoutClientId: "adobe_com",
  checkoutWorkflow: CheckoutWorkflow.V3,
  checkoutWorkflowStep: CheckoutWorkflowStep.EMAIL,
  country: "US",
  displayOldPrice: true,
  displayPerUnit: false,
  displayRecurrence: true,
  displayTax: false,
  env: Env.PRODUCTION,
  forceTaxExclusive: false,
  language: "en",
  entitlement: false,
  extraOptions: {},
  modal: false,
  promotionCode: "",
  quantity: 1,
  alternativePrice: false,
  wcsApiKey: "wcms-commerce-ims-ro-user-milo",
  wcsURL: "https://www.adobe.com/web_commerce_artifact",
  landscape: Landscape.PUBLISHED
});

// src/checkout.js
function Checkout({ providers, settings }) {
  function collectCheckoutOptions(overrides, placeholder) {
    const {
      checkoutClientId,
      checkoutWorkflow: defaultWorkflow,
      checkoutWorkflowStep: defaultWorkflowStep,
      country: defaultCountry,
      language: defaultLanguage,
      promotionCode: defaultPromotionCode,
      quantity: defaultQuantity
    } = settings;
    const {
      checkoutMarketSegment,
      checkoutWorkflow = defaultWorkflow,
      checkoutWorkflowStep = defaultWorkflowStep,
      imsCountry: imsCountry2,
      country = imsCountry2 ?? defaultCountry,
      language = defaultLanguage,
      quantity = defaultQuantity,
      entitlement,
      upgrade,
      modal,
      perpetual,
      promotionCode = defaultPromotionCode,
      wcsOsi,
      extraOptions,
      ...rest
    } = Object.assign({}, placeholder?.dataset ?? {}, overrides ?? {});
    const workflow = toEnumeration(
      checkoutWorkflow,
      CheckoutWorkflow,
      Defaults.checkoutWorkflow
    );
    let workflowStep = CheckoutWorkflowStep.CHECKOUT;
    if (workflow === CheckoutWorkflow.V3) {
      workflowStep = toEnumeration(
        checkoutWorkflowStep,
        CheckoutWorkflowStep,
        Defaults.checkoutWorkflowStep
      );
    }
    const options = omitProperties({
      ...rest,
      extraOptions,
      checkoutClientId,
      checkoutMarketSegment,
      country,
      quantity: toQuantity(quantity, Defaults.quantity),
      checkoutWorkflow: workflow,
      checkoutWorkflowStep: workflowStep,
      language,
      entitlement: toBoolean(entitlement),
      upgrade: toBoolean(upgrade),
      modal,
      perpetual: toBoolean(perpetual),
      promotionCode: computePromoStatus(promotionCode).effectivePromoCode,
      wcsOsi: toOfferSelectorIds(wcsOsi)
    });
    if (placeholder) {
      for (const provider of providers.checkout) {
        provider(placeholder, options);
      }
    }
    return options;
  }
  function buildCheckoutURL(offers, options) {
    if (!Array.isArray(offers) || !offers.length || !options) {
      return "";
    }
    const { env, landscape } = settings;
    const {
      checkoutClientId: clientId,
      checkoutMarketSegment: marketSegment,
      checkoutWorkflow: workflow,
      checkoutWorkflowStep: workflowStep,
      country,
      promotionCode: checkoutPromoCode,
      quantity,
      ...rest
    } = collectCheckoutOptions(options);
    const masFF3in1 = document.querySelector("meta[name=mas-ff-3in1]");
    const is3in1 = Object.values(MODAL_TYPE_3_IN_1).includes(options.modal) && (!masFF3in1 || masFF3in1.content !== "off");
    const context = window.frameElement || is3in1 ? "if" : "fp";
    const data = {
      checkoutPromoCode,
      clientId,
      context,
      country,
      env,
      items: [],
      marketSegment,
      workflowStep,
      landscape,
      ...rest
    };
    if (offers.length === 1) {
      const [{ offerId, offerType, productArrangementCode }] = offers;
      const {
        marketSegments: [marketSegment2],
        customerSegment
      } = offers[0];
      Object.assign(data, {
        marketSegment: marketSegment2,
        customerSegment,
        offerType,
        productArrangementCode
      });
      data.items.push(
        quantity[0] === 1 ? { id: offerId } : { id: offerId, quantity: quantity[0] }
      );
    } else {
      data.items.push(
        ...offers.map(({ offerId, productArrangementCode, marketSegments, customerSegment }, index) => ({
          id: offerId,
          quantity: quantity[index] ?? Defaults.quantity,
          ...is3in1 ? { productArrangementCode, marketSegment: marketSegments[0], customerSegment } : {}
        }))
      );
    }
    return buildCheckoutUrl(data);
  }
  const { createCheckoutLink } = CheckoutLink;
  return {
    CheckoutLink,
    CheckoutWorkflow,
    CheckoutWorkflowStep,
    buildCheckoutURL,
    collectCheckoutOptions,
    createCheckoutLink
  };
}

// src/ims.js
function imsReady({ interval = 200, maxAttempts = 25 } = {}) {
  const log2 = Log.module("ims");
  return new Promise((resolve) => {
    log2.debug("Waing for IMS to be ready");
    let count = 0;
    function poll() {
      if (window.adobeIMS?.initialized) {
        resolve();
      } else if (++count > maxAttempts) {
        log2.debug("Timeout");
        resolve();
      } else {
        setTimeout(poll, interval);
      }
    }
    poll();
  });
}
function imsSignedIn(imsReadyPromise) {
  return imsReadyPromise.then(
    () => window.adobeIMS?.isSignedInUser() ?? false
  );
}
function imsCountry(imsSignedInPromise) {
  const log2 = Log.module("ims");
  return imsSignedInPromise.then((signedIn) => {
    if (!signedIn)
      return null;
    return window.adobeIMS.getProfile().then(
      ({ countryCode }) => {
        log2.debug("Got user country:", countryCode);
        return countryCode;
      },
      (error) => {
        log2.error("Unable to get user country:", error);
        return void 0;
      }
    );
  });
}
function Ims({}) {
  const imsReadyPromise = imsReady();
  const imsSignedInPromise = imsSignedIn(imsReadyPromise);
  const imsCountryPromise = imsCountry(imsSignedInPromise);
  return { imsReadyPromise, imsSignedInPromise, imsCountryPromise };
}

// src/literals.js
var priceLiterals = window.masPriceLiterals;
function getPriceLiterals(settings) {
  if (Array.isArray(priceLiterals)) {
    const find = (language) => priceLiterals.find(
      (candidate) => equalsCaseInsensitive(candidate.lang, language)
    );
    const literals = find(settings.language) ?? find(Defaults.language);
    if (literals)
      return Object.freeze(literals);
  }
  return {};
}

// node_modules/tslib/tslib.es6.mjs
var extendStatics = function(d5, b3) {
  extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d6, b4) {
    d6.__proto__ = b4;
  } || function(d6, b4) {
    for (var p3 in b4)
      if (Object.prototype.hasOwnProperty.call(b4, p3))
        d6[p3] = b4[p3];
  };
  return extendStatics(d5, b3);
};
function __extends(d5, b3) {
  if (typeof b3 !== "function" && b3 !== null)
    throw new TypeError("Class extends value " + String(b3) + " is not a constructor or null");
  extendStatics(d5, b3);
  function __() {
    this.constructor = d5;
  }
  d5.prototype = b3 === null ? Object.create(b3) : (__.prototype = b3.prototype, new __());
}
var __assign = function() {
  __assign = Object.assign || function __assign2(t5) {
    for (var s8, i5 = 1, n8 = arguments.length; i5 < n8; i5++) {
      s8 = arguments[i5];
      for (var p3 in s8)
        if (Object.prototype.hasOwnProperty.call(s8, p3))
          t5[p3] = s8[p3];
    }
    return t5;
  };
  return __assign.apply(this, arguments);
};
function __spreadArray(to, from, pack) {
  if (pack || arguments.length === 2)
    for (var i5 = 0, l6 = from.length, ar; i5 < l6; i5++) {
      if (ar || !(i5 in from)) {
        if (!ar)
          ar = Array.prototype.slice.call(from, 0, i5);
        ar[i5] = from[i5];
      }
    }
  return to.concat(ar || Array.prototype.slice.call(from));
}

// node_modules/@formatjs/icu-messageformat-parser/lib/error.js
var ErrorKind;
(function(ErrorKind2) {
  ErrorKind2[ErrorKind2["EXPECT_ARGUMENT_CLOSING_BRACE"] = 1] = "EXPECT_ARGUMENT_CLOSING_BRACE";
  ErrorKind2[ErrorKind2["EMPTY_ARGUMENT"] = 2] = "EMPTY_ARGUMENT";
  ErrorKind2[ErrorKind2["MALFORMED_ARGUMENT"] = 3] = "MALFORMED_ARGUMENT";
  ErrorKind2[ErrorKind2["EXPECT_ARGUMENT_TYPE"] = 4] = "EXPECT_ARGUMENT_TYPE";
  ErrorKind2[ErrorKind2["INVALID_ARGUMENT_TYPE"] = 5] = "INVALID_ARGUMENT_TYPE";
  ErrorKind2[ErrorKind2["EXPECT_ARGUMENT_STYLE"] = 6] = "EXPECT_ARGUMENT_STYLE";
  ErrorKind2[ErrorKind2["INVALID_NUMBER_SKELETON"] = 7] = "INVALID_NUMBER_SKELETON";
  ErrorKind2[ErrorKind2["INVALID_DATE_TIME_SKELETON"] = 8] = "INVALID_DATE_TIME_SKELETON";
  ErrorKind2[ErrorKind2["EXPECT_NUMBER_SKELETON"] = 9] = "EXPECT_NUMBER_SKELETON";
  ErrorKind2[ErrorKind2["EXPECT_DATE_TIME_SKELETON"] = 10] = "EXPECT_DATE_TIME_SKELETON";
  ErrorKind2[ErrorKind2["UNCLOSED_QUOTE_IN_ARGUMENT_STYLE"] = 11] = "UNCLOSED_QUOTE_IN_ARGUMENT_STYLE";
  ErrorKind2[ErrorKind2["EXPECT_SELECT_ARGUMENT_OPTIONS"] = 12] = "EXPECT_SELECT_ARGUMENT_OPTIONS";
  ErrorKind2[ErrorKind2["EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE"] = 13] = "EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE";
  ErrorKind2[ErrorKind2["INVALID_PLURAL_ARGUMENT_OFFSET_VALUE"] = 14] = "INVALID_PLURAL_ARGUMENT_OFFSET_VALUE";
  ErrorKind2[ErrorKind2["EXPECT_SELECT_ARGUMENT_SELECTOR"] = 15] = "EXPECT_SELECT_ARGUMENT_SELECTOR";
  ErrorKind2[ErrorKind2["EXPECT_PLURAL_ARGUMENT_SELECTOR"] = 16] = "EXPECT_PLURAL_ARGUMENT_SELECTOR";
  ErrorKind2[ErrorKind2["EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT"] = 17] = "EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT";
  ErrorKind2[ErrorKind2["EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT"] = 18] = "EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT";
  ErrorKind2[ErrorKind2["INVALID_PLURAL_ARGUMENT_SELECTOR"] = 19] = "INVALID_PLURAL_ARGUMENT_SELECTOR";
  ErrorKind2[ErrorKind2["DUPLICATE_PLURAL_ARGUMENT_SELECTOR"] = 20] = "DUPLICATE_PLURAL_ARGUMENT_SELECTOR";
  ErrorKind2[ErrorKind2["DUPLICATE_SELECT_ARGUMENT_SELECTOR"] = 21] = "DUPLICATE_SELECT_ARGUMENT_SELECTOR";
  ErrorKind2[ErrorKind2["MISSING_OTHER_CLAUSE"] = 22] = "MISSING_OTHER_CLAUSE";
  ErrorKind2[ErrorKind2["INVALID_TAG"] = 23] = "INVALID_TAG";
  ErrorKind2[ErrorKind2["INVALID_TAG_NAME"] = 25] = "INVALID_TAG_NAME";
  ErrorKind2[ErrorKind2["UNMATCHED_CLOSING_TAG"] = 26] = "UNMATCHED_CLOSING_TAG";
  ErrorKind2[ErrorKind2["UNCLOSED_TAG"] = 27] = "UNCLOSED_TAG";
})(ErrorKind || (ErrorKind = {}));

// node_modules/@formatjs/icu-messageformat-parser/lib/types.js
var TYPE;
(function(TYPE2) {
  TYPE2[TYPE2["literal"] = 0] = "literal";
  TYPE2[TYPE2["argument"] = 1] = "argument";
  TYPE2[TYPE2["number"] = 2] = "number";
  TYPE2[TYPE2["date"] = 3] = "date";
  TYPE2[TYPE2["time"] = 4] = "time";
  TYPE2[TYPE2["select"] = 5] = "select";
  TYPE2[TYPE2["plural"] = 6] = "plural";
  TYPE2[TYPE2["pound"] = 7] = "pound";
  TYPE2[TYPE2["tag"] = 8] = "tag";
})(TYPE || (TYPE = {}));
var SKELETON_TYPE;
(function(SKELETON_TYPE2) {
  SKELETON_TYPE2[SKELETON_TYPE2["number"] = 0] = "number";
  SKELETON_TYPE2[SKELETON_TYPE2["dateTime"] = 1] = "dateTime";
})(SKELETON_TYPE || (SKELETON_TYPE = {}));
function isLiteralElement(el) {
  return el.type === TYPE.literal;
}
function isArgumentElement(el) {
  return el.type === TYPE.argument;
}
function isNumberElement(el) {
  return el.type === TYPE.number;
}
function isDateElement(el) {
  return el.type === TYPE.date;
}
function isTimeElement(el) {
  return el.type === TYPE.time;
}
function isSelectElement(el) {
  return el.type === TYPE.select;
}
function isPluralElement(el) {
  return el.type === TYPE.plural;
}
function isPoundElement(el) {
  return el.type === TYPE.pound;
}
function isTagElement(el) {
  return el.type === TYPE.tag;
}
function isNumberSkeleton(el) {
  return !!(el && typeof el === "object" && el.type === SKELETON_TYPE.number);
}
function isDateTimeSkeleton(el) {
  return !!(el && typeof el === "object" && el.type === SKELETON_TYPE.dateTime);
}

// node_modules/@formatjs/icu-messageformat-parser/lib/regex.generated.js
var SPACE_SEPARATOR_REGEX = /[ \xA0\u1680\u2000-\u200A\u202F\u205F\u3000]/;

// node_modules/@formatjs/icu-skeleton-parser/lib/date-time.js
var DATE_TIME_REGEX = /(?:[Eec]{1,6}|G{1,5}|[Qq]{1,5}|(?:[yYur]+|U{1,5})|[ML]{1,5}|d{1,2}|D{1,3}|F{1}|[abB]{1,5}|[hkHK]{1,2}|w{1,2}|W{1}|m{1,2}|s{1,2}|[zZOvVxX]{1,4})(?=([^']*'[^']*')*[^']*$)/g;
function parseDateTimeSkeleton(skeleton) {
  var result = {};
  skeleton.replace(DATE_TIME_REGEX, function(match) {
    var len = match.length;
    switch (match[0]) {
      case "G":
        result.era = len === 4 ? "long" : len === 5 ? "narrow" : "short";
        break;
      case "y":
        result.year = len === 2 ? "2-digit" : "numeric";
        break;
      case "Y":
      case "u":
      case "U":
      case "r":
        throw new RangeError("`Y/u/U/r` (year) patterns are not supported, use `y` instead");
      case "q":
      case "Q":
        throw new RangeError("`q/Q` (quarter) patterns are not supported");
      case "M":
      case "L":
        result.month = ["numeric", "2-digit", "short", "long", "narrow"][len - 1];
        break;
      case "w":
      case "W":
        throw new RangeError("`w/W` (week) patterns are not supported");
      case "d":
        result.day = ["numeric", "2-digit"][len - 1];
        break;
      case "D":
      case "F":
      case "g":
        throw new RangeError("`D/F/g` (day) patterns are not supported, use `d` instead");
      case "E":
        result.weekday = len === 4 ? "short" : len === 5 ? "narrow" : "short";
        break;
      case "e":
        if (len < 4) {
          throw new RangeError("`e..eee` (weekday) patterns are not supported");
        }
        result.weekday = ["short", "long", "narrow", "short"][len - 4];
        break;
      case "c":
        if (len < 4) {
          throw new RangeError("`c..ccc` (weekday) patterns are not supported");
        }
        result.weekday = ["short", "long", "narrow", "short"][len - 4];
        break;
      case "a":
        result.hour12 = true;
        break;
      case "b":
      case "B":
        throw new RangeError("`b/B` (period) patterns are not supported, use `a` instead");
      case "h":
        result.hourCycle = "h12";
        result.hour = ["numeric", "2-digit"][len - 1];
        break;
      case "H":
        result.hourCycle = "h23";
        result.hour = ["numeric", "2-digit"][len - 1];
        break;
      case "K":
        result.hourCycle = "h11";
        result.hour = ["numeric", "2-digit"][len - 1];
        break;
      case "k":
        result.hourCycle = "h24";
        result.hour = ["numeric", "2-digit"][len - 1];
        break;
      case "j":
      case "J":
      case "C":
        throw new RangeError("`j/J/C` (hour) patterns are not supported, use `h/H/K/k` instead");
      case "m":
        result.minute = ["numeric", "2-digit"][len - 1];
        break;
      case "s":
        result.second = ["numeric", "2-digit"][len - 1];
        break;
      case "S":
      case "A":
        throw new RangeError("`S/A` (second) patterns are not supported, use `s` instead");
      case "z":
        result.timeZoneName = len < 4 ? "short" : "long";
        break;
      case "Z":
      case "O":
      case "v":
      case "V":
      case "X":
      case "x":
        throw new RangeError("`Z/O/v/V/X/x` (timeZone) patterns are not supported, use `z` instead");
    }
    return "";
  });
  return result;
}

// node_modules/@formatjs/icu-skeleton-parser/lib/regex.generated.js
var WHITE_SPACE_REGEX = /[\t-\r \x85\u200E\u200F\u2028\u2029]/i;

// node_modules/@formatjs/icu-skeleton-parser/lib/number.js
function parseNumberSkeletonFromString(skeleton) {
  if (skeleton.length === 0) {
    throw new Error("Number skeleton cannot be empty");
  }
  var stringTokens = skeleton.split(WHITE_SPACE_REGEX).filter(function(x3) {
    return x3.length > 0;
  });
  var tokens = [];
  for (var _i = 0, stringTokens_1 = stringTokens; _i < stringTokens_1.length; _i++) {
    var stringToken = stringTokens_1[_i];
    var stemAndOptions = stringToken.split("/");
    if (stemAndOptions.length === 0) {
      throw new Error("Invalid number skeleton");
    }
    var stem = stemAndOptions[0], options = stemAndOptions.slice(1);
    for (var _a2 = 0, options_1 = options; _a2 < options_1.length; _a2++) {
      var option = options_1[_a2];
      if (option.length === 0) {
        throw new Error("Invalid number skeleton");
      }
    }
    tokens.push({ stem, options });
  }
  return tokens;
}
function icuUnitToEcma(unit) {
  return unit.replace(/^(.*?)-/, "");
}
var FRACTION_PRECISION_REGEX = /^\.(?:(0+)(\*)?|(#+)|(0+)(#+))$/g;
var SIGNIFICANT_PRECISION_REGEX = /^(@+)?(\+|#+)?$/g;
var INTEGER_WIDTH_REGEX = /(\*)(0+)|(#+)(0+)|(0+)/g;
var CONCISE_INTEGER_WIDTH_REGEX = /^(0+)$/;
function parseSignificantPrecision(str) {
  var result = {};
  str.replace(SIGNIFICANT_PRECISION_REGEX, function(_3, g1, g22) {
    if (typeof g22 !== "string") {
      result.minimumSignificantDigits = g1.length;
      result.maximumSignificantDigits = g1.length;
    } else if (g22 === "+") {
      result.minimumSignificantDigits = g1.length;
    } else if (g1[0] === "#") {
      result.maximumSignificantDigits = g1.length;
    } else {
      result.minimumSignificantDigits = g1.length;
      result.maximumSignificantDigits = g1.length + (typeof g22 === "string" ? g22.length : 0);
    }
    return "";
  });
  return result;
}
function parseSign(str) {
  switch (str) {
    case "sign-auto":
      return {
        signDisplay: "auto"
      };
    case "sign-accounting":
    case "()":
      return {
        currencySign: "accounting"
      };
    case "sign-always":
    case "+!":
      return {
        signDisplay: "always"
      };
    case "sign-accounting-always":
    case "()!":
      return {
        signDisplay: "always",
        currencySign: "accounting"
      };
    case "sign-except-zero":
    case "+?":
      return {
        signDisplay: "exceptZero"
      };
    case "sign-accounting-except-zero":
    case "()?":
      return {
        signDisplay: "exceptZero",
        currencySign: "accounting"
      };
    case "sign-never":
    case "+_":
      return {
        signDisplay: "never"
      };
  }
}
function parseConciseScientificAndEngineeringStem(stem) {
  var result;
  if (stem[0] === "E" && stem[1] === "E") {
    result = {
      notation: "engineering"
    };
    stem = stem.slice(2);
  } else if (stem[0] === "E") {
    result = {
      notation: "scientific"
    };
    stem = stem.slice(1);
  }
  if (result) {
    var signDisplay = stem.slice(0, 2);
    if (signDisplay === "+!") {
      result.signDisplay = "always";
      stem = stem.slice(2);
    } else if (signDisplay === "+?") {
      result.signDisplay = "exceptZero";
      stem = stem.slice(2);
    }
    if (!CONCISE_INTEGER_WIDTH_REGEX.test(stem)) {
      throw new Error("Malformed concise eng/scientific notation");
    }
    result.minimumIntegerDigits = stem.length;
  }
  return result;
}
function parseNotationOptions(opt) {
  var result = {};
  var signOpts = parseSign(opt);
  if (signOpts) {
    return signOpts;
  }
  return result;
}
function parseNumberSkeleton(tokens) {
  var result = {};
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    switch (token.stem) {
      case "percent":
      case "%":
        result.style = "percent";
        continue;
      case "%x100":
        result.style = "percent";
        result.scale = 100;
        continue;
      case "currency":
        result.style = "currency";
        result.currency = token.options[0];
        continue;
      case "group-off":
      case ",_":
        result.useGrouping = false;
        continue;
      case "precision-integer":
      case ".":
        result.maximumFractionDigits = 0;
        continue;
      case "measure-unit":
      case "unit":
        result.style = "unit";
        result.unit = icuUnitToEcma(token.options[0]);
        continue;
      case "compact-short":
      case "K":
        result.notation = "compact";
        result.compactDisplay = "short";
        continue;
      case "compact-long":
      case "KK":
        result.notation = "compact";
        result.compactDisplay = "long";
        continue;
      case "scientific":
        result = __assign(__assign(__assign({}, result), { notation: "scientific" }), token.options.reduce(function(all, opt) {
          return __assign(__assign({}, all), parseNotationOptions(opt));
        }, {}));
        continue;
      case "engineering":
        result = __assign(__assign(__assign({}, result), { notation: "engineering" }), token.options.reduce(function(all, opt) {
          return __assign(__assign({}, all), parseNotationOptions(opt));
        }, {}));
        continue;
      case "notation-simple":
        result.notation = "standard";
        continue;
      case "unit-width-narrow":
        result.currencyDisplay = "narrowSymbol";
        result.unitDisplay = "narrow";
        continue;
      case "unit-width-short":
        result.currencyDisplay = "code";
        result.unitDisplay = "short";
        continue;
      case "unit-width-full-name":
        result.currencyDisplay = "name";
        result.unitDisplay = "long";
        continue;
      case "unit-width-iso-code":
        result.currencyDisplay = "symbol";
        continue;
      case "scale":
        result.scale = parseFloat(token.options[0]);
        continue;
      case "integer-width":
        if (token.options.length > 1) {
          throw new RangeError("integer-width stems only accept a single optional option");
        }
        token.options[0].replace(INTEGER_WIDTH_REGEX, function(_3, g1, g22, g3, g4, g5) {
          if (g1) {
            result.minimumIntegerDigits = g22.length;
          } else if (g3 && g4) {
            throw new Error("We currently do not support maximum integer digits");
          } else if (g5) {
            throw new Error("We currently do not support exact integer digits");
          }
          return "";
        });
        continue;
    }
    if (CONCISE_INTEGER_WIDTH_REGEX.test(token.stem)) {
      result.minimumIntegerDigits = token.stem.length;
      continue;
    }
    if (FRACTION_PRECISION_REGEX.test(token.stem)) {
      if (token.options.length > 1) {
        throw new RangeError("Fraction-precision stems only accept a single optional option");
      }
      token.stem.replace(FRACTION_PRECISION_REGEX, function(_3, g1, g22, g3, g4, g5) {
        if (g22 === "*") {
          result.minimumFractionDigits = g1.length;
        } else if (g3 && g3[0] === "#") {
          result.maximumFractionDigits = g3.length;
        } else if (g4 && g5) {
          result.minimumFractionDigits = g4.length;
          result.maximumFractionDigits = g4.length + g5.length;
        } else {
          result.minimumFractionDigits = g1.length;
          result.maximumFractionDigits = g1.length;
        }
        return "";
      });
      if (token.options.length) {
        result = __assign(__assign({}, result), parseSignificantPrecision(token.options[0]));
      }
      continue;
    }
    if (SIGNIFICANT_PRECISION_REGEX.test(token.stem)) {
      result = __assign(__assign({}, result), parseSignificantPrecision(token.stem));
      continue;
    }
    var signOpts = parseSign(token.stem);
    if (signOpts) {
      result = __assign(__assign({}, result), signOpts);
    }
    var conciseScientificAndEngineeringOpts = parseConciseScientificAndEngineeringStem(token.stem);
    if (conciseScientificAndEngineeringOpts) {
      result = __assign(__assign({}, result), conciseScientificAndEngineeringOpts);
    }
  }
  return result;
}

// node_modules/@formatjs/icu-messageformat-parser/lib/parser.js
var _a;
var SPACE_SEPARATOR_START_REGEX = new RegExp("^" + SPACE_SEPARATOR_REGEX.source + "*");
var SPACE_SEPARATOR_END_REGEX = new RegExp(SPACE_SEPARATOR_REGEX.source + "*$");
function createLocation(start, end) {
  return { start, end };
}
var hasNativeStartsWith = !!String.prototype.startsWith;
var hasNativeFromCodePoint = !!String.fromCodePoint;
var hasNativeFromEntries = !!Object.fromEntries;
var hasNativeCodePointAt = !!String.prototype.codePointAt;
var hasTrimStart = !!String.prototype.trimStart;
var hasTrimEnd = !!String.prototype.trimEnd;
var hasNativeIsSafeInteger = !!Number.isSafeInteger;
var isSafeInteger = hasNativeIsSafeInteger ? Number.isSafeInteger : function(n8) {
  return typeof n8 === "number" && isFinite(n8) && Math.floor(n8) === n8 && Math.abs(n8) <= 9007199254740991;
};
var REGEX_SUPPORTS_U_AND_Y = true;
try {
  re = RE("([^\\p{White_Space}\\p{Pattern_Syntax}]*)", "yu");
  REGEX_SUPPORTS_U_AND_Y = ((_a = re.exec("a")) === null || _a === void 0 ? void 0 : _a[0]) === "a";
} catch (_3) {
  REGEX_SUPPORTS_U_AND_Y = false;
}
var re;
var startsWith = hasNativeStartsWith ? (
  // Native
  function startsWith2(s8, search, position) {
    return s8.startsWith(search, position);
  }
) : (
  // For IE11
  function startsWith3(s8, search, position) {
    return s8.slice(position, position + search.length) === search;
  }
);
var fromCodePoint = hasNativeFromCodePoint ? String.fromCodePoint : (
  // IE11
  function fromCodePoint2() {
    var codePoints = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      codePoints[_i] = arguments[_i];
    }
    var elements = "";
    var length = codePoints.length;
    var i5 = 0;
    var code;
    while (length > i5) {
      code = codePoints[i5++];
      if (code > 1114111)
        throw RangeError(code + " is not a valid code point");
      elements += code < 65536 ? String.fromCharCode(code) : String.fromCharCode(((code -= 65536) >> 10) + 55296, code % 1024 + 56320);
    }
    return elements;
  }
);
var fromEntries = (
  // native
  hasNativeFromEntries ? Object.fromEntries : (
    // Ponyfill
    function fromEntries2(entries) {
      var obj = {};
      for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
        var _a2 = entries_1[_i], k3 = _a2[0], v3 = _a2[1];
        obj[k3] = v3;
      }
      return obj;
    }
  )
);
var codePointAt = hasNativeCodePointAt ? (
  // Native
  function codePointAt2(s8, index) {
    return s8.codePointAt(index);
  }
) : (
  // IE 11
  function codePointAt3(s8, index) {
    var size = s8.length;
    if (index < 0 || index >= size) {
      return void 0;
    }
    var first = s8.charCodeAt(index);
    var second;
    return first < 55296 || first > 56319 || index + 1 === size || (second = s8.charCodeAt(index + 1)) < 56320 || second > 57343 ? first : (first - 55296 << 10) + (second - 56320) + 65536;
  }
);
var trimStart = hasTrimStart ? (
  // Native
  function trimStart2(s8) {
    return s8.trimStart();
  }
) : (
  // Ponyfill
  function trimStart3(s8) {
    return s8.replace(SPACE_SEPARATOR_START_REGEX, "");
  }
);
var trimEnd = hasTrimEnd ? (
  // Native
  function trimEnd2(s8) {
    return s8.trimEnd();
  }
) : (
  // Ponyfill
  function trimEnd3(s8) {
    return s8.replace(SPACE_SEPARATOR_END_REGEX, "");
  }
);
function RE(s8, flag) {
  return new RegExp(s8, flag);
}
var matchIdentifierAtIndex;
if (REGEX_SUPPORTS_U_AND_Y) {
  IDENTIFIER_PREFIX_RE_1 = RE("([^\\p{White_Space}\\p{Pattern_Syntax}]*)", "yu");
  matchIdentifierAtIndex = function matchIdentifierAtIndex2(s8, index) {
    var _a2;
    IDENTIFIER_PREFIX_RE_1.lastIndex = index;
    var match = IDENTIFIER_PREFIX_RE_1.exec(s8);
    return (_a2 = match[1]) !== null && _a2 !== void 0 ? _a2 : "";
  };
} else {
  matchIdentifierAtIndex = function matchIdentifierAtIndex2(s8, index) {
    var match = [];
    while (true) {
      var c5 = codePointAt(s8, index);
      if (c5 === void 0 || _isWhiteSpace(c5) || _isPatternSyntax(c5)) {
        break;
      }
      match.push(c5);
      index += c5 >= 65536 ? 2 : 1;
    }
    return fromCodePoint.apply(void 0, match);
  };
}
var IDENTIFIER_PREFIX_RE_1;
var Parser = (
  /** @class */
  function() {
    function Parser2(message, options) {
      if (options === void 0) {
        options = {};
      }
      this.message = message;
      this.position = { offset: 0, line: 1, column: 1 };
      this.ignoreTag = !!options.ignoreTag;
      this.requiresOtherClause = !!options.requiresOtherClause;
      this.shouldParseSkeletons = !!options.shouldParseSkeletons;
    }
    Parser2.prototype.parse = function() {
      if (this.offset() !== 0) {
        throw Error("parser can only be used once");
      }
      return this.parseMessage(0, "", false);
    };
    Parser2.prototype.parseMessage = function(nestingLevel, parentArgType, expectingCloseTag) {
      var elements = [];
      while (!this.isEOF()) {
        var char = this.char();
        if (char === 123) {
          var result = this.parseArgument(nestingLevel, expectingCloseTag);
          if (result.err) {
            return result;
          }
          elements.push(result.val);
        } else if (char === 125 && nestingLevel > 0) {
          break;
        } else if (char === 35 && (parentArgType === "plural" || parentArgType === "selectordinal")) {
          var position = this.clonePosition();
          this.bump();
          elements.push({
            type: TYPE.pound,
            location: createLocation(position, this.clonePosition())
          });
        } else if (char === 60 && !this.ignoreTag && this.peek() === 47) {
          if (expectingCloseTag) {
            break;
          } else {
            return this.error(ErrorKind.UNMATCHED_CLOSING_TAG, createLocation(this.clonePosition(), this.clonePosition()));
          }
        } else if (char === 60 && !this.ignoreTag && _isAlpha(this.peek() || 0)) {
          var result = this.parseTag(nestingLevel, parentArgType);
          if (result.err) {
            return result;
          }
          elements.push(result.val);
        } else {
          var result = this.parseLiteral(nestingLevel, parentArgType);
          if (result.err) {
            return result;
          }
          elements.push(result.val);
        }
      }
      return { val: elements, err: null };
    };
    Parser2.prototype.parseTag = function(nestingLevel, parentArgType) {
      var startPosition = this.clonePosition();
      this.bump();
      var tagName = this.parseTagName();
      this.bumpSpace();
      if (this.bumpIf("/>")) {
        return {
          val: {
            type: TYPE.literal,
            value: "<" + tagName + "/>",
            location: createLocation(startPosition, this.clonePosition())
          },
          err: null
        };
      } else if (this.bumpIf(">")) {
        var childrenResult = this.parseMessage(nestingLevel + 1, parentArgType, true);
        if (childrenResult.err) {
          return childrenResult;
        }
        var children = childrenResult.val;
        var endTagStartPosition = this.clonePosition();
        if (this.bumpIf("</")) {
          if (this.isEOF() || !_isAlpha(this.char())) {
            return this.error(ErrorKind.INVALID_TAG, createLocation(endTagStartPosition, this.clonePosition()));
          }
          var closingTagNameStartPosition = this.clonePosition();
          var closingTagName = this.parseTagName();
          if (tagName !== closingTagName) {
            return this.error(ErrorKind.UNMATCHED_CLOSING_TAG, createLocation(closingTagNameStartPosition, this.clonePosition()));
          }
          this.bumpSpace();
          if (!this.bumpIf(">")) {
            return this.error(ErrorKind.INVALID_TAG, createLocation(endTagStartPosition, this.clonePosition()));
          }
          return {
            val: {
              type: TYPE.tag,
              value: tagName,
              children,
              location: createLocation(startPosition, this.clonePosition())
            },
            err: null
          };
        } else {
          return this.error(ErrorKind.UNCLOSED_TAG, createLocation(startPosition, this.clonePosition()));
        }
      } else {
        return this.error(ErrorKind.INVALID_TAG, createLocation(startPosition, this.clonePosition()));
      }
    };
    Parser2.prototype.parseTagName = function() {
      var startOffset = this.offset();
      this.bump();
      while (!this.isEOF() && _isPotentialElementNameChar(this.char())) {
        this.bump();
      }
      return this.message.slice(startOffset, this.offset());
    };
    Parser2.prototype.parseLiteral = function(nestingLevel, parentArgType) {
      var start = this.clonePosition();
      var value = "";
      while (true) {
        var parseQuoteResult = this.tryParseQuote(parentArgType);
        if (parseQuoteResult) {
          value += parseQuoteResult;
          continue;
        }
        var parseUnquotedResult = this.tryParseUnquoted(nestingLevel, parentArgType);
        if (parseUnquotedResult) {
          value += parseUnquotedResult;
          continue;
        }
        var parseLeftAngleResult = this.tryParseLeftAngleBracket();
        if (parseLeftAngleResult) {
          value += parseLeftAngleResult;
          continue;
        }
        break;
      }
      var location = createLocation(start, this.clonePosition());
      return {
        val: { type: TYPE.literal, value, location },
        err: null
      };
    };
    Parser2.prototype.tryParseLeftAngleBracket = function() {
      if (!this.isEOF() && this.char() === 60 && (this.ignoreTag || // If at the opening tag or closing tag position, bail.
      !_isAlphaOrSlash(this.peek() || 0))) {
        this.bump();
        return "<";
      }
      return null;
    };
    Parser2.prototype.tryParseQuote = function(parentArgType) {
      if (this.isEOF() || this.char() !== 39) {
        return null;
      }
      switch (this.peek()) {
        case 39:
          this.bump();
          this.bump();
          return "'";
        case 123:
        case 60:
        case 62:
        case 125:
          break;
        case 35:
          if (parentArgType === "plural" || parentArgType === "selectordinal") {
            break;
          }
          return null;
        default:
          return null;
      }
      this.bump();
      var codePoints = [this.char()];
      this.bump();
      while (!this.isEOF()) {
        var ch = this.char();
        if (ch === 39) {
          if (this.peek() === 39) {
            codePoints.push(39);
            this.bump();
          } else {
            this.bump();
            break;
          }
        } else {
          codePoints.push(ch);
        }
        this.bump();
      }
      return fromCodePoint.apply(void 0, codePoints);
    };
    Parser2.prototype.tryParseUnquoted = function(nestingLevel, parentArgType) {
      if (this.isEOF()) {
        return null;
      }
      var ch = this.char();
      if (ch === 60 || ch === 123 || ch === 35 && (parentArgType === "plural" || parentArgType === "selectordinal") || ch === 125 && nestingLevel > 0) {
        return null;
      } else {
        this.bump();
        return fromCodePoint(ch);
      }
    };
    Parser2.prototype.parseArgument = function(nestingLevel, expectingCloseTag) {
      var openingBracePosition = this.clonePosition();
      this.bump();
      this.bumpSpace();
      if (this.isEOF()) {
        return this.error(ErrorKind.EXPECT_ARGUMENT_CLOSING_BRACE, createLocation(openingBracePosition, this.clonePosition()));
      }
      if (this.char() === 125) {
        this.bump();
        return this.error(ErrorKind.EMPTY_ARGUMENT, createLocation(openingBracePosition, this.clonePosition()));
      }
      var value = this.parseIdentifierIfPossible().value;
      if (!value) {
        return this.error(ErrorKind.MALFORMED_ARGUMENT, createLocation(openingBracePosition, this.clonePosition()));
      }
      this.bumpSpace();
      if (this.isEOF()) {
        return this.error(ErrorKind.EXPECT_ARGUMENT_CLOSING_BRACE, createLocation(openingBracePosition, this.clonePosition()));
      }
      switch (this.char()) {
        case 125: {
          this.bump();
          return {
            val: {
              type: TYPE.argument,
              // value does not include the opening and closing braces.
              value,
              location: createLocation(openingBracePosition, this.clonePosition())
            },
            err: null
          };
        }
        case 44: {
          this.bump();
          this.bumpSpace();
          if (this.isEOF()) {
            return this.error(ErrorKind.EXPECT_ARGUMENT_CLOSING_BRACE, createLocation(openingBracePosition, this.clonePosition()));
          }
          return this.parseArgumentOptions(nestingLevel, expectingCloseTag, value, openingBracePosition);
        }
        default:
          return this.error(ErrorKind.MALFORMED_ARGUMENT, createLocation(openingBracePosition, this.clonePosition()));
      }
    };
    Parser2.prototype.parseIdentifierIfPossible = function() {
      var startingPosition = this.clonePosition();
      var startOffset = this.offset();
      var value = matchIdentifierAtIndex(this.message, startOffset);
      var endOffset = startOffset + value.length;
      this.bumpTo(endOffset);
      var endPosition = this.clonePosition();
      var location = createLocation(startingPosition, endPosition);
      return { value, location };
    };
    Parser2.prototype.parseArgumentOptions = function(nestingLevel, expectingCloseTag, value, openingBracePosition) {
      var _a2;
      var typeStartPosition = this.clonePosition();
      var argType = this.parseIdentifierIfPossible().value;
      var typeEndPosition = this.clonePosition();
      switch (argType) {
        case "":
          return this.error(ErrorKind.EXPECT_ARGUMENT_TYPE, createLocation(typeStartPosition, typeEndPosition));
        case "number":
        case "date":
        case "time": {
          this.bumpSpace();
          var styleAndLocation = null;
          if (this.bumpIf(",")) {
            this.bumpSpace();
            var styleStartPosition = this.clonePosition();
            var result = this.parseSimpleArgStyleIfPossible();
            if (result.err) {
              return result;
            }
            var style = trimEnd(result.val);
            if (style.length === 0) {
              return this.error(ErrorKind.EXPECT_ARGUMENT_STYLE, createLocation(this.clonePosition(), this.clonePosition()));
            }
            var styleLocation = createLocation(styleStartPosition, this.clonePosition());
            styleAndLocation = { style, styleLocation };
          }
          var argCloseResult = this.tryParseArgumentClose(openingBracePosition);
          if (argCloseResult.err) {
            return argCloseResult;
          }
          var location_1 = createLocation(openingBracePosition, this.clonePosition());
          if (styleAndLocation && startsWith(styleAndLocation === null || styleAndLocation === void 0 ? void 0 : styleAndLocation.style, "::", 0)) {
            var skeleton = trimStart(styleAndLocation.style.slice(2));
            if (argType === "number") {
              var result = this.parseNumberSkeletonFromString(skeleton, styleAndLocation.styleLocation);
              if (result.err) {
                return result;
              }
              return {
                val: { type: TYPE.number, value, location: location_1, style: result.val },
                err: null
              };
            } else {
              if (skeleton.length === 0) {
                return this.error(ErrorKind.EXPECT_DATE_TIME_SKELETON, location_1);
              }
              var style = {
                type: SKELETON_TYPE.dateTime,
                pattern: skeleton,
                location: styleAndLocation.styleLocation,
                parsedOptions: this.shouldParseSkeletons ? parseDateTimeSkeleton(skeleton) : {}
              };
              var type = argType === "date" ? TYPE.date : TYPE.time;
              return {
                val: { type, value, location: location_1, style },
                err: null
              };
            }
          }
          return {
            val: {
              type: argType === "number" ? TYPE.number : argType === "date" ? TYPE.date : TYPE.time,
              value,
              location: location_1,
              style: (_a2 = styleAndLocation === null || styleAndLocation === void 0 ? void 0 : styleAndLocation.style) !== null && _a2 !== void 0 ? _a2 : null
            },
            err: null
          };
        }
        case "plural":
        case "selectordinal":
        case "select": {
          var typeEndPosition_1 = this.clonePosition();
          this.bumpSpace();
          if (!this.bumpIf(",")) {
            return this.error(ErrorKind.EXPECT_SELECT_ARGUMENT_OPTIONS, createLocation(typeEndPosition_1, __assign({}, typeEndPosition_1)));
          }
          this.bumpSpace();
          var identifierAndLocation = this.parseIdentifierIfPossible();
          var pluralOffset = 0;
          if (argType !== "select" && identifierAndLocation.value === "offset") {
            if (!this.bumpIf(":")) {
              return this.error(ErrorKind.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE, createLocation(this.clonePosition(), this.clonePosition()));
            }
            this.bumpSpace();
            var result = this.tryParseDecimalInteger(ErrorKind.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE, ErrorKind.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE);
            if (result.err) {
              return result;
            }
            this.bumpSpace();
            identifierAndLocation = this.parseIdentifierIfPossible();
            pluralOffset = result.val;
          }
          var optionsResult = this.tryParsePluralOrSelectOptions(nestingLevel, argType, expectingCloseTag, identifierAndLocation);
          if (optionsResult.err) {
            return optionsResult;
          }
          var argCloseResult = this.tryParseArgumentClose(openingBracePosition);
          if (argCloseResult.err) {
            return argCloseResult;
          }
          var location_2 = createLocation(openingBracePosition, this.clonePosition());
          if (argType === "select") {
            return {
              val: {
                type: TYPE.select,
                value,
                options: fromEntries(optionsResult.val),
                location: location_2
              },
              err: null
            };
          } else {
            return {
              val: {
                type: TYPE.plural,
                value,
                options: fromEntries(optionsResult.val),
                offset: pluralOffset,
                pluralType: argType === "plural" ? "cardinal" : "ordinal",
                location: location_2
              },
              err: null
            };
          }
        }
        default:
          return this.error(ErrorKind.INVALID_ARGUMENT_TYPE, createLocation(typeStartPosition, typeEndPosition));
      }
    };
    Parser2.prototype.tryParseArgumentClose = function(openingBracePosition) {
      if (this.isEOF() || this.char() !== 125) {
        return this.error(ErrorKind.EXPECT_ARGUMENT_CLOSING_BRACE, createLocation(openingBracePosition, this.clonePosition()));
      }
      this.bump();
      return { val: true, err: null };
    };
    Parser2.prototype.parseSimpleArgStyleIfPossible = function() {
      var nestedBraces = 0;
      var startPosition = this.clonePosition();
      while (!this.isEOF()) {
        var ch = this.char();
        switch (ch) {
          case 39: {
            this.bump();
            var apostrophePosition = this.clonePosition();
            if (!this.bumpUntil("'")) {
              return this.error(ErrorKind.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE, createLocation(apostrophePosition, this.clonePosition()));
            }
            this.bump();
            break;
          }
          case 123: {
            nestedBraces += 1;
            this.bump();
            break;
          }
          case 125: {
            if (nestedBraces > 0) {
              nestedBraces -= 1;
            } else {
              return {
                val: this.message.slice(startPosition.offset, this.offset()),
                err: null
              };
            }
            break;
          }
          default:
            this.bump();
            break;
        }
      }
      return {
        val: this.message.slice(startPosition.offset, this.offset()),
        err: null
      };
    };
    Parser2.prototype.parseNumberSkeletonFromString = function(skeleton, location) {
      var tokens = [];
      try {
        tokens = parseNumberSkeletonFromString(skeleton);
      } catch (e7) {
        return this.error(ErrorKind.INVALID_NUMBER_SKELETON, location);
      }
      return {
        val: {
          type: SKELETON_TYPE.number,
          tokens,
          location,
          parsedOptions: this.shouldParseSkeletons ? parseNumberSkeleton(tokens) : {}
        },
        err: null
      };
    };
    Parser2.prototype.tryParsePluralOrSelectOptions = function(nestingLevel, parentArgType, expectCloseTag, parsedFirstIdentifier) {
      var _a2;
      var hasOtherClause = false;
      var options = [];
      var parsedSelectors = /* @__PURE__ */ new Set();
      var selector = parsedFirstIdentifier.value, selectorLocation = parsedFirstIdentifier.location;
      while (true) {
        if (selector.length === 0) {
          var startPosition = this.clonePosition();
          if (parentArgType !== "select" && this.bumpIf("=")) {
            var result = this.tryParseDecimalInteger(ErrorKind.EXPECT_PLURAL_ARGUMENT_SELECTOR, ErrorKind.INVALID_PLURAL_ARGUMENT_SELECTOR);
            if (result.err) {
              return result;
            }
            selectorLocation = createLocation(startPosition, this.clonePosition());
            selector = this.message.slice(startPosition.offset, this.offset());
          } else {
            break;
          }
        }
        if (parsedSelectors.has(selector)) {
          return this.error(parentArgType === "select" ? ErrorKind.DUPLICATE_SELECT_ARGUMENT_SELECTOR : ErrorKind.DUPLICATE_PLURAL_ARGUMENT_SELECTOR, selectorLocation);
        }
        if (selector === "other") {
          hasOtherClause = true;
        }
        this.bumpSpace();
        var openingBracePosition = this.clonePosition();
        if (!this.bumpIf("{")) {
          return this.error(parentArgType === "select" ? ErrorKind.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT : ErrorKind.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT, createLocation(this.clonePosition(), this.clonePosition()));
        }
        var fragmentResult = this.parseMessage(nestingLevel + 1, parentArgType, expectCloseTag);
        if (fragmentResult.err) {
          return fragmentResult;
        }
        var argCloseResult = this.tryParseArgumentClose(openingBracePosition);
        if (argCloseResult.err) {
          return argCloseResult;
        }
        options.push([
          selector,
          {
            value: fragmentResult.val,
            location: createLocation(openingBracePosition, this.clonePosition())
          }
        ]);
        parsedSelectors.add(selector);
        this.bumpSpace();
        _a2 = this.parseIdentifierIfPossible(), selector = _a2.value, selectorLocation = _a2.location;
      }
      if (options.length === 0) {
        return this.error(parentArgType === "select" ? ErrorKind.EXPECT_SELECT_ARGUMENT_SELECTOR : ErrorKind.EXPECT_PLURAL_ARGUMENT_SELECTOR, createLocation(this.clonePosition(), this.clonePosition()));
      }
      if (this.requiresOtherClause && !hasOtherClause) {
        return this.error(ErrorKind.MISSING_OTHER_CLAUSE, createLocation(this.clonePosition(), this.clonePosition()));
      }
      return { val: options, err: null };
    };
    Parser2.prototype.tryParseDecimalInteger = function(expectNumberError, invalidNumberError) {
      var sign = 1;
      var startingPosition = this.clonePosition();
      if (this.bumpIf("+")) {
      } else if (this.bumpIf("-")) {
        sign = -1;
      }
      var hasDigits = false;
      var decimal = 0;
      while (!this.isEOF()) {
        var ch = this.char();
        if (ch >= 48 && ch <= 57) {
          hasDigits = true;
          decimal = decimal * 10 + (ch - 48);
          this.bump();
        } else {
          break;
        }
      }
      var location = createLocation(startingPosition, this.clonePosition());
      if (!hasDigits) {
        return this.error(expectNumberError, location);
      }
      decimal *= sign;
      if (!isSafeInteger(decimal)) {
        return this.error(invalidNumberError, location);
      }
      return { val: decimal, err: null };
    };
    Parser2.prototype.offset = function() {
      return this.position.offset;
    };
    Parser2.prototype.isEOF = function() {
      return this.offset() === this.message.length;
    };
    Parser2.prototype.clonePosition = function() {
      return {
        offset: this.position.offset,
        line: this.position.line,
        column: this.position.column
      };
    };
    Parser2.prototype.char = function() {
      var offset = this.position.offset;
      if (offset >= this.message.length) {
        throw Error("out of bound");
      }
      var code = codePointAt(this.message, offset);
      if (code === void 0) {
        throw Error("Offset " + offset + " is at invalid UTF-16 code unit boundary");
      }
      return code;
    };
    Parser2.prototype.error = function(kind, location) {
      return {
        val: null,
        err: {
          kind,
          message: this.message,
          location
        }
      };
    };
    Parser2.prototype.bump = function() {
      if (this.isEOF()) {
        return;
      }
      var code = this.char();
      if (code === 10) {
        this.position.line += 1;
        this.position.column = 1;
        this.position.offset += 1;
      } else {
        this.position.column += 1;
        this.position.offset += code < 65536 ? 1 : 2;
      }
    };
    Parser2.prototype.bumpIf = function(prefix) {
      if (startsWith(this.message, prefix, this.offset())) {
        for (var i5 = 0; i5 < prefix.length; i5++) {
          this.bump();
        }
        return true;
      }
      return false;
    };
    Parser2.prototype.bumpUntil = function(pattern) {
      var currentOffset = this.offset();
      var index = this.message.indexOf(pattern, currentOffset);
      if (index >= 0) {
        this.bumpTo(index);
        return true;
      } else {
        this.bumpTo(this.message.length);
        return false;
      }
    };
    Parser2.prototype.bumpTo = function(targetOffset) {
      if (this.offset() > targetOffset) {
        throw Error("targetOffset " + targetOffset + " must be greater than or equal to the current offset " + this.offset());
      }
      targetOffset = Math.min(targetOffset, this.message.length);
      while (true) {
        var offset = this.offset();
        if (offset === targetOffset) {
          break;
        }
        if (offset > targetOffset) {
          throw Error("targetOffset " + targetOffset + " is at invalid UTF-16 code unit boundary");
        }
        this.bump();
        if (this.isEOF()) {
          break;
        }
      }
    };
    Parser2.prototype.bumpSpace = function() {
      while (!this.isEOF() && _isWhiteSpace(this.char())) {
        this.bump();
      }
    };
    Parser2.prototype.peek = function() {
      if (this.isEOF()) {
        return null;
      }
      var code = this.char();
      var offset = this.offset();
      var nextCode = this.message.charCodeAt(offset + (code >= 65536 ? 2 : 1));
      return nextCode !== null && nextCode !== void 0 ? nextCode : null;
    };
    return Parser2;
  }()
);
function _isAlpha(codepoint) {
  return codepoint >= 97 && codepoint <= 122 || codepoint >= 65 && codepoint <= 90;
}
function _isAlphaOrSlash(codepoint) {
  return _isAlpha(codepoint) || codepoint === 47;
}
function _isPotentialElementNameChar(c5) {
  return c5 === 45 || c5 === 46 || c5 >= 48 && c5 <= 57 || c5 === 95 || c5 >= 97 && c5 <= 122 || c5 >= 65 && c5 <= 90 || c5 == 183 || c5 >= 192 && c5 <= 214 || c5 >= 216 && c5 <= 246 || c5 >= 248 && c5 <= 893 || c5 >= 895 && c5 <= 8191 || c5 >= 8204 && c5 <= 8205 || c5 >= 8255 && c5 <= 8256 || c5 >= 8304 && c5 <= 8591 || c5 >= 11264 && c5 <= 12271 || c5 >= 12289 && c5 <= 55295 || c5 >= 63744 && c5 <= 64975 || c5 >= 65008 && c5 <= 65533 || c5 >= 65536 && c5 <= 983039;
}
function _isWhiteSpace(c5) {
  return c5 >= 9 && c5 <= 13 || c5 === 32 || c5 === 133 || c5 >= 8206 && c5 <= 8207 || c5 === 8232 || c5 === 8233;
}
function _isPatternSyntax(c5) {
  return c5 >= 33 && c5 <= 35 || c5 === 36 || c5 >= 37 && c5 <= 39 || c5 === 40 || c5 === 41 || c5 === 42 || c5 === 43 || c5 === 44 || c5 === 45 || c5 >= 46 && c5 <= 47 || c5 >= 58 && c5 <= 59 || c5 >= 60 && c5 <= 62 || c5 >= 63 && c5 <= 64 || c5 === 91 || c5 === 92 || c5 === 93 || c5 === 94 || c5 === 96 || c5 === 123 || c5 === 124 || c5 === 125 || c5 === 126 || c5 === 161 || c5 >= 162 && c5 <= 165 || c5 === 166 || c5 === 167 || c5 === 169 || c5 === 171 || c5 === 172 || c5 === 174 || c5 === 176 || c5 === 177 || c5 === 182 || c5 === 187 || c5 === 191 || c5 === 215 || c5 === 247 || c5 >= 8208 && c5 <= 8213 || c5 >= 8214 && c5 <= 8215 || c5 === 8216 || c5 === 8217 || c5 === 8218 || c5 >= 8219 && c5 <= 8220 || c5 === 8221 || c5 === 8222 || c5 === 8223 || c5 >= 8224 && c5 <= 8231 || c5 >= 8240 && c5 <= 8248 || c5 === 8249 || c5 === 8250 || c5 >= 8251 && c5 <= 8254 || c5 >= 8257 && c5 <= 8259 || c5 === 8260 || c5 === 8261 || c5 === 8262 || c5 >= 8263 && c5 <= 8273 || c5 === 8274 || c5 === 8275 || c5 >= 8277 && c5 <= 8286 || c5 >= 8592 && c5 <= 8596 || c5 >= 8597 && c5 <= 8601 || c5 >= 8602 && c5 <= 8603 || c5 >= 8604 && c5 <= 8607 || c5 === 8608 || c5 >= 8609 && c5 <= 8610 || c5 === 8611 || c5 >= 8612 && c5 <= 8613 || c5 === 8614 || c5 >= 8615 && c5 <= 8621 || c5 === 8622 || c5 >= 8623 && c5 <= 8653 || c5 >= 8654 && c5 <= 8655 || c5 >= 8656 && c5 <= 8657 || c5 === 8658 || c5 === 8659 || c5 === 8660 || c5 >= 8661 && c5 <= 8691 || c5 >= 8692 && c5 <= 8959 || c5 >= 8960 && c5 <= 8967 || c5 === 8968 || c5 === 8969 || c5 === 8970 || c5 === 8971 || c5 >= 8972 && c5 <= 8991 || c5 >= 8992 && c5 <= 8993 || c5 >= 8994 && c5 <= 9e3 || c5 === 9001 || c5 === 9002 || c5 >= 9003 && c5 <= 9083 || c5 === 9084 || c5 >= 9085 && c5 <= 9114 || c5 >= 9115 && c5 <= 9139 || c5 >= 9140 && c5 <= 9179 || c5 >= 9180 && c5 <= 9185 || c5 >= 9186 && c5 <= 9254 || c5 >= 9255 && c5 <= 9279 || c5 >= 9280 && c5 <= 9290 || c5 >= 9291 && c5 <= 9311 || c5 >= 9472 && c5 <= 9654 || c5 === 9655 || c5 >= 9656 && c5 <= 9664 || c5 === 9665 || c5 >= 9666 && c5 <= 9719 || c5 >= 9720 && c5 <= 9727 || c5 >= 9728 && c5 <= 9838 || c5 === 9839 || c5 >= 9840 && c5 <= 10087 || c5 === 10088 || c5 === 10089 || c5 === 10090 || c5 === 10091 || c5 === 10092 || c5 === 10093 || c5 === 10094 || c5 === 10095 || c5 === 10096 || c5 === 10097 || c5 === 10098 || c5 === 10099 || c5 === 10100 || c5 === 10101 || c5 >= 10132 && c5 <= 10175 || c5 >= 10176 && c5 <= 10180 || c5 === 10181 || c5 === 10182 || c5 >= 10183 && c5 <= 10213 || c5 === 10214 || c5 === 10215 || c5 === 10216 || c5 === 10217 || c5 === 10218 || c5 === 10219 || c5 === 10220 || c5 === 10221 || c5 === 10222 || c5 === 10223 || c5 >= 10224 && c5 <= 10239 || c5 >= 10240 && c5 <= 10495 || c5 >= 10496 && c5 <= 10626 || c5 === 10627 || c5 === 10628 || c5 === 10629 || c5 === 10630 || c5 === 10631 || c5 === 10632 || c5 === 10633 || c5 === 10634 || c5 === 10635 || c5 === 10636 || c5 === 10637 || c5 === 10638 || c5 === 10639 || c5 === 10640 || c5 === 10641 || c5 === 10642 || c5 === 10643 || c5 === 10644 || c5 === 10645 || c5 === 10646 || c5 === 10647 || c5 === 10648 || c5 >= 10649 && c5 <= 10711 || c5 === 10712 || c5 === 10713 || c5 === 10714 || c5 === 10715 || c5 >= 10716 && c5 <= 10747 || c5 === 10748 || c5 === 10749 || c5 >= 10750 && c5 <= 11007 || c5 >= 11008 && c5 <= 11055 || c5 >= 11056 && c5 <= 11076 || c5 >= 11077 && c5 <= 11078 || c5 >= 11079 && c5 <= 11084 || c5 >= 11085 && c5 <= 11123 || c5 >= 11124 && c5 <= 11125 || c5 >= 11126 && c5 <= 11157 || c5 === 11158 || c5 >= 11159 && c5 <= 11263 || c5 >= 11776 && c5 <= 11777 || c5 === 11778 || c5 === 11779 || c5 === 11780 || c5 === 11781 || c5 >= 11782 && c5 <= 11784 || c5 === 11785 || c5 === 11786 || c5 === 11787 || c5 === 11788 || c5 === 11789 || c5 >= 11790 && c5 <= 11798 || c5 === 11799 || c5 >= 11800 && c5 <= 11801 || c5 === 11802 || c5 === 11803 || c5 === 11804 || c5 === 11805 || c5 >= 11806 && c5 <= 11807 || c5 === 11808 || c5 === 11809 || c5 === 11810 || c5 === 11811 || c5 === 11812 || c5 === 11813 || c5 === 11814 || c5 === 11815 || c5 === 11816 || c5 === 11817 || c5 >= 11818 && c5 <= 11822 || c5 === 11823 || c5 >= 11824 && c5 <= 11833 || c5 >= 11834 && c5 <= 11835 || c5 >= 11836 && c5 <= 11839 || c5 === 11840 || c5 === 11841 || c5 === 11842 || c5 >= 11843 && c5 <= 11855 || c5 >= 11856 && c5 <= 11857 || c5 === 11858 || c5 >= 11859 && c5 <= 11903 || c5 >= 12289 && c5 <= 12291 || c5 === 12296 || c5 === 12297 || c5 === 12298 || c5 === 12299 || c5 === 12300 || c5 === 12301 || c5 === 12302 || c5 === 12303 || c5 === 12304 || c5 === 12305 || c5 >= 12306 && c5 <= 12307 || c5 === 12308 || c5 === 12309 || c5 === 12310 || c5 === 12311 || c5 === 12312 || c5 === 12313 || c5 === 12314 || c5 === 12315 || c5 === 12316 || c5 === 12317 || c5 >= 12318 && c5 <= 12319 || c5 === 12320 || c5 === 12336 || c5 === 64830 || c5 === 64831 || c5 >= 65093 && c5 <= 65094;
}

// node_modules/@formatjs/icu-messageformat-parser/lib/index.js
function pruneLocation(els) {
  els.forEach(function(el) {
    delete el.location;
    if (isSelectElement(el) || isPluralElement(el)) {
      for (var k3 in el.options) {
        delete el.options[k3].location;
        pruneLocation(el.options[k3].value);
      }
    } else if (isNumberElement(el) && isNumberSkeleton(el.style)) {
      delete el.style.location;
    } else if ((isDateElement(el) || isTimeElement(el)) && isDateTimeSkeleton(el.style)) {
      delete el.style.location;
    } else if (isTagElement(el)) {
      pruneLocation(el.children);
    }
  });
}
function parse(message, opts) {
  if (opts === void 0) {
    opts = {};
  }
  opts = __assign({ shouldParseSkeletons: true, requiresOtherClause: true }, opts);
  var result = new Parser(message, opts).parse();
  if (result.err) {
    var error = SyntaxError(ErrorKind[result.err.kind]);
    error.location = result.err.location;
    error.originalMessage = result.err.message;
    throw error;
  }
  if (!(opts === null || opts === void 0 ? void 0 : opts.captureLocation)) {
    pruneLocation(result.val);
  }
  return result.val;
}

// node_modules/@formatjs/fast-memoize/lib/index.js
function memoize(fn, options) {
  var cache2 = options && options.cache ? options.cache : cacheDefault;
  var serializer = options && options.serializer ? options.serializer : serializerDefault;
  var strategy = options && options.strategy ? options.strategy : strategyDefault;
  return strategy(fn, {
    cache: cache2,
    serializer
  });
}
function isPrimitive(value) {
  return value == null || typeof value === "number" || typeof value === "boolean";
}
function monadic(fn, cache2, serializer, arg) {
  var cacheKey = isPrimitive(arg) ? arg : serializer(arg);
  var computedValue = cache2.get(cacheKey);
  if (typeof computedValue === "undefined") {
    computedValue = fn.call(this, arg);
    cache2.set(cacheKey, computedValue);
  }
  return computedValue;
}
function variadic(fn, cache2, serializer) {
  var args = Array.prototype.slice.call(arguments, 3);
  var cacheKey = serializer(args);
  var computedValue = cache2.get(cacheKey);
  if (typeof computedValue === "undefined") {
    computedValue = fn.apply(this, args);
    cache2.set(cacheKey, computedValue);
  }
  return computedValue;
}
function assemble(fn, context, strategy, cache2, serialize) {
  return strategy.bind(context, fn, cache2, serialize);
}
function strategyDefault(fn, options) {
  var strategy = fn.length === 1 ? monadic : variadic;
  return assemble(fn, this, strategy, options.cache.create(), options.serializer);
}
function strategyVariadic(fn, options) {
  return assemble(fn, this, variadic, options.cache.create(), options.serializer);
}
function strategyMonadic(fn, options) {
  return assemble(fn, this, monadic, options.cache.create(), options.serializer);
}
var serializerDefault = function() {
  return JSON.stringify(arguments);
};
function ObjectWithoutPrototypeCache() {
  this.cache = /* @__PURE__ */ Object.create(null);
}
ObjectWithoutPrototypeCache.prototype.get = function(key) {
  return this.cache[key];
};
ObjectWithoutPrototypeCache.prototype.set = function(key, value) {
  this.cache[key] = value;
};
var cacheDefault = {
  create: function create() {
    return new ObjectWithoutPrototypeCache();
  }
};
var strategies = {
  variadic: strategyVariadic,
  monadic: strategyMonadic
};

// node_modules/intl-messageformat/lib/src/error.js
var ErrorCode;
(function(ErrorCode2) {
  ErrorCode2["MISSING_VALUE"] = "MISSING_VALUE";
  ErrorCode2["INVALID_VALUE"] = "INVALID_VALUE";
  ErrorCode2["MISSING_INTL_API"] = "MISSING_INTL_API";
})(ErrorCode || (ErrorCode = {}));
var FormatError = (
  /** @class */
  function(_super) {
    __extends(FormatError2, _super);
    function FormatError2(msg, code, originalMessage) {
      var _this = _super.call(this, msg) || this;
      _this.code = code;
      _this.originalMessage = originalMessage;
      return _this;
    }
    FormatError2.prototype.toString = function() {
      return "[formatjs Error: " + this.code + "] " + this.message;
    };
    return FormatError2;
  }(Error)
);
var InvalidValueError = (
  /** @class */
  function(_super) {
    __extends(InvalidValueError2, _super);
    function InvalidValueError2(variableId, value, options, originalMessage) {
      return _super.call(this, 'Invalid values for "' + variableId + '": "' + value + '". Options are "' + Object.keys(options).join('", "') + '"', ErrorCode.INVALID_VALUE, originalMessage) || this;
    }
    return InvalidValueError2;
  }(FormatError)
);
var InvalidValueTypeError = (
  /** @class */
  function(_super) {
    __extends(InvalidValueTypeError2, _super);
    function InvalidValueTypeError2(value, type, originalMessage) {
      return _super.call(this, 'Value for "' + value + '" must be of type ' + type, ErrorCode.INVALID_VALUE, originalMessage) || this;
    }
    return InvalidValueTypeError2;
  }(FormatError)
);
var MissingValueError = (
  /** @class */
  function(_super) {
    __extends(MissingValueError2, _super);
    function MissingValueError2(variableId, originalMessage) {
      return _super.call(this, 'The intl string context variable "' + variableId + '" was not provided to the string "' + originalMessage + '"', ErrorCode.MISSING_VALUE, originalMessage) || this;
    }
    return MissingValueError2;
  }(FormatError)
);

// node_modules/intl-messageformat/lib/src/formatters.js
var PART_TYPE;
(function(PART_TYPE2) {
  PART_TYPE2[PART_TYPE2["literal"] = 0] = "literal";
  PART_TYPE2[PART_TYPE2["object"] = 1] = "object";
})(PART_TYPE || (PART_TYPE = {}));
function mergeLiteral(parts) {
  if (parts.length < 2) {
    return parts;
  }
  return parts.reduce(function(all, part) {
    var lastPart = all[all.length - 1];
    if (!lastPart || lastPart.type !== PART_TYPE.literal || part.type !== PART_TYPE.literal) {
      all.push(part);
    } else {
      lastPart.value += part.value;
    }
    return all;
  }, []);
}
function isFormatXMLElementFn(el) {
  return typeof el === "function";
}
function formatToParts(els, locales, formatters, formats, values, currentPluralValue, originalMessage) {
  if (els.length === 1 && isLiteralElement(els[0])) {
    return [
      {
        type: PART_TYPE.literal,
        value: els[0].value
      }
    ];
  }
  var result = [];
  for (var _i = 0, els_1 = els; _i < els_1.length; _i++) {
    var el = els_1[_i];
    if (isLiteralElement(el)) {
      result.push({
        type: PART_TYPE.literal,
        value: el.value
      });
      continue;
    }
    if (isPoundElement(el)) {
      if (typeof currentPluralValue === "number") {
        result.push({
          type: PART_TYPE.literal,
          value: formatters.getNumberFormat(locales).format(currentPluralValue)
        });
      }
      continue;
    }
    var varName = el.value;
    if (!(values && varName in values)) {
      throw new MissingValueError(varName, originalMessage);
    }
    var value = values[varName];
    if (isArgumentElement(el)) {
      if (!value || typeof value === "string" || typeof value === "number") {
        value = typeof value === "string" || typeof value === "number" ? String(value) : "";
      }
      result.push({
        type: typeof value === "string" ? PART_TYPE.literal : PART_TYPE.object,
        value
      });
      continue;
    }
    if (isDateElement(el)) {
      var style = typeof el.style === "string" ? formats.date[el.style] : isDateTimeSkeleton(el.style) ? el.style.parsedOptions : void 0;
      result.push({
        type: PART_TYPE.literal,
        value: formatters.getDateTimeFormat(locales, style).format(value)
      });
      continue;
    }
    if (isTimeElement(el)) {
      var style = typeof el.style === "string" ? formats.time[el.style] : isDateTimeSkeleton(el.style) ? el.style.parsedOptions : void 0;
      result.push({
        type: PART_TYPE.literal,
        value: formatters.getDateTimeFormat(locales, style).format(value)
      });
      continue;
    }
    if (isNumberElement(el)) {
      var style = typeof el.style === "string" ? formats.number[el.style] : isNumberSkeleton(el.style) ? el.style.parsedOptions : void 0;
      if (style && style.scale) {
        value = value * (style.scale || 1);
      }
      result.push({
        type: PART_TYPE.literal,
        value: formatters.getNumberFormat(locales, style).format(value)
      });
      continue;
    }
    if (isTagElement(el)) {
      var children = el.children, value_1 = el.value;
      var formatFn = values[value_1];
      if (!isFormatXMLElementFn(formatFn)) {
        throw new InvalidValueTypeError(value_1, "function", originalMessage);
      }
      var parts = formatToParts(children, locales, formatters, formats, values, currentPluralValue);
      var chunks = formatFn(parts.map(function(p3) {
        return p3.value;
      }));
      if (!Array.isArray(chunks)) {
        chunks = [chunks];
      }
      result.push.apply(result, chunks.map(function(c5) {
        return {
          type: typeof c5 === "string" ? PART_TYPE.literal : PART_TYPE.object,
          value: c5
        };
      }));
    }
    if (isSelectElement(el)) {
      var opt = el.options[value] || el.options.other;
      if (!opt) {
        throw new InvalidValueError(el.value, value, Object.keys(el.options), originalMessage);
      }
      result.push.apply(result, formatToParts(opt.value, locales, formatters, formats, values));
      continue;
    }
    if (isPluralElement(el)) {
      var opt = el.options["=" + value];
      if (!opt) {
        if (!Intl.PluralRules) {
          throw new FormatError('Intl.PluralRules is not available in this environment.\nTry polyfilling it using "@formatjs/intl-pluralrules"\n', ErrorCode.MISSING_INTL_API, originalMessage);
        }
        var rule = formatters.getPluralRules(locales, { type: el.pluralType }).select(value - (el.offset || 0));
        opt = el.options[rule] || el.options.other;
      }
      if (!opt) {
        throw new InvalidValueError(el.value, value, Object.keys(el.options), originalMessage);
      }
      result.push.apply(result, formatToParts(opt.value, locales, formatters, formats, values, value - (el.offset || 0)));
      continue;
    }
  }
  return mergeLiteral(result);
}

// node_modules/intl-messageformat/lib/src/core.js
function mergeConfig(c1, c22) {
  if (!c22) {
    return c1;
  }
  return __assign(__assign(__assign({}, c1 || {}), c22 || {}), Object.keys(c1).reduce(function(all, k3) {
    all[k3] = __assign(__assign({}, c1[k3]), c22[k3] || {});
    return all;
  }, {}));
}
function mergeConfigs(defaultConfig, configs) {
  if (!configs) {
    return defaultConfig;
  }
  return Object.keys(defaultConfig).reduce(function(all, k3) {
    all[k3] = mergeConfig(defaultConfig[k3], configs[k3]);
    return all;
  }, __assign({}, defaultConfig));
}
function createFastMemoizeCache(store) {
  return {
    create: function() {
      return {
        get: function(key) {
          return store[key];
        },
        set: function(key, value) {
          store[key] = value;
        }
      };
    }
  };
}
function createDefaultFormatters(cache2) {
  if (cache2 === void 0) {
    cache2 = {
      number: {},
      dateTime: {},
      pluralRules: {}
    };
  }
  return {
    getNumberFormat: memoize(function() {
      var _a2;
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      return new ((_a2 = Intl.NumberFormat).bind.apply(_a2, __spreadArray([void 0], args)))();
    }, {
      cache: createFastMemoizeCache(cache2.number),
      strategy: strategies.variadic
    }),
    getDateTimeFormat: memoize(function() {
      var _a2;
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      return new ((_a2 = Intl.DateTimeFormat).bind.apply(_a2, __spreadArray([void 0], args)))();
    }, {
      cache: createFastMemoizeCache(cache2.dateTime),
      strategy: strategies.variadic
    }),
    getPluralRules: memoize(function() {
      var _a2;
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      return new ((_a2 = Intl.PluralRules).bind.apply(_a2, __spreadArray([void 0], args)))();
    }, {
      cache: createFastMemoizeCache(cache2.pluralRules),
      strategy: strategies.variadic
    })
  };
}
var IntlMessageFormat = (
  /** @class */
  function() {
    function IntlMessageFormat2(message, locales, overrideFormats, opts) {
      var _this = this;
      if (locales === void 0) {
        locales = IntlMessageFormat2.defaultLocale;
      }
      this.formatterCache = {
        number: {},
        dateTime: {},
        pluralRules: {}
      };
      this.format = function(values) {
        var parts = _this.formatToParts(values);
        if (parts.length === 1) {
          return parts[0].value;
        }
        var result = parts.reduce(function(all, part) {
          if (!all.length || part.type !== PART_TYPE.literal || typeof all[all.length - 1] !== "string") {
            all.push(part.value);
          } else {
            all[all.length - 1] += part.value;
          }
          return all;
        }, []);
        if (result.length <= 1) {
          return result[0] || "";
        }
        return result;
      };
      this.formatToParts = function(values) {
        return formatToParts(_this.ast, _this.locales, _this.formatters, _this.formats, values, void 0, _this.message);
      };
      this.resolvedOptions = function() {
        return {
          locale: Intl.NumberFormat.supportedLocalesOf(_this.locales)[0]
        };
      };
      this.getAst = function() {
        return _this.ast;
      };
      if (typeof message === "string") {
        this.message = message;
        if (!IntlMessageFormat2.__parse) {
          throw new TypeError("IntlMessageFormat.__parse must be set to process `message` of type `string`");
        }
        this.ast = IntlMessageFormat2.__parse(message, {
          ignoreTag: opts === null || opts === void 0 ? void 0 : opts.ignoreTag
        });
      } else {
        this.ast = message;
      }
      if (!Array.isArray(this.ast)) {
        throw new TypeError("A message must be provided as a String or AST.");
      }
      this.formats = mergeConfigs(IntlMessageFormat2.formats, overrideFormats);
      this.locales = locales;
      this.formatters = opts && opts.formatters || createDefaultFormatters(this.formatterCache);
    }
    Object.defineProperty(IntlMessageFormat2, "defaultLocale", {
      get: function() {
        if (!IntlMessageFormat2.memoizedDefaultLocale) {
          IntlMessageFormat2.memoizedDefaultLocale = new Intl.NumberFormat().resolvedOptions().locale;
        }
        return IntlMessageFormat2.memoizedDefaultLocale;
      },
      enumerable: false,
      configurable: true
    });
    IntlMessageFormat2.memoizedDefaultLocale = null;
    IntlMessageFormat2.__parse = parse;
    IntlMessageFormat2.formats = {
      number: {
        integer: {
          maximumFractionDigits: 0
        },
        currency: {
          style: "currency"
        },
        percent: {
          style: "percent"
        }
      },
      date: {
        short: {
          month: "numeric",
          day: "numeric",
          year: "2-digit"
        },
        medium: {
          month: "short",
          day: "numeric",
          year: "numeric"
        },
        long: {
          month: "long",
          day: "numeric",
          year: "numeric"
        },
        full: {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric"
        }
      },
      time: {
        short: {
          hour: "numeric",
          minute: "numeric"
        },
        medium: {
          hour: "numeric",
          minute: "numeric",
          second: "numeric"
        },
        long: {
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          timeZoneName: "short"
        },
        full: {
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          timeZoneName: "short"
        }
      }
    };
    return IntlMessageFormat2;
  }()
);

// node_modules/intl-messageformat/lib/index.js
var lib_default = IntlMessageFormat;

// src/price/numberFormat.js
var maskRegex = /[0-9\-+#]/;
var notMaskRegex = /[^\d\-+#]/g;
function getIndex(mask) {
  return mask.search(maskRegex);
}
function processMask(mask = "#.##") {
  const maskObj = {};
  const len = mask.length;
  const start = getIndex(mask);
  maskObj.prefix = start > 0 ? mask.substring(0, start) : "";
  const end = getIndex(mask.split("").reverse().join(""));
  const offset = len - end;
  const substr = mask.substring(offset, offset + 1);
  const indx = offset + (substr === "." || substr === "," ? 1 : 0);
  maskObj.suffix = end > 0 ? mask.substring(indx, len) : "";
  maskObj.mask = mask.substring(start, indx);
  maskObj.maskHasNegativeSign = maskObj.mask.charAt(0) === "-";
  maskObj.maskHasPositiveSign = maskObj.mask.charAt(0) === "+";
  let result = maskObj.mask.match(notMaskRegex);
  maskObj.decimal = result && result[result.length - 1] || ".";
  maskObj.separator = result && result[1] && result[0] || ",";
  result = maskObj.mask.split(maskObj.decimal);
  maskObj.integer = result[0];
  maskObj.fraction = result[1];
  return maskObj;
}
function processValue(value, maskObj, options) {
  let isNegative = false;
  const valObj = {
    value
  };
  if (value < 0) {
    isNegative = true;
    valObj.value = -valObj.value;
  }
  valObj.sign = isNegative ? "-" : "";
  valObj.value = Number(valObj.value).toFixed(
    maskObj.fraction && maskObj.fraction.length
  );
  valObj.value = Number(valObj.value).toString();
  const posTrailZero = maskObj.fraction && maskObj.fraction.lastIndexOf("0");
  let [valInteger = "0", valFraction = ""] = valObj.value.split(".");
  if (!valFraction || valFraction && valFraction.length <= posTrailZero) {
    valFraction = posTrailZero < 0 ? "" : Number("0." + valFraction).toFixed(posTrailZero + 1).replace("0.", "");
  }
  valObj.integer = valInteger;
  valObj.fraction = valFraction;
  addSeparators(valObj, maskObj);
  if (valObj.result === "0" || valObj.result === "") {
    isNegative = false;
    valObj.sign = "";
  }
  if (!isNegative && maskObj.maskHasPositiveSign) {
    valObj.sign = "+";
  } else if (isNegative && maskObj.maskHasPositiveSign) {
    valObj.sign = "-";
  } else if (isNegative) {
    valObj.sign = options && options.enforceMaskSign && !maskObj.maskHasNegativeSign ? "" : "-";
  }
  return valObj;
}
function addSeparators(valObj, maskObj) {
  valObj.result = "";
  const szSep = maskObj.integer.split(maskObj.separator);
  const maskInteger = szSep.join("");
  const posLeadZero = maskInteger && maskInteger.indexOf("0");
  if (posLeadZero > -1) {
    while (valObj.integer.length < maskInteger.length - posLeadZero) {
      valObj.integer = "0" + valObj.integer;
    }
  } else if (Number(valObj.integer) === 0) {
    valObj.integer = "";
  }
  const posSeparator = szSep[1] && szSep[szSep.length - 1].length;
  if (posSeparator) {
    const len = valObj.integer.length;
    const offset = len % posSeparator;
    for (let indx = 0; indx < len; indx++) {
      valObj.result += valObj.integer.charAt(indx);
      if (!((indx - offset + 1) % posSeparator) && indx < len - posSeparator) {
        valObj.result += maskObj.separator;
      }
    }
  } else {
    valObj.result = valObj.integer;
  }
  valObj.result += maskObj.fraction && valObj.fraction ? maskObj.decimal + valObj.fraction : "";
  return valObj;
}
function formatNumber(mask, value, options = {}) {
  if (!mask || isNaN(Number(value))) {
    return value;
  }
  const maskObj = processMask(mask);
  const valObj = processValue(value, maskObj, options);
  return maskObj.prefix + valObj.sign + valObj.result + maskObj.suffix;
}
var numberFormat_default = formatNumber;

// src/price/utilities.js
var DECIMAL_POINT = ".";
var DECIMAL_COMMA = ",";
var SPACE_START_PATTERN = /^\s+/;
var SPACE_END_PATTERN = /\s+$/;
var NBSP = "&nbsp;";
var getAnnualPrice = (price2) => price2 * 12;
var isPromotionActive = (promotion, instant) => {
  const {
    start,
    end,
    displaySummary: {
      amount,
      duration,
      minProductQuantity,
      outcomeType
    } = {}
  } = promotion;
  if (!(amount && duration && outcomeType && minProductQuantity)) {
    return false;
  }
  const now = instant ? new Date(instant) : /* @__PURE__ */ new Date();
  if (!start || !end) {
    return false;
  }
  const startDate = new Date(start);
  const endDate = new Date(end);
  return now >= startDate && now <= endDate;
};
var RecurrenceTerm = {
  MONTH: "MONTH",
  YEAR: "YEAR"
};
var opticalPriceDivisors = {
  [Term.ANNUAL]: 12,
  [Term.MONTHLY]: 1,
  [Term.THREE_YEARS]: 36,
  [Term.TWO_YEARS]: 24
};
var opticalPriceRoundingRule = (accept, round) => ({ accept, round });
var opticalPriceRoundingRules = [
  opticalPriceRoundingRule(
    // optical price for the term is a multiple of the initial price
    ({ divisor, price: price2 }) => price2 % divisor == 0,
    ({ divisor, price: price2 }) => price2 / divisor
  ),
  opticalPriceRoundingRule(
    // round optical price up to 2 decimals
    ({ usePrecision }) => usePrecision,
    ({ divisor, price: price2 }) => Math.round(price2 / divisor * 100) / 100
  ),
  opticalPriceRoundingRule(
    // round optical price up to integer
    () => true,
    ({ divisor, price: price2 }) => Math.ceil(Math.floor(price2 * 100 / divisor) / 100)
  )
];
var recurrenceTerms = {
  [Commitment.YEAR]: {
    [Term.MONTHLY]: RecurrenceTerm.MONTH,
    [Term.ANNUAL]: RecurrenceTerm.YEAR
  },
  [Commitment.MONTH]: {
    [Term.MONTHLY]: RecurrenceTerm.MONTH
  }
};
var currencyIsFirstChar = (formatString, currencySymbol) => formatString.indexOf(`'${currencySymbol}'`) === 0;
var extractNumberMask = (formatString, usePrecision = true) => {
  let numberMask = formatString.replace(/'.*?'/, "").trim();
  const decimalsDelimiter = findDecimalsDelimiter(numberMask);
  const hasDecimalDelimiter = !!decimalsDelimiter;
  if (!hasDecimalDelimiter) {
    numberMask = numberMask.replace(
      /\s?(#.*0)(?!\s)?/,
      "$&" + getPossibleDecimalsDelimiter(formatString)
    );
  } else if (!usePrecision) {
    numberMask = numberMask.replace(/[,\.]0+/, decimalsDelimiter);
  }
  return numberMask;
};
var getCurrencySymbolDetails = (formatString) => {
  const currencySymbol = findCurrencySymbol(formatString);
  const isCurrencyFirst = currencyIsFirstChar(formatString, currencySymbol);
  const formatStringWithoutSymbol = formatString.replace(/'.*?'/, "");
  const hasCurrencySpace = SPACE_START_PATTERN.test(formatStringWithoutSymbol) || SPACE_END_PATTERN.test(formatStringWithoutSymbol);
  return { currencySymbol, isCurrencyFirst, hasCurrencySpace };
};
var makeSpacesAroundNonBreaking = (text) => {
  return text.replace(SPACE_START_PATTERN, NBSP).replace(SPACE_END_PATTERN, NBSP);
};
var getPossibleDecimalsDelimiter = (formatString) => formatString.match(/#(.?)#/)?.[1] === DECIMAL_POINT ? DECIMAL_COMMA : DECIMAL_POINT;
var findCurrencySymbol = (formatString) => formatString.match(/'(.*?)'/)?.[1] ?? "";
var findDecimalsDelimiter = (formatString) => formatString.match(/0(.?)0/)?.[1] ?? "";
function formatPrice({ formatString, price: price2, usePrecision, isIndianPrice = false }, recurrenceTerm, transformPrice = (formattedPrice) => formattedPrice) {
  const { currencySymbol, isCurrencyFirst, hasCurrencySpace } = getCurrencySymbolDetails(formatString);
  const decimalsDelimiter = usePrecision ? findDecimalsDelimiter(formatString) : "";
  const numberMask = extractNumberMask(formatString, usePrecision);
  const fractionDigits = usePrecision ? 2 : 0;
  const transformedPrice = transformPrice(price2, { currencySymbol });
  const formattedPrice = isIndianPrice ? transformedPrice.toLocaleString("hi-IN", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits
  }) : numberFormat_default(numberMask, transformedPrice);
  const decimalIndex = usePrecision ? formattedPrice.lastIndexOf(decimalsDelimiter) : formattedPrice.length;
  const integer = formattedPrice.substring(0, decimalIndex);
  const decimals = formattedPrice.substring(decimalIndex + 1);
  const accessiblePrice = formatString.replace(/'.*?'/, "SYMBOL").replace(/#.*0/, formattedPrice).replace(/SYMBOL/, currencySymbol);
  return {
    accessiblePrice,
    currencySymbol,
    decimals,
    decimalsDelimiter,
    hasCurrencySpace,
    integer,
    isCurrencyFirst,
    recurrenceTerm
  };
}
var formatOpticalPrice = (data) => {
  const { commitment, term, usePrecision } = data;
  const divisor = opticalPriceDivisors[term] ?? 1;
  return formatPrice(
    data,
    divisor > 1 ? RecurrenceTerm.MONTH : recurrenceTerms[commitment]?.[term],
    (price2) => {
      const priceData = {
        divisor,
        price: price2,
        usePrecision
      };
      const { round } = opticalPriceRoundingRules.find(
        ({ accept }) => accept(priceData)
      );
      if (!round)
        throw new Error(
          `Missing rounding rule for: ${JSON.stringify(priceData)}`
        );
      return round(priceData);
    }
  );
};
var formatRegularPrice = ({ commitment, term, ...data }) => formatPrice(data, recurrenceTerms[commitment]?.[term]);
var formatAnnualPrice = (data) => {
  const {
    commitment,
    instant,
    price: price2,
    originalPrice,
    priceWithoutDiscount,
    promotion,
    quantity = 1,
    term
  } = data;
  if (commitment === Commitment.YEAR && term === Term.MONTHLY) {
    if (!promotion) {
      return formatPrice(data, RecurrenceTerm.YEAR, getAnnualPrice);
    }
    const {
      displaySummary: {
        outcomeType,
        duration,
        minProductQuantity = 1
      } = {}
    } = promotion;
    switch (outcomeType) {
      case "PERCENTAGE_DISCOUNT": {
        if (quantity >= minProductQuantity && isPromotionActive(promotion, instant)) {
          const durationInMonths = parseInt(
            duration.replace("P", "").replace("M", "")
          );
          if (isNaN(durationInMonths))
            return getAnnualPrice(price2);
          const discountPrice = quantity * originalPrice * durationInMonths;
          const regularPrice = quantity * priceWithoutDiscount * (12 - durationInMonths);
          const totalPrice = Math.floor((discountPrice + regularPrice) * 100) / 100;
          return formatPrice(
            { ...data, price: totalPrice },
            RecurrenceTerm.YEAR
          );
        }
      }
      default:
        return formatPrice(
          data,
          RecurrenceTerm.YEAR,
          () => getAnnualPrice(priceWithoutDiscount ?? price2)
        );
    }
  }
  return formatPrice(data, recurrenceTerms[commitment]?.[term]);
};

// src/price/template.js
var defaultLiterals = {
  recurrenceLabel: "{recurrenceTerm, select, MONTH {/mo} YEAR {/yr} other {}}",
  recurrenceAriaLabel: "{recurrenceTerm, select, MONTH {per month} YEAR {per year} other {}}",
  perUnitLabel: "{perUnit, select, LICENSE {per license} other {}}",
  perUnitAriaLabel: "{perUnit, select, LICENSE {per license} other {}}",
  freeLabel: "Free",
  freeAriaLabel: "Free",
  taxExclusiveLabel: "{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",
  taxInclusiveLabel: "{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",
  alternativePriceAriaLabel: "Alternatively at",
  strikethroughAriaLabel: "Regularly at"
};
var log = createLog("ConsonantTemplates/price");
var htmlPattern = /<\/?[^>]+(>|$)/g;
var cssClassNames = {
  container: "price",
  containerOptical: "price-optical",
  containerStrikethrough: "price-strikethrough",
  containerAlternative: "price-alternative",
  containerAnnual: "price-annual",
  containerAnnualPrefix: "price-annual-prefix",
  containerAnnualSuffix: "price-annual-suffix",
  disabled: "disabled",
  currencySpace: "price-currency-space",
  currencySymbol: "price-currency-symbol",
  decimals: "price-decimals",
  decimalsDelimiter: "price-decimals-delimiter",
  integer: "price-integer",
  recurrence: "price-recurrence",
  taxInclusivity: "price-tax-inclusivity",
  unitType: "price-unit-type"
};
var literalKeys = {
  perUnitLabel: "perUnitLabel",
  perUnitAriaLabel: "perUnitAriaLabel",
  recurrenceLabel: "recurrenceLabel",
  recurrenceAriaLabel: "recurrenceAriaLabel",
  taxExclusiveLabel: "taxExclusiveLabel",
  taxInclusiveLabel: "taxInclusiveLabel",
  strikethroughAriaLabel: "strikethroughAriaLabel",
  alternativePriceAriaLabel: "alternativePriceAriaLabel"
};
var WCS_TAX_DISPLAY_EXCLUSIVE = "TAX_EXCLUSIVE";
var renderAttributes = (attributes) => isObject(attributes) ? Object.entries(attributes).filter(
  ([, value]) => isString(value) || isNumber(value) || value === true
).reduce(
  (html, [key, value]) => html + ` ${key}${value === true ? "" : '="' + escapeHtml(value) + '"'}`,
  ""
) : "";
var renderSpan = (cssClass, content, attributes, convertSpaces = false) => {
  return `<span class="${cssClass}${content ? "" : " " + cssClassNames.disabled}"${renderAttributes(attributes)}>${convertSpaces ? makeSpacesAroundNonBreaking(content) : content ?? ""}</span>`;
};
function renderContainer(cssClass, {
  accessibleLabel,
  altAccessibleLabel,
  currencySymbol,
  decimals,
  decimalsDelimiter,
  hasCurrencySpace,
  integer,
  isCurrencyFirst,
  recurrenceLabel,
  perUnitLabel,
  taxInclusivityLabel
}, attributes = {}) {
  const currencyMarkup = renderSpan(
    cssClassNames.currencySymbol,
    currencySymbol
  );
  const currencySpaceMarkup = renderSpan(
    cssClassNames.currencySpace,
    hasCurrencySpace ? "&nbsp;" : ""
  );
  let markup = "";
  if (accessibleLabel)
    markup = `<sr-only class="strikethrough-aria-label">${accessibleLabel}</sr-only>`;
  else if (altAccessibleLabel)
    markup = `<sr-only class="alt-aria-label">${altAccessibleLabel}</sr-only>`;
  if (isCurrencyFirst)
    markup += currencyMarkup + currencySpaceMarkup;
  markup += renderSpan(cssClassNames.integer, integer);
  markup += renderSpan(cssClassNames.decimalsDelimiter, decimalsDelimiter);
  markup += renderSpan(cssClassNames.decimals, decimals);
  if (!isCurrencyFirst)
    markup += currencySpaceMarkup + currencyMarkup;
  markup += renderSpan(cssClassNames.recurrence, recurrenceLabel, null, true);
  markup += renderSpan(cssClassNames.unitType, perUnitLabel, null, true);
  markup += renderSpan(
    cssClassNames.taxInclusivity,
    taxInclusivityLabel,
    true
  );
  return renderSpan(cssClass, markup, {
    ...attributes
  });
}
var createPriceTemplate = ({
  isAlternativePrice = false,
  displayOptical = false,
  displayStrikethrough = false,
  displayAnnual = false,
  instant = void 0
} = {}) => ({
  country,
  displayFormatted = true,
  displayRecurrence = true,
  displayPerUnit = false,
  displayTax = false,
  language,
  literals: priceLiterals2 = {},
  quantity = 1
} = {}, {
  commitment,
  offerSelectorIds,
  formatString,
  price: price2,
  priceWithoutDiscount,
  taxDisplay,
  taxTerm,
  term,
  usePrecision,
  promotion
} = {}, attributes = {}) => {
  Object.entries({
    country,
    formatString,
    language,
    price: price2
  }).forEach(([key, value]) => {
    if (value == null) {
      throw new Error(
        `Argument "${key}" is missing for osi ${offerSelectorIds?.toString()}, country ${country}, language ${language}`
      );
    }
  });
  const literals = {
    ...defaultLiterals,
    ...priceLiterals2
  };
  const locale = `${language.toLowerCase()}-${country.toUpperCase()}`;
  function formatLiteral(key, parameters) {
    const literal = literals[key];
    if (literal == void 0) {
      return "";
    }
    try {
      return new lib_default(
        literal.replace(htmlPattern, ""),
        locale
      ).format(parameters);
    } catch {
      log.error("Failed to format literal:", literal);
      return "";
    }
  }
  const displayPrice = displayStrikethrough && priceWithoutDiscount ? priceWithoutDiscount : price2;
  let method = displayOptical ? formatOpticalPrice : formatRegularPrice;
  if (displayAnnual) {
    method = formatAnnualPrice;
  }
  const { accessiblePrice, recurrenceTerm, ...formattedPrice } = method({
    commitment,
    formatString,
    instant,
    isIndianPrice: country === "IN",
    originalPrice: price2,
    priceWithoutDiscount,
    price: displayOptical ? price2 : displayPrice,
    promotion,
    quantity,
    term,
    usePrecision
  });
  let accessibleLabel = "", altAccessibleLabel = "";
  let recurrenceLabel = "";
  if (toBoolean(displayRecurrence) && recurrenceTerm) {
    recurrenceLabel = formatLiteral(literalKeys.recurrenceLabel, {
      recurrenceTerm
    });
  }
  let perUnitLabel = "";
  if (toBoolean(displayPerUnit)) {
    perUnitLabel = formatLiteral(literalKeys.perUnitLabel, {
      perUnit: "LICENSE"
    });
  }
  let taxInclusivityLabel = "";
  if (toBoolean(displayTax) && taxTerm) {
    taxInclusivityLabel = formatLiteral(
      taxDisplay === WCS_TAX_DISPLAY_EXCLUSIVE ? literalKeys.taxExclusiveLabel : literalKeys.taxInclusiveLabel,
      { taxTerm }
    );
  }
  if (displayStrikethrough) {
    accessibleLabel = formatLiteral(
      literalKeys.strikethroughAriaLabel,
      {
        strikethroughPrice: accessibleLabel
      }
    );
  }
  if (isAlternativePrice) {
    altAccessibleLabel = formatLiteral(
      literalKeys.alternativePriceAriaLabel,
      {
        alternativePrice: altAccessibleLabel
      }
    );
  }
  let cssClass = cssClassNames.container;
  if (displayOptical) {
    cssClass += " " + cssClassNames.containerOptical;
  }
  if (displayStrikethrough) {
    cssClass += " " + cssClassNames.containerStrikethrough;
  }
  if (isAlternativePrice) {
    cssClass += " " + cssClassNames.containerAlternative;
  }
  if (displayAnnual) {
    cssClass += " " + cssClassNames.containerAnnual;
  }
  if (toBoolean(displayFormatted)) {
    return renderContainer(
      cssClass,
      {
        ...formattedPrice,
        accessibleLabel,
        altAccessibleLabel,
        recurrenceLabel,
        perUnitLabel,
        taxInclusivityLabel
      },
      attributes
    );
  }
  const {
    currencySymbol,
    decimals,
    decimalsDelimiter,
    hasCurrencySpace,
    integer,
    isCurrencyFirst
  } = formattedPrice;
  const unformattedPrice = [integer, decimalsDelimiter, decimals];
  if (isCurrencyFirst) {
    unformattedPrice.unshift(hasCurrencySpace ? "\xA0" : "");
    unformattedPrice.unshift(currencySymbol);
  } else {
    unformattedPrice.push(hasCurrencySpace ? "\xA0" : "");
    unformattedPrice.push(currencySymbol);
  }
  unformattedPrice.push(
    recurrenceLabel,
    perUnitLabel,
    taxInclusivityLabel
  );
  const content = unformattedPrice.join("");
  return renderSpan(cssClass, content, attributes);
};
var createPromoPriceTemplate = () => (context, value, attributes) => {
  const displayOldPrice = context.displayOldPrice === void 0 || toBoolean(context.displayOldPrice);
  const shouldDisplayOldPrice = displayOldPrice && value.priceWithoutDiscount && value.priceWithoutDiscount != value.price;
  return `${createPriceTemplate({ isAlternativePrice: shouldDisplayOldPrice })(context, value, attributes)}${shouldDisplayOldPrice ? "&nbsp;" + createPriceTemplate({
    displayStrikethrough: true
  })(context, value, attributes) : ""}`;
};
var createPromoPriceWithAnnualTemplate = () => (context, value, attributes) => {
  let { instant } = context;
  try {
    if (!instant) {
      instant = new URLSearchParams(document.location.search).get(
        "instant"
      );
    }
    if (instant) {
      instant = new Date(instant);
    }
  } catch (e7) {
    instant = void 0;
  }
  const ctxStAnnual = {
    ...context,
    displayTax: false,
    displayPerUnit: false
  };
  const displayOldPrice = context.displayOldPrice === void 0 || toBoolean(context.displayOldPrice);
  const shouldDisplayOldPrice = displayOldPrice && value.priceWithoutDiscount && value.priceWithoutDiscount != value.price;
  return `${shouldDisplayOldPrice ? createPriceTemplate({
    displayStrikethrough: true
  })(ctxStAnnual, value, attributes) + "&nbsp;" : ""}${createPriceTemplate({ isAlternativePrice: shouldDisplayOldPrice })(context, value, attributes)}${renderSpan(cssClassNames.containerAnnualPrefix, "&nbsp;(")}${createPriceTemplate(
    {
      displayAnnual: true,
      instant
    }
  )(
    ctxStAnnual,
    value,
    attributes
  )}${renderSpan(cssClassNames.containerAnnualSuffix, ")")}`;
};
var createPriceWithAnnualTemplate = () => (context, value, attributes) => {
  const ctxAnnual = {
    ...context,
    displayTax: false,
    displayPerUnit: false
  };
  return `${createPriceTemplate({ isAlternativePrice: context.displayOldPrice })(context, value, attributes)}${renderSpan(cssClassNames.containerAnnualPrefix, "&nbsp;(")}${createPriceTemplate(
    {
      displayAnnual: true
    }
  )(
    ctxAnnual,
    value,
    attributes
  )}${renderSpan(cssClassNames.containerAnnualSuffix, ")")}`;
};

// src/price/index.js
var price = createPriceTemplate();
var pricePromo = createPromoPriceTemplate();
var priceOptical = createPriceTemplate({
  displayOptical: true
});
var priceStrikethrough = createPriceTemplate({
  displayStrikethrough: true
});
var priceAnnual = createPriceTemplate({
  displayAnnual: true
});
var priceOpticalAlternative = createPriceTemplate({
  displayOptical: true,
  isAlternativePrice: true
});
var priceAlternative = createPriceTemplate({
  isAlternativePrice: true
});
var priceWithAnnual = createPriceWithAnnualTemplate();
var pricePromoWithAnnual = createPromoPriceWithAnnualTemplate();

// src/discount/template.js
var getDiscount = (price2, priceWithoutDiscount) => {
  if (!isPositiveFiniteNumber(price2) || !isPositiveFiniteNumber(priceWithoutDiscount))
    return;
  return Math.floor(
    (priceWithoutDiscount - price2) / priceWithoutDiscount * 100
  );
};
var createDiscountTemplate = () => (context, value) => {
  const { price: price2, priceWithoutDiscount } = value;
  const discount2 = getDiscount(price2, priceWithoutDiscount);
  return discount2 === void 0 ? `<span class="no-discount"></span>` : `<span class="discount">${discount2}%</span>`;
};

// src/discount/index.js
var discount = createDiscountTemplate();

// src/inline-price.js
var DISPLAY_ALL_TAX_COUNTRIES = [
  "GB_en",
  "AU_en",
  "FR_fr",
  "AT_de",
  "BE_en",
  "BE_fr",
  "BE_nl",
  "BG_bg",
  "CH_de",
  "CH_fr",
  "CH_it",
  "CZ_cs",
  "DE_de",
  "DK_da",
  "EE_et",
  "EG_ar",
  "EG_en",
  "ES_es",
  "FI_fi",
  "FR_fr",
  "GR_el",
  "GR_en",
  "HU_hu",
  "IE_en",
  "IT_it",
  "LU_de",
  "LU_en",
  "LU_fr",
  "NL_nl",
  "NO_nb",
  "PL_pl",
  "PT_pt",
  "RO_ro",
  "SE_sv",
  "SI_sl",
  "SK_sk",
  "TR_tr",
  "UA_uk",
  "ID_en",
  "ID_in",
  "IN_en",
  "IN_hi",
  "JP_ja",
  "MY_en",
  "MY_ms",
  "NZ_en",
  "TH_en",
  "TH_th"
];
var DISPLAY_TAX_MAP = {
  // individual
  INDIVIDUAL_COM: [
    "ZA_en",
    "LT_lt",
    "LV_lv",
    "NG_en",
    "SA_ar",
    "SA_en",
    "ZA_en",
    "SG_en",
    "KR_ko"
  ],
  // business
  TEAM_COM: ["ZA_en", "LT_lt", "LV_lv", "NG_en", "ZA_en", "CO_es", "KR_ko"],
  // student
  INDIVIDUAL_EDU: ["LT_lt", "LV_lv", "SA_en", "SG_en"],
  // school and uni
  TEAM_EDU: ["SG_en", "KR_ko"]
};
var _InlinePrice = class _InlinePrice extends HTMLSpanElement {
  constructor() {
    super();
    __publicField(this, "masElement", new MasElement(this));
    this.handleClick = this.handleClick.bind(this);
  }
  static get observedAttributes() {
    return [
      "data-display-old-price",
      "data-display-per-unit",
      "data-display-recurrence",
      "data-display-tax",
      "data-perpetual",
      "data-promotion-code",
      "data-tax-exclusive",
      "data-template",
      "data-wcs-osi"
    ];
  }
  static createInlinePrice(options) {
    const service = getService();
    if (!service)
      return null;
    const {
      displayOldPrice,
      displayPerUnit,
      displayRecurrence,
      displayTax,
      forceTaxExclusive,
      perpetual,
      promotionCode,
      quantity,
      alternativePrice,
      template,
      wcsOsi
    } = service.collectPriceOptions(options);
    const element = createMasElement(_InlinePrice, {
      displayOldPrice,
      displayPerUnit,
      displayRecurrence,
      displayTax,
      forceTaxExclusive,
      perpetual,
      promotionCode,
      quantity,
      alternativePrice,
      template,
      wcsOsi
    });
    return element;
  }
  get isInlinePrice() {
    return true;
  }
  attributeChangedCallback(name, _3, value) {
    this.masElement.attributeChangedCallback(name, _3, value);
  }
  connectedCallback() {
    this.masElement.connectedCallback();
    this.addEventListener("click", this.handleClick);
  }
  disconnectedCallback() {
    this.masElement.disconnectedCallback();
    this.removeEventListener("click", this.handleClick);
  }
  handleClick(event) {
    if (event.target === this)
      return;
    event.stopImmediatePropagation();
    this.dispatchEvent(
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window
      })
    );
  }
  onceSettled() {
    return this.masElement.onceSettled();
  }
  get value() {
    return this.masElement.value;
  }
  get options() {
    return this.masElement.options;
  }
  requestUpdate(force = false) {
    return this.masElement.requestUpdate(force);
  }
  /**
   * Resolves default value of displayTax property, based on provided geo info and segments.
   * @returns {boolean}
   */
  /* c8 ignore next 26 */
  resolveDisplayTaxForGeoAndSegment(country, language, customerSegment, marketSegment) {
    const locale = `${country}_${language}`;
    if (DISPLAY_ALL_TAX_COUNTRIES.includes(country) || DISPLAY_ALL_TAX_COUNTRIES.includes(locale)) {
      return true;
    }
    const segmentConfig = DISPLAY_TAX_MAP[`${customerSegment}_${marketSegment}`];
    if (!segmentConfig) {
      return false;
    }
    if (segmentConfig.includes(country) || segmentConfig.includes(locale)) {
      return true;
    }
    return false;
  }
  /**
   * Resolves default value of displayTax property, based on provided geo info and segments extracted from offers object.
   * @returns {boolean}
   */
  /* c8 ignore next 15 */
  async resolveDisplayTax(service, options) {
    const [offerSelectors] = await service.resolveOfferSelectors(options);
    const offers = selectOffers(await offerSelectors, options);
    if (offers?.length) {
      const { country, language } = options;
      const offer = offers[0];
      const [marketSegment = ""] = offer.marketSegments;
      return this.resolveDisplayTaxForGeoAndSegment(
        country,
        language,
        offer.customerSegment,
        marketSegment
      );
    }
  }
  /**
   * Resolves associated osi via Wcs and renders price offer.
   * @param {Record<string, any>} overrides
   */
  async render(overrides = {}) {
    if (!this.isConnected)
      return false;
    const service = getService();
    if (!service)
      return false;
    const options = service.collectPriceOptions(overrides, this);
    if (!options.wcsOsi.length)
      return false;
    const version = this.masElement.togglePending(options);
    this.innerHTML = "";
    const [promise] = service.resolveOfferSelectors(options);
    return this.renderOffers(
      selectOffers(await promise, options),
      options,
      version
    );
  }
  // TODO: can be extended to accept array of offers and compute subtotal price
  /**
   * Renders price offer as HTML of this component
   * using consonant price template functions
   * @param {Offer[]} offers
   * @param {Record<string, any>} overrides
   * Optional object with properties to use as overrides
   * over those collected from dataset of this component.
   */
  renderOffers(offers, overrides = {}, version = void 0) {
    if (!this.isConnected)
      return;
    const service = getService();
    if (!service)
      return false;
    const options = service.collectPriceOptions(
      {
        ...this.dataset,
        ...overrides
      },
      this
    );
    version ?? (version = this.masElement.togglePending(options));
    if (offers.length) {
      if (this.masElement.toggleResolved(version, offers, options)) {
        this.innerHTML = service.buildPriceHTML(offers, options);
        const parentEl = this.closest("p, h3, div");
        if (!parentEl || !parentEl.querySelector('span[data-template="strikethrough"]') || parentEl.querySelector(".alt-aria-label"))
          return true;
        const inlinePrices = parentEl?.querySelectorAll('span[is="inline-price"]');
        if (inlinePrices.length > 1 && inlinePrices.length === parentEl.querySelectorAll('span[data-template="strikethrough"]').length * 2) {
          inlinePrices.forEach((price2) => {
            if (price2.dataset.template !== "strikethrough" && price2.options && !price2.options.alternativePrice) {
              price2.options.alternativePrice = true;
              price2.innerHTML = service.buildPriceHTML(offers, price2.options);
            }
          });
        }
        return true;
      }
    } else {
      const error = new Error(`Not provided: ${options?.wcsOsi ?? "-"}`);
      if (this.masElement.toggleFailed(version, error, options)) {
        this.innerHTML = "";
        return true;
      }
    }
    return false;
  }
  updateOptions(options) {
    const service = getService();
    if (!service)
      return false;
    const {
      alternativePrice,
      displayOldPrice,
      displayPerUnit,
      displayRecurrence,
      displayTax,
      forceTaxExclusive,
      perpetual,
      promotionCode,
      quantity,
      template,
      wcsOsi
    } = service.collectPriceOptions(options);
    updateMasElement(this, {
      alternativePrice,
      displayOldPrice,
      displayPerUnit,
      displayRecurrence,
      displayTax,
      forceTaxExclusive,
      perpetual,
      promotionCode,
      quantity,
      template,
      wcsOsi
    });
    return true;
  }
};
__publicField(_InlinePrice, "is", "inline-price");
__publicField(_InlinePrice, "tag", "span");
var InlinePrice = _InlinePrice;
if (!window.customElements.get(InlinePrice.is)) {
  window.customElements.define(InlinePrice.is, InlinePrice, {
    extends: InlinePrice.tag
  });
}

// src/price.js
function Price({ literals, providers, settings }) {
  function collectPriceOptions(overrides, placeholder) {
    const {
      country: defaultCountry,
      displayOldPrice: defaultDisplayOldPrice,
      displayPerUnit: defaultDisplayPerUnit,
      displayRecurrence: defaultDisplayRecurrence,
      displayTax: defaultDisplayTax,
      forceTaxExclusive: defaultForceTaxExclusive,
      language: defaultLanguage,
      promotionCode: defaultPromotionCode,
      quantity: defaultQuantity,
      alternativePrice: defaultAlternativePrice
    } = settings;
    const {
      displayOldPrice = defaultDisplayOldPrice,
      displayPerUnit = defaultDisplayPerUnit,
      displayRecurrence = defaultDisplayRecurrence,
      displayTax = defaultDisplayTax,
      forceTaxExclusive = defaultForceTaxExclusive,
      country = defaultCountry,
      language = defaultLanguage,
      perpetual,
      promotionCode = defaultPromotionCode,
      quantity = defaultQuantity,
      alternativePrice = defaultAlternativePrice,
      template,
      wcsOsi,
      ...rest
    } = Object.assign({}, placeholder?.dataset ?? {}, overrides ?? {});
    const options = omitProperties({
      ...rest,
      country,
      displayOldPrice: toBoolean(displayOldPrice),
      displayPerUnit: toBoolean(displayPerUnit),
      displayRecurrence: toBoolean(displayRecurrence),
      displayTax: toBoolean(displayTax),
      forceTaxExclusive: toBoolean(forceTaxExclusive),
      language,
      perpetual: toBoolean(perpetual),
      promotionCode: computePromoStatus(promotionCode).effectivePromoCode,
      quantity: toQuantity(quantity, Defaults.quantity),
      alternativePrice: toBoolean(alternativePrice),
      template,
      wcsOsi: toOfferSelectorIds(wcsOsi)
    });
    if (placeholder) {
      for (const provider of providers.price) {
        provider(placeholder, options);
      }
    }
    return options;
  }
  function buildPriceHTML(offers, options) {
    if (!Array.isArray(offers) || !offers.length || !options) {
      return "";
    }
    const { template } = options;
    let method;
    switch (template) {
      case "discount":
        method = discount;
        break;
      case "strikethrough":
        method = priceStrikethrough;
        break;
      case "annual":
        method = priceAnnual;
        break;
      default:
        if (options.template === "optical" && options.alternativePrice) {
          method = priceOpticalAlternative;
        } else if (options.template === "optical") {
          method = priceOptical;
        } else if (options.country === "AU" && offers[0].planType === "ABM") {
          method = options.promotionCode ? pricePromoWithAnnual : priceWithAnnual;
        } else if (options.alternativePrice) {
          method = priceAlternative;
        } else {
          method = options.promotionCode ? pricePromo : price;
        }
    }
    const context = collectPriceOptions(options);
    context.literals = Object.assign(
      {},
      literals.price,
      omitProperties(options.literals ?? {})
    );
    let [offer] = offers;
    offer = { ...offer, ...offer.priceDetails };
    return method(context, offer);
  }
  const createInlinePrice = InlinePrice.createInlinePrice;
  return {
    InlinePrice,
    buildPriceHTML,
    collectPriceOptions,
    createInlinePrice
  };
}

// src/settings.js
function getLocaleSettings({
  locale = void 0,
  country = void 0,
  language = void 0
} = {}) {
  language ?? (language = locale?.split("_")?.[0] || Defaults.language);
  country ?? (country = locale?.split("_")?.[1] || Defaults.country);
  locale ?? (locale = `${language}_${country}`);
  return { locale, country, language };
}
function getSettings(config2 = {}) {
  const { commerce = {} } = config2;
  let env = Env.PRODUCTION;
  let wcsURL = WCS_PROD_URL;
  const checkoutClientId = getParameter("checkoutClientId", commerce) ?? Defaults.checkoutClientId;
  const checkoutWorkflow = toEnumeration(
    getParameter("checkoutWorkflow", commerce),
    CheckoutWorkflow,
    Defaults.checkoutWorkflow
  );
  let checkoutWorkflowStep = CheckoutWorkflowStep.CHECKOUT;
  if (checkoutWorkflow === CheckoutWorkflow.V3) {
    checkoutWorkflowStep = toEnumeration(
      getParameter("checkoutWorkflowStep", commerce),
      CheckoutWorkflowStep,
      Defaults.checkoutWorkflowStep
    );
  }
  const displayOldPrice = toBoolean(
    getParameter("displayOldPrice", commerce),
    Defaults.displayOldPrice
  );
  const displayPerUnit = toBoolean(
    getParameter("displayPerUnit", commerce),
    Defaults.displayPerUnit
  );
  const displayRecurrence = toBoolean(
    getParameter("displayRecurrence", commerce),
    Defaults.displayRecurrence
  );
  const displayTax = toBoolean(
    getParameter("displayTax", commerce),
    Defaults.displayTax
  );
  const entitlement = toBoolean(
    getParameter("entitlement", commerce),
    Defaults.entitlement
  );
  const modal = toBoolean(getParameter("modal", commerce), Defaults.modal);
  const forceTaxExclusive = toBoolean(
    getParameter("forceTaxExclusive", commerce),
    Defaults.forceTaxExclusive
  );
  const promotionCode = getParameter("promotionCode", commerce) ?? Defaults.promotionCode;
  const quantity = toQuantity(getParameter("quantity", commerce));
  const wcsApiKey = getParameter("wcsApiKey", commerce) ?? Defaults.wcsApiKey;
  let isStage = commerce?.env === "stage";
  let landscape = Landscape.PUBLISHED;
  const allowOverride = ["true", ""].includes(commerce.allowOverride);
  if (allowOverride) {
    isStage = (getParameter(PARAM_ENV, commerce, {
      metadata: false
    })?.toLowerCase() ?? commerce?.env) === "stage";
    landscape = toEnumeration(
      getParameter(PARAM_LANDSCAPE, commerce),
      Landscape,
      landscape
    );
  }
  if (isStage) {
    env = Env.STAGE;
    wcsURL = WCS_STAGE_URL;
  }
  const masIOUrl = getParameter("mas-io-url") ?? config2.masIOUrl ?? `https://www${env === Env.STAGE ? ".stage" : ""}.adobe.com/mas/io`;
  return {
    ...getLocaleSettings(config2),
    displayOldPrice,
    checkoutClientId,
    checkoutWorkflow,
    checkoutWorkflowStep,
    displayPerUnit,
    displayRecurrence,
    displayTax,
    entitlement,
    extraOptions: Defaults.extraOptions,
    modal,
    env,
    forceTaxExclusive,
    promotionCode,
    quantity,
    alternativePrice: Defaults.alternativePrice,
    wcsApiKey,
    wcsURL,
    landscape,
    masIOUrl
  };
}

// src/utils/mas-fetch.js
async function masFetch(resource, options = {}, retries = 2, baseDelay = 100) {
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(resource, options);
      return response;
    } catch (error) {
      lastError = error;
      if (attempt > retries)
        break;
      await new Promise(
        (resolve) => setTimeout(resolve, baseDelay * (attempt + 1))
      );
    }
  }
  throw lastError;
}

// src/wcs.js
var NAMESPACE2 = "wcs";
function Wcs({ settings }) {
  const log2 = Log.module(NAMESPACE2);
  const { env, wcsApiKey: apiKey } = settings;
  const cache2 = /* @__PURE__ */ new Map();
  const queue = /* @__PURE__ */ new Map();
  let timer;
  let staleCache = /* @__PURE__ */ new Map();
  async function resolveWcsOffers(options, promises, reject = true) {
    const service = getService();
    let message = ERROR_MESSAGE_OFFER_NOT_FOUND;
    log2.debug("Fetching:", options);
    let url = "";
    let response;
    if (options.offerSelectorIds.length > 1)
      throw new Error("Multiple OSIs are not supported anymore");
    const unresolvedPromises = new Map(promises);
    const [osi] = options.offerSelectorIds;
    const uniqueId = Date.now() + Math.random().toString(36).substring(2, 7);
    const startMark = `${NAMESPACE2}:${osi}:${uniqueId}${MARK_START_SUFFIX}`;
    const measureName = `${NAMESPACE2}:${osi}:${uniqueId}${MARK_DURATION_SUFFIX}`;
    let startTime;
    let duration;
    try {
      performance.mark(startMark);
      url = new URL(settings.wcsURL);
      url.searchParams.set("offer_selector_ids", osi);
      url.searchParams.set("country", options.country);
      url.searchParams.set("locale", options.locale);
      url.searchParams.set(
        "landscape",
        env === Env.STAGE ? "ALL" : settings.landscape
      );
      url.searchParams.set("api_key", apiKey);
      if (options.language) {
        url.searchParams.set("language", options.language);
      }
      if (options.promotionCode) {
        url.searchParams.set("promotion_code", options.promotionCode);
      }
      if (options.currency) {
        url.searchParams.set("currency", options.currency);
      }
      response = await masFetch(url.toString(), {
        credentials: "omit"
      });
      if (response.ok) {
        let offers = [];
        try {
          const data = await response.json();
          log2.debug("Fetched:", options, data);
          offers = data.resolvedOffers ?? [];
        } catch (e7) {
          log2.error(`Error parsing JSON: ${e7.message}`, {
            ...e7.context,
            ...service?.duration
          });
        }
        offers = offers.map(applyPlanType);
        promises.forEach(({ resolve }, offerSelectorId) => {
          const resolved = offers.filter(
            ({ offerSelectorIds }) => offerSelectorIds.includes(offerSelectorId)
          ).flat();
          if (resolved.length) {
            unresolvedPromises.delete(offerSelectorId);
            promises.delete(offerSelectorId);
            resolve(resolved);
          }
        });
      } else {
        message = ERROR_MESSAGE_BAD_REQUEST;
      }
    } catch (e7) {
      message = `Network error: ${e7.message}`;
    } finally {
      ({ startTime, duration } = performance.measure(
        measureName,
        startMark
      ));
      performance.clearMarks(startMark);
      performance.clearMeasures(measureName);
    }
    if (reject && promises.size) {
      log2.debug("Missing:", { offerSelectorIds: [...promises.keys()] });
      promises.forEach((promise) => {
        promise.reject(
          new MasError(message, {
            ...options,
            response,
            startTime,
            duration,
            ...service?.duration
          })
        );
      });
    }
  }
  function flushQueue() {
    clearTimeout(timer);
    const pending = [...queue.values()];
    queue.clear();
    pending.forEach(
      ({ options, promises }) => resolveWcsOffers(options, promises)
    );
  }
  function flushWcsCacheInternal() {
    const size = cache2.size;
    staleCache = new Map(cache2);
    cache2.clear();
    log2.debug(`Moved ${size} cache entries to stale cache`);
  }
  function resolveOfferSelectors({
    country,
    language,
    perpetual = false,
    promotionCode = "",
    wcsOsi = []
  }) {
    const locale = `${language}_${country}`;
    if (country !== "GB")
      language = perpetual ? "EN" : "MULT";
    const groupKey = [country, language, promotionCode].filter((val) => val).join("-").toLowerCase();
    return wcsOsi.map((osi) => {
      const cacheKey = `${osi}-${groupKey}`;
      if (cache2.has(cacheKey)) {
        return cache2.get(cacheKey);
      }
      const promiseWithFallback = new Promise((resolve, reject) => {
        let group = queue.get(groupKey);
        if (!group) {
          const options = {
            country,
            locale,
            offerSelectorIds: []
          };
          if (country !== "GB")
            options.language = language;
          const promises = /* @__PURE__ */ new Map();
          group = { options, promises };
          queue.set(groupKey, group);
        }
        if (promotionCode) {
          group.options.promotionCode = promotionCode;
        }
        group.options.offerSelectorIds.push(osi);
        group.promises.set(osi, {
          resolve,
          reject
        });
        flushQueue();
      }).catch((error) => {
        if (staleCache.has(cacheKey)) {
          return staleCache.get(cacheKey);
        }
        throw error;
      });
      cache2.set(cacheKey, promiseWithFallback);
      return promiseWithFallback;
    });
  }
  return {
    Commitment,
    PlanType,
    Term,
    applyPlanType,
    resolveOfferSelectors,
    flushWcsCacheInternal
  };
}

// src/mas-commerce-service.js
var TAG_NAME_SERVICE2 = "mas-commerce-service";
var MARK_START = "mas:start";
var MARK_READY = "mas:ready";
var MEASURE_INIT_TIME = "mas-commerce-service:initTime";
var _initDuration, _config, config_get;
var MasCommerceService = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _config);
    __privateAdd(this, _initDuration, void 0);
    __publicField(this, "lastLoggingTime", 0);
  }
  async registerCheckoutAction(action) {
    if (typeof action != "function")
      return;
    this.buildCheckoutAction = async (offers, options, el) => {
      const checkoutAction = await action?.(
        offers,
        options,
        this.imsSignedInPromise,
        el
      );
      if (checkoutAction) {
        return checkoutAction;
      }
      return null;
    };
  }
  activate() {
    const config2 = __privateGet(this, _config, config_get);
    const settings = Object.freeze(getSettings(config2));
    updateConfig(config2.lana);
    const log2 = Log.init(config2.hostEnv).module("service");
    log2.debug("Activating:", config2);
    const price2 = getPriceLiterals(settings);
    const literals = { price: price2 };
    const providers = {
      checkout: /* @__PURE__ */ new Set(),
      price: /* @__PURE__ */ new Set()
    };
    const startup = { literals, providers, settings };
    Object.defineProperties(
      this,
      Object.getOwnPropertyDescriptors({
        // Activate modules and expose their API as combined flat object
        ...Checkout(startup),
        ...Ims(startup),
        ...Price(startup),
        ...Wcs(startup),
        ...constants_exports,
        // Defined serviceweb  component API
        Log,
        get defaults() {
          return Defaults;
        },
        get log() {
          return Log;
        },
        /* c8 ignore next 11 */
        get providers() {
          return {
            checkout(provider) {
              providers.checkout.add(provider);
              return () => providers.checkout.delete(provider);
            },
            price(provider) {
              providers.price.add(provider);
              return () => providers.price.delete(provider);
            }
          };
        },
        get settings() {
          return settings;
        }
      })
    );
    log2.debug("Activated:", { literals, settings });
    const event = new CustomEvent(EVENT_TYPE_READY, {
      bubbles: true,
      cancelable: false,
      detail: this
    });
    performance.mark(MARK_READY);
    __privateSet(this, _initDuration, performance.measure(
      MEASURE_INIT_TIME,
      MARK_START,
      MARK_READY
    )?.duration);
    this.dispatchEvent(event);
    setTimeout(() => {
      this.logFailedRequests();
    }, 1e4);
  }
  connectedCallback() {
    performance.mark(MARK_START);
    this.activate();
  }
  flushWcsCache() {
    this.flushWcsCacheInternal();
    this.log.debug("Flushed WCS cache");
  }
  refreshOffers() {
    this.flushWcsCacheInternal();
    document.querySelectorAll(SELECTOR_MAS_ELEMENT).forEach((el) => el.requestUpdate(true));
    this.log.debug("Refreshed WCS offers");
    this.logFailedRequests();
  }
  refreshFragments() {
    this.flushWcsCacheInternal();
    document.querySelectorAll("aem-fragment").forEach((el) => el.refresh());
    this.log.debug("Refreshed AEM fragments");
    this.logFailedRequests();
  }
  get duration() {
    return {
      [MEASURE_INIT_TIME]: __privateGet(this, _initDuration)
    };
  }
  /**
   * Logs failed network requests related to AEM fragments and WCS commerce artifacts.
   * Identifies failed resources by checking for zero transfer size, zero duration,
   * response status less than 200, or response status greater than or equal to 400.
   * Only logs errors if any of the failed resources are fragment or commerce artifact requests.
   */
  /* c8 ignore next 21 */
  logFailedRequests() {
    const failedResources = [...performance.getEntriesByType("resource")].filter(({ startTime }) => startTime > this.lastLoggingTime).filter(
      ({ transferSize, duration, responseStatus }) => transferSize === 0 && duration === 0 && responseStatus < 200 || responseStatus >= 400
    );
    const uniqueFailedResources = Array.from(
      new Map(
        failedResources.map((resource) => [resource.name, resource])
      ).values()
    );
    if (uniqueFailedResources.some(
      ({ name }) => /(\/fragments\/|web_commerce_artifact)/.test(name)
    )) {
      const failedUrls = uniqueFailedResources.map(({ name }) => name);
      this.log.error("Failed requests:", {
        failedUrls,
        ...this.duration
      });
    }
    this.lastLoggingTime = performance.now().toFixed(3);
  }
};
_initDuration = new WeakMap();
_config = new WeakSet();
config_get = function() {
  const env = this.getAttribute("env") ?? "prod";
  const config2 = {
    hostEnv: { name: env },
    commerce: { env },
    lana: {
      tags: this.getAttribute("lana-tags"),
      sampleRate: parseInt(
        this.getAttribute("lana-sample-rate") ?? 1,
        10
      ),
      isProdDomain: env === "prod"
    },
    masIOUrl: this.getAttribute("mas-io-url")
  };
  ["locale", "country", "language"].forEach((attribute) => {
    const value = this.getAttribute(attribute);
    if (value) {
      config2[attribute] = value;
    }
  });
  [
    "checkout-workflow-step",
    "force-tax-exclusive",
    "checkout-client-id",
    "allow-override",
    "wcs-api-key"
  ].forEach((attribute) => {
    const value = this.getAttribute(attribute);
    if (value != null) {
      const camelCaseAttribute = attribute.replace(
        /-([a-z])/g,
        (g3) => g3[1].toUpperCase()
      );
      config2.commerce[camelCaseAttribute] = value;
    }
  });
  return config2;
};
if (!window.customElements.get(TAG_NAME_SERVICE2)) {
  window.customElements.define(TAG_NAME_SERVICE2, MasCommerceService);
}

// src/checkout-button.js
var _CheckoutButton = class _CheckoutButton extends CheckoutMixin(HTMLButtonElement) {
  static createCheckoutButton(options = {}, innerHTML = "") {
    return createCheckoutElement(_CheckoutButton, options, innerHTML);
  }
  setCheckoutUrl(value) {
    this.setAttribute("data-href", value);
  }
  get href() {
    return this.getAttribute("data-href");
  }
  get isCheckoutButton() {
    return true;
  }
  clickHandler(e7) {
    if (this.checkoutActionHandler) {
      this.checkoutActionHandler?.(e7);
      return;
    }
    if (this.href) {
      window.location.href = this.href;
    }
  }
};
__publicField(_CheckoutButton, "is", "checkout-button");
__publicField(_CheckoutButton, "tag", "button");
var CheckoutButton = _CheckoutButton;
if (!window.customElements.get(CheckoutButton.is)) {
  window.customElements.define(CheckoutButton.is, CheckoutButton, {
    extends: CheckoutButton.tag
  });
}

// src/utils.js
var MAS_COMMERCE_SERVICE2 = "mas-commerce-service";
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
function matchMobile() {
  return window.matchMedia("(max-width: 767px)");
}
function isMobile() {
  return matchMobile().matches;
}
function isMobileOrTablet() {
  return window.matchMedia("(max-width: 1024px)").matches;
}
function getService2() {
  return document.getElementsByTagName(MAS_COMMERCE_SERVICE2)?.[0];
}

// src/upt-link.js
function getPromoTermsUrl(env) {
  const host = env === "PRODUCTION" ? "www.adobe.com" : "www.stage.adobe.com";
  return `https://${host}/offers/promo-terms.html`;
}
var _initialized;
var _UptLink = class _UptLink extends HTMLAnchorElement {
  constructor() {
    super();
    __privateAdd(this, _initialized, false);
    this.setAttribute("is", _UptLink.is);
  }
  get isUptLink() {
    return true;
  }
  /**
   * @param {string} osi 
   * @param {string} promotionCode 
   */
  initializeWcsData(osi, promotionCode) {
    this.setAttribute("data-wcs-osi", osi);
    if (promotionCode)
      this.setAttribute("data-promotion-code", promotionCode);
    __privateSet(this, _initialized, true);
    this.composePromoTermsUrl();
  }
  attributeChangedCallback(_name, _oldValue, _newValue) {
    if (!__privateGet(this, _initialized))
      return;
    this.composePromoTermsUrl();
  }
  composePromoTermsUrl() {
    const osi = this.getAttribute("data-wcs-osi");
    if (!osi) {
      const fragmentId = this.closest("merch-card").querySelector("aem-fragment").getAttribute("fragment");
      console.error(`Missing 'data-wcs-osi' attribute on upt-link. Fragment: ${fragmentId}`);
      return;
    }
    const service = getService2();
    const wcsOsi = [osi];
    const promotionCode = this.getAttribute("data-promotion-code");
    const { country, language, env } = service.settings;
    const options = { country, language, wcsOsi, promotionCode };
    const promises = service.resolveOfferSelectors(options);
    Promise.all(promises).then(([[offer]]) => {
      let params = `locale=${language}_${country}&country=${country}&offer_id=${offer.offerId}`;
      if (promotionCode)
        params += `&promotion_code=${encodeURIComponent(promotionCode)}`;
      this.href = `${getPromoTermsUrl(env)}?${params}`;
    }).catch((error) => {
      console.error(`Could not resolve offer selectors for id: ${osi}.`, error.message);
    });
  }
  /**
   * @param {HTMLElement} element 
   */
  static createFrom(element) {
    const uptLink = new _UptLink();
    for (const attribute of element.attributes) {
      if (attribute.name === "is")
        continue;
      if (attribute.name === "class" && attribute.value.includes("upt-link"))
        uptLink.setAttribute("class", attribute.value.replace("upt-link", "").trim());
      else
        uptLink.setAttribute(attribute.name, attribute.value);
    }
    uptLink.innerHTML = element.innerHTML;
    uptLink.setAttribute("tabindex", 0);
    return uptLink;
  }
};
_initialized = new WeakMap();
__publicField(_UptLink, "is", "upt-link");
__publicField(_UptLink, "tag", "a");
__publicField(_UptLink, "observedAttributes", ["data-wcs-osi", "data-promotion-code"]);
var UptLink = _UptLink;
if (!window.customElements.get(UptLink.is)) {
  window.customElements.define(UptLink.is, UptLink, {
    extends: UptLink.tag
  });
}

// node_modules/lit/node_modules/@lit/reactive-element/css-tag.js
var t = window;
var e = t.ShadowRoot && (void 0 === t.ShadyCSS || t.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype;
var s = Symbol();
var n = /* @__PURE__ */ new WeakMap();
var o = class {
  constructor(t5, e7, n8) {
    if (this._$cssResult$ = true, n8 !== s)
      throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t5, this.t = e7;
  }
  get styleSheet() {
    let t5 = this.o;
    const s8 = this.t;
    if (e && void 0 === t5) {
      const e7 = void 0 !== s8 && 1 === s8.length;
      e7 && (t5 = n.get(s8)), void 0 === t5 && ((this.o = t5 = new CSSStyleSheet()).replaceSync(this.cssText), e7 && n.set(s8, t5));
    }
    return t5;
  }
  toString() {
    return this.cssText;
  }
};
var r = (t5) => new o("string" == typeof t5 ? t5 : t5 + "", void 0, s);
var S = (s8, n8) => {
  e ? s8.adoptedStyleSheets = n8.map((t5) => t5 instanceof CSSStyleSheet ? t5 : t5.styleSheet) : n8.forEach((e7) => {
    const n9 = document.createElement("style"), o8 = t.litNonce;
    void 0 !== o8 && n9.setAttribute("nonce", o8), n9.textContent = e7.cssText, s8.appendChild(n9);
  });
};
var c = e ? (t5) => t5 : (t5) => t5 instanceof CSSStyleSheet ? ((t6) => {
  let e7 = "";
  for (const s8 of t6.cssRules)
    e7 += s8.cssText;
  return r(e7);
})(t5) : t5;

// node_modules/lit/node_modules/@lit/reactive-element/reactive-element.js
var s2;
var e2 = window;
var r2 = e2.trustedTypes;
var h = r2 ? r2.emptyScript : "";
var o2 = e2.reactiveElementPolyfillSupport;
var n2 = { toAttribute(t5, i5) {
  switch (i5) {
    case Boolean:
      t5 = t5 ? h : null;
      break;
    case Object:
    case Array:
      t5 = null == t5 ? t5 : JSON.stringify(t5);
  }
  return t5;
}, fromAttribute(t5, i5) {
  let s8 = t5;
  switch (i5) {
    case Boolean:
      s8 = null !== t5;
      break;
    case Number:
      s8 = null === t5 ? null : Number(t5);
      break;
    case Object:
    case Array:
      try {
        s8 = JSON.parse(t5);
      } catch (t6) {
        s8 = null;
      }
  }
  return s8;
} };
var a = (t5, i5) => i5 !== t5 && (i5 == i5 || t5 == t5);
var l = { attribute: true, type: String, converter: n2, reflect: false, hasChanged: a };
var d = "finalized";
var u = class extends HTMLElement {
  constructor() {
    super(), this._$Ei = /* @__PURE__ */ new Map(), this.isUpdatePending = false, this.hasUpdated = false, this._$El = null, this._$Eu();
  }
  static addInitializer(t5) {
    var i5;
    this.finalize(), (null !== (i5 = this.h) && void 0 !== i5 ? i5 : this.h = []).push(t5);
  }
  static get observedAttributes() {
    this.finalize();
    const t5 = [];
    return this.elementProperties.forEach((i5, s8) => {
      const e7 = this._$Ep(s8, i5);
      void 0 !== e7 && (this._$Ev.set(e7, s8), t5.push(e7));
    }), t5;
  }
  static createProperty(t5, i5 = l) {
    if (i5.state && (i5.attribute = false), this.finalize(), this.elementProperties.set(t5, i5), !i5.noAccessor && !this.prototype.hasOwnProperty(t5)) {
      const s8 = "symbol" == typeof t5 ? Symbol() : "__" + t5, e7 = this.getPropertyDescriptor(t5, s8, i5);
      void 0 !== e7 && Object.defineProperty(this.prototype, t5, e7);
    }
  }
  static getPropertyDescriptor(t5, i5, s8) {
    return { get() {
      return this[i5];
    }, set(e7) {
      const r7 = this[t5];
      this[i5] = e7, this.requestUpdate(t5, r7, s8);
    }, configurable: true, enumerable: true };
  }
  static getPropertyOptions(t5) {
    return this.elementProperties.get(t5) || l;
  }
  static finalize() {
    if (this.hasOwnProperty(d))
      return false;
    this[d] = true;
    const t5 = Object.getPrototypeOf(this);
    if (t5.finalize(), void 0 !== t5.h && (this.h = [...t5.h]), this.elementProperties = new Map(t5.elementProperties), this._$Ev = /* @__PURE__ */ new Map(), this.hasOwnProperty("properties")) {
      const t6 = this.properties, i5 = [...Object.getOwnPropertyNames(t6), ...Object.getOwnPropertySymbols(t6)];
      for (const s8 of i5)
        this.createProperty(s8, t6[s8]);
    }
    return this.elementStyles = this.finalizeStyles(this.styles), true;
  }
  static finalizeStyles(i5) {
    const s8 = [];
    if (Array.isArray(i5)) {
      const e7 = new Set(i5.flat(1 / 0).reverse());
      for (const i6 of e7)
        s8.unshift(c(i6));
    } else
      void 0 !== i5 && s8.push(c(i5));
    return s8;
  }
  static _$Ep(t5, i5) {
    const s8 = i5.attribute;
    return false === s8 ? void 0 : "string" == typeof s8 ? s8 : "string" == typeof t5 ? t5.toLowerCase() : void 0;
  }
  _$Eu() {
    var t5;
    this._$E_ = new Promise((t6) => this.enableUpdating = t6), this._$AL = /* @__PURE__ */ new Map(), this._$Eg(), this.requestUpdate(), null === (t5 = this.constructor.h) || void 0 === t5 || t5.forEach((t6) => t6(this));
  }
  addController(t5) {
    var i5, s8;
    (null !== (i5 = this._$ES) && void 0 !== i5 ? i5 : this._$ES = []).push(t5), void 0 !== this.renderRoot && this.isConnected && (null === (s8 = t5.hostConnected) || void 0 === s8 || s8.call(t5));
  }
  removeController(t5) {
    var i5;
    null === (i5 = this._$ES) || void 0 === i5 || i5.splice(this._$ES.indexOf(t5) >>> 0, 1);
  }
  _$Eg() {
    this.constructor.elementProperties.forEach((t5, i5) => {
      this.hasOwnProperty(i5) && (this._$Ei.set(i5, this[i5]), delete this[i5]);
    });
  }
  createRenderRoot() {
    var t5;
    const s8 = null !== (t5 = this.shadowRoot) && void 0 !== t5 ? t5 : this.attachShadow(this.constructor.shadowRootOptions);
    return S(s8, this.constructor.elementStyles), s8;
  }
  connectedCallback() {
    var t5;
    void 0 === this.renderRoot && (this.renderRoot = this.createRenderRoot()), this.enableUpdating(true), null === (t5 = this._$ES) || void 0 === t5 || t5.forEach((t6) => {
      var i5;
      return null === (i5 = t6.hostConnected) || void 0 === i5 ? void 0 : i5.call(t6);
    });
  }
  enableUpdating(t5) {
  }
  disconnectedCallback() {
    var t5;
    null === (t5 = this._$ES) || void 0 === t5 || t5.forEach((t6) => {
      var i5;
      return null === (i5 = t6.hostDisconnected) || void 0 === i5 ? void 0 : i5.call(t6);
    });
  }
  attributeChangedCallback(t5, i5, s8) {
    this._$AK(t5, s8);
  }
  _$EO(t5, i5, s8 = l) {
    var e7;
    const r7 = this.constructor._$Ep(t5, s8);
    if (void 0 !== r7 && true === s8.reflect) {
      const h5 = (void 0 !== (null === (e7 = s8.converter) || void 0 === e7 ? void 0 : e7.toAttribute) ? s8.converter : n2).toAttribute(i5, s8.type);
      this._$El = t5, null == h5 ? this.removeAttribute(r7) : this.setAttribute(r7, h5), this._$El = null;
    }
  }
  _$AK(t5, i5) {
    var s8;
    const e7 = this.constructor, r7 = e7._$Ev.get(t5);
    if (void 0 !== r7 && this._$El !== r7) {
      const t6 = e7.getPropertyOptions(r7), h5 = "function" == typeof t6.converter ? { fromAttribute: t6.converter } : void 0 !== (null === (s8 = t6.converter) || void 0 === s8 ? void 0 : s8.fromAttribute) ? t6.converter : n2;
      this._$El = r7, this[r7] = h5.fromAttribute(i5, t6.type), this._$El = null;
    }
  }
  requestUpdate(t5, i5, s8) {
    let e7 = true;
    void 0 !== t5 && (((s8 = s8 || this.constructor.getPropertyOptions(t5)).hasChanged || a)(this[t5], i5) ? (this._$AL.has(t5) || this._$AL.set(t5, i5), true === s8.reflect && this._$El !== t5 && (void 0 === this._$EC && (this._$EC = /* @__PURE__ */ new Map()), this._$EC.set(t5, s8))) : e7 = false), !this.isUpdatePending && e7 && (this._$E_ = this._$Ej());
  }
  async _$Ej() {
    this.isUpdatePending = true;
    try {
      await this._$E_;
    } catch (t6) {
      Promise.reject(t6);
    }
    const t5 = this.scheduleUpdate();
    return null != t5 && await t5, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var t5;
    if (!this.isUpdatePending)
      return;
    this.hasUpdated, this._$Ei && (this._$Ei.forEach((t6, i6) => this[i6] = t6), this._$Ei = void 0);
    let i5 = false;
    const s8 = this._$AL;
    try {
      i5 = this.shouldUpdate(s8), i5 ? (this.willUpdate(s8), null === (t5 = this._$ES) || void 0 === t5 || t5.forEach((t6) => {
        var i6;
        return null === (i6 = t6.hostUpdate) || void 0 === i6 ? void 0 : i6.call(t6);
      }), this.update(s8)) : this._$Ek();
    } catch (t6) {
      throw i5 = false, this._$Ek(), t6;
    }
    i5 && this._$AE(s8);
  }
  willUpdate(t5) {
  }
  _$AE(t5) {
    var i5;
    null === (i5 = this._$ES) || void 0 === i5 || i5.forEach((t6) => {
      var i6;
      return null === (i6 = t6.hostUpdated) || void 0 === i6 ? void 0 : i6.call(t6);
    }), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t5)), this.updated(t5);
  }
  _$Ek() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = false;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$E_;
  }
  shouldUpdate(t5) {
    return true;
  }
  update(t5) {
    void 0 !== this._$EC && (this._$EC.forEach((t6, i5) => this._$EO(i5, this[i5], t6)), this._$EC = void 0), this._$Ek();
  }
  updated(t5) {
  }
  firstUpdated(t5) {
  }
};
u[d] = true, u.elementProperties = /* @__PURE__ */ new Map(), u.elementStyles = [], u.shadowRootOptions = { mode: "open" }, null == o2 || o2({ ReactiveElement: u }), (null !== (s2 = e2.reactiveElementVersions) && void 0 !== s2 ? s2 : e2.reactiveElementVersions = []).push("1.6.3");

// node_modules/lit/node_modules/lit-html/lit-html.js
var t2;
var i2 = window;
var s3 = i2.trustedTypes;
var e3 = s3 ? s3.createPolicy("lit-html", { createHTML: (t5) => t5 }) : void 0;
var o3 = "$lit$";
var n3 = `lit$${(Math.random() + "").slice(9)}$`;
var l2 = "?" + n3;
var h2 = `<${l2}>`;
var r3 = document;
var u2 = () => r3.createComment("");
var d2 = (t5) => null === t5 || "object" != typeof t5 && "function" != typeof t5;
var c2 = Array.isArray;
var v = (t5) => c2(t5) || "function" == typeof (null == t5 ? void 0 : t5[Symbol.iterator]);
var a2 = "[ 	\n\f\r]";
var f = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
var _ = /-->/g;
var m = />/g;
var p = RegExp(`>|${a2}(?:([^\\s"'>=/]+)(${a2}*=${a2}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g");
var g = /'/g;
var $ = /"/g;
var y = /^(?:script|style|textarea|title)$/i;
var w = (t5) => (i5, ...s8) => ({ _$litType$: t5, strings: i5, values: s8 });
var x = w(1);
var b = w(2);
var T = Symbol.for("lit-noChange");
var A = Symbol.for("lit-nothing");
var E = /* @__PURE__ */ new WeakMap();
var C = r3.createTreeWalker(r3, 129, null, false);
function P(t5, i5) {
  if (!Array.isArray(t5) || !t5.hasOwnProperty("raw"))
    throw Error("invalid template strings array");
  return void 0 !== e3 ? e3.createHTML(i5) : i5;
}
var V = (t5, i5) => {
  const s8 = t5.length - 1, e7 = [];
  let l6, r7 = 2 === i5 ? "<svg>" : "", u5 = f;
  for (let i6 = 0; i6 < s8; i6++) {
    const s9 = t5[i6];
    let d5, c5, v3 = -1, a5 = 0;
    for (; a5 < s9.length && (u5.lastIndex = a5, c5 = u5.exec(s9), null !== c5); )
      a5 = u5.lastIndex, u5 === f ? "!--" === c5[1] ? u5 = _ : void 0 !== c5[1] ? u5 = m : void 0 !== c5[2] ? (y.test(c5[2]) && (l6 = RegExp("</" + c5[2], "g")), u5 = p) : void 0 !== c5[3] && (u5 = p) : u5 === p ? ">" === c5[0] ? (u5 = null != l6 ? l6 : f, v3 = -1) : void 0 === c5[1] ? v3 = -2 : (v3 = u5.lastIndex - c5[2].length, d5 = c5[1], u5 = void 0 === c5[3] ? p : '"' === c5[3] ? $ : g) : u5 === $ || u5 === g ? u5 = p : u5 === _ || u5 === m ? u5 = f : (u5 = p, l6 = void 0);
    const w3 = u5 === p && t5[i6 + 1].startsWith("/>") ? " " : "";
    r7 += u5 === f ? s9 + h2 : v3 >= 0 ? (e7.push(d5), s9.slice(0, v3) + o3 + s9.slice(v3) + n3 + w3) : s9 + n3 + (-2 === v3 ? (e7.push(void 0), i6) : w3);
  }
  return [P(t5, r7 + (t5[s8] || "<?>") + (2 === i5 ? "</svg>" : "")), e7];
};
var N = class _N {
  constructor({ strings: t5, _$litType$: i5 }, e7) {
    let h5;
    this.parts = [];
    let r7 = 0, d5 = 0;
    const c5 = t5.length - 1, v3 = this.parts, [a5, f3] = V(t5, i5);
    if (this.el = _N.createElement(a5, e7), C.currentNode = this.el.content, 2 === i5) {
      const t6 = this.el.content, i6 = t6.firstChild;
      i6.remove(), t6.append(...i6.childNodes);
    }
    for (; null !== (h5 = C.nextNode()) && v3.length < c5; ) {
      if (1 === h5.nodeType) {
        if (h5.hasAttributes()) {
          const t6 = [];
          for (const i6 of h5.getAttributeNames())
            if (i6.endsWith(o3) || i6.startsWith(n3)) {
              const s8 = f3[d5++];
              if (t6.push(i6), void 0 !== s8) {
                const t7 = h5.getAttribute(s8.toLowerCase() + o3).split(n3), i7 = /([.?@])?(.*)/.exec(s8);
                v3.push({ type: 1, index: r7, name: i7[2], strings: t7, ctor: "." === i7[1] ? H : "?" === i7[1] ? L : "@" === i7[1] ? z : k });
              } else
                v3.push({ type: 6, index: r7 });
            }
          for (const i6 of t6)
            h5.removeAttribute(i6);
        }
        if (y.test(h5.tagName)) {
          const t6 = h5.textContent.split(n3), i6 = t6.length - 1;
          if (i6 > 0) {
            h5.textContent = s3 ? s3.emptyScript : "";
            for (let s8 = 0; s8 < i6; s8++)
              h5.append(t6[s8], u2()), C.nextNode(), v3.push({ type: 2, index: ++r7 });
            h5.append(t6[i6], u2());
          }
        }
      } else if (8 === h5.nodeType)
        if (h5.data === l2)
          v3.push({ type: 2, index: r7 });
        else {
          let t6 = -1;
          for (; -1 !== (t6 = h5.data.indexOf(n3, t6 + 1)); )
            v3.push({ type: 7, index: r7 }), t6 += n3.length - 1;
        }
      r7++;
    }
  }
  static createElement(t5, i5) {
    const s8 = r3.createElement("template");
    return s8.innerHTML = t5, s8;
  }
};
function S2(t5, i5, s8 = t5, e7) {
  var o8, n8, l6, h5;
  if (i5 === T)
    return i5;
  let r7 = void 0 !== e7 ? null === (o8 = s8._$Co) || void 0 === o8 ? void 0 : o8[e7] : s8._$Cl;
  const u5 = d2(i5) ? void 0 : i5._$litDirective$;
  return (null == r7 ? void 0 : r7.constructor) !== u5 && (null === (n8 = null == r7 ? void 0 : r7._$AO) || void 0 === n8 || n8.call(r7, false), void 0 === u5 ? r7 = void 0 : (r7 = new u5(t5), r7._$AT(t5, s8, e7)), void 0 !== e7 ? (null !== (l6 = (h5 = s8)._$Co) && void 0 !== l6 ? l6 : h5._$Co = [])[e7] = r7 : s8._$Cl = r7), void 0 !== r7 && (i5 = S2(t5, r7._$AS(t5, i5.values), r7, e7)), i5;
}
var M = class {
  constructor(t5, i5) {
    this._$AV = [], this._$AN = void 0, this._$AD = t5, this._$AM = i5;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t5) {
    var i5;
    const { el: { content: s8 }, parts: e7 } = this._$AD, o8 = (null !== (i5 = null == t5 ? void 0 : t5.creationScope) && void 0 !== i5 ? i5 : r3).importNode(s8, true);
    C.currentNode = o8;
    let n8 = C.nextNode(), l6 = 0, h5 = 0, u5 = e7[0];
    for (; void 0 !== u5; ) {
      if (l6 === u5.index) {
        let i6;
        2 === u5.type ? i6 = new R(n8, n8.nextSibling, this, t5) : 1 === u5.type ? i6 = new u5.ctor(n8, u5.name, u5.strings, this, t5) : 6 === u5.type && (i6 = new Z(n8, this, t5)), this._$AV.push(i6), u5 = e7[++h5];
      }
      l6 !== (null == u5 ? void 0 : u5.index) && (n8 = C.nextNode(), l6++);
    }
    return C.currentNode = r3, o8;
  }
  v(t5) {
    let i5 = 0;
    for (const s8 of this._$AV)
      void 0 !== s8 && (void 0 !== s8.strings ? (s8._$AI(t5, s8, i5), i5 += s8.strings.length - 2) : s8._$AI(t5[i5])), i5++;
  }
};
var R = class _R {
  constructor(t5, i5, s8, e7) {
    var o8;
    this.type = 2, this._$AH = A, this._$AN = void 0, this._$AA = t5, this._$AB = i5, this._$AM = s8, this.options = e7, this._$Cp = null === (o8 = null == e7 ? void 0 : e7.isConnected) || void 0 === o8 || o8;
  }
  get _$AU() {
    var t5, i5;
    return null !== (i5 = null === (t5 = this._$AM) || void 0 === t5 ? void 0 : t5._$AU) && void 0 !== i5 ? i5 : this._$Cp;
  }
  get parentNode() {
    let t5 = this._$AA.parentNode;
    const i5 = this._$AM;
    return void 0 !== i5 && 11 === (null == t5 ? void 0 : t5.nodeType) && (t5 = i5.parentNode), t5;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t5, i5 = this) {
    t5 = S2(this, t5, i5), d2(t5) ? t5 === A || null == t5 || "" === t5 ? (this._$AH !== A && this._$AR(), this._$AH = A) : t5 !== this._$AH && t5 !== T && this._(t5) : void 0 !== t5._$litType$ ? this.g(t5) : void 0 !== t5.nodeType ? this.$(t5) : v(t5) ? this.T(t5) : this._(t5);
  }
  k(t5) {
    return this._$AA.parentNode.insertBefore(t5, this._$AB);
  }
  $(t5) {
    this._$AH !== t5 && (this._$AR(), this._$AH = this.k(t5));
  }
  _(t5) {
    this._$AH !== A && d2(this._$AH) ? this._$AA.nextSibling.data = t5 : this.$(r3.createTextNode(t5)), this._$AH = t5;
  }
  g(t5) {
    var i5;
    const { values: s8, _$litType$: e7 } = t5, o8 = "number" == typeof e7 ? this._$AC(t5) : (void 0 === e7.el && (e7.el = N.createElement(P(e7.h, e7.h[0]), this.options)), e7);
    if ((null === (i5 = this._$AH) || void 0 === i5 ? void 0 : i5._$AD) === o8)
      this._$AH.v(s8);
    else {
      const t6 = new M(o8, this), i6 = t6.u(this.options);
      t6.v(s8), this.$(i6), this._$AH = t6;
    }
  }
  _$AC(t5) {
    let i5 = E.get(t5.strings);
    return void 0 === i5 && E.set(t5.strings, i5 = new N(t5)), i5;
  }
  T(t5) {
    c2(this._$AH) || (this._$AH = [], this._$AR());
    const i5 = this._$AH;
    let s8, e7 = 0;
    for (const o8 of t5)
      e7 === i5.length ? i5.push(s8 = new _R(this.k(u2()), this.k(u2()), this, this.options)) : s8 = i5[e7], s8._$AI(o8), e7++;
    e7 < i5.length && (this._$AR(s8 && s8._$AB.nextSibling, e7), i5.length = e7);
  }
  _$AR(t5 = this._$AA.nextSibling, i5) {
    var s8;
    for (null === (s8 = this._$AP) || void 0 === s8 || s8.call(this, false, true, i5); t5 && t5 !== this._$AB; ) {
      const i6 = t5.nextSibling;
      t5.remove(), t5 = i6;
    }
  }
  setConnected(t5) {
    var i5;
    void 0 === this._$AM && (this._$Cp = t5, null === (i5 = this._$AP) || void 0 === i5 || i5.call(this, t5));
  }
};
var k = class {
  constructor(t5, i5, s8, e7, o8) {
    this.type = 1, this._$AH = A, this._$AN = void 0, this.element = t5, this.name = i5, this._$AM = e7, this.options = o8, s8.length > 2 || "" !== s8[0] || "" !== s8[1] ? (this._$AH = Array(s8.length - 1).fill(new String()), this.strings = s8) : this._$AH = A;
  }
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t5, i5 = this, s8, e7) {
    const o8 = this.strings;
    let n8 = false;
    if (void 0 === o8)
      t5 = S2(this, t5, i5, 0), n8 = !d2(t5) || t5 !== this._$AH && t5 !== T, n8 && (this._$AH = t5);
    else {
      const e8 = t5;
      let l6, h5;
      for (t5 = o8[0], l6 = 0; l6 < o8.length - 1; l6++)
        h5 = S2(this, e8[s8 + l6], i5, l6), h5 === T && (h5 = this._$AH[l6]), n8 || (n8 = !d2(h5) || h5 !== this._$AH[l6]), h5 === A ? t5 = A : t5 !== A && (t5 += (null != h5 ? h5 : "") + o8[l6 + 1]), this._$AH[l6] = h5;
    }
    n8 && !e7 && this.j(t5);
  }
  j(t5) {
    t5 === A ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, null != t5 ? t5 : "");
  }
};
var H = class extends k {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t5) {
    this.element[this.name] = t5 === A ? void 0 : t5;
  }
};
var I = s3 ? s3.emptyScript : "";
var L = class extends k {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t5) {
    t5 && t5 !== A ? this.element.setAttribute(this.name, I) : this.element.removeAttribute(this.name);
  }
};
var z = class extends k {
  constructor(t5, i5, s8, e7, o8) {
    super(t5, i5, s8, e7, o8), this.type = 5;
  }
  _$AI(t5, i5 = this) {
    var s8;
    if ((t5 = null !== (s8 = S2(this, t5, i5, 0)) && void 0 !== s8 ? s8 : A) === T)
      return;
    const e7 = this._$AH, o8 = t5 === A && e7 !== A || t5.capture !== e7.capture || t5.once !== e7.once || t5.passive !== e7.passive, n8 = t5 !== A && (e7 === A || o8);
    o8 && this.element.removeEventListener(this.name, this, e7), n8 && this.element.addEventListener(this.name, this, t5), this._$AH = t5;
  }
  handleEvent(t5) {
    var i5, s8;
    "function" == typeof this._$AH ? this._$AH.call(null !== (s8 = null === (i5 = this.options) || void 0 === i5 ? void 0 : i5.host) && void 0 !== s8 ? s8 : this.element, t5) : this._$AH.handleEvent(t5);
  }
};
var Z = class {
  constructor(t5, i5, s8) {
    this.element = t5, this.type = 6, this._$AN = void 0, this._$AM = i5, this.options = s8;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t5) {
    S2(this, t5);
  }
};
var B = i2.litHtmlPolyfillSupport;
null == B || B(N, R), (null !== (t2 = i2.litHtmlVersions) && void 0 !== t2 ? t2 : i2.litHtmlVersions = []).push("2.8.0");

// node_modules/lit-element/node_modules/@lit/reactive-element/css-tag.js
var t3 = window;
var e4 = t3.ShadowRoot && (void 0 === t3.ShadyCSS || t3.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype;
var s4 = Symbol();
var n4 = /* @__PURE__ */ new WeakMap();
var o4 = class {
  constructor(t5, e7, n8) {
    if (this._$cssResult$ = true, n8 !== s4)
      throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t5, this.t = e7;
  }
  get styleSheet() {
    let t5 = this.o;
    const s8 = this.t;
    if (e4 && void 0 === t5) {
      const e7 = void 0 !== s8 && 1 === s8.length;
      e7 && (t5 = n4.get(s8)), void 0 === t5 && ((this.o = t5 = new CSSStyleSheet()).replaceSync(this.cssText), e7 && n4.set(s8, t5));
    }
    return t5;
  }
  toString() {
    return this.cssText;
  }
};
var r4 = (t5) => new o4("string" == typeof t5 ? t5 : t5 + "", void 0, s4);
var i3 = (t5, ...e7) => {
  const n8 = 1 === t5.length ? t5[0] : e7.reduce((e8, s8, n9) => e8 + ((t6) => {
    if (true === t6._$cssResult$)
      return t6.cssText;
    if ("number" == typeof t6)
      return t6;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + t6 + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s8) + t5[n9 + 1], t5[0]);
  return new o4(n8, t5, s4);
};
var S3 = (s8, n8) => {
  e4 ? s8.adoptedStyleSheets = n8.map((t5) => t5 instanceof CSSStyleSheet ? t5 : t5.styleSheet) : n8.forEach((e7) => {
    const n9 = document.createElement("style"), o8 = t3.litNonce;
    void 0 !== o8 && n9.setAttribute("nonce", o8), n9.textContent = e7.cssText, s8.appendChild(n9);
  });
};
var c3 = e4 ? (t5) => t5 : (t5) => t5 instanceof CSSStyleSheet ? ((t6) => {
  let e7 = "";
  for (const s8 of t6.cssRules)
    e7 += s8.cssText;
  return r4(e7);
})(t5) : t5;

// node_modules/lit-element/node_modules/@lit/reactive-element/reactive-element.js
var s5;
var e5 = window;
var r5 = e5.trustedTypes;
var h3 = r5 ? r5.emptyScript : "";
var o5 = e5.reactiveElementPolyfillSupport;
var n5 = { toAttribute(t5, i5) {
  switch (i5) {
    case Boolean:
      t5 = t5 ? h3 : null;
      break;
    case Object:
    case Array:
      t5 = null == t5 ? t5 : JSON.stringify(t5);
  }
  return t5;
}, fromAttribute(t5, i5) {
  let s8 = t5;
  switch (i5) {
    case Boolean:
      s8 = null !== t5;
      break;
    case Number:
      s8 = null === t5 ? null : Number(t5);
      break;
    case Object:
    case Array:
      try {
        s8 = JSON.parse(t5);
      } catch (t6) {
        s8 = null;
      }
  }
  return s8;
} };
var a3 = (t5, i5) => i5 !== t5 && (i5 == i5 || t5 == t5);
var l3 = { attribute: true, type: String, converter: n5, reflect: false, hasChanged: a3 };
var d3 = "finalized";
var u3 = class extends HTMLElement {
  constructor() {
    super(), this._$Ei = /* @__PURE__ */ new Map(), this.isUpdatePending = false, this.hasUpdated = false, this._$El = null, this._$Eu();
  }
  static addInitializer(t5) {
    var i5;
    this.finalize(), (null !== (i5 = this.h) && void 0 !== i5 ? i5 : this.h = []).push(t5);
  }
  static get observedAttributes() {
    this.finalize();
    const t5 = [];
    return this.elementProperties.forEach((i5, s8) => {
      const e7 = this._$Ep(s8, i5);
      void 0 !== e7 && (this._$Ev.set(e7, s8), t5.push(e7));
    }), t5;
  }
  static createProperty(t5, i5 = l3) {
    if (i5.state && (i5.attribute = false), this.finalize(), this.elementProperties.set(t5, i5), !i5.noAccessor && !this.prototype.hasOwnProperty(t5)) {
      const s8 = "symbol" == typeof t5 ? Symbol() : "__" + t5, e7 = this.getPropertyDescriptor(t5, s8, i5);
      void 0 !== e7 && Object.defineProperty(this.prototype, t5, e7);
    }
  }
  static getPropertyDescriptor(t5, i5, s8) {
    return { get() {
      return this[i5];
    }, set(e7) {
      const r7 = this[t5];
      this[i5] = e7, this.requestUpdate(t5, r7, s8);
    }, configurable: true, enumerable: true };
  }
  static getPropertyOptions(t5) {
    return this.elementProperties.get(t5) || l3;
  }
  static finalize() {
    if (this.hasOwnProperty(d3))
      return false;
    this[d3] = true;
    const t5 = Object.getPrototypeOf(this);
    if (t5.finalize(), void 0 !== t5.h && (this.h = [...t5.h]), this.elementProperties = new Map(t5.elementProperties), this._$Ev = /* @__PURE__ */ new Map(), this.hasOwnProperty("properties")) {
      const t6 = this.properties, i5 = [...Object.getOwnPropertyNames(t6), ...Object.getOwnPropertySymbols(t6)];
      for (const s8 of i5)
        this.createProperty(s8, t6[s8]);
    }
    return this.elementStyles = this.finalizeStyles(this.styles), true;
  }
  static finalizeStyles(i5) {
    const s8 = [];
    if (Array.isArray(i5)) {
      const e7 = new Set(i5.flat(1 / 0).reverse());
      for (const i6 of e7)
        s8.unshift(c3(i6));
    } else
      void 0 !== i5 && s8.push(c3(i5));
    return s8;
  }
  static _$Ep(t5, i5) {
    const s8 = i5.attribute;
    return false === s8 ? void 0 : "string" == typeof s8 ? s8 : "string" == typeof t5 ? t5.toLowerCase() : void 0;
  }
  _$Eu() {
    var t5;
    this._$E_ = new Promise((t6) => this.enableUpdating = t6), this._$AL = /* @__PURE__ */ new Map(), this._$Eg(), this.requestUpdate(), null === (t5 = this.constructor.h) || void 0 === t5 || t5.forEach((t6) => t6(this));
  }
  addController(t5) {
    var i5, s8;
    (null !== (i5 = this._$ES) && void 0 !== i5 ? i5 : this._$ES = []).push(t5), void 0 !== this.renderRoot && this.isConnected && (null === (s8 = t5.hostConnected) || void 0 === s8 || s8.call(t5));
  }
  removeController(t5) {
    var i5;
    null === (i5 = this._$ES) || void 0 === i5 || i5.splice(this._$ES.indexOf(t5) >>> 0, 1);
  }
  _$Eg() {
    this.constructor.elementProperties.forEach((t5, i5) => {
      this.hasOwnProperty(i5) && (this._$Ei.set(i5, this[i5]), delete this[i5]);
    });
  }
  createRenderRoot() {
    var t5;
    const s8 = null !== (t5 = this.shadowRoot) && void 0 !== t5 ? t5 : this.attachShadow(this.constructor.shadowRootOptions);
    return S3(s8, this.constructor.elementStyles), s8;
  }
  connectedCallback() {
    var t5;
    void 0 === this.renderRoot && (this.renderRoot = this.createRenderRoot()), this.enableUpdating(true), null === (t5 = this._$ES) || void 0 === t5 || t5.forEach((t6) => {
      var i5;
      return null === (i5 = t6.hostConnected) || void 0 === i5 ? void 0 : i5.call(t6);
    });
  }
  enableUpdating(t5) {
  }
  disconnectedCallback() {
    var t5;
    null === (t5 = this._$ES) || void 0 === t5 || t5.forEach((t6) => {
      var i5;
      return null === (i5 = t6.hostDisconnected) || void 0 === i5 ? void 0 : i5.call(t6);
    });
  }
  attributeChangedCallback(t5, i5, s8) {
    this._$AK(t5, s8);
  }
  _$EO(t5, i5, s8 = l3) {
    var e7;
    const r7 = this.constructor._$Ep(t5, s8);
    if (void 0 !== r7 && true === s8.reflect) {
      const h5 = (void 0 !== (null === (e7 = s8.converter) || void 0 === e7 ? void 0 : e7.toAttribute) ? s8.converter : n5).toAttribute(i5, s8.type);
      this._$El = t5, null == h5 ? this.removeAttribute(r7) : this.setAttribute(r7, h5), this._$El = null;
    }
  }
  _$AK(t5, i5) {
    var s8;
    const e7 = this.constructor, r7 = e7._$Ev.get(t5);
    if (void 0 !== r7 && this._$El !== r7) {
      const t6 = e7.getPropertyOptions(r7), h5 = "function" == typeof t6.converter ? { fromAttribute: t6.converter } : void 0 !== (null === (s8 = t6.converter) || void 0 === s8 ? void 0 : s8.fromAttribute) ? t6.converter : n5;
      this._$El = r7, this[r7] = h5.fromAttribute(i5, t6.type), this._$El = null;
    }
  }
  requestUpdate(t5, i5, s8) {
    let e7 = true;
    void 0 !== t5 && (((s8 = s8 || this.constructor.getPropertyOptions(t5)).hasChanged || a3)(this[t5], i5) ? (this._$AL.has(t5) || this._$AL.set(t5, i5), true === s8.reflect && this._$El !== t5 && (void 0 === this._$EC && (this._$EC = /* @__PURE__ */ new Map()), this._$EC.set(t5, s8))) : e7 = false), !this.isUpdatePending && e7 && (this._$E_ = this._$Ej());
  }
  async _$Ej() {
    this.isUpdatePending = true;
    try {
      await this._$E_;
    } catch (t6) {
      Promise.reject(t6);
    }
    const t5 = this.scheduleUpdate();
    return null != t5 && await t5, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var t5;
    if (!this.isUpdatePending)
      return;
    this.hasUpdated, this._$Ei && (this._$Ei.forEach((t6, i6) => this[i6] = t6), this._$Ei = void 0);
    let i5 = false;
    const s8 = this._$AL;
    try {
      i5 = this.shouldUpdate(s8), i5 ? (this.willUpdate(s8), null === (t5 = this._$ES) || void 0 === t5 || t5.forEach((t6) => {
        var i6;
        return null === (i6 = t6.hostUpdate) || void 0 === i6 ? void 0 : i6.call(t6);
      }), this.update(s8)) : this._$Ek();
    } catch (t6) {
      throw i5 = false, this._$Ek(), t6;
    }
    i5 && this._$AE(s8);
  }
  willUpdate(t5) {
  }
  _$AE(t5) {
    var i5;
    null === (i5 = this._$ES) || void 0 === i5 || i5.forEach((t6) => {
      var i6;
      return null === (i6 = t6.hostUpdated) || void 0 === i6 ? void 0 : i6.call(t6);
    }), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t5)), this.updated(t5);
  }
  _$Ek() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = false;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$E_;
  }
  shouldUpdate(t5) {
    return true;
  }
  update(t5) {
    void 0 !== this._$EC && (this._$EC.forEach((t6, i5) => this._$EO(i5, this[i5], t6)), this._$EC = void 0), this._$Ek();
  }
  updated(t5) {
  }
  firstUpdated(t5) {
  }
};
u3[d3] = true, u3.elementProperties = /* @__PURE__ */ new Map(), u3.elementStyles = [], u3.shadowRootOptions = { mode: "open" }, null == o5 || o5({ ReactiveElement: u3 }), (null !== (s5 = e5.reactiveElementVersions) && void 0 !== s5 ? s5 : e5.reactiveElementVersions = []).push("1.6.3");

// node_modules/lit-element/node_modules/lit-html/lit-html.js
var t4;
var i4 = window;
var s6 = i4.trustedTypes;
var e6 = s6 ? s6.createPolicy("lit-html", { createHTML: (t5) => t5 }) : void 0;
var o6 = "$lit$";
var n6 = `lit$${(Math.random() + "").slice(9)}$`;
var l4 = "?" + n6;
var h4 = `<${l4}>`;
var r6 = document;
var u4 = () => r6.createComment("");
var d4 = (t5) => null === t5 || "object" != typeof t5 && "function" != typeof t5;
var c4 = Array.isArray;
var v2 = (t5) => c4(t5) || "function" == typeof (null == t5 ? void 0 : t5[Symbol.iterator]);
var a4 = "[ 	\n\f\r]";
var f2 = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
var _2 = /-->/g;
var m2 = />/g;
var p2 = RegExp(`>|${a4}(?:([^\\s"'>=/]+)(${a4}*=${a4}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g");
var g2 = /'/g;
var $2 = /"/g;
var y2 = /^(?:script|style|textarea|title)$/i;
var w2 = (t5) => (i5, ...s8) => ({ _$litType$: t5, strings: i5, values: s8 });
var x2 = w2(1);
var b2 = w2(2);
var T2 = Symbol.for("lit-noChange");
var A2 = Symbol.for("lit-nothing");
var E2 = /* @__PURE__ */ new WeakMap();
var C2 = r6.createTreeWalker(r6, 129, null, false);
function P2(t5, i5) {
  if (!Array.isArray(t5) || !t5.hasOwnProperty("raw"))
    throw Error("invalid template strings array");
  return void 0 !== e6 ? e6.createHTML(i5) : i5;
}
var V2 = (t5, i5) => {
  const s8 = t5.length - 1, e7 = [];
  let l6, r7 = 2 === i5 ? "<svg>" : "", u5 = f2;
  for (let i6 = 0; i6 < s8; i6++) {
    const s9 = t5[i6];
    let d5, c5, v3 = -1, a5 = 0;
    for (; a5 < s9.length && (u5.lastIndex = a5, c5 = u5.exec(s9), null !== c5); )
      a5 = u5.lastIndex, u5 === f2 ? "!--" === c5[1] ? u5 = _2 : void 0 !== c5[1] ? u5 = m2 : void 0 !== c5[2] ? (y2.test(c5[2]) && (l6 = RegExp("</" + c5[2], "g")), u5 = p2) : void 0 !== c5[3] && (u5 = p2) : u5 === p2 ? ">" === c5[0] ? (u5 = null != l6 ? l6 : f2, v3 = -1) : void 0 === c5[1] ? v3 = -2 : (v3 = u5.lastIndex - c5[2].length, d5 = c5[1], u5 = void 0 === c5[3] ? p2 : '"' === c5[3] ? $2 : g2) : u5 === $2 || u5 === g2 ? u5 = p2 : u5 === _2 || u5 === m2 ? u5 = f2 : (u5 = p2, l6 = void 0);
    const w3 = u5 === p2 && t5[i6 + 1].startsWith("/>") ? " " : "";
    r7 += u5 === f2 ? s9 + h4 : v3 >= 0 ? (e7.push(d5), s9.slice(0, v3) + o6 + s9.slice(v3) + n6 + w3) : s9 + n6 + (-2 === v3 ? (e7.push(void 0), i6) : w3);
  }
  return [P2(t5, r7 + (t5[s8] || "<?>") + (2 === i5 ? "</svg>" : "")), e7];
};
var N2 = class _N {
  constructor({ strings: t5, _$litType$: i5 }, e7) {
    let h5;
    this.parts = [];
    let r7 = 0, d5 = 0;
    const c5 = t5.length - 1, v3 = this.parts, [a5, f3] = V2(t5, i5);
    if (this.el = _N.createElement(a5, e7), C2.currentNode = this.el.content, 2 === i5) {
      const t6 = this.el.content, i6 = t6.firstChild;
      i6.remove(), t6.append(...i6.childNodes);
    }
    for (; null !== (h5 = C2.nextNode()) && v3.length < c5; ) {
      if (1 === h5.nodeType) {
        if (h5.hasAttributes()) {
          const t6 = [];
          for (const i6 of h5.getAttributeNames())
            if (i6.endsWith(o6) || i6.startsWith(n6)) {
              const s8 = f3[d5++];
              if (t6.push(i6), void 0 !== s8) {
                const t7 = h5.getAttribute(s8.toLowerCase() + o6).split(n6), i7 = /([.?@])?(.*)/.exec(s8);
                v3.push({ type: 1, index: r7, name: i7[2], strings: t7, ctor: "." === i7[1] ? H2 : "?" === i7[1] ? L2 : "@" === i7[1] ? z2 : k2 });
              } else
                v3.push({ type: 6, index: r7 });
            }
          for (const i6 of t6)
            h5.removeAttribute(i6);
        }
        if (y2.test(h5.tagName)) {
          const t6 = h5.textContent.split(n6), i6 = t6.length - 1;
          if (i6 > 0) {
            h5.textContent = s6 ? s6.emptyScript : "";
            for (let s8 = 0; s8 < i6; s8++)
              h5.append(t6[s8], u4()), C2.nextNode(), v3.push({ type: 2, index: ++r7 });
            h5.append(t6[i6], u4());
          }
        }
      } else if (8 === h5.nodeType)
        if (h5.data === l4)
          v3.push({ type: 2, index: r7 });
        else {
          let t6 = -1;
          for (; -1 !== (t6 = h5.data.indexOf(n6, t6 + 1)); )
            v3.push({ type: 7, index: r7 }), t6 += n6.length - 1;
        }
      r7++;
    }
  }
  static createElement(t5, i5) {
    const s8 = r6.createElement("template");
    return s8.innerHTML = t5, s8;
  }
};
function S4(t5, i5, s8 = t5, e7) {
  var o8, n8, l6, h5;
  if (i5 === T2)
    return i5;
  let r7 = void 0 !== e7 ? null === (o8 = s8._$Co) || void 0 === o8 ? void 0 : o8[e7] : s8._$Cl;
  const u5 = d4(i5) ? void 0 : i5._$litDirective$;
  return (null == r7 ? void 0 : r7.constructor) !== u5 && (null === (n8 = null == r7 ? void 0 : r7._$AO) || void 0 === n8 || n8.call(r7, false), void 0 === u5 ? r7 = void 0 : (r7 = new u5(t5), r7._$AT(t5, s8, e7)), void 0 !== e7 ? (null !== (l6 = (h5 = s8)._$Co) && void 0 !== l6 ? l6 : h5._$Co = [])[e7] = r7 : s8._$Cl = r7), void 0 !== r7 && (i5 = S4(t5, r7._$AS(t5, i5.values), r7, e7)), i5;
}
var M2 = class {
  constructor(t5, i5) {
    this._$AV = [], this._$AN = void 0, this._$AD = t5, this._$AM = i5;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t5) {
    var i5;
    const { el: { content: s8 }, parts: e7 } = this._$AD, o8 = (null !== (i5 = null == t5 ? void 0 : t5.creationScope) && void 0 !== i5 ? i5 : r6).importNode(s8, true);
    C2.currentNode = o8;
    let n8 = C2.nextNode(), l6 = 0, h5 = 0, u5 = e7[0];
    for (; void 0 !== u5; ) {
      if (l6 === u5.index) {
        let i6;
        2 === u5.type ? i6 = new R2(n8, n8.nextSibling, this, t5) : 1 === u5.type ? i6 = new u5.ctor(n8, u5.name, u5.strings, this, t5) : 6 === u5.type && (i6 = new Z2(n8, this, t5)), this._$AV.push(i6), u5 = e7[++h5];
      }
      l6 !== (null == u5 ? void 0 : u5.index) && (n8 = C2.nextNode(), l6++);
    }
    return C2.currentNode = r6, o8;
  }
  v(t5) {
    let i5 = 0;
    for (const s8 of this._$AV)
      void 0 !== s8 && (void 0 !== s8.strings ? (s8._$AI(t5, s8, i5), i5 += s8.strings.length - 2) : s8._$AI(t5[i5])), i5++;
  }
};
var R2 = class _R {
  constructor(t5, i5, s8, e7) {
    var o8;
    this.type = 2, this._$AH = A2, this._$AN = void 0, this._$AA = t5, this._$AB = i5, this._$AM = s8, this.options = e7, this._$Cp = null === (o8 = null == e7 ? void 0 : e7.isConnected) || void 0 === o8 || o8;
  }
  get _$AU() {
    var t5, i5;
    return null !== (i5 = null === (t5 = this._$AM) || void 0 === t5 ? void 0 : t5._$AU) && void 0 !== i5 ? i5 : this._$Cp;
  }
  get parentNode() {
    let t5 = this._$AA.parentNode;
    const i5 = this._$AM;
    return void 0 !== i5 && 11 === (null == t5 ? void 0 : t5.nodeType) && (t5 = i5.parentNode), t5;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t5, i5 = this) {
    t5 = S4(this, t5, i5), d4(t5) ? t5 === A2 || null == t5 || "" === t5 ? (this._$AH !== A2 && this._$AR(), this._$AH = A2) : t5 !== this._$AH && t5 !== T2 && this._(t5) : void 0 !== t5._$litType$ ? this.g(t5) : void 0 !== t5.nodeType ? this.$(t5) : v2(t5) ? this.T(t5) : this._(t5);
  }
  k(t5) {
    return this._$AA.parentNode.insertBefore(t5, this._$AB);
  }
  $(t5) {
    this._$AH !== t5 && (this._$AR(), this._$AH = this.k(t5));
  }
  _(t5) {
    this._$AH !== A2 && d4(this._$AH) ? this._$AA.nextSibling.data = t5 : this.$(r6.createTextNode(t5)), this._$AH = t5;
  }
  g(t5) {
    var i5;
    const { values: s8, _$litType$: e7 } = t5, o8 = "number" == typeof e7 ? this._$AC(t5) : (void 0 === e7.el && (e7.el = N2.createElement(P2(e7.h, e7.h[0]), this.options)), e7);
    if ((null === (i5 = this._$AH) || void 0 === i5 ? void 0 : i5._$AD) === o8)
      this._$AH.v(s8);
    else {
      const t6 = new M2(o8, this), i6 = t6.u(this.options);
      t6.v(s8), this.$(i6), this._$AH = t6;
    }
  }
  _$AC(t5) {
    let i5 = E2.get(t5.strings);
    return void 0 === i5 && E2.set(t5.strings, i5 = new N2(t5)), i5;
  }
  T(t5) {
    c4(this._$AH) || (this._$AH = [], this._$AR());
    const i5 = this._$AH;
    let s8, e7 = 0;
    for (const o8 of t5)
      e7 === i5.length ? i5.push(s8 = new _R(this.k(u4()), this.k(u4()), this, this.options)) : s8 = i5[e7], s8._$AI(o8), e7++;
    e7 < i5.length && (this._$AR(s8 && s8._$AB.nextSibling, e7), i5.length = e7);
  }
  _$AR(t5 = this._$AA.nextSibling, i5) {
    var s8;
    for (null === (s8 = this._$AP) || void 0 === s8 || s8.call(this, false, true, i5); t5 && t5 !== this._$AB; ) {
      const i6 = t5.nextSibling;
      t5.remove(), t5 = i6;
    }
  }
  setConnected(t5) {
    var i5;
    void 0 === this._$AM && (this._$Cp = t5, null === (i5 = this._$AP) || void 0 === i5 || i5.call(this, t5));
  }
};
var k2 = class {
  constructor(t5, i5, s8, e7, o8) {
    this.type = 1, this._$AH = A2, this._$AN = void 0, this.element = t5, this.name = i5, this._$AM = e7, this.options = o8, s8.length > 2 || "" !== s8[0] || "" !== s8[1] ? (this._$AH = Array(s8.length - 1).fill(new String()), this.strings = s8) : this._$AH = A2;
  }
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t5, i5 = this, s8, e7) {
    const o8 = this.strings;
    let n8 = false;
    if (void 0 === o8)
      t5 = S4(this, t5, i5, 0), n8 = !d4(t5) || t5 !== this._$AH && t5 !== T2, n8 && (this._$AH = t5);
    else {
      const e8 = t5;
      let l6, h5;
      for (t5 = o8[0], l6 = 0; l6 < o8.length - 1; l6++)
        h5 = S4(this, e8[s8 + l6], i5, l6), h5 === T2 && (h5 = this._$AH[l6]), n8 || (n8 = !d4(h5) || h5 !== this._$AH[l6]), h5 === A2 ? t5 = A2 : t5 !== A2 && (t5 += (null != h5 ? h5 : "") + o8[l6 + 1]), this._$AH[l6] = h5;
    }
    n8 && !e7 && this.j(t5);
  }
  j(t5) {
    t5 === A2 ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, null != t5 ? t5 : "");
  }
};
var H2 = class extends k2 {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t5) {
    this.element[this.name] = t5 === A2 ? void 0 : t5;
  }
};
var I2 = s6 ? s6.emptyScript : "";
var L2 = class extends k2 {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t5) {
    t5 && t5 !== A2 ? this.element.setAttribute(this.name, I2) : this.element.removeAttribute(this.name);
  }
};
var z2 = class extends k2 {
  constructor(t5, i5, s8, e7, o8) {
    super(t5, i5, s8, e7, o8), this.type = 5;
  }
  _$AI(t5, i5 = this) {
    var s8;
    if ((t5 = null !== (s8 = S4(this, t5, i5, 0)) && void 0 !== s8 ? s8 : A2) === T2)
      return;
    const e7 = this._$AH, o8 = t5 === A2 && e7 !== A2 || t5.capture !== e7.capture || t5.once !== e7.once || t5.passive !== e7.passive, n8 = t5 !== A2 && (e7 === A2 || o8);
    o8 && this.element.removeEventListener(this.name, this, e7), n8 && this.element.addEventListener(this.name, this, t5), this._$AH = t5;
  }
  handleEvent(t5) {
    var i5, s8;
    "function" == typeof this._$AH ? this._$AH.call(null !== (s8 = null === (i5 = this.options) || void 0 === i5 ? void 0 : i5.host) && void 0 !== s8 ? s8 : this.element, t5) : this._$AH.handleEvent(t5);
  }
};
var Z2 = class {
  constructor(t5, i5, s8) {
    this.element = t5, this.type = 6, this._$AN = void 0, this._$AM = i5, this.options = s8;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t5) {
    S4(this, t5);
  }
};
var B2 = i4.litHtmlPolyfillSupport;
null == B2 || B2(N2, R2), (null !== (t4 = i4.litHtmlVersions) && void 0 !== t4 ? t4 : i4.litHtmlVersions = []).push("2.8.0");
var D = (t5, i5, s8) => {
  var e7, o8;
  const n8 = null !== (e7 = null == s8 ? void 0 : s8.renderBefore) && void 0 !== e7 ? e7 : i5;
  let l6 = n8._$litPart$;
  if (void 0 === l6) {
    const t6 = null !== (o8 = null == s8 ? void 0 : s8.renderBefore) && void 0 !== o8 ? o8 : null;
    n8._$litPart$ = l6 = new R2(i5.insertBefore(u4(), t6), t6, void 0, null != s8 ? s8 : {});
  }
  return l6._$AI(t5), l6;
};

// node_modules/lit-element/lit-element.js
var l5;
var o7;
var s7 = class extends u3 {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var t5, e7;
    const i5 = super.createRenderRoot();
    return null !== (t5 = (e7 = this.renderOptions).renderBefore) && void 0 !== t5 || (e7.renderBefore = i5.firstChild), i5;
  }
  update(t5) {
    const i5 = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t5), this._$Do = D(i5, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var t5;
    super.connectedCallback(), null === (t5 = this._$Do) || void 0 === t5 || t5.setConnected(true);
  }
  disconnectedCallback() {
    var t5;
    super.disconnectedCallback(), null === (t5 = this._$Do) || void 0 === t5 || t5.setConnected(false);
  }
  render() {
    return T2;
  }
};
s7.finalized = true, s7._$litElement$ = true, null === (l5 = globalThis.litElementHydrateSupport) || void 0 === l5 || l5.call(globalThis, { LitElement: s7 });
var n7 = globalThis.litElementPolyfillSupport;
null == n7 || n7({ LitElement: s7 });
(null !== (o7 = globalThis.litElementVersions) && void 0 !== o7 ? o7 : globalThis.litElementVersions = []).push("3.3.3");

// src/media.js
var MOBILE_LANDSCAPE = "(max-width: 767px)";
var TABLET_DOWN = "(max-width: 1199px)";
var TABLET_UP = "(min-width: 768px)";
var DESKTOP_UP = "(min-width: 1200px)";
var LARGE_DESKTOP = "(min-width: 1600px)";

// src/merch-card.css.js
var styles = i3`
    :host {
        --consonant-merch-card-background-color: #fff;
        --consonant-merch-card-border: 1px solid var(--consonant-merch-card-border-color);
        -webkit-font-smoothing: antialiased;
        background-color: var(--consonant-merch-card-background-color);
        border-radius: var(--consonant-merch-spacing-xs);
        border: var(--consonant-merch-card-border);
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        font-family: var(--merch-body-font-family, 'Adobe Clean');
        grid-template-columns: repeat(auto-fit, minmax(300px, max-content));
        position: relative;
        text-align: start;
    }

    :host([failed]) {
        display: none;
    }

    :host(.placeholder) {
        visibility: hidden;
    }

    :host([aria-selected]) {
        outline: none;
        box-shadow: inset 0 0 0 2px var(--color-accent);
    }

    .invisible {
        visibility: hidden;
    }

    :host(:hover) .invisible,
    :host(:active) .invisible,
    :host(:focus) .invisible {
        visibility: visible;
        background-image: var(--ellipsis-icon);
        cursor: pointer;
    }

    .action-menu.always-visible {
        visibility: visible;
        background-image: var(--ellipsis-icon);
        cursor: pointer;
    }

    .top-section {
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        gap: 16px;
    }

    .top-section.badge {
        min-height: 32px;
    }

    .body {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        height: 100%;
        gap: var(--consonant-merch-spacing-xxs);
        padding: var(--consonant-merch-spacing-xs);
    }

    footer {
        display: flex;
        justify-content: flex-end;
        box-sizing: border-box;
        align-items: flex-end;
        width: 100%;
        flex-flow: wrap;
        gap: var(--consonant-merch-spacing-xs);

        padding: var(--consonant-merch-spacing-xs);
    }
    
    footer.wide-footer {
        align-items: center;
    }
    
    footer.wide-footer .secure-transaction-label {
        flex: 0 1 auto;
    }
    
    footer.footer-column {
        flex-direction: column;
    }
    
    footer.footer-column .secure-transaction-label {
        align-self: flex-start;
    }

    hr {
        background-color: var(--merch-color-grey-200);
        border: none;
        height: 1px;
        width: auto;
        margin-top: 0;
        margin-bottom: 0;
        margin-left: var(--consonant-merch-spacing-xs);
        margin-right: var(--consonant-merch-spacing-xs);
    }

    div[class$='-badge'] {
        position: absolute;
        top: 16px;
        right: 0;
        font-size: var(--type-heading-xxs-size);
        font-weight: 500;
        max-width: 180px;
        line-height: 16px;
        text-align: center;
        padding: 8px 11px;
        border-radius: 5px 0 0 5px;
    }

    div[class$='-badge']:dir(rtl) {
        left: 0;
        right: initial;
        padding: 8px 11px;
        border-radius: 0 5px 5px 0;
    }

    .detail-bg-container {
        right: 0;
        padding: var(--consonant-merch-spacing-xs);
        border-radius: 5px;
        font-size: var(--consonant-merch-card-body-font-size);
        margin: var(--consonant-merch-spacing-xs);
    }

    .action-menu {
        display: flex;
        width: 32px;
        height: 32px;
        position: absolute;
        top: 16px;
        right: 16px;
        background-color: #f6f6f6;
        background-repeat: no-repeat;
        background-position: center;
        background-size: 16px 16px;
        font-size: 0;
    }
    .hidden {
        visibility: hidden;
    }

    #stock-checkbox,
    .secure-transaction-label {
        font-size: var(--consonant-merch-card-body-xxs-font-size);
        line-height: 1.3;
        color: var(--merch-color-grey-600);
    }

    #stock-checkbox {
        display: inline-flex;
        align-items: center;
        cursor: pointer;
        gap: 10px; /*same as spectrum */
    }

    #stock-checkbox > input {
        display: none;
    }

    #stock-checkbox > span {
        display: inline-block;
        box-sizing: border-box;
        border: 2px solid rgb(117, 117, 117);
        border-radius: 2px;
        width: 14px;
        height: 14px;
    }

    #stock-checkbox > input:checked + span {
        background: var(--checkmark-icon) no-repeat var(--color-accent);
        border-color: var(--color-accent);
    }

    .secure-transaction-label {
        white-space: nowrap;
        display: inline-flex;
        gap: var(--consonant-merch-spacing-xxs);
        align-items: center;
        flex: 1;
        line-height: normal;
        align-self: center;
    }

    .secure-transaction-label::before {
        display: inline-block;
        content: '';
        width: 12px;
        height: 15px;
        background: var(--secure-icon) no-repeat;
        background-position: center;
        background-size: contain;
    }

    .checkbox-container {
        display: flex;
        align-items: center;
        gap: var(--consonant-merch-spacing-xxs);
    }

    .checkbox-container input[type='checkbox']:checked + .checkmark {
        background-color: var(--color-accent);
        background-image: var(--checkmark-icon);
        border-color: var(--color-accent);
    }

    .checkbox-container input[type='checkbox'] {
        display: none;
    }

    .checkbox-container .checkmark {
        position: relative;
        display: inline-block;
        width: 12px;
        height: 12px;
        border: 2px solid #757575;
        background: #fff;
        border-radius: 2px;
        cursor: pointer;
        margin-top: 2px;
    }

    slot[name='icons'] {
        display: flex;
        gap: 8px;
    }

    ::slotted([slot='price']) {
      color: var(--consonant-merch-card-price-color);
    }
`;
var sizeStyles = () => {
  const styles5 = [
    i3`
      /* Tablet */
      @media screen and ${r4(TABLET_UP)} {
          :host([size='wide']),
          :host([size='super-wide']) {
              width: 100%;
              grid-column: 1 / -1;
          }
      }

      /* Laptop */
      @media screen and ${r4(DESKTOP_UP)} {
          :host([size='wide']) {
              grid-column: span 2;
          }
      }
      `
  ];
  return styles5;
};

// src/merch-icon.js
var MerchIcon = class extends s7 {
  constructor() {
    super();
    this.size = "m";
    this.alt = "";
    this.loading = "lazy";
  }
  render() {
    const { href } = this;
    return href ? x2`<a href="${href}">
                  <img src="${this.src}" alt="${this.alt}" loading="${this.loading}" />
              </a>` : x2` <img src="${this.src}" alt="${this.alt}" loading="${this.loading}" />`;
  }
};
__publicField(MerchIcon, "properties", {
  size: { type: String, attribute: true },
  src: { type: String, attribute: true },
  alt: { type: String, attribute: true },
  href: { type: String, attribute: true },
  loading: { type: String, attribute: true }
});
__publicField(MerchIcon, "styles", i3`
        :host {
            --img-width: 32px;
            --img-height: 32px;
            display: block;
            width: var(--mod-img-width, var(--img-width));
            height: var(--mod-img-height, var(--img-height));
        }

        :host([size='s']) {
            --img-width: 24px;
            --img-height: 24px;
        }

        :host([size='m']) {
            --img-width: 30px;
            --img-height: 30px;
        }

        :host([size='l']) {
            --img-width: 40px;
            --img-height: 40px;
        }

        img {
            width: var(--mod-img-width, var(--img-width));
            height: var(--mod-img-height, var(--img-height));
        }
    `);
customElements.define("merch-icon", MerchIcon);

// src/variants/variant-layout.js
var _container;
var _VariantLayout = class _VariantLayout {
  constructor(card) {
    __publicField(this, "card");
    __privateAdd(this, _container, void 0);
    this.card = card;
    this.insertVariantStyle();
  }
  getContainer() {
    __privateSet(this, _container, __privateGet(this, _container) ?? this.card.closest('[class*="-merch-cards"]') ?? this.card.parentElement);
    return __privateGet(this, _container);
  }
  insertVariantStyle() {
    if (!_VariantLayout.styleMap[this.card.variant]) {
      _VariantLayout.styleMap[this.card.variant] = true;
      const styles5 = document.createElement("style");
      styles5.innerHTML = this.getGlobalCSS();
      document.head.appendChild(styles5);
    }
  }
  updateCardElementMinHeight(el, name) {
    if (!el)
      return;
    const elMinHeightPropertyName = `--consonant-merch-card-${this.card.variant}-${name}-height`;
    const height = Math.max(
      0,
      parseInt(window.getComputedStyle(el).height) || 0
    );
    const maxMinHeight = parseInt(
      this.getContainer().style.getPropertyValue(
        elMinHeightPropertyName
      )
    ) || 0;
    if (height > maxMinHeight) {
      this.getContainer().style.setProperty(
        elMinHeightPropertyName,
        `${height}px`
      );
    }
  }
  get badge() {
    let additionalStyles;
    if (!this.card.badgeBackgroundColor || !this.card.badgeColor || !this.card.badgeText) {
      return;
    }
    if (this.evergreen) {
      additionalStyles = `border: 1px solid ${this.card.badgeBackgroundColor}; border-right: none;`;
    }
    return x2`
            <div
                id="badge"
                class="${this.card.variant}-badge"
                style="background-color: ${this.card.badgeBackgroundColor};
                color: ${this.card.badgeColor};
                ${additionalStyles}"
            >
                ${this.card.badgeText}
            </div>
        `;
  }
  get cardImage() {
    return x2` <div class="image">
            <slot name="bg-image"></slot>
            ${this.badge}
        </div>`;
  }
  /* c8 ignore next 3 */
  getGlobalCSS() {
    return "";
  }
  /* c8 ignore next 3 */
  get theme() {
    return document.querySelector("sp-theme");
  }
  get evergreen() {
    return this.card.classList.contains("intro-pricing");
  }
  get promoBottom() {
    return this.card.classList.contains("promo-bottom");
  }
  get headingSelector() {
    return '[slot="heading-xs"]';
  }
  get secureLabelFooter() {
    const secureLabel = this.card.secureLabel ? x2`<span class="secure-transaction-label"
                  >${this.card.secureLabel}</span
              >` : "";
    return x2`<footer>${secureLabel}<slot name="footer"></slot></footer>`;
  }
  async adjustTitleWidth() {
    const cardWidth = this.card.getBoundingClientRect().width;
    const badgeWidth = this.card.badgeElement?.getBoundingClientRect().width || 0;
    if (cardWidth === 0 || badgeWidth === 0)
      return;
    this.card.style.setProperty(
      "--consonant-merch-card-heading-xs-max-width",
      `${Math.round(cardWidth - badgeWidth - 16)}px`
      // consonant-merch-spacing-xs
    );
  }
  postCardUpdateHook() {
  }
  connectedCallbackHook() {
  }
  disconnectedCallbackHook() {
  }
  /* c8 ignore next 3 */
  renderLayout() {
  }
  /* c8 ignore next 4 */
  get aemFragmentMapping() {
    return void 0;
  }
};
_container = new WeakMap();
__publicField(_VariantLayout, "styleMap", {});
var VariantLayout = _VariantLayout;

// src/variants/catalog.css.js
var CSS = `
:root {
  --consonant-merch-card-catalog-width: 276px;
  --consonant-merch-card-catalog-icon-size: 40px;
}
.one-merch-card.catalog,
.two-merch-cards.catalog,
.three-merch-cards.catalog,
.four-merch-cards.catalog {
    grid-template-columns: var(--consonant-merch-card-catalog-width);
}

@media screen and ${TABLET_UP} {
    :root {
      --consonant-merch-card-catalog-width: 302px;
    }

    .two-merch-cards.catalog,
    .three-merch-cards.catalog,
    .four-merch-cards.catalog {
        grid-template-columns: repeat(2, var(--consonant-merch-card-catalog-width));
    }
}

@media screen and ${DESKTOP_UP} {
    :root {
      --consonant-merch-card-catalog-width: 276px;
    }

    .three-merch-cards.catalog,
    .four-merch-cards.catalog {
        grid-template-columns: repeat(3, var(--consonant-merch-card-catalog-width));
    }
}

@media screen and ${LARGE_DESKTOP} {
    .four-merch-cards.catalog {
        grid-template-columns: repeat(4, var(--consonant-merch-card-catalog-width));
    }
}

merch-card[variant="catalog"] [slot="action-menu-content"] {
  background-color: #000;
  color: var(--color-white, #fff);
  font-size: var(--consonant-merch-card-body-xs-font-size);
  width: fit-content;
  padding: var(--consonant-merch-spacing-xs);
  border-radius: var(--consonant-merch-spacing-xxxs);
  position: absolute;
  top: 55px;
  right: 15px;
  line-height: var(--consonant-merch-card-body-line-height);
}

merch-card[variant="catalog"] [slot="action-menu-content"] ul {
  padding-left: 0;
  padding-bottom: var(--consonant-merch-spacing-xss);
  margin-top: 0;
  margin-bottom: 0;
  list-style-position: inside;
  list-style-type: '\u2022 ';
}

merch-card[variant="catalog"] [slot="action-menu-content"] ul li {
  padding-left: 0;
  line-height: var(--consonant-merch-card-body-line-height);
}

merch-card[variant="catalog"] [slot="action-menu-content"] ::marker {
  margin-right: 0;
}

merch-card[variant="catalog"] [slot="action-menu-content"] p {
  color: var(--color-white, #fff);
}

merch-card[variant="catalog"] [slot="action-menu-content"] a {
  color: var(--consonant-merch-card-background-color);
  text-decoration: underline;
}

merch-card[variant="catalog"] .payment-details {
  font-size: var(--consonant-merch-card-body-font-size);
  font-style: italic;
  font-weight: 400;
  line-height: var(--consonant-merch-card-body-line-height);
}`;

// src/variants/catalog.js
var CATALOG_AEM_FRAGMENT_MAPPING = {
  badge: true,
  ctas: { slot: "footer", size: "m" },
  description: { tag: "div", slot: "body-xs" },
  mnemonics: { size: "l" },
  prices: { tag: "h3", slot: "heading-xs" },
  size: ["wide", "super-wide"],
  title: { tag: "h3", slot: "heading-xs" }
};
var Catalog = class extends VariantLayout {
  constructor(card) {
    super(card);
    __publicField(this, "dispatchActionMenuToggle", () => {
      this.card.dispatchEvent(
        new CustomEvent(EVENT_MERCH_CARD_ACTION_MENU_TOGGLE, {
          bubbles: true,
          composed: true,
          detail: {
            card: this.card.name,
            type: "action-menu"
          }
        })
      );
    });
    __publicField(this, "toggleActionMenu", (e7) => {
      if (!this.actionMenuContentSlot || !e7 || e7.type !== "click" && e7.code !== "Space" && e7.code !== "Enter")
        return;
      e7.preventDefault();
      this.actionMenuContentSlot.classList.toggle("hidden");
      const isHidden = this.actionMenuContentSlot.classList.contains("hidden");
      if (!isHidden)
        this.dispatchActionMenuToggle();
      this.setAriaExpanded(this.actionMenu, (!isHidden).toString());
    });
    __publicField(this, "toggleActionMenuFromCard", (e7) => {
      const retract = e7?.type === "mouseleave" ? true : void 0;
      this.card.blur();
      this.actionMenu?.classList.remove("always-visible");
      if (!this.actionMenuContentSlot)
        return;
      if (!retract)
        this.dispatchActionMenuToggle();
      this.actionMenuContentSlot.classList.toggle("hidden", retract);
      this.setAriaExpanded(this.actionMenu, "false");
    });
    __publicField(this, "hideActionMenu", (e7) => {
      this.actionMenuContentSlot?.classList.add("hidden");
      this.setAriaExpanded(this.actionMenu, "false");
    });
  }
  /* c8 ignore next 3 */
  get aemFragmentMapping() {
    return CATALOG_AEM_FRAGMENT_MAPPING;
  }
  get actionMenu() {
    return this.card.shadowRoot.querySelector(".action-menu");
  }
  get actionMenuContentSlot() {
    return this.card.shadowRoot.querySelector('slot[name="action-menu-content"]');
  }
  renderLayout() {
    return x2` <div class="body">
                <div class="top-section">
                    <slot name="icons"></slot> ${this.badge}
                    <div
                        class="action-menu
                ${isMobileOrTablet() && this.card.actionMenu ? "always-visible" : ""}
                ${!this.card.actionMenu ? "hidden" : "invisible"}"
                        @click="${this.toggleActionMenu}"
                        @keypress="${this.toggleActionMenu}"
                        tabindex="0"
                        aria-expanded="false"
                        role="button"
                    >${this.card.actionMenuLabel} - ${this.card.title}</div>
                </div>
                <slot
                    name="action-menu-content"
                    class="action-menu-content
            ${!this.card.actionMenuContent ? "hidden" : ""}"
                    @focusout="${this.hideActionMenu}"
                    >${this.card.actionMenuContent}
                </slot>
                <slot name="heading-xs"></slot>
                <slot name="heading-m"></slot>
                <slot name="body-xxs"></slot>
                ${!this.promoBottom ? x2`<slot name="promo-text"></slot
                          ><slot name="callout-content"></slot>` : ""}
                <slot name="body-xs"></slot>
                ${this.promoBottom ? x2`<slot name="promo-text"></slot
                          ><slot name="callout-content"></slot>` : ""}
            </div>
            ${this.secureLabelFooter}
            <slot></slot>`;
  }
  getGlobalCSS() {
    return CSS;
  }
  setAriaExpanded(element, value) {
    element.setAttribute("aria-expanded", value);
  }
  connectedCallbackHook() {
    this.card.addEventListener("mouseleave", this.toggleActionMenuFromCard);
  }
  disconnectedCallbackHook() {
    this.card.removeEventListener("mouseleave", this.toggleActionMenuFromCard);
  }
};
__publicField(Catalog, "variantStyle", i3`
        :host([variant='catalog']) {
            min-height: 330px;
            width: var(--consonant-merch-card-catalog-width);
        }

        .body .catalog-badge {
            display: flex;
            height: fit-content;
            flex-direction: column;
            width: fit-content;
            max-width: 140px;
            border-radius: 5px;
            position: relative;
            top: 0;
            margin-left: var(--consonant-merch-spacing-xxs);
            box-sizing: border-box;
        }
    `);

// src/variants/image.css.js
var CSS2 = `
:root {
  --consonant-merch-card-image-width: 300px;
}

.one-merch-card.image,
.two-merch-cards.image,
.three-merch-cards.image,
.four-merch-cards.image {
  grid-template-columns: var(--consonant-merch-card-image-width);
}

@media screen and ${TABLET_UP} {
  .two-merch-cards.image,
  .three-merch-cards.image,
  .four-merch-cards.image {
      grid-template-columns: repeat(2, var(--consonant-merch-card-image-width));
  }
}

@media screen and ${DESKTOP_UP} {
  :root {
    --consonant-merch-card-image-width: 378px;
    --consonant-merch-card-image-width-4clm: 276px;
  }
    
  .three-merch-cards.image {
      grid-template-columns: repeat(3, var(--consonant-merch-card-image-width));
  }

  .four-merch-cards.image {
      grid-template-columns: repeat(4, var(--consonant-merch-card-image-width-4clm));
  }
}
`;

// src/variants/image.js
var Image2 = class extends VariantLayout {
  constructor(card) {
    super(card);
  }
  getGlobalCSS() {
    return CSS2;
  }
  renderLayout() {
    return x2`${this.cardImage}
    <div class="body">
        <slot name="icons"></slot>
        <slot name="heading-xs"></slot>
        <slot name="body-xxs"></slot>
        ${this.promoBottom ? x2`<slot name="body-xs"></slot><slot name="promo-text"></slot>` : x2`<slot name="promo-text"></slot><slot name="body-xs"></slot>`}
    </div>
    ${this.evergreen ? x2`
              <div
                  class="detail-bg-container"
                  style="background: ${this.card["detailBg"]}"
              >
                  <slot name="detail-bg"></slot>
              </div>
          ` : x2`
              <hr />
              ${this.secureLabelFooter}
          `}`;
  }
};

// src/variants/inline-heading.css.js
var CSS3 = `
:root {
  --consonant-merch-card-inline-heading-width: 300px;
}

.one-merch-card.inline-heading,
.two-merch-cards.inline-heading,
.three-merch-cards.inline-heading,
.four-merch-cards.inline-heading {
    grid-template-columns: var(--consonant-merch-card-inline-heading-width);
}

@media screen and ${TABLET_UP} {
  .two-merch-cards.inline-heading,
  .three-merch-cards.inline-heading,
  .four-merch-cards.inline-heading {
      grid-template-columns: repeat(2, var(--consonant-merch-card-inline-heading-width));
  }
}

@media screen and ${DESKTOP_UP} {
  :root {
    --consonant-merch-card-inline-heading-width: 378px;
  }

  .three-merch-cards.inline-heading,
  .four-merch-cards.inline-heading {
      grid-template-columns: repeat(3, var(--consonant-merch-card-inline-heading-width));
  }
}

@media screen and ${LARGE_DESKTOP} {
  .four-merch-cards.inline-heading {
      grid-template-columns: repeat(4, var(--consonant-merch-card-inline-heading-width));
  }
}
`;

// src/variants/inline-heading.js
var InlineHeading = class extends VariantLayout {
  constructor(card) {
    super(card);
  }
  getGlobalCSS() {
    return CSS3;
  }
  renderLayout() {
    return x2` ${this.badge}
    <div class="body">
        <div class="top-section">
            <slot name="icons"></slot>
            <slot name="heading-xs"></slot>
        </div>
        <slot name="body-xs"></slot>
    </div>
    ${!this.card.customHr ? x2`<hr />` : ""} ${this.secureLabelFooter}`;
  }
};

// src/variants/mini-compare-chart.css.js
var CSS4 = `
  :root {
    --consonant-merch-card-mini-compare-chart-icon-size: 32px;
    --consonant-merch-card-mini-compare-mobile-cta-font-size: 15px;
    --consonant-merch-card-mini-compare-mobile-cta-width: 75px;
    --consonant-merch-card-mini-compare-badge-mobile-max-width: 50px;
  }
  
  merch-card[variant="mini-compare-chart"] [slot="heading-m"] {
    padding: 0 var(--consonant-merch-spacing-s) 0;
  }

  merch-card[variant="mini-compare-chart"].bullet-list [slot="heading-m"] {
    padding: var(--consonant-merch-spacing-xxs) var(--consonant-merch-spacing-xs);
    font-size: var(--consonant-merch-card-heading-xs-font-size);
  }

  merch-card[variant="mini-compare-chart"].bullet-list [slot='heading-m-price'] {
    font-size: var(--consonant-merch-card-body-xxl-font-size);
    padding: 0 var(--consonant-merch-spacing-xs);
  }

  merch-card[variant="mini-compare-chart"] [slot="body-m"] {
    padding: var(--consonant-merch-spacing-xs) var(--consonant-merch-spacing-s);
  }

  merch-card[variant="mini-compare-chart"].bullet-list [slot="body-m"] {
    padding: var(--consonant-merch-spacing-xs);
  }

  merch-card[variant="mini-compare-chart"] [is="inline-price"] {
    display: inline-block;
    min-height: 30px;
    min-width: 1px;
  }

  merch-card[variant="mini-compare-chart"] [slot='callout-content'] {
    padding: var(--consonant-merch-spacing-xs) var(--consonant-merch-spacing-s) 0px;
  }

  merch-card[variant="mini-compare-chart"].bullet-list [slot='callout-content'] {
    padding: var(--consonant-merch-spacing-xs) var(--consonant-merch-spacing-xs) 0px;
  }

  merch-card[variant="mini-compare-chart"] [slot='callout-content'] [is="inline-price"] {
    min-height: unset;
  }

  merch-card[variant="mini-compare-chart"] [slot="price-commitment"] {
    font-size: var(--consonant-merch-card-body-xs-font-size);
    padding: 0 var(--consonant-merch-spacing-s);
  }

  merch-card[variant="mini-compare-chart"] [slot="price-commitment"] a {
    display: inline-block;
    height: 27px;
  }

  merch-card[variant="mini-compare-chart"] [slot="offers"] {
    font-size: var(--consonant-merch-card-body-xs-font-size);
  }

  merch-card[variant="mini-compare-chart"] [slot="body-xxs"] {
    font-size: var(--consonant-merch-card-body-xs-font-size);
    padding: var(--consonant-merch-spacing-xs) var(--consonant-merch-spacing-s) 0;    
  }

   merch-card[variant="mini-compare-chart"].bullet-list [slot="body-xxs"] {
    padding: var(--consonant-merch-spacing-xs) var(--consonant-merch-spacing-xs) 0;    
  }

  merch-card[variant="mini-compare-chart"] [slot="promo-text"] {
    font-size: var(--consonant-merch-card-body-m-font-size);
    padding: var(--consonant-merch-spacing-xs) var(--consonant-merch-spacing-s) 0;
  }

  merch-card[variant="mini-compare-chart"].bullet-list [slot="promo-text"] {
    padding: var(--consonant-merch-spacing-xs) var(--consonant-merch-spacing-xs) 0;
  }

  merch-card[variant="mini-compare-chart"] [slot="promo-text"] a {
    text-decoration: underline;
  }

  merch-card[variant="mini-compare-chart"] .action-area {
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    flex-wrap: wrap;
    width: 100%;
    gap: var(--consonant-merch-spacing-xs);
  }

  merch-card[variant="mini-compare-chart"] [slot="footer-rows"] ul {
    margin-block-start: 0px;
    margin-block-end: 0px;
    padding-inline-start: 0px;
  }

  merch-card[variant="mini-compare-chart"] .footer-row-icon {
    display: flex;
    place-items: center;
  }

  merch-card[variant="mini-compare-chart"] .footer-row-icon img {
    max-width: initial;
    width: var(--consonant-merch-card-mini-compare-chart-icon-size);
    height: var(--consonant-merch-card-mini-compare-chart-icon-size);
  }

  merch-card[variant="mini-compare-chart"] .footer-rows-title {
    font-color: var(--merch-color-grey-80);
    font-weight: 700;
    padding-block-end: var(--consonant-merch-spacing-xxs);
    line-height: var(--consonant-merch-card-body-xs-line-height);
    font-size: var(--consonant-merch-card-body-xs-font-size);
  }

  merch-card[variant="mini-compare-chart"] .footer-row-cell {
    border-top: 1px solid var(--consonant-merch-card-border-color);
    display: flex;
    gap: var(--consonant-merch-spacing-xs);
    justify-content: start;
    place-items: center;
    padding: var(--consonant-merch-spacing-xs) var(--consonant-merch-spacing-s);
    margin-block: 0px;
  }

  merch-card[variant="mini-compare-chart"] .footer-row-icon-checkmark img {
    max-width: initial;
  }

  merch-card[variant="mini-compare-chart"] .footer-row-icon-checkmark {
    display: flex;
    align-items: center;
    height: 20px;
  }

  merch-card[variant="mini-compare-chart"] .footer-row-cell-checkmark {
    display: flex;
    gap: var(--consonant-merch-spacing-xs);
    justify-content: start;
    align-items: flex-start;
    margin-block: var(--consonant-merch-spacing-xxxs);
  }

  merch-card[variant="mini-compare-chart"] .footer-row-cell-description-checkmark {
    font-size: var(--consonant-merch-card-body-xs-font-size);
    font-weight: 400;
    line-height: var(--consonant-merch-card-body-xs-line-height);
  }

  merch-card[variant="mini-compare-chart"] .footer-row-cell-description {
    font-size: var(--consonant-merch-card-body-s-font-size);
    line-height: var(--consonant-merch-card-body-s-line-height);
  }

  merch-card[variant="mini-compare-chart"] .footer-row-cell-description p {
    color: var(--merch-color-grey-80);
    vertical-align: bottom;
  }

  merch-card[variant="mini-compare-chart"] .footer-row-cell-description a {
    color: var(--color-accent);
  }

  merch-card[variant="mini-compare-chart"] .chevron-icon {
    margin-left: 8px;
  }

  merch-card[variant="mini-compare-chart"] .checkmark-copy-container {
    display: none;
  }

  merch-card[variant="mini-compare-chart"] .checkmark-copy-container.open {
    display: block;
  }
  
.one-merch-card.mini-compare-chart {
  grid-template-columns: var(--consonant-merch-card-mini-compare-chart-wide-width);
  gap: var(--consonant-merch-spacing-xs);
}

.two-merch-cards.mini-compare-chart,
.three-merch-cards.mini-compare-chart,
.four-merch-cards.mini-compare-chart {
  grid-template-columns: repeat(2, var(--consonant-merch-card-mini-compare-chart-width));
  gap: var(--consonant-merch-spacing-xs);
}

/* mini compare mobile */ 
@media screen and ${MOBILE_LANDSCAPE} {
  :root {
    --consonant-merch-card-mini-compare-chart-width: 302px;
    --consonant-merch-card-mini-compare-chart-wide-width: 302px;
  }

  .two-merch-cards.mini-compare-chart,
  .three-merch-cards.mini-compare-chart,
  .four-merch-cards.mini-compare-chart {
    grid-template-columns: var(--consonant-merch-card-mini-compare-chart-width);
    gap: var(--consonant-merch-spacing-xs);
  }

  merch-card[variant="mini-compare-chart"] [slot='heading-m'] {
    font-size: var(--consonant-merch-card-body-s-font-size);
    line-height: var(--consonant-merch-card-body-s-line-height);
  }

  merch-card[variant="mini-compare-chart"] [slot='heading-m-price'] {
    font-size: var(--consonant-merch-card-body-s-font-size);
    line-height: var(--consonant-merch-card-body-s-line-height);
  }

  merch-card[variant="mini-compare-chart"] [slot='body-m'] {
    font-size: var(--consonant-merch-card-body-xs-font-size);
    line-height: var(--consonant-merch-card-body-xs-line-height);
  }
  
  merch-card[variant="mini-compare-chart"] [slot="promo-text"] {
    font-size: var(--consonant-merch-card-body-xs-font-size);
    line-height: var(--consonant-merch-card-body-xs-line-height);
  }
  merch-card[variant="mini-compare-chart"] .footer-row-cell-description {
    font-size: var(--consonant-merch-card-body-xs-font-size);
    line-height: var(--consonant-merch-card-body-xs-line-height);
  }
}

@media screen and ${TABLET_DOWN} {
  merch-card[variant="mini-compare-chart"] [slot='heading-m'] {
    font-size: var(--consonant-merch-card-body-s-font-size);
    line-height: var(--consonant-merch-card-body-s-line-height);
  }

  merch-card[variant="mini-compare-chart"] [slot='heading-m-price'] {
    font-size: var(--consonant-merch-card-body-s-font-size);
    line-height: var(--consonant-merch-card-body-s-line-height);
  }

  merch-card[variant="mini-compare-chart"] [slot='body-m'] {
    font-size: var(--consonant-merch-card-body-xs-font-size);
    line-height: var(--consonant-merch-card-body-xs-line-height);
  }

  merch-card[variant="mini-compare-chart"] [slot="promo-text"] {
    font-size: var(--consonant-merch-card-body-xs-font-size);
    line-height: var(--consonant-merch-card-body-xs-line-height);
  }
  
  merch-card[variant="mini-compare-chart"] .footer-row-cell-description {
    font-size: var(--consonant-merch-card-body-xs-font-size);
    line-height: var(--consonant-merch-card-body-xs-line-height);
  }
}
@media screen and ${TABLET_UP} {
  :root {
    --consonant-merch-card-mini-compare-chart-width: 302px;
    --consonant-merch-card-mini-compare-chart-wide-width: 302px;
  }

  .two-merch-cards.mini-compare-chart {
    grid-template-columns: repeat(2, minmax(var(--consonant-merch-card-mini-compare-chart-width), var(--consonant-merch-card-mini-compare-chart-wide-width)));
    gap: var(--consonant-merch-spacing-m);
  }

  .three-merch-cards.mini-compare-chart,
  .four-merch-cards.mini-compare-chart {
      grid-template-columns: repeat(2, minmax(var(--consonant-merch-card-mini-compare-chart-width), var(--consonant-merch-card-mini-compare-chart-wide-width)));
  }
}

/* desktop */
@media screen and ${DESKTOP_UP} {
  :root {
    --consonant-merch-card-mini-compare-chart-width: 378px;
    --consonant-merch-card-mini-compare-chart-wide-width: 484px;  
  }
  .one-merch-card.mini-compare-chart {
    grid-template-columns: var(--consonant-merch-card-mini-compare-chart-wide-width);
  }

  .two-merch-cards.mini-compare-chart {
    grid-template-columns: repeat(2, var(--consonant-merch-card-mini-compare-chart-wide-width));
    gap: var(--consonant-merch-spacing-m);
  }

  .three-merch-cards.mini-compare-chart,
  .four-merch-cards.mini-compare-chart {
    grid-template-columns: repeat(3, var(--consonant-merch-card-mini-compare-chart-width));
    gap: var(--consonant-merch-spacing-m);
  }
}

@media screen and ${LARGE_DESKTOP} {
  .four-merch-cards.mini-compare-chart {
      grid-template-columns: repeat(4, var(--consonant-merch-card-mini-compare-chart-width));
  }
}

merch-card .footer-row-cell:nth-child(1) {
  min-height: var(--consonant-merch-card-footer-row-1-min-height);
}

merch-card .footer-row-cell:nth-child(2) {
  min-height: var(--consonant-merch-card-footer-row-2-min-height);
}

merch-card .footer-row-cell:nth-child(3) {
  min-height: var(--consonant-merch-card-footer-row-3-min-height);
}

merch-card .footer-row-cell:nth-child(4) {
  min-height: var(--consonant-merch-card-footer-row-4-min-height);
}

merch-card .footer-row-cell:nth-child(5) {
  min-height: var(--consonant-merch-card-footer-row-5-min-height);
}

merch-card .footer-row-cell:nth-child(6) {
  min-height: var(--consonant-merch-card-footer-row-6-min-height);
}

merch-card .footer-row-cell:nth-child(7) {
  min-height: var(--consonant-merch-card-footer-row-7-min-height);
}

merch-card .footer-row-cell:nth-child(8) {
  min-height: var(--consonant-merch-card-footer-row-8-min-height);
}
`;

// src/variants/mini-compare-chart.js
var FOOTER_ROW_MIN_HEIGHT = 32;
var MiniCompareChart = class extends VariantLayout {
  constructor(card) {
    super(card);
    __publicField(this, "getRowMinHeightPropertyName", (index) => `--consonant-merch-card-footer-row-${index}-min-height`);
    __publicField(this, "getMiniCompareFooter", () => {
      const secureLabel = this.card.secureLabel ? x2`<slot name="secure-transaction-label">
              <span class="secure-transaction-label"
                  >${this.card.secureLabel}</span
              ></slot
          >` : x2`<slot name="secure-transaction-label"></slot>`;
      return x2`<footer>${secureLabel}<slot name="footer"></slot></footer>`;
    });
  }
  getGlobalCSS() {
    return CSS4;
  }
  adjustMiniCompareBodySlots() {
    if (this.card.getBoundingClientRect().width <= 2)
      return;
    this.updateCardElementMinHeight(
      this.card.shadowRoot.querySelector(".top-section"),
      "top-section"
    );
    let slots = [
      "heading-m",
      "body-m",
      "heading-m-price",
      "body-xxs",
      "price-commitment",
      "offers",
      "promo-text",
      "callout-content"
    ];
    if (this.card.classList.contains("bullet-list")) {
      slots.push("footer-rows");
    }
    slots.forEach(
      (slot) => this.updateCardElementMinHeight(
        this.card.shadowRoot.querySelector(`slot[name="${slot}"]`),
        slot
      )
    );
    this.updateCardElementMinHeight(
      this.card.shadowRoot.querySelector("footer"),
      "footer"
    );
    const badge = this.card.shadowRoot.querySelector(
      ".mini-compare-chart-badge"
    );
    if (badge && badge.textContent !== "") {
      this.getContainer().style.setProperty(
        "--consonant-merch-card-mini-compare-chart-top-section-mobile-height",
        "32px"
      );
    }
  }
  adjustMiniCompareFooterRows() {
    if (this.card.getBoundingClientRect().width === 0)
      return;
    const footerRows = this.card.querySelector('[slot="footer-rows"] ul');
    if (!footerRows || !footerRows.children)
      return;
    [...footerRows.children].forEach((el, index) => {
      const height = Math.max(
        FOOTER_ROW_MIN_HEIGHT,
        parseFloat(window.getComputedStyle(el).height) || 0
      );
      const maxMinHeight = parseFloat(
        this.getContainer().style.getPropertyValue(
          this.getRowMinHeightPropertyName(index + 1)
        )
      ) || 0;
      if (height > maxMinHeight) {
        this.getContainer().style.setProperty(
          this.getRowMinHeightPropertyName(index + 1),
          `${height}px`
        );
      }
    });
  }
  removeEmptyRows() {
    const footerRows = this.card.querySelectorAll(".footer-row-cell");
    footerRows.forEach((row) => {
      const rowDescription = row.querySelector(".footer-row-cell-description");
      if (rowDescription) {
        const isEmpty = !rowDescription.textContent.trim();
        if (isEmpty) {
          row.remove();
        }
      }
    });
  }
  renderLayout() {
    return x2` <div class="top-section${this.badge ? " badge" : ""}">
            <slot name="icons"></slot> ${this.badge}
        </div>
        <slot name="heading-m"></slot>
        ${this.card.classList.contains("bullet-list") ? x2`<slot name="heading-m-price"></slot>
          <slot name="body-m"></slot>` : x2`<slot name="body-m"></slot>
          <slot name="heading-m-price"></slot>`}
        <slot name="body-xxs"></slot>
        <slot name="price-commitment"></slot>
        <slot name="offers"></slot>
        <slot name="promo-text"></slot>
        <slot name="callout-content"></slot>
        ${this.getMiniCompareFooter()}
        <slot name="footer-rows"><slot name="body-s"></slot></slot>`;
  }
  async postCardUpdateHook() {
    if (!isMobile()) {
      await Promise.all(this.card.prices.map((price2) => price2.onceSettled()));
      this.adjustMiniCompareBodySlots();
      this.adjustMiniCompareFooterRows();
    } else {
      this.removeEmptyRows();
    }
  }
};
__publicField(MiniCompareChart, "variantStyle", i3`
    :host([variant='mini-compare-chart']) > slot:not([name='icons']) {
        display: block;
    }
    :host([variant='mini-compare-chart']) footer {
        min-height: var(--consonant-merch-card-mini-compare-chart-footer-height);
        padding: var(--consonant-merch-spacing-s);
    }

    :host([variant='mini-compare-chart'].bullet-list) footer {
        flex-flow: column nowrap;
        min-height: var(--consonant-merch-card-mini-compare-chart-footer-height);
        padding: var(--consonant-merch-spacing-xs);
    }

    /* mini-compare card  */
    :host([variant='mini-compare-chart']) .top-section {
        padding-top: var(--consonant-merch-spacing-s);
        padding-inline-start: var(--consonant-merch-spacing-s);
        height: var(--consonant-merch-card-mini-compare-chart-top-section-height);
    }

    :host([variant='mini-compare-chart'].bullet-list) .top-section {
        padding-top: var(--consonant-merch-spacing-xs);
        padding-inline-start: var(--consonant-merch-spacing-xs);
    }

    :host([variant='mini-compare-chart'].bullet-list) .secure-transaction-label {
      align-self: flex-start;
      flex: none;
      color: var(--merch-color-grey-700);
    }

    @media screen and ${r4(TABLET_DOWN)} {
        [class*'-merch-cards'] :host([variant='mini-compare-chart']) footer {
            flex-direction: column;
            align-items: stretch;
            text-align: center;
        }
    }

    @media screen and ${r4(DESKTOP_UP)} {
        :host([variant='mini-compare-chart']) footer {
            padding: var(--consonant-merch-spacing-xs)
                var(--consonant-merch-spacing-s)
                var(--consonant-merch-spacing-s)
                var(--consonant-merch-spacing-s);
        }
    }

    :host([variant='mini-compare-chart']) slot[name='footer-rows'] {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: end;
    }
    /* mini-compare card heights for the slots: heading-m, body-m, heading-m-price, price-commitment, offers, promo-text, footer */
    :host([variant='mini-compare-chart']) slot[name='heading-m'] {
        min-height: var(--consonant-merch-card-mini-compare-chart-heading-m-height);
    }
    :host([variant='mini-compare-chart']) slot[name='body-m'] {
        min-height: var(--consonant-merch-card-mini-compare-chart-body-m-height);
    }
    :host([variant='mini-compare-chart']) slot[name='heading-m-price'] {
        min-height: var(
            --consonant-merch-card-mini-compare-chart-heading-m-price-height
        );
    }
    :host([variant='mini-compare-chart']) slot[name='body-xxs'] {
        min-height: var(
            --consonant-merch-card-mini-compare-chart-body-xxs-height
        );
    }
    :host([variant='mini-compare-chart']) slot[name='price-commitment'] {
        min-height: var(
            --consonant-merch-card-mini-compare-chart-price-commitment-height
        );
    }
    :host([variant='mini-compare-chart']) slot[name='offers'] {
        min-height: var(--consonant-merch-card-mini-compare-chart-offers-height);
    }
    :host([variant='mini-compare-chart']) slot[name='promo-text'] {
        min-height: var(--consonant-merch-card-mini-compare-chart-promo-text-height);
    }
    :host([variant='mini-compare-chart']) slot[name='callout-content'] {
        min-height: var(
            --consonant-merch-card-mini-compare-chart-callout-content-height
        );
    }
    :host([variant='mini-compare-chart']) slot[name='footer-rows'] {
        justify-content: flex-start;
    }
  `);

// src/variants/plans.css.js
var CSS5 = `
:root {
    --consonant-merch-card-plans-width: 300px;
    --consonant-merch-card-plans-icon-size: 40px;
}

merch-card[variant="plans"] {
    --consonant-merch-card-callout-icon-size: 18px;
    width: var(--consonant-merch-card-plans-width);
}

merch-card[variant="plans"] [slot="icons"] {
    --img-width: 41.5px;
}

merch-card[variant="plans"] [slot="heading-xs"] span.price.price-strikethrough,
merch-card[variant="plans"] [slot="heading-m"] span.price.price-strikethrough {
    line-height: var(--consonant-merch-card-body-xs-line-height);
    font-weight: 700;
}

merch-card[variant="plans"] [slot="promo-text"] {
    line-height: var(--consonant-merch-card-body-xs-line-height);
}

merch-card-collection merch-card[variant="plans"] {
  width: auto;
}

merch-card[variant="plans"] [slot="description"] {
    min-height: 84px;
}

merch-card[variant="plans"] [slot="body-xs"] a {
    color: var(--link-color);
}

merch-card[variant="plans"] [slot="promo-text"] a {
    color: inherit;
}

merch-card[variant="plans"] [slot="callout-content"] {
    margin: 8px 0 0;
}

merch-card[variant="plans"] [slot='callout-content'] > div > div,
merch-card[variant="plans"] [slot="callout-content"] > p {
    padding: 2px 10px 3px;
    background: #D9D9D9;
}

merch-card[variant="plans"] [slot='callout-content'] > p,
merch-card[variant="plans"] [slot='callout-content'] > div > div > div {
    color: #000;
}

merch-card[variant="plans"] [slot="callout-content"] img,
merch-card[variant="plans"] [slot="callout-content"] .icon-button {
    margin: 1.5px 0 1.5px 8px;
}

merch-card[variant="plans"] [slot="callout-content"] .icon-button::before {
    width: 18px;
    height: 18px;
    background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="14" width="14"><path fill="%232c2c2c" d="M7 .778A6.222 6.222 0 1 0 13.222 7 6.222 6.222 0 0 0 7 .778zM6.883 2.45a1.057 1.057 0 0 1 1.113.998q.003.05.001.1a1.036 1.036 0 0 1-1.114 1.114A1.052 1.052 0 0 1 5.77 3.547 1.057 1.057 0 0 1 6.784 2.45q.05-.002.1.001zm1.673 8.05a.389.389 0 0 1-.39.389H5.834a.389.389 0 0 1-.389-.389v-.778a.389.389 0 0 1 .39-.389h.388V7h-.389a.389.389 0 0 1-.389-.389v-.778a.389.389 0 0 1 .39-.389h1.555a.389.389 0 0 1 .389.39v3.5h.389a.389.389 0 0 1 .389.388z"/></svg>');
    background-size: 18px 18px;
}

merch-card[variant="plans"] [slot="whats-included"] [slot="description"] {
  min-height: auto;
}

merch-card[variant="plans"] [slot="quantity-select"] {
    display: flex;
    justify-content: flex-start;
    box-sizing: border-box;
    width: 100%;
    padding-top: 16px;
}

merch-card[variant="plans"] [slot="footer"] a {
    line-height: 19px;
    padding: 3px 16px 4px;
}

.plans-container {
    display: flex;
    justify-content: center;
    gap: 36px;
}

.plans-container merch-card-collection {
    padding: 0;
}

/* Mobile */
@media screen and ${MOBILE_LANDSCAPE} {
    merch-whats-included merch-mnemonic-list,
    merch-whats-included [slot="heading"] {
        width: 100%;
    }
}

merch-card[variant="plans"]:not([size]) {
    merch-whats-included merch-mnemonic-list,
    merch-whats-included [slot="heading"] {
        width: 100%;
    }
} 

.one-merch-card.plans,
.two-merch-cards.plans,
.three-merch-cards.plans,
.four-merch-cards.plans {
    grid-template-columns: var(--consonant-merch-card-plans-width);
}

/* Tablet */
@media screen and ${TABLET_UP} {
  :root {
    --consonant-merch-card-plans-width: 302px;
  }
  .two-merch-cards.plans,
  .three-merch-cards.plans,
  .four-merch-cards.plans {
      grid-template-columns: repeat(2, var(--consonant-merch-card-plans-width));
  }
  .four-merch-cards.plans .foreground {
      max-width: unset;
  }
}

/* desktop */
@media screen and ${DESKTOP_UP} {
  :root {
    --consonant-merch-card-plans-width: 276px;
  }
  .three-merch-cards.plans,
  .four-merch-cards.plans {
      grid-template-columns: repeat(3, var(--consonant-merch-card-plans-width));
  }
}

/* Large desktop */
    @media screen and ${LARGE_DESKTOP} {
    .four-merch-cards.plans {
        grid-template-columns: repeat(4, var(--consonant-merch-card-plans-width));
    }
}
`;

// src/variants/plans.js
var PLANS_AEM_FRAGMENT_MAPPING = {
  title: { tag: "p", slot: "heading-xs" },
  prices: { tag: "p", slot: "heading-m" },
  promoText: { tag: "p", slot: "promo-text" },
  description: { tag: "div", slot: "body-xs" },
  mnemonics: { size: "l" },
  callout: { tag: "div", slot: "callout-content" },
  quantitySelect: { tag: "div", slot: "quantity-select" },
  stockOffer: true,
  secureLabel: true,
  badge: { tag: "div", slot: "badge" },
  allowedBadgeColors: ["spectrum-yellow-300-plans", "spectrum-gray-300-plans", "spectrum-gray-700-plans", "spectrum-green-900-plans"],
  allowedBorderColors: ["spectrum-yellow-300-plans", "spectrum-gray-300-plans"],
  borderColor: { attribute: "border-color" },
  size: ["wide", "super-wide"],
  whatsIncluded: { tag: "div", slot: "whats-included" },
  ctas: { slot: "footer", size: "m" },
  style: "consonant"
};
var Plans = class extends VariantLayout {
  constructor(card) {
    super(card);
    this.adaptForMobile = this.adaptForMobile.bind(this);
  }
  /* c8 ignore next 3 */
  get aemFragmentMapping() {
    return PLANS_AEM_FRAGMENT_MAPPING;
  }
  getGlobalCSS() {
    return CSS5;
  }
  adaptForMobile() {
    if (!this.card.closest("merch-card-collection,overlay-trigger")) {
      this.card.removeAttribute("size");
      return;
    }
    const shadowRoot = this.card.shadowRoot;
    const footer = shadowRoot.querySelector("footer");
    const size = this.card.getAttribute("size");
    const stockInFooter = shadowRoot.querySelector("footer #stock-checkbox");
    const stockInBody = shadowRoot.querySelector(".body #stock-checkbox");
    const body = shadowRoot.querySelector(".body");
    if (!size) {
      footer.classList.remove("wide-footer");
      if (stockInFooter)
        stockInFooter.remove();
      return;
    }
    const mobile = isMobile();
    if (footer)
      footer.classList.toggle("wide-footer", !mobile);
    if (mobile && stockInFooter) {
      stockInBody ? stockInFooter.remove() : body.appendChild(stockInFooter);
      return;
    }
    if (!mobile && stockInBody) {
      stockInFooter ? stockInBody.remove() : footer.prepend(stockInBody);
    }
  }
  postCardUpdateHook() {
    this.adaptForMobile();
    this.adjustTitleWidth();
  }
  get stockCheckbox() {
    return this.card.checkboxLabel ? x2`<label id="stock-checkbox">
                <input type="checkbox" @change=${this.card.toggleStockOffer}></input>
                <span></span>
                ${this.card.checkboxLabel}
            </label>` : "";
  }
  connectedCallbackHook() {
    const match = matchMobile();
    if (match?.addEventListener)
      match.addEventListener("change", this.adaptForMobile);
  }
  disconnectedCallbackHook() {
    const match = matchMobile();
    if (match?.removeEventListener)
      match.removeEventListener("change", this.adaptForMobile);
  }
  renderLayout() {
    return x2` ${this.badge}
        <div class="body">
            <slot name="icons"></slot>
            <slot name="heading-xs"></slot>
            <slot name="heading-m"></slot>
            <slot name="annualPrice"></slot>
            <slot name="priceLabel"></slot>
            <slot name="body-xxs"></slot>
            <slot name="promo-text"></slot>
            <slot name="body-xs"></slot>
            <slot name="whats-included"></slot>
            <slot name="callout-content"></slot>
            ${this.stockCheckbox}
            <slot name="badge"></slot>
            <slot name="quantity-select"></slot>
        </div>
        ${this.secureLabelFooter}`;
  }
};
__publicField(Plans, "variantStyle", i3`
    :host([variant='plans']) {
        min-height: 348px;
        border: 1px solid var(--merch-card-custom-border-color, #DADADA);
        --merch-card-plans-min-width: 244px;
        --merch-card-plans-max-width: 244px;
        --merch-card-plans-padding: 15px;
        --merch-card-plans-heading-min-height: 23px;
        --merch-color-green-promo: rgb(0, 122, 77);
        --secure-icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23505050' viewBox='0 0 12 15'%3E%3Cpath d='M11.5 6H11V5A5 5 0 1 0 1 5v1H.5a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5v-8a.5.5 0 0 0-.5-.5ZM3 5a3 3 0 1 1 6 0v1H3Zm4 6.111V12.5a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1.389a1.5 1.5 0 1 1 2 0Z'/%3E%3C/svg%3E");
        font-weight: 400;
    }

    :host([variant='plans']) ::slotted([slot='heading-xs']) {
        min-height: var(--merch-card-plans-heading-min-height);
    }

    :host([variant='plans']) .body {
        min-width: var(--merch-card-plans-min-width);
        max-width: var(--merch-card-plans-max-width);
        padding: var(--merch-card-plans-padding);
    }

    :host([variant='plans'][size]) .body {
        max-width: none;
    }

    :host([variant='plans']) .wide-footer #stock-checkbox {
        margin-top: 0;
    }

    :host([variant='plans']) #stock-checkbox {
        margin-top: 8px;
        gap: 9px;
        color: rgb(34, 34, 34);
        line-height: var(--consonant-merch-card-detail-xs-line-height);
        padding-top: 4px;
        padding-bottom: 5px;
    }

    :host([variant='plans']) #stock-checkbox > span {
        border: 2px solid rgb(109, 109, 109);
        width: 12px;
        height: 12px;
    }

    :host([variant='plans']) footer {
        padding: var(--merch-card-plans-padding);
        padding-top: 1px;
    }

    :host([variant='plans']) .secure-transaction-label {
        color: rgb(80, 80, 80);
        line-height: var(--consonant-merch-card-detail-xs-line-height);
    }
      
    :host([variant='plans']) ::slotted([slot='heading-xs']) {
        max-width: var(--consonant-merch-card-heading-xs-max-width, 100%);
    }

    :host([variant='plans']) #badge {
        border-radius: 4px 0 0 4px;
        font-weight: 400;
        line-height: 21px;
        padding: 2px 10px 3px;
    }
  `);

// src/variants/product.css.js
var CSS6 = `
:root {
  --consonant-merch-card-product-width: 300px;
}

/* grid style for product */
.one-merch-card.product,
.two-merch-cards.product,
.three-merch-cards.product,
.four-merch-cards.product {
    grid-template-columns: var(--consonant-merch-card-product-width);
}

/* Tablet */
@media screen and ${TABLET_UP} {
    .two-merch-cards.product,
    .three-merch-cards.product,
    .four-merch-cards.product {
        grid-template-columns: repeat(2, var(--consonant-merch-card-product-width));
    }
}

/* desktop */
@media screen and ${DESKTOP_UP} {
  :root {
    --consonant-merch-card-product-width: 378px;
    --consonant-merch-card-product-width-4clm: 276px;
  }
    
  .three-merch-cards.product {
      grid-template-columns: repeat(3, var(--consonant-merch-card-product-width));
  }

  .four-merch-cards.product {
      grid-template-columns: repeat(4, var(--consonant-merch-card-product-width-4clm));
  }
}
`;

// src/variants/product.js
var Product = class extends VariantLayout {
  constructor(card) {
    super(card);
    this.postCardUpdateHook = this.postCardUpdateHook.bind(this);
  }
  getGlobalCSS() {
    return CSS6;
  }
  adjustProductBodySlots() {
    if (this.card.getBoundingClientRect().width === 0)
      return;
    const slots = [
      "heading-xs",
      "body-xxs",
      "body-xs",
      "promo-text",
      "callout-content",
      "body-lower"
    ];
    slots.forEach(
      (slot) => this.updateCardElementMinHeight(
        this.card.shadowRoot.querySelector(`slot[name="${slot}"]`),
        slot
      )
    );
  }
  renderLayout() {
    return x2` ${this.badge}
      <div class="body" aria-live="polite">
          <slot name="icons"></slot>
          <slot name="heading-xs"></slot>
          <slot name="body-xxs"></slot>
          ${!this.promoBottom ? x2`<slot name="promo-text"></slot>` : ""}
          <slot name="body-xs"></slot>
          ${this.promoBottom ? x2`<slot name="promo-text"></slot>` : ""}
          <slot name="callout-content"></slot>
          <slot name="body-lower"></slot>
      </div>
      ${this.secureLabelFooter}`;
  }
  connectedCallbackHook() {
    window.addEventListener("resize", this.postCardUpdateHook);
  }
  disconnectedCallbackHook() {
    window.removeEventListener("resize", this.postCardUpdateHook);
  }
  postCardUpdateHook() {
    if (!this.card.isConnected)
      return;
    if (!isMobile()) {
      this.adjustProductBodySlots();
    }
    this.adjustTitleWidth();
  }
};
__publicField(Product, "variantStyle", i3`
    :host([variant='product']) > slot:not([name='icons']) {
        display: block;
    }
    :host([variant='product']) slot[name='body-xs'] {
        min-height: var(--consonant-merch-card-product-body-xs-height);
        display: block;
    }
    :host([variant='product']) slot[name='heading-xs'] {
        min-height: var(--consonant-merch-card-product-heading-xs-height);
        display: block;
    }
    :host([variant='product']) slot[name='body-xxs'] {
        min-height: var(--consonant-merch-card-product-body-xxs-height);
        display: block;
    }
    :host([variant='product']) slot[name='promo-text'] {
        min-height: var(--consonant-merch-card-product-promo-text-height);
        display: block;
    }
    :host([variant='product']) slot[name='callout-content'] {
        min-height: var(--consonant-merch-card-product-callout-content-height);
        display: block;
    }
      
    :host([variant='product']) ::slotted([slot='heading-xs']) {
      max-width: var(--consonant-merch-card-heading-xs-max-width, 100%);
    }
  `);

// src/variants/segment.css.js
var CSS7 = `
:root {
  --consonant-merch-card-segment-width: 378px;
}

/* grid style for segment */
.one-merch-card.segment,
.two-merch-cards.segment,
.three-merch-cards.segment,
.four-merch-cards.segment {
  grid-template-columns: minmax(276px, var(--consonant-merch-card-segment-width));
}

/* Mobile */
@media screen and ${MOBILE_LANDSCAPE} {
  :root {
    --consonant-merch-card-segment-width: 276px;
  }
}

@media screen and ${TABLET_UP} {
  :root {
    --consonant-merch-card-segment-width: 276px;
  }
    
  .two-merch-cards.segment,
  .three-merch-cards.segment,
  .four-merch-cards.segment {
      grid-template-columns: repeat(2, minmax(276px, var(--consonant-merch-card-segment-width)));
  }
}

/* desktop */
@media screen and ${DESKTOP_UP} {
  :root {
    --consonant-merch-card-segment-width: 302px;
  }
    
  .three-merch-cards.segment {
      grid-template-columns: repeat(3, minmax(276px, var(--consonant-merch-card-segment-width)));
  }

  .four-merch-cards.segment {
      grid-template-columns: repeat(4, minmax(276px, var(--consonant-merch-card-segment-width)));
  }
}
`;

// src/variants/segment.js
var Segment = class extends VariantLayout {
  constructor(card) {
    super(card);
  }
  getGlobalCSS() {
    return CSS7;
  }
  postCardUpdateHook() {
    this.adjustTitleWidth();
  }
  renderLayout() {
    return x2` ${this.badge}
    <div class="body">
        <slot name="heading-xs"></slot>
        <slot name="body-xxs"></slot>
        ${!this.promoBottom ? x2`<slot name="promo-text"></slot><slot name="callout-content"></slot>` : ""}
        <slot name="body-xs"></slot>
        ${this.promoBottom ? x2`<slot name="promo-text"></slot><slot name="callout-content"></slot>` : ""}
    </div>
    <hr />
    ${this.secureLabelFooter}`;
  }
};
__publicField(Segment, "variantStyle", i3`
    :host([variant='segment']) {
      min-height: 214px;
    }
    :host([variant='segment']) ::slotted([slot='heading-xs']) {
      max-width: var(--consonant-merch-card-heading-xs-max-width, 100%);
    }
  `);

// src/variants/special-offer.css.js
var CSS8 = `
:root {
  --consonant-merch-card-special-offers-width: 378px;
}

merch-card[variant="special-offers"] span[is="inline-price"][data-template="strikethrough"] {
  font-size: var(--consonant-merch-card-body-xs-font-size);
}

/* grid style for special-offers */
.one-merch-card.special-offers,
.two-merch-cards.special-offers,
.three-merch-cards.special-offers,
.four-merch-cards.special-offers {
  grid-template-columns: minmax(300px, var(--consonant-merch-card-special-offers-width));
}

@media screen and ${MOBILE_LANDSCAPE} {
  :root {
    --consonant-merch-card-special-offers-width: 302px;
  }
} 
  
@media screen and ${TABLET_UP} {
  :root {
    --consonant-merch-card-special-offers-width: 302px;
  }
    
  .two-merch-cards.special-offers,
  .three-merch-cards.special-offers,
  .four-merch-cards.special-offers {
      grid-template-columns: repeat(2, minmax(300px, var(--consonant-merch-card-special-offers-width)));
  }
}

/* desktop */
@media screen and ${DESKTOP_UP} {
  .three-merch-cards.special-offers,
  .four-merch-cards.special-offers {
    grid-template-columns: repeat(3, minmax(300px, var(--consonant-merch-card-special-offers-width)));
  }
}

@media screen and ${LARGE_DESKTOP} {
  .four-merch-cards.special-offers {
    grid-template-columns: repeat(4, minmax(300px, var(--consonant-merch-card-special-offers-width)));
  }
}
`;

// src/variants/special-offer.js
var SPECIAL_OFFERS_AEM_FRAGMENT_MAPPING = {
  name: { tag: "h4", slot: "detail-m" },
  title: { tag: "h4", slot: "detail-m" },
  backgroundImage: { tag: "div", slot: "bg-image" },
  prices: { tag: "h3", slot: "heading-xs" },
  description: { tag: "div", slot: "body-xs" },
  ctas: { slot: "footer", size: "l" }
};
var SpecialOffer = class extends VariantLayout {
  constructor(card) {
    super(card);
  }
  getGlobalCSS() {
    return CSS8;
  }
  get headingSelector() {
    return '[slot="detail-m"]';
  }
  get aemFragmentMapping() {
    return SPECIAL_OFFERS_AEM_FRAGMENT_MAPPING;
  }
  renderLayout() {
    return x2`${this.cardImage}
            <div class="body">
                <slot name="detail-m"></slot>
                <slot name="heading-xs"></slot>
                <slot name="body-xs"></slot>
            </div>
            ${this.evergreen ? x2`
                      <div
                          class="detail-bg-container"
                          style="background: ${this.card["detailBg"]}"
                      >
                          <slot name="detail-bg"></slot>
                      </div>
                  ` : x2`
                      <hr />
                      ${this.secureLabelFooter}
                  `}
            <slot></slot>`;
  }
};
__publicField(SpecialOffer, "variantStyle", i3`
        :host([variant='special-offers']) {
            min-height: 439px;
        }

        :host([variant='special-offers']) {
            width: var(--consonant-merch-card-special-offers-width);
        }

        :host([variant='special-offers'].center) {
            text-align: center;
        }
    `);

// src/variants/variants.js
var variantRegistry = /* @__PURE__ */ new Map();
var registerVariant = (name, variantClass, fragmentMapping = null, style = null) => {
  variantRegistry.set(name, {
    class: variantClass,
    fragmentMapping,
    style
  });
};
registerVariant(
  "catalog",
  Catalog,
  CATALOG_AEM_FRAGMENT_MAPPING,
  Catalog.variantStyle
);
registerVariant("image", Image2);
registerVariant("inline-heading", InlineHeading);
registerVariant(
  "mini-compare-chart",
  MiniCompareChart,
  null,
  MiniCompareChart.variantStyle
);
registerVariant("plans", Plans, PLANS_AEM_FRAGMENT_MAPPING, Plans.variantStyle);
registerVariant("product", Product, null, Product.variantStyle);
registerVariant("segment", Segment, null, Segment.variantStyle);
registerVariant(
  "special-offers",
  SpecialOffer,
  SPECIAL_OFFERS_AEM_FRAGMENT_MAPPING,
  SpecialOffer.variantStyle
);
var getVariantLayout = (card, mustMatch = false) => {
  const variantInfo = variantRegistry.get(card.variant);
  if (!variantInfo) {
    return mustMatch ? void 0 : new Product(card);
  }
  const { class: VariantClass, style } = variantInfo;
  if (style) {
    const sheet2 = new CSSStyleSheet();
    sheet2.replaceSync(style.cssText);
    card.shadowRoot.adoptedStyleSheets.push(sheet2);
  }
  return new VariantClass(card);
};
function getFragmentMapping(variant) {
  return variantRegistry.get(variant)?.fragmentMapping;
}

// src/global.css.js
var styles2 = document.createElement("style");
styles2.innerHTML = `
:root {
    --consonant-merch-card-detail-font-size: 12px;
    --consonant-merch-card-detail-font-weight: 500;
    --consonant-merch-card-detail-letter-spacing: 0.8px;

    --consonant-merch-card-heading-font-size: 18px;
    --consonant-merch-card-heading-line-height: 22.5px;
    --consonant-merch-card-heading-secondary-font-size: 14px;
    --consonant-merch-card-body-font-size: 14px;
    --consonant-merch-card-body-line-height: 21px;
    --consonant-merch-card-promo-text-height: var(--consonant-merch-card-body-font-size);

    /* Fonts */
    --merch-body-font-family: 'Adobe Clean', adobe-clean, 'Trebuchet MS', sans-serif;

    /* spacing */
    --consonant-merch-spacing-xxxs: 4px;
    --consonant-merch-spacing-xxs: 8px;
    --consonant-merch-spacing-xs: 16px;
    --consonant-merch-spacing-s: 24px;
    --consonant-merch-spacing-m: 32px;

    /* cta */
    --consonant-merch-card-cta-font-size: 15px;

    /* headings */
    --consonant-merch-card-heading-xxxs-font-size: 14px;
    --consonant-merch-card-heading-xxxs-line-height: 18px;
    --consonant-merch-card-heading-xxs-font-size: 16px;
    --consonant-merch-card-heading-xxs-line-height: 20px;
    --consonant-merch-card-heading-xs-font-size: 18px;
    --consonant-merch-card-heading-xs-line-height: 22.5px;
    --consonant-merch-card-heading-s-font-size: 20px;
    --consonant-merch-card-heading-s-line-height: 25px;
    --consonant-merch-card-heading-m-font-size: 24px;
    --consonant-merch-card-heading-m-line-height: 30px;
    --consonant-merch-card-heading-l-font-size: 20px;
    --consonant-merch-card-heading-l-line-height: 30px;
    --consonant-merch-card-heading-xl-font-size: 36px;
    --consonant-merch-card-heading-xl-line-height: 45px;

    /* detail */
    --consonant-merch-card-detail-xs-line-height: 12px;
    --consonant-merch-card-detail-s-font-size: 11px;
    --consonant-merch-card-detail-s-line-height: 14px;
    --consonant-merch-card-detail-m-font-size: 12px;
    --consonant-merch-card-detail-m-line-height: 15px;
    --consonant-merch-card-detail-m-font-weight: 700;
    --consonant-merch-card-detail-m-letter-spacing: 1px;
    --consonant-merch-card-detail-l-line-height: 18px;
    --consonant-merch-card-detail-xl-line-height: 23px;

    /* body */
    --consonant-merch-card-body-xxs-font-size: 12px;
    --consonant-merch-card-body-xxs-line-height: 18px;
    --consonant-merch-card-body-xxs-letter-spacing: 1px;
    --consonant-merch-card-body-xs-font-size: 14px;
    --consonant-merch-card-body-xs-line-height: 21px;
    --consonant-merch-card-body-s-font-size: 16px;
    --consonant-merch-card-body-s-line-height: 24px;
    --consonant-merch-card-body-m-font-size: 18px;
    --consonant-merch-card-body-m-line-height: 27px;
    --consonant-merch-card-body-l-font-size: 20px;
    --consonant-merch-card-body-l-line-height: 30px;
    --consonant-merch-card-body-xl-font-size: 22px;
    --consonant-merch-card-body-xxl-font-size: 24px;
    --consonant-merch-card-body-xl-line-height: 33px;


    --consonant-merch-card-heading-padding: 0;

    /* colors */
    --consonant-merch-card-background-color: inherit;
    --consonant-merch-card-border-color: #eaeaea;
    --color-accent: rgb(59, 99, 251);
    --merch-color-focus-ring: #1473E6;
    --merch-color-grey-10: #f6f6f6;
    --merch-color-grey-50: var(--specturm-gray-50);
    --merch-color-grey-60: var(--specturm-gray-600);
    --merch-color-grey-80: #2c2c2c;
    --merch-color-grey-200: #E8E8E8;
    --merch-color-grey-600: #686868;
    --merch-color-grey-700: #464646;
    --merch-color-green-promo: #2D9D78;
    --consonant-merch-card-body-xs-color: var(--spectrum-gray-100, var(--merch-color-grey-80));
    --merch-color-inline-price-strikethrough: initial;
    --consonant-merch-card-detail-s-color: var(--spectrum-gray-600, var(--merch-color-grey-600));
    --consonant-merch-card-heading-color: var(--spectrum-gray-800, var(--merch-color-grey-80));
    --consonant-merch-card-heading-xs-color: var(--consonant-merch-card-heading-color);
    --consonant-merch-card-price-color: #222222;
    --consonant-merch-card-heading-xxxs-color: #131313;
    --consonant-merch-card-body-xxs-color: #292929;

    /* ccd colors */
    --ccd-gray-200-light: #E6E6E6;
    --ccd-gray-800-dark: #222;
    --ccd-gray-700-dark: #464646;
    --ccd-gray-600-light: #6D6D6D;

    /* ah colors */
    --ah-gray-500: #717171;
    
    /* plans colors */
    --spectrum-yellow-300-plans: #F5C700;
    --spectrum-green-900-plans: #05834E;
    --spectrum-gray-300-plans: #DADADA;
    --spectrum-gray-700-plans: #505050;
  
    /* merch card generic */
    --consonant-merch-card-max-width: 300px;
    --transition: cmax-height 0.3s linear, opacity 0.3s linear;

    /* background image */
    --consonant-merch-card-bg-img-height: 180px;

    /* inline SVGs */
    --checkmark-icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'%3E%3Cpath fill='%23fff' d='M3.788 9A.999.999 0 0 1 3 8.615l-2.288-3a1 1 0 1 1 1.576-1.23l1.5 1.991 3.924-4.991a1 1 0 1 1 1.576 1.23l-4.712 6A.999.999 0 0 1 3.788 9z' class='spectrum-UIIcon--medium'/%3E%3C/svg%3E%0A");

    --secure-icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23757575' viewBox='0 0 12 15'%3E%3Cpath d='M11.5 6H11V5A5 5 0 1 0 1 5v1H.5a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5v-8a.5.5 0 0 0-.5-.5ZM3 5a3 3 0 1 1 6 0v1H3Zm4 6.111V12.5a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1.389a1.5 1.5 0 1 1 2 0Z'/%3E%3C/svg%3E");

    --info-icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 36 36'><circle cx='18' cy='12' r='2.15'%3E%3C/circle%3E%3Cpath d='M20.333 24H20v-7.6a.4.4 0 0 0-.4-.4h-3.933s-1.167.032-1.167 1 1.167 1 1.167 1H16v6h-.333s-1.167.032-1.167 1 1.167 1 1.167 1h4.667s1.167-.033 1.167-1-1.168-1-1.168-1z'%3E%3C/path%3E%3Cpath d='M18 2.1A15.9 15.9 0 1 0 33.9 18 15.9 15.9 0 0 0 18 2.1zm0 29.812A13.912 13.912 0 1 1 31.913 18 13.912 13.912 0 0 1 18 31.913z'%3E%3C/path%3E%3C/svg%3E");

    --ellipsis-icon: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><circle cx="2" cy="2" r="2" fill="%232c2c2c" transform="translate(6 6)"/><circle cx="2" cy="2" r="2" fill="%232c2c2c" data-name="Ellipse 71" transform="translate(12 6)"/><circle cx="2" cy="2" r="2" fill="%232c2c2c" transform="translate(0 6)"/></svg>');

    /* callout */
    --consonant-merch-card-callout-line-height: 21px;
    --consonant-merch-card-callout-font-size: 14px;
    --consonant-merch-card-callout-font-color: #2C2C2C;
    --consonant-merch-card-callout-icon-size: 16px;
    --consonant-merch-card-callout-icon-top: 6px;
    --consonant-merch-card-callout-icon-right: 8px;
    --consonant-merch-card-callout-letter-spacing: 0px;
    --consonant-merch-card-callout-icon-padding: 34px;
    --consonant-merch-card-callout-spacing-xxs: 8px;
}

merch-card-collection {
    display: contents;
}

merch-card-collection > merch-card:not([style]) {
    display: none;
}

merch-card-collection > p[slot],
merch-card-collection > div[slot] p {
    margin: 0;
}

.one-merch-card,
.two-merch-cards,
.three-merch-cards,
.four-merch-cards {
    display: grid;
    justify-content: center;
    justify-items: stretch;
    align-items: normal;
    gap: var(--consonant-merch-spacing-m);
    padding: var(--spacing-m);
}

merch-card[variant="ccd-suggested"] *,
merch-card[variant="ccd-slice"] * {
  box-sizing: border-box;
}

merch-card * {
  padding: revert-layer;
}

merch-card.background-opacity-70 {
    background-color: rgba(255 255 255 / 70%);
}

merch-card.has-divider hr {
    margin: var(--consonant-merch-spacing-xs) 0;
    height: 1px;
    border: none;
}

merch-card.has-divider div[slot='body-lower'] hr {
    margin: 0;
}

merch-card p, merch-card h3, merch-card h4 {
    margin: 0;
}

merch-card span[is='inline-price'] {
    display: inline-block;
}

merch-card [slot^='heading-'] {
    color: var(--consonant-merch-card-heading-color);
    font-weight: 700;
}

merch-card [slot='heading-xxxs'] {
        font-size: var(--consonant-merch-card-heading-xxxs-font-size);
        line-height: var(--consonant-merch-card-heading-xxxs-line-height);
        color: var(--consonant-merch-card-heading-xxxs-color);
        letter-spacing: normal;
}

merch-card [slot='heading-xs'] {
    font-size: var(--consonant-merch-card-heading-xs-font-size);
    line-height: var(--consonant-merch-card-heading-xs-line-height);
    color: var(--consonant-merch-card-heading-xs-color);
    margin: 0;
}

merch-card.dc-pricing [slot='heading-xs'] {
    margin-bottom: var(--consonant-merch-spacing-xxs);
}

merch-card:not([variant='inline-heading']) [slot='heading-xs'] a {
    color: var(--merch-color-grey-80);
}

merch-card div.starting-at {
  font-size: var(--consonant-merch-card-body-xs-font-size);
  line-height: var(--consonant-merch-card-body-xs-line-height);
  font-weight: 500;
}

merch-card [slot='heading-xs'] a:not(:hover) {
    text-decoration: inherit;
}

merch-card [slot='heading-s'] {
    font-size: var(--consonant-merch-card-heading-s-font-size);
    line-height: var(--consonant-merch-card-heading-s-line-height);
    margin: 0;
}

merch-card [slot='heading-m'] {
    font-size: var(--consonant-merch-card-heading-m-font-size);
    line-height: var(--consonant-merch-card-heading-m-line-height);
    margin: 0;
}

merch-card [slot='heading-m-price'] {
    font-size: var(--consonant-merch-card-heading-m-font-size);
    line-height: var(--consonant-merch-card-heading-m-line-height);
    padding: 0 var(--consonant-merch-spacing-s);
    margin: 0;
    color: var(--spectrum-gray-800, #2c2c2c);
}

merch-card [slot='offers'] {
    padding: var(--consonant-merch-spacing-xxs) var(--consonant-merch-spacing-s);
}

merch-card [slot='heading-l'] {
    font-size: var(--consonant-merch-card-heading-l-font-size);
    line-height: var(--consonant-merch-card-heading-l-line-height);
    margin: 0;
}

merch-card [slot='heading-xl'] {
    font-size: var(--consonant-merch-card-heading-xl-font-size);
    line-height: var(--consonant-merch-card-heading-xl-line-height);
    margin: 0;
}

merch-card [slot='whats-included'] {
    margin: var(--consonant-merch-spacing-xxxs) 0px;
}

merch-card [slot='callout-content'] {
    display: flex;
    flex-direction: column;
    margin: var(--consonant-merch-spacing-xxxs) 0px;
    gap: var(--consonant-merch-card-callout-spacing-xxs);
}

merch-card[variant='plans'] [slot='badge'] {
    position: absolute;
    top: 16px;
    right: 0;
    line-height: 16px;
}

merch-card [slot='callout-content'] > p {
    background: rgba(203 203 203 / 50%);
    border-radius: var(--consonant-merch-spacing-xxxs);
    padding: var(--consonant-merch-spacing-xxxs) var(--consonant-merch-spacing-xxs);
    width: fit-content;
    font-size: var(--consonant-merch-card-callout-font-size);
    line-height: var(--consonant-merch-card-callout-line-height);
}

merch-card [slot='callout-content'] .icon-button {
    position: relative;
    top: 3px;
}

merch-card [slot='callout-content'] .icon-button:before {
    display: inline-block;
    content: '';
    width: 14px;
    height: 14px;
    background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="14" width="14"><path d="M7 .778A6.222 6.222 0 1 0 13.222 7 6.222 6.222 0 0 0 7 .778zM6.883 2.45a1.057 1.057 0 0 1 1.113.998q.003.05.001.1a1.036 1.036 0 0 1-1.114 1.114A1.052 1.052 0 0 1 5.77 3.547 1.057 1.057 0 0 1 6.784 2.45q.05-.002.1.001zm1.673 8.05a.389.389 0 0 1-.39.389H5.834a.389.389 0 0 1-.389-.389v-.778a.389.389 0 0 1 .39-.389h.388V7h-.389a.389.389 0 0 1-.389-.389v-.778a.389.389 0 0 1 .39-.389h1.555a.389.389 0 0 1 .389.39v3.5h.389a.389.389 0 0 1 .389.388z"/></svg>')
}

merch-card [slot='callout-content'] > div {
    display: flex;
    flex-direction: column;
    margin: var(--consonant-merch-spacing-xxxs) 0px;
    gap: var(--consonant-merch-card-callout-spacing-xxs);
    align-items: flex-start;
}

merch-card [slot='callout-content'] > div > div {
    display: flex;
    background: rgba(203 203 203 / 50%);
    border-radius: var(--consonant-merch-spacing-xxxs);
    padding: var(--consonant-merch-spacing-xxxs) var(--consonant-merch-spacing-xxxs) var(--consonant-merch-spacing-xxxs) var(--consonant-merch-spacing-xxs);
}

merch-card [slot='callout-content'] > div > div > div {
    display: inline-block;
    text-align: start;
    font: normal normal normal var(--consonant-merch-card-callout-font-size)/var(--consonant-merch-card-callout-line-height) var(--body-font-family, 'Adobe Clean');
    letter-spacing: var(--consonant-merch-card-callout-letter-spacing);
    color: var(--consonant-merch-card-callout-font-color);
}

merch-card [slot='callout-content'] img {
    width: var(--consonant-merch-card-callout-icon-size);
    height: var(--consonant-merch-card-callout-icon-size);
    margin-inline-end: 2.5px;
    margin-inline-start: 9px;
    margin-block-start: 2.5px;
}

merch-card [slot='detail-s'] {
    font-size: var(--consonant-merch-card-detail-s-font-size);
    line-height: var(--consonant-merch-card-detail-s-line-height);
    letter-spacing: 0.66px;
    font-weight: 700;
    text-transform: uppercase;
    color: var(--consonant-merch-card-detail-s-color);
}

merch-card [slot='detail-m'] {
    font-size: var(--consonant-merch-card-detail-m-font-size);
    letter-spacing: var(--consonant-merch-card-detail-m-letter-spacing);
    font-weight: var(--consonant-merch-card-detail-m-font-weight);
    text-transform: uppercase;
    margin: 0;
    color: var(--merch-color-grey-80);
}

merch-card [slot="body-xxs"] {
    font-size: var(--consonant-merch-card-body-xxs-font-size);
    line-height: var(--consonant-merch-card-body-xxs-line-height);
    font-weight: normal;
    letter-spacing: var(--consonant-merch-card-body-xxs-letter-spacing);
    margin: 0;
    color: var(--merch-color-grey-80);
}

merch-card [slot="body-s"] {
    color: var(--consonant-merch-card-body-s-color);
}

merch-card button.spectrum-Button > a {
  color: inherit;
  text-decoration: none;
}

merch-card button.spectrum-Button > a:hover {
  color: inherit;
}

merch-card button.spectrum-Button > a:active {
  color: inherit;
}

merch-card button.spectrum-Button > a:focus {
  color: inherit;
}

merch-card [slot="body-xs"] {
    font-size: var(--consonant-merch-card-body-xs-font-size);
    line-height: var(--consonant-merch-card-body-xs-line-height);
    color: var(--consonant-merch-card-body-xs-color);
}

merch-card [slot="body-m"] {
    font-size: var(--consonant-merch-card-body-m-font-size);
    line-height: var(--consonant-merch-card-body-m-line-height);
    color: var(--merch-color-grey-80);
}

merch-card [slot="body-l"] {
    font-size: var(--consonant-merch-card-body-l-font-size);
    line-height: var(--consonant-merch-card-body-l-line-height);
    color: var(--merch-color-grey-80);
}

merch-card [slot="body-xl"] {
    font-size: var(--consonant-merch-card-body-xl-font-size);
    line-height: var(--consonant-merch-card-body-xl-line-height);
    color: var(--merch-color-grey-80);
}

merch-card [slot="cci-footer"] p,
merch-card [slot="cct-footer"] p,
merch-card [slot="cce-footer"] p {
    margin: 0;
}

merch-card [slot="promo-text"] {
    color: var(--merch-color-green-promo);
    font-size: var(--consonant-merch-card-promo-text-height);
    font-weight: 700;
    line-height: var(--consonant-merch-card-promo-text-height);
    margin: 0;
    min-height: var(--consonant-merch-card-promo-text-height);
    padding: 0;
}

merch-card [slot="footer-rows"] {
    min-height: var(--consonant-merch-card-footer-rows-height);
}

merch-card div[slot="footer"] {
    display: contents;
}

merch-card.product div[slot="footer"] {
    display: block;
}

merch-card.product div[slot="footer"] a + a {
    margin: 5px 0 0 5px;
}

merch-card [slot="footer"] a {
    word-wrap: break-word;
    text-align: center;
}

merch-card [slot="footer"] a:not([class]) {
    font-weight: 700;
    font-size: var(--consonant-merch-card-cta-font-size);
}

merch-card div[slot='bg-image'] img {
    position: relative;
    width: 100%;
    min-height: var(--consonant-merch-card-bg-img-height);
    max-height: var(--consonant-merch-card-bg-img-height);
    object-fit: cover;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
}

.price-unit-type:not(.disabled)::before,
.price-tax-inclusivity:not(.disabled)::before {
  content: "\\00a0";
}

merch-card span.placeholder-resolved[data-template='priceStrikethrough'],
merch-card span.placeholder-resolved[data-template='strikethrough'],
merch-card span.price.price-strikethrough {
  font-size: var(--consonant-merch-card-body-xs-font-size);
  font-weight: normal;
  text-decoration: line-through;
  color: var(--merch-color-inline-price-strikethrough);
}

/* merch-offer-select */
merch-offer-select[variant="subscription-options"] merch-offer span[is="inline-price"][data-display-tax='true'] .price-tax-inclusivity {
    font-size: 12px;
    font-style: italic;
    font-weight: normal;
    position: absolute;
    left: 0;
    top: 20px;
}

body.merch-modal {
    overflow: hidden;
    scrollbar-gutter: stable;
    height: 100vh;
}

merch-sidenav-checkbox-group h3 {
    font-size: 14px;
    height: 32px;
    letter-spacing: 0px;
    line-height: 18.2px;
    color: var(--color-gray-600);
    margin: 0px;
}

sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

`;
document.head.appendChild(styles2);

// src/aem-fragment.js
var sheet = new CSSStyleSheet();
sheet.replaceSync(":host { display: contents; }");
var ATTRIBUTE_FRAGMENT = "fragment";
var ATTRIBUTE_AUTHOR = "author";
var AEM_FRAGMENT_TAG_NAME = "aem-fragment";
var _fragmentCache;
var FragmentCache = class {
  constructor() {
    __privateAdd(this, _fragmentCache, /* @__PURE__ */ new Map());
  }
  clear() {
    __privateGet(this, _fragmentCache).clear();
  }
  /**
   * Add fragment to cache
   * @param {string} fragmentId requested id.
   * requested id can differe from returned fragment.id because of translation
   */
  addByRequestedId(fragmentId, fragment) {
    __privateGet(this, _fragmentCache).set(fragmentId, fragment);
  }
  add(...fragments) {
    fragments.forEach((fragment) => {
      const { id: fragmentId } = fragment;
      if (fragmentId) {
        __privateGet(this, _fragmentCache).set(fragmentId, fragment);
      }
    });
  }
  has(fragmentId) {
    return __privateGet(this, _fragmentCache).has(fragmentId);
  }
  get(key) {
    return __privateGet(this, _fragmentCache).get(key);
  }
  remove(fragmentId) {
    __privateGet(this, _fragmentCache).delete(fragmentId);
  }
};
_fragmentCache = new WeakMap();
var cache = new FragmentCache();
var _log, _rawData, _data, _stale, _startMark, _service2, _fragmentId, _fetchPromise, _author, _fail, fail_fn;
var AemFragment = class extends HTMLElement {
  constructor() {
    super();
    __privateAdd(this, _fail);
    __publicField(this, "cache", cache);
    __privateAdd(this, _log, void 0);
    __privateAdd(this, _rawData, null);
    __privateAdd(this, _data, null);
    __privateAdd(this, _stale, false);
    __privateAdd(this, _startMark, null);
    __privateAdd(this, _service2, null);
    /**
     * @type {string} fragment id
     */
    __privateAdd(this, _fragmentId, void 0);
    /**
     * Internal promise to track if fetching is in progress.
     */
    __privateAdd(this, _fetchPromise, void 0);
    __privateAdd(this, _author, false);
    this.attachShadow({ mode: "open" });
    this.shadowRoot.adoptedStyleSheets = [sheet];
  }
  static get observedAttributes() {
    return [ATTRIBUTE_FRAGMENT, ATTRIBUTE_AUTHOR];
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === ATTRIBUTE_FRAGMENT) {
      __privateSet(this, _fragmentId, newValue);
    }
    if (name === ATTRIBUTE_AUTHOR) {
      __privateSet(this, _author, ["", "true"].includes(newValue));
    }
  }
  connectedCallback() {
    __privateSet(this, _service2, getService2(this));
    __privateSet(this, _log, __privateGet(this, _service2).log.module(AEM_FRAGMENT_TAG_NAME));
    __privateSet(this, _startMark, `${AEM_FRAGMENT_TAG_NAME}:${__privateGet(this, _fragmentId)}${MARK_START_SUFFIX}`);
    performance.mark(__privateGet(this, _startMark));
    if (!__privateGet(this, _fragmentId)) {
      __privateMethod(this, _fail, fail_fn).call(this, { message: "Missing fragment id" });
      return;
    }
    this.refresh(false);
  }
  /**
   * Get fragment by ID
   * @param {string} endpoint url to fetch fragment from
   * @param {string} id fragment id
   * @returns {Promise<Object>} the raw fragment item
   */
  async getFragmentById(endpoint, id, startMark) {
    const measureName = `${AEM_FRAGMENT_TAG_NAME}:${id}${MARK_DURATION_SUFFIX}`;
    let response;
    try {
      response = await masFetch(endpoint, {
        cache: "default",
        credentials: "omit"
      });
      if (!response?.ok) {
        const { startTime, duration } = performance.measure(
          measureName,
          startMark
        );
        throw new MasError("Unexpected fragment response", {
          response,
          startTime,
          duration,
          ...__privateGet(this, _service2).duration
        });
      }
      return response.json();
    } catch (e7) {
      const { startTime, duration } = performance.measure(
        measureName,
        startMark
      );
      if (!response) {
        response = { url: endpoint };
      }
      throw new MasError("Failed to fetch fragment", {
        response,
        startTime,
        duration,
        ...__privateGet(this, _service2).duration
      });
    }
  }
  async refresh(flushCache = true) {
    if (__privateGet(this, _fetchPromise)) {
      const ready = await Promise.race([
        __privateGet(this, _fetchPromise),
        Promise.resolve(false)
      ]);
      if (!ready)
        return;
    }
    if (flushCache) {
      cache.remove(__privateGet(this, _fragmentId));
    }
    __privateSet(this, _fetchPromise, this.fetchData().then(() => {
      const { references, referencesTree, placeholders } = __privateGet(this, _rawData) || {};
      this.dispatchEvent(
        new CustomEvent(EVENT_AEM_LOAD, {
          detail: {
            ...this.data,
            stale: __privateGet(this, _stale),
            references,
            referencesTree,
            placeholders
          },
          bubbles: true,
          composed: true
        })
      );
      return true;
    }).catch((e7) => {
      if (__privateGet(this, _rawData)) {
        cache.addByRequestedId(__privateGet(this, _fragmentId), __privateGet(this, _rawData));
        return true;
      }
      __privateMethod(this, _fail, fail_fn).call(this, e7);
      return false;
    }));
    return __privateGet(this, _fetchPromise);
  }
  async fetchData() {
    this.classList.remove("error");
    __privateSet(this, _data, null);
    let fragment = cache.get(__privateGet(this, _fragmentId));
    if (fragment) {
      __privateSet(this, _rawData, fragment);
      return;
    }
    __privateSet(this, _stale, true);
    const { masIOUrl, wcsApiKey, locale } = __privateGet(this, _service2).settings;
    const endpoint = `${masIOUrl}/fragment?id=${__privateGet(this, _fragmentId)}&api_key=${wcsApiKey}&locale=${locale}`;
    fragment = await this.getFragmentById(
      endpoint,
      __privateGet(this, _fragmentId),
      __privateGet(this, _startMark)
    );
    cache.addByRequestedId(__privateGet(this, _fragmentId), fragment);
    __privateSet(this, _rawData, fragment);
    __privateSet(this, _stale, false);
  }
  get updateComplete() {
    return __privateGet(this, _fetchPromise) ?? Promise.reject(new Error("AEM fragment cannot be loaded"));
  }
  get data() {
    if (__privateGet(this, _data))
      return __privateGet(this, _data);
    if (__privateGet(this, _author)) {
      this.transformAuthorData();
    } else {
      this.transformPublishData();
    }
    return __privateGet(this, _data);
  }
  transformAuthorData() {
    const { fields, id, tags } = __privateGet(this, _rawData);
    __privateSet(this, _data, fields.reduce(
      (acc, { name, multiple, values }) => {
        acc.fields[name] = multiple ? values : values[0];
        return acc;
      },
      { fields: {}, id, tags }
    ));
  }
  transformPublishData() {
    const { fields, id, tags } = __privateGet(this, _rawData);
    __privateSet(this, _data, Object.entries(fields).reduce(
      (acc, [key, value]) => {
        acc.fields[key] = value?.mimeType ? value.value : value ?? "";
        return acc;
      },
      { fields: {}, id, tags }
    ));
  }
};
_log = new WeakMap();
_rawData = new WeakMap();
_data = new WeakMap();
_stale = new WeakMap();
_startMark = new WeakMap();
_service2 = new WeakMap();
_fragmentId = new WeakMap();
_fetchPromise = new WeakMap();
_author = new WeakMap();
_fail = new WeakSet();
fail_fn = function({ message, context }) {
  this.classList.add("error");
  __privateGet(this, _log).error(`aem-fragment: ${message}`, context);
  this.dispatchEvent(
    new CustomEvent(EVENT_AEM_ERROR, {
      detail: { message, ...context },
      bubbles: true,
      composed: true
    })
  );
};
customElements.define(AEM_FRAGMENT_TAG_NAME, AemFragment);

// src/merch-badge.js
var MerchBadge = class extends s7 {
  constructor() {
    super();
    this.color = "";
    this.variant = "";
    this.backgroundColor = "";
    this.borderColor = "";
  }
  connectedCallback() {
    if (this.borderColor && this.borderColor !== "Transparent") {
      this.style.setProperty("--merch-badge-border", `1px solid var(--${this.borderColor})`);
    } else {
      this.style.setProperty("--merch-badge-border", `1px solid var(--${this.backgroundColor})`);
    }
    this.style.setProperty("--merch-badge-background-color", `var(--${this.backgroundColor})`);
    this.style.setProperty("--merch-badge-color", this.color);
    this.style.setProperty("--merch-badge-padding", "2px 10px 3px 10px");
    this.style.setProperty("--merch-badge-border-radius", "4px 0 0 4px");
    this.style.setProperty("--merch-badge-font-size", "var(--consonant-merch-card-body-xs-font-size)");
    if (this.variant === "plans") {
      this.style.setProperty("border-right", "none");
    }
    super.connectedCallback();
  }
  render() {
    return x2`<div class="plans-badge">
            ${this.textContent}
        </div>`;
  }
};
__publicField(MerchBadge, "properties", {
  color: { type: String },
  variant: { type: String },
  backgroundColor: { type: String, attribute: "background-color" },
  borderColor: { type: String, attribute: "border-color" }
});
__publicField(MerchBadge, "styles", i3`
        :host {
            display: block;
            background-color: var(--merch-badge-background-color);
            color: var(--merch-badge-color, #000);
            padding: var(--merch-badge-padding);
            border-radius: var(--merch-badge-border-radius);
            font-size: var(--merch-badge-font-size);
            line-height: 21px;
            border: var(--merch-badge-border);
        }
    `);
customElements.define("merch-badge", MerchBadge);

// src/merch-mnemonic-list.js
var MerchMnemonicList = class extends s7 {
  constructor() {
    super();
  }
  render() {
    return x2`
            <slot name="icon"></slot>
            <slot name="description">${this.description}</slot>
        `;
  }
};
__publicField(MerchMnemonicList, "styles", i3`
        :host {
            display: flex;
            flex-wrap: nowrap;
            gap: 8px;
            margin-right: 16px;
            align-items: center;
        }

        ::slotted([slot='icon']) {
            display: flex;
            justify-content: center;
            align-items: center;
            height: max-content;
        }

        ::slotted([slot='description']) {
            font-size: 14px;
            line-height: 21px;
            margin: 0;
        }

        :host .hidden {
            display: none;
        }
    `);
__publicField(MerchMnemonicList, "properties", {
  description: { type: String, attribute: true }
});
customElements.define("merch-mnemonic-list", MerchMnemonicList);

// src/merch-whats-included.js
var MerchWhatsIncluded = class extends s7 {
  updated() {
    this.hideSeeMoreEls();
  }
  hideSeeMoreEls() {
    if (this.isMobile) {
      this.rows.forEach((node, index) => {
        if (index >= 5) {
          node.style.display = this.showAll ? "flex" : "none";
        }
      });
    }
  }
  constructor() {
    super();
    this.showAll = false;
    this.mobileRows = this.mobileRows === void 0 ? 5 : this.mobileRows;
  }
  toggle() {
    this.showAll = !this.showAll;
    this.dispatchEvent(
      new CustomEvent("hide-see-more-elements", {
        bubbles: true,
        composed: true
      })
    );
    this.requestUpdate();
  }
  render() {
    return x2`<slot name="heading"></slot>
            <slot name="content"></slot>
            ${this.isMobile && this.rows.length > this.mobileRows ? x2`<div @click=${this.toggle} class="see-more">
                      ${this.showAll ? "- See less" : "+ See more"}
                  </div>` : x2``}`;
  }
  get isMobile() {
    return window.matchMedia("(max-width: 767px)").matches;
  }
  get rows() {
    return this.querySelectorAll("merch-mnemonic-list");
  }
};
__publicField(MerchWhatsIncluded, "styles", i3`
        :host {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            overflow: hidden;
            box-sizing: border-box;
            row-gap: 10px;
        }

        ::slotted([slot='heading']) {
            font-size: 14px;
            font-weight: 700;
            margin-right: 16px;
        }

        ::slotted([slot='content']) {
            display: contents;
        }

        .hidden {
            display: none;
        }

        .see-more {
            font-size: 14px;
            text-decoration: underline;
            color: var(--link-color-dark);
        }
    `);
__publicField(MerchWhatsIncluded, "properties", {
  heading: { type: String, attribute: true },
  mobileRows: { type: Number, attribute: true }
});
customElements.define("merch-whats-included", MerchWhatsIncluded);

// src/hydrate.js
var DEFAULT_BADGE_COLOR = "#000000";
var DEFAULT_PLANS_BADGE_COLOR = "spectrum-yellow-300-plans";
var DEFAULT_BADGE_BACKGROUND_COLOR = "#F8D904";
var DEFAULT_BORDER_COLOR = "#EAEAEA";
var CHECKOUT_STYLE_PATTERN = /(accent|primary|secondary)(-(outline|link))?/;
var ANALYTICS_TAG = "mas:product_code/";
var ANALYTICS_LINK_ATTR = "daa-ll";
var ANALYTICS_SECTION_ATTR = "daa-lh";
var SPECTRUM_BUTTON_SIZES = ["XL", "L", "M", "S"];
var TEXT_TRUNCATE_SUFFIX = "...";
function appendSlot(fieldName, fields, el, mapping) {
  const config2 = mapping[fieldName];
  if (fields[fieldName] && config2) {
    const attributes = { slot: config2?.slot };
    let content = fields[fieldName];
    if (config2.maxCount && typeof content === "string") {
      const [truncatedContent, cleanContent] = getTruncatedTextData(
        content,
        config2.maxCount,
        config2.withSuffix
      );
      if (truncatedContent !== content) {
        attributes.title = cleanContent;
        content = truncatedContent;
      }
    }
    const tag = createTag(config2.tag, attributes, content);
    el.append(tag);
  }
}
function processMnemonics(fields, merchCard, mnemonicsConfig) {
  const mnemonics = fields.mnemonicIcon?.map((icon, index) => ({
    icon,
    alt: fields.mnemonicAlt[index] ?? "",
    link: fields.mnemonicLink[index] ?? ""
  }));
  mnemonics?.forEach(({ icon: src, alt, link: href }) => {
    if (href && !/^https?:/.test(href)) {
      try {
        href = new URL(`https://${href}`).href.toString();
      } catch (e7) {
        href = "#";
      }
    }
    const attrs = {
      slot: "icons",
      src,
      loading: merchCard.loading,
      size: mnemonicsConfig?.size ?? "l"
    };
    if (alt)
      attrs.alt = alt;
    if (href)
      attrs.href = href;
    const merchIcon = createTag("merch-icon", attrs);
    merchCard.append(merchIcon);
  });
}
function processBadge(fields, merchCard, mapping) {
  if (fields.variant === "plans") {
    if (fields.badge?.length && !fields.badge?.startsWith("<merch-badge")) {
      fields.badge = `<merch-badge variant="${fields.variant}" background-color="${DEFAULT_PLANS_BADGE_COLOR}">${fields.badge}</merch-badge>`;
      if (!fields.borderColor)
        fields.borderColor = DEFAULT_PLANS_BADGE_COLOR;
    }
    appendSlot("badge", fields, merchCard, mapping);
    return;
  }
  if (fields.badge) {
    merchCard.setAttribute("badge-text", fields.badge);
    merchCard.setAttribute(
      "badge-color",
      fields.badgeColor || DEFAULT_BADGE_COLOR
    );
    merchCard.setAttribute(
      "badge-background-color",
      fields.badgeBackgroundColor || DEFAULT_BADGE_BACKGROUND_COLOR
    );
    merchCard.setAttribute(
      "border-color",
      fields.badgeBackgroundColor || DEFAULT_BADGE_BACKGROUND_COLOR
    );
  } else {
    merchCard.setAttribute(
      "border-color",
      fields.borderColor || DEFAULT_BORDER_COLOR
    );
  }
}
function processSize(fields, merchCard, sizeConfig) {
  if (sizeConfig?.includes(fields.size)) {
    merchCard.setAttribute("size", fields.size);
  }
}
function processTitle(fields, merchCard, titleConfig) {
  appendSlot("cardTitle", fields, merchCard, { cardTitle: titleConfig });
}
function processSubtitle(fields, merchCard, mapping) {
  appendSlot("subtitle", fields, merchCard, mapping);
}
function processBackgroundColor(fields, merchCard, allowedColors) {
  if (!fields.backgroundColor || fields.backgroundColor.toLowerCase() === "default") {
    merchCard.style.removeProperty("--merch-card-custom-background-color");
    merchCard.removeAttribute("background-color");
    return;
  }
  if (allowedColors?.[fields.backgroundColor]) {
    merchCard.style.setProperty(
      "--merch-card-custom-background-color",
      `var(${allowedColors[fields.backgroundColor]})`
    );
    merchCard.setAttribute("background-color", fields.backgroundColor);
  }
}
function processBorderColor(fields, merchCard, borderColorConfig) {
  const customBorderColor = "--merch-card-custom-border-color";
  if (fields.borderColor?.toLowerCase() === "transparent") {
    merchCard.style.removeProperty(customBorderColor);
    if (fields.variant === "plans")
      merchCard.style.setProperty(customBorderColor, "transparent");
  } else if (fields.borderColor && borderColorConfig) {
    if (/-gradient/.test(fields.borderColor)) {
      merchCard.setAttribute("gradient-border", "true");
      merchCard.style.removeProperty(customBorderColor);
    } else {
      merchCard.style.setProperty(
        customBorderColor,
        `var(--${fields.borderColor})`
      );
    }
  }
}
function processBackgroundImage(fields, merchCard, backgroundImageConfig) {
  if (fields.backgroundImage) {
    const imgAttributes = {
      loading: merchCard.loading ?? "lazy",
      src: fields.backgroundImage
    };
    if (fields.backgroundImageAltText) {
      imgAttributes.alt = fields.backgroundImageAltText;
    } else {
      imgAttributes.role = "none";
    }
    if (!backgroundImageConfig)
      return;
    if (backgroundImageConfig?.attribute) {
      merchCard.setAttribute(
        backgroundImageConfig.attribute,
        fields.backgroundImage
      );
      return;
    }
    merchCard.append(
      createTag(
        backgroundImageConfig.tag,
        { slot: backgroundImageConfig.slot },
        createTag("img", imgAttributes)
      )
    );
  }
}
function processPrices(fields, merchCard, mapping) {
  appendSlot("prices", fields, merchCard, mapping);
}
function processDescription(fields, merchCard, mapping) {
  appendSlot("promoText", fields, merchCard, mapping);
  appendSlot("description", fields, merchCard, mapping);
  appendSlot("callout", fields, merchCard, mapping);
  appendSlot("quantitySelect", fields, merchCard, mapping);
}
function processStockOffersAndSecureLabel(fields, merchCard, aemFragmentMapping, settings) {
  if (fields.showStockCheckbox && aemFragmentMapping.stockOffer) {
    merchCard.setAttribute("checkbox-label", settings.stockCheckboxLabel);
    merchCard.setAttribute("stock-offer-osis", settings.stockOfferOsis);
  }
  if (settings.secureLabel && aemFragmentMapping.secureLabel) {
    merchCard.setAttribute("secure-label", settings.secureLabel);
  }
}
function getTruncatedTextData(text, limit, withSuffix = true) {
  try {
    const _text = typeof text !== "string" ? "" : text;
    const cleanText = clearTags(_text);
    if (cleanText.length <= limit)
      return [_text, cleanText];
    let index = 0;
    let inTag = false;
    let remaining = withSuffix ? limit - TEXT_TRUNCATE_SUFFIX.length < 1 ? 1 : limit - TEXT_TRUNCATE_SUFFIX.length : limit;
    let openTags = [];
    for (const char of _text) {
      index++;
      if (char === "<") {
        inTag = true;
        if (_text[index] === "/") {
          openTags.pop();
        } else {
          let tagName = "";
          for (const tagChar of _text.substring(index)) {
            if (tagChar === " " || tagChar === ">")
              break;
            tagName += tagChar;
          }
          openTags.push(tagName);
        }
      }
      if (char === "/") {
        if (_text[index] === ">") {
          openTags.pop();
        }
      }
      if (char === ">") {
        inTag = false;
        continue;
      }
      if (inTag)
        continue;
      remaining--;
      if (remaining === 0)
        break;
    }
    let trimmedText = _text.substring(0, index).trim();
    if (openTags.length > 0) {
      if (openTags[0] === "p")
        openTags.shift();
      for (const tag of openTags.reverse()) {
        trimmedText += `</${tag}>`;
      }
    }
    let truncatedText = `${trimmedText}${withSuffix ? TEXT_TRUNCATE_SUFFIX : ""}`;
    return [truncatedText, cleanText];
  } catch (error) {
    const fallbackText = typeof text === "string" ? text : "";
    const cleanFallback = clearTags(fallbackText);
    return [fallbackText, cleanFallback];
  }
}
function clearTags(text) {
  if (!text)
    return "";
  let result = "";
  let inTag = false;
  for (const char of text) {
    if (char === "<")
      inTag = true;
    if (char === ">") {
      inTag = false;
      continue;
    }
    if (inTag)
      continue;
    result += char;
  }
  return result;
}
function processUptLinks(fields, merchCard) {
  const placeholders = merchCard.querySelectorAll("a.upt-link");
  placeholders.forEach((placeholder) => {
    const uptLink = UptLink.createFrom(placeholder);
    placeholder.replaceWith(uptLink);
    uptLink.initializeWcsData(fields.osi, fields.promoCode);
  });
}
function createSpectrumCssButton(cta, aemFragmentMapping, isOutline, variant) {
  const CheckoutButton2 = customElements.get("checkout-button");
  const spectrumCta = CheckoutButton2.createCheckoutButton({}, cta.innerHTML);
  spectrumCta.setAttribute("tabindex", 0);
  for (const attr of cta.attributes) {
    if (["class", "is"].includes(attr.name))
      continue;
    spectrumCta.setAttribute(attr.name, attr.value);
  }
  spectrumCta.firstElementChild?.classList.add("spectrum-Button-label");
  const size = aemFragmentMapping.ctas.size ?? "M";
  const variantClass = `spectrum-Button--${variant}`;
  const sizeClass = SPECTRUM_BUTTON_SIZES.includes(size) ? `spectrum-Button--size${size}` : "spectrum-Button--sizeM";
  const spectrumClass = ["spectrum-Button", variantClass, sizeClass];
  if (isOutline) {
    spectrumClass.push("spectrum-Button--outline");
  }
  spectrumCta.classList.add(...spectrumClass);
  return spectrumCta;
}
function createSpectrumSwcButton(cta, aemFragmentMapping, isOutline, variant) {
  const CheckoutButton2 = customElements.get("checkout-button");
  const checkoutButton = CheckoutButton2.createCheckoutButton(cta.dataset);
  checkoutButton.connectedCallback();
  checkoutButton.render();
  let treatment = "fill";
  if (isOutline) {
    treatment = "outline";
  }
  const spectrumCta = createTag(
    "sp-button",
    {
      treatment,
      variant,
      tabIndex: 0,
      size: aemFragmentMapping.ctas.size ?? "m",
      ...cta.dataset.analyticsId && {
        "data-analytics-id": cta.dataset.analyticsId
      }
    },
    cta.innerHTML
  );
  spectrumCta.source = checkoutButton;
  checkoutButton.onceSettled().then((target) => {
    spectrumCta.setAttribute("data-navigation-url", target.href);
  });
  spectrumCta.addEventListener("click", (e7) => {
    if (e7.defaultPrevented)
      return;
    checkoutButton.click();
  });
  return spectrumCta;
}
function createConsonantButton(cta, isAccent) {
  const CheckoutLink2 = customElements.get("checkout-link");
  const checkoutLink = CheckoutLink2.createCheckoutLink(cta.dataset, cta.innerHTML);
  checkoutLink.classList.add("con-button");
  if (isAccent) {
    checkoutLink.classList.add("blue");
  }
  return checkoutLink;
}
function processCTAs(fields, merchCard, aemFragmentMapping, variant) {
  if (fields.ctas) {
    const { slot } = aemFragmentMapping.ctas;
    const footer = createTag("div", { slot }, fields.ctas);
    const ctas = [...footer.querySelectorAll("a")].map((cta) => {
      const checkoutLinkStyle = CHECKOUT_STYLE_PATTERN.exec(cta.className)?.[0] ?? "accent";
      const isAccent = checkoutLinkStyle.includes("accent");
      const isPrimary = checkoutLinkStyle.includes("primary");
      const isSecondary = checkoutLinkStyle.includes("secondary");
      const isOutline = checkoutLinkStyle.includes("-outline");
      const isLink = checkoutLinkStyle.includes("-link");
      if (merchCard.consonant)
        return createConsonantButton(cta, isAccent);
      if (isLink) {
        return cta;
      }
      let variant2;
      if (isAccent) {
        variant2 = "accent";
      } else if (isPrimary) {
        variant2 = "primary";
      } else if (isSecondary) {
        variant2 = "secondary";
      }
      return merchCard.spectrum === "swc" ? createSpectrumSwcButton(
        cta,
        aemFragmentMapping,
        isOutline,
        variant2
      ) : createSpectrumCssButton(
        cta,
        aemFragmentMapping,
        isOutline,
        variant2
      );
    });
    footer.innerHTML = "";
    footer.append(...ctas);
    merchCard.append(footer);
  }
}
function processAnalytics(fields, merchCard) {
  const { tags } = fields;
  const cardAnalyticsId = tags?.find((tag) => tag.startsWith(ANALYTICS_TAG))?.split("/").pop();
  if (!cardAnalyticsId)
    return;
  merchCard.setAttribute(ANALYTICS_SECTION_ATTR, cardAnalyticsId);
  const elements = [
    ...merchCard.shadowRoot.querySelectorAll(
      `a[data-analytics-id],button[data-analytics-id]`
    ),
    ...merchCard.querySelectorAll(
      `a[data-analytics-id],button[data-analytics-id]`
    )
  ];
  elements.forEach((el, index) => {
    el.setAttribute(
      ANALYTICS_LINK_ATTR,
      `${el.dataset.analyticsId}-${index + 1}`
    );
  });
}
function updateLinksCSS(merchCard) {
  if (merchCard.spectrum !== "css")
    return;
  [
    ["primary-link", "primary"],
    ["secondary-link", "secondary"]
  ].forEach(([className, variant]) => {
    merchCard.querySelectorAll(`a.${className}`).forEach((link) => {
      link.classList.remove(className);
      link.classList.add("spectrum-Link", `spectrum-Link--${variant}`);
    });
  });
}
function cleanup(merchCard) {
  merchCard.querySelectorAll("[slot]").forEach((el) => {
    el.remove();
  });
  const attributesToRemove = [
    "checkbox-label",
    "stock-offer-osis",
    "secure-label",
    "background-image",
    "background-color",
    "border-color",
    "badge-background-color",
    "badge-color",
    "badge-text",
    "size",
    ANALYTICS_SECTION_ATTR
  ];
  attributesToRemove.forEach((attr) => merchCard.removeAttribute(attr));
  const classesToRemove = ["wide-strip", "thin-strip"];
  merchCard.classList.remove(...classesToRemove);
}
async function hydrate(fragment, merchCard) {
  const { id, fields } = fragment;
  const { variant } = fields;
  if (!variant)
    throw new Error(`hydrate: no variant found in payload ${id}`);
  const settings = {
    stockCheckboxLabel: "Add a 30-day free trial of Adobe Stock.*",
    // to be {{stock-checkbox-label}}
    stockOfferOsis: "",
    secureLabel: "Secure transaction"
    // to be {{secure-transaction}}
  };
  cleanup(merchCard);
  merchCard.id ?? (merchCard.id = fragment.id);
  merchCard.removeAttribute("background-image");
  merchCard.removeAttribute("background-color");
  merchCard.removeAttribute("badge-background-color");
  merchCard.removeAttribute("badge-color");
  merchCard.removeAttribute("badge-text");
  merchCard.removeAttribute("size");
  merchCard.removeAttribute("gradient-border");
  merchCard.classList.remove("wide-strip");
  merchCard.classList.remove("thin-strip");
  merchCard.removeAttribute(ANALYTICS_SECTION_ATTR);
  merchCard.variant = variant;
  await merchCard.updateComplete;
  const { aemFragmentMapping } = merchCard.variantLayout;
  if (!aemFragmentMapping)
    throw new Error(`hydrate: aemFragmentMapping found for ${id}`);
  if (aemFragmentMapping.style === "consonant") {
    merchCard.setAttribute("consonant", true);
  }
  processMnemonics(fields, merchCard, aemFragmentMapping.mnemonics);
  processBadge(fields, merchCard, aemFragmentMapping);
  processSize(fields, merchCard, aemFragmentMapping.size);
  processTitle(fields, merchCard, aemFragmentMapping.title);
  processSubtitle(fields, merchCard, aemFragmentMapping);
  processPrices(fields, merchCard, aemFragmentMapping);
  processBackgroundImage(
    fields,
    merchCard,
    aemFragmentMapping.backgroundImage
  );
  processBackgroundColor(fields, merchCard, aemFragmentMapping.allowedColors);
  processBorderColor(fields, merchCard, aemFragmentMapping.borderColor);
  processDescription(fields, merchCard, aemFragmentMapping);
  processStockOffersAndSecureLabel(
    fields,
    merchCard,
    aemFragmentMapping,
    settings
  );
  processUptLinks(fields, merchCard);
  processCTAs(fields, merchCard, aemFragmentMapping, variant);
  processAnalytics(fields, merchCard);
  updateLinksCSS(merchCard);
}

// src/merch-card.js
var MERCH_CARD = "merch-card";
var MARK_READY_SUFFIX = ":ready";
var MARK_ERROR_SUFFIX = ":error";
var MERCH_CARD_LOAD_TIMEOUT = 2e4;
var MARK_MERCH_CARD_PREFIX = "merch-card:";
var _log2, _service3, _fail2, fail_fn2;
var MerchCard = class extends s7 {
  constructor() {
    super();
    __privateAdd(this, _fail2);
    __publicField(this, "customerSegment");
    __publicField(this, "marketSegment");
    /**
     * @type {VariantLayout}
     */
    __publicField(this, "variantLayout");
    __privateAdd(this, _log2, void 0);
    __privateAdd(this, _service3, void 0);
    __publicField(this, "readyEventDispatched", false);
    this.id = null;
    this.failed = false;
    this.filters = {};
    this.types = "";
    this.selected = false;
    this.spectrum = "css";
    this.loading = "lazy";
    this.handleAemFragmentEvents = this.handleAemFragmentEvents.bind(this);
  }
  firstUpdated() {
    this.variantLayout = getVariantLayout(this, false);
    this.variantLayout?.connectedCallbackHook();
    this.aemFragment?.updateComplete.catch((e7) => {
      __privateMethod(this, _fail2, fail_fn2).call(this, e7, {}, false);
      this.style.display = "none";
    });
  }
  willUpdate(changedProperties) {
    if (changedProperties.has("variant") || !this.variantLayout) {
      this.variantLayout = getVariantLayout(this);
      this.variantLayout.connectedCallbackHook();
    }
  }
  updated(changedProperties) {
    if (changedProperties.has("badgeBackgroundColor") || changedProperties.has("borderColor")) {
      this.style.setProperty(
        "--consonant-merch-card-border",
        this.computedBorderStyle
      );
    }
    this.variantLayout?.postCardUpdateHook(changedProperties);
  }
  get theme() {
    return this.closest("sp-theme");
  }
  get dir() {
    return this.closest("[dir]")?.getAttribute("dir") ?? "ltr";
  }
  get prices() {
    return Array.from(
      this.querySelectorAll('span[is="inline-price"][data-wcs-osi]')
    );
  }
  render() {
    if (!this.isConnected || !this.variantLayout || this.style.display === "none")
      return;
    return this.variantLayout.renderLayout();
  }
  get computedBorderStyle() {
    if (!["ccd-slice", "ccd-suggested", "ah-promoted-plans"].includes(this.variant)) {
      return `1px solid ${this.borderColor ? this.borderColor : this.badgeBackgroundColor}`;
    }
    return "";
  }
  get badgeElement() {
    return this.shadowRoot.getElementById("badge");
  }
  get headingmMSlot() {
    return this.shadowRoot.querySelector('slot[name="heading-m"]').assignedElements()[0];
  }
  get footerSlot() {
    return this.shadowRoot.querySelector('slot[name="footer"]')?.assignedElements()[0];
  }
  get price() {
    return this.headingmMSlot?.querySelector(SELECTOR_MAS_INLINE_PRICE);
  }
  get checkoutLinks() {
    return [
      ...this.footerSlot?.querySelectorAll(SELECTOR_MAS_CHECKOUT_LINK) ?? []
    ];
  }
  async toggleStockOffer({ target }) {
    if (!this.stockOfferOsis)
      return;
    const elements = this.checkoutLinks;
    if (elements.length === 0)
      return;
    for (const element of elements) {
      await element.onceSettled();
      const planType = element.value?.[0]?.planType;
      if (!planType)
        return;
      const stockOfferOsi = this.stockOfferOsis[planType];
      if (!stockOfferOsi)
        return;
      const osis = element.dataset.wcsOsi.split(",").filter((osi) => osi !== stockOfferOsi);
      if (target.checked) {
        osis.push(stockOfferOsi);
      }
      element.dataset.wcsOsi = osis.join(",");
    }
  }
  handleQuantitySelection(event) {
    const elements = this.checkoutLinks;
    for (const element of elements) {
      element.dataset.quantity = event.detail.option;
    }
  }
  get titleElement() {
    return this.querySelector(
      this.variantLayout?.headingSelector || ".card-heading"
    );
  }
  get title() {
    return this.titleElement?.textContent?.trim();
  }
  /* c8 ignore next 3 */
  get description() {
    return this.querySelector('[slot="body-xs"]')?.textContent?.trim();
  }
  /**
   * If the card is the single app, set the order for all filters to 2.
   * If not, increment the order for all filters after the second card by 1.
   * @param {*} singleApp
   */
  updateFilters(singleApp) {
    const newFilters = { ...this.filters };
    Object.keys(newFilters).forEach((key) => {
      if (singleApp) {
        newFilters[key].order = Math.min(newFilters[key].order || 2, 2);
        return;
      }
      const value = newFilters[key].order;
      if (value === 1 || isNaN(value))
        return;
      newFilters[key].order = Number(value) + 1;
    });
    this.filters = newFilters;
  }
  /* c8 ignore next 3 */
  includes(text) {
    return this.textContent.match(new RegExp(text, "i")) !== null;
  }
  connectedCallback() {
    super.connectedCallback();
    __privateSet(this, _service3, getService2());
    __privateSet(this, _log2, __privateGet(this, _service3).Log.module(MERCH_CARD));
    this.id ?? (this.id = this.querySelector("aem-fragment")?.getAttribute("fragment"));
    performance.mark(
      `${MARK_MERCH_CARD_PREFIX}${this.id}${MARK_START_SUFFIX}`
    );
    this.addEventListener(
      EVENT_MERCH_QUANTITY_SELECTOR_CHANGE,
      this.handleQuantitySelection
    );
    this.addEventListener(
      EVENT_MERCH_ADDON_AND_QUANTITY_UPDATE,
      this.handleAddonAndQuantityUpdate
    );
    this.addEventListener(
      EVENT_MERCH_OFFER_SELECT_READY,
      this.merchCardReady,
      { once: true }
    );
    this.updateComplete.then(() => {
      this.merchCardReady();
    });
    this.addEventListener(EVENT_AEM_ERROR, this.handleAemFragmentEvents);
    this.addEventListener(EVENT_AEM_LOAD, this.handleAemFragmentEvents);
    if (!this.aemFragment) {
      setTimeout(() => this.checkReady(), 0);
    }
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.variantLayout?.disconnectedCallbackHook();
    this.removeEventListener(
      EVENT_MERCH_QUANTITY_SELECTOR_CHANGE,
      this.handleQuantitySelection
    );
    this.removeEventListener(EVENT_AEM_ERROR, this.handleAemFragmentEvents);
    this.removeEventListener(EVENT_AEM_LOAD, this.handleAemFragmentEvents);
  }
  // custom methods
  async handleAemFragmentEvents(e7) {
    if (e7.type === EVENT_AEM_ERROR) {
      __privateMethod(this, _fail2, fail_fn2).call(this, `AEM fragment cannot be loaded: ${e7.detail.message}`, e7.detail);
    }
    if (e7.type === EVENT_AEM_LOAD) {
      if (e7.target.nodeName === "AEM-FRAGMENT") {
        const fragment = e7.detail;
        hydrate(fragment, this).then(() => this.checkReady()).catch((e8) => __privateGet(this, _log2).error(e8));
      }
    }
  }
  async checkReady() {
    const timeoutPromise = new Promise(
      (resolve) => setTimeout(() => resolve("timeout"), MERCH_CARD_LOAD_TIMEOUT)
    );
    if (this.aemFragment) {
      const result2 = await Promise.race([
        this.aemFragment.updateComplete,
        timeoutPromise
      ]);
      if (result2 === false) {
        const errorMessage = result2 === "timeout" ? `AEM fragment was not resolved within ${MERCH_CARD_LOAD_TIMEOUT} timeout` : "AEM fragment cannot be loaded";
        __privateMethod(this, _fail2, fail_fn2).call(this, errorMessage, {}, false);
        return;
      }
    }
    const masElements = [...this.querySelectorAll(SELECTOR_MAS_ELEMENT)];
    masElements.push(
      ...[...this.querySelectorAll(SELECTOR_MAS_SP_BUTTON)].map(
        (element) => element.source
      )
    );
    const successPromise = Promise.all(
      masElements.map(
        (element) => element.onceSettled().catch(() => element)
      )
    ).then(
      (elements) => elements.every(
        (el) => el.classList.contains("placeholder-resolved")
      )
    );
    const result = await Promise.race([successPromise, timeoutPromise]);
    if (result === true) {
      performance.mark(
        `${MARK_MERCH_CARD_PREFIX}${this.id}${MARK_READY_SUFFIX}`
      );
      if (!this.readyEventDispatched) {
        this.readyEventDispatched = true;
        this.dispatchEvent(
          new CustomEvent(EVENT_MAS_READY, {
            bubbles: true,
            composed: true
          })
        );
      }
      return this;
    } else {
      const { duration, startTime } = performance.measure(
        `${MARK_MERCH_CARD_PREFIX}${this.id}${MARK_ERROR_SUFFIX}`,
        `${MARK_MERCH_CARD_PREFIX}${this.id}${MARK_START_SUFFIX}`
      );
      const details = {
        duration,
        startTime,
        ...__privateGet(this, _service3).duration
      };
      if (result === "timeout") {
        __privateMethod(this, _fail2, fail_fn2).call(this, `Contains offers that were not resolved within ${MERCH_CARD_LOAD_TIMEOUT} timeout`, details);
      } else {
        __privateMethod(this, _fail2, fail_fn2).call(this, `Contains unresolved offers`, details);
      }
    }
  }
  get aemFragment() {
    return this.querySelector("aem-fragment");
  }
  /* c8 ignore next 3 */
  get quantitySelect() {
    return this.querySelector("merch-quantity-select");
  }
  displayFooterElementsInColumn() {
    if (!this.classList.contains("product"))
      return;
    const secureTransactionLabel = this.shadowRoot.querySelector(
      ".secure-transaction-label"
    );
    const checkoutLinkCtas = this.footerSlot?.querySelectorAll(
      SELECTOR_MAS_CHECKOUT_LINK
    );
    if (checkoutLinkCtas.length === 2 && secureTransactionLabel) {
      secureTransactionLabel.parentElement.classList.add("footer-column");
    }
  }
  merchCardReady() {
    if (this.offerSelect && !this.offerSelect.planType)
      return;
    this.dispatchEvent(
      new CustomEvent(EVENT_MERCH_CARD_READY, { bubbles: true })
    );
    this.displayFooterElementsInColumn();
  }
  /* c8 ignore next 3 */
  get dynamicPrice() {
    return this.querySelector('[slot="price"]');
  }
  handleAddonAndQuantityUpdate({ detail: { id, items } }) {
    if (!id || !items?.length)
      return;
    const cta = this.checkoutLinks.find((link) => link.getAttribute("data-modal-id") === id);
    if (!cta)
      return;
    console.log("found card that has to be updated", cta);
  }
};
_log2 = new WeakMap();
_service3 = new WeakMap();
_fail2 = new WeakSet();
fail_fn2 = function(error, details = {}, dispatch = true) {
  __privateGet(this, _log2).error(`merch-card: ${error}`, details);
  this.failed = true;
  if (!dispatch)
    return;
  this.dispatchEvent(
    new CustomEvent(EVENT_MAS_ERROR, {
      detail: { ...details, message: error },
      bubbles: true,
      composed: true
    })
  );
};
__publicField(MerchCard, "properties", {
  id: { type: String, attribute: "id", reflect: true },
  name: { type: String, attribute: "name", reflect: true },
  variant: { type: String, reflect: true },
  size: { type: String, attribute: "size", reflect: true },
  badgeColor: { type: String, attribute: "badge-color", reflect: true },
  borderColor: { type: String, attribute: "border-color", reflect: true },
  badgeBackgroundColor: {
    type: String,
    attribute: "badge-background-color",
    reflect: true
  },
  backgroundImage: {
    type: String,
    attribute: "background-image",
    reflect: true
  },
  badgeText: { type: String, attribute: "badge-text" },
  actionMenu: { type: Boolean, attribute: "action-menu" },
  actionMenuLabel: { type: String, attribute: "action-menu-label" },
  customHr: { type: Boolean, attribute: "custom-hr" },
  consonant: { type: Boolean, attribute: "consonant" },
  failed: { type: Boolean, attribute: "failed", reflect: true },
  spectrum: { type: String, attribute: "spectrum" },
  detailBg: { type: String, attribute: "detail-bg" },
  secureLabel: { type: String, attribute: "secure-label" },
  checkboxLabel: { type: String, attribute: "checkbox-label" },
  selected: { type: Boolean, attribute: "aria-selected", reflect: true },
  storageOption: { type: String, attribute: "storage", reflect: true },
  stockOfferOsis: {
    type: Object,
    attribute: "stock-offer-osis",
    converter: {
      fromAttribute: (value) => {
        if (!value)
          return;
        const [PUF2, ABM2, M2M2] = value.split(",");
        return { PUF: PUF2, ABM: ABM2, M2M: M2M2 };
      }
    }
  },
  filters: {
    type: String,
    reflect: true,
    converter: {
      fromAttribute: (value) => {
        return Object.fromEntries(
          value.split(",").map((filter) => {
            const [key, order, size] = filter.split(":");
            const value2 = Number(order);
            return [
              key,
              {
                order: isNaN(value2) ? void 0 : value2,
                size
              }
            ];
          })
        );
      },
      toAttribute: (value) => {
        return Object.entries(value).map(
          ([key, { order, size }]) => [key, order, size].filter((v3) => v3 != void 0).join(":")
        ).join(",");
      }
    }
  },
  types: {
    type: String,
    attribute: "types",
    reflect: true
  },
  merchOffer: { type: Object },
  analyticsId: {
    type: String,
    attribute: ANALYTICS_SECTION_ATTR,
    reflect: true
  },
  loading: { type: String }
});
__publicField(MerchCard, "styles", [styles, ...sizeStyles()]);
__publicField(MerchCard, "registerVariant", registerVariant);
__publicField(MerchCard, "getFragmentMapping", getFragmentMapping);
customElements.define(MERCH_CARD, MerchCard);

// src/merch-offer-select.js
var _handleOfferSelectionByQuantityFn;
var MerchOfferSelect = class extends s7 {
  constructor() {
    super();
    __privateAdd(this, _handleOfferSelectionByQuantityFn, void 0);
    this.defaults = {};
    this.variant = "plans";
  }
  /** Returns the default values for the price, cta, and description slots.
   * These are the values coming from the container itself, not from the merch-offer elements.
   * E.g. initial merch-card description text. There is no default price or cta in the container.
   */
  saveContainerDefaultValues() {
    const container = this.closest(this.getAttribute("container"));
    const description = container?.querySelector('[slot="description"]:not(merch-offer > *)')?.cloneNode(true);
    const badgeText = container?.badgeText;
    return {
      description,
      badgeText
    };
  }
  getSlottedElement(slotName, container) {
    const containerEl = container || this.closest(this.getAttribute("container"));
    return containerEl.querySelector(
      `[slot="${slotName}"]:not(merch-offer > *)`
    );
  }
  updateSlot(slotName, container) {
    const slot = this.getSlottedElement(slotName, container);
    if (!slot)
      return;
    const node = this.selectedOffer.getOptionValue(slotName) ? this.selectedOffer.getOptionValue(slotName) : this.defaults[slotName];
    if (node) {
      slot.replaceWith(node.cloneNode(true));
    }
  }
  handleOfferSelection(e7) {
    const newOffer = e7.detail;
    this.selectOffer(newOffer);
  }
  handleOfferSelectionByQuantity(event) {
    const selected = event.detail.option;
    const selectedValue = Number.parseInt(selected);
    const newOffer = this.findAppropriateOffer(selectedValue);
    this.selectOffer(newOffer);
    const cta = this.getSlottedElement("cta");
    cta.setAttribute("data-quantity", selectedValue);
  }
  selectOffer(newOffer) {
    if (!newOffer) {
      return;
    }
    const previousOffer = this.selectedOffer;
    if (previousOffer) {
      previousOffer.selected = false;
    }
    newOffer.selected = true;
    this.selectedOffer = newOffer;
    this.planType = newOffer.planType;
    this.updateContainer();
    this.updateComplete.then(() => {
      this.dispatchEvent(
        new CustomEvent(EVENT_OFFER_SELECTED, {
          detail: this,
          bubbles: true
        })
      );
    });
  }
  findAppropriateOffer(selectedValue) {
    let previousOfferWithValue = null;
    const foundOffer = this.offers.find((offer) => {
      const offerAttribute = Number.parseInt(offer.getAttribute("value"));
      if (offerAttribute === selectedValue) {
        return true;
      } else if (offerAttribute > selectedValue) {
        return false;
      } else {
        previousOfferWithValue = offer;
      }
    });
    return foundOffer || previousOfferWithValue;
  }
  /**
   * If badge text is empty string - delete the badge.
   * If badge text is present - set the badge.
   * If badge text is null or undefined - set default badge. */
  updateBadgeText(container) {
    if (this.selectedOffer.badgeText === "") {
      container.badgeText = null;
    } else if (this.selectedOffer.badgeText) {
      container.badgeText = this.selectedOffer.badgeText;
    } else {
      container.badgeText = this.defaults.badgeText;
    }
  }
  /** Will update price, cta, and other slots/properties in parent container (e.g. merch-card) */
  updateContainer() {
    const container = this.closest(this.getAttribute("container"));
    if (!container || !this.selectedOffer)
      return;
    this.updateSlot("cta", container);
    this.updateSlot("secondary-cta", container);
    this.updateSlot("price", container);
    if (this.manageableMode)
      return;
    this.updateSlot("description", container);
    this.updateBadgeText(container);
  }
  render() {
    return x2`<fieldset><slot class="${this.variant}"></slot></fieldset>`;
  }
  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("focusin", this.handleFocusin);
    this.addEventListener("click", this.handleFocusin);
    this.addEventListener(
      EVENT_MERCH_OFFER_READY,
      this.handleOfferSelectReady
    );
    const quantitySelect = this.closest("merch-quantity-select");
    this.manageableMode = quantitySelect;
    this.offers = [...this.querySelectorAll("merch-offer")];
    __privateSet(this, _handleOfferSelectionByQuantityFn, this.handleOfferSelectionByQuantity.bind(this));
    if (this.manageableMode) {
      quantitySelect.addEventListener(
        EVENT_MERCH_QUANTITY_SELECTOR_CHANGE,
        __privateGet(this, _handleOfferSelectionByQuantityFn)
      );
    } else {
      this.defaults = this.saveContainerDefaultValues();
    }
    this.selectedOffer = this.offers[0];
    if (this.planType) {
      this.updateContainer();
    }
  }
  get miniCompareMobileCard() {
    return this.merchCard?.variant === "mini-compare-chart" && this.isMobile;
  }
  get merchCard() {
    return this.closest("merch-card");
  }
  get isMobile() {
    return window.matchMedia("(max-width: 767px)").matches;
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener(
      EVENT_MERCH_QUANTITY_SELECTOR_CHANGE,
      __privateGet(this, _handleOfferSelectionByQuantityFn)
    );
    this.removeEventListener(
      EVENT_MERCH_OFFER_READY,
      this.handleOfferSelectReady
    );
    this.removeEventListener("focusin", this.handleFocusin);
    this.removeEventListener("click", this.handleFocusin);
  }
  get price() {
    return this.querySelector(
      'merch-offer[aria-selected] [is="inline-price"]'
    );
  }
  get customerSegment() {
    return this.selectedOffer?.customerSegment;
  }
  get marketSegment() {
    return this.selectedOffer?.marketSegment;
  }
  handleFocusin(event) {
    if (event.target?.nodeName === "MERCH-OFFER") {
      event.preventDefault();
      event.stopImmediatePropagation();
      this.selectOffer(event.target);
    }
  }
  async handleOfferSelectReady() {
    if (this.planType)
      return;
    if (this.querySelector("merch-offer:not([plan-type])"))
      return;
    this.planType = this.selectedOffer.planType;
    await this.updateComplete;
    this.selectOffer(
      this.selectedOffer ?? this.querySelector("merch-offer[aria-selected]") ?? this.querySelector("merch-offer")
    );
    this.dispatchEvent(
      new CustomEvent(EVENT_MERCH_OFFER_SELECT_READY, { bubbles: true })
    );
  }
};
_handleOfferSelectionByQuantityFn = new WeakMap();
__publicField(MerchOfferSelect, "styles", i3`
        :host {
            display: inline-block;
        }

        :host .horizontal {
            display: flex;
            flex-direction: row;
        }

        fieldset {
            display: contents;
        }

        :host([variant='subscription-options']) {
            display: flex;
            flex-direction: column;
            gap: var(--consonant-merch-spacing-xs);
        }
    `);
__publicField(MerchOfferSelect, "properties", {
  offers: { type: Array },
  selectedOffer: { type: Object },
  defaults: { type: Object },
  variant: { type: String, attribute: "variant", reflect: true },
  planType: { type: String, attribute: "plan-type", reflect: true },
  stock: { type: Boolean, reflect: true }
});
customElements.define("merch-offer-select", MerchOfferSelect);

// src/merch-offer.css.js
var styles3 = i3`
    :host {
        --merch-radio: rgba(82, 88, 228);
        --merch-radio-hover: rgba(64, 70, 202);
        --merch-radio-down: rgba(50, 54, 168);
        --merch-radio-selected: rgb(2, 101, 220);
        --merch-hovered-shadow: 0 0 0 1px #aaa;
        --merch-selected-shadow: 0 0 0 2px var(--merch-radio-selected);
        box-sizing: border-box;
    }
    .merch-Radio {
        align-items: flex-start;
        display: flex;
        max-inline-size: 100%;
        margin-inline-end: 19px;
        min-block-size: 32px;
        position: relative;
        vertical-align: top;
    }

    .merch-Radio-input {
        block-size: 100%;
        box-sizing: border-box;
        cursor: pointer;
        font-family: inherit;
        font-size: 100%;
        inline-size: 100%;
        line-height: 1.3;
        margin: 0;
        opacity: 0;
        overflow: visible;
        padding: 0;
        position: absolute;
        z-index: 1;
    }

    .merch-Radio-button {
        block-size: 14px;
        box-sizing: border-box;
        flex-grow: 0;
        flex-shrink: 0;
        inline-size: 14px;
        margin-block-start: 9px;
        position: relative;
    }

    .merch-Radio-button:before {
        border-color: rgb(109, 109, 109);
        border-radius: 50%;
        border-style: solid;
        border-width: 2px;
        box-sizing: border-box;
        content: '';
        display: block;
        height: 14px;
        position: absolute;
        transition:
            border 0.13s ease-in-out,
            box-shadow 0.13s ease-in-out;
        width: 14px;
        z-index: 0;
    }

    .merch-Radio-button:after {
        border-radius: 50%;
        content: '';
        display: block;
        left: 50%;
        position: absolute;
        top: 50%;
        transform: translateX(-50%) translateY(-50%);
        transition:
            opacity 0.13s ease-out,
            margin 0.13s ease-out;
    }

    :host(:active) .merch-Radio-button:before {
        border-color: var(--merch-radio-down);
    }

    :host(:hover) .merch-Radio-button:before {
        border-color: var(--merch-radio-hover);
    }

    :host([aria-selected]) .merch-Radio-button::before {
        border-color: var(--merch-radio-selected);
        border-width: 5px;
    }

    .merch-Radio-label {
        color: rgb(34, 34, 34);
        font-size: 14px;
        line-height: 18.2px;
        margin-block-end: 9px;
        margin-block-start: 6px;
        margin-inline-start: 10px;
        text-align: start;
        transition: color 0.13s ease-in-out;
    }

    input {
        height: 0;
        outline: none;
        position: absolute;
        width: 0;
        z-index: -1;
    }

    .label {
        background-color: white;
        border: 1px solid transparent;
        border-radius: var(--consonant-merch-spacing-xxxs);
        cursor: pointer;
        display: block;
        margin: var(--consonant-merch-spacing-xs) 0;
        padding: var(--consonant-merch-spacing-xs);
        position: relative;
    }

    label:hover {
        box-shadow: var(--merch-hovered-shadow);
    }

    :host([aria-selected]) label {
        box-shadow: var(--merch-selected-shadow);
    }

    sp-icon-info-outline {
        color: #6e6e6e;
        content: '';
    }

    ::slotted(p),
    ::slotted(h5) {
        margin: 0;
    }

    ::slotted([slot='commitment']) {
        font-size: 14px !important;
        font-weight: normal !important;
        line-height: 17px !important;
    }

    #condition {
        line-height: 15px;
    }

    ::slotted([slot='condition']) {
        display: inline-block;
        font-style: italic;
        font-size: 12px;
    }

    ::slotted([slot='teaser']) {
        color: #2d9d78;
        font-size: 14px;
        font-weight: bold;
        line-height: 17px;
    }

    :host([type='subscription-option']) slot[name='price'] {
        display: flex;
        flex-direction: row-reverse;
        align-self: baseline;
        gap: 6px;
    }

    ::slotted(span[is='inline-price']) {
        font-size: 16px;
        font-weight: bold;
        line-height: 20px;
    }

    ::slotted(span[data-template='strikethrough']) {
        font-weight: normal;
    }

    :host([type='subscription-option']) {
        background-color: #fff;
        box-sizing: border-box;
        border-width: 2px;
        border-radius: 5px;
        border-style: solid;
        border-color: #eaeaea;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 16px;
        min-height: 102px;
    }

    :host([type='subscription-option']:hover) {
        border-color: #cacaca;
    }

    :host([type='subscription-option'][aria-selected]) {
        border-color: #1473e6;
    }

    :host([type='subscription-option']) #condition {
        display: flex;
        align-items: center;
        gap: 4px;
    }

    :host([type='subscription-option'])
        ::slotted([is='inline-price'][data-display-tax='true']) {
        position: relative;
        height: 40px;
    }
`;

// src/merch-offer.js
var TAG_NAME = "merch-offer";
var MerchOffer = class extends s7 {
  constructor() {
    super();
    __publicField(this, "tr");
    this.type = "radio";
    this.selected = false;
  }
  getOptionValue(slotName) {
    return this.querySelector(`[slot="${slotName}"]`);
  }
  // setting attributes can't be done in constructor, so using connectedCallback
  connectedCallback() {
    super.connectedCallback();
    this.initOffer();
    this.configuration = this.closest("quantity-selector");
    if (!this.hasAttribute("tabindex") && !this.configuration) {
      this.tabIndex = 0;
    }
    if (!this.hasAttribute("role") && !this.configuration) {
      this.role = "radio";
    }
  }
  get asRadioOption() {
    return x2` <div class="merch-Radio">
            <input tabindex="-1" type="radio" class="merch-Radio-input" />
            <span class="merch-Radio-button"></span>
            <span class="merch-Radio-label">${this.text}</span>
        </div>`;
  }
  get asSubscriptionOption() {
    return x2`<slot name="commitment"></slot>
            <slot name="price"></slot>
            <slot name="teaser"></slot>
            <div id="condition">
                <slot name="condition"></slot>
                <span id="info">
                    <sp-icon-info-outline size="s"></sp-icon-info-outline
                ></span>
                <sp-overlay placement="top" trigger="info@hover" type="hint">
                    <sp-tooltip
                        ><slot name="condition-tooltip"></slot
                    ></sp-tooltip>
                </sp-overlay>
            </div>`;
  }
  render() {
    if (this.configuration)
      return "";
    if (!this.price)
      return "";
    if (this.type === "subscription-option")
      return this.asSubscriptionOption;
    return this.asRadioOption;
  }
  get price() {
    return this.querySelector(
      'span[is="inline-price"]:not([data-template="strikethrough"])'
    );
  }
  get cta() {
    return this.querySelector(SELECTOR_MAS_CHECKOUT_LINK);
  }
  get prices() {
    return this.querySelectorAll('span[is="inline-price"]');
  }
  get customerSegment() {
    return this.price?.value?.[0].customerSegment;
  }
  get marketSegment() {
    return this.price?.value?.[0].marketSegments[0];
  }
  async initOffer() {
    if (!this.price)
      return;
    this.prices.forEach((el) => el.setAttribute("slot", "price"));
    await this.updateComplete;
    await Promise.all([...this.prices].map((price2) => price2.onceSettled()));
    const {
      value: [offer]
    } = this.price;
    this.planType = offer.planType;
    await this.updateComplete;
    this.dispatchEvent(
      new CustomEvent(EVENT_MERCH_OFFER_READY, { bubbles: true })
    );
  }
};
__publicField(MerchOffer, "properties", {
  text: { type: String },
  selected: { type: Boolean, attribute: "aria-selected", reflect: true },
  badgeText: { type: String, attribute: "badge-text" },
  type: { type: String, attribute: "type", reflect: true },
  // values: radio, subscription-option
  planType: { type: String, attribute: "plan-type", reflect: true }
});
__publicField(MerchOffer, "styles", [styles3]);
customElements.define(TAG_NAME, MerchOffer);

// src/merch-quantity-select.css.js
var styles4 = i3`
    :host {
        box-sizing: border-box;
        --background-color: var(--qs-background-color, #f6f6f6);
        --text-color: #000;
        --radius: 5px;
        --border-color: var(--qs-border-color, #e8e8e8);
        --border-width: var(--qs-border-width, 1px);
        --label-font-size: var(--qs-label-font-size, 12px);
        --font-size: var(--qs-font-size, 12px);
        --label-color: var(--qs-lable-color, #000);
        --input-height: var(--qs-input-height, 30px);
        --input-width: var(--qs-input-width, 72px);
        --button-width: var(--qs-button-width, 30px);
        --font-size: var(--qs-font-size, 12px);
        --picker-fill-icon: var(
            --chevron-down-icon,
            url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="10" height="6" aria-hidden="true" viewBox="0 0 10 6"><path fill="%23787878" d="M9.99 1.01A1 1 0 0 0 8.283.3L5 3.586 1.717.3A1 1 0 1 0 .3 1.717L4.293 5.7a1 1 0 0 0 1.414 0L9.7 1.717a1 1 0 0 0 .29-.707z"/></svg>')
        );
        --qs-transition: var(--transition);

        display: block;
        position: relative;
        color: var(--text-color);
        line-height: var(--qs-line-height, 2);
    }

    .text-field {
        display: flex;
        align-items: center;
        width: var(--input-width);
        position: relative;
        margin-top: 6px;
    }

    .text-field-input {
        font-family: inherit;
        padding: 0;
        font-size: var(--font-size);
        height: var(--input-height);
        width: calc(var(--input-width) - var(--button-width));
        border: var(--border-width) solid var(--border-color);
        border-top-left-radius: var(--radius);
        border-bottom-left-radius: var(--radius);
        border-right: none;
        padding-inline-start: 12px;
        box-sizing: border-box;
        -moz-appearance: textfield;
    }

    .text-field-input::-webkit-inner-spin-button,
    .text-field-input::-webkit-outer-spin-button {
        margin: 0;
        -webkit-appearance: none;
    }

    .label {
        font-size: var(--label-font-size);
        color: var(--label-color);
    }

    .picker-button {
        width: var(--button-width);
        height: var(--input-height);
        position: absolute;
        inset-inline-end: 0;
        border: var(--border-width) solid var(--border-color);
        border-top-right-radius: var(--radius);
        border-bottom-right-radius: var(--radius);
        background-color: var(--background-color);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        padding: 0;
    }

    .picker-button-fill {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-image: var(--picker-fill-icon);
        background-position: center;
        background-repeat: no-repeat;
    }

    .popover {
        position: absolute;
        top: var(--input-height);
        left: 0;
        width: var(--input-width);
        border-radius: var(--radius);
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        z-index: 100;
        margin-top: var(--popover-margin-top, 6px);
        transition: var(--qs-transition);
        opacity: 0;
        box-sizing: border-box;
    }

    .popover.open {
        opacity: 1;
        background: #ffffff;
        border: var(--border-width) solid var(--border-color);
    }

    .popover.closed {
        max-height: 0;
        opacity: 0;
    }

    ::slotted(p) {
        margin: 0;
    }

    .item {
        display: flex;
        align-items: center;
        color: var(--text-color);
        font-size: var(--font-size);
        padding-inline-start: 12px;
        box-sizing: border-box;
    }

    .item.highlighted {
        background-color: var(--background-color);
    }
`;

// src/focus.js
var [ARROW_LEFT, ARROW_RIGHT, ARROW_UP, ARROW_DOWN, ENTER, TAB] = [
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown",
  "Enter",
  "Tab"
];

// src/merch-quantity-select.js
var MerchQuantitySelect = class extends s7 {
  static get properties() {
    return {
      closed: { type: Boolean, reflect: true },
      selected: { type: Number },
      min: { type: Number },
      max: { type: Number },
      step: { type: Number },
      maxInput: { type: Number, attribute: "max-input" },
      options: { type: Array },
      highlightedIndex: { type: Number },
      defaultValue: {
        type: Number,
        attribute: "default-value",
        reflect: true
      },
      title: { type: String }
    };
  }
  static get styles() {
    return styles4;
  }
  constructor() {
    super();
    this.options = [];
    this.title = "";
    this.closed = true;
    this.min = 0;
    this.max = 0;
    this.step = 0;
    this.maxInput = void 0;
    this.defaultValue = void 0;
    this.selectedValue = 0;
    this.highlightedIndex = 0;
    this.toggleMenu = this.toggleMenu.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.boundKeydownListener = this.handleKeydown.bind(this);
    this.addEventListener("keydown", this.boundKeydownListener);
    window.addEventListener("mousedown", this.handleClickOutside);
    this.handleKeyupDebounced = debounce(this.handleKeyup.bind(this), 500);
  }
  handleKeyup() {
    this.handleInput();
    this.sendEvent();
  }
  handleKeydown(e7) {
    switch (e7.key) {
      case ARROW_DOWN:
        if (!this.closed) {
          e7.preventDefault();
          this.highlightedIndex = (this.highlightedIndex + 1) % this.options.length;
        }
        break;
      case ARROW_UP:
        if (!this.closed) {
          e7.preventDefault();
          this.highlightedIndex = (this.highlightedIndex - 1 + this.options.length) % this.options.length;
        }
        break;
      case ENTER:
        if (!this.closed) {
          const option = this.options[this.highlightedIndex];
          if (!option)
            break;
          this.selectedValue = option;
          this.handleMenuOption(this.selectedValue);
          this.toggleMenu();
        } else {
          this.closePopover();
          this.blur();
        }
        break;
    }
    if (e7.composedPath().includes(this))
      e7.stopPropagation();
  }
  adjustInput(inputField, value) {
    this.selectedValue = value;
    inputField.value = value;
    this.highlightedIndex = this.options.indexOf(value);
  }
  handleInput() {
    const inputField = this.shadowRoot.querySelector(".text-field-input");
    const inputValue = parseInt(inputField.value);
    if (isNaN(inputValue))
      return;
    if (inputValue > 0 && inputValue !== this.selectedValue) {
      let adjustedInputValue = inputValue;
      if (this.maxInput && inputValue > this.maxInput)
        adjustedInputValue = this.maxInput;
      if (this.min && adjustedInputValue < this.min)
        adjustedInputValue = this.min;
      this.adjustInput(inputField, adjustedInputValue);
    } else
      this.adjustInput(inputField, this.min || 1);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("mousedown", this.handleClickOutside);
    this.removeEventListener("keydown", this.boundKeydownListener);
  }
  generateOptionsArray() {
    const options = [];
    if (this.step > 0) {
      for (let value = this.min; value <= this.max; value += this.step) {
        options.push(value);
      }
    }
    return options;
  }
  update(changedProperties) {
    if (changedProperties.has("min") || changedProperties.has("max") || changedProperties.has("step") || changedProperties.has("defaultValue")) {
      this.options = this.generateOptionsArray();
      this.highlightedIndex = this.defaultValue ? this.options.indexOf(this.defaultValue) : 0;
      this.handleMenuOption(
        this.defaultValue ? this.defaultValue : this.options[0]
      );
    }
    super.update(changedProperties);
  }
  handleClickOutside(event) {
    const path = event.composedPath();
    if (!path.includes(this)) {
      this.closePopover();
    }
  }
  toggleMenu() {
    this.closed = !this.closed;
  }
  handleMouseEnter(index) {
    this.highlightedIndex = index;
  }
  handleMenuOption(option) {
    if (option === this.max)
      this.shadowRoot.querySelector(".text-field-input")?.focus();
    this.selectedValue = option;
    this.sendEvent();
    this.closePopover();
  }
  sendEvent() {
    const customEvent = new CustomEvent(
      EVENT_MERCH_QUANTITY_SELECTOR_CHANGE,
      {
        detail: { option: this.selectedValue },
        bubbles: true
      }
    );
    this.dispatchEvent(customEvent);
  }
  closePopover() {
    if (!this.closed) {
      this.toggleMenu();
    }
  }
  get offerSelect() {
    return this.querySelector("merch-offer-select");
  }
  get popover() {
    return x2` <div class="popover ${this.closed ? "closed" : "open"}">
            ${this.options.map(
      (option, index) => x2`
                    <div
                        class="item ${index === this.highlightedIndex ? "highlighted" : ""}"
                        @click="${() => this.handleMenuOption(option)}"
                        @mouseenter="${() => this.handleMouseEnter(index)}"
                    >
                        ${option === this.max ? `${option}+` : option}
                    </div>
                `
    )}
        </div>`;
  }
  render() {
    return x2`
            <div class="label">${this.title}</div>
            <div class="text-field">
                <input
                    class="text-field-input"
                    @focus="${this.closePopover}"
                    .value="${this.selectedValue}"
                    type="number"
                    @keydown="${this.handleKeydown}"
                    @keyup="${this.handleKeyupDebounced}"
                />
                <button class="picker-button" @click="${this.toggleMenu}">
                    <div
                        class="picker-button-fill ${this.closed ? "open" : "closed"}"
                    ></div>
                </button>
                ${this.popover}
            </div>
        `;
  }
};
customElements.define("merch-quantity-select", MerchQuantitySelect);

// src/variants/ccd-suggested.css.js
var CSS9 = `

  merch-card[variant="ccd-suggested"] [slot="heading-xs"] {
    font-size: var(--consonant-merch-card-heading-xxs-font-size);
    line-height: var(--consonant-merch-card-heading-xxs-line-height);
  }
  
  merch-card[variant="ccd-suggested"] [slot="body-xs"] a {
    font-size: var(--consonant-merch-card-body-xxs-font-size);
    line-height: var(--consonant-merch-card-body-xxs-line-height);
  }

  merch-card[variant="ccd-suggested"] [slot="price"] em {
      font-size: var(--consonant-merch-card-body-xxs-font-size);
      line-height: var(--consonant-merch-card-body-xxs-line-height);
  }

.spectrum--darkest merch-card[variant="ccd-suggested"] {
  --consonant-merch-card-background-color:rgb(30, 30, 30);
  --consonant-merch-card-heading-xs-color:rgb(239, 239, 239);
  --consonant-merch-card-body-xs-color:rgb(200, 200, 200);
  --consonant-merch-card-border-color:rgb(57, 57, 57);
  --consonant-merch-card-detail-s-color:rgb(162, 162, 162);
  --consonant-merch-card-price-color:rgb(248, 248, 248);
  --merch-color-inline-price-strikethrough:rgb(176, 176, 176);
}

.spectrum--darkest  merch-card[variant="ccd-suggested"]:hover {
  --consonant-merch-card-border-color:rgb(73, 73, 73);
}
`;

// src/variants/ccd-suggested.js
var CCD_SUGGESTED_AEM_FRAGMENT_MAPPING = {
  backgroundImage: { attribute: "background-image" },
  badge: true,
  ctas: { slot: "cta", size: "M" },
  description: { tag: "div", slot: "body-xs" },
  mnemonics: { size: "l" },
  prices: { tag: "p", slot: "price" },
  size: [],
  subtitle: { tag: "h4", slot: "detail-s" },
  title: { tag: "h3", slot: "heading-xs" }
};
var CCDSuggested = class extends VariantLayout {
  getGlobalCSS() {
    return CSS9;
  }
  /* c8 ignore next 3 */
  get aemFragmentMapping() {
    return CCD_SUGGESTED_AEM_FRAGMENT_MAPPING;
  }
  get stripStyle() {
    if (!this.card.backgroundImage)
      return "";
    return `
            background: url("${this.card.backgroundImage}");
        background-size: auto 100%;
        background-repeat: no-repeat;
        background-position: ${this.card.dir === "ltr" ? "left" : "right"};
        `;
  }
  renderLayout() {
    return x2` <div style="${this.stripStyle}" class="body">
                <div class="header">
                    <div class="top-section">
                        <slot name="icons"></slot>
                        ${this.badge}
                    </div>
                    <div class="headings">
                        <slot name="detail-s"></slot>
                        <slot name="heading-xs"></slot>
                    </div>
                </div>
                <slot name="body-xs"></slot>
                <div class="footer">
                    <slot name="price"></slot>
                    <slot name="cta"></slot>
                </div>
            </div>
            <slot></slot>`;
  }
  postCardUpdateHook(changedProperties) {
    if (changedProperties.has("backgroundImage"))
      this.styleBackgroundImage();
  }
  styleBackgroundImage() {
    this.card.classList.remove("thin-strip");
    this.card.classList.remove("wide-strip");
    if (!this.card.backgroundImage) {
      return;
    }
    const img = new Image();
    img.src = this.card.backgroundImage;
    img.onload = () => {
      if (img.width > 8) {
        this.card.classList.add("wide-strip");
      } else if (img.width === 8) {
        this.card.classList.add("thin-strip");
      }
    };
  }
};
__publicField(CCDSuggested, "variantStyle", i3`
        :host([variant='ccd-suggested']) {
            --consonant-merch-card-background-color: rgb(245, 245, 245);
            --consonant-merch-card-body-xs-color: rgb(75, 75, 75);
            --consonant-merch-card-border-color: rgb(225, 225, 225);
            --consonant-merch-card-detail-s-color: rgb(110, 110, 110);
            --consonant-merch-card-heading-xs-color: rgb(44, 44, 44);
            --merch-color-inline-price-strikethrough: var(--spectrum-gray-600);
            --mod-img-height: 38px;

            box-sizing: border-box;
            width: 100%;
            max-width: 305px;
            min-width: 270px;
            min-height: 205px;
            border-radius: 4px;
            display: flex;
            flex-flow: wrap;
            overflow: hidden;
        }

        :host([variant='ccd-slice']) * {
            overflow: hidden;
        }

        :host([variant='ccd-suggested']:hover) {
            --consonant-merch-card-border-color: #cacaca;
        }

        :host([variant='ccd-suggested']) .body {
            height: auto;
            padding: 20px;
            gap: 0;
        }

        :host([variant='ccd-suggested'].thin-strip) .body {
            padding: 20px 20px 20px 28px;
        }

        :host([variant='ccd-suggested']) .header {
            display: flex;
            flex-flow: wrap;
            place-self: flex-start;
            flex-wrap: nowrap;
        }

        :host([variant='ccd-suggested']) .headings {
            padding-inline-start: var(--consonant-merch-spacing-xxs);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        :host([variant='ccd-suggested']) ::slotted([slot='icons']) {
            place-self: center;
        }

        :host([variant='ccd-suggested']) ::slotted([slot='heading-xs']) {
            font-size: var(--consonant-merch-card-heading-xxs-font-size);
            line-height: var(--consonant-merch-card-heading-xxs-line-height);
        }

        :host([variant='ccd-suggested']) ::slotted([slot='detail-m']) {
            line-height: var(--consonant-merch-card-detail-m-line-height);
        }

        :host([variant='ccd-suggested']) ::slotted([slot='body-xs']) {
            color: var(--ccd-gray-700-dark);
            padding-top: 8px;
            flex-grow: 1;
        }

        :host([variant='ccd-suggested'].wide-strip)
            ::slotted([slot='body-xs']) {
            padding-inline-start: 48px;
        }

        :host([variant='ccd-suggested'].wide-strip) ::slotted([slot='price']) {
            padding-inline-start: 48px;
        }

        :host([variant='ccd-suggested']) ::slotted([slot='price']) {
            font-size: var(--consonant-merch-card-body-xs-font-size);
            line-height: var(--consonant-merch-card-body-xs-line-height);
        }

        :host([variant='ccd-suggested']) ::slotted([slot='cta']) {
            display: flex;
            align-items: center;
            min-width: fit-content;
        }

        :host([variant='ccd-suggested']) .footer {
            display: flex;
            justify-content: space-between;
            flex-grow: 0;
            margin-top: 6px;
            align-items: center;
        }

        :host([variant='ccd-suggested']) div[class$='-badge'] {
            position: static;
            border-radius: 4px;
        }

        :host([variant='ccd-suggested']) .top-section {
            align-items: center;
        }
    `);

// src/variants/ccd-slice.css.js
var CSS10 = `

merch-card[variant="ccd-slice"] [slot='image'] img {
  overflow: hidden;
  border-radius: 50%;
}

merch-card[variant="ccd-slice"] [slot='body-s'] a.spectrum-Link {
  font-size: var(--consonant-merch-card-body-xxs-font-size);
  font-style: normal;
  font-weight: 400;
  line-height: var(--consonant-merch-card-body-xxs-line-height);
}

.spectrum--darkest merch-card[variant="ccd-slice"] {
  --consonant-merch-card-background-color:rgb(29, 29, 29);
  --consonant-merch-card-body-s-color:rgb(235, 235, 235);
  --consonant-merch-card-border-color:rgb(48, 48, 48);
  --consonant-merch-card-detail-s-color:rgb(235, 235, 235);
}
`;

// src/variants/ccd-slice.js
var CCD_SLICE_AEM_FRAGMENT_MAPPING = {
  backgroundImage: { tag: "div", slot: "image" },
  badge: true,
  ctas: { slot: "footer", size: "S" },
  description: { tag: "div", slot: "body-s" },
  mnemonics: { size: "m" },
  size: ["wide"]
};
var CCDSlice = class extends VariantLayout {
  getGlobalCSS() {
    return CSS10;
  }
  /* c8 ignore next 3 */
  get aemFragmentMapping() {
    return CCD_SLICE_AEM_FRAGMENT_MAPPING;
  }
  renderLayout() {
    return x2` <div class="content">
                <div class="top-section">
                    <slot name="icons"></slot>
                    ${this.badge}
                </div>
                <slot name="body-s"></slot>
                <slot name="footer"></slot>
            </div>
            <slot name="image"></slot>
            <slot></slot>`;
  }
};
__publicField(CCDSlice, "variantStyle", i3`
        :host([variant='ccd-slice']) {
            --consonant-merch-card-background-color: rgb(248, 248, 248);
            --consonant-merch-card-border-color: rgb(230, 230, 230);
            --consonant-merch-card-body-s-color: rgb(34, 34, 34);
            --merch-color-inline-price-strikethrough: var(--spectrum-gray-600);
            --mod-img-height: 29px;

            box-sizing: border-box;
            min-width: 290px;
            max-width: 322px;
            width: 100%;
            max-height: 154px;
            height: 154px;
            border-radius: 4px;
            display: flex;
            flex-flow: wrap;
        }

        :host([variant='ccd-slice']) * {
            overflow: hidden;
        }

        :host([variant='ccd-slice']) ::slotted([slot='body-s']) {
            font-size: var(--consonant-merch-card-body-xs-font-size);
            line-height: var(--consonant-merch-card-body-xxs-line-height);
            min-width: 154px;
            max-width: 171px;
            height: 55px;
            overflow: hidden;
        }

        :host([variant='ccd-slice'][size='wide']) ::slotted([slot='body-s']) {
            max-width: 425px;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        :host([variant='ccd-slice'][size='wide']) {
            width: 600px;
            max-width: 600px;
        }

        :host([variant='ccd-slice']) .content {
            display: flex;
            gap: var(--consonant-merch-spacing-xxs);
            padding: 15px;
            padding-inline-end: 0;
            height: 154px;
            box-sizing: border-box;
            min-height: 123px;
            flex-direction: column;
            justify-content: space-between;
            align-items: flex-start;
            flex: 1 0 0;
        }

        :host([variant='ccd-slice'])
            ::slotted([slot='body-s'])
            ::slotted(a:not(.con-button)) {
            font-size: var(--consonant-merch-card-body-xxs-font-size);
            font-style: normal;
            font-weight: 400;
            line-height: var(--consonant-merch-card-body-xxs-line-height);
            text-decoration-line: underline;
            color: var(--spectrum-gray-800, var(--merch-color-grey-80));
        }

        :host([variant='ccd-slice']) ::slotted([slot='image']) {
            display: flex;
            justify-content: center;
            flex-shrink: 0;
            width: 134px;
            height: 149px;
            overflow: hidden;
            border-radius: 50%;
            padding: 15px;
            align-self: center;
            padding-inline-start: 0;
        }

        :host([variant='ccd-slice']) ::slotted([slot='image']) img {
            overflow: hidden;
            border-radius: 50%;
            width: inherit;
            height: inherit;
        }

        :host([variant='ccd-slice']) div[class$='-badge'] {
            font-size: var(--consonant-merch-card-body-xxs-font-size);
            position: static;
            border-radius: 4px;
            font-style: normal;
            font-weight: 400;
            line-height: normal;
            padding: 4px 9px;
        }

        :host([variant='ccd-slice']) .top-section {
            align-items: center;
            gap: 8px;
        }
    `);

// src/variants/ah-try-buy-widget.css.js
var CSS11 = `
    merch-card[variant="ah-try-buy-widget"] [slot="body-xxs"] {
        letter-spacing: normal;
        margin-bottom: 16px;
        box-sizing: border-box;
        color: var(--consonant-merch-card-body-xxs-color);
        word-wrap: break-word;
        overflow-wrap: break-word;
        word-break: break-word;
    }

    merch-card[variant="ah-try-buy-widget"] [slot="body-xxs"] a {
        color: var(--consonant-merch-card-body-xxs-color);
    }

    merch-card[variant="ah-try-buy-widget"] [slot="body-xxs"] a:hover {
        color: var(--consonant-merch-card-body-xxs-color);
    }

    merch-card[variant="ah-try-buy-widget"] [slot="heading-xxxs"] {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        display: -moz-box;
        -webkit-box-orient: vertical;
        -moz-box-orient: vertical;
        line-clamp: 3;
        -webkit-line-clamp: 3;
    }

    merch-card[variant="ah-try-buy-widget"] [slot="price"] .price {
        display: inline-block;
        height: var(--consonant-merch-card-detail-xl-line-height);
        line-height: var(--consonant-merch-card-detail-xl-line-height);
        font-style: normal;
        margin-top: 4px;
    }

    merch-card[variant="ah-try-buy-widget"] [slot="price"] .price.price-strikethrough {
        height: var(--consonant-merch-card-detail-l-line-height);
        line-height: var(--consonant-merch-card-detail-l-line-height);
        font-size: var(--consonant-merch-card-body-xxs-font-size);
        text-decoration-thickness: .5px;
        color: var(--ah-gray-500);
    }

    merch-card[variant="ah-try-buy-widget"] [slot="price"] .price:not(.price-strikethrough) .price-currency-symbol,
    merch-card[variant="ah-try-buy-widget"] [slot="price"] .price:not(.price-strikethrough) .price-integer,
    merch-card[variant="ah-try-buy-widget"] [slot="price"] .price:not(.price-strikethrough) .price-decimals-delimiter,
    merch-card[variant="ah-try-buy-widget"] [slot="price"] .price:not(.price-strikethrough) .price-decimals {
        color: var(--consonant-merch-card-heading-xxxs-color);
        font-size: var(--consonant-merch-card-heading-xs-font-size);
        font-weight: 700;
    }

    merch-card[variant="ah-try-buy-widget"] [slot="price"] .price:not(.price-strikethrough) .price-recurrence {
        display: inline-block;
        width: 21px;
        text-align: end;
        font-size: var(--consonant-merch-card-body-xxs-font-size);
        color: var(--consonant-merch-card-body-xxs-color);
        font-weight: 400;
    }

    merch-card[variant="ah-try-buy-widget"] [slot="price"] a {
        color: var(--consonant-merch-card-body-xxs-color);
        font-size: var(--consonant-merch-card-body-xxs-font-size);
        font-style: normal;
        line-height: var(--consonant-merch-card-body-xxs-line-height);
        text-decoration: underline;
        text-decoration-thickness: .75px;
        text-underline-offset: 1px;
        width: fit-content;
        margin-top: 4px;
    }

    merch-card[variant="ah-try-buy-widget"] [slot="price"] a:hover {
        color: var(--consonant-merch-card-body-xxs-color);
        font-weight: 700;
    }

    merch-card[variant="ah-try-buy-widget"] [slot="cta"] {
        align-self: end;
        gap: 8px;
        display: flex;
        padding-top: 24px;
        flex-wrap: wrap;
    }

    merch-card[variant="ah-try-buy-widget"] [slot="image"] {
      display: none;
    }
    
    merch-card[variant="ah-try-buy-widget"][size='single'] [slot="image"] {
      display: flex;
      width: 199px;
      overflow: hidden;
      height: 100%;
      border-radius: 16px;
      order: 1;
    }

    merch-card[variant="ah-try-buy-widget"][size='single'] [slot="image"] img {
      width: 100%;
      object-fit: cover;
      border-radius: 16px;
      overflow: hidden;
    }

    .spectrum--dark merch-card[variant="ah-try-buy-widget"][background-color='gray'],
    .spectrum--darkest merch-card[variant="ah-try-buy-widget"][background-color='gray'] {
      --merch-card-ah-try-buy-widget-gray-background: rgb(27, 27, 27);
    }

    .spectrum--dark merch-card[variant="ah-try-buy-widget"],
    .spectrum--darkest merch-card[variant="ah-try-buy-widget"] {
      --consonant-merch-card-background-color:rgb(17, 17, 17);
      --consonant-merch-card-heading-xxxs-color:rgb(242, 242, 242);
      --consonant-merch-card-body-xxs-color:rgb(219, 219, 219);
    }

    .spectrum--dark merch-card[variant="ah-try-buy-widget"]:hover,
    .spectrum--darkest merch-card[variant="ah-try-buy-widget"]:hover {
      --consonant-merch-card-border-color:rgb(73, 73, 73);
    }
`;

// src/variants/ah-try-buy-widget.js
var AH_TRY_BUY_WIDGET_AEM_FRAGMENT_MAPPING = {
  mnemonics: { size: "s" },
  title: { tag: "h3", slot: "heading-xxxs", maxCount: 40, withSuffix: true },
  description: {
    tag: "div",
    slot: "body-xxs",
    maxCount: 200,
    withSuffix: false
  },
  prices: { tag: "p", slot: "price" },
  ctas: { slot: "cta", size: "S" },
  backgroundImage: { tag: "div", slot: "image" },
  backgroundColor: { attribute: "background-color" },
  borderColor: { attribute: "border-color", specialValues: {} },
  allowedColors: {
    gray: "--spectrum-gray-100"
  },
  size: ["single", "double", "triple"]
};
var AHTryBuyWidget = class extends VariantLayout {
  getGlobalCSS() {
    return CSS11;
  }
  /* c8 ignore next 3 */
  get aemFragmentMapping() {
    return AH_TRY_BUY_WIDGET_AEM_FRAGMENT_MAPPING;
  }
  renderLayout() {
    return x2`
            <div class="content">
                <div class="header">
                    <slot name="icons"></slot>
                    <slot name="heading-xxxs"></slot>
                </div>
                <slot name="body-xxs"></slot>
                <div class="price">
                    <slot name="price"></slot>
                </div>
                <div class="footer">
                    <slot name="cta"></slot>
                </div>
            </div>
            <slot name="image"></slot>
            <slot></slot>
        `;
  }
};
__publicField(AHTryBuyWidget, "variantStyle", i3`
        :host([variant='ah-try-buy-widget']) {
            --merch-card-ah-try-buy-widget-min-width: 156px;
            --merch-card-ah-try-buy-widget-content-min-width: 132px;
            --merch-card-ah-try-buy-widget-header-min-height: 36px;
            --merch-card-ah-try-buy-widget-gray-background: rgba(248, 248, 248);
            --merch-card-ah-try-buy-widget-text-color: rgba(19, 19, 19);
            --merch-card-ah-try-buy-widget-price-line-height: 17px;
            --merch-card-ah-try-buy-widget-outline: transparent;
            --merch-card-custom-border-width: 1px;
            height: 100%;
            min-width: var(--merch-card-ah-try-buy-widget-min-width);
            background-color: var(
                --merch-card-custom-background-color,
                var(--consonant-merch-card-background-color)
            );
            color: var(--consonant-merch-card-heading-xxxs-color);
            border-radius: 10px;
            border: 1px solid var(--merch-card-custom-border-color, transparent);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            padding: 11px !important;
            gap: 16px;
            justify-content: space-between;
            box-sizing: border-box !important;
        }

        :host([variant='ah-try-buy-widget'][size='single']) {
            flex-direction: row;
        }

        :host([variant='ah-try-buy-widget'][size='single'])
            ::slotted(div[slot='cta']) {
            display: flex;
            flex-grow: 0;
        }

        :host([variant='ah-try-buy-widget']) .content {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            min-width: var(--merch-card-ah-try-buy-widget-content-min-width);
            flex-basis: var(--merch-card-ah-try-buy-widget-content-min-width);
            flex-grow: 1;
        }

        :host([variant='ah-try-buy-widget']) .header {
            display: flex;
            min-height: var(--merch-card-ah-try-buy-widget-header-min-height);
            flex-direction: row;
            align-items: center;
            gap: var(--consonant-merch-spacing-xxs);
            margin-bottom: 4px;
        }

        :host([variant='ah-try-buy-widget']) .price {
            display: flex;
            flex-grow: 1;
        }

        :host([variant='ah-try-buy-widget']) ::slotted([slot='price']) {
            margin-left: var(--spacing-xs);
            display: flex;
            flex-direction: column;
            justify-content: end;
            font-size: var(--consonant-merch-card-detail-s-font-size);
            font-style: italic;
            line-height: var(--merch-card-ah-try-buy-widget-price-line-height);
            color: var(--consonant-merch-card-heading-xxxs-color);
        }

        :host([variant='ah-try-buy-widget']) .footer {
            display: flex;
            width: fit-content;
            flex-wrap: wrap;
            gap: 8px;
            flex-direction: row;
        }
    `);
customElements.define("ah-try-buy-widget", AHTryBuyWidget);

// src/variants/ah-promoted-plans.css.js
var CSS12 = `
    merch-card[variant="ah-promoted-plans"] [slot="body-xxs"] {
        letter-spacing: normal;
        box-sizing: border-box;
        color: var(--consonant-merch-card-body-xxs-color);
        word-wrap: break-word;
        overflow-wrap: break-word;
        word-break: break-word;
    }

    merch-card[variant="ah-promoted-plans"] [slot="body-xxs"] a {
        color: var(--consonant-merch-card-body-xxs-color);
    }

    merch-card[variant="ah-promoted-plans"] [slot="body-xxs"] a:hover {
        color: var(--consonant-merch-card-body-xxs-color);
    }

    merch-card[variant="ah-promoted-plans"] [slot="price"] .price {
        display: inline-block;
        height: var(--consonant-merch-card-detail-xl-line-height);
        line-height: var(--consonant-merch-card-detail-xl-line-height);
        font-style: normal;
    }

    merch-card[variant="ah-promoted-plans"] [slot="price"] .price.price-strikethrough {
        height: var(--consonant-merch-card-detail-l-line-height);
        line-height: var(--consonant-merch-card-detail-l-line-height);
        font-size: var(--consonant-merch-card-body-xxs-font-size);
        text-decoration-thickness: .5px;
        color: var(--merch-card-ah-promoted-plans-strikethrough-color);
    }

    merch-card[variant="ah-promoted-plans"] [slot="price"] .price:not(.price-strikethrough) .price-currency-symbol,
    merch-card[variant="ah-promoted-plans"] [slot="price"] .price:not(.price-strikethrough) .price-integer,
    merch-card[variant="ah-promoted-plans"] [slot="price"] .price:not(.price-strikethrough) .price-decimals-delimiter,
    merch-card[variant="ah-promoted-plans"] [slot="price"] .price:not(.price-strikethrough) .price-decimals {
        color: var(--consonant-merch-card-heading-xxxs-color);
        font-size: var(--consonant-merch-card-heading-xs-font-size);
        font-weight: 700;
    }

    merch-card[variant="ah-promoted-plans"] [slot="price"] .price:not(.price-strikethrough) .price-recurrence {
        display: inline-block;
        width: 21px;
        text-align: end;
        font-size: var(--consonant-merch-card-body-xxs-font-size);
        color: var(--consonant-merch-card-body-xxs-color);
        font-weight: 400;
    }

    merch-card[variant="ah-promoted-plans"] [slot="cta"] {
        gap: 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
    }
    
    merch-card[variant="ah-promoted-plans"] [slot="cta"] .spectrum-Link {
        font-size: var(--consonant-merch-card-body-xxs-font-size);
        line-height: var(--consonant-merch-card-body-xxs-line-height);
        color: var(--consonant-merch-card-body-xxs-color);
    }

    merch-card[variant="ah-promoted-plans"] [slot="cta"] button[is="checkout-button"] {
        margin-inline-start: auto;
    }
    
    merch-card[variant="ah-promoted-plans"] [slot="cta"] button[is="checkout-button"]:last-child {
        margin-inline-start: 0;
    }

    merch-card[variant="ah-promoted-plans"] [slot="price"] em {
        font-size: var(--consonant-merch-card-body-xxs-font-size);
        line-height: var(--consonant-merch-card-body-xxs-line-height);
        color: var(--merch-card-ah-promoted-plans-abm-color);
    }

    .spectrum--dark merch-card[variant="ah-promoted-plans"],
    .spectrum--darkest merch-card[variant="ah-promoted-plans"] {
      --consonant-merch-card-background-color:rgb(34, 34, 34);
      --consonant-merch-card-heading-xxxs-color:rgb(242, 242, 242);
      --merch-card-ah-promoted-plans-abm-color:rgb(175, 175, 175);
      --consonant-merch-card-body-xxs-color:rgb(219, 219, 219);
      --merch-card-ah-promoted-plans-strikethrough-color:rgb(138, 138, 138);
    }
`;

// src/variants/ah-promoted-plans.js
var AH_PROMOTED_PLANS_AEM_FRAGMENT_MAPPING = {
  mnemonics: { size: "s" },
  title: { tag: "h3", slot: "heading-xxxs", maxCount: 40, withSuffix: true },
  description: {
    tag: "div",
    slot: "body-xxs",
    maxCount: 200,
    withSuffix: false
  },
  prices: { tag: "p", slot: "price" },
  ctas: { slot: "cta", size: "S" },
  backgroundImage: { tag: "div", slot: "image" },
  backgroundColor: { attribute: "background-color" },
  borderColor: {
    attribute: "border-color",
    specialValues: {
      gradient: "linear-gradient(135deg, #ff4885 0%, #b272eb 50%, #5d89ff 100%)"
    }
  }
};
var AHPromotedPlans = class extends VariantLayout {
  getGlobalCSS() {
    return CSS12;
  }
  get aemFragmentMapping() {
    return AH_PROMOTED_PLANS_AEM_FRAGMENT_MAPPING;
  }
  renderLayout() {
    return x2`
            <div class="content">
                <div class="header">
                    <slot name="icons"></slot>
                    <slot name="heading-xxxs"></slot>
                </div>
                <div class="price">
                    <slot name="price"></slot>
                </div>
                <slot name="body-xxs"></slot>
                <div class="footer">
                    <slot name="cta"></slot>
                </div>
            </div>
            <slot></slot>
        `;
  }
};
__publicField(AHPromotedPlans, "variantStyle", i3`
        /* Default styles for the component */
        :host([variant='ah-promoted-plans']) {
            --merch-card-ah-promoted-plans-min-width: 211px;
            --merch-card-ah-promoted-plans-max-width: 384px;
            --merch-card-ah-promoted-plans-header-min-height: 36px;
            --merch-card-ah-promoted-plans-gray-background: rgba(248, 248, 248);
            --merch-card-ah-promoted-plans-text-color: rgba(19, 19, 19);
            --merch-card-ah-promoted-plans-abm-color: rgba(80, 80, 80);
            --merch-card-ah-promoted-plans-strikethrough-color: rgba(
                113,
                113,
                113
            );
            --merch-card-ah-promoted-plans-price-line-height: 17px;
            --merch-card-ah-promoted-plans-outline: transparent;
            --merch-card-custom-border-width: 1px;
            height: 100%;
            min-width: var(--merch-card-ah-promoted-plans-min-width);
            max-width: var(--merch-card-ah-promoted-plans-max-width);
            background-color: var(
                --merch-card-custom-background-color,
                var(--consonant-merch-card-background-color)
            );
            color: var(--consonant-merch-card-heading-xxxs-color);
            border-radius: 10px;
            border: 1px solid var(--merch-card-custom-border-color, transparent);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            padding: 16px !important;
            gap: 16px;
            justify-content: space-between;
            box-sizing: border-box !important;
            position: relative;
        }

        :host([variant='ah-promoted-plans'][gradient-border='true']) {
            border: none;
            padding: 15px !important;
            background-origin: padding-box, border-box;
            background-clip: padding-box, border-box;
            background-image: linear-gradient(
                    to bottom,
                    var(
                        --merch-card-custom-background-color,
                        var(--consonant-merch-card-background-color)
                    ),
                    var(
                        --merch-card-custom-background-color,
                        var(--consonant-merch-card-background-color)
                    )
                ),
                linear-gradient(135deg, #ff4885 0%, #b272eb 50%, #5d89ff 100%);
            border: 1px solid transparent;
        }

        :host([variant='ah-promoted-plans']) .content {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            gap: var(--consonant-merch-spacing-xxs);
            flex-grow: 1;
        }

        :host([variant='ah-promoted-plans']) .header {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: var(--consonant-merch-spacing-xxs);
        }

        :host([variant='ah-promoted-plans']) ::slotted([slot='price']) {
            margin-left: var(--spacing-xs);
            display: flex;
            flex-direction: column;
            justify-content: end;
            font-size: var(--consonant-merch-card-body-m-font-size);
            font-style: italic;
            line-height: var(--consonant-merch-card-body-m-line-height);
            color: var(--consonant-merch-card-heading-xxxs-color);
        }

        :host([variant='ah-promoted-plans']) .footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
    `);
customElements.define("ah-promoted-plans", AHPromotedPlans);

// src/mas.js
updateConfig({ sampleRate: 1 });
registerVariant(
  "ccd-suggested",
  CCDSuggested,
  CCD_SUGGESTED_AEM_FRAGMENT_MAPPING,
  CCDSuggested.variantStyle
);
registerVariant(
  "ccd-slice",
  CCDSlice,
  CCD_SLICE_AEM_FRAGMENT_MAPPING,
  CCDSlice.variantStyle
);
registerVariant(
  "ah-try-buy-widget",
  AHTryBuyWidget,
  AH_TRY_BUY_WIDGET_AEM_FRAGMENT_MAPPING,
  AHTryBuyWidget.variantStyle
);
registerVariant(
  "ah-promoted-plans",
  AHPromotedPlans,
  AH_PROMOTED_PLANS_AEM_FRAGMENT_MAPPING,
  AHPromotedPlans.variantStyle
);
/*! Bundled license information:

@lit/reactive-element/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/reactive-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/lit-html.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/reactive-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/lit-html.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-element/lit-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/is-server.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
