# YouTube Watched Video Hider

A Chrome extension that automatically hides watched videos from YouTube lists, helping you focus on unwatched content.

## 🎯 Purpose

This extension is designed with a **single, focused purpose**: to hide watched videos from YouTube video lists. It does **NOT**:
- ❌ Skip videos automatically
- ❌ Interfere with YouTube's autoplay functionality
- ❌ Modify playback behavior
- ❌ Navigate between videos automatically

The extension simply hides videos you've already watched from various YouTube pages, making it easier to find new content to watch.

## ✨ Features

- **Hide Watched Videos**: Automatically hides videos based on your configured watch percentage threshold
- **Customizable Threshold**: Set your own percentage (1-100%) to determine when a video is considered "watched"
- **Multiple Page Support**: Works on YouTube home, search results, subscriptions, and related videos
- **YouTube Shorts Support**: Can hide watched Shorts as well
- **Visual Options**: Choose between completely hiding videos or fading them out
- **ON/OFF Toggle**: Easily enable/disable the extension without removing it
- **Session Statistics**: Track how many videos are hidden in the current session
- **Data Management**: Export/import your settings and watched video data

## 📦 Installation

### From Chrome Web Store
(Coming soon)

### Manual Installation (Developer Mode)
1. Clone this repository or download as ZIP
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension directory
5. The extension icon will appear in your toolbar

## 🔧 Usage

1. Click the extension icon to open the popup
2. Use the power button to enable/disable the extension
3. Adjust the watched threshold slider (default: 90%)
4. Click "Save Settings" to apply changes
5. Access "Advanced Options" for more detailed settings

### Settings Explained

- **Watched Threshold**: Videos watched beyond this percentage will be hidden
- **Hide Mode**: 
  - "Completely Hide": Removes videos from the page layout
  - "Fade Out": Makes videos semi-transparent (50% opacity)
- **Content Types**: Toggle hiding for regular videos, Shorts, and live streams separately
- **Maximum Stored Videos**: Limits storage to prevent quota issues (default: 5000)

## 🏗️ Technical Details

- **Manifest Version**: V3 (latest Chrome extension standard)
- **Permissions Required**: 
  - `storage`: To save your preferences and watched video list
  - `tabs`: To detect YouTube tabs and apply settings
- **Host Permissions**: Only YouTube domains (`youtube.com` and `www.youtube.com`)

## 🔒 Privacy

This extension:
- ✅ Stores data locally in your browser only
- ✅ Does not collect or transmit any personal information
- ✅ Does not require any account or sign-in
- ✅ Works entirely offline after installation
- ✅ Open source - you can review all code

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting PRs.

### Development Setup

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Known Issues

- YouTube's dynamic content loading may occasionally require a page refresh for full effectiveness
- Grid layout on home page properly collapses when videos are hidden

## 📮 Support

If you encounter any issues or have suggestions:
1. Check the [Issues](https://github.com/yourusername/youtube-watched-video-hider/issues) page
2. Create a new issue with detailed information
3. Include your Chrome version and extension version

## 🙏 Acknowledgments

- Thanks to all contributors and users who provide feedback
- Built with Chrome Extension Manifest V3

---

**Remember**: This extension is purely for hiding watched videos from view. It does not and will not interfere with video playback, autoplay, or navigation features. For such functionality, please look for other extensions designed specifically for those purposes.