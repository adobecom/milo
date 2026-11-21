# merch-widget

Shared merch content for C2 blocks: `merch-widget.js` builds the DOM and `merch-widget.css` styles it.

The DOM building and styling are copied from the merch card in `libs/c2/blocks/product-marquee-grid` (`split-hero` carries the same copy). The pill, promo-surface and CTA-stack variants were left out, and the class names were renamed.

`buildMerchWidget(cell)` returns a `.merch-widget-c2` element. The consuming block loads the stylesheet at `/c2/utils/merch-widget/merch-widget.css` and awaits it before its own `init` returns.

Cell content: headless MAS field links (`&field=…`), legacy inline prices and `data-wcs-osi` CTAs, plus authored text. CTAs are grouped into `.merch-widget-ctas`.

- The `mas-field` wrapper stays around its content; the tooltip CSS is scoped to `mas-field .icon-button`.
