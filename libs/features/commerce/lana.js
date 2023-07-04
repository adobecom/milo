const delimiter = '¶';

const ignoredProperties = ['analytics', 'literals'];
const serializableTypes = ['Array', 'Object'];

const seenPayloads = new Set();

const isError = (value) => value instanceof Error
  // WCS error response
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

function serializeArgument(key, value) {
  if (ignoredProperties.includes(key)) return undefined;
  return serializeValue(value);
}

export default {
  writer(message, ...args) {
    const errors = [];
    let payload = message;
    const values = [];

    args.forEach((arg) => {
      if (arg != null) {
        (isError(arg) ? errors : values).push(arg);
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
      payload += JSON.stringify(values, serializeArgument);
    }

    if (!seenPayloads.has(payload)) {
      seenPayloads.add(payload);
      window.lana.log(payload, {
        // Sample rate is set to 100 meaning each error will get logged in Splunk
        sampleRate: 100,
        tags: 'consumer=milo',
      });
    }
  },
};
