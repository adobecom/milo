import { html, nothing } from 'lit';
import { getFragmentMapping } from './variants';

export class VariantLayout {
  static variantStyleSheets = new Map();

  static initializationPromises = new Map();

  card;

  #container;

    getContainer() {
        this.#container =
            this.#container ??
            this.card.closest('merch-card-collection, [class*="-merch-cards"]') ??
            this.card.parentElement;
        return this.#container;
    }

  static async ensureVariantStyle(variant, cssContent) {
    if (VariantLayout.variantStyleSheets.has(variant)) {
      return Promise.resolve(VariantLayout.variantStyleSheets.get(variant));
    }

    if (VariantLayout.initializationPromises.has(variant)) {
      return VariantLayout.initializationPromises.get(variant);
    }

    const initPromise = new Promise((resolve) => {
      try {
        const styleSheet = new CSSStyleSheet();
        styleSheet.replaceSync(cssContent);

        VariantLayout.variantStyleSheets.set(variant, styleSheet);

        if (!document.adoptedStyleSheets.includes(styleSheet)) {
          document.adoptedStyleSheets = [...document.adoptedStyleSheets, styleSheet];
        }

        resolve(styleSheet);
      } catch (err) {
        console.error(`Failed to create stylesheet for variant ${variant}:`, err);
        resolve(null);
      }
    });

    VariantLayout.initializationPromises.set(variant, initPromise);
    return initPromise;
  }

  async insertVariantStyle() {
    const { variant } = this.card;
    const cssContent = this.getGlobalCSS();

    if (!cssContent) return;

    const styleSheet = await VariantLayout.ensureVariantStyle(variant, cssContent);

    if (styleSheet && this.card.shadowRoot && !this.card.shadowRoot.adoptedStyleSheets.includes(styleSheet)) {
      this.card.shadowRoot.adoptedStyleSheets = [...this.card.shadowRoot.adoptedStyleSheets, styleSheet];
    }
  }

  updateCardElementMinHeight(el, name) {
    if (!el) return;
    const elMinHeightPropertyName = `--consonant-merch-card-${this.card.variant}-${name}-height`;
    const height = Math.max(
      0,
      parseInt(window.getComputedStyle(el).height) || 0,
    );
    const maxMinHeight = parseInt(
      this.getContainer().style.getPropertyValue(
        elMinHeightPropertyName,
      ),
    ) || 0;

    if (height > maxMinHeight) {
      this.getContainer().style.setProperty(
        elMinHeightPropertyName,
        `${height}px`,
      );
    }
  }

  constructor(card) {
    this.card = card;
  }

  get badge() {
    let additionalStyles;
    if (
      !this.card.badgeBackgroundColor
            || !this.card.badgeColor
            || !this.card.badgeText
    ) {
      return;
    }
    if (this.evergreen) {
      additionalStyles = `border: 1px solid ${this.card.badgeBackgroundColor}; border-right: none;`;
    }
    return html`
            <div
                id="badge"
                class="${this.card.variant}-badge"
                style="background-color: ${this.card.badgeBackgroundColor};
                color: ${this.card.badgeColor};
                ${additionalStyles}"
            >
                ${this.card.badgeText}
            </div>
        `;
  }

  get cardImage() {
    return html` <div class="image">
            <slot name="bg-image"></slot>
            ${this.badge}
        </div>`;
  }

  /* c8 ignore next 3 */
  getGlobalCSS() {
    return '';
  }

  /* c8 ignore next 3 */
  get theme() {
    return document.querySelector('sp-theme');
  }

  get evergreen() {
    return this.card.classList.contains('intro-pricing');
  }

  get promoBottom() {
    return this.card.classList.contains('promo-bottom');
  }

  get headingSelector() {
    return '[slot="heading-xs"]';
  }

  get secureLabel() {
    return this.card.secureLabel
      ? html`<span class="secure-transaction-label"
                >${this.card.secureLabel}</span
            >`
      : nothing;
  }

  get secureLabelFooter() {
    return html`<footer>${this.secureLabel}<slot name="footer"></slot></footer>`;
  }

  async adjustTitleWidth() {
    const cardWidth = this.card.getBoundingClientRect().width;
    const badgeWidth = this.card.badgeElement?.getBoundingClientRect().width || 0;
    if (cardWidth === 0 || badgeWidth === 0) return;
    this.card.style.setProperty(
      '--consonant-merch-card-heading-xs-max-width',
      `${Math.round(cardWidth - badgeWidth - 16)}px`, // consonant-merch-spacing-xs
    );
  }

  async postCardUpdateHook() {
    // nothing to do by default
  }

  connectedCallbackHook() {
    // nothing to do by default
  }

    disconnectedCallbackHook() {
        //nothing to do by default
    }

    syncHeights() {
        // Base implementation - variants can override this
        // Called when all cards in collection are ready
        // Variants that need height synchronization should override this method
    }

  /* c8 ignore next 3 */
  renderLayout() {
    // nothing to do by default
  }

  get aemFragmentMapping() {
    return getFragmentMapping(this.card.variant);
  }
}
