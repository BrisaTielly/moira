/**
 * Máquina de estados do ritual de prévia (embaralhar → cortar).
 * Efeito IKEA: a visitante participa do preparo do baralho antes da revelação.
 * Lógica de domínio isolada da UI; o componente apenas despacha ações e agenda os "DONE".
 */

export type RitualPhase = 'idle' | 'shuffling' | 'shuffled' | 'cutting' | 'ready';

export interface RitualState {
  phase: RitualPhase;
  /** Quantas vezes o baralho foi embaralhado nesta prévia. */
  shuffles: number;
  /** Mensagem gentil quando a ação não cabe no momento do ritual. */
  error: string | null;
}

export type RitualAction =
  | { type: 'SHUFFLE' }
  | { type: 'SHUFFLE_DONE' }
  | { type: 'CUT' }
  | { type: 'CUT_DONE' }
  | { type: 'RESET' };

export const MAX_SHUFFLES = 7;

export const initialRitualState: RitualState = {
  phase: 'idle',
  shuffles: 0,
  error: null,
};

export const RITUAL_ERRORS = {
  cutBeforeShuffle: 'Embaralhe as cartas antes de cortar o baralho.',
  shuffleAfterCut: 'Seu baralho já foi cortado. Recomece para embaralhar de novo.',
  tooManyShuffles: 'O baralho já recebeu bastante da sua energia. Que tal cortar agora?',
} as const;

export function ritualReducer(state: RitualState, action: RitualAction): RitualState {
  switch (action.type) {
    case 'SHUFFLE': {
      if (state.phase === 'shuffling' || state.phase === 'cutting') return state;
      if (state.phase === 'ready') return { ...state, error: RITUAL_ERRORS.shuffleAfterCut };
      if (state.shuffles >= MAX_SHUFFLES) return { ...state, error: RITUAL_ERRORS.tooManyShuffles };
      return { phase: 'shuffling', shuffles: state.shuffles + 1, error: null };
    }
    case 'SHUFFLE_DONE':
      if (state.phase !== 'shuffling') return state;
      return { ...state, phase: 'shuffled', error: null };
    case 'CUT':
      if (state.phase === 'idle') return { ...state, error: RITUAL_ERRORS.cutBeforeShuffle };
      if (state.phase !== 'shuffled') return state;
      return { ...state, phase: 'cutting', error: null };
    case 'CUT_DONE':
      if (state.phase !== 'cutting') return state;
      return { ...state, phase: 'ready', error: null };
    case 'RESET':
      return initialRitualState;
    default:
      return state;
  }
}

/** Texto de orientação para cada momento do ritual. */
export function ritualHint(phase: RitualPhase): string {
  switch (phase) {
    case 'idle':
      return 'Pense na sua pergunta e toque para embaralhar.';
    case 'shuffling':
      return 'Embaralhando com a sua intenção…';
    case 'shuffled':
      return 'Quando sentir que é a hora, corte o baralho.';
    case 'cutting':
      return 'Cortando o baralho…';
    case 'ready':
      return 'Suas cartas estão prontas para a revelação.';
  }
}
