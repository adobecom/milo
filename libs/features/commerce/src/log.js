import { lanaAppender } from './lana.js';
import { MiloEnv } from './settings.js';
import { getParam, isFunction, toBoolean } from './utils.js';

const epoch = Date.now();

/** @type {Set<(record: Commerce.Log.Entry) => boolean>} */
const appenders = new Set();
/** @type {Set<(record: Commerce.Log.Entry) => void>} */
const filters = new Set();
/** @type {Map<string, number>} */
const indexes = new Map();

const Level = Object.freeze({
  debug: 'debug',
  error: 'error',
  info: 'info',
  warn: 'warn',
});

const consoleAppender = {
  append({ level, message, params, timestamp, source }) {
    // eslint-disable-next-line no-console
    console[level](`[${source}]`, message, ...params, `(+${timestamp}ms)`);
  },
};
const debugFilter = { filter: ({ level }) => level !== Level.debug };
const quietFilter = { filter: () => false };

/**
 * @param {Commerce.Log.Level} level
 * @param {string} message
 * @param {string} namespace
 * @param {object} params
 * @param {string} source
 * @returns {Commerce.Log.Entry}
 */
const createEntry = (level, message, namespace, params, source) => ({
  level,
  message,
  namespace,
  params,
  source,
  timestamp: Date.now() - epoch,
});

function handleEntry(entry) {
  if ([...filters].every((filter) => filter(entry))) {
    appenders.forEach((appender) => appender(entry));
  }
}

function createLog(namespace) {
  const index = (indexes.get(namespace) ?? 0) + 1;
  indexes.set(namespace, index);
  const id = `${namespace} #${index}`;

  const createHandler = (level) => (message, ...params) => handleEntry(
    createEntry(level, message, namespace, params, id),
  );

  const log = Object.seal({
    id,
    namespace,
    module(name) {
      return createLog(`${log.namespace}/${name}`);
    },
    debug: createHandler(Level.debug),
    error: createHandler(Level.error),
    info: createHandler(Level.info),
    warn: createHandler(Level.warn),
  });

  return log;
}

function use(...plugins) {
  plugins.forEach(
    (plugin) => {
      const { append, filter } = plugin;
      if (isFunction(filter)) {
        filters.add(filter);
      } else if (isFunction(append)) {
        appenders.add(append);
      }
    },
  );
}

function init(env = {}) {
  const { name } = env;
  const debug = toBoolean(
    getParam('debug', false, true),
    name === MiloEnv.LOCAL,
  );
  if (debug) use(consoleAppender);
  else use(debugFilter);
  if (name === MiloEnv.PROD) use(lanaAppender);
}

function reset() {
  appenders.clear();
  filters.clear();
}

const milo = createLog('milo');

/** @type {Commerce.Log.Root} */
export default {
  commerce: milo.module('commerce'),
  milo,
  level: Level,
  consoleAppender,
  debugFilter,
  quietFilter,
  lanaAppender,
  init,
  reset,
  use,
};

export {
  Level,
  consoleAppender,
  debugFilter,
  quietFilter,
  lanaAppender,
};
