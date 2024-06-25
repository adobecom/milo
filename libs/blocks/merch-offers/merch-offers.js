import { createTag, getConfig } from '../../utils/utils.js';

const { base } = getConfig();

const planTypes = ['ABM', 'PUF', 'M2M'];

const toSlottedofferLiterals = (commitment, index) => {
  const div = createTag('div', { 'plan-type': planTypes[index] });
  commitment.setAttribute('slot', 'commitment');
  const condition = commitment.nextElementSibling;
  condition.setAttribute('slot', 'condition');
  const tooltip = condition.nextElementSibling;
  tooltip.setAttribute('slot', 'condition-tooltip');
  if (tooltip?.nextElementSibling?.tagName === 'P') {
    const teaser = tooltip.nextElementSibling;
    teaser.setAttribute('slot', 'teaser');
    div.append(teaser);
  }
  div.append(commitment, condition, tooltip);
  return div;
};

const getLiteralsTemplate = (el, name) => {
  const template = createTag('template', { name });
  [...el.querySelectorAll('h5')].map(toSlottedofferLiterals).forEach((planType) => template.content.appendChild(planType));
  return template;
};

/**
 * This block provides offers data like stock offers for re-using in cards or dialogs.
 */
export default async function init(el) {
  const commonsDeps = [
    import(`${base}/deps/lit-all.min.js`),
    import(`${base}/features/spectrum-web-components/dist/theme.js`),
  ];

  if (el.classList.contains('secure-transaction')) {
    await Promise.all([
      ...commonsDeps,
      import(`${base}/features/spectrum-web-components/dist/overlay.js`),
      import(`${base}/features/spectrum-web-components/dist/popover.js`),
      import(`${base}/deps/merch-secure-transaction.js`),
    ]);
    const [label, tooltip] = el.querySelectorAll('h5, p');
    const merchSecureTransaction = createTag('merch-secure-transaction', { icon: true, label: label.innerText, tooltip: tooltip.innerText });
    el.replaceWith(merchSecureTransaction);
    return merchSecureTransaction;
  } if (el.matches('.twp.stock')) {
    const merchStock = createTag('merch-stock');
    const [abm, puf, m2m] = [...el.querySelectorAll('p')].map((p) => createTag('div', {}, p.innerHTML));
    merchStock.append(abm, puf, m2m);
    return el.replaceWith(merchStock);
  } if (el.matches('.twp.offer-literals')) {
    const [cci, cct, cce] = el.querySelectorAll(':scope > div > div');
    const cciTemplate = getLiteralsTemplate(cci, 'cci');
    const cctTemplate = getLiteralsTemplate(cct, 'cct');
    const cceTemplate = getLiteralsTemplate(cce, 'cce');
    el.innerHTML = '';
    el.append(cciTemplate, cctTemplate, cceTemplate);
  } else {
    el.append(...el.querySelectorAll('p'));
    el.append(...el.querySelectorAll('[data-wcs-osi]'));
    el.firstElementChild.remove();
  }
  return el;
}
