/**
 * Máquina de estados do painel de tiragem (lógica pura, sem React).
 *
 * ritual → choosing → drawing → revealing ⇄ (interpretação em paralelo) → revealed
 *                                   ↘ error (retry seguro) · support (acolhimento) · limit (degustação usada)
 *
 * O sorteio acontece no servidor: aqui só guardamos QUAIS posições da mesa foram tocadas.
 */
import type { DrawnCard, Interpretation } from '../types/reading';
import type { SupportMessage } from '../types/session';

export type FlowStage =
  | 'ritual'
  | 'choosing'
  | 'drawing'
  | 'revealing'
  | 'interpreting'
  | 'revealed'
  | 'error'
  | 'support'
  | 'limit';

export type FailedStep = 'draw' | 'interpret';

export interface FlowError {
  step: FailedStep;
  message: string;
  retryable: boolean;
}

export interface FlowState {
  stage: FlowStage;
  cardsToPick: number;
  tableSlots: number;
  picks: number[];
  cards: DrawnCard[] | null;
  interpretation: Interpretation | null;
  /** Revelação visual concluída (as cartas já viraram). */
  revealDone: boolean;
  support: SupportMessage | null;
  error: FlowError | null;
  /** Aviso gentil para ações fora de hora (ex.: escolher uma 4ª carta). */
  notice: string | null;
}

export type FlowAction =
  | { type: 'RITUAL_DONE' }
  | { type: 'TOGGLE_PICK'; slot: number }
  | { type: 'CONFIRM_PICKS' }
  | { type: 'DRAW_OK'; cards: DrawnCard[] }
  | { type: 'REVEAL_DONE' }
  | { type: 'INTERPRET_OK'; interpretation: Interpretation; cards?: DrawnCard[] }
  | { type: 'SUPPORT'; support: SupportMessage }
  | { type: 'FAIL'; step: FailedStep; message: string; retryable: boolean }
  | { type: 'LIMIT' }
  | { type: 'RETRY' };

export const FLOW_NOTICES = {
  tooMany: (n: number) => `Você já escolheu ${n} cartas. Toque numa delas para trocar.`,
  notEnough: (n: number) => `Escolha ${n} cartas para seguir.`,
  invalidSlot: 'Essa carta não está na mesa.',
} as const;

export function createFlow(
  opts: { tableSlots: number; cardsToPick: number; support?: SupportMessage | null },
): FlowState {
  const base: FlowState = {
    stage: 'ritual',
    cardsToPick: opts.cardsToPick,
    tableSlots: opts.tableSlots,
    picks: [],
    cards: null,
    interpretation: null,
    revealDone: false,
    support: null,
    error: null,
    notice: null,
  };
  if (opts.support) return { ...base, stage: 'support', support: opts.support };
  return base;
}

/** Começa direto na interpretação (rever uma leitura já sorteada). */
export function createReviewFlow(): FlowState {
  return { ...createFlow({ tableSlots: 0, cardsToPick: 3 }), stage: 'interpreting', revealDone: true };
}

export function flowReducer(state: FlowState, action: FlowAction): FlowState {
  switch (action.type) {
    case 'RITUAL_DONE':
      return state.stage === 'ritual' ? { ...state, stage: 'choosing', notice: null } : state;

    case 'TOGGLE_PICK': {
      if (state.stage !== 'choosing') return state;
      if (!Number.isInteger(action.slot) || action.slot < 0 || action.slot >= state.tableSlots) {
        return { ...state, notice: FLOW_NOTICES.invalidSlot };
      }
      if (state.picks.includes(action.slot)) {
        return { ...state, picks: state.picks.filter((p) => p !== action.slot), notice: null };
      }
      if (state.picks.length >= state.cardsToPick) {
        return { ...state, notice: FLOW_NOTICES.tooMany(state.cardsToPick) };
      }
      return { ...state, picks: [...state.picks, action.slot], notice: null };
    }

    case 'CONFIRM_PICKS':
      if (state.stage !== 'choosing') return state;
      if (state.picks.length !== state.cardsToPick) {
        return { ...state, notice: FLOW_NOTICES.notEnough(state.cardsToPick) };
      }
      return { ...state, stage: 'drawing', notice: null, error: null };

    case 'DRAW_OK':
      if (state.stage !== 'drawing') return state;
      return { ...state, stage: 'revealing', cards: action.cards, revealDone: false };

    case 'REVEAL_DONE':
      if (state.stage !== 'revealing') return state;
      return {
        ...state,
        revealDone: true,
        stage: state.interpretation ? 'revealed' : 'interpreting',
      };

    case 'INTERPRET_OK': {
      if (state.stage !== 'revealing' && state.stage !== 'interpreting') return state;
      const cards = action.cards && action.cards.length > 0 ? action.cards : state.cards;
      // Se as cartas ainda estão virando, guarda o texto e espera a revelação terminar.
      const stage = state.stage === 'revealing' && !state.revealDone ? 'revealing' : 'revealed';
      return { ...state, interpretation: action.interpretation, cards, stage };
    }

    case 'SUPPORT':
      return { ...state, stage: 'support', support: action.support, error: null };

    case 'LIMIT':
      return { ...state, stage: 'limit' };

    case 'FAIL':
      if (state.stage === 'revealed' || state.stage === 'support') return state;
      return {
        ...state,
        stage: 'error',
        error: { step: action.step, message: action.message, retryable: action.retryable },
      };

    case 'RETRY': {
      if (state.stage !== 'error' || !state.error?.retryable) return state;
      // Nova tentativa segura: mesmas posições, mesmas cartas, nada é sorteado de novo.
      const stage: FlowStage = state.error.step === 'draw' ? 'drawing' : 'interpreting';
      return { ...state, stage, error: null };
    }

    default:
      return state;
  }
}

/** Quais requisições o painel deve disparar no estado atual. */
export function pendingRequest(state: FlowState): 'draw' | 'interpret' | null {
  if (state.stage === 'drawing') return 'draw';
  if ((state.stage === 'revealing' || state.stage === 'interpreting') && !state.interpretation) return 'interpret';
  return null;
}

/** Etapa exibida no indicador "Pergunta · Cartas · Leitura". */
export function progressStep(stage: FlowStage): 1 | 2 | 3 {
  if (stage === 'ritual' || stage === 'choosing' || stage === 'drawing') return 2;
  return 3;
}
