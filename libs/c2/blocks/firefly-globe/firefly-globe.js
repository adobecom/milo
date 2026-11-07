import { getConfig } from '../../../utils/utils.js';
import {
  parseAuthoredContent, renderModalContent, fetchFireflyAssets, buildGlobeDom,
  fireflyRenditionUrl,
} from './src/authoring.js';
import { initGlobeBlock } from '../../../utils/globe/runtime.js';
import * as timeline from './src/timeline.js';

const BREAKPOINTS = {
  sm: {
    minWidth: 0,
    SPHERE_R: 16,
    CARD_H_SPHERE: 11.0,
    CAM_Z_ENTRY: 100,
    CAM_Z_SPHERE: 70,
    CAM_Z_END: -18,
    NEAR_FADE_START: 2.0,
    NEAR_FADE_END: 1.5,
    CARD_FACE_CAMERA: 0,
    CARD_ROLL_JITTER: 0.18,
    CYL_COLS_FIT: 0.65,
    DRAG_GEARING: 0.53, // fraction of 1:1 surface tracking
  },
  md: {
    minWidth: 768,
    SPHERE_R: 35,
    CARD_H_SPHERE: 10,
    CAM_Z_ENTRY: 140,
    CAM_Z_SPHERE: 80,
    CAM_Z_END: -30,
    NEAR_FADE_START: 2.0,
    NEAR_FADE_END: 1.6,
    CARD_FACE_CAMERA: 0, // 0 = radially outward (true sphere)
    CARD_ROLL_JITTER: 0.5, // per-card random roll: ±half this, in radians
    DRAG_GEARING: 0.6, // fraction of 1:1 surface tracking
  },
};

const ROLL_SEED = 'One day I will return to your side';

const CSS_ENTRY_LIFT = !!window.CSS?.supports?.('animation-timeline: view()');
const ENTRY_LIFT_H = 0.45;

function createHooks(ctx) {
  return {
    entryCamZ: () => ctx.bp.CAM_Z_ENTRY,
    viewOffsetY({ sphereFormT }) {
      const release = CSS_ENTRY_LIFT || sphereFormT >= 1 ? 0 : 1 - sphereFormT ** 2;
      return ctx.navH / 2 - ENTRY_LIFT_H * ctx.H * release;
    },
    browseScrollTop: () => Math.ceil(ctx.blockDocTop),
  };
}

const SPEC = {
  name: 'firefly-globe',
  breakpoints: BREAKPOINTS,
  rollSeed: ROLL_SEED,
  timeline,
  bpExtras: (cfg) => ({ CAM_Z_ENTRY: cfg.CAM_Z_ENTRY }),
  pullQuote: {},
  modal: {
    hoistToBody: true,
    tracksCanvasTop: true,
    renderContent: (el, meta) => renderModalContent(el, meta, new URL('./icons/', import.meta.url).href),
  },
  cardImageUrl: (meta, cap) => fireflyRenditionUrl(meta, cap, 'height'),
  modalImageUrl(meta, cap) {
    const axis = (meta.maxHeight || 0) > (meta.maxWidth || 0) ? 'height' : 'width';
    return fireflyRenditionUrl(meta, cap, axis);
  },
  createHooks,
  // Before buildGlobeDom() wipes the children.
  setup(el) {
    const {
      hintText, touchHint, instructions, labels,
      categoryId, machineTag, cgenId, ctaLabel, pullQuote,
    } = parseAuthoredContent(el);
    const gid = buildGlobeDom(el, labels, { touchHint, ctaLabel, pullQuote });
    return {
      hintText,
      instructions,
      labels,
      gid,
      async loadCards() {
        if (!categoryId) {
          window.lana?.log?.('firefly-globe: no categoryId authored', { tags: 'firefly-globe', severity: 'warn' });
          return null;
        }
        const authored = await fetchFireflyAssets(categoryId, getConfig().locale?.ietf, machineTag);
        if (cgenId && authored) {
          authored.forEach((card) => {
            if (card.fireflyUrl) card.fireflyUrl += `&promoid=${cgenId}&mv=other`;
          });
        }
        return authored;
      },
    };
  },
};

export default function init(el) {
  return initGlobeBlock(el, SPEC);
}
