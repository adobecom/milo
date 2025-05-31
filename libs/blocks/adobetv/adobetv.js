import { decorateAnchorVideo } from '../../utils/decorate.js';
import { getConfig, createTag } from '../../utils/utils.js';

const CaptionMap = {
  ae_ar: 'eng',
  ae_en: 'eng',
  africa: 'eng',
  au: 'eng',
  be_en: 'eng',
  bg: 'eng',
  ca: 'eng',
  cz: 'eng',
  dk: 'eng',
  ee: 'eng',
  gr_en: 'eng',
  hk_en: 'eng',
  hu: 'eng',
  id_en: 'eng',
  id_id: 'eng',
  ie: 'eng',
  il_en: 'eng',
  il_he: 'eng',
  in: 'eng',
  lt: 'eng',
  lu_en: 'eng',
  lv: 'eng',
  mena_ar: 'eng',
  mena_en: 'eng',
  my_en: 'eng',
  my_ms: 'eng',
  no: 'eng',
  nz: 'eng',
  ph_en: 'eng',
  ph_fil: 'eng',
  pl: 'eng',
  ro: 'eng',
  ru: 'eng',
  sa_ar: 'eng',
  sa_en: 'eng',
  sg: 'eng',
  si: 'eng',
  sk: 'eng',
  th_en: 'eng',
  tr: 'eng',
  ua: 'eng',
  uk: 'eng',
  vn_en: 'eng',
  vn_vi: 'eng',
  fi: 'eng',

  be_fr: 'fre_fr',
  ch_fr: 'fre_fr',
  fr: 'fre_fr',
  lu_fr: 'fre_fr',
  ca_fr: 'fre_fr',

  at: 'ger',
  ch_de: 'ger',
  lu_de: 'ger',
  de: 'ger',

  jp: 'jpn',

  it: 'ita',
  ch_it: 'ita',

  es: 'spa',

  br: 'por_br',
  pt: 'por_br',

  th_th: 'tha',

  ar: 'spa_la',
  cl: 'spa_la',
  co: 'spa_la',
  la: 'spa_la',
  mx: 'spa_la',
  pe: 'spa_la',

  nl: 'dut',
  be_nl: 'dut',

  se: 'swe',

  cn: 'chi_hans',

  hk: 'chi_hant',
  tw: 'chi_hant',

  in_hi: 'hin',

  kr: 'kor',
};
export const updateCaptionsParam = (urlStr, geo) => {
  const url = new URL(urlStr);

  if (url.searchParams.has('captions')) {
    const newCaption = CaptionMap[geo];
    if (newCaption) {
      url.searchParams.set('captions', newCaption);
    }
  }

  return url.toString();
};
export default function init(a) {
  const config = getConfig();
  const localePrefix = config?.locale?.prefix || '';
  const geo = localePrefix.replace('/', '') ?? '';
  const captionHref = updateCaptionsParam(a.href, geo);
  a.classList.add('hide-video');
  const bgBlocks = ['aside', 'marquee', 'hero-marquee', 'long-form'];
  if (a.href.includes('.mp4') && bgBlocks.some((b) => a.closest(`.${b}`))) {
    a.classList.add('hide');
    if (!a.parentNode) return;
    decorateAnchorVideo({
      src: captionHref,
      anchorTag: a,
    });
  } else {
    const iframe = createTag('iframe', {
      src: captionHref,
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
