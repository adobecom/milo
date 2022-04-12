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
/*  global fetch, FormData, window, localStorage */

import { getConfig } from './config.js';
import { asyncForEach } from './utils.js';
import { getFiles } from './sharepoint.js';

function computeHandoffName(url, name, locale) {
    const u = new URL(url);
    const { pathname } = u;
    const i = pathname.lastIndexOf('/');
    const root = pathname.substring(0, i);
    const tn = `${root}/${name}/${locale}`;
    return tn.replace(/\//gm, '.');
}

async function validateSession(token) {
    const glaas = (await getConfig()).glaas;
    const authToken = token || glaas.accessToken;
    // client must validate token
    const res = await fetch(`${glaas.url}${glaas.api.session.check.uri}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json',
            'X-GLaaS-ClientId': glaas.clientId,
            'X-GLaaS-AuthToken': authToken,
        },
    });
    if (!res.ok) {
        throw new Error('Could not validate the GLaas session');
    }
}

async function connect(callback) {
    const LOCALSTORAGE_ITEM = 'glaas-auth-token';
    let token = localStorage.getItem(LOCALSTORAGE_ITEM);
    if (token) {
        try {
            await validateSession(token);
        } catch (error) {
            token = null;
            localStorage.removeItem(LOCALSTORAGE_ITEM);
        }
    }
    const glaas = (await getConfig()).glaas;
    if (!token) {
        window.setGLaaSAccessToken = async(newToken) => {
            glaas.accessToken = newToken;
            localStorage.setItem(LOCALSTORAGE_ITEM, newToken);
            await validateSession();
            // eslint-disable-next-line no-console
            console.log('You are now authenticated to GLaaS');
            if (callback) await callback();
        };

        const url = `${glaas.url}${glaas.authorizeURI}?response_type=token&state=home&client_id=${glaas.clientId}&redirect_uri=${glaas.redirectURI}`;
        window.open(url, 'Connect to GLaaS', 'width=500,height=800');
    } else {
        glaas.accessToken = token;
        localStorage.setItem(LOCALSTORAGE_ITEM, token);
        if (callback) await callback();
    }
}

async function createHandoff(tracker, locale) {
    const handoffName = computeHandoffName(tracker.url, tracker.name, locale);

    // TODO check if all files are available first
    const files = await getFiles(tracker, locale);

    const glaas = (await getConfig()).glaas;

    const payload = {
        ...(await glaas.localeApi(locale)).tasks.create.payload,
        name: handoffName,
        targetLocales: [locale],
    };

    let response = await fetch(`${glaas.url}${(await glaas.localeApi(locale)).tasks.create.uri}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'X-GLaaS-ClientId': glaas.clientId,
            'X-GLaaS-AuthToken': glaas.accessToken,
        },
        body: JSON.stringify(payload),
    });
    if (!response.ok) {
        throw new Error('Cannot create the task');
    }

    const formData = new FormData();
    files.forEach((file, index) => {
        formData.append(`file${index > 0 ? index : ''}`, file, file.path.replace(/\//gm, '_'));
    });

    response = await fetch(`${glaas.url}${(await glaas.localeApi(locale)).tasks.assets.baseURI}/${handoffName}/assets?targetLanguages=${locale}`, {
        method: 'POST',
        headers: {
            'X-GLaaS-ClientId': glaas.clientId,
            'X-GLaaS-AuthToken': glaas.accessToken,
        },
        body: formData,
    });
    if (!response.ok) {
        throw new Error('Cannot set the assets');
    }

    const data = new URLSearchParams();
    data.append('newStatus', 'CREATED');
    response = await fetch(`${glaas.url}${(await glaas.localeApi(locale)).tasks.updateStatus.baseURI}/${handoffName}/${locale}/updateStatus`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json',
            'X-GLaaS-ClientId': glaas.clientId,
            'X-GLaaS-AuthToken': glaas.accessToken,
        },
        body: data,
    });
    if (!response.ok) {
        throw new Error('Cannot update the status');
    }
}

async function updateTracker(tracker, callback) {
    if (!tracker) {
        return;
    }

    await asyncForEach(tracker.locales, async(locale) => {
        const handoffName = computeHandoffName(tracker.url, tracker.name, locale);

        const glaas = (await getConfig()).glaas;

        const response = await fetch(`${glaas.url}${((await glaas.localeApi(locale))).tasks.get.baseURI}/${handoffName}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-GLaaS-ClientId': glaas.clientId,
                'X-GLaaS-AuthToken': glaas.accessToken,
            },
        });

        const json = await response.json();
        if (json && json[0] && json[0].assets) {
            const taskStatus = json[0].status;
            json[0].assets.forEach((a) => {
                // recompute path
                const path = a.name.replace(/_/gm, '/');
                const task = tracker[locale].find((t) => t.filePath === path);
                if (task) {
                    task.glaas = task.glaas || {};
                    // eslint-disable-next-line no-nested-ternary
                    task.glaas.status = a.status !== 'DRAFT' ? a.status : (taskStatus === 'CREATED' ? 'IN PROGRESS' : taskStatus);
                    task.glaas.assetPath = `${handoffName}/assets/${locale}/${a.name}`;
                }
            });
        } else {
            // eslint-disable-next-line no-console
            console.error(`Could not find assets in ${handoffName}...`);
        }
    });

    if (callback) await callback();
}

async function getFile(task, locale) {
    const glaas = (await getConfig()).glaas;

    // eslint-disable-next-line no-underscore-dangle
    const response = await fetch(`${glaas.url}${(await glaas.localeApi(locale)).tasks.assets.baseURI}/${task.glaas.assetPath}`, {
        headers: {
            'X-GLaaS-ClientId': glaas.clientId,
            'X-GLaaS-AuthToken': glaas.accessToken,
        },
    });

    if (response.ok) {
        // Stream the response into the file.
        return response.blob();
    }
    throw new Error(`Cannot download the file from GLaaS: ${task.glaas.assetPath}`);
}

export {
    validateSession,
    createHandoff,
    updateTracker,
    computeHandoffName,
    connect,
    getFile,
};
