import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { masFetch } from '../src/utils/mas-fetch.js';
import { HEADER_X_REQUEST_ID } from '../src/constants.js';

describe('masFetch', () => {
    let fetchStub;
    let originalFetch;
    let randomUUIDStub;
    let clock;
    let originalRandomUUID;

    beforeEach(() => {
        // Save original fetch
        originalFetch = window.fetch;
        
        // Setup sinon fake timers with configuration to handle native timers
        clock = sinon.useFakeTimers({
            shouldAdvanceTime: true,
            shouldClearNativeTimers: true
        });
        
        // Create a stub for fetch
        fetchStub = sinon.stub();
        window.fetch = fetchStub;
        
        // Save original randomUUID and mock it
        originalRandomUUID = window.crypto.randomUUID;
        randomUUIDStub = sinon.stub().returns('test-uuid-1234');
        Object.defineProperty(window.crypto, 'randomUUID', {
            configurable: true,
            get: () => randomUUIDStub
        });
    });

    afterEach(() => {
        // Restore original implementations
        window.fetch = originalFetch;
        
        // Restore original randomUUID
        if (originalRandomUUID) {
            Object.defineProperty(window.crypto, 'randomUUID', {
                configurable: true,
                get: () => originalRandomUUID
            });
        } else {
            // If it didn't exist originally, remove our property
            delete window.crypto.randomUUID;
        }
        
        clock.restore();
        sinon.restore();
    });

    it('should successfully fetch on first attempt', async () => {
        // Setup
        const mockResponse = new Response('success', { status: 200 });
        fetchStub.resolves(mockResponse);
        
        // Execute
        const response = await masFetch('https://example.com/api');
        
        // Verify
        expect(fetchStub.callCount).to.equal(1);
        expect(response).to.equal(mockResponse);
        
        // Verify request ID was added
        // const options = fetchStub.firstCall.args[1];
        // expect(options.headers[HEADER_X_REQUEST_ID]).to.equal('test-uuid-1234');
    });

    it('should retry on network errors up to specified number of times', async () => {
        // Setup
        const networkError = new Error('Network error');
        fetchStub.rejects(networkError);
        
        // Execute and catch the expected error
        try {
            await masFetch('https://example.com/api', {}, 2, 100);
            expect.fail('Should have thrown an error');
        } catch (error) {
            // Verify
            expect(fetchStub.callCount).to.equal(3); // Initial + 2 retries
            expect(error).to.equal(networkError);
        }
    });

    it('should wait the specified delay between retries', async () => {
        // Setup
        const networkError = new Error('Network error');
        fetchStub.rejects(networkError);
        
        // Start the async operation but don't await it yet
        const fetchPromise = masFetch('https://example.com/api', {}, 2);
        
        // Verify initial call was made
        expect(fetchStub.callCount).to.equal(1);
        
        // Advance time and verify retries
        await clock.tickAsync(150);
        expect(fetchStub.callCount).to.equal(2);
        
        await clock.tickAsync(400);
        expect(fetchStub.callCount).to.equal(3);
        
        // Now await the promise (which should reject)
        try {
            await fetchPromise;
            expect.fail('Should have thrown an error');
        } catch (error) {
            expect(error).to.equal(networkError);
        }
    });

    it('should not retry on successful responses', async () => {
        // Setup
        const mockResponse = new Response('success', { status: 500 }); // Even with error status code
        fetchStub.resolves(mockResponse);
        
        // Execute
        const response = await masFetch('https://example.com/api');
        
        // Verify
        expect(fetchStub.callCount).to.equal(1);
        expect(response).to.equal(mockResponse);
    });

    it.skip('should use existing request ID if provided', async () => {
        // Setup
        const mockResponse = new Response('success', { status: 200 });
        fetchStub.resolves(mockResponse);
        const customRequestId = 'custom-request-id';
        
        // Execute
        await masFetch('https://example.com/api', {
            headers: {
                [HEADER_X_REQUEST_ID]: customRequestId
            }
        });
        
        // Verify
        const options = fetchStub.firstCall.args[1];
        expect(options.headers[HEADER_X_REQUEST_ID]).to.equal(customRequestId);
    });

    it.skip('should generate a UUID for request ID when not provided', async () => {
        // Setup
        const mockResponse = new Response('success', { status: 200 });
        fetchStub.resolves(mockResponse);
        
        // Execute
        await masFetch('https://example.com/api');
        
        // Verify
        const options = fetchStub.firstCall.args[1];
        expect(options.headers[HEADER_X_REQUEST_ID]).to.equal('test-uuid-1234');
        expect(randomUUIDStub.calledOnce).to.be.true;
    });
}); 
