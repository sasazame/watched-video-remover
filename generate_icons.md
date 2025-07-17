# How to Generate PNG Icons from SVG

Since you have the icon.svg file, you'll need to generate PNG versions in the correct sizes for the Chrome extension.

## Required Icon Sizes
- 16x16 pixels (icon16.png)
- 48x48 pixels (icon48.png)
- 128x128 pixels (icon128.png)

## Methods to Generate Icons

### Method 1: Using ImageMagick (Recommended)
```bash
# Install ImageMagick if not already installed
# On Ubuntu/Debian: sudo apt-get install imagemagick
# On macOS: brew install imagemagick

# Generate PNG icons
convert -background none icon.svg -resize 16x16 icon16.png
convert -background none icon.svg -resize 48x48 icon48.png
convert -background none icon.svg -resize 128x128 icon128.png
```

### Method 2: Using Inkscape
```bash
# Install Inkscape if not already installed
# On Ubuntu/Debian: sudo apt-get install inkscape
# On macOS: brew install inkscape

# Generate PNG icons
inkscape icon.svg -w 16 -h 16 -o icon16.png
inkscape icon.svg -w 48 -h 48 -o icon48.png
inkscape icon.svg -w 128 -h 128 -o icon128.png
```

### Method 3: Using rsvg-convert
```bash
# Install librsvg if not already installed
# On Ubuntu/Debian: sudo apt-get install librsvg2-bin
# On macOS: brew install librsvg

# Generate PNG icons
rsvg-convert -w 16 -h 16 icon.svg -o icon16.png
rsvg-convert -w 48 -h 48 icon.svg -o icon48.png
rsvg-convert -w 128 -h 128 icon.svg -o icon128.png
```

### Method 4: Online Tools
If you don't want to install software, you can use online SVG to PNG converters:
- https://cloudconvert.com/svg-to-png
- https://convertio.co/svg-png/
- https://svgtopng.com/

Upload icon.svg and generate PNGs at 16x16, 48x48, and 128x128 sizes.

## Icon Design
The current icon.svg shows:
- Red YouTube-style background
- White video player with play button
- Progress bar showing 90% watched (representing the threshold)
- Eye with slash symbol (representing hiding/visibility toggle)

This clearly communicates the extension's purpose of hiding watched videos.