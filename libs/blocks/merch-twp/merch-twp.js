/* eslint-disable import/no-relative-packages */
import { createTag, getConfig } from '../../utils/utils.js';
import '../../deps/lit-all.min.js';
import '../../features/spectrum-web-components/dist/theme.js';
import '../../features/spectrum-web-components/dist/tabs.js';
import '../../features/spectrum-web-components/dist/icons-workflow.js';
import '../../features/spectrum-web-components/dist/checkbox.js';
import '../../features/spectrum-web-components/dist/button.js';
import '../../features/spectrum-web-components/dist/overlay.js';
import '../../features/spectrum-web-components/dist/tooltip.js';
import '../../deps/merch-card.js';
import '../../deps/merch-offer-select.js';
import '../../deps/merch-stock.js';
import '../../deps/merch-quantity-select.js';
import '../../deps/merch-secure-transaction.js';
import '../../deps/merch-subscription-panel.js';
import '../../deps/merch-twp-d2p.js';
import { replaceKey } from '../../features/placeholders.js';

/**
 * All the possible elements that can be in the subscription panel.
 */
const SELECTOR_SUBSCRIPTION_CHILDREN = ':scope > h4,:scope > h5,merch-stock,merch-subscription,merch-secure-transaction';

const getPlanTypes = (offerSelect) => [
  offerSelect.querySelector('merch-offer[plan-type="ABM"]'),
  offerSelect.querySelector('merch-offer[plan-type="PUF"]'),
  offerSelect.querySelector('merch-offer[plan-type="M2M"]'),
];

export default async function init(el) {
  // temporary modal styles.
  const modal = el.closest('.dialog-modal');
  modal?.classList.add('twp');
  const offerLiterals = el.querySelector('.twp.offer-literals');
  el.querySelectorAll('merch-offer-select').forEach((offerSelect) => {
    const addLiterals = () => {
      const [cci, cct, cce] = [
        ...offerLiterals.querySelectorAll('template'),
      ].map((template) => template.content.cloneNode(true).children);
      const { customerSegment, marketSegment } = offerSelect;
      if (marketSegment === 'COM' && customerSegment === 'INDIVIDUAL') {
        const [abm, puf, m2m] = getPlanTypes(offerSelect);
        abm.append(...cci[0].children);
        puf.append(...cci[1].children);
        m2m.append(...cci[2].children);
      } else if (marketSegment === 'COM' && customerSegment === 'TEAM') {
        const [abm, puf] = getPlanTypes(offerSelect);
        abm.append(...cct[0].children);
        puf.append(...cct[1].children);
      } else if (marketSegment === 'EDU' && customerSegment === 'INDIVIDUAL') {
        const [abm, puf] = getPlanTypes(offerSelect);
        abm.append(...cce[0].children);
        puf.append(...cce[1].children);
      }
    };
    if (offerSelect.ready) {
      addLiterals();
    } else {
      offerSelect.addEventListener('merch-offer-select:ready', addLiterals, { once: true });
    }
  });

  const config = getConfig();
  const [content, panel] = el.querySelectorAll(':scope > div > div');
  const twp = createTag('merch-twp-d2p', {
    'individuals-text': await replaceKey('individuals', config),
    'business-text': await replaceKey('business', config),
    'education-text': await replaceKey('students-and-teachers', config),
    'continue-text': await replaceKey('continue', config),
  });
  content.querySelector('h4').setAttribute('slot', 'detail-xl');
  twp.append(...[...content.querySelectorAll(':scope > h4, merch-card')]);

  const cciFooter = createTag('div', { slot: 'cci-footer' });
  cciFooter.append(...[...content.querySelectorAll('p:not(hr ~ p)')]);
  const cctFooter = createTag('div', { slot: 'cct-footer' });
  cctFooter.append(
    ...[
      ...content.querySelectorAll(
        'hr:nth-of-type(1) ~ p:not(hr:nth-of-type(2) ~ p)',
      ),
    ],
  );
  const cceFooter = createTag('div', { slot: 'cce-footer' });
  cceFooter.append(...[...content.querySelectorAll('hr:last-of-type ~ p')]);

  twp.append(cciFooter, cctFooter, cceFooter);

  panel
    .querySelectorAll(':scope > h4, :scope > h5')
    .forEach((element) => element.setAttribute('slot', 'header'));

  const subscriptionPanel = createTag('merch-subscription-panel', {
    slot: 'panel',
    'continue-text': await replaceKey('continue', config),
  });
  subscriptionPanel.append(
    ...panel.querySelectorAll(
      SELECTOR_SUBSCRIPTION_CHILDREN,
    ),
  );
  twp.appendChild(subscriptionPanel);

  el.replaceWith(twp);
  return twp;
}
