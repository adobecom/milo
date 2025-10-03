import { STATUS, STRUCTURE_IDS, STRUCTURE_TITLES } from './constants.js';
import { getMetadata, isLocalNav } from '../../../utils/utils.js';

function getElementStatus({ area, metaKey, selector }) {
  const metaValue = getMetadata(metaKey, area);
  const element = area.querySelector(selector);

  const enabled = metaValue !== 'off';
  const loaded = enabled
    && (element?.classList.contains('ready') || element?.dataset.blockStatus === 'loaded');

  return { element, enabled, loaded };
}

function getStructureResult(key, status, description, details) {
  return {
    id: STRUCTURE_IDS[key],
    title: STRUCTURE_TITLES[key],
    status,
    description,
    details: details || {},
  };
}

function checkNav(area) {
  const { element: headerEl, enabled, loaded } = getElementStatus({ area, metaKey: 'header', selector: 'header' });
  const type = isLocalNav() ? 'localnav' : 'globalnav';
  let status;
  let description;

  const childElementCount = headerEl?.querySelectorAll('*').length || 0;
  const textLength = headerEl?.textContent.trim().length || 0;
  const unresolvedFragments = headerEl?.querySelectorAll('a[href*="/fragments/"]').length
    || 0;

  if (!enabled) {
    status = STATUS.EMPTY;
    description = 'Navigation is off via metadata.';
  } else if (!headerEl) {
    status = STATUS.FAIL;
    description = 'Header element not found.';
  } else if (!loaded) {
    status = STATUS.LIMBO;
    description = 'Navigation enabled but not loaded yet.';
  } else if (childElementCount === 0 || textLength === 0 || unresolvedFragments > 0) {
    status = STATUS.FAIL;
    description = `Navigation loaded (${type}) but appears empty or incomplete.`;
  } else {
    status = STATUS.PASS;
    description = `Navigation loaded (${type}).`;
  }

  return getStructureResult('navigation', status, description, {
    enabled,
    loaded,
    type,
    childElementCount,
    textLength,
    unresolvedFragments,
  });
}

function checkFooter(area) {
  const { element: footerEl, enabled, loaded } = getElementStatus({ area, metaKey: 'footer', selector: 'footer' });

  let status;
  let description;

  const childElementCount = footerEl ? footerEl.querySelectorAll('*').length : 0;
  const textLength = footerEl ? (footerEl.textContent || '').trim().length : 0;
  const unresolvedFragments = footerEl
    ? footerEl.querySelectorAll('a[href*="/fragments/"]').length
    : 0;

  if (!enabled) {
    status = STATUS.EMPTY;
    description = 'Footer is off via metadata.';
  } else if (!footerEl) {
    status = STATUS.FAIL;
    description = 'Footer element not found.';
  } else if (!loaded) {
    status = STATUS.LIMBO;
    description = 'Footer enabled but not loaded yet.';
  } else if (childElementCount === 0 || textLength === 0 || unresolvedFragments > 0) {
    status = STATUS.FAIL;
    description = 'Footer loaded but appears empty or incomplete.';
  } else {
    status = STATUS.PASS;
    description = 'Footer loaded.';
  }

  return getStructureResult('footer', status, description, {
    enabled,
    loaded,
    childElementCount,
    textLength,
    unresolvedFragments,
  });
}

function checkRegionSelector(area) {
  const { element: footerEl, enabled, loaded } = getElementStatus({ area, metaKey: 'footer', selector: 'footer' });

  if (!footerEl) {
    return getStructureResult(
      'regionSelector',
      enabled ? STATUS.FAIL : STATUS.EMPTY,
      enabled ? 'Footer element not found.' : 'Region selector is off.',
      { loaded, enabled },
    );
  }

  const regionAnchor = footerEl.querySelector('.region-selector a') || footerEl.querySelector('.feds-regionPicker-wrapper a');
  const isModalConfigured = !!regionAnchor?.dataset?.modalPath || (regionAnchor?.hash && regionAnchor.hash !== '' && regionAnchor.hash !== '#_dnt');
  const isDropdownConfigured = regionAnchor?.closest('.region-selector')?.querySelector('.fragment, [data-path]');
  const regSelectorLoaded = !!(isModalConfigured || isDropdownConfigured);

  return getStructureResult(
    'regionSelector',
    regSelectorLoaded ? STATUS.PASS : STATUS.FAIL,
    regSelectorLoaded ? 'Region selector is loaded.' : 'Region selector is not loaded.',
    { loaded: regSelectorLoaded },
  );
}

function checkGeorouting(area) {
  const meta = getMetadata('georouting', area)?.toLowerCase();
  const param = new URL(window.location.href).searchParams.get('georouting')?.toLowerCase();
  const isOff = meta === 'off' || param === 'off';

  return getStructureResult('georouting', STATUS.EMPTY, `Georouting is ${isOff ? 'off' : 'on'}.`);
}

function checkBreadcrumbs(area) {
  const meta = (getMetadata('breadcrumbs', area) || '').toLowerCase();
  const hasBreadcrumbsClass = !!area.querySelector('header.has-breadcrumbs');
  const breadcrumbsEl = area.querySelector('.feds-breadcrumbs');

  const enabled = meta !== 'off' && hasBreadcrumbsClass;
  const loaded = !!breadcrumbsEl;
  const childItemCount = breadcrumbsEl?.querySelectorAll('li').length;
  const textLength = breadcrumbsEl?.textContent.trim().length;

  let status;
  let description;

  if (!enabled) {
    status = STATUS.EMPTY;
    description = 'Breadcrumbs are off.';
  } else if (!loaded) {
    status = STATUS.FAIL;
    description = 'Breadcrumbs enabled but not rendered.';
  } else if (childItemCount === 0 || textLength === 0) {
    status = STATUS.FAIL;
    description = 'Breadcrumbs rendered but appear empty or incomplete.';
  } else {
    status = STATUS.PASS;
    description = 'Breadcrumbs rendered.';
  }

  return getStructureResult('breadcrumbs', status, description, {
    enabled,
    loaded,
    childItemCount,
    textLength,
  });
}

export function runChecks({ area = document }) {
  return [
    checkNav(area),
    checkFooter(area),
    checkRegionSelector(area),
    checkGeorouting(area),
    checkBreadcrumbs(area),
  ];
}

export default {
  checkNav,
  checkFooter,
  checkRegionSelector,
  checkGeorouting,
  checkBreadcrumbs,
  runChecks,
};
