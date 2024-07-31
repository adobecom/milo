const accessToken = localStorage.getItem('masAccessToken');

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
async function fragmentSearch({ path, query }) {
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
        .then(({ items }) => items);
}

async function getCfByPath(path) {
    return fetch(`${this.cfFragmentsUrl}?path=${path}`, {
        headers,
    })
        .then((res) => res.json())
        .then(({ items: [item] }) => item);
}

class AEM {
    sites = {
        cf: {
            fragments: {
                search: fragmentSearch.bind(this),
                getCfByPath: getCfByPath.bind(this),
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
