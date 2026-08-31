import { loadStyle } from '../utils/utils.js';

/**
 * @param {HTMLVideoElement} videoEl the decorated video element
 */
export default async function decorateVideoTranscript(videoEl) {
  const container = videoEl?.closest('.video-container');
  if (!container) {
    window.lana?.log('video-transcript: no .video-container found for video element', { tags: 'video-transcript', severity: 'error' });
    return;
  }
  const cell = container.parentElement?.closest('div') || container.parentElement;
  const link = cell?.querySelector('a.video-transcript-source');
  if (!link) {
    window.lana?.log('video-transcript: no a.video-transcript-source link found near video container', { tags: 'video-transcript', severity: 'error' });
    return;
  }
  if (container.contains(link)) return;

  loadStyle(new URL('./video-transcript.css', import.meta.url).href);

  link.className = 'transcript-button';
  link.setAttribute('role', 'button');
  link.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      link.click();
    }
  });
  const playPause = container.querySelector('.play-pause-button');
  if (playPause) container.insertBefore(link, playPause);
  else container.append(link);
}
