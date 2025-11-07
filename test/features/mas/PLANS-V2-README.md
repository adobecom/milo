# Plans V2 Variant Documentation

## Overview
The `plans-v2` variant is a modernized merch card design based on Adobe's team plans layout from the Figma design system. It features a clean, structured layout optimized for showcasing team pricing plans with emphasis on quantity selection and detailed feature lists.

## Design Specifications

### Visual Design
- **Card Width**: 333px (consistent across breakpoints)
- **Border**: 1px solid #DADADA
- **Border Radius**: 8px
- **Background**: White (#FFFFFF / spectrum-gray-50)
- **Padding**: 24px
- **Min Height**: 400px (flexible based on content)

### Based on Figma Design
This variant implements the design from:
[ACOM Customer Groups - Figma](https://www.figma.com/design/laZr3KW3Y5crS0KVhy215U/ACOM-customer-groups?node-id=13132-63516&m=dev)

## Usage

### Basic HTML Structure

```html
<merch-card variant="plans-v2">
    <!-- Icon (optional) -->
    <div slot="icons">
        <img src="icon.svg" alt="Product Icon" width="41" height="41">
    </div>
    
    <!-- Product Name -->
    <h3 slot="heading-xs">Adobe Express Premium</h3>
    
    <!-- Pricing -->
    <div slot="heading-m">
        <div class="price-wrapper">
            <span class="price price-strikethrough">US$7.99/mo</span>
            <span class="price">US$4.99/mo</span>
        </div>
        <span class="price-legal">per license</span>
        <span class="price-legal">Annual, billed monthly</span>
    </div>
    
    <!-- Promo Text (optional) -->
    <p slot="promo-text">Save 38% promo. <a href="#">See terms</a></p>
    
    <!-- Description -->
    <div slot="body-xs">
        <p>Product description goes here.</p>
    </div>
    
    <!-- Quantity Selector -->
    <div slot="quantity-select">
        <label>Number of licenses</label>
        <select>
            <option value="1">1</option>
            <option value="2" selected>2</option>
            <option value="5">5</option>
        </select>
        <p class="help-text">Help text here.</p>
    </div>
    
    <!-- What's Included -->
    <div slot="whats-included">
        <h4>What you get:</h4>
        <ul>
            <li>Feature 1</li>
            <li>Feature 2</li>
            <li>Feature 3</li>
        </ul>
    </div>
    
    <!-- CTAs -->
    <div slot="footer">
        <a href="#" class="con-button outline">Select</a>
        <a href="#" class="con-button blue">Buy now</a>
    </div>
    
    <!-- Badge (optional) -->
    <div slot="badge">Best value</div>
</merch-card>
```

## Slots

### Required Slots
- **`heading-xs`**: Product/plan name (32px, bold, Adobe Clean Display)
- **`heading-m`**: Pricing information
- **`body-xs`**: Product description (18px)
- **`footer`**: Call-to-action buttons

### Optional Slots
- **`icons`**: Product icon (41x41px recommended)
- **`promo-text`**: Promotional messaging (green text, bold)
- **`quantity-select`**: License quantity selector
- **`whats-included`**: Feature list with checkmarks
- **`badge`**: Promotional badge (e.g., "Best value")

## AEM Fragment Mapping

```javascript
export const PLANS_V2_AEM_FRAGMENT_MAPPING = {
    cardName: { attribute: 'name' },
    title: { tag: 'h3', slot: 'heading-xs' },
    prices: { tag: 'p', slot: 'heading-m' },
    promoText: { tag: 'p', slot: 'promo-text' },
    description: { tag: 'div', slot: 'body-xs' },
    quantitySelect: { tag: 'div', slot: 'quantity-select' },
    whatsIncluded: { tag: 'div', slot: 'whats-included' },
    ctas: { slot: 'footer', size: 'm' },
    badge: { tag: 'div', slot: 'badge' },
    style: 'consonant',
};
```

## Typography

### Heading (Product Name)
- **Font**: Adobe Clean Display
- **Size**: 32px
- **Weight**: 900
- **Line Height**: 1.2
- **Color**: spectrum-gray-800 (#2C2C2C)

### Price
- **Font**: Adobe Clean
- **Size**: 28px
- **Weight**: 800
- **Color**: spectrum-gray-900 (#1E1E1E)
- **Strikethrough**: Same size, weight 700, gray-600

### Price Legal Text
- **Size**: 16px
- **Weight**: 400
- **Color**: spectrum-gray-600 (#6E6E6E)

### Promo Text
- **Size**: 16px
- **Weight**: 700
- **Color**: #05834E (green)

### Description
- **Size**: 18px
- **Weight**: 400
- **Color**: spectrum-gray-700 (#4B4B4B)
- **Line Height**: 1.5

### Feature List
- **Size**: 16px
- **Weight**: 400
- **Color**: spectrum-gray-700 (#4B4B4B)
- **Line Height**: 1.625
- **Checkmark**: Blue (#1473E6) checkmark icons

## Components

### Quantity Selector
- Label at 12px, regular weight
- Dropdown/picker component
- Optional help text below (12px, gray-600)
- Full-width within card

### Badge
- Position: Absolute, top-right corner
- Background: #FFD947 (yellow)
- Text: 14px, bold, dark text
- Border Radius: 4px on left side only
- Padding: 4px 12px

### Buttons
Two button styles supported:

#### Primary (Blue)
- Background: #1473E6
- Color: White
- Border: 2px solid #1473E6
- Hover: #0D66D0

#### Secondary (Outline)
- Background: Transparent
- Color: #1473E6
- Border: 2px solid #1473E6
- Hover: Light gray background (#F5F5F5)

Button specs:
- Font Size: 17px
- Weight: 700
- Padding: 10px 16px
- Border Radius: 16px
- Full width within card
- 12px gap between buttons

## Responsive Behavior

### Desktop (1200px+)
- Fixed width: 333px
- Displays in grid with 32px gap

### Tablet (768px - 1199px)
- Fixed width: 333px
- Grid adjusts columns

### Mobile (< 768px)
- Full width with max-width: 333px
- Single column layout

## Key Features

1. **Strikethrough Pricing**: Shows original and discounted prices side-by-side
2. **Prominent Quantity Selector**: Dedicated slot for license quantity selection
3. **Feature Checklist**: Visual checkmarks with detailed feature descriptions
4. **Dual CTAs**: Support for two button actions (Select/Buy, Choose/Buy, etc.)
5. **Promotional Badge**: Eye-catching badge for promotions
6. **Green Promo Text**: Highlighted promotional messaging

## Color Palette

All colors use Spectrum design tokens:

- **Primary Text**: spectrum-gray-800 (#2C2C2C)
- **Secondary Text**: spectrum-gray-700 (#4B4B4B)
- **Legal Text**: spectrum-gray-600 (#6E6E6E)
- **Border**: #DADADA
- **Divider**: #E8E8E8
- **Promo Green**: #05834E
- **Badge Yellow**: #FFD947
- **Primary Blue**: #1473E6
- **Blue Hover**: #0D66D0

## Comparison with Original Plans Variant

### Key Differences:
1. **Simpler Layout**: Removed complex responsive behavior from original plans
2. **Fixed Width**: Always 333px (original had multiple width variables)
3. **No Size Variants**: Original had `wide` and `super-wide` sizes
4. **Cleaner CSS**: Removed education-specific adjustments and complex media queries
5. **Updated Typography**: Uses latest Spectrum typography scale
6. **Modern Border Radius**: 8px corners vs. original's sharper corners
7. **Simplified Badge**: Single badge position vs. multiple variants

### When to Use Plans V2 vs Original Plans:
- **Use Plans V2** for: Team plans, modern pricing pages, customer group targeting
- **Use Original Plans** for: Education plans, student plans, complex adaptive layouts

## Testing

A demo file is available at:
```
/test/features/mas/plans-v2-demo.html
```

This demo includes three card examples:
1. Full-featured card with promo and badge
2. Standard card with dual CTAs
3. Minimal card with single CTA

## Browser Support
- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari, Chrome Mobile

## Accessibility
- Semantic HTML structure
- Proper heading hierarchy
- Labeled form controls
- Focus states on interactive elements
- ARIA labels where appropriate
- Keyboard navigation support

## Future Enhancements
- Integration with merch-quantity-select web component
- Dynamic pricing updates based on quantity
- A/B testing support
- Analytics integration
- Animation on badge
- Tooltip support for help text

