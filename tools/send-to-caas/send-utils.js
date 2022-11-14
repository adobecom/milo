import getUuid from '../../libs/utils/getUuid.js';

const CAAS_TAG_URL = 'https://www.adobe.com/chimera-api/tags';
const HLX_ADMIN_STATUS = 'https://admin.hlx.page/status';
const IMS_CLIENT_ID = 'milo_ims';
const IMS_PROD_URL = 'https://auth.services.adobe.com/imslib/imslib.min.js';
const URL_POSTXDM = 'https://14257-milocaasproxy-stage.adobeio-static.net/api/v1/web/milocaas/postXDM';
const VALID_URL_RE = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/;

const isKeyValPair = /(\s*\S+\s*:\s*\S+\s*)/;
const isValidUrl = (u) => VALID_URL_RE.test(u);

const [setConfig, getConfig] = (() => {
  let config = {
    isInjectedDoc: () => this.doc !== document,
    doc: document,
  };
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

const addHost = (url) => {
  if (url.startsWith('http')) return url;
  const { host } = getConfig();
  return `https://${host}${url.startsWith('/') ? '' : '/'}${url}`;
};

const getMetaContent = (propType, propName) => {
  const metaEl = getConfig().doc.querySelector(`meta[${propType}='${propName}']`);
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
          return;
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
    rawTags = s.toLowerCase().split(',').map((t) => t.trim());
  } else {
    rawTags = [...getConfig().doc.querySelectorAll("meta[property='article:tag']")].map(
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
  const origin = getConfig().project || getConfig().repo;
  if (origin) return origin;

  if (window.location.hostname.endsWith('.hlx.page')) {
    const [, repo] = window.location.hostname.split('.')[0].split('--');
    return repo;
  }

  throw new Error('No Project or Repo defined in config');
};

const getUrlWithoutFile = (url) => `${url.split('/').slice(0, -1).join('/')}/`;

const getImagePathMd = (keyName) => {
  const mdEl = getConfig().doc.querySelector('.card-metadata');
  if (!mdEl) return null;

  let url = '';
  [...mdEl.children].some((n) => {
    const key = n.firstElementChild.textContent?.trim().toLowerCase();
    if (key !== keyName) return false;

    const img = n.lastElementChild.querySelector('img');

    if (img) {
      let imgSrc = img.src;
      if (getConfig().bulkPublish) {
        const rawImgSrc = img.attributes.src.value;
        if (rawImgSrc.startsWith('./')) {
          const urlWithoutFile = getUrlWithoutFile(getConfig().pageUrl);
          imgSrc = `${urlWithoutFile}${rawImgSrc}`;
        } else if (rawImgSrc.startsWith('/')) {
          imgSrc = `${new URL(getConfig.pageUrl.origin)}${rawImgSrc}`;
        } else {
          imgSrc = rawImgSrc;
        }
      }
      url = new URL(imgSrc)?.pathname;
    } else { // url string to img
      url = n.lastElementChild.textContent?.trim();
    }
    return true;
  });
  return url;
};

const getCardImageUrl = () => {
  const { doc } = getConfig();
  const imageUrl = getImagePathMd('cardimage')
    || getImagePathMd('cardimagepath')
    || doc.querySelector('meta[property="og:image"]')?.content
    || doc.querySelector('main')?.querySelector('img')?.src;

  if (!imageUrl) return null;
  return addHost(imageUrl);
};

const getCardImageAltText = () => {
  // eslint-disable-next-line no-use-before-define
  const pageMd = parseCardMetadata();
  if (pageMd.cardimage) return '';
  const cardImageUrl = getCardImageUrl();
  const cardImagePath = new URL(cardImageUrl).pathname.split('/').pop();
  const imgTagForCardImage = getConfig().doc.querySelector(`img[src*="${cardImagePath}"]`);
  return imgTagForCardImage?.alt;
};

const getBadges = (p) => {
  const badges = [];
  if (p.badgeimage) {
    badges.push({ type: 'image', value: addHost(p.badgeimage) });
  }
  if (p.badgetext) {
    badges.push({ type: 'text', value: p.badgetext });
  }
  return badges;
};

const getImsToken = async (loadScript) => {
  window.adobeid = {
    client_id: IMS_CLIENT_ID,
    environment: 'prod',
    scope: 'AdobeID,openid',
  };

  if (!window.adobeIMS) {
    await loadScript(IMS_PROD_URL);
  }
  return window.adobeIMS?.getAccessToken()?.token;
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

/** card metadata props - either a func that computes the value or
 * 0 to use the string as is
 * funcs that return an object with { error: string } will report the error
 */
const props = {
  arbitrary: (s) => getKeyValPairs(s).map((pair) => ({ key: pair.key, value: pair.value })),
  badgeimage: () => getImagePathMd('badgeimage'),
  badgetext: 0,
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
  cardimage: () => getCardImageUrl(),
  cardimagealttext: (s) => s || getCardImageAltText(),
  contentid: (_, options) => getUuid(options.prodUrl),
  contenttype: (s) => s || getMetaContent('property', 'og:type') || 'Article',
  // TODO - automatically get country
  country: (s) => s || 'us',
  created: (s) => {
    if (s) {
      return getDateProp(s, `Invalid Created Date: ${s}`);
    }

    const pubDate = getMetaContent('name', 'publication-date');
    const { doc, lastModified } = getConfig();
    return pubDate
      ? getDateProp(pubDate, `publication-date metadata is not a valid date: ${pubDate}`)
      : getDateProp(lastModified || doc.lastModified, `document.lastModified is not a valid date: ${doc.lastModified}`);
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
  // TODO: automatically get lang
  lang: (s) => s || 'en',
  modified: (s) => {
    const { doc, lastModified } = getConfig();
    return s
      ? getDateProp(s, `Invalid Modified Date: ${s}`)
      : getDateProp(lastModified || doc.lastModified, `document.lastModified is not a valid date: ${doc.lastModified}`);
  },
  origin: (s) => s || getOrigin(),
  playurl: (s) => checkUrl(s, `Invalid PlayURL: ${s}`),
  primarytag: (s) => {
    const tag = getTag(s);
    return tag ? { id: tag.tagID } : {};
  },
  style: (s) => s || 'default',
  tags: (s) => getTags(s),
  title: (s) => s || getMetaContent('property', 'og:title') || '',
  uci: (s, options) => s || options.prodUrl || window.location.pathname,
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
    ...(p.cardimage && {
      thumbnail: {
        altText: p.cardimagealttext,
        url: p.cardimage,
      },
    }),
    country: p.country,
    language: p.lang,
    cardData: {
      style: p.style,
      headline: p.title,
      ...(p.details && { details: p.details }),
      ...((p.bookmarkenabled || p.bookmarkicon || p.bookmarkaction) && {
        bookmark: {
          enabled: p.bookmarkenabled,
          bookmarkIcon: p.bookmarkicon,
          action: p.bookmarkaction,
        },
      }),
      badges: getBadges(p),
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

const parseCardMetadata = () => {
  const pageMd = {};
  const mdEl = getConfig().doc.querySelector('.card-metadata');
  if (mdEl) {
    mdEl.childNodes.forEach((n) => {
      const key = n.children?.[0]?.textContent?.toLowerCase();
      const val = n.children?.[1]?.textContent;
      if (!key) return;

      pageMd[key] = val;
    });
  }
  return pageMd;
};

const getCardMetadata = async (options) => {
  const pageMd = parseCardMetadata();
  return getCaaSMetadata(pageMd, options);
};

const postDataToCaaS = async ({ accessToken, caasEnv, caasProps, draftOnly }) => {
  const options = {
    method: 'POST',
    body: JSON.stringify(caasProps),
    headers: {
      Authorization: `Bearer ${accessToken}`,
      draft: !!draftOnly,
      'caas-env': caasEnv,
    },
  };

  let response;
  const res = await fetch(URL_POSTXDM, options);
  if (res !== undefined) {
    const text = await res.text();

    try {
      response = JSON.parse(text);
    } catch {
      response = text;
    }
  }
  return response;
};

export {
  getCardMetadata,
  getCaasProps,
  getConfig,
  getImsToken,
  isPagePublished,
  loadCaasTags,
  postDataToCaaS,
  setConfig,
};
