// ====================================================
// CodeBuddy AI — Background Service Worker
// Handles: extension state, tab tracking, messaging
// ====================================================

const State = {
  activeLeetCodeTabs: new Set(),
  hintLevels: {}, // tabId -> current hint level
};

// Track LeetCode tabs
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url?.includes('leetcode.com/problems/')) {
    State.activeLeetCodeTabs.add(tabId);
    // Reset hint level for this problem
    State.hintLevels[tabId] = 0;
    chrome.action.setBadgeText({ text: '✓', tabId });
    chrome.action.setBadgeBackgroundColor({ color: '#6C63FF', tabId });
  }
});

chrome.tabs.onRemoved.addListener((tabId) => {
  State.activeLeetCodeTabs.delete(tabId);
  delete State.hintLevels[tabId];
});

// Handle messages from popup and content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'onLeetCodeProblem') {
    const tabId = sender.tab?.id;
    if (tabId) {
      State.activeLeetCodeTabs.add(tabId);
      State.hintLevels[tabId] = 0;
    }
    sendResponse({ success: true });
  }

  if (request.action === 'getHintLevel') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0]?.id;
      sendResponse({ level: State.hintLevels[tabId] || 0 });
    });
    return true;
  }

  if (request.action === 'incrementHintLevel') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0]?.id;
      if (tabId) {
        State.hintLevels[tabId] = Math.min((State.hintLevels[tabId] || 0) + 1, 5);
        sendResponse({ level: State.hintLevels[tabId] });
      }
    });
    return true;
  }

  if (request.action === 'resetHintLevel') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0]?.id;
      if (tabId) State.hintLevels[tabId] = 0;
      sendResponse({ success: true });
    });
    return true;
  }

  return true;
});

console.log('[CodeBuddy AI] Background service worker started.');
