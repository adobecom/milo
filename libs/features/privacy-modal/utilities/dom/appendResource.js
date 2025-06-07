import hasOwnProperty from '../lang/hasOwnProperty.js';

/**
 * Appends a resource (<link> or <script>) in a specified DOM element
 * @param {Element} resource The resource to be appended
 * @param {Object} config The resource configuration object
 * @param {String} [config.target='head'] The DOM element where the resource should be loaded
 */
const appendResource = (resource, config) => {
  const isTargetValid = hasOwnProperty(config, 'target') && (typeof config.target === 'string') && !!config.target.length;
  const targetSelector = isTargetValid ? config.target : 'head';
  const targetElement = document.querySelector(targetSelector);
  const isResourceLink = resource instanceof HTMLLinkElement;
  const isResourceScript = resource instanceof HTMLScriptElement;

  if (targetElement instanceof HTMLElement && (isResourceLink || isResourceScript)) {
    targetElement.appendChild(resource);
  }
};

export default appendResource;
