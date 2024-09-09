import {
    CLASS_NAME_FAILED,
    CLASS_NAME_PENDING,
    CLASS_NAME_RESOLVED,
    STATE_FAILED,
    STATE_PENDING,
    STATE_RESOLVED,
} from '../src/constants.js';
import { delay } from '../src/external.js';
import { createPlaceholder, definePlaceholder } from '../src/placeholder.js';

import { mockConfig } from './mocks/config.js';
import { mockLana, unmockLana } from './mocks/lana.js';
import { expect } from './utilities.js';
import { initService } from '../src/service.js';
import { mockFetch } from './mocks/fetch.js';
import { withLiterals } from './mocks/literals.js';

let id = 1;
/**
 * @param {Record<string, any>} props
 * @returns {Promise<Commerce.Placeholder & HTMLSpanElement>}
 */
async function mockPlaceholder(
    props = {},
    dataset = {
        test1: undefined,
        test2: undefined,
        test3: undefined,
    },
) {
    class HTMLTestElement extends HTMLSpanElement {
        static is = `test-element${id++}`;
        static tag = 'span';
        static get observedAttributes() {
            return ['data-test1', 'data-test2', 'data-test3'];
        }

        render() {
            return true;
        }
    }
    Object.defineProperties(
        HTMLTestElement.prototype,
        Object.getOwnPropertyDescriptors(props),
    );

    definePlaceholder(HTMLTestElement);
    const element = createPlaceholder(HTMLTestElement, dataset);
    document.body.append(element);
    await delay();
    // @ts-ignore
    return element;
}

describe('custom span-based placeholder', () => {
    after(() => {
        unmockLana();
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    before(async () => {
        await mockFetch(withLiterals);
        mockLana();
    });

    describe('creation of element', () => {
        it('does not set dataset property if it is missing or its value is `null`', async () => {
            const element = await mockPlaceholder(
                {},
                {
                    test1: null,
                    test2: '',
                    test3: [],
                },
            );
            expect(element.hasAttribute('data-test1')).to.be.false;
            expect(element.hasAttribute('data-test2')).to.be.false;
            expect(element.hasAttribute('data-test3')).to.be.false;
        });
    });

    describe('connection to DOM', () => {
        it('sets element state to "pending"', async () => {
            const element = await mockPlaceholder();
            expect(element.state).to.equal(STATE_PENDING);
        });
    });

    describe('disconnection from DOM', () => {
        it('supresses updates', async () => {
            const element = await mockPlaceholder();
            element.toggleResolved(element.togglePending(), []);
            element.remove();
            element.requestUpdate();
            element.requestUpdate();
            expect(element.state).to.equal(STATE_RESOLVED);
        });
    });

    describe('reconnection to DOM', () => {
        it('sets element state to "pending"', async () => {
            const element = await mockPlaceholder();
            element.remove();
            const div = document.createElement('div');
            document.body.append(div);
            div.append(element);
            await delay();
            expect(element.state).to.equal(STATE_PENDING);
        });
    });

    describe('activation of commerce service', () => {
        it('sets element state to "pending"', async () => {
            const element = await mockPlaceholder();
            element.toggleResolved(element.togglePending(), []);
            await initService(mockConfig(), true);
            await delay();
            expect(element.state).to.equal(STATE_PENDING);
        });
    });

    describe('change of attributes', () => {
        it('sets element state to "pending"', async () => {
            const element = await mockPlaceholder();
            await initService(mockConfig(), true);
            element.toggleResolved(element.togglePending(), []);
            expect(element.state).to.equal(STATE_RESOLVED);
            element.dataset.test1 = 'test1';
            expect(element.state).to.equal(STATE_PENDING);
        });
    });

    describe('method "toggleFailed"', () => {
        it('sets element state to "failed", updates its error and options', async () => {
            const error = new Error('Test');
            const options = {};
            const element = await mockPlaceholder();
            element.toggleFailed(element.togglePending(), error, options);
            const classes = [...element.classList];
            expect(classes).to.contain(CLASS_NAME_FAILED);
            expect(classes).to.not.contain(CLASS_NAME_PENDING);
            expect(classes).to.not.contain(CLASS_NAME_RESOLVED);
            expect(element.state).to.equal(STATE_FAILED);
            expect(element.error).to.equal(error);
            expect(element.options).to.equal(options);
        });

        it('returns false if version is incorrect', async () => {
            const element = await mockPlaceholder();
            expect(element.toggleFailed(-1, new Error('Test'))).to.be.false;
        });

        it('updates placeholder error', async () => {
            const element = await mockPlaceholder();
            const error = new Error('Test');
            element.toggleFailed(element.togglePending(), error);
            expect(element.error).to.equal(error);
        });

        it('rejects notification promise with error argument', async () => {
            const error = new Error('Test');
            const element = await mockPlaceholder();
            let results = {};
            element.onceSettled().catch((value) => {
                results.notified = true;
                results.value = value;
            });
            element.toggleFailed(element.togglePending(), error);
            await delay();
            expect(results.notified).to.be.true;
            expect(results.value).to.equal(error);
        });
    });

    describe('method "togglePending"', () => {
        it('sets element state to "pending", updates its options', async () => {
            const options = {};
            const element = await mockPlaceholder();
            element.togglePending(options);
            const classes = [...element.classList];
            expect(classes).to.not.contain(CLASS_NAME_FAILED);
            expect(classes).to.contain(CLASS_NAME_PENDING);
            expect(classes).to.not.contain(CLASS_NAME_RESOLVED);
            expect(element.state).to.equal(STATE_PENDING);
            expect(element.options).to.equal(options);
        });

        it('returns new version on every call', async () => {
            const element = await mockPlaceholder();
            const version1 = element.togglePending();
            const version2 = element.togglePending();
            const version3 = element.togglePending();
            expect(version1 == version2).to.be.false;
            expect(version1 == version3).to.be.false;
            expect(version2 == version3).to.be.false;
        });
    });

    describe('method "toggleResolved"', () => {
        it('sets element state to "resolved", updates its value and options', async () => {
            const options = {};
            const value = [];
            const element = await mockPlaceholder();
            element.toggleResolved(element.togglePending(), value, options);
            const classes = [...element.classList];
            expect(classes).to.not.contain(CLASS_NAME_FAILED);
            expect(classes).to.not.contain(CLASS_NAME_PENDING);
            expect(classes).to.contain(CLASS_NAME_RESOLVED);
            expect(element.state).to.equal(STATE_RESOLVED);
            expect(element.options).to.equal(options);
            expect(element.value).to.equal(value);
        });

        it('returns false if provided version is incorrect', async () => {
            const element = await mockPlaceholder();
            expect(element.toggleResolved(-1, [])).to.be.false;
        });

        it('notifies observer', async () => {
            const element = await mockPlaceholder();
            let notified = false;
            element.onceSettled().then(() => {
                notified = true;
            });
            expect(notified).to.be.false;
            element.toggleResolved(element.togglePending(), []);
            await delay();
            expect(notified).to.be.true;
        });

        it('updates placeholder value', async () => {
            const element = await mockPlaceholder();
            const value = [];
            element.toggleResolved(element.togglePending(), value);
            expect(element.value).to.equal(value);
        });

        it('resolves notification promise with placeholder argument', async () => {
            const element = await mockPlaceholder();
            let results = {};
            element.onceSettled().then((value) => {
                results.notified = true;
                results.value = value;
            });
            element.toggleResolved(element.togglePending(), []);
            await delay();
            expect(results.notified).to.be.true;
            expect(results.value).to.equal(element);
        });
    });

    describe('method "requestUpdate"', () => {
        it('restores previous state if render method returns false', async () => {
            await initService(mockConfig(), true);
            const element = await mockPlaceholder({
                render() {
                    return false;
                },
            });
            element.toggleResolved(element.togglePending(), []);
            expect(element.state).to.equal(STATE_RESOLVED);
            element.requestUpdate(true);
            await delay();
            expect(element.state).to.equal(STATE_RESOLVED);
        });

        it('sets element state to "failed" if method "render" throws', async () => {
            const element = await mockPlaceholder({
                render() {
                    throw new Error('Test');
                },
            });
            element.requestUpdate(true);
            await delay();
            expect(element.state).to.equal(STATE_FAILED);
        });
    });
});
