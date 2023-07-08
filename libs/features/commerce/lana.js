const delimiter = '¶';

const ignoredProperties = ['analytics', 'literals'];
const serializableTypes = ['Array', 'Object'];

const seenPayloads = new Set();

const isError = (value) => value instanceof Error
  // WCS error response
  // TODO: check if still actual
  || typeof value.originatingRequest === 'string';

function serializeValue(value) {
  if (value == null) return undefined;
  const type = typeof value;
  if (type === 'function') {
    const { name } = value;
    return name ? `${type} ${name}` : type;
  }
  if (type === 'object') {
    if (value instanceof Error) return value.message;
    if (typeof value.originatingRequest === 'string') {
      const { message, originatingRequest, status } = value;
      return [message, status, originatingRequest]
        .filter((v) => v)
        .join(' ');
    }
    const name = value[Symbol.toStringTag]
      ?? Object.getPrototypeOf(value).constructor.name;
    if (!serializableTypes.includes(name)) return name;
  }
  return value;
}

function serializeParam(key, value) {
  if (ignoredProperties.includes(key)) return undefined;
  return serializeValue(value);
}

/** @type {Commerce.Log.Plugin} */
const plugin = {
  append(entry) {
    const { message, params } = entry;
    const errors = [];
    let payload = message;
    const values = [];

    params.forEach((param) => {
      if (param != null) {
        (isError(param) ? errors : values).push(param);
      }
    });

    if (errors.length) {
      payload += ' ';
      payload += errors.map(serializeValue).join(' ');
    }

    // TODO: Lana backend extracts referer from the header sent,
    // sometimes it includes page path and query, sometimes - not
    const { pathname, search } = window.location;
    payload += `${delimiter}page=`;
    payload += pathname + search;

    if (values.length) {
      payload += `${delimiter}facts=`;
      payload += JSON.stringify(values, serializeParam);
    }

    if (!seenPayloads.has(payload)) {
      seenPayloads.add(payload);
      // @ts-ignore
      window.lana.log(payload, {
        // Sample rate is set to 100 meaning each error will get logged in Splunk
        sampleRate: 100,
        tags: 'consumer=milo',
      });
    }
  },
};

export default plugin;
export {
  delimiter,
  ignoredProperties,
  plugin,
  serializableTypes,
}
