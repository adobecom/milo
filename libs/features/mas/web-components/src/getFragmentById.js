/**
 * @param {Response} res
 * @returns Fragment json
 */
export async function getFragment(res) {
    const eTag = res.headers.get('Etag');
    const fragment = await res.json();
    fragment.etag = eTag;
    return fragment;
}

/**
 * Get fragment by ID
 * @param {string} baseUrl the aem base url
 * @param {string} id fragment id
 * @param {Object} headers optional request headers
 * @returns {Promise<Object>} the raw fragment item
 */
export async function getFragmentById(baseUrl, id, headers) {
    const response = await fetch(`${baseUrl}/adobe/sites/cf/fragments/${id}`, {
        headers,
    });
    if (!response.ok) {
        throw new Error(
            `Failed to get fragment: ${response.status} ${response.statusText}`,
        );
    }
    return await getFragment(response);
}
