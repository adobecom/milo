import { HEADER_X_REQUEST_ID } from '../constants.js';

/**
 * A fetch wrapper that retries failed requests up to a specified number of times.
 * Only retries on network errors, not server errors (HTTP status codes).
 * @param {string|Request} resource - The resource to fetch
 * @param {Object} [options] - The options for the fetch request
 * @param {number} [retries=3] - Maximum number of retry attempts
 * @param {number} [delay=500] - Delay between retries in milliseconds
 * @returns {Promise<Response>} - The fetch response
 */
async function masFetch(resource, options = {}, retries = 2, delay = 100) {
    let lastError;

    // Initialize headers if not present
    if (!options.headers) {
        options.headers = {};
    }

    // Generate a request ID once, outside the retry loop
    if (!options.headers[HEADER_X_REQUEST_ID]) {
        //options.headers[HEADER_X_REQUEST_ID] = window.crypto.randomUUID ? window.crypto.randomUUID() : `req-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
    }

    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            const response = await fetch(resource, options);
            // Don't retry on server errors (HTTP status codes)
            return response;
        } catch (error) {
            // Only retry on network errors
            lastError = error;

            // If we've used all our retries, throw the error
            if (attempt > retries) break;

            // Wait before retrying
            await new Promise((resolve) =>
                setTimeout(resolve, delay * (attempt + 1)),
            );
        }
    }

    throw lastError;
}

export { masFetch };
