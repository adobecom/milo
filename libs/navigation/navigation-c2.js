import { loadStyle } from '../utils/utils.js';
import {
  blockConfig,
  getOrigin,
  getParamsConfigs,
  getStageDomainsMap,
  loadStandaloneNavigationStyles,
  prodDomains,
  resolveMiloLibs,
  setMetaTags,
} from './navigation-utils.js';

/* eslint import/no-relative-packages: 0 */
export default async function loadBlock(configs, customLib) {
  const {
    header,
    footer,
    authoringPath,
    env = 'prod',
    locale = '',
    theme,
    stageDomainsMap = {},
    allowedOrigins = [],
  } = configs || {};
  if (!header && !footer) {
    // eslint-disable-next-line no-console
    console.error('Global navigation Error: header and footer configurations are missing.');
    return;
  }
  const miloLibs = resolveMiloLibs(env, customLib);
  await loadStandaloneNavigationStyles(theme, miloLibs);

  const [
    { default: bootstrapBlock },
    { default: locales },
    { setConfig, getConfig, createTag }] = await Promise.all([
    import('./bootstrapper.js'),
    import('../utils/locales.js'),
    import('../utils/utils.js'),
  ]);
  const paramConfigs = getParamsConfigs(configs);
  const origin = getOrigin(env);
  const clientConfig = {
    theme,
    prodDomains,
    clientEnv: env,
    standaloneGnav: true,
    pathname: `/${locale}`,
    miloLibs: `${miloLibs}/libs`,
    locales: configs.locales || locales,
    contentRoot: authoringPath || footer?.authoringPath,
    stageDomainsMap: getStageDomainsMap(stageDomainsMap, env),
    origin,
    allowedOrigins: [...allowedOrigins, origin],
    onFooterReady: footer?.onReady,
    onFooterError: footer?.onError,
    ...paramConfigs,
  };
  setConfig({ ...getConfig(), ...clientConfig });
  for await (const block of blockConfig) {
    const configBlock = configs[block.key];

    if (configBlock) {
      const config = getConfig();
      if (block.key === 'header') {
        let gnavSource = configBlock.gnavSource || `${config?.locale?.contentRoot}/gnav`;
        if (String(configBlock.disableActiveLink) === 'true' && !gnavSource.includes('_noActiveItem')) {
          gnavSource += '#_noActiveItem';
        }
        try {
          const gnavConfigs = {
            ...block,
            gnavSource,
            unavComponents: configBlock.selfIntegrateUnav ? [] : configBlock.unav?.unavComponents,
            redirect: configBlock.redirect,
            layout: configBlock.layout,
            noBorder: configBlock.noBorder,
            jarvis: configBlock.jarvis,
            isLocalNav: configBlock.isLocalNav,
            mobileGnavV2: configBlock.mobileGnavV2 || 'on',
            signInCtaStyle: configBlock?.unav?.profile?.signInCtaStyle || 'secondary',
            productEntryCta: configBlock.productEntryCta || 'off',
          };
          const metaTags = [
            { key: 'gnavSource', name: 'gnav-source' },
            { key: 'unavComponents', name: 'universal-nav' },
            { key: 'redirect', name: 'adobe-home-redirect' },
            { key: 'mobileGnavV2', name: 'mobile-gnav-v2' },
            { key: 'productEntryCta', name: 'product-entry-cta' },
          ];
          setMetaTags(metaTags, gnavConfigs, createTag);
          const { default: init, closeGnavOptions } = await import('../c2/blocks/global-navigation/global-navigation.js');
          await bootstrapBlock(init, gnavConfigs);
          window.closeGnav = closeGnavOptions;
          configBlock.onReady?.();
        } catch (e) {
          configBlock.onError?.(e);
          window.lana.log(`${e.message} | gnav-source: ${gnavSource} | href: ${window.location.href}`, {
            clientId: 'feds-milo',
            tags: 'standalone-gnav',
            severity: 'error',
          });
        }
      }
      if (block.key === 'footer') {
        const footerSource = configBlock.footerSource || `${config?.locale?.contentRoot}/footer`;
        try {
          const metaTags = [
            { key: 'footerSource', name: 'footer-source' },
          ];
          const footerConfigs = {
            ...block,
            footerSource,
            isContainerResponsive: configBlock.isContainerResponsive,
          };

          setMetaTags(metaTags, footerConfigs, createTag);
          import('./footer.css').catch(() => loadStyle(`${miloLibs}/libs/navigation/footer.css`));
          const { default: init } = await import('../c2/blocks/global-footer/global-footer.js');
          await bootstrapBlock(init, footerConfigs);
        } catch (e) {
          configBlock.onError?.(e);
          window.lana.log(`${e.message} | footer-source: ${footerSource} | href: ${window.location.href}`, {
            clientId: 'feds-milo',
            tags: 'standalone-footer',
            severity: 'error',
          });
        }
      }
    }
  }
}

window.loadNavigationC2 = loadBlock;
