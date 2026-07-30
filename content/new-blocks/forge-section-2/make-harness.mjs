// Offline Phase-5 harness: render forge-section-2's REAL css + init() logic
// (Milo decorate services stubbed as no-ops — they only add extra typography
// classes and don't affect layout) against a colored-placeholder version of the
// fixture, so we can screenshot the reconstructed layout without a dev server.
import { readFileSync, writeFileSync } from 'node:fs';

const css = readFileSync('blocks/forge-section-2/forge-section-2.css', 'utf8');
let js = readFileSync('blocks/forge-section-2/forge-section-2.js', 'utf8');
// Drop the bare-module import; provide local no-op stubs instead.
js = js.replace(/^import\s.*from\s.*decorate\.js';\s*$/m, '');
js = js.replace('export default async function init', 'async function init');
js += '\nconst decorateBlockText = () => {};\nconst decorateViewportContent = (el, fn) => fn(el, el);\n';
js += '\ninit(document.querySelector(".forge-section-2"));\n';

// Solid-colour SVG data-URI so each asset box is visible in the render.
const box = (c) => `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' preserveAspectRatio='none'><rect width='100%' height='100%' fill='${c}'/></svg>`,
)}`;
const pic = (c, w, h, alt) => `<picture><source srcset="${box(c)}"><img width="${w}" height="${h}" src="${box(c)}" alt="${alt}"></picture>`;

const body = `
  <div class="forge-section-2">
    <div><div>
      ${pic('#0a0a0a', 488, 366, 'B_app_AdobeAcrobatPro')}
      ${pic('#f4ead5', 358, 199, 'Screenshot 10')}
      ${pic('#efe0c2', 358, 199, 'Screenshot 9')}
      ${pic('#8a5cff', 18, 18, '')}
      ${pic('#5b3ea8', 18, 18, '')}
      <p>Generate presentation</p>
      ${pic('#3b82f6', 20, 20, '')}
      <p>PDF Spaces</p>
      <p>Work smarter than ever with documents.</p>
      <p>Trusted PDF tools, now with AI for editing, insights, and content creation.</p>
      <p><a href="#a">Explore Acrobat</a></p>
      ${pic('#c8b3a6', 488, 366, 'image')}
      ${pic('#b56b5a', 488, 366, 'B_app_AdobeFirefly')}
      <p>Upscale images instantly with AI.</p>
      <p>Improve resolution, clarity, and sharpness while preserving detail—perfect for photos, designs, and creatives.</p>
      <p><a href="#f">Explore Firefly</a></p>
      ${pic('#b5713e', 488, 366, 'PS_Harmonize')}
      ${pic('#2b6fb0', 18, 18, '')}
      <p>Harmonize</p>
      <p>Blend images seamlessly with Harmonize.</p>
      <p>Combine people and objects into any background instantly.</p>
      <p><a href="#p">Explore Photoshop</a></p>
    </div></div>
  </div>`;

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  html,body{margin:0;background:#fff;font-family:Arial,Helvetica,sans-serif;}
  a{color:#000;}
  ${css}
</style></head><body>${body}
<script type="module">${js}</script>
</body></html>`;

writeFileSync('/tmp/fs2-harness.html', html);
console.log('wrote /tmp/fs2-harness.html');
