import { HEADER_X_REQUEST_ID } from './constants.js';

/**
 * Custom error class for MAS-related errors
 * Extends the standard Error class with additional context
 */
export class MasError extends Error {
    /**
     * Creates a new MasError instance
     * @param {string} message - The error message
     * @param {Object} context - Additional context information about the error
     * @param {unknown} cause - The original error that caused this error
     */
    constructor(message, context, cause) {
        super(message, { cause });
        
        this.name = 'MasError';

        if (context.response) {
            const requestId =
                context.response.headers?.get(HEADER_X_REQUEST_ID);
            if (requestId) {
                context.requestId = requestId;
            }
            if (context.response.status) {
                context.status = context.response.status;
                context.statusText = context.response.statusText;
            }
            if (context.response.url) {
                context.url = context.response.url;
            }
        }
        delete context.response;
        this.context = context;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, MasError);
        }
    }

    /**
     * Returns a string representation of the error including context
     * @returns {string} String representation of the error
     */
    toString() {
        const contextStr = Object.entries(this.context || {})
            .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
            .join(', ');

        let errorString = `${this.name}: ${this.message}`;

        if (contextStr) {
            errorString += ` (${contextStr})`;
        }

        if (this.cause) {
            errorString += `\nCaused by: ${this.cause}`;
        }

        return errorString;
    }
}
