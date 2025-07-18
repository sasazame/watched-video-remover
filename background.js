// Initialize extension on install
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // Set default values
    chrome.storage.sync.set({
      threshold: 90,
      watchedVideos: [],
      hideMode: 'hide', // 'hide' or 'fade'
      showStats: true,
      extensionEnabled: true
    });
  }
});

// Handle storage quota exceeded
chrome.storage.sync.onChanged.addListener((changes, area) => {
  if (area === 'sync' && chrome.runtime.lastError) {
    if (chrome.runtime.lastError.message.includes('QUOTA_BYTES')) {
      // Clean up old watched videos
      chrome.storage.sync.get(['watchedVideos'], (result) => {
        if (result.watchedVideos && result.watchedVideos.length > 1000) {
          // Keep only the last 1000 videos
          const recentVideos = result.watchedVideos.slice(-1000);
          chrome.storage.sync.set({ watchedVideos: recentVideos });
        }
      });
    }
  }
});


// Clean up storage periodically
function cleanupStorage() {
  chrome.storage.sync.get(['watchedVideos'], (result) => {
    if (result.watchedVideos && result.watchedVideos.length > 5000) {
      // Keep only the last 3000 videos
      const recentVideos = result.watchedVideos.slice(-3000);
      chrome.storage.sync.set({ watchedVideos: recentVideos });
    }
  });
}

// Run cleanup every 24 hours
setInterval(cleanupStorage, 24 * 60 * 60 * 1000);

// Handle messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getSettings') {
    chrome.storage.sync.get(['threshold', 'watchedVideos', 'hideMode'], (result) => {
      sendResponse(result);
    });
    return true; // Will respond asynchronously
  } else if (request.action === 'updateBadge') {
    // Check if badge display is enabled
    chrome.storage.sync.get(['showBadge'], (result) => {
      const showBadge = result.showBadge !== false; // Default to true
      
      if (sender.tab && sender.tab.id) {
        const badgeText = showBadge && request.count > 0 ? String(request.count) : '';
        chrome.action.setBadgeText({
          text: badgeText,
          tabId: sender.tab.id
        });
        if (showBadge) {
          chrome.action.setBadgeBackgroundColor({
            color: '#FF0000',
            tabId: sender.tab.id
          });
        }
      }
    });
  }
});

// Clear badge when tab is updated or closed
chrome.tabs.onRemoved.addListener((tabId) => {
  chrome.action.setBadgeText({ text: '', tabId: tabId });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url && tab.url && !tab.url.includes('youtube.com')) {
    // Clear badge when navigating away from YouTube
    chrome.action.setBadgeText({ text: '', tabId: tabId });
  }
});

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    cleanupStorage
  };
}