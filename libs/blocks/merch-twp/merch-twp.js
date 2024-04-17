/* eslint-disable import/no-relative-packages */
import { createTag } from '../../utils/utils.js';
import '../../deps/lit-all.min.js';
import '../../features/spectrum-web-components/dist/theme.js';
import '../../features/spectrum-web-components/dist/tabs.js';
import '../../features/spectrum-web-components/dist/icons-workflow.js';
import '../../features/spectrum-web-components/dist/button.js';
import '../../features/spectrum-web-components/dist/overlay.js';
import '../../features/spectrum-web-components/dist/tooltip.js';
import '../../deps/merch-card.js';
import '../../deps/merch-offer-select.js';
import '../../deps/merch-subscription-panel.js';
import '../../deps/merch-twp-d2p.js';

const getPlanTypes = (offerSelect) => [
  offerSelect.querySelector('merch-offer[plan-type="ABM"]'),
  offerSelect.querySelector('merch-offer[plan-type="PUF"]'),
  offerSelect.querySelector('merch-offer[plan-type="M2M"]'),
];

export default async function init(el) {
  const offerLiterals = el.querySelector('.twp.offer-literals');
  el.querySelectorAll('merch-offer-select').forEach((offerSelect) => {
    offerSelect.addEventListener('merch-offer-select:ready', () => {
      const [cci, cct, cce] = [...offerLiterals.querySelectorAll('template')].map((template) => template.content.cloneNode(true).children);
      const { customerSegment, marketSegment } = offerSelect;
      if (marketSegment === 'COM' && customerSegment === 'INDIVIDUAL') {
        const [abm, puf, m2m] = getPlanTypes(offerSelect);
        abm.append(...(cci[0].childNodes));
        puf.append(...(cci[1].childNodes));
        m2m.append(...(cci[2].childNodes));
      } else if (marketSegment === 'COM' && customerSegment === 'TEAM') {
        const [abm, puf] = getPlanTypes(offerSelect);
        abm.append(...(cct[0].childNodes));
        puf.append(...(cct[1].childNodes));
      } else if (marketSegment === 'EDU' && customerSegment === 'INDIVIDUAL') {
        const [abm, puf] = getPlanTypes(offerSelect);
        abm.append(...(cce[0].childNodes));
        puf.append(...(cce[1].childNodes));
      }
    }, { once: true });
  });

  const [content, panel] = el.querySelectorAll(':scope > div > div');

  const twp = createTag('merch-twp-d2p');
  content.querySelector('h4').setAttribute('slot', 'detail-xl');
  twp.append(...[...content.querySelectorAll(':scope > h4, merch-card')]);

  const cciFooter = createTag('div', { slot: 'cci-footer' });
  cciFooter.append(...[...content.querySelectorAll('p:not(hr ~ p)')]);
  const cctFooter = createTag('div', { slot: 'cct-footer' });
  cctFooter.append(...[...content.querySelectorAll('hr:nth-of-type(1) ~ p:not(hr:nth-of-type(2) ~ p)')]);
  const cceFooter = createTag('div', { slot: 'cce-footer' });
  cceFooter.append(...[...content.querySelectorAll('hr:last-of-type ~ p')]);

  twp.append(cciFooter, cctFooter, cceFooter);

  panel.querySelectorAll(':scope > h4, :scope > h5').forEach((element) => element.setAttribute('slot', 'header'));

  const subscriptionPanel = createTag('merch-subscription-panel', { slot: 'panel' });
  subscriptionPanel.append(...panel.querySelectorAll(':scope > h4,:scope > h5,merch-stock,merch-subscription,merch-secure-transaction'));
  twp.appendChild(subscriptionPanel);

  return el.replaceWith(twp);
}
