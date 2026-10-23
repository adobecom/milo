import { createTag, getConfig } from '../../../utils/utils.js';
import { replaceKeyArray } from '../../../features/placeholders.js';
import { showToast } from '../../features/toast/toast.js';

const SHARE_ICON = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false"><path d="M8.5 11.5a3.536 3.536 0 0 0 5 0l3-3a3.536 3.536 0 0 0-5-5l-.75.75M11.5 8.5a3.536 3.536 0 0 0-5 0l-3 3a3.536 3.536 0 0 0 5 5l.75-.75" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const BUTTON_STYLES = ['fill', 'blue'];

const sentenceCase = (str) => (str ? `${str.charAt(0).toUpperCase()}${str.slice(1)}` : '');

export function getShareUrl(link) {
  if (link?.href) return link.href;
  const canonical = document.querySelector('link[rel="canonical"]')?.href;
  if (canonical) return canonical;
  const { origin, pathname } = window.location;
  return `${origin}${pathname}`;
}

export default function init(el) {
  const link = el.querySelector('a[href]');
  const url = getShareUrl(link);
  const label = (link ?? el).textContent.trim();
  const messages = replaceKeyArray(['copy-link', 'link-copied', 'copy-link-failed'], getConfig())
    .then((values) => values.map(sentenceCase))
    .catch(() => ['Copy link', 'Link copied', 'Could not copy link']);

  const style = BUTTON_STYLES.find((name) => el.classList.contains(name)) ?? 'outline';
  const button = createTag('button', {
    type: 'button',
    class: `con-button ${style} share-c2-button`,
    'daa-ll': 'Share-Copy-Link',
  }, SHARE_ICON);
  const text = createTag('span', { class: 'share-c2-label' });
  text.textContent = label;
  button.append(text);
  if (!label) {
    button.classList.add('icon-only');
    messages.then(([copyLabel]) => button.setAttribute('aria-label', copyLabel));
  }

  button.addEventListener('click', async () => {
    // Copy before awaiting labels so the click's user activation is still valid.
    const copy = (navigator.clipboard?.writeText(url) ?? Promise.reject(new Error('clipboard unavailable')))
      .then(() => true, (e) => {
        window.lana?.log(`share-c2: copy failed - ${e?.message}`, { tags: 'share-c2', severity: 'warning' });
        return false;
      });
    const [[, copied, failed], success] = await Promise.all([messages, copy]);
    showToast({
      message: success ? copied : failed,
      variant: success ? 'positive' : 'negative',
      key: 'share-c2',
    });
  });

  el.replaceChildren(button);
}
