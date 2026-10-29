const FEATURE_FLAG = 'caas-authoring-service';
const EXPECTED_CORE_VERSION = '1';
const REQUEST_TIMEOUT = 5000;
const SERVICE_URL = 'https://14257-milocaasproxy-jmichnow.adobeioruntime.net/api/v1/web/milocaas/card-collection-authoring';

const getCookie = (name, cookieString = document.cookie) => cookieString
  .split(';')
  .map((cookie) => cookie.trim())
  .find((cookie) => cookie.startsWith(`${name}=`))
  ?.substring(name.length + 1);

export const isAuthoringServiceEnabled = ({
  search = window.location.search,
  cookie = document.cookie,
} = {}) => {
  const flag = new URLSearchParams(search).get(FEATURE_FLAG);
  if (flag === 'on') return true;
  if (flag === 'off') return false;
  return getCookie(FEATURE_FLAG, cookie) === 'on';
};

const getErrorMessage = (payload, status) => payload?.error?.message
  || `Card collection authoring service returned HTTP ${status}.`;

export const createAuthoringServiceClient = ({
  fetchImpl = window.fetch.bind(window),
  serviceUrl = SERVICE_URL,
  timeout = REQUEST_TIMEOUT,
} = {}) => {
  const request = async (operation, body) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    try {
      const response = await fetchImpl(`${serviceUrl}/${operation}`, {
        method: body ? 'POST' : 'GET',
        headers: body ? { 'Content-Type': 'application/json' } : {},
        ...(body && { body: JSON.stringify(body) }),
        signal: controller.signal,
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(getErrorMessage(payload, response.status));
      if (payload.coreVersion !== EXPECTED_CORE_VERSION) {
        throw new Error(
          `Unsupported card collection authoring core version: ${payload.coreVersion || 'missing'}.`,
        );
      }
      return payload;
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Card collection authoring service request timed out.');
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  };

  return {
    createUrl: (state) => request('create-url', { state }),
    decode: (url) => request('decode', { url }),
    getContract: () => request('contract'),
    updateUrl: (url, patch) => request('update-url', { url, patch }),
    validate: (state) => request('validate', { state }),
  };
};

export {
  EXPECTED_CORE_VERSION,
  FEATURE_FLAG,
  SERVICE_URL,
};
