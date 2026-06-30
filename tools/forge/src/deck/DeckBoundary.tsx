// ── DeckBoundary — show the error instead of a blank page (THROWAWAY) ─────────
// The deck embeds real app components; if one throws, surface it on screen (with
// stack) rather than unmounting to white. Demo-only safety net.

import { Component, type ErrorInfo, type ReactNode } from 'react';

interface State {
  error: Error | null;
  info: string;
}

// `compact` mode renders a small inline error (for a single slide's stage) so one
// fussy embedded component never blanks the whole deck; default mode is full-screen.
export class DeckBoundary extends Component<{ children: ReactNode; compact?: boolean }, State> {
  state: State = { error: null, info: '' };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Also log for the console, but the on-screen panel is the real channel here.
    // eslint-disable-next-line no-console
    console.error('[deck] render error:', error, info.componentStack);
    this.setState({ info: info.componentStack || '' });
  }

  render() {
    const { error, info } = this.state;
    if (error && this.props.compact) {
      return (
        <div style={{
          padding: '20px 24px', background: '#2a1d1d', color: '#ffb3b3',
          font: '12px/1.5 ui-monospace, Menlo, monospace', borderRadius: 12, whiteSpace: 'pre-wrap',
          maxHeight: '100%', overflow: 'auto',
        }}>
          <b style={{ color: '#fff' }}>This slide&apos;s preview errored:</b>{'\n'}
          {String(error.message || error)}
        </div>
      );
    }
    if (error) {
      return (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 2000, padding: '40px 48px',
          background: '#1b1d22', color: '#ffd0d0', font: '13px/1.5 ui-monospace, Menlo, monospace',
          overflow: 'auto', whiteSpace: 'pre-wrap',
        }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 12 }}>
            Deck failed to render
          </div>
          <div style={{ color: '#ff9a9a', marginBottom: 16 }}>{String(error.message || error)}</div>
          <div style={{ color: '#c9a' }}>{error.stack}</div>
          {info && <div style={{ color: '#8aa6ff', marginTop: 16 }}>{info}</div>}
        </div>
      );
    }
    return this.props.children;
  }
}
