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


### Switch Modal (Upgrade Flow)
Most of logic is separated to upgrade.js to not be loaded for every user.
upgrade.js will only load for logged in user and if the page has upgrade offer in merch-offers block

`MANAGE_PLAN_MSG_SUBTYPE` is taken from Message Data Structure: https://wiki.corp.adobe.com/pages/viewpage.action?spaceKey=IdentityACCM&title=Manage+Plan+Integration


Metadata 'switch-modal' format is 'switch-modal'PHOTOSHOP, ILLUSTRATOR: CC_ALL_APPS'
 * 'sourcePF' source product family, e.g. PHOTOSHOP or ILLUSTRATOR
 * 'targetPF' target product family, e.g. CC_ALL_APPS
 
The `handleUpgradeOffer` method checks if:
1. The CTA is in the list of upgrade targets, e.g. CC_ALL_APPS
2. The user is signed in
3. The user doesn't have an upgrade target, e.g. CC_ALL_APPS already
4. The user has an upgrade source offer, e.g. PHOTOSHOP or ILLUSTRATOR, etc.
 

`handleIFrameEvents` will:
* `MANAGE_PLAN_MSG_SUBTYPE.EXTERNAL` - Will open a page in a new tab
* `MANAGE_PLAN_MSG_SUBTYPE.SWITCH` - Will open a page in the same tab, and we do not have to handle the return back case
* `MANAGE_PLAN_MSG_SUBTYPE.RETURN_BACK` - Will open a PayPal page in the same tab. After user returns from PayPal, there will be 'pp' and 'token' query parameters in the page URL, which are used together with upgradeModalReturnUrl saved in session storage to create a proper iFrame URL 
* `MANAGE_PLAN_MSG_SUBTYPE.Close` - If user visited PayPal, the 'pp' and 'token' params were appended in the page URL. They will be removed both from page URL, and from the upgradeQuerystring
If message data can't be JSON.parse()-d, the message is ignored.
