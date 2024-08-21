import { html, signal, useEffect } from '../../../deps/htm-preact.js';

const DEF_ICON = 'purple';
const DEF_DESC = 'Checking...';
const pass = 'green';
const fail = 'red';

const imagesSizeResult = signal({ icon: DEF_ICON, title: 'Images size', description: DEF_DESC });
const fragmentsWithinMarqueeResult = signal({ icon: DEF_ICON, title: 'Fragments', description: DEF_DESC });
const placeholdersResult = signal({ icon: DEF_ICON, title: 'Placeholders', description: DEF_DESC });
const personalizationResult = signal({ icon: DEF_ICON, title: 'Personalization', description: DEF_DESC });
const lcpInFirstSectionResult = signal({ icon: DEF_ICON, title: 'LCP', description: DEF_DESC });
const videosWithoutPosterResult = signal({ icon: DEF_ICON, title: 'Videos', description: DEF_DESC });
const modalsResult = signal({ icon: DEF_ICON, title: 'Modals', description: DEF_DESC });

let lcp = null;
function observeLCP() {
  const lcpObserver = new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    const lastEntry = entries[entries.length - 1];
    lcp = lastEntry;
  });
  lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
}

async function checkMarqueeImageSize() {
  const result = { ...imagesSizeResult.value };
  const images = document.querySelectorAll('.marquee img');
  const foundImages = await Promise.all(
    Array.from(images).map(async (img) => {
      const { src } = img;
      const resp = await fetch(src);
      const blob = await resp.blob();
      const size = blob.size / 1000;
      if (size > 100) return { src: img.src, size };
      return null;
    }).filter((i) => i),
  );
  if (foundImages.length > 0) {
    result.description = 'Only images up to 100KB within the marquee.';
    result.icon = fail;
  } else {
    result.description = 'Marquee images are less than 100KB.';
    result.icon = pass;
  }

  imagesSizeResult.value = result;
  return result.icon;
}

async function checkFragmentsWithinMarquee() {
  const result = { ...fragmentsWithinMarqueeResult.value };
  const plainHtml = await fetch(`${window.location.href}.plain.html`);
  const html1 = await plainHtml.text();
  const doc = new DOMParser().parseFromString(html1, 'text/html');
  const marquees = doc.querySelectorAll('.marquee a[href*="/fragments"]');

  if (marquees.length > 0) {
    result.description = 'Fragments found within the marquee.';
    result.icon = fail;
  } else {
    result.description = 'No fragments within the marquee.';
    result.icon = pass;
  }
  fragmentsWithinMarqueeResult.value = result;
}

async function checkPlaceholders() {
  const result = { ...placeholdersResult.value };
  const plainHtml = await fetch(`${window.location.href}.plain.html`);
  const html2 = await plainHtml.text();
  const doc = new DOMParser().parseFromString(html2, 'text/html');
  const regex = /{{(.*?)}}|%7B%7B(.*?)%7D%7D/g;
  const placeholders = Array.from(doc.querySelectorAll('p')).filter((p) => regex.test(p.textContent));

  if (placeholders.length > 0) {
    result.description = 'Placeholders found within the marquee.';
    result.icon = fail;
  } else {
    result.description = 'No placeholders found within the marquee.';
    result.icon = pass;
  }
  placeholdersResult.value = result;
}

function checkForPersonalization() {
  const result = { ...personalizationResult.value };
  const hasPersonalization = Array.from(document.querySelectorAll('meta')).find((meta) => meta.name === 'personalization');
  if (hasPersonalization) {
    result.description = 'Personalization is used.';
    result.icon = fail;
  } else {
    result.description = 'Personalization is not used.';
    result.icon = pass;
  }
  personalizationResult.value = result;
}

function checkLCPInFirstSection() {
  const result = { ...lcpInFirstSectionResult.value };
  const hasLcpInFirstSection = document.querySelector('.section')?.contains(lcp.element);
  if (!hasLcpInFirstSection) {
    result.description = 'LCP element is not within the first section.';
    result.icon = pass;
  } else {
    result.description = 'LCP element is within the first section.';
    result.icon = fail;
  }
  lcpInFirstSectionResult.value = result;
}

function checkVideosWithoutPosterAttribute() {
  const result = { ...videosWithoutPosterResult.value };
  const videos = document.querySelectorAll('.marquee video');
  const videosWithoutPoster = Array.from(videos).filter((video) => !video.poster);
  if (videosWithoutPoster.length > 0) {
    result.description = 'Videos without poster attribute found.';
    result.icon = fail;
  } else {
    result.description = 'All videos have a poster attribute.';
    result.icon = pass;
  }
  videosWithoutPosterResult.value = result;
}

function checkForModals() {
  const result = { ...modalsResult.value };
  const hasModals = document.querySelector('.dialog-modal');
  if (hasModals) {
    result.description = 'Modals found.';
    result.icon = fail;
  } else {
    result.description = 'No modals found.';
    result.icon = pass;
  }
  modalsResult.value = result;
}

export async function sendResults() {
  const robots = document.querySelector('meta[name="robots"]').content || 'all';

  const data = {
    dateTime: new Date().toLocaleString(),
    url: window.location.href,
    imagesSize: imagesSizeResult.value.description,
    https: window.location.protocol === 'https:' ? 'HTTPS' : 'HTTP',
    robots,
  };

  await fetch(
    'https://main--milo--adobecom.hlx.page/seo/preflight',
    {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify({ data }),
    },
  );
}

function PerformanceItem({ icon, title, description }) {
  return html`
    <div class=seo-item>
      <div class="result-icon ${icon}"></div>
      <div class=seo-item-text>
        <p class=seo-item-title>${title}</p>
        <p class=seo-item-description>${description}</p>
      </div>
    </div>`;
}

async function getResults() {
  observeLCP();
  const imagesSize = await checkMarqueeImageSize();
  const fragments = await checkFragmentsWithinMarquee();
  const placeholders = await checkPlaceholders();
  const personalization = checkForPersonalization();
  const firstSectionLCP = checkLCPInFirstSection();
  const videosPosterAttr = checkVideosWithoutPosterAttribute();
  const modals = checkForModals();

  const icons = [
    imagesSize,
    fragments,
    placeholders,
    personalization,
    firstSectionLCP,
    videosPosterAttr,
    modals,
  ];

  const red = icons.find((icon) => icon === 'red');
  if (red) {
    const sk = document.querySelector('helix-sidekick');
    if (sk) {
      const publishBtn = sk.shadowRoot.querySelector('div.publish.plugin button');
      publishBtn.addEventListener('click', () => {
        sendResults();
      });
    }
  }
}

export default function Panel() {
  useEffect(() => { getResults(); }, []);
  return html`
    <div class=seo-columns>
  <div class=seo-column>
    <${PerformanceItem} icon=${imagesSizeResult.value.icon} title=${imagesSizeResult.value.title} description=${imagesSizeResult.value.description} />
    <${PerformanceItem} icon=${fragmentsWithinMarqueeResult.value.icon} title=${fragmentsWithinMarqueeResult.value.title} description=${fragmentsWithinMarqueeResult.value.description} />
    <${PerformanceItem} icon=${placeholdersResult.value.icon} title=${placeholdersResult.value.title} description=${placeholdersResult.value.description} />
    <${PerformanceItem} icon=${personalizationResult.value.icon} title=${personalizationResult.value.title} description=${personalizationResult.value.description} />
    </div>
    <div class=seo-column>
    <${PerformanceItem} icon=${lcpInFirstSectionResult.value.icon} title=${lcpInFirstSectionResult.value.title} description=${lcpInFirstSectionResult.value.description} />
    <${PerformanceItem} icon=${videosWithoutPosterResult.value.icon} title=${videosWithoutPosterResult.value.title} description=${videosWithoutPosterResult.value.description} />
    <${PerformanceItem} icon=${modalsResult.value.icon} title=${modalsResult.value.title} description=${modalsResult.value.description} />
  </div>
</div>`;
}
