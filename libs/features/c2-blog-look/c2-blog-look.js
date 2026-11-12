// The C2 look for blog article drafts, on this preview branch only. loadArea (utils.js) imports
// it only on da-bacom-blog's hosts under /drafts/, or on localhost with ?c2-blog-look=on.
const SHEETS = [
  'c2-tokens.css',
  'c2-template.css',
  'article.css',
  'c2-promo.css',
  'c2-footer.css',
  'footer.css',
  'motion.css',
];
const SCRIPTS = [
  'promo.js',
  'footer.js',
  'sidenav.js',
  'motion.js',
];

const logError = (what, e) => window.lana?.log(`Failed to load the C2 blog look ${what}: ${e}`, {
  tags: 'c2-blog-look',
  severity: 'error',
});

// The look's sheets go just before milo's styles.css, so milo's and the blog's own rules keep their
// place after them.
function addSheets() {
  const milo = [...document.head.querySelectorAll('link[rel="stylesheet"]')]
    .find((link) => new URL(link.href, window.location.href).pathname.endsWith('/libs/styles/styles.css'));
  return Promise.all(SHEETS.map((name) => new Promise((resolve) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = new URL(name, import.meta.url).href;
    link.dataset.c2BlogLook = name;
    link.addEventListener('load', resolve, { once: true });
    link.addEventListener('error', () => {
      logError(`sheet ${name}`, 'the sheet did not load');
      resolve();
    }, { once: true });
    if (milo) milo.before(link);
    else document.head.append(link);
  })));
}

export default async function loadC2BlogLook() {
  if (!document.querySelector('main .blog-header')) return;
  if (document.documentElement.dataset.c2BlogLook) return;
  document.documentElement.dataset.c2BlogLook = 'on';
  await addSheets();
  await Promise.all(SCRIPTS.map((name) => import(new URL(name, import.meta.url).href)
    .catch((e) => logError(`script ${name}`, e))));
}
