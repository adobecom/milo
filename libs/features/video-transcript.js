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
  const playPause = container.querySelector('.play-pause-button');
  if (playPause) container.insertBefore(link, playPause);
  else container.append(link);
}
