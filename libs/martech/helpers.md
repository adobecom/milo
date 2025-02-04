# Analytics and Interaction Data Management - Detailed Explanation

### Overview
This module handles interactions with Adobe's Experience Cloud services, including data collection, analytics tracking, and personalization. It works with cookies, device info, and user behavior data to generate and send requests to Adobe’s marketing and personalization systems.

---

## **1. `getDomainWithoutWWW()`**

**Description:**
This function retrieves the domain of the current webpage, stripping out the `www.` prefix if it exists. This is useful for handling domain-based cookies or API requests where the `www` prefix is irrelevant.

**Logic:**
- The function accesses the `hostname` from `window.location`, which contains the domain of the current page.
- It uses a regular expression (`/^www\./`) to remove the `www.` prefix, ensuring that the function returns only the domain name.

```javascript
function getDomainWithoutWWW() {
  const domain = window?.location?.hostname;
  return domain.replace(/^www\./, '');
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
- The `pathname` is split by the `locale.prefix` and cleaned up by removing unnecessary segments (like language prefixes).
- It then combines the host and the modified path to form a page name, which is returned for analytics tracking.

```javascript
function getPageNameForAnalytics({ locale }) {
  const { host, pathname } = new URL(window.location.href);
  const [modifiedPath] = pathname.split('/').filter((x) => x !== locale.prefix).join(':').split('.');
  return `${host.replace('www.', '')}:${modifiedPath}`;
}
```

**Returns:**
- `String`: A formatted page name based on the current URL, cleaned up by removing language-specific prefixes.

---

## **8. `getUpdatedContext()`**

**Description:**
This function returns an updated context object containing device, environment, and location-based information.

**Logic:**
- The function constructs a context object that includes:
  - **Device Information**: Screen size, orientation, and viewport size.
  - **Environment**: Details about the browser and viewport.
  - **Place Context**: Local time and timezone

 info.

```javascript
export const getUpdatedContext = () => ({
  device: {
    width: window.innerWidth,
    height: window.innerHeight,
    orientation: window.orientation || 'landscape',
    viewport: window.visualViewport,
  },
  environment: {
    userAgent: navigator.userAgent,
    viewport: window.visualViewport,
  },
  placeContext: {
    time: new Date().getHours(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  },
});
```

**Returns:**
- `Object`: Returns a detailed context object with information about the device, environment, and place.


## **`loadAnalyticsAndInteractionData` Function**

**Description:**
The `loadAnalyticsAndInteractionData` function is an asynchronous method designed to load analytics and interaction data, making necessary API calls and processing the response. It handles user consent checks, retrieves context data, constructs requests, and processes responses related to page views and propositions. Additionally, it interacts with personalization and activation systems based on the environment and hybrid personalization status.

### **Parameters:**
- **`locale`** (`object`): Locale configuration object, typically containing language and region.
- **`env`** (`string`): The environment setting, such as development, staging, or production.
- **`calculatedTimeout`** (`number`): The timeout duration for the fetch request in milliseconds.
- **`hybridPersEnabled`** (`boolean`): A flag indicating if hybrid personalization is enabled or not.

### **Logic Overview:**
1. **Consent Check:**
   - It first checks for user consent regarding tracking by inspecting a cookie (`kndctr_9E1005A551ED61CA0A490D45_AdobeOrg_consent`).
   - If the value of this cookie is `'general=out'`, the function immediately returns an empty object, indicating that tracking is disabled.

2. **Contextual Setup:**
   - The function then calculates the current date and time in ISO format and retrieves the user's timezone offset.
   - If hybrid personalization is enabled, it flags this by setting `window.hybridPers` to `true` and determines the appropriate `hitType` ('pageView' or 'propositionFetch').

3. **Analytics and Request Data:**
   - The function generates a page name using `getPageNameForAnalytics`, passing the locale.
   - It retrieves device information and adds the calculated time and timezone offset to create the `updatedContext`.

4. **Request Construction:**
   - A request URL and payload are generated using the environment (`env`), hit type (`hitType`), page name, and other context data.
   - The request body is then constructed using `createRequestPayload`.

5. **API Call:**
   - The function makes a `fetch` request with the request URL and body. It uses `Promise.race` to handle both the API request and a timeout.
   - If the request is successful, it processes the response data, extracting relevant details such as the ECID and any personalization data.

6. **Handling Responses:**
   - The function extracts the ECID from the API response, which is used for tracking.
   - It looks for specific payload keys (like `KNDCTR_COOKIE_KEYS[0]` and `KNDCTR_COOKIE_KEYS[1]`) and extracts personalization data if present.
   - If hybrid personalization is enabled, the function processes the personalization payloads, sending requests for propositions and activating personalization.

7. **Final Updates and Cookies:**
   - The ECID is updated in the AMC cookie, and other marketing-related cookies are updated with the extracted data.
   - A "GPV" (General Page View) cookie is set with the page name to track the page view.
   - The function returns an object with either the propositions (if successful) or an empty object (in case of errors or no propositions).

8. **Error Handling:**
   - If any error occurs during the request or processing, a default error message is logged, and the function returns an empty object.

---

### **Code:**

```javascript
export const loadAnalyticsAndInteractionData = async (
  { locale, env, calculatedTimeout, hybridPersEnabled },
) => {
  // Consent check: If tracking is not allowed, return an empty object
  const value = getCookie('kndctr_9E1005A551ED61CA0A490D45_AdobeOrg_consent');
  if (value === 'general=out') {
    return {}; // Consent denied, return empty object
  }

  // Get the current date and time in ISO format
  const CURRENT_DATE = new Date();
  const localTime = CURRENT_DATE.toISOString();

  // Get timezone offset for the user's location
  const timezoneOffset = CURRENT_DATE.getTimezoneOffset();

  // Set hybridPers flag if hybrid personalization is enabled
  if (hybridPersEnabled) {
    window.hybridPers = true;
  }
  
  // Define the hit type (either page view or proposition fetch)
  const hitType = hybridPersEnabled ? 'pageView' : 'propositionFetch';

  // Get the page name for analytics based on the locale
  const pageName = getPageNameForAnalytics({ locale });

  // Get updated context data including device info, local time, and timezone offset
  const updatedContext = getUpdatedContext({ ...getDeviceInfo(), localTime, timezoneOffset });

  // Create the request URL based on environment and hit type
  const requestUrl = createRequestUrl({
    env,
    hitType,
  });

  // Construct the request payload for the API
  const requestPayload = { updatedContext, pageName, locale, env, hitType };
  const requestBody = createRequestPayload(requestPayload);

  try {
    // Make a fetch request with timeout handling
    const targetResp = await Promise.race([
      fetch(requestUrl, {
        method: 'POST',
        body: JSON.stringify(requestBody),
      }),
      new Promise((_, reject) => { setTimeout(() => reject(new Error('Request timed out')), calculatedTimeout); }),
    ]);

    if (!targetResp.ok) {
      throw new Error('Failed to fetch interact call'); // Throw error if request fails
    }

    // Parse the JSON response
    const targetRespJson = await targetResp.json();

    // Extract ECID (Experience Cloud ID) from the response
    const ECID = targetRespJson.handle
      .flatMap((item) => item.payload)
      .find((p) => p.namespace?.code === 'ECID')?.id || null;

    // Prepare an array to store extracted data for cookies
    const extractedData = [];

    // Loop through the response to extract personalization data
    targetRespJson?.handle?.forEach((item) => {
      if (item?.type === 'state:store') {
        item?.payload?.forEach((payload) => {
          if (payload?.key === KNDCTR_COOKIE_KEYS[0] || payload?.key === KNDCTR_COOKIE_KEYS[1]) {
            extractedData.push({ ...payload });
          }
        });
      }
    });

    // Extract personalization decisions
    const resultPayload = getPayloadsByType(targetRespJson, 'personalization:decisions');

    if (hybridPersEnabled) {
      // Filter and send propositions if hybrid personalization is enabled
      const filteredPayload = filterPropositionInJson(resultPayload);
      if (filteredPayload.length) {
        sendPropositionDisplayRequest(filteredPayload, env, requestPayload);
      }

      // Prepare Alloy data (for analytics and personalization activation)
      const alloyData = {
        destinations: getPayloadsByType(targetRespJson, 'activation:pull'),
        propositions: resultPayload,
        inferences: getPayloadsByType(targetRespJson, 'rtml:inferences'),
        decisions: [],
      };

      // Dispatch Alloy event for integration with other systems
      window.dispatchEvent(new CustomEvent('alloy_sendEvent', { detail: alloyData }));
      setWindowAlloy(alloyData);
      setTTMetaAndAlloyTarget(resultPayload);
    }

    // Update cookies for tracking and personalization
    updateAMCVCookie(ECID);
    updateMartechCookies(extractedData);

    // If no propositions are found, throw an error
    if (resultPayload?.length === 0) throw new Error('No propositions found');

    // Set the GPV cookie for page view tracking
    setGpvCookie(pageName);

    // Return the result with propositions
    return {
      type: hitType,
      result: { propositions: resultPayload },
    };
  } catch (err) {
    // If an error occurs, log it (unless it's 'No propositions found')
    if (err.message !== 'No propositions found') {
      console.log(err);
    }

    // Set GPV cookie even in case of an error
    setGpvCookie(pageName);

    // Return an empty object in case of error or no propositions
    return {};
  }
};
```

### **Returns:**
- **`Object`:** 
  - If the operation succeeds, it returns an object containing:
    - `type`: The type of request (either `pageView` or `propositionFetch`).
    - `result`: An object containing the `propositions` found from the response.
  - If the operation fails or no propositions are found, it returns an empty object.

---

### **Key Components:**
- **Consent Check (`getCookie`)**: Verifies if user consent is given for tracking.
- **Context Setup (`getUpdatedContext`, `getDeviceInfo`)**: Collects the user's contextual information, such as device details and time zone.
- **Request Payload and URL Construction (`createRequestUrl`, `createRequestPayload`)**: Prepares the payload and URL for the API request.
- **API Fetch (`fetch`)**: Sends the request to the server and handles the response asynchronously.
- **Error Handling**: Handles errors such as timeouts, failed responses, and missing propositions.
