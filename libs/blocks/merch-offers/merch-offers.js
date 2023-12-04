/**
 * This block provides offers data like stock offers for re-using in cards or dialogs.
 */

export default async function init(el) {
  el.append(el.querySelector('p'));
  el.append(...el.querySelectorAll('[data-wcs-osi]'));
  el.firstElementChild.remove();
  return el;
}
