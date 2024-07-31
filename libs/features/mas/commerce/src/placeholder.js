import {
    CLASS_NAME_FAILED,
    CLASS_NAME_PENDING,
    CLASS_NAME_RESOLVED,
    EVENT_TYPE_FAILED,
    EVENT_TYPE_PENDING,
    EVENT_TYPE_RESOLVED,
    STATE_FAILED,
    STATE_PENDING,
    STATE_RESOLVED,
} from './constants.js';
import { ignore } from './external.js';
import { Log } from './log.js';
import { discoverService, setImmediate, useService } from './utilities.js';

const PlaceholderConstants = {
    CLASS_NAME_FAILED,
    CLASS_NAME_PENDING,
    CLASS_NAME_RESOLVED,
    EVENT_TYPE_FAILED,
    EVENT_TYPE_PENDING,
    EVENT_TYPE_RESOLVED,
    STATE_FAILED,
    STATE_PENDING,
    STATE_RESOLVED,
};

const StateClassName = {
    [STATE_FAILED]: CLASS_NAME_FAILED,
    [STATE_PENDING]: CLASS_NAME_PENDING,
    [STATE_RESOLVED]: CLASS_NAME_RESOLVED,
};

const StateEventType = {
    [STATE_FAILED]: EVENT_TYPE_FAILED,
    [STATE_PENDING]: EVENT_TYPE_PENDING,
    [STATE_RESOLVED]: EVENT_TYPE_RESOLVED,
};

/**
 * @typedef {{
 *  changes: Map<string, any>;
 *  connected: boolean;
 *  dispose: () => void;
 *  error: Error | null;
 *  log: Commerce.Log.Instance;
 *  promises: {
 *    resolve: (HTMLPlaceholderMethods) => void;
 *    reject: (error: Error) => void;
 *  }[];
 *  options?: Commerce.Options;
 *  state: string;
 *  timer: number;
 *  value: any;
 *  version: number;
 * }} Bucket
 * Stores private values for each instance of a placeholder.
 * @type {WeakMap<Commerce.Placeholder, Bucket>}
 */
const buckets = new WeakMap();

/**
 * @param {Commerce.Placeholder} element
 * @returns {Bucket}
 */
function init(element) {
    if (!buckets.has(element)) {
        const log = Log.module(element.constructor.is);
        buckets.set(element, {
            changes: new Map(),
            connected: false,
            dispose: ignore,
            error: undefined,
            log,
            options: undefined,
            promises: [],
            state: STATE_PENDING,
            timer: null,
            value: undefined,
            version: 0,
        });
    }
    return buckets.get(element);
}

/**
 @param {Commerce.Placeholder} element
 */
function notify(element) {
    const bucket = init(element);
    const { error, promises, state } = bucket;
    if (state === STATE_RESOLVED || state === STATE_FAILED) {
        bucket.promises = [];
        if (state === STATE_RESOLVED) {
            promises.forEach(({ resolve }) => resolve(element));
        } else if (state === STATE_FAILED) {
            promises.forEach(({ reject }) => reject(error));
        }
    }
    element.dispatchEvent(
        new CustomEvent(StateEventType[state], { bubbles: true }),
    );
}

/**
 @param {Commerce.Placeholder} element
 */
function update(element) {
    const bucket = buckets.get(element);
    [STATE_FAILED, STATE_PENDING, STATE_RESOLVED].forEach((state) => {
        element.classList.toggle(StateClassName[state], state === bucket.state);
    });
}

/** @type {Commerce.Placeholder} */
// @ts-ignore
export const HTMLPlaceholderMixin = {
    get error() {
        return init(this).error;
    },
    get log() {
        return init(this).log;
    },
    get options() {
        return init(this).options;
    },
    get state() {
        return init(this).state;
    },
    get value() {
        return init(this).value;
    },

    /**
     * Adds name/value of the updated attribute to the `changes` map,
     * requests placeholder update.
     */
    attributeChangedCallback(name, _, value) {
        const bucket = init(this);
        bucket.changes.set(name, value);
        // Initiate update of the placeholder
        this.requestUpdate();
    },

    /**
     * Triggers when this component is connected to DOM.
     * Subscribes to the `ready` event of the commerce service,
     * requests placeholder update.
     */
    connectedCallback() {
        init(this).dispose = discoverService(() => this.requestUpdate(true));
    },

    /**
     * Triggers when this component is disconnected from DOM.
     * Runs and then erases all disposers.
     */
    disconnectedCallback() {
        const bucket = init(this);
        if (bucket.connected) {
            bucket.connected = false;
            bucket.log.debug('Disconnected:', { element: this });
        }
        bucket.dispose();
        bucket.dispose = ignore;
    },

    /**
     * Returns a promise resolving or rejecting when finishes an async operation
     * performed by this component.
     * If no operation is in progress,
     * the returned promise is aslready resolved or rejected.
     */
    onceSettled() {
        const { error, promises, state } = init(this);
        if (STATE_RESOLVED === state) return Promise.resolve(this);
        if (STATE_FAILED === state) return Promise.reject(error);
        return new Promise((resolve, reject) => {
            promises.push({ resolve, reject });
        });
    },

    /**
     * Sets component state to "RESOLVED".
     * Updates its class list and stored value, notifies observers and fires "RESOLVED" event.
     */
    toggleResolved(version, value, options) {
        const bucket = init(this);
        // skip obsolete asyncs
        if (version !== bucket.version) return false;
        if (options !== undefined) bucket.options = options;
        bucket.state = STATE_RESOLVED;
        bucket.value = value;
        update(this);
        this.log.debug('Resolved:', { element: this, value });
        // Allow calling code to perform sync updates of this element
        // before notifying observers about state change
        setImmediate(() => notify(this));
        return true;
    },

    /**
     * Sets component state to "FAILED".
     * Updates its class list and stored error, notifies observers and fires "FAILED" event.
     */
    toggleFailed(version, error, options) {
        const bucket = init(this);
        // Skip obsolete asyncs
        if (version !== bucket.version) return false;
        if (options !== undefined) bucket.options = options;
        bucket.error = error;
        bucket.state = STATE_FAILED;
        update(this);
        bucket.log.error('Failed:', { element: this, error });
        setImmediate(() => notify(this));
        return true;
    },

    /**
     * Sets component state to "PENDING".
     * Increments its version, updates CSS classes, notifies observers and fires "PENDING" event.
     */
    togglePending(options) {
        const bucket = init(this);
        bucket.version++;
        if (options) bucket.options = options;
        bucket.state = STATE_PENDING;
        update(this);
        setImmediate(() => notify(this));
        return bucket.version;
    },

    /**
     * Queues task to update this component.
     * Skips rendering if update is not forced and no changes were accumulated since the previous update.
     * Calls `render` method to perform the update.
     * Restores previous state of the component if the `render` method returned `false`.
     */
    requestUpdate(force = false) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        if (!this.isConnected || !useService()) return;
        const bucket = init(this);
        // Batch consecutive updates
        if (bucket.timer) return;
        // Save current state to restore it if needed
        const { error, options, state, value, version } = bucket;
        // Inform `onceSettled` that `render` can follow soon
        bucket.state = STATE_PENDING;
        bucket.timer = setImmediate(async () => {
            bucket.timer = null;
            let changes = null;
            // Gather list of changes triggered the update
            if (bucket.changes.size) {
                changes = Object.fromEntries(bucket.changes.entries());
                bucket.changes.clear();
            }
            // Trottle connected-disconneded series of events
            // when placeholder is actively manipulated by a higher component
            if (bucket.connected) {
                bucket.log.debug('Updated:', { element: this, changes });
            } else {
                bucket.connected = true;
                bucket.log.debug('Connected:', { element: this, changes });
            }
            if (changes || force) {
                try {
                    const result = await this.render?.();
                    // Restore previous state if `render` has returned `false`
                    if (
                        result === false &&
                        bucket.state === STATE_PENDING &&
                        bucket.version === version
                    ) {
                        bucket.state = state;
                        bucket.error = error;
                        bucket.value = value;
                        // Update CSS and notify observers/listeners
                        update(this);
                        notify(this);
                    }
                } catch (error) {
                    this.toggleFailed(bucket.version, error, options);
                }
            }
        });
    },
};

/**
 * Deletes properties of `dataset` object that coerce to common defaults in a DOM dataset:
 *  - null, undefined;
 *  - empty strings and arrays;
 * Returns `dataset` object.
 */
function cleanupDataset(dataset = {}) {
    Object.entries(dataset).forEach(([key, value]) => {
        const remove = value == null || value === '' || value?.length === 0;
        if (remove) delete dataset[key];
    });
    return dataset;
}

/**
 * Returns custom HTML element constructed by the `Class` argument.
 * Populates element dataset from `dataset` object,
 * omits empty values (false, '', null, undefined).
 * @type {Commerce.createPlaceholder}
 */
export function createPlaceholder(Class, dataset = {}) {
    const { tag, is } = Class;
    // Create custom DOM element
    const element = document.createElement(tag, { is });
    element.setAttribute('is', is);
    Object.assign(element.dataset, cleanupDataset(dataset));
    // @ts-ignore
    return element;
}

/**
 * Globally registers customized built-in element constructor.
 * Returns provided or previously registered class extended with `HTMLPlaceholderMixin` API.
 * @type {Commerce.definePlaceholder}
 */
export function definePlaceholder(Class) {
    const { tag, is, prototype } = Class;
    let PlaceholderClass = window.customElements.get(is);
    if (!PlaceholderClass) {
        // Extend placeholder prototype with mixin members
        Object.defineProperties(
            prototype,
            Object.getOwnPropertyDescriptors(HTMLPlaceholderMixin),
        );
        PlaceholderClass = Object.defineProperties(
            Class,
            Object.getOwnPropertyDescriptors(PlaceholderConstants),
        );
        // Define custom DOM element
        window.customElements.define(is, PlaceholderClass, { extends: tag });
    }
    // @ts-ignore
    return PlaceholderClass;
}

/**
 * Returns function selecting placeholders of given `Class`
 * located inside interesting `container` element.
 * @param {Commerce.PlaceholderConstructor} Class
 * @param {Element} container
 */
export function selectPlaceholders(Class, container = document.body) {
    return Array.from(
        container?.querySelectorAll(`${Class.tag}[is="${Class.is}"]`) ?? [],
    );
}

/**
 * Updates element dataset from `dataset` object,
 * omits empty values (false, '', null, undefined).
 * @param {HTMLElement} element
 * @param {Record<string, any>} dataset
 */
export function updatePlaceholder(element, dataset = {}) {
    if (element instanceof HTMLElement) {
        Object.assign(element.dataset, cleanupDataset(dataset));
        return element;
    }
    return null;
}
