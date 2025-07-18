// Get DOM elements
const elements = {
  threshold: document.getElementById('threshold'),
  thresholdValue: document.getElementById('threshold-value'),
  hideMode: document.getElementById('hide-mode'),
  fadeOpacityRow: document.getElementById('fade-opacity-row'),
  fadeOpacity: document.getElementById('fade-opacity'),
  fadeOpacityValue: document.getElementById('fade-opacity-value'),
  showBadge: document.getElementById('show-badge'),
  saveButton: document.getElementById('save-options'),
  resetButton: document.getElementById('reset-options'),
  status: document.getElementById('status')
};

// Default settings
const defaultSettings = {
  threshold: 90,
  hideMode: 'hide',
  fadeOpacity: 50,
  showBadge: true
};

// Load settings
async function loadSettings() {
  const settings = await chrome.storage.sync.get(Object.keys(defaultSettings));
  
  // Apply settings to UI
  elements.threshold.value = settings.threshold ?? defaultSettings.threshold;
  elements.thresholdValue.textContent = (settings.threshold ?? defaultSettings.threshold) + '%';
  elements.hideMode.value = settings.hideMode ?? defaultSettings.hideMode;
  elements.fadeOpacity.value = settings.fadeOpacity ?? defaultSettings.fadeOpacity;
  elements.fadeOpacityValue.textContent = (settings.fadeOpacity ?? defaultSettings.fadeOpacity) + '%';
  elements.showBadge.checked = settings.showBadge ?? defaultSettings.showBadge;
  
  // Show/hide fade opacity based on hide mode
  updateFadeOpacityVisibility();
}

// Update fade opacity visibility
function updateFadeOpacityVisibility() {
  if (elements.hideMode.value === 'fade') {
    elements.fadeOpacityRow.style.display = 'flex';
  } else {
    elements.fadeOpacityRow.style.display = 'none';
  }
}

// Update range value displays
elements.threshold.addEventListener('input', (e) => {
  elements.thresholdValue.textContent = e.target.value + '%';
});

elements.fadeOpacity.addEventListener('input', (e) => {
  elements.fadeOpacityValue.textContent = e.target.value + '%';
});

// Update fade opacity visibility on hide mode change
elements.hideMode.addEventListener('change', updateFadeOpacityVisibility);

// Save settings
elements.saveButton.addEventListener('click', async () => {
  const settings = {
    threshold: parseInt(elements.threshold.value),
    hideMode: elements.hideMode.value,
    fadeOpacity: parseInt(elements.fadeOpacity.value),
    showBadge: elements.showBadge.checked
  };
  
  await chrome.storage.sync.set(settings);
  
  // Notify content scripts
  const tabs = await chrome.tabs.query({ url: ['*://*.youtube.com/*'] });
  tabs.forEach(tab => {
    chrome.tabs.sendMessage(tab.id, { action: 'settingsUpdated', settings });
  });
  
  showStatus('Settings saved successfully!');
});

// Reset to defaults
elements.resetButton.addEventListener('click', async () => {
  if (!confirm('This will reset all settings to their default values. Continue?')) {
    return;
  }
  
  await chrome.storage.sync.set(defaultSettings);
  await loadSettings();
  
  // Notify content scripts
  const tabs = await chrome.tabs.query({ url: ['*://*.youtube.com/*'] });
  tabs.forEach(tab => {
    chrome.tabs.sendMessage(tab.id, { action: 'settingsUpdated', settings: defaultSettings });
  });
  
  showStatus('Settings reset to defaults!');
});

// Show status message
function showStatus(message) {
  elements.status.textContent = message;
  elements.status.classList.add('show');
  
  setTimeout(() => {
    elements.status.classList.remove('show');
  }, 3000);
}

// Initialize on load
loadSettings();