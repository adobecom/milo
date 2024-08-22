class AEM {
    #author;
    constructor(bucket) {
        this.#author = /^author-/.test(bucket);
        const baseUrl = `https://${bucket}.adobeaemcloud.com`;
        const sitesUrl = `${baseUrl}/adobe/sites`;
        this.cfFragmentsUrl = `${sitesUrl}/cf/fragments`;
        this.cfSearchUrl = `${this.cfFragmentsUrl}/search`;
        this.cfPublishUrl = `${this.cfFragmentsUrl}/publish`;
        this.wcmcommandUrl = `${baseUrl}/bin/wcmcommand`;
        this.csrfTokenUrl = `${baseUrl}/libs/granite/csrf/token.json`;

        this.headers = {
            Authorization: `Bearer ${sessionStorage.getItem('masAccessToken') ?? window.adobeid?.authorize?.()}`,
            pragma: 'no-cache',
            'cache-control': 'no-cache',
        };
    }

    async getCsrfToken() {
        const { token } = await fetch(this.csrfTokenUrl, {
            headers: this.headers,
        }).then((res) => res.json());
        return token;
    }

    /**
     * Search for content fragments
     * @param {Object} params - The search options
     * @param {string} [params.path] - The path to search in
     * @param {string} [params.query] - The search query
     * @param {string} [params.variant] - The variant to filter by
     * @returns {Promise<Array>} - A promise that resolves to an array of search results
     */
    async searchFragment({ path, query, variant }) {
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
            headers: this.headers,
        })
            .then((res) => res.json())
            .then((json) => json.items)
            .then((items) => {
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
     * Get fragment by path
     * @param {string} path fragment path
     * @returns {Promise<Object>} the raw fragment item
     */
    async getFragmentByPath(path) {
        const headers = this.#author ? this.headers : {};
        return fetch(`${this.cfFragmentsUrl}?path=${path}`, { headers })
            .then((res) => res.json())
            .then(({ items: [item] }) => item);
    }

    async getFragment(res) {
        const eTag = res.headers.get('Etag');
        const fragment = await res.json();
        fragment.etag = eTag;
        return fragment;
    }

    /**
     * Get fragment by ID
     * @param {string} id fragment id
     * @returns {Promise<Object>} the raw fragment item
     */
    async getFragmentById(id) {
        return await fetch(`${this.cfFragmentsUrl}/${id}`, {
            headers: this.headers,
        }).then(this.getFragment);
    }

    /**
     * Save given fragment
     * @param {Object} fragment
     * @returns {Promise<Object>} the updated fragment
     */
    async saveFragment(fragment) {
        const { title, fields } = fragment;
        return await fetch(`${this.cfFragmentsUrl}/${fragment.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'If-Match': fragment.etag,
                ...this.headers,
            },
            body: JSON.stringify({ title, fields }),
        }).then(this.getFragment);
    }

    /**
     * Copy a content fragment using the AEM classic API
     * @param {Object} fragment
     * @returns {Promise<Object>} the copied fragment
     */
    async copyFragmentClassic(fragment) {
        const csrfToken = await this.getCsrfToken();
        let parentPath = fragment.path.split('/').slice(0, -1).join('/');
        const formData = new FormData();
        formData.append('cmd', 'copyPage');
        formData.append('srcPath', fragment.path);
        formData.append('destParentPath', parentPath);
        formData.append('shallow', 'false');
        formData.append('_charset_', 'UTF-8');

        const res = await fetch(this.wcmcommandUrl, {
            method: 'POST',
            headers: {
                ...this.headers,
                'csrf-token': csrfToken,
            },
            body: formData,
        });
        if (res.ok) {
            const responseText = await res.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(responseText, 'text/html');
            const message = doc.getElementById('Message');
            const newPath = message?.textContent.trim();
            return this.getFragmentByPath(newPath);
        }
        throw new Error('Failed to copy fragment');
    }

    /**
     * Publish a fragment
     * @param {Object} fragment
     * @returns {Promise<void>}
     */
    async publishFragment(fragment) {
        await fetch(this.cfPublishUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'If-Match': fragment.etag,
                ...this.headers,
            },
            body: JSON.stringify({
                paths: [fragment.path],
                filterReferencesByStatus: ['DRAFT', 'UNPUBLISHED'],
                workflowModelId:
                    '/var/workflow/models/scheduled_activation_with_references',
            }),
        });
    }

    /**
     * Delete a fragment
     * @param {Object} fragment
     * @returns {Promise<void>}
     */
    async deleteFragment(fragment) {
        await fetch(`${this.cfFragmentsUrl}/${fragment.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'If-Match': fragment.etag,
                ...this.headers,
            },
        });
    }

    sites = {
        cf: {
            fragments: {
                search: this.searchFragment.bind(this),
                getByPath: this.getFragmentByPath.bind(this),
                getById: this.getFragmentById.bind(this),
                save: this.saveFragment.bind(this),
                copy: this.copyFragmentClassic.bind(this),
                publish: this.publishFragment.bind(this),
                delete: this.deleteFragment.bind(this),
            },
        },
    };
}

export { AEM };
