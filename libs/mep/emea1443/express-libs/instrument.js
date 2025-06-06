/* global _satellite __satelliteLoadedCallback alloy */
import trackBranchParameters from './branchlinks.js';

let loadScript; let getConfig;

const d = document;
const loc = window.location;
const { pathname } = loc;
let expressLandingPageType;
// home
if (
  pathname === '/express'
    || pathname === '/express/'
) {
  expressLandingPageType = 'home';
  // seo
} else if (
  pathname === '/express/create'
    || pathname.includes('/create/')
    || pathname === '/express/make'
    || pathname.includes('/make/')
    || pathname === '/express/feature'
    || pathname.includes('/feature/')
    || pathname === '/express/discover'
    || pathname.includes('/discover/')
) {
  expressLandingPageType = 'seo';
  // learn
} else if (
  pathname === '/express/tools'
    || pathname.includes('/tools/')
) {
  expressLandingPageType = 'quickAction';
} else if (
  pathname === '/express/learn'
    || (
      pathname.includes('/learn/')
        && !pathname.includes('/blog/')
    )
) {
  expressLandingPageType = 'learn';
  // blog
} else if (
  pathname === '/express/learn/blog'
    || pathname.includes('/learn/blog/')
) {
  expressLandingPageType = 'blog';
  // pricing
} else if (
  pathname.includes('/pricing')
) {
  expressLandingPageType = 'pricing';
  // edu
} else if (
  pathname.includes('/education/')
) {
  expressLandingPageType = 'edu';
  // other
} else {
  expressLandingPageType = 'other';
}

export function getExpressLandingPageType() {
  return expressLandingPageType;
}

function set(path, value) {
  const obj = window.alloy_all;
  const newPath = `data._adobe_corpnew.digitalData.${path}`;
  const segs = newPath.split('.');
  let temp = obj;
  let i = 0;
  const il = segs.length - 1;
  // get to the path
  // eslint-disable-next-line no-plusplus
  for (; i < il; i++) {
    const seg = segs[i];
    temp[seg] = temp[seg] || {};
    temp = temp[seg];
  }
  // set the value
  temp[segs[i]] = value;
  return obj;
}

function setDataAnalyticsAttributesForMartech() {
  if (!window.alloy_all) window.alloy_all = {};
  const locale = getConfig().locale.prefix;
  const pathSegments = pathname.substr(1).split('/');
  if (locale !== '') pathSegments.shift();
  const pageName = `adobe.com:${pathSegments.join(':')}`;

  let category;
  if (pathname.includes('/create/')
      || pathname.includes('/feature/')) {
    category = 'design';
    if (pathname.includes('/image')) category = 'photo';
    if (pathname.includes('/video')) category = 'video';
  }

  //----------------------------------------------------------------------------
  // set some global and persistent data layer properties
  //----------------------------------------------------------------------------
  set('page.pageInfo.pageName', pageName);
  set('page.pageInfo.siteSection', 'adobe.com:express');
  set('page.pageInfo.category', category);

  //----------------------------------------------------------------------------
  // spark specific global and persistent data layer properties
  //----------------------------------------------------------------------------
  set('page.pageInfo.pageurl', loc.href);
  set('page.pageInfo.namespace', 'express');
}

function safelyFireAnalyticsEvent(event) {
  // eslint-disable-next-line no-underscore-dangle
  if (window._satellite?.track) {
    event();
  } else {
    window.addEventListener('alloy_sendEvent', () => {
      event();
    }, { once: true });
  }
}

export function sendEventToAnalytics(eventName) {
  const fireEvent = () => {
    _satellite.track('event', {
      xdm: {},
      data: {
        eventType: 'web.webinteraction.linkClicks',
        web: {
          webInteraction: {
            name: eventName,
            linkClicks: { value: 1 },
            type: 'other',
          },
        },
        _adobe_corpnew: { digitalData: { primaryEvent: { eventInfo: { eventName } } } },
      },
    });
  };
  safelyFireAnalyticsEvent(fireEvent);
}

export function sendFrictionlessEventToAdobeAnaltics(block) {
  const eventName = 'view-quickaction-upload-page';
  const fireEvent = () => {
    _satellite.track('event', {
      xdm: {},
      data: {
        eventType: 'web.webinteraction.linkClicks',
        web: {
          webInteraction: {
            name: eventName,
            linkClicks: { value: 1 },
            type: 'other',
          },
        },
        _adobe_corpnew: {
          sdm: {
            event: {
              pagename: eventName,
              url: loc.href,
            },
            custom: {
              qa: {
                group: block.dataset.frictionlessgroup ?? 'unknown',
                type: block.dataset.frictionlesstype ?? 'unknown',
              },
            },
          },
        },
      },
    });
  };
  safelyFireAnalyticsEvent(fireEvent);
}

export function textToName(text) {
  const splits = text.toLowerCase().split(' ');
  const camelCase = splits.map((s, i) => (i ? s.charAt(0).toUpperCase() + s.substr(1) : s)).join('');
  return (camelCase);
}

export function appendLinkText(eventName, a) {
  if (!a) return eventName;

  if (a.getAttribute('title')?.trim()) {
    return eventName + textToName(a.getAttribute('title').trim());
  }

  if (a.getAttribute('aria-label')?.trim()) {
    return eventName + textToName(a.getAttribute('aria-label').trim());
  }

  if (a.textContent?.trim()) {
    return eventName + textToName(a.textContent.trim());
  }

  const img = a.querySelector('img');
  const alt = img?.getAttribute('alt');
  if (alt) {
    return eventName + textToName(alt);
  }

  if (a.className) {
    return eventName + textToName(a.className);
  }

  return eventName;
}

export function trackButtonClick(a) {
  const fireEvent = () => {
    let adobeEventName = 'adobe.com:express:cta:';

    const $contentToggleContainer = a.closest('.content-toggle');

    if ($contentToggleContainer) {
      const toggleName = textToName(a.textContent.trim());
      adobeEventName = `${adobeEventName}contentToggle:${toggleName}:buttonPressed`;
    } else {
      adobeEventName = appendLinkText(adobeEventName, a);
    }

    // clicks using [data-lh and data-ll]
    let trackingHeader = a.closest('[data-lh]');
    if (trackingHeader || a.dataset.lh) {
      adobeEventName = 'adobe.com:express';
      let headerString = '';
      while (trackingHeader) {
        headerString = `:${textToName(trackingHeader.dataset.lh.trim())}${headerString}`;
        trackingHeader = trackingHeader.parentNode.closest('[data-lh]');
      }
      adobeEventName += headerString;
      if (a.dataset.ll) {
        adobeEventName += `:${textToName(a.dataset.ll.trim())}`;
      } else {
        adobeEventName += `:${textToName(a.innerText.trim())}`;
      }
    }

    _satellite.track('event', {
      xdm: {},
      data: {
        eventType: 'web.webinteraction.linkClicks',
        web: {
          webInteraction: {
            name: adobeEventName,
            linkClicks: { value: 1 },
            type: 'other',
          },
        },
        // eslint-disable-next-line max-len
        _adobe_corpnew: { digitalData: { primaryEvent: { eventInfo: { eventName: adobeEventName } } } },
      },
    });
  };
  safelyFireAnalyticsEvent(fireEvent);
}

function trackVideoAnalytics(parameters) {
  const {
    videoName,
    videoId,
    videoLength,
    product,
    videoCategory,
    videoDescription,
    videoPlayer,
    videoMediaType,
  } = parameters;

  set('video.videoInfo.videoName', videoName);
  set('video.videoInfo.videoId', videoId);
  set('video.videoInfo.videoLength', videoLength);
  set('video.videoInfo.product', product);
  set('video.videoInfo.videoCategory', videoCategory);
  set('video.videoInfo.videoDescription', videoDescription);
  set('video.videoInfo.videoPlayer', videoPlayer);
  set('video.videoInfo.videoMediaType', videoMediaType);
}

function decorateAnalyticsEvents() {
  // for tracking all of the links
  d.addEventListener('click', (event) => {
    if (event.target.tagName === 'A' || event.target.dataset.ll?.length) {
      trackButtonClick(event.target);
    }
  });

  // for tracking split action block notch and underlay background
  d.addEventListener('splitactionloaded', () => {
    const $notch = d.querySelector('main .split-action .notch');
    const $underlay = d.querySelector('main .split-action .underlay');

    if ($notch) {
      $notch.addEventListener('click', () => {
        trackButtonClick($notch);
      });
    }

    if ($underlay) {
      $underlay.addEventListener('click', () => {
        trackButtonClick($underlay);
      });
    }
  });

  // Tracking any link or links that is added after page loaded.
  d.addEventListener('linkspopulated', async (e) => {
    await trackBranchParameters(e.detail);
    e.detail.forEach(($link) => {
      $link.addEventListener('click', () => {
        trackButtonClick($link);
      });
    });
  });

  // tracking videos loaded asynchronously.
  d.addEventListener('videoloaded', (e) => {
    trackVideoAnalytics(e.detail.parameters);
    _satellite.track('videoloaded');
  });

  d.addEventListener('videoclosed', (e) => {
    sendEventToAnalytics(`adobe.com:express:cta:learn:columns:${e.detail.parameters.videoId}:videoClosed`);
  });
}

export default async function martechLoadedCB() {
  ({ loadScript, getConfig } = await import('../../../utils/utils.js'));
  setDataAnalyticsAttributesForMartech();
  decorateAnalyticsEvents();

  // TODO Start of section to be removed after Jingle finishes adding xlg to old express Repo
  // this piece of code is necessary for the ratings block atm so that the right user
  // segments can leave a review
  const ENABLE_PRICING_MODAL_AUDIENCE = 'enablePricingModal';
  const RETURNING_VISITOR_SEGMENT_ID = 23153796;

  const QUICK_ACTION_SEGMENTS = [
    [24241150, 'enableRemoveBackgroundRating'],
    [24793469, 'enableConvertToGifRating'],
    [24793470, 'enableConvertToJpgRating'],
    [24793471, 'enableConvertToMp4Rating'],
    [24793472, 'enableConvertToPngRating'],
    [24793473, 'enableConvertToSvgRating'],
    [24793474, 'enableCropImageRating'],
    [24793475, 'enableCropVideoRating'],
    [24793476, 'enableLogoMakerRating'],
    [24793477, 'enableMergeVideoRating'],
    [24793478, 'enableQrGeneratorRating'],
    [24793479, 'enableResizeImageRating'],
    [24793480, 'enableChangeSpeedRating'],
    [24793481, 'enableTrimVideoRating'],
    [24793483, 'enableResizeVideoRating'],
    [24793488, 'enableReverseVideoRating'],
  ];

  async function getAudiences() {
    const getSegments = async (ecid) => {
      const { default: BlockMediator } = await import('./block-mediator.min.js');

      BlockMediator.set('audiences', []);
      BlockMediator.set('segments', []);
      if (!ecid) return;
      window.setAudienceManagerSegments = (json) => {
        if (json && json.segments && json.segments.includes(RETURNING_VISITOR_SEGMENT_ID)) {
          const audiences = BlockMediator.get('audiences');
          const segments = BlockMediator.get('segments');
          audiences.push(ENABLE_PRICING_MODAL_AUDIENCE);
          segments.push(RETURNING_VISITOR_SEGMENT_ID);

          sendEventToAnalytics('pricingModalUserInSegment');
        }

        QUICK_ACTION_SEGMENTS.forEach((QUICK_ACTION_SEGMENT) => {
          if (json && json.segments && json.segments.includes(QUICK_ACTION_SEGMENT[0])) {
            const audiences = BlockMediator.get('audiences');
            const segments = BlockMediator.get('segments');
            audiences.push(QUICK_ACTION_SEGMENT[1]);
            segments.push(QUICK_ACTION_SEGMENT[0]);
          }
        });

        document.dispatchEvent(new Event('context_loaded'));
      };
      // TODO: What the heck is this?  This needs to be behind one trust and cmp
      loadScript(`https://adobe.demdex.net/event?d_dst=1&d_rtbd=json&d_cb=setAudienceManagerSegments&d_cts=2&d_mid=${ecid}`);
    };

    await _satellite.alloyConfigurePromise;
    const data = await alloy('getIdentity');
    getSegments(data?.identity?.ECID || null);
  }

  // eslint-disable-next-line no-underscore-dangle
  if (window.__satelliteLoadedCallback) {
    __satelliteLoadedCallback(getAudiences);
  } else {
    window.addEventListener('alloy_sendEvent', () => {
      __satelliteLoadedCallback(getAudiences);
    }, { once: true });
  }
  // end of section to be removed after Jingle finishes adding xlg to old express Repo
}
