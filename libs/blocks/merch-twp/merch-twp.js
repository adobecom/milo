import { createTag, getConfig } from '../../utils/utils.js';
import '../../deps/merch-subscription-panel.js';
import '../../deps/merch-subscription-tabs.js';
import '../../deps/merch-subscription-layout.js';

const createPanel = () => {
  const template = `<merch-subscription-panel slot="panel">
    <h4 slot="header">Pick a subscription:</h4>
    <h5 slot="header">
        You won't be charged until after your free trial ends.
    </h5>
    <template name="ABM">
        <div slot="commitment">Annual, paid monthly</div>
        <div slot="condition">
            Fee applies if you cancel after 14 days.
        </div>
        <div slot="condition-tooltip">
            If you cancel after 14 days, your service will continue
            until the end of that month’s billing period, and you
            will be charged an early termination fee.
        </div>
    </template>
    <template name="M2M">
        <div slot="commitment">Monthly</div>
        <div slot="condition">Cancel anytime, no fee.</div>
        <div slot="condition-tooltip">
            If you cancel after 14 days, your payment is
            non-refundable, and your service will continue until the
            end of that month’s billing period.
        </div>
        <div slot="vat">Includes VAT</div>
    </template>
    <template name="PUF">
        <div slot="commitment">Annual, prepaid</div>
        <div slot="condition">
            No refund if you cancel after 14 days.
        </div>
        <div slot="condition-tooltip">
            If you cancel after 14 days, your payment is
            non-refundable, and your service will continue until the
            end of your contracted term.
        </div>
        <div slot="vat">Includes VAT</div>
    </template>
    <a is="checkout-link" class="con-button blue" slot="cta"
        >Continue</a
    ></merch-subscription-panel>`;
  const el = document.createElement('div');
  el.innerHTML = template;
  return el.querySelector('merch-subscription-panel');
};

export default async function init(el) {
  const cards = el.querySelectorAll('merch-card');
  el.firstElementChild.remove();
  if (cards.length) {
    const { base } = getConfig();
    await import(`${base}/features/spectrum-web-components/dist/theme.js`);
    const layout = createTag('merch-subscription-layout', { }, '', { });
    createTag('h3', { slot: 'title' }, 'Try the full version of Adobe apps with a 7-day free trial.', { parent: layout });
    createTag('h5', { slot: 'sub-title' }, 'Choose a plan:', { parent: layout });
    const merchCards = [...cards].map((card) => {
      card.setAttribute('slot', 'cards');
      return card;
    });
    const tabs = createTag('merch-subscription-tabs', { slot: 'tabs' }, '', {});
    tabs.append(...merchCards);
    layout.append(tabs);
    layout.append(createPanel());
    el.append(layout);
  }
  return el;
}
