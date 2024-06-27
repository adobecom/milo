import { createTag, getConfig } from '../../utils/utils.js';
import { replaceKey } from '../../features/placeholders.js';

/**
 * All the possible elements that can be in the subscription panel.
 */
const SELECTOR_SUBSCRIPTION_CHILDREN = ':scope > h4,:scope > h5,merch-stock,merch-subscription,merch-secure-transaction';

export default async function init(el) {
  const modal = el.closest('.dialog-modal');
  modal?.classList.add('crm');
  const config = getConfig();
  console.log('modal enot', modal);
  console.log('config enot', config);

  const crm = createTag('merch-crm');

  const [content, panel] = el.querySelectorAll(':scope > div > div');
  const subscriptionPanel = createTag('merch-subscription-panel', {
    slot: 'panel',
    'continue-text': await replaceKey('continue', config),
  });
  subscriptionPanel.append(
    ...panel.querySelectorAll(
      SELECTOR_SUBSCRIPTION_CHILDREN,
    ),
  );
  console.log(subscriptionPanel);
  crm.appendChild(subscriptionPanel);

  return crm;
}
