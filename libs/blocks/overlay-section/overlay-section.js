import { decorateButtons } from '../../utils/decorate.js';

const CHAPTER_DOTS = 3;

function createTimeline() {
  const wrap = document.createElement('div');
  wrap.className = 'overlay-section-timeline';
  wrap.innerHTML = `
    <div class="overlay-section-timeline-track">
      <div class="overlay-section-timeline-played" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
      <span class="overlay-section-timeline-dot overlay-section-timeline-dot--start"></span>
      <div class="overlay-section-timeline-line"></div>
      <div class="overlay-section-timeline-dots">
        ${Array.from({ length: CHAPTER_DOTS }, () => '<span></span>').join('')}
      </div>
    </div>
  `;
  return wrap;
}

function bindTimelineToVideo(timelineEl, video) {
  if (!video) return;
  const played = timelineEl.querySelector('.overlay-section-timeline-played');
  const track = timelineEl.querySelector('.overlay-section-timeline-track');

  function setProgress(percent) {
    const p = Math.min(100, Math.max(0, percent));
    played.style.width = `${p}%`;
    played.setAttribute('aria-valuenow', Math.round(p));
  }

  function updateFromVideo() {
    if (Number.isFinite(video.duration) && video.duration > 0) {
      setProgress((video.currentTime / video.duration) * 100);
    }
  }

  video.addEventListener('timeupdate', updateFromVideo);
  video.addEventListener('loadedmetadata', updateFromVideo);
  video.addEventListener('progress', updateFromVideo);

  track.addEventListener('click', (e) => {
    const rect = track.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.min(100, Math.max(0, (x / rect.width) * 100));
    if (Number.isFinite(video.duration)) {
      video.currentTime = (percent / 100) * video.duration;
      setProgress(percent);
    }
  });
}

export default function init(el) {
  decorateButtons(el.children[0].children[0]);
  el.children[0].children[0].classList.add('overlay-section-text');
  el.children[0].children[1].classList.add('overlay-section-video');
  const section = el.closest('.section');
  const sectionBefore = section?.previousElementSibling;
  const sectionAfter = section?.nextElementSibling;
  sectionBefore?.classList.add('bottom-radius');
  sectionAfter?.classList.add('top-radius');

  const videoWrap = el.querySelector('.overlay-section-video');
  const video = el.querySelector('.overlay-section-video video');
  if (videoWrap && video) {
    const timeline = createTimeline();
    videoWrap.appendChild(timeline);
    bindTimelineToVideo(timeline, video);
  }
}
