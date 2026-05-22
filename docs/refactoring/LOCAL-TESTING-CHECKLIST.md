# Local Testing Checklist - Icon Button Refactoring

## Setup

### Method 1: AEM CLI (localhost:3000)
```bash
cd /Users/sirivuri/Documents/adobecom/code/milo
aem up
```
Open: `http://localhost:3000/drafts/sirivuri/fragments/hub-hero-model-fragment`

### Method 2: Milo Libs (localhost:6456) - RECOMMENDED
```bash
cd /Users/sirivuri/Documents/adobecom/code/milo
npm install
npm run libs
```
Open: `https://main--da-dc--adobecom.aem.page/drafts/sirivuri/fragments/hub-hero-model-fragment?milolibs=local`

### Method 3: Preview Branch
```bash
git push origin MWPW-194632
```
Open: `https://main--da-dc--adobecom.aem.page/drafts/sirivuri/fragments/hub-hero-model-fragment?milolibs=MWPW-194632--milo--sirivuri`

---

## Testing Checklist

### ✅ Visual Tests

#### Promo CTA with Arrow
- [ ] Arrow icon appears on the right side of the CTA
- [ ] Arrow is 32×32px with proper spacing
- [ ] Arrow has light background with border
- [ ] Icon image (PDF logo) appears on the left
- [ ] Text "Start an Acrobat free trial" is centered
- [ ] Gap between icon, text, and arrow is consistent (12px)

#### Hover State
- [ ] Hover over CTA - arrow background lightens
- [ ] Cursor shows pointer
- [ ] Transition is smooth (~200ms)

#### Active State
- [ ] Click CTA - arrow background turns white
- [ ] Arrow icon changes to black version
- [ ] Active state visible while mouse is pressed

#### Focus State
- [ ] Tab to CTA - outline appears around entire button
- [ ] Outline is 2px solid white
- [ ] Outline offset is 2px

### ✅ Responsive Tests

#### Mobile (< 600px)
Open DevTools, set to iPhone dimensions:
- [ ] CTA fits width properly
- [ ] Arrow icon maintains 32×32 size
- [ ] Text doesn't wrap awkwardly
- [ ] Touch target is large enough

#### Tablet (600-1024px)
- [ ] CTA layout correct
- [ ] Arrow positioning correct

#### Desktop (> 1024px)
- [ ] CTA layout matches Figma
- [ ] All spacing correct

### ✅ Browser Console Tests

Open browser console (F12 or Cmd+Option+I):

#### Check HTML Structure
```javascript
// Should see the new structure with icon-button span
document.querySelector('.promo-cta').innerHTML
// Expected: icon img + text + <span class="icon-button arrow">
```

#### Check CSS Classes
```javascript
// Check icon button has correct classes
document.querySelector('.icon-button').classList
// Expected: DOMTokenList ['icon-button', 'arrow']
```

#### Check No ::after Content
```javascript
// Old ::after should NOT exist anymore
getComputedStyle(document.querySelector('.promo-cta'), '::after').content
// Should be 'none' or empty, NOT a background image
```

### ✅ Variant Tests

If you have test pages with variants, check:

#### Arrow Down Variant
Create test page: `tour (arrow-down)`
- [ ] Arrow points down (rotated 90deg)
- [ ] All other styling correct

#### Arrow Left Variant
Create test page: `tour (arrow-left)`
- [ ] Arrow points left (rotated 180deg)
- [ ] All other styling correct

#### Arrow Up Variant
Create test page: `tour (arrow-up)`
- [ ] Arrow points up (rotated -90deg)
- [ ] All other styling correct

#### Size Small Variant
Create test page: `tour (size-small)`
- [ ] Icon button is 24×24px (not 32×32)
- [ ] Text size is smaller
- [ ] Proportions look correct

#### No Icon Variant
Create test page: `tour (no-icon)`
- [ ] Arrow icon is hidden
- [ ] Only text and optional image visible
- [ ] Padding adjusted for missing icon

### ✅ JavaScript Tests

#### Check createTag Function
```javascript
// In console, verify icon button was created
console.log(document.querySelector('.promo-cta .icon-button'));
// Should show: <span class="icon-button arrow" aria-hidden="true"></span>
```

#### Check Aria Attributes
```javascript
document.querySelector('.icon-button').getAttribute('aria-hidden')
// Should return: "true"
```

### ✅ Accessibility Tests

#### Screen Reader Test
1. Enable VoiceOver (Mac: Cmd+F5) or NVDA (Windows)
2. Tab to the promo-cta
3. Listen to announcement
   - [ ] Should announce: "Start an Acrobat free trial, link"
   - [ ] Should NOT announce the arrow icon
   - [ ] Should NOT announce "image" for the arrow

#### Keyboard Navigation
1. Tab through page
   - [ ] CTA receives focus
   - [ ] Focus outline visible
2. Press Enter on CTA
   - [ ] Link navigates correctly
3. Press Space on CTA
   - [ ] Link navigates correctly

### ✅ CSS Loading Tests

#### Check Styles Applied
```javascript
// Check icon-button styles loaded
const styles = getComputedStyle(document.querySelector('.icon-button'));
console.log('Background:', styles.background);
console.log('Width:', styles.width);
console.log('Height:', styles.height);
// Should show proper background-image and 32px dimensions
```

#### Check No Console Errors
- [ ] No 404 errors for missing images
- [ ] No CSS syntax errors
- [ ] No JavaScript errors

### ✅ Performance Tests

#### Check Network Tab
Open DevTools > Network:
- [ ] `promo-arrow-right.svg` loads successfully
- [ ] `promo-arrow-right-black.svg` loads on active state
- [ ] No duplicate image loads
- [ ] Images cached properly

#### Check Page Load
- [ ] CTA renders without flash of unstyled content
- [ ] Arrow appears immediately (not after delay)
- [ ] No layout shift when arrow loads

### ✅ Regression Tests

#### Other Tour Sections
- [ ] Section 2 (even) - text + image layout correct
- [ ] Section 3 (last) - centered layout correct
- [ ] No CTAs in sections 2+ (only section 1 has CTA)

#### Modal Behavior
- [ ] Modal opens when triggered
- [ ] Close button (X) works
- [ ] Modal scrolls properly
- [ ] Tour content displays correctly in modal

#### Other Blocks on Page
- [ ] No style bleed to other blocks
- [ ] Other blocks function normally
- [ ] Global navigation not affected

---

## 🐛 Common Issues & Fixes

### Issue: Arrow doesn't appear
**Check:**
```javascript
document.querySelector('.icon-button')
```
**If null:** JS didn't create the element. Check tour.js changes.
**If exists:** CSS not loading. Check styles.css changes.

### Issue: Arrow is in wrong position
**Check:**
```javascript
getComputedStyle(document.querySelector('.promo-cta')).display
// Should be: 'inline-flex'
```
**Fix:** Verify `.promo-cta` has `display: inline-flex` in CSS.

### Issue: ::after still visible
**Check:**
```javascript
getComputedStyle(document.querySelector('.promo-cta'), '::after').content
```
**If not 'none':** Old ::after CSS still present. Remove it.

### Issue: Hover state not working
**Check:**
```javascript
// Hover and check in Elements panel
document.querySelector('.icon-button:hover')
```
**Fix:** Verify hover styles in CSS.

### Issue: Active state shows wrong arrow color
**Check:** `promo-arrow-right-black.svg` exists in `libs/c2/assets/img/`
**Fix:** Add missing asset.

---

## 📸 Visual Comparison

### Before (::after)
```html
<a class="promo-cta">
  <img src="icon.svg" />
  Start your tour
  <!-- ::after creates arrow -->
</a>
```

### After (real element)
```html
<a class="promo-cta">
  <img src="icon.svg" />
  Start your tour
  <span class="icon-button arrow" aria-hidden="true"></span>
</a>
```

---

## ✅ Sign-Off

Once all tests pass:
- [ ] All visual tests pass
- [ ] All responsive tests pass
- [ ] All accessibility tests pass
- [ ] No console errors
- [ ] No regression issues
- [ ] Performance acceptable
- [ ] Ready to commit and push

---

## 🚀 Next Steps After Local Testing

1. **Commit changes:**
   ```bash
   git add libs/c2/styles/styles.css libs/mep/ace1205/tour/tour.js
   git commit -m "Refactor promo-cta arrow from ::after to icon-button element
   
   - Add .icon-button utility component in styles.css
   - Update tour.js to create icon button span element
   - Remove all promo-cta ::after styles
   - Maintain backward compatibility with DA authoring
   
   Addresses feedback from PR review."
   ```

2. **Push to branch:**
   ```bash
   git push origin MWPW-194632
   ```

3. **Test on preview:**
   ```
   https://main--da-dc--adobecom.aem.page/drafts/sirivuri/fragments/hub-hero-model-fragment?milolibs=MWPW-194632--milo--sirivuri
   ```

4. **Update PR with testing notes**

5. **Request re-review from @zagi25 and @narcis-radu**
