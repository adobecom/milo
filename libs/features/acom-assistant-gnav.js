import { getMetadata, isAcomAssistantEnabled } from '../utils/utils.js';

let authoredCards;
let noGnavMobile = false;

function logInitializationError(error) {
  window.lana?.log?.(`AcomAssistant: failed to initialize GNav (${error.message})`, {
    tags: 'acom-assistant',
    severity: 'error',
  });
}

export async function loadAcomAssistantGnav() {
  if (!isAcomAssistantEnabled()
    || !document.querySelector('.feds-bc-wrapper #acomAssistant-gnav-mount')) return;

  const bootstrapPath = getMetadata('foundation') === 'c2'
    || getMetadata('gnav-foundation') === 'c2'
    ? '../c2/blocks/brand-concierge/acom-assistant-bootstrap.js'
    : '../blocks/brand-concierge/acom-assistant-bootstrap.js';
  const { ensureAcomAssistant } = await import(bootstrapPath);
  await ensureAcomAssistant(authoredCards);
}

export const getAuthoredGnavCards = () => authoredCards;

/** Per the wiki, the client discovers this mount point and builds its own GNav
 *  icon/expanded-input/minimized states into it.
 *  https://wiki.corp.adobe.com/spaces/Infinity/pages/4028260009/BC+Milo+Integration */
export function decorateAcomAssistantGnav(el, cards, block) {
  if (!isAcomAssistantEnabled()) return null;
  if (cards) authoredCards = cards;
  if (block !== undefined) noGnavMobile = !!block?.classList.contains('no-gnav-mobile');
  if (noGnavMobile && !window.matchMedia('(min-width: 900px)').matches) return null;
  const wrapper = el.querySelector('.feds-bc-wrapper');
  if (!wrapper) return null;
  let mount = wrapper.querySelector('#acomAssistant-gnav-mount');
  if (!mount) {
    mount = document.createElement('div');
    mount.id = 'acomAssistant-gnav-mount';
    wrapper.append(mount);
    loadAcomAssistantGnav().catch(logInitializationError);
  }
  return mount;
}

export function decorateNavWithAssistant(cards, topNav, block) {
  if (!decorateAcomAssistantGnav(topNav, cards, block)) return;
  window.milo ||= {};
  window.milo.brandConcierge = { brandConciergeGlobal: true };
}

/** Federal can supply authored prompts before its navigation has been mounted. */
export function decorateAcomAssistantGnavBlock(block) {
  if (!isAcomAssistantEnabled()) return false;
  const [cards] = block.children;
  if (cards) authoredCards = cards;
  noGnavMobile = block.classList.contains('no-gnav-mobile');
  block.replaceChildren();

  const topNav = document.querySelector('header.global-navigation nav');
  if (topNav) {
    decorateNavWithAssistant(cards, topNav);
  } else {
    const navCheck = setInterval(() => {
      const nav = document.querySelector('header.global-navigation nav');
      if (!nav) return;
      clearInterval(navCheck);
      decorateNavWithAssistant(cards, nav);
    }, 100);
  }
  return true;
}
