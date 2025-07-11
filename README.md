# YouTube Watched Video Remover

A Chrome extension that automatically hides or removes watched videos from YouTube based on your watch progress. Compatible with Manifest V3.

## Features

- **Automatic Detection**: Detects watched videos based on progress bar percentage
- **Customizable Threshold**: Set your own threshold for what counts as "watched" (default: 90%)
- **Multiple Hide Modes**: Choose between completely hiding videos or fading them out
- **Auto-Skip**: Automatically skip to the next video when landing on a watched video
- **Content Type Filters**: Separately control regular videos, YouTube Shorts, and live streams
- **Storage Management**: Automatically manages storage to prevent quota issues
- **Data Export/Import**: Backup and restore your watched video list

## Installation

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension directory
5. The extension icon should appear in your Chrome toolbar

## Usage

### Basic Controls (Popup)
- Click the extension icon to access quick settings
- Adjust the watched threshold using the slider
- Toggle auto-skip functionality
- View statistics about watched videos
- Show temporarily hidden videos
- Clear all watched video data

### Advanced Settings (Options Page)
- Access via "Advanced Options" button in popup or Chrome extension settings
- Configure hide mode (complete hide vs fade)
- Set skip delay for auto-skip feature
- Choose which content types to process
- Manage storage limits
- Export/import your data

## Configuration Options

### Threshold Setting
- **Range**: 1% - 100%
- **Default**: 90%
- Videos watched beyond this percentage will be considered "watched"

### Hide Modes
- **Hide**: Completely removes videos from view
- **Fade**: Shows videos at 50% opacity with grayscale filter

### Content Types
- **Regular Videos**: Standard YouTube videos
- **YouTube Shorts**: Short-form vertical videos
- **Live Streams**: Live broadcast content

### Auto-Skip Settings
- **Enable/Disable**: Toggle automatic skipping
- **Skip Delay**: Add custom delay before skipping (0-10 seconds)

## Technical Details

### Manifest V3 Compliance
- Uses service workers instead of background pages
- Implements proper host permissions
- Follows Chrome Web Store policies

### Storage
- Uses Chrome sync storage for settings and watched videos
- Automatically manages storage quota
- Configurable maximum stored videos (default: 5000)

### Performance
- Efficient DOM observation for dynamic content
- Minimal impact on YouTube performance
- Smart caching and batch operations

## Development

### Project Structure
```
├── manifest.json          # Extension manifest
├── content.js            # Content script for YouTube pages
├── background.js         # Service worker for background tasks
├── popup.html/js         # Popup interface
├── options.html/js       # Options page
├── test/                 # Test files
├── icon*.png            # Extension icons
└── README.md            # This file
```

### Running Tests
```bash
# Install dependencies
npm install

# Run tests in browser
npm test

# Run tests in CLI (requires additional setup)
npm run test:cli
```

### Building from Source
No build process required - the extension runs directly from source files.

## Privacy

This extension:
- Does not collect any personal data
- Stores all data locally in Chrome sync storage
- Does not communicate with external servers
- Only runs on YouTube domains

## Troubleshooting

### Videos not being hidden
1. Check that the extension is enabled
2. Verify threshold settings
3. Ensure content type filters are enabled
4. Refresh the YouTube page

### Auto-skip not working
1. Verify auto-skip is enabled in settings
2. Check that the video is in your watched list
3. Try adjusting the skip delay

### Storage issues
1. Check current storage usage in options
2. Reduce maximum stored videos limit
3. Export data and clear storage if needed

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License - see LICENSE file for details

## Changelog

### Version 1.0.0
- Initial release
- Manifest V3 support
- Basic hide/remove functionality
- Threshold settings
- Auto-skip feature
- YouTube Shorts support
- Advanced options page
- Data export/import