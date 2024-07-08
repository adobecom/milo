import { createTag, getConfig } from '../../utils/utils.js';
import { replaceKey } from '../../features/placeholders.js';
import '../../deps/merch-mnemonic-list.js';

/**
 * All the possible elements that can be in the subscription panel.
 */
const SELECTOR_SUBSCRIPTION_CHILDREN = ':scope > h4,:scope > h5,merch-stock,merch-subscription,merch-secure-transaction';

const getLists = (el) => {
  const lists = el?.querySelectorAll('.text');
  if (!lists || lists.length < 2) return [];
  const includes = lists?.[0];
  const hasExtras = lists?.length === 3;
  // Adobe Stock and AI Assistant for Acrobat do not have 'Extras'
  const extras = hasExtras && lists[1];
  const recommendedFor = hasExtras ? lists[2] : lists[1];
  return {
    includes,
    extras,
    recommendedFor
  }
}

export default async function init(el) {
  // const modal = el.closest('.dialog-modal');
  // modal?.classList.add('crm');

  const topIconsContainer = createTag('div');
  topIconsContainer.classList.add('top-icons');
  const allImgs = el.querySelectorAll(':scope > div > div > p picture > img');
  allImgs.forEach((icon) => {
    topIconsContainer.appendChild(icon.cloneNode(true));
  });

  const heading = el.querySelector(':scope > div > div > h2');
  const description = el.querySelector(':scope > div > div > p:nth-of-type(2)');

  const { includes, extras, recommendedFor } = getLists(el);
  
  //@TODO:
  // 1. use merch-mnemonic-list for 'includes', except for Adobe Stock - it does not have icons in 'includes'

  const crm = createTag('merch-crm');
  crm.append(topIconsContainer);
  crm.append(heading.cloneNode(true));
  crm.append(description.cloneNode(true));
  if (includes) {
    crm.append(includes.cloneNode(true));
  }
  if (extras) {
    crm.append(extras.cloneNode(true));
  }
  if (recommendedFor) {
    crm.append(recommendedFor.cloneNode(true));
  }
  
  const config = getConfig();
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

  // el.replaceWith(crm);
  return crm;
}
