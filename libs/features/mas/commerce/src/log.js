import { LOG_NAMESPACE } from './constants.js';
import { getParameter, isFunction, toBoolean } from './external.js';
import { lanaAppender } from './lana.js';
import { MiloEnv } from './settings.js';

const DEBUG = 'debug';
const ERROR = 'error';
const INFO = 'info';
const WARN = 'warn';

const epoch = Date.now();

/** @type {Set<(record: Commerce.Log.Entry) => boolean>} */
const appenders = new Set();
/** @type {Set<(record: Commerce.Log.Entry) => void>} */
const filters = new Set();
/** @type {Map<string, number>} */
const indexes = new Map();

const Level = Object.freeze({
    DEBUG,
    ERROR,
    INFO,
    WARN,
});

const consoleAppender = {
    append({ level, message, params, timestamp, source }) {
        /* c8 ignore start */

        console[level](
            `${timestamp}ms [${source}] %c${message}`,
            'font-weight: bold;',
            ...params,
        );
        /* c8 ignore stop */
    },
};
const debugFilter = { filter: ({ level }) => level !== DEBUG };
const quietFilter = { filter: () => false };

/**
 * @param {Commerce.Log.Level} level
 * @param {string} message
 * @param {string} namespace
 * @param {object} params
 * @param {string} source
 * @returns {Commerce.Log.Entry}
 */
function createEntry(level, message, namespace, params, source) {
    return {
        level,
        message,
        namespace,
        get params() {
            // Handle lazy param factory: a single function in the `params` array
            if (params.length === 1) {
                const [param] = params;
                if (isFunction(param)) {
                    // Call lazy param factory and replace the factory with its result
                    params = param();
                    // Ensure `params` is an array of values
                    if (!Array.isArray(params)) params = [params];
                }
            }
            return params;
        },
        source,
        timestamp: Date.now() - epoch,
    };
}

function handleEntry(entry) {
    if ([...filters].every((filter) => filter(entry))) {
        appenders.forEach((appender) => appender(entry));
    }
}

function createLog(namespace) {
    const index = (indexes.get(namespace) ?? 0) + 1;
    indexes.set(namespace, index);
    const id = `${namespace} #${index}`;

    const createHandler =
        (level) =>
        (message, ...params) =>
            handleEntry(createEntry(level, message, namespace, params, id));

    const log = Object.seal({
        id,
        namespace,
        module(name) {
            return createLog(`${log.namespace}/${name}`);
        },
        debug: createHandler(Level.DEBUG),
        error: createHandler(Level.ERROR),
        info: createHandler(Level.INFO),
        warn: createHandler(Level.WARN),
    });

    return log;
}

function use(...plugins) {
    plugins.forEach((plugin) => {
        const { append, filter } = plugin;
        if (isFunction(filter)) {
            filters.add(filter);
        } else if (isFunction(append)) {
            appenders.add(append);
        }
    });
}

function init(env = {}) {
    const { name } = env;
    const debug = toBoolean(
        getParameter('commerce.debug', { search: true, storage: true }),
        name === MiloEnv.LOCAL,
    );
    if (debug) use(consoleAppender);
    else use(debugFilter);
    if (name === MiloEnv.PROD) use(lanaAppender);
    return Log;
}

function reset() {
    appenders.clear();
    filters.clear();
}

/** @type {Commerce.Log.Root} */
export const Log = {
    ...createLog(LOG_NAMESPACE),
    Level,
    Plugins: {
        consoleAppender,
        debugFilter,
        quietFilter,
        lanaAppender,
    },
    init,
    reset,
    use,
};
