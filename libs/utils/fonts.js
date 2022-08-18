// A gently modified version of the dynamic subsetting loader from Adobe Fonts
function dynamicTypekit(kitId, d = document) {
  const config = { kitId, scriptTimeout: 3000, async: true };
  /* c8 ignore next 1 */
  const h = d.documentElement; const t = setTimeout(() => { h.className = `${h.className.replace(/\bwf-loading\b/g, '')} wf-inactive`; }, config.scriptTimeout); const tk = d.createElement('script'); let f = false; const s = d.getElementsByTagName('script')[0]; let a; h.className += ' wf-loading'; tk.src = `https://use.typekit.net/${config.kitId}.js`; tk.async = true; tk.onload = tk.onreadystatechange = function () { a = this.readyState; if (f || a && a != 'complete' && a != 'loaded') return; f = true; clearTimeout(t); try { Typekit.load(config); } catch (e) {} }; s.parentNode.insertBefore(tk, s);
  return h;
}

/**
 * Set the fonts of the page.
 *
 * Determines if the font should be a classic CSS integration
 * or if it should be a JS integration (dynamic subsetting) for CJK.
 *
 * @param {Object} locale the locale details
 */
export default function loadFonts(locale, loadStyle) {
  const tkSplit = locale.tk.split('.');
  if (tkSplit[1] === 'css') {
    return new Promise((resolve) => {
      loadStyle(`https://use.typekit.net/${locale.tk}`, resolve);
    });
  }
  return dynamicTypekit(locale.tk);
}
