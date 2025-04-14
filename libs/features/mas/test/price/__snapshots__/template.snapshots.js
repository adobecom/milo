export const createPriceTemplate2 = `
<span class="price"
  ><span class="price-integer">67</span
  ><span class="price-decimals-delimiter">,</span
  ><span class="price-decimals">01</span
  ><span class="price-currency-space">&nbsp;</span
  ><span class="price-currency-symbol">€</span
  ><span class="price-recurrence disabled"></span
  ><span class="price-unit-type disabled"></span
  ><span class="price-sub-text"
    ><span class="price-tax-inclusivity">incl. VAT</span>.
    <span class="price-plan-type">Annuel, facturé mensuellement</span></span
  ></span
>
`;

export const createPriceTemplate3 = `
<span class="price"
  ><span class="price-currency-symbol">US$</span
  ><span class="price-currency-space disabled"></span
  ><span class="price-integer">67</span
  ><span class="price-decimals-delimiter">.</span
  ><span class="price-decimals">01</span
  ><span class="price-recurrence disabled"></span
  ><span class="price-unit-type disabled"></span
  ><span class="price-sub-text"
    ><span class="price-tax-inclusivity disabled"></span
    ><span class="price-plan-type">Annual, paid monthly.</span></span
  ></span
>
`;

export const createPriceTemplate1 = `
<span class="price" string="s" json='{ "foo" : "bar" }' number="1" truthy=""
  ><span class="price-integer">100</span
  ><span class="price-decimals-delimiter disabled"></span
  ><span class="price-decimals disabled"></span
  ><span class="price-currency-space disabled"></span
  ><span class="price-currency-symbol disabled"></span
  ><span class="price-recurrence disabled"></span
  ><span class="price-unit-type disabled"></span
  ><span class="price-tax-inclusivity disabled"></span
></span>
`;

export const createPromoPriceTemplate1 = `
<span
  class="price price-alternative"
  string="s"
  json='{ "foo" : "bar" }'
  number="1"
  truthy=""
  ><sr-only class="alt-aria-label">Alternatively at</sr-only
  ><span class="price-integer">80</span
  ><span class="price-decimals-delimiter disabled"></span
  ><span class="price-decimals disabled"></span
  ><span class="price-currency-space disabled"></span
  ><span class="price-currency-symbol disabled"></span
  ><span class="price-recurrence disabled"></span
  ><span class="price-unit-type disabled"></span
  ><span class="price-tax-inclusivity disabled"></span></span
>&nbsp;<span
  class="price price-strikethrough"
  string="s"
  json='{ "foo" : "bar" }'
  number="1"
  truthy=""
  ><sr-only class="strikethrough-aria-label">Regularly at</sr-only
  ><span class="price-integer">100</span
  ><span class="price-decimals-delimiter disabled"></span
  ><span class="price-decimals disabled"></span
  ><span class="price-currency-space disabled"></span
  ><span class="price-currency-symbol disabled"></span
  ><span class="price-recurrence disabled"></span
  ><span class="price-unit-type disabled"></span
  ><span class="price-tax-inclusivity disabled"></span
></span>
`;

export const createPromoPriceTemplate2 = `
<span class="price" string="s" json='{ "foo" : "bar" }' number="1" truthy=""
  ><span class="price-integer">100</span
  ><span class="price-decimals-delimiter disabled"></span
  ><span class="price-decimals disabled"></span
  ><span class="price-currency-space disabled"></span
  ><span class="price-currency-symbol disabled"></span
  ><span class="price-recurrence disabled"></span
  ><span class="price-unit-type disabled"></span
  ><span class="price-tax-inclusivity disabled"></span
></span>
`;

export const createPriceWithAnnualTemplate1 = `
<span class="price"
  ><span class="price-integer">100</span
  ><span class="price-decimals-delimiter disabled"></span
  ><span class="price-decimals disabled"></span
  ><span class="price-currency-space disabled"></span
  ><span class="price-currency-symbol disabled"></span
  ><span class="price-recurrence">/mo</span
  ><span class="price-unit-type disabled"></span
  ><span class="price-tax-inclusivity disabled"></span></span
><span class="price-annual-prefix">&nbsp;(</span
><span class="price price-annual"
  ><span class="price-integer">1200</span
  ><span class="price-decimals-delimiter disabled"></span
  ><span class="price-decimals disabled"></span
  ><span class="price-currency-space disabled"></span
  ><span class="price-currency-symbol disabled"></span
  ><span class="price-recurrence">/yr</span
  ><span class="price-unit-type disabled"></span
  ><span class="price-tax-inclusivity disabled"></span></span
><span class="price-annual-suffix">)</span>
`;

export const createPromoPriceWithAnnualTemplate1 = `
<span class="price price-strikethrough"
  ><sr-only class="strikethrough-aria-label">Regularly at</sr-only
  ><span class="price-integer">100</span
  ><span class="price-decimals-delimiter disabled"></span
  ><span class="price-decimals disabled"></span
  ><span class="price-currency-space disabled"></span
  ><span class="price-currency-symbol disabled"></span
  ><span class="price-recurrence">/mo</span
  ><span class="price-unit-type disabled"></span
  ><span class="price-tax-inclusivity disabled"></span></span
>&nbsp;<span class="price price-alternative"
  ><sr-only class="alt-aria-label">Alternatively at</sr-only
  ><span class="price-integer">80</span
  ><span class="price-decimals-delimiter disabled"></span
  ><span class="price-decimals disabled"></span
  ><span class="price-currency-space disabled"></span
  ><span class="price-currency-symbol disabled"></span
  ><span class="price-recurrence">/mo</span
  ><span class="price-unit-type disabled"></span
  ><span class="price-tax-inclusivity disabled"></span></span
><span class="price-annual-prefix">&nbsp;(</span
><span class="price price-annual"
  ><span class="price-integer">960</span
  ><span class="price-decimals-delimiter disabled"></span
  ><span class="price-decimals disabled"></span
  ><span class="price-currency-space disabled"></span
  ><span class="price-currency-symbol disabled"></span
  ><span class="price-recurrence">/yr</span
  ><span class="price-unit-type disabled"></span
  ><span class="price-tax-inclusivity disabled"></span></span
><span class="price-annual-suffix">)</span>
`;

export const annualTemplatePromo = `
<span class="price price-strikethrough"
  ><sr-only class="strikethrough-aria-label">Regularly at</sr-only
  ><span class="price-currency-symbol">A$</span
  ><span class="price-currency-space disabled"></span
  ><span class="price-integer">30.99</span
  ><span class="price-decimals-delimiter disabled"></span
  ><span class="price-decimals disabled"></span
  ><span class="price-recurrence">/mo</span
  ><span class="price-unit-type disabled"></span
  ><span class="price-tax-inclusivity disabled"></span></span
>&nbsp;<span class="price price-alternative"
  ><sr-only class="alt-aria-label">Alternatively at</sr-only
  ><span class="price-currency-symbol">A$</span
  ><span class="price-currency-space disabled"></span
  ><span class="price-integer">23.23</span
  ><span class="price-decimals-delimiter disabled"></span
  ><span class="price-decimals disabled"></span
  ><span class="price-recurrence">/mo</span
  ><span class="price-unit-type disabled"></span
  ><span class="price-tax-inclusivity disabled"></span></span
><span class="price-annual-prefix">&nbsp;(</span
><span class="price price-annual"
  ><span class="price-currency-symbol">A$</span
  ><span class="price-currency-space disabled"></span
  ><span class="price-integer">371.88</span
  ><span class="price-decimals-delimiter disabled"></span
  ><span class="price-decimals disabled"></span
  ><span class="price-recurrence">/yr</span
  ><span class="price-unit-type disabled"></span
  ><span class="price-tax-inclusivity disabled"></span></span
><span class="price-annual-suffix">)</span>
`;

export const annualTemplatePromoNotStarted = `
<span class="price price-strikethrough"
  ><sr-only class="strikethrough-aria-label">Regularly at</sr-only
  ><span class="price-currency-symbol">A$</span
  ><span class="price-currency-space disabled"></span
  ><span class="price-integer">30.99</span
  ><span class="price-decimals-delimiter disabled"></span
  ><span class="price-decimals disabled"></span
  ><span class="price-recurrence">/mo</span
  ><span class="price-unit-type disabled"></span
  ><span class="price-tax-inclusivity disabled"></span></span
>&nbsp;<span class="price price-alternative"
  ><sr-only class="alt-aria-label">Alternatively at</sr-only
  ><span class="price-currency-symbol">A$</span
  ><span class="price-currency-space disabled"></span
  ><span class="price-integer">23.23</span
  ><span class="price-decimals-delimiter disabled"></span
  ><span class="price-decimals disabled"></span
  ><span class="price-recurrence">/mo</span
  ><span class="price-unit-type disabled"></span
  ><span class="price-tax-inclusivity disabled"></span></span
><span class="price-annual-prefix">&nbsp;(</span
><span class="price price-annual"
  ><span class="price-currency-symbol">A$</span
  ><span class="price-currency-space disabled"></span
  ><span class="price-integer">371.88</span
  ><span class="price-decimals-delimiter disabled"></span
  ><span class="price-decimals disabled"></span
  ><span class="price-recurrence">/yr</span
  ><span class="price-unit-type disabled"></span
  ><span class="price-tax-inclusivity disabled"></span></span
><span class="price-annual-suffix">)</span>
`;

export const annualTemplatePromoExpired = `
<span class="price price-strikethrough"
  ><sr-only class="strikethrough-aria-label">Regularly at</sr-only
  ><span class="price-currency-symbol">A$</span
  ><span class="price-currency-space disabled"></span
  ><span class="price-integer">30.99</span
  ><span class="price-decimals-delimiter disabled"></span
  ><span class="price-decimals disabled"></span
  ><span class="price-recurrence">/mo</span
  ><span class="price-unit-type disabled"></span
  ><span class="price-tax-inclusivity disabled"></span></span
>&nbsp;<span class="price price-alternative"
  ><sr-only class="alt-aria-label">Alternatively at</sr-only
  ><span class="price-currency-symbol">A$</span
  ><span class="price-currency-space disabled"></span
  ><span class="price-integer">23.23</span
  ><span class="price-decimals-delimiter disabled"></span
  ><span class="price-decimals disabled"></span
  ><span class="price-recurrence">/mo</span
  ><span class="price-unit-type disabled"></span
  ><span class="price-tax-inclusivity disabled"></span></span
><span class="price-annual-prefix">&nbsp;(</span
><span class="price price-annual"
  ><span class="price-currency-symbol">A$</span
  ><span class="price-currency-space disabled"></span
  ><span class="price-integer">371.88</span
  ><span class="price-decimals-delimiter disabled"></span
  ><span class="price-decimals disabled"></span
  ><span class="price-recurrence">/yr</span
  ><span class="price-unit-type disabled"></span
  ><span class="price-tax-inclusivity disabled"></span></span
><span class="price-annual-suffix">)</span>
`;
