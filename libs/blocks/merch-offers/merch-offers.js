import { createTag, getConfig } from '../../utils/utils.js';

const { base } = getConfig();

/**
 * This block provides offers data like stock offers for re-using in cards or dialogs.
 */
export default async function init(el) {
  await import(`${base}/features/spectrum-web-components/dist/theme.js`);
  if (el.classList.contains('twp')) {
    if (el.classList.contains('stock')) {
      await Promise.all([
        import(`${base}/deps/lit-all.min.js`),
        import(`${base}/features/spectrum-web-components/dist/theme.js`),
        import(`${base}/features/spectrum-web-components/dist/checkbox.js`),
        import(`${base}/deps/merch-stock.js`),
      ]);
      const merchStock = createTag('merch-stock');
      el.querySelectorAll('p').forEach((p) => {
        const div = createTag('div', {});
        div.append(...p.childNodes);
        merchStock.append(div);
      });
      el.replaceWith(merchStock);
      return merchStock;
    }
  }

  el.append(...el.querySelectorAll('p'));
  el.append(...el.querySelectorAll('[data-wcs-osi]'));
  el.firstElementChild.remove();
  return el;
}
