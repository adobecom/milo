import { getMetadata } from '../../utils/utils.js';

const GMTStringToLocalDate = (gmtString) => new Date(`${gmtString}+00:00`);

const isDisabled = (event) => {
  const currentDate = new Date();
  return event.start && event.end
    && (currentDate < event.start || currentDate > event.end);
};

export default function getPromoManifests(manifestNames) {
  const attachedManifests = manifestNames
    ? manifestNames.split(',')?.map((manifest) => manifest?.trim())
    : [];
  const schedule = getMetadata('schedule');
  if (!schedule) {
    return [];
  }
  return schedule.split(',')
    .map((manifest) => {
      const [name, start, end, manifestPath] = manifest.trim().split('|').map((s) => s.trim());
      if (attachedManifests.includes(name)) {
        const event = {
          name,
          start: GMTStringToLocalDate(start),
          end: GMTStringToLocalDate(end),
        };
        const disabled = isDisabled(event);
        return { manifestPath, disabled, event };
      }
      return null;
    })
    .filter((manifest) => manifest != null);
}
