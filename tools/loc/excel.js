import {
  connect,
  getAccessToken,
  getAuthorizedRequestOption,
  getSharepointFileRequest,
  getSpFiles,
} from './sharepoint.js';
import getConfig from './config.js';

const SESSION_KEY = 'milo-excel-session';
const SESSION_EXPIRATION_MS = 5 * 60 * 1000;

const isSessionValid = (session) => {
  if (session?.time) {
    return (new Date().getTime() - session.time) < SESSION_EXPIRATION_MS;
  }
  return false;
};

const getCachedSessionId = (fileId) => {
  const cachedSession = JSON.parse(sessionStorage.getItem(`${SESSION_KEY}_${fileId}`));
  if (isSessionValid(cachedSession)) {
    console.log('Cached SessionID: ' + cachedSession.id);
    return cachedSession.id;
  }
  sessionStorage.removeItem(SESSION_KEY);
  return null;
}

const setCachedSessionId = (sessionId, fileId) => {
  sessionStorage.setItem(
    `${SESSION_KEY}_${fileId}`,
    JSON.stringify({
      id: sessionId,
      time: new Date().getTime(),
    }),
  );
};

const getSessionId = async ({
  fileId = '',
  persistChanges = true,
} = {}) => {
  if (!getAccessToken()) {
    await connect();
  }
  const { sp } = await getConfig();

  const cachedSessionId = getCachedSessionId(fileId);
  if (cachedSessionId) return cachedSessionId;

  const options = getAuthorizedRequestOption({
    method: 'POST',
    body: { persistChanges },
  });
  const url = `${sp.site}/drive/items/${fileId}/workbook/createSession`;
  const res = await fetch(url, options);
  if (res.ok) {
    const json = await res.json();
    setCachedSessionId(json.id, fileId);
    return json.id;
  }
  return '';
};

const getExcelWorkbook = ({ fileId = '', site = ''} = {}) => {
  if (!(fileId || site)) return null;

  const urlPrefix = `${site}/drive/items/${fileId}/workbook`;

  const fetchExcelData = async (url, {
    body = null,
    method = 'GET',
  } = {}) => {
    if (!url) return null;

    const options = getAuthorizedRequestOption({
      body,
      method,
      additionalHeaders: [['workbook-session-id', await getSessionId({ fileId })]],
    });

    const res = await fetch(url, options);
    if (res.ok) {
      const json = await res.json();
      return json;
    }
  };

  const getWorksheets = async () => fetchExcelData(`${urlPrefix}/worksheets`);

  const getWorksheetData = async (worksheet, range = '') => {
    if (!worksheet) return null;

    const url = range
      ? `${urlPrefix}/worksheets/${worksheet}/range(address='${range}')`
      : `${urlPrefix}/worksheets/${worksheet}/usedRange`;

    return fetchExcelData(url);
  };

  const updateWorksheetData = async (worksheet, range = '', values = []) => {
    if (!(worksheet || range)) return null;
    const url = `${urlPrefix}/worksheets/${worksheet}/range(address='${range}')`;
    return fetchExcelData(url, {
      method: 'PATCH',
      body: { values },
    })
  };

  return {
    getWorksheets,
    getWorksheetData,
    updateWorksheetData,
  }
};

const excelTest = (project) => async () => {
  const { sp } = await getConfig();
  const locWorkbook = getExcelWorkbook({
    fileId: project.xlsxId,
    site: sp.site,
  });
  // const worksheetData = await locWorkbook.getWorksheetData('helix-translation', 'A5:D5');
  const worksheetData = await locWorkbook.updateWorksheetData('helix-translation', 'A5:D5', [['new url', null, 'Translate', 'blah', 'too many']]);
  console.log(worksheetData);
};

export default excelTest;
