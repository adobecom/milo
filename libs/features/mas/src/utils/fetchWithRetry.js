/**
 * A fetch wrapper that retries failed requests up to a specified number of times.
 * Only retries on network errors, not server errors (HTTP status codes).
 * @param {string|Request} resource - The resource to fetch
 * @param {Object} [options] - The options for the fetch request
 * @param {number} [retries=3] - Maximum number of retry attempts
 * @param {number} [delay=1000] - Delay between retries in milliseconds
 * @returns {Promise<Response>} - The fetch response
 */
async function fetchWithRetry(
    resource,
    options = {},
    retries = 3,
    delay = 500
) {
    let lastError;
    
    for (let attempt = 0; attempt < retries + 1; attempt++) {
        try {
            const response = await fetch(resource, options);
            // Don't retry on server errors (HTTP status codes)
            return response;
        } catch (error) {
            // Only retry on network errors
            lastError = error;
            
            // If we've used all our retries, throw the error
            if (attempt >= retries) {
                break;
            }
            
            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    
    throw lastError;
}

export { fetchWithRetry };
