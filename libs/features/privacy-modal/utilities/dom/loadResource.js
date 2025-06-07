/* Imports */
import isEmptyObject from '../lang/isEmptyObject.js';
import isFunction from '../lang/isFunction.js';
import hasOwnProperty from '../lang/hasOwnProperty.js';
import appendResource from './appendResource.js';
import Debug from '../Debug.js';

/* Local variables and methods */
const _ = {};
const debug = new Debug({ control: 'createResourceLink' });

_.scriptType = 'script';
_.styleType = 'style';
_.allowedTypes = [_.scriptType, _.styleType];

/**
 * Checks if the resource configuration object is valid. It should be noted
 * that this does not map the configuration object, it simply checks if all
 * its properties are valid
 * @param {Object} config The configuration object to be checked for validity
 * @private
 * @returns {Boolean} `True` if all the configuration properties are
 * of the correct type and form, `False` otherwise
 * @todo should we create a module that checks configs?
 * @todo should we check if the path is a valid URL?
 */
_.isConfigValid = (config) => {
  const isValidConfigProvided = !isEmptyObject(config);
  const hasValidPath = hasOwnProperty(config, 'path') ? (typeof config.path === 'string') && !!config.path.length : false;
  const hasValidType = _.allowedTypes.indexOf(config.type) > -1;
  const hasValidAsync = hasOwnProperty(config, 'async') ? (typeof config.async === 'boolean') : true;
  const hasValidCrossorigin = hasOwnProperty(config, 'crossorigin') ? (typeof config.crossorigin === 'boolean') : true;
  const hasValidData = hasOwnProperty(config, 'data') ? !isEmptyObject(config.data) : true;
  const hasValidSuccessCallback = hasOwnProperty(config, 'successCallback') ? isFunction(config.successCallback) : true;
  const hasValidErrorCallback = hasOwnProperty(config, 'errorCallback') ? isFunction(config.errorCallback) : true;
  const hasValidId = hasOwnProperty(config, 'id') ? (typeof config.id === 'string') && !!config.id.length : true;
  const hasValidLocation = hasOwnProperty(config, 'where') ? (typeof config.where === 'string') && !!config.where.length
                             && document.querySelector(config.where) instanceof HTMLElement : true;
  const hasValidLoadTime = hasOwnProperty(config, 'when') ? (typeof config.when === 'string') && !!config.when.length : true;

  return isValidConfigProvided && hasValidPath && hasValidType && hasValidAsync
           && hasValidCrossorigin && hasValidData && hasValidSuccessCallback
           && hasValidErrorCallback && hasValidId && hasValidLocation && hasValidLoadTime;
};

/**
 * Generates a `script` or `style` element, based on a configuration object
 * @param {Object} config Configuration object containing information around
 * what resource needs to be created, along with its properties
 * @private
 * @return {Element} The generated resource element
 */
_.generateResource = (config) => {
  let resourceElement;

  if (config.type === _.scriptType) {
    resourceElement = document.createElement('script');
    resourceElement.type = 'text/javascript';
    resourceElement.src = config.path;
    // Dynamically inserted scripts load asynchronously by default,
    // so to turn on synchronous loading 'async' should be set to 'false'
    if (hasOwnProperty(config, 'async')) {
      resourceElement.async = config.async;
    }
    if (hasOwnProperty(config, 'crossorigin') && config.crossorigin === true) {
      resourceElement.setAttribute('crossorigin', config.crossorigin);
    }
    if (hasOwnProperty(config, 'data') && !isEmptyObject(config.data)) {
      Object.keys(config.data).forEach((attribute) => {
        resourceElement.setAttribute(`data-${attribute}`, config.data[attribute]);
      });
    }
  } else if (config.type === _.styleType) {
    resourceElement = document.createElement('link');
    resourceElement.type = 'text/css';
    resourceElement.rel = 'stylesheet';
    resourceElement.href = config.path;
  }

  if (hasOwnProperty(config, 'id')) {
    if (document.querySelector(`#${config.id}`) === null) {
      resourceElement.id = config.id;
    } else {
      debug.error('element id is already used', resourceElement);
    }
  }

  return resourceElement;
};

/* Public methods */
/**
 * Based on a specified configuration object, it loads a script or style resource
 * inside a specified element in the DOM (default is `head`) at a specified moment
 * in time (when a particular event is dispatched)
 * @param {Object} config The resource configuration object
 * @param {String} config.path The path from where the resource will be loaded from
 * @param {'script' | 'style'} config.type The type of resource to be created.
 * At the moment this only handles `script` and `link` elements
 * @param {Boolean} [config.async] Specifies whether the resource should be loaded in
 * an asynchronous (`true`) or synchronous (`false`) manner. This is only applied if
 * the `config.type` value is `script`. It should be noted that dynamically inserted
 * scripts load asynchronously by default, meaning that this option should be used only
 * in special cases, where resources should be loaded synchronously
 * @param {Function} [config.successCallback] The method to be executed after the
 * resource has been loaded
 * @param {Function} [config.errorCallback] The method to be executed if the
 * resource could not be loaded
 * @param {String} [config.id] The ID attribute value of the resource. Please note
 * that this should be a unique identifier. Otherwise, this property will be ignored
 * @param {String} [config.where='head'] The DOM element in which to append the created resource
 * @param {String} [config.when] The event name for which to wait before loading the resource.
 * By default, the resource is loaded instantaneously
 * @return {Promise} This is so that multiple resources can be loaded together,
 * using the `Promise.all` method
 * @example
 * // creates the element:
 * // `<script type="text/javascript" src="path/to/resource.js" id="uniqueID"></script>`
 * // and adds it to the `body` element when the
 * // `customEventDispatched`event is fired on the `window` object
 * loadResource({
 *   path: 'path/to/resource.js',
 *   type: 'script',
 *   id: 'uniqueID',
 *   where: 'body',
 *   when: 'customEventDispatched'
 * });
 */
const loadResource = (config) => {
  if (isEmptyObject(config) || !_.isConfigValid(config)) {
    return undefined;
  }

  return new Promise((resolve, reject) => {
    const resourceElement = _.generateResource(config);

    resourceElement.addEventListener('load', () => {
      resolve(resourceElement);

      if (hasOwnProperty(config, 'successCallback')) {
        config.successCallback(resourceElement);
      }
    });

    resourceElement.addEventListener('error', (error) => {
      reject(error);

      if (hasOwnProperty(config, 'errorCallback')) {
        config.errorCallback(error);
      }
    });

    if (hasOwnProperty(config, 'when')) {
      window.addEventListener(config.when, () => {
        appendResource(resourceElement, { target: config.where });
      });
    } else {
      appendResource(resourceElement, { target: config.where });
    }
  });
};

export default loadResource;
