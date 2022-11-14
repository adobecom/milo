/*
 * Copyright 2021 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
/* global */
import { getUrlInfo } from './utils.js';

const LOC_CONFIG = '/drafts/localization/configs/config.json';
const DEFAULT_WORKFLOW = 'Standard';
const GRAPH_API = 'https://graph.microsoft.com/v1.0';

let decoratedConfig;

async function fetchConfigJson(configPath) {
  const configResponse = await fetch(configPath);
  if (!configResponse.ok) {
    throw new Error('Config not found!');
  }
  return configResponse.json();
}

function getLocalesConfig(config) {
  return config.locales.data;
}

function getDecoratedLocalesConfig(localesConfig) {
  const decoratedLocalesConfig = {};
  localesConfig.forEach((localeConfig) => {
    decoratedLocalesConfig[localeConfig.languagecode] = {
      livecopies: localeConfig.livecopies,
      workflow: localeConfig.workflow,
      language: localeConfig.language,
      languagecode: localeConfig.languagecode,
      altLanguagecode: localeConfig.altLanguagecode,
    };
  });
  return decoratedLocalesConfig;
}

function getWorkflowsConfig(config) {
  const workflows = {};
  config.workflows.data.forEach((workflow) => {
    workflows[workflow.name] = workflow;
  });
  return workflows;
}

function getWorkflowForLanguage(workflowsConfig, locale, decoratedLocales, customWorkflow) {
  const localeConfig = decoratedLocales[locale];
  const workflow = customWorkflow
    || (localeConfig?.workflow ? localeConfig.workflow : DEFAULT_WORKFLOW);
  return {
    name: workflow,
    ...workflowsConfig[workflow],
  };
}

function getGLaaSRedirectURI() {
  const location = new URL(window.location.href);
  return encodeURI(`${location.origin}/tools/loc/glaas.html`);
}

function getGLaaSAPIDetails(workflow, previewServer) {
  const { product, project, workflowName } = workflow;
  const baseURI = `/api/l10n/v1.1/tasks/${product}/${project}`;
  const previewURL = previewServer || (new URL(document.location.href)).origin;
  return {
    create: {
      uri: `${baseURI}/create`,
      payload: {
        workflowName,
        contentSource: 'Adhoc',
        config: [{ value: `${previewURL}`, key: 'preview-server' }],
      },
    },
    get: { baseURI: `${baseURI}` },
    getAll: { uri: `${baseURI}` },
    updateStatus: { baseURI: `${baseURI}` },
    assets: { baseURI: `${baseURI}` },
  };
}

function getDecoratedGLaaSConfig(config, decoratedLocales, workflowsConfig) {
  const gLaaSConfig = config.glaas.data[0];
  return {
    ...gLaaSConfig,
    workflows: workflowsConfig,
    authorizeURI: '/api/common/sweb/oauth/authorize',
    redirectURI: getGLaaSRedirectURI(),
    accessToken: null,
    api: { session: { check: { uri: '/api/common/v1.0/checkSession' } } },
    tasksApi: (workflow) => ({ tasks: getGLaaSAPIDetails(workflow, gLaaSConfig?.previewServer) }),
  };
}

function getSharepointConfig(config) {
  const sharepointConfig = config.sp.data[0];
  // ${sharepointConfig.site} - MS Graph API Url with site pointers.
  const baseURI = `${sharepointConfig.site}/drive/root:${sharepointConfig.rootFolders}`;
  return {
    ...sharepointConfig,
    clientApp: {
      auth: {
        clientId: sharepointConfig.clientId,
        authority: sharepointConfig.authority,
      },
      cache: { cacheLocation: 'sessionStorage' },
    },
    shareUrl: sharepointConfig.shareurl,
    login: { redirectUri: '/tools/loc/spauth' },
    api: {
      url: GRAPH_API,
      file: {
        get: { baseURI },
        download: { baseURI: `${sharepointConfig.site}/drive/items` },
        upload: {
          baseURI,
          method: 'PUT',
        },
        delete: {
          baseURI,
          method: 'DELETE',
        },
        update: {
          baseURI,
          method: 'PATCH',
        },
        createUploadSession: {
          baseURI,
          method: 'POST',
          payload: { '@microsoft.graph.conflictBehavior': 'replace' },
        },
        copy: {
          baseURI,
          method: 'POST',
          payload: { '@microsoft.graph.conflictBehavior': 'replace' },
        },
      },
      directory: {
        create: {
          baseURI,
          method: 'PATCH',
          payload: { folder: {} },
        },
      },
      excel: {
        update: {
          baseURI,
          method: 'POST',
        },
      },
      batch: { uri: `${GRAPH_API}/$batch` },
    },
  };
}

function getHelixAdminConfig() {
  const adminServerURL = 'https://admin.hlx.page';
  return {
    api: {
      status: { baseURI: `${adminServerURL}/status` },
      preview: { baseURI: `${adminServerURL}/preview` },
    },
  };
}

async function getConfig() {
  if (!decoratedConfig) {
    const urlInfo = getUrlInfo();
    if (urlInfo.isValid()) {
      const configPath = `${urlInfo.origin}${LOC_CONFIG}`;
      const configJson = await fetchConfigJson(configPath);
      const locales = getLocalesConfig(configJson);
      const decoratedLocales = getDecoratedLocalesConfig(locales);
      const workflowsConfig = getWorkflowsConfig(configJson);
      decoratedConfig = {
        locales,
        decoratedLocales,
        glaas: getDecoratedGLaaSConfig(configJson, decoratedLocales, workflowsConfig),
        sp: getSharepointConfig(configJson),
        admin: getHelixAdminConfig(),
        getLivecopiesForLanguage(language) {
          const localeConfig = decoratedLocales[language];
          return localeConfig?.livecopies ? localeConfig.livecopies : null;
        },
        getWorkflowForLanguage(language, customWorkflow) {
          return getWorkflowForLanguage(workflowsConfig, language, decoratedLocales, customWorkflow);
        },
      };
    }
  }
  return decoratedConfig;
}

export default getConfig;
