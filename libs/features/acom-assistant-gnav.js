import { getMetadata } from '../utils/utils.js';

let delayedStarted = false;
let authoredCards;

function logInitializationError(error) {
  window.lana?.log?.(`AcomAssistant: failed to initialize GNav (${error.message})`, {
    tags: 'acom-assistant',
    severity: 'error',
  });
}

/** Loads the navigation client only after the page's delayed phase has started.
 *  The SDK renders the entry point after initialization. Explicit chat interactions
 *  can initialize the shared client sooner; late navigation reuses that client. */
export async function loadAcomAssistantGnav() {
  delayedStarted = true;
  if (getMetadata('acom-assistant') !== 'on'
    || !document.querySelector('.feds-bc-wrapper #acomAssistant-gnav-mount')) return;

  const bootstrapPath = getMetadata('foundation') === 'c2'
    || getMetadata('gnav-foundation') === 'c2'
    ? '../c2/blocks/brand-concierge/acom-assistant-bootstrap.js'
    : '../blocks/brand-concierge/acom-assistant-bootstrap.js';
  const { ensureAcomAssistant } = await import(bootstrapPath);
  await ensureAcomAssistant(authoredCards);
}

export const getAuthoredGnavCards = () => authoredCards;

export function decorateAcomAssistantGnav(el, cards) {
  if (getMetadata('acom-assistant') !== 'on') return null;
  const wrapper = el.querySelector('.feds-bc-wrapper');
  if (!wrapper) return null;
  if (cards) authoredCards = cards;
  let mount = wrapper.querySelector('#acomAssistant-gnav-mount');
  if (!mount) {
    mount = document.createElement('div');
    mount.id = 'acomAssistant-gnav-mount';
    wrapper.append(mount);
    if (delayedStarted) loadAcomAssistantGnav().catch(logInitializationError);
  }
  return mount;
}

export function decorateNavWithAssistant(cards, topNav) {
  if (!decorateAcomAssistantGnav(topNav, cards)) return;
  window.milo ||= {};
  window.milo.brandConcierge = { brandConciergeGlobal: true };
}

/** Federal can supply authored prompts before its navigation has been mounted. */
export function decorateAcomAssistantGnavBlock(block) {
  if (getMetadata('acom-assistant') !== 'on') return false;
  const [cards] = block.children;
  if (cards) authoredCards = cards;
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
