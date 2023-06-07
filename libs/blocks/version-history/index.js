import { getReqOptions } from '../../utils/deps/msal.js';

const urlParams = new URLSearchParams(window.location.href);
const referrer = urlParams.get("referrer");
const sourceCode = referrer?.match(/sourcedoc=([^&]+)/)[1];
const sourceId = decodeURIComponent(sourceCode);
const url = `https://adobe.sharepoint.com/sites/adobecom/_api/web/GetFileById('${sourceId}')`;
const contentType = 'application/json;odata=verbose';
const accept = 'application/json;odata=nometadata';

export const fetchVersions = async () => {
  const options = getReqOptions({
    contentType,
    accept
  });
  const response = await fetch(url, options);
  const documentData = await response.json();
  const { CheckInComment, TimeLastModified, UIVersionLabel, ServerRelativeUrl, ID } = documentData;
  const currentVersion = {
    ID,
    Url: ServerRelativeUrl,
    VersionLabel: UIVersionLabel,
    CheckInComment,
    Created: TimeLastModified,
    IsCurrentVersion: true,
  }

  const versions = await fetch(`${url}/Versions`, options);
  const { value } = await versions.json();
  const versionHistory = [...value, currentVersion];
  return versionHistory.reverse().filter((item) => item.VersionLabel.indexOf('.0') !== -1);
}

export const createHistoryTag = async (comment = 'default') => {
  const callOptions = getReqOptions({
    method: 'POST',
    accept,
    contentType
  });
  await fetch(`${url}/Publish('${comment}')`, callOptions);
}



