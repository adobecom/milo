import { bcAnalytics } from './bc-analytics.js';

/*
 * Best-effort adapter from AcomAssistant's analyticsCallback event shape into BC's
 * existing bcAnalytics()/dunamis pipeline. The wiki marks this mapping "InProgress" --
 * only fields with a clear, confident correspondence are forwarded; anything else is
 * logged (not silently dropped) so gaps stay visible until Adobe finalizes the contract.
 * https://wiki.corp.adobe.com/spaces/Infinity/pages/4028260009/BC+Milo+Integration
 */
export default function acomAssistantAnalyticsAdapter(eventsData) {
  const data = eventsData?.events?.[0]?.data;
  if (!data) return;

  if (data['event.error_code'] && data['event.error_type']) {
    bcAnalytics({ eventType: 'error:occurred', data: { errorMessage: data['event.error_desc'] } });
    return;
  }

  if (data['event.type']?.toLowerCase() === 'click' && data['content.name']) {
    bcAnalytics({ eventType: 'cta:clicked', data: { source: data['content.name'] } });
    return;
  }

  window.lana?.log(
    `AcomAssistant analytics: unmapped event ${data['event.workflow']}/${data['event.type']}`,
    { tags: 'brand-concierge', severity: 'info', sampleRate: 5 },
  );
}
