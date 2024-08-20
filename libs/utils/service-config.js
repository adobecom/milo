/**
 * Get author-facing config options.
 */

import { getConfig } from './utils.js';

const DOT_MILO = '/.milo/config.json';

let config;

/**
 * Get Service Config
 * @param {*} origin The origin of the site to pull the config from.
 * @param {*} envName The name of the environment to pull configs for.
 * @returns the config
 */
export default async function getServiceConfig(origin, envName) {
  const queryEnv = new URLSearchParams(window.location.search).get('env');
  const utilsConfig = getConfig();
  const env = queryEnv || envName || utilsConfig.env.name;
  // Return the cached config if it exists.
  if (config) return config[env];
  // Start a new request.
  const resp = await fetch(`${origin}${DOT_MILO}`);
  if (!resp.ok) return { error: 'Could not fetch .milo/config.' };
  const json = await resp.json();
  const configs = {};
  json.configs.data.forEach((conf) => {
    const [confEnv, confService, confType] = conf.key.split('.');
    configs[confEnv] ??= {};
    configs[confEnv][confService] ??= {};
    configs[confEnv][confService][confType] ??= conf.value;
  });
  config = {};
  // Setup prod config
  config.prod = configs.prod;

  // Setup stage with prod inheritance
  config.stage = { ...config.prod, ...configs.stage };

  // Setup local with stage & prod inheritance
  config.local = { ...config.stage, ...configs.local };

  return config[env];
}

export async function getServiceConfigFg(origin, envName) {
  if (config) return config;
  const utilsConfig = getConfig();
  const queryEnv = new URLSearchParams(window.location.search).get('env');
  const env = queryEnv || envName || utilsConfig.env.name;
  const resp = await fetch(`${origin}${DOT_MILO}`);
  if (!resp.ok) return { error: 'Could not fetch .milo/config.' };
  const json = await resp.json();
  return json;
}
