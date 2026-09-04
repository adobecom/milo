import { getConfig } from '../../utils/utils.js';
import { getChatSessionId } from './bc-utils.js';

export function getAnalyticsLabel(step) {
  return `Filters|${getConfig()?.brandConciergeAA ? getConfig()?.brandConciergeAA : 'app-reco'}|bc#${step}`;
}

const recordNavClick = ({ clickType, destinationPage, clickSource } = {}) => {
  window.history.replaceState(
    {
      ...window.history.state,
      bcClickType: clickType,
      bcSourcePage: window.location.href,
      bcDestinationPage: destinationPage ?? '',
      bcClickSource: clickSource ?? '',
    },
    '',
  );
};

const handleNav = (event) => {
  switch (event.eventType) {
    case 'card:clicked':
      recordNavClick({
        clickType: 'product_card_cta',
        destinationPage: event.data?.destinationUrl,
      });
      break;
    case 'cta:clicked':
      recordNavClick({ clickType: 'cta', clickSource: event.data?.source });
      break;
    case 'link:clicked':
      recordNavClick({
        clickType: event.data?.element?.linkType ?? 'inline_hyperlink',
        destinationPage: event.data?.element?.href,
      });
      break;
    default:
      break;
  }
};

/* eslint-disable no-undef, no-underscore-dangle */
export const bcAnalytics = (event) => {
  handleNav(event);

  if (window?._satellite?.track) {
    switch (event.eventType) {
      case 'query:submitted':
        window.performance.mark('query:submitted');
        break;
      case 'response:started':
        window.performance.mark('response:started');
        _satellite.track('event', {
          data: {
            web: { webInteraction: { name: `BC-TimetoResponseStart|${(window.performance.measure('responsestarted', 'query:submitted', 'response:started').duration / 1000).toFixed(2)} seconds` } },
            bc: { TimetoResponseStart: (window.performance.measure('responsestarted', 'query:submitted', 'response:started').duration / 1000).toFixed(2) },
          },
        });
        break;
      case 'response:completed':
        window.performance.mark('response:completed');
        _satellite.track('event', {
          data: {
            web: { webInteraction: { name: `BC-TimetoResponseFinished|${(window.performance.measure('responsefinished', 'response:started', 'response:completed').duration / 1000).toFixed(2)} seconds` } },
            bc: { TimetoResponseFinished: (window.performance.measure('responsefinished', 'response:started', 'response:completed').duration / 1000).toFixed(2) },
          },
        });
        break;
      case 'promptSuggestion:clicked':
        _satellite.track('event', {
          data: {
            web: { webInteraction: { name: `BC-suggested_prompt_clicked|${event.data?.type}` } },
            _adobe_corpnew: { digitalData: { primaryEvent: { eventInfo: { interaction: { click: `BC-suggested_prompt_clicked|${event.data?.type}|${event.data?.suggestion}` } } } } },
          },
        });
        break;
      case 'cards:rendered':
        // eslint-disable-next-line no-case-declarations
        let cardimpression = '';
        // eslint-disable-next-line no-return-assign
        event.data?.element.forEach((element) => cardimpression += `BC-card|${element.cardType}|${element.productName}|${element.productPageURL},`);
        _satellite.track('event', {
          data: {
            web: { webInteraction: { name: `BC-card_rendered|${event.data?.displayMode}` } },
            // eslint-disable-next-line max-len
            _adobe_corpnew: { digitalData: { primaryEvent: { eventInfo: { interaction: { additionalImpressions: cardimpression.slice(0, -1) } } } } },
          },
        });
        break;
      case 'card:clicked':
        _satellite.track('event', {
          data: {
            web: { webInteraction: { name: `BC-card_clicked|${event.data?.element?.cardType}|${event.data?.element?.productName}|loginStatus:${event.data?.element?.loginStatus}` } },
            _adobe_corpnew: {
              digitalData: {
                primaryEvent: {
                  eventInfo: {
                    interaction: {
                      click: `BC-card|${event.data?.element?.cardType}|${event.data?.element?.productName}|${event.data?.element?.productPageURL}|loginStatus:${event.data?.element?.loginStatus}`,
                      iclick: true,
                    },
                  },
                },
              },
            },
          },
        });
        break;
      case 'cta:clicked':
        _satellite.track('event', {
          data: {
            web: { webInteraction: { name: `BC-cta_clicked|loginStatus:${window.adobeIMS?.isSignedInUser() ? 'logged-in' : 'logged-out'}` } },
            _adobe_corpnew: {
              digitalData: {
                primaryEvent: {
                  eventInfo: {
                    interaction: {
                      click: `BC-cta|loginStatus:${window.adobeIMS?.isSignedInUser() ? 'logged-in' : 'logged-out'}`,
                      iclick: true,
                    },
                  },
                },
              },
            },
          },
        });
        break;
      case 'firefly:galleryRendered':
        _satellite.track('event', {
          data: {
            web: { webInteraction: { name: `BC-firefly_gallery_rendered|loginStatus:${event.data?.element?.loginStatus}` } },
            _adobe_corpnew: { digitalData: { primaryEvent: { eventInfo: { interaction: { additionalImpressions: `BC-firefly-gallery|${event.data?.element?.cardType}|loginStatus:${event.data?.element?.loginStatus}` } } } } },
          },
        });
        break;
      case 'firefly:imageRendered':
        _satellite.track('event', {
          data: {
            web: { webInteraction: { name: `BC-firefly_image_rendered|loginStatus:${event.data?.element?.loginStatus}` } },
            _adobe_corpnew: { digitalData: { primaryEvent: { eventInfo: { interaction: { additionalImpressions: `BC-firefly-image|${event.data?.element?.cardType}|loginStatus:${event.data?.element?.loginStatus}` } } } } },
          },
        });
        break;
      case 'error:occurred':
        _satellite.track('event', {
          data: {
            web: { webInteraction: { name: 'BC-Response:Sorry-Error_Occurred' } },
            _adobe_corpnew: { digitalData: { primaryEvent: { eventInfo: { interaction: { click: `BC-Response:Sorry-Error_Occurred|${event.data?.errorMessage}` } } } } },
          },
        });
        break;
      case 'navigation:backNavigation': {
        const {
          clickType = 'unknown',
          sessionId = '',
          sourcePage = '',
          destinationPage = '',
          clickSource = '',
          loginStatus = '',
          navigatedBack = true,
        } = event.data ?? {};
        const eventName = `BC-chat_${clickType}_back_navigation`;
        _satellite.track('event', {
          data: {
            web: { webInteraction: { name: `${eventName}|loginStatus:${loginStatus}` } },
            bc: {
              eventName,
              timestamp: new Date().toISOString(),
              sessionId,
              clickType,
              sourcePage,
              destinationPage,
              clickSource,
              navigatedBack,
              loginStatus,
            },
            _adobe_corpnew: { digitalData: { primaryEvent: { eventInfo: { interaction: { click: `${eventName}|session:${sessionId}|from:${sourcePage}|to:${destinationPage}|source:${clickSource}|nav:${navigatedBack}|loginStatus:${loginStatus}` } } } } },
          },
        });
        break;
      }
      default:
        break;
    }
  }
};

const initBackNavAnalytics = () => {
  const emitAnalyticsIfBackNav = () => {
    const state = window.history.state ?? {};
    if (!state.bcClickType) {
      return;
    }

    bcAnalytics({
      eventType: 'navigation:backNavigation',
      data: {
        clickType: state.bcClickType,
        sessionId: getChatSessionId(),
        sourcePage: state.bcSourcePage ?? window.location.href,
        destinationPage: state.bcDestinationPage ?? '',
        clickSource: state.bcClickSource ?? '',
        loginStatus: window.adobeIMS?.isSignedInUser() ? 'logged-in' : 'logged-out',
        navigatedBack: true,
      },
    });
  };

  // bfcache restore: page is brought back from memory, init does not re-run.
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) emitAnalyticsIfBackNav();
  });

  // full-page back/forward load: init re-runs, navigation type is back_forward.
  if (window.performance.getEntriesByType('navigation')[0]?.type === 'back_forward') {
    emitAnalyticsIfBackNav();
  }
};

export const initAnalytics = () => {
  initBackNavAnalytics();
};
