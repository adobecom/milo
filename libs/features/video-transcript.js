import { getFedsPlaceholderConfig } from '../utils/utils.js';

const TRANSCRIPT_ICON = `
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
    <path d="M12 2.75a9.25 9.25 0 1 0 0 18.5 9.25 9.25 0 0 0 0-18.5Zm0 1.5a7.75 7.75 0 1 1 0 15.5 7.75 7.75 0 0 1 0-15.5Z"/>
    <path d="M12 10.25a.9.9 0 0 0-.9.9v5.1a.9.9 0 0 0 1.8 0v-5.1a.9.9 0 0 0-.9-.9Z"/>
    <circle cx="12" cy="7.6" r="1.1"/>
  </svg>
`;

const TRANSCRIPT_KEY = 'transcript';
let cachedLabel;

async function getTranscriptLabel() {
  if (cachedLabel) return cachedLabel;
  cachedLabel = 'Transcript';
  try {
    const { replaceKey } = await import('./placeholders.js');
    const label = await replaceKey(TRANSCRIPT_KEY, getFedsPlaceholderConfig());
    // replaceKey echoes the raw key when no placeholder is configured; only use
    // a real, localized value.
    if (label && label.toLowerCase() !== TRANSCRIPT_KEY) cachedLabel = label;
  } catch (e) {
    // fall back to the default label
  }
  return cachedLabel;
}

/**
 * Converts a tagged transcript source link into a control button inside the
 * video's control cluster. The link keeps its modal data attributes, so the
 * existing modal machinery opens the transcript with no extra wiring.
 * @param {HTMLVideoElement} videoEl the decorated video element
 */
export default async function decorateVideoTranscript(videoEl) {
  const container = videoEl?.closest('.video-container');
  if (!container) return;
  // The transcript link is authored in the same cell as the video, but may sit
  // in a sibling wrapper (e.g. its own <p>), so search the nearest cell div.
  const cell = container.parentElement?.closest('div') || container.parentElement;
  const link = cell?.querySelector('a.video-transcript-source');
  if (!link || container.contains(link)) return;

  link.classList.add('transcript-button');
  link.classList.remove('video-transcript-source', 'con-button', 'button-l', 'button-m', 'button-s', 'blue', 'fill', 'outline');
  const label = await getTranscriptLabel();
  link.setAttribute('aria-label', label);
  link.setAttribute('title', label);
  link.innerHTML = TRANSCRIPT_ICON;
  container.append(link);
}
