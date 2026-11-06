import { createTag, loadStyle } from '../../utils/utils.js';

const CONSENT_REMINDER_KEY = 'milo:marketo-consent-reminder';
const MAX_AGE = 10 * 60 * 1000;

function consumeReminder() {
  try {
    const raw = sessionStorage.getItem(CONSENT_REMINDER_KEY);
    if (!raw) return false;
    let reminder;
    try {
      reminder = JSON.parse(raw);
    } catch {
      sessionStorage.removeItem(CONSENT_REMINDER_KEY);
      window.lana?.log('Could not read Marketo consent reminder', { tags: 'marketo', severity: 'w' });
      return false;
    }
    if (reminder?.version === 1
      && Number.isFinite(reminder.createdAt)
      && typeof reminder.destination === 'string') {
      const age = Date.now() - reminder.createdAt;
      if (age >= 0 && age <= MAX_AGE) {
        if (reminder.destination !== `${window.location.origin}${window.location.pathname}`) return false;
        sessionStorage.removeItem(CONSENT_REMINDER_KEY);
        return true;
      }
    }
    sessionStorage.removeItem(CONSENT_REMINDER_KEY);
    window.lana?.log('Discarding invalid or expired Marketo consent reminder', { tags: 'marketo', severity: 'w' });
  } catch {
    window.lana?.log('Could not read Marketo consent reminder', { tags: 'marketo', severity: 'w' });
  }
  return false;
}

export default function init() {
  const main = document.querySelector('main');
  if (!main || document.querySelector('.marketo-consent-banner') || !consumeReminder()) return;

  const banner = createTag('aside', {
    class: 'marketo-consent-banner',
    lang: 'de',
    role: 'status',
  });
  const message = createTag('p');
  message.textContent = 'Bitte pr\u00fcfen Sie Ihr E-Mail-Postfach und best\u00e4tigen Sie Ihre Anmeldung \u00fcber den Link in unserer E-Mail.';
  const close = createTag('button', {
    class: 'marketo-consent-banner-close',
    type: 'button',
    'aria-label': 'Hinweis schlie\u00dfen',
  });
  close.textContent = '\u00d7';
  close.addEventListener('click', () => banner.remove());
  banner.append(message, close);
  main.prepend(banner);

  loadStyle(new URL('./marketo-consent-banner.css', import.meta.url).href, (status) => {
    if (status !== 'error') return;
    banner.remove();
    window.lana?.log('Could not load Marketo consent banner styles', { tags: 'marketo', severity: 'w' });
  });
  window.addEventListener('pagehide', () => banner.remove(), { once: true });
}
