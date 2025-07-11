// Get DOM elements
const thresholdSlider = document.getElementById('threshold');
const thresholdValue = document.getElementById('threshold-value');
const autoSkipCheckbox = document.getElementById('auto-skip');
const saveButton = document.getElementById('save-settings');
const showHiddenButton = document.getElementById('show-hidden');
const clearDataButton = document.getElementById('clear-data');
const openOptionsButton = document.getElementById('open-options');
const statusDiv = document.getElementById('status');
const watchedCountSpan = document.getElementById('watched-count');
const hiddenCountSpan = document.getElementById('hidden-count');

// Load current settings
async function loadSettings() {
  const result = await chrome.storage.sync.get(['threshold', 'autoSkipEnabled', 'watchedVideos']);
  
  if (result.threshold !== undefined) {
    thresholdSlider.value = result.threshold;
    thresholdValue.textContent = result.threshold + '%';
  }
  
  if (result.autoSkipEnabled !== undefined) {
    autoSkipCheckbox.checked = result.autoSkipEnabled;
  }
  
  if (result.watchedVideos) {
    watchedCountSpan.textContent = result.watchedVideos.length;
  }
  
  // Get current hidden count from active tab
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tabs[0]) {
    chrome.action.getBadgeText({ tabId: tabs[0].id }, (text) => {
      hiddenCountSpan.textContent = text || '0';
    });
  }
}

// Update threshold display
thresholdSlider.addEventListener('input', (e) => {
  thresholdValue.textContent = e.target.value + '%';
});

// Save settings
saveButton.addEventListener('click', async () => {
  const threshold = parseInt(thresholdSlider.value);
  const autoSkipEnabled = autoSkipCheckbox.checked;
  
  await chrome.storage.sync.set({
    threshold: threshold,
    autoSkipEnabled: autoSkipEnabled
  });
  
  // Notify content script
  const tabs = await chrome.tabs.query({ url: ['*://www.youtube.com/*', '*://youtube.com/*'] });
  tabs.forEach(tab => {
    chrome.tabs.sendMessage(tab.id, { action: 'updateSettings' });
  });
  
  showStatus('Settings saved!');
  
  // Reload active YouTube tab
  const activeTabs = await chrome.tabs.query({ active: true, currentWindow: true });
  if (activeTabs[0]?.url?.includes('youtube.com')) {
    chrome.tabs.reload(activeTabs[0].id);
  }
});

// Show hidden videos
showHiddenButton.addEventListener('click', async () => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tabs[0]?.url?.includes('youtube.com')) {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'showHiddenVideos' });
    hiddenCountSpan.textContent = '0';
    showStatus('Hidden videos are now visible');
  } else {
    showStatus('Please open YouTube first');
  }
});

// Clear all data
clearDataButton.addEventListener('click', async () => {
  if (confirm('Are you sure you want to clear all watched video data?')) {
    await chrome.storage.sync.set({ watchedVideos: [] });
    watchedCountSpan.textContent = '0';
    hiddenCountSpan.textContent = '0';
    showStatus('All data cleared!');
    
    // Reload YouTube tabs
    const tabs = await chrome.tabs.query({ url: ['*://www.youtube.com/*', '*://youtube.com/*'] });
    tabs.forEach(tab => {
      chrome.tabs.reload(tab.id);
    });
  }
});

// Open options page
openOptionsButton.addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
});

// Show status message
function showStatus(message) {
  statusDiv.textContent = message;
  statusDiv.classList.add('show');
  setTimeout(() => {
    statusDiv.classList.remove('show');
  }, 3000);
}

// Initialize
loadSettings();