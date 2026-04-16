/**
 * Verify foreground animation works after lazy-init fix.
 * Run: node test-garage-door.js
 */

const { firefox } = require('@playwright/test');

const PAGE_URL = 'https://load-c2-styles--upp--adobecom.aem.live/homepage/drafts/ramuntea/redesign-demo?milolibs=local';
const MOBILE = { width: 390, height: 844 };
const PASS = '\x1b[32mPASS\x1b[0m';
const FAIL = '\x1b[31mFAIL\x1b[0m';

function assert(cond, msg) {
  console.log(`  ${cond ? PASS : FAIL} ${msg}`);
  if (!cond) process.exitCode = 1;
}

async function waitForInit(page) {
  await page.waitForFunction(() => {
    const s = document.querySelector('.section.parallax-garage-door-reveal');
    return s && s.style.transform && s.style.transform.includes('translateY');
  }, { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(1000);
}

async function triggerScroll(page, scroll) {
  await page.evaluate((sc) => {
    if (window.lenis) {
      const emitter = window.lenis.emitter || window.lenis._emitter;
      if (emitter?.emit) { emitter.emit('scroll', { scroll: sc }); return; }
      if (window.lenis.emit) { window.lenis.emit('scroll', { scroll: sc }); return; }
    }
    window.scrollTo(0, sc);
  }, scroll);
  await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
}

async function getTransforms(page) {
  return page.evaluate(() => {
    const s = document.querySelector('.section.parallax-garage-door-reveal');
    const fg = s?.querySelector('.foreground');
    const bg = s?.querySelector('.section-background img');
    return {
      section: s?.style?.transform ?? '(missing)',
      fg: fg?.style?.transform ?? '(missing)',
      bg: bg?.style?.transform ?? '(missing)',
    };
  });
}

(async () => {
  const browser = await firefox.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: MOBILE });
  const page = await ctx.newPage();
  await page.goto(PAGE_URL, { waitUntil: 'load', timeout: 30000 });
  await waitForInit(page);

  const { docTop, elHeight, cvh } = await page.evaluate(() => {
    const s = document.querySelector('.section.parallax-garage-door-reveal');
    let top = s.offsetTop;
    let p = s.offsetParent;
    while (p) { top += p.offsetTop; p = p.offsetParent; }
    return { docTop: top, elHeight: s.offsetHeight, cvh: window.innerHeight };
  });

  const total = elHeight + cvh;
  console.log(`\nSection: docTop=${docTop} elHeight=${elHeight} cvh=${cvh} total=${total}`);
  console.log(`growT: scroll ${docTop - cvh + elHeight * -0.5} → ${docTop - cvh + elHeight * 0.2}`);
  console.log(`fgT:   scroll ${docTop - cvh + total * -0.1} → ${docTop - cvh + total * 0.7}`);

  const positions = [
    { label: 'far before (scroll=0)', scroll: 0 },
    { label: 'grow anim starts', scroll: Math.max(0, docTop - cvh + Math.floor(elHeight * -0.5)) },
    { label: 'fg anim starts (cover -10%)', scroll: Math.max(0, docTop - cvh + Math.floor(total * -0.1)) },
    { label: 'section enters viewport', scroll: Math.max(0, docTop - cvh) },
    { label: 'grow anim ends', scroll: Math.max(0, docTop - cvh + Math.floor(elHeight * 0.2)) },
    { label: 'fg anim midpoint', scroll: Math.max(0, docTop - cvh + Math.floor((total * -0.1 + total * 0.7) / 2)) },
    { label: 'fg anim ends (cover 70%)', scroll: Math.max(0, docTop - cvh + Math.floor(total * 0.7)) },
  ];

  console.log('\n=== Transform progression ===');
  for (const { label, scroll } of positions) {
    await triggerScroll(page, scroll);
    const t = await getTransforms(page);
    console.log(`\n[${label}] scroll=${scroll}`);
    console.log(`  section:    "${t.section}"`);
    console.log(`  foreground: "${t.fg}"`);
    console.log(`  bgImg:      "${t.bg}"`);
  }

  // Assertions
  console.log('\n=== Assertions ===');

  // Fire scroll=0 first so foreground gets lazy-initialized
  await triggerScroll(page, 0);

  // At grow-start, section should start moving
  const growStart = Math.max(0, docTop - cvh + Math.floor(elHeight * -0.5));
  await triggerScroll(page, growStart);
  const atGrowStart = await getTransforms(page);
  assert(atGrowStart.section.includes('translateY'), `section animating at growStart (scroll=${growStart})`);

  // Foreground should have a positive translateY when before fg-end (still revealing)
  const fgMid = Math.max(0, docTop - cvh + Math.floor(total * 0.3));
  await triggerScroll(page, fgMid);
  const atFgMid = await getTransforms(page);
  const hasFgTransform = atFgMid.fg.includes('translateY');
  assert(hasFgTransform, `foreground has translateY at fg-midpoint (scroll=${fgMid}): "${atFgMid.fg}"`);

  // bgImg should scale
  assert(atFgMid.bg.includes('scale'), `bgImg scales at fg-midpoint: "${atFgMid.bg}"`);

  // At fg-end, foreground should be cleared
  const fgEnd = Math.max(0, docTop - cvh + Math.floor(total * 0.7));
  await triggerScroll(page, fgEnd + 10);
  const atFgEnd = await getTransforms(page);
  assert(atFgEnd.fg === '', `foreground cleared past fg-end: "${atFgEnd.fg}"`);

  await ctx.close();
  await browser.close();
  console.log(`\n=== ${process.exitCode ? 'FAILED' : 'ALL PASSED'} ===\n`);
})();
