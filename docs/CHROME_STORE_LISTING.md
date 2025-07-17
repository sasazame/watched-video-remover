# Chrome Web Store Listing

## Short Description (132 characters max)
Hide watched videos from YouTube lists to focus on unwatched content. Simple, privacy-focused, no auto-skip features.

## Detailed Description

**Focus on What You Haven't Watched Yet!**

Watched Video Remover is a simple, privacy-focused extension that helps you discover new content by hiding videos you've already watched. Unlike other extensions, we focus on one thing only: cleaning up your video lists.

**What This Extension Does:**
✓ Hides watched videos from YouTube home, search, and recommendations
✓ Customizable watch threshold (1-100%)
✓ Works with regular videos and YouTube Shorts
✓ Choose between hiding completely or fading out
✓ Easy ON/OFF toggle
✓ Tracks session statistics
✓ Export/import your data

**What This Extension Does NOT Do:**
✗ No auto-skip functionality
✗ No autoplay modifications
✗ No video navigation features
✗ No data collection or tracking
✗ No external server connections

**Privacy First:**
- All data stored locally in your browser
- No account required
- Works completely offline
- Open source on GitHub

**Perfect For:**
- Heavy YouTube users who want to see fresh content
- People who rewatch videos and want to hide them after
- Anyone tired of seeing the same watched videos repeatedly
- Users who value simplicity and privacy

**How It Works:**
1. Install the extension
2. Set your watched threshold (default 90%)
3. Browse YouTube normally
4. Watched videos automatically disappear from lists
5. Toggle ON/OFF anytime with one click

**Features:**
- Power button for quick enable/disable
- Threshold slider (1-100%)
- Hide or fade mode options
- Separate controls for videos, Shorts, and live streams
- Session statistics
- Advanced options for power users
- Data export/import

Simple. Focused. Private. Get back to discovering new content on YouTube!

## Category
Productivity

## Language
English

## Screenshots Captions
1. "Simple popup interface with power toggle and threshold control"
2. "Clean YouTube homepage with watched videos hidden"
3. "Advanced options for detailed control"
4. "Choose between hiding completely or fading out watched videos"
5. "Works on all YouTube pages - home, search, and recommendations"

## Promotional Images
- Small Promo Tile (440x280): Focus on the main UI with power button
- Large Promo Tile (920x680): Before/after comparison of YouTube homepage
- Marquee Promo Tile (1400x560): Feature highlights with privacy focus

## Support Information
- Support Email: [sasazame@zametech.com]
- Website: https://github.com/sasazame/watched-video-remover

## Privacy Policy Link
https://github.com/sasazame/watched-video-remover/blob/main/PRIVACY.md

## Single Purpose Description
This extension serves a single purpose: to hide watched videos from YouTube video lists based on user-configured watch percentage thresholds. It modifies the YouTube interface only to hide or fade out video elements that meet the watched criteria, without affecting playback, navigation, or any other YouTube functionality.

## Permission Justifications

### storage
Required to save user preferences (threshold settings, hide mode, content type filters) and maintain a list of watched video IDs locally. This allows the extension to remember which videos to hide across browser sessions.

### tabs
Required to detect when users navigate to YouTube pages and to apply settings across all YouTube tabs. This permission is only used to check if a tab contains a YouTube URL and to send messages to content scripts.

### Host Permission: youtube.com
Required to inject the content script that hides watched videos on YouTube pages. The extension only runs on YouTube domains and does not access any other websites.

## Keywords
youtube, watched, videos, hide, remove, filter, clean, organize, productivity, privacy

## Additional Notes for Reviewers
- This extension intentionally does NOT include auto-skip functionality
- All data is stored locally using Chrome's sync storage API
- No external API calls or data collection
- Minimal permissions requested for core functionality only
- Open source project with MIT license