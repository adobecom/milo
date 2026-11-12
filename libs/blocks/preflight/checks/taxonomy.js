import { getConfig } from '../../../utils/utils.js';
import { findFragments } from './content.js';
import { SEVERITY, STATUS } from './constants.js';

export const TAXONOMY_IDS = {
  naming: 'taxonomy-naming',
  temporary: 'taxonomy-temporary-folder',
  fragments: 'taxonomy-fragment-placement',
};

const TITLES = {
  naming: 'Page naming',
  temporary: 'Test or temporary folders',
  fragments: 'Fragment placement',
};

// A test word at the start of a segment, "test"/"tmp"/"temp" at the end, or "test" followed
// by a number. Matching anywhere flagged real content such as "security-testing-report" and
// "the-power-of-ab-testing", so "-testing"/"-tests" endings are not matched.
const TEMP_WORDS = /^(test|tests|testing|tmp|temp)\d*(-|$)|-(test|tmp|temp)$|(^|-)test\d*-\d|(^|-)test-page(-|$)|(^|-)form-test(-|$)/;
const VALID_SEGMENT = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const EXTENSION = /\.(plain\.html|html|json)$/;

const count = (n, noun) => `${n} ${noun}${n === 1 ? '' : 's'}`;

const result = (key, status, description, details = {}) => ({
  id: TAXONOMY_IDS[key],
  title: TITLES[key],
  status,
  severity: SEVERITY.WARNING,
  description,
  details,
});

const safeDecode = (value) => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

export function toSegments(pathname = '', localePrefix = '') {
  let path = safeDecode(pathname.split(/[?#]/)[0]);
  if (localePrefix && (path === localePrefix || path.startsWith(`${localePrefix}/`))) {
    path = path.slice(localePrefix.length);
  }
  const segments = path.replace(EXTENSION, '').split('/').filter(Boolean);
  if (segments.at(-1) === 'index') segments.pop();
  return segments;
}

export function slugify(value = '') {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function getSegmentIssues(segment) {
  const issues = [];
  if (/[A-Z]/.test(segment)) issues.push('uppercase');
  if (/\s/.test(segment)) issues.push('spaces');
  if (segment.includes('_')) issues.push('underscores');
  if (/[^A-Za-z0-9\s_-]/.test(segment)) issues.push('special-characters');
  if (!issues.length && !VALID_SEGMENT.test(segment)) issues.push('hyphens');
  return issues;
}

export function checkNaming(segments = []) {
  const items = segments
    .map((segment) => ({
      segment,
      issues: getSegmentIssues(segment),
      suggestion: slugify(segment),
    }))
    .filter(({ issues }) => issues.length);
  if (!items.length) {
    return result('naming', STATUS.PASS, 'Path uses lowercase words separated by hyphens.', { items });
  }
  return result('naming', STATUS.FAIL, `${count(items.length, 'path segment')} not following the naming rules.`, { items });
}

export function checkTemporaryFolders(segments = []) {
  const items = segments.filter((segment) => TEMP_WORDS.test(segment.toLowerCase()));
  if (!items.length) {
    return result('temporary', STATUS.PASS, 'No test or temporary folders in the path.', { items });
  }
  return result('temporary', STATUS.FAIL, 'Path looks like a test or temporary page.', { items });
}

// Fragments can come from any locale (MEP, lingo), so drop a leading locale key.
const fragmentSegments = (pathname, localeKeys) => {
  const segments = toSegments(pathname);
  if (localeKeys.includes(segments[0])) segments.shift();
  return segments;
};

// `path` is what the panel shows (it keeps another site's origin), `pathname` is what gets checked.
export function checkFragmentPlacement(fragments = [], localeKeys = []) {
  const items = fragments
    .map(({ path, pathname }) => {
      const segments = fragmentSegments(pathname, localeKeys);
      // A trailing slash means every segment is a folder.
      const folders = pathname.endsWith('/') ? segments : segments.slice(0, -1);
      const reasons = [];
      if (!folders.includes('fragments')) reasons.push('outside-fragments-folder');
      if (segments.some((segment) => getSegmentIssues(segment).length)) reasons.push('naming');
      return { path, reasons };
    })
    .filter(({ reasons }) => reasons.length);
  if (!items.length) {
    const description = fragments.length
      ? 'Fragments are stored in a fragments folder.'
      : 'No fragments on this page.';
    return result('fragments', STATUS.PASS, description, { items });
  }
  return result('fragments', STATUS.FAIL, `${count(items.length, 'fragment')} outside a fragments folder or not following the naming rules.`, { items });
}

const KEYS = ['naming', 'temporary', 'fragments'];

// Drafts are scratch space by design, so warnings there are noise.
export function runChecks({ area = document, pathname = window.location.pathname } = {}) {
  const { locale, locales = {} } = getConfig();
  const segments = toSegments(pathname, locale?.prefix);
  if (segments.includes('drafts')) {
    return KEYS.map((key) => result(key, STATUS.EMPTY, 'Draft page, taxonomy checks skipped.'));
  }
  const fragments = findFragments(area).map(({ path, url }) => ({ path, pathname: url.pathname }));
  return [
    checkNaming(segments),
    checkTemporaryFolders(segments),
    checkFragmentPlacement(fragments, Object.keys(locales).filter(Boolean)),
  ];
}
