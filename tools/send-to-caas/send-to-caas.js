/* eslint-disable new-cap */
/* global tingle */
/* eslint-disable no-alert */
import getUuid from '../../libs/utils/getUuid.js';
import { loadScript, loadStyle } from '../../libs/utils/utils.js';

loadStyle('https://milo.adobe.com/tools/send-to-caas/send-to-caas.css');

const CAAS_TAG_URL = 'https://www.adobe.com/chimera-api/tags';
const HLX_ADMIN_STATUS = 'https://admin.hlx.page/status';
const IMS_CLIENT_ID = 'milo_ims';
const IMS_ENV = 'stg1';
const URL_POSTXDM = 'https://14257-milocaasproxy-stage.adobeio-static.net/api/v1/web/milocaas/postXDM';
const VALID_URL_RE = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/;

const isKeyValPair = /(\s*\S+\s*:\s*\S+\s*)/;
const isValidUrl = (u) => VALID_URL_RE.test(u);

const [setPublishingTrue, setPublishingFalse, isPublishing] = (() => {
  let publishing = false;
  return [
    () => { publishing = true; },
    () => { publishing = false; },
    () => publishing,
  ];
})();

const [setConfig, getConfig] = (() => {
  let config = {};
  return [
    (c) => {
      config = { ...config, ...c };
      return config;
    },
    () => config,
  ];
})();

const getKeyValPairs = (s) => {
  if (!s) return [];
  return s
    .split(',')
    .filter((v) => v.length)
    .filter((v) => isKeyValPair.test(v))
    .map((v) => {
      const [key, ...value] = v.split(':');
      return {
        key: key.trim(),
        value: value.join(':').trim(),
      };
    });
};

const getMetaContent = (propType, propName) => {
  const metaEl = document.querySelector(`meta[${propType}='${propName}']`);
  if (!metaEl) return undefined;
  return metaEl.content;
};

const prefixHttps = (url) => {
  if (!(url?.startsWith('https://') || url?.startsWith('http://'))) {
    return `https://${url}`;
  }
  return url;
};

const checkUrl = (url, errorMsg) => {
  if (url === undefined) return url;
  return isValidUrl(url) ? prefixHttps(url) : { error: errorMsg };
};

// Case-insensitive search through tag name, path, id and title for the searchStr
const findTag = (tags, searchStr, ignore = []) => {
  const childTags = [];
  let matchingTag = Object.values(tags).find((tag) => {
    if (
      ignore.includes(tag.title)
      || ignore.includes(tag.name)
      || ignore.includes(tag.path)
      || ignore.includes(tag.tagID)
    ) return false;

    if (tag.tags && Object.keys(tag.tags).length) {
      childTags.push(tag.tags);
    }

    const tagMatches = [
      tag.title.toLowerCase(),
      tag.name,
      tag.path,
      tag.path.replace('/content/cq:tags/', ''),
      tag.tagID,
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

const fetchCaasTags = async () => {
  try {
    const resp = await fetch(CAAS_TAG_URL);
    if (resp.ok) {
      const json = await resp.json();
      return json.namespaces.caas.tags;
    }
  } catch (e) {
    // ignore
  }

  const { default: caasTags } = await import('../../libs/blocks/caas-config/caas-tags.js');
  return caasTags.namespaces.caas.tags;
};

const [getCaasTags, loadCaasTags] = (() => {
  let tags;
  return [
    () => tags,
    async () => {
      try {
        const resp = await fetch(CAAS_TAG_URL);
        if (resp.ok) {
          const json = await resp.json();
          tags = json.namespaces.caas.tags;
        }
      } catch (e) {
        // ignore
      }

      const { default: caasTags } = await import('../../libs/blocks/caas-config/caas-tags.js');
      tags = caasTags.namespaces.caas.tags;
    }];
})();

const getTag = (tagName, errors) => {
  if (!tagName) return undefined;
  const caasTags = getCaasTags();
  // search all except Events first
  const tag = findTag(caasTags, tagName, ['Events']) || findTag(caasTags.events.tags, tagName, []);

  if (!tag) {
    errors.push(tagName);
  }

  return tag;
};

const getTags = (s) => {
  let rawTags = [];
  if (s) {
    rawTags = s.split(',').map((t) => t.trim());
  } else {
    rawTags = [...document.querySelectorAll("meta[property='article:tag']")].map(
      (metaEl) => metaEl.content,
    );
  }

  const errors = [];

  if (!rawTags.length) rawTags = ['Article']; // default if no tags found

  const tagIds = rawTags.map((tag) => getTag(tag, errors))
    .filter((tag) => tag !== undefined)
    .map((tag) => tag.tagID);

  const tags = [...new Set(tagIds)]
    .map((tagID) => ({ id: tagID }));

  return {
    tagErrors: errors,
    tags,
  };
};

const getDateProp = (dateStr, errorMsg) => {
  if (!dateStr) return undefined;
  try {
    const date = new Date(dateStr);
    if (date.getFullYear() < 2000) return { error: `${errorMsg} - Date is before the year 2000` };
    return date.toISOString();
  } catch (e) {
    return { error: errorMsg };
  }
};

const getOrigin = () => {
  let origin = getConfig().project || getConfig().repo;
  if (origin) return origin;

  if (window.location.hostname.endsWith('.hlx.page')) {
    const [, repo] = window.location.hostname.split('.')[0].split('--');
    return repo;
  }

  throw new Error('No Project or Repo defined in config');
};

const getFirstImageUrl = () => {
  const img = document.querySelector('main')?.querySelector('img');
  if (!img) return null;
  const imgUrl = new URL(img.src);
  return imgUrl.pathname;
};

const getFirstImageAlt = () => document.querySelector('main')?.querySelector('img')?.alt;

const getImsToken = async () => {
  window.adobeid = {
    client_id: IMS_CLIENT_ID,
    environment: IMS_ENV,
    scope: 'AdobeID,openid',
  };

  // Ready to publish, get user info
  if (!window.adobeIMS) {
    await loadScript('https://auth-stg1.services.adobe.com/imslib/imslib.js');
  }
  return window.adobeIMS.getAccessToken()?.token;
};

const isPagePublished = async () => {
  let { branch, repo, owner } = getConfig();
  if (!(branch || repo || owner)
    && window.location.hostname.endsWith('.hlx.page')) {
    [branch, repo, owner] = window.location.hostname.split('.')[0].split('--');
  }

  if (!(branch || repo || owner)) {
    throw new Error(`Branch, Repo or Owner is not set - branch: ${branch}, repo: ${repo}, owner: ${owner}`);
  }

  const res = await fetch(
    `${HLX_ADMIN_STATUS}/${owner}/${repo}/${branch}${window.location.pathname}`,
  );
  if (res.ok) {
    const json = await res.json();
    return json.live.status === 200;
  }
  return false;
};

// Tingle is the js library for displaying modals
const loadTingleModalFiles = async () => {
  if (!window.tingle?.modal) {
    await Promise.all([
      loadScript('https://milo.adobe.com/libs/deps/tingle.js'),
      loadStyle('https://milo.adobe.com/libs/deps/tingle.css'),
    ]);
  }
};

const showAlert = (msg, { error = false, onClose } = {}) => {
  const modal = new tingle.modal({
    footer: true,
    closeMethods: ['overlay', 'escape'],
    onClose() {
      if (onClose) { onClose(); }
      this.destroy();
    },
  });
  if (error) { // show alert icon
    msg = `<div class="modal-error"><div class="modal-alert"></div><div>${msg}</div></div>`;
  }
  modal.setContent(msg);
  modal.addFooterBtn('OK', 'tingle-btn tingle-btn--primary tingle-btn--pull-right', () => modal.close());
  modal.open();
};

const showConfirm = (msg, {
  onClose,
  ctaBtnType = 'primary',
  ctaText = 'OK',
  cancelBtnType = 'default',
  cancelText = 'Cancel',
  footerContent = '',
  leftButton,
} = {}) => new Promise((resolve) => {
  let ok = false;
  const modal = new tingle.modal({
    footer: true,
    closeMethods: ['escape'],
    onClose() {
      if (onClose) onClose(this);
      this.destroy();
      resolve(ok);
    },
  });
  modal.setContent(msg);
  if (footerContent) {
    modal.setFooterContent(footerContent);
  }
  modal.addFooterBtn(ctaText, `tingle-btn tingle-btn--${ctaBtnType} tingle-btn--pull-right`, () => {
    ok = true;
    modal.close();
  });
  modal.addFooterBtn(cancelText, `tingle-btn tingle-btn--${cancelBtnType} tingle-btn--pull-right`, () => {
    ok = false;
    modal.close();
  });
  if (leftButton) {
    modal.addFooterBtn(leftButton.text, 'tingle-btn tingle-btn--default tingle-btn--pull-left', () => {
      leftButton.callback?.();
    });
  }
  modal.open();
});

/** card metadata props - either a func that computes the value or
 * 0 to use the string as is
 * funcs that return an object with { error: string } will report the error
 */
const props = {
  arbitrary: (s) => getKeyValPairs(s).map((pair) => ({ key: pair.key, value: pair.value })),
  badges: (s) => getKeyValPairs(s).map((pair) => ({ type: pair.key, value: pair.value })),
  bookmarkaction: 0,
  bookmarkenabled: (s = '') => {
    if (s) {
      const lcs = s.toLowerCase();
      if (lcs === 'true' || lcs === 'on' || lcs === 'yes') {
        return true;
      }
    }
    return undefined;
  },
  bookmarkicon: 0,
  contentid: (_, options) => getUuid(options.prodUrl),
  contenttype: (s) => s || getMetaContent('property', 'og:type') || 'Article',
  // TODO - automatically get country
  country: (s) => s || 'us',
  created: (s) => {
    if (s) {
      return getDateProp(s, `Invalid Created Date: ${s}`);
    }

    const pubDate = getMetaContent('name', 'publication-date');
    return pubDate
      ? getDateProp(pubDate, `publication-date metadata is not a valid date: ${pubDate}`)
      : getDateProp(document.lastModified, `document.lastModified is not a valid date: ${document.lastModified}`);
  },
  cta1icon: (s) => checkUrl(s, `Invalid Cta1Icon url: ${s}`),
  cta1style: 0,
  cta1text: 0,
  cta1url: (s, options) => {
    const url = s || options.prodUrl || window.location.origin + window.location.pathname;
    return checkUrl(url, `Invalid Cta1Url: ${url}`);
  },
  cta2icon: (s) => checkUrl(s, `Invalid Cta2Icon url: ${s}`),
  cta2style: 0,
  cta2text: 0,
  cta2url: (s) => checkUrl(s, `Invalid Cta2Url: ${s}`),
  description: (s) => s || getMetaContent('name', 'description') || '',
  details: 0,
  entityid: (_, options) => getUuid(options.prodUrl),
  env: (s) => s || '',
  eventduration: 0,
  eventend: (s) => getDateProp(s, `Invalid Event End Date: ${s}`),
  eventstart: (s) => getDateProp(s, `Invalid Event Start Date: ${s}`),
  floodgatecolor: (s) => s || 'default',
  headline: 0,
  // TODO: automatically get lang
  lang: (s) => s || 'en',
  modified: (s) => (s
    ? getDateProp(s, `Invalid Modified Date: ${s}`)
    : getDateProp(document.lastModified, `document.lastModified is not a valid date: ${document.lastModified}`)),
  origin: (s) => s || getOrigin(),
  playurl: (s) => checkUrl(s, `Invalid PlayURL: ${s}`),
  primarytag: (s) => {
    const tag = getTag(s);
    return tag ? { id: tag.tagID } : {};
  },
  style: (s) => s || 'default',
  tags: (s) => getTags(s),
  thumbalt: (s) => s || getFirstImageAlt(),
  thumburl: (s) => (s ? checkUrl(s, `Invalid Thumbnail URL: ${s}`) : getFirstImageUrl()),
  title: (s) => s || getMetaContent('property', 'og:title') || '',
  uci: (s) => s || window.location.pathname,
  url: (s, options) => {
    const url = s || options.prodUrl || window.location.origin + window.location.pathname;
    return checkUrl(url, `Invalid URL: ${url}`);
  },
};

// Map the flat props into the structure needed by CaaS
const getCaasProps = (p) => {
  const caasProps = {
    entityId: p.entityid,
    contentId: p.contentid,
    contentType: p.contenttype,
    draftOnly: p.draftOnly,
    environment: p.env,
    url: p.url,
    floodGateColor: p.floodgatecolor,
    universalContentIdentifier: p.uci,
    title: p.title,
    description: p.description,
    createdDate: p.created,
    modifiedDate: p.modified,
    tags: p.tags,
    primaryTag: p.primarytag,
    ...(p.thumburl && {
      thumbnail: {
        altText: p.thumbalt,
        url: p.thumburl,
      },
    }),
    country: p.country,
    language: p.lang,
    cardData: {
      style: p.style,
      headline: p.headline || p.title,
      ...(p.details && { details: p.details }),
      ...((p.bookmarkenabled || p.bookmarkicon || p.bookmarkaction) && {
        bookmark: {
          enabled: p.bookmarkenabled,
          bookmarkIcon: p.bookmarkicon,
          action: p.bookmarkaction,
        },
      }),
      badges: p.badges,
      ...(p.playurl && { playUrl: p.playurl }),
      cta: {
        primaryCta: {
          text: p.cta1text,
          url: p.cta1url,
          style: p.cta1style,
          icon: p.cta1icon,
        },
        ...(p.cta2url && {
          secondaryCta: {
            text: p.cta2text,
            url: p.cta2url,
            style: p.cta2style,
            icon: p.cta2icon,
          },
        }),
      },
      ...((p.eventduration || p.eventstart || p.eventend) && {
        event: {
          duration: p.eventduration,
          startDate: p.eventstart,
          endDate: p.eventend,
        },
      }),
    },
    origin: p.origin,
    ...(p.arbitrary?.length && { arbitrary: p.arbitrary }),
  };
  return caasProps;
};

const getCaaSMetadata = async (pageMd, options) => {
  const md = {};
  const errors = [];
  let tagErrors = [];
  let tags = [];
  // for-of required to await any async computeVal's
  // eslint-disable-next-line no-restricted-syntax
  for (const [key, computeFn] of Object.entries(props)) {
    // eslint-disable-next-line no-await-in-loop
    const val = computeFn ? await computeFn(pageMd[key], options) : pageMd[key];
    if (val?.error) {
      errors.push(val.error);
    } else if (val?.tagErrors !== undefined) {
      tagErrors = val.tagErrors;
      md[key] = val.tags;
      tags = val.tags.map((t) => t.id);
    } else if (val !== undefined) {
      md[key] = val;
    }
  }

  return { caasMetadata: md, errors, tags, tagErrors };
};

const getCardMetadata = async (options) => {
  const pageMd = {};
  const mdEl = document.querySelector('.card-metadata');
  if (mdEl) {
    mdEl.childNodes.forEach((n) => {
      const key = n.children?.[0]?.textContent.toLowerCase();
      const val = n.children?.[1]?.textContent.toLowerCase();
      if (!key) return;

      pageMd[key] = val;
    });
  }
  return getCaaSMetadata(pageMd, options);
};

const displayPublishingModal = () => {
  const publishingModal = new tingle.modal({
    closeMethods: [],
    cssClass: ['modal-text-align-center'],
    onClose() {
      this.destroy();
    },
  });
  publishingModal.setContent('Publishing to CaaS...');
  publishingModal.open();
  return publishingModal;
};

const checkTags = async (tags, tagErrors, showAllPropertiesAlert) => {
  let okToContinue = false;
  let draftOnly = false;

  const seeAllPropsBtn = {
    text: 'See all properties',
    callback: showAllPropertiesAlert,
  };

  const draftCb = '<div id="caas-draft-cb"><input type="checkbox" id="draftcb" name="draftcb">'
    + '<label for="draftcb">Publish to Draft only</label></div>';

  const onClose = () => {
    draftOnly = document.getElementById('draftcb')?.checked;
  };

  if (tagErrors.length) {
    const msg = [
      '<p><b>The following tags were not found:</b></p>',
      tagErrors.join('<br>'),
      '<p><b>Ok to publish without those tags defined?</b></p>',
      '<p>The following tags will be used:</p>',
      tags.join('<br>'),
    ].join('');
    okToContinue = await showConfirm(msg, {
      ctaText: 'Publish with missing tags',
      cancelBtnType: 'grey',
      cancelText: 'Cancel Registration',
      ctaBtnType: 'danger',
      footerContent: draftCb,
      leftButton: seeAllPropsBtn,
      onClose,
    });
  } else {
    const msg = [
      '<p><b>The following tags will be used:</b></p>',
      tags.join('<br>'),
      '<p><b>Please verify that these are correct.</b></p>',
    ].join('');
    okToContinue = await showConfirm(msg, {
      cancelBtnType: 'grey',
      cancelText: 'Cancel Registration',
      ctaText: 'Continue with these tags',
      footerContent: draftCb,
      leftButton: seeAllPropsBtn,
      onClose,
    });
  }
  return {
    okToContinue,
    draftOnly,
  };
};

const validateProps = async (prodHost, publishingModal) => {
  const { caasMetadata, errors, tags, tagErrors } = await getCardMetadata({ prodUrl: `${prodHost}${window.location.pathname}` });

  const showAllPropertiesAlert = () => {
    showAlert(`<h3>All CaaS Properties</h3><pre id="json" style="white-space:pre-wrap;font-size:14px;">${JSON.stringify(caasMetadata, undefined, 4)}</pre>`);
  };

  const { okToContinue, draftOnly } = await checkTags(tags, tagErrors, showAllPropertiesAlert);

  caasMetadata.draftOnly = draftOnly;

  if (!okToContinue) {
    setPublishingFalse();
    publishingModal.close();
    return false;
  }

  if (errors.length) {
    publishingModal.close();
    const msg = [
      '<p>There were problems with the following:</p>',
      errors.join('<br>'),
      '<p>Publishing to CaaS aborted, please fix errors and try again.</p>',
    ].join('');
    showAlert(msg, { error: true, onClose: setPublishingFalse });
    return false;
  }
  return caasMetadata;
};

const checkPublishStatus = async (publishingModal) => {
  if (!(await isPagePublished())) {
    publishingModal.close();
    showAlert(
      'Page must be published before it can be registered with CaaS.<br>Please publish the page and try again.',
      { error: true },
    );
    setPublishingFalse();
    return false;
  }
  return true;
};

const checkIms = async (publishingModal) => {
  const accessToken = await getImsToken();
  if (!accessToken) {
    publishingModal.close();
    const shouldLogIn = await showConfirm(
      'You must be logged in with an Adobe ID in order to publish to CaaS.\nDo you want to log in?',
    );
    if (shouldLogIn) {
      window.adobeIMS.signIn();
    }
    setPublishingFalse();
    return false;
  }
  return accessToken;
};

const postToCaaS = async (propsObj, accessToken, publishingModal) => {
  const draftOnly = propsObj.draftOnly || false;
  delete propsObj.draftOnly;

  const options = {
    method: 'POST',
    body: JSON.stringify(propsObj),
    headers: {
      Authorization: `Bearer ${accessToken}`,
      draft: draftOnly,
    },
  };

  try {
    const res = await fetch(URL_POSTXDM, options);
    if (res !== undefined) {
      const text = await res.text();

      let response;
      try {
        response = JSON.parse(text);
      } catch {
        response = text;
      }

      publishingModal.close();

      if (response.success) {
        showAlert(
          `<p>Successfully published page to CaaS!<p><p>Card ID: ${propsObj.entityId}</p>`,
          { onClose: setPublishingFalse },
        );
      } else if (response.error === 'Invalid User: Not an Adobe employee') {
        const shouldLogIn = await window.confirm(
          'Please login with your Adobe company account.  Do you want to try logging in again?',
        );
        setPublishingFalse();
        if (shouldLogIn) window.adobeIMS.signIn();
      } else {
        showAlert(response.message || response, { error: true, onClose: setPublishingFalse });
      }
    }
  } catch (e) {
    publishingModal.close();
    setPublishingFalse();
    showAlert(`Error posting to CaaS:<br>${e.message}`, { error: true });
  }
};

const sendToCaaS = async ({ host = '', project = '', branch = '', repo = '', owner = '' } = {}) => {
  if (isPublishing()) return;

  setConfig({ host, project, branch, repo, owner });

  setPublishingTrue();

  await loadTingleModalFiles();
  const publishingModal = displayPublishingModal();

  try {
    if (!host) throw new Error('host must be specified');

    await loadCaasTags();
    const caasMetadata = await validateProps(host, publishingModal);
    if (!caasMetadata) return;

    const isPublished = await checkPublishStatus(publishingModal);
    if (!isPublished) return;

    const accessToken = await checkIms(publishingModal);
    if (!accessToken) return;

    const caasProps = getCaasProps(caasMetadata);

    postToCaaS(caasProps, accessToken, publishingModal);
  } catch (e) {
    setPublishingFalse();
    publishingModal.close();
    showAlert(`ERROR: ${e.message}`, { error: true });
  }
};

export default sendToCaaS;
