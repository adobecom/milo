import { STATUS, STRUCTURE_IDS, STRUCTURE_TITLES } from './constants.js';
import { getMetadata, isLocalNav } from '../../../utils/utils.js';

function checkNav(area) {
  const headerMeta = getMetadata('header', area);
  const headerEl = area.querySelector('header');

  const enabled = headerMeta !== 'off';
  const loaded = enabled
    && (headerEl?.classList.contains('ready') || headerEl?.dataset.blockStatus === 'loaded');
  const type = isLocalNav() ? 'localnav' : 'globalnav';
  let status;
  let description;

  if (!enabled) {
    status = STATUS.EMPTY;
    description = 'Navigation is off via metadata.';
  } else if (!headerEl) {
    status = STATUS.FAIL;
    description = 'Header element not found.';
  } else if (loaded) {
    status = STATUS.PASS;
    description = `Navigation loaded (${type}).`;
  } else {
    status = STATUS.LIMBO;
    description = 'Navigation enabled but not loaded yet.';
  }

  return {
    id: STRUCTURE_IDS.navigation,
    title: STRUCTURE_TITLES.navigation,
    status,
    description,
    details: {
      enabled,
      loaded,
      type,
    },
  };
}

function checkFooter(area) {
  const footerMeta = getMetadata('footer', area);
  const footerEl = area.querySelector('footer');

  const enabled = footerMeta !== 'off';
  const loaded = enabled
    && (footerEl?.classList.contains('ready') || footerEl?.dataset.blockStatus === 'loaded');

  let status;
  let description;

  if (!enabled) {
    status = STATUS.EMPTY;
    description = 'Footer is off via metadata.';
  } else if (!footerEl) {
    status = STATUS.FAIL;
    description = 'Footer element not found.';
  } else if (loaded) {
    status = STATUS.PASS;
    description = 'Footer loaded.';
  } else {
    status = STATUS.LIMBO;
    description = 'Footer enabled but not loaded yet.';
  }

  return {
    id: STRUCTURE_IDS.footer,
    title: STRUCTURE_TITLES.footer,
    status,
    description,
    details: {
      enabled,
      loaded,
    },
  };
}

function checkRegionSelector(area) {
  const footerMeta = getMetadata('footer', area);
  const footerEl = area.querySelector('footer');

  if (footerMeta === 'off') {
    return {
      id: STRUCTURE_IDS.regionSelector,
      title: STRUCTURE_TITLES.regionSelector,
      status: STATUS.EMPTY,
      description: 'Region selector is off.',
      details: { enabled: false },
    };
  }

  const regionAnchor = footerEl?.querySelector('.region-selector a') || footerEl?.querySelector('.feds-regionPicker-wrapper a');

  const isModalConfigured = !!regionAnchor?.dataset?.modalPath || (regionAnchor?.hash && regionAnchor.hash !== '' && regionAnchor.hash !== '#_dnt');
  const isDropdownConfigured = regionAnchor?.closest('.region-selector')?.querySelector('.fragment, [data-path]');

  const loaded = !!(isModalConfigured || isDropdownConfigured);

  if (!footerEl) {
    return {
      id: STRUCTURE_IDS.regionSelector,
      title: STRUCTURE_TITLES.regionSelector,
      status: STATUS.FAIL,
      description: 'Footer element not found.',
      details: { loaded },
    };
  }

  if (loaded) {
    return {
      id: STRUCTURE_IDS.regionSelector,
      title: STRUCTURE_TITLES.regionSelector,
      status: STATUS.PASS,
      description: 'Region selector is loaded.',
      details: { loaded: true },
    };
  }

  return {
    id: STRUCTURE_IDS.regionSelector,
    title: STRUCTURE_TITLES.regionSelector,
    status: STATUS.FAIL,
    description: 'Region selector is not loaded.',
    details: { loaded: false },
  };
}

function checkGeorouting(area) {
  if (getMetadata('georouting', area) === 'on') {
    return {
      id: STRUCTURE_IDS.georouting,
      title: STRUCTURE_TITLES.georouting,
      status: STATUS.EMPTY,
      description: 'Georouting is on via metadata.',
    };
  }
  return {
    id: STRUCTURE_IDS.georouting,
    title: STRUCTURE_TITLES.georouting,
    status: STATUS.EMPTY,
    description: 'Georouting is off via metadata.',
  };
}

function checkBreadcrumbs(area) {
  const meta = (getMetadata('breadcrumbs', area) || '').toLowerCase();
  const hasBreadcrumbsClass = !!area.querySelector('header.has-breadcrumbs');
  const navBreadcrumbs = !!area.querySelector('.feds-breadcrumbs nav.feds-breadcrumbs');
  const anyBreadcrumbs = hasBreadcrumbsClass || navBreadcrumbs || meta === 'on';

  if (anyBreadcrumbs) {
    return {
      id: STRUCTURE_IDS.breadcrumbs,
      title: STRUCTURE_TITLES.breadcrumbs,
      status: STATUS.EMPTY,
      description: 'Breadcrumbs are enabled.',
    };
  }
  return {
    id: STRUCTURE_IDS.breadcrumbs,
    title: STRUCTURE_TITLES.breadcrumbs,
    status: STATUS.EMPTY,
    description: 'Breadcrumbs are off.',
  };
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
