import { createTag } from '../../../utils/utils.js';

const SEV_ORDER = { high: 0, warn: 1 };
const SEV_LABEL = { high: 'Critical', warn: 'Review' };
const MAX_SHOWN = 8;

function buildAlerts({ testPages, projects }) {
  const alerts = [];

  (testPages || []).forEach(({ site, path }) => {
    alerts.push({ severity: 'warn', message: `Possible test/draft page on live: ${site}${path}`, site, path });
  });

  (projects || []).forEach(({ site, avg_health: avgHealth }) => {
    if (avgHealth == null) return;
    const health = Number(avgHealth);
    if (health < 50) {
      alerts.push({ severity: 'high', message: `Preflight health critical for ${site} (${health.toFixed(1)})`, site });
    }
  });

  alerts.sort((a, b) => SEV_ORDER[a.severity] - SEV_ORDER[b.severity]);
  return alerts;
}

function buildMsg(alert) {
  if (alert.severity === 'warn' && alert.site && alert.path) {
    const href = `https://main--${alert.site}--adobecom.aem.live${alert.path}`;
    const link = createTag(
      'a',
      { class: 'alert-link', href, target: '_blank', rel: 'noopener' },
      alert.message,
    );
    return createTag('span', { class: 'alert-msg' }, link);
  }
  return createTag('span', { class: 'alert-msg' }, alert.message);
}

export default function renderAlerts(container, data, onConsumer) {
  const alerts = buildAlerts(data || {});
  let expanded = false;

  function draw() {
    container.replaceChildren();
    if (!alerts.length) {
      container.append(createTag('div', { class: 'alerts-empty' }, 'All clear — nothing flagged'));
      return;
    }
    const list = createTag('div', { class: 'alerts-list' });
    const shown = expanded ? alerts : alerts.slice(0, MAX_SHOWN);
    shown.forEach((alert) => {
      const sev = createTag('span', { class: `alert-sev ${alert.severity}` }, SEV_LABEL[alert.severity]);
      const msg = buildMsg(alert);
      if (alert.severity === 'high' && onConsumer) {
        const item = createTag('button', { type: 'button', class: 'alert-item' }, [sev, msg]);
        item.addEventListener('click', () => onConsumer(alert.site));
        list.append(item);
        return;
      }
      list.append(createTag('div', { class: 'alert-item' }, [sev, msg]));
    });

    if (alerts.length > MAX_SHOWN) {
      const label = expanded ? 'Show less' : `+${alerts.length - MAX_SHOWN} more`;
      const toggle = createTag('button', { type: 'button', class: 'alerts-more' }, label);
      toggle.addEventListener('click', () => { expanded = !expanded; draw(); });
      list.append(toggle);
    }
    container.append(list);
  }

  draw();
}
