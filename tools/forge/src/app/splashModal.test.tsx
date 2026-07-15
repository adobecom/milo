// SplashModal + its splashSeen config contract. S2/react-aria are mocked at the
// import boundary — the standalone vitest config omits the S2 macro chain.

import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { emptyForgeConfig, loadForgeConfig, saveForgeConfig, FORGE_CONFIG_KEY } from '../config';
import { SPLASH_SLIDES } from './splashContent';

// The S2 Close icon pulls the parcel-macro pipeline the test config omits; stub it.
vi.mock('@react-spectrum/s2/icons/Close', () => ({
  default: () => <span data-testid="close-icon" />,
}));
// FocusScope is a behavior wrapper we don't exercise here — render children plainly.
vi.mock('react-aria', () => ({
  FocusScope: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Import AFTER the mocks so SplashModal picks up the stubs.
const { SplashModal } = await import('./SplashModal');

afterEach(() => {
  cleanup();
  localStorage.clear();
});

// ── Config contract ───────────────────────────────────────────────────────────

describe('splashSeen config', () => {
  it('defaults to false so a first-time user sees the tour', () => {
    expect(emptyForgeConfig().splashSeen).toBe(false);
  });

  it('survives the save/load round-trip once dismissed', () => {
    saveForgeConfig({ ...emptyForgeConfig(), splashSeen: true });
    expect(loadForgeConfig().splashSeen).toBe(true);
  });

  it('a config blob missing splashSeen loads as false (back-compat default)', () => {
    // Simulate an older stored blob that predates the field.
    const legacy = { ...emptyForgeConfig() } as Record<string, unknown>;
    delete legacy.splashSeen;
    localStorage.setItem(FORGE_CONFIG_KEY, JSON.stringify(legacy));
    expect(loadForgeConfig().splashSeen).toBe(false);
  });
});

// ── Component behavior ──────────────────────────────────────────────────────────

describe('SplashModal', () => {
  it('renders nothing when closed', () => {
    render(<SplashModal isOpen={false} onClose={() => {}} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens on the first slide', () => {
    render(<SplashModal isOpen onClose={() => {}} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe(SPLASH_SLIDES[0].title);
    // First slide has no Back control.
    expect(screen.queryByRole('button', { name: 'Back' })).not.toBeInTheDocument();
  });

  it('steps forward through every slide, then closes on "Get started"', () => {
    const onClose = vi.fn();
    render(<SplashModal isOpen onClose={onClose} />);

    // Advance to the last slide.
    for (let i = 0; i < SPLASH_SLIDES.length - 1; i++) {
      expect(screen.getByRole('heading', { level: 2 }).textContent).toBe(SPLASH_SLIDES[i].title);
      fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    }
    const lastTitle = SPLASH_SLIDES[SPLASH_SLIDES.length - 1].title;
    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe(lastTitle);

    // Last slide swaps Next → Get started, which closes (does not advance).
    expect(screen.queryByRole('button', { name: 'Next' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Get started' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('Back returns to the previous slide', () => {
    render(<SplashModal isOpen onClose={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe(SPLASH_SLIDES[1].title);
    fireEvent.click(screen.getByRole('button', { name: 'Back' }));
    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe(SPLASH_SLIDES[0].title);
  });

  it('a dot jumps directly to that slide', () => {
    render(<SplashModal isOpen onClose={() => {}} />);
    const lastIdx = SPLASH_SLIDES.length - 1;
    fireEvent.click(
      screen.getByRole('button', {
        name: `Go to step ${lastIdx + 1}: ${SPLASH_SLIDES[lastIdx].title}`,
      }),
    );
    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe(SPLASH_SLIDES[lastIdx].title);
  });

  it('Escape closes the dialog', () => {
    const onClose = vi.fn();
    render(<SplashModal isOpen onClose={onClose} />);
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
