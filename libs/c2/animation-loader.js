import { buildCssRule } from './tools/page-animator/controls.js';

export default async function loadAnimations() {
  const jsonPath = `${window.location.pathname}.animations.json`;

  let res;
  try {
    res = await fetch(jsonPath, { method: 'HEAD' });
  } catch {
    return;
  }
  if (!res.ok) return;

  let json;
  try {
    const full = await fetch(jsonPath);
    json = await full.json();
  } catch {
    return;
  }

  if (!json?.animations?.length) return;

  const style = document.createElement('style');
  style.id = 'page-animations';
  const rules = [];

  json.animations.forEach(({ id, selector, properties }) => {
    const el = document.querySelector(selector);
    if (!el) return;
    el.dataset.animId = id;
    rules.push(buildCssRule(id, properties));
  });

  if (!rules.length) return;

  style.textContent = rules.join('\n');
  document.head.appendChild(style);
}
