# Milo Styles

This directory contains the styling foundation for Milo, including the S2A Design System tokens.

## C2S2A Design Tokens

The `c2s2a.css` file is a compiled stylesheet that combines all S2A Design System tokens from the `deps/` directory. **This file should not be edited manually** as it is auto-generated.

### Architecture

The design tokens follow a four-tier system:

1. **Primitives** → Raw values (spacing, type, radii, color ramps)
2. **Semantic** → Meaning-based tokens (surface, text, border, action, spacing)
3. **Responsive** → Breakpoint-specific overrides (typography, container, density)
4. **Component** → UI-specific tokens (Button, Card, Input, etc.)

### Building the C2S2A Stylesheet

When token files in `libs/styles/deps/` are updated, rebuild the master stylesheet:

```bash
npm run build:c2s2a
```

Or run the build script directly:

```bash
node libs/styles/build-c2s2a.js
```

### What the Build Script Does

The build script (`build-c2s2a.js`):

1. ✅ Verifies all 13 token files exist in `deps/`
2. 📦 Combines them in the correct layer order per the S2A Design System architecture
3. 🏷️  Adds proper section headers and source comments
4. 🎨 Includes comprehensive linter suppression for auto-generated content
5. 📝 Outputs to `libs/styles/c2s2a.css`

### Token Files Included

The build script combines these files in order:

**Primitives (3 files):**
- `tokens.primitives.css` - Non-color primitives
- `tokens.primitives.light.css` - Light mode colors
- `tokens.primitives.dark.css` - Dark mode colors

**Semantic (3 files):**
- `tokens.semantic.css` - Non-color semantic tokens
- `tokens.semantic.light.css` - Light mode semantic colors
- `tokens.semantic.dark.css` - Dark mode semantic colors

**Responsive (4 files):**
- `tokens.responsive.mobile.css` - Mobile defaults
- `tokens.responsive.tablet.css` - Tablet (768px+)
- `tokens.responsive.desktop.css` - Desktop (1024px+)
- `tokens.responsive.desktop-wide.css` - Desktop wide (1440px+)

**Component (3 files):**
- `tokens.component.css` - Non-color component tokens
- `tokens.component.light.css` - Light mode component colors
- `tokens.component.dark.css` - Dark mode component colors

### Why This Order Matters

CSS custom properties cascade and reference each other:

1. **Primitives first** - Foundation with raw values
2. **Semantic second** - Reference primitives
3. **Responsive third** - Override semantic values at breakpoints
4. **Component last** - Reference semantic and responsive tokens

### Theme Switching

The tokens support light and dark themes via the `data-theme` attribute:

```javascript
// Switch to dark mode
document.documentElement.dataset.theme = "dark";

// Switch to light mode  
document.documentElement.dataset.theme = "light";
```

### Verifying the Build

After building, verify the output with linting:

```bash
npm run lint:css
```

The build script automatically includes linter suppressions for rules that conflict with auto-generated token formats.

---

## Other Styles

Other CSS files in this directory provide additional styling utilities and block-specific styles for Milo components.

