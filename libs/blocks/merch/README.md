# Commerce Settings

## WCS Locale
To check which locale was used to render the price/CTA:
* In the network tab search for a 'wcs' request, e.g.
https://wcs.adobe.com/web_commerce_artifact?offer_selector_ids=PpnQ-UmW9NBwZwXlFw79zw2JybhvwIUwMTDYiIlu5qI&country=DE&language=MULT&locale=de_DE&api_key=wcms-commerce-ims-ro-user-milo&landscape=PUBLISHED
* The 'country' parameter decides the format and exact price

### Where does the WCS 'country' parameter come from?
* Check the 'lang' parameter value on your page (it's set on <html> tag)
* If the value is special, e.g. 'africa', Commerce(tacocat) will do the mapping. Below is an example of GeoMap, for the latest visit [tacocat project](https://git.corp.adobe.com/wcms/tacocat.js)
```
const GeoMap = {
    africa: 'en-ZA',
    mena_en: 'en-DZ',
    il_he: 'iw-IL',
    mena_ar: 'ar-DZ',
    id_id: 'in-ID',
    no: 'nb-NO',
    cis_en: 'en-AZ',
    cis_ru: 'ru-AZ',
    SEA: 'en-SG',
};
```
* If the value is in format 'xx-YY' (case doesn't matter), for example 'en-GB', Commerce will split it in the 'xx' becoming a language and 'YY' a country.
* If the value is in format 'xx', language only, e.g. 'hi', Commerce will set language to hindi, but fetch US prices, as US is a default value for country
* In there is no value set, 'en' language and 'US' country is used

### Where does the 'lang' value come from?
scripts.js file, see 'locales' object, 'ietf' value.
