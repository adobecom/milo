import { chromium } from 'playwright';
import { existsSync } from 'node:fs';
const URL = process.argv[2];
const PREFIX = process.argv[3] || '/tmp/claude/clip';
// MWPW-202571 — the browser-selection rule of render-core.mjs's chromiumLaunchOptions,
// INLINED rather than imported, and deliberately so: block-author.js's
// provisionPhase5TaskDir `copyFileSync`s THIS FILE alone into a per-task dir as
// `shot.mjs`, so at run time it has no sibling modules and any relative import would
// throw MODULE_NOT_FOUND on the author's first screenshot. Three lines duplicated beats
// an import that cannot resolve. Keep it in step with chromiumLaunchOptions if that
// changes; tests/forge-chromium-image-launch.test.js pins the two against each other.
const CHROMIUM_PATH = process.env.FORGE_CHROMIUM_PATH;
const EXEC = CHROMIUM_PATH && existsSync(CHROMIUM_PATH) ? { executablePath: CHROMIUM_PATH } : {};
const browser = await chromium.launch({ headless: true, args: ['--disable-http2'], ...EXEC });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const resp = await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
console.log('HTTP', resp.status());
try { await page.waitForLoadState('networkidle', { timeout: 8000 }); } catch {}
await page.waitForTimeout(2500);
await page.evaluate(async () => {
  await new Promise((r) => { let y = 0; const t = setInterval(() => { window.scrollBy(0, 900); y += 900; if (y > document.body.scrollHeight) { clearInterval(t); r(); } }, 100); });
});
await page.waitForTimeout(1500);
const info = await page.evaluate(() => {
  window.scrollTo(0, 0);
  const imgs = [...document.querySelectorAll('img')];
  const broken = imgs.filter((im) => im.complete && im.naturalWidth === 0);
  const text = (document.body.textContent || '').replace(/\s+/g, ' ').trim();
  return {
    bodyH: document.body.scrollHeight, imgsTotal: imgs.length, imgsBroken: broken.length,
    brokenSrcs: broken.map((im) => im.currentSrc || im.src).slice(0, 6),
    hasMerchLeak: /merch-card-collection:/.test(text), hasMetaLeak: /Background\s+rgb\(|style s-spacing/.test(text),
    hasComparePlans: /Compare Plans/.test(text), hasLogoRow: /leading businesses use Adobe Express/.test(text),
  };
});
console.log(JSON.stringify(info, null, 2));
await page.waitForTimeout(300);
const bodyH = info.bodyH;
const step = 880;
let i = 0;
for (let y = 0; y < bodyH; y += step) {
  await page.evaluate((yy) => window.scrollTo(0, yy), y);
  await page.waitForTimeout(220);
  await page.screenshot({ path: `${PREFIX}-${String(i).padStart(2, '0')}.png` });
  i += 1; if (i > 16) break;
}
console.log('clips:', i);
await browser.close();
