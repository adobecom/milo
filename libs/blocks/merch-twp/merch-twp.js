import { createTag, getConfig } from '../../utils/utils.js';

export default async function init(el) {
  const { base } = getConfig();

  await Promise.all([
    import(`${base}/deps/lit-all.min.js`),
    import(`${base}/features/spectrum-web-components/dist/theme.js`),
    import(`${base}/features/spectrum-web-components/dist/tabs.js`),
    import(`${base}/deps/merch-twp-d2p.js`),
  ]);

  const [content, panel] = el.querySelectorAll(':scope > div > div');

  const twp = createTag('merch-twp-d2p');
  twp.append(...[...content.querySelectorAll('h4,h5, merch-card')]);

  const addSlot = (element, slot) => { element.setAttribute('slot', slot); return element; };
  const cciFooter = [...content.querySelectorAll('p:not(hr ~ p)')].map((element) => addSlot(element, 'cci-footer'));
  const cctFooter = [...content.querySelectorAll('hr:nth-of-type(1) ~ p:not(hr:nth-of-type(2) ~ p)')].map((element) => addSlot(element, 'cct-footer'));
  const cce = [...content.querySelectorAll('hr:last-of-type ~ p')].map((element) => addSlot(element, 'cce-footer'));

  twp.append(...cciFooter, ...cctFooter, ...cce);

  const subscriptionPanel = createTag('merch-subscription-panel');
  subscriptionPanel.append(...panel.querySelectorAll(':scope > h4,:scope > h5,merch-stock,merch-subscription'));
  twp.appendChild(subscriptionPanel);

  return el.replaceWith(twp);
}
