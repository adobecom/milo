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
/* global window */

const TRACKER_CONFIG = '/_draft/trackers/trackerconfig.json';

let config;

async function getConfig() {
  if (!config ) {
    const res = await fetch(TRACKER_CONFIG);
    if (!res.ok) {
      throw new Error('Config not found!');
    }

    const json = await res.json();
    const g = json.glaas.data[0];
    const sp = json.sp.data[0];
    // reshape object for easy access
    config = {
      locales: json.locales.data,
      glaas: {
        ...g,
        workflows: {}
      },
      sp
    };
    json.workflows.data.forEach(w => {
      config.glaas.workflows[w.name] = w;
    });

    const location = new URL(window.location.href);

    config.glaas = {
      ...config.glaas,
      authorizeURI: '/api/common/sweb/oauth/authorize',
      redirectURI: encodeURI(`${location.origin}/tools/translation/glaas.html`),
      accessToken: null,
      api: {
        session: {
          check: {
            uri: '/api/common/v1.0/checkSession',
          },
        },
      },
      localeApi: async (locale) => {
        const workflow = await getWorkflowForLocale(locale);
        const { product, project, workflowName } = workflow;
        return {
          tasks: {
            create: {
              uri: `/api/l10n/v1.1/tasks/${product}/${project}/create`,
              payload: {
                workflowName: workflowName,
                contentSource: 'Adhoc'
              },
            },
            get: {
              baseURI: `/api/l10n/v1.1/tasks/${product}/${project}`,
            },
            getAll: {
              uri: `/api/l10n/v1.1/tasks/${product}/${project}`,
            },
            updateStatus: {
              baseURI: `/api/l10n/v1.1/tasks/${product}/${project}`,
            },
            assets: {
              baseURI: `/api/l10n/v1.1/tasks/${product}/${project}`,
            },
          }
        };
      }
    };

    const graphURL = 'https://graph.microsoft.com/v1.0';

    config.sp = {
      ...config.sp,
      clientApp: {
        auth: {
          clientId: config.sp.clientId,
          authority: config.sp.authority,
        },
      },
      login: {
        redirectUri: '/tools/translation/spauth',
      },
      api: {
        url: graphURL,
        file: {
          get: {
            baseURI: `${config.sp.site}/drive/root:${config.sp.rootFolders}`,
          },
          download: {
            baseURI: `${config.sp.site}/drive/items`,
          },
          upload: {
            baseURI: `${config.sp.site}/drive/root:${config.sp.rootFolders}`,
            method: 'PUT',
          },
          createUploadSession: {
            baseURI: `${config.sp.site}/drive/root:${config.sp.rootFolders}`,
            method: 'POST',
            payload: {
              '@microsoft.graph.conflictBehavior': 'replace',
            },
          },
        },
        directory: {
          create: {
            baseURI: `${config.sp.site}/drive/root:${config.sp.rootFolders}`,
            method: 'PATCH',
            payload: {
              folder: {},
            },
          },
        },
        batch: {
          uri: `${graphURL}/$batch`,
        },
      },
    };

    const adminServerURL = 'https://admin.hlx3.page';
    config.admin = {
      api: {
        status: {
          baseURI: `${adminServerURL}/status`,
        },
        preview: {
          baseURI: `${adminServerURL}/preview`,
        }
      }
    };
  }

  return config;
}

async function getLocales() {
  const config = await getConfig();
  return config.locales;
}

async function getPathForLocale(locale) {
  const config = await getConfig();
  const l = config.locales.find((l) => l.locale === locale);
  if (l) {
    return l.path;
  } else {
    console.error(`Cannot find locale ${locale}`);
  }
  return null;

}

async function getWorkflowForLocale(locale) {
  const config = await getConfig();
  const l = config.locales.find((l) => l.locale === locale);
  const workflow = l && l.workflow ? l.workflow : 'Standard';
  return { 
    name: workflow,
    ...config.glaas.workflows[workflow],
  };
}

export {
  getLocales,
  getPathForLocale,
  getWorkflowForLocale,
  getConfig,
};
