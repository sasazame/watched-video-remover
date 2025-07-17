# Converting PNG to SVG

## Option 1: Manual Vector Tracing (Recommended)
I've already created a clean SVG version based on your design in icon.svg

## Option 2: Automatic Tracing Tools

### Using Inkscape (Free, Open Source)
```bash
# Install Inkscape
# Ubuntu/Debian: sudo apt-get install inkscape
# macOS: brew install inkscape

# Trace bitmap to vector
inkscape icon128.png --export-type=svg --export-filename=icon_traced.svg
```

### Using potrace (Command Line)
```bash
# Install potrace
# Ubuntu/Debian: sudo apt-get install potrace
# macOS: brew install potrace

# Convert PNG to PBM then to SVG
convert icon128.png icon128.pbm
potrace icon128.pbm -s -o icon_traced.svg
```

### Online Tools (Easiest)
1. **Vectorizer.io** - https://www.vectorizer.io/
   - Upload your PNG
   - Adjust settings for best results
   - Download as SVG

2. **Adobe Express** - https://www.adobe.com/express/feature/image/convert/png-to-svg
   - Free with account
   - Good quality results

3. **Convertio** - https://convertio.co/png-svg/
   - Simple upload and convert
   - May embed as raster image

## Option 3: Embed PNG in SVG (Not Recommended)
This doesn't create a true vector image, just embeds the PNG:
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <image href="icon128.png" x="0" y="0" width="128" height="128"/>
</svg>
```

## Best Practice
For extension icons, true vector SVG (like the one I created) is better because:
- Smaller file size
- Scales perfectly at any resolution
- Can be edited easily
- Loads faster

The manually created icon.svg matches your design and is optimized for web use.