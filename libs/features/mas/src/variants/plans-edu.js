import { Plans } from './plans.js';
import { CSS } from './plans-edu.css.js';
import { css } from 'lit';

export const PLANS_EDU_AEM_FRAGMENT_MAPPING = {
  title: { tag: 'p', slot: 'heading-xs' },
  prices: { tag: 'p', slot: 'heading-m' },
  promoText: { tag: 'p', slot: 'promo-text' },
  description: { tag: 'div', slot: 'body-xs' },
  mnemonics: { size: 'l' },
  callout: { tag: 'div', slot: 'callout-content' },
  stockOffer: true,
  secureLabel: true,
  badge: { tag: 'div', slot: 'badge' },
  allowedBadgeColors: ['spectrum-yellow-300-plans', 'spectrum-gray-300-plans', 'spectrum-gray-700-plans', 'spectrum-green-900-plans'],
  allowedBorderColors: ['spectrum-yellow-300-plans', 'spectrum-gray-300-plans'],
  borderColor: { attribute: 'border-color' },
  ctas: { slot: 'footer', size: 'm' },
  style: 'consonant'
};

export class PlansEdu extends Plans {
  constructor(card) {
    super(card);
    card.setAttribute('segment', 'students');
    card.setAttribute('variant', 'plans');
  }

  get aemFragmentMapping() {
    return PLANS_EDU_AEM_FRAGMENT_MAPPING;
  }

  getGlobalCSS() {
    return CSS;
  }

  postCardUpdateHook() {
    this.adjustTitleWidth();
  }

  static variantStyle = css`
    :host([variant='plans'][segment='students']) {
        min-height: unset;
    }
    
    :host([variant='plans'][segment='students']) .body {
        max-width: none;
    }
  `;
}
