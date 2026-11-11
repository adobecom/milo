// C2 look for blog article drafts, on this preview branch only (opt in by address: ?milolibs=<this branch>).
// It applies on da-bacom-blog's preview hosts under /drafts/, and on localhost for testing, to pages with a blog header.
const BLOG_HOST = /^[a-z0-9-]+--da-bacom-blog--adobecom\.(aem|hlx)\.(page|live)$/;
const LOCAL_HOST = /^(localhost|127\.0\.0\.1)$/;
const SHEETS = ["c2-tokens.css","c2-template.css","article.css","c2-promo.css","c2-footer.css","footer.css","motion.css"];
const SCRIPTS = ["promo.js","footer.js","sidenav.js","motion.js"];

export function appliesTo({ hostname, pathname }) {
  if (LOCAL_HOST.test(hostname)) return true;
  return BLOG_HOST.test(hostname) && pathname.startsWith('/drafts/');
}

// The look's sheets go just before milo's styles.css, so milo's and the blog's own rules keep their place after them.
function addSheets() {
  const milo = [...document.head.querySelectorAll('link[rel="stylesheet"]')]
    .find((link) => new URL(link.href, window.location.href).pathname.endsWith('/libs/styles/styles.css'));
  return Promise.all(SHEETS.map((name) => new Promise((resolve) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = new URL(name, import.meta.url).href;
    link.dataset.c2BlogLook = name;
    link.addEventListener('load', resolve, { once: true });
    link.addEventListener('error', resolve, { once: true });
    if (milo) milo.before(link);
    else document.head.append(link);
  })));
}

export default async function loadC2BlogLook() {
  try {
    if (!appliesTo(window.location) || !document.querySelector('main .blog-header')) return;
    if (document.documentElement.dataset.c2BlogLook) return;
    document.documentElement.dataset.c2BlogLook = 'on';
    await addSheets();
    await Promise.all(SCRIPTS.map((name) => import(new URL(name, import.meta.url).href).catch(() => {})));
  } catch {
    // the page keeps milo's own look
  }
}
