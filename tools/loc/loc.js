import {
  createContext,
  html,
  render,
  signal,
  useContext,
  useEffect,
  useReducer,
  useState,
} from '../../libs/deps/htm-preact.js';
import getConfig from './config.js';
import getProject from './project.js';

const CONFIG_SHEET_PATH = '/drafts/localization/configs/config-v2.json';

const fetchJson = async (url) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Error fetching ${url}: ${res.status} ${res.statusText}`);
  }
  return res.json();
};

// const getQueryParams = (names) => {
//   const pageUrl = new URL(window.location.href);
//   return names.reduce((params, name) => {
//     params[name] = pageUrl.searchParams.get(name);
//     return params;
//   }, {});
// };

// const getConfig = ({ owner, ref, repo } = {}) => {
//   if (!(owner || ref || repo)) {
//     throw new Error('Missing "owner", "ref", or "repo" queryparams.');
//   }
//   const configSheetUrl = `https://${ref}--${repo}--${owner}.hlx.page${CONFIG_SHEET_PATH}`;
//   const configJson = await fetchJson(configSheetUrl);

// }

const SubProject = () => {
  const [language, setLanguage] = useState();
  const [pages, setPages] = useState();
  const [method, setMethod] = useState();
  const [rolloutLocales, setRolloutLocales] = useState();

};

const LocProject = () => {
  const [config, setConfig] = useState();
  const [projectInfo, setProjectInfo] = useState();
  const [subProjects, setSubProjects] = useState();
  const [pages, setPages] = useState();
  const [error, setError] = useState('');

  useEffect(async () => {
    try {
      setConfig(await getConfig());
      const project = await getProject();
      project.details = await project.detail();
      setProjectInfo(project);
    } catch (e) {
      setError(e.message);
    }
  }, []);

  return html`
    <div class="project-info">
      <h3>PROJECT</h3>
      <div>ProjectInfo: ${JSON.stringify(projectInfo, null, 2)}</div>
    </div>
    ${error && html`<div id="error">${error}</div>`}
  `;
};

const init = async (el) => {
  // loadStyle('/libs/ui/page/page.css');

  const app = html` <${LocProject} rootEl=${el} /> `;

  render(app, el);
};

export default init;
