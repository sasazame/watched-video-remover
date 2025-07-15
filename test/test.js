describe('YouTube Watched Video Remover', () => {
  
  beforeEach(async () => {
    // Clear storage before each test
    await chrome.storage.sync.clear();
    // Reset settings to defaults
    settings = {
      threshold: 90,
      hideMode: 'hide',
      hideRegularVideos: true,
      hideShorts: true,
      hideLiveStreams: true,
      maxStoredVideos: 5000
    };
    watchedVideos = new Set();
  });
  
  describe('Settings Management', () => {
    it('should load default settings', async () => {
      await loadSettings();
      expect(settings.threshold).to.equal(90);
      expect(settings.hideMode).to.equal('hide');
    });
    
    it('should load saved settings from storage', async () => {
      await chrome.storage.sync.set({
        threshold: 75,
        hideMode: 'fade'
      });
      
      await loadSettings();
      expect(settings.threshold).to.equal(75);
      expect(settings.hideMode).to.equal('fade');
    });
    
    it('should load watched videos from storage', async () => {
      const testVideos = ['video1', 'video2', 'video3'];
      await chrome.storage.sync.set({ watchedVideos: testVideos });
      
      await loadSettings();
      expect(watchedVideos.size).to.equal(3);
      expect(watchedVideos.has('video1')).to.be.true;
      expect(watchedVideos.has('video2')).to.be.true;
      expect(watchedVideos.has('video3')).to.be.true;
    });
  });
  
  describe('Video ID Extraction', () => {
    it('should extract video ID from regular YouTube URL', () => {
      const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
      const videoId = extractVideoId(url);
      expect(videoId).to.equal('dQw4w9WgXcQ');
    });
    
    it('should extract video ID from URL with timestamp', () => {
      const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=42s';
      const videoId = extractVideoId(url);
      expect(videoId).to.equal('dQw4w9WgXcQ');
    });
    
    it('should return null for invalid URL', () => {
      const url = 'https://www.youtube.com/';
      const videoId = extractVideoId(url);
      expect(videoId).to.be.null;
    });
  });
  
  describe('Progress Detection', () => {
    it('should detect watched video based on progress', () => {
      const progressElement = { style: { width: '95%' } };
      expect(isVideoWatched(progressElement)).to.be.true;
    });
    
    it('should not detect video as watched if below threshold', () => {
      const progressElement = { style: { width: '50%' } };
      expect(isVideoWatched(progressElement)).to.be.false;
    });
    
    it('should respect custom threshold', () => {
      settings.threshold = 70;
      const progressElement = { style: { width: '75%' } };
      expect(isVideoWatched(progressElement)).to.be.true;
    });
  });
  
  describe('Video Storage', () => {
    it('should save watched video ID', async () => {
      await saveWatchedVideo('testVideo123');
      expect(watchedVideos.has('testVideo123')).to.be.true;
      
      const stored = await chrome.storage.sync.get('watchedVideos');
      expect(stored.watchedVideos).to.include('testVideo123');
    });
    
    it('should enforce max stored videos limit', async () => {
      settings.maxStoredVideos = 3;
      
      await saveWatchedVideo('video1');
      await saveWatchedVideo('video2');
      await saveWatchedVideo('video3');
      await saveWatchedVideo('video4');
      
      expect(watchedVideos.size).to.equal(3);
      expect(watchedVideos.has('video1')).to.be.false;
      expect(watchedVideos.has('video4')).to.be.true;
    });
  });
  
  describe('Hide Functionality', () => {
    it('should hide video element in hide mode', () => {
      const element = document.createElement('div');
      settings.hideMode = 'hide';
      
      hideVideo(element);
      
      expect(element.style.display).to.equal('none');
      expect(element.getAttribute('data-hidden-by-extension')).to.equal('true');
    });
    
    it('should fade video element in fade mode', () => {
      const element = document.createElement('div');
      settings.hideMode = 'fade';
      
      hideVideo(element);
      
      expect(element.style.opacity).to.equal('0.5');
      expect(element.style.filter).to.equal('grayscale(0.5)');
      expect(element.getAttribute('data-hidden-by-extension')).to.equal('true');
    });
  });
  
  describe('Background Service Worker', () => {
    it('should clean up storage when limit exceeded', () => {
      // Mock storage with too many videos
      chrome.storage.sync.data.watchedVideos = new Array(6000).fill(0).map((_, i) => `video${i}`);
      
      cleanupStorage();
      
      // Wait for async operation
      setTimeout(() => {
        const videos = chrome.storage.sync.data.watchedVideos;
        expect(videos.length).to.equal(3000);
        expect(videos[0]).to.equal('video3000');
      }, 100);
    });
  });
});

// Run tests if opened directly
if (window.location.protocol === 'file:') {
  mocha.run();
}