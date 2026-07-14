import { defineConfig } from 'vitest/config';

// Standalone vitest config — deliberately does NOT reuse vite.config.ts.
// vite.config.ts pulls in unplugin-parcel-macros (for @react-spectrum/s2 style
// macros) and sets root: 'src/'. Tests target pure logic extracted into sibling
// .ts modules (no macro/CSS-module dependency); component tests mock @react-spectrum/s2
// at the import boundary. Keeping the test config plugin-free avoids the macro
// transform entirely and keeps the runner fast and deterministic.
export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    // CSS (incl. *.module.css) is not needed to test behavior — treat as no-op
    // so component tests can import surfaces without a CSS pipeline.
    css: false,
  },
});
