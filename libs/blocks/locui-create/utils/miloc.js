/* eslint-disable no-unused-vars */
import { accessToken } from '../../../tools/sharepoint/state.js';
import getServiceConfig from '../../../utils/service-config.js';
import { origin } from '../../locui/utils/franklin.js';

function getMilocUrl() {
  return 'https://14257-miloc-dev.adobeioruntime.net/api/v1/web/miloc-0.0.1/';
}

export default async function updateProject(projectValues, publish = false) {
  const {
    name, type, fragments, urls, htmlFlow, editBehavior, languages,
  } = projectValues;

  const settings = { env: 'stage' };
  if (htmlFlow) {
    settings.useHtmlFlow = true;
  }
  if (editBehavior) {
    settings.regionalEditBehaviour = editBehavior;
  }
  const fragmentsUrls = fragments.map((fragment) => `${origin}${fragment}`);
  const body = {
    projectName: name,
    projectType: type === 'rollout' ? 'rollout' : 'localizaton',
    urls: [...urls, ...fragmentsUrls],
    settings,
    languages,
    projectKey: '2d65421359309d67a6bc9a2aead9086e',
    publish,
  };
  try {
    const url = getMilocUrl();
    const opts = { method: 'POST', headers: { 'User-Token': accessToken.value }, body: JSON.stringify(body) };
    const resp = await fetch(`${url}update-draft-project`, opts);
    if (resp.status === 200 || resp.status === 201) {
      const jsonRes = await resp.json();
      return jsonRes;
    }
    return { error: 'Something went wrong.' };
  } catch (e) {
    return { error: 'Something went wrong, please try again after sometime.' };
  }
}
