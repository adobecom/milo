import { getFragmentById, getFragment } from './getFragmentById.js';
import { wait } from './utils.js';

const NETWORK_ERROR_MESSAGE = 'Network error';

const defaultSearchOptions = {
    sort: [{ on: 'created', order: 'ASC' }],
};

class AEM {
    #author;
    constructor(bucket, baseUrlOverride) {
        this.#author = /^author-/.test(bucket);
        const baseUrl =
            baseUrlOverride || `https://${bucket}.adobeaemcloud.com`;
        this.baseUrl = baseUrl;
        const sitesUrl = `${baseUrl}/adobe/sites`;
        this.cfFragmentsUrl = `${sitesUrl}/cf/fragments`;
        this.cfSearchUrl = `${this.cfFragmentsUrl}/search`;
        this.cfPublishUrl = `${this.cfFragmentsUrl}/publish`;
        this.wcmcommandUrl = `${baseUrl}/bin/wcmcommand`;
        this.csrfTokenUrl = `${baseUrl}/libs/granite/csrf/token.json`;
        this.foldersUrl = `${baseUrl}/adobe/folders`;
        this.foldersClassicUrl = `${baseUrl}/api/assets`;

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
        }).catch((err) => {
            throw new Error(`${NETWORK_ERROR_MESSAGE}: ${err.message}`);
        });
        if (!response.ok) {
            throw new Error(
                `Failed to get CSRF token: ${response.status} ${response.statusText}`,
            );
        }
        const { token } = await response.json();
        return token;
    }

    /**
     * Search for content fragments.
     * @param {Object} params - The search options
     * @param {string} [params.path] - The path to search in
     * @param {string} [params.query] - The search query
     * @returns A generator function that fetches all the matching data using a cursor that is returned by the search API
     */
    async *searchFragment({ path, query = '', sort }) {
        const filter = {
            path,
        };
        if (query) {
            filter.fullText = {
                text: encodeURIComponent(query),
                queryMode: 'EXACT_WORDS',
            };
        } else {
            filter.onlyDirectChildren = true;
        }
        const searchQuery = { ...defaultSearchOptions, filter };
        if (sort) {
            searchQuery.sort = sort;
        }
        const params = {
            query: JSON.stringify(searchQuery),
        };

        let cursor;
        while (true) {
            if (cursor) {
                params.cursor = cursor;
            }
            const searchParams = new URLSearchParams(params).toString();
            const response = await fetch(
                `${this.cfSearchUrl}?${searchParams}`,
                {
                    headers: this.headers,
                },
            ).catch((err) => {
                throw new Error(`${NETWORK_ERROR_MESSAGE}: ${err.message}`);
            });
            if (!response.ok) {
                throw new Error(
                    `Search failed: ${response.status} ${response.statusText}`,
                );
            }
            let items;
            ({ items, cursor } = await response.json());

            yield items;
            if (!cursor) break;
        }
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
        }).catch((err) => {
            throw new Error(`${NETWORK_ERROR_MESSAGE}: ${err.message}`);
        });
        if (!response.ok) {
            throw new Error(
                `Failed to get fragment: ${response.status} ${response.statusText}`,
            );
        }
        const { items } = await response.json();
        if (!items || items.length === 0) {
            throw new Error('Fragment not found');
        }
        return items[0];
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
        }).catch((err) => {
            throw new Error(`${NETWORK_ERROR_MESSAGE}: ${err.message}`);
        });
        if (!response.ok) {
            throw new Error(
                `Failed to save fragment: ${response.status} ${response.statusText}`,
            );
        }
        return await getFragment(response);
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
        }).catch((err) => {
            throw new Error(`${NETWORK_ERROR_MESSAGE}: ${err.message}`);
        });
        if (!res.ok) {
            throw new Error(
                `Failed to copy fragment: ${res.status} ${res.statusText}`,
            );
        }
        const responseText = await res.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(responseText, 'text/html');
        const message = doc.getElementById('Message');
        const newPath = message?.textContent.trim();
        if (!newPath) {
            throw new Error('Failed to extract new path from copy response');
        }
        await wait(); // give AEM time to process the copy
        let newFragment = await this.getFragmentByPath(newPath);
        if (newFragment) {
            newFragment = await this.sites.cf.fragments.getById(newFragment.id);
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
        }).catch((err) => {
            throw new Error(`${NETWORK_ERROR_MESSAGE}: ${err.message}`);
        });
        if (!response.ok) {
            throw new Error(
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
        }).catch((err) => {
            throw new Error(`${NETWORK_ERROR_MESSAGE}: ${err.message}`);
        });
        if (!response.ok) {
            throw new Error(
                `Failed to delete fragment: ${response.status} ${response.statusText}`,
            );
        }
        return response; //204 No Content
    }

    /**
     * @param {*} path
     */
    async listFolders(path) {
        const query = new URLSearchParams({
            path,
        }).toString();

        const response = await fetch(`${this.foldersUrl}/?${query}`, {
            method: 'GET',
            headers: {
                ...this.headers,
                'X-Adobe-Accept-Experimental': '1',
            },
        }).catch((err) => {
            throw new Error(`${NETWORK_ERROR_MESSAGE}: ${err.message}`);
        });
        if (!response.ok) {
            throw new Error(
                `Failed to list folders: ${response.status} ${response.statusText}`,
            );
        }
        return await response.json();
    }

    /**
     * @param {*} path
     */
    async listFoldersClassic(path) {
        const relativePath = path?.replace(/^\/content\/dam/, '');

        const response = await fetch(
            `${this.foldersClassicUrl}${relativePath}.json?limit=1000`, // TODO: this is a workaround until Folders API is fixed.
            {
                method: 'GET',
                headers: { ...this.headers },
            },
        ).catch((err) => {
            throw new Error(`${NETWORK_ERROR_MESSAGE}: ${err.message}`);
        });

        if (!response.ok) {
            throw new Error(
                `Failed to list folders: ${response.status} ${response.statusText}`,
            );
        }
        const {
            properties: { name },
            entities = [],
        } = await response.json();
        return {
            self: { name, path },
            children: entities
                .filter(({ class: [firstClass] }) => /folder/.test(firstClass))
                .map(({ properties: { name, title } }) => ({
                    name,
                    title,
                    folderId: `${path}/${name}`,
                    path: `${path}/${name}`,
                })),
        };
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
                 * @see getFragmentById
                 */
                getById: (id) =>
                    getFragmentById(this.baseUrl, id, this.headers),
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
    folders = {
        /**
         * @see AEM#listFolders
         */
        list: this.listFoldersClassic.bind(this),
    };
}

export { AEM };
