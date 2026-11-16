/* eslint-disable no-restricted-globals */
/*
 * POC: avoid CLS from the gnav promo bar (.feds-promo-aside-wrapper > .feds-promo-bar).
 * Loaded from loadArea() in utils.js only when ?promo-poc=<name> is present.
 * Usage: <page>?milolibs=<branch|local>&promo-poc=off|fade|drop|spring|wipe|blink|pop|flip|shimmer
 *
 * Why the page shifts today (gnav bundle: federal/libs/global-navigation/dist/main.js):
 *  - promo bar is revealed late (after MEP + fragment + mas-field), then
 *  - `--feds-promo-bar-height` follows a ResizeObserver while a 0.5s max-height animation runs,
 *  - `body:has(.feds-promo-bar) { padding-top: var(--feds-promo-bar-height) }` pushes the page.
 *
 * The variants take over body padding-top (reserve up front, or never) and replace the
 * reveal animation with compositor-only ones (opacity / transform).
 */
(() => {
  const VARIANTS = {
    off: 'Baseline (untouched)',
    fade: 'Reserve space + fade in',
    drop: 'Reserve space + drop down with overshoot',
    spring: 'Reserve space + springy slide in from right + CTA pulse',
    wipe: 'Reserve space + curtain wipe down',
    blink: 'Reserve space + neon-sign blink in',
    pop: 'Reserve space + scale pop with spring',
    flip: 'Reserve space + flap flip down from top edge',
    shimmer: 'Reserve space + fade in + light sweep',
  };
  const param = new URLSearchParams(location.search).get('promo-poc') || 'off';
  const variant = VARIANTS[param] ? param : 'off';
  const SPRING = 'linear(0, 0.345, 0.655, 0.884, 1.025, 1.093, 1.108, 1.095, 1.068, 1.041, 1.019, 1.003, 0.995, 0.992, 0.992, 0.993, 0.996, 0.998, 0.999, 1, 1.001, 1.001, 1.001, 1, 1)';
  const RESERVE_FALLBACK_MS = 12000;

  // Reserved heights measured on /products/firefly: 72px >=1024px wide, 178px below (stacked).
  const css = `
:root {
  --poc-promo-h: 72px;
  --poc-spring: ${SPRING};
  --poc-ease-out: cubic-bezier(.22, 1, .36, 1);
}
@media (width < 1024px) { :root { --poc-promo-h: 178px; } }

/* Take over what the gnav does to the page, so nothing is pushed when the bar appears. */
html.poc-reserve body,
html.poc-reserve body:has(.feds-promo-aside-wrapper .feds-promo-bar) {
  padding-top: var(--poc-promo-h) !important;
}
html.poc-released body { padding-top: 0 !important; }

/* Keep the reveal-state rounded look from the first paint (the gnav only adds it once the
   promo is revealed). Mirrors the gnav rules, keyed on the reserve class instead. */
html.poc-reserve:not(.poc-released) body:not(:has(header.feds-header-scrolled, .c2-gnav-c1-host)) main {
  border-radius: var(--s2a-border-radius-lg) var(--s2a-border-radius-lg) 0 0;
}
html.poc-reserve:not(.poc-released) body:not(:has(header.feds-header-scrolled, .c2-gnav-c1-host)) main > .section:first-child {
  border-top-left-radius: var(--s2a-border-radius-lg);
  border-top-right-radius: var(--s2a-border-radius-lg);
  background-color: var(--s2a-color-background-default);
  overflow: clip;
  /* overflow+radius alone leaks the parallax video at the corners until a repaint */
  clip-path: inset(0 round var(--s2a-border-radius-lg) var(--s2a-border-radius-lg) 0 0);
}
html.poc-reserve:not(.poc-released) body:not(:has(header.feds-header-scrolled)) header:not(:has(.feds-menu-active:not(.small-menu))),
html.poc-reserve:not(.poc-released) body:not(:has(header.feds-header-scrolled)) .router-marquee {
  border-top-left-radius: var(--s2a-border-radius-lg);
  border-top-right-radius: var(--s2a-border-radius-lg);
}
html.poc-reserve:not(.poc-released) body:not(:has(header.feds-header-scrolled)) main > .section:first-child {
  background-color: var(--s2a-color-background-default);
}

@keyframes poc-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes poc-drop {
  from { opacity: 0; transform: translateY(-100%); }
  to { opacity: 1; transform: none; }
}
@keyframes poc-from-right {
  from { opacity: 0; transform: translateX(110%); }
  to { opacity: 1; transform: none; }
}
@keyframes poc-pulse {
  0%, 100% { transform: scale(1); }
  40% { transform: scale(1.12); }
}
@keyframes poc-wipe {
  from { clip-path: inset(0 0 100% 0); }
  to { clip-path: inset(0 0 -200px 0); }
}
@keyframes poc-blink {
  0%, 12%, 24%, 36% { opacity: 0; }
  6%, 18% { opacity: .85; }
  30% { opacity: .35; }
  42%, 100% { opacity: 1; }
}
@keyframes poc-pop {
  from { opacity: 0; transform: scale(.9); }
  to { opacity: 1; transform: none; }
}
@keyframes poc-flip {
  from { transform: perspective(500px) rotateX(-100deg); }
  to { transform: perspective(500px) rotateX(0); }
}
@keyframes poc-sweep {
  from { transform: translateX(-100%); }
  to { transform: translateX(450%); }
}

@media (prefers-reduced-motion: no-preference) {
  html.poc-fade .feds-promo-aside-wrapper.feds-promo-bar--reveal,
  html.poc-shimmer .feds-promo-aside-wrapper.feds-promo-bar--reveal {
    animation: poc-fade .5s var(--poc-ease-out) both !important;
  }
  html.poc-drop .feds-promo-aside-wrapper.feds-promo-bar--reveal {
    animation: poc-drop .7s var(--poc-spring) both !important;
  }
  html.poc-spring .feds-promo-aside-wrapper.feds-promo-bar--reveal {
    animation: poc-from-right .8s var(--poc-spring) both !important;
  }
  html.poc-spring .feds-promo-aside-wrapper.feds-promo-bar--reveal .feds-promo-bar a:last-of-type {
    animation: poc-pulse .6s ease-in-out .9s 2;
  }
  html.poc-wipe .feds-promo-aside-wrapper.feds-promo-bar--reveal {
    animation: poc-wipe 1s cubic-bezier(.65, 0, .35, 1) backwards !important;
  }
  html.poc-blink .feds-promo-aside-wrapper.feds-promo-bar--reveal {
    animation: poc-blink .9s steps(1, end) both !important;
  }
  html.poc-pop .feds-promo-aside-wrapper.feds-promo-bar--reveal {
    transform-origin: 50% 0;
    animation: poc-pop .7s var(--poc-spring) both !important;
  }
  html.poc-flip .feds-promo-aside-wrapper.feds-promo-bar--reveal {
    transform-origin: 50% 0;
    animation: poc-flip 1.1s cubic-bezier(.2, .9, .3, 1.12) backwards !important;
  }
  html.poc-shimmer .feds-promo-bar { overflow: hidden; isolation: isolate; }
  html.poc-shimmer .feds-promo-bar-inner { position: relative; z-index: 1; }
  html.poc-shimmer .feds-promo-bar::before {
    content: '';
    position: absolute; top: 0; bottom: 0; left: 0; width: 22%;
    pointer-events: none;
    background: linear-gradient(100deg, transparent, rgb(86 120 255 / 28%), transparent);
    transform: translateX(-100%);
    animation: poc-sweep 1.4s cubic-bezier(.4, 0, .2, 1) .6s 1 backwards;
  }
}
@media (prefers-reduced-motion: reduce) {
  html[class*='poc-'] .feds-promo-aside-wrapper.feds-promo-bar--reveal {
    animation: poc-fade .3s linear both !important;
  }
}

/* The gnav reveal keyframes animate max-height; keep it out of the way. */
html[class*='poc-'] .feds-promo-aside-wrapper { max-height: none; overflow: visible; }
`;

  // Init scripts can run before <html> exists.
  const whenRoot = (fn) => {
    if (document.documentElement) { fn(document.documentElement); return; }
    const mo = new MutationObserver(() => {
      if (document.documentElement) { mo.disconnect(); fn(document.documentElement); }
    });
    mo.observe(document, { childList: true });
  };

  whenRoot((root) => {
    const style = document.createElement('style');
    style.id = 'promo-poc-style';
    style.textContent = css;
    root.append(style);
    if (variant !== 'off') {
      root.classList.add(`poc-${variant}`);
      root.classList.add('poc-reserve');
    }
  });

  // Reserve only pays off if the promo really arrives; otherwise give the space back.
  // (Production: decide from an edge/metadata flag so this release never has to shift.)
  if (variant !== 'off') {
    setTimeout(() => {
      if (!document.querySelector('.feds-promo-aside-wrapper .feds-promo-bar')) {
        document.documentElement.classList.add('poc-released');
      }
    }, RESERVE_FALLBACK_MS);
  }
})();
