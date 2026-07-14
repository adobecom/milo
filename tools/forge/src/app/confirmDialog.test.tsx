// MWPW-199254 — the destructive/confirm path of ConfirmDialog. Driven through the
// real UiState reducer (openConfirm → closeModal), no @react-spectrum/s2 in the
// tree, so it renders under the standalone vitest config.
import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { UiStateProvider, useUiState, type ConfirmPayload } from './UiStateContext';
import { ConfirmDialog } from './ConfirmDialog';

afterEach(cleanup);

// Fires openConfirm with the given payload on button click, so each test drives
// the dialog through the real reducer rather than faking state.
function Opener({ payload }: { payload: ConfirmPayload }) {
  const { dispatch } = useUiState();
  return (
    <button type="button" onClick={() => dispatch({ type: 'openConfirm', payload })}>
      trigger
    </button>
  );
}

function setup(payload: ConfirmPayload) {
  render(
    <UiStateProvider>
      <Opener payload={payload} />
      <ConfirmDialog />
    </UiStateProvider>,
  );
}

function basePayload(over: Partial<ConfirmPayload> = {}): ConfirmPayload {
  return {
    title: 'Delete session?',
    message: 'This removes the run and its history.',
    onConfirm: vi.fn(),
    ...over,
  };
}

describe('ConfirmDialog — closed until opened', () => {
  it('renders nothing before openConfirm', () => {
    setup(basePayload());
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });
});

describe('ConfirmDialog — destructive confirm', () => {
  it('shows the payload title/message and a danger-styled labeled action', () => {
    setup(basePayload({ destructive: true, confirmLabel: 'Delete' }));
    fireEvent.click(screen.getByText('trigger'));

    const dialog = screen.getByRole('alertdialog');
    expect(dialog).toHaveAttribute('aria-labelledby', 'confirm-title');
    expect(screen.getByText('Delete session?')).toBeInTheDocument();
    expect(screen.getByText('This removes the run and its history.')).toBeInTheDocument();

    const confirmBtn = screen.getByRole('button', { name: 'Delete' });
    expect(confirmBtn).toHaveClass('pf-btn-danger');
  });

  it('confirm runs onConfirm exactly once and closes the dialog', () => {
    const onConfirm = vi.fn();
    setup(basePayload({ destructive: true, confirmLabel: 'Delete', onConfirm }));
    fireEvent.click(screen.getByText('trigger'));

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });

  it('cancel closes WITHOUT running onConfirm', () => {
    const onConfirm = vi.fn();
    setup(basePayload({ destructive: true, confirmLabel: 'Delete', onConfirm }));
    fireEvent.click(screen.getByText('trigger'));

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onConfirm).not.toHaveBeenCalled();
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });
});

describe('ConfirmDialog — non-destructive default', () => {
  it('defaults the confirm label to "Confirm" and uses the primary (non-danger) style', () => {
    setup(basePayload());
    fireEvent.click(screen.getByText('trigger'));

    const confirmBtn = screen.getByRole('button', { name: 'Confirm' });
    expect(confirmBtn).toHaveClass('pf-btn-primary');
    expect(confirmBtn).not.toHaveClass('pf-btn-danger');
  });
});

describe('ConfirmDialog — backdrop dismiss', () => {
  it('clicking the backdrop closes without confirming; clicking the dialog does not', () => {
    const onConfirm = vi.fn();
    setup(basePayload({ onConfirm }));
    fireEvent.click(screen.getByText('trigger'));

    // Clicking the dialog body must NOT close (target !== backdrop).
    fireEvent.click(screen.getByRole('alertdialog'));
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();

    // Clicking the backdrop itself closes.
    const backdrop = screen.getByRole('alertdialog').parentElement as HTMLElement;
    fireEvent.click(backdrop);
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    expect(onConfirm).not.toHaveBeenCalled();
  });
});
