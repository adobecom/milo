import { getMepEnablement, getMetadata } from '../../utils/utils.js';
import getPromoManifests from '../../features/personalization/promo-utils.js';

// Same sources and priority as the C1 countdown timer: a passed value (e.g. MAS card dates),
// then the active MEP promo schedule, then the countdown-timer page metadata
export default function getCountdownDates(dates) {
  if (dates) return dates;
  const { searchParams } = new URL(window.location.href);
  const manifests = getPromoManifests(getMepEnablement('manifestnames', 'promo'), searchParams);
  const hasDates = ({ disabled, event }) => !disabled && event.cdtStart && event.cdtEnd;
  const { event } = manifests.findLast(hasDates) ?? {};
  return event ? `${event.cdtStart},${event.cdtEnd}` : getMetadata('countdown-timer');
}
