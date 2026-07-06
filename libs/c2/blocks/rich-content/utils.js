const HERO_GRADIENT_PROP = '--rc-hero-gradient';

function isCssGradient(value) {
  return /^(repeating-)?(linear|radial|conic)-gradient\(.+\)$/i.test(value?.trim());
}

function parseHeroGradient(rows) {
  const contentRow = rows[0];
  const bgCell = contentRow?.children?.[1];
  if (!bgCell || bgCell.querySelector('picture, img')) return undefined;

  const value = bgCell.textContent.trim();
  if (!isCssGradient(value)) return undefined;

  bgCell.remove();
  return value;
}

function applyHeroGradient(gradient, el) {
  if (!gradient) return;
  const section = el.closest('.section');
  if (!section) return;
  section.style.setProperty(HERO_GRADIENT_PROP, gradient);
}

function inheritHeroGradient(content, vpKeys, activeIndex, fallback) {
  for (let i = activeIndex; i >= 0; i -= 1) {
    const gradient = content[vpKeys[i]]?.metadata;
    if (gradient) return gradient;
  }
  return fallback;
}

export function createHeroGradientHooks(...variants) {
  return {
    shouldParse: (el) => variants.some((variant) => el.classList.contains(variant)),
    parseRows: parseHeroGradient,
    apply: applyHeroGradient,
    inherit: inheritHeroGradient,
  };
}

export const heroGradientHooks = createHeroGradientHooks('hero');
