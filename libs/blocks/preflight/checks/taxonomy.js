import { getConfig } from '../../../utils/utils.js';
import { findFragments } from './content.js';
import { SEVERITY, STATUS } from './constants.js';

const CHECKS = {
  naming: { id: 'taxonomy-naming', title: 'Page naming' },
  temporary: { id: 'taxonomy-temporary-folder', title: 'Test or temporary folders' },
  fragments: { id: 'taxonomy-fragment-placement', title: 'Fragment placement' },
};

// A test word at the start of a segment, "test"/"tmp"/"temp" at the end, or "test" followed
// by a number. Matching anywhere flagged real content such as "security-testing-report" and
// "the-power-of-ab-testing", so "-testing"/"-tests" endings are not matched.
const TEMP_WORDS = /^(test|tests|testing|tmp|temp)\d*(-|$)|-(test|tmp|temp)$|(^|-)test\d*-\d|(^|-)test-page(-|$)|(^|-)form-test(-|$)/;
const VALID_SEGMENT = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const count = (n, noun) => `${n} ${noun}${n === 1 ? '' : 's'}`;

const result = (key, status, description, details = {}) => (
  { ...CHECKS[key], status, severity: SEVERITY.WARNING, description, details });

const safeDecode = (value) => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

// Pages and fragments can come from any locale (MEP, lingo), so drop a leading locale key.
export function toSegments(pathname = '', localeKeys = []) {
  const segments = safeDecode(pathname).replace(/\.(plain\.)?html$/, '').split('/').filter(Boolean);
  if (localeKeys.includes(segments[0])) segments.shift();
  if (segments[segments.length - 1] === 'index') segments.pop();
  return segments;
}

const slugify = (value) => value
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

const getSegmentIssues = (segment) => {
  const issues = [
    /[A-Z]/.test(segment) && 'uppercase letters',
    /\s/.test(segment) && 'spaces',
    segment.includes('_') && 'underscores',
    /[^A-Za-z0-9\s_-]/.test(segment) && 'special characters',
  ].filter(Boolean);
  if (!issues.length && !VALID_SEGMENT.test(segment)) issues.push('extra hyphens');
  return issues;
};

export function checkNaming(segments = []) {
  const items = segments
    .map((segment) => ({ segment, reasons: getSegmentIssues(segment) }))
    .filter(({ reasons }) => reasons.length)
    .map((item) => ({ ...item, suggestion: slugify(item.segment) }));
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

// `path` is what the panel shows (it keeps another site's origin), `pathname` is what gets checked.
export function checkFragmentPlacement(fragments = [], localeKeys = []) {
  const items = fragments
    .map(({ path, pathname }) => {
      const segments = toSegments(pathname, localeKeys);
      // A trailing slash means every segment is a folder.
      const folders = pathname.endsWith('/') ? segments : segments.slice(0, -1);
      const reasons = [
        !folders.includes('fragments') && 'not in a fragments folder',
        segments.some((segment) => getSegmentIssues(segment).length) && 'naming',
      ].filter(Boolean);
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

export function runChecks({ area = document, pathname = window.location.pathname } = {}) {
  const localeKeys = Object.keys(getConfig().locales ?? {}).filter(Boolean);
  const segments = toSegments(pathname, localeKeys);
  // Drafts are scratch space by design, so warnings there are noise.
  if (segments.includes('drafts')) {
    return Object.keys(CHECKS).map((key) => result(key, STATUS.EMPTY, 'Draft page, taxonomy checks skipped.'));
  }
  const fragments = findFragments(area).map(({ path, url }) => ({ path, pathname: url.pathname }));
  return [
    checkNaming(segments),
    checkTemporaryFolders(segments),
    checkFragmentPlacement(fragments, localeKeys),
  ];
}
