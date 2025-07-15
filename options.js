// Get DOM elements
const elements = {
  threshold: document.getElementById('threshold'),
  thresholdValue: document.getElementById('threshold-value'),
  hideMode: document.getElementById('hide-mode'),
  hideRegularVideos: document.getElementById('hide-regular-videos'),
  hideShorts: document.getElementById('hide-shorts'),
  hideLiveStreams: document.getElementById('hide-live-streams'),
  maxStoredVideos: document.getElementById('max-stored-videos'),
  maxVideosValue: document.getElementById('max-videos-value'),
  watchedCount: document.getElementById('watched-count'),
  storageUsed: document.getElementById('storage-used'),
  saveButton: document.getElementById('save-options'),
  exportButton: document.getElementById('export-data'),
  importButton: document.getElementById('import-data'),
  resetButton: document.getElementById('reset-options'),
  importFile: document.getElementById('import-file'),
  status: document.getElementById('status')
};

// Default settings
const defaultSettings = {
  threshold: 90,
  hideMode: 'hide',
  hideRegularVideos: true,
  hideShorts: true,
  hideLiveStreams: true,
  maxStoredVideos: 5000
};

// Load settings
async function loadSettings() {
  const settings = await chrome.storage.sync.get(Object.keys(defaultSettings).concat(['watchedVideos']));
  
  // Apply settings to UI
  elements.threshold.value = settings.threshold ?? defaultSettings.threshold;
  elements.thresholdValue.textContent = (settings.threshold ?? defaultSettings.threshold) + '%';
  elements.hideMode.value = settings.hideMode ?? defaultSettings.hideMode;
  elements.hideRegularVideos.checked = settings.hideRegularVideos ?? defaultSettings.hideRegularVideos;
  elements.hideShorts.checked = settings.hideShorts ?? defaultSettings.hideShorts;
  elements.hideLiveStreams.checked = settings.hideLiveStreams ?? defaultSettings.hideLiveStreams;
  elements.maxStoredVideos.value = settings.maxStoredVideos ?? defaultSettings.maxStoredVideos;
  elements.maxVideosValue.textContent = settings.maxStoredVideos ?? defaultSettings.maxStoredVideos;
  
  // Update stats
  if (settings.watchedVideos) {
    elements.watchedCount.textContent = settings.watchedVideos.length;
    const storageSize = JSON.stringify(settings.watchedVideos).length;
    elements.storageUsed.textContent = (storageSize / 1024).toFixed(2) + ' KB';
  }
}

// Update range displays
elements.threshold.addEventListener('input', (e) => {
  elements.thresholdValue.textContent = e.target.value + '%';
});

elements.maxStoredVideos.addEventListener('input', (e) => {
  elements.maxVideosValue.textContent = e.target.value;
});

// Save settings
elements.saveButton.addEventListener('click', async () => {
  const settings = {
    threshold: parseInt(elements.threshold.value),
    hideMode: elements.hideMode.value,
    hideRegularVideos: elements.hideRegularVideos.checked,
    hideShorts: elements.hideShorts.checked,
    hideLiveStreams: elements.hideLiveStreams.checked,
    maxStoredVideos: parseInt(elements.maxStoredVideos.value)
  };
  
  await chrome.storage.sync.set(settings);
  
  // Notify content scripts
  const tabs = await chrome.tabs.query({ url: ['*://www.youtube.com/*', '*://youtube.com/*'] });
  tabs.forEach(tab => {
    chrome.tabs.sendMessage(tab.id, { action: 'updateSettings' });
  });
  
  showStatus('Settings saved successfully!');
});

// Export data
elements.exportButton.addEventListener('click', async () => {
  const data = await chrome.storage.sync.get(null);
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'youtube-watched-videos-export.json';
  a.click();
  URL.revokeObjectURL(url);
  showStatus('Data exported successfully!');
});

// Import data
elements.importButton.addEventListener('click', () => {
  elements.importFile.click();
});

elements.importFile.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  
  try {
    const text = await file.text();
    const data = JSON.parse(text);
    
    // Validate data
    if (typeof data !== 'object') {
      throw new Error('Invalid data format');
    }
    
    await chrome.storage.sync.set(data);
    await loadSettings();
    showStatus('Data imported successfully!');
    
    // Reload YouTube tabs
    const tabs = await chrome.tabs.query({ url: ['*://www.youtube.com/*', '*://youtube.com/*'] });
    tabs.forEach(tab => {
      chrome.tabs.reload(tab.id);
    });
  } catch (error) {
    showStatus('Error importing data: ' + error.message, true);
  }
  
  // Reset file input
  e.target.value = '';
});

// Reset to defaults
elements.resetButton.addEventListener('click', async () => {
  if (confirm('Are you sure you want to reset all settings to defaults? This will not clear watched videos.')) {
    await chrome.storage.sync.set(defaultSettings);
    await loadSettings();
    showStatus('Settings reset to defaults!');
    
    // Notify content scripts
    const tabs = await chrome.tabs.query({ url: ['*://www.youtube.com/*', '*://youtube.com/*'] });
    tabs.forEach(tab => {
      chrome.tabs.sendMessage(tab.id, { action: 'updateSettings' });
    });
  }
});

// Show status message
function showStatus(message, isError = false) {
  elements.status.textContent = message;
  elements.status.style.backgroundColor = isError ? '#f44336' : '#4caf50';
  elements.status.classList.add('show');
  
  setTimeout(() => {
    elements.status.classList.remove('show');
  }, 3000);
}

// Initialize
loadSettings();