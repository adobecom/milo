# Analytics and Interaction Data Management - Detailed Explanation 

### Overview
This module handles interactions with Adobe's Experience Cloud services, including data collection, analytics tracking, and personalization. It works with cookies, device info, and user behavior data to generate and send requests to Adobe's marketing and personalization systems.

---

## **1. `getDomainWithoutWWW()`**

**Description:**
This function retrieves the domain of the current webpage, stripping out the `www.` prefix if it exists. This is useful for handling domain-based cookies or API requests where the `www` prefix is irrelevant.

**Logic:**
- The function accesses the `hostname` from `window.location`, which contains the domain of the current page.
- It splits the hostname by dots and takes the last two parts for domains with subdomains.
- For simple domains, it returns the hostname as-is.

```javascript
function getDomainWithoutWWW() {
  const parts = window.location.hostname.toLowerCase().split('.');
  if (parts.length >= 2) {
    return parts.slice(-2).join('.');
  }
  return window.location.hostname.toLowerCase();
}
```

**Returns:**
- `String`: The domain of the website without the `www.` prefix (e.g., `example.com` instead of `www.example.com`).

---

## **2. `generateUUIDv4()`**

**Description:**
This function generates a UUID (Universally Unique Identifier) based on random values, specifically version 4 of UUIDs. This version of UUIDs is commonly used for creating unique identifiers.

**Logic:**
- A `Uint8Array` of length 16 is created to hold random values.
- The `crypto.getRandomValues()` method is used to fill this array with cryptographically strong random values.
- The 6th and 8th bytes are modified to ensure the UUID adheres to the UUIDv4 specification (`version 4` and `variant 1`).
- The random values are then converted to hexadecimal and formatted in the UUID structure (`xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`).

```javascript
function generateUUIDv4() {
  const randomValues = new Uint8Array(16);
  crypto.getRandomValues(randomValues);
  randomValues[6] = (randomValues[6] % 16) + 64;
  randomValues[8] = (randomValues[8] % 16) + 128;
  let uuid = '';
  randomValues.forEach((byte, index) => {
    const hex = byte.toString(16).padStart(2, '0');
    if (index === 4 || index === 6 || index === 8 || index === 10) {
      uuid += '-';
    }
    uuid += hex;
  });
  return uuid;
}
```

**Returns:**
- `String`: A unique UUID in the format `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`.

---

## **3. `getCookie(key)`**

**Description:**
This function retrieves the value of a cookie by its `key`. It splits the cookies stored in `document.cookie` and searches for the one that matches the provided key.

**Logic:**
- The function splits `document.cookie` by the semicolon (`;`) into individual cookie key-value pairs.
- Each pair is then decoded and split by the `=` sign to separate the key from the value.
- The function searches for the matching key and returns its corresponding value if found.

```javascript
function getCookie(key) {
  const cookie = document.cookie.split(';')
    .map((x) => decodeURIComponent(x.trim()).split(/=(.*)/s))
    .find(([k]) => k === key);

  return cookie ? cookie[1] : null;
}
```

**Returns:**
- `String` (cookie value) or `null` if the cookie is not found.

---

## **4. `setCookie(key, value, options = {})`**

**Description:**
This function sets a cookie with the specified `key`, `value`, and optional attributes (such as expiration time). The cookie is set with a domain, path, and an optional expiration time.

**Logic:**
- The function calculates the cookie's expiration time based on the `expires` option (default is 730 days).
- The expiration date is converted to UTC format.
- It then constructs the cookie string with the `key`, `value`, and `expires` time.
- Finally, it writes the cookie to `document.cookie` with the specified options.

```javascript
function setCookie(key, value, options = {}) {
  const expires = options.expires || 730;
  const date = new Date();
  date.setTime(date.getTime() + expires * 24 * 60 * 60 * 1000);
  const expiresString = `expires=${date.toUTCString()}`;

  document.cookie = `${key}=${value}; ${expiresString}; path=/ ; domain=.${getDomainWithoutWWW()};`;
}
```

**Returns:**
- `void`: This function sets the cookie but does not return any value.

---

## **5. `getVisitorStatus()`**

**Description:**
This function determines whether the visitor is new or returning based on the `s_nr` cookie. It sets a new value for this cookie and returns either `'New'` or `'Repeat'`.

**Logic:**
- The current timestamp is compared with the timestamp stored in the `s_nr` cookie to check if the visitor is new or returning.
- If no cookie is found or the stored state is `New`, a new cookie is set with the current timestamp and state `New`.
- If the visitor is recognized as returning, the state is updated to `Repeat`.

```javascript
export const getVisitorStatus = ({
  expiryDays = 30,
  cookieName = 's_nr',
  domain = `.${(new URL(window.location.origin)).hostname}`,
}) => {
  const currentTime = new Date().getTime();
  const cookieValue = getCookie(cookieName) || '';
  const cookieAttributes = { expires: new Date(currentTime + expiryDays * 24 * 60 * 60 * 1000) };

  if (domain) {
    cookieAttributes.domain = domain;
  }

  if (!cookieValue) {
    setCookie(cookieName, `${currentTime}-New`, cookieAttributes);
    return 'New';
  }

  const [storedTime, storedState] = cookieValue.split('-').map((value) => value.trim());

  if (currentTime - storedTime < 30 * 60 * 1000 && storedState === 'New') {
    setCookie(cookieName, `${currentTime}-New`, cookieAttributes);
    return 'New';
  }

  setCookie(cookieName, `${currentTime}-Repeat`, cookieAttributes);
  return 'Repeat';
};
```

**Returns:**
- `String`: Returns `'New'` if it's the user's first visit or `'Repeat'` if it's a returning visit.

---

## **6. `getOrGenerateUserId()`**

**Description:**
This function attempts to retrieve the Adobe Experience Cloud (ECID) from the `AMCV` cookie. If it does not exist, it generates a new `FPID` (First Party ID) using the `generateUUIDv4` function.

**Logic:**
- It checks the `AMCV` cookie for the presence of a `MCMID` (Adobe ID). 
- If the `MCMID` is found, it returns the ECID stored in the cookie.
- If no valid ECID is found, it generates a new `FPID` (First Party ID) using a UUID generator function and returns that.

```javascript
function getOrGenerateUserId() {
  const amcvCookieValue = getCookie(AMCV_COOKIE);

  if (!amcvCookieValue || (amcvCookieValue.indexOf('MCMID|') === -1)) {
    const fpidValue = generateUUIDv4();
    return {
      FPID: [{
        id: fpidValue,
        authenticatedState: 'ambiguous',
        primary: true,
      }],
    };
  }

  return {
    ECID: [{
      id: amcvCookieValue.match(/MCMID\|([^|]+)/)?.[1],
      authenticatedState: 'ambiguous',
      primary: true,
    }],
  };
}
```

**Returns:**
- `Object`: Returns an object containing either `FPID` or `ECID` based on whether the user has an Adobe ID or not.

---

## **7. `getPageNameForAnalytics()`**

**Description:**
This function constructs the page name that will be used for analytics, taking into account the page's locale and the modified URL structure.

**Logic:**
- Extracts the `hostname` and `pathname` from the current URL.
- Removes unnecessary segments (like language prefixes) from the `pathname`.
- Combines the `hostname` and the cleaned-up `pathname` to form a page name.

```javascript
export function getPageNameForAnalytics() {
  const { hostname, pathname } = new URL(window.location.href);
  const urlRegions = Object.fromEntries(['ae_ar', 'ae_en', 'africa', 'apac', ...].map((r) => [r, 1]));

  const path = pathname.replace(/\.(aspx|php|html)/g, '').split('/').filter((s) => s && !urlRegions[s.toLowerCase()]).join(':');
  return `${hostname.replace('www.', '')}${path ? `:${path}` : ''}`;
}
```

**Returns:**
- `String`:  A formatted page name based on the current URL, cleaned up by removing language-specific prefixes.

---

## **8. `getUpdatedContext()`**

**Description:**
This function returns an updated context object containing device, environment, and location-based information.

**Logic:**
- The function constructs a context object that includes:
  - **Device Information**: Screen size, orientation, and viewport size.
  - **Environment**: Details about the browser and viewport.
  - **Place Context**: Local time and timezone information.

```javascript
function getUpdatedContext({
  screenWidth, screenHeight, screenOrientation,
  viewportWidth, viewportHeight, localTime, timezoneOffset,
}) {
  return {
    device: {
      screenHeight,
      screenWidth,
      screenOrientation,
    },
    environment: {
      type: 'browser',
      browserDetails: {
        viewportWidth,
        viewportHeight,
      },
    },
    placeContext: {
      localTime,
      localTimezoneOffset: timezoneOffset,
    },
  };
}
```

**Returns:**
- `Object`: Returns a detailed context object with information about the device, environment, and place.

---

## **9. `resolveAgiCampaignAndFlag()`**

**Description:**
This function resolves the AGI campaign and flag based on the current page, cookies, and user consent. It determines whether the user is part of a specific campaign or domain and sets the appropriate cookie values.

**Logic:**
- Checks if the user has consented to tracking using the `OptanonConsent` cookie.
- Determines if the user is on a specific campaign page or domain (e.g., Acrobat campaign pages).
- Sets or updates the `agiCamp` cookie with the appropriate value based on the campaign or domain.

```javascript
function resolveAgiCampaignAndFlag() {
  const { hostname, pathname, href } = window.location;
  const consentValue = getCookie(OPT_ON_AND_CONSENT_COOKIE);
  const EXPIRY_TIME_IN_DAYS = 90;
  const CAMPAIGN_PAGE_VALUE = '1';
  const ACROBAT_DOMAIN_VALUE = '2';

  if (!consentValue?.includes('C0002:1')) {
    return { agiCampaign: false, setAgICampVal: false };
  }

  const agiCookie = getCookie('agiCamp');
  const setAgiCookie = (value) => {
    setCookie('agiCamp', value, {
      expires: EXPIRY_TIME_IN_DAYS,
      domain: getDomainWithoutWWW(),
    });
  };

  const campaignRegex = /ttid=(all-in-one|reliable|versatile|combine-organize-e-sign|webforms-edit-e-sign)/;
  const isGotItPage = pathname.includes('/acrobat/campaign/acrobats-got-it.html') && campaignRegex.test(href);
  const isAcrobatDomain = hostname === 'acrobat.adobe.com' || (hostname === 'www.adobe.com' && pathname.includes('/acrobat'));

  let agiCampaign = false;

  if (isGotItPage && (!agiCookie || agiCookie !== ACROBAT_DOMAIN_VALUE)) {
    setAgiCookie(CAMPAIGN_PAGE_VALUE);
    agiCampaign = CAMPAIGN_PAGE_VALUE;
  } else if (isAcrobatDomain && (!agiCookie || agiCookie !== CAMPAIGN_PAGE_VALUE)) {
    if (agiCookie === ACROBAT_DOMAIN_VALUE) return { agiCampaign: false, setAgICampVal: false };
    setAgiCookie(ACROBAT_DOMAIN_VALUE);
    agiCampaign = ACROBAT_DOMAIN_VALUE;
  }

  const setAgICampVal = agiCampaign === CAMPAIGN_PAGE_VALUE || agiCampaign === ACROBAT_DOMAIN_VALUE;
  return { agiCampaign, setAgICampVal };
}
```

**Returns:**
- `Object`: An object containing -
        agiCampaign (String|Boolean): The campaign value or false if no campaign is active.
        setAgICampVal (Boolean): Whether the campaign value was set.

---

## **10. `getGlobalPrivacyControl()`**

**Description:**
This function checks if the browser's Global Privacy Control (GPC) signal is enabled and returns its value.

**Logic:**
- Checks if the `navigator.globalPrivacyControl` property exists.
- If it exists, returns its value as a string (`'true'` or `'false'`).
- If it does not exist, returns an empty string.

```javascript
function getGlobalPrivacyControl() {
  if (!navigator || !navigator.globalPrivacyControl) return '';
  return navigator.globalPrivacyControl.toString();
}
``` 

**Returns:**
- String: 'true' if GPC is enabled, 'false' if disabled, or an empty string if not supported.

---

## **11. `getEntityId()`**

**Description:**
This function retrieves the entity ID from the meta tag or returns a hardcoded value for specific URLs.

**Logic:**
- If the current URL matches `https://www.adobe.com/express/`, it returns a hardcoded entity ID.
- Otherwise, it searches for a meta tag with the name `entity_id` and retrieves its `content` attribute.

```javascript
function getEntityId() {
  if (window.location.href === 'https://www.adobe.com/express/') {
    return 'a2c4e4e4-eaa9-11ed-a05b-0242ac120003';
  }
  const metaTag = document.querySelector('meta[name="entity_id"]');
  return metaTag ? metaTag.getAttribute('content') : null;
}
```

**Returns:**
- String: The entity ID from the meta tag or a hardcoded value for specific URLs.

---

## **12. `getProcessedPageNameForAnalytics()`**

**Description:**
This function processes the page name further by applying specific filters for different Adobe domains and their associated paths.

**Logic:**
- Retrieves the page name using `getPageNameForAnalytics()`.
- Splits the page name into an array and applies filters based on predefined rules for specific domains (e.g., `lightroom.adobe.com`, `stock.adobe.com`).
- Returns the filtered page name.

```javascript
export function getProcessedPageNameForAnalytics() {
  const pageName = getPageNameForAnalytics().toLowerCase();
  const pageArray = pageName.split(':');

  const FILTERS = {
    lightroom: ['lightroom.adobe.com', 'embed', 'shares', ...],
    stock: ['stock.adobe.com', '3d-assets', 'aaid', ...],
    ...
  };

  for (const [, filter] of Object.entries(FILTERS)) {
    if (pageName.startsWith(filter[0])) {
      const filtered = pageArray.filter((value) => filter.includes(value)).join(':');
      return filtered;
    }
  }

  return pageName;
}
```

**Returns:**
- `String`:  A processed page name based on predefined filters for specific domains.

---

## **13. `getPrimaryProduct()`**

**Description:**
This function retrieves the primary product name from the meta tag `primaryproductname`.

**Logic:**
- Searches for a meta tag with the name `primaryproductname`.
- Returns the `content` attribute of the meta tag if it exists, or `null` otherwise.

```javascript
function getPrimaryProduct() {
  const productNameMeta = document.querySelector('meta[name="primaryproductname"]');
  return productNameMeta?.content || null;
}
```

**Returns:**
- `String`:  The primary product name or null if the meta tag is not found.

---

## **14. `getLanguageCode()`**

**Description:**
This function determines the language code based on the provided locale object. It falls back to `'en-US'` if the locale or region is undefined.

**Logic:**
- Extracts the `region` property from the `locale` object.
- Maps the region to a language code using the `LOCALE_MAPPINGS` constant.
- Falls back to `'en-US'` if the region is not found.

```javascript
export function getLanguageCode(locale) {
  const prefix = locale?.prefix?.replace(/^\//, '') || '';
  return LOCALE_MAPPINGS[prefix] || LOCALE_MAPPINGS[''];
}
```

**Returns:**
- `String`:  The language code corresponding to the region, or 'en-US' as a fallback.

---

## **15. `getUpdatedAcrobatVisitAttempt()`**

**Description:**
This function tracks and updates the number of visits to Acrobat-related pages on Adobe domains.

**Logic:**
- Checks if the user is on an Acrobat-related page on Adobe domains.
- If the user has consented to tracking (via the `OptanonConsent` cookie), increments the visit count stored in `localStorage`.
- Returns the updated visit count.

```javascript
function getUpdatedAcrobatVisitAttempt() {
  const { hostname, pathname } = window.location;
  const secondVisitAttempt = Number(localStorage.getItem('acrobatSecondHit')) || 0;

  const isAdobeDomain = (hostname === 'www.adobe.com' || hostname === 'www.stage.adobe.com') && /\/acrobat/.test(pathname);
  const consentCookieValue = getCookie(OPT_ON_AND_CONSENT_COOKIE);

  if (!consentCookieValue?.includes('C0002:0') && isAdobeDomain && secondVisitAttempt <= 2) {
    const updatedVisitAttempt = secondVisitAttempt === 0 ? 1 : secondVisitAttempt + 1;
    localStorage.setItem('acrobatSecondHit', updatedVisitAttempt);
    return updatedVisitAttempt;
  }

  return secondVisitAttempt;
}
```

**Returns:**
- `Number`: The updated visit count for Acrobat-related pages.

---

## **16. `getUpdatedDxVisitAttempt()`**

**Description:**
This function tracks and updates the number of visits to Adobe Experience Cloud (DX) pages.

**Logic:**
- Checks if the user is on a DX-related domain.
- If the user has consented to tracking, increments the visit count stored in `localStorage`.
- Returns the updated visit count.

```javascript
function getUpdatedDxVisitAttempt() {
  const { hostname } = window.location;
  const secondVisitAttempt = Number(localStorage.getItem('dxHit')) || 0;

  const isAdobeDomain = (hostname === 'business.adobe.com' || hostname === 'business.stage.adobe.com' || hostname === 'www.marketo.com' || hostname === 'engage.marketo.com');
  const consentCookieValue = getCookie(OPT_ON_AND_CONSENT_COOKIE);

  if (!consentCookieValue?.includes('C0002:0') && isAdobeDomain && secondVisitAttempt <= 2) {
    const updatedVisitAttempt = secondVisitAttempt === 0 ? 1 : secondVisitAttempt + 1;
    localStorage.setItem('dxHit', updatedVisitAttempt);
    return updatedVisitAttempt;
  }

  return secondVisitAttempt;
}
```

**Returns:**
- `Number`: The updated visit count for DX-related pages.

---

## **17. `getMartechCookies()`**

**Description:**
This function retrieves specific marketing technology cookies from the document.

**Logic:**
- Splits the document cookies by semicolon.
- Filters cookies based on the provided keys.
- Returns an array of cookie objects with key-value pairs.

```javascript
const getMartechCookies = () => document.cookie.split(';')
  .map((x) => x.trim().split('='))
  .filter(([key]) => KNDCTR_COOKIE_KEYS.includes(key))
  .map(([key, value]) => ({ key, value }));
```

**Returns:**
- `Array`: Array of cookie objects with key and value properties.

---

## **18. `getCookiesByKeys()`**

**Description:**
This function efficiently retrieves multiple cookies by their keys in a single operation.

**Logic:**
- Splits document cookies by semicolon.
- Handles cookies with multiple `=` signs correctly by splitting only on the first `=` sign.
- Decodes URI components for proper cookie value handling.
- Filters cookies based on the provided key array.

```javascript
function getCookiesByKeys(cookieKeys) {
  if (!document.cookie || !cookieKeys?.length) return [];

  return document.cookie
    .split(';')
    .map((cookie) => {
      const [key, ...valueParts] = cookie.trim().split('=');
      const value = valueParts.join('=');
      return { key, value: decodeURIComponent(value) || '' };
    })
    .filter((cookie) => cookieKeys.includes(cookie.key));
}
```

**Returns:**
- `Array`: Array of cookie objects with key and value properties for the specified keys.

---

## **19. `getConsentConfiguration()`**

**Description:**
This function converts a consent string into a structured configuration object, supporting both old and new Optanon formats.

**Logic:**
- Checks if consent state is 'post' and no Optanon cookie exists (implicit consent).
- Detects Optanon format by checking for `&` and `groups=` parameters.
- Parses new Optanon format by extracting the groups parameter and decoding it.
- Falls back to old semicolon-separated format parsing.
- Returns configuration object with performance, functional, and advertising consent flags.

```javascript
function getConsentConfiguration({ consentState, optOnConsentCookie }) {
  if (consentState === 'post' && !optOnConsentCookie) {
    return {
      configuration: {
        performance: true,
        functional: true,
        advertising: true,
      },
    };
  }

  let consent = {};

  if (optOnConsentCookie) {
    if (optOnConsentCookie.includes('&') && optOnConsentCookie.includes('groups=')) {
      const groupsMatch = optOnConsentCookie.match(/groups=([^&]*)/);
      if (groupsMatch) {
        const groupsString = decodeURIComponent(groupsMatch[1]);
        consent = Object.fromEntries(
          groupsString.split(',').map((group) => group.split(':')),
        );
      }
    } else {
      consent = Object.fromEntries(
        optOnConsentCookie.split(';').map((cat) => cat.split(':')),
      );
    }
  }

  return {
    configuration: {
      performance: consent.C0002 === '1',
      functional: consent.C0003 === '1',
      advertising: consent.C0004 === '1',
    },
  };
}
```

**Returns:**
- `Object`: Configuration object with consent flags for different categories.

---

## **20. `createRequestPayload()`**

**Description:**
This function creates the request payload for Adobe Experience Cloud API calls with enhanced consent management.

**Logic:**
- Retrieves multiple cookies efficiently using `getCookiesByKeys()`.
- Determines consent state based on server timing country and explicit consent countries.
- Constructs a comprehensive event object with user context, page details, and consent information.
- Handles different hit types (page view, proposition display, etc.).

**Key Features:**
- **Consent State Detection**: Uses server timing country and explicit consent countries to determine CMP state.
- **Cookie Management**: Efficiently retrieves multiple cookies in one operation.
- **Context Building**: Creates comprehensive user and page context for analytics.
- **Country-Aware Logic**: Handles explicit vs implicit consent countries differently.

```javascript
function createRequestPayload({ updatedContext, pageName, processedPageName, locale, hitType }) {
  const cookies = getCookiesByKeys([
    GPV_COOKIE, OPT_ON_AND_CONSENT_COOKIE, KNDCTR_CONSENT_COOKIE,
  ]);
  
  // Server timing country detection
  const serverTiming = window.performance?.getEntriesByType('navigation')?.[0]?.serverTiming?.reduce(
    (acc, { name, description }) => ({ ...acc, [name]: description }),
    {},
  );
  const serverTimingCountry = serverTiming?.geo;

  // Consent state determination
  const getConsentState = () => {
    const isExplicitConsentCountry = serverTimingCountry
    && _explicitConsentCountries.includes(serverTimingCountry.toLowerCase());

    if (kndctrConsentCookie || (serverTimingCountry && !isExplicitConsentCountry)) {
      return 'post';
    }

    if (optOnConsentCookie || isExplicitConsentCountry) {
      return 'pre';
    }

    return 'unknown';
  };

  const consentState = getConsentState();
  
  // Event object construction
  const eventObj = {
    xdm: { /* Experience Data Model */ },
    data: { /* Adobe-specific data */ }
  };

  return eventObj;
}
```

**Returns:**
- `Object`: Complete request payload for Adobe Experience Cloud API.

---

## **21. `loadAnalyticsAndInteractionData()`**

**Description:**
The main function that orchestrates the entire analytics and interaction data loading process with enhanced consent management.

**Logic:**
1. **Consent Validation**: Checks user consent for tracking using KNDCTR consent cookie.
2. **Context Setup**: Gathers device, time, and location information.
3. **Request Construction**: Creates API request payload and URL with country-aware consent logic.
4. **API Interaction**: Makes requests to Adobe Experience Cloud.
5. **Response Processing**: Handles personalization data and propositions.
6. **Cookie Updates**: Updates tracking and consent cookies.
7. **Event Dispatching**: Triggers events for other systems.

**Key Components:**
- **Consent Management**: Integrates with multiple consent systems (KNDCTR, Adobe Privacy, Optanon).
- **Performance Optimization**: Uses efficient cookie parsing and country detection.
- **Error Handling**: Graceful fallbacks and comprehensive error logging.
- **Integration**: Works with Adobe Alloy, Target, and other Experience Cloud services.
- **Country Detection**: Uses server timing for geographic-based consent logic.

```javascript
export const loadAnalyticsAndInteractionData = async (
  { locale, env, calculatedTimeout },
) => {
  // Consent check and early return
  const value = getCookie(KNDCTR_CONSENT_COOKIE);
  if (value === 'general=out') {
    return {};
  }

  // Context and request setup
  const localTime = getLocalISOString();
  const timezoneOffset = new Date().getTimezoneOffset();
  const pageName = getPageNameForAnalytics();
  const processedPageName = getProcessedPageNameForAnalytics();
  const updatedContext = getUpdatedContext({ ...getDeviceInfo(), localTime, timezoneOffset });

  // API request and response handling
  try {
    const targetResp = await Promise.race([
      fetch(requestUrl, { method: 'POST', body: JSON.stringify(requestBody) }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Request timed out')), calculatedTimeout))
    ]);

    // Process response and update cookies
    const targetRespJson = await targetResp.json();
    const ECID = extractECID(targetRespJson);
    const propositions = extractPropositions(targetRespJson);
    
    // Update cookies and dispatch events
    updateAMCVCookie(ECID);
    updateMartechCookies(extractedData);
    window.dispatchEvent(new CustomEvent('alloy_sendEvent', { detail: alloyData }));

    return { type: hitType, result: { propositions } };
  } catch (err) {
    console.log(err);
    return {};
  }
};
```

**Returns:**
- **Success**: Object with hit type and propositions.
- **Failure**: Empty object with error logging.

---

### **Key Constants and Configuration:**

- **Cookie Keys**: KNDCTR, Optanon, and GPV cookie identifiers.
- **Data Stream IDs**: Production and staging environment configurations.
- **Explicit Consent Countries**: List of countries requiring explicit user consent.
- **Event Type Mapping**: Mapping between internal hit types and Adobe event types.

### **Integration Points:**

- **Adobe Experience Cloud**: Primary analytics and personalization platform.
- **Adobe Target**: A/B testing and personalization.
- **Adobe Alloy**: Unified SDK for Experience Cloud.
- **Cookie Management**: Consent and tracking cookie handling.
- **Performance Monitoring**: Server timing and country detection.

### **Consent Management Features:**

- **Dual Format Support**: Handles both old semicolon-separated and new Optanon formats.
- **Country-Aware Logic**: Different consent handling for GDPR vs non-GDPR countries.
- **Server Timing Integration**: Uses geographic information for consent state determination.
- **Performance Optimization**: Efficient cookie parsing and batch retrieval.
- **Fallback Mechanisms**: Graceful handling of missing or malformed consent data.

This module serves as the core integration point between Milo and Adobe's Experience Cloud services, providing comprehensive analytics, personalization, and consent management capabilities with enhanced geographic awareness and format flexibility.
