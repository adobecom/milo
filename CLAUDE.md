# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Testing
- `npm test` - Run all unit tests with coverage (requires `npx playwright install`)
- `npm run test:watch` - Run tests in watch mode
- `npm run test:file <file>` - Run specific test file
- `npm run nala <env> [options]` - Run E2E tests (e.g., `npm run nala local test=accordion.test.js`)

### Linting & Code Quality
- `npm run lint` - Run both JS and CSS linting
- `npm run lint:js` - ESLint JavaScript files
- `npm run lint:css` - Stylelint CSS files

### Development Server
- `aem up` - Start local development server (requires `@adobe/aem-cli`)
- `npm run libs` - Run Milo libs on port 6456 for testing consuming sites

### Build Commands (Specific Components)
- `npm run build:htm-preact` - Build HTM Preact bundle
- `npm run build:gnav-profile` - Build global navigation profile
- `npm run build:echarts` - Copy ECharts library

## Architecture Overview

### Core Structure
Milo is a shared foundation for Franklin-based Adobe.com websites, built around a modular block system.

**Key Directories:**
- `libs/` - Core Milo functionality
  - `blocks/` - Reusable UI components (100+ blocks including accordion, carousel, marquee, etc.)
  - `features/` - Advanced features (MAS commerce, personalization, georouting, etc.)
  - `utils/` - Shared utilities and helpers
  - `styles/` - Global styles and themes
- `tools/` - Authoring and content management tools (Floodgate, Send-to-CAAS, etc.)
- `test/` - Unit tests organized by component
- `nala/` - E2E test suite using Playwright

### Block System
Blocks are auto-loaded from `libs/blocks/` and follow naming conventions:
- Block folder contains `block-name.js` and `block-name.css`
- Blocks are registered automatically via `libs/utils/utils.js`
- Templates in `libs/templates/` for page-level layouts

### MAS (Merch At Scale) Architecture
A sophisticated commerce component system built with Lit web components:
- **Entry points**: `libs/features/mas/src/mas.js`, `libs/features/mas/src/commerce.js`
- **Components**: Merch cards, checkout links, inline pricing, commerce service integration
- **Variant system**: Extensible card layouts (catalog, plans, product, etc.)
- **Build**: Uses ESBuild, outputs to `libs/deps/mas/` and `libs/features/mas/dist/`
- **Testing**: Web Test Runner with 85% coverage requirement (branches/statements/lines), 65% functions
- **Performance**: 20-second timeout for card initialization, lazy loading support

### Personalization & Features
- **Personalization**: MEP (Milo Experience Platform) in `libs/features/personalization/`
- **Georouting**: Multi-region content routing
- **Navigation**: Global nav (`gnav`) and federated navigation systems
- **Commerce**: Integration with Adobe Commerce via MAS
- **Icons**: SVG icon system with lazy loading in `libs/features/icons/`

## Development Patterns

### Block Development
1. Create folder in `libs/blocks/[block-name]/`
2. Implement `[block-name].js` with default export function
3. Add styles in `[block-name].css`
4. Block auto-registers via utils system

### Testing Requirements
- Unit tests required for all new blocks/features
- Use existing test patterns from similar components
- MAS components require commerce attribute validation (offer IDs, analytics, checkout links)
- E2E tests via Nala for complex user flows

### Code Style (from .cursor/rules.json)
- Single quotes, no semicolons, trailing commas
- Use Lit framework patterns for web components
- Follow CSS custom property hierarchy: `--spectrum-*` > `--merch-card-*` > `--consonant-merch-*`

### Commerce Component Patterns
When working with MAS components:
- All variants must extend `VariantLayout` class
- Use `reflect: true` for attribute/property binding
- Implement proper lifecycle hooks (`willUpdate`, `updated`, `connectedCallbackHook`, `disconnectedCallbackHook`)
- Validate commerce attributes in tests (pricing, offer IDs, analytics)
- Follow theme variant testing patterns
- Provider pattern enables pricing customization
- `mas-commerce-service` web component enables commerce features

## Environment Configuration

### Local Development
- Main development server: `aem up`
- Libs development: `npm run libs` (port 6456)
- Test with consuming sites: `?milolibs=local` parameter

### Branch Testing
- Stage: `https://main--project--owner.aem.page/?milolibs=local`
- Production: `https://main--project--owner.aem.live/?milolibs=local`
- Feature branches: `https://feat-branch--project--owner.aem.page/?milolibs=local`

## Core Architectural Principles

### Block Loading System
- Blocks auto-discovered from `libs/blocks/` directory
- Registration in `MILO_BLOCKS` array in `utils.js`
- Dynamic loading via `loadBlock()` function
- Auto-blocks apply transformations based on URL patterns
- Trust verification for security

### Configuration Management
- Centralized via `setConfig()`, `getConfig()`, `updateConfig()`
- Environment detection (local, stage, prod)
- Locale/language system with content roots
- Feature flags and metadata-driven configuration

### Performance Patterns
- Intersection Observer API for lazy loading
- Resource preloading for critical assets
- Deferred loading for non-critical features
- LCP (Largest Contentful Paint) optimization
- Code splitting with dynamic imports

### Content Processing
- Section-based processing (`decorateSections()`)
- Fragment system for reusable content
- Circular reference detection
- Automatic path localization

## Common Workflows

### Adding New Blocks
1. Study existing similar blocks for patterns
2. Create block folder with JS/CSS files
3. Follow existing naming and structure conventions
4. Add comprehensive unit tests
5. Test across environments with `?milolibs=local`

### MAS Component Development
1. Build: `cd libs/features/mas && npm run build`
2. Test: `cd libs/features/mas && npm test`
3. Variants go in `src/variants/` following existing patterns
4. Register variants in `src/variants/variants.js`

#### Creating New MAS Variants
When creating a new variant (e.g., simplified-pricing-express):
1. Create variant files: `variant-name.js` and `variant-name.css.js`
2. Define AEM fragment mapping for content structure
3. Extend `VariantLayout` and implement:
   - `getGlobalCSS()` - Returns global CSS string
   - `renderLayout()` - Returns Lit HTML template
   - Static `variantStyle` - Shadow DOM CSS
4. Register in `variants.js` with `registerVariant()`
5. Add comprehensive tests:
   - HTML test file with variant DOM structure
   - JS test file with behavior validation
   - Commerce attribute testing
   - Theme variant testing
   - Interaction testing (hover, click, keyboard)

### Testing Strategy
- Use `npm run test:watch` during development
- Run full `npm test` before commits for accurate coverage
- Use Nala for E2E: `npm run nala local test=component.test.js`
- Test theme variants and commerce attributes for MAS components
- MAS testing requirements:
  - Component existence and rendering
  - User interactions (clicks, hover, keyboard navigation)
  - Commerce attributes (offer IDs, analytics IDs, checkout links)
  - Accessibility (ARIA attributes, focus management)
  - Performance marks and lazy loading