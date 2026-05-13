import DA_SDK from 'https://da.live/nx/utils/sdk.js';

const STORAGE_KEY = 'figma-to-da:serverUrl';
const POLL_INTERVAL = 3000;

const STAGES = [
  { id: 'extract', label: 'Extracting design' },
  { id: 'generate', label: 'Generating code' },
  { id: 'commit', label: 'Committing & pushing' },
  { id: 'publish', label: 'Publishing to DA' },
];

function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === 'class') node.className = v;
    else if (k.startsWith('data-')) node.dataset[k.slice(5)] = v;
    else node[k] = v;
  });
  children.flat().forEach((c) => {
    if (c == null) return;
    node.append(typeof c === 'string' ? document.createTextNode(c) : c);
  });
  return node;
}

function buildUI(context, token, username) {
  const link = el('link', { rel: 'stylesheet', href: '/tools/da/figma-to-da/figma-to-da.css' });
  document.head.append(link);

  // ── Config card ──
  const serverInput = el('input', {
    type: 'text',
    placeholder: 'https://abc123.ngrok-free.app',
    value: localStorage.getItem(STORAGE_KEY) || '',
  });
  serverInput.addEventListener('blur', () => {
    localStorage.setItem(STORAGE_KEY, serverInput.value.trim());
  });

  const configCard = el('div', { class: 'card' },
    el('span', { class: 'card-label' }, 'Configuration'),
    el('label', {},
      'Agent Server URL',
      serverInput,
    ),
    el('p', { class: 'hint' }, 'Run the local server, expose it with ngrok, and paste the HTTPS URL here.'),
  );

  // ── Main form card ──
  const figmaInput = el('textarea', {
    placeholder: 'https://www.figma.com/design/...',
  });

  const errorMsg = el('div', { class: 'error-msg' });

  const runBtn = el('button', { class: 'btn', type: 'button' }, 'Vibe Code →');

  const formCard = el('div', { class: 'card' },
    el('span', { class: 'card-label' }, 'Design Source'),
    el('label', {},
      'Figma URL',
      figmaInput,
    ),
    el('p', { class: 'hint' }, 'Paste any figma.com/design/* or figma.com/file/* URL.'),
    errorMsg,
    runBtn,
  );

  // ── Status card ──
  const spinner = el('div', { class: 'spinner' });
  const stageLabel = el('span', { class: 'status-stage' }, 'Starting…');
  const stageSub = el('span', { class: 'status-sub' }, '');

  const stageDots = STAGES.map((s) => el('span', { class: 'stage-dot', 'data-id': s.id }, s.label));

  const statusPanel = el('div', { class: 'card status-panel' },
    el('div', { class: 'status-body' },
      spinner,
      el('div', { class: 'status-text' }, stageLabel, stageSub),
    ),
    el('div', { class: 'stages' }, ...stageDots),
  );

  // ── Result card ──
  const resultIcon = el('span', { class: 'result-icon' }, '✓');
  const resultLink = el('a', { class: 'result-url', target: '_blank', rel: 'noopener' }, '');
  const startOverBtn = el('button', { class: 'btn btn-ghost', type: 'button' }, 'Start over');
  const openBtn = el('button', { class: 'btn', type: 'button' }, 'Open preview');

  const resultPanel = el('div', { class: 'card result-panel' },
    el('div', { class: 'status-body' },
      resultIcon,
      el('div', { class: 'status-text' },
        el('span', { class: 'status-stage' }, 'Page published!'),
        el('span', { class: 'status-sub' }, 'Your DA page is live.'),
      ),
    ),
    resultLink,
    el('div', { class: 'result-actions' }, openBtn, startOverBtn),
  );

  const app = el('div', { class: 'app' },
    el('div', { class: 'header' },
      el('h1', {}, 'Figma → DA Prototyper'),
      el('p', {}, 'Turn a Figma design into a live DA page using the Claude Agent SDK.'),
    ),
    configCard,
    formCard,
    statusPanel,
    resultPanel,
  );

  document.body.append(app);

  // ── State helpers ──
  function showError(msg) {
    errorMsg.textContent = msg;
    errorMsg.classList.add('visible');
  }

  function clearError() {
    errorMsg.textContent = '';
    errorMsg.classList.remove('visible');
  }

  function setStage(index) {
    stageDots.forEach((dot, i) => {
      dot.className = 'stage-dot';
      if (i < index) dot.classList.add('done');
      else if (i === index) dot.classList.add('active');
    });
    if (index < STAGES.length) {
      stageLabel.textContent = STAGES[index].label + '…';
      stageSub.textContent = `Step ${index + 1} of ${STAGES.length}`;
    }
  }

  function showStatus() {
    formCard.style.opacity = '0.5';
    runBtn.disabled = true;
    statusPanel.classList.add('visible');
    resultPanel.classList.remove('visible');
    setStage(0);
  }

  function showResult(value) {
    statusPanel.classList.remove('visible');
    resultPanel.classList.add('visible');
    formCard.style.opacity = '1';
    stageDots.forEach((d) => d.classList.replace('active', 'done'));
    const isUrl = value && value.startsWith('http');
    resultLink.textContent = value || '(no URL returned)';
    if (isUrl) {
      resultLink.href = value;
      openBtn.style.display = '';
      openBtn.onclick = () => window.open(value, '_blank', 'noopener');
    } else {
      resultLink.removeAttribute('href');
      openBtn.style.display = 'none';
    }
  }

  function resetForm() {
    figmaInput.value = '';
    runBtn.disabled = false;
    formCard.style.opacity = '1';
    statusPanel.classList.remove('visible');
    resultPanel.classList.remove('visible');
    stageDots.forEach((d) => { d.className = 'stage-dot'; });
    clearError();
  }

  startOverBtn.addEventListener('click', resetForm);

  // ── Polling ──
  async function pollJob(serverUrl, jobId) {
    const stageCheckpoints = [0.2, 0.5, 0.75, 0.95];
    let elapsed = 0;

    return new Promise((resolve, reject) => {
      const interval = setInterval(async () => {
        elapsed += POLL_INTERVAL;
        try {
          const res = await fetch(`${serverUrl}/jobs/${jobId}`);
          if (!res.ok) throw new Error(`Server error ${res.status}`);
          const job = await res.json();

          // Advance stage dots heuristically based on elapsed time
          const totalExpected = 90000;
          const progress = Math.min(elapsed / totalExpected, 0.99);
          const stageIdx = stageCheckpoints.findIndex((t) => progress < t);
          setStage(stageIdx === -1 ? STAGES.length - 1 : stageIdx);

          if (job.status === 'done') {
            clearInterval(interval);
            resolve(job.previewUrl || job.summary || '(Agent finished — check server logs)');
          } else if (job.status === 'error') {
            clearInterval(interval);
            reject(new Error(job.error || 'Agent job failed.'));
          }
        } catch (e) {
          clearInterval(interval);
          reject(e);
        }
      }, POLL_INTERVAL);
    });
  }

  // ── Run handler ──
  runBtn.addEventListener('click', async () => {
    clearError();

    const figmaUrl = figmaInput.value.trim();
    const serverUrl = serverInput.value.trim();

    if (!figmaUrl || !figmaUrl.includes('figma.com')) {
      showError('Please enter a valid Figma URL (figma.com/design/… or figma.com/file/…).');
      return;
    }
    if (!serverUrl) {
      showError('Please enter your agent server URL (the ngrok HTTPS URL).');
      return;
    }

    localStorage.setItem(STORAGE_KEY, serverUrl);
    showStatus();

    try {
      const res = await fetch(`${serverUrl}/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ figmaUrl, daContext: { ...context, token, username } }),
      });

      if (!res.ok) throw new Error(`Failed to start job (HTTP ${res.status})`);
      const { jobId } = await res.json();
      const previewUrl = await pollJob(serverUrl, jobId);
      showResult(previewUrl);
    } catch (e) {
      statusPanel.classList.remove('visible');
      formCard.style.opacity = '1';
      runBtn.disabled = false;
      showError(e.message);
    }
  });
}

(async function init() {
  const { context, token } = await DA_SDK;
  let username = 'anonymous';
  try {
    const profile = await window.adobeIMS?.getProfile();
    username = profile?.email?.split('@')[0] || profile?.displayName || 'anonymous';
  } catch (e) { /* IMS not available */ }
  buildUI(context, token, username);
}());
