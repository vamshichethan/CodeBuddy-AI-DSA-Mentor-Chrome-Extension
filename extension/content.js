// ====================================================
// CodeBuddy AI — Content Script
// Runs on LeetCode problem pages
// Scrapes: problem title, description, constraints,
//          examples, user code, and submission verdict
// ====================================================

const CodeBuddy = {
  problemData: {},

  // Extract problem title from the page
  getTitle() {
    const selectors = [
      '[data-cy="question-title"]',
      '.mr-2.text-label-1',
      'div[class*="title"]',
      'h1',
    ];
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (el && el.innerText.trim()) return el.innerText.trim();
    }
    // Fallback: extract from URL
    const match = window.location.pathname.match(/\/problems\/([^/]+)/);
    return match ? match[1].replace(/-/g, ' ') : 'Unknown Problem';
  },

  // Extract full problem description
  getDescription() {
    const selectors = [
      '[data-track-load="description_content"]',
      '.elfjS',
      '[class*="description"]',
      '.content__u3I1',
    ];
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (el && el.innerText.trim().length > 50) return el.innerText.trim();
    }
    return '';
  },

  // Get the user's current code from Monaco editor
  getUserCode() {
    // Method 1: Monaco editor lines
    const lines = document.querySelectorAll('.view-line');
    if (lines.length > 0) {
      return Array.from(lines)
        .map((l) => l.innerText)
        .join('\n')
        .trim();
    }

    // Method 2: CodeMirror
    const cm = document.querySelector('.CodeMirror');
    if (cm && cm.CodeMirror) {
      return cm.CodeMirror.getValue();
    }

    // Method 3: textarea fallback
    const textarea = document.querySelector('textarea.inputarea');
    if (textarea) return textarea.value;

    return '';
  },

  // Get selected language
  getLanguage() {
    const selectors = [
      '[data-cy="lang-select"] button',
      'button[id*="headlessui"]',
      '.ant-select-selection-item',
    ];
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (el && el.innerText.trim()) return el.innerText.trim();
    }
    return 'Unknown';
  },

  // Get difficulty level
  getDifficulty() {
    const selectors = [
      '[diff]',
      'span.text-difficulty-easy',
      'span.text-difficulty-medium',
      'span.text-difficulty-hard',
      '[class*="difficulty"]',
    ];
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (el && el.innerText.trim()) return el.innerText.trim();
    }
    return 'Unknown';
  },

  // Collect all problem data into one object
  collectData() {
    return {
      title: this.getTitle(),
      description: this.getDescription(),
      userCode: this.getUserCode(),
      language: this.getLanguage(),
      difficulty: this.getDifficulty(),
      url: window.location.href,
      timestamp: Date.now(),
    };
  },
};

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getProblemData') {
    const data = CodeBuddy.collectData();
    sendResponse({ success: true, data });
  }

  if (request.action === 'ping') {
    sendResponse({ success: true, onLeetCode: true });
  }

  return true; // Keep message channel open for async
});

// Notify background that we're on a LeetCode problem page
chrome.runtime.sendMessage({ action: 'onLeetCodeProblem', url: window.location.href });

console.log('[CodeBuddy AI] Content script loaded on:', window.location.href);
