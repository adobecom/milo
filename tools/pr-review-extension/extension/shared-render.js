// Shared between sidepanel.js (extension page context) and content.js
// (github.com page context, isolated world) — loaded as a plain <script>/
// content-script file by both, not an ES module, so it defines globals
// rather than exporting.

const RELAY_BASE = 'http://127.0.0.1:4756';

// Splits a finding's body into plain-text segments and fenced-code segments
// (```suggestion ... ``` or any ```lang ... ```), so a suggested code change
// renders as an actual code block instead of one wall of text with literal
// backticks in it. Every piece of text is still set via .textContent only —
// never innerHTML — since this is untrusted LLM-derived content.
const CODE_FENCE_RE = /```([a-zA-Z]*)\n([\s\S]*?)```/g;

function renderBody(container, text) {
  let lastIndex = 0;
  let match;
  CODE_FENCE_RE.lastIndex = 0;
  while ((match = CODE_FENCE_RE.exec(text)) !== null) {
    if (match.index > lastIndex) {
      const before = document.createElement('span');
      before.className = 'finding-prose';
      before.textContent = text.slice(lastIndex, match.index).trim();
      if (before.textContent) container.append(before);
    }
    const [, lang, code] = match;
    const pre = document.createElement('pre');
    pre.className = 'finding-code';
    if (lang === 'suggestion') {
      const badge = document.createElement('div');
      badge.className = 'finding-code-badge';
      badge.textContent = 'Suggested change';
      container.append(badge);
    }
    const codeEl = document.createElement('code');
    codeEl.textContent = code.replace(/\n$/, '');
    pre.append(codeEl);
    container.append(pre);
    lastIndex = CODE_FENCE_RE.lastIndex;
  }
  if (lastIndex < text.length) {
    const after = document.createElement('span');
    after.className = 'finding-prose';
    after.textContent = text.slice(lastIndex).trim();
    if (after.textContent) container.append(after);
  }
}

// Shared by findings, the PR overview, and (via content.js) on-page injected
// annotations: a read-only rendered view (prose + any fenced code block)
// with Edit/Simplify controls underneath. `getText`/`setText` read and
// mutate the caller's actual data so edits/simplifications flow straight
// into whatever gets posted later, with no separate UI state to keep in
// sync. `simplifyFn` defaults to a direct fetch (works from an extension
// page); content.js passes a chrome.runtime.sendMessage-based version
// instead, since a content script's own fetch is subject to the host
// page's CSP while the background service worker's is not.
async function defaultSimplify(body) {
  const res = await fetch(`${RELAY_BASE}/api/simplify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ body }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data.simplified;
}

function buildEditableTextBlock(getText, setText, simplifyFn = defaultSimplify) {
  const container = document.createElement('div');
  container.className = 'finding-body';

  let editTextarea = null; // set while in edit mode, else null

  function showReadOnly() {
    container.innerHTML = ''; // clearing with an empty string, not model content — safe
    renderBody(container, getText());
    editTextarea = null;
    editBtn.textContent = 'Edit';
  }

  function showEditor() {
    container.innerHTML = '';
    editTextarea = document.createElement('textarea');
    editTextarea.className = 'finding-edit-textarea';
    editTextarea.value = getText();
    editTextarea.rows = Math.min(12, Math.max(3, getText().split('\n').length));
    editTextarea.addEventListener('input', () => setText(editTextarea.value));
    container.append(editTextarea);
    editBtn.textContent = 'Done';
  }

  const toolbar = document.createElement('div');
  toolbar.className = 'finding-toolbar';

  const editBtn = document.createElement('button');
  editBtn.type = 'button';
  editBtn.className = 'finding-action-btn';
  editBtn.textContent = 'Edit';
  editBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation(); // don't let the click bubble to a wrapping <label> and toggle its checkbox
    if (editTextarea) showReadOnly(); else showEditor();
  });

  const simplifyBtn = document.createElement('button');
  simplifyBtn.type = 'button';
  simplifyBtn.className = 'finding-action-btn';
  simplifyBtn.textContent = 'Simplify';
  simplifyBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    e.stopPropagation();
    simplifyBtn.disabled = true;
    const original = simplifyBtn.textContent;
    simplifyBtn.textContent = 'Simplifying…';
    try {
      const simplified = await simplifyFn(getText());
      setText(simplified);
      if (editTextarea) editTextarea.value = getText(); else showReadOnly();
    } catch (err) {
      simplifyBtn.textContent = 'Failed — retry?';
      setTimeout(() => { simplifyBtn.textContent = original; }, 2500);
    } finally {
      simplifyBtn.disabled = false;
      if (simplifyBtn.textContent === 'Simplifying…') simplifyBtn.textContent = original;
    }
  });

  toolbar.append(editBtn, simplifyBtn);
  showReadOnly();
  return { container, toolbar };
}
