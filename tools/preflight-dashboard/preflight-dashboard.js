/**
 * Preflight Dashboard
 *
 * Displays page quality scores for adobe.com pages.
 * Requires Adobe IMS sign-in restricted to @adobe.com accounts.
 *
 * API: GET /preflight-logs?page=&limit=&sortBy=&sortOrder=
 *                         &urlPattern=&minScore=&maxScore=
 *                         &contentType=&projectKey=&clientId=
 *      Requires: Authorization: Bearer <token>
 */

// ─── Configuration ────────────────────────────────────────────────────────────

const IMS_CLIENT_ID = 'milo_ims';
const IMS_SCOPE = 'AdobeID,openid';
const IMS_LIB_URL = 'https://auth.services.adobe.com/imslib/imslib.min.js';

function getApiBase() {
  const { hostname } = window.location;
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '') {
    return 'http://localhost:8080';
  }
  if (hostname.endsWith('.hlx.page') || hostname.endsWith('.aem.page') || hostname.includes('stage')) {
    return 'https://milo-core-stage.adobe.io';
  }
  return 'https://milo-core-prod.adobe.io';
}

// ─── State ────────────────────────────────────────────────────────────────────

const state = {
  currentPage: 1,
  currentLimit: 50,
  currentFilters: {},
  currentSort: { by: 'performance_score', order: 'asc' },
  imsToken: null,
  totalPages: 1,
  totalResults: 0,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatScore(score) {
  if (score === null || score === undefined) return null;
  const n = parseFloat(score);
  return Number.isNaN(n) ? null : Math.round(n);
}

function getScoreTier(score) {
  if (score === null || score === undefined) return 'empty';
  if (score < 50) return 'critical';
  if (score < 70) return 'warning';
  return 'good';
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '—';
  const date = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  return `${date}, ${time}`;
}

function getInitials(email) {
  if (!email) return '?';
  const [local] = email.split('@');
  const parts = local.split(/[._-]/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return (local[0] || '?').toUpperCase();
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) { resolve(); return; }
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(s);
  });
}

// ─── LANA logging (FA-12) ─────────────────────────────────────────────────────

function lanaLog(message, tags = '') {
  try {
    window.lana?.log(message, { clientId: IMS_CLIENT_ID, tags });
  } catch {
    // lana not available (local dev) — silent fail
  }
}

// ─── IMS Authentication ───────────────────────────────────────────────────────

function initIMS() {
  const forceIMS = new URLSearchParams(window.location.search).get('forceIMS') === 'true';

  if (!forceIMS && (window.location.hostname === 'localhost'
    || window.location.hostname === '127.0.0.1'
    || window.location.protocol === 'file:')) {
    return Promise.resolve({ skipAuth: true });
  }

  return new Promise((resolve, reject) => {
    window.adobeid = {
      client_id: IMS_CLIENT_ID,
      environment: 'prod',
      scope: IMS_SCOPE,
      useLocalStorage: false,
      autoValidateToken: true,
      onReady: () => resolve({ skipAuth: false }),
      onError: (err) => reject(new Error(err?.message || 'IMS initialization failed')),
    };
    loadScript(IMS_LIB_URL).catch(reject);
  });
}

async function getAuthState() {
  const { skipAuth } = await initIMS();

  if (skipAuth) {
    return { authenticated: true, email: 'local@adobe.com', token: null };
  }

  const isSignedIn = window.adobeIMS?.isSignedInUser?.();
  if (!isSignedIn) return { authenticated: false };

  const token = window.adobeIMS.getAccessToken()?.token;
  if (!token) return { authenticated: false };

  let profile = null;
  try {
    profile = await window.adobeIMS.getProfile();
  } catch {
    return { authenticated: false };
  }

  if (!profile?.email?.endsWith('@adobe.com')) {
    return { authenticated: true, email: profile?.email, adobeOnly: false };
  }

  return { authenticated: true, email: profile.email, token, adobeOnly: true };
}

function signIn() {
  window.adobeIMS?.signIn();
}

function signOut() {
  window.adobeIMS?.signOut();
}

// ─── API ──────────────────────────────────────────────────────────────────────

async function fetchPreflightLogs({
  page = 1,
  limit = 50,
  filters = {},
  sort = { by: 'performance_score', order: 'asc' },
  token = null,
} = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    sortBy: sort.by || 'performance_score',
    sortOrder: sort.order || 'asc',
    clientId: IMS_CLIENT_ID,
  });

  if (filters.urlPattern) params.set('urlPattern', filters.urlPattern);
  if (filters.minScore !== undefined && filters.minScore !== '') params.set('minScore', String(filters.minScore));
  if (filters.maxScore !== undefined && filters.maxScore !== '') params.set('maxScore', String(filters.maxScore));
  if (filters.contentType) params.set('contentType', filters.contentType);
  if (filters.projectKey) params.set('projectKey', filters.projectKey);

  const headers = { Accept: 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const resp = await fetch(`${getApiBase()}/preflight-logs?${params}`, { headers });

  if (!resp.ok) {
    if (resp.status === 401 || resp.status === 403) {
      throw Object.assign(new Error('Authentication error'), { status: resp.status });
    }
    throw new Error(`Server error ${resp.status}: ${resp.statusText}`);
  }

  return resp.json();
}

// ─── UI helpers ───────────────────────────────────────────────────────────────

function showDashboard() {
  document.getElementById('auth-screen').classList.add('hidden');
  document.getElementById('error-screen').classList.add('hidden');
  document.getElementById('dashboard').classList.remove('hidden');
}

function showAuthScreen() {
  document.getElementById('auth-screen').classList.remove('hidden');
  document.getElementById('error-screen').classList.add('hidden');
  document.getElementById('dashboard').classList.add('hidden');
}

function showErrorScreen(title, message) {
  document.getElementById('error-screen-title').textContent = title;
  document.getElementById('error-screen-message').textContent = message;
  document.getElementById('error-screen').classList.remove('hidden');
  document.getElementById('auth-screen').classList.add('hidden');
  document.getElementById('dashboard').classList.add('hidden');
}

function showTableLoading(show) {
  const loading = document.getElementById('loading');
  const tableSection = document.getElementById('table-section');

  document.getElementById('empty-state').classList.add('hidden');

  if (show) {
    loading.classList.remove('hidden');
    tableSection.classList.add('hidden');
  } else {
    loading.classList.add('hidden');
  }
}

function showErrorBanner(message) {
  const banner = document.getElementById('error-banner');
  banner.textContent = `⚠ ${message}`;
  banner.classList.remove('hidden');
  clearTimeout(banner._timer);
  banner._timer = setTimeout(() => banner.classList.add('hidden'), 8000);
}

function hideErrorBanner() {
  document.getElementById('error-banner').classList.add('hidden');
}

function setUserInfo(email) {
  const el = document.getElementById('header-end');
  const initials = getInitials(email);

  // Build DOM safely — no innerHTML for user data (SEC-04)
  const wrapper = document.createElement('div');
  wrapper.className = 'pd-user';

  const avatar = document.createElement('div');
  avatar.className = 'pd-user__avatar';
  avatar.setAttribute('aria-hidden', 'true');
  avatar.textContent = initials;

  const emailEl = document.createElement('span');
  emailEl.className = 'pd-user__email';
  emailEl.title = email;
  emailEl.textContent = email;

  const signOutBtn = document.createElement('button');
  signOutBtn.className = 'pd-btn pd-btn--ghost';
  signOutBtn.id = 'sign-out-btn';
  signOutBtn.textContent = 'Sign out';
  signOutBtn.addEventListener('click', signOut);

  wrapper.appendChild(avatar);
  wrapper.appendChild(emailEl);
  wrapper.appendChild(signOutBtn);
  el.appendChild(wrapper);
}

// ─── Active filter tags (Mockup 2) ────────────────────────────────────────────

function buildFilterLabels(filters) {
  const labels = [];
  if (filters.urlPattern) labels.push({ key: 'url', label: `URL: ${filters.urlPattern}` });
  if (filters.minScore !== undefined && filters.minScore !== '') labels.push({ key: 'minScore', label: `Min score: ${filters.minScore}` });
  if (filters.maxScore !== undefined && filters.maxScore !== '') labels.push({ key: 'maxScore', label: `Max score: ${filters.maxScore}` });
  if (filters.contentType) labels.push({ key: 'contentType', label: `Type: ${filters.contentType}` });
  if (filters.projectKey) labels.push({ key: 'projectKey', label: `Project: ${filters.projectKey}` });
  return labels;
}

function renderActiveFilters(filters) {
  const container = document.getElementById('active-filters');
  container.innerHTML = '';

  const labels = buildFilterLabels(filters);

  if (labels.length === 0) {
    container.classList.add('hidden');
    return;
  }

  container.classList.remove('hidden');

  const count = document.createElement('span');
  count.className = 'pd-filter-count';
  count.textContent = `${labels.length} active filter${labels.length > 1 ? 's' : ''}`;
  container.appendChild(count);

  labels.forEach(({ key, label }) => {
    const tag = document.createElement('span');
    tag.className = 'pd-filter-tag';

    const text = document.createElement('span');
    text.textContent = label;

    const removeBtn = document.createElement('button');
    removeBtn.className = 'pd-filter-tag__remove';
    removeBtn.setAttribute('aria-label', `Remove filter: ${label}`);
    removeBtn.textContent = '×';
    removeBtn.addEventListener('click', () => {
      delete state.currentFilters[key];
      syncFilterInputs(state.currentFilters);
      renderActiveFilters(state.currentFilters);
      loadData(1);
    });

    tag.appendChild(text);
    tag.appendChild(removeBtn);
    container.appendChild(tag);
  });
}

function syncFilterInputs(filters) {
  document.getElementById('url-search').value = filters.urlPattern || '';
  document.getElementById('score-min').value = filters.minScore !== undefined ? filters.minScore : '';
  document.getElementById('score-max').value = filters.maxScore !== undefined ? filters.maxScore : '';
  document.getElementById('content-type').value = filters.contentType || '';
  document.getElementById('project-key').value = filters.projectKey || '';
}

// ─── Rendering ────────────────────────────────────────────────────────────────

function createStatusIcon(score) {
  const tier = score !== null ? getScoreTier(score) : 'empty';
  const span = document.createElement('span');
  span.className = `pd-status-cell pd-status--${tier}`;

  const icons = { good: '✓', warning: '△', critical: '✗', empty: '—' };
  const ariaLabels = { good: 'Good', warning: 'Warning', critical: 'Critical', empty: 'No score' };

  span.setAttribute('aria-label', ariaLabels[tier]);
  span.setAttribute('aria-hidden', 'false');
  span.textContent = icons[tier];
  return span;
}

function renderTableRow(row) {
  const tr = document.createElement('tr');

  // URL (FA-16: clickable link, SEC-04: textContent)
  const urlTd = document.createElement('td');
  const urlWrap = document.createElement('div');
  urlWrap.className = 'pd-url-cell';

  const a = document.createElement('a');
  a.className = 'pd-url-link';
  a.href = row.url;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  a.textContent = row.url; // textContent — not innerHTML (SEC-04)
  a.title = row.url;

  // Link icon
  const linkIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  linkIcon.setAttribute('class', 'pd-url-icon');
  linkIcon.setAttribute('viewBox', '0 0 16 16');
  linkIcon.setAttribute('aria-hidden', 'true');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('fill', 'currentColor');
  path.setAttribute('d', 'M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z');
  const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path2.setAttribute('fill', 'currentColor');
  path2.setAttribute('d', 'M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z');
  linkIcon.appendChild(path);
  linkIcon.appendChild(path2);

  urlWrap.appendChild(a);
  urlWrap.appendChild(linkIcon);
  urlTd.appendChild(urlWrap);
  tr.appendChild(urlTd);

  // Status icon (FA-18)
  const statusTd = document.createElement('td');
  const num = formatScore(row.performance_score);
  statusTd.appendChild(createStatusIcon(num));
  tr.appendChild(statusTd);

  // Score — colored number (FA-07, FA-18)
  const scoreTd = document.createElement('td');
  const tier = num !== null ? getScoreTier(num) : 'empty';
  scoreTd.className = `pd-score-cell pd-score--${tier}`;
  scoreTd.textContent = num !== null ? String(num) : '—';
  tr.appendChild(scoreTd);

  // Last Checked (FA-13)
  const dateTd = document.createElement('td');
  dateTd.className = 'pd-date-cell';
  dateTd.textContent = formatDate(row.created_at);
  tr.appendChild(dateTd);

  return tr;
}

function renderTable(rows) {
  const tbody = document.getElementById('table-body');
  tbody.innerHTML = '';

  if (!rows || rows.length === 0) return false;

  const fragment = document.createDocumentFragment();
  rows.forEach((row) => fragment.appendChild(renderTableRow(row)));
  tbody.appendChild(fragment);
  return true;
}

// ─── Pagination (3.9) ─────────────────────────────────────────────────────────

function updatePagination(pagination) {
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const pageInfo = document.getElementById('page-info');
  const totalEl = document.getElementById('total-results');

  prevBtn.disabled = !pagination.hasPreviousPage;
  nextBtn.disabled = !pagination.hasNextPage;
  pageInfo.textContent = `Page ${pagination.page} of ${pagination.totalPages}`;
  totalEl.textContent = `${pagination.total.toLocaleString()} result${pagination.total !== 1 ? 's' : ''}`;
}

// ─── Sort headers (3.10) ──────────────────────────────────────────────────────

function updateSortHeaders() {
  document.querySelectorAll('.pd-table th.sortable').forEach((th) => {
    th.classList.remove('sort-asc', 'sort-desc');
    if (th.dataset.sort === state.currentSort.by) {
      th.classList.add(`sort-${state.currentSort.order}`);
      th.setAttribute('aria-sort', state.currentSort.order === 'asc' ? 'ascending' : 'descending');
    } else {
      th.removeAttribute('aria-sort');
    }
  });
}

// ─── Data loading ─────────────────────────────────────────────────────────────

async function loadData(page = 1) {
  hideErrorBanner();
  showTableLoading(true);

  try {
    const result = await fetchPreflightLogs({
      page,
      limit: state.currentLimit,
      filters: state.currentFilters,
      sort: state.currentSort,
      token: state.imsToken,
    });

    state.currentPage = page;
    state.totalPages = result.pagination.totalPages;
    state.totalResults = result.pagination.total;

    const hasRows = renderTable(result.data);
    updatePagination(result.pagination);
    updateSortHeaders();

    // Stats bar (FA-09)
    const total = result.pagination.total;
    document.getElementById('stat-total').textContent = `${total.toLocaleString()} page${total !== 1 ? 's' : ''} matched`;
    document.getElementById('stats-bar').classList.remove('hidden');

    if (hasRows) {
      document.getElementById('table-section').classList.remove('hidden');
      document.getElementById('empty-state').classList.add('hidden');
    } else {
      document.getElementById('table-section').classList.add('hidden');
      document.getElementById('empty-state').classList.remove('hidden');
    }
  } catch (err) {
    // Log unexpected errors to LANA (FA-12)
    if (!err.status) {
      lanaLog(`Preflight Dashboard error: ${err.message}`, 'error,preflight-dashboard');
    }
    // Show user-friendly message (FA-11)
    const msg = err.status === 401 || err.status === 403
      ? 'Session expired. Please sign in again.'
      : 'Server error — please try again.';
    showErrorBanner(msg);
    document.getElementById('table-section').classList.remove('hidden');
  } finally {
    showTableLoading(false);
  }
}

// ─── Event listeners ──────────────────────────────────────────────────────────

function setupEventListeners() {
  const filterBtn = document.getElementById('filter-btn');
  const resetBtn = document.getElementById('reset-btn');
  const worstPagesBtn = document.getElementById('worst-pages-btn');
  const emptyResetBtn = document.getElementById('empty-reset-btn');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const pageSizeSelect = document.getElementById('page-size');
  const urlSearch = document.getElementById('url-search');
  const scoreMin = document.getElementById('score-min');
  const scoreMax = document.getElementById('score-max');
  const contentType = document.getElementById('content-type');
  const projectKey = document.getElementById('project-key');

  // Apply filters (FA-03, FA-04, FA-14, FA-15)
  filterBtn.addEventListener('click', () => {
    state.currentFilters = {};
    const url = urlSearch.value.trim();
    const min = scoreMin.value.trim();
    const max = scoreMax.value.trim();
    const type = contentType.value;
    const project = projectKey.value;

    if (url) state.currentFilters.urlPattern = url;
    if (min) state.currentFilters.minScore = min;
    if (max) state.currentFilters.maxScore = max;
    if (type) state.currentFilters.contentType = type;
    if (project) state.currentFilters.projectKey = project;

    renderActiveFilters(state.currentFilters);
    loadData(1);
  });

  // Worst Pages — sets maxScore=49 automatically (FA-17)
  worstPagesBtn.addEventListener('click', () => {
    state.currentFilters = { maxScore: '49' };
    syncFilterInputs(state.currentFilters);
    renderActiveFilters(state.currentFilters);
    loadData(1);
  });

  // Reset
  const doReset = () => {
    syncFilterInputs({});
    state.currentFilters = {};
    state.currentSort = { by: 'performance_score', order: 'asc' };
    renderActiveFilters({});
    loadData(1);
  };
  resetBtn.addEventListener('click', doReset);
  emptyResetBtn.addEventListener('click', doReset);

  // Pagination
  prevBtn.addEventListener('click', () => {
    if (state.currentPage > 1) loadData(state.currentPage - 1);
  });
  nextBtn.addEventListener('click', () => {
    if (state.currentPage < state.totalPages) loadData(state.currentPage + 1);
  });

  // Page size (FA-06: 25/50/100)
  pageSizeSelect.addEventListener('change', (e) => {
    state.currentLimit = parseInt(e.target.value, 10);
    loadData(1);
  });

  // Sort headers (FA-08) — wired here, visual update in 3.10
  document.querySelectorAll('.pd-table th.sortable').forEach((th) => {
    th.addEventListener('click', () => {
      const col = th.dataset.sort;
      if (state.currentSort.by === col) {
        state.currentSort.order = state.currentSort.order === 'asc' ? 'desc' : 'asc';
      } else {
        state.currentSort.by = col;
        state.currentSort.order = col === 'performance_score' ? 'asc' : 'desc';
      }
      loadData(state.currentPage);
    });
  });

  // Enter key on filter inputs
  [urlSearch, scoreMin, scoreMax].forEach((input) => {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') filterBtn.click();
    });
  });
}

// ─── Init ─────────────────────────────────────────────────────────────────────

async function init() {
  document.getElementById('dashboard').classList.add('hidden');
  document.getElementById('auth-screen').classList.add('hidden');
  document.getElementById('error-screen').classList.add('hidden');

  document.getElementById('sign-in-btn').addEventListener('click', signIn);
  document.getElementById('sign-out-error-btn').addEventListener('click', signOut);

  let authResult;
  try {
    authResult = await getAuthState();
  } catch (err) {
    lanaLog(`Preflight Dashboard IMS init error: ${err.message}`, 'error,preflight-dashboard,ims');
    showErrorScreen(
      'Sign-in failed',
      `Could not initialize authentication: ${err.message}. Please reload and try again.`,
    );
    return;
  }

  if (!authResult.authenticated) {
    showAuthScreen();
    return;
  }

  if (authResult.adobeOnly === false) {
    showErrorScreen(
      'Access restricted',
      `This dashboard is only accessible to @adobe.com accounts. You are signed in as ${authResult.email}.`,
    );
    return;
  }

  state.imsToken = authResult.token;
  setUserInfo(authResult.email);
  showDashboard();

  setupEventListeners();
  await loadData(1);
}

// ─── Boot ─────────────────────────────────────────────────────────────────────

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

export default init;
