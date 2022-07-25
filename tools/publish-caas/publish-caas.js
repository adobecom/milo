/* eslint-disable no-alert */
import getUuid from '../../libs/utils/getUuid.js';
import { loadScript } from '../../libs/utils/utils.js';
import caasTags from '../../libs/blocks/caas-config/caas-tags.js';

const IMS_CLIENT_ID = 'milo_ims';
const IMS_ENV = 'stg1';
const URL_POSTXDM =
  'https://14257-milocaasproxy-cpeyer.adobeio-static.net/api/v1/web/milocaas/postXDM';

const isKeyValPair = /(\s*\w+\s*:\s*\w+\s*)/;
const isBoolText = (s) => s === 'true' || s === 'false';
const isValidDate = (d) => d instanceof Date && !isNaN(d);
const isValidUrl =
  /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g;

let errors = [];
const addError = (s) => errors.push(s);

const getMetaContent = (propType, propName) => {
  const metaEl = document.querySelector(`meta[${propType}='${propName}']`);
  if (!metaEl) return undefined;
  return metaEl.content;
};

// Case-insensitive search through tag name, path, id and title for the searchStr
const findTag = (tags, searchStr, ignore = []) => {
  const childTags = [];
  let matchingTag = Object.values(tags).find((tag) => {
    if (
      ignore.includes(tag.title) ||
      ignore.includes(tag.name) ||
      ignore.includes(tag.path) ||
      ignore.includes(tag.tagID)
    )
      return false;

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

const getTag = (tagName) => {
  if (!tagName) return undefined;
  const rootTags = caasTags.namespaces.caas.tags;
  // search all except Events first
  const tag = findTag(rootTags, tagName, ['Events']) || findTag(rootTags.events.tags, tagName, []);

  if (!tag) {
    addError(`Tag not found: ${tagName}`);
  }

  return tag;
};

const getTags = (s) => {
  let tags = [];
  if (s) {
    tags = s.split(',').map((t) => t.trim());
  } else {
    tags = [...document.querySelectorAll("meta[property='article:tag']")].map(
      (metaEl) => metaEl.content
    );
  }

  return tags
    .map((tag) => getTag(tag))
    .filter((tag) => tag !== undefined)
    .map((tag) => ({ id: tag.tagID }));
};

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

const getDateProp = (dateStr, errorMsg) => {
  if (!dateStr) return undefined;
  try {
    return new Date(dateStr).toISOString();
  } catch (e) {
    addError(errorMsg);
  }
  return undefined;
};

/** card metadata props - either a func that computes the value or 0 to use the string as is */
const props = {
  arbitrary: (s) => getKeyValPairs(s).map((pair) => ({ type: pair.key, value: pair.value })),
  badges: (s) => getKeyValPairs(s).map((pair) => ({ [pair.key]: pair.value })),
  bookmarkaction: 0,
  bookmarkenabled: (s) => {
    if (s) {
      const lcs = s.toLowerCase();
      // if (isBoolText(lcs)) return lcs;
      if (isBoolText(lcs)) return true;
      addError(`Invalid value for bookmarkEnabled - must be "true" or "false". Got: ${s}`);
    }
    return undefined;
  },
  bookmarkicon: 0,
  contentid: (_, options) => getUuid(options.prodUrl),
  contenttype: (s) => s || getMetaContent('property', 'og:type') || 'Article',
  // TODO - automatically get country
  country: (s) => s || 'us',
  created: (s) =>
    s
      ? isValidDate(s)
      : getMetaContent('name', 'publication-date') || new Date(document.lastModified).toISOString(),
  cta1icon: 0,
  cta1style: 0,
  cta1text: 0,
  cta1url: (s, options) => {
    let url = s || options.prodUrl || window.location.origin + window.location.pathname;
    if (!url.startsWith('https://')) {
      url = `https://${url}`;
    }
    return url;
  },
  cta2icon: 0,
  cta2style: 0,
  cta2text: 0,
  cta2url: 0,
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
  modified: (s) =>
    s
      ? getDateProp(s, `Invalid Event End Date: ${s}`)
      : new Date(document.lastModified).toISOString(),
  origin: (s) => s || 'Milo',
  playurl: 0,
  primarytag: (s) => {
    const tag = getTag(s);
    return tag ? { id: tag.tagID } : {};
  },
  style: (s) => s || 'default',
  tags: (s) => getTags(s),
  thumbalt: 0,
  thumburl: 0, // TODO
  title: (s) => s || getMetaContent('property', 'og:title') || '',
  uci: (s) => s || window.location.pathname,
  url: (s, options) => {
    let url = s || options.prodUrl || window.location.origin + window.location.pathname;
    if (!url.startsWith('https://')) {
      url = `https://${url}`;
    }
    return url;
  },
};

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
    // TODO
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
  // for-of required to await any async computeVal's
  // eslint-disable-next-line no-restricted-syntax
  for (const [key, computeFn] of Object.entries(props)) {
    // eslint-disable-next-line no-await-in-loop
    const val = computeFn ? await computeFn(pageMd[key], options) : pageMd[key];
    if (val !== undefined) md[key] = val;
  }

  return md;
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
  const cassMetadata = await getCaaSMetadata(pageMd, options);
  return cassMetadata;
};

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

const publishToCaaS = async (prodHost) => {
  const accessToken = await getImsToken();

  if (!accessToken) {
    const shouldLogIn = window.confirm(
      'You must be logged in with an Adobe ID in order to publish to CaaS.\nDo you want to log in?'
    );
    if (shouldLogIn) {
      window.adobeIMS.signIn();
    }
  }

  errors = [];
  const mdOptions = { prodUrl: `${prodHost}${window.location.pathname}` };
  const md = await getCardMetadata(mdOptions);
  if (errors.length) {
    errors.unshift('There were problems with the following:');
    errors.push('Publishing to CaaS aborted, please fix errors and try again.');
    return;
  }
  const propsObj = getCaasProps(md);

  console.log(JSON.stringify(propsObj, null, 4));

  if (accessToken) {
    const options = {
      method: 'POST',
      body: JSON.stringify(propsObj),
      headers: { Authorization: `Bearer ${accessToken}` },
    };

    const res = await fetch(URL_POSTXDM, options).then((response) => response.text());

    let response;
    try {
      response = JSON.parse(res);
    } catch {
      response = res;
    }
    if (response.error === 'Invalid User: Not an Adobe employee') {
      const shouldLogIn = window.confirm(
        'Please login with your Adobe company account.  Do you want to log in again?'
      );
      if (shouldLogIn) window.adobeIMS.signIn();
    } else {
      window.alert(res);
    }
  }
};

export default publishToCaaS;
