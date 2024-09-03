import { wait } from './utils.js';

class AEMError extends Error {
    constructor(message, details = {}) {
        super(message);
        this.name = 'AEMError';
        this.details = details;
    }
}

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
            // IMS users might not have all the permissions, token in the sessionStorage is a temporary workaround
            Authorization: `Bearer ${sessionStorage.getItem('masAccessToken') ?? window.adobeid?.authorize?.()}`,
            pragma: 'no-cache',
            'cache-control': 'no-cache',
        };
    }

    async getCsrfToken() {
        const response = await fetch(this.csrfTokenUrl, {
            headers: this.headers,
        });
        if (!response.ok) {
            throw new AEMError(
                `Failed to get CSRF token: ${response.status} ${response.statusText}`,
            );
        }
        const { token } = await response.json();
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
        const response = await fetch(`${this.cfSearchUrl}?${searchParams}`, {
            headers: this.headers,
        });
        if (!response.ok) {
            throw new AEMError(
                `Search failed: ${response.status} ${response.statusText}`,
            );
        }
        const json = await response.json();
        let items = json.items;
        if (variant) {
            items = items.filter((item) => {
                const [itemVariant] = item.fields.find(
                    (field) => field.name === 'variant',
                )?.values;
                return itemVariant === variant;
            });
        }
        return items;
    }

    /**
     * Get fragment by path
     * @param {string} path fragment path
     * @returns {Promise<Object>} the raw fragment item
     */
    async getFragmentByPath(path) {
        const headers = this.#author ? this.headers : {};
        const response = await fetch(`${this.cfFragmentsUrl}?path=${path}`, {
            headers,
        });
        if (!response.ok) {
            throw new AEMError(
                `Failed to get fragment: ${response.status} ${response.statusText}`,
            );
        }
        const { items } = await response.json();
        if (!items || items.length === 0) {
            throw new AEMError('Fragment not found');
        }
        return items[0];
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
        const response = await fetch(`${this.cfFragmentsUrl}/${id}`, {
            headers: this.headers,
        });
        if (!response.ok) {
            throw new AEMError(
                `Failed to get fragment: ${response.status} ${response.statusText}`,
            );
        }
        return await this.getFragment(response);
    }

    /**
     * Save given fragment
     * @param {Object} fragment
     * @returns {Promise<Object>} the updated fragment
     */
    async saveFragment(fragment) {
        const { title, fields } = fragment;
        const response = await fetch(`${this.cfFragmentsUrl}/${fragment.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'If-Match': fragment.etag,
                ...this.headers,
            },
            body: JSON.stringify({ title, fields }),
        });
        if (!response.ok) {
            throw new AEMError(
                `Failed to save fragment: ${response.status} ${response.statusText}`,
            );
        }
        return await this.getFragment(response);
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
        if (!res.ok) {
            throw new AEMError(
                `Failed to copy fragment: ${res.status} ${res.statusText}`,
            );
        }
        const responseText = await res.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(responseText, 'text/html');
        const message = doc.getElementById('Message');
        const newPath = message?.textContent.trim();
        if (!newPath) {
            throw new AEMError('Failed to extract new path from copy response');
        }
        await wait(); // give AEM time to process the copy
        let newFragment = await this.getFragmentByPath(newPath);
        if (newFragment) {
            newFragment = await this.getFragmentById(newFragment.id);
        }
        return newFragment;
    }

    /**
     * Publish a fragment
     * @param {Object} fragment
     * @returns {Promise<void>}
     */
    async publishFragment(fragment) {
        const response = await fetch(this.cfPublishUrl, {
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
        if (!response.ok) {
            throw new AEMError(
                `Failed to publish fragment: ${response.status} ${response.statusText}`,
            );
        }
        return await response.json();
    }

    /**
     * Delete a fragment
     * @param {Object} fragment
     * @returns {Promise<void>}
     */
    async deleteFragment(fragment) {
        const response = await fetch(`${this.cfFragmentsUrl}/${fragment.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'If-Match': fragment.etag,
                ...this.headers,
            },
        });
        if (!response.ok) {
            throw new AEMError(
                `Failed to delete fragment: ${response.status} ${response.statusText}`,
            );
        }
        return response; //204 No Content
    }

    sites = {
        cf: {
            fragments: {
                /**
                 * @see AEM#searchFragment
                 */
                search: this.searchFragment.bind(this),
                /**
                 * @see AEM#getFragmentByPath
                 */
                getByPath: this.getFragmentByPath.bind(this),
                /**
                 * @see AEM#getFragmentById
                 */
                getById: this.getFragmentById.bind(this),
                /**
                 * @see AEM#saveFragment
                 */
                save: this.saveFragment.bind(this),
                /**
                 * @see AEM#copyFragmentClassic
                 */
                copy: this.copyFragmentClassic.bind(this),
                /**
                 * @see AEM#publishFragment
                 */
                publish: this.publishFragment.bind(this),
                /**
                 * @see AEM#deleteFragment
                 */
                delete: this.deleteFragment.bind(this),
            },
        },
    };
}

export { AEM, AEMError };
