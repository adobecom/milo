(function () {
  'use strict';

  const usp = new URLSearchParams(window.location.search);
  const COLLAB_ID = usp.get('peregrine-collab-id') || '';
  const SERVICE = (
    usp.get('peregrine-service-ep') ||
    document.querySelector('meta[name="collab-service-ep"]')?.content ||
    ''
  ).replace(/\/$/, '');
  const ME = { email: '', name: 'You', profileId: '', imsEmail: '' };

  if (!SERVICE || !COLLAB_ID) {
    console.warn('[collab] missing collab-service-ep meta or peregrine-collab-id param — collab tool disabled');
    return;
  }

  // Pending API proxy requests keyed by reqId — resolved/rejected when collab:api-response arrives.
  const _pendingApiRequests = {};

  if (window.parent !== window) {
    window.addEventListener('message', (e) => {
      // Only accept messages from the direct parent frame.
      if (e.source !== window.parent) return;
      if (e.data?.type === 'collab:set-user') {
        // Receive user profile from parent — no token ever leaves the parent frame.
        if (e.data.name)      ME.name      = e.data.name;
        if (e.data.profileId) ME.profileId = e.data.profileId;
        if (e.data.email)     { ME.email = e.data.email; ME.imsEmail = e.data.email; }
      }
      if (e.data?.type === 'collab:toggle-panel') togglePanel();
      if (e.data?.type === 'collab:toggle-visibility') toggleMarkersVisibility();
      if (e.data?.type === 'collab:set-panel-mode') setPanelMode(e.data.mode);
      if (e.data?.type === 'collab:select-thread') {
        const t = state.threads.find(x => x.id === e.data.threadId);
        if (t) {
          scrollToElement(t);
          const target = resolveElement(t.elementPath);
          if (target) {
            target.style.outline = '3px solid #1d4ed8';
            target.style.outlineOffset = '3px';
            target.style.borderRadius = '3px';
            target.style.transition = 'outline 0.3s';
            setTimeout(() => {
              target.style.outline = '';
              target.style.outlineOffset = '';
              target.style.borderRadius = '';
            }, 2000);
          }
        }
      }
      if (e.data?.type === 'collab:thread-created') {
        if (e.data.thread) {
          const normalized = normalizeThread(e.data.thread);
          const idx = state.threads.findIndex(x => x.id === normalized.id);
          if (idx >= 0) state.threads[idx] = normalized;
          else state.threads.push(normalized);
        }
        updateBadge();
        renderMarkers();
        notifyParent();
        if (clickTarget) { clickTarget.classList.remove('collab-block-hover'); clickTarget = null; }
      }
      if (e.data?.type === 'collab:new-comment-cancel') {
        if (clickTarget) { clickTarget.classList.remove('collab-block-hover'); clickTarget = null; }
      }
      if (e.data?.type === 'collab:reply-created') {
        if (e.data.thread) {
          const normalized = normalizeThread(e.data.thread);
          const idx = state.threads.findIndex(x => x.id === normalized.id);
          if (idx >= 0) state.threads[idx] = normalized;
          else state.threads.push(normalized);
        }
        refreshOpenViews(e.data.threadId);
        notifyParent();
      }
      if (e.data?.type === 'collab:api-response') {
        const pending = _pendingApiRequests[e.data.reqId];
        if (pending) {
          delete _pendingApiRequests[e.data.reqId];
          if (e.data.ok) pending.resolve(e.data.data);
          else pending.reject(new Error(e.data.error || 'API error'));
        }
      }
    });
  }

  function apiFetchViaParent(path, opts = {}) {
    return new Promise((resolve, reject) => {
      const reqId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      _pendingApiRequests[reqId] = { resolve, reject };
      window.parent.postMessage({
        type: 'collab:api-request',
        reqId,
        path,
        method: opts.method || 'GET',
        body: opts.body ?? null,
      }, '*');
      setTimeout(() => {
        if (_pendingApiRequests[reqId]) {
          delete _pendingApiRequests[reqId];
          reject(new Error(`[collab] api-request timed out: ${path}`));
        }
      }, 15000);
    });
  }

  function getRawToken() {
    return window.adobeIMS?.getAccessToken()?.token || '';
  }

  function getToken() {
    const t = getRawToken();
    return t ? `Bearer ${t}` : '';
  }

  async function apiFetch(path, opts = {}) {
    // When running inside an iframe, proxy all API calls through the parent app
    // so auth tokens and CORS are handled there.
    if (window.parent !== window) return apiFetchViaParent(path, opts);
    const headers = { 'Content-Type': 'application/json', ...(opts.headers || {}) };
    const token = getToken();
    if (token) headers['Authorization'] = token;
    const res = await fetch(`${SERVICE}${path}`, { ...opts, headers });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText} — ${path}`);
    return res.json();
  }

  const api = {
    getCollab:     ()                   => apiFetch(`/api/collabs/${COLLAB_ID}`),
    listThreads:   ()                   => apiFetch(`/api/collabs/${COLLAB_ID}/threads`),
    getThread:     (threadId)           => apiFetch(`/api/threads/${threadId}`),
    createThread:  (anchor, body)       => apiFetch(`/api/collabs/${COLLAB_ID}/threads`, { method: 'POST', body: JSON.stringify({ anchor, body }) }),
    createReply:   (threadId, body)     => apiFetch(`/api/collabs/${COLLAB_ID}/threads/${threadId}/comments`, { method: 'POST', body: JSON.stringify({ body }) }),
    updateStatus:  (threadId, state)    => apiFetch(`/api/threads/${threadId}`, { method: 'PATCH', body: JSON.stringify({ state }) }),
    updateComment: (commentId, body)    => apiFetch(`/api/comments/${commentId}`, { method: 'PATCH', body: JSON.stringify({ body }) }),
    searchUsers:   (q)                  => apiFetch(`/api/search/groups-or-users?q=${encodeURIComponent(q)}`),
    listParticipants: ()                => apiFetch(`/api/collabs/${COLLAB_ID}/participants`),
  };

  const COLORS = ['#4a3ddb','#d4380d','#1565c0','#6d4c41','#1b5e20','#4a148c','#880e4f','#e65100'];
  function avatarColor(key) {
    let h = 0;
    for (let i = 0; i < (key || '').length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
    return COLORS[h % COLORS.length];
  }

  function avatarInitials(name) {
    const parts = (name || '?').trim().split(/\s+/);
    return parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : (name[0] || '?').toUpperCase();
  }

  function relativeTime(iso) {
    if (!iso) return '';
    const diff = Date.now() - new Date(iso).getTime();
    if (diff < 10000)  return 'now';
    if (diff < 60000)  return `${Math.floor(diff / 1000)}s ago`;
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  }

  function renderMentions(text) {
    if (!text) return '';
    return text
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/@\[([^\]]+)\]\(([^)]+)\)/g,
        (_, name, email) => `<span class="collab-mention" title="${esc(email)}">@${esc(name)}</span>`);
  }

  function statusClass(s) {
    const m = { open: 'collab-status-open', accepted: 'collab-status-accepted', rejected: 'collab-status-rejected', closed: 'collab-status-closed' };
    return m[(s || '').toLowerCase()] || 'collab-status-open';
  }

  function esc(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function el(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  function txt(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  let state = { threads: [], participants: [], activeTab: 'all', searchQ: '', panelOpen: false, pageTitle: '', pageUrl: '' };
  let activeThreadId = null;
  let popupThreadId = null;
  let popupAnchor = null;
  let popupPageElement = null;
  let clickTarget = null;

  let panel, threadList;
  let floatingLayer;
  let newCommentPopup, newCommentTextarea, newCommentGetValue;
  let threadPopupEl;
  let markersVisible = true;
  let pageInfoResolved = false;

  function toggleMarkersVisibility() {
    markersVisible = !markersVisible;
    document.body.classList.toggle('collab-markers-hidden', !markersVisible);
    notifyParent();
  }

  function notifyParent() {
    if (window.parent === window) return;
    const count = state.threads.filter(t => !isResolved(t)).length;
    const hasMention = state.threads.some(hasMentionUnreplied);
    const seenEmails = new Set();
    const seenNames  = new Set();
    const others = state.participants.filter(p => {
      if (matchesMe(p.email, p.name)) return false;
      const email = String(p.email || '').toLowerCase();
      const name  = String(p.name  || '').trim().toLowerCase();
      if (!email && !name) return false;
      if (email && seenEmails.has(email)) return false;
      if (name  && seenNames.has(name))   return false;
      if (email) seenEmails.add(email);
      if (name)  seenNames.add(name);
      return true;
    });
    const participants = [
      { name: ME.name || ME.imsEmail, profileId: ME.profileId, isYou: true },
      ...others.map(p => ({ name: p.name, profileId: p.profileId, isYou: false })),
    ];
    window.parent.postMessage({
      type: 'collab:state-update',
      threadCount: count,
      hasMention,
      panelOpen: state.panelOpen,
      markersVisible,
      participants,
      pageTitle: state.pageTitle,
      pageUrl:   state.pageUrl,
      threads: state.threads,
    }, '*');
  }

  // Identify the current user: match by email first, fall back to display name.
  function matchesMe(email, name) {
    const meEmails = [ME.email, ME.imsEmail].filter(Boolean).map(e => String(e).toLowerCase());
    if (email && meEmails.includes(String(email).toLowerCase())) return true;
    const meName = (ME.name || '').trim().toLowerCase();
    return !!name && meName.length > 1 && meName === String(name).trim().toLowerCase();
  }

  function updateBadge() {
    notifyParent();
  }

  function buildPanel() {
    panel = el('div', '');
    panel.id = 'collab-panel';

    const header = el('div', 'collab-panel-header');
    const dragHandle = el('span', 'collab-drag-handle');
    dragHandle.innerHTML = '⠿';
    dragHandle.title = 'Drag to move';
    const title = el('span', 'collab-panel-title', '<span>Annotations</span><span class="collab-panel-title-dot"></span>');
    const dockToggle = el('button', 'collab-dock-toggle');
    dockToggle.title = 'Switch dock side';
    dockToggle.textContent = '⇄';
    dockToggle.addEventListener('click', toggleDock);
    const closeBtn = el('button', 'collab-panel-close');
    closeBtn.textContent = '×';
    closeBtn.addEventListener('click', togglePanel);
    header.append(dragHandle, title, dockToggle, closeBtn);

    const searchWrap = el('div', 'collab-panel-search');
    const searchIcon = el('span', 'collab-search-icon', '🔍');
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search comments…';
    searchInput.addEventListener('input', e => { state.searchQ = e.target.value; renderPanel(); });
    searchWrap.append(searchIcon, searchInput);

    const tabs = el('div', 'collab-tabs');
    ['Mentions', 'All', 'Mine'].forEach(label => {
      const tab = el('button', 'collab-tab');
      tab.dataset.tab = label.toLowerCase();
      tab.innerHTML = label;
      if (label === 'Mentions' || label === 'All') {
        tab.innerHTML += '<span class="collab-tab-dot" style="display:none"></span>';
      }
      if (label === 'All') tab.classList.add('active');
      tab.addEventListener('click', () => {
        state.activeTab = label.toLowerCase();
        panel.querySelectorAll('.collab-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        renderPanel();
      });
      tabs.appendChild(tab);
    });

    threadList = el('div', 'collab-thread-list');

    panel.append(header, searchWrap, tabs, threadList);
    document.body.appendChild(panel);

    setupPanelDrag(dragHandle);
    restorePanelPlacement();
  }

  function togglePanel() {
    state.panelOpen = !state.panelOpen;
    panel.classList.toggle('open', state.panelOpen);
    if (state.panelOpen) renderPanel();
    notifyParent();
  }

  function setPanelMode(mode) {
    if (!panel) return;
    panel.classList.remove('collab-panel-float', 'collab-panel-left');
    panel.style.cssText = '';
    if (mode === 'left') panel.classList.add('collab-panel-left');
    savePanelPlacement();
  }

  function toggleDock() {
    panel.classList.toggle('collab-panel-left');
    panel.classList.remove('collab-panel-float');
    savePanelPlacement();
  }

  function setupPanelDrag(handle) {
    const SNAP = 60;
    let dragging = false, startX, startY, startLeft, startTop;

    handle.addEventListener('pointerdown', e => {
      dragging = true;
      handle.setPointerCapture(e.pointerId);
      const rect = panel.getBoundingClientRect();
      startX = e.clientX; startY = e.clientY;
      startLeft = rect.left; startTop = rect.top;
      e.preventDefault();
    });

    handle.addEventListener('pointermove', e => {
      if (!dragging) return;
      const dx = e.clientX - startX, dy = e.clientY - startY;
      if (Math.abs(dx) < 4 && Math.abs(dy) < 4) return;
      panel.classList.add('collab-panel-float');
      panel.classList.remove('collab-panel-left', 'open');
      panel.style.left = `${Math.max(0, startLeft + dx)}px`;
      panel.style.top  = `${Math.max(54, startTop + dy)}px`;
      panel.style.right = 'auto';
      panel.style.bottom = 'auto';
      panel.style.display = 'flex';
    });

    handle.addEventListener('pointerup', e => {
      if (!dragging) return;
      dragging = false;
      if (!panel.classList.contains('collab-panel-float')) return;
      const rect = panel.getBoundingClientRect();
      if (rect.left < SNAP) {
        panel.classList.remove('collab-panel-float');
        panel.classList.add('collab-panel-left', 'open');
        panel.style.cssText = '';
      } else if (window.innerWidth - rect.right < SNAP) {
        panel.classList.remove('collab-panel-float', 'collab-panel-left');
        panel.classList.add('open');
        panel.style.cssText = '';
      }
      savePanelPlacement();
    });
  }

  function savePanelPlacement() {
    const isLeft  = panel.classList.contains('collab-panel-left');
    const isFloat = panel.classList.contains('collab-panel-float');
    localStorage.setItem('collab-panel-placement', JSON.stringify({
      side: isLeft ? 'left' : 'right',
      float: isFloat,
      left: panel.style.left,
      top: panel.style.top,
    }));
  }

  function restorePanelPlacement() {
    try {
      const p = JSON.parse(localStorage.getItem('collab-panel-placement') || 'null');
      if (!p) return;
      if (p.float) {
        panel.classList.add('collab-panel-float');
        panel.style.left = p.left;
        panel.style.top = p.top;
        panel.style.right = 'auto';
        panel.style.bottom = 'auto';
      } else if (p.side === 'left') {
        panel.classList.add('collab-panel-left');
      }
    } catch { /* ignore */ }
  }

  function filterThreads() {
    let threads = [...state.threads];
    const q = state.searchQ.trim().toLowerCase();

    if (state.activeTab === 'mentions') threads = threads.filter(hasMentionUnreplied);
    else if (state.activeTab === 'mine') threads = threads.filter(isMine);

    if (q) {
      threads = threads.filter(t =>
        t.username.toLowerCase().includes(q) ||
        t.messages.some(m => m.text.toLowerCase().includes(q))
      );
    }
    return threads;
  }

  function renderPanel() {
    const mentionCount = state.threads.filter(hasMentionUnreplied).length;
    const mentionsDot = panel.querySelector('[data-tab="mentions"] .collab-tab-dot');
    const allDot = panel.querySelector('[data-tab="all"] .collab-tab-dot');
    if (mentionsDot) mentionsDot.style.display = mentionCount ? '' : 'none';
    if (allDot) allDot.style.display = mentionCount ? '' : 'none';

    const threads = filterThreads();
    threadList.innerHTML = '';

    if (!threads.length) {
      threadList.appendChild(el('div', 'collab-empty', 'No comments yet.'));
      return;
    }

    threads.forEach(t => {
      const card = buildThreadCard(t);
      if (t.id === activeThreadId) {
        card.appendChild(buildExpandedThread(t, true));
      }
      threadList.appendChild(card);
    });
  }

  function buildThreadCard(t) {
    const first = t.messages[0] || {};
    const card = el('article', 'collab-thread-card');
    if (t.id === activeThreadId) card.classList.add('active-card');

    const header = el('div', 'collab-thread-card-header');

    const authorEl = txt('span', 'collab-thread-card-author', first.username || 'Unknown');
    const timeEl = txt('span', 'collab-thread-card-time', relativeTime(first.createdAt));

    const statusSel = document.createElement('select');
    statusSel.className = `collab-status-select ${statusClass(t.status)}`;
    ['open','accepted','rejected','closed'].forEach(s => {
      const opt = document.createElement('option');
      opt.value = s; opt.textContent = s.charAt(0).toUpperCase() + s.slice(1);
      if (s === t.status) opt.selected = true;
      statusSel.appendChild(opt);
    });
    statusSel.addEventListener('mousedown', e => e.stopPropagation());
    statusSel.addEventListener('change', async e => {
      e.stopPropagation();
      try { await api.updateStatus(t.id, statusSel.value); await refresh(); }
      catch (err) { console.error('[collab] updateStatus', err); }
    });

    header.append(authorEl, timeEl, statusSel);

    if (hasMentionUnreplied(t)) {
      header.appendChild(el('span', 'collab-mention-dot'));
    }

    card.appendChild(header);

    const commentBox = el('div', 'collab-comment-box');
    commentBox.innerHTML = renderMentions(first.text || '');
    card.appendChild(commentBox);

    card.addEventListener('click', e => {
      if (e.target.closest('.collab-thread-expanded') || e.target.closest('select') || e.target.closest('button')) return;
      scrollToElement(t);
      activeThreadId = activeThreadId === t.id ? null : t.id;
      renderPanel();
    });

    return card;
  }

  function buildExpandedThread(t, skipFirst = false) {
    const wrap = el('div', 'collab-thread-expanded');

    const repliesSection = el('div', 'collab-replies-section');
    const msgs = skipFirst ? t.messages.slice(1) : t.messages;
    msgs.forEach(m => {
      const row = el('div', 'collab-reply-row');
      const replyHeader = el('div', 'collab-reply-header');
      replyHeader.appendChild(txt('span', 'collab-reply-author', m.username || 'Unknown'));
      replyHeader.appendChild(txt('span', 'collab-reply-time', relativeTime(m.createdAt)));

      if (m.authorProfileId === ME.profileId) {
        const editBtn = el('button', 'collab-btn collab-btn-ghost collab-btn-sm', '✏');
        editBtn.title = 'Edit';
        editBtn.style.marginLeft = '4px';
        editBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          showEditForm(row, m, t);
        });
        replyHeader.appendChild(editBtn);
      }

      row.appendChild(replyHeader);
      const replyText = el('div', 'collab-reply-text');
      replyText.innerHTML = renderMentions(m.text);
      row.appendChild(replyText);
      repliesSection.appendChild(row);
    });
    wrap.appendChild(repliesSection);

    if (t.status !== 'closed') {
      const composer = el('div', 'collab-reply-composer');
      const { wrap: mentionWrap, textarea, getValue } = buildMentionField('Reply…');
      const sendBtn = el('button', 'collab-send-btn', '➤');

      textarea.addEventListener('keydown', e => {
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); sendBtn.click(); }
      });

      sendBtn.addEventListener('click', async () => {
        const body = getValue();
        if (!body) return;
        sendBtn.disabled = true;
        // When inside an iframe, delegate reply saving to the parent app.
        if (window.parent !== window) {
          textarea.value = '';
          window.parent.postMessage({ type: 'collab:new-reply-request', threadId: t.id, body }, '*');
          sendBtn.disabled = false;
          return;
        }
        const optimistic = {
          id: `opt-${Date.now()}`,
          authorProfileId: ME.profileId,
          username: ME.name || 'You',
          text: body,
          kind: 'reply',
          createdAt: new Date().toISOString(),
        };
        const localThread = state.threads.find(tt => tt.id === t.id);
        if (localThread) localThread.messages.push(optimistic);
        textarea.value = '';
        refreshOpenViews(t.id);
        try {
          await api.createReply(t.id, body);
          // Immediately pull the thread so the popup/panel shows the saved reply.
          await pullThread(t.id);
        } catch (e) {
          console.error('[collab] createReply', e);
          if (localThread) localThread.messages = localThread.messages.filter(m => m.id !== optimistic.id);
          refreshOpenViews(t.id);
        }
        finally { sendBtn.disabled = false; }
      });

      composer.append(mentionWrap, sendBtn);
      wrap.appendChild(composer);
    }

    return wrap;
  }

  function showEditForm(bodyEl, message, thread) {
    const existing = bodyEl.querySelector('.collab-edit-form');
    if (existing) { existing.remove(); return; }

    const form = el('div', 'collab-edit-form');
    const ta = document.createElement('textarea');
    ta.value = message.text.replace(/@\[([^\]]+)\]\([^)]+\)/g, '@$1');
    form.appendChild(ta);

    const actions = el('div', 'collab-edit-actions');
    const saveBtn = el('button', 'collab-btn collab-btn-primary collab-btn-sm', 'Save');
    const discardBtn = el('button', 'collab-btn collab-btn-ghost collab-btn-sm', 'Discard');
    discardBtn.addEventListener('click', () => form.remove());
    saveBtn.addEventListener('click', async () => {
      const body = ta.value.trim();
      if (!body) return;
      try {
        await api.updateComment(message.id, body);
        await refresh();
      } catch (e) { console.error('[collab] updateComment', e); }
    });
    actions.append(saveBtn, discardBtn);
    form.appendChild(actions);
    bodyEl.appendChild(form);
    ta.focus();
  }

  function buildFloatingLayer() {
    floatingLayer = el('div', '');
    floatingLayer.id = 'collab-floating-layer';
    document.body.appendChild(floatingLayer);
  }

  function renderMarkers(fromScroll = false) {
    floatingLayer.innerHTML = '';

    const byElement = new Map();
    state.threads.forEach(t => {
      const target = resolveElement(t.elementPath);
      if (!target) return;
      if (!byElement.has(target)) byElement.set(target, []);
      byElement.get(target).push(t);
    });

    byElement.forEach((threads, target) => {
      target.classList.add('collab-has-comments');
      const rect = target.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) return;

      const allResolved = threads.every(isResolved);
      const first = threads[0].messages[0] || {};
      const marker = el('button', 'collab-thread-marker');

      let markerIcon, markerBg, markerColor;
      if (allResolved) {
        markerIcon  = threads[0].status === 'rejected' ? '!' : '✓';
        markerBg    = '';
        markerColor = '';
      } else {
        markerIcon  = threads.length > 1 ? String(threads.length) : avatarInitials(first.username || '?');
        markerBg    = avatarColor(first.authorProfileId || first.username);
        markerColor = '#fff';
      }

      marker.style.cssText = `top:${rect.top - 8}px;left:${rect.right - 20}px;background:${markerBg};color:${markerColor}`;
      marker.textContent = markerIcon;
      if (allResolved) {
        marker.classList.add('resolved');
        if (threads[0].status === 'rejected') marker.classList.add('rejected');
      }
      marker.title = threads.map(t => t.messages[0]?.username).filter(Boolean).join(', ');

      marker.addEventListener('click', e => {
        e.stopPropagation();
        e.preventDefault();
        openThreadPopup(threads[0], marker);
        if (window.parent !== window) {
          window.parent.postMessage({ type: 'collab:thread-selected', threadId: threads[0].id }, '*');
        }
      });

      floatingLayer.appendChild(marker);
    });

    if (fromScroll && threadPopupEl && popupPageElement) {
      positionPopup(threadPopupEl, { getBoundingClientRect: () => popupPageElement.getBoundingClientRect() });
    }
  }

  function resolveElement(elementPath) {
    if (!elementPath) return null;
    try {
      const desc = typeof elementPath === 'string' ? JSON.parse(elementPath) : elementPath;
      if (desc.selector) return document.querySelector(desc.selector);
    } catch { /* not JSON, try as CSS selector */ }
    if (typeof elementPath === 'string' && elementPath) {
      try { return document.querySelector(elementPath); } catch { return null; }
    }
    return null;
  }

  function scrollToElement(thread) {
    const el = resolveElement(thread.elementPath);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function scrollPopupRepliesToBottom(popup) {
    const section = popup?.querySelector('.collab-replies-section');
    if (section) section.scrollTop = section.scrollHeight;
  }

  function openThreadPopup(thread, anchorEl) {
    closeThreadPopup();
    if (state.panelOpen) togglePanel();
    const popup = buildThreadPopup(thread);
    document.body.appendChild(popup);
    threadPopupEl = popup;
    popupThreadId = thread.id;
    popupAnchor = anchorEl;
    popupPageElement = resolveElement(thread.elementPath);
    positionPopup(popup, anchorEl);
    // Scroll to the latest reply immediately on open.
    requestAnimationFrame(() => scrollPopupRepliesToBottom(threadPopupEl));
  }

  function closeThreadPopup() {
    if (threadPopupEl) {
      threadPopupEl.remove();
      threadPopupEl = null;
      popupThreadId = null;
      popupAnchor = null;
      popupPageElement = null;
    }
  }

  function refreshOpenPopup(threadId) {
    if (!threadPopupEl || popupThreadId !== threadId) return;
    const updated = state.threads.find(t => t.id === threadId);
    if (!updated) return;
    const oldBody = threadPopupEl.querySelector('.collab-thread-expanded');
    if (oldBody) {
      oldBody.replaceWith(buildExpandedThread(updated));
      // Keep the latest reply visible after the DOM update.
      requestAnimationFrame(() => scrollPopupRepliesToBottom(threadPopupEl));
    }
  }

  // Refresh wherever this thread is currently being viewed — the floating popup
  // and/or its expanded card in the comments panel — so optimistic updates (and
  // pulled server state) show up immediately in both places, not just one.
  function refreshOpenViews(threadId) {
    refreshOpenPopup(threadId);
    if (state.panelOpen && activeThreadId === threadId) {
      const card = threadList.querySelector('.collab-thread-card.active-card');
      const updated = state.threads.find(t => t.id === threadId);
      if (card && updated) {
        const oldBody = card.querySelector('.collab-thread-expanded');
        if (oldBody) oldBody.replaceWith(buildExpandedThread(updated, true));
      } else if (updated) {
        renderPanel(); // card not found (e.g. filtered by search) — fall back to a full render
      }
    }
  }

  // Pull a single thread from the server and refresh its open popup — called right
  // after creating a thread or reply so the popup reflects the saved comment
  // (the POST has already resolved, so the fetched thread includes it).
  async function pullThread(threadId) {
    try {
      const raw = await api.getThread(threadId);
      const t = raw?.thread || raw;
      if (!t || !t.id) return;
      const normalized = normalizeThread(t);
      const idx = state.threads.findIndex(x => x.id === threadId);
      const existing = idx >= 0 ? state.threads[idx] : null;
      const changed = !existing
        || existing.status !== normalized.status
        || existing.messages.length !== normalized.messages.length
        || existing.messages.at(-1)?.id !== normalized.messages.at(-1)?.id;
      if (idx >= 0) state.threads[idx] = normalized;
      else state.threads.push(normalized);
      if (changed) {
        updateBadge();
        renderMarkers();
        refreshOpenViews(threadId);
      }
    } catch (e) {
      console.warn('[collab] pullThread failed', e);
    }
  }

  function positionPopup(popup, anchor) {
    const ar = anchor.getBoundingClientRect();
    const pw = popup.offsetWidth  || 300;
    const ph = popup.offsetHeight || 320;
    let left = ar.right + 8;
    let top  = ar.top;
    if (left + pw > window.innerWidth - 8) left = ar.left - pw - 8;
    if (left < 8) left = 8;
    if (top + ph > window.innerHeight - 8) top = window.innerHeight - ph - 8;
    top = Math.max(60, top);
    popup.style.left = `${left}px`;
    popup.style.top  = `${top}px`;
  }

  function buildThreadPopup(t) {
    const popup = el('div', 'collab-thread-popup');

    const header = el('div', 'collab-thread-popup-header');
    const label = el('span', 'collab-thread-popup-label', 'THREAD');
    const spacer = el('div', '');
    spacer.style.flex = '1';
    const select = document.createElement('select');
    select.className = 'collab-status-select';
    ['open','accepted','rejected','closed'].forEach(s => {
      const opt = document.createElement('option');
      opt.value = s; opt.textContent = s.charAt(0).toUpperCase() + s.slice(1);
      if (s === t.status) opt.selected = true;
      select.appendChild(opt);
    });
    select.addEventListener('change', async () => {
      try { await api.updateStatus(t.id, select.value); await refresh(); }
      catch (e) { console.error('[collab] updateStatus', e); }
    });
    const closeBtn = el('button', 'collab-popup-close', '×');
    closeBtn.addEventListener('click', closeThreadPopup);
    header.append(label, spacer, select, closeBtn);
    popup.appendChild(header);

    popup.appendChild(buildExpandedThread(t));

    return popup;
  }

  function buildNewCommentPopup() {
    newCommentPopup = el('div', '');
    newCommentPopup.id = 'collab-new-comment-popup';

    const header = el('div', 'collab-thread-popup-header');
    const label = el('span', 'collab-thread-popup-label', 'COMMENT');
    const closeBtn = el('button', 'collab-popup-close', '×');
    closeBtn.addEventListener('click', closeNewCommentPopup);
    header.append(label, closeBtn);

    const composer = el('div', 'collab-new-comment-composer');
    const { wrap, textarea, getValue } = buildMentionField('Write a comment…');
    textarea.rows = 4;
    textarea.className = 'collab-new-comment-textarea';
    newCommentTextarea  = textarea;
    newCommentGetValue  = getValue;

    const sendBtn = el('button', 'collab-send-btn collab-new-comment-send', '➤');
    sendBtn.title = 'Submit comment (Cmd+Enter)';
    sendBtn.addEventListener('click', submitNewComment);

    textarea.addEventListener('keydown', e => {
      if (e.key === 'Escape') { e.stopPropagation(); closeNewCommentPopup(); }
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); sendBtn.click(); }
    });

    composer.append(wrap, sendBtn);
    newCommentPopup.append(header, composer);
    document.body.appendChild(newCommentPopup);
  }

  function openNewCommentPopup(targetEl) {
    clickTarget = targetEl;
    newCommentTextarea.value = '';
    newCommentPopup.classList.add('open');

    const rect = targetEl.getBoundingClientRect();
    const pw = newCommentPopup.offsetWidth  || 340;
    const ph = newCommentPopup.offsetHeight || 220;
    let left = rect.right + 12;
    let top  = rect.top;
    if (left + pw > window.innerWidth  - 12) left = rect.left - pw - 12;
    if (left < 12) left = 12;
    if (top  + ph > window.innerHeight - 12) top  = window.innerHeight - ph - 12;
    top = Math.max(60, top);
    newCommentPopup.style.left = `${left}px`;
    newCommentPopup.style.top  = `${top}px`;
    newCommentTextarea.focus();
  }

  function closeNewCommentPopup() {
    newCommentPopup.classList.remove('open');
    if (clickTarget) {
      clickTarget.classList.remove('collab-block-hover');
      clickTarget = null;
    }
  }

  async function submitNewComment() {
    const body = newCommentGetValue ? newCommentGetValue().trim() : newCommentTextarea.value.trim();
    if (!body || !clickTarget) return;

    const savedTarget = clickTarget;
    const anchor = {
      elementPath: buildElementPath(savedTarget),
      quotedText: (savedTarget.textContent || '').slice(0, 200).trim(),
    };

    // In iframe mode, delegate to the parent app — it holds the auth token and saves to the API.
    if (window.parent !== window) {
      closeNewCommentPopup();
      window.parent.postMessage({ type: 'collab:new-comment-request', anchor, body }, '*');
      return;
    }

    try {
      const created = await api.createThread(anchor, body);
      const createdThread = created?.thread || created;
      if (createdThread?.id) {
        // Use the created thread directly (reliable id) instead of matching by
        // element. Open its popup where the composer sat (no visible close/reopen —
        // it just refreshes into the thread view), then pull the server state.
        const composeRect = newCommentPopup.getBoundingClientRect();
        const normalized = normalizeThread(createdThread);
        const idx = state.threads.findIndex(x => x.id === normalized.id);
        if (idx >= 0) state.threads[idx] = normalized;
        else state.threads.push(normalized);
        updateBadge();
        renderMarkers();
        if (state.panelOpen) renderPanel();
        openThreadPopup(normalized, { getBoundingClientRect: () => savedTarget.getBoundingClientRect() });
        if (threadPopupEl) {
          threadPopupEl.style.left = `${composeRect.left}px`;
          threadPopupEl.style.top  = `${composeRect.top}px`;
        }
        closeNewCommentPopup();
        await pullThread(normalized.id);
      } else {
        closeNewCommentPopup();
        await refresh();
        const newThread = state.threads.find(t => resolveElement(t.elementPath) === savedTarget);
        if (newThread) openThreadPopup(newThread, { getBoundingClientRect: () => savedTarget.getBoundingClientRect() });
      }
    } catch (e) { console.error('[collab] createThread', e); }
  }

  function buildElementPath(el) {
    const parts = [];
    let node = el;
    while (node && node !== document.body) {
      let sel = node.tagName.toLowerCase();
      if (node.id) { sel += `#${node.id}`; parts.unshift(sel); break; }
      const siblings = node.parentElement ? [...node.parentElement.children].filter(c => c.tagName === node.tagName) : [];
      if (siblings.length > 1) sel += `:nth-of-type(${siblings.indexOf(node) + 1})`;
      parts.unshift(sel);
      node = node.parentElement;
    }
    return JSON.stringify({ selector: parts.join(' > ') });
  }

  function setupElementInteraction() {
    let hovered = null;

    document.addEventListener('mousemove', e => {
      if (newCommentPopup.classList.contains('open')) return;
      const target = findCommentableElement(e.target);
      if (target === hovered) return;
      if (hovered) hovered.classList.remove('collab-block-hover');
      hovered = target;
      if (hovered) hovered.classList.add('collab-block-hover');
    });

    document.addEventListener('click', e => {
      if (!e.isTrusted) return;
      const anchor = e.target.closest('a[href]');
      if (!anchor) return;
      if (anchor.closest('#collab-panel,#collab-new-comment-popup,.collab-thread-popup')) return;
      e.preventDefault();
    }, true);

    document.addEventListener('click', e => {
      if (!e.isTrusted) return;

      if (threadPopupEl && !threadPopupEl.contains(e.target)) closeThreadPopup();

      if (newCommentPopup.classList.contains('open') && !newCommentPopup.contains(e.target)) {
        closeNewCommentPopup(); return;
      }

      if (e.target.closest('.collab-thread-marker') ||
          e.target.closest('#collab-panel') || e.target.closest('#collab-new-comment-popup') ||
          e.target.closest('.collab-thread-popup')) return;

      const target = findCommentableElement(e.target);
      if (target) {
        e.stopPropagation();
        e.stopImmediatePropagation();
        e.preventDefault();

        const existing = state.threads.find(t => resolveElement(t.elementPath) === target);
        if (existing) {
          closeNewCommentPopup();
          openThreadPopup(existing, { getBoundingClientRect: () => target.getBoundingClientRect() });
        } else {
          openNewCommentPopup(target);
        }
      }
    }, true);
  }

  function findCommentableElement(el) {
    if (!el || el === document.body || el.id === 'collab-floating-layer') return null;
    const skip = ['#collab-panel','#collab-new-comment-popup','.collab-thread-popup','.collab-thread-marker'];
    if (skip.some(s => el.closest?.(s))) return null;
    const main = document.querySelector('main') || document.body;
    const block = el.closest('main > div > div, main > div, section, article, p, h1, h2, h3, h4, h5, li, figure');
    return block && main.contains(block) ? block : null;
  }

  function buildMentionField(placeholder) {
    const wrap = el('div', 'collab-mention-wrap');
    const backdrop = el('div', 'collab-mention-backdrop');
    const textarea = document.createElement('textarea');
    textarea.placeholder = placeholder;
    textarea.rows = 2;
    textarea.style.width = '100%';
    wrap.append(backdrop, textarea);

    let dropdown = null;
    let focusedIdx = -1;
    let debounceTimer = null;
    let mentionStart = -1;
    const mentionMap = {};

    function updateBackdrop() {
      const text = textarea.value
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/(@\S+)/g, '<mark>$1</mark>');
      backdrop.innerHTML = text;
    }

    function closeDropdown() {
      if (dropdown) { dropdown.remove(); dropdown = null; }
      focusedIdx = -1;
    }

    function resolveEmail(user) {
      const raw = user.email || user.id || '';
      return raw.includes('@') ? raw : raw ? `${raw}@adobe.com` : '';
    }

    function openDropdown(results) {
      closeDropdown();
      if (!results.length) return;
      dropdown = el('div', 'collab-mention-dropdown');
      results.forEach(user => {
        const item = el('div', 'collab-mention-item');
        const email = resolveEmail(user);
        item.appendChild(txt('span', 'collab-mention-name', user.displayName || user.name || ''));
        item.appendChild(txt('span', 'collab-mention-email', email));
        item.addEventListener('mousedown', e => { e.preventDefault(); selectMention(user); });
        dropdown.appendChild(item);
      });
      const rect = textarea.getBoundingClientRect();
      dropdown.style.left = `${rect.left}px`;
      dropdown.style.top  = `${rect.bottom + 4}px`;
      dropdown.style.width = `${rect.width}px`;
      document.body.appendChild(dropdown);
    }

    function focusItem(idx) {
      const items = dropdown?.querySelectorAll('.collab-mention-item');
      if (!items) return;
      items.forEach((it, i) => it.classList.toggle('focused', i === idx));
      focusedIdx = idx;
    }

    function selectMention(user) {
      const email = resolveEmail(user);
      const ldap  = email.split('@')[0];
      const name  = user.displayName || user.name;
      mentionMap[ldap] = { name, email };

      const val    = textarea.value;
      const before = val.slice(0, mentionStart);
      const after  = val.slice(textarea.selectionEnd);
      textarea.value = `${before}@${ldap} ${after}`;
      const newPos = mentionStart + 1 + ldap.length + 1;
      textarea.setSelectionRange(newPos, newPos);
      updateBackdrop();
      closeDropdown();
      mentionStart = -1;
      textarea.focus();
    }

    function getValue() {
      return textarea.value.replace(/@(\S+)/g, (match, ldap) => {
        const info = mentionMap[ldap];
        return info ? `@[${info.name}](${info.email})` : match;
      });
    }

    textarea.addEventListener('input', () => {
      updateBackdrop();
      const pos    = textarea.selectionStart;
      const before = textarea.value.slice(0, pos);

      const atMatch = before.match(/@([^@]*)$/);
      if (!atMatch) { mentionStart = -1; closeDropdown(); return; }
      mentionStart = pos - atMatch[0].length;
      const query = atMatch[1].trimEnd();
      if (query.length < 2) { closeDropdown(); return; }
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(async () => {
        try {
          const data = await api.searchUsers(query);
          const users = (Array.isArray(data) ? data : data.result || [])
            .filter(u => u.type === 'user' && u.id)
            .slice(0, 8);
          openDropdown(users);
        } catch { closeDropdown(); }
      }, 250);
    });

    textarea.addEventListener('keydown', e => {
      if (!dropdown) return;
      const items = dropdown.querySelectorAll('.collab-mention-item');
      if (e.key === 'ArrowDown') { e.preventDefault(); focusItem(Math.min(focusedIdx + 1, items.length - 1)); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); focusItem(Math.max(focusedIdx - 1, 0)); }
      else if (e.key === 'Enter' && focusedIdx >= 0) {
        e.preventDefault();
        items[focusedIdx].dispatchEvent(new MouseEvent('mousedown'));
      }
      else if (e.key === 'Escape') { closeDropdown(); mentionStart = -1; }
    });

    textarea.addEventListener('blur', () => setTimeout(closeDropdown, 150));

    return { wrap, textarea, getValue };
  }

  function normalizeThread(t) {
    const messages = (t.comments || t.messages || []).map(m => ({
      id: m.id,
      authorProfileId: m.authorProfileId || m.profileId || '',
      username: m.authorName || m.username || m.displayName || m.author || '',
      text: m.body || m.text || '',
      kind: m.kind || (m.replyToCommentId ? 'reply' : 'comment'),
      createdAt: m.createdAt || m.created || null,
    }));
    // Always sort ascending so the latest message is at the bottom.
    messages.sort((a, b) => {
      if (!a.createdAt && !b.createdAt) return 0;
      if (!a.createdAt) return -1;
      if (!b.createdAt) return 1;
      return new Date(a.createdAt) - new Date(b.createdAt);
    });
    return {
      id: t.id,
      status: (t.state || t.status || 'open').toLowerCase(),
      elementPath: t.anchor?.elementPath || t.elementPath || '',
      username: messages[0]?.username || '',
      messages,
    };
  }

  function isResolved(t) { return t.status === 'accepted' || t.status === 'closed' || t.status === 'rejected'; }

  function extractMentionEmails(text) {
    const emails = [];
    if (!text) return emails;
    const re = /@\[[^\]]*\]\(([^)]+)\)/g;
    let m;
    while ((m = re.exec(text)) !== null) emails.push(m[1]);
    return emails;
  }

  function myIds() {
    return [ME.imsEmail, ME.email, ME.profileId, ME.name].filter(Boolean);
  }

  function hasMentionUnreplied(t) {
    const ids = myIds();
    let lastMentionIdx = -1;
    t.messages.forEach((msg, i) => {
      const mentioned = extractMentionEmails(msg.text);
      if (mentioned.some(e => ids.some(id => id === e))) lastMentionIdx = i;
    });
    if (lastMentionIdx === -1) return false;
    const repliedAfter = t.messages.slice(lastMentionIdx + 1).some(msg =>
      ids.some(id => msg.authorProfileId === id || msg.username === id)
    );
    return !repliedAfter;
  }

  function isMine(t) {
    const first = t.messages[0];
    if (!first) return false;
    // Comments carry a display name (authorName), not an email — matchesMe uses the
    // email when present and falls back to the display name.
    return matchesMe(first.authorEmail, first.username);
  }

  function updatePageInfo(title, url) {
    if (!url || url.includes('localhost')) return;
    state.pageTitle = title || url;
    state.pageUrl   = url;
    pageInfoResolved = true;
    notifyParent();
  }

  async function refresh() {
    try {
      const collab = await api.getCollab();
      const collabData = collab.collab || collab;

      // getCollab may omit (or return empty) participants/threads depending on the
      // backend version — fall back to the dedicated endpoints so the UI still fills.
      let participants = Array.isArray(collabData.participants) ? collabData.participants : [];
      if (!participants.length) {
        try { const p = await api.listParticipants(); if (Array.isArray(p)) participants = p; }
        catch (e) { console.warn('[collab] listParticipants fallback failed', e); }
      }
      state.participants = participants.map(p => ({
        name: p.displayName || p.name || p.email || '',
        // profileId can come back as a number from the backend — keep it a string so
        // downstream string ops (toLowerCase, avatarColor) never throw.
        profileId: String(p.profileId ?? p.id ?? p.email ?? ''),
        email: p.email || '',
      }));

      let rawThreads = Array.isArray(collabData.threads) ? collabData.threads : [];
      if (!rawThreads.length) {
        try { const t = await api.listThreads(); if (Array.isArray(t)) rawThreads = t; }
        catch (e) { console.warn('[collab] listThreads fallback failed', e); }
      }
      state.threads = rawThreads.map(normalizeThread);
      if (!pageInfoResolved) {
        updatePageInfo(collabData.title, collabData.pageUrl || collabData.previewUrl);
      }
    } catch (e) {
      console.warn('[collab] refresh error', e);
    }

    notifyParent();
    renderMarkers();
    if (state.panelOpen) {
      const userIsTyping = panel.contains(document.activeElement)
        || (threadPopupEl && threadPopupEl.contains(document.activeElement));
      if (!userIsTyping) renderPanel();
    }
  }

  async function waitForImsReady() {
    if (window.parent !== window) {
      // In iframe mode, auth is handled by the parent. Wait for collab:set-user
      // which the parent sends after the iframe loads (5 s safety fallback).
      await new Promise((resolve) => {
        let done = false;
        const finish = () => {
          if (done) return;
          done = true;
          window.removeEventListener('message', onMsg);
          resolve();
        };
        const onMsg = (e) => { if (e.data?.type === 'collab:set-user') finish(); };
        window.addEventListener('message', onMsg);
        setTimeout(finish, 5000);
      });
      return;
    }
    if (getToken()) return;
    if (window.adobeIMS?.isSignedInUser?.()) return;
    await new Promise((resolve) => {
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        window.removeEventListener('ims:ready', onReady);
        resolve();
      };
      const onReady = () => finish();
      window.addEventListener('ims:ready', onReady);
      setTimeout(finish, 5000);
    });
  }

  // Fetch the signed-in user's profile straight from IMS — standalone mode only.
  // In iframe mode ME is populated by the collab:set-user message from the parent.
  const IMS_PROFILE_URL = 'https://ims-na1.adobelogin.com/ims/profile/v1';

  async function fetchImsProfile() {
    if (window.parent !== window) return;
    try {
      await waitForImsReady();
      const token = getRawToken();
      if (!token) return;
      const res = await fetch(IMS_PROFILE_URL, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const profile = await res.json();
      if (!profile) return;
      const email = profile.email || '';
      const name = profile.displayName
        || (profile.first_name ? `${profile.first_name} ${profile.last_name || ''}`.trim() : '')
        || profile.name || '';
      if (email) { ME.imsEmail = email; ME.email = email; }
      if (name)  ME.name = name;
      if (profile.userId) ME.profileId = ME.profileId || String(profile.userId);
    } catch (e) {
      console.warn('[collab] IMS profile fetch failed:', e.message);
    }
  }

  function startPolling() {
    refresh();
    setInterval(() => {
      if (document.visibilityState === 'visible') refresh();
    }, 10000);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') refresh();
    });
  }

  function setupScrollSync() {
    let ticking = false;
    const sync = () => { if (!ticking) { requestAnimationFrame(() => { renderMarkers(true); ticking = false; }); ticking = true; } };
    window.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync, { passive: true });
    window.addEventListener('load', () => renderMarkers());
    setTimeout(() => renderMarkers(), 800);
    setTimeout(() => renderMarkers(), 2500);
  }

  async function init() {
    document.body.classList.add('collab-active');
    buildPanel();
    buildFloatingLayer();
    buildNewCommentPopup();
    setupElementInteraction();
    setupScrollSync();
    notifyParent();
    if (window.parent !== window) {
      // In iframe mode all API calls are proxied through the parent — no need to
      // wait for user identity before fetching data.
      startPolling();
    } else {
      await waitForImsReady();
      startPolling();
      fetchImsProfile().then(() => { refresh(); });
    }
  }

  init();
})();
