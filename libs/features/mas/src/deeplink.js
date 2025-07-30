const EVENT_HASHCHANGE = 'hashchange';

/**
 * @param {*} hash string representing an URL hash
 * @returns an object representing the state set with key value pairs in the URL hash
 */
export function parseState(hash = window.location.hash) {
    const result = [];
    const keyValuePairs = hash.replace(/^#/, '').split('&');

    for (const pair of keyValuePairs) {
        const [key, value = ''] = pair.split('=');
        if (key) {
            result.push([key, decodeURIComponent(value.replace(/\+/g, ' '))]);
        }
    }
    return Object.fromEntries(result);
}

/**
 * push state of a component to the URL hash. Component is supposed to have
 *  a deeplink property, and value is supposed to be a non empty string
 * @param {*} component component with deeplink property
 * @param {*} value value to push as state
 */
export function pushStateFromComponent(component, value) {
    if (component.deeplink) {
        const state = {};
        state[component.deeplink] = value;
        pushState(state);
    }
}

export function pushState(state) {
    const hash = new URLSearchParams(window.location.hash.slice(1));
    Object.entries(state).forEach(([key, value]) => {
        if (value) {
            hash.set(key, value);
        } else {
            hash.delete(key);
        }
    });
    hash.sort();
    const value = hash.toString();
    if (value === window.location.hash) return;
    let lastScrollTop = window.scrollY || document.documentElement.scrollTop;
    window.location.hash = value;
    window.scrollTo(0, lastScrollTop);
}

function historyPushState(queryParams) {
    if (!queryParams || !window.history.pushState) return;
    const newURL = new URL(window.location.href);
    newURL.search = `?${queryParams}`;
    window.history.pushState({ path: newURL.href }, '', newURL.href);    
}

export function updateHash(key, value) {
    const hash = new URLSearchParams(window.location.hash.slice(1));
    hash.set(key, value);
    window.location.hash = hash.toString();
}
/**
 *Deep link helper
 * @param {*} callback function that expects an object with properties that have changed compared to previous state
 * @returns a disposer function that stops listening to hash changes
 */
export function deeplink(callback) {
    const handler = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const filterParam = urlParams.get('filter');
        if (filterParam && !window.location.hash.includes('filter=')) { // transfer filter param to hash
            window.location.hash = window.location.hash ? `${window.location.hash}&filter=${filterParam}` : `filter=${filterParam}`;
            urlParams.delete('filter');
            historyPushState(urlParams.toString());
        } else if (filterParam) { // in case of other hash kv exists.
            updateHash('filter', filterParam);
            urlParams.delete('filter');
            historyPushState(urlParams.toString());
        }
        if (window.location.hash && !window.location.hash.includes('=')) return;
        const state = parseState(window.location.hash);
        callback(state);
    };
    handler();
    window.addEventListener(EVENT_HASHCHANGE, handler);
    return () => {
        window.removeEventListener(EVENT_HASHCHANGE, handler);
    };
}
