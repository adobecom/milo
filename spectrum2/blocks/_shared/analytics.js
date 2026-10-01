const INVALID_CHARACTERS = /[^\u00C0-\u1FFF\u2C00-\uD7FF\w]+/g;
const LEAD_UNDERSCORES = /^_+|_+$/g;

// eslint-disable-next-line import/prefer-default-export
export function trackingLabel(text, charLimit) {
  if (text === null || text === undefined) return '';
  const value = String(text).replace(INVALID_CHARACTERS, ' ').replace(LEAD_UNDERSCORES, '').trim();
  if (charLimit) return value.slice(0, charLimit);
  return value;
}
