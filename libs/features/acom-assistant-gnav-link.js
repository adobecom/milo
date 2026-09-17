/*
 * GNav "#open-jarvis-chat" entry point, built on the shared Acom Assistant Client
 * loader (./acom-assistant.js). Replaces jarvis-chat.js -- same href/metadata
 * contract for already-authored content, so no authoring changes are needed.
 *
 * https://wiki.corp.adobe.com/spaces/Infinity/pages/3998335900/WIP+Acom+Assistant+Client
 */

import { loadAcomAssistant, openAcomAssistantChat, getAcomAssistantClient } from './acom-assistant.js';

let chatInitialized = false;
let jarvisSecMeta = null;

const isSilentEvent = (data) => (data['event.workflow'] === 'init' && data['event.type'] === 'request')
  || (data['event.workflow'] === 'Chat' && data['event.type'] === 'load' && data['event.subtype'] === 'window');

const getBaseEvent = (data) => ({
  chatConversationId: data['event.context_guid'],
  chatConversationSessionId: data['event.session_guid'],
  chatWorkflow: data['event.workflow'],
  chatCategory: data['event.category'],
  chatSubcategory: data['event.subcategory'],
  chatType: data['event.type'],
  chatSubtype: data['event.subtype'],
  chatUserguid: data['event.user_guid'],
  chatLanguage: data['event.language'],
  chatPagename: data['event.pagename'],
  chatVisitorguid: data['event.visitor_guid'],
  chatUrl: data['event.url'],
  chatOrgguid: data['event.org_guid'],
  chatReferrer: data['event.referrer'],
  chatClientId: data['source.client_id'],
  chatSourceName: data['source.name'],
  chatPlatform: data['source.platform'],
  chatContentName: data['content.name'],
  chatEnv: data['env.com.name'],
});

const setSophiaLayer = (data) => {
  const sophiaData = {
    variationId: data['exp.variation_id'],
    actionBlockId: data['exp.action_block_id'],
    campaignId: data['exp.campaign_id'],
    containerId: data['exp.container_id'],
    controlGroupId: data['exp.control_group_id'],
    treatmentId: data['exp.treatment_id'],
    surfaceId: data['exp.surface_id'],
  };

  Object.keys(sophiaData).forEach((key) => {
    if (!sophiaData[key]) delete sophiaData[key];
  });
  if (!Object.keys(sophiaData).length) return;

  const sophiaDataCaptured = (id) => {
    let captured = false;
    if (!id) return captured;

    const sophiaDataLayer = window.digitalData.sophiaResponse?.fromPage;
    if (Array.isArray(sophiaDataLayer)) {
      captured = sophiaDataLayer.some((sophiaEvent) => sophiaEvent?.campaignId === id);
    } else {
      captured = (sophiaDataLayer?.campaignId === id);
    }

    return captured;
  };

  if (sophiaDataCaptured(sophiaData.campaignId)) return;

  window.digitalData.sophiaResponse ||= {};
  window.digitalData.sophiaResponse.fromPage ||= [];

  if (Array.isArray(window.digitalData.sophiaResponse.fromPage)) {
    window.digitalData.sophiaResponse.fromPage.push(sophiaData);
  } else {
    window.digitalData.sophiaResponse.fromPage = sophiaData;
  }
};

const sendEvent = (data) => {
  setSophiaLayer(data);
  // eslint-disable-next-line no-underscore-dangle
  window._satellite?.track('event', {
    xdm: {},
    data: {
      web: { webInteraction: { name: window.digitalData.primaryEvent?.eventInfo?.eventName } },
      _adobe_corpnew: {
        digitalData: {
          primaryEvent: window.digitalData.primaryEvent,
          chat: window.digitalData.chat,
          sophiaResponse: window.digitalData.sophiaResponse,
        },
      },
    },
  });
};

const getDataProperties = (data, properties = []) => properties.reduce((str, prop) => {
  let output = str;
  output += `${output && ':'}${data[prop] || ''}`;
  return output;
}, '');

const sendChatIconRenderEvent = (data) => {
  window.digitalData.primaryEvent = {
    eventInfo: {
      eventName: `chat:${getDataProperties(data, ['event.workflow', 'event.subcategory', 'event.subtype', 'content.name', 'event.type'])}`,
      eventAction: getDataProperties(data, ['event.subcategory', 'content.name', 'event.type']),
    },
  };

  window.digitalData.chat = {};
  window.digitalData.chat.chatInfo = getBaseEvent(data);
  window.digitalData.chat.chatInfo.chatConversationUnread = data['content.name'];

  sendEvent(data);
};

const sendChatIconClickEvent = (data) => {
  window.digitalData.primaryEvent = {
    eventInfo: {
      eventName: `chat:${getDataProperties(data, ['event.workflow', 'event.subcategory', 'event.subtype', 'content.name', 'event.type'])}`,
      eventAction: getDataProperties(data, ['event.subcategory', 'event.subtype', 'content.name', 'event.type']),
    },
  };

  window.digitalData.chat = {};
  window.digitalData.chat.chatInfo = getBaseEvent(data);
  window.digitalData.chat.chatInfo.chatConversationUnread = data['content.name'];

  sendEvent(data);
};

const sendProductEvent = (data) => {
  window.digitalData.primaryEvent = {
    eventInfo: {
      eventName: `chat:${getDataProperties(data, ['event.workflow', 'content.name', 'event.subtype', 'event.type'])}`,
      eventAction: getDataProperties(data, ['event.subcategory', 'content.name', 'event.subtype', 'event.type']),
    },
  };

  window.digitalData.chat = { chatInfo: { primaryProduct: { productName: data['event.subtype'] } } };

  sendEvent(data);
};

const sendSurveyFeedbackEvent = (data) => {
  window.digitalData.primaryEvent = {
    eventInfo: {
      eventName: `chat:${getDataProperties(data, ['event.workflow', 'content.name', 'event.subtype', 'event.type', 'content.id'])}`,
      eventAction: getDataProperties(data, ['event.subcategory', 'content.name', 'event.subtype', 'event.type']),
    },
  };

  sendEvent(data);
};

const sendChatErrorEvent = (data) => {
  window.digitalData.primaryEvent = {
    eventInfo: {
      eventName: `chat:${getDataProperties(data, ['event.workflow', 'event.subtype', 'event.type'])}:error`,
      eventAction: `${getDataProperties(data, ['event.subcategory', 'event.subtype', 'event.type'])}:error`,
    },
  };

  window.digitalData.chat = {};
  window.digitalData.chat.chatInfo = getBaseEvent(data);
  window.digitalData.chat.chatInfo.chatErrorCode = data['event.error_code'];
  window.digitalData.chat.chatInfo.chatErrorType = data['event.error_type'];
  window.digitalData.chat.chatInfo.chatErrorDescription = data['event.error_desc'];

  sendEvent(data);
};

const sendPrimaryEvent = (data) => {
  window.digitalData.primaryEvent = {
    eventInfo: {
      eventName: `chat:${getDataProperties(data, ['event.workflow', 'content.name', 'event.subtype', 'event.type'])}`,
      eventAction: getDataProperties(data, ['event.subcategory', 'content.name', 'event.subtype', 'event.type']),
    },
  };

  window.digitalData.chat = {};
  window.digitalData.chat.chatInfo = getBaseEvent(data);

  sendEvent(data);
};

const redirectToSupport = () => window.location.assign('https://helpx.adobe.com');

const analyticsCallback = (eventData) => {
  if (!window.alloy_all || !window.digitalData) return;
  const data = eventData?.events?.[0]?.data;
  if (!data || isSilentEvent(data)) return;
  if (data['event.subcategory']?.toLowerCase() === 'launch'
    && data['event.workflow']?.toLowerCase() === 'init') {
    if (data['event.type']?.toLowerCase() === 'render') {
      sendChatIconRenderEvent(data);
      return;
    }
    if (data['event.type']?.toLowerCase() === 'click') {
      sendChatIconClickEvent(data);
      return;
    }
  }
  if (data['content.name']?.toLowerCase() === 'auth-subproduct') {
    sendProductEvent(data);
    return;
  }
  if (data['content.name']?.toLowerCase() === '5-star-survey') {
    sendSurveyFeedbackEvent(data);
    return;
  }
  if (data['event.error_code'] && data['event.error_type']) {
    sendChatErrorEvent(data);
    return;
  }
  sendPrimaryEvent(data);
};

function isChatOpen() {
  const client = getAcomAssistantClient();
  return !!client?.isAdobeMessagingClientInitialized?.()
    && client?.getMessagingExperienceState?.()?.windowState !== 'hidden';
}

async function openChat(event) {
  if (!chatInitialized) { redirectToSupport(); return; }
  if (isChatOpen()) return;
  if (event) {
    const sourceType = event.target.tagName?.toLowerCase();
    const sourceText = (sourceType === 'img') ? event.target.alt?.trim() : event.target.innerText?.trim();
    await openAcomAssistantChat({ sourceType, sourceText });
  } else {
    await openAcomAssistantChat({});
  }
}

async function ensureAcomAssistant(config, getMetadata, event, onDemand, deps) {
  await loadAcomAssistant({
    appid: getMetadata('jarvis-surface-id') || config.jarvis?.id || jarvisSecMeta?.['jarvis-surface-id'],
    appver: getMetadata('jarvis-surface-version') || config.jarvis?.version || jarvisSecMeta?.['jarvis-surface-version'],
    signInContext: config.signInContext,
    callbacks: {
      initCallback: (data) => {
        chatInitialized = !!data?.releaseControl?.showAdobeMessaging;
      },
      onReadyCallback: () => {
        if (onDemand) openChat(event);
      },
      getContextCallback: () => {
        let appId; let appVer;
        if (jarvisSecMeta) {
          appId = jarvisSecMeta['jarvis-surface-id'];
          appVer = jarvisSecMeta['jarvis-surface-version'];
          jarvisSecMeta = null;
        }
        return {
          appid: appId || getMetadata('jarvis-surface-id') || config.jarvis?.id,
          appver: appVer || getMetadata('jarvis-surface-version') || config.jarvis?.version,
        };
      },
      signInProvider: () => window.adobeIMS?.signIn(config.signInContext),
      analyticsCallback,
    },
  }, deps);
}

let eventListenerAdded = false;
const addEventListeners = () => {
  if (eventListenerAdded) return;
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      const tooltipMessage = document.querySelector('.adbmsg-tooltip');
      if (tooltipMessage && tooltipMessage.style.display !== 'none') {
        tooltipMessage.style.display = 'none';
      }
    }
  });
  eventListenerAdded = true;
};

const initAcomAssistantGnavLink = async (
  config,
  loadScriptFunction,
  loadStyleFunction,
  getMetadataFunction,
) => {
  if (!config?.jarvis) return;

  const getMetadata = getMetadataFunction;
  const deps = { loadScript: loadScriptFunction, loadStyle: loadStyleFunction };
  const onDemandMeta = getMetadata('jarvis-on-demand')?.toLowerCase();
  const onDemand = onDemandMeta ? onDemandMeta === 'on' : config.jarvis.onDemand;

  document.addEventListener('click', async (event) => {
    const jarvisLink = event.target.closest('[href*="#open-jarvis-chat"]');
    if (!jarvisLink) return;
    if (event.target.closest('.global-footer')) {
      try {
        const jarvisAttr = jarvisLink.getAttribute('data-jarvis-config');
        jarvisSecMeta = jarvisAttr ? JSON.parse(jarvisAttr) : null;
      } catch (e) {
        // do nothing & use default config
      }
    }
    event.preventDefault();
    if (onDemand && !chatInitialized) {
      await ensureAcomAssistant(config, getMetadata, event, onDemand, deps);
      addEventListeners();
    } else {
      openChat(event);
    }
  });
  if (!onDemand) {
    await ensureAcomAssistant(config, getMetadata, null, onDemand, deps);
    addEventListeners();
  }
};

export {
  initAcomAssistantGnavLink,
  openChat,
};
