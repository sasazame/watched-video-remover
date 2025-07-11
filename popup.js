// Get DOM elements
const thresholdSlider = document.getElementById('threshold');
const thresholdValue = document.getElementById('threshold-value');
const autoSkipCheckbox = document.getElementById('auto-skip');
const saveButton = document.getElementById('save-settings');
const clearDataButton = document.getElementById('clear-data');
const openOptionsButton = document.getElementById('open-options');
const statusDiv = document.getElementById('status');
const watchedCountSpan = document.getElementById('watched-count');
const hiddenCountSpan = document.getElementById('hidden-count');
const powerButton = document.getElementById('power-button');
const mainContent = document.getElementById('main-content');
const skippedList = document.getElementById('skipped-list');
const refreshSkippedButton = document.getElementById('refresh-skipped');

let extensionEnabled = true;

// Load current settings
async function loadSettings() {
  const result = await chrome.storage.sync.get(['threshold', 'autoSkipEnabled', 'watchedVideos', 'extensionEnabled']);
  
  if (result.threshold !== undefined) {
    thresholdSlider.value = result.threshold;
    thresholdValue.textContent = result.threshold + '%';
  }
  
  if (result.autoSkipEnabled !== undefined) {
    autoSkipCheckbox.checked = result.autoSkipEnabled;
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
  
  // Load skipped videos
  loadSkippedVideos();
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

// Update threshold display
thresholdSlider.addEventListener('input', (e) => {
  thresholdValue.textContent = e.target.value + '%';
  
  // Send pending threshold update to content script
  const tabs = chrome.tabs.query({ active: true, currentWindow: true });
  tabs.then(tabList => {
    if (tabList[0]?.url?.includes('youtube.com')) {
      chrome.tabs.sendMessage(tabList[0].id, { 
        action: 'updateSettings',
        threshold: parseInt(e.target.value)
      });
    }
  });
});

// Save settings
saveButton.addEventListener('click', async () => {
  const threshold = parseInt(thresholdSlider.value);
  const autoSkipEnabled = autoSkipCheckbox.checked;
  
  await chrome.storage.sync.set({
    threshold: threshold,
    autoSkipEnabled: autoSkipEnabled
  });
  
  // Apply settings without reload
  const tabs = await chrome.tabs.query({ url: ['*://www.youtube.com/*', '*://youtube.com/*'] });
  tabs.forEach(tab => {
    chrome.tabs.sendMessage(tab.id, { action: 'applySettings' }, (response) => {
      if (chrome.runtime.lastError) {
        console.log('Tab communication error:', chrome.runtime.lastError);
      }
    });
  });
  
  showStatus('Settings applied!');
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

// Load skipped videos
async function loadSkippedVideos() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tabs[0]?.url?.includes('youtube.com')) {
    try {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'getSkippedVideos' }, (response) => {
        if (chrome.runtime.lastError) {
          console.error('Error loading skipped videos:', chrome.runtime.lastError);
          skippedList.innerHTML = '<div style="color: #666; text-align: center;">No skipped videos yet</div>';
          return;
        }
        if (response && response.skippedVideos) {
          displaySkippedVideos(response.skippedVideos);
        } else {
          skippedList.innerHTML = '<div style="color: #666; text-align: center;">No skipped videos yet</div>';
        }
      });
    } catch (error) {
      console.error('Error:', error);
      skippedList.innerHTML = '<div style="color: #666; text-align: center;">No skipped videos yet</div>';
    }
  } else {
    skippedList.innerHTML = '<div style="color: #666; text-align: center;">Open YouTube to see skipped videos</div>';
  }
}

// Display skipped videos
function displaySkippedVideos(videos) {
  skippedList.innerHTML = '';
  
  if (videos.length === 0) {
    skippedList.innerHTML = '<div style="color: #666; text-align: center;">No skipped videos yet</div>';
    return;
  }
  
  // Show last 10 videos
  const recentVideos = videos.slice(-10).reverse();
  recentVideos.forEach(video => {
    const item = document.createElement('div');
    item.className = 'skipped-item';
    item.innerHTML = `
      <div style="font-weight: bold; margin-bottom: 2px;">${escapeHtml(video.title)}</div>
      <div style="color: #666; font-size: 11px;">${new Date(video.timestamp).toLocaleTimeString()}</div>
    `;
    item.addEventListener('click', () => {
      chrome.tabs.create({ url: `https://youtube.com/watch?v=${video.id}` });
    });
    skippedList.appendChild(item);
  });
}

// Refresh skipped videos
refreshSkippedButton.addEventListener('click', loadSkippedVideos);

// Escape HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

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