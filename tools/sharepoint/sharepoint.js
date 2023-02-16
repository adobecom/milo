import getConfig from '../loc/config.js';
import {
  getAuthorizedRequestOption,
  connect as connectToSP,
} from '../loc/sharepoint.js';

let rootfolder;

async function recursivelyFindAllDocxFilesInMiloFolder() {
  const { sp } = await getConfig();
  let sharePointBaseURI = `${sp.api.file.get.baseURI}`;
  if (rootfolder) {
    sharePointBaseURI = `${sharePointBaseURI.substring(0, sharePointBaseURI.lastIndexOf("/"))}/${rootfolder}`;
  }

  const options = getAuthorizedRequestOption({
    method: 'GET',
  });

  return findAllDocx(sharePointBaseURI, options);
}

let folders = [''];
let docs = [];

async function findAllDocx(sharePointBaseURI, options) {
  while (folders.length != 0) {
    const uri = `${sharePointBaseURI}${folders.shift()}:/children`;
    const res = await fetch(uri, options);
    if (res.ok) {
      const json = await res.json();
      const files = json.value;
      if (files) {
        for (let fileObj of files) {
          if (fileObj.folder) {
            const folderPath = fileObj.parentReference.path.replace(`/drive/root:/${rootfolder}`, '') + '/' + fileObj.name;
            folders.push(folderPath);
          } else if (fileObj?.file?.mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            const downloadUrl = fileObj['@microsoft.graph.downloadUrl'];
            const docPath = fileObj.parentReference.path + '/' + fileObj.name;
            console.log(docPath);
            docs.push({ docDownloadUrl: downloadUrl, docPath: docPath });
          }
        };
      }
    }
  }

  return docs;
}

async function iterateTree() {

  document.getElementById('status').style.display = 'block';
  document.getElementById('status').innerHTML = 'Please wait while iteration is in progress... check console for additional details.';
  document.getElementById('iterateTree').style.display = 'none';

  const result = document.getElementById('result');
  const start = new Date();
  result.innerHTML = `<p>Folder iteration started at : ${start}</p>`;
  const docs = await recursivelyFindAllDocxFilesInMiloFolder();
  const end = new Date();
  result.innerHTML +=
    `<p>Folder iteration ended at : ${end}</p>
      <p>Total time taken : ${(end - start) / 1000} seconds</p>
      <p>Number of word documents found : ${docs.length}</p>`;

  document.getElementById('status').style.display = 'none';
}

function setListeners() {
  document.querySelector('#iterateTree button').addEventListener('click', iterateTree);
}

async function init() {
  try {
    setListeners();
    const connectedToSp = await connectToSP();
    if (!connectedToSp) {
      console.log('Error connecting to Sharepoint');
      return;
    }
    document.getElementById('status').style.display = 'none';
    document.getElementById('iterateTree').style.display = 'block';
    console.log('Connected to sharepoint');

    const location = new URL(document.location.href);
    rootfolder = location.searchParams.get('root') || 'milo';
  } catch (error) {
    console.log(`Error occurred :: ${error.message}`);
  }
}


export default init;
