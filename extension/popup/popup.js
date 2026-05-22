// ====================================================
// CodeBuddy AI — Popup Script
// Handles: tab switching, API calls, UI state
// ====================================================

const DEFAULT_API_BASE = 'https://codebuddy-ai-dsa-mentor.vercel.app/api';
const DEFAULT_DASHBOARD_URL = 'https://codebuddy-ai-dsa-mentor.vercel.app';
const LOCAL_API_BASE = 'http://localhost:3001/api';
const LOCAL_DASHBOARD_URL = 'http://localhost:5173';
const CONNECTION_KEYS = ['apiBaseUrl', 'dashboardUrl', 'useLocalDev'];

// ── State ──────────────────────────────────────────
const state = {
  problemData: null,
  hintLevel: 0,
  hintsUsed: 0,
  interviewHistory: [],
  apiBaseUrl: DEFAULT_API_BASE,
  dashboardUrl: DEFAULT_DASHBOARD_URL,
};

// ── DOM Refs ───────────────────────────────────────
const $ = (id) => document.getElementById(id);

// ── Utility: Show Loading Overlay ─────────────────
function showLoading(text = 'Thinking…') {
  $('loadingText').textContent = text;
  $('loadingOverlay').classList.remove('hidden');
}
function hideLoading() {
  $('loadingOverlay').classList.add('hidden');
}

// ── Utility: Show Response Box ────────────────────
function showResponse(boxId, contentId, text) {
  $(boxId).classList.remove('hidden');
  $(contentId).innerHTML = formatResponse(text);
}

// Format raw text: bold **text**, code `code`, line breaks
function formatResponse(text) {
  return escapeHtml(String(text || ''))
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/❌/g, '<span class="tag-bug">❌</span>')
    .replace(/✅/g, '<span class="tag-ok">✅</span>')
    .replace(/⚠️/g, '<span class="tag-warn">⚠️</span>')
    .replace(/\n/g, '<br/>');
}

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function normalizeApiBase(value) {
  return (value || DEFAULT_API_BASE).trim().replace(/\/+$/, '');
}

function normalizeDashboardUrl(value) {
  return (value || DEFAULT_DASHBOARD_URL).trim().replace(/\/+$/, '');
}

function isLocalUrl(value) {
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i.test(value || '');
}

async function loadSettings() {
  return new Promise((resolve) => {
    chrome.storage.local.get(CONNECTION_KEYS, (res) => {
      const storedApiBaseUrl = normalizeApiBase(res.apiBaseUrl);
      const storedDashboardUrl = normalizeDashboardUrl(res.dashboardUrl);
      const shouldUseProduction = !res.useLocalDev && (isLocalUrl(storedApiBaseUrl) || isLocalUrl(storedDashboardUrl));

      state.apiBaseUrl = shouldUseProduction ? DEFAULT_API_BASE : storedApiBaseUrl;
      state.dashboardUrl = shouldUseProduction ? DEFAULT_DASHBOARD_URL : storedDashboardUrl;
      $('apiBaseInput').value = state.apiBaseUrl;
      $('dashboardUrlInput').value = state.dashboardUrl;
      if (shouldUseProduction) {
        chrome.storage.local.set({
          apiBaseUrl: state.apiBaseUrl,
          dashboardUrl: state.dashboardUrl,
          useLocalDev: false,
        });
      }
      resolve();
    });
  });
}

// ── Utility: Call Backend API ─────────────────────
async function callAPI(endpoint, body) {
  // Append a cache-buster query parameter to bypass Chrome's CORS preflight cache
  const url = `${state.apiBaseUrl}/${endpoint}?t=${Date.now()}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

// ── Utility: Copy to Clipboard ────────────────────
function copyText(elementId) {
  const el = $(elementId);
  if (!el) return;
  const text = el.innerText;
  navigator.clipboard.writeText(text).then(() => {
    const btn = el.closest('.response-box')?.querySelector('.copy-btn');
    if (btn) { btn.textContent = 'Copied!'; setTimeout(() => btn.textContent = 'Copy', 1500); }
  });
}

// ── Tab Switching ──────────────────────────────────
document.querySelectorAll('.tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach((t) => t.classList.remove('active'));
    document.querySelectorAll('.panel').forEach((p) => {
      p.classList.add('hidden'); p.classList.remove('active');
    });
    tab.classList.add('active');
    const panel = $(`panel-${tab.dataset.tab}`);
    if (panel) { panel.classList.remove('hidden'); panel.classList.add('active'); }
  });
});

// ── Read Problem from LeetCode Tab ────────────────
async function readProblem() {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (!tab?.url?.includes('leetcode.com/problems/')) {
        resolve(null);
        return;
      }
      chrome.tabs.sendMessage(tab.id, { action: 'getProblemData' }, (response) => {
        if (chrome.runtime.lastError || !response?.success) { resolve(null); return; }
        resolve(response.data);
      });
    });
  });
}

// ── Initialise Popup ──────────────────────────────
async function init() {
  await loadSettings();
  const data = await readProblem();

  if (!data) {
    $('problemLoading').classList.add('hidden');
    $('notLeetCode').classList.remove('hidden');
    return;
  }

  state.problemData = data;

  // Update UI
  $('problemLoading').classList.add('hidden');
  $('problemInfo').classList.remove('hidden');
  $('problemTitle').textContent = data.title || 'Untitled Problem';
  $('langTag').textContent = data.language || 'Unknown';

  // Difficulty badge
  const badge = $('difficultyBadge');
  const diff = (data.difficulty || '').toLowerCase();
  badge.textContent = data.difficulty || '—';
  if (diff.includes('easy'))   badge.classList.add('easy');
  if (diff.includes('medium')) badge.classList.add('medium');
  if (diff.includes('hard'))   badge.classList.add('hard');

  // Restore hint level from storage
  chrome.storage.local.get([`hintLevel_${data.title}`], (res) => {
    state.hintLevel = res[`hintLevel_${data.title}`] || 0;
    state.hintsUsed = state.hintLevel;
    $('hintCount').textContent = state.hintsUsed;
    updateLevelButtons();
  });
}

$('settingsBtn').addEventListener('click', () => {
  $('settingsPanel').classList.toggle('hidden');
});

$('saveSettingsBtn').addEventListener('click', () => {
  state.apiBaseUrl = normalizeApiBase($('apiBaseInput').value);
  state.dashboardUrl = normalizeDashboardUrl($('dashboardUrlInput').value);
  chrome.storage.local.set({
    apiBaseUrl: state.apiBaseUrl,
    dashboardUrl: state.dashboardUrl,
    useLocalDev: isLocalUrl(state.apiBaseUrl) || isLocalUrl(state.dashboardUrl),
  }, () => showToast('Settings saved.'));
});

$('resetSettingsBtn').addEventListener('click', () => {
  chrome.storage.local.remove(CONNECTION_KEYS, () => {
    state.apiBaseUrl = LOCAL_API_BASE;
    state.dashboardUrl = LOCAL_DASHBOARD_URL;
    $('apiBaseInput').value = state.apiBaseUrl;
    $('dashboardUrlInput').value = state.dashboardUrl;
    chrome.storage.local.set({
      apiBaseUrl: state.apiBaseUrl,
      dashboardUrl: state.dashboardUrl,
      useLocalDev: true,
    }, () => showToast('Switched to local development URLs.'));
  });
});

// ── Level Button States ───────────────────────────
function updateLevelButtons() {
  document.querySelectorAll('.level-btn').forEach((btn) => {
    const lv = parseInt(btn.dataset.level);
    btn.classList.remove('active', 'locked');
    if (lv === state.hintLevel + 1) btn.classList.add('active');
    if (lv === 5 && state.hintsUsed < 3) btn.classList.add('locked');
  });
}

// ── Hint Level Buttons ────────────────────────────
document.querySelectorAll('.level-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const lv = parseInt(btn.dataset.level);
    if (btn.classList.contains('locked')) {
      showToast('Use at least 3 hints first to unlock the code!');
      return;
    }
    state.hintLevel = lv - 1;
    updateLevelButtons();
  });
});

// ── Get Hint ──────────────────────────────────────
$('getHintBtn').addEventListener('click', async () => {
  if (!state.problemData) return showToast('Open a LeetCode problem first!');

  const nextLevel = state.hintLevel + 1;
  if (nextLevel > 5) return showToast('You have received all 5 hints!');

  if (nextLevel === 5 && state.hintsUsed < 3) {
    return showToast('🔒 Use at least 3 hints before unlocking the full solution.');
  }

  showLoading(`Generating Level ${nextLevel} hint…`);
  try {
    const res = await callAPI('hint', {
      title: state.problemData.title,
      description: state.problemData.description,
      userCode: state.problemData.userCode,
      language: state.problemData.language,
      level: nextLevel,
    });

    state.hintLevel = nextLevel;
    state.hintsUsed = Math.max(state.hintsUsed, nextLevel);
    $('hintCount').textContent = state.hintsUsed;

    // Persist
    chrome.storage.local.set({ [`hintLevel_${state.problemData.title}`]: state.hintLevel });

    // Log to Dashboard Database
    logSession({ hintsUsed: state.hintsUsed, solved: false });

    $('hintLabel').textContent = `Level ${nextLevel} Hint`;
    showResponse('hintResponse', 'hintContent', res.hint || res.response || JSON.stringify(res));
    updateLevelButtons();
  } catch (e) {
    showToast(`Error: ${e.message}`);
  } finally {
    hideLoading();
  }
});

// ── Debug ─────────────────────────────────────────
$('debugBtn').addEventListener('click', async () => {
  if (!state.problemData) return showToast('Open a LeetCode problem first!');
  if (!state.problemData.userCode?.trim()) return showToast('No code detected in the editor!');

  showLoading('Analyzing your code…');
  try {
    const res = await callAPI('debug', {
      title: state.problemData.title,
      description: state.problemData.description,
      userCode: state.problemData.userCode,
      language: state.problemData.language,
    });

    // Log bug found to Dashboard Database
    logSession({ bugsFound: ["Logic Error"] });

    showResponse('debugResponse', 'debugContent', res.debug || res.response || JSON.stringify(res));
  } catch (e) {
    showToast(`Error: ${e.message}`);
  } finally {
    hideLoading();
  }
});

// ── Edge Cases ────────────────────────────────────
$('edgeCaseBtn').addEventListener('click', async () => {
  if (!state.problemData) return showToast('Open a LeetCode problem first!');

  showLoading('Generating edge cases…');
  try {
    const res = await callAPI('edgecase', {
      title: state.problemData.title,
      description: state.problemData.description,
      language: state.problemData.language,
    });
    showResponse('edgeCaseResponse', 'edgeCaseContent', res.edgeCases || res.response || JSON.stringify(res));
  } catch (e) {
    showToast(`Error: ${e.message}`);
  } finally {
    hideLoading();
  }
});

// ── Pattern Detection ─────────────────────────────
$('patternBtn').addEventListener('click', async () => {
  if (!state.problemData) return showToast('Open a LeetCode problem first!');

  showLoading('Detecting DSA pattern…');
  try {
    const res = await callAPI('pattern', {
      title: state.problemData.title,
      description: state.problemData.description,
    });

    // Log pattern to Dashboard Database
    logSession({ pattern: res.patternName || "Unknown" });

    showResponse('patternResponse', 'patternContent', res.pattern || res.response || JSON.stringify(res));
  } catch (e) {
    showToast(`Error: ${e.message}`);
  } finally {
    hideLoading();
  }
});

// ── Dry Run ───────────────────────────────────────
$('dryRunBtn').addEventListener('click', async () => {
  if (!state.problemData) return showToast('Open a LeetCode problem first!');

  showLoading('Generating dry run trace…');
  try {
    const res = await callAPI('dryrun', {
      title: state.problemData.title,
      description: state.problemData.description,
      userCode: state.problemData.userCode,
      language: state.problemData.language,
    });
    showResponse('dryRunResponse', 'dryRunContent', res.dryRun || res.response || JSON.stringify(res));
  } catch (e) {
    showToast(`Error: ${e.message}`);
  } finally {
    hideLoading();
  }
});

// ── Complexity Analysis ───────────────────────────
$('complexBtn').addEventListener('click', async () => {
  if (!state.problemData) return showToast('Open a LeetCode problem first!');
  if (!state.problemData.userCode?.trim()) return showToast('No code detected in the editor!');

  showLoading('Analyzing complexity…');
  try {
    const res = await callAPI('complexity', {
      title: state.problemData.title,
      description: state.problemData.description,
      userCode: state.problemData.userCode,
      language: state.problemData.language,
    });
    showResponse('complexResponse', 'complexContent', res.complexity || res.response || JSON.stringify(res));
  } catch (e) {
    showToast(`Error: ${e.message}`);
  } finally {
    hideLoading();
  }
});

// ── Interview Mode ────────────────────────────────
$('sendInterviewBtn').addEventListener('click', sendInterviewMessage);
$('interviewInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendInterviewMessage();
});

async function sendInterviewMessage() {
  const input = $('interviewInput');
  const userMsg = input.value.trim();
  if (!userMsg) return;
  if (!state.problemData) return showToast('Open a LeetCode problem first!');

  input.value = '';

  // Add user bubble
  appendChatBubble(userMsg, 'user');
  state.interviewHistory.push({ role: 'user', content: userMsg });

  showLoading('Interviewer is thinking…');
  try {
    const res = await callAPI('interview', {
      title: state.problemData.title,
      description: state.problemData.description,
      history: state.interviewHistory,
      userMessage: userMsg,
    });
    const aiMsg = res.response || res.message || 'Interesting approach! Tell me more.';
    state.interviewHistory.push({ role: 'assistant', content: aiMsg });
    appendChatBubble(aiMsg, 'ai');
  } catch (e) {
    appendChatBubble(`Sorry, something went wrong: ${e.message}`, 'ai');
  } finally {
    hideLoading();
  }
}

function appendChatBubble(text, role) {
  const chat = $('interviewChat');
  const bubble = document.createElement('div');
  bubble.className = `chat-bubble ${role === 'ai' ? 'ai-bubble' : 'user-bubble'}`;
  bubble.innerHTML = formatResponse(text);
  chat.appendChild(bubble);
  chat.scrollTop = chat.scrollHeight;
}

// ── Dashboard Logging ─────────────────────────────
async function logSession(updates = {}) {
  if (!state.problemData) return;
  try {
    await callAPI('progress', {
      userId: 'default_user', // Could be from Chrome Identity API
      title: state.problemData.title,
      language: state.problemData.language || 'Unknown',
      hintsUsed: state.hintsUsed,
      solved: updates.solved || false,
      pattern: updates.pattern,
      bugsFound: updates.bugsFound || []
    });
  } catch (err) {
    console.error('Failed to log session', err);
  }
}

// ── Copy Buttons ──────────────────────────────────
$('copyHint').addEventListener('click',    () => copyText('hintContent'));
$('copyDebug').addEventListener('click',   () => copyText('debugContent'));
$('copyPattern').addEventListener('click', () => copyText('patternContent'));
$('copyComplex').addEventListener('click', () => copyText('complexContent'));

// ── Footer Links ──────────────────────────────────
$('dashboardBtn').addEventListener('click', () => {
  chrome.tabs.create({ url: state.dashboardUrl });
});
$('notesBtn').addEventListener('click', () => {
  chrome.tabs.create({ url: `${state.dashboardUrl}/notes` });
});
$('roadmapBtn').addEventListener('click', () => {
  chrome.tabs.create({ url: `${state.dashboardUrl}/roadmap` });
});

// ── Toast Notification ────────────────────────────
function showToast(msg) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  toast.style.cssText = `
    position: fixed; bottom: 16px; left: 50%; transform: translateX(-50%);
    background: #1a1a2e; border: 1px solid rgba(108,99,255,0.4);
    color: #f0f0ff; font-size: 11px; padding: 8px 16px;
    border-radius: 20px; z-index: 999; white-space: nowrap;
    box-shadow: 0 4px 20px rgba(0,0,0,0.5);
    animation: fadeIn 0.2s ease;
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ── Boot ──────────────────────────────────────────
init();
