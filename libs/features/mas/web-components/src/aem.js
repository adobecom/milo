const accessToken = window.adobeid?.authorize?.();

const headers = {
    Authorization: `Bearer ${accessToken}`,
    pragma: 'no-cache',
    'cache-control': 'no-cache',
};

/**
 * Search for content fragments
 * @param {Object} params - The search options
 * @param {string} [params.path] - The path to search in
 * @param {string} [params.query] - The search query
 * @returns {Promise<Array>} - A promise that resolves to an array of search results
 */
export async function searchFragment({ path, query }) {
    const filter = {};
    if (path) {
        filter.path = path;
    }
    if (query) {
        filter.fullText = {
            text: encodeURIComponent(query),
            queryMode: 'EXACT_WORDS',
        };
    }
    const searchParams = new URLSearchParams({
        query: JSON.stringify({ filter }),
    }).toString();
    return fetch(`${this.cfSearchUrl}?${searchParams}`, {
        headers,
    })
        .then((res) => res.json())
        .then((json) => json.items);
}

/**
 * @param {string} path fragment path
 * @returns the raw fragment item
 */
export async function getFragmentByPath(path) {
    return fetch(`${this.cfFragmentsUrl}?path=${path}`, {
        headers,
    })
        .then((res) => res.json())
        .then(({ items: [item] }) => item);
}

const getFragment = async (res) => {
  const eTag = res.headers.get('Etag');
    const fragment = await res.json();
    fragment.etag = eTag;
    return fragment;
};

/**
 * @param {string} id fragment id
 * @returns the raw fragment item
 */
export async function getFragmentById(id) {
    return await fetch(`${this.cfFragmentsUrl}/${id}`, {
        headers,
    }).then(getFragment);
}

/**
 * Save given fragment
 * @param {Object} fragment
 */
export async function saveFragment(fragment) {
    const { title, fields } = fragment;
    return await fetch(`${this.cfFragmentsUrl}/${fragment.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'If-Match': fragment.etag,
            ...headers,
        },
        body: JSON.stringify({ title, fields }),
    }).then(getFragment);
}

class AEM {
    sites = {
        cf: {
            fragments: {
                search: searchFragment.bind(this),
                getCfByPath: getFragmentByPath.bind(this),
                getCfById: getFragmentById.bind(this),
                save: saveFragment.bind(this),
            },
        },
    };

    constructor(bucket) {
        const baseUrl = `https://${bucket}.adobeaemcloud.com`;
        const sitesUrl = `${baseUrl}/adobe/sites`;
        this.cfFragmentsUrl = `${sitesUrl}/cf/fragments`;
        this.cfSearchUrl = `${this.cfFragmentsUrl}/search`;
    }
}

export { AEM };
