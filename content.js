let watchedVideos = new Set();
let pendingWatchedVideos = new Set(); // Buffer for batch saving
let hiddenVideoCount = 0; // Track hidden videos in current session
let saveTimeout = null; // Timeout for batch saving
const SAVE_DELAY = 5000; // Save every 5 seconds
let extensionEnabled = true; // Master ON/OFF switch
let pendingThreshold = null; // Pending threshold change
let settings = {
  threshold: 90,
  hideMode: 'hide',
  fadeOpacity: 50,
  maxStoredVideos: 5000
};

// Load settings and watched videos
async function loadSettings() {
  const result = await chrome.storage.sync.get([
    'threshold', 'watchedVideos', 'hideMode', 'fadeOpacity',
    'maxStoredVideos', 'extensionEnabled'
  ]);
  
  // Update settings
  Object.keys(settings).forEach(key => {
    if (result[key] !== undefined) {
      settings[key] = result[key];
    }
  });
  
  if (result.extensionEnabled !== undefined) {
    extensionEnabled = result.extensionEnabled;
  } else {
    extensionEnabled = true; // Default to enabled
  }
  
  if (result.watchedVideos) {
    watchedVideos = new Set(result.watchedVideos);
  }
}

// Queue video for batch saving
function queueWatchedVideo(videoId) {
  // Skip if already in watched videos
  if (watchedVideos.has(videoId)) return;
  
  pendingWatchedVideos.add(videoId);
  watchedVideos.add(videoId);
  
  // Clear existing timeout
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }
  
  // Set new timeout for batch save
  saveTimeout = setTimeout(async () => {
    await batchSaveWatchedVideos();
  }, SAVE_DELAY);
}

// Batch save watched videos
async function batchSaveWatchedVideos() {
  if (pendingWatchedVideos.size === 0) return;
  
  try {
    // Convert to array and add to existing watched videos
    const watchedArray = Array.from(watchedVideos);
    
    // Enforce max stored videos limit
    if (watchedArray.length > settings.maxStoredVideos) {
      // Remove oldest entries
      const toRemove = watchedArray.slice(0, watchedArray.length - settings.maxStoredVideos);
      toRemove.forEach(id => watchedVideos.delete(id));
    }
    
    // Save to storage
    await chrome.storage.sync.set({ watchedVideos: Array.from(watchedVideos) });
    
    // Clear pending videos
    pendingWatchedVideos.clear();
    saveTimeout = null;
  } catch (error) {
    console.error('Failed to save watched videos:', error);
    // Retry after a longer delay if quota exceeded
    if (error.message && error.message.includes('MAX_WRITE_OPERATIONS_PER_MINUTE')) {
      saveTimeout = setTimeout(async () => {
        await batchSaveWatchedVideos();
      }, 60000); // Retry after 1 minute
    }
  }
}

// Extract video ID from URL
function extractVideoId(url) {
  const match = url.match(/[?&]v=([^&]+)/);
  return match ? match[1] : null;
}

// Check if video is watched based on progress
function isVideoWatched(progressElement) {
  if (!progressElement) return false;
  const widthStr = progressElement.style.width;
  if (!widthStr) return false;
  
  // Parse percentage, handling both "100%" and "100" formats
  const percentage = parseFloat(widthStr.replace('%', ''));
  
  // Check if it's a valid number
  if (isNaN(percentage)) return false;
  
  return percentage >= settings.threshold;
}

// Update extension badge
function updateBadge() {
  try {
    chrome.runtime.sendMessage({
      action: 'updateBadge',
      count: hiddenVideoCount
    });
  } catch (error) {
    // Extension context might be invalidated
    console.warn('Failed to update badge:', error);
  }
}

// Hide video element
function hideVideo(videoElement) {
  // Skip if extension is disabled
  if (!extensionEnabled) return;
  
  // Check if already hidden
  if (videoElement.getAttribute('data-hidden-by-extension') === 'true') return;
  
  if (settings.hideMode === 'hide') {
    videoElement.classList.add('yt-watched-hidden');
  } else if (settings.hideMode === 'fade') {
    videoElement.classList.add('yt-watched-faded');
  }
  videoElement.setAttribute('data-hidden-by-extension', 'true');
  
  // Increment hidden count and update badge
  hiddenVideoCount++;
  updateBadge();
}

// Process video thumbnails
function processVideoThumbnails() {
  // Skip if extension is disabled
  if (!extensionEnabled) return;
  
  // Process all video thumbnails (regular videos, shorts, etc.)
  const thumbnails = document.querySelectorAll('ytd-thumbnail');
  
  thumbnails.forEach(thumbnail => {
    // Skip only if already processed AND hidden
    const alreadyHidden = thumbnail.closest('[data-hidden-by-extension="true"]');
    if (thumbnail.getAttribute('data-processed') === 'true' && alreadyHidden) return;
    thumbnail.setAttribute('data-processed', 'true');
    
    // Find progress bar
    const progressBar = thumbnail.querySelector('ytd-thumbnail-overlay-resume-playback-renderer #progress');
    if (!progressBar) return;
    
    // Check if watched
    if (isVideoWatched(progressBar)) {
      // Find the video ID
      const link = thumbnail.querySelector('a#thumbnail');
      if (link) {
        const videoId = extractVideoId(link.href);
        if (videoId) {
          queueWatchedVideo(videoId);
        }
      }
      
      // Find parent video renderer - prioritize the outermost container for grid layout
      let videoRenderer = null;
      
      // First, try to find the outermost container (ytd-rich-item-renderer) for home/trending pages
      const richItemRenderer = thumbnail.closest('ytd-rich-item-renderer');
      if (richItemRenderer) {
        videoRenderer = richItemRenderer;
      } else {
        // For other page types, find the appropriate container
        videoRenderer = thumbnail.closest('ytd-video-renderer, ytd-compact-video-renderer, ytd-grid-video-renderer, ytd-rich-grid-media');
      }
      
      // If still not found, try alternative methods
      if (!videoRenderer) {
        // Try to find the dismissible container
        const dismissible = thumbnail.closest('[id="dismissible"]');
        if (dismissible) {
          // Check for parent containers
          videoRenderer = dismissible.closest('ytd-rich-item-renderer') || 
                        dismissible.closest('ytd-rich-grid-media') ||
                        dismissible.closest('ytd-video-renderer');
        }
      }
      
      if (videoRenderer) {
        // Check if it's a live stream
        const isLive = videoRenderer.querySelector('ytd-badge-supported-renderer .badge-style-type-live-now, [aria-label*="LIVE"]');
        if (isLive) return; // Skip live streams
        
        hideVideo(videoRenderer);
      }
    }
  });
  
  // Process new YouTube structure (yt-lockup-view-model)
  const lockups = document.querySelectorAll('yt-lockup-view-model');
  
  lockups.forEach(lockup => {
    // Skip only if already processed AND hidden
    if (lockup.getAttribute('data-processed') === 'true' && lockup.getAttribute('data-hidden-by-extension') === 'true') return;
    lockup.setAttribute('data-processed', 'true');
    
    // Find progress bar in new structure
    const progressBar = lockup.querySelector('.ytThumbnailOverlayProgressBarHostWatchedProgressBarSegment');
    if (!progressBar) return;
    
    // Check if watched
    if (isVideoWatched(progressBar)) {
      // Find the video ID
      const link = lockup.querySelector('a[href*="/watch"]');
      if (link) {
        const videoId = extractVideoId(link.href);
        if (videoId) {
          queueWatchedVideo(videoId);
        }
      }
      
      // Hide the lockup element
      hideVideo(lockup);
    }
  });
}


// Check video player progress
function checkVideoPlayerProgress() {
  const video = document.querySelector('video');
  if (!video) return;
  
  const currentUrl = window.location.href;
  const videoId = extractVideoId(currentUrl);
  if (!videoId) return;
  
  const progress = (video.currentTime / video.duration) * 100;
  if (progress >= settings.threshold) {
    queueWatchedVideo(videoId);
  }
}

// Observe DOM changes
const observer = new MutationObserver(() => {
  processVideoThumbnails();
});

// Observe URL changes for single-page navigation
const urlObserver = new MutationObserver(() => {
  const newUrl = window.location.href;
  if (newUrl.includes('/watch')) {
    // Clear interval if exists and restart
    setInterval(checkVideoPlayerProgress, 5000);
  }
});

// Initialize
async function init() {
  await loadSettings();
  
  // Inject CSS for hiding videos
  injectStyles();
  
  // Initial processing only if enabled
  if (extensionEnabled) {
    processVideoThumbnails();
  }
  
  // Monitor video progress on watch pages
  if (window.location.href.includes('/watch')) {
    setInterval(checkVideoPlayerProgress, 5000);
  }
  
  // Start observing
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  urlObserver.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// Inject CSS styles
function injectStyles() {
  if (document.getElementById('yt-watched-remover-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'yt-watched-remover-styles';
  style.textContent = `
    /* Hide mode - completely remove from layout */
    .yt-watched-hidden {
      display: none !important;
    }
    
    /* Fade mode - dynamic opacity */
    .yt-watched-faded {
      opacity: ${settings.fadeOpacity / 100} !important;
      filter: grayscale(0.5) !important;
    }
    
    /* For grid items on home page - remove from grid flow */
    ytd-rich-item-renderer.yt-watched-hidden {
      display: none !important;
    }
    
    /* For subscription page - hide parent when child is hidden */
    ytd-rich-item-renderer:has(yt-lockup-view-model.yt-watched-hidden) {
      display: none !important;
    }
    
    /* Ensure grid reflows properly */
    ytd-rich-grid-row:has(ytd-rich-item-renderer.yt-watched-hidden) {
      display: flex !important;
      flex-wrap: wrap !important;
    }
  `;
  document.head.appendChild(style);
}

// Update styles when settings change
function updateStyles() {
  const style = document.getElementById('yt-watched-remover-styles');
  if (style) {
    style.textContent = `
      /* Hide mode - completely remove from layout */
      .yt-watched-hidden {
        display: none !important;
      }
      
      /* Fade mode - dynamic opacity */
      .yt-watched-faded {
        opacity: ${settings.fadeOpacity / 100} !important;
        filter: grayscale(0.5) !important;
      }
      
      /* For grid items on home page - remove from grid flow */
      ytd-rich-item-renderer.yt-watched-hidden {
        display: none !important;
      }
      
      /* For subscription page - hide parent when child is hidden */
      ytd-rich-item-renderer:has(yt-lockup-view-model.yt-watched-hidden) {
        display: none !important;
      }
      
      /* Ensure grid reflows properly */
      ytd-rich-grid-row:has(ytd-rich-item-renderer.yt-watched-hidden) {
        display: flex !important;
        flex-wrap: wrap !important;
      }
    `;
  }
}

// Listen for messages from popup/options
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'settingsUpdated') {
    // Update local settings
    if (request.settings) {
      Object.keys(request.settings).forEach(key => {
        if (settings.hasOwnProperty(key)) {
          settings[key] = request.settings[key];
        }
      });
      // Update styles if fade opacity changed
      updateStyles();
    }
    
    // Apply pending threshold if exists
    if (pendingThreshold !== null) {
      settings.threshold = pendingThreshold;
      pendingThreshold = null;
    }
    
    // Clear hidden videos and reprocess with a small delay to ensure stability
    document.querySelectorAll('[data-hidden-by-extension="true"]').forEach(element => {
      element.classList.remove('yt-watched-hidden', 'yt-watched-faded');
      element.removeAttribute('data-hidden-by-extension');
    });
    
    // Also clear the data-processed attribute to ensure reprocessing
    document.querySelectorAll('[data-processed="true"]').forEach(element => {
      element.removeAttribute('data-processed');
    });
    
    hiddenVideoCount = 0;
    updateBadge();
    
    // Add a small delay before reprocessing to ensure DOM stability
    setTimeout(() => {
      processVideoThumbnails();
    }, 100);
  } else if (request.action === 'toggleExtension') {
    extensionEnabled = request.enabled;
    
    if (extensionEnabled) {
      // Re-enable: clear processed flags and process videos
      document.querySelectorAll('[data-processed="true"]').forEach(element => {
        element.removeAttribute('data-processed');
      });
      
      // Process with a small delay
      setTimeout(() => {
        processVideoThumbnails();
      }, 100);
    } else {
      // Disable: show all hidden videos
      document.querySelectorAll('[data-hidden-by-extension="true"]').forEach(element => {
        element.classList.remove('yt-watched-hidden', 'yt-watched-faded');
        element.removeAttribute('data-hidden-by-extension');
      });
      hiddenVideoCount = 0;
      updateBadge();
    }
  } else if (request.action === 'getHiddenCount') {
    sendResponse({ count: hiddenVideoCount });
  } else if (request.action === 'showHiddenVideos') {
    // Temporarily show all hidden videos
    document.querySelectorAll('[data-hidden-by-extension="true"]').forEach(element => {
      element.classList.remove('yt-watched-hidden', 'yt-watched-faded');
      element.removeAttribute('data-hidden-by-extension');
    });
    hiddenVideoCount = 0;
    updateBadge();
    
    // Disable extension temporarily
    extensionEnabled = false;
  } else if (request.action === 'updateThreshold') {
    // Store pending threshold
    pendingThreshold = request.threshold;
  }
});

// Handle navigation within YouTube (single-page app)
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    // Clear hidden count when navigating
    hiddenVideoCount = 0;
    updateBadge();
    
    // Reprocess videos on new page
    if (extensionEnabled) {
      processVideoThumbnails();
    }
  }
}).observe(document, { subtree: true, childList: true });

// Clean up on unload
window.addEventListener('unload', async () => {
  // Save any pending videos
  if (pendingWatchedVideos.size > 0) {
    await batchSaveWatchedVideos();
  }
});

// Start the extension
init();