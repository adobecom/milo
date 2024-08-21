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
export async function searchFragment({ path, query, variant }) {
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
        .then((json) => json.items)
        .then((items) => {
            // filter by variant
            if (variant) {
                return items.filter((item) => {
                    const [itemVariant] = item.fields.find(
                        (field) => field.name === 'variant',
                    )?.values;
                    return itemVariant === variant;
                });
            }
            return items;
        });
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

/**
 * Copy a content fragment
 * see: https://adobe-sites.redoc.ly/tag/Fragment-Management/#operation/fragments/copy
 * @param {Object} fragment
 */
export async function copyFragment(fragment) {
    // extract the last part in the path as name
    let name = fragment.path.split('/').pop();
    if (/copy\s?\d?/.test(fragment.title)) {
        // increment the copy number
        let suffix = fragment.name.match(/copy\s?(\d)?/)[1] || 1;
        name = fragment.name.replace(/copy\s?\d?/, `copy ${++suffix}`);
    } else {
        // first copy
        name = `${name}-copy-1`;
    }
    return await fetch(`${this.cfFragmentsUrl}/${fragment.id}/copy`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'If-Match': fragment.etag,
            ...headers,
        },
        body: JSON.stringify({ name }),
    }).then(getFragment);
}

/**
 * Copy a content fragment using the AEM classic API
 * @param {Object} fragment
 */
export async function copyFragmentClassic(fragment) {
    const csrfToken = await this.getCsrfToken();
    // extract the last part in the path as name
    let name = fragment.path.split('/').pop();
    // parent folder
    let parentPath = fragment.path.split('/').slice(0, -1).join('/');
    if (/copy\s?\d?/.test(fragment.title)) {
        // increment the copy number
        let suffix = fragment.name.match(/copy\s?(\d)?/)[1] || 1;
        name = fragment.name.replace(/copy\s?\d?/, `copy ${++suffix}`);
    } else {
        // first copy
        name = `${name}-copy-1`;
    }
    const formData = new FormData();
    formData.append('cmd', 'copyPage');
    formData.append('srcPath', fragment.path);
    formData.append('destParentPath', parentPath);
    formData.append('shallow', 'false');
    formData.append('_charset_', 'UTF-8');
    formData.append('destName', name);
    formData.append('destTitle', fragment.title);

    return await fetch(this.wcmcommandUrl, {
        method: 'POST',
        headers: {
            ...headers,
            'csrf-token': csrfToken,
        },
        body: formData,
    }).then((res) => {
        if (res.ok) {
            return getFragmentById(fragment.path);
        }
    });
}

export async function publishFragment(fragment) {
    await fetch(this.cfPublishUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'If-Match': fragment.etag,
            ...headers,
        },
        body: JSON.stringify({
            paths: [fragment.path],
            filterReferencesByStatus: ['DRAFT', 'UNPUBLISHED'],
        }),
    });
}

export async function deleteFragment(fragment) {
    await fetch(`${this.cfFragmentsUrl}/${fragment.id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'If-Match': fragment.etag,
            ...headers,
        },
    });
}

class AEM {
    async getCsrfToken() {
        const { token } = await fetch(this.csrfTokenUrl, {
            headers,
        }).then((res) => res.json());
        return token;
    }

    sites = {
        cf: {
            fragments: {
                search: searchFragment.bind(this),
                getCfByPath: getFragmentByPath.bind(this),
                getCfById: getFragmentById.bind(this),
                save: saveFragment.bind(this),
                copyFragment: copyFragmentClassic.bind(this),
                publish: publishFragment.bind(this),
                delete: deleteFragment.bind(this),
                //unpublish: unpublishFragment.bind(this),
            },
        },
    };

    constructor(bucket) {
        const baseUrl = `https://${bucket}.adobeaemcloud.com`;
        const sitesUrl = `${baseUrl}/adobe/sites`;
        this.cfFragmentsUrl = `${sitesUrl}/cf/fragments`;
        this.cfSearchUrl = `${this.cfFragmentsUrl}/search`;
        this.cfPublishUrl = `${this.cfFragmentsUrl}/publish`;
        this.wcmcommandUrl = `${baseUrl}/bin/wcmcommand`;
        this.csrfTokenUrl = `${baseUrl}/libs/granite/csrf/token.json`;
    }
}

export { AEM };
