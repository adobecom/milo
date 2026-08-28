import { stub } from 'sinon';

let config = {};

export function createTag(tag, attributes, html) {
  const el = document.createElement(tag);
  if (html) {
    if (html instanceof HTMLElement
      || html instanceof SVGElement
      || html instanceof DocumentFragment) {
      el.append(html);
    } else if (Array.isArray(html)) {
      el.append(...html);
    } else {
      el.insertAdjacentHTML('beforeend', html);
    }
  }
  if (attributes) {
    Object.entries(attributes).forEach(([key, val]) => {
      el.setAttribute(key, val);
    });
  }
  return el;
}

const PAGE_URL = new URL(window.location.href);
export const SLD = PAGE_URL.hostname.includes('.aem.') ? 'aem' : 'hlx';

export const getConfig = () => config;

export const setConfig = (c) => { config = c; };

export const customFetch = stub();

export const loadArea = stub();

export const loadScript = stub();

export const loadStyle = stub();

export const getMetadata = stub();

export const localizeLinkAsync = stub();

export const loadLink = stub();

export const reloadPage = stub();

export const getCountry = stub().resolves('us');

export const loadIms = stub().resolves();

/**
 * TODO: This method will be deprecated and removed in a future version.
 * @see https://jira.corp.adobe.com/browse/MWPW-173470
 * @see https://jira.corp.adobe.com/browse/MWPW-174411
*/
export const shouldAllowKrTrial = stub();

export const lingoActive = () => false;
export const getGeoLocalePrefix = () => Promise.resolve(null);
export const getPlaceholderPaths = () => [];
export const getGeoIpSheetHoist = () => undefined;
export const normCountryCode = (country) => {
  if (typeof country !== 'string') return undefined;
  const lower = country.toLowerCase();
  return lower === 'uk' ? 'gb' : lower.split('_')[0];
};
export const resolveDetectedMarketCountry = () => Promise.resolve(undefined);

const MASLIBS_PATTERN = /^([a-z0-9]+(-[a-z0-9]+)*)(--([a-z0-9]+(-[a-z0-9]+)*)){0,2}$/;
const MASLIBS_MAX_LENGTH = 100;

/** Mirrors getValidatedMasLibsUrl in libs/utils/utils.js (VULN-36379). */
export function getValidatedMasLibsUrl(masLibs) {
  if (!masLibs || masLibs.trim() === '') return null;
  const value = masLibs.trim().toLowerCase();
  if (value === 'local') return 'http://localhost:3000';
  if (value === 'main') return 'https://main--mas--adobecom.aem.live';
  if (value.length > MASLIBS_MAX_LENGTH || !MASLIBS_PATTERN.test(value)) return null;
  const branch = value.includes('--') ? value : `${value}--mas--adobecom`;
  let url;
  try {
    url = new URL(`https://${branch}.aem.live`);
  } catch {
    return null;
  }
  if (!url.hostname.endsWith('.aem.live')) return null;
  return url.origin;
}
