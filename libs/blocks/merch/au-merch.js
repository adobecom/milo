/**
 * ABM prices for Australia are displayed with annual price next to them.
 * If strikethrough price is also displayed then the annual price should
 * be displayed in the next line.
 *
 * @param element wrapper element
 */
// eslint-disable-next-line import/prefer-default-export
export async function checkIfStPriceAddedForAu(element) {
  const prices = element.querySelectorAll('[data-wcs-osi]');
  await Promise.all([...prices].map((price) => price.onceSettled()));

  const stPrice = element.querySelector('.price-strikethrough');
  const auAnnualPrice = element.querySelector('.price-annual-prefix');
  if (stPrice && auAnnualPrice) {
    element.classList.add('has-st-annual-price');
  }
}
