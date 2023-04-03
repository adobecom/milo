import {
  createTag,
  getAnchorHtml,
  getLinkOrDisplayText,
  getPathFromUrl,
  showButtons,
} from '../../loc/utils.js';
import {
  createColumn,
  getFloodgateUrl,
} from './utils.js';

const ACTION_BUTTON_IDS = ['reloadProject', 'copyFiles', 'promoteFiles'];

function getSharepointStatus(doc, isFloodgate) {
  let sharepointStatus = 'Connect to Sharepoint';
  let hasSourceFile = false;
  let modificationInfo = 'N/A';
  if (!isFloodgate && doc && doc.sp) {
    if (doc.sp.status === 200) {
      sharepointStatus = `${doc.filePath}`;
      hasSourceFile = true;
      modificationInfo = `By ${doc.sp?.lastModifiedBy?.user?.displayName} at ${doc.sp?.lastModifiedDateTime}`;
    } else {
      sharepointStatus = 'Source file not found!';
    }
  } else if (isFloodgate && doc && doc.fg && doc.fg.sp) {
    if (doc.fg.sp.status === 200) {
      sharepointStatus = `${doc.filePath}`;
      hasSourceFile = true;
      modificationInfo = `By ${doc.fg.sp?.lastModifiedBy?.user?.displayName} at ${doc.fg.sp?.lastModifiedDateTime}`;
    } else {
      sharepointStatus = 'Floodgated file not found!';
    }
  }
  return { hasSourceFile, msg: sharepointStatus, modificationInfo };
}

function updateProjectInfo(project) {
  document.getElementById('project-url').innerHTML = `<a href='${project.sp}' title='${project.excelPath}'>${project.name}</a>`;
}

function createTableWithHeaders() {
  const table = createTag('table');
  const tr = createTag('tr', { class: 'header' });
  tr.appendChild(createColumn('Source URL', 'header'));
  tr.appendChild(createColumn('Source File', 'header'));
  tr.appendChild(createColumn('Source File Info', 'header'));
  tr.appendChild(createColumn('Floodgated Content', 'header'));
  tr.appendChild(createColumn('Floodgated File Info', 'header'));
  table.appendChild(tr);
  return table;
}

function getFloodgatedContentInfoHtml(url, fgSpViewUrl, fgDocStatus) {
  if (fgDocStatus.hasSourceFile) {
    const fgPageUrl = getAnchorHtml(getFloodgateUrl(url), 'Url');
    const fgDocDisplayText = getAnchorHtml(fgSpViewUrl.replace('<relativePath>', fgDocStatus.msg), 'File');
    return `${fgPageUrl}, ${fgDocDisplayText}`;
  }
  return fgDocStatus.msg;
}

async function updateProjectDetailsUI(projectDetail, config) {
  if (!projectDetail || !config) {
    return;
  }

  const container = document.querySelector('.project-detail');
  container.innerHTML = '';

  const table = createTableWithHeaders();
  const spViewUrl = config.sp.shareUrl;
  const fgSpViewUrl = config.sp.fgShareUrl;

  projectDetail.urls.forEach((urlInfo, url) => {
    const tr = createTag('tr');
    const docPath = getPathFromUrl(url);

    // Source file data
    const pageUrl = getAnchorHtml(url, docPath);
    tr.appendChild(createColumn(pageUrl));
    const usEnDocStatus = getSharepointStatus(urlInfo.doc);
    const usEnDocDisplayText = getLinkOrDisplayText(spViewUrl, usEnDocStatus);
    tr.appendChild(createColumn(usEnDocDisplayText));
    tr.appendChild(createColumn(usEnDocStatus.modificationInfo));

    // Floodgated file data
    const fgDocStatus = getSharepointStatus(urlInfo.doc, true);
    tr.appendChild(createColumn(getFloodgatedContentInfoHtml(url, fgSpViewUrl, fgDocStatus)));
    tr.appendChild(createColumn(fgDocStatus.modificationInfo));

    table.appendChild(tr);
  });

  container.appendChild(table);
  showButtons(ACTION_BUTTON_IDS);
}

function updateProjectStatusUI(status) {
  document.querySelector('#copy-status').innerHTML = status.copy.status;
  document.querySelector('#copy-status-ts').innerHTML = status.copy.lastRun;
  document.querySelector('#promote-status').innerHTML = status.promote.status;
  document.querySelector('#promote-status-ts').innerHTML = status.promote.lastRun;
  document.querySelector('.project-status').hidden = false;
}

export {
  updateProjectInfo,
  updateProjectDetailsUI,
  updateProjectStatusUI,
  ACTION_BUTTON_IDS,
};
