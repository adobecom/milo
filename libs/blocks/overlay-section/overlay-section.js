import { decorateButtons } from '../../utils/decorate.js';

/* Segments: dot1 10%, line 60%, dot2 10%, dot3 10%, dot4 10% = 100%. Loading inside each. */
const SEGMENT_DOT1 = 10;
const SEGMENT_LINE = 60;

function createTimeline() {
  const wrap = document.createElement('div');
  wrap.className = 'overlay-section-timeline';
  wrap.innerHTML = `
    <div class="overlay-section-timeline-track">
      <div class="overlay-section-timeline-dot overlay-section-timeline-dot--start">
        <span class="overlay-section-timeline-dot-fill"></span>
      </div>
      <div class="overlay-section-timeline-line">
        <span class="overlay-section-timeline-line-remaining"></span>
        <span class="overlay-section-timeline-line-played" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></span>
      </div>
      <div class="overlay-section-timeline-dot">
        <span class="overlay-section-timeline-dot-fill"></span>
      </div>
      <div class="overlay-section-timeline-dot">
        <span class="overlay-section-timeline-dot-fill"></span>
      </div>
      <div class="overlay-section-timeline-dot">
        <span class="overlay-section-timeline-dot-fill"></span>
      </div>
    </div>
  `;
  return wrap;
}

function bindTimelineToVideo(timelineEl, video) {
  if (!video) return;
  const track = timelineEl.querySelector('.overlay-section-timeline-track');

  function segmentFill(p, start, end) {
    if (p <= start) return 0;
    if (p >= end) return 100;
    return ((p - start) / (end - start)) * 100;
  }

  function setProgress(percent) {
    const p = Math.min(100, Math.max(0, percent));
    const fills = timelineEl.querySelectorAll('.overlay-section-timeline-dot-fill');
    const linePlayedEl = timelineEl.querySelector('.overlay-section-timeline-line-played');

    const dot1Pct = p <= SEGMENT_DOT1 ? (p / SEGMENT_DOT1) * 100 : 100;
    const linePct = segmentFill(p, SEGMENT_DOT1, SEGMENT_DOT1 + SEGMENT_LINE);
    const dot2Pct = segmentFill(p, 70, 80);
    const dot3Pct = segmentFill(p, 80, 90);
    const dot4Pct = segmentFill(p, 90, 100);

    if (fills[0]) fills[0].style.width = `${dot1Pct}%`;
    if (linePlayedEl) linePlayedEl.style.width = `${linePct}%`;
    if (fills[1]) fills[1].style.width = `${dot2Pct}%`;
    if (fills[2]) fills[2].style.width = `${dot3Pct}%`;
    if (fills[3]) fills[3].style.width = `${dot4Pct}%`;

    linePlayedEl?.setAttribute('aria-valuenow', Math.round(p));
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
