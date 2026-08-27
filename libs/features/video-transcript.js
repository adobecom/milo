import { getFedsPlaceholderConfig } from '../utils/utils.js';

const TRANSCRIPT_ICON = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M11.25 11.25L11.291 11.23C11.4192 11.1659 11.5631 11.14 11.7057 11.1552C11.8482 11.1703 11.9834 11.2261 12.0952 11.3157C12.2071 11.4054 12.2909 11.5252 12.3368 11.661C12.3826 11.7968 12.3886 11.9429 12.354 12.082L11.646 14.918C11.6111 15.0572 11.6169 15.2034 11.6627 15.3394C11.7084 15.4754 11.7922 15.5954 11.9041 15.6852C12.016 15.775 12.1513 15.8308 12.294 15.846C12.4367 15.8612 12.5807 15.8352 12.709 15.771L12.75 15.75M21 12C21 13.1819 20.7672 14.3522 20.3149 15.4442C19.8626 16.5361 19.1997 17.5282 18.364 18.364C17.5282 19.1997 16.5361 19.8626 15.4442 20.3149C14.3522 20.7672 13.1819 21 12 21C10.8181 21 9.64778 20.7672 8.55585 20.3149C7.46392 19.8626 6.47177 19.1997 5.63604 18.364C4.80031 17.5282 4.13738 16.5361 3.68508 15.4442C3.23279 14.3522 3 13.1819 3 12C3 9.61305 3.94821 7.32387 5.63604 5.63604C7.32387 3.94821 9.61305 3 12 3C14.3869 3 16.6761 3.94821 18.364 5.63604C20.0518 7.32387 21 9.61305 21 12ZM12 8.25H12.008V8.258H12V8.25Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
`;

const TRANSCRIPT_KEY = 'transcript';
let cachedLabel;

async function getTranscriptLabel() {
  if (cachedLabel) return cachedLabel;
  const { replaceKey } = await import('./placeholders.js');
  const label = await replaceKey(TRANSCRIPT_KEY, getFedsPlaceholderConfig());
  cachedLabel = (label && label.toLowerCase() !== TRANSCRIPT_KEY) ? label : 'Transcript';
  return cachedLabel;
}

/**
 * @param {HTMLVideoElement} videoEl the decorated video element
 */
export default async function decorateVideoTranscript(videoEl) {
  const container = videoEl?.closest('.video-container');
  if (!container) return;
  const cell = container.parentElement?.closest('div') || container.parentElement;
  const link = cell?.querySelector('a.video-transcript-source');
  if (!link || container.contains(link)) return;

  link.classList.add('transcript-button');
  link.classList.remove('video-transcript-source', 'con-button', 'button-l', 'button-m', 'button-s', 'blue', 'fill', 'outline');
  link.setAttribute('role', 'button');
  link.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      link.click();
    }
  });
  const label = await getTranscriptLabel();
  link.setAttribute('aria-label', label);
  link.setAttribute('title', label);
  link.innerHTML = TRANSCRIPT_ICON;
  const playPause = container.querySelector('.play-pause-button');
  if (playPause) container.insertBefore(link, playPause);
  else container.append(link);
}
