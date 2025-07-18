// Get DOM elements
const thresholdSlider = document.getElementById('threshold');
const thresholdValue = document.getElementById('threshold-value');
const clearDataButton = document.getElementById('clear-data');
const openOptionsButton = document.getElementById('open-options');
const statusDiv = document.getElementById('status');
const watchedCountSpan = document.getElementById('watched-count');
const hiddenCountSpan = document.getElementById('hidden-count');
const powerButton = document.getElementById('power-button');
const mainContent = document.getElementById('main-content');

let extensionEnabled = true;

// Load current settings
async function loadSettings() {
  const result = await chrome.storage.sync.get(['threshold', 'watchedVideos', 'extensionEnabled']);
  
  if (result.threshold !== undefined) {
    thresholdSlider.value = result.threshold;
    thresholdValue.textContent = result.threshold + '%';
  }
  
  if (result.extensionEnabled !== undefined) {
    extensionEnabled = result.extensionEnabled;
  } else {
    extensionEnabled = true; // Default to enabled
  }
  updatePowerButton();
  
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

// Update power button state
function updatePowerButton() {
  if (extensionEnabled) {
    powerButton.classList.add('active');
    mainContent.classList.remove('disabled-content');
  } else {
    powerButton.classList.remove('active');
    mainContent.classList.add('disabled-content');
  }
}

// Power button toggle
powerButton.addEventListener('click', async () => {
  extensionEnabled = !extensionEnabled;
  updatePowerButton();
  
  await chrome.storage.sync.set({ extensionEnabled: extensionEnabled });
  
  // Notify content scripts
  const tabs = await chrome.tabs.query({ url: ['*://www.youtube.com/*', '*://youtube.com/*'] });
  tabs.forEach(tab => {
    chrome.tabs.sendMessage(tab.id, { 
      action: 'toggleExtension', 
      enabled: extensionEnabled 
    }, (response) => {
      if (chrome.runtime.lastError) {
        console.log('Tab communication error:', chrome.runtime.lastError);
      }
    });
  });
  
  showStatus(extensionEnabled ? 'Extension enabled' : 'Extension disabled');
});

// Update threshold display and save immediately
thresholdSlider.addEventListener('input', async (e) => {
  const threshold = parseInt(e.target.value);
  thresholdValue.textContent = threshold + '%';
  
  // Save threshold immediately
  await chrome.storage.sync.set({ threshold: threshold });
  
  // Send update to all YouTube tabs
  const tabs = await chrome.tabs.query({ url: ['*://www.youtube.com/*', '*://youtube.com/*'] });
  tabs.forEach(tab => {
    chrome.tabs.sendMessage(tab.id, { 
      action: 'settingsUpdated',
      settings: { threshold: threshold }
    }, (response) => {
      if (chrome.runtime.lastError) {
        console.log('Tab communication error:', chrome.runtime.lastError);
      }
    });
  });
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