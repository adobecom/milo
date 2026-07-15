import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
} from 'react';
import { STORAGE_KEYS } from '../config';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ConfirmPayload {
  title: string;
  message: string;
  onConfirm: () => void;
  // The confirm button's label — name the ACTION ("Delete", "Discard"), never a
  // vague "Continue". Defaults to 'Confirm' if a caller forgets.
  confirmLabel?: string;
  // When true, the confirm button reads as destructive (red). Use for delete /
  // irreversible actions so the button looks as serious as the copy says it is.
  destructive?: boolean;
}

export interface UiState {
  sidebarCollapsed: boolean;
  modal: 'settings' | 'confirm' | 'connectConsumer' | 'splash' | null;
  confirmPayload: ConfirmPayload | null;
  // A continuation to run after the "connect to publish" modal connects — lets the
  // deploy gate resume the publish the user just asked for. Cleared on close.
  pendingPublish: (() => void) | null;
  // The top-level work-area destination. 'work' = the entry/session flow (default);
  // 'designSystem' = the standing flywheel view. Opening the design system does NOT
  // clear the active session, so returning to 'work' lands back on it.
  view: 'work' | 'designSystem';
}

// ── Actions ───────────────────────────────────────────────────────────────────

export type UiAction =
  | { type: 'toggleSidebar' }
  | { type: 'openSettings' }
  | { type: 'openSplash' }
  | { type: 'openConnectConsumer'; onConnected?: () => void }
  | { type: 'openConfirm'; payload: ConfirmPayload }
  | { type: 'closeModal' }
  | { type: 'openDesignSystem' }
  | { type: 'closeDesignSystem' };

// ── Reducer ───────────────────────────────────────────────────────────────────

function reducer(state: UiState, action: UiAction): UiState {
  switch (action.type) {
    case 'toggleSidebar':
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed };
    case 'openSettings':
      return { ...state, modal: 'settings' };
    case 'openSplash':
      return { ...state, modal: 'splash' };
    case 'openConnectConsumer':
      return { ...state, modal: 'connectConsumer', pendingPublish: action.onConnected ?? null };
    case 'openConfirm':
      return { ...state, modal: 'confirm', confirmPayload: action.payload };
    case 'closeModal':
      return { ...state, modal: null, confirmPayload: null, pendingPublish: null };
    case 'openDesignSystem':
      return { ...state, view: 'designSystem' };
    case 'closeDesignSystem':
      return { ...state, view: 'work' };
    default:
      return state;
  }
}

// ── Initial state ─────────────────────────────────────────────────────────────

function getInitialState(): UiState {
  const collapsed =
    localStorage.getItem(STORAGE_KEYS.SIDEBAR) === 'true';
  return {
    sidebarCollapsed: collapsed,
    modal: null,
    confirmPayload: null,
    pendingPublish: null,
    view: 'work',
  };
}

// ── Context ───────────────────────────────────────────────────────────────────

interface UiStateContextValue {
  state: UiState;
  dispatch: React.Dispatch<UiAction>;
}

const UiStateContext = createContext<UiStateContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────

export function UiStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, getInitialState);

  // Persist sidebarCollapsed whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SIDEBAR, String(state.sidebarCollapsed));
  }, [state.sidebarCollapsed]);

  return (
    <UiStateContext.Provider value={{ state, dispatch }}>
      {children}
    </UiStateContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useUiState(): UiStateContextValue {
  const ctx = useContext(UiStateContext);
  if (!ctx) throw new Error('useUiState must be used inside <UiStateProvider>');
  return ctx;
}
