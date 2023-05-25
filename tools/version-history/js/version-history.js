import { loadingOFF, loadingON } from '../../loc/utils.js';
import { connectWithSPRest, getAuthorizedRequestOptionSP } from '../../loc/sharepoint.js';

async function init() {
  loadingON('Fetch token for sharepoint API\'s... please wait');
  await connectWithSPRest();
  loadingOFF('Token successful...done');
  const options = getAuthorizedRequestOptionSP();

  const urlParams = new URLSearchParams(window.location.href);
  const referrer = urlParams.get("referrer");
  const sourceCode = referrer.match(/sourcedoc=([^&]+)/)[1];
  const sourceId = decodeURIComponent(sourceCode);

  const url = `https://adobe.sharepoint.com/sites/adobecom/_api/web/GetFileById('${sourceId}')`;

  const fetchVersions = async (onlyMajorVersions = false) => {
    const documentData = await fetch(url, options);
    const {CheckInComment, TimeLastModified, UIVersionLabel, ServerRelativeUrl} = await documentData.json();
    const projectDetailsWrapper = document.getElementById('project-url');
    if (projectDetailsWrapper) {
      projectDetailsWrapper.textContent = `${ServerRelativeUrl}`;
    }
  
    const currentVersion = {
      VersionLabel: UIVersionLabel,
      CheckInComment,
      Created: TimeLastModified
    }
  
    const versions = await fetch(`${url}/Versions`, options);
    const { value } = await versions.json();
  
    const versionHistory = [...value, currentVersion];
  
    const createTd = (data) => {
      const td = document.createElement('td');
      td.textContent = data;
      return td;
    }
  
    const createTr = (data) => {
      const trElement = document.createElement('tr');
      const { VersionLabel, CheckInComment, Created } = data;
      trElement.appendChild(createTd(VersionLabel));
      trElement.appendChild(createTd(Created.split('T')[0]));
      trElement.appendChild(createTd(CheckInComment));
      return trElement;
    }
    const versionDataParent = document.querySelector("#addVersionHistory");
    versionDataParent.innerHTML='';
    versionHistory.reverse().forEach((item) => {
      if(onlyMajorVersions && item.VersionLabel.indexOf('.0') !== -1) {
        versionDataParent.appendChild(createTr(item));
      }
    });
  }

  const publishCommentCall = async (comment) => {
    const callOptions = getAuthorizedRequestOptionSP({
      method: 'POST'
    });
    await fetch(`${url}/Publish('${comment}')`, callOptions);
  }

  document.getElementById('publish').addEventListener('click', async (e) => {
    e.preventDefault();
    loadingON('Publish comment');
    const comment = document.querySelector('#comment').value;
    if (comment) {
      await publishCommentCall(`Through API: ${comment}`);
      await fetchVersions(true);
    }
    loadingOFF('Published');
  });

  fetchVersions(true);
}

export default init;
