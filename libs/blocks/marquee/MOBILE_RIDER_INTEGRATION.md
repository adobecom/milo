# Mobile-Rider Player Integration Guide for Marquee Block

## Overview
This guide explains how to add support for the mobile-rider player in the marquee block, following the existing patterns used for other video players and features.

## Current Implementation Pattern

The marquee block currently handles:
- **MP4 video links** (`a[href*=".mp4"]`)
- **HTML5 video elements** (`<video>`)
- **Video in video-holder** (`.video-holder video`)
- **Custom features** like `mnemonic-list` and `countdown-timer`

## Suggested Approach

### 1. Detection Function
Create a `hasMobileRiderPlayer()` function to detect mobile-rider player elements. You can detect by:
- **Link pattern**: Links containing 'mobile-rider' or 'rider-player' in the URL
- **Custom element**: `<mobile-rider>` or `<rider-player>` web components
- **Class name**: Elements with `.mobile-rider` or `.rider-player` classes
- **Data attribute**: Elements with `data-rider-player` or `data-mobile-rider` attributes

### 2. Load Function
Create a `loadMobileRiderPlayer()` function similar to `loadMnemonicList()`:
- Loads the mobile-rider CSS
- Imports and initializes the mobile-rider player module
- Handles errors gracefully

### 3. Integration Points

#### A. Media Detection (Line 210)
Update the media decoration logic to check for mobile-rider player before decorating as image:
```javascript
if (!media.querySelector('video, a[href*=".mp4"]') && !hasMobileRiderPlayer(media)) {
  decorateImage(media);
}
```

#### B. Split Decoration (Line 97)
Update `decorateSplit()` to skip media credit processing for mobile-rider player:
```javascript
if (txtContent?.match(/^http.*\.mp4/) || 
    media?.lastChild?.tagName === 'VIDEO' || 
    media.querySelector('.video-holder video') ||
    hasMobileRiderPlayer(media)) return;
```

#### C. Background Order (Line 133-144)
Update `changeBackgroundOrder()` to treat mobile-rider player similar to video:
```javascript
let hasRider = false;
// ... detection logic ...
if ((hasVideo || hasRider) && (background.children.length === 1 || videoInViewport)) {
  position = 'afterend';
}
```

#### D. Main Init Function (Line 224-231)
Add mobile-rider player loading to the promise array:
```javascript
const media = foreground.querySelector(':scope > .asset');
if (media && hasMobileRiderPlayer(media)) {
  promiseArr.push(loadMobileRiderPlayer(media));
}
```

## Implementation Steps

1. **Create the mobile-rider player module** (if it doesn't exist):
   - `libs/blocks/mobile-rider/mobile-rider.js`
   - `libs/blocks/mobile-rider/mobile-rider.css`
   - Follow the pattern of `youtube.js` or `vimeo.js` for web component-based players

2. **Add detection and loading functions** to `marquee.js`:
   - `hasMobileRiderPlayer(media)` - detection function
   - `loadMobileRiderPlayer(media)` - loading function

3. **Update existing functions** in `marquee.js`:
   - `decorateSplit()` - add mobile-rider check
   - `changeBackgroundOrder()` - treat rider like video
   - `init()` - add loading logic

4. **Test the integration**:
   - Test with mobile-rider player links
   - Test with different marquee sizes (small, medium, large, xlarge)
   - Test with split layout
   - Test viewport ordering (mobile, tablet, desktop)

## Example HTML Structure

The mobile-rider player could be added to marquee in several ways:

```html
<!-- Option 1: Link-based -->
<div class="marquee">
  <div>
    <div>
      <h2>Title</h2>
      <p>Description</p>
    </div>
    <div>
      <a href="https://example.com/mobile-rider/player/123">Video</a>
    </div>
  </div>
</div>

<!-- Option 2: Custom element -->
<div class="marquee">
  <div>
    <div>
      <h2>Title</h2>
      <p>Description</p>
    </div>
    <div>
      <mobile-rider videoid="123"></mobile-rider>
    </div>
  </div>
</div>

<!-- Option 3: Data attribute -->
<div class="marquee">
  <div>
    <div>
      <h2>Title</h2>
      <p>Description</p>
    </div>
    <div>
      <div data-rider-player="123"></div>
    </div>
  </div>
</div>
```

## Notes

- The detection method should match how the mobile-rider player is actually implemented
- Consider mobile-specific behavior (similar to how YouTube/Vimeo handle mobile differently)
- Ensure the player respects the marquee's autoplay behavior (line 486 in `decorate.js` shows marquee videos get `#autoplay` hash)
- The player should work with the existing viewport ordering system
- Consider accessibility requirements similar to other video players

## Related Files

- `libs/blocks/youtube/youtube.js` - Example of custom video player
- `libs/blocks/vimeo/vimeo.js` - Example of custom video player
- `libs/blocks/adobetv/adobetv.js` - Example of iframe-based player
- `libs/utils/decorate.js` - Video decoration utilities
- `libs/blocks/marquee/marquee.css` - Marquee styling (may need updates for mobile-rider)



