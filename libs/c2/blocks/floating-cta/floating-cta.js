import { createTag, getFederatedUrl, MILO_EVENTS } from '../../../utils/utils.js';
import { decorateButtons } from '../../../utils/decorate.js';
import icons from '../../assets/icons.js';

const mobileQuery = window.matchMedia('(width < 768px)');

function waitForCheckoutLink(linkPara, timeoutMs = 10000) {
  const existing = linkPara.querySelector('a');
  if (existing?.isCheckoutLink) return Promise.resolve(existing);

  return new Promise((resolve, reject) => {
    let timeoutId;
    const observer = new MutationObserver(() => {
      const link = linkPara.querySelector('a');
      if (link?.isCheckoutLink) {
        clearTimeout(timeoutId);
        observer.disconnect();
        resolve(link);
      }
    });
    observer.observe(linkPara, { childList: true, subtree: true });
    timeoutId = setTimeout(() => {
      observer.disconnect();
      reject(new Error('Timed out waiting for checkout link to upgrade'));
    }, timeoutMs);
  });
}

function decorateCta(container, lockupItems, action) {
  const lockup = createTag('span', { class: 'floating-cta-lockup' }, lockupItems);
  const arrow = createTag('span', { class: 'icon-button', 'aria-hidden': 'true' }, icons.arrowRightWhite);
  const actions = createTag('span', { class: 'floating-cta-actions' }, action || arrow);
  const content = createTag('span', { class: 'floating-cta-content' }, [lockup, actions]);
  container.replaceChildren(content);

  const measure = () => {
    if (mobileQuery.matches) return;
    container.classList.add('measuring');
    const actionOffset = container.clientWidth / 2 - (actions.offsetLeft + actions.offsetWidth / 2);
    container.style.setProperty('--cta-full-width', `${container.offsetWidth}px`);
    container.style.setProperty('--cta-action-offset', `${actionOffset}px`);
    container.style.setProperty('--cta-full-height', `${container.offsetHeight}px`);
    container.classList.remove('measuring');
  };
  requestAnimationFrame(() => measure());
  mobileQuery.addEventListener('change', measure);
}

function moveFloatingSection(el) {
  const section = el.closest('.section');
  if (!section) return;
  const main = document.querySelector('main');
  const hasMerchSection = document.querySelector('merch-card')?.closest('.section');
  if (hasMerchSection) {
    hasMerchSection.before(section);
    return;
  }
  main?.append(section);
}

function revealCta(ctaEl) {
  const revealTrigger = document.querySelector('main > .section');
  const hideTrigger = document.querySelector('merch-card') || document.querySelector('footer');
  if (!revealTrigger && !hideTrigger) return;

  let isPastIntro = false;
  let isAtOutro = false;

  const anchor = ctaEl.tagName === 'A' ? ctaEl : ctaEl.querySelector('a');
  const update = () => {
    if (document.activeElement === anchor) return;
    ctaEl.classList.remove('disable-animation');
    ctaEl.classList.toggle('active', isPastIntro && !isAtOutro);
  };

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.target === revealTrigger) isPastIntro = !entry.isIntersecting;
        else isAtOutro = entry.isIntersecting;
      });
      update();
    },
    { threshold: 0, rootMargin: '-25% 0px 25% 0px' },
  );
  [revealTrigger, hideTrigger].filter(Boolean).forEach((trigger) => {
    revealObserver.observe(trigger);
  });

  anchor?.addEventListener('focus', () => {
    if (!isAtOutro) return;
    ctaEl.classList.add('disable-animation');
  });
  anchor?.addEventListener('blur', update);

  if (hideTrigger?.matches('merch-card')) return;

  const retargetOutro = () => {
    const merchCard = document.querySelector('merch-card');
    if (!merchCard) return;
    if (hideTrigger) revealObserver.unobserve(hideTrigger);
    revealObserver.observe(merchCard);
  };

  document.addEventListener(MILO_EVENTS.DEFERRED, retargetOutro);
  window.milo?.deferredPromise?.then(retargetOutro);
}

export default async function init(el) {
  const contentDiv = el.querySelector('div > div');
  if (!contentDiv) return;

  const [prefixPara, linkPara] = contentDiv.querySelectorAll('p');
  if (!linkPara) return;

  const lockup = [];

  const img = prefixPara?.querySelector('img');
  if (img) {
    const relativeSrc = img.getAttribute('src');
    if (relativeSrc?.startsWith('/')) img.src = getFederatedUrl(relativeSrc);
    lockup.push(img);
  }
  const isNonMneumonic = !img;
  if (isNonMneumonic) {
    decorateButtons(contentDiv);
    el.classList.add('non-mneumonic');
  }

  const linkEl = linkPara.querySelector('a');
  const sourceText = (linkEl ? linkEl.textContent : linkPara.textContent).trim();
  const [linkText, ariaLabel = linkText] = sourceText.split('|').map((s) => s.trim());
  const ctaHref = linkEl?.getAttribute('href') || '#';

  let ctaText = isNonMneumonic ? prefixPara.textContent.trim() : linkText;
  let ctaContainer = !isNonMneumonic
    ? createTag('a', { href: ctaHref, 'aria-label': ariaLabel }) : createTag('div');
  let action = isNonMneumonic && linkEl;

  const isMerchLink = linkEl?.classList.contains('merch') || linkEl?.isCheckoutLink;
  if (isMerchLink) {
    try {
      const checkoutLink = await waitForCheckoutLink(linkPara);
      await checkoutLink.onceSettled();
      ctaText = isNonMneumonic
        ? prefixPara.textContent.trim() : checkoutLink.textContent.trim();
      ctaContainer = !isNonMneumonic ? checkoutLink : createTag('div');
      checkoutLink.classList.toggle('con-button', isNonMneumonic);
      action = isNonMneumonic && checkoutLink;
    } catch (e) {
      window.lana?.log?.(
        `floating-cta: merch link failed: ${e?.message || e}`,
        { tags: 'floating-cta', severity: 'error' },
      );
      el.remove();
      return;
    }
  }

  ctaContainer.classList.add('promo-cta');
  lockup.push(ctaText);
  moveFloatingSection(el);
  decorateCta(ctaContainer, lockup, action);
  revealCta(ctaContainer);
  el.replaceChildren(ctaContainer);
}
