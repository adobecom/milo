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
const LOC_CONFIG = '/drafts/localization/configs/config-v2.json';
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

async function getDecoratedLocalesConfig(localesConfig) {
  const decoratedLocalesConfig = {};
  localesConfig.forEach((localeConfig) => {
    decoratedLocalesConfig[localeConfig.languagecode] = {
      livecopies: localeConfig.livecopies,
      altlang: localeConfig.altlang,
      workflow: localeConfig.workflow,
      altlangWorflow: localeConfig.altlangWorflow,
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

function getWorkflowForLocale(workflowsConfig, locale, decoratedLocales) {
  const localeConfig = decoratedLocales[locale];
  const workflow = localeConfig?.workflow ? localeConfig.workflow : DEFAULT_WORKFLOW;
  return {
    name: workflow,
    ...workflowsConfig[workflow],
  };
}

function getAltLangWorkflowForLocale(workflowsConfig, locale, decoratedLocales) {
  const localeConfig = decoratedLocales[locale];
  const { altlangWorkflow } = localeConfig;
  return {
    name: altlangWorkflow,
    ...workflowsConfig[altlangWorkflow],
  };
}

function getGLaaSRedirectURI() {
  const location = new URL(window.location.href);
  return encodeURI(`${location.origin}/tools/loc/glaas.html`);
}

async function getDecoratedGLaaSConfig(config, decoratedLocales, workflowsConfig) {
  return {
    ...config.glaas.data[0],
    workflows: workflowsConfig,
    authorizeURI: '/api/common/sweb/oauth/authorize',
    redirectURI: getGLaaSRedirectURI(),
    accessToken: null,
    api: { session: { check: { uri: '/api/common/v1.0/checkSession' } } },
    localeApi: (locale) => {
      const workflow = getWorkflowForLocale(workflowsConfig, locale, decoratedLocales);
      const { product, project, workflowName } = workflow;
      const baseURI = `/api/l10n/v1.1/tasks/${product}/${project}`;
      return {
        tasks: {
          create: {
            uri: `${baseURI}/create`,
            payload: {
              workflowName,
              contentSource: 'Adhoc',
            },
          },
          get: { baseURI: `${baseURI}` },
          getAll: { uri: `${baseURI}` },
          updateStatus: { baseURI: `${baseURI}` },
          assets: { baseURI: `${baseURI}` },
        },
      };
    },
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
        },
      },
      directory: {
        create: {
          baseURI,
          method: 'PATCH',
          payload: { folder: {} },
        },
      },
      batch: { uri: `${GRAPH_API}/$batch` },
    },
  };
}

function getHelixAdminConfig() {
  const adminServerURL = 'https://admin.hlx3.page';
  return {
    api: {
      status: { baseURI: `${adminServerURL}/status` },
      preview: { baseURI: `${adminServerURL}/preview` },
    },
  };
}

async function getConfig() {
  const location = new URL(document.location.href);
  function getParam(name) { return location.searchParams.get(name); }

  const sub = location.hostname.split('.').shift().split('--');

  const owner = getParam('owner') || sub[2];
  const repo = getParam('repo') || sub[1];
  const ref = getParam('ref') || sub[0];
  const configPath = `https://${ref}--${repo}--${owner}.hlx.page${LOC_CONFIG}`;

  if (!decoratedConfig) {
    const configJson = await fetchConfigJson(configPath);
    const locales = await getLocalesConfig(configJson);
    const decoratedLocales = await getDecoratedLocalesConfig(locales);
    const workflowsConfig = getWorkflowsConfig(configJson);
    decoratedConfig = {
      locales,
      decoratedLocales,
      glaas: await getDecoratedGLaaSConfig(configJson, decoratedLocales, workflowsConfig),
      sp: getSharepointConfig(configJson),
      admin: getHelixAdminConfig(),
      async getLivecopiesForLanguage(language) {
        const localeConfig = decoratedLocales[language];
        return localeConfig?.livecopies ? localeConfig.livecopies : null;
      },
      async getAltLangLocales(language) {
        const localeConfig = decoratedLocales[language];
        return localeConfig?.altlang ? localeConfig.altlang : null;
      },
      async getWorkflowForLocale(locale) {
        return getWorkflowForLocale(configJson, locale, decoratedLocales);
      },
      async getAltLangWorkflowForLocale(locale) {
        return getAltLangWorkflowForLocale(configJson, locale, decoratedLocales);
      },
    };
  }
  return decoratedConfig;
}

export default getConfig;
