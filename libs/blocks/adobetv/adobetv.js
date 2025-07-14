import { decorateAnchorVideo } from '../../utils/decorate.js';
import { getConfig, createTag } from '../../utils/utils.js';

const CaptionsLangMap = {
  eng: [
    'ae_ar', 'ae_en', 'africa', 'au', 'be_en', 'bg', 'ca', 'cz', 'dk', 'ee', 'gr_en',
    'hk_en', 'hu', 'id_en', 'id_id', 'ie', 'il_en', 'il_he', 'in', 'lt', 'lu_en',
    'lv', 'mena_ar', 'mena_en', 'my_en', 'my_ms', 'no', 'nz', 'ph_en', 'ph_fil',
    'pl', 'ro', 'ru', 'sa_ar', 'sa_en', 'sg', 'si', 'sk', 'th_en', 'tr', 'ua', 'uk',
    'vn_en', 'vn_vi', 'fi',
  ],
  fre_fr: ['be_fr', 'ch_fr', 'fr', 'lu_fr', 'ca_fr'],
  ger: ['at', 'ch_de', 'lu_de', 'de'],
  jpn: ['jp'],
  ita: ['it', 'ch_it'],
  spa: ['es'],
  'por_br,por_pt': ['br', 'pt'],
  tha: ['th_th'],
  spa_la: ['ar', 'cl', 'co', 'la', 'mx', 'pe'],
  dut: ['nl', 'be_nl'],
  swe: ['se'],
  chi_hans: ['cn'],
  chi_hant: ['hk_zh', 'tw'],
  hin: ['in_hi'],
  kor: ['kr'],
};

export const updateCaptionsLang = (videoUrl, geo) => {
  const url = new URL(videoUrl);

  if (url.searchParams.has('captions')) {
    for (const [langCode, geos] of Object.entries(CaptionsLangMap)) {
      if (geos.includes(geo)) {
        const captionParam = langCode === 'eng' ? langCode : `${langCode},eng`;
        url.searchParams.set('captions', captionParam);
        break;
      }
    }
  }

  return url.toString();
};

export default function init(a) {
  const geo = (getConfig()?.locale?.prefix || '').replace('/', '');
  const videoHref = updateCaptionsLang(a.href, geo);
  a.classList.add('hide-video');
  const bgBlocks = ['aside', 'marquee', 'hero-marquee', 'long-form'];
  if (a.href.includes('.mp4') && bgBlocks.some((b) => a.closest(`.${b}`))) {
    a.classList.add('hide');
    if (!a.parentNode) return;
    decorateAnchorVideo({
      src: videoHref,
      anchorTag: a,
    });
  } else {
    const iframe = createTag('iframe', {
      src: videoHref,
      class: 'adobetv',
      scrolling: 'no',
      allow: 'encrypted-media; fullscreen',
      title: 'Adobe Video Publishing Cloud Player',
      loading: 'lazy',
    });
    const embed = createTag('div', { class: 'milo-video' }, iframe);
    a.insertAdjacentElement('afterend', embed);

    const idMatch = a.href.match(/\/v\/(\d+)/);
    const videoId = idMatch ? idMatch[1] : null;

    if (videoId) {
      window.fetch(`https://video.tv.adobe.com/v/${videoId}?format=json-ld`)
        .then((res) => res.json())
        .then(async (info) => {
          const { setDialogAndElementAttributes } = await import('../../scripts/accessibility.js');
          setDialogAndElementAttributes({ element: iframe, title: `${info?.jsonLinkedData?.name}` });
        });
    }

    window.addEventListener('message', (event) => {
      if (event.origin !== 'https://video.tv.adobe.com' || !event.data) return;
      const { state, id } = event.data;
      if (!['play', 'pause'].includes(state)
        || !Number.isInteger(id)
        || !iframe.src.startsWith(`${event.origin}/v/${id}`)) return;

      iframe.setAttribute('data-playing', state === 'play');
    });

    const io = new IntersectionObserver((entries) => {
      entries.forEach(({ isIntersecting, target }) => {
        if (!isIntersecting && target.getAttribute('data-playing') === 'true') {
          target.contentWindow?.postMessage({ type: 'mpcAction', action: 'pause' }, target.src);
        }
      });
    }, { rootMargin: '0px' });
    io.observe(iframe);

    a.remove();
  }
}
