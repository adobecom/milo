import { decorateButtons } from '../../utils/decorate.js';

/** Each direct child of el is a slide (row); each row has children[0]=text, children[1]=video */
function getSlides(blockEl) {
  const slides = [];
  const rows = [...blockEl.children];
  rows.forEach((row) => {
    if (row.children.length >= 2) {
      slides.push({
        textEl: row.children[0],
        videoWrap: row.children[1],
        video: row.children[1]?.querySelector?.('video'),
      });
    }
  });
  return slides;
}

function createTimeline(slideCount) {
  const wrap = document.createElement('div');
  wrap.className = 'overlay-section-timeline';
  const track = document.createElement('div');
  track.className = 'overlay-section-timeline-track';
  for (let i = 0; i < slideCount; i += 1) {
    const segment = document.createElement('div');
    segment.className = 'overlay-section-timeline-segment';
    segment.dataset.slideIndex = String(i);
    segment.setAttribute('role', 'button');
    segment.setAttribute('aria-label', `Go to video ${i + 1} of ${slideCount}`);
    segment.innerHTML = `
      <span class="overlay-section-timeline-segment-bg"></span>
      <span class="overlay-section-timeline-segment-fill" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></span>
    `;
    track.appendChild(segment);
  }
  wrap.appendChild(track);
  return wrap;
}

function setSegmentProgress(segmentEl, percent, isActive) {
  const fill = segmentEl?.querySelector('.overlay-section-timeline-segment-fill');
  if (!fill) return;
  const p = Math.min(100, Math.max(0, percent));
  fill.style.width = `${p}%`;
  fill.setAttribute('aria-valuenow', Math.round(p));
  segmentEl.classList.toggle('overlay-section-timeline-segment--active', isActive);
  segmentEl.classList.toggle('overlay-section-timeline-segment--completed', !isActive && p >= 100);
}

function bindTimelineToSlides(timelineEl, slides, onSlideChange) {
  const track = timelineEl.querySelector('.overlay-section-timeline-track');
  const segments = timelineEl.querySelectorAll('.overlay-section-timeline-segment');
  let currentIndex = 0;

  const updateTimelineFromIndex = () => {
    segments.forEach((seg, i) => {
      const video = slides[i]?.video;
      const isActive = i === currentIndex;
      let percent = 0;
      if (isActive && video && Number.isFinite(video.duration) && video.duration > 0) {
        percent = (video.currentTime / video.duration) * 100;
      } else if (i < currentIndex) {
        percent = 100;
      }
      setSegmentProgress(seg, percent, isActive);
    });
  };

  function setActiveSlide(index) {
    if (index === currentIndex) return;
    const prev = slides[currentIndex];
    const next = slides[index];
    if (prev?.video) {
      prev.video.pause();
    }
    prev?.textEl?.classList.remove('overlay-section-slide-active');
    prev?.videoWrap?.classList.remove('overlay-section-slide-active');
    next?.textEl?.classList.add('overlay-section-slide-active');
    next?.videoWrap?.classList.add('overlay-section-slide-active');
    currentIndex = index;
    if (next?.video) {
      next.video.currentTime = 0;
      next.video.play().catch(() => {});
    }
    updateTimelineFromIndex();
    onSlideChange?.(index);
  }

  function goToNext() {
    if (currentIndex + 1 < slides.length) {
      setActiveSlide(currentIndex + 1);
    }
  }

  slides.forEach(({ video }, i) => {
    if (!video) return;
    video.addEventListener('ended', () => {
      if (i !== currentIndex) return;
      goToNext();
    });
    video.addEventListener('timeupdate', updateTimelineFromIndex);
    video.addEventListener('loadedmetadata', updateTimelineFromIndex);
    video.addEventListener('progress', updateTimelineFromIndex);
  });

  updateTimelineFromIndex();

  track.addEventListener('click', (e) => {
    const segment = e.target.closest('.overlay-section-timeline-segment');
    if (!segment) return;
    const index = parseInt(segment.dataset.slideIndex, 10);
    if (Number.isFinite(index) && index >= 0 && index < slides.length) {
      setActiveSlide(index);
    }
  });

  return {
    setActiveSlide,
    updateProgress: updateTimelineFromIndex,
  };
}

const PARALLAX_OFFSET_PX = -300;

function initParallax(blockEl) {
  const inner = document.createElement('div');
  inner.className = 'overlay-section-parallax-inner';
  while (blockEl.firstChild) {
    inner.appendChild(blockEl.firstChild);
  }
  blockEl.appendChild(inner);

  let rafId = null;
  let lastOffset = -1;

  function update() {
    const rect = blockEl.getBoundingClientRect();
    const viewportH = window.innerHeight;
    const progress = Math.min(1, Math.max(0, (viewportH - rect.top) / viewportH));
    const offset = Math.round(PARALLAX_OFFSET_PX * (1 - progress));
    if (offset !== lastOffset) {
      lastOffset = offset;
      inner.style.transform = `translate3d(0, ${offset}px, 0)`;
    }
    rafId = null;
  }

  function onScroll() {
    if (rafId != null) return;
    rafId = requestAnimationFrame(update);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();
  requestAnimationFrame(update);
}

export default function init(el) {
  const slides = getSlides(el);
  if (slides.length === 0) return;

  initParallax(el);

  slides.forEach((slide, i) => {
    const row = slide.textEl.parentElement;
    if (row) row.classList.add('overlay-section-row');
    slide.textEl.classList.add('overlay-section-text');
    slide.videoWrap.classList.add('overlay-section-video');
    if (slide.video) {
      slide.video.removeAttribute('loop');
    }
    if (i > 0) {
      slide.textEl.classList.remove('overlay-section-slide-active');
      slide.videoWrap.classList.remove('overlay-section-slide-active');
    } else {
      slide.textEl.classList.add('overlay-section-slide-active');
      slide.videoWrap.classList.add('overlay-section-slide-active');
    }
    decorateButtons(slide.textEl);
  });

  const section = el.closest('.section');
  const sectionBefore = section?.previousElementSibling;
  const sectionAfter = section?.nextElementSibling;
  sectionBefore?.classList.add('bottom-radius');
  sectionAfter?.classList.add('top-radius');

  const timeline = createTimeline(slides.length);
  const parallaxInner = el.querySelector('.overlay-section-parallax-inner');
  (parallaxInner || el).appendChild(timeline);
  const { updateProgress } = bindTimelineToSlides(timeline, slides);

  if (slides[0]?.video) {
    slides[0].video.play().catch(() => {});
    updateProgress();
  }
}
