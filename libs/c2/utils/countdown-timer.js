import { createTag, getConfig } from '../../utils/utils.js';

// Same unit placeholders as the C1 countdown timer, plus seconds
const UNIT_KEYS = { day: 'cdt-days', hour: 'cdt-hours', minute: 'cdt-mins', second: 'cdt-secs' };

export async function getCountdownLabels() {
  const { replaceKeyArray } = await import('../../features/placeholders.js');
  const labels = await replaceKeyArray(Object.values(UNIT_KEYS), getConfig());
  return Object.fromEntries(Object.keys(UNIT_KEYS).map((unit, i) => [unit, labels[i]]));
}

// Default DD:HH:MM:SS display for a countdown from ./countdown.js; blocks can render their own
export default function createCountdownTimer(countdown, labels, className = 'countdown') {
  const el = createTag('div', { class: className, role: 'timer' });
  const digits = createTag('span', { class: 'countdown-digits', dir: 'ltr', 'aria-hidden': 'true' }, null, { parent: el });
  const label = createTag('span', { class: 'sr-only' }, null, { parent: el });
  const values = [];

  const render = ({ status, parts }) => {
    if (status !== 'running') return;
    if (!values.length) {
      parts.forEach((part, i) => {
        if (i) createTag('span', { class: 'countdown-separator' }, ':', { parent: digits });
        values.push(createTag('span', { class: 'countdown-value' }, null, { parent: digits }));
      });
    }
    parts.forEach(({ value }, i) => { values[i].textContent = String(value).padStart(2, '0'); });
    label.textContent = parts.map(({ unit, value }) => `${value} ${labels[unit]}`).join(' ');
  };

  return { el, destroy: countdown.subscribe(render) };
}
