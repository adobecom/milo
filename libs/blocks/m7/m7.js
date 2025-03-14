import { getConfig, getMetadata } from '../../utils/utils.js';
import { getMiloLocaleSettings } from '../merch/merch.js';

export function generateM7Link(href) {
  const paCode = getMetadata('m7-pa-code');
  if (!paCode) return href;

  const { locale } = getConfig();
  const country = getMiloLocaleSettings(locale).country || 'US';

  const m7link = new URL('https://commerce.adobe.com/store/segmentation?cli=creative&cs=t');
  m7link.searchParams.append('co', country);
  m7link.searchParams.append('pa', paCode);
  if (href.includes('/creativecloud/education-plans.html')) {
    m7link.searchParams.append('ms', 'EDU');
  }
  return m7link.toString();
}

export default function init(el) {
  el.href = generateM7Link(el.href);
}
