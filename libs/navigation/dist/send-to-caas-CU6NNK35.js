import {
  getImsToken
} from "./chunk-MWL56EAN.js";
import {
  getConfig,
  getMetadata
} from "./chunk-G4SXHKM5.js";
import "./chunk-NE6SFPCS.js";

// ../utils/getUuid.js
var HEX_DIGITS = "0123456789abcdef".split("");
var sha1 = async (message) => {
  const data = new TextEncoder().encode(message);
  const hashBuf = await crypto.subtle.digest("SHA-1", data);
  return hashBuf;
};
var uint8ToHex = (int) => {
  const first = int >> 4;
  const second = int - (first << 4);
  return HEX_DIGITS[first] + HEX_DIGITS[second];
};
var uint8ArrayToHex = (buf) => [...buf].map((int) => uint8ToHex(int)).join("");
var hashToUuid = (buf) => [
  uint8ArrayToHex(buf.slice(0, 4)),
  "-",
  uint8ArrayToHex(buf.slice(4, 6)),
  "-",
  uint8ToHex(buf[6] & 15 | parseInt(5 * 10, 16)),
  uint8ToHex(buf[7]),
  "-",
  uint8ToHex(buf[8] & 63 | 128),
  uint8ToHex(buf[9]),
  "-",
  uint8ArrayToHex(buf.slice(10, 16))
].join("");
var getUuid = async (str) => {
  const buf = await sha1(str);
  return hashToUuid(new Uint8Array(buf));
};
var getUuid_default = getUuid;

// ../blocks/caas/utils.js
var LOCALES = {
  // Americas
  ar: { ietf: "es-AR" },
  br: { ietf: "pt-BR" },
  ca: { ietf: "en-CA" },
  ca_fr: { ietf: "fr-CA" },
  cl: { ietf: "es-CL" },
  co: { ietf: "es-CO" },
  cr: { ietf: "es-CR" },
  ec: { ietf: "es-EC" },
  el: { ietf: "es-EL" },
  gt: { ietf: "es-GT" },
  la: { ietf: "es-LA" },
  mx: { ietf: "es-MX" },
  pe: { ietf: "es-PE" },
  pr: { ietf: "es-PR" },
  "": { ietf: "en-US" },
  langstore: { ietf: "en-US" },
  // EMEA
  africa: { ietf: "en-africa" },
  be_fr: { ietf: "fr-BE" },
  be_en: { ietf: "en-BE" },
  be_nl: { ietf: "nl-BE" },
  cy_en: { ietf: "en-CY" },
  dk: { ietf: "da-DK" },
  de: { ietf: "de-DE" },
  ee: { ietf: "et-EE" },
  eg_ar: { ietf: "ar-EG" },
  eg_en: { ietf: "en-GB" },
  es: { ietf: "es-ES" },
  fr: { ietf: "fr-FR" },
  gr_en: { ietf: "en-GR" },
  gr_el: { ietf: "el-GR" },
  ie: { ietf: "en-IE" },
  il_en: { ietf: "en-IL" },
  il_he: { ietf: "he-il" },
  it: { ietf: "it-IT" },
  kw_ar: { ietf: "ar-KW" },
  kw_en: { ietf: "en-GB" },
  lv: { ietf: "lv-LV" },
  lt: { ietf: "lt-LT" },
  lu_de: { ietf: "de-LU" },
  lu_en: { ietf: "en-LU" },
  lu_fr: { ietf: "fr-LU" },
  hu: { ietf: "hu-HU" },
  mt: { ietf: "en-MT" },
  mena_en: { ietf: "en-mena" },
  mena_ar: { ietf: "ar-mena" },
  ng: { ietf: "en-NG" },
  nl: { ietf: "nl-NL" },
  no: { ietf: "no-NO" },
  pl: { ietf: "pl-PL" },
  pt: { ietf: "pt-PT" },
  qa_ar: { ietf: "ar-QA" },
  qa_en: { ietf: "en-GB" },
  ro: { ietf: "ro-RO" },
  sa_en: { ietf: "en-sa" },
  ch_fr: { ietf: "fr-CH" },
  ch_de: { ietf: "de-CH" },
  ch_it: { ietf: "it-CH" },
  si: { ietf: "sl-SI" },
  sk: { ietf: "sk-SK" },
  fi: { ietf: "fi-FI" },
  se: { ietf: "sv-SE" },
  tr: { ietf: "tr-TR" },
  ae_en: { ietf: "en-ae" },
  uk: { ietf: "en-GB" },
  at: { ietf: "de-AT" },
  cz: { ietf: "cs-CZ" },
  bg: { ietf: "bg-BG" },
  ru: { ietf: "ru-RU" },
  ua: { ietf: "uk-UA" },
  ae_ar: { ietf: "ar-ae" },
  sa_ar: { ietf: "ar-sa" },
  za: { ietf: "en-ZA" },
  // Asia Pacific
  au: { ietf: "en-AU" },
  hk_en: { ietf: "en-HK" },
  in: { ietf: "en-in" },
  id_id: { ietf: "id-id" },
  id_en: { ietf: "en-id" },
  my_ms: { ietf: "ms-my" },
  my_en: { ietf: "en-my" },
  nz: { ietf: "en-nz" },
  ph_en: { ietf: "en-ph" },
  ph_fil: { ietf: "fil-PH" },
  sg: { ietf: "en-SG" },
  th_en: { ietf: "en-th" },
  in_hi: { ietf: "hi-in" },
  th_th: { ietf: "th-th" },
  cn: { ietf: "zh-CN" },
  hk_zh: { ietf: "zh-HK" },
  tw: { ietf: "zh-TW" },
  jp: { ietf: "ja-JP" },
  kr: { ietf: "ko-KR" },
  vn_en: { ietf: "en-vn" },
  vn_vi: { ietf: "vi-VN" }
};
var pageConfig = getConfig();
var pageLocales = Object.keys(pageConfig.locales || {});

// ../../tools/send-to-caas/send-utils.js
var CAAS_TAG_URL = "https://www.adobe.com/chimera-api/tags";
var HLX_ADMIN_STATUS = "https://admin.hlx.page/status";
var URL_POSTXDM = "https://14257-milocaasproxy.adobeio-static.net/api/v1/web/milocaas/postXDM";
var VALID_URL_RE = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/;
var VALID_MODAL_RE = /fragments(.*)#[a-zA-Z0-9_-]+$/;
var isKeyValPair = /(\s*\S+\s*:\s*\S+\s*)/;
var isValidUrl = (u) => VALID_URL_RE.test(u);
var isValidModal = (u) => VALID_MODAL_RE.test(u);
var [setConfig, getConfig2] = /* @__PURE__ */ (() => {
  let config = {
    isInjectedDoc: () => (void 0).doc !== document,
    doc: document
  };
  return [
    (c) => {
      config = { ...config, ...c };
      return config;
    },
    () => config
  ];
})();
var getKeyValPairs = (s) => {
  if (!s) return [];
  return s.split(",").filter((v) => v.length).filter((v) => isKeyValPair.test(v)).map((v) => {
    const [key, ...value] = v.split(":");
    return { [key.trim()]: value.join(":").trim() };
  });
};
var addHost = (url) => {
  if (url.startsWith("http")) return url;
  const { host } = getConfig2();
  return `https://${host}${url.startsWith("/") ? "" : "/"}${url}`;
};
var getMetaContent = (propType, propName) => {
  const metaEl = getConfig2().doc.querySelector(`meta[${propType}='${propName}']`);
  if (!metaEl) return void 0;
  return metaEl.content;
};
var prefixHttps = (url) => {
  if (!(url?.startsWith("https://") || url?.startsWith("http://"))) {
    return `https://${url}`;
  }
  return url;
};
var flattenLink = (link) => {
  const htmlElement = document.createElement("div");
  htmlElement.innerHTML = link;
  return htmlElement.querySelector("a").getAttribute("href");
};
var checkUrl = (url, errorMsg) => {
  if (url === void 0 || isValidModal(url)) return url;
  const flatUrl = url.includes("href=") ? flattenLink(url) : url;
  if (isValidModal(flatUrl)) {
    return flatUrl;
  }
  return isValidUrl(flatUrl) ? prefixHttps(flatUrl) : { error: errorMsg };
};
var findTag = (tags, searchStr, ignore = []) => {
  const childTags = [];
  let matchingTag = Object.values(tags).find((tag) => {
    if (ignore.includes(tag.title) || ignore.includes(tag.name) || ignore.includes(tag.path) || ignore.includes(tag.tagID)) return false;
    if (tag.tags && Object.keys(tag.tags).length) {
      childTags.push(tag.tags);
    }
    const tagMatches = [
      tag.title.toLowerCase(),
      tag.name,
      tag.path,
      tag.path.replace("/content/cq:tags/", ""),
      /* c8 ignore next */
      tag.tagID.toLowerCase()
    ];
    if (tagMatches.includes(searchStr.toLowerCase())) return true;
    return false;
  });
  if (!matchingTag) {
    childTags.some((childTag) => {
      matchingTag = findTag(childTag, searchStr, ignore);
      return matchingTag;
    });
  }
  return matchingTag;
};
var [getCaasTags, loadCaasTags] = /* @__PURE__ */ (() => {
  let tags;
  return [
    () => tags,
    async () => {
      try {
        const resp = await fetch(CAAS_TAG_URL);
        if (resp.ok) {
          const json = await resp.json();
          tags = json.namespaces.caas.tags;
          return;
        }
      } catch (e) {
      }
      const { default: caasTags } = await import("./caas-tags-LGXHATAR.js");
      tags = caasTags.namespaces.caas.tags;
    }
  ];
})();
var getTag = (tagName, errors) => {
  if (!tagName) return void 0;
  const caasTags = getCaasTags();
  const tag = findTag(caasTags, tagName, ["Events"]) || findTag(caasTags.events.tags, tagName, []);
  if (!tag) {
    errors.push(tagName);
  }
  return tag;
};
var getTags = (s) => {
  let rawTags = [];
  if (s) {
    rawTags = s.toLowerCase().split(/,|(\s+)|(\\n)|;/g).filter((t) => t && t.trim() && t !== "\n");
  }
  const errors = [];
  const tagIds = rawTags.map((tag) => getTag(tag, errors)).filter((tag) => tag !== void 0).map((tag) => tag.tagID);
  const tags = [...new Set(tagIds)].map((tagID) => ({ id: tagID }));
  return {
    tagErrors: errors,
    tags
  };
};
var getDateProp = (dateStr, errorMsg) => {
  if (!dateStr) return void 0;
  try {
    const date = new Date(dateStr);
    if (date.getFullYear() < 2e3) return { error: `${errorMsg} - Date is before the year 2000` };
    return date.toISOString();
  } catch (e) {
    return { error: errorMsg };
  }
};
var processRepoForFloodgate = (repo, fgColor) => {
  if (repo && fgColor && fgColor !== "default") {
    return repo.slice(0, repo.lastIndexOf(`-${fgColor}`));
  }
  return repo;
};
var getOrigin = (fgColor) => {
  const { project, repo } = getConfig2();
  const origin = project || processRepoForFloodgate(repo, fgColor);
  const mappings = {
    cc: "hawks",
    dc: "doccloud"
  };
  const originLC = mappings[origin.toLowerCase()] || origin;
  if (originLC) {
    return originLC;
  }
  if (window.location.hostname.endsWith(".hlx.page")) {
    const [, singlePageRepo] = window.location.hostname.split(".")[0].split("--");
    return processRepoForFloodgate(singlePageRepo, fgColor);
  }
  throw new Error("No Project or Repo defined in config");
};
var getUrlWithoutFile = (url) => `${url.split("/").slice(0, -1).join("/")}/`;
var getImagePathMd = (keyName) => {
  const mdEl = getConfig2().doc.querySelector(".card-metadata");
  if (!mdEl) return null;
  let url = "";
  [...mdEl.children].some((n) => {
    const key = n.firstElementChild.textContent?.trim().toLowerCase();
    if (key !== keyName) return false;
    const img = n.lastElementChild.querySelector("img");
    if (img) {
      let imgSrc = img.src;
      if (getConfig2().bulkPublish) {
        const rawImgSrc = img.attributes.src.value;
        if (rawImgSrc.startsWith("./")) {
          const urlWithoutFile = getUrlWithoutFile(getConfig2().pageUrl);
          imgSrc = `${urlWithoutFile}${rawImgSrc}`;
        } else if (rawImgSrc.startsWith("/")) {
          imgSrc = `${new URL(getConfig2.pageUrl.origin)}${rawImgSrc}`;
        } else {
          imgSrc = rawImgSrc;
        }
      }
      url = new URL(imgSrc)?.pathname;
    } else {
      url = n.lastElementChild.textContent?.trim();
    }
    return true;
  });
  return url;
};
var getCardImageUrl = () => {
  const { doc } = getConfig2();
  const imageUrl = getImagePathMd("image") || getImagePathMd("cardimage") || getImagePathMd("cardimagepath") || doc.querySelector("main")?.querySelector("img")?.src.replace(/\?.*/, "") || doc.querySelector('meta[property="og:image"]')?.content;
  if (!imageUrl) return null;
  return addHost(imageUrl);
};
var getCardImageAltText = () => {
  const pageMd = parseCardMetadata();
  if (pageMd.cardimage) return "";
  const cardImageUrl = getCardImageUrl();
  const cardImagePath = new URL(cardImageUrl).pathname.split("/").pop();
  const imgTagForCardImage = getConfig2().doc.querySelector(`img[src*="${cardImagePath}"]`);
  return imgTagForCardImage?.alt;
};
var getBadges = (p) => {
  const badges = [];
  if (p.badgeimage) {
    badges.push({ type: "image", value: addHost(p.badgeimage) });
  }
  if (p.badgetext) {
    badges.push({ type: "text", value: p.badgetext });
  }
  return badges;
};
var isPagePublished = async () => {
  let { branch, repo, owner } = getConfig2();
  if (!(branch || repo || owner) && window.location.hostname.endsWith(".hlx.page")) {
    [branch, repo, owner] = window.location.hostname.split(".")[0].split("--");
  }
  if (!(branch || repo || owner)) {
    throw new Error(`Branch, Repo or Owner is not set - branch: ${branch}, repo: ${repo}, owner: ${owner}`);
  }
  const res = await fetch(
    `${HLX_ADMIN_STATUS}/${owner}/${repo}/${branch}${window.location.pathname}`
  );
  if (res.ok) {
    const json = await res.json();
    return json.live.status === 200;
  }
  return false;
};
var getBulkPublishLangAttr = async (options) => {
  let { getLocale } = getConfig2();
  if (!getLocale) {
    const { getLocale: utilsGetLocale } = await import("./utils-5PPNVIT6.js");
    getLocale = utilsGetLocale;
    setConfig({ getLocale });
  }
  return getLocale(LOCALES, options.prodUrl).ietf;
};
var getCountryAndLang = async (options) => {
  const langStr = window.location.pathname === "/tools/send-to-caas/bulkpublisher.html" ? await getBulkPublishLangAttr(options) : (LOCALES[window.location.pathname.split("/")[1]] || LOCALES[""]).ietf;
  const langAttr = langStr?.toLowerCase().split("-") || [];
  const [lang = "en", country = "us"] = langAttr;
  return {
    country,
    lang
  };
};
var parseCardMetadata = () => {
  const pageMd = {};
  const marqueeMetadata = getConfig2().doc.querySelector(".caas-marquee-metadata");
  const cardMetadata = getConfig2().doc.querySelector(".card-metadata");
  const mdEl = cardMetadata || marqueeMetadata;
  const allowHtml = ["description"];
  if (mdEl) {
    mdEl.childNodes.forEach((n) => {
      const key = n.children?.[0]?.textContent?.toLowerCase();
      let val = n.children?.[1]?.textContent;
      if (marqueeMetadata && allowHtml.includes(key)) {
        val = n.children?.[1]?.innerHTML;
      }
      if (!key) return;
      pageMd[key] = val;
    });
  }
  return pageMd;
};
function checkCtaUrl(s, options, i) {
  if (s?.trim() === "") return "";
  const url = s || options.prodUrl || window.location.origin + window.location.pathname;
  return checkUrl(url, `Invalid Cta${i}Url: ${url}`);
}
var props = {
  arbitrary: (s) => getKeyValPairs(s).map((pair) => pair),
  badgeimage: () => getImagePathMd("badgeimage"),
  badgetext: 0,
  bookmarkaction: 0,
  bookmarkenabled: (s = "") => {
    if (s) {
      const lcs = s.toLowerCase();
      if (lcs === "true" || lcs === "on" || lcs === "yes") {
        return true;
      }
    }
    return void 0;
  },
  bookmarkicon: 0,
  carddescription: 0,
  cardtitle: 0,
  cardimage: () => getCardImageUrl(),
  cardimagealttext: (s) => s || getCardImageAltText(),
  contentid: (_, options) => getUuid_default(options.prodUrl),
  contenttype: (s) => s || getMetaContent("property", "og:type") || getConfig2().contentType,
  country: async (s, options) => {
    if (s) return s;
    const { country } = await getCountryAndLang(options);
    return country;
  },
  created: (s) => {
    if (s) {
      return getDateProp(s, `Invalid Created Date: ${s}`);
    }
    const cardDate = parseCardMetadata()?.carddate;
    if (cardDate) {
      return getDateProp(cardDate, `Invalid Date: ${cardDate}`);
    }
    const pubDate = getMetaContent("name", "publishdate") || getMetaContent("name", "publication-date");
    const { doc, lastModified } = getConfig2();
    return pubDate ? getDateProp(pubDate, `publication-date metadata is not a valid date: ${pubDate}`) : getDateProp(lastModified || doc.lastModified, `document.lastModified is not a valid date: ${doc.lastModified}`);
  },
  cta1icon: (s) => checkUrl(s, `Invalid Cta1Icon url: ${s}`),
  cta1style: 0,
  cta1target: 0,
  cta1text: 0,
  cta1url: (s, options) => checkCtaUrl(s, options, 1),
  cta2icon: (s) => checkUrl(s, `Invalid Cta2Icon url: ${s}`),
  cta2style: 0,
  cta2target: 0,
  cta2text: 0,
  cta2url: (s) => checkCtaUrl(s, {}, 2),
  description: (s) => s || getMetaContent("name", "description") || "",
  details: 0,
  entityid: (_, options) => {
    const floodGateColor = options.floodgatecolor || getMetadata("floodgatecolor") || "";
    const salt = floodGateColor === "default" || floodGateColor === "" ? "" : floodGateColor;
    return getUuid_default(`${options.prodUrl}${salt}`);
  },
  env: (s) => s || "",
  eventduration: 0,
  eventend: (s) => getDateProp(s, `Invalid Event End Date: ${s}`),
  eventstart: (s) => getDateProp(s, `Invalid Event Start Date: ${s}`),
  floodgatecolor: (s, options) => s || options.floodgatecolor || getMetadata("floodgatecolor") || "default",
  lang: async (s, options) => {
    if (s) return s;
    const { lang } = await getCountryAndLang(options);
    return lang;
  },
  modified: (s) => {
    const { doc, lastModified } = getConfig2();
    return s ? getDateProp(s, `Invalid Modified Date: ${s}`) : getDateProp(lastModified || doc.lastModified, `document.lastModified is not a valid date: ${doc.lastModified}`);
  },
  origin: (s, options) => {
    if (s) return s;
    const fgColor = options.floodgatecolor || getMetadata("floodgatecolor");
    return getOrigin(fgColor);
  },
  playurl: (s) => checkUrl(s, `Invalid PlayURL: ${s}`),
  primarytag: (s) => {
    const tag = getTag(s);
    return tag ? { id: tag.tagID } : {};
  },
  style: (s) => s || "default",
  tags: (s) => getTags(s),
  title: (s) => s || getMetaContent("property", "og:title") || "",
  uci: (s, options) => s || options.prodUrl || window.location.pathname,
  url: (s, options) => {
    const url = s || options.prodUrl || window.location.origin + window.location.pathname;
    return checkUrl(url, `Invalid URL: ${url}`);
  }
};
var getCaasProps = (p) => {
  const caasProps = {
    entityId: p.entityid,
    contentId: p.contentid,
    contentType: p.contenttype,
    environment: p.env,
    url: p.url,
    floodGateColor: p.floodgatecolor,
    universalContentIdentifier: p.uci,
    title: p.cardtitle || p.title,
    description: p.carddescription || p.description,
    createdDate: p.created,
    modifiedDate: p.modified,
    tags: p.tags,
    primaryTag: p.primarytag,
    ...p.cardimage && {
      thumbnail: {
        altText: p.cardimagealttext,
        url: p.cardimage
      }
    },
    country: p.country,
    language: p.lang,
    cardData: {
      style: p.style,
      headline: p.cardtitle || p.title,
      ...p.details && { details: p.details },
      ...(p.bookmarkenabled || p.bookmarkicon || p.bookmarkaction) && {
        bookmark: {
          enabled: p.bookmarkenabled,
          bookmarkIcon: p.bookmarkicon,
          action: p.bookmarkaction
        }
      },
      badges: getBadges(p),
      ...p.playurl && { playUrl: p.playurl },
      ...(p.cta1url || p.cta2url) && {
        cta: {
          ...p.cta1url && {
            primaryCta: {
              text: p.cta1text,
              url: p.cta1url,
              style: p.cta1style,
              icon: p.cta1icon,
              target: p.cta1target
            }
          },
          ...p.cta2url && {
            secondaryCta: {
              text: p.cta2text,
              url: p.cta2url,
              style: p.cta2style,
              icon: p.cta2icon,
              target: p.cta2target
            }
          }
        }
      },
      ...(p.eventduration || p.eventstart || p.eventend) && {
        event: {
          duration: p.eventduration,
          startDate: p.eventstart,
          endDate: p.eventend
        }
      }
    },
    origin: p.origin,
    ...p.arbitrary?.length && { arbitrary: p.arbitrary }
  };
  return caasProps;
};
var getCaaSMetadata = async (pageMd, options) => {
  const md = {};
  const errors = [];
  let tagErrors = [];
  let tags = [];
  for (const [key, computeFn] of Object.entries(props)) {
    const val = computeFn ? await computeFn(pageMd[key], options) : pageMd[key];
    if (val?.error) {
      errors.push(val.error);
    } else if (val?.tagErrors !== void 0) {
      tagErrors = val.tagErrors;
      md[key] = val.tags;
      tags = val.tags.map((t) => t.id);
    } else if (val !== void 0) {
      md[key] = val;
    }
  }
  if (!md.contenttype && tags.length) {
    md.contenttype = tags.find((tag) => tag.startsWith("caas:content-type"));
  }
  return { caasMetadata: md, errors, tags, tagErrors };
};
var getCardMetadata = async (options) => {
  const pageMd = parseCardMetadata();
  return getCaaSMetadata(pageMd, options);
};
var postDataToCaaS = async ({ accessToken, caasEnv, caasProps, draftOnly }) => {
  const options = {
    method: "POST",
    body: JSON.stringify(caasProps),
    headers: {
      Authorization: `Bearer ${accessToken}`,
      draft: !!draftOnly,
      "caas-env": caasEnv
    }
  };
  let response;
  const res = await fetch(URL_POSTXDM, options);
  if (res !== void 0) {
    const text = await res.text();
    try {
      response = JSON.parse(text);
    } catch {
      response = text;
    }
  }
  return response;
};

// ../../tools/send-to-caas/send-to-caas.js
var [setPublishingTrue, setPublishingFalse, isPublishing] = /* @__PURE__ */ (() => {
  let publishing = false;
  return [
    () => {
      publishing = true;
    },
    () => {
      publishing = false;
    },
    () => publishing
  ];
})();
var loadTingleModalFiles = async (loadScript2, loadStyle2) => {
  if (!window.tingle?.modal) {
    await Promise.all([
      loadScript2("https://milo.adobe.com/libs/deps/tingle.js"),
      loadStyle2("https://milo.adobe.com/libs/deps/tingle.css")
    ]);
  }
};
var showAlert = (msg, { error = false, onClose, showBtn = true, btnText = "OK" } = {}) => {
  const modal = new tingle.modal({
    footer: true,
    closeMethods: ["overlay", "escape"],
    onClose() {
      if (onClose) {
        onClose();
      }
      this.destroy();
    }
  });
  let msgContent = msg;
  if (error) {
    msgContent = `<div class="modal-error"><div class="modal-alert"></div><div>${msg}</div></div>`;
  }
  modal.setContent(msgContent);
  if (showBtn) {
    modal.addFooterBtn(btnText, "tingle-btn tingle-btn--primary tingle-btn--pull-right", () => modal.close());
  }
  modal.open();
  return modal;
};
var showConfirm = (msg, {
  onClose,
  cssClass = [],
  ctaBtnType = "primary",
  ctaText = "OK",
  cancelBtnType = "default",
  cancelText = "Cancel",
  footerContent = "",
  initCode,
  leftButton
} = {}) => new Promise((resolve) => {
  let ok = false;
  const modal = new tingle.modal({
    cssClass,
    footer: true,
    closeMethods: ["escape"],
    onClose() {
      if (onClose) onClose(this);
      this.destroy();
      resolve(ok);
    }
  });
  modal.setContent(msg);
  if (footerContent) {
    modal.setFooterContent(footerContent);
  }
  if (ctaText) {
    modal.addFooterBtn(ctaText, `tingle-btn tingle-btn--${ctaBtnType} tingle-btn--pull-right`, () => {
      ok = true;
      modal.close();
    });
  }
  modal.addFooterBtn(cancelText, `tingle-btn tingle-btn--${cancelBtnType} tingle-btn--pull-right`, () => {
    ok = false;
    modal.close();
  });
  if (leftButton) {
    modal.addFooterBtn(leftButton.text, "tingle-btn tingle-btn--default tingle-btn--pull-left", () => {
      leftButton.callback?.();
    });
  }
  if (initCode) initCode(modal.modal);
  modal.open();
});
var displayPublishingModal = () => {
  const publishingModal = new tingle.modal({
    closeMethods: [],
    cssClass: ["modal-text-align-center"],
    onClose() {
      this.destroy();
    }
  });
  publishingModal.setContent("Publishing to CaaS...");
  publishingModal.open();
  return publishingModal;
};
var verifyInfoModal = async (tags, tagErrors, showAllPropertiesAlert) => {
  let okToContinue = false;
  let draftOnly = false;
  let useHtml = false;
  let caasEnv;
  const seeAllPropsBtn = {
    text: "See all properties",
    callback: showAllPropertiesAlert
  };
  const footerOptions = `
    <div class="verify-info-footer">
      <div class="caas-env">
        <label for="caas-env-select">CaaS Env</label>
        <select name="1A" id="caas-env-select">
          <option>Prod</option>
          <option>Stage</option>
          <option>Dev</option>
        </select>
      </div>
      <div id="caas-draft-cb">
        <input type="checkbox" id="draftcb" name="draftcb">
        <label for="draftcb">Publish to Draft only</label>
      </div>
      <div id="caas-use-html-cb" class="field checkbox">
        <input type="checkbox" id="usehtml" name="usehtml">
        <label for="usehtml">Use .html extension</label>
      </div>
    </div>`;
  const onClose = () => {
    caasEnv = document.getElementById("caas-env-select")?.value?.toLowerCase();
    draftOnly = document.getElementById("draftcb")?.checked;
    useHtml = document.getElementById("usehtml")?.checked;
  };
  const modalInit = (modal) => {
    const caasEnvSelect = modal.querySelector("#caas-env-select");
    const caasEnvVal = caasEnvSelect.value?.toLowerCase();
    const useHtmlCb = modal.querySelector("#usehtml");
    if (caasEnvVal === "prod") {
      useHtmlCb.checked = true;
    }
    caasEnvSelect.addEventListener("change", (e) => {
      useHtmlCb.checked = e.target.value?.toLowerCase() === "prod";
    });
  };
  if (!tags.length) {
    const msg = "<div><p><b>No Tags found on page</b></p><p>Please add at least one tag to the Card Metadata</p></div>";
    okToContinue = await showConfirm(msg, {
      cssClass: ["verify-info-modal"],
      ctaText: "",
      cancelBtnType: "danger",
      cancelText: "Cancel Registration",
      footerContent: footerOptions,
      leftButton: seeAllPropsBtn,
      onClose
    });
  } else if (tagErrors.length) {
    const msg = [
      '<div class="">',
      "<p><b>The following tags were not found:</b></p>",
      tagErrors.join("<br>"),
      "<p><b>Ok to publish without those tags defined?</b></p>",
      "<p>The following tags will be used:</p>",
      tags.join("<br>"),
      "</div>"
    ].join("");
    okToContinue = await showConfirm(msg, {
      cssClass: ["verify-info-modal"],
      ctaText: "Publish with missing tags",
      cancelBtnType: "grey",
      cancelText: "Cancel Registration",
      ctaBtnType: "danger",
      footerContent: footerOptions,
      initCode: modalInit,
      leftButton: seeAllPropsBtn,
      onClose
    });
  } else {
    const msg = [
      "<div><p><b>The following tags will be used:</b></p>",
      tags.join("<br>"),
      "<p><b>Please verify that these are correct.</b></p></div>"
    ].join("");
    okToContinue = await showConfirm(msg, {
      cssClass: ["verify-info-modal"],
      cancelBtnType: "grey",
      cancelText: "Cancel Registration",
      ctaText: "Continue with these tags",
      footerContent: footerOptions,
      initCode: modalInit,
      leftButton: seeAllPropsBtn,
      onClose
    });
  }
  return {
    caasEnv,
    draftOnly,
    okToContinue,
    useHtml
  };
};
var isUseHtmlChecked = () => document.getElementById("usehtml")?.checked;
var sortObjByPropName = (obj) => Object.keys(obj).sort().reduce((c, d) => (c[d] = obj[d], c), {});
var validateProps = async (prodHost, publishingModal) => {
  const { caasMetadata, errors, tags, tagErrors } = await getCardMetadata(
    { prodUrl: `${prodHost}${window.location.pathname}` }
  );
  const showAllPropertiesAlert = async () => {
    const { caasMetadata: cMetaData } = await getCardMetadata(
      { prodUrl: `${prodHost}${window.location.pathname}${isUseHtmlChecked() ? ".html" : ""}` }
    );
    const mdStr = JSON.stringify(sortObjByPropName(cMetaData), void 0, 4);
    showAlert(`<h3>All CaaS Properties</h3><pre id="json" style="white-space:pre-wrap;font-size:14px;">${mdStr}</pre>`);
  };
  const { draftOnly, caasEnv, okToContinue, useHtml } = await verifyInfoModal(
    tags,
    tagErrors,
    showAllPropertiesAlert
  );
  if (!okToContinue) {
    setPublishingFalse();
    publishingModal.close();
    return false;
  }
  if (errors.length) {
    publishingModal.close();
    const msg = [
      "<p>There were problems with the following:</p>",
      errors.join("<br>"),
      "<p>Publishing to CaaS aborted, please fix errors and try again.</p>"
    ].join("");
    showAlert(msg, { error: true, onClose: setPublishingFalse });
    return false;
  }
  let metaWithUseHtml;
  if (useHtml) {
    ({ caasMetadata: metaWithUseHtml } = await getCardMetadata(
      { prodUrl: `${prodHost}${window.location.pathname}.html` }
    ));
  }
  return {
    caasEnv,
    caasMetadata: metaWithUseHtml || caasMetadata,
    draftOnly
  };
};
var checkPublishStatus = async (publishingModal) => {
  if (!await isPagePublished()) {
    publishingModal.close();
    showAlert(
      "Page must be published before it can be registered with CaaS.<br>Please publish the page and try again.",
      { error: true }
    );
    setPublishingFalse();
    return false;
  }
  return true;
};
var checkIms = async (publishingModal, loadScript2) => {
  const accessToken = await getImsToken(loadScript2);
  if (!accessToken) {
    publishingModal.close();
    const shouldLogIn = await showConfirm(
      "You must be logged in with an Adobe ID in order to publish to CaaS.\nDo you want to log in?"
    );
    if (shouldLogIn) {
      const { signInContext } = getConfig2();
      window.adobeIMS.signIn(signInContext);
    }
    setPublishingFalse();
    return false;
  }
  return accessToken;
};
var postToCaaS = async ({ accessToken, caasEnv, caasProps, draftOnly, publishingModal }) => {
  try {
    const response = await postDataToCaaS({ accessToken, caasEnv, caasProps, draftOnly });
    publishingModal.close();
    if (response.success) {
      showAlert(
        `<p>Successfully published page to CaaS!<p><p>Card ID: ${caasProps.entityId}</p>`,
        { onClose: setPublishingFalse }
      );
    } else if (response.error?.startsWith("Invalid User: Not an Adobe employee")) {
      const msg = "Please login with your Adobe company account.  Do you want to try logging in again?";
      const shouldLogIn = await showConfirm(msg, {
        cancelBtnType: "grey",
        cancelText: "Cancel",
        ctaText: "Login"
      });
      setPublishingFalse();
      if (shouldLogIn) {
        const { signInContext } = getConfig2();
        window.adobeIMS.signIn(signInContext);
      }
    } else {
      showAlert(
        response.message || response.error || JSON.stringify(response),
        { error: true, onClose: setPublishingFalse }
      );
    }
  } catch (e) {
    publishingModal.close();
    setPublishingFalse();
    showAlert(`Error posting to CaaS:<br>${e.message}`, { error: true });
  }
};
var noop = () => {
};
var sendToCaaS = async ({ host = "", project = "", branch = "", repo = "", owner = "" } = {}, loadScript2 = noop, loadStyle2 = noop) => {
  if (isPublishing()) return;
  await loadTingleModalFiles(loadScript2, loadStyle2);
  if (window.adobeid?.environment !== "prod") {
    showAlert(
      "Send to CaaS needs to reload the page with prod IMS setup.  Please try again after reload.",
      {
        onClose: () => {
          const url = new URL(window.location);
          url.searchParams.append("env", "prod");
          window.location.assign(url);
        }
      }
    );
    return;
  }
  setConfig({
    host: host || window.location.host,
    project,
    branch,
    repo,
    owner,
    doc: document
  });
  loadStyle2("https://milo.adobe.com/tools/send-to-caas/send-to-caas.css");
  setPublishingTrue();
  const publishingModal = displayPublishingModal();
  try {
    if (!host) throw new Error("host must be specified");
    await loadCaasTags();
    const { caasEnv, caasMetadata, draftOnly } = await validateProps(host, publishingModal);
    if (!caasMetadata) return;
    const isPublished = await checkPublishStatus(publishingModal);
    if (!isPublished) return;
    const accessToken = await checkIms(publishingModal, loadScript2);
    if (!accessToken) return;
    const caasProps = getCaasProps(caasMetadata);
    postToCaaS({ accessToken, caasEnv, caasProps, draftOnly, publishingModal });
  } catch (e) {
    setPublishingFalse();
    publishingModal.close();
    showAlert(`ERROR: ${e.message}`, { error: true });
  }
};
export {
  loadTingleModalFiles,
  sendToCaaS,
  showAlert,
  showConfirm
};
//# sourceMappingURL=send-to-caas-CU6NNK35.js.map
