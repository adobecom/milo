import lanaWriter from './lana.js';
import { isFunction } from './utils.js';

const epoch = Date.now();

const filters = new Set();
/** @type {Map<string, number>} */
const instances = new Map();
const tag = 'Log';
const writers = new Set();

const Level = Object.freeze({
  debug: 'debug',
  error: 'error',
  info: 'info',
  warn: 'warn',
});

/**
 * @param {number} instance
 * @param {Commerce.Log.Level} level
 * @param {string} message
 * @param {string} namespace
 * @param {object} params
 */
const createRecord = (instance, level, message, namespace, params) => ({
  instance,
  level,
  message,
  namespace,
  params,
  timestamp: Date.now() - epoch,
});

function reportError(message, ...params) {
  /* eslint-disable no-use-before-define */
  Log.consoleWriter.writer(createRecord(
    undefined,
    0,
    Log.level.error,
    message,
    Log.common.namespace,
    params,
  ));
  /* eslint-enable no-use-before-define */
}

function writeRecord(record) {
  const toWrite = [...filters].every((filter) => {
    try {
      return filter(record);
    } catch (error) {
      reportError('Log filter error:', { record, filter });
      return true;
    }
  });
  if (toWrite) {
    writers.forEach((writer) => {
      try {
        writer(record);
      } catch (error) {
        reportError('Log writer error:', { record, writer });
      }
    });
  }
}

/**
 * @type {Commerce.Log.Factory}
 */
function Log(namespace) {
  const instance = (instances.get(namespace) ?? 0) + 1;
  instances.set(namespace, instance);
  const id = `${namespace}-${instance}`;

  const createWriter = (level) => (message, ...params) => writeRecord(
    createRecord(instance, level, message, namespace, params),
  );

  const log = Object.seal({
    id,
    namespace,
    // eslint-disable-next-line no-shadow
    module(namespace) {
      return Log(`${log.namespace}/${namespace}`);
    },
    debug: createWriter(Level.debug),
    error: createWriter(Level.error),
    info: createWriter(Level.info),
    warn: createWriter(Level.warn),
    [Symbol.toStringTag]: tag,
  });

  return log;
}

Log.level = Level;

Log.debugFilter = { filter: ({ level }) => level !== Level.debug };
Log.quietFilter = { filter: () => false };

Log.consoleWriter = {
  writer({
    instance, level, message, namespace, params, timestamp,
  }) {
    console[level](
      `[${namespace} #${instance}]`,
      message,
      ...params,
      `(+${timestamp}ms)`,
    );
  },
};
Log.lanaWriter = lanaWriter;

Log.reset = (env = {}) => {
  filters.clear();
  writers.clear();
  if (env.name === 'prod') {
    Log.use(Log.debugFilter);
    Log.use(Log.lanaWriter);
  } else {
    Log.use(Log.consoleWriter);
  }
};

Log.use = (...modules) => {
  modules.forEach(
    (module) => {
      const { filter, writer } = module;
      if (isFunction(filter)) {
        filters.add(filter);
      } else if (isFunction(writer)) {
        writers.add(writer);
      } else {
        Log.common.warn('Unknown log module:', { module });
      }
    },
  );

  return Log;
};

Log.common = Log('milo');
Log.commerce = Log.common.module('commerce');
Log.reset();

export default Log;
