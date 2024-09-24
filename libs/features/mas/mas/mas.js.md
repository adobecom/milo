# mas.js

## Introduction

This is a javasript library enables M@S on any web surface.

mas.js includes the followings custom elements:

-   [inline-price](/libs/features/mas/docs/inline-price.html)
-   [checkout-link](/libs/features/mas/docs/checkout-link.html)
-   [merch-card](/libs/features/mas/docs/merch-card.html)

## Enablement

Add the following script in your document `head` element.

```html
<!-- for US english -->
<script
    src="https://ccd-checkout-link--milo--yesil.hlx.page/libs/deps/mas/mas.js"
    type="module"
></script>

<!-- for other locales, pass locale parameter from the table below -->
<script
    src="https://ccd-checkout-link--milo--yesil.hlx.page/libs/deps/mas/mas.js?locale=CA_en"
    type="module"
></script>
```

Behind the scene, once MAS isitialized in the page, a custom element (`wcms-commerce`) is added to the document head.<br>
It is programmatically added by mas.js and its tag name can be changed later.

### Example:

<p class="example">
  Plans starting at
  <span
    is="inline-price"
    data-display-old-price="true"
    data-display-per-unit="true"
    data-display-recurrence="true"
    data-display-tax="false"
    data-force-tax-exclusive="false"
    data-quantity="1"
    data-template="price"
    data-wcs-osi="A1xn6EL4pK93bWjM8flffQpfEL-bnvtoQKQAvkx574M"
  ></span
  >.
</p>


<script type="module">
  const params = new URLSearchParams(document.location.search);
  let masJs = 'https://ccd-checkout-link--milo--yesil.hlx.page/libs/deps/mas/mas.js';
  const locale = params.get('locale');
  if (locale) {
    masJs = `${masJs}?locale=${locale}`;
  }
  const script = document.createElement('script');
  script.type = 'module';
  script.src = masJs;
  document.head.append(script);
</script>

## Supported locales

| Locale     | Description                     | Try                       |
| ---------- | ------------------------------- | ------------------------- |
| US_en      | English (United States)         | [Try](/libs/features/mas/docs/mas.js.html)      |
| AR_es      | Spanish (Argentina)             | [Try](?locale=AR_es)      |
| AT_de      | German (Austria)                | [Try](?locale=AT_de)      |
| AU_en      | English (Australia)             | [Try](?locale=AU_en)      |
| AZ_en      | English (Azerbaijan)            | [Try](?locale=AZ_en)      |
| AZ_ru      | Russian (Azerbaijan)            | [Try](?locale=AZ_ru)      |
| BE_en      | English (Belgium)               | [Try](?locale=BE_en)      |
| BE_fr      | French (Belgium)                | [Try](?locale=BE_fr)      |
| BE_nl      | Dutch (Belgium)                 | [Try](?locale=BE_nl)      |
| BG_bg      | Bulgarian (Bulgaria)            | [Try](?locale=BG_bg)      |
| BR_pt      | Portuguese (Brazil)             | [Try](?locale=BR_pt)      |
| CA_en      | English (Canada)                | [Try](?locale=CA_en)      |
| CH_de      | German (Switzerland)            | [Try](?locale=CH_de)      |
| CH_fr      | French (Switzerland)            | [Try](?locale=CH_fr)      |
| CH_it      | Italian (Switzerland)           | [Try](?locale=CH_it)      |
| CL_es      | Spanish (Chile)                 | [Try](?locale=CL_es)      |
| CN_zh-Hans | Simplified Chinese (China)      | [Try](?locale=CN_zh-Hans) |
| CO_es      | Spanish (Colombia)              | [Try](?locale=CO_es)      |
| CR_es      | Spanish (Costa Rica)            | [Try](?locale=CR_es)      |
| CZ_cs      | Czech (Czech Republic)          | [Try](?locale=CZ_cs)      |
| DE_de      | German (Germany)                | [Try](?locale=DE_de)      |
| DK_da      | Danish (Denmark)                | [Try](?locale=DK_da)      |
| DO_es      | Spanish (Dominican Republic)    | [Try](?locale=DO_es)      |
| DZ_ar      | Arabic (Algeria)                | [Try](?locale=DZ_ar)      |
| DZ_en      | English (Algeria)               | [Try](?locale=DZ_en)      |
| EC_es      | Spanish (Ecuador)               | [Try](?locale=EC_es)      |
| EE_et      | Estonian (Estonia)              | [Try](?locale=EE_et)      |
| EG_ar      | Arabic (Egypt)                  | [Try](?locale=EG_ar)      |
| EG_en      | English (Egypt)                 | [Try](?locale=EG_en)      |
| ES_es      | Spanish (Spain)                 | [Try](?locale=ES_es)      |
| FI_fi      | Finnish (Finland)               | [Try](?locale=FI_fi)      |
| FR_fr      | French (France)                 | [Try](?locale=FR_fr)      |
| GB_en      | English (United Kingdom)        | [Try](?locale=GB_en)      |
| GR_el      | Greek (Greece)                  | [Try](?locale=GR_el)      |
| GR_en      | English (Greece)                | [Try](?locale=GR_en)      |
| GT_es      | Spanish (Guatemala)             | [Try](?locale=GT_es)      |
| HK_zh-hant | Traditional Chinese (Hong Kong) | [Try](?locale=HK_zh-hant) |
| HU_hu      | Hungarian (Hungary)             | [Try](?locale=HU_hu)      |
| ID_en      | English (Indonesia)             | [Try](?locale=ID_en)      |
| ID_in      | Indonesian (Indonesia)          | [Try](?locale=ID_in)      |
| IE_en      | English (Ireland)               | [Try](?locale=IE_en)      |
| IL_iw      | Hebrew (Israel)                 | [Try](?locale=IL_iw)      |
| IN_en      | English (India)                 | [Try](?locale=IN_en)      |
| IN_hi      | Hindi (India)                   | [Try](?locale=IN_hi)      |
| IT_it      | Italian (Italy)                 | [Try](?locale=IT_it)      |
| JP_ja      | Japanese (Japan)                | [Try](?locale=JP_ja)      |
| KR_ko      | Korean (South Korea)            | [Try](?locale=KR_ko)      |
| LT_lt      | Lithuanian (Lithuania)          | [Try](?locale=LT_lt)      |
| LU_de      | German (Luxembourg)             | [Try](?locale=LU_de)      |
| LU_en      | English (Luxembourg)            | [Try](?locale=LU_en)      |
| LU_fr      | French (Luxembourg)             | [Try](?locale=LU_fr)      |
| LV_lv      | Latvian (Latvia)                | [Try](?locale=LV_lv)      |
| MT_en      | English (Malta)                 | [Try](?locale=MT_en)      |
| MU_en      | English (Mauritius)             | [Try](?locale=MU_en)      |
| MX_es      | Spanish (Mexico)                | [Try](?locale=MX_es)      |
| MY_en      | English (Malaysia)              | [Try](?locale=MY_en)      |
| MY_ms      | Malay (Malaysia)                | [Try](?locale=MY_ms)      |
| NG_en      | English (Nigeria)               | [Try](?locale=NG_en)      |
| NL_nl      | Dutch (Netherlands)             | [Try](?locale=NL_nl)      |
| NO_nb      | Norwegian Bokmål (Norway)       | [Try](?locale=NO_nb)      |
| NZ_en      | English (New Zealand)           | [Try](?locale=NZ_en)      |
| PE_es      | Spanish (Peru)                  | [Try](?locale=PE_es)      |
| PL_pl      | Polish (Poland)                 | [Try](?locale=PL_pl)      |
| PT_pt      | Portuguese (Portugal)           | [Try](?locale=PT_pt)      |
| RO_ro      | Romanian (Romania)              | [Try](?locale=RO_ro)      |
| RU_ru      | Russian (Russia)                | [Try](?locale=RU_ru)      |
| SA_ar      | Arabic (Saudi Arabia)           | [Try](?locale=SA_ar)      |
| SA_en      | English (Saudi Arabia)          | [Try](?locale=SA_en)      |
| SE_sv      | Swedish (Sweden)                | [Try](?locale=SE_sv)      |
| SG_en      | English (Singapore)             | [Try](?locale=SG_en)      |
| SI_sl      | Slovenian (Slovenia)            | [Try](?locale=SI_sl)      |
| SK_sk      | Slovak (Slovakia)               | [Try](?locale=SK_sk)      |
| TH_en      | English (Thailand)              | [Try](?locale=TH_en)      |
| TH_th      | Thai (Thailand)                 | [Try](?locale=TH_th)      |
| TR_tr      | Turkish (Turkey)                | [Try](?locale=TR_tr)      |
| TW_zh-Hant | Traditional Chinese (Taiwan)    | [Try](?locale=TW_zh-Hant) |
| UA_uk      | Ukrainian (Ukraine)             | [Try](?locale=UA_uk)      |
| US_es      | Spanish (United States)         | [Try](?locale=US_es)      |
| ZA_en      | English (South Africa)          | [Try](?locale=ZA_en)      |
